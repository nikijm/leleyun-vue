<template>
    <div id="payResult">
        <div id="success" v-if="showType==1">
            <img src="../assets/icon_pay_successed@2x.png" alt="pay">
            <p class="pay-title">支付成功</p>
            <p class="pay-info">{{modal.msg || '购买成功'}}</p>
            <router-link :to="modal.url" class="btn">{{modal.btnText || '查看预约详情'}}</router-link>
        </div>
        <div id="fail" v-if="showType==2">
            <img src="../assets/icon_pay_faild@2x.png" alt="pay">
            <p class="pay-title">支付失败</p>
            <p class="pay-info">{{modal.msg || '由于系统繁忙，本次支付失败'}}<br>联系医助电话：<a href="tel:4001816106">400-181-6106</a></p>
            <a class="btn" href="javascript:history.go(-1);">返回重试</a>
        </div>
        <div id="failVip" v-if="showType==3">
            <img src="../assets/icon_pay_successed@2x.png" alt="pay">
            <p class="pay-title">支付成功</p>
            <p class="pay-info">{{modal.msg || '购买成功'}}</p>
            <router-link :to="modal.url" class="btn">查看会员特权</router-link>
        </div>
        <div id="loginSuccess" v-if="showType==4">
            <img src="../assets/icon_login_successed@2x.png" alt="pay">
            <p class="pay-title">绑定成功</p>
            <p class="pay-info">3s后自动返回上一页</p>
        </div>
        <div id="loginError" v-if="showType==5">
            <img src="../assets/icon_login_faild@2x.png" alt="pay">
            <p class="pay-title">绑定失败</p>
            <p class="pay-info" v-html="modal.msg || '验证码错误/失效，<br>请重新获取获证码登录'"></p>
            <a class="btn" href="javascript:history.go(-1);">返回重试</a>
        </div>
    </div>
</template>
<script>
    export default{
        computed:{
            showType(){
                return this.$route.params.type;
            },
            modal(){
               if(typeof JSON.parse(decodeURIComponent(this.$route.params.modal)) === 'object'){
                   return JSON.parse(decodeURIComponent(this.$route.params.modal))
               }else{
                   return {}
               }
            }
        },
        mounted:function () {
            this.changeTitle();
        },
        methods:{
            changeTitle(){
                if(this.showType == 1 || this.showType ==3){
                    document.title = '支付成功'
                }else if(this.showType == 2){
                    document.title = '支付失败'
                }else if(this.showType == 4){
                    document.title = '绑定成功';
                    setTimeout(function () {
                        history.go(-1);
                    },3000);
                }else if(this.showType == 5){
                    document.title = '绑定失败'
                }
            }
        }
    }
</script>
<style lang="less">
    #payResult{
        font-size: 12px;
        text-align: center;
        img{width: 1.77rem;margin-top: .6rem}
        .pay-title{margin-top: .3rem;color: #333;font-size: .2rem;margin-bottom: .1rem}
        .pay-info{color: #666;font-size: .14rem;margin-bottom: .3rem;line-height: .22rem}
        .pay-info span,.pay-info a{color: #4facfe}
        .btn{display:inline-block;height: .44rem;width: 1.88rem;color: #01A7E1;font-size: .18rem;line-height: .44rem;text-align: center;
            position: relative;border-radius: .35rem;border: 1px solid #01A7E1}
    }
</style>