<template>
    <div id="addBlog">
        <PageHead title="添加新文章"></PageHead>
        <div class="page-filter">
            <Row>
                <i-col span="10">
                    <Form :model="formItem" :label-width="120">
                        <FormItem label="文章标题">
                            <Input v-model="blogForm.title" maxlength="30" placeholder="请输入文章标题"></Input>
                        </FormItem>
                        <FormItem label="文章分类">
                            <Select v-model="blogForm.category" placeholder="请选择文章分类">
                                <Option v-for="type in typeList" :value="type._id">{{type.typeName}}</Option>
                            </Select>
                        </FormItem>
                    </Form>
                </i-col>
            </Row>

        </div>
        <div class="page-content">
            <textarea id="mde" ref="mde" cols="30" rows="20"></textarea>
        </div>
        <div class="page-footer">
            <Button type="primary" @click="confirmPush" size="large" style="margin-right: 20px;">确定发布</Button>
            <Button size="large" @click="cancelPush">取消</Button>
        </div>
    </div>
</template>

<script>
    import SimpleMDE from 'simplemde';
    import PageHead from './../../components/page/pageHead.vue';

    export default {
        name: 'addBlog',
        components: {
            PageHead: PageHead
        },
        data: function () {
            return {
                blogForm: {
                    title: '',
                    category: ''
                },
                simple: '',
                typeList: ''
            };
        },
        methods: {
            getBlogType: function () {
                let _this = this;

                this.$ajax({
                    method: 'get',
                    url: '/blog/type/list'
                }).then(function (res) {
                    if(res.data.code == 0){
                        _this.typeList = res.data.data;
                    }else{
                        _this.$Message.error(res.data.message);
                    }
                }).catch(function () {
                    _this.$Message.error('小Mo开小差去了，请稍后再试~');
                });
            },
            // 取消发布文章
            cancelPush: function () {
                this.$Modal.confirm({
                    title: '取消发布文章',
                    content: '确定离开本页面，放弃已编辑好的文章？',
                    okText: '取消发布',
                    onOk: function () {
                        window.location.href = '/#/blogList';
                    }
                });
            },
            // 发布文章
            confirmPush: function () {
                let _this = this;
                this.$Modal.confirm({
                    title: '确认发布文章',
                    content: '确定你已经编辑好文章，可以发布了吗？',
                    okText: '确认发布',
                    onOk: function () {
                        let title = _this.blogForm.title,
                            category = _this.blogForm.category,
                            simple = _this.simple.value();

                        this.$ajax({
                            method: 'post',
                            url: '/blog/add',
                            data: {title: title, type: category, content: simple}
                        }).then(function (res) {
                            if(res.data.code == 0){
                                _this.$Message.success('您已添加了新的文章~');
                                window.location.href = '/#/blogList';
                            }else{
                                _this.$Message.error(res.data.message);
                            }
                        }).catch(function () {
                            _this.$Message.error('小Mo开小差去了，请稍后再试~');
                        });
                    }
                });
            }
        },
        created: function () {
            this.getBlogType();
        },
        mounted: function () {
            this.simple = new SimpleMDE({element: document.getElementById('mde')});
        }
    };
</script>