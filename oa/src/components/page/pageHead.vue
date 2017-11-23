<template>
    <div id="pageHead" style="margin-bottom: 20px;">
        <div class="page-head-back" @click="backToLastPage"><Icon v-if="isBack" type="ios-arrow-back" color="#80848f"></Icon></div>
        <h1 style="padding: 10px 0;">{{title}}</h1>
        <hr>
    </div>
</template>

<script>
    export default {
        name: 'pageHead',
        props: ['title', 'isBack'],
        methods: {
            backToLastPage: function () {
                this.$router.back();
            }
        }
    };
</script>

<style scoped>
    .page-head-back{
        float: left;
        font-size: 30px;
        line-height: 58px;
        margin-right: 10px;
        cursor: pointer;
    }
</style>