<template>
    <div id="loginBox">
        <group>
            <x-input type="text" placeholder="请输入手机号" id="phoneInput" class="input-text" :max="11" :min="11" is-type="china-mobile" v-model="submitData.phone">
                <img slot="label" class="input-icon" src="../assets/login_icon_iphone@2x.png">
            </x-input>
            <x-input type="number" id="verCode" placeholder="请输入验证码" class="input-text" :show-clear="false" v-model="submitData.code">
                <img slot="label" class="input-icon" src="../assets/login_icon_yanzheng@2x.png">
                <a href="javascript:;" slot="right" class="get-code" @click="getCode" v-show="!countdownStart">获取验证码</a>
                <countdown class="count-down" slot="right" v-model="countdownTime" @on-finish="countdownFinish" v-show="countdownStart" :start="countdownStart"></countdown>
            </x-input>
            <a href="javascript:;" class="btn" :class="{active:phoneInputVer&&codeInputVer}" @click="submit">确定</a>
        </group>
        <p class="tips" :class="{hide:hideTips}">
            <!--<img src="../assets/icon_tip@2x.png" alt="">-->
            <span>亲爱的用户：为了更好的为您服务，请您登录/注册后使用。</span>
        </p>
        <toast v-model="toastOption.show" type="text" :time="800" :width="'2rem'" is-show-mask :text="toastOption.text" position="middle"></toast>
    </div>
</template>

<script>
    import { XInput,Group,Countdown,Toast } from 'vux'
    import api from '../server';
    import isMobilePhone from 'validator/lib/isMobilePhone'
    export default {
        components:{
            Group,
            XInput,
            Countdown,
            Toast
        },
        created:function () {
            var _this = this;
            $('body').off('focus blur','#phoneInput,#verCode');
            $('body').on('focus','#phoneInput input,#verCode input',function () {
                _this.hideTips = true;
            });
            $('body').on('blur','#phoneInput input,#verCode input',function () {
                _this.hideTips = false;
            })
        },
        data(){
          return {
            countdownTime : 30,
            countdownStart : false,
            submitData : {
                phone : '',
                code : '',
                openId : this.$store.state.openId
            },
            toastOption : {
                show : false,
                text : ''
            },
            hideTips : false
          }
        },
        computed : {
            'phoneInputVer'(){
                return isMobilePhone(this.submitData.phone,'zh-CN')
            },
            'codeInputVer'(){
                return this.submitData.code
            }
        },
        methods:{
            countdownFinish : function () {
                this.countdownStart = false;
                this.countdownTime = 5;
            },
            getCode : function () {
                const _this = this;
                if(this.phoneInputVer){
                    api.sendCode(this.submitData.phone).then(function (res) {
                        if(res.code === '000'){
                            _this.countdownStart = true;
                        }
                    });
                }else{
                    this.toastOption = {
                        show : true,
                        text : '请输入正确的手机号码'
                    }
                }
            },
            submit : function () {
                var urlParam = function () {
                    var urlParamObj = {};
                    if(location.search.split('?')[1]){
                        var urlParamList = location.search.split('?')[1].split('&');
                        urlParamList.map(function (a) { return urlParamObj[a.split('=')[0]] = a.split('=')[1];});
                    }
                    return urlParamObj;
                };
                const _this = this;
                if(this.phoneInputVer && this.codeInputVer){
                    api.bindingPhone(this.submitData).then(function (res) {
                        if(res.code === '000'){
                            _this.$store.state.userId = localStorage.userId = JSON.parse(res.data).userId;
                            setTimeout(function () {
                                if(urlParam().service){
                                    _this.$router.push('/serviceinfo/'+urlParam().service)
                                }else {
                                    history.go(-1);
                                }
                            },50);
                        }else{
                            _this.$router.push('/requestresult/5/'+encodeURIComponent(JSON.stringify({msg:res.msg})));
                        }
                    });
                }else{
                    if(!$('#phoneInput input').val().trim()) _this.$vux.toast.text('请输入正确的手机号码', 'top');
                    else if(!$('#verCode input').val().trim()) _this.$vux.toast.text('请输入验证码', 'top');
                }
            }
        }
    }
</script>
<style lang="less">
    #loginBox{
        ::-webkit-input-placeholder {color: #ccc;}
        .vux-no-group-title{margin-left: .25rem; margin-right: .25rem; margin-top: 0; padding-top: .35rem;}
        .vux-no-group-title:before,.vux-no-group-title:after{display: none;}
        .input-text{border-bottom:1px solid #e9e9e9;padding: .14rem 0;}
        .input-text:before{display: none;}
        .input-text+.input-text{margin-top: .16rem;}
        .input-text input{vertical-align: middle;font-size: .18rem;color: #333;}
        .input-icon{vertical-align: middle;width: .24rem;height: .24rem;margin-right: .1rem;}
        .get-code,.count-down{font-size: .16rem;color: #fff;background: #01A7E1;width: 1.04rem;height: .36rem;
            text-align: center;line-height: .36rem;display: block;border-radius: 1rem;margin-left: .1rem;}
        .get-code.disabled,.count-down{background: #dfdfdf;}
        .count-down:after{content:'s';}
        .btn{margin-top: .4rem; height: .44rem; border-radius: .35rem; color: white; border: none; outline: none; font-size: .18rem;
           background: #dfdfdf;display: block; text-align: center; line-height: .44rem;}
        .btn.active{background: linear-gradient(to left, #5dd0f8, #01A7E1);}
        .tips{font-size: .12rem; color: #999; line-height: 1.7; margin: 0 auto .3rem; position: fixed; left: 0; bottom: 0; width: 3.24rem; right: 0;}
        .tips.hide{display: none;}
        .tips>img{width: .15rem; height: .16rem; vertical-align: middle;}
        .tips>span{display: inline-block;vertical-align: top;width: 100%;margin-left: .05rem;color: #999;font-size: .12rem}
    }
</style>
