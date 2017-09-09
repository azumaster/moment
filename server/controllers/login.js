const crypto = require('crypto');
const common = require('./../common/common.js');
const User = require('./../schema/user.js');

// 注册
let register = async (ctx, next) => {
    let mobile = ctx.request.body.mobile,
        pwd = ctx.request.body.pwd;

    let password = getPwd(pwd);


    let user = new User({userMobile: mobile, userPwd: password});

    user.save(function (err, res) {
        if(err){
            console.log(err);
        }else{
            console.log('RES：'+res);
        }
    });

    ctx.response.body = 'bbbbb';
};

// 登录
let login = async (ctx, next) => {
    let mobile = ctx.request.body.mobile,
        pwd = ctx.request.body.pwd;

    await new Promise((resolve, reject) => {
        User.find({userMobile: mobile, userPwd: pwd}, (err, res)=>{
            if(err) {
                ctx.response.body = { code: 103, message: err};
                reject(err);
            } else {
                if(res[0].userMobile){
                    let user = {
                        userId: res[0]._id,
                        userName: common.unary(res[0].userName, res[0].userMobile),
                        userMobile: common.unary(res[0].userMobile, '10000000000'),
                        userHead: common.unary(res[0].userHead, ''),
                        userType: common.unary(res[0].userType, 3)
                    };

                    ctx.session.user = user;
                    ctx.response.body = { code: 0, message: '登录成功', data: user};
                }else{
                    ctx.response.body = { code: 101, message: '用户名或密码错误，请重试~', data: []};
                }
                resolve('OK');
            }
        });
    });
};

// 获取登录状态
let getLogin = (ctx, next) => {

    let user = ctx.session.user;

    if(user){
        ctx.response.body = { code: 0, message: '登录中', data: user};
    }else{
        ctx.response.body = { code: 10086, message: '登录过期', data: {}};
    }
};

// 退出登录
let logout = (ctx, next) => {
    ctx.session.user = null;

    ctx.response.body = {code: 0, message: '成功退出登录', data: {}}
};

// 获得加密密码
let getPwd = (pwd) => {
    let Signture  = crypto.createHmac('sha1', 'azumar');
    Signture.update(pwd);

    return Signture.digest().toString('base64');
};


module.exports = {
    'POST /user/login': login,
    'POST /user/register': register,
    'GET /user/getLogin': getLogin,
    'GET /user/logout': logout
};