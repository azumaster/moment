// 三目运算
let unary = (value, instance) => {
    return value?value:instance;
};

module.exports = {
    unary: unary
};