/**
 * Created by lw on 2017-6-8.
 */
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

const store = new Vuex.Store({
    state:{
        isLoading: false,  //进度条加载状态
        openId : '',
        userId : ''
    }
});
export default store;