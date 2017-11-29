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
                        <Option v-for="role in roleList" :value="role.value" :key="role.value">{{role.label}}</Option>
                    </Select>
                </FormItem>
            </Form>
        </Modal>
        <Modal v-model="showEdit" title="编辑该用户" @on-ok="confirmEdit">
            <Form :model="userBasicEdit" :label-width="80">
                <FormItem label="用户名">
                    <Input v-model="userBasicEdit.data.name"  placeholder="请输入用户名"></Input>
                </FormItem>
                <FormItem label="手机号码">
                    <Input v-model="userBasicEdit.data.mobile" :maxlength="userBasicEdit.length.maxMobile" placeholder="请输入手机号码"></Input>
                </FormItem>
                <FormItem v-if="noCurrent" label="指定角色">
                    <Select v-model="userBasicEdit.data.type" placeholder="请选择该用户指定的角色">
                        <Option v-for="role in roleList" :value="role.value" :key="role.value">{{role.label}}</Option>
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
                roleList: [{value: 2, label: '部门管理员'}, {value: 3, label: '专员'}],
                paging: {current: 1, total: 0},
                userColumn: [{title: '姓名', key: 'userName'}, {title: '注册手机号码', key: 'userMobile'}, {title: '角色', key: 'userRole'},
                    {title: '创建时间', key: 'createdAt'}, {title: '用户状态', key: 'status'}, {title: '操作', key: 'action', render: (h, params) => {
                        let btns = [],
                            userName = params.row.userName,
                            userType = params.row.userType,
                            userStatus = params.row.userStatus,
                            currentUserName = this.$store.state.user.userName,
                            currentUserType = this.$store.state.user.userType;

                        if(userName === currentUserName){
                            // 当前用户不能拉黑自己
                            btns = [h('Button', {props: {type: 'info', size: 'small'}, on: {click: () => {this.edit(params.index, 1);}}}, '编辑')];
                        } else if (userType > currentUserType) {
                            // 更高级别的用户可对低级别的用户操作
                            if(userStatus == 2){
                                btns = [
                                    h('Button', {props: {type: 'info', size: 'small'}, style: { marginRight: '5px'}, on: {click: () => {this.edit(params.index);}}}, '编辑'),
                                    h('Button', {props: {type: 'success', size: 'small'}, on: {click: () => {this.changeUserStatus(params.index, 1);}}}, '恢复')
                                ];
                            }else if(userStatus == 1){
                                btns = [
                                    h('Button', {props: {type: 'info', size: 'small'}, style: { marginRight: '5px'}, on: {click: () => {this.edit(params.index);}}}, '编辑'),
                                    h('Button', {props: {type: 'error', size: 'small'}, on: {click: () => {this.changeUserStatus(params.index, 2);}}}, '拉黑')
                                ];
                            }
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
                noCurrent: true,
                userBasicEdit: { data: {
                    name: '',
                    mobile: '',
                    type: 2,
                    id: ''
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
                            status = ['0', '正常', '已拉黑'],
                            list = res.data.data.list;
                        list.map((user)=>{
                            user.userRole = roles[user.userType];
                            user.status = status[user.userStatus];
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
                        _this.$Message.success(res.data.message);
                        _this.getUserList();
                    }else{
                        _this.$Message.error(res.data.message);
                    }
                }).catch(function () {
                    _this.$Message.error('小Mo开小差去了，请稍后再试~');
                });
            },
            // 打开编辑弹窗
            edit: function (index, type) {
                const user = this.userList[index];
                this.userBasicEdit.data.mobile = user.userMobile;
                this.userBasicEdit.data.name = user.userName;
                this.userBasicEdit.data.type = user.userType;
                this.userBasicEdit.data.id = user.userId;

                if (type) {
                    this.noCurrent = false;
                } else {
                    this.noCurrent = true;
                }

                this.showEdit = true;
            },
            // 确认编辑该成员
            confirmEdit: function () {
                let _this = this,
                    data = {};
                data.id = this.userBasicEdit.data.id;
                if(this.userBasicEdit.data.mobile) data.mobile = this.userBasicEdit.data.mobile;
                if(this.userBasicEdit.data.name) data.name = this.userBasicEdit.data.name;
                if(this.userBasicEdit.data.type) data.type = this.userBasicEdit.data.type;

                this.$ajax({
                    method: 'post',
                    url: '/user/editUser',
                    data: data
                }).then(function (res) {
                    if(res.data.code == 0){
                        _this.$Message.success(res.data.message);
                        _this.getUserList();
                    }else{
                        _this.$Message.error(res.data.message);
                    }
                }).catch(function () {
                    _this.$Message.error('小Mo开小差去了，请稍后再试~');
                });
            },
            // 改变用户的状态
            changeUserStatus: function (index, status) {
                let id = this.userList[index].userId,
                    _this = this,
                    name = this.userList[index].userName,
                    title, content, text;

                if(status == 1){
                    // 即将设置为正常
                    title = '恢复用户状态？';
                    text = '恢复';
                    content = '你是否要恢复 ['+name+'] 的正常登录状态？恢复后，该用户可以原角色权限使用本系统。';
                }else if(status == 2){
                    // 即将设置为拉黑
                    title = '拉黑该用户？';
                    text = '拉黑';
                    content = '你是否要拉黑 ['+name+'] ？拉黑后，该用户将无法登录本系统，但仍会保留该用户的资料信息。';
                }


                this.$Modal.confirm({
                    title: title,
                    content: content,
                    okText: text,
                    loading: true,
                    onOk: function () {
                        this.$ajax({
                            method: 'post',
                            url: '/user/updateUserStatus',
                            data: {id: id, status: status}
                        }).then(function (res) {
                            if(res.data.code == 0){
                                _this.$Message.success('操作成功！');
                                _this.getUserList();
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
        created: function(){
            this.getUserList();
        }
    };
</script>