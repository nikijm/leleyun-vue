<template>
    <div id="phoneOrder">
        <div class="flow">
            <img :src="flowImg" alt="">
        </div>
        <div class="divide"></div>
        <form class="form">
            <x-input id="patientName" :readonly="baseInfo" title="姓名" name="username" placeholder="请输入姓名" v-model="infoModal.userName"></x-input>
            <x-input id="patientPhone" :readonly="baseInfo" title="电话" name="mobile" placeholder="请输入手机号码" :max="11" keyboard="number" v-model="infoModal.userMobile"></x-input>
        </form>
        <div class="divide"></div>
        <div class="info">
            <div class="title">
                病情描述 <span>（上传照片有助于医生对病情了解）</span>
            </div>
            <div class="textarea">
                <textarea placeholder="请输入病情描述..." v-model="infoModal.comment" maxlength="200"></textarea>
            </div>
            <div class="upload">
                <div class="img-box">
                    <span v-for="(item,index) in infoModal.img" class="img-list">
                        <img class="previewer-demo-img" :src="item.src" :onerror="defaultImg" @click="show(index)">
                        <img src="../assets/icon_picture_delet@2x.png" alt="delete" class="delete" @click="deleteImg(index)">
                    </span>
                    <span class="upload-img" v-show="showUpload">
                        <input type="file" @change="uploadImg($event)">
                    </span>
                </div>
                <div v-transfer-dom>
                    <previewer :list="infoModal.img" ref="previewer" :options="options"></previewer>
                </div>
            </div>
            <button class="btn" :class="{'active':isClick}" @click="submitOrder">{{btntext}}</button>
            <div class="tips">
                <img src="../assets/icon_tip@2x.png" alt="tips">
                <span>医生是利用休息时间接听电话，门诊时间不接听电话，平台工作时间为9:00-21:00</span>
            </div>
        </div>
    </div>
</template>
<script>
    import {XInput,Previewer,TransferDom} from 'vux'
    import api from '../server'
    import isMobilePhone from 'validator/lib/isMobilePhone'
    export default{
        directives:{
            TransferDom
        },
        components:{
            XInput,
            Previewer,
        },
        beforeCreate(){
            if(!this.$store.state.userId){
                this.$router.replace('/login');
            }
        },
        methods:{
            show (index){ //预览照片
                this.$refs.previewer.show(index)
            },
            deleteImg(index){ //删除照片
                this.infoModal.img.splice(index,1);
            },
            getPatientDetail(openId,orderId){ //预览订单信息
                var _this = this;
                api.getPatientDetail(openId,orderId).then(function (res) {
                    if(res.code == '000'){
                        _this.infoModal = res.data;
                    }
                })
            },
            modifyPatientDetail(modal){ //修改订单信息
                var _this = this;
                var modal = Object.assign({},modal);
                modal.img = JSON.stringify(modal.img);
                api.modifyPatientDetail(modal).then(function (res) {
                    if(res.code === '000'){
                        _this.$router.push('/phoneorderdetail/'+_this.$route.params.orderId);
                    }
                })
            },
            addCallOrder(modal){ //提交电话订单
                var _this = this;
                var modal = Object.assign({},modal);
                modal.img = JSON.stringify(modal.img);
                api.addCallOrder(modal).then(function (res) {
                    if(res.code === '000'){
                        _this.$router.push('/orderpay/'+res.data);
                    }
//                    else if(res.code === '1-108'){ //有待支付的订单
//                        _this.$vux.confirm.show({
//                            title:'订单提醒',
//                            content:'您还有一个订单未支付喔！您可以点击“去支付”支付该订单，也可以去取消后重新下单',
//                            'cancelText':'去取消',
//                            'confirmText':'去支付',
//                            onConfirm (){
//                                _this.$router.push('/orderpay/'+res.data);
//                            },
//                            onCancel(){
//                                _this.$router.push('/phoneorderdetail/'+res.data);
//                            }
//                        })
//                    }
                })
            },
            submitOrder(){ //点击提交按钮
                if(this.isClick){
                    if(this.$route.params.orderId != 0){
                        this.modifyPatientDetail(this.infoModal)
                    }else {
                        this.addCallOrder(this.infoModal)
                    }
                }else{
                    if(!$('#patientName input').val().trim()) this.$vux.toast.text('请输入姓名', 'top');
                    else if(!$('#patientPhone input').val().trim()) this.$vux.toast.text('请输入正确的手机号码', 'top');
                    else if(!this.infoModal.comment) this.$vux.toast.text('请输入病情描述','top')
                }

            },
            uploadImg(evt){ //上传图片
                var _this = this;
                var formdata = new FormData();
                var fileObj = evt.target.files;
                for (var i = 0; i < fileObj.length; i++){
                    formdata.append("web", fileObj[i]);
                }
                $('.upload-img').css('background-image','url('+require('../assets/loading.gif')+')');
                api.uploadImg(formdata,function (res) {
                    if(res.code == '000'){
                        var data = JSON.parse(res.data);
                        var item = {
                            src: _this.IMGURL+data.url,
                            w:data.srcWidth,
                            h:data.srcHeight
                        };
                        _this.infoModal.img.push(item);
                    }else {
                        _this.$vux.toast.show({
                            text:'上传图片失败',
                            positon:'top',
                            type:'text',
                            time: 2000
                        })
                    }
                    $('.upload-img').css('background-image','url('+require('../assets/add_picture@2x.png')+')');
                })
            }
        },
        data(){
            return {
                options: {
                    getThumbBoundsFn(index) {
                        let thumbnail = document.querySelectorAll('.previewer-demo-img')[index];
                        let pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
                        let rect = thumbnail.getBoundingClientRect();
                        return {x:rect.left,y:rect.top + pageYScroll,w:rect.width}
                    }
                },
                defaultImg: 'this.src="' + require('../assets/head_default@2x.png') + '"',//默认图片
                IMGURL:api.BASEIMGURL,
                btntext:(this.$route.params.orderId == 0)?'提交订单':'修改订单',
                infoModal:{
                    userName:'',
                    userMobile:'',
                    comment:'',
                    openId:this.$store.state.openId,
//                    userId:this.$store.state.openId,
                    doctorId:this.$route.params.doctorId,
                    orderId:(this.$route.params.orderId=='0')?'':(this.$route.params.orderId),
                    img:[],
                },
                addLoading:require('../assets/loading.gif'),
                baseInfo:false,
                flowImg:require('../assets/order_tianxie_liucheng_tanxie@2x.png')
            }
        },
        created:function () {

        },
        mounted:function () {
            var _this = this;
            if(this.$route.params.orderId != '0'){ //组件加载完成获取订单详情（不是提交订单）
                document.title = '修改订单';
                _this.baseInfo = true;
                _this.flowImg = require('../assets/order_tianxie_liucheng_yuyue@2x.png')
                api.getPatientDetail(this.$store.state.openId,this.$route.params.orderId).then(function (res) {
                    if(res.code === '000'){
                        const data = res.data;
                        _this.infoModal.userName = data.userName;
                        _this.infoModal.userMobile = data.userMobile;
                        _this.infoModal.comment = data.comment;
                        _this.infoModal.img = JSON.parse(data.img) || [];
                    }
                })
            }else {
                document.title = '订单填写';
                api.getUserInfo(this.$store.state.openId).then(function (res) {
                    if(res.code === '000'){
                        _this.infoModal.userName = res.data.username;
                        _this.infoModal.userMobile = res.data.cellPhone;
                    }
                })
            }

        },
        computed:{
            showUpload:function () { //检测只能上传8张图片
                if(this.infoModal.img.length == 8){
                    return false
                }else {
                    return true
                }
            },
            isClick:function () { //判断按钮是否可点击
                return !!(this.infoModal.userName && isMobilePhone(this.infoModal.userMobile.toString(), 'zh-CN') && this.infoModal.comment);
            },
            topImg:function () { //顶部流程图判断

            }
        }
    }
