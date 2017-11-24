<template>
    <div id="userList">
        <div class="page-header">
            <Button type="primary" size="large" icon="ios-plus-outline" @click="showAdd = true">添加新用户</Button>
        </div>
        <div class="page-table">
            <Table border :columns="userColumn" :data="userList"></Table>
            <Page style="margin:20px 0;" :total="paging.total" :current="paging.current" :page-size="params.size" @on-change="changePage"></Page>
        </div>
        <Modal v-model="showAdd" title="添加新用户" @on-ok="confirmAdd">
            <Form :model="userBasic" :label-width="80">
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
        <Modal v-model="showEdit" title="编辑该用户" @on-ok="">
            <Form :model="userBasicEdit" :label-width="80">
                <FormItem label="用户名">
                    <Input v-model="userBasicEdit.data.name"  placeholder="请输入用户名"></Input>
                </FormItem>
                <FormItem label="手机号码">
                    <Input v-model="userBasicEdit.data.mobile" :maxlength="userBasicEdit.length.maxMobile" placeholder="请输入手机号码"></Input>
                </FormItem>
                <FormItem label="指定角色">
                    <Select v-model="userBasicEdit.data.type" placeholder="请选择该用户指定的角色">
                        <Option value="2">部门管理员</Option>
                        <Option value="3">专员</Option>
                    </Select>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script>
    import crypto from 'crypto';

    export default {
        name: 'userList',
        data () {
            return {
                params: {page: 1, size: 20},
                paging: {current: 1, total: 0},
                userColumn: [{title: '姓名', key: 'userName'}, {title: '注册手机号码', key: 'userMobile'}, {title: '角色', key: 'userRole'},
                    {title: '创建时间', key: 'createdAt'}, {title: '操作', key: 'action', render: (h, params) => {
                        let btns = [],
                            userName = params.row.userName,
                            userType = params.row.userType,
                            currentUserName = this.$store.state.user.userName,
                            currentUserType = this.$store.state.user.userType;

                        if(userName === currentUserName){
                            // 当前用户不能拉黑自己
                            btns = [h('Button', {props: {type: 'info', size: 'small'}, on: {click: () => {this.edit(params.index);}}}, '编辑')];
                        } else if (userType > currentUserType) {
                            // 更高级别的用户可对低级别的用户操作
                            btns = [
                                h('Button', {props: {type: 'info', size: 'small'}, style: { marginRight: '5px'}, on: {click: () => {this.edit(params.index);}}}, '编辑'),
                                h('Button', {props: {type: 'error', size: 'small'}, on: {click: () => {}}}, '拉黑')
                            ];
                        }
                        return h('div', btns);
                    }}],
                userList: [],
                showAdd: false,
                userBasic: {
                    data: {
                        mobile: '',
                        password: '',
                        type: 2
                    },
                    length: {
                        maxMobile: 11
                    }
                },
                showEdit: false,
                userBasicEdit: { data: {
                    name: '',
                    mobile: '',
                    type: 2
                },
                    length: {
                        maxMobile: 11
                    }
                }
            };
        },
        methods: {
            // 获取成员名单
            getUserList: function () {
                let _this = this;

                this.$Loading.start();
                this.$ajax({
                    method: 'get',
                    url: '/user/getUserList',
                    params: _this.params
                }).then(function (res) {
                    if(res.data.code == 0){
                        let roles = ['0', '超级管理员', '部门管理员', '专员'],
                            list = res.data.data.list;
                        list.map((user)=>{
                            user.userRole = roles[user.userType];
                        });


                        _this.userList = list;
                        _this.paging.current = res.data.data.current;
                        _this.paging.total = res.data.data.total;
                    }else{
                        _this.$Message.error(res.data.message);
                    }
                    _this.$Loading.finish();
                }).catch(function () {
                    _this.$Message.error('小Mo开小差去了，请稍后再试~');
                    _this.$Loading.error();
                });
            },
            // 确认添加新成员
            confirmAdd: function () {
                let mobile = this.userBasic.data.mobile,
                    type = this.userBasic.data.type,
                    password = this.userBasic.data.password;

                let _this = this;

                password = crypto.createHmac('sha1', 'azumar').update(password).digest().toString('base64');

                this.$ajax({
                    method: 'post',
                    url: '/user/addUser',
                    data: {mobile: mobile, type: type, pwd: password}
                }).then(function (res) {
                    if(res.data.code == 0){
                        _this.$Message.success(res.message);
                        _this.getUserList();
                    }else{
                        _this.$Message.error(res.message);
                    }
                }).catch(function () {
                    _this.$Message.error('小Mo开小差去了，请稍后再试~');
                });
            },
            // 打开编辑弹窗
            edit: function (index) {
                const user = this.userList[index];
                this.userBasicEdit.data.mobile = user.userMobile;
                this.userBasicEdit.data.name = user.userName;
                this.userBasicEdit.data.type = user.userType;

                this.showEdit = true;
            }
        },
        created: function(){
            this.getUserList();
        }
    };
</script>