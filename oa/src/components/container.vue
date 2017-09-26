<template>
    <div class="moment">
        <header class="moment-header">
            <div class="header-logo"><img src="/dist/img/logo-white.png"></div>
            <div class="header-handle">
                <div class="header-head"><img :src="user.userHead"></div>
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