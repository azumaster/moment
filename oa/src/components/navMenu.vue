<template>
    <Row>
        <i-col span="5">
            <Menu active-name="home" @on-select="changeMenu">
                <MenuGroup >
                    <MenuItem name="home"><Icon type="planet"></Icon>首页</MenuItem>
                </MenuGroup>
                <MenuGroup title="用户管理">
                    <MenuItem name="userList"><Icon type="person-stalker"></Icon>用户列表</MenuItem>
                </MenuGroup>
                <MenuGroup title="文章管理">
                    <MenuItem name="blogList"><Icon type="document-text"></Icon>文章列表</MenuItem>
                    <MenuItem name="blogType"><Icon type="document-text"></Icon>文章分类列表</MenuItem>
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
        methods: {
            changeMenu: function (name) {
                window.location.href = '/#/'+name;
            }
        }
    };
</script>