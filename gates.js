function or(a, b) {
    return a || b;
}

function and(a, b) {
    return a && b;
}

function not(a) {
    return !a;
}

function xor(a, b) {
    return (a || b) && !(a && b);
}

module.exports = {
    or,
    and,
    not,
    xor
};
