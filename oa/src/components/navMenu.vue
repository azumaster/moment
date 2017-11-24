<template>
    <Row>
        <i-col span="5">
            <Menu :active-name="activeName" @on-select="changeMenu">
                <MenuGroup >
                    <MenuItem name="home"><Icon type="planet"></Icon>首页</MenuItem>
                </MenuGroup>
                <MenuGroup v-if="showSection" title="用户管理">
                    <MenuItem name="userList"><Icon type="person-stalker"></Icon>用户列表</MenuItem>
                </MenuGroup>
                <MenuGroup title="文章管理">
                    <MenuItem name="blogList"><Icon type="document-text"></Icon>文章列表</MenuItem>
                    <MenuItem name="blogType"><Icon type="ios-keypad"></Icon>文章分类列表</MenuItem>
                    <MenuItem name="blogComment"><Icon type="android-textsms"></Icon>评论列表</MenuItem>
                </MenuGroup>
            </Menu>
        </i-col>
        <i-col span="19">
            <router-view></router-view>
        </i-col>
    </Row>
</template>

<script>
    export default {
        data: function () {
            return {
                user: {},
                activeName: 'home',
                showSection: true
            };
        },
        methods: {
            changeMenu: function (name) {
                window.location.href = '/#/'+name;
            }
        },
        mounted: function () {
            let userType = this.user.userType;
            switch (userType) {
                case 1:
                    // 超级管理员，不做任何判断
                    break;
                case 2:
                    // 部门管理员，不显示用户管理
                    this.showSection = false;
                    break;
                case 3:
                    break;
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
        },
        updated: function () {
            let fullPath = this.$route.fullPath.slice(1, this.$route.fullPath.length),
                activeName = fullPath.split('/')[0];

            this.activeName = activeName;
        }
    };
</script>