<template>
    <div id="phoneOrderDetail">
        <div class="header">
            <img src="../assets/booking_2@2x.png" alt="book"><span>{{phoneOrderDetail.statusName}}</span>
        </div>
        <div class="order-box">
            <div class="top">
                <div class="doc-info">
                    <img :src="IMGURL+phoneOrderDetail.headPhoto+'@120w_120h_90Q.jpg'" :onerror="defaultImg">
                    <div>
                        <p>{{phoneOrderDetail.userName}}<span>{{phoneOrderDetail.titleName}}</span></p>
                        <p>{{phoneOrderDetail.hospitalName}}<span>{{phoneOrderDetail.deptName}}</span></p>
                    </div>
                </div>
                <p>预约时间：<span>{{phoneOrderDetail.consultationTime || '等待客服确定通话时间'}}</span></p>
            </div>
            <div class="foot">
                <div class="left">
                    <p>订单号：</p>
                    <p>订单金额：</p>
                    <p>下单时间：</p>
                    <p v-if="phoneOrderDetail.endTime">完成时间：</p>
                </div>
                <div class="right">
                    <p>{{phoneOrderDetail.orderNo}}</p>
                    <p>¥{{phoneOrderDetail.price}}</p>
                    <p>{{phoneOrderDetail.orderTime }}</p>
                    <p v-if="phoneOrderDetail.endTime">{{phoneOrderDetail.endTime}}</p>
                </div>
            </div>
        </div>
        <div class="divide"></div>
        <div class="info">
            <div class="title">
                情况描述
            </div>
            <div class="info-text">
                {{phoneOrderDetail.comment || '暂无描述'}}
            </div>
            <div class="img-box">
                <img class="previewer-demo-img" v-for="(item,index) in phoneOrderDetail.img" :src="item.src" @click="show(index)" width="100px">
                <div v-transfer-dom v-if="phoneOrderDetail.img">
                    <previewer :list="phoneOrderDetail.img" ref="previewer" :options="options"></previewer>
                </div>
            </div>
        </div>
        <div class="phone">
            <p>如有疑问请拨打医助电话：<a href="tel:4001816106">400-181-6106</a></p>
            <p>医助上班时间：9:00-21:00</p>
        </div>
        <div class="footer">
            <div v-if="phoneOrderDetail.status == 5"><!--预约中-->
                <a :href="'#/phoneorder/'+phoneOrderDetail.doctorId+'/'+phoneOrderDetail.orderReservationPhoneId">编辑资料</a>
            </div>
            <div v-if="phoneOrderDetail.status == 6"><!--已预约-->
                <!--<a href="javascript:;">评价医生</a>-->
            </div>
            <div v-if="phoneOrderDetail.status == 7"><!--已完成-->
                <a v-if="phoneOrderDetail.canTalk=='1'" @click="contactDoctor(phoneOrderDetail.orderNo,phoneOrderDetail.userMobile)">联系医生</a>
                <a class="active" :href="'#/phoneorder/'+phoneOrderDetail.doctorId+'/0'">再次购买</a>
                <a class="active" :href="'#/evaluate/'+phoneOrderDetail.orderReservationPhoneId">评价医生</a>
            </div>
            <div v-if="phoneOrderDetail.status == 0"><!--未支付-->
                <a @click="cancelOrder">取消订单</a><a class="active" :href="'#/orderpay/'+orderId">去支付</a>
            </div>
            <!--已取消，预约取消，已评价-->
            <div v-if="phoneOrderDetail.status == 4 || phoneOrderDetail.status == 8 || phoneOrderDetail.status == 9">
                <a class="active" :href="'#/phoneorder/'+phoneOrderDetail.doctorId+'/0/'">再次购买</a>
            </div>
        </div>
    </div>
