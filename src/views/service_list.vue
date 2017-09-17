<template>
    <div id="serviceList">
        <div class="inner">
            <img src="../assets/vip_top_zhanshi@2x.png" alt="" class="top-banner">
            <div class="divide"></div>
            <div class="service-list">
                <router-link v-for="one in list" :key="one" :to="'/servicedetail/'+one.wxGoodsId" class="service-item">
                    <img :src="IMGURL+'/'+one.url" alt="" class="cover">
                    <div class="right">
                        <p class="title">{{one.name}}</p>
                        <p class="count">
                            {{one.purchaseNum}}人购买
                        </p>
                        <p class="price">
                            <span class="new">￥{{one.actualPrice}}</span>
                            <span class="old">￥{{one.price}}</span>
                        </p>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
</template>
<script>
    import {Tabbar,TabbarItem} from 'vux'
    import api from '../server'
    export default{
        components:{
            Tabbar,
            TabbarItem
        },
        data(){
            return {
                list : [],
                IMGURL:api.BASEIMGURL.replace(/\/$/,'')
            }
        },
        beforeCreate(){
            if($(document).height() != $('html').height()) location.reload();
        },
        created:function () {
            const _this = this;
            api.queryWxGoodsAndPurchaseNum().then(function (res) {
                if(res.code === '000'){
                    _this.list = res.data;
                }
            })
        }
    }
</script>
<style lang="less">
    #serviceList{
        font-size: 0;
        .inner{padding-bottom: .5rem;}
        .inner .top-banner{width: 100%;height: 1.5rem;}
        .divide{width: 100%;height: .1rem;background-color: #f2f2f2;}
        .service-list{}
        .service-item{border-bottom: 1px solid #e9e9e9; margin-left: .12rem; padding: .14rem 0;display: block;}
        .service-item .cover{width: 1.3rem;height: .73rem;border-radius: .04rem;vertical-align: top;}
        .service-item .right{display: inline-block;width: 2rem;margin-left: .12rem;position: relative; top: -.02rem;}
        .service-item .right .title{font-size: .16rem;color: #333;margin-bottom: .1rem;}
        .service-item .right .count{background-image:url(../assets/vip_icon_person@2x.png);background-size: .16rem;background-repeat: no-repeat;
            font-size: .12rem;color: #999;padding-left: .22rem;margin-bottom: .02rem;}
        .service-item .right .price{}
        .service-item .right .price .new{font-size: .14rem;color: #fe7b4f;margin-right: .13rem;}
        .service-item .right .price .old{font-size: .12rem;color: #999;text-decoration: line-through;}
    }
</style>