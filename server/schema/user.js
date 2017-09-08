const mongoose = require('./db.js'),
    Schema = mongoose.Schema;

const UserSchema = new Schema({
    userName: {type: String, unique: true},                        // 用户昵称
    userMobile: {type: String, unique: true},                      // 注册电话
    userPwd: {type: String},                                       // 密码
    createdDate: {type: Date, default: Date.now },                 // 登录时间
    userType: {type: Number, default: 0 },                            // 成员角色(0：超级管理员，1: 部门管理员, 2: 专员)
    userHead: {type: String}                                       // 用户头像
}, {
    versionKey: false,
    timestamps: {createdDate: 'createTime'}
});

module.exports = mongoose.model('User', UserSchema);