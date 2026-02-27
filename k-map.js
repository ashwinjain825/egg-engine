function generateKMap(expr) {

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

    const evaluate = (bits) => {
        const values = {};
        variables.forEach((v, i) => values[v] = Boolean(bits[i]));
        return func(...variables.map(v => values[v])) ? 1 : 0;
    };

    // Gray code order for 2 bits
    const gray2 = [
        [0,0],
        [0,1],
        [1,1],
        [1,0]
    ];

    // ---------- 1 Variable ----------
    if (n === 1) {
        const grid = [
            evaluate([0]),
            evaluate([1])
        ];

        return {
            variables,
            rows: ["0", "1"],
            cols: [],
            kmap: grid
        };
    }

    // ---------- 2 Variables ----------
    if (n === 2) {

        const grid = gray2.map(bits => evaluate(bits));

        return {
            variables,
            rows: ["00","01","11","10"],
            cols: [],
            kmap: grid
        };
    }

    // ---------- 3 Variables ----------
    if (n === 3) {

        // A → rows
        // BC → columns (Gray order)

        const rows = ["0","1"];
        const cols = ["00","01","11","10"];

        const grid = [];

        for (let a = 0; a <= 1; a++) {
            const row = [];
            for (let g of gray2) {
                row.push(evaluate([a, g[0], g[1]]));
            }
            grid.push(row);
        }

        return {
            variables,
            rows,
            cols,
            kmap: grid
        };
    }
}