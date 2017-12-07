const Common = require('./../common/common.js');
const Type = require('./../schema/type.js');
const Blog = require('./../schema/blog.js');
const User = require('./../schema/user.js');

// 渲染文章详情
let viewBlog = async (ctx, next) => {
    let id = ctx.request.url.split('/')[ctx.request.url.split('/').length - 1];
    let blogInfo = await new Promise((resolve, reject) => {
        Blog.findById(id, function (err, res) {
            if (err) {
                reject({code: 102, message: err});
            } else {
                let blogInfo = {
                    _id: res._id,
                    blogContent: res.blogContent,
                    blogDes: res.blogDes,
                    blogTitle: res.blogTitle,
                    blogUser: res.user,
                    blogType: res.type,
                    blogPv: res.blogPv?res.blogPv:0,
                    createdAt: Common.getDateTime(res.createdAt).split(' ')[0],
                    updatedAt: Common.getDateTime(res.updatedAt).split(' ')[0]
                };
                resolve(blogInfo);
            }
        });
    });
    await new Promise((resolve, reject) => {
        User.findById(blogInfo.blogUser, function (err, res) {
            if (err) {
                reject({code: 102, message: err});
            } else {
                blogInfo.blogUser = res.userName;
                resolve(blogInfo);
            }
        });
    });
    let blog = await new Promise((resolve, reject) => {
        Type.findById(blogInfo.blogType, function (err, res) {
            if (err) {
                reject({code: 102, message: err});
            } else {
                blogInfo.blogTypeName = res.typeName;
                resolve({code: 0, message: '', data: blogInfo});
            }
        });
    });
    let typeList = await new Promise((resolve, reject) => {
        Type.find({}).sort({'updatedAt': 'desc'}).exec(function (err, res) {
            if (err) {
                reject({code: 102, message: err});
            } else {
                let typeList = [];
                res.map((type) => {
                    if(type.typeName != '默认'){
                        typeList.push({
                            name: type.typeName,
                            des: type.typeDes,
                            _id: type._id
                        });
                    }
                });

                resolve({code: 0, message: '', data: typeList});
            }
        });
    });

    await new Promise((resolve) => {

        if(ctx.session.blogId == blogInfo._id){
            resolve('pvOk');
        }else{
            let pv = blogInfo.blogPv;

            pv++;
            ctx.session.blogId = blogInfo._id;

            Blog.update({_id: blogInfo._id}, {blogPv: pv}, function (err, res) {
                if (err) {
                    resolve({code: 102, message: res});
                } else {
                    resolve({code: 0, message: '成功了!'});
                }
            });
        }
    });

    await ctx.render('blog.jade', {blog: blog, type: typeList});
};

module.exports = {
    'GET /blog/:id': viewBlog
}