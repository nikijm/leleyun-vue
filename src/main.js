import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { AlertPlugin,ConfirmPlugin,WechatPlugin,ToastPlugin } from 'vux'
import regWecaht from './utils/regWechat'
import store from './store/store'
import BaiduMap from 'vue-baidu-map'

Vue.use(AlertPlugin);
Vue.use(ConfirmPlugin);
Vue.use(ToastPlugin);
Vue.use(WechatPlugin);//微信SDK调用
Vue.use(BaiduMap,{ //百度地图SDK调用
    ak:'ZZ6mparn48ByQhcNTOEW6syx87wsG5rf'
});
router.beforeEach(function (to, from, next) {//路由开始变化
    store.state.isLoading = true;
    next();
});
router.afterEach(function (to, from) {//路由变化结束
    setTimeout(function () {
        store.state.isLoading = false;
    },500);
    //更新title
    document.title = to.meta.title || '';
    //隐藏所有弹窗
    Vue.$vux.confirm.hide();
    //注册微信签名
    regWecaht(Vue);
});
// 全局自定义指令
Vue.directive('focus',{   //输入项获取焦点指令
    inserted: function (el) {
        const tagName = el.tagName.toLowerCase();
        if(tagName !== 'input' || tagName !== 'textarea'){
            el = el.getElementsByTagName('input')[0] || el.getElementsByTagName('textarea')[0];
        }
        el.focus();
    }
});
//过滤器
Vue.filter('currency',function (value) {
   if(parseFloat(value)<1){
       return ('¥'+value)
   } else {
       return ('¥'+value+'.00')
   }
});

new Vue({
    router,
    store,
    el: '#app',
    render: h => h(App)
});
