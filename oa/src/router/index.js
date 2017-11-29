import Vue from 'vue';
import Router from 'vue-router';

const Home = resolve => require.ensure([], () => {return resolve(require('./../views/home/home.vue'));}, 'home');
const EditMe = resolve => require.ensure([], () => {return resolve(require('./../views/home/editUser.vue'));}, 'home');

const User = resolve => require.ensure([], () => {return resolve(require('./../views/user/user.vue'));}, 'user');
const UserList = resolve => require.ensure([], () => {return resolve(require('./../views/user/userList.vue'));}, 'user');

const Blog = resolve => require.ensure([], () => {return resolve(require('./../views/blog/blog.vue'));}, 'blog');
const BlogList = resolve => require.ensure([], () => {return resolve(require('./../views/blog/blogList.vue'));}, 'blog');
const AddBlog = resolve => require.ensure([], () => {return resolve(require('./../views/blog/addBlog.vue'));}, 'blog');
const ShowBlog = resolve => require.ensure([], () => {return resolve(require('./../views/blog/showBlog.vue'));}, 'blog');
const EditBlog = resolve => require.ensure([], () => {return resolve(require('./../views/blog/editBlog.vue'));}, 'blog');

const Type = resolve => require.ensure([], () => {return resolve(require('./../views/blog/type.vue'));}, 'type');
const TypeList = resolve => require.ensure([], () => {return resolve(require('./../views/blog/typeList.vue'));}, 'type');

Vue.use(Router);

export default new Router({
    routes: [
        {path: '/', component: Home, name: 'home'},
        {path: '/home', redirect: '/'},
        {path: '/userList', component: User, children: [
            {path: '', component: UserList, name: 'userList'}, {path: 'editMe', component: EditMe, name: 'editMe'}
        ]},
        {path: '/blogList', component: Blog, children: [
            {path: '', component: BlogList, name: 'blogList'}, {path: 'addBlog', component: AddBlog, name: 'addBlog'},
            {path: 'showBlog/:id', component: ShowBlog, name: 'showBlog'}, {path: 'editBlog/:id', component: EditBlog, name: 'editBlog'}
        ]},
        {path: '/blogType', component: Type, children: [
            {path: '', component: TypeList, name: 'typeList'}
        ]}
    ]
});