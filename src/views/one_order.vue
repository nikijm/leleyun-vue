<template>
    <div id="oneOrder">
        <form class="form">
            <x-input title="姓名" id="patientName" v-model="patientName" name="username" placeholder="请输入姓名" class="input"></x-input>
            <x-input title="电话" id="patientPhone" v-model="patientPhone" name="mobile" placeholder="请输入手机号码" keyboard="number" is-type="china-mobile" class="input"></x-input>
        </form>
        <div class="divide"></div>
        <div class="info">
            <div class="info-list">
                <span>预约时间</span> <span>{{info.dateStr}}</span>
            </div>
            <div class="info-list">
                <span>地&emsp;&emsp;点</span> <span>{{info.address}}</span>
            </div>
        </div>
        <div class="divide"></div>
        <div class="info">
            <div class="info-list">
                <span>预约医生</span> <span>{{info.doctorName}}<span>（{{info.doctorTitle}}）</span> </span>
            </div>
        </div>
        <!--<p class="tips">-->
            <!--<img src="../assets/icon_tip@2x.png" alt="">-->
            <!--<span>点击蓝色区域可预约医生</span>-->
        <!--</p>-->
        <a href="javascript:;" class="btn" :class="{'active': btnActive}" @click="submit($event)" >提交订单</a>
    </div>
</template>
<script>
    import {XInput,Group,XButton,Cell} from 'vux'
    import api from '../server'
    import isMobilePhone from 'validator/lib/isMobilePhone'
    export default{
        components:{
            XInput,
            Group,
            XButton,
            Cell
        },
        data(){
            return{
                info :{},
                patientName : '',
                patientPhone : ''

            }
        },
        computed : {
            btnActive : function(){
                if(this.patientName && this.patientPhone && isMobilePhone(this.patientPhone,'zh-CN')) return true;
            }
        },
        beforeCreate(){
            if(!this.$store.state.userId){
                this.$router.replace('/login');
            }
        },
        created : function () {
            var info = JSON.parse(this.$route.params.modal);
            var arr = ['上午','下午','晚上'];
            info.dateStr = new Date(info.date+8*3600000).toISOString().replace(/T.*/g,'') + ' ' + arr[info.periodTime];
            this.info = info;

            //获取个人信息
            const _this = this;
            api.getUserInfo(this.$store.state.openId).then(function (res) {
                if(res.code == '000'){
                    _this.patientName = res.data.username;
                    _this.patientPhone = res.data.cellPhone;
                }
            })
        },
        methods :{
            submit : function (e) {
                const _this = this;
                if($(e.target).hasClass('active')){
                    api.createOneOrder({
                        'openId' : this.$store.state.openId,
                        "doctorId": this.info.doctorId,
                        "schedualId": this.info.schedualId,
                        "patientName" : this.patientName,
                        "patientPhone" : this.patientPhone,
                        "date" : new Date(this.info.date+8*3600000).toISOString().replace(/T.*/g,'')
                    }).then(function (res) {
                        if(res.code === '000'){
                            _this.$router.push('/orderpay/'+res.data.rowId);
                        }
                        else if(res.code === '1-108'){ //有待支付的订单
                            _this.$vux.confirm.show({
                                title:'订单提醒',
                                content:'您还有一个订单未支付喔！您可以点击“去支付”支付该订单，也可以“去取消”后重新下单',
                                'cancelText':'去取消',
                                'confirmText':'去支付',
                                onConfirm (){
                                    _this.$router.push('/orderpay/'+res.data);
                                },
                                onCancel(){
                                    _this.$router.push('/oneorderdetail/'+res.data);
                                }
                            })
                        }
                    })
                }else{
                    if(!$('#patientName input').val().trim()) _this.$vux.toast.text('请输入姓名', 'top');
                    else if(!$('#patientPhone input').val().trim()) _this.$vux.toast.text('请输入正确的手机号码', 'top');
                }
            }
        }
    }
</script>
<style lang="less">
    html,body,#app{height: 100%;}
    #oneOrder{
        height: 100%;
        background-color: #f2f2f2;
        font-size: 12px;
        .divide{width: 100%;height: .1rem;background-color: #f2f2f2;}
        .form{padding-left: .12rem;background-color: white;}
        .weui-cells{margin-top: 0;}
        .weui-cell{padding: 0;height: .48rem;line-height: .48rem;}
        .weui-cell:before{left: 0;}
        .input{color: #666;font-size: .14rem}
        .weui-label{width: auto!important;letter-spacing: 1em}
        ::-webkit-input-placeholder {color: #ccc;}
        .weui-cell__bd{margin-left: .2rem;color: #333;}

       /*信息*/
        .info{padding-left: .12rem;background-color: white}
        .info-list{padding: .12rem 0;color: #666;font-size: .14rem;overflow: hidden}
        .info-list:not(:last-child){border-bottom: 1px solid #e9e9e9}
        .info-list>span{float: left}
        .info-list>span:first-child{width: .56rem}
        .info-list>span:last-child{color: #333;font-size: .14rem;display: inline-block;margin-left: .2rem;width:calc(~'100% - .76rem')}
        .info-list>span:last-child span{color: #666;}
        .btn{margin-top: .3rem;height: .44rem;width: calc(~'100% - .5rem');margin-left: .25rem;border-radius: .35rem;
            color: white;text-align: center;line-height: .44rem;border: none;outline: none;font-size: .18rem;background: #dfdfdf;
            display: block;}
        .btn.active{background: linear-gradient(to left, #5dd0f8, #01A7E1);}

        .tips{margin-top: .08rem;}
        .tips>img{width: .15rem; height: .16rem; vertical-align: middle;
            margin-left: .12rem; position: relative; top: .01rem; margin-right: .02rem;}
        .tips>span{font-size: .12rem;color: #999;vertical-align: middle;}
    }

</style>
