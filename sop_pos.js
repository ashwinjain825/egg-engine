function generateSOP_POS(expr) {

    // Extract variables
    const variables = [...new Set(expr.match(/[A-Z]/g))].sort();
    const n = variables.length;

    if (n === 0 || n > 3) {
        throw new Error("Expression must contain 1 to 3 variables.");
    }

    // Convert Boolean syntax to JS
    let jsExpr = expr
        .replace(/\s+/g, "")
        .replace(/([A-Z])'/g, "!$1")
        .replace(/\+/g, "||")
        .replace(/\./g, "&&")
        .replace(/\^/g, "!=");

    const func = new Function(...variables, `return ${jsExpr};`);

    const rows = Math.pow(2, n);
    const minterms = [];
    const maxterms = [];

    for (let i = 0; i < rows; i++) {

        const values = {};
        const bits = [];

        variables.forEach((v, index) => {
            const bit = (i >> (n - index - 1)) & 1;
            values[v] = Boolean(bit);
            bits.push(bit);
        });

        const result = func(...variables.map(v => values[v]));

        // For SOP → collect rows where F = 1
        if (result) {
            const term = variables.map((v, idx) =>
                bits[idx] === 1 ? v : v + "'"
            ).join(".");
            minterms.push(`(${term})`);
        }

        // For POS → collect rows where F = 0
        if (!result) {
            const term = variables.map((v, idx) =>
                bits[idx] === 0 ? v : v + "'"
            ).join("+");
            maxterms.push(`(${term})`);
        }
    }

    return {
        SOP: minterms.length ? minterms.join("+") : "0",
        POS: maxterms.length ? maxterms.join(".") : "1"
    };
}