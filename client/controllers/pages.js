const Common = require('./../common/common.js');
const Type = require('./../schema/type.js');
const Blog = require('./../schema/blog.js');
const User = require('./../schema/user.js');

// 渲染首页
let viewHome = async (ctx, next) => {
  // 获取分类列表
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
  await ctx.render('index.jade', {type: typeList});
};

// 获取文章列表
let getBlogList = async (ctx, next) => {
    let page = parseInt(ctx.query.page),
    size = parseInt(ctx.query.size),
    skip = size*(page-1);

  let type = ctx.query.type;
  let where = {};
  if(type) where.type = type;

  let blogList = await new Promise((resolve)=>{

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
    Blog.count(where, function (err, res) {

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
}

// 渲染文章详情
let viewBlog = async (ctx, next) => {
  let id = ctx.request.url.split('/')[ctx.request.url.split('/').length-1];
  let blogInfo = await new Promise((resolve, reject)=> {
    Blog.findById(id, function (err, res) {
      if(err){
        reject({code: 102, message: err});
      }else {
        let blogInfo = {
          _id: res._id,
          blogContent: res.blogContent,
          blogTitle: res.blogTitle,
          blogUser: res.user,
          blogType: res.type,
          createdAt: Common.getDateTime(res.createdAt).split(' ')[0],
          updatedAt: Common.getDateTime(res.updatedAt).split(' ')[0]
        };

        resolve(blogInfo);
      }
    });
  });
  await new Promise((resolve, reject) => {
    User.findById(blogInfo.blogUser, function (err, res) {
      if(err) {
        reject({code: 102, message: err});
      } else {
        blogInfo.blogUser = res.userName;
        resolve(blogInfo);
      }
    });
  });
  let blog = await new Promise((resolve, reject) => {
    Type.findById(blogInfo.blogType, function (err, res) {
      if(err) {
        reject({code: 102, message: err});
      } else {
        blogInfo.blogType = res.typeName;
        resolve({code: 0, message: '', data: blogInfo});
      }
    });
  });
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
  await ctx.render('blog.jade', {blog: blog, type: typeList });
};

module.exports = {
  'GET /blog/list': getBlogList,
  'GET /blog/:id': viewBlog,
  'GET /': viewHome,
};