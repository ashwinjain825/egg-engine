function generateTruthTable(expr) {
    const variables = [...new Set(expr.match(/[A-Z]/g))].sort();
    const n = variables.length;

    if (n === 0 || n > 3) {
        throw new Error("Expression must contain 1 to 3 variables.");
    }

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

    const table = [];
    const rows = Math.pow(2, n);

    for (let i = 0; i < rows; i++) {

        const row = {};
        const values = {};

        variables.forEach((v, index) => {
            const bit = (i >> (n - index - 1)) & 1;
            row[v] = bit;
            values[v] = Boolean(bit);
        });

        const func = new Function(...variables, `return ${jsExpr};`);
        const result = func(...variables.map(v => values[v]));

        row["F"] = result ? 1 : 0;
        table.push(row);
    }

    return table;
}