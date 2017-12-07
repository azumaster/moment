<template>
    <div id="blogList">
        <PageHead title="文章列表"></PageHead>
        <div class="page-header">
            <Button type="primary" size="large" icon="ios-plus-outline" @click="addBlog">添加新文章</Button>
        </div>
        <div class="page-filter">
            <RadioGroup v-model="statusBtn" type="button" size="large" @on-change="changeTab">
                <Radio label="-1">全部</Radio>
                <Radio label="0">发布中</Radio>
                <Radio label="1">未发布</Radio>
            </RadioGroup>
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
                    {title: '文章分类', key: 'blogType'}, {title: '发布时间', key: 'createdAt', width: 180},
                    {title: '总点击量', key: 'blogPv', width: 90}, {title: '博文状态', width: 90, key: 'status'}, {title: '操作', key: 'action', width: 170,
                        render: (h, params) => {
                            let btns = [];
                            const currentStatus = params.row.blogStatus;
                            switch (currentStatus) {
                                case 0:
                                    // 发布中
                                    if(this.$store.state.user.userType == 1){
                                        btns = [
                                            h('Button', {props: {type: 'info', size: 'small'}, style: { marginRight: '5px'}, on: {click: () => {this.show(params.index);}}}, '查看'),
                                            h('Button', {props: {type: 'info', size: 'small'}, style: { marginRight: '5px'}, on: {click: () => {this.edit(params.index);}}}, '编辑'),
                                            h('Button', {props: {type: 'error', size: 'small'}, on: {click: () => {this.changeStatus(params.index, 1);}}}, '下架')
                                        ];
                                    } else {
                                        btns = [
                                            h('Button', {props: {type: 'info', size: 'small'}, style: { marginRight: '5px'}, on: {click: () => {this.show(params.index);}}}, '查看'),
                                            h('Button', {props: {type: 'info', size: 'small'}, style: { marginRight: '5px'}, on: {click: () => {this.edit(params.index);}}}, '编辑')
                                        ];
                                    }
                                    break;
                                case 1:
                                    // 下架中
                                    if(this.$store.state.user.userType == 1){
                                        btns = [
                                            h('Button', {props: {type: 'info', size: 'small'}, style: { marginRight: '5px'}, on: {click: () => {this.show(params.index);}}}, '查看'),
                                            h('Button', {props: {type: 'info', size: 'small'}, style: { marginRight: '5px'}, on: {click: () => {this.edit(params.index);}}}, '编辑'),
                                            h('Button', {props: {type: 'success', size: 'small'}, on: {click: () => {this.changeStatus(params.index, 0);}}}, '发布')
                                        ];
                                    } else {
                                        btns = [
                                            h('Button', {props: {type: 'info', size: 'small'}, style: { marginRight: '5px'}, on: {click: () => {this.show(params.index);}}}, '查看'),
                                            h('Button', {props: {type: 'info', size: 'small'}, style: { marginRight: '5px'}, on: {click: () => {this.edit(params.index);}}}, '编辑')];
                                    }
                                    break;
                            }

                            return h('div', btns);
                        }
                    }],
                statusBtn: '-1'
            };
        },
        methods: {
            changeTab: function (label) {
                this.statusBtn = label;
                this.getBlogList();
            },
            // 获取文章列表
            getBlogList: function () {
                const _this = this,
                    blogStatus = ['发布中', '未发布'],
                    currentStatus = this.statusBtn;

                if(currentStatus!=-1){
                    this.params.blogStatus = currentStatus;
                }else {
                    delete this.params.blogStatus;
                }

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
                           blog.status = blogStatus[blog.blogStatus];
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
                    _this.$Loading.error();
                });
            },
            // 添加新文章
            addBlog: function () {
                window.location.href = '/#/blog/addBlog';
            },
            // 改变分页
            changePage: function (page) {
                this.params.page = page;
                this.getBlogList();
            },
            // 编辑文章
            edit: function (index) {
                // 获取到id，打开新的路由
                let id = this.blogList[index]._id;
                window.location.href = '/#/blog/editBlog/'+id;
            },
            // 查看文章
            show: function (index) {
                let id = this.blogList[index]._id;
                this.$router.push('/blog/showBlog/'+id);
            },
            // 改变文章状态
            changeStatus: function (index, status) {
                const id = this.blogList[index]._id,
                    _this = this;

                let content, okText;

                if(status == 1){
                    content = '您确认要下架['+this.blogList[index].blogTitle+']？下架后将在前台无法看到该篇文章。';
                    okText = '下架';
                }else{
                    content = '您确认要发布['+this.blogList[index].blogTitle+']？发布后将在前台显示该篇文章。';
                    okText = '发布';
                }

                this.$Modal.confirm({
                    title: '红西柚悄悄提示你？',
                    content: content,
                    okText: okText,
                    loading: true,
                    onOk: function () {
                        this.$ajax({
                            method: 'post',
                            url: ' /blog/blogStatus',
                            data: {id: id, status: status}
                        }).then(function (res) {
                            if(res.data.code == 0){
                                _this.$Message.success('操作成功！');
                                _this.getBlogList();
                            }else{
                                _this.$Message.error(res.data.message);
                            }
                            _this.$Modal.remove();
                        }).catch(function () {
                            _this.$Message.error('小Mo开小差去了，请稍后再试~');
                            _this.$Modal.remove();
                        });
                    }
                });
            }
        },
        created: function () {
            this.getBlogList();
        }
    };
</script>