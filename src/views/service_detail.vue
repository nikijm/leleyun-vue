<template>
    <div id="serviceDetail">
        <img :src="IMGURL+'/'+modal.coverUrl" alt="" class="top-banner">
        <div class="service-info" v-if="modal.payType!=2">
            <div class="left">
                <p class="title">{{modal.name}}</p>
                <p class="price">
                    <span class="new"><span>{{modal.actualPrice | currency}}</span></span>
                    <span class="old"><span>{{modal.price | currency}}</span></span>
                </p>
                <p class="right" v-if="modal.liveTime<12">{{modal.liveTime>0?modal.liveTime+'个月服务':'永久'}}</p>
                <p class="right" v-if="modal.liveTime>=12">{{Math.floor(modal.liveTime/12)}}年{{modal.liveTime%12>0?modal.liveTime+'个月':''}}服务</p>
            </div>
        </div>
        <div class="service-info service-order" v-if="modal.payType == 2">
            <div class="left">
                <p class="title">{{modal.name}}</p>
                <p class="price">
                    <span class="new">订金<span >{{modal.earnestMoney | currency}}</span></span>
                    <!--<span class="old">总价<span>{{modal.actualPrice | currency}}</span></span>-->
                </p>
                <p class="right" v-if="modal.liveTime<12">{{modal.liveTime>0?modal.liveTime+'个月服务':'永久'}}</p>
                <p class="right" v-if="modal.liveTime>=12">{{Math.floor(modal.liveTime/12)}}年{{modal.liveTime%12==0?'':modal.liveTime%12+'个月'}}服务</p>
            </div>
        </div>
        <div class="divide"></div>
        <div class="detail-title">
            套餐详情
        </div>
        <div class="service-detail" v-html="modal.description"></div>
        <div class="btn-group">
            <a href="tel:4001816106" class="contact">
                <img src="../assets/dibu_vip_icon_lianxiyizhu@2x.png" alt=""><span>联系医助</span>
            </a>
            <a href="javascript:;" class="buy" @click="buyNow">立即购买</a>
        </div>
        <popup v-model="showPopup">
            <div class="popup-box">
                <div class="service-item">
                    <img :src="IMGURL+'/'+modal.coverUrl" alt="" class="cover">
                    <div class="right">
                        <p class="title">{{modal.name}}</p>
                        <p class="count">
                            {{modal.purchaseNum || 0}}人购买
                        </p>
                        <p class="price">
                            <template v-if="modal.payType!=2">
                                <span class="new" style="font-weight: bold">{{modal.actualPrice | currency}}</span>
                                <span class="old">{{modal.price | currency}}</span>
                            </template>
                            <template v-if="modal.payType == 2">
                                <span class="new">订金<span style="font-weight: bold">{{modal.earnestMoney | currency}}</span></span>
                                <span class="old all">总价{{modal.actualPrice | currency}}</span>
                            </template>
                        </p>
                    </div>
                </div>
                <group>
                    <x-input label-width=".84rem" id="patientName" v-model="name" :title='`<span>真实姓名</span>`' placeholder="请输入姓名"></x-input>
                    <!--<x-input label-width=".84rem"  v-model="idCard" :title='`<span>身份证号</span>`' placeholder="请输入您的真实身份证号码"></x-input>-->
                    <x-input label-width=".84rem" disabled v-model="modal.cellPhone" :title='`<span>电话号码</span>`'></x-input>
                </group>
                <a href="javascript:;" class="buy-next" :class="{active:activeNextStepBtn}" @click="nextStep">下一步</a>
            </div>
        </popup>
    </div>
</template>
<script>
    import {Popup,Group,XInput} from 'vux'
    import api from '../server'
    export default{
        components:{
            Popup,
            Group,
            XInput,
        },
        data(){
            return {
                showPopup : false,
                name : '',
                IMGURL:api.BASEIMGURL.replace(/\/$/,''),
                modal:{},
                idCard:''
            }
        },
        computed:{
            activeNextStepBtn(){
                return this.name
            }
        },
        created:function () {
            const _this = this;
            api.getWxGoodsDetail({
                wxGoodsId :this.$route.params.id,
                openId : this.$store.state.openId
            }).then(function (res) {
                if(res.code === '000'){
                    _this.modal = res.data;
                    document.title = _this.modal.name;
                }
            })
        },
        methods : {
            buyNow(){
                if(this.$store.state.userId && this.modal.cellPhone){
                    var id = this.$route.params.id;
                    this.$router.push('/serviceinfo/'+id)
//                    this.showPopup = true
                }else{
                    location.href='/?service='+this.$route.params.id+'#/login'
                }
            },
            nextStep(){

//                const _this = this;
//                if(!this.name){
//                    this.$vux.toast.text('请输入您的名字','top');
//                    return false;
//                }
//                if(!this.idCard){
//                    this.$vux.toast.text('请输入您的身份证号码','top');
//                    return false
//                }
//                var reg = /(^\d{15}$)|(^\d{17}([0-9]|X)$)/;
//                if(!reg.test(this.idCard)){
//                    this.$vux.toast.text('请输入正确的身份证号码','top');
//                    return false;
//                }
//                api.createGoodsOrder({
//                    openId : _this.$store.state.openId,
//                    wxGoodsId : _this.$route.params.id,
//                    userName : _this.name
//                }).then(function (res) {
//                    if(res.code === '000'){
//                        _this.$router.push('/orderpay/'+res.data.orderId);
//                    }
//                })
            }
        }
    }
