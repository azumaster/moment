const common = require('./../common/common.js');
const User = require('./../schema/user.js');

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

module.exports = {
    'GET /user/getUserList': getUserList
};