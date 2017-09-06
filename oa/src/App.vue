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