/**
 * Node服务端，配合KOA
 * @author: Doden 2017/09/01
 */
const koa = require('koa');
const session = require('koa-session');
const bodyParser = require('koa-bodyparser');
const koaStatic = require('koa-static');

const config = require('./common/config.js');
const controllers = require('./controllers.js');

const app = new koa();
app.keys = ['azumar'];
app.use(koaStatic(__dirname, {extensions: ['html']}));
app.use(bodyParser());
app.use(session(config.session, app));
app.use(controllers());

const server = app.listen(10366, function () {
    console.log('Server is running on '+server.address().port);
});