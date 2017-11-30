
// 渲染NovelList
let getNovelList = async (ctx, next) => {

    await ctx.render('novelList.jade', {});
};

module.exports = {
    'GET /novel/list': getNovelList
};