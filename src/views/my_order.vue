<template>
    <div id="orderList">
        <scroller lock-x height="-30" ref="scroller" @on-scroll-bottom="onScrollBottom" v-if="myOrderList.length">
            <div class="order-list">
                <div class="order-item" :class="{service:i.orderType=='suite'}" v-for="i in myOrderList" @click="checkDetail(i.orderType,i.orderId)">
                    <div class="head">
                        <span class="type" v-if="i.orderType == 'expertConsultation'">专家一对一</span>
                        <span class="type" v-if="i.orderType == 'reservationPhone'">名医电话</span>
                        <span class="type" v-if="i.orderType == 'suite'">服务套餐</span>
                        <span class="status">{{i.statusName}}</span>
                    </div>
                    <div class="doc-info" v-if="i.orderType !== 'suite'">
                        <img :src="IMGURL+i.headPhoto" :onerror="defaultImg">
                        <div class="inner">
                            <p>
                                <span class="name">{{i.userName}}</span>&ensp;
                                <span class="title">{{i.titleName}}</span>
                            </p>
                            <p>
                                <span class="hosp">{{i.hospitalName}}</span>&ensp;
                                <span class="dept">{{i.deptName}}</span>
                            </p>
                        </div>
                    </div>
                    <div class="doc-info" v-if="i.orderType === 'suite'">
                        <img src="../assets/mine_order_icon_vip@2x.png">
                        <div class="inner">
                            <p>{{i.name}}</p>
                            <p>{{i.liveTime}}</p>
                        </div>
                    </div>
                    <div class="operate">
                        <span class="price">￥{{i.price}}</span>
                        <!--未支付-->
                        <div class="btn-group" v-if="i.status==0">
                            <a :href="'#/orderpay/'+i.orderId" class="color" v-on:click.stop>去支付</a>
                        </div>
                        <!--已退款,已取消-->
                        <div class="btn-group" v-if="i.status==3 || i.status==4">
                            <a v-if="i.orderType=='expertConsultation'" :href="'#/doctordetail/1/'+i.doctorId+'/'+i.addressId" v-on:click.stop>再次购买</a>
                            <a v-if="i.orderType=='reservationPhone'" :href="'#/doctordetail/2/'+i.doctorId+'/'+i.addressId" v-on:click.stop>再次购买</a>
                            <a v-if="i.orderType=='suite'" :href="'#/servicedetail/'+i.wxGoodsId" v-on:click.stop>再次购买</a>
                        </div>
                        <!--预约中,已预约-->
                        <div class="btn-group" v-if="i.status==5 || i.status==6">
                            <a href="javascript:;">查看详情</a>
                        </div>
                        <!--已完成-->
                        <div class="btn-group" v-if="i.status==7">
                            <a v-if="i.canTalk=='1'" @click="contactDoctor(i.orderNo,i.userMobile)" v-on:click.stop>联系医生</a>
                            <a v-if="i.orderType=='expertConsultation'" :href="'#/doctordetail/1/'+i.doctorId+'/'+i.addressId" v-on:click.stop>再次购买</a>
                            <a v-if="i.orderType=='reservationPhone'" :href="'#/doctordetail/2/'+i.doctorId+'/'+i.addressId" v-on:click.stop>再次购买</a>
                            <a :href="'#/evaluate/'+i.orderId" v-on:click.stop>评价</a>
                        </div>
                        <!--已评价-->
                        <div class="btn-group" v-if="i.status==9">
                            <a v-if="i.orderType=='expertConsultation'" :href="'#/doctordetail/1/'+i.doctorId+'/'+i.addressId" v-on:click.stop>再次购买</a>
                            <a v-if="i.orderType=='reservationPhone'" :href="'#/doctordetail/2/'+i.doctorId+'/'+i.addressId" v-on:click.stop>再次购买</a>
                        </div>

                        <!--套餐状态-->
                        <!--定金支付-->
                        <div class="btn-group" v-if="i.status==10">
                            <a :href="'#/orderpay/'+i.orderId" v-on:click.stop>订金支付</a>
                        </div>
                        <!--定金已支付-->
                        <div class="btn-group" v-if="i.status==11">
                            <a :href="'#/serviceorderdetail/'+i.orderId" v-on:click.stop>查看详情</a>
                        </div>
                        <!--尾款支付-->
                        <div class="btn-group" v-if="i.status==12">
                            <a :href="'#/serviceorderdetail/'+i.orderId" v-on:click.stop>尾款支付</a>
                        </div>
                        <!--已完成-->
                        <div class="btn-group" v-if="i.status==13">
                            <a :href="'#/serviceorderdetail/'+i.orderId" v-on:click.stop>查看详情</a>
                        </div>
                    </div>
                </div>
                <load-more v-show="loadingList" tip="正在加载"></load-more>
                <load-more v-show="loadingEnd" :show-loading="false" tip="暂无更多数据" background-color="#f6f6f6"></load-more>
            </div>
        </scroller>
        <div v-if="!myOrderList.length" class="comment-empty">
            <img src="../assets/icon_yuyue_kong@2x.png" alt="">
            <p>您还没有任何订单</p>
        </div>
    </div>
