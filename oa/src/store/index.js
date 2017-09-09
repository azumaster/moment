import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        isLogin: false,
        user: {}
    },
    mutations: {

    }
});
export default store;