<template>
    <div id="archives">
        <ul>
            <li>
                <span class="title">手机号</span>
                <input type="text" v-model="userInfo.phone" class="text fr phone" readonly="readonly">
            </li>

            <li>
                <span class="title">真实姓名</span>
                <input type="text" v-model="userInfo.patientname" class="text fr"/>
            </li>
            <li>
                <selector title="性别" :options="sexList" v-model="userInfo.patientgender" placeholder="请选择"></selector>
            </li>
            <li>
                <datetime title="出生年月" v-model="patientbirthdate" :min-year=1900 :max-year=2100 cancel-text="取消" confirm-text="确认" placeholder="请选择" :class="{placeholder:!patientbirthdate}"></datetime>
            </li>
            <li>
                <selector title="手术方式" :options="templateList" v-model="userInfo.template" placeholder="请选择"></selector>
            </li>
            <li>
                <datetime  title="手术日期" v-model="userInfo.starttime" :min-year=1900 :max-year=2100 cancel-text="取消" confirm-text="确认" placeholder="请选择" :class="{placeholder:!userInfo.starttime}"></datetime>
            </li>
        </ul>
        <a href="javascript:;" class="sure" :class="{active:canCommit}" @click='commit()'>确定</a>
    </div>
</template>
<script>
import api from '../server'
import {Selector, Group, Calendar, Cell ,Datetime } from 'vux'

export default {
    components: {
        Calendar,
        Group,
        Cell,
        Selector,
        Datetime

    },
    data () {
        return {
            userInfo:{
                planid : this.$route.params.planid,
                patientname : '',
                phone : '',
                starttime :'',
                patientgender : '',
                template : '',
                creator:'-1'
            },
            patientbirthdate : '',
            sexList: [{key: '1', value: '男'}, {key: '2', value: '女'}],
            templateList: [],
            suid : ''
        }
    },
    computed:{
        canCommit(){
            return this.userInfo.patientname && this.userInfo.patientgender && this.patientbirthdate && this.userInfo.template && this.userInfo.starttime
        }
    },
    mounted(){
        const _this = this;
        api.getUserInfo(this.$store.state.openId).then(function (res) {
            if(res.code === '000'){
                _this.userInfo.patientname = res.data.username;
                _this.userInfo.phone = res.data.cellPhone;
            }
        });
        if(api.MODEL === 'dev'){
            this.suid="575f6e8d56c9711e340b94b6";
        }else if(api.MODEL === 'dist'){
            this.suid="574816725b3f48cd9dfc30df";
        }
        api.wtemplatelist(this.suid,function (res) {
            if(res.code === '000'){
                const data = JSON.parse(res.data);
                data.map(function (item) {
                    _this.templateList.push({
                        key : item.id,
                        value : item.name
                    })
                });
            }
        })
    },
    methods:{
        commit(){
            if(this.canCommit){
                this.userInfo.patientbirthdate = new Date(this.patientbirthdate+'').getTime();
                this.userInfo.suid = this.suid;
                api.commitTemplateBaseInfo(this.userInfo,function (res) {
                    if(res.code === '000'){
                        location.replace(JSON.parse(res.data).url);
                    }
                })
            }else{
                if(!this.userInfo.patientname) this.$vux.toast.text('请输入真实姓名', 'top');
                else if(!this.userInfo.patientgender) this.$vux.toast.text('请选择性别', 'top');
                else if(!this.patientbirthdate) this.$vux.toast.text('请选择出生年月', 'top');
                else if(!this.userInfo.template) this.$vux.toast.text('请选择手术方式', 'top');
                else if(!this.userInfo.starttime) this.$vux.toast.text('请选择手术日期', 'top');
            }
        }
    }
}
</script>

<style lang="less">
#archives{
    .fr{float: right}
    ul{padding:0 0.12rem;box-sizing: border-box; font-size: 0.14rem;}
    ul li{width:100%;height: 0.48rem;line-height: 0.48rem;margin:0;padding: 0;overflow: hidden}
    .weui-cell{padding:0 !important;margin:0 !important;color:#333;}
    span.title,.weui-label{color:#666;width: 1.2rem;}
    .weui-cell__ft{color: #333}
    .phone{color:#aaa !important;}

    .weui-cell_access .weui-cell__ft{font-size: 0.14rem;color:#333;padding-right: 0 !important;}
    input.text,span.date{line-height: inherit;color:#333;font-size:0.14rem;border:none;text-align: right;outline: none;width: 80%}
    .sure{width: 3.25rem;height: 0.44rem;line-height: 0.44rem;font-size:0.18rem;color:#fff;background: #dfdfdf;border-radius: 0.35rem;margin:0.3rem auto 0;display: block;text-align: center}
    .sure.active{background: #e2bc81;}
    .weui-cell_select .weui-select{padding-right: 0;text-align: right !important;}
    select { text-align: right ;width: 100%;height:.44rem;direction: rtl;}
    option { text-align: right;height: inherit;direction: ltr;}
    .weui-cell_select .weui-cell__bd:after{right: -1rem !important;}
    .weui-cell_access .weui-cell__ft:after{right:-1rem !important;}

    .weui-select{font-family: 'Microsoft YaHei';}
    .placeholder .vux-datetime-value{color:#A9A9A9;}
}
    .vux-popup-dialog{font-size: 0.14rem !important;}
</style>