<template>
    <div id="app" :class="{show:showPage}">
        <x-progress v-bind:percent="percent" v-bind:class="{disabled : (percent == 0)}"
                    :show-cancel="false"></x-progress>
        <transition name="component-fade" mode="out-in">
            <router-view></router-view>
        </transition>
        <tabbar id="tableBar" v-if="showBotNav">
            <tabbar-item link="/home" :selected="homeActive">
                <img slot="icon" src="./assets/tablebar_icon_yuyue_default@2x.png" >
                <img slot="icon-active" src="./assets/tablebar_icon_yuyue_click@2x.png">
                <span slot="label">预约</span>
            </tabbar-item>
            <tabbar-item link="/servicelist" :selected="serviceActive">
                <img slot="icon" src="./assets/tablebar_icon_vip_default@2x.png">
                <img slot="icon-active" src="./assets/tablebar_icon_vip_click@2x.png">
                <span slot="label">VIP套餐</span>
            </tabbar-item>
            <!--<tabbar-item :selected="vipActive" link="/vipinfo">-->
                <!--<img slot="icon" src="./assets/tablebar_icon_vip_default@2x.png">-->
                <!--<img slot="icon-active" src="./assets/tablebar_icon_vip_click@2x.png">-->
                <!--<span slot="label">会员</span>-->
            <!--</tabbar-item>-->
            <tabbar-item  link="/myhome" :selected="myActive">
                <img slot="icon" src="./assets/tablebar_icon_mine_default@2x.png">
                <img slot="icon-active" src="./assets/tablebar_icon_mine_click@2x.png">
                <span slot="label">我的</span>
            </tabbar-item>
        </tabbar>
    </div>
</template>

<script>
    import {Group, Cell, Loading,XProgress,Tabbar,TabbarItem} from 'vux'
    import { mapState } from 'vuex'
    import api from './server'

    export default {
        data(){
            return {
                percent: 0,
                showPage : false,
                showBotNav : false,
            }
        },
        components: {
            Group,
            Cell,
            XProgress,
            Loading,
            Tabbar,
            TabbarItem
        },
        beforeCreate (){
            //获取并保存用户openId
            const _this = this;
            if(navigator.userAgent.toLowerCase().indexOf('micromessenger') < 0){
                _this.$router.replace('/error');
                setTimeout(function () {
                    _this.showPage = true;
                },0);
                return false;
            }
            let paramObj = {};
            if(location.search){
                const paramStr = location.search.split('?')[1];
                const temp = paramStr.split('&');
                temp.map(function (item) {
                    paramObj[item.split('=')[0]] = item.split('=')[1];
                });
            }
            if(api.MODEL === 'dev'){
                _this.$store.state.openId = localStorage.openId || 'oaaoN0l9lAUVDz53zk_POLG7eM6w';
                _this.$store.state.userId = localStorage.userId || '2150';
            }
            else if(api.MODEL === 'dist'){
                _this.$store.state.openId = localStorage.openId;
                _this.$store.state.userId = localStorage.userId;
            }
            localStorage.getOpenIdTimes = localStorage.getOpenIdTimes || 0;
            if(paramObj.code && localStorage.code !== paramObj.code){
                localStorage.code = paramObj.code;
                api.getOpenId(paramObj.code).then(function (res) {
                    localStorage.getOpenIdTimes ++;
                    if(res.code === '000'){
                        localStorage.removeItem('getOpenIdTimes');
                        const data = JSON.parse(res.data);
                        _this.showPage = true;
                        if(data.subscribe == '1'){
                            _this.$store.state.openId = localStorage.openId = data.openId || '';
                            _this.$store.state.userId = localStorage.userId = data.userId || '';
                        }else{
                            _this.$router.replace('/error');
                        }
                    }else{
                        if(localStorage.getOpenIdTimes < 3){
                            const href = encodeURIComponent(location.origin + '/' + location.hash);
                            let appid = '';
                            if(api.MODEL === 'dev'){
                                appid = 'wx4788b9d892bb72f3';
                            }else if(api.MODEL === 'dist'){
                                appid = 'wx0dd9b319bc1c9f50';
                            }
                            location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ appid +'&redirect_uri='+ href +'&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect';
                        }else{
                            localStorage.removeItem('getOpenIdTimes');
                            _this.showPage = true;
                            _this.$router.replace('/error');
                        }
                    }
                })
            }else{
                setTimeout(function () {
                    _this.showPage = true;
                },0);
            }
        },
        created: function () {
            (function calcHtmlFontSize() {
                let width = document.body.clientWidth;
                if(width < 320) width = 320;
                else if(width > 750) width = 750;
                document.getElementsByTagName('html')[0].style.fontSize = width*100/375 + 'px';
                window.onresize = function () {
                    let width = document.body.clientWidth;
                    if(width < 320) width = 320;
                    else if(width > 750) width = 750;
                    document.getElementsByTagName('html')[0].style.fontSize = width*100/375 + 'px';
                };
            })();
        },
        computed: {
            ...mapState({
                isLoading: state => state.isLoading
            }),
            homeActive() {
                const array = ['/home'];
                for(let i = 0; i<array.length; i++){
                    if(this.$route.path.indexOf(array[i])>-1){
                        return true
                    }
                }
            },
            serviceActive() {
                const array = ['/servicelist'];
                for(let i = 0; i<array.length; i++){
                    if(this.$route.path.indexOf(array[i]) > -1){
                        return true
                    }
                }
            },
            vipActive() {
                const array = ['/vipinfo','/vipnolist'];
                for(let i = 0; i<array.length; i++){
                    if(this.$route.path.indexOf(array[i])>-1){
                        return true
                    }
                }
            },
            myActive(){
                const array = ['/myhome'];
                for(let i = 0; i<array.length; i++){
                    if(this.$route.path.indexOf(array[i]) > -1){
                        return true
                    }
                }
            }
        },
        watch: {
            isLoading : function () {
                if(this.isLoading === true){
                    this.percent = 95;
                }else if(this.isLoading === false){
                    this.percent = 0;
                }
            },
            '$route.path'(val){
                this.showBotNav = ['/home', '/servicelist', '/vipinfo', '/myhome', '/vipnolist','/onehome'].indexOf(val) > -1;
            },
        },
    }
