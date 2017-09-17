<template>
    <div id="orderPay">
        <div class="surplus-box" v-if="info.status != 5 && info.status != 6">
            <p class="title">支付剩余时间：</p>
            <p class="time-box">
                <clocker :time="new Date(info.orderTime + 14.8*60000 + 8*3600000).toISOString().replace(/T|\..*$/g,' ').trim()" slot="value">
                    <span class="day">%_H1</span>
                    <span class="day">%_H2</span> :
                    <span class="day">%_M1</span>
                    <span class="day">%_M2</span> :
                    <span class="day">%_S1</span>
                    <span class="day">%_S2</span>
                </clocker>
            </p>
        </div>
        <div class="divide"></div>
        <div class="service-box" v-if="info.orderType === 'suite'">
            <p class="title">购买内容</p>
            <div class="service-desc">
                <p v-for="one in info.goodsDetail.services">{{one}}</p>
            </div>
            <div class="service-info">
                <span class="name">{{info.goodsDetail.goodsName}}</span>
                <span class="price">￥{{info.price || '0'}}</span>
            </div>
        </div>
        <div class="service-box" v-if="info.orderType != 'suite'">
            <p class="title">服务内容</p>
            <div class="recommend-list">
                <img :src="IMGURL+info.headPhoto+'@120w_120h_90Q.jpg'" :onerror="defaultImg" alt="">
                <div class="info">
                    <p>{{info.userName || ''}} <span>{{info.titleName || ''}}</span></p>
                    <p>{{info.hospitalName || ''}} {{info.deptName || ''}}</p>
                    <p>擅长：{{info.goodAt || '暂无'}}</p>
                    <div class="service-info">
                        <span class="name" v-if="info.orderType === 'expertConsultation'">专家一对一服务</span>
                        <span class="name" v-if="info.orderType === 'reservationPhone'">名医电话</span>
                        <span class="price">￥{{info.price || '0'}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="divide"></div>
        <div class="pay-type-box">
            <p class="title">选择支付方式</p>
            <div class="pay-type-list">
                <a href="javascript:;" class="pay-type-item" v-for="(one,index) in info.goodsPurchase" :class="{disabled:one.disabled}" @click="changePayType('vip',index,one.disabled)">
                    <img src="../assets/pay_icon_vip@2x.png" alt="" :style="{opacity:(index!=0 && '0')}">
                    <!--<img src="../assets/pay_icon_vip_buzuyue@2x.png" v-if="one.disabled" alt="" :style="{opacity:(index!=0 && '0')}">-->
                    <div class="pay-type-info">
                        <span class="name">{{one.name}}</span>
                        <span class="surplus-count">余额：{{one.balance}}元</span>
                        <span class="tips">（余额不足）</span>
                        <icon type="circle" v-show="payType=='wechat'"></icon>
                        <icon type="circle" v-show="payType=='vip' && !(one.wxGoodsPurchaseId == choiceGoodsId)"></icon>
                        <icon type="success" v-show="payType=='vip' && (one.wxGoodsPurchaseId == choiceGoodsId)"></icon>
                    </div>
                </a>
                <a href="javascript:;" class="pay-type-item" @click="changePayType('wechat')">
                    <img src="../assets/pay_icon_chat@2x.png" alt="">
                    <div class="pay-type-info">
                        <span class="name">微信支付</span>
                        <icon type="circle" v-show="payType=='vip'"></icon>
                        <icon type="success" v-show="payType=='wechat'"></icon>
                    </div>
                </a>
            </div>
        </div>
        <a href="javascript:;" class="enter-btn" @click="enterPay">{{btnText}}</a>
    </div>
</template>
<script>
    import { Clocker,Icon } from 'vux'
    import api from '../server'
    export default{
        data(){
            return{
                btnText : '会员抵扣',
                defaultImg: 'this.src="' + require('../assets/head_default@2x.png') + '"',
                IMGURL:api.BASEIMGURL,
                info : {},
                payType : '',
                choiceGoodsId : ''
            }
        },
        mounted : function () {
            const _this = this;
            api.orderPay( this.$route.params.id,this.$store.state.openId).then(function (res) {
                if(res.code === '000'){
                    if(res.data.orderType === 'suite'){
                        if(!res.data.orderTime){
                            res.data.orderTime = 0;
                        }
                        _this.payType = 'wechat';
                        _this.info = res.data;
                    }else{
                        if(!res.data.orderTime){
                            res.data.orderTime = 0;
                        }
                        _this.payType = 'wechat';
                        res.data.goodsPurchase.map(function (item) {
                            if(+item.balance < +res.data.price){
                                item.disabled = true;
                            }
                            else {
                                _this.payType = 'vip';
                                if(!_this.choiceGoodsId) {
                                    _this.choiceGoodsId = item.wxGoodsPurchaseId;
                                }
                            }
                        });
                        _this.info = res.data;
                        if(_this.info.status != 5 && _this.info.status != 6 && Date.now() - new Date(res.data.orderTime).getTime() > 15*60000){
                            _this.$vux.toast.text('订单已过期<br>即将返回订单列表', 'top');
                            setTimeout(function () {
                                _this.$router.push('/myorder');
                            },2000);
                        }
                    }
                }
            })
        },
        watch : {
            payType : function (val) {
                if(val === 'wechat'){
                    this.btnText = '￥'+ this.info.price +'  确认支付';
                }else{
                    this.btnText = '会员抵扣';
                }
            }
        },
        components : {
            Clocker,
            Icon
        },
        methods : {
            changePayType : function (str,index,disabled) {
                var _this = this;
                if(!disabled){
                    this.info.goodsPurchase.map(function (item,i) {
                        if(index === i){
                            _this.choiceGoodsId = item.wxGoodsPurchaseId;
                        }
                    });
                    this.payType = str;
                }
            },
            enterPay : function () {
                const _this = this;
                if(this.payType === 'wechat'){
                    api.wxPay({
                        orderId : _this.$route.params.id,
                        openId : _this.$store.state.openId
                    }).then(function (res) {
                        if(res.code === '000'){
                            const data = JSON.parse(res.data);
                            _this.$wechat.chooseWXPay({
                                timestamp : data.timeStamp,
                                nonceStr : data.nonceStr,
                                package : data.package,
                                signType : data.signType,
                                paySign : data.paySign,
                                success : function () {
                                    api.wxPayCallBack({
                                        orderId : _this.$route.params.id,
                                        openId : _this.$store.state.openId
                                    }).then(function (res) {
                                        if(res.code === '000'){
                                            if(_this.info.orderType === 'reservationPhone')
                                                _this.$router.replace('/requestresult/1/'+encodeURIComponent(JSON.stringify({msg:'你已经成功订购医生名医电话服务',url:'/phoneorderdetail/'+_this.$route.params.id})));
                                            else if(_this.info.orderType === 'expertConsultation')
                                                _this.$router.replace('/requestresult/1/'+encodeURIComponent(JSON.stringify({msg:'你已经成功订购医生一对一服务',url:'/oneorderdetail/'+_this.$route.params.id})));
                                            else if(_this.info.orderType === 'suite')
                                                _this.$router.replace('/requestresult/1/'+encodeURIComponent(JSON.stringify({msg:'你已经成功购买'+_this.info.goodsDetail.goodsName,url:'/serviceorderdetail/'+_this.$route.params.id,btnText:'查看订单'})));
                                        }else{
                                            _this.$router.push('/requestresult/2/'+encodeURIComponent(JSON.stringify({msg:res.msg})));
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
                else if(this.payType === 'vip'){
                    api.goodsPay({
                        orderId : _this.$route.params.id,
                        openId : _this.$store.state.openId,
                        wxGoodsPurchaseId : _this.choiceGoodsId
                    }).then(function (res) {
                        if(res.code === '000'){
                            if(_this.info.orderType === 'reservationPhone')
                                _this.$router.replace('/requestresult/1/'+encodeURIComponent(JSON.stringify({msg:'你已经成功订购医生名医电话服务',url:'/phoneorderdetail/'+_this.$route.params.id})));
                            else if(_this.info.orderType === 'expertConsultation')
                                _this.$router.replace('/requestresult/1/'+encodeURIComponent(JSON.stringify({msg:'你已经成功订购医生一对一服务',url:'/oneorderdetail/'+_this.$route.params.id})));
                        }else{
                            _this.$router.push('/requestresult/2/'+encodeURIComponent(JSON.stringify({msg:res.msg})));
                        }
                    })
                }
            }
        }
    }
</script>
<style lang="less">
    #orderPay{
        font-size: 0;
        padding-bottom: .67rem;
        .divide{width: 100%;height: .1rem;background-color: #f2f2f2;}
        .surplus-box{font-size: .14rem;padding: .14rem .12rem;}
        .surplus-box .title{font-size: .14rem;color: #999;margin-bottom: .09rem;}
        .time-box{text-align: center;}
        .vux-clocker-tpl{color: #ccc;font-size: .2rem;}
        .vux-clocker-tpl .day{color: #333;border:1px solid #e9e9e9;border-radius: .02rem;display: inline-block;font-size: .16rem;
            width: .24rem;height: .24rem;text-align: center;line-height: .24rem;box-sizing: border-box;}

        .service-box{}
        .service-box .title{font-size: .14rem;color: #666;padding-left: .12rem;border-bottom:1px solid #f8f8f8;line-height: .39rem;}
        .service-desc{font-size: .14rem; color: #333; background: #f6f6f6; margin: 0 .12rem; padding: .1rem .12rem;}
        .service-desc+.service-info{margin:.14rem .12rem .12rem .12rem;}
        .service-desc+.service-info .price{margin-right:0;}

        .recommend-list{width: 100%;overflow: hidden;padding: .12rem 0 0;}
        .recommend-list>*{float: left}
        .recommend-list img{width: .48rem;height: .48rem;margin:0 .12rem;border-radius: 50%;}
        .recommend-list>div{width: calc(~'100% - .72rem');}
        .recommend-list:not(:last-child) .info{border-bottom: 1px solid #ececec}
        .info p:first-child{color: #333;font-size: .16rem;margin-bottom: .05rem;position: relative}
        .info p:first-child span{color: #666;font-size: .14rem}
        .info p:first-child .not-full,.info p:first-child .full{display: inline-block;padding: 0 .1rem;border-radius: 1rem;color: #fff;font-size: .14rem;
            background-color: #01A7E1;position: absolute;right: 0;height: .24rem;line-height: .24rem}
        .info p:first-child .full{background-color: #ccc;border-radius: .47rem;}
        .info p:nth-of-type(2){color: #333;font-size: .14rem;margin-bottom: .03rem;}
        .info p:nth-of-type(3){color: #999; font-size: .12rem; line-height: .2rem; padding-bottom: .08rem; height: .2rem;
            overflow: hidden; text-overflow: ellipsis; white-space: nowrap;border-bottom: 1px solid #f8f8f8;}
        .service-info{margin: .12rem 0;}
        .service-info .name{font-size: .14rem;color: #e2bc81;width: 80%;display: inline-block;overflow: hidden;word-wrap: normal;white-space: nowrap;text-overflow: ellipsis;}
        .service-info .price{font-size: .16rem;color: #fe8055;float: right;margin-right: .12rem;}

        .pay-type-box .title{font-size: .14rem;color: #666;padding-left: .12rem;border:1px solid #e9e9e9;line-height: .4rem;}
        .pay-type-item{height: .7rem;line-height: .7rem;display: block;}
        .pay-type-item.disabled {color: #999;}
        .pay-type-item.disabled .name{color: #999;}
        .pay-type-item.disabled .surplus-count{color: #999;}
        .pay-type-item.disabled i{display: none;}
        .pay-type-item.disabled .tips{vertical-align: middle;font-size: .14rem;color: #999;margin-left: .1rem;}
        .pay-type-item img{width: .3rem;height: .3rem;vertical-align: middle;margin: 0 .16rem;}
        .pay-type-item .pay-type-info{border-bottom: 1px solid #f8f8f8;display: inline-block;width: 3.1rem;position: relative;}
        .pay-type-item .name{vertical-align: middle; font-size: .16rem; color: #333; height: .21rem; line-height: .21rem; overflow: hidden; display: inline-block; max-width: 2.4rem;}
        .pay-type-item .surplus-count{position: absolute; color: #fe7b4f; font-size: .12rem; left: 0; bottom: -0.2rem;}
        .pay-type-item i{float: right;margin: .24rem .1rem 0;}
        .pay-type-item .weui_icon_success{color: #01A7E1}

        .enter-btn{border-radius: .35rem; color: #fff; font-size: .18rem; background-image: linear-gradient(to left, #5dd0f8, #01A7E1); text-align: center;
            padding: .1rem 0; position: fixed; bottom: .2rem; left: .25rem; right: .25rem;}
    }
</style>
