<template>
    <div id="myHomePage">
        <div class="header">
            <div class="user-box">
                <img :src="modal.headPhoto" :onerror="defaultImg" class="avatar">
                <p class="user-info">
                    <span>{{modal.username || '未知用户'}}</span>
                    <span class="vip-box" :class="{vip:(modal.isVip==1)}"></span>
                </p>
            </div>
        </div>
        <div class="divide"></div>
        <group>
            <cell title="我的订单" is-link link="/myorder">
                <img class="cell-icon" slot="icon" src="../assets/person_icon_yuyue@2x.png">
            </cell>
            <cell title="会员服务" is-link link="/vipinfo">
                <img class="cell-icon" slot="icon" src="../assets/person_icon_huiyuan@2x.png">
            </cell>
        </group>
        <!--<div class="divide"></div>-->
        <!--<group>-->
            <!--<cell title="意见反馈" is-link link="/feedback">-->
                <!--<img class="cell-icon" slot="icon" src="../assets/person_icon_yijian@2x.png">-->
            <!--</cell>-->
        <!--</group>-->
    </div>
</template>
<script>
    import { Group,Cell,Tabbar,TabbarItem } from 'vux'
    import api from '../server'
    export default{
        components:{
            Group,
            Cell,
            Tabbar,
            TabbarItem
        },
        data(){
            return{
                modal : {},
                defaultImg: 'this.src="' + require('../assets/head_default@2x.png') + '"' //默认图片
            }
        },
        beforeCreate(){
            if($(document).height() != $('html').height()) location.reload();
        },
        created(){
            const _this = this;
            api.getUserInfo(this.$store.state.openId).then(function (res) {
                if(res.code === '000'){
                    _this.modal = res.data;
                }
            })
        },
    }
</script>
<style lang="less">
    #myHomePage{
        font-size: 0;
        height: 100%;
        background: #f2f2f2;
        .divide{width: 100%;height: .1rem;background-color: #f2f2f2;}
        .header{background-image: url(../assets/bg@2x.png);width: 100%;height: 1.32rem;background-size: 100%;background-repeat: no-repeat;background-position-y: -.01rem;}
        .user-box{margin:0 0 0 .75rem;padding-top: .33rem;}
        .user-box .avatar{border-radius: 50%;border:1px solid #01A7E1;width: .52rem;height: .52rem;}
        .user-info{margin-top: .04rem;}
        .user-info>span{font-size: .16rem;color: #333;margin-right: .08rem;margin-left: .04rem;}
        .user-info .vip-box{background-image: url(../assets/person_icon_yh@2x.png); font-size: .12rem; color: #999; border: 1px solid #ccc; border-radius: 1rem;
            padding: .03rem .12rem; background-size: .16rem; background-repeat: no-repeat; padding-left: .28rem; background-position: .1rem .03rem;}
        .user-info .vip-box:after{content: '普通用户';}
        .user-info .vip-box.vip{color: #FE7B4F;border-color:#FE7B4F;background-image: url(../assets/person_icon_vip@2x.png)}
        .user-info .vip-box.vip:after{content: '会员用户';}

        .weui-cells{margin-top: 0;margin-bottom: .5rem;}
        .weui-cell{padding: .12rem .15rem;}
        .weui-cell:before{border-color: #e9e9e9; left: 0.45rem;}
        .weui-cell .weui-cell__hd>img{width: .22rem;height: .22rem;display: inline-block;vertical-align: middle;margin-right: .1rem;}
        .weui-cell .vux-label{color: #666;font-size: .16rem;}
        .weui-cell__ft:after{width: .06rem;height: .06rem;}
    }
</style>