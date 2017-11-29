<template>
    <div id="typeList">
        <PageHead title="文章分类列表"></PageHead>
        <div class="page-header">
            <Button type="primary" size="large" icon="ios-plus-outline" @click="showAddType">添加新分类</Button>
        </div>
        <div class="page-table">
            <Table border :columns="typeColumns" :data="typeList"></Table>
        </div>
        <Modal v-model="showAdd" title="添加文章分类" @on-ok="addType">
            <Form :model="newType" :label-width="80">
                <FormItem label="分类名字"><Input v-model="newType.typeName" placeholder="请输入分类名字"></Input></FormItem>
                <FormItem label="分类描述"><Input v-model="newType.typeDes" :autosize="{minRows: 5, maxRows: 5}" type="textarea" placeholder="请输入分类描述"></Input></FormItem>
            </Form>
        </Modal>
        <Modal v-model="showEdit" title="修改文章分类" @on-ok="updateType">
            <Form :model="newType" :label-width="80">
                <FormItem label="分类名字"><Input v-model="editType.typeName" placeholder="请输入分类名字"></Input></FormItem>
                <FormItem label="分类描述"><Input v-model="editType.typeDes" :autosize="{minRows: 5, maxRows: 5}" type="textarea" placeholder="请输入分类描述"></Input></FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script>
    import PageHead from './../../components/page/pageHead.vue';

    export default {
        name: 'typeList',
        components: { PageHead },
        data: function () {
            return {
                showAdd: false,
                showEdit: false,
                newType: { typeName: '', typeDes: ''},
                editType: { typeName: '', typeDes: ''},
                typeList: [],
                typeColumns: [{title: '文章分类名', key: 'name'}, {title: '文章分类描述', key: 'des'}, {title: '最近更新时间', key: 'updatedAt'}, {title: '操作', key: 'action',
                    render: (h, params) => {
                        let btns = [];
                        if(params.row.name != '默认') {

                            if(this.$store.state.user.userType == 1){
                                btns = [
                                    h('Button', {props: {type: 'info', size: 'small'}, style: { marginRight: '5px'}, on: {click: () => {this.showEditType(params.index);}}}, '编辑'),
                                    h('Button', {props: {type: 'error', size: 'small'}, on: {click: () => {this.delType(params.index, 0);}}}, '删除')
                                ];
                            } else {
                                btns = [
                                    h('Button', {props: {type: 'info', size: 'small'}, style: { marginRight: '5px'}, on: {click: () => {this.showEditType(params.index);}}}, '编辑')
                                ];
                            }
                        }
                        return h('div', btns);
                    }
                }]
            };
        },
        methods: {
            showAddType: function () {
                this.showAdd = true;
            },
            showEditType: function (id) {
                let _id = this.typeList[id]._id,
                    _this = this;

                this.$ajax({
                    method: 'get',
                    url: '/blog/type/one',
                    params: {id: _id}
                }).then(function (res) {
                    if(res.data.code == 0){
                        _this.editType = res.data.data;
                        _this.showEdit = true;
                    }else{
                        _this.$Message.error(res.data.message);
                    }
                }).catch(function () {
                    _this.$Message.error('小Mo开小差去了，请稍后再试~');
                });
            },
            // 获取分类列表
            getTypeList: function () {
                let _this = this;

                this.$Loading.start();
                this.$ajax({
                    method: 'get',
                    url: '/blog/type/list'
                }).then(function (res) {
                    if(res.data.code == 0){
                        _this.typeList = res.data.data;
                        _this.$Loading.finish();
                    }else{
                        _this.$Message.error(res.data.message);
                        _this.$Loading.error();
                    }
                }).catch(function () {
                    _this.$Message.error('小Mo开小差去了，请稍后再试~');
                });
            },
            // 添加新分类
            addType: function () {
                let name = this.newType.typeName,
                    des = this.newType.typeDes;

                let _this = this;

                this.$ajax({
                    method: 'post',
                    url: '/blog/type/add',
                    data: {name: name, des: des}
                }).then(function (res) {
                    if(res.data.code == 0){
                        _this.$Message.success('新的文章分类已添加成功了哦~');
                        _this.newType = { typeName: '', typeDes: ''};
                        _this.getTypeList();
                    }else{
                        _this.$Message.error(res.data.message);
                    }
                }).catch(function () {
                    _this.$Message.error('小Mo开小差去了，请稍后再试~');
                });
            },
            // 修改分类信息
            updateType: function () {
                let _this = this;

                this.$ajax({
                    method: 'post',
                    url: '/blog/type/edit',
                    data: _this.editType
                }).then(function (res) {
                    if(res.data.code == 0){
                        _this.$Message.success('这个文章分类已经修改成功了~');
                        _this.getTypeList();
                    }else{
                        _this.$Message.error(res.data.message);
                    }
                }).catch(function () {
                    _this.$Message.error('小Mo开小差去了，请稍后再试~');
                });
            },
            // 删除分类信息
            delType: function (id) {
                let _this = this,
                    _id = this.typeList[id]._id,
                    typeName = this.typeList[id].name;

                this.$Modal.confirm({
                    title: '确认删除？',
                    content: '你确认要删除 ['+typeName+'] 吗?删除分类后，该分类下的所有文章将会被重置为默认分类。',
                    okText: '删除',
                    loading: true,
                    onOk: function () {
                        this.$ajax({
                            method: 'post',
                            url: '/blog/type/del',
                            data: {id: _id}
                        }).then(function (res) {
                            if(res.data.code == 0){
                                _this.getTypeList();
                            }else{
                                _this.$Message.error(res.data.message);
                            }
                        }).catch(function () {
                            _this.$Message.error('小Mo开小差去了，请稍后再试~');
                        });
                        _this.$Modal.remove();
                    }
                });
            }
        },
        created: function () {
            this.getTypeList();
        }
    };
</script>