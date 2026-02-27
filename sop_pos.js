function generateSOP_POS(expr) {
    const variables = [...new Set(expr.match(/[A-Z]/g))].sort();
    const n = variables.length;

    if (n === 0 || n > 3) throw new Error("Expression must contain 1 to 3 variables.");

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