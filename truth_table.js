function truthTable(expr) {
    const variables = [...new Set(expr.match(/[A-Z]/g))].sort();
    const n = variables.length;

    if (n === 0 || n > 3) {
        throw new Error("Expression must contain 1 to 3 variables.");
    }

    let jsExpr = expr
        .replace(/\s+/g, "")
        .replace(/([A-Z])'/g, "!$1")   // A' → !A
        .replace(/\+/g, "||")          // + → OR
        .replace(/\./g, "&&")          // . → AND
        .replace(/\^/g, "!=");         // ^ → XOR

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