
let sessionConfig = {
    key: 'doden',
    maxAge: 86400000,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
};

module.exports = {
    session: sessionConfig
};