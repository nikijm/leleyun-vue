<template>
    <div id="oneOrderDetail">
        <div class="header">
            <img src="../assets/booking_2@2x.png" alt="book"><span>{{modal.statusName}}</span>
        </div>
        <div class="order-box">
            <div class="top">
                <div class="doc-info">
                    <img :src="IMGURL+modal.headPhoto+'@120w_120h_90Q.jpg'" :onerror="defaultImg">
                    <div>
                        <p>{{modal.userName}}<span>{{modal.titleName}}</span></p>
                        <p>{{modal.hospitalName}}<span>{{modal.deptName}}</span></p>
                    </div>
                </div>
                <p class="meet-info" >
                    <span class="title">预约地址：</span>
                    <span class="text">{{modal.address}}</span><span class="address" @click="navigation({lat:modal.latitude,lng:modal.longitude,address:modal.address})">导航</span>
                </p>
                <p class="meet-info">
                    <span class="title">预约时间：</span>
                    <span class="text">{{modal.date}}</span>
                </p>
            </div>
            <div class="foot">
                <div class="left">
                    <p>订单号：</p>
                    <p>订单金额：</p>
                    <p>下单时间：</p>
                    <p v-if="modal.completeTime">完成时间：</p>
                </div>
                <div class="right">
                    <p>{{modal.orderNo}}</p>
                    <p>¥{{modal.price}}</p>
                    <p>{{modal.orderTime}}</p>
                    <p v-if="modal.completeTime">{{modal.completeTime}}</p>
                    <p></p>
                </div>
            </div>
        </div>
        <div class="divide"></div>
        <div class="other-info" :class="{hidden:!modal.verifyUrl}">
            <qrcode :value="(modal.verifyUrl || 'http://www.leley.com/pt.html')" type="img"></qrcode>
            <p class="code-tips">就诊时请出示二维码</p>
        </div>
        <div class="phone">
            <p>如有疑问请拨打医助电话：<a href="tel:4001816106">400-181-6106</a></p>
            <p>医助上班时间：9:00-21:00</p>
        </div>
        <div class="footer">
            <!--未支付-->
            <div class="btn-group" v-if="modal.status==0">
                <a href="javascript:;" @click="cancelOrder">取消订单</a>
                <a class="color" :href="'#/orderpay/'+modal.orderId">去支付</a>
            </div>
            <!--已退款,已取消-->
            <div class="btn-group" v-if="modal.status==3 || modal.status==4">
                <a class="color" :href="'#/doctordetail/1/'+modal.doctorId+'/'+modal.addressId">再次购买</a>
            </div>
            <!--已完成-->
            <div class="btn-group" v-if="modal.status==7">
                <a class="color" :href="'#/doctordetail/1/'+modal.doctorId+'/'+modal.addressId">再次购买</a>
                <a class="color" :href="'#/evaluate'+modal.orderId">评价</a>
            </div>
            <!--已评价-->
            <div class="btn-group" v-if="modal.status==9">
                <a class="color" :href="'#/doctordetail/1/'+modal.doctorId+'/'+modal.addressId">再次购买</a>
                <a class="gray">已评价</a>
            </div>
        </div>
    </div>
</template>
<script>
    import {Qrcode} from 'vux'
    import api from '../server'
    export default{
        components:{
            Qrcode
        },
        data(){
            return {
                modal : {},
                defaultImg: 'this.src="' + require('../assets/head_default@2x.png') + '"',//默认图片
                IMGURL:api.BASEIMGURL
            }
        },
        created(){
            let _this = this;
            api.getOrderOneDetail({
                openId : this.$store.state.openId,
                orderId : this.$route.params.id
            }).then(function (res) {
                if(res.code === '000'){
                    var data = res.data;
                    var time = new Date(data.completeTime);
                    var y = time.getFullYear();
                    var m = time.getMonth()+1>10?time.getMonth()+1:'0'+(time.getMonth()+1);
                    var d = time.getDate()>10?time.getDate():'0'+(time.getDate());
                    var h = time.getHours()>9?time.getHours():'0'+time.getHours();
                    var min = time.getMinutes()>9?time.getMinutes():'0'+time.getMinutes();
                    var s = time.getSeconds()>9?time.getSeconds():'0'+time.getSeconds();
                    data.completeTime = y+'-'+m+'-'+d+' '+h+':'+min+':'+s;
                    _this.modal = data;
                    _this.modal.orderId = _this.$route.params.id;
                }
            })
        },
        methods : {
            cancelOrder : function () {
                var _this = this;
                this.$vux.confirm.show({
                    title : '您是否确认取消本次订单？',
                    content : '确认后本次订单将作废',
                    onConfirm  () {
                        api.cancelOrder(_this.$route.params.id,_this.$store.state.openId).then(function (res) {
                            if(res.code == '000'){
                                location.href = '#/myorder'
                            }
                        })
                    }
                });
            },
            navigation(obj){
                if(obj.lat && obj.lng){
                    this.$wechat.openLocation({
                        latitude: obj.lat,
                        longitude: obj.lng,
                        name: obj.address
                    })
                }else{
                    this.$vux.toast.text('预约地址经纬度获取失败', 'top');
                }
            }
        }
    }
