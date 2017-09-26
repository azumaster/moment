
// 上传文章封面图片
let uploadCover = async (ctx, next) => {
  ctx.response.body = {code: 0, message: '上传成功', data: {imgUrl: ctx.req.file.destination+ctx.req.file.filename} };
};


module.exports = {
  'POST /blog/upload': uploadCover
};