import Vue from 'vue';
import App from './App.vue';
import axios from 'axios';
import router from './router';

Vue.prototype.$ajax = axios;

new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
});