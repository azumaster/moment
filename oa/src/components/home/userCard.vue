<template>
    <div>
        <Card>
            <p slot="title">我</p>
            <a href="#" slot="extra" @click="showEditModal"><Icon style="margin-right: 5px;" type="edit"></Icon>编辑资料</a>
            <div class="home-card">
                <div class="home-card-head"><img :src="user.userHead"></div>
                <div class="home-card-info">
                    <h1>{{user.userName}}</h1>
                    <p><Icon style="margin-right: 5px;" type="ios-telephone"></Icon>{{user.userMobile}}</p>
                    <p><Icon style="margin-right: 5px;" type="person"></Icon>{{userRole[user.userType-1]}}</p>
                </div>
            </div>
        </Card>
        <Modal v-model="showEditUser" title="编辑个人资料" ok-text="确认修改" cancel-text="取消" @on-ok="editOk">
            <Tabs value="basic" @on-click="setTab">
                <TabPane label="基本资料" name="basic">
                    <Form :model="userBasic" :label-width="80">
                        <FormItem label="昵称"><Input v-model="userBasic.data.name" placeholder="请输入你的昵称"></Input></FormItem>
                        <p>若您只需要修改昵称，不需要获取到手机验证码哦~</p>
                        <FormItem label="手机号码">
                            <Row><i-col span="24">{{user.userMobile}}</i-col></Row>
                            <Row style="margin-top: 10px;">
                                <i-col span="16"><Input v-model="userBasic.data.mobile" placeholder="请输入新的手机号码" :maxlength="userBasic.length.mobile"></Input></i-col>
                                <i-col span="7" push="1"> <Button type="primary" long @click="getVerify" :disabled="userBasic.state.disabled">{{userBasic.text.getVerify}}</Button></i-col>
                            </Row>
                            <Row style="margin-top: 10px;">
                                <i-col span="10"><Input v-model="userBasic.data.verify" placeholder="请输入短信验证码" :maxlength="userBasic.length.verify"></Input></i-col>
                            </Row>
                        </FormItem>
                    </Form>
                </TabPane>
                <TabPane label="修改密码" name="pwd">23324</TabPane>
                <TabPane label="更换头像" name="head">标签三的内容</TabPane>
            </Tabs>
        </Modal>
    </div>
</template>

<script>
    let userBasic = {
        data: { name: '', mobile: '', verify: '' },
        length: { mobile: 11, verify: 6 },
        state: { disabled: false },
        text: { getVerify: '获取验证码' }
    };

    export default {
        name: 'home',
        data: function () {
            return {
                user: {},
                userRole: ['超级管理员', '部门管理员', '专员'],
                showEditUser: false,
                currentTab: 'basic',
                userBasic: {
                    data: { name: '', mobile: '', verify: '' },
                    length: { mobile: 11, verify: 6 },
                    state: { disabled: false },
                    text: { getVerify: '获取验证码' }
                }
            };
        },
        methods: {
            showEditModal: function () {
                this.showEditUser = true;
                this.userBasic.data.name = this.user.userName;
            },
            setTab: function (name) {
                this.currentTab = name;
            },
            // 获取验证码
            getVerify: function () {
                let mobile = this.userBasic.data.mobile,
                    _this = this;

                this.$ajax({
                    method: 'post',
                    url: '/user/sendVerify',
                    data: {mobile: mobile}
                }).then(function (res) {
                    if(res.data.code == 0){
                        let time = 60;
                        _this.$Message.success('发送成功');
                        _this.userBasic.state.disabled = true;
                        let interval = setInterval(()=>{
                            _this.userBasic.text.getVerify = time+'秒后重发';
                            time --;
                            if(time < 0){
                                _this.userBasic.state.disabled = false;
                                _this.userBasic.text.getVerify = '重发验证码';
                                clearInterval(interval);
                            }
                        }, 1000);
                    }else{
                        _this.$Message.error(res.data.message);
                    }
                }).catch(function () {
                    _this.$Message.error('小Mo开小差去了，请稍后再试~');
                });
            },
            editOk: function () {
                switch (this.currentTab) {
                    case 'basic':
                        this.editUserBasic();
                        break;
                    case 'pwd':
                        break;
                    case 'head':
                        break;
                }
            },
            // 确认修改基本资料
            editUserBasic: function () {
                let data = this.userBasic.data,
                    _this = this;

                this.$ajax({
                    method: 'post',
                    url: '/user/editUserBasic',
                    data: data
                }).then(function (res) {
                    if(res.data.code == 0){
                        _this.$Message.success('修改成功！');
                        _this.$store.state.user = res.data.data;
                    }else{
                        _this.$Message.error(res.data.message);
                    }
                }).catch(function () {
                    _this.$Message.error('小Mo开小差去了，请稍后再试~');
                });

                this.userBasic = userBasic;
            }
        },
        computed: {
            getUser () {
                this.user = this.$store.state.user;
                return this.$store.state.user;
            }
        },
        watch: {
            getUser (val) {
                this.user = val;

            }
        }
    };
</script>