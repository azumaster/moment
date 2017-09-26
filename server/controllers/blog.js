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
              typeList.push({
                name: type.typeName,
                des: type.typeDes,
                _id: type._id,
                createdAt: Common.getDateTime(type.createdAt),
                updatedAt: Common.getDateTime(type.updatedAt)
              });
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


// 添加新文章
let addBlog = async (ctx, next) => {
    let title = ctx.request.body.title,
        typeId = ctx.request.body.type,
        content = ctx.request.body.content,
        des = ctx.request.body.des,
        cover = ctx.request.body.cover,
        userId = ctx.session.user.userId;

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

// 获取文章列表
let getBlogList = async (ctx, next)=>{
    let page = parseInt(ctx.query.page),
        size = parseInt(ctx.query.size),
        skip = size*(page-1);

    let type = ctx.query.type;

    let blogList = await new Promise((resolve)=>{
        let where = {};
        if(type) where.type = type;

        Blog.find(where, null, {skip: skip, limit: size})
            .sort({updatedAt: -1})
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

module.exports = {
    'POST /blog/type/add': addType,
    'POST /blog/type/edit': editType,
    'GET /blog/type/list': getTypeList,
    'GET /blog/type/one': getTypeById,
    'POST /blog/add': addBlog,
    'GET /blog/list': getBlogList
};