const mongoose = require('./db.js'),
    Schema = mongoose.Schema;

const VerifySchema = new Schema({
    verifyCode: {type: Number},
    user: {type: Schema.ObjectId, ref: 'User' }      // 关联的用户id
}, {
    versionKey: false,
    timestamps: {createdDate: 'createAt'}
});

module.exports = mongoose.model('Verify', VerifySchema);