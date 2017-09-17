/**
 * Created by lw on 2017-5-31.
 */
import axios from 'axios'
import qs from 'qs'
import $ from 'jquery'


//预发模式
const MODEL = 'dev';

//线上模式
// const MODEL = 'dist';

let BASEURL,BASEIMGURL,UPLOADIMGURL,FUBASEURL;
if(MODEL === 'dev'){
    BASEURL = 'http://59.110.18.99';
    BASEIMGURL = 'http://img.leley.org/';
    UPLOADIMGURL = 'http://oss.leley.org:8085/';
    FUBASEURL='http://59.110.18.99:8000'
}
else if(MODEL === 'dist'){
    BASEURL = 'http://47.93.158.251';
    BASEIMGURL = 'http://img.leley.com/';
    UPLOADIMGURL = 'http://oss.leley.com/';
    FUBASEURL='http://api.leley.com'
}

axios.defaults.timeout = 15001;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

//POST传参序列化(添加请求拦截器)
axios.interceptors.request.use((config) => {
    //在发送请求之前做某件事
    const defaultParam = {
        'REQTIME': Date.now()
    };
    config.data=$.extend(true,defaultParam,config.data);
    // config.data = Object.assign(defaultParam,config.data);
    if(config.method  === 'post'){
        config.data = qs.stringify(config.data);
    }
    return config;
},(error) =>{
    // _.toast("错误的传参", 'fail');
    return Promise.reject(error);
});

const errorAlert = function (errorStr) {
    const html = '<div id="modalErrorTips" style="position: fixed;top: 0;left: 0;width:100%;height:100%;text-align: center;font-size: .12rem;opacity: 0;z-index: 999">' +
        '<p style="display:inline-block;background-color: rgba(1,1,1,.7);padding: .1rem .15rem;border-radius: .08rem;color: white;">'+errorStr+'</p>' +
        '</div>';
    $('body').append(html);
    setTimeout(function () {
        $('#modalErrorTips').css({opacity:'1',top:'.15rem',transition:'all .1s linear'})
    },10);
    setTimeout(function () {
        $('#modalErrorTips').css({opacity:'0',top:'0',transition:'all .1s easy-out'})
    },1000);
    setTimeout(function () {
        $('#modalErrorTips').remove();
    },1100);
};
//返回状态判断(添加响应拦截器)
axios.interceptors.response.use((res) =>{
    if(res.data && res.data.code!== '000'
        && res.request.responseURL.indexOf('wxjs/getOpenId') < 0
        && res.request.responseURL.indexOf('wxUser/bindingPhone') < 0
    ){
        errorAlert(res.data.msg || '接口请求失败');
    }
    return res;
}, (error) => {
    errorAlert('网络错误，请检查网络设置');
    return Promise.reject(error);
});


//返回一个Promise(发送post请求)
export function fetch(modal) {
    return new Promise((resolve, reject) => {
        const obj = {
            method: 'post'
        };
        modal = $.extend(true,obj,modal);
        axios(obj).then(response =>{
            resolve(response.data)
        }).catch((err)=>{
            reject(err)
        })
    })
}

