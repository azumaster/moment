
let sessionConfig = {
    key: 'doden',
    maxAge: 86400000,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
};

let apiKey = {
    aMap: '1f34159fd51e60d1fd99400e8b89de93'
};

module.exports = {
    session: sessionConfig,
    apiKey: apiKey
};