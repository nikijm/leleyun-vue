<template>
    <div id="serviceInfo">
        <div class="form-info">
            <div class="info-title">
                订购信息
            </div>
            <div class="info-list">
                <img src="../assets/name@2x.png" class="user"><input type="text" placeholder="请输入您的姓名" v-model="userName">
            </div>
            <div class="info-list">
                <img src="../assets/phone@2x.png" class="phone"><input type="text" placeholder="请输入您的手机号码" readonly v-model="cellPhone">
            </div>
        </div>
        <div class="divide"></div>
        <div class="service-agree">
            <p class="agree-title">服务协议</p>
            <div class="query-agree" @click="agreeClick">
                <img src="../assets/unchosen@2x.png" v-show="!agree">
                <img src="../assets/choosed@2x.png" v-show="agree">
                <span>您已阅读并同意<span>《孕产VIP专家服务包协议》</span></span>
            </div>
            <p v-html="agreeHtml">

            </p>
            <!--<p class="agree-list">1.乙方就本项目所编写的网站知识产权归乙方所有，乙方有权保留任何有关的源代码及数据结构。</p>-->
            <!--<p class="agree-list">-->
                <!--2.乙方基于委托事项所完成或正在制作中的创意、概念、美术作品、文案、故事版、调查研究、广告、文章，包括基于运行管理网站获得或形成的资料、数据、档案、图标、格式、记录-->
                <!--等相关信息，其知识产权应当归属于甲方，但若就有关信息，甲方未能按约付清相应款项时，则其知识产权由乙方保留。-->
            <!--</p>-->
            <!--<p class="agree-list">-->
                <!--3.乙方应尽力保护甲方的该等知识产权，未经甲方许可，不应擅自使用、提供给第三方或协助第三方使用。若甲方要求的，应将该等信息交付甲方。如果乙方认为该等信息中包含不属于-->
                <!--甲方的财产、知识产权内容的，应当另行书面提出，双方根据实际情况予以判定。-->
            <!--</p>-->
        </div>
        <div class="btn">
            <button @click="nextStep" class="active">{{price | currency}} 去支付</button>
        </div>
    </div>
</template>
<script>
    import api from '../server'
    export default {
        data(){
            return{
                agree:true,
                cellPhone:'',
                userName:'',
                agreeHtml:'',
                price:'',
            }
        },
        computed:{
            isClick(){
                if(this.userName && this.cellPhone && this.agree){
                    return true;
                }else {
                    return false;
                }
            },
        },
        created(){
            const _this = this;
            api.getWxGoodsDetail({ //获取用户基本信息
                wxGoodsId :this.$route.params.id,
                openId : this.$store.state.openId
            }).then(function (res) {
                if(res.code === '000'){
                    _this.cellPhone = res.data.cellPhone;
                    _this.price = res.data.earnestMoney;
                    document.title = res.data.name;
                }
            });
            api.getServiceAgreement(this.$route.params.id).then(function (res) {
                if(res.code === '000'){
                    _this.agreeHtml = JSON.parse(res.data).serviceAgreement;
                }
            })
        },
        mounted(){
            var h=$(window).height();
            $(window).resize(function() {
                if($(window).height()<h){
                    $('.btn').hide();
                }
                if($(window).height()>=h){
                    $('.btn').show();
                }
            });
        },
        methods:{
            agreeClick(){
                this.agree = !this.agree;
            },
            nextStep(){
                const _this = this;
                if(!this.userName){
                    this.$vux.toast.text('请输入您的名字','top');
                    return false;
                }
                if(!this.agree){
                    this.$vux.toast.text('请同意服务包协议',top);
                    return false;
                }
                api.createGoodsOrder({
                    openId : _this.$store.state.openId,
                    wxGoodsId : _this.$route.params.id,
                    userName : _this.userName
                }).then(function (res) {
                    if(res.code === '000'){
                        _this.$router.push('/orderpay/'+res.data.orderId);
                    }
                })
            }
        }
    }
</script>
<style lang="less">
    #serviceInfo{
        font-size: 12px;
        padding-top: .1rem;
        .form-info{
            padding: 0 .25rem;
            .info-title{font-size: .14rem;color: #666;margin: .1rem 0 .3rem 0}
            .info-list:nth-of-type(2){margin-bottom: .18rem}
            .info-list{
                padding-bottom: .19rem;
                height: .25rem;
                border-bottom: 1px solid #e9e9e9;
                img{width: .24rem;height: .24rem;margin-right: .1rem;vertical-align: middle}
                img.user{width: .2rem;margin-left: .04rem}
                input{border: none;font-size: .18rem;color: #333;outline: none;vertical-align: middle;width: calc(~'100% - .4rem')}
                input::-webkit-input-placeholder {color:#ccc;}
            }
        }
        .divide{width: 100%;height: .12rem;background-color: #f2f2f2}
        .query-agree{
            margin-bottom: .1rem;
            img{width: .15rem;height: .16rem;border-radius: .16rem;vertical-align: middle;margin-right: .08rem}
            >span{font-size: .12rem;color: #666;height: 100%;vertical-align: middle;span{color: #409eef}}
        }
        .service-agree{
            padding: 0 .25rem;
            margin-top: .18rem;
            padding-bottom: .7rem;
            .agree-title{font-size: .14rem;color: #666;margin-bottom: .22rem}
            .agree-list{font-size: .12rem;color: #999;text-align: justify;margin-bottom: .2rem}
        }
        .btn{
            position: fixed;
            overflow: hidden;
            bottom: 0;
            left: 0;
            width: 100%;
            max-width: 750px;
            padding: .1rem 0;
            background-color: #fff;
            button{
                border: none;
                outline: none;
                width: calc(~'100% - .48rem');
                margin-left: .24rem;
                height: .44rem;
                border-radius: .35rem;
                background-color: #dfdfdf;
                font-size: .18rem;
                color: #fff;
            }
            button.active{
                background-image: linear-gradient(-90deg,#01a2e1 22%,#91e0f3 100%);
            }
        }
    }
</style>