</script>

<style>
    html{font-size:100px}
    html,body,#app{height: 100%;background: #fff;font-family:'Microsoft YaHei','宋体',sans-serif;}
    #app{width:100%;max-width:750px;margin:0 auto;opacity: 0;visibility: hidden;}
    #app.show{opacity: 1;visibility: visible;}
    *{margin:0;padding:0}
    i{font-style:normal}
    h1,h2{font-weight:400}
    ul{list-style-type:none;padding:0}
    li{display:inline-block;margin:0 10px}
    a{text-decoration:none;color: inherit;}
    input,textarea{font-family: 'Microsoft YaHei','宋体',sans-serif}
    .weui-progress{position:fixed;top:0;width:100%;z-index:999;max-width:750px;left:0;right:0;margin:auto}
    .weui-progress.disabled{opacity:0;visibility:hidden}
    .weui-progress__inner-bar{transition:all .35s ease-out;background-color:#01A7E1!important}
    .weui-progress__bar{position:relative}
    .weui-progress__bar:after{background-image:url(./assets/loading_2.gif);width:8px;height:8px;position:absolute;right:0;left:0;margin:auto;bottom:-12px;background-size:100%}
    .component-fade-enter-active,.component-fade-leave-active{transition:opacity .3s ease}
    .component-fade-enter,.component-fade-leave-active{opacity:0}

    .vux-x-dialog{font-size: 0;}
    .weui-mask{background: rgba(0,0,0,.3)!important;}
    .weui-dialog{width: 2.66rem !important;max-width: 2.7rem !important;border-top: 4px solid #01A7E1}
    .weui-dialog__hd{padding: .15rem 0 .2rem 0 !important;color: #666;font-size: .18rem}
    .weui-dialog__bd{font-size: .14rem!important;color: #333!important;padding:0 .12rem .2rem!important;min-height: .14rem!important;}
    .weui-dialog__ft{font-size: .18rem!important;}
    .weui-dialog__btn_default{color: #999 !important;height: .52rem!important;}
    .weui-dialog__btn_primary{color: #01A7E1 !important;height: .52rem!important;}
    .weui-dialog__ft:after{border: none!important;}
    .weui-dialog__btn:after{border-left: none!important;}

    .weui-toast.weui-toast_text{width: auto!important;padding: .1rem .15rem!important;border-radius: .08rem!important;height: auto;top: .15rem;}
    .weui-toast_text .weui-toast__content{padding: 0!important;font-size: .12rem;}

    #tableBar{position:fixed;bottom:0;left:0;max-width:750px;right:0;margin:auto}
    .weui-tabbar__item{background-color:#fff;padding-top:.05rem!important}
    .weui-tabbar__item.weui-bar__item_on .weui-tabbar__icon,.weui-tabbar__item.weui-bar__item_on .weui-tabbar__icon>i,.weui-tabbar__item.weui-bar__item_on .weui-tabbar__label{color:#01A7E1!important}
    /*.weui-tabbar__item:nth-of-type(3).weui-bar__item_on .weui-tabbar__label{color: #e2bc81!important;}*/
    .weui-tabbar__icon{width:.26rem!important;height:.22rem!important;margin-bottom: .04rem;}
    .weui-tabbar__label{font-size:.12rem!important}
    .weui-tabbar__label{line-height:1!important;margin-bottom:.05rem;margin-top:.01rem}
</style>