
const Common = require('./../common/common.js');
const Type = require('./../schema/type.js');
const Blog = require('./../schema/blog.js');
const User = require('./../schema/user.js');

// 渲染首页
let viewHome = async (ctx, next) => {

    const crosImgUrl = '//'+ctx.request.header.host.split(':')[0]+':10366',
        typeId = ctx.request.url.split('/')[1];
    let where = {blogStatus: 0};
    if(typeId)  where.type = typeId;

    // 获取分类列表
    let typeList = await new Promise((resolve) => {
        Type.find({}).sort({'createdAt': 'desc'}).exec(function (err, res) {
            if (err) {
                resolve(err);
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
                resolve(typeList);
            }
        });
    });


    // 获取博客列表
    let blogList = await new Promise((resolve, reject)=>{
        Blog.find(where, null, {skip: 0, limit: 5})
            .sort({createdAt: -1})
            .populate('user').populate('type').exec(function (err, res) {
                if (err) {
                    resolve(err);
                } else {
                    let blogList = [];
                    res.map((blog) => {
                        blogList.push({
                            _id: blog._id,
                            blogTitle: blog.blogTitle,
                            blogContent: blog.blogContent,
                            blogDes: blog.blogDes,
                            createdAt: Common.getDateTime(blog.createdAt).split(' ')[0],
                            blogCover: crosImgUrl+blog.blogCover,
                            blogType: blog.type.typeName,
                            author: {name: blog.user.userName, head: crosImgUrl+blog.user.userHead}
                        });
                    });
                    resolve({list: blogList});
                }
            });
    });
    // 统计博文的总数
    await new Promise((resolve, reject) => {
        Blog.count(where, function (err, res) {
            if (err) {
                resolve({code: 102, message: err.message});
            } else {
                if (blogList.list.length > 0) blogList.total = res;
                else blogList.total = 0;
                blogList.lastPage = Math.ceil(blogList.total / 5);
                blogList.current = 1;
                resolve('ok');
            }
        });
    });

    await ctx.render('index.jade', {type: typeList, blog: blogList});
};

// 异步获取文章列表，需要拼接在首页渲染了之后的页面之上
let getBlogList = async (ctx, next) => {

    const crosImgUrl = '//'+ctx.request.header.host.split(':')[0]+':10366';

    let page = parseInt(ctx.query.page),
        size = parseInt(ctx.query.size),
        skip = size * (page - 1);

    let type = ctx.query.type;
    let where = {blogStatus: 0};
    if (type) where.type = type;

    let blogList = await new Promise((resolve) => {

        Blog.find(where, null, {skip: skip, limit: size})
            .sort({createdAt: -1})
            .populate('user').populate('type').exec(function (err, res) {
            if (err) {
                resolve({code: 0, message: err.message, data: {current: page, blogList: []}});
            } else {
                let blogList = [];
                res.map((blog) => {
                    blogList.push({
                        _id: blog._id,
                        blogTitle: blog.blogTitle,
                        blogContent: blog.blogContent,
                        blogDes: blog.blogDes,
                        createdAt: Common.getDateTime(blog.createdAt).split(' ')[0],
                        blogCover: crosImgUrl+blog.blogCover,
                        blogType: blog.type.typeName,
                        author: {name: blog.user.userName, head: crosImgUrl+blog.user.userHead}
                    });
                });
                resolve({code: 0, message: '', data: {current: page, blogList: blogList}});
            }
        });
    });
    await new Promise((resolve, reject) => {
        Blog.count(where, function (err, res) {

            if (err) {
                resolve({code: 102, message: err.message});
            } else {
                if (blogList.data.blogList.length > 0) blogList.data.total = res;
                else blogList.data.total = 0;
                blogList.data.lastPage = Math.ceil(blogList.data.total / size);
                resolve('ok');
            }
        });
    });

    ctx.response.body = blogList;
};

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
                blogInfo.blogType = res.typeName;
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
    'GET /blog/list': getBlogList,
    'GET /blog/:id': viewBlog,
    'GET /:id': viewHome,
    'GET /': viewHome,
};