export default {
    MODEL,
    BASEIMGURL,
    UPLOADIMGURL,
    getWxConfig(data){  //获取微信签名
        return fetch({
            url :  BASEURL +'/wxjs/getsign',
            data : data
        })
    },
    getOpenId(code){  //获取openId
        return fetch({
            url : BASEURL + '/wxjs/getOpenId',
            data : {
                code : code
            }
        })
    },
    sendCode(phone){  //发送手机验证码
        return fetch({
            url : BASEURL + '/wxUser/sendCode',
            data : {
                phone : phone
            }
        })
    },
    bindingPhone(modal){  //绑定手机号
        return fetch({
            url : BASEURL + '/wxUser/bindingPhone',
            data : modal
        })
    },
    getBanner(){  //首页banner
        return fetch({
            url : BASEURL + '/comment/bannerOfHomePage'
        })
    },
    getHealthInfo(){  //健康资讯
        return fetch({
            url : BASEURL + '/comment/healthInformationOfHomePage'
        })
    },
    queryDoctorCallList(modal){  //查询电话咨询医生列表
        return fetch({
            url : BASEURL + '/reservationPhone/queryDoctorCallList',
            data : modal
        })
    },
    queryDoctorCallInfo(doctorId){  //查询电话咨询医生详情
        return fetch({
            url : BASEURL + '/reservationPhone/queryDoctorCallInfo',
            data : {
                doctorId : doctorId
            }
        })
    },
    queryDoctorDetail(doctorId){  //查询医生详情（包括电话和一对一）
        return fetch({
            url : BASEURL + '/doctor/doctorHomePage',
            data : {
                doctorId : doctorId
            }
        })
    },
    addCallOrder(modal){  //电话咨询提交订单
        return fetch({
            url : BASEURL + '/reservationPhone/addCallOrder',
            data: modal
        })
    },
    queryDoctorOneList(modal){  //查询专家一对一医生列表
        return fetch({
            url : BASEURL + '/expertConsultation/queryDoctorList',
            data : modal
        })
    },
    queryDoctorOneInfo(doctorId,addressId){  //查询专家一对一医生详情
        return fetch({
            url : BASEURL + '/expertConsultation/doctorHomePage',
            data : {
                doctorId : doctorId,
                addressId: addressId
            }
        })
    },
    createOneOrder(modal){  //创建一对一订单
        return fetch({
            url : BASEURL + '/expertConsultation/createOrder',
            data : modal
        })
    },
    queryDoctorTags(doctorUserId){  //查询医生标签
        return fetch({
            url : BASEURL + '/comment/queryDoctorTags',
            data : {
                doctorUserId : doctorUserId
            }
        })
    },
    queryCommentList(modal){  //查询医生评价
        return fetch({
            url : BASEURL + '/comment/queryCommentList',
            data : modal
        })
    },
    queryMyOrderList(modal){  //查询我的预约列表
      return fetch({
          url : BASEURL + '/myReservation/queryMyOrderList',
          data : modal
      })
    },
    customerTalk(modal){  //客户拨打电话
      return fetch({
          url : BASEURL + '/mobileConsultManager/customerTalk',
          data : modal
      })
    },
    getOrderPhoneDetail(orderId){ //查询电话订单详情
        return fetch({
            url : BASEURL + '/myReservation/getOrderPhoneDetail',
            data : {
                orderId:orderId
            }
        })
    },
    getOrderOneDetail(modal){ //查询一对一订单详情
        return fetch({
            url : BASEURL + '/myReservation/getOrderExpertDetail',
            data : modal
        })
    },
    getPatientDetail(openId,orderId){ //预览订单个人资料
        return fetch({
            url : BASEURL + '/myReservation/getPatientDetail',
            data : {
                openId : openId,
                orderId : orderId
            }
        })
    },
    modifyPatientDetail (modal){ //修改个人订单
      return fetch({
          url : BASEURL + '/myReservation/modifyPatientDetail',
          data : modal
      })
    },
    queryCommentTagByRating(openId){ //查询分数标签
        return fetch({
            url : BASEURL + '/comment/queryCommentTags',
            data : {
                openId:openId
            }
        })
    },
    patientEvaluatedDoctor(modal){ //患者评价医生
        return fetch({
            url : BASEURL + '/comment/patientEvaluatedDoctor',
            data : modal
        })
    },
    wxPay(modal){ //发起微信支付
        return fetch({
            url : BASEURL + '/wxpay/pay',
            data : modal
        })
    },
    wxPayCallBack(modal){ //微信支付成功回调
        return fetch({
            url : BASEURL + '/wxpay/llycallBack',
            data : modal
        })
    },
    getUserInfo(openId){ //获取个人信息
        return fetch({
            url : BASEURL + '/user/getUserInfo',
            data : {
                openId : openId
            }
        })
    },

    queryHospitalList(){  //查询医院列表
        return fetch({
            url : BASEURL + '/wxHospital/queryHospitalList'
        })
    },
    queryDeptTypeByHospitalId(hospitalId){  //查询科室列表
        var modal = {
            hospitalId:hospitalId
        };
        !hospitalId && (modal = undefined)
        return fetch({
            url : BASEURL + '/wxDeptType/queryDeptTypeByHospitalId',
            data : modal
        })
    },
    queryWxGoodsAndPurchaseNum(){  //查询会员服务列表
        return fetch({
            url : BASEURL + '/goods/queryWxGoodsAndPurchaseNum'
        })
    },
    getWxGoodsDetail(modal){  //查询会员服务详情
        return fetch({
            url : BASEURL + '/goods/getWxGoodsDetail',
            data : modal
        })
    },
    createGoodsOrder(modal){  //创建套餐订单
        return fetch({
            url : BASEURL + '/goods/createGoodsOrder',
            data : modal
        })
    },
    wxGoodsOrderDetail(modal){  //套餐订单详情数据
        return fetch({
            url : BASEURL + '/goods/wxGoodsOrderDetail',
            data : modal
        })
    },
    goodsPay(modal){  //用套餐余额支付
        return fetch({
            url : BASEURL + '/wxpay/goodsPay',
            data : modal
        })
    },
    uploadImg(data,callback){
        $.ajax({
            type: 'POST',
            url: UPLOADIMGURL + 'live/uploadImg',
            data: data,
            contentType: false,
            processData: false,
            complete: function (XMLHttpRequest, textStatus) {
                var json = '';
                try{
                    json = JSON.parse(XMLHttpRequest.responseText);
                }catch(e){
                    json = {
                        code : '99999',
                        msg : '服务器错误'
                    }
                }
                callback(json,textStatus);
            }
        })
    },
    wtemplatelist(suid,callback){
        $.ajax({
            type:'post',
            url: FUBASEURL + '/app/v2/wfollowup',
            data : {
                METHOD:'wtemplatelist',
                PHONE:'10000000000',
                SIGN:Date.now(),
                TOKEN:"70b0877082184a1584347abd5a5f93af1499766674417",
                RECDATA:JSON.stringify({suid:suid}),
                REQTIME:Date.now(),
                CTYPE:"pc",
                USERTYPE:"2",
                VERSION:"2.0"
            },
            complete: function (XMLHttpRequest) {
                let json = '';
                try{
                    json = JSON.parse(XMLHttpRequest.responseText);
                }catch(e){
                    json = {
                        code : '99999',
                        msg : '服务器错误'
                    }
                }
                callback(json);
            }
        })
    },
    commitTemplateBaseInfo(modal,cb){
        $.ajax({
            type:'post',
            url: FUBASEURL + '/app/v2/wfollowup',
            data : {
                METHOD:'wplansetrow',
                PHONE:'10000000000',
                SIGN:Date.now(),
                TOKEN:"70b0877082184a1584347abd5a5f93af1499766674417",
                RECDATA:JSON.stringify(modal),
                REQTIME:Date.now(),
                CTYPE:"pc",
                USERTYPE:"2",
                VERSION:"2.0"
            },
            complete: function (XMLHttpRequest) {
                let json = '';
                try{
                    json = JSON.parse(XMLHttpRequest.responseText);
                }catch(e){
                    json = {
                        code : '99999',
                        msg : '服务器错误'
                    }
                }
                cb(json);
            }
        })
    },

    orderPay(orderId,openId){ //预支付页面
        return fetch({
            url: BASEURL + '/order/preparePayOrder',
            data:{
                "orderId" : orderId,
                "openId":openId
            }
        })
    },
    cancelOrder(orderId,openId){ //取消订单
        return fetch({
            url: BASEURL + '/order/cancelOrder',
            data:{
                orderId:orderId,
                openId:openId
            }
        })
    },
    queryMyWxGoods(openId){
        return fetch({
            url: BASEURL + '/goods/queryMyWxGoods',
            data:{
                openId:openId
            }
        })
    },
    queryAddressList(location){ //查询附近执业点列表
        var modal = {};
        if(location) modal.location = location;
        return fetch({
            url: BASEURL + '/expertConsultationAddress/queryAddressList',
            data : modal
        })
    },
    queryDeptList(){
        return fetch({
            url: BASEURL + '/expertConsultation/queryDeptList',
            data:{}
        })
    },
    getServiceAgreement(id){
        return fetch({
            url : BASEURL + '/wxjs/getServiceAgreement',
            data:{
                wxGoodsId : id
            }
        })
    }

}