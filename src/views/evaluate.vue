<template>
    <div id="evaluate">
        <div class="rater">
            <rater v-model="starValue" active-color="#ff956b" ></rater>
        </div>
        <p class="satisfied">{{satisfied}}</p>
        <div class="common-box">
            <span v-for="n in labelList" :data-rid="n.rowId" @click="selectLabel($event)">{{n.name}}</span>
        </div>
        <div class="info">
            <textarea placeholder="请输入评价内容" v-model="info"></textarea>
        </div>
        <div class="btn">
            <a :class="{'active':isClick}" @click="submit()">提交</a>
        </div>
    </div>
</template>
<script>
    import {Rater} from 'vux'
    import api from '../server'
    export default{
        components:{
            Rater
        },
        data(){
            return{
                starValue:5,
                label:[],
                info:'',
                goodlabel:[],
                badlabel:[]
            }
        },
        computed:{
            satisfied:function () {
                if(this.starValue == 5){
                    return '非常满意，无可挑剔'
                }else if(this.starValue == 4){
                    return '比较满意，可以改善'
                }else if(this.starValue == 3){
                    return '一般，差强人意'
                }else if(this.starValue == 2){
                    return '不满意，比较差'
                }else {
                    return '非常不满意，各方面都很差'
                }
            },
            labelList:function () {
                $('.common-box span').removeClass('active');
                this.label = [];
                if(this.starValue <=3){
                    return this.badlabel
                }else {
                    return this.goodlabel
                }
            },
            isClick:function () {
                if(this.starValue && this.label.length>0){
                    return true;
                }else {
                    return false;
                }
            }
        },
        methods:{
            selectLabel(evt){ //选择标签事件
                if($(evt.currentTarget).hasClass('active')){
                    $(evt.currentTarget).removeClass('active');
                    var index = this.label.indexOf(evt.currentTarget.innerText);
                    this.label.splice(index,1);
                }else {
                    if(this.label.length == 4){
                        this.$vux.alert.show({
                            title:'',
                            content:'只能选择4个标签'
                        });
                    }else {
                        $(evt.currentTarget).addClass('active');
                        this.label.push(+$(evt.currentTarget).attr('data-rid'));
                    }
                }
            },
            submit(){ //提交评价
                if(this.isClick){
                    var modal = {
                        "openId":this.$store.state.openId,//微信openId
                        "tags":this.label.join(','),//评价标签id列表
                        "orderId":this.$route.params.id,//订单id
                        "content":this.info,//评价内容
                        "rating":this.starValue,//分数
                    };
                    api.patientEvaluatedDoctor(modal).then(function (res) {
                        if(res.code == '000'){
                            location.href = '#/myorder'
                        }
                    })
                }else {
                    this.$vux.toast.show({
                        text:'请选择标签',
                        position:'top',
                        type:'text',
                        time:1000
                    })
                }

            }
        },
        mounted:function () {
            var _this = this;
            api.queryCommentTagByRating(this.$store.state.openId).then(function (res) {
                if(res.code == '000'){
                    var data = res.data;
                    _this.goodlabel = data.goodTags;
                    _this.badlabel = data.badTags;
                }
            })
        }
    }
</script>
<style lang="less">
    #evaluate{
        font-size: 12px;
        overflow: hidden;
        .rater{margin-top: .4rem;text-align: center;}
        .vux-rater a{
            margin-right: .08rem!important;
            .vux-rater-inner{font-size: .35rem}
        }
        .satisfied{text-align: center;margin-top: .08rem;font-size: .14rem;color: #666;}
        .common-box{padding: .12rem;margin-top: .12rem;}
        .common-box span{display:inline-block;border: 1px solid #ccc;border-radius: 1rem;font-size: .14rem;color: #666;padding: .05rem .1rem;
            margin-bottom: .12rem;margin-right: .12rem;}
        .common-box span.active{color: #fe7b4f;border-color: #fe7b4f;background-color: #fef2ee}
        .info{padding: 0 .12rem;}
        .info textarea{padding: .12rem;height: 1.61rem;width: calc(~'100% - .24rem');resize: none;text-align: justify;
                color: #333;font-size: .14rem;background-color: #f2f2f2;border: 1px solid #f2f2f2;outline: none;border-radius: 4px}
        .btn{width: 100%;text-align: center;margin-top: .2rem}
        .btn a{display: inline-block;height: .44rem;width: 3.25rem;background-color: #dfdfdf;border-radius: 1rem;line-height: .44rem;font-size: .18rem;color: #fff;}
        .btn a.active{ background: linear-gradient(to left, #5dd0f8, #01A7E1);}
    }
</style>