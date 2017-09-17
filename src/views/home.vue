<template>
    <div id="home">
        <swiper id="swiper" :list="swiperList" auto loop :interval="5000" dots-position="center" :aspect-ratio="300/750"></swiper>
        <a href="#/doctorlist/1/{}" class="expert">
            <img src="../assets/home_expert_photo@2x.png" alt="">
            <div class="expert-text">
                <p>专家一对一</p>
                <p>医生预约见面充分咨询评估</p>
            </div>
        </a>
        <a href="#/doctorlist/2/{}" class="expert">
            <img src="../assets/expert_photo_dianhua@2x.png" alt="">
            <div class="expert-text">
                <p>名医电话</p>
                <p>接通专家充分交流</p>
            </div>
        </a>
        <div class="divide"></div>
        <!--套餐包-->
        <div class="package">
            <router-link class="package-list" :to="'/servicedetail/' + packageList[0]">
                <img src="../assets/line_hong@2x.png" alt="">
                <p>孕产VIP服务</p>
                <p>全程备孕 孕期管理</p>
            </router-link>
            <router-link class="package-list" :to="'/servicedetail/' + packageList[1]">
                <img src="../assets/line_lan@2x.png" alt="">
                <p>专家备孕服务</p>
                <p>专业备孕指导 助力受孕</p>
            </router-link>
            <!--<router-link class="package-list" :to="'/servicedetail/' + packageList[1]">-->
                <!--<img src="../assets/line_lan@2x.png" alt="">-->
                <!--<p>儿科服务</p>-->
                <!--<p>儿童健康保障</p>-->
            <!--</router-link>-->

            <router-link class="package-list" :to="'/servicedetail/' + packageList[2]">
                <img src="../assets/line_zi@2x.png" alt="">
                <p>儿童先心病服务</p>
                <p>专家长期随访</p>
            </router-link>
        </div>
        <div class="divide"></div>
        <!--分组-->
        <div class="group">
            <div class="title">
                <img src="../assets/home_titile_shu@2x.png" alt="title"><span>专业分组</span>
            </div>
            <div class="group-list">
                <p class="group-title">产科</p>
                <p>提供专家教授高质量医疗咨询服务，可满足备孕、二胎、孕妇各年龄段女性医疗疾病保健需求</p>
                <div class="group-doc">
                    <router-link class="doc-list" :to="'/doctordetail/0/'+n.doctorId" v-for="n in group.gynaecology" :key="n">
                        <img :src="IMGURL + n.url" :onerror="defaultImg" alt="">
                        <p>{{n.doctorName}}</p>
                        <p>{{n.title}}</p>
                    </router-link>
                </div>
            </div>
            <!--<div class="group-list">-->
                <!--<p class="group-title">儿科</p>-->
                <!--<p>提供高质量儿科咨询预约服务，帮助预防并处理婴幼儿、儿童和青少年的各种疾病健康问题</p>-->
                <!--<div class="group-doc">-->
                    <!--<router-link class="doc-list" :to="'/doctordetail/0/'+n.doctorId" v-for="n in group.child">-->
                        <!--<img :src="IMGURL + n.url" :onerror="defaultImg" alt="">-->
                        <!--<p>{{n.doctorName}}</p>-->
                        <!--<p>{{n.title}}</p>-->
                    <!--</router-link>-->
                <!--</div>-->
            <!--</div>-->
            <div class="group-list">
                <p class="group-title">儿童心血管科</p>
                <p>全国最早开展儿童先天性心血管疾病介入诊断和治疗的儿童心血管专科，解决儿童专业疾病问题</p>
                <div class="group-doc">
                    <router-link class="doc-list" :to="'/doctordetail/0/'+n.doctorId" v-for="(n,key) in group.reproiducction" :key="n">
                        <img :src="IMGURL + n.url" :onerror="defaultImg" alt="">
                        <p>{{n.doctorName}}</p>
                        <p>{{n.title}}</p>
                    </router-link>
                </div>
            </div>
        </div>
        <div class="divide"></div>
        <!--咨询-->
        <div class="consultation">
            <div class="title">
                <img src="../assets/home_titile_shu@2x.png" alt="title"><span>健康资讯</span>
            </div>
            <a class="consultation-list" v-for="n in healthInquiry" :href="n.url">
                <img :src="n.coverImgUrl" alt="">
                <p>{{n.title}}</p>
                <p>{{n.author}}{{n.authorTitles}}</p>
                <p>{{n.description}}</p>
            </a>
        </div>
    </div>
