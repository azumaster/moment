const fs = require('fs');

//
function addMapping(router, mapping) {
    for (var url in mapping) {
        if (url.startsWith('GET ')) {
            // 处理GET请求
            var path = url.substring(4);
            router.get(path, mapping[url]);
        } else if (url.startsWith('POST ')) {
            var path = url.substring(5);
          router.post(path, mapping[url]);
        } else {
            console.log(`invalid URL: ${url}`);
        }
    }
}

/**
 * 决定所要遍历的js文件，并通过addMapping加入路由
 * @param router
 */
function addControllers(router) {
    let files = fs.readdirSync(__dirname + '/controllers');

    // 过滤文件后缀，只遍历js文件
    let js_files = files.filter((f) => {
        return f.endsWith('.js');
    });

    for (let f of js_files) {
        let mapping = require(__dirname + '/controllers/' + f);
        addMapping(router, mapping);
    }
}

module.exports = function (dir) {
    let controllers_dir = dir || 'controllers', // 如果不传参数，扫描目录默认为'controllers'
        router = require('koa-router')();

    addControllers(router, controllers_dir);
    return router.routes();
};