
let viewHome = async (ctx, next) => {
    await ctx.render('index.jade', {})
}


module.exports = {
    'GET /': viewHome
}