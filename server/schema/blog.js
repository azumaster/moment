const mongoose = require('./db.js'),
    Schema = mongoose.Schema;

const BlogSchema = new Schema({
    blogTitle: {type: String},                           // 博客标题
    blogContent: {type: String},                        // 博客内容
    blogDes: {type: String},                           // 博客概述
    user: {type: Schema.ObjectId, ref: 'User' },      // 关联的用户id
    type: {type: Schema.ObjectId, ref: 'Type'}        // 关联的分类id
}, {
    versionKey: false,
    timestamps: {createdDate: 'createAt'}
});

module.exports = mongoose.model('Blog', BlogSchema);