</template>
<script>
    import {LoadMore,Scroller} from 'vux'
    import api from '../server'
    export default{
        data(){
            return{
                loadingList : false,
                loadingEnd : false,
                defaultImg: 'this.src="' + require('../assets/head_default@2x.png') + '"',//默认图片
                IMGURL:api.BASEIMGURL,
                myOrderList:[],
                pageNo : 1,
                pageSize : 10,
                currentTime : 0
            }
        },
        components : {
            LoadMore,
            Scroller
        },
        mounted() {
            this.queryMyOrderList(this.pageNo);
        },
        methods : {
            queryMyOrderList:function (pageNo) {
                const _this = this;
                  api.queryMyOrderList({
                      openId : _this.$store.state.openId,
                      pageNo : pageNo,
                      pageSize : _this.pageSize
                  }).then(function (res) {
                      if(res.code === '000'){
                          _this.loadingList = false;
                          if(res.data.length < _this.pageSize) _this.loadingEnd = true;
                          _this.myOrderList.push.apply(_this.myOrderList,res.data);
                          _this.$nextTick(() => {
                              _this.$refs.scroller && _this.$refs.scroller.reset();
                          });
                      }
                  }).catch(function () {
                      _this.loadingList = false;
                      _this.loadingEnd = true;
                  })
            },
            onScrollBottom : function () {
                const _this = this;
                if(Date.now() - _this.currentTime > 1000) {
                    _this.currentTime = Date.now();
                    if(!this.loadingList && !_this.loadingEnd){
                        this.loadingList = true;
                        _this.$nextTick(() => {
                            _this.$refs.scroller && _this.$refs.scroller.reset();
                        });
                        _this.queryMyOrderList(++_this.pageNo);
                    }
                }
            },
            checkDetail : function (orderType,orderId) {
                if(orderType === 'expertConsultation') this.$router.push('/oneorderdetail/'+orderId);
                if(orderType === 'reservationPhone') this.$router.push('/phoneorderdetail/'+orderId);
                if(orderType === 'suite') this.$router.push('/serviceorderdetail/'+orderId);
            },
            contactDoctor : function (orderNo,phone) {
                var _this = this;
                this.$vux.confirm.show({
                    title : '联系医生',
                    content : '等待平台028开头号码呼入<br>'+ phone +',请保持电话畅通',
                    onConfirm  () {
                        api.customerTalk({
                            orderNo : orderNo,
                            wxOpenId : _this.$store.state.openId
                        }).then(function (res) {
                            if(res.code === '000'){

                            }
                        })
                    }
                });
            }
        }
    }
</script>
<style lang="less">
    #orderList{
        height: 100%;
        background: #f6f6f6;
        font-size: 0;
        .order-list{padding-top: .12rem;}
        .order-item{border-radius: .08rem;margin:.08rem .12rem;background: #fff;border: 1px solid #e9e9e9;}
        .order-item:nth-of-type(1){margin-top: 0;}
        .order-item+.order-item{margin-top:0;}
        .order-item.service .doc-info .inner p:nth-of-type(1){color: #333;font-size: .16rem;}
        .order-item.service .doc-info .inner p:nth-of-type(2){color: #666;}
        .head{height: .44rem;line-height: .44rem;font-size: .14rem;border-bottom: 1px solid #e9e9e9;padding: 0 .12rem;}
        .head .type{color: #999;}
        .head .status{color: #fe7b4f;float: right;}

        .doc-info{padding: .13rem .12rem .13rem 0; border-bottom: 1px solid #e9e9e9; margin-left: .12rem;}
        .doc-info>img{width: .48rem;height: .48rem;border-radius: 50%;vertical-align: middle;margin-right: .12rem;}
        .doc-info .inner{display: inline-block;vertical-align: middle;}
        .doc-info .inner>p{font-size: .14rem;}
        .doc-info .inner>p:nth-of-type(1){color: #333; font-size: .16rem; width: 2.2rem; height: 0.2rem; overflow: hidden;}
        .doc-info .inner>p:nth-of-type(2){color: #333;}

        .operate{height: .44rem;line-height: .44rem;padding: 0 .12rem;}
        .operate .price{font-size: .14rem;}
        .operate .btn-group{float: right;font-size: .12rem;height: 100%;}
        .operate .btn-group>a{display: inline-block;width: .72rem;line-height: .23rem;text-align: center;color: #666;
            margin-left: .05rem;border:1px solid #ccc;border-radius: .2rem;box-sizing: border-box;height: .24rem;}
        .operate .btn-group>a.color{color: #01A7E1;border-color: #01A7E1;}
        .operate .btn-group>a.gray{color: #fff;background:#dfdfdf;border-color:#dfdfdf;}

        .comment-empty{padding-top: 1rem;text-align: center;}
        .comment-empty>img{width: 1.3rem;height: 1.05rem;}
        .comment-empty>p{font-size: .14rem;color: #999;margin-top: .12rem;}
    }
</style>
