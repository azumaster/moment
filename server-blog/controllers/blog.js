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
        Type.find({}, function (err, res) {
            if(err){
                reject({code: 102, message: err});
            }else{
                resolve({code: 0, message: '', data: res});
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


// 添加新文章
let addBlog = async (ctx, next) => {
    let title = ctx.request.body.title,
        typeId = ctx.request.body.type,
        content = ctx.request.body.content,
        userId = ctx.session.user.userId;

    let blog = new Blog({blogTitle: title, blogContent: content, user: userId, type: typeId});

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

// 获取文章列表
let getBlogList = async (ctx, next)=>{
    let page = parseInt(ctx.query.page),
        size = parseInt(ctx.query.size),
        skip = size*(page-1);

    let blogList = await new Promise((resolve, reject)=>{
        // Blog.find({}, null, {skip: skip, limit: size}).
        Blog.find({}, null, {skip: skip, limit: size})
            .populate('user').populate('type').exec(function(err, res){
                if(err){
                    reject({code: 102, message: err});
                }else{
                    let blogList = [];
                    res.map((blog)=>{
                        blogList.push({
                            _id: blog._id,
                            blogTitle: blog.blogTitle,
                            blogContent: blog.blogContent,
                            createdAt: blog.createdAt,
                            updatedAt: blog.updatedAt,
                            blogType: blog.type.typeName,
                            author: blog.user.userName
                        });
                    });
                    resolve({code: 0, message: '', data: {current: page, blogList: blogList}});
                }
            });
    });
    await new Promise((resolve, reject)=>{
        Blog.count({}, function (err, res) {
            if(err){
                reject({code: 102, message: err});
            }else{
                blogList.data.total = res;
                resolve('ok');
            }
        });
    });

    ctx.response.body = blogList;
};

module.exports = {
    'POST /blog/type/add': addType,
    'POST /blog/type/edit': editType,
    'GET /blog/type/list': getTypeList,
    'GET /blog/type/one': getTypeById,
    'POST /blog/add': addBlog,
    'GET /blog/list': getBlogList
};