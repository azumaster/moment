import Vue from 'vue';
import Router from 'vue-router';

import Home from './../views/home/home.vue';

import User from './../views/user/user.vue';
import UserList from './../views/user/userList.vue';

Vue.use(Router);

export default new Router({
    routes: [
        {path: '/', component: Home},
        {path: '/userList', component: User, children: [
            {path: '', component: UserList}
        ]}
        // {path: '/waitAudit', component: waitAudit, children: [
        //     {path: '', component: waitAuditBody}, {path: 'auditing', component: auditing}
        // ]},
        // {path: '/audited', component: audited, children: [
        //     {path: '', component: auditedBody}, {path: 'manage', component: auditedMange}
        // ]},
        // {path: '/refused', component: refused, children: [
        //     {path: '', component: refusedBody}, {path: 'manage', component: refusedManage}
        // ]},
        // {path: '/closed', component: closed, children: [
        //     {path: '', component: closedBody}, {path: 'restart', component: closedReStart}
        // ]}
    ]
});