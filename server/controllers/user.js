const request = require('request');

const common = require('./../common/common.js');
const User = require('./../schema/user.js');
const Verify = require('./../schema/verify.js');

// 获取用户列表
let getUserList = async (ctx, next) => {

    let response = await new Promise((resolve, reject)=>{
        User.find({}, (err, res)=>{
            if(err){
                reject({code: 102, message: err});
            }else{
                let userList = [];
                res.map((user)=>{
                    userList.push({userId: user._id, userName: user.userName, userMobile: user.userMobile, userType: user.userType, createdAt: user.createdAt, userHead: user.userHead})
                });

                resolve({code: 0, message: '', data: {list: userList}})
            }
        });
    });
    ctx.response.body = response;
};

// 发送验证码
let sendVerify = async (ctx, next) => {
    let uId = ctx.session.user.userId,
        mobile = ctx.request.body.mobile;

    let verifyCode = common.randomSix(),
        verify = new Verify({verifyCode: verifyCode, user: uId});

    // 第一步：判断该用户是否已经发送过验证码了，如果有则更改数据库中的数据，如果没有则创建一条数据

    let verifyData = await new Promise((resolve)=>{
        Verify.find({user: uId}).exec(function (err, res) {
            if(err){
                resolve({code: 102, message: err.message});
            }else{
                resolve({code: 0, message: '', data: res[0]});
            }
        });
    });
    await new Promise((resolve)=>{
        if(verifyData.data){
            Verify.update({user: uId}, {verifyCode: verifyCode}, function(err, res){
                if (err) {
                    resolve({code: 102, message: err});
                }
                else {
                    resolve({code: 0, message:'更新成功'});
                }
            });
        }else{
            verify.save(function (err, res) {
                if(err){
                    resolve({code: 102, message: err});
                }else{
                    resolve({code: 0, message:'创建成功'});
                }
            });
        }
    });

    // 第二步：通过腾讯云服务器，发送短信

    let random = Math.round(Math.random()*99999),
        curTime = Math.floor(Date.now()/1000),
        appId = 1400047070;

    var reqObj = {
        tel: {
            nationcode: 86+'',
            mobile: mobile+''
        },
        tpl_id: Number(52175),
        params: [ verifyCode, 5 ],
        sig: common.getSmsSig(random, curTime, [mobile]),
        time: curTime
    };

   let smsResult = await new Promise((resolve)=>{
       request({
           url: 'https://yun.tim.qq.com/v5/tlssmssvr/sendsms?sdkappid=' + appId + '&random=' + random,
           method: 'POST',
           json: false,
           headers: {
               'Content-Type': 'application/json'
           },
           body: JSON.stringify(reqObj)
       }, (error, response, body) => {
           if (!error && response.statusCode == 200) {
               resolve({code: 0, message: '发送成功'});
           } else if (!error && response.statusCode != 200) {
               var retObj = {
                   code: -1,
                   message: 'http code ' + response.statusCode
               };
               resolve(retObj);
           } else {
               var retObj = {
                   code: -2,
                   message: error.toString()
               };
               resolve(retObj);
           }
       });

   });

    ctx.response.body = smsResult;
};

// 修改基本资料
let editUserBasic = async (ctx, next)=> {
    let data = ctx.request.body,
        uId = ctx.session.user.userId;

    if(data.mobile && data.verify){
        // 第一步：判断该用户的验证码正确
        let valid = await new Promise((resolve)=>{
            Verify.find({user: uId, verifyCode: data.verify}).exec((err, res)=>{
                if(err){
                    resolve({code: 102, message: err.message});
                }else{
                    resolve({code: 0, message: '', data: res[0]});
                }
            });
        });

        // 第二步：验证验证码是否过期
        let timeout = await new Promise((resolve)=>{
            if(valid.data){
                let updatedTime = new Date(valid.data.updatedAt).getTime(),
                    now = new Date().getTime();

                if(now - updatedTime >300000){
                    // 过期
                    resolve({code: 504, message: '验证码已经过期，请重新获取~'});
                } else {
                    // 有效，可以修改手机
                    User.update({_id: uId}, {userName: data.name, userMobile: data.mobile}, function(err, res){
                        if (err) {
                            resolve({code: 102, message: err});
                        }
                        else {
                            ctx.session.user = getCurrentLoginUser(uId).data;
                            resolve(getCurrentLoginUser(uId));
                        }
                    });

                }
            } else{
                resolve({code: 201, message: '验证码无效，请重新获取~'});

            }
        });

        ctx.response.body = timeout;
    } else {

        let updateUserOnlyName = await new Promise((resolve)=>{
            User.update({_id: uId}, {userName: data.name}, function(err, res){
                if (err) {
                    resolve({code: 102, message: err});
                }
                else {
                    ctx.session.user = getCurrentLoginUser(uId).data;
                    resolve(getCurrentLoginUser(uId));
                }
            });
        });

        ctx.response.body = updateUserOnlyName;
    }
};

// 获取当前登录用户的所有信息
let getCurrentLoginUser = async (uId)=>{

    let currentLoginUser = await new Promise((resolve)=>{
        User.find({_id: uId}).exec((err, res)=>{
            if(err) {
                resolve({code: 102, message: err});
            } else {
                let user = {
                    userId: res[0]._id,
                    userName: common.unary(res[0].userName, res[0].userMobile),
                    userMobile: common.unary(res[0].userMobile, '10000000000'),
                    userHead: common.unary(res[0].userHead, ''),
                    userType: common.unary(res[0].userType, 3)
                };

                resolve({code: 0, message:'更新成功', data: user});
            }
        });
    });

    return currentLoginUser;
};

module.exports = {
    'GET /user/getUserList': getUserList,
    'POST /user/sendVerify': sendVerify,
    'POST /user/editUserBasic': editUserBasic
};