</template>
<script>
    import {Swiper,Tabbar,TabbarItem} from 'vux'
    import api from '../server'
    export default{
        data(){
            return{
                swiperList:[],//banner参数
                healthInquiry:[],
                defaultImg: 'this.src="' + require('../assets/head_default@2x.png') + '"',//默认图片
                IMGURL:api.BASEIMGURL
            }
        },
        computed:{
            packageList(){
                if(api.MODEL === 'dev'){
                    return [1,2,3]
                }else if(api.MODEL === 'dist'){
                    return [1,2,3]
                }
            },
            group(){
                if(api.MODEL === 'dev'){
                    return {
                        gynaecology:[
                            {'doctorId':'511',doctorName:'姚强','title':'副主任医师','url':'avatar/20151224/422685195947059790.jpg'},
//                            {'doctorId':'6231',doctorName:'刘辉','title':'主任医师','url':'avatar/20160706/facea4d0f73d41a39dc68c6528206c90.jpg'},
//                            {'doctorId':'509',doctorName:'秦朗','title':'副主任医师','url':'old/base/old/20150801/4387b9b565774202a50d85bf42df3b8c.png'}
                        ],
                        child:[
                            {'doctorId':'280',doctorName:'邓建军','title':'副主任医师','url':'old/base/20150603/dengjianjun.jpg'},
                            {'doctorId':'7610',doctorName:'李德渊','title':'副教授','url':'avatar/20161130/eb9fb7473a6548a496c7d0f5e9d18825.png'},
                        ],
                        reproiducction:[
                            {'doctorId':'6605',doctorName:'华益民','title':'主任医师','url':'avatar/20160706/f2a9cdf8f6db4ee4a13794a602029761.jpg'},
                            {'doctorId':'283',doctorName:'王晓琴','title':'副主任医师','url':'old/base/20150417/427559bdb7bb43549831fd19b6c047b7.png'},
                            {'doctorId':'3940',doctorName:'周开宇','title':'副主任医师','url':'avatar/20160211/周开宇.jpg'},
                        ],
                    }
                }else if(api.MODEL === 'dist'){
                    return {
                        gynaecology:[
                            {'doctorId':'511',doctorName:'姚强','title':'副主任医师','url':'avatar/20170707/5b3ddf8f7c5f42ee8e13524c6d26576e.png'},
//                            {'doctorId':'6231',doctorName:'刘辉','title':'主任医师','url':'avatar/20160706/facea4d0f73d41a39dc68c6528206c90.jpg'},
//                            {'doctorId':'509',doctorName:'秦朗','title':'副主任医师','url':'old/base/old/20150801/4387b9b565774202a50d85bf42df3b8c.png'}
                        ],
                        child:[
                            {'doctorId':'280',doctorName:'邓建军','title':'副主任医师','url':'old/base/20150603/dengjianjun.jpg'},
                            {'doctorId':'7610',doctorName:'李德渊','title':'副教授','url':'avatar/20161130/eb9fb7473a6548a496c7d0f5e9d18825.png'},
                        ],
                        reproiducction:[
                            {'doctorId':'6605',doctorName:'华益民','title':'主任医师','url':'avatar/20170707/730dde5748c64d849e181df4df5e5bf6.jpeg'},
                            {'doctorId':'283',doctorName:'王晓琴','title':'副主任医师','url':'avatar/20170707/4f0990a31a7c4c6f9cfed82421dd2434.jpeg'},
                            {'doctorId':'3940',doctorName:'周开宇','title':'副主任医师','url':'avatar/20170707/5a472e34820846d9a36fdbbe774e9863.jpeg'},
                        ],
                    }
                }
            }
        },
        mounted(){
            var _this = this;
            api.getBanner().then(function (res) {
                const data = res.data;
                if(data.length) $('#swiper').show();
                else $('#swiper').hide();
                data.map(function (index) {
                    index.img = _this.IMGURL + index.coverImgUrl;
                    delete index.title;
                    _this.swiperList.push(index);
                })
            });
            api.getHealthInfo().then(function (res) {
                var data = res.data;
                data.map(function (index) {
                    index.coverImgUrl = _this.IMGURL+index.coverImgUrl;
                });
                _this.healthInquiry = data;
            })
        },
        methods:{

        },
        components:{
            Swiper,
            Tabbar,
            TabbarItem
        }
    }
