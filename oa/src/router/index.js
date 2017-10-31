import Vue from 'vue';
import Router from 'vue-router';

import Home from './../views/home/home.vue';
import EditMe from './../views/home/editUser.vue';

import User from './../views/user/user.vue';
import UserList from './../views/user/userList.vue';

import Blog from './../views/blog/blog.vue';
import BlogList from './../views/blog/blogList.vue';
import AddBlog from './../views/blog/addBlog.vue';

import Type from './../views/blog/type.vue';
import TypeList from './../views/blog/typeList.vue';

Vue.use(Router);

export default new Router({
    routes: [
        {path: '/', component: Home},
        {path: '/home', redirect: '/'},
        {path: '/userList', component: User, children: [
            {path: '', component: UserList}, {path: 'editMe', component: EditMe}
        ]},
        {path: '/blogList', component: Blog, children: [
            {path: '', component: BlogList}, {path: 'addBlog', component: AddBlog}
        ]},
        {path: '/blogType', component: Type, children: [
            {path: '', component: TypeList}
        ]}
    ]
});