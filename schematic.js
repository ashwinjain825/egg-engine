// schematic.js

function generateSchematicAST(expr) {
    // 1. Standardize syntax
    let s = expr.toUpperCase()
        .replace(/\s+/g, "")
        .replace(/AND/g, "&").replace(/OR/g, "|").replace(/XOR/g, "^").replace(/NOT/g, "!")
        .replace(/([A-Z])'/g, "!$1") // Convert A' to !A
        .replace(/\+/g, "|").replace(/\./g, "&");

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

    // Base Case: Input Node (A, B, C)
    if (node.type === 'input') {
        return `
        <div class="flex items-center">
            <div class="font-mono text-xs text-[#00ffc2] font-bold bg-white/5 border border-white/10 px-2 py-1 rounded shadow-inner">
                ${node.value}
            </div>
            <div class="w-4 h-[2px] bg-gray-600"></div>
        </div>`;
    }

    // Unary Gate: NOT
    if (node.value === 'NOT') {
        return `
        <div class="flex items-center">
            ${renderSchematicHTML(node.right)}
            <div class="border-2 border-[#00ffc2] bg-[#00ffc2]/10 text-[#00ffc2] text-[9px] px-2 py-1 rounded-full shadow-[0_0_10px_rgba(0,255,194,0.2)] font-bold relative">
                NOT
                <div class="absolute -right-[6px] top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full border-2 border-[#00ffc2] bg-black"></div>
            </div>
            <div class="w-4 h-[2px] bg-gray-600 ml-[2px]"></div>
        </div>`;
    }

    // Binary Gates: AND, OR, XOR
    let gateShape = "rounded-r-2xl border-l-0"; // Standard OR/AND curve
    if (node.value === 'AND') gateShape = "rounded-r-md border-l-2"; // Flatter back for AND
    if (node.value === 'XOR') gateShape = "rounded-r-2xl border-l-double border-l-[4px]"; // Double back for XOR

    return `
    <div class="flex items-center">
        <div class="flex flex-col justify-center gap-1 border-r-2 border-gray-600 pr-2 py-2">
            ${renderSchematicHTML(node.left)}
            ${renderSchematicHTML(node.right)}
        </div>
        <div class="flex items-center">
            <div class="w-4 h-[2px] bg-gray-600"></div>
            <div class="border-2 border-[#00ffc2] bg-[#00ffc2]/10 text-[#00ffc2] text-[10px] w-12 h-10 flex items-center justify-center shadow-[0_0_15px_rgba(0,255,194,0.15)] font-bold ${gateShape}">
                ${node.value}
            </div>
            <div class="w-4 h-[2px] bg-gray-600"></div>
        </div>
    </div>`;
}