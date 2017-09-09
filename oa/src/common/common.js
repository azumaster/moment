(function () {

    let base = {};

    // 基本配置
    base.userRole = ['超级管理员', '部门管理员', '操作专员'];

    // 登录超时
    base.logTimeOut = function (obj) {
        obj.$Modal.error({
            title: '找冻品网 · 提示',
            content: '登录已过期，请重新登录。',
            okText: '我知道啦',
            onOk: function () {
                window.location.href = '/';
            }
        });
    };

    window.base = base;
})();