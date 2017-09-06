<template>
    <div class="moment">
        <header class="moment-header">
            <div class="header-logo">MOMENT</div>
            <div class="header-handle">
                <div class="header-head"><img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1504241942644&di=365a8c935f22c0c1329ca108bb2901db&imgtype=0&src=http%3A%2F%2Fdynamic-image.yesky.com%2F300x-%2FuploadImages%2Fupload%2F20140912%2Fupload%2F201409%2Frrxyk4cx5djjpg.jpg"></div>
                <div class="header-info">
                    <p class="header-info-name">魏华东（18581510285）</p>
                    <p class="header-info-handle">超级管理员 <a href="#">[ 退出 ]</a></p>
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
        }
    };
</script>