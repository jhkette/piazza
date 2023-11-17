

// https://kettan007.medium.com/json-web-token-jwt-in-node-js-implementing-using-refresh-token-90e24e046cf8

function generateAccessToken(payload, ip_address) {
    return new Promise(function (resolve, reject) {
    var tokens = {};
    //generating acess token
    tokens.accessToken = jwt.sign(payload, Constant.ACCESS_TOKEN_SECRET, { expiresIn: '5m' });
    //generating refresh token
    tokens.refreshToken = jwt.sign(payload, Constant.ACCESS_TOKEN_SECRET, { expiresIn: '6h' });
    resolve(tokens);
    })
};