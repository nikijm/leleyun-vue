<template>
    <div>
        <div class="banner">
            <img src="../assets/yunchan_banner@2x.png" alt="">
        </div>
        <div class="service">
            <img src="../assets/tesefuwu@2x.png" alt="">
        </div>
        <div class="divide"></div>
        <div class="service-info">
            <p class="title">服务简介</p>
            <p class="text">
                孕产期妈妈们会有很多需要咨询医生的问题，但是医院的大门总是
                孕产期妈妈们会有很多需要咨询医生的问题，但是医院的大门总是
            </p>
        </div>
        <div class="divide"></div>
        <div class="service-object">
            <p class="title">服务对象</p>
            <div class="tag-box">
                <span class="tag-item">高危妊娠</span>
                <span class="tag-item">高危妊娠娠</span>
                <span class="tag-item">高危妊娠</span>
                <span class="tag-item">高危</span>
                <span class="tag-item">高危</span>
                <span class="tag-item">高危</span>
                <span class="tag-item">高危</span>
                <span class="tag-item">高危</span>
            </div>
        </div>
        <div class="divide"></div>
        <div class="service-vip-banner">
            <img src="../assets/yunchan_vip@2x.png" alt="">
        </div>
        <div class="divide"></div>
        <div class="doctor-list">
            <p class="title">首席推荐专家</p>
            <router-link v-for="(one,key) in list" :key="one" :to="'/doctordetail/0/'+one.doctorId" class="recommend-list">
                <img :src="IMGURL+one.doctorPhoto+'@120w_120h_90Q.jpg'" :onerror="defaultImg">
                <div class="info">
                    <p>{{one.doctorName}} <span>{{one.doctorTitle}}</span></p>
                    <p>{{one.hospitalName}} {{one.deptName}}</p>
                    <p>擅长：{{one.goodAt || '暂无'}}</p>
                </div>
            </router-link>
        </div>
    </div>
</template>
<script>
    import api from '../server'
    export default{
        data(){
            return{
                list : [
                    {"deptName":"产科","doctorId":334,"doctorName":"侯景","doctorPhoto":"certificate/20150825/ea70dd758ef3450eae91cd1d26d774d7.png","doctorTitle":"教授","doctorUserId":788,"goodAt":"腹部肿瘤","hasNumber":1,"hospitalName":"四川大学华西第四医院","nearlyDay":1498752000000,"orderNum":0,"surplusNum":1000026},
                    {"deptName":"呼吸内科","doctorId":335,"doctorName":"李江","doctorPhoto":"old/base/20150420/dengjianjun.jpg","doctorTitle":"主任医师","doctorUserId":789,"goodAt":"呼吸病","hasNumber":1,"hospitalName":"四川大学华西第四医院","nearlyDay":1499097600000,"orderNum":0,"surplusNum":15}],
                defaultImg: 'this.src="' + require('../assets/head_default@2x.png') + '"',//默认图片
                IMGURL:api.BASEIMGURL
            }
        },
        mounted : function () {
            document.title = this.$route.params.name;
        }
    }
</script>
<style scoped>
    .banner{height: 1.5rem;}
    .banner>img,.service>img,.service-vip-banner>img{width: 100%;height: 100%;}
    .service{height: 1.27rem;}
    .divide{width: 100%;height: .1rem;background-color: #f2f2f2;}
    .service-info{padding: .14rem .12rem;}
    .service-info .title{font-size: .14rem;color: #333;margin-bottom: .08rem;}
    .service-info .text{font-size: .14rem;color: #666;line-height: 1.6;}
    .service-object{padding: .14rem .12rem .05rem;}
    .service-object .title{font-size: .14rem;color: #333;margin-bottom: .14rem;}
    .tag-box{overflow: hidden;}
    .tag-item{float: left;padding: .05rem .12rem;text-align: center;color: #666;
        font-size: .14rem;margin: 0 .1rem .1rem 0;background: #f2f2f2;border-radius: .35rem;}
    .service-vip-banner{height: .94rem;font-size: 0;}
    .doctor-list{padding:0 .12rem; }
    .doctor-list .title{font-size: .14rem;color: #666;height: .4rem;line-height: .4rem;border-bottom: 1px solid #f2f2f2;}
    .recommend-list{padding: .12rem 0;width: 100%;overflow: hidden;display: block;}
    .recommend-list+.recommend-list{padding-top:0;}
    .recommend-list>*{float: left}
    .recommend-list img{width: .48rem;height: .48rem;margin:0 .1rem;border-radius: 50%;}
    .recommend-list>div{width: calc(100% - .68rem);}
    .recommend-list:not(:last-child) .info{border-bottom: 1px solid #ececec}
    .info p:first-child{color: #333;font-size: .16rem;margin-bottom: .05rem}
    .info p:first-child span{color: #666;font-size: .14rem}
    .info p:nth-of-type(2){color: #333;font-size: .14rem;margin-bottom: .03rem;}
    .info p:last-child{color: #999; font-size: .12rem; line-height: .2rem; margin-bottom: .08rem; height: .2rem;
        overflow: hidden; text-overflow: ellipsis; white-space: nowrap;}
</style>
