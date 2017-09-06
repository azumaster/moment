const crypto = require('crypto');
const User = require('./../schema/user.js');

// 注册
let register = async (ctx, next) => {
    let mobile = ctx.request.body.mobile,
        pwd = ctx.request.body.pwd;

    let token = 'doden';

    let buf = crypto.randomBytes(16);
    token = buf.toString('hex');
    console.log('token：'+token);

    let Signture  = crypto.createHmac('sha1', token);
    Signture.update(pwd);

    let password = Signture.digest().toString('base64');

    console.log('密文:'+password);

    let user = new User({
        userMobile: mobile,
        userPwd: password
    });


    user.save(function (err, res) {
        if(err){
            console.log(err);
        }else{
            console.log('RES：'+res);
        }
    });



    console.log(ctx.request.body);

    ctx.response.body = 'bbbbb';
};

module.exports = {
    'POST /user/register': register
};