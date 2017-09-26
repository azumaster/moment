<template>
    <div id="blogList">
        <PageHead title="文章列表"></PageHead>
        <div class="page-header">
            <Button type="primary" size="large" icon="ios-plus-outline" @click="addBlog">添加新文章</Button>
        </div>
        <div class="page-table">
            <Table border :columns="blogColumns" :data="blogList"></Table>
            <Page style="margin:20px 0;" :total="paging.total" :current="paging.current" :page-size="params.size" @on-change="changePage"></Page>
        </div>
    </div>
</template>

<script>
    import PageHead from './../../components/page/pageHead.vue';

    export default {
        name: 'blogList',
        components: { PageHead },
        data: function () {
            return {
                params: {page: 1, size: 20},
                paging: {current: 1, total: 0},
                blogList: [],
                blogColumns: [{title: '文章标题', key: 'blogTitle'}, {title: '文章作者', key: 'authorName'},
                    {title: '文章分类', key: 'blogType'}, {title: '最近更新时间', key: 'updatedAt'}, {title: '操作', key: 'action',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', { props: { type: 'primary', shape:'circle', icon: 'edit'}, style: { marginRight: '5px' }, on: { click: () => { this.edit(params.index); }}}, '编辑')
                            ]);
                        }
                    }]
            };
        },
        methods: {
            // 获取文章列表
            getBlogList: function () {
                let _this = this;

                this.$Loading.start();
                this.$ajax({
                    method: 'get',
                    url: '/blog/list',
                    params: _this.params
                }).then(function (res) {
                    if(res.data.code == 0){
                        let blogList = res.data.data.blogList;
                        res.data.data.blogList.map((blog)=>{
                           blog.authorName = blog.author.name;
                        });

                        _this.blogList = blogList;
                        _this.paging.current = res.data.data.current;
                        _this.paging.total = res.data.data.total;
                        _this.$Loading.finish();
                    }else{
                        _this.$Message.error(res.data.message);
                        _this.$Loading.error();
                    }
                }).catch(function () {
                    _this.$Message.error('小Mo开小差去了，请稍后再试~');
                });
            },
            addBlog: function () {
                window.location.href = '/#/blogList/addBlog';
            },
            changePage: function (page) {
                this.params.page = page;
                this.getBlogList();
            },
            edit: function () {
            }
        },
        created: function () {
            this.getBlogList();
        }
    };
</script>