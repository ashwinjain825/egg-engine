// schematic.js

function generateSchematicAST(expr) {
    let s = expr.toUpperCase().replace(/\s+/g, "")
        .replace(/AND/g, "&").replace(/OR/g, "|").replace(/XOR/g, "^").replace(/NOT/g, "!");

    s = s.replace(/([A-Z])'/g, "!$1");

    while (s.includes(")'")) {
        let replaced = false;
        for (let i = 0; i < s.length - 1; i++) {
            if (s[i] === ')' && s[i+1] === "'") {
                let depth = 0, openPos = -1;
                for (let j = i; j >= 0; j--) {
                    if (s[j] === ')') depth++;
                    if (s[j] === '(') depth--;
                    if (depth === 0) { openPos = j; break; }
                }
                if (openPos !== -1) {
                    s = s.substring(0, openPos) + "!(" + s.substring(openPos + 1, i) + ")" + s.substring(i + 2);
                    replaced = true;
                    break;
                }
            }
        }
        if (!replaced) break;
    }

    s = s.replace(/\+/g, "|").replace(/\./g, "&");

    // 2. Tokenize
    let tokens = [];
    for (let i = 0; i < s.length; i++) {
        if (/[A-Z]/.test(s[i])) tokens.push(s[i]);
        else if (/[&|^!()\+]/.test(s[i])) tokens.push(s[i]);
    }

    // 3. Shunting Yard -> Postfix Notation
    let precedence = { '!': 3, '&': 2, '^': 1, '|': 1 };
    let output = [];
    let ops = [];
    
    for (let token of tokens) {
        if (/[A-Z]/.test(token)) {
            output.push(token);
        } else if (token === '(') {
            ops.push(token);
        } else if (token === ')') {
            while (ops.length > 0 && ops[ops.length - 1] !== '(') {
                output.push(ops.pop());
            }
            ops.pop(); // Pop '('
        } else {
            while (ops.length > 0 && ops[ops.length - 1] !== '(' && 
                   precedence[ops[ops.length - 1]] >= precedence[token]) {
                if (token === '!' && ops[ops.length - 1] === '!') break; 
                output.push(ops.pop());
            }
            ops.push(token);
        }
    }
    while (ops.length > 0) output.push(ops.pop());

    // 4. Postfix to Abstract Syntax Tree (AST)
    let stack = [];
    for (let token of output) {
        if (/[A-Z]/.test(token)) {
            stack.push({ type: 'input', value: token });
        } else if (token === '!') {
            let right = stack.pop();
            stack.push({ type: 'gate', value: 'NOT', left: null, right: right });
        } else {
            let right = stack.pop();
            let left = stack.pop();
            let gate = token === '&' ? 'AND' : token === '|' ? 'OR' : 'XOR';
            stack.push({ type: 'gate', value: gate, left: left, right: right });
        }
    }
    
    return stack[0]; // Return the Root Node
}

function renderSchematicHTML(node) {
    if (!node) return "";

    // 1. Base Case: Input Node (A, B, C)
    if (node.type === 'input') {
        return `
        <div class="flex items-center w-full">
            <div class="font-mono text-xs text-[#00ffc2] font-bold bg-[#111] border border-white/10 w-8 h-8 flex items-center justify-center rounded shadow-inner shrink-0 z-10">
                ${node.value}
            </div>
            <div class="h-[2px] bg-gray-600 flex-1 min-w-[24px]"></div>
        </div>`;
    }

    // 2. Unary Gate: NOT
    if (node.value === 'NOT') {
        return `
        <div class="flex items-center w-full">
            ${renderSchematicHTML(node.right)}
            <div class="border-2 border-[#00ffc2] bg-[#00ffc2]/10 text-[#00ffc2] text-[10px] px-2 py-1 rounded-full shadow-[0_0_10px_rgba(0,255,194,0.2)] font-bold relative z-10 shrink-0">
                NOT
                <div class="absolute -right-[6px] top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full border-2 border-[#00ffc2] bg-[#050505]"></div>
            </div>
            <div class="h-[2px] bg-gray-600 flex-1 min-w-[24px] ml-[2px]"></div>
        </div>`;
    }

    // 3. Binary Gates: AND, OR, XOR
    let gateShape = "rounded-r-2xl border-l-0"; // Default to OR curve
    if (node.value === 'AND') gateShape = "rounded-r-md border-l-2"; // Flat back for AND
    if (node.value === 'XOR') gateShape = "rounded-r-2xl border-l-double border-l-[4px]"; // Double line for XOR

    return `
    <div class="flex items-center w-full">
        
        <div class="flex flex-col justify-center flex-1 w-full">
            
            <div class="flex items-center relative py-1 w-full">
                ${renderSchematicHTML(node.left)}
                <div class="absolute right-0 top-1/2 bottom-0 w-[2px] bg-gray-600"></div>
            </div>

            <div class="flex items-center relative py-1 w-full">
                ${renderSchematicHTML(node.right)}
                <div class="absolute right-0 top-0 bottom-1/2 w-[2px] bg-gray-600"></div>
            </div>

        </div>
        
        <div class="flex items-center relative">
            <div class="w-4 h-[2px] bg-gray-600 shrink-0"></div>
            
            <div class="border-2 border-[#00ffc2] bg-[#00ffc2]/10 text-[#00ffc2] text-[10px] w-14 h-12 flex items-center justify-center shadow-[0_0_15px_rgba(0,255,194,0.15)] font-bold ${gateShape} z-10 relative shrink-0">
                ${node.value}
            </div>
            
            <div class="h-[2px] bg-gray-600 flex-1 min-w-[24px]"></div>
        </div>

    </div>`;
}