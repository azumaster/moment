<template>
    <div id="userList">
        <div class="page-header">
            <Button type="primary" size="large" icon="ios-plus-outline" @click="showAdd = true">添加新用户</Button>
        </div>
        <div class="page-table">
            <Table border :columns="userColumn" :data="userList"></Table>
            <Page class="page-paging" :total="100"></Page>
        </div>
        <Modal v-model="showAdd" title="添加新用户" @on-ok="confirmAdd">
            <Form :model="formItem" :label-width="80">
                <FormItem label="手机号码">
                    <Input v-model="userBasic.data.mobile" :maxlength="userBasic.length.maxMobile" placeholder="请输入初始手机号码"></Input>
                </FormItem>
                <FormItem label="初始密码">
                    <Input type="password" v-model="userBasic.data.password" placeholder="请设置该账户的初始密码"></Input>
                </FormItem>
                <FormItem label="指定角色">
                    <Select v-model="userBasic.data.type" placeholder="请选择该用户指定的角色">
                        <Option value="2">部门管理员</Option>
                        <Option value="3">专员</Option>
                    </Select>
                </FormItem>
            </Form>
        </Modal>
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
//                                            this.show(params.blogList)
                                        }
                                    }
                                }, '修改'),
                                h('Button', {
                                    props: { type: 'text', size: 'small'},
                                    on: {
                                        click: () => {
//                                            this.remove(params.blogList)
                                        }
                                    }
                                }, '拉黑')
                            ]);
                        }}],
                userList: [],
                showAdd: false,
                userBasic: {
                    data: {
                        mobile: '',
                        password: '',
                        type: 0
                    },
                    length: {
                        maxMobile: 11
                    }
                }
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
            },
            confirmAdd: function () {
                let mobile = this.userBasic.data.mobile,
                    type = this.userBasic.data.type,
                    password = this.userBasic.data.password;


            }
        },
        created: function(){
            this.getUserList();
        }
    };
</script>