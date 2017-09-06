const mongoose = require('./db.js'),
    Schema = mongoose.Schema;

const UserSchema = new Schema({
    userName: {type: String},                        // 用户昵称
    userMobile: {type: String},                      // 注册电话
    userPwd: {type: String},                         // 密码
    userDate: {type: Date, default: Date.now },      // 登录时间
    userHead: {type: String}                         // 用户头像
});


module.exports = mongoose.model('User', UserSchema);