</template>
<script>
    import {Previewer,TransferDom} from 'vux'
    import api from '../server'
    export default{
        directives:{
            TransferDom
        },
        components:{
            Previewer
        },
        methods:{
            show(index){ //图片预览
                this.$refs.previewer.show(index)
            },
            cancelOrder(){ //取消订单
                const _this = this;
                this.$vux.confirm.show({
                    title: '您是否确认取消本次订单？',
                    content: '确认后本次订单将作废',
                    onConfirm  () {
                        api.cancelOrder(_this.$route.params.id, _this.$store.state.openId).then(function (res) {
                            if (res.code == '000') {
                                location.href = '#/myorder'
                            }
                        })
                    }
                });

            },
            contactDoctor: function (orderNo, phone) {
                const _this = this;
                this.$vux.confirm.show({
                    title: '联系医生',
                    content: '等待平台028开头号码呼入<br>' + phone + ',请保持电话畅通',
                    onConfirm  () {
                        api.customerTalk({
                            orderNo: orderNo,
                            wxOpenId: _this.$store.state.openId
                        }).then(function (res) {
                            if (res.code === '000') {

                            }
                        })
                    }
                });
            }
        },
        data(){
            return{
                options:{
                    getThumbBoundsFn(index) {
                        let thumbnail = document.querySelectorAll('.previewer-demo-img')[index];
                        let pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
                        let rect = thumbnail.getBoundingClientRect();
                        return {x:rect.left,y:rect.top + pageYScroll,w:rect.width}
                    }
                },
                defaultImg: 'this.src="' + require('../assets/head_default@2x.png') + '"',//默认图片
                IMGURL:api.BASEIMGURL,
                phoneOrderDetail:{},
                orderId:this.$route.params.id
            }
        },
        computed:{
            showType:function () {
                return this.$route.params.type;
            }
        },
        mounted:function () {
            var _this = this;
            api.getOrderPhoneDetail(this.$route.params.id).then(function (res) { //获取订单详情
                if(res.code == '000'){
                    res.data.img = JSON.parse(res.data.img);
                    _this.phoneOrderDetail = res.data;
                }
            })
        }
    }
</script>
<style lang="less">


    #phoneOrderDetail{
        font-size: 12px;
        .header{text-align: center;color: #fff;font-size: .16rem;width: 100%;height: .6rem;background-image: url("../assets/bg_@2x.png");
                background-size: 100% 100%;line-height: .6rem;vertical-align: middle}
        .header img{width: .17rem;height: .16rem;margin-right: .05rem; vertical-align: middle}
        .header span{display: inline-block;height: 100%;vertical-align: middle;}
        .order-box{padding: .1rem .12rem}
        .top{padding: .18rem .1rem .12rem .1rem;background-color: #f6f6f6;border-top-left-radius: 4px;border-top-right-radius: 4px;
                box-shadow: 0 -4px 7px 1px #f2f2f2}
        .top>div{width: 100%;overflow: hidden}
        .top>div>*{float: left}
        .doc-info img{width: .48rem;height: .48rem;border-radius: .48rem;border: 1px solid #01A7E1;margin-right: .08rem}
        .doc-info p:first-child{font-size: .16rem;color: #333;margin-bottom: .08rem;}
        .doc-info p:first-child span{font-size: .14rem;color: #666;display: inline-block;margin-left: .1rem;}
        .doc-info p:last-child{font-size: .14rem;color: #333;}
        .doc-info p:last-child span{display: inline-block;margin-left: .1rem;}
        .top>p{font-size: .14rem;color: #666;margin-top: .12rem;}
        .top>p span{color: #fe7b4f}
        .foot{padding: .12rem;background-color: #fff;box-shadow: 0 5px 7px 1px #f2f2f2;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;
                overflow: hidden;}
        .foot>div{float: left;line-height: .24rem;font-size: .14rem;}
        .foot .left{color: #999;font-size: .14rem;}
        .foot .right{color: #666;margin-left: .12rem;}

        .divide{width: 100%;height: .1rem;background-color: #f2f2f2}


        .info{width: 100%;overflow: hidden}
        .title{height: .4rem;line-height: .4rem;color: #666;font-size: .14rem;padding-left: .12rem;border-bottom: 1px solid #e9e9e9}
        .info-text{padding: .12rem;font-size: .14rem;color: #666;word-break: break-all;}
        .img-box{padding: 0 .12rem;}
        .img-box img{width: .8rem;height: .8rem;margin-bottom: .12rem}
        .img-box img:not(:nth-child(4n)){margin-right: .1rem}
        .phone{margin-top: .24rem;text-align: center;color: #999;font-size: .12rem;line-height: .2rem;}
        .phone a{color: #fe7b47}

        .footer{position: fixed;width: 100%;max-width: 750px;bottom: 0;text-align: center;height: .5rem;line-height: .5rem;background-color: #fff;box-shadow: 0 -1px 7px 1px #f2f2f2}
        .footer a{display: inline-block;height: .3rem;width: .96rem;border: 1px solid #ccc;border-radius: 1rem;line-height: .3rem;margin-right: .1rem;font-size: .14rem;}
        .footer a.active{border: 1px solid #01A7E1;color: #01A7E1}
        .footer a.gray{color: #fff;background:#dfdfdf;border-color:#dfdfdf;}
    }
</style>