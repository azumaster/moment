<template>
    <div id="root">
        <nav-bar></nav-bar>
        <router-view></router-view>
    </div>
</template>

<script>
    import './less/style.less';
    import NavBar from './components/navBar.vue';

    export default {
        name: 'App',
        components: { NavBar },
        mounted: function () {

        }
    };
</script>