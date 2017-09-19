/**
 * Node服务端，配合KOA
 * @author: Doden 2017/09/01
 */
const koa = require('koa');
const session = require('koa-session');
const bodyParser = require('koa-bodyparser');
const koaStatic = require('koa-static');
const cors = require('koa-cors');

const config = require('./common/config.js');
const controllers = require('./controllers.js');

const app = new koa();
console.log(__dirname);
app.keys = ['azumar'];
app.use(koaStatic(__dirname+'/.nuxt/dist', {extensions: ['html']}));
app.use(cors());
app.use(bodyParser());
app.use(session(config.session, app));
app.use(controllers());

const server = app.listen(3000, function () {
    console.log('Server is running on '+server.address().port);
});