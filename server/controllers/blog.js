const Common = require('./../common/common.js');

const Type = require('./../schema/type.js');
const Blog = require('./../schema/blog.js');

// 添加新文章分类
let addType = async (ctx, next) => {
    let name = ctx.request.body.name,
        des = ctx.request.body.des;

    let type = new Type({typeName: name, typeDes: des});

    let typeRes = await new Promise((resolve, reject)=>{
        type.save(function (err, res) {
            if(err){
                reject({code: 102, message: err});
            }else{
                resolve({code: 0, message:'添加成功。', data: {}});
            }
        });
    });

    ctx.response.body = typeRes;
};

// 获取文章分类列表
let getTypeList = async (ctx, next) => {

    let typeList = await new Promise((resolve, reject)=>{
        Type.find({}).sort({'updatedAt': 'desc'}).exec(function (err, res) {
          if(err){
            reject({code: 102, message: err});
          }else{
            let typeList = [];
            res.map((type)=>{

                let typeListInfo = {
                    name: type.typeName,
                    des: type.typeDes,
                    _id: type._id,
                    createdAt: Common.getDateTime(type.createdAt),
                    updatedAt: Common.getDateTime(type.updatedAt)
                };

                if(type.typeName != '默认'){
                    typeList.push(typeListInfo);
                } else {
                    typeList.unshift(typeListInfo);
                }

            });

            resolve({code: 0, message: '', data: typeList});
          }
        });
    });

    ctx.response.body = typeList;
};

// 根据id获取文章分类
let getTypeById = async (ctx, next) => {
    let _id = ctx.query.id;

    let type = await new Promise((resolve, reject)=>{
        Type.findById(_id, function (err, res) {
            if(err){
                reject({code: 102, message: err});
            }else{
                resolve({code: 0, message: '', data: res});
            }
        });
    });

    ctx.response.body = type;
};

// 修改文章分类
let editType = async (ctx, next) => {
    let id = ctx.request.body._id,
        name = ctx.request.body.typeName,
        des = ctx.request.body.typeDes;

    let typeRes = await new Promise((resolve, reject)=>{
        Type.update({_id: id}, {$set : {typeName : name, typeDes : des}}, function (err, res) {
            if(err){
                reject({code: 102, message: err});
            }else{
                resolve({code: 0, message:'修改成功。', data: {}});
            }
        });
    });

    ctx.response.body = typeRes;
};

// 删除文章分类
let delTypeById = async (ctx, next) => {
    const typeId = ctx.request.body.id;

    // 查询有这个分类的博客
    let blogs = await new Promise( resolve => {
        Blog.find({type: typeId}, (err, res)=>{
            if(err) resolve({code: 102, message: err});
            else resolve(res);
        });
    });

    let defaultTypeId = await new Promise( resolve => {
        Type.findOne({typeName: '默认'}, (err, res)=>{
            if(err) reject({code: 102, message: err});
            else resolve(res._id);
        });
    });

    // 将这些博客的分类设置成默认
    await new Promise( resolve => {
        if(blogs.length>0){
            blogs.map((blog, index)=>{
                Blog.update({_id: blog._id}, {$set : {type : defaultTypeId}}, (err, res)=>{
                    if(err) reject({code: 102, message: err});
                    else resolve(res);
                });
            });
        }else {
            resolve('ok');
        }

    });

    let removeType = await new Promise( resolve => {
        Type.remove({_id: typeId}, (err, res)=>{
            if(err) resolve({code: 102, message: err});
            else resolve({code: 0, message: 'ok'});
        });
    });

    ctx.response.body = removeType;
};

// 添加新文章
let addBlog = async (ctx, next) => {
    let title = ctx.request.body.title,
        typeId = ctx.request.body.type,
        content = ctx.request.body.content,
        des = ctx.request.body.des,
        cover = ctx.request.body.cover,
        userId = ctx.session.user.userId;

    if(cover){
        cover = cover.slice(1, cover.length);
    }

    if(!userId){
        ctx.response.body({code: 308, message: '登录超时'});
        return;
    }

    let blog = new Blog({blogTitle: title, blogContent: content, blogDes: des, user: userId, type: typeId, blogCover: cover});

    let blogRes = await new Promise((resolve, reject)=>{
        blog.save(function (err, res) {
            if(err){
                reject({code: 102, message: err});
            }else{
                resolve({code: 0, message:'添加成功。', data: {}});
            }
        });
    });

    ctx.response.body = blogRes;
};

