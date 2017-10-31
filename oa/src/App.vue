<template>
    <section v-if="isLogin"><Container /></section>
    <section v-else><Login /></section>
</template>

<script>
    import './less/style.less';
    import Container from './components/container.vue';
    import Login from './components/login.vue';

    export default {
        name: 'app',
        components: {Container, Login},
        data () {
            return {
                isLogin: true
            };
        },
        methods: {
            // 获取登录情况
            getLogin: function () {
                let _this = this;

                this.$Loading.start();
                this.$ajax({
                    method: 'get',
                    url: '/user/getLogin'
                }).then(function (res) {
                    if(res.data.code == 0){
                        _this.isLogin = true;
                        _this.$store.state.user = res.data.data;
                    }
                    _this.$Loading.finish();
                }).catch(function () {
                    _this.$Message.error('小Mo开小差去了，请稍后再试~');
                    _this.$Loading.error();
                });
            }
        },
        created: function () {
            this.getLogin();
        },
        /**
         * 监听vuex的store中的state,需要通过computed获取到state的值
         * 再通过watch去改变vue组件中的data的值
         */
        computed: {
            getIsLogin () {
                return this.$store.state.isLogin;
            }
        },
        watch: {
            getIsLogin(val) {
                this.isLogin = val;
            }
        }
    };
</script>