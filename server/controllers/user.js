const common = require('./../common/common.js');
const User = require('./../schema/user.js');

// 获取用户列表
let getUserList = (ctx, next) => {

    User.find({}, (err, res)=>{
        if(err) {
            ctx.response.body = { code: 103, message: err};
        } else {
            ctx.response.body = { code: 0, message: '登录成功', data: {}};
        }
    });
};

module.exports = {
    'GET /user/getUserList': getUserList
};