// 修改文章内容
let editBlog = async (ctx, next) => {
    let title = ctx.request.body.title,
        typeId = ctx.request.body.type,
        content = ctx.request.body.content,
        des = ctx.request.body.des,
        cover = ctx.request.body.cover,
        blogId = ctx.request.body.id;

    cover = cover.splice(1, cover.length);

    let blogEdit = await new Promise((resolve, reject)=>{
        Blog.update({_id: blogId}, {$set : {blogTitle : title, type : typeId, blogContent: content, blogDes: des, blogCover: cover, blogStatus: 1}}, function (err, res) {
            if(err){
                reject({code: 102, message: err});
            }else{
                resolve({code: 0, message:'操作成功', data: {}});
            }
        });
    });

    ctx.response.body = blogEdit;
};

// 获取文章列表
let getBlogList = async (ctx, next)=>{
    let blogStatus = ctx.query.blogStatus,
        page = parseInt(ctx.query.page),
        size = parseInt(ctx.query.size),
        skip = size*(page-1);

    let type = ctx.query.type;

    let blogList = await new Promise((resolve)=>{
        let where = {};
        if(type) where.type = type;
        if(blogStatus) where.blogStatus = blogStatus;

        Blog.find(where, null, {skip: skip, limit: size})
            .sort({createdAt: -1})
            .populate('user').populate('type').exec(function(err, res){
                if(err){
                    resolve({code: 0, message: err.message, data: {current: page, blogList: []}});
                }else{
                    let blogList = [];
                    res.map((blog)=>{
                        blogList.push({
                            _id: blog._id,
                            blogTitle: blog.blogTitle,
                            blogContent: blog.blogContent,
                            blogDes: blog.blogDes,
                            blogPv: blog.blogPv,
                            blogStatus: blog.blogStatus,
                            createdAt: Common.getDateTime(blog.createdAt),
                            updatedAt: Common.getDateTime(blog.updatedAt),
                            blogCover: blog.blogCover,
                            blogType: blog.type.typeName,
                            author: {name: blog.user.userName, head: blog.user.userHead}
                        });
                    });
                    resolve({code: 0, message: '', data: {current: page, blogList: blogList}});
                }
            });
    });
    await new Promise((resolve, reject)=>{
        Blog.count({}, function (err, res) {

            if(err){
                resolve({code: 102, message: err.message});
            }else{
                if(blogList.data.blogList.length>0) blogList.data.total = res;
                else blogList.data.total = 0;
                blogList.data.lastPage = Math.ceil(blogList.data.total/size);
                resolve('ok');
            }
        });
    });

    ctx.response.body = blogList;
};

// 根据id获得文章
let getBlogById = async (ctx, next)=>{
    let id = ctx.query.id;

    let blog = await new Promise((resolve)=>{

        Blog.findById(id).populate('user').populate('type').exec(function (err, res) {
            if (err) {
                reject({code: 102, message: err});
            } else {
                let blogInfo = {
                    _id: res._id,
                    blogContent: res.blogContent,
                    blogDes: res.blogDes,
                    blogTitle: res.blogTitle,
                    blogUser: {id: res.user._id, name: res.user.userName},
                    blogType: {id: res.type._id, name: res.type.typeName},
                    blogPv: res.blogPv?res.blogPv:0,
                    blogCover: res.blogCover,
                    createdAt: Common.getDateTime(res.createdAt).split(' ')[0],
                    updatedAt: Common.getDateTime(res.updatedAt).split(' ')[0]
                };

                resolve({code: 0, message: '', data: blogInfo});
            }
        });
    });

    ctx.response.body = blog;
};

// 改变文章状态
let changeBlogStatus = async (ctx, next)=>{
    const id = ctx.request.body.id,
        status = ctx.request.body.status;

    let changeStatus = await new Promise( resolve => {
        Blog.update({_id: id}, {$set : {blogStatus : status}}, (err, res)=>{
            if(err) resolve({code: 102, message: err});
            else resolve({code: 0, message: 'ok'});
        });
    });

    ctx.response.body = changeStatus;

};

module.exports = {
    'POST /blog/type/add': addType,
    'POST /blog/type/edit': editType,
    'GET /blog/type/list': getTypeList,
    'GET /blog/type/one': getTypeById,
    'POST /blog/type/del': delTypeById,
    'POST /blog/add': addBlog,
    'GET /blog/list': getBlogList,
    'GET /blog/getBlogById': getBlogById,
    'POST /blog/blogStatus': changeBlogStatus,
    'POST /blog/edit': editBlog
};