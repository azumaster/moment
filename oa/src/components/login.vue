<template>
    <div ref="login" class="login">
        <Card class="login-card" :shadow="true">
            <h1 class="login-card-head" slot="title">登录</h1>
            <Form ref="loginForm" :model="loginForm" :rules="ruleLogin">
                <FormItem label="手机号" prop="userMobile">
                    <Input type="text" v-model="loginForm.userMobile" size="large" icon="android-phone-portrait" placeholder="请输入手机号码"/>
                </FormItem>
                <FormItem label="密码">
                    <Input type="password" v-model="loginForm.userPwd" size="large" icon="locked" placeholder="请输入密码" />
                </FormItem>
                <FormItem>
                    <Button size="large" type="primary" @click="doLogin" long>登录</Button>
                </FormItem>
            </Form>
        </Card>
    </div>
</template>

<script>
    export default {
        name: 'login',
        // 数据
        data: function () {
            const validateMobile = function(rule, value, callback){
                if(value == '') callback(new Error('手机号码不能为空~'));
                else {
                    if(!(/^1[34578]\d{9}$/.test(value))) callback(new Error('手机号码格式错误~'));
                    else callback();
                }
            };

            return {
                loginForm: {
                    userMobile: '',
                    userPwd: ''
                },
                ruleLogin: {
                    userMobile: [{validator: validateMobile, trigger: 'blur'}]
                }
            };
        },
        methods: {
            // 登录
            doLogin: function () {
                let mobile = this.loginForm.userMobile,
                    pwd = this.loginForm.userPwd;

                console.log(mobile, pwd);
                this.$ajax({
                    method: 'post',
                    url: '/user/register',
                    data: {mobile: mobile, pwd: pwd}
                }).then(function (res) {
                    console.log(res);
                })
                .catch(function (error) {
                    console.log(error);
                });
            }
        },
        // 生命周期
        mounted: function () {
            this.$refs.login.style.height = window.innerHeight + 'px';
        }
    };
</script>