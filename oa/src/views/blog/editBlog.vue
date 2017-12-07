<template>
    <div id="editBlog">
        <PageHead title="编辑文章" isBack="true"></PageHead>
        <div class="page-filter">
            <Row type="flex" justify="space-between">
                <i-col span="10">
                    <Form :model="blogForm" :label-width="120">
                        <FormItem label="文章标题">
                            <Input v-model="blogForm.title" maxlength="150" placeholder="请输入文章标题"></Input>
                        </FormItem>
                        <FormItem label="文章分类">
                            <Select label="默认" v-model="blogForm.category" placeholder="请选择文章分类">
                                <Option v-for="type in typeList" :value="type._id" :key="type._id">{{type.name}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="文章概述">
                            <Input v-model="blogForm.des" type="textarea" maxlength="150" :autosize="{minRows: 3,maxRows: 3}" placeholder="请输入文章概述"></Input>
                            <span>{{blogForm.des.length}} / 150</span>
                        </FormItem>
                        <FormItem label="文章封面">
                            <Upload ref="upload" accept="image/*" :format="['jpg', 'jpeg', 'png']" type="drag" action="/blog/upload" :on-success="handleSuccess"
                                    :show-upload-list="false" :max-size="2048" :on-format-error="handleFormat" :on-exceeded-size="handleSize"
                                    :before-upload="handleBefore">
                                <div style="padding: 20px 0; border-color: #dddee1">
                                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                                    <p>点击或将文件拖拽到这里上传</p>
                                </div>
                            </Upload>
                            <Alert type="warning" show-icon style="margin-top: 20px;">推荐使用 500 * 250 分辨率的 .jpg 后缀的图片；图片大小不得超过2M。</Alert>
                        </FormItem>
                    </Form>
                </i-col>
                <i-col span="10">
                    <Card>
                        <p slot="title">文章封面图片预览</p>
                        <div class="page-img-preview">
                            <img :src="imgUrl">
                        </div>
                    </Card>
                </i-col>
            </Row>

        </div>
        <div class="page-content">
            <textarea id="mde" ref="mde" cols="30" rows="20"></textarea>
        </div>
        <div class="page-footer">
            <Button type="primary" @click="confirmPush" size="large" style="margin-right: 20px;">确定修改</Button>
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
                currentBlog: {},
                blogForm: {
                    title: '',
                    category: '',
                    des: ''
                },
                imgUrl: '/dist/img/blogCover/default.jpg',
                simple: '',
                typeList: ''
            };
        },
        methods: {
            // 获取当前文章
            getCurrentBlog: function (id) {
                const _this = this;

                this.$Loading.start();
                this.$ajax({
                    method: 'get',
                    url: '/blog/getBlogById',
                    params: {id: id}
                }).then(function (res) {
                    if(res.data.code == 0){
                        _this.currentBlog = res.data.data;
                        _this.blogForm = {
                            title: res.data.data.blogTitle,
                            category: res.data.data.blogType.id,
                            des: res.data.data.blogDes
                        };

                        _this.simple.value(res.data.data.blogContent);

                        if(res.data.data.blogCover){
                            _this.imgUrl = res.data.data.blogCover;
                        }
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
            // 获取文章类型
            getBlogType: function () {
                let _this = this;

                this.$ajax({
                    method: 'get',
                    url: '/blog/type/list'
                }).then(function (res) {
                    if(res.data.code == 0){
                        let typeList = res.data.data,
                            list = [];

                        if(typeList.length>1){
                            typeList.map((type)=>{
                                if(type.name != '默认'){
                                    list.push(type);
                                }
                            });
                        }else{
                            list = typeList;
                        }

                        _this.typeList = list;
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
                    title: '取消修改文章',
                    content: '确定离开本页面，放弃已编辑好的文章？',
                    okText: '取消修改',
                    onOk: function () {
                        window.location.href = '/#/blog';
                    }
                });
            },
            // 发布文章
            confirmPush: function () {
                let _this = this;
                this.$Modal.confirm({
                    title: '确认修改文章',
                    content: '确定你已经重新编辑好文章？修改后，文章需重新经过系统管理员审核后方能显示在前台。',
                    okText: '确认修改',
                    onOk: function () {
                        let data = {
                            id: _this.$route.params.id,
                            title: _this.blogForm.title,
                            type: _this.blogForm.category,
                            content: _this.simple.value(),
                            des: _this.blogForm.des
                        };

                        if(_this.imgUrl.indexOf('default')==-1){
                            data.cover = _this.imgUrl;
                        }

                        this.$ajax({
                            method: 'post',
                            url: '/blog/edit',
                            data: data
                        }).then(function (res) {
                            if(res.data.code == 0){
                                _this.$Message.success('您已修改了本篇文章~');
                                window.location.href = '/#/blog';
                            }else{
                                _this.$Message.error(res.data.message);
                            }
                        }).catch(function () {
                            _this.$Message.error('小Mo开小差去了，请稍后再试~');
                        });
                    }
                });
            },
            // 图片上传前
            handleBefore: function (file) {
              this.$Message.loading({
                content: '图片 ['+file.name+'] 正在上传，请稍后...',
                duration: 0
              });
            },
            // 图片上传成功
            handleSuccess: function (event) {
              if(event.code == 0){
                this.imgUrl = event.data.imgUrl;
                this.$Message.destroy();
              }else{
                this.$Message.error(event.message);
              }
            },
            // 控制图片上传大小
            handleSize: function (file) {
              this.$Notice.warning({
                title: '红西柚悄悄告诉你',
                desc: '您上传的图片 [' + file.name + '] 过大，请确保你所上传的文章封面图片不超过 2M。'
              });
              this.$Message.destroy();
            },
            // 控制图片上传格式
            handleFormat: function () {
              this.$Notice.warning({
                title: '红西柚悄悄告诉你',
                desc: '您上传的图片 [' + file.name + '] 格式不正确，请上传 jpg 或 png 格式的图片。'
              });
              this.$Message.destroy();
            }
        },
        created: function () {
            this.getCurrentBlog(this.$route.params.id);
            this.getBlogType();
        },
        mounted: function () {
            this.simple = new SimpleMDE({
                toolbar: [
                    'bold', 'italic', 'strikethrough', '|',
                    'heading-1', 'heading-2', 'heading-3', '|',
                    'horizontal-rule', 'quote', 'unordered-list', 'ordered-list', 'clean-block',  '|',
                    'image', 'link', 'code', 'table', '|',
                    'preview', 'side-by-side', 'fullscreen', 'guide'
                ],
                element: document.getElementById('mde')
            });
        }
    };
</script>