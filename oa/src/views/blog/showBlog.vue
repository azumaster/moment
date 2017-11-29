<template>
    <div id="showBlog">
        <pageHead :title="blog.blogTitle" isBack="true"></pageHead>
        <div class="blog-assets">
            <p><Icon type="person"></Icon>{{blog.blogUser.name}}</p> |
            <p><Icon type="ios-keypad"></Icon>{{blog.blogType.name}}</p> |
            <p><Icon type="ios-calendar-outline"></Icon>{{blog.createdAt}}</p> |
            <p><Icon type="ios-eye"></Icon>{{blog.blogPv}}</p>
        </div>
        <div id="blogContent" class="blog-content markdown-body" v-html="blog.marked"></div>
    </div>
</template>

<script>
    import Marked from 'marked';
    import PageHead from './../../components/page/pageHead.vue';

    export default {
        name: 'showBlog',
        components: { PageHead },
        data: function () {
            return {
                blogId: '',
                blog: { blogUser: {}, blogType: {}}
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
                        let blogStr = blog.blogContent;
                        blogStr = blogStr.replace(/&amp;gt;/g, '>');
                        blogStr = blogStr.replace(/&amp;lt;/g, '< ');

                        blog.marked = Marked(blogStr);

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

<style scoped>@import '~github-markdown-css';</style>