</script>
<style lang="less">
    #home{
        font-size: 12px;
        padding-bottom:.5rem;
        .swiper-demo-img img {width: 100%;}
        .vux-icon-dot{width: .06rem;height: .06rem;border-radius: .04rem;background-color: rgba(255,255,255,.4);}
        .vux-icon-dot.active{width: .10rem;background-color: #fff;}
        .expert{margin-left: .16rem;height:1.01rem;overflow: hidden; display: block;}
        .expert:nth-of-type(1){border-bottom: 1px solid #e9e9e9}
        .expert img{width: .6rem;height: .68rem; margin-right: .16rem; float: left;margin-top: .16rem}
        .expert .expert-text{float: left;width: 2rem;display: inline-block}
        .expert-text p:first-child{color: #333; font-size: .18rem; margin-top: .25rem; margin-bottom: .06rem;font-weight: bold;}
        .expert-text p:nth-of-type(2){color: #999; font-size: .14rem; overflow: hidden;text-overflow: ellipsis; white-space: nowrap;}
        /*.expert-text p:last-child{color: #01A7E1; font-size: .12rem; border: 1px solid; border-radius: .12rem;*/
            /*padding: 0 .08rem; display: inline-block;}*/
        .divide{width: 100%;height: .1rem;background-color: #f6f6f6;}

        /*套餐*/
        .package{width: 100%;overflow: hidden;font-size: 0}
        .package-list{width: 33.3%;float: left;text-align: center;font-size: 0;position: relative;height: 1.45rem;background-repeat: no-repeat;background-size: 100%;background-position: bottom}
        .package-list:first-child{background-image: url("../assets/home_Icon_yunqi@2x.png");}
        .package-list:nth-of-type(2){background-image: url("../assets/home_icon_beiyun@2x.png")}
        .package-list:last-child{background-image: url("../assets/home_icon_xianxinbing@2x.png")}
        .package-list img{width: 100%;}
        .package-list p:nth-of-type(1){margin-top: .22rem;font-size: .16rem;color: #333;margin-bottom: .05rem}
        .package-list p:nth-of-type(2){font-size: .12rem;color: #999}
        .package-list:not(:last-child):after{content: '';display: inline-block;width: 1px;height: .53rem;background-color: #e9e9e9;position: absolute;right: 0;margin-top: -.26rem;top: 50%}
        /*分组*/
        .group{width: 100%;overflow: hidden}
        .title{width: 100%;height: .4rem;border-bottom: 1px solid #e9e9e9;font-size: .14rem;color: #666;line-height: .4rem;}
        .title img{height: .18rem;width: .05rem;margin-right: .1rem;vertical-align: middle;}
        .title span{display: inline-block;vertical-align: middle;}
        .group-list{margin-left: .12rem;margin-top: .12rem;padding-right: .12rem;border-bottom: 1px solid #e9e9e9;}
        .group-title{margin-bottom: .08rem;font-size: .16rem;color: #01A7E1;}
        .group-title+p{color: #999;font-size: .14rem;text-align: justify;line-height: .22rem;height: .44rem}
        .group-doc{width: 100%;overflow: hidden;margin-top: .12rem}
        .doc-list{display:inline-block;width: .6rem;margin-right: .36rem;text-align: center;vertical-align: top;}
        .doc-list img{width: 100%;height: .6rem;border-radius: .6rem;margin-bottom: .06rem}
        .doc-list p:nth-of-type(1){color: #333;font-size: .16rem;margin-bottom: .04rem}
        .doc-list p:last-child{color: #999;font-size: .12rem;margin-bottom: .12rem;height: .36rem;overflow: hidden;}
        /*咨询*/
        .consultation{width: 100%;overflow: hidden}
        .consultation-list{display:block;padding: .12rem;border-bottom: 1px solid #e9e9e9}
        .consultation-list>img{width: 100%;height: 1.3rem;margin-bottom: .14rem}
        .consultation-list p:nth-of-type(1){color: #333;font-size: .16rem;font-weight: bold;margin-bottom: .1rem}
        .consultation-list p:nth-of-type(2){color: #333;font-size: .14rem;line-height: .22rem;margin-bottom: .1rem}
        .consultation-list p:last-child{color: #999;font-size: .14rem;line-height: .22rem;max-height: .44rem;overflow: hidden;}

        .vux-swiper-desc{background-image: none;}
    }
</style>
