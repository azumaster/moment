import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const Discover = resolve => require.ensure([], () => {return resolve(require('./../views/discover/discover.vue'));}, 'discover');
const DiscoverIndex = resolve => require.ensure([], () => {return resolve(require('./../views/discover/discoverIndex.vue'));}, 'discover');

export default new Router({
    routes: [
        {path: '/', component: Discover, children: [
            {path: '', component: DiscoverIndex, name: 'discover'}
        ]}
    ]
});