</script>
<style lang="less">
    #serviceDetail{
        font-size: 0;
        .divide{width: 100%;height: .1rem;background-color: #f2f2f2;}
        .top-banner{width: 3.55rem; height: 2rem; margin: .1rem; display: block;}
        .service-info{overflow: hidden; padding: .15rem .12rem;}
        .service-info .left{float: left;position: relative;width: 100%;}
        .service-info .title{font-size: .18rem;color: #333;margin-bottom: .06rem;}
        .service-info .price{}
        .service-info .price .new{font-size: .16rem;color: #fe7b4f;margin-right: .1rem;}
        .service-info .price .old{font-size: .12rem;color: #999;text-decoration: line-through;}
        .service-info.service-order .price .old{font-size: .16rem;text-decoration: none}
        .service-info:not(.service-order) .new{font-weight: bold}
        .service-order .new span{font-weight: bold}
        .service-order>img{width: 100%;margin-top: .1rem}
        .service-info .right{position: absolute; font-size: .14rem; color: #666; margin-top: .2rem; right: .12rem; bottom: 0;}
        .service-detail{padding-bottom: .49rem;word-break:break-all;font-size: .14rem;img{max-width: 100%}}
        .btn-group{position: fixed;left:0;bottom:0;width: 100%;height: .49rem;line-height: .49rem;}
        .btn-group>a{float: left;width: 50%;height: 100%;text-align: center;}
        .btn-group .contact{font-size: .16rem;color: #666;border-top:1px solid #e9e9e9;background: #fff;}
        .btn-group .contact>img{width: .25rem;height: .27rem;vertical-align: middle;margin-right: .12rem;}
        .btn-group .buy{color: #fff; font-size: .18rem; background-image: linear-gradient(to left, #5dd0f8, #01A7E1);display: block;}
        .popup-box{background: #fff;overflow: hidden;}
        .service-item{border-bottom: 1px solid #e9e9e9; margin-left: .12rem; padding: .13rem 0;display: block;}
        .service-item .cover{width: 1.3rem;height: .73rem;border-radius: .04rem;vertical-align: top;}
        .service-item .right{display: inline-block;width: 2rem;margin-left: .12rem;position: relative; top: -.02rem;}
        .service-item .right .title{font-size: .16rem;color: #333;margin-bottom: .16rem;}
        .service-item .right .count{background-image:url(../assets/vip_icon_person@2x.png);background-size: .16rem;background-repeat: no-repeat;
            font-size: .12rem;color: #999;padding-left: .22rem;margin-bottom: .06rem;}
        .service-item .right .price{}
        .service-item .right .price .new{font-size: .14rem;color: #fe7b4f;margin-right: .13rem;}
        .service-item .right .price .old{font-size: .12rem;color: #999;text-decoration: line-through;}
        .service-item .right .price .old.all{font-size: .14rem;text-decoration: none}
        .detail-title{font-size: .14rem;color: #666;height: .4rem;line-height: .4rem;padding-left: .12rem;border-bottom: 1px solid #e9e9e9;}

        .weui-cells{margin-top: 0;}
        .weui-cells:before,.weui-cells:after{display: none;}
        .weui-label{font-size: .16rem;color: #666;}
        .weui-input{color: #333;}
        .weui-input[readonly]{color: #aaa;}
        .weui-cell{padding: .12rem .12rem; height: .48rem; box-sizing: border-box;}
        ::-webkit-input-placeholder{color: #ccc;font-size: .16rem;}
        .buy-next{color: #fff; font-size: .18rem;  display: block;background:#dfdfdf;
            padding: 0.12rem 0; text-align: center;}
        .buy-next.active{background: linear-gradient(to left, #5dd0f8, #01A7E1);}
    }
</style>