</script>
<style lang="less">
    #phoneOrder{
        font-size: 12px;
        .divide{width: 100%;height: .1rem;background-color: #f2f2f2;}
        .flow{width: 100%}
        .flow img{width: 100%;}

        .form{padding-left: .12rem;background-color: white;}
        .weui-cells{margin-top: 0;}
        .weui-cell{padding: 0;height: .48rem;line-height: .48rem;}
        .weui-cell:before{left: 0;}
        .weui-input{color: #666;font-size: .14rem}
        .weui-input[readonly]{color: #aaa;}
        .weui-label{width: auto!important;letter-spacing: 1em;font-size: .14rem;}
        .weui-cell__bd{margin-left: .38rem}

        /*病情描述*/
        .info{width: 100%;overflow: hidden}
        .title{height: .4rem;line-height: .4rem;color: #666;font-size: .14rem;padding-left: .12rem;border-bottom: 1px solid #e9e9e9}
        .title span{color: #999;font-size: .12rem}
        .textarea{margin-left: .12rem;padding: .14rem .12rem .14rem 0;border-bottom: 1px solid #e9e9e9}
        .textarea textarea{resize: none;width: 100%;height: .88rem;border: none;outline: none;color: #666;font-size: .14rem;line-height: .22rem;
                text-align: justify}

        .upload{padding: .16rem .12rem;overflow: hidden}
        .upload img{height: .8rem;width: .8rem;}
        .img-box{font-size: 0;}
        .img-box span{float:left;position: relative;font-size: 0;margin-bottom: .12rem;height: .8rem;width: .8rem;}
        .img-list:not(:nth-child(4n)){margin-right: .1rem;}
        .img-box .delete{position: absolute;width: .22rem;height: .22rem;right: -.06rem;top: -.11rem;}
        .upload-img{background-image: url("../assets/add_picture@2x.png");background-size: cover;}
        .upload-img input{display: inline-block;width: 100%;height: 100%;position: absolute;opacity: 0;}

        .btn{margin-top: .26rem;height: .44rem;width: calc(~'100% - .5rem');margin-left: .25rem;border-radius: .35rem;color: white;
            border: none;outline: none;font-size: .18rem;background:#dfdfdf}
        .btn.active{background:linear-gradient(to left, #5dd0f8, #01A7E1)}

        .tips{margin-top: .22rem;color: #999;font-size: .12rem;line-height: .2rem;padding: 0 .12rem;}
        .tips>*{float: left;}
        .tips img{width: .14rem;margin-right: .06rem}
        .tips span{width: 3.31rem;margin-top: -.02rem}

    }
    .weui-toast.weui-toast_text{}
</style>