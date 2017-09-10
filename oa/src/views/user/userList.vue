<template>
    <div id="userList">
        <div class="page-header">
            <Button type="primary" size="large" icon="ios-plus-outline" @click="showAdd = true">添加新用户</Button>
        </div>
        <div class="page-table">
            <Table border :columns="userColumn" :data="userList"></Table>
            <Page class="page-paging" :total="100"></Page>
        </div>
        <Modal v-model="showAdd" title="添加新用户">ljl</Modal>
    </div>
</template>

<script>
    export default {
        name: 'userList',
        data () {
            return {
                userColumn: [{title: '姓名', key: 'userName'}, {title: '注册手机号码', key: 'userMobile'}, {title: '角色', key: 'userType'},
                    {title: '创建时间', key: 'createdAt'}, {title: '操作', key: 'action',
                        render: (h) => {
                            return h('div', [
                                h('Button', { props: { type: 'text', size: 'small'},
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
//                                            this.show(params.index)
                                        }
                                    }
                                }, '修改'),
                                h('Button', {
                                    props: { type: 'text', size: 'small'},
                                    on: {
                                        click: () => {
//                                            this.remove(params.index)
                                        }
                                    }
                                }, '拉黑')
                            ]);
                        }}],
                userList: [],
                showAdd: false
            };
        },
        methods: {
            getUserList: function () {
                let _this = this;

                this.$Loading.start();
                this.$ajax({
                    method: 'get',
                    url: '/user/getUserList'
                }).then(function (res) {
                    if(res.data.code == 0){
                        _this.userList = res.data.data.list;
                    }else{
                        _this.$Message.error(res.data.message);
                    }
                    _this.$Loading.finish();
                }).catch(function () {
                    _this.$Message.error('小Mo开小差去了，请稍后再试~');
                    _this.$Loading.error();
                });
            }
        },
        created: function(){
            this.getUserList();
        }
    };
</script>