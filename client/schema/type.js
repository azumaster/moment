const mongoose = require('./db.js'),
    Schema = mongoose.Schema;

const TypeSchema = new Schema({
    typeName: {type: String, unique: true},                        // 分类名字
    typeDes: {type: String, unique: true}                          // 分类描述
}, {
    versionKey: false,
    timestamps: {createdDate: 'createAt'}
});

module.exports = mongoose.model('Type', TypeSchema);