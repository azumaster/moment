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
                isLogin: false
            };
        },
        /**
         * 监听vuex的store中的state,需要通过computed生命周期获取到state的值
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
<style>
    .room_img{
     width: 320px;
     height: 240px;
     margin-right: 10px;
     position: absolute;
     overflow: hidden;
   }
</style>