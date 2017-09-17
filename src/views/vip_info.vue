<template>
    <div id="vipInfo">
        <div class="swiper-box" id="swiper-box">
            <swiper :options="swiperOption" ref="mySwiper">
                <swiper-slide v-for="n in swiperList" :key="n">
                    <img src="../assets/vip_card_beiyun@2x.png">
                    <p class="isVip">已开通</p>
                    <p class="vip-title">{{n.baseInfo.name}}</p>
                    <p class="balance"><span class="date">{{n.baseInfo.endTime}}到期</span><span class="yue" v-show="n.baseInfo.balance">余额：{{n.baseInfo.balance}}元</span></p>
                </swiper-slide>
            </swiper>
            <div class="swiper-pagination" slot="pagination"></div>
        </div>
        <div class="divide"></div>
        <div class="vip-title">
            VIP特享服务
            <!--<img src="../assets/vip_icon_shuoming@2x.png" @click="serverDetail()">-->
        </div>
        <div class="service-box">
            <a class="service-item" v-for="n in serviceList" :href="((n.serviceType == 1 || n.serviceType == 4) && n.parameter)" @click="visit(n.serviceType,n)">
                <img :src="IMGURL + n.icon" alt="">
                <p class="type">{{n.name}}</p>
                <p class="phone-time">{{n.typeDesc}}</p>
            </a>
        </div>
        <a class="vip-more" href="#/servicelist">
            <span>更多会员服务</span> <img src="../assets/arrow_more_lanse@2x.png" alt="">
        </a>
    </div>
</template>
<script>
    import { Tabbar,TabbarItem,dateFormat } from 'vux'
    import { swiper, swiperSlide } from 'vue-awesome-swiper'
    import api from '../server'
    export default{
        components:{
            swiper,
            swiperSlide,
            Tabbar,
            TabbarItem
        },
        data(){
            const _this = this;
            return {
                swiperList:[],
                IMGURL:api.BASEIMGURL,
                serviceList:[],
                swiperOption : {
                    pagination: '.swiper-pagination',
                    paginationClickable: true,
                    spaceBetween: 10,
//                    loop:true,
                    initialSlide:0,
                    onSlideChangeEnd(swiper){
                        var index = swiper.realIndex;
                        _this.serviceList = _this.swiperList[index].services;
                    }
                }
            }
        },
        methods:{
            visit(type,modal){
                if(type === 2){
                    this.$vux.confirm.show({
                        title:'联系医助',
                        content:modal.parameter,
                        'confirmText':'我要拨打',
                        onConfirm (){
                            location.href = 'tel:4001816106'
                        }
                    })
                }else if(type === 3){
                    this.$vux.alert.show({
                        title:modal.name,
                        content: modal.parameter
                    })
                }
            }
        },
        created:function () {
            var _this = this;
            api.queryMyWxGoods(this.$store.state.openId).then(function (res) {
                if(res.code == '000'){
                    var data = res.data;
                    if(data.length){
                        $('#vipInfo').css('opacity','1');
                        data.map(function (index) {
                            index.baseInfo.endTime = dateFormat(new Date(index.baseInfo.endTime),'YYYY-MM-DD');
                        });
                        _this.swiperList = res.data;
                        _this.serviceList = _this.swiperList[0].services;
                    }else {
                        _this.$router.push('/vipnolist');
                    }


                }
            })
        },


    }
</script>
<style lang="less">
    #vipInfo{
        font-size: 12px;
        padding-bottom:.6rem;
        opacity: 0;
        .swiper-box{
            overflow: hidden;padding: .12rem .12rem .1rem .12rem;height: 1.93rem;
            position: relative;
            /*#swiper{height: 1.93rem;}*/
            .swiper-container {
                height: 1.75rem;
                border-radius: .1rem;
                img{width: 100%;height: 100%;border-radius: .1rem}

            }
            .swiper-slide{position: relative;}
            .swiper-pagination{text-align: center;width: 100%;bottom: 0.1rem;
                span{width: .08rem;height: .08rem;border-radius: .08rem;margin-right: .1rem;background-color: grey}
                .swiper-pagination-bullet-active{background-color: #e2bc81}
            }
            .isVip{
                position: absolute;
                display: inline-block;
                width: .5rem;
                height: .18rem;
                text-align: center;
                line-height: .18rem;
                color: #eaab48;
                font-size: .12rem;
                border: 1px solid #f5a72d;
                border-radius: 100px;
                right: .16rem;
                top: .16rem;
            }
            .vip-title{    position: absolute;
                width: 100%;
                height: 100%;
                left: 0;
                top: 0;
                text-align: center;
                line-height: 1.75rem;
                font-size: .2rem;
                font-weight: bold;
                color: #d68a15;}
            .balance{position: absolute;width: 100%;bottom: .16rem;font-size: .14rem;
                .date{color: #d68a15;margin-left: .16rem}
                .yue{color: #fe7b4f;position: absolute;right: .16rem;}
            }

        }
        .divide{width: 100%;height: .1rem;background-color: #f2f2f2}
        .vip-title{padding:0 .12rem;height: .4rem;line-height: .4rem;overflow: hidden;position: relative;border-bottom: 1px solid #e9e9e9;box-sizing: border-box;
                color: #666;font-size: .14rem;}
        .vip-title img{width: .2rem;position: absolute;right: .12rem;top: .09rem}
        .service-box{overflow: hidden;width: 100%;padding: 0;margin: 0;font-size: 0;}
        .service-item{display: inline-block;width: 1.25rem;height: 1.48rem;text-align: center;position: relative;
            >img{width: .44rem;height: .44rem;margin-top: .16rem}
            .type{margin-top: .1rem;color: #333;font-size: .14rem}
            .phone-time{margin-top: .08rem;color: #999;font-size: .12rem;border: 1px solid #ccc;border-radius: 1rem;display: inline-block;width: .64rem;height: .18rem;line-height: .18rem;
                overflow: hidden;text-overflow: ellipsis;word-wrap: normal;white-space: nowrap}
            .count{position: absolute;right: .12rem;top: .17rem;color: #999;font-size: .12rem;padding: .05rem;
                background-image: url("../assets/vip_cishu_tip@2x.png");background-size: 100%;background-repeat: no-repeat;background-position: center center;}
        }
        .vip-more{display:inline-block;width: 100%;text-align: center;font-size: .14rem;color: #e2bc81;margin-top: .1rem;
            span{display: inline-block;height: 100%;vertical-align: middle}
            img{height: .14rem;vertical-align: middle;margin-left: .05rem}
        }
    }
    .weui-dialog{border-color: #e2bc81}
    .weui-dialog__bd{padding: 0 .12rem!important;}
    .weui-dialog__btn_primary{color: #e2bc81!important;}
</style>