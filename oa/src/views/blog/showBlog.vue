<template>
    <div id="showBlog">
        <pageHead :title="blog.blogTitle" isBack="true"></pageHead>
        <div id="blogContent" class="blog-content" v-html="blog.blogContent"></div>
    </div>
</template>

<script>
    import PageHead from './../../components/page/pageHead.vue';

    export default {
        name: 'showBlog',
        components: { PageHead },
        data: function () {
            return {
                blogId: '',
                blog: {}
            };
        },
        methods: {
            getCurrentBlog: function () {
                let _this = this;
                this.$Loading.start();

                this.$ajax({
                    method: 'get',
                    url: '/blog/getBlogById',
                    params: {id: _this.blogId}
                }).then(function (res) {
                    if(res.data.code == 0){
                        let blog = res.data.data;

                        _this.blog = blog;
                        _this.$Loading.finish();
                    }else{
                        _this.$Message.error(res.data.message);
                        _this.$Loading.error();
                    }
                }).catch(function () {
                    _this.$Message.error('小Mo开小差去了，请稍后再试~');
                    _this.$Loading.error();
                });
            }
        },
        created: function () {
            this.blogId = this.$route.params.id;
            this.getCurrentBlog();
        }
    };
</script>