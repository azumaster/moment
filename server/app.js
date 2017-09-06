/**
 * Node服务端，配合KOA
 * @author: Doden 2017/09/01
 */
const koa = require('koa');
const bodyParser = require('koa-bodyparser');
const koaStatic = require('koa-static');

const controllers = require('./controllers.js');

const app = new koa();

app.use(koaStatic(__dirname, {extensions: ['html']}));
app.use(bodyParser());
app.use(controllers());

const server = app.listen(10366, function () {
    console.log('Server is running on '+server.address().port);
});