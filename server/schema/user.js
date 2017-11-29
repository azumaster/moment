const mongoose = require('./db.js'),
    Schema = mongoose.Schema;

const UserSchema = new Schema({
    userName: {type: String, unique: true},                        // 用户昵称
    userMobile: {type: String, unique: true},                      // 注册电话
    userPwd: {type: String},                                       // 密码
    userType: {type: Number, default: 1 },                         // 成员角色(1：超级管理员，2: 部门管理员, 3: 专员)
    userStatus: {type: Number, default: 1},                        // 成员状态（1：正常，2：已拉黑）
    userHead: {type: String, default: '/dist/img/userHead/default.jpg'}                                       // 用户头像
}, {
    versionKey: false,
    timestamps: {createdDate: 'createAt'}
});

module.exports = mongoose.model('User', UserSchema);