</script>
<style lang="less">
    #oneOrderDetail{
        font-size: 12px;
        .header{text-align: center;color: #fff;font-size: .16rem;width: 100%;height: .6rem;background-image: url("../assets/bg_@2x.png");
            background-size: 100% 100%;line-height: .6rem;vertical-align: middle}
        .header img{width: .17rem;height: .16rem;margin-right: .05rem; vertical-align: middle}
        .header span{display: inline-block;height: 100%;}
        .order-box{padding: .1rem .12rem}
        .top{padding: .18rem .1rem .12rem .1rem;background-color: #f6f6f6;border-top-left-radius: 4px;border-top-right-radius: 4px;
            box-shadow: 0 -4px 7px 2px #f2f2f2}
        .top>div{width: 100%;overflow: hidden}
        .top>div>*{float: left}
        .doc-info img{width: .48rem;height: .48rem;border-radius: .48rem;border: 1px solid #01A7E1;margin-right: .08rem}
        .doc-info p:first-child{font-size: .16rem;color: #333;margin-bottom: .08rem;}
        .doc-info p:first-child span{font-size: .14rem;color: #666;display: inline-block;margin-left: .1rem;}
        .doc-info p:last-child{font-size: .14rem;color: #333;}
        .doc-info p:last-child span{display: inline-block;margin-left: .1rem;}
        .top .meet-info{margin-top: .16rem;}
        .top .meet-info+.meet-info{margin-top: .1rem;}
        .top .meet-info .title{font-size: .14rem;color: #666;margin-top: .16rem;vertical-align: middle;}
        .top .meet-info .text{color: #000; font-size: .14rem; display: inline-block; width: 1.95rem; vertical-align: middle; margin-right: .1rem;}
        .top .meet-info .address{font-size: .14rem;background-image: url(../assets/icon_position@2x.png);background-repeat: no-repeat;
            background-size:.2rem .2rem;color: #746f71;padding-left: .23rem;vertical-align: middle;}
        .foot{padding: .12rem;background-color: #fff;box-shadow: 0 5px 7px 2px #f2f2f2;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;
            overflow: hidden;}
        .foot>div{float: left; line-height: .24rem; font-size: .14rem; color: #999;}
        .foot .right{color: #666;margin-left: .12rem;}

        .divide{width: 100%;height: .1rem;background-color: #f2f2f2}

        .other-info{width: 100%; overflow: hidden; text-align: center; padding-top: .20rem;}
        .other-info.hidden{opacity: 0;visibility: hidden;}
        .other-info img{width: 1.25rem;height: 1.25rem;}
        .code-tips{font-size: .14rem;color: #999;margin-top: .04rem;}
        .phone{margin-top: .25rem;text-align: center;color: #999;font-size: .12rem;line-height: .2rem;padding-bottom: .65rem;}
        .phone a{color: #fe7b4f}

        .footer{position: fixed; width: 100%; max-width: 750px; bottom: 0; text-align: center; height: .5rem;
            line-height: .5rem; background-color: #fff; box-shadow: 0 -1px 1px 1px #f2f2f2;}
        .footer a{display: inline-block;height: .3rem;width: .96rem;border: 1px solid #ccc;border-radius: 1rem;
            line-height: .3rem;margin-right: .06rem;font-size: .14rem;box-sizing: border-box;}
        .footer a.color{color: #01A7E1;border-color:#01A7E1;}
        .footer a.gray{color: #fff;background:#dfdfdf;border-color:#dfdfdf;}

    }
</style>
