<template>
    <div id="vipReferral">
        <p class="referral-title">您的专属医疗服务人员</p>
        <p class="referral-text" v-html="showText"></p>
        <p class="flow" v-if="showtype=='预约转诊'">服务流程</p>
        <p class="flow-text" v-if="showtype=='预约转诊'">享受优质、便捷、精准、安全的就诊服务体验</p>
        <p class="divide" v-if="showtype=='预约转诊'"></p>
        <img src="../assets/icon_liucheng@2x.png" class="flow-img" v-if="showtype == '预约转诊'">
        <img src="../assets/yuyuezhuanzhen_tu@2x.png" class="foot-img">
        <a class="btn" @click="contact">联系医助</a>
    </div>
</template>
<script>
    export default{
        data(){
          return{
              showtype:this.$route.params.type,
          }
        },
        methods:{
            contact(){
                this.$vux.confirm.show({
                    title:'联系医助',
                    content:'拨打 <a style="color: #fe7b4f">400-181-6106</a> VIP专<br>线电话，进行'+this.showtype,
                    'confirmText':'我要拨打',
                    onConfirm (){
                        location.href = 'tel:4001816106'
                    }
                })
            }
        },
        created:function () {
            document.title = this.showtype
        },
        computed:{
            showText(){
                if(this.showtype == '预约转诊'){
                    return '提出您的需求，可随时联系，对接你需要的名医服务和医疗资源'
                }else if(this.showtype== '绿色入院'){
                    return '如病情需要，可联系医助，预约四川大学华西第二医院进行绿色入院服务'
                }else if(this.showtype == '专家挂号'){
                    return '您的专属医疗服务人员如病情需要，可联系医助，预约四川大学华西第二医院教授进行绿色就诊服务'
                }
            }
        }
    }
</script>
<style lang="less">
    #vipReferral{
        font-size: 12px;
        overflow: hidden;
        .referral-title{text-align: center;margin-top: .6rem;color: #e2bc81;font-size: .18rem;margin-bottom: .12rem;}
        .referral-text{text-align: center;color: #999;font-size: .14rem;line-height: .22rem;margin-bottom: .4rem;padding: 0 .4rem;}
        .flow{text-align: center;color: #666;font-size: .16rem;margin-bottom: .12rem;}
        .flow-text{text-align: center;color: #999;font-size: .12rem;margin-bottom: .18rem;}
        .divide{display:block;margin:0 auto;width: .5rem;height: 1px;border-top: 1px solid #e9e9e9;margin-bottom: .2rem;}
        .flow-img{width: 80%;margin-left: 10%;}
        .foot-img{position: fixed;width: 100%;height: 1.7rem;bottom: .44rem;left: 0;}
        .btn{position: fixed;left: 0;bottom: 0;width: 100%;height: .44rem;background-color: #e2bc81;
            text-align: center;line-height: .44rem;color: #fff;font-size: .18rem}
    }
    .weui-dialog{border-top:4px solid #e2bc81}
    .weui-dialog__btn_primary{color: #e2bc81!important;}

</style>