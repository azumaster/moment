<template>
    <div class="moment">
        <header class="moment-header">
            <div class="header-logo">MOMENT</div>
            <div class="header-handle">
                <div class="header-head"><img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1504241942644&di=365a8c935f22c0c1329ca108bb2901db&imgtype=0&src=http%3A%2F%2Fdynamic-image.yesky.com%2F300x-%2FuploadImages%2Fupload%2F20140912%2Fupload%2F201409%2Frrxyk4cx5djjpg.jpg"></div>
                <div class="header-info">
                    <p class="header-info-name">{{user.userName}}（{{user.userMobile}}）</p>
                    <p class="header-info-handle">{{userRole[user.userType-1]}} <a href="javascript:;" @click="logout">[ 退出 ]</a></p>
                </div>
            </div>
        </header>
        <main class="moment-body">
            <navMenu></navMenu>
        </main>
        <footer class="moment-footer">2017 &copy; doden.cn</footer>
    </div>
</template>

<script>
    import navMenu from './navMenu.vue';

    export default {
        name: 'container',
        components: {
            navMenu
        },
        data: function () {
            return {
                user: {},
                userRole: ['超级管理员', '部门管理员', '专员']
            };
        },
        methods: {
            // 退出登录
            logout: function () {
                this.$Loading.start();
                this.$ajax({
                    method: 'get',
                    url: '/user/logout'
                }).then(function (res) {
                    if(res.data.code == 0){
                        window.location.href = '/';
                    }else{
                        _this.$Message.error(res.data.message);
                    }
                    _this.$Loading.finish();
                }).catch(function () {
                    _this.$Message.error('小Mo开小差去了，请稍后再试~');
                    _this.$Loading.error();
                });
            }
        },
        computed: {
            getUser () {
                this.user = this.$store.state.user;
                return this.$store.state.user;
            }
        },
        watch: {
            getUser (val) {
                this.user = val;
            }
        }
    };
</script>