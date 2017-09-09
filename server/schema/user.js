const mongoose = require('./db.js'),
    Schema = mongoose.Schema;

const UserSchema = new Schema({
    userName: {type: String, unique: true},                        // 用户昵称
    userMobile: {type: String, unique: true},                      // 注册电话
    userPwd: {type: String},                                       // 密码
    userType: {type: Number, default: 1 },                         // 成员角色(1：超级管理员，2: 部门管理员, 3: 专员)
    userHead: {type: String}                                       // 用户头像
}, {
    versionKey: false,
    timestamps: {createdDate: 'createAt'}
});

module.exports = mongoose.model('User', UserSchema);