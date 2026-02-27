function generateSOP_POS(expr) {
    const variables = [...new Set(expr.match(/[A-Z]/g))].sort();
    const n = variables.length;

    if (n === 0 || n > 3) throw new Error("Expression must contain 1 to 3 variables.");

    // Convert Boolean syntax to JS
    let jsExpr = expr.replace(/\s+/g, "");
    
    // 1. Fix individual variable NOTs (e.g., A' -> !A)
    jsExpr = jsExpr.replace(/([A-Z])'/g, "!$1");

    // 2. Fix Bracket NOTs safely using a depth counter (e.g., (A+B)' -> !(A+B))
    while (jsExpr.includes(")'")) {
        let replaced = false;
        for (let i = 0; i < jsExpr.length - 1; i++) {
            if (jsExpr[i] === ')' && jsExpr[i+1] === "'") {
                let depth = 0;
                let openPos = -1;
                // Trace backward to find the matching '('
                for (let j = i; j >= 0; j--) {
                    if (jsExpr[j] === ')') depth++;
                    if (jsExpr[j] === '(') depth--;
                    if (depth === 0) {
                        openPos = j;
                        break;
                    }
                }
                if (openPos !== -1) {
                    // Rewrite string with the ! moved to the front
                    jsExpr = jsExpr.substring(0, openPos) + "!(" + jsExpr.substring(openPos + 1, i) + ")" + jsExpr.substring(i + 2);
                    replaced = true;
                    break; // Restart the while loop with the newly formatted string
                }
            }
        }
        if (!replaced) break; // Failsafe to absolutely prevent infinite loops
    }

    // 3. Convert remaining operators
    jsExpr = jsExpr
        .replace(/\+/g, "||")
        .replace(/\./g, "&&")
        .replace(/\^/g, "!=");

    const func = new Function(...variables, `return ${jsExpr};`);
    const rows = Math.pow(2, n);
    
    const minterms = [];
    const maxterms = [];
    const minIndices = []; // Added to track Σm numbers
    const maxIndices = []; // Added to track ΠM numbers

    for (let i = 0; i < rows; i++) {
        const values = {};
        const bits = [];

        variables.forEach((v, index) => {
            const bit = (i >> (n - index - 1)) & 1;
            values[v] = Boolean(bit);
            bits.push(bit);
        });

        const result = func(...variables.map(v => values[v]));

        if (result) {
            minIndices.push(i);
            const term = variables.map((v, idx) => bits[idx] === 1 ? v : v + "'").join("");
            minterms.push(term); // Removed extra brackets for standard SOP look
        }

        if (!result) {
            maxIndices.push(i);
            const term = variables.map((v, idx) => bits[idx] === 0 ? v : v + "'").join("+");
            maxterms.push(`(${term})`);
        }
    }

    return {
        sopIndices: minIndices.join(", "),
        posIndices: maxIndices.join(", "),
        SOP: minterms.length ? minterms.join(" + ") : "0",
        POS: maxterms.length ? maxterms.join(" . ") : "1"
    };
}