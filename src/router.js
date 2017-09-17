/**
 * Created by lw on 2017-5-17.
 */
import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/login',
            component: function (resolve) {
                require(['./views/login.vue'],resolve)
            },
            name: 'login',
            meta: {
                title: '绑定手机号'
            }
        },
        {
            path: '/home',
            component: function (resolve) {
                require(['./views/home.vue'],resolve)
            },
            name: 'home',
            meta: {
                title: '乐医汇'
            }
        },{path:'/',redirect : '/home'},
        {
            path: '/special/:name',
            component: function (resolve) {
                require(['./views/special.vue'],resolve)
            },
            name: 'special',
            meta: {
                title: '特色服务'
            }
        },
        {
            path:'/doctorlist/:type/:filter',
            component:function (resolve) {
                require(['./views/doctor_list.vue'],resolve)
            },
            name:'doctor_list',
            meta:{
                title:'.'
            }
        },
        {
            path:'/doctordetail/:type/:id/:aid',
            component:function (resolve) {
                require(['./views/doctor_detail.vue'],resolve)
            },
            name:'doctor_detail',
            meta:{
                title:'医生服务'
            }
        },
        {
            path:'/oneorder/:modal',
            component:function (resolve) {
                require(['./views/one_order.vue'],resolve)
            },
            name:'one_order',
            meta:{
                title:'订单填写'
            }
        },
        {
          path:'/requestresult/:type/:modal',
            component:function (resolve) {
                require(['./views/request_result.vue'],resolve)
            },
            name:'request_result',
            meta:{
              title:'正在处理中...'
            }
        },
        {
            path:'/myorder',
            component:function (resolve) {
                require(['./views/my_order.vue'],resolve)
            },
            name:'my_order',
            meta:{
                title:'我的订单'
            }
        },
        {
            path:'/orderpay/:id',
            component:function (resolve) {
                require(['./views/order_pay.vue'],resolve)
            },
            name:'order_pay',
            meta:{
                title:'订单支付'
            }
        },
        {
            path:'/phoneorder/:doctorId/:orderId',
            component:function (resolve) {
                require(['./views/phone_order.vue'],resolve)
            },
            name:'phone_order',
            meta:{
                title:'订单填写'
            }
        },
        {
            path:'/evaluate/:id',
            component:function (resolve) {
                require(['./views/evaluate.vue'],resolve)
            },
            name:'evaluate',
            meta:{
                title:'评价'
            }
        },
        {
            path:'/phoneorderdetail/:id',
            component:function (resolve) {
                require(['./views/phone_order_detail.vue'],resolve)
            },
            name:'phone_order_detail',
            meta:{
                title:'订单详情'
            }
        },
        {
            path:'/oneorderdetail/:id',
            component:function (resolve) {
                require(['./views/one_order_detail.vue'],resolve)
            },
            name:'one_order_detail',
            meta:{
                title:'订单详情'
            }
        },
        {
            path:'/serviceorderdetail/:id',
            component:function (resolve) {
                require(['./views/service_order_detail.vue'],resolve)
            },
            name:'service_order_detail',
            meta:{
                title:'订单详情'
            }
        },
        {
            path:'/myhome',
            component:function (resolve) {
                require(['./views/my_home.vue'],resolve)
            },
            name:'my_home',
            meta:{
                title:'个人'
            }
        },
        {
            path:'/feedback',
            component:function (resolve) {
                require(['./views/feedback.vue'],resolve)
            },
            name:'feedback',
            meta:{
                title:'意见反馈'
            }
        },
        {
            path:'/servicelist',
            component:function (resolve) {
                require(['./views/service_list.vue'],resolve)
            },
            name:'service_list',
            meta:{
                title:'会员服务'
            }
        },
        {
            path:'/servicedetail/:id',
            component:function (resolve) {
                require(['./views/service_detail.vue'],resolve)
            },
            name:'service_detail',
            meta:{
                title:'套餐详情'
            }
        },
        {
            path:'/vipinfo',
            component:function (resolve) {
                require(['./views/vip_info.vue'],resolve)
            },
            name:'vip_info',
            meta:{
                title:'会员'
            }
        },
        {
            path:'/vipnolist',
            component:function (resolve) {
                require(['./views/vip_no_list.vue'],resolve)
            },
            name:'vip_no_list',
            meta:{
                title:'会员'
            }
        },
        {
            path:'/vipreferral/:type/:text',
            component:function (resolve) {
                require(['./views/vip_referral.vue'],resolve)
            },
            name:'vip_referral',
            meta:{
                title:'预约转诊'
            }
        },
        {
            path:'/vipvisit',
            component:function (resolve) {
                require(['./views/vip_visit.vue'],resolve)
            },
            name:'vip_visit',
            meta:{
                title:'医生回访'
            }
        },
        {
            path: '/error',
            component: function (resolve) {
                require(['./views/error.vue'],resolve)
            },
            meta: {
                title: '请先关注公众号'
            }
        },
        {
            path: '/archives/:planid',
            component: function (resolve) {
                require(['./views/archives.vue'],resolve)
            },
            meta: {
                title: '随访档案'
            }
        },
        {
            path:'/onehome',
            component:function (resolve) {
                require(['./views/one_home.vue'],resolve)
            },
            meta:{
                title:'预约名医'
            }
        },
        {
            path:'/onepractice/:modal',
            component:function (resolve) {
                require(['./views/one_practice.vue'],resolve)
            },
            meta:{
                title:'.'
            }
        },
        {
            path:'/serviceInfo/:id',
            component:function (resolve) {
                require(['./views/service_info.vue'],resolve)
            },
            meta:{
                title:'.'
            }
        },
        {
            path: '/test',
            component: function (resolve) {
                require(['./views/test.vue'],resolve)
            },
            meta: {
                title: 'test'
            }
        }
    ]
})