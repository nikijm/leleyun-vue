<template>
    <div id="serviceOrderDetail">
        <div class="header">
            <img src="../assets/icon_yuyue_weikuanzhifu@2x.png" alt="book"><span>{{modal.statusName}}</span>
        </div>
        <div class="order-box">
            <div class="top">
                <div class="doc-info">
                    <img src="../assets/mine_order_icon_vip@2x.png">
                    <div class="info-inner">
                        <p>{{modal.name}}</p>
                        <p>{{modal.liveTime}}</p>
                    </div>
                    <span class="price">￥{{modal.price}}</span>
                </div>
            </div>
            <div class="foot">
                <div class="left">
                    <p>订单号：</p>
                    <p>订单金额：</p>
                    <p>下单时间：</p>
                </div>
                <div class="right">
                    <p>{{modal.orderNo}}</p>
                    <p>¥ {{modal.orderPrice}}</p>
                    <p>{{modal.orderTime}}</p>
                </div>
            </div>
        </div>
        <div class="divide" v-if="modal.wxGoodsType == 2"></div>
        <div class="info" v-if="modal.wxGoodsType == 2">
            <timeline>
                <timeline-item>
                    <h4 class="recent"><span class="small">阶段一：</span>{{modal.earnestMoneyStatusName}}</h4>
                    <p class="recent">
                        <span class="gray">服务套餐订金<span class="price">￥{{modal.earnestMoney}}</span></span>
                        <span class="black">订金实付款<span class="price">￥{{modal.payEarnestMoney}}</span></span>
                    </p>
                </timeline-item>
                <timeline-item>
                    <h4 class="recent"><span class="small">阶段二：</span>{{modal.finalPaymentStatusName}}</h4>
                    <p class="recent">
                        <span class="gray">服务套餐尾款<span class="price">￥{{modal.finalMoney}}</span></span>
                        <span class="black">尾款实付款<span class="price">￥{{modal.payFinalMoney}}</span></span>
                    </p>
                </timeline-item>
            </timeline>
        </div>
        <!--定金支付-->
        <div class="footer" v-if="modal.status==10">
            <div>
                <a :href="'#/orderpay/'+modal.orderId" v-on:click.stop>订金支付</a>
            </div>
        </div>
        <!--尾款支付-->
        <div class="footer" v-if="modal.status==12">
            <div>
                <a :href="'#/orderpay/'+modal.orderId" v-on:click.stop>尾款支付</a>
            </div>
        </div>
    </div>
</template>
<script>
    import {Timeline, TimelineItem,dateFormat} from 'vux'
    import api from '../server'
    export default{
        components:{
            Timeline,
            TimelineItem
        },
        methods:{

        },
        data(){
            return{
                defaultImg: 'this.src="' + require('../assets/head_default@2x.png') + '"',//默认图片
                IMGURL:api.BASEIMGURL,
                modal : {}
            }
        },
        computed:{

        },
        mounted:function () {
            const _this = this;
            api.wxGoodsOrderDetail({
                openId : _this.$store.state.openId,
                orderId : _this.$route.params.id
            }).then(function (res) {
                if(res.code === '000'){
                    res.data.orderTime =  dateFormat(new Date(res.data.orderTime),'YYYY-MM-DD');
                    _this.modal = res.data;
                }
            })
        }
    }
</script>
<style lang="less">
    #serviceOrderDetail{
        font-size: 12px;
        .header{text-align: center;color: #fff;font-size: .16rem;width: 100%;height: .6rem;background-image: url("../assets/bg_@2x.png");
                background-size: 100% 100%;line-height: .6rem;vertical-align: middle}
        .header img{width: .2rem;height: .19rem;margin-right: .05rem; vertical-align: middle}
        .header span{display: inline-block;height: 100%;vertical-align: middle;}
        .order-box{padding: .1rem .12rem}
        .top{padding: .18rem .1rem .12rem .1rem;background-color: #f6f6f6;border-top-left-radius: 4px;border-top-right-radius: 4px;
                box-shadow: 0 -4px 7px 1px #f2f2f2}
        .top>div{width: 100%;overflow: hidden;position: relative;}
        .top>div>*{float: left}
        .doc-info img{width: .48rem;height: .48rem;border-radius: .48rem;margin-right: .08rem}
        .info-inner{width: calc(~'100% - .56rem')}
        .info-inner p:first-child{font-size: .16rem;color: #333;margin-bottom: .08rem;}
        .info-inner p:last-child{font-size: .14rem;color: #666;}
        .doc-info .price{position: absolute;color: #333;font-size: .16rem;right: 0;bottom:.02rem;}
        .top>p{font-size: .14rem;color: #666;margin-top: .12rem;}
        .top>p span{color: #fe7b4f}
        .foot{padding: .12rem;background-color: #fff;box-shadow: 0 5px 7px 1px #f2f2f2;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;
                overflow: hidden;}
        .foot>div{float: left;line-height: .24rem;font-size: .14rem;}
        .foot .left{color: #999;font-size: .14rem;}
        .foot .right{color: #666;margin-left: .12rem;}

        .divide{width: 100%;height: .1rem;background-color: #f2f2f2}

        .info{width: 100%;overflow: hidden}


        .footer{position: fixed;width: 100%;max-width: 750px;bottom: 0;text-align: center;height: .5rem;line-height: .5rem;background-color: #fff;box-shadow: 0 -1px 7px 1px #f2f2f2}
        .footer a{display: inline-block;height: .3rem;width: .96rem;border: 1px solid #ccc;border-radius: 1rem;line-height: .3rem;margin-right: .1rem;font-size: .14rem;}
        .footer a.active{border: 1px solid #01A7E1;color: #01A7E1}
        .footer a.gray{color: #fff;background:#dfdfdf;border-color:#dfdfdf;}

        .vux-timeline{padding:.12rem;}
        .vux-timeline-item{margin: 0;width: 100%;}
        .vux-timeline-item-content{padding: 0;margin-left: .22rem;margin-bottom: .26rem;}
        .vux-timeline-item-content h4{color:#01a7e1;font-size: .14rem;margin-bottom: .14rem;font-weight: normal;}
        .vux-timeline-item-content h4 .small{font-size: .12rem;}
        .vux-timeline-item-content p {display: block;}
        .vux-timeline-item-content p>span{display: block;font-size: .14rem;margin-bottom: .12rem;}
        .vux-timeline-item-content p>span.gray{color: #999;}
        .vux-timeline-item-content p>span.black{color: #666;}
        .vux-timeline-item-content p>span .price{float: right}
        .vux-timeline-item-content p>span.black .price{color: #fe7b4f;}
        .vux-timeline-item-head-first i{display: none}
        .vux-timeline-item-head,.vux-timeline-item-head-first{left:.01rem;top:.04rem;width: .06rem;height: .06rem;background-color: #01a7e1;}
        .vux-timeline-item-tail { width: 0;position: absolute; height: 100%; left: .03rem; top: .05rem; border-right: .02rem dotted #dfdfdf;background-color: transparent;}
    }
</style>