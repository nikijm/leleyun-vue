<template>
    <div id="oneHome">
        <baidu-map id="container" :center="center" :zoom="11" :scroll-wheel-zoom="true" @ready="handler" @click="$router.push('/onepractice/'+JSON.stringify({wecaId:-1}))"></baidu-map>
        <div class="divide"></div>
        <div class="practice-box">
            <div class="practice">
                <img src="../assets/home_titile_shu@2x.png"> <span>推荐执业点</span>
            </div>
            <div class="practice-info">
                <swiper :aspect-ratio="95/375" :show-dots="false">
                    <swiper-item v-for="(item,index) in addressList" :key="item" v-if="!(index%2)">
                        <a :href="'#/onepractice/' + encodeURIComponent(JSON.stringify(item))" class="practice-list">
                            <img :src="IMGURL+item.picUrl">
                            <div class="hos-info">
                                <p>{{item.name}}</p>
                                <p>{{item.summary}}</p>
                            </div>
                        </a>
                        <a v-if="addressList[index+1]" :href="'#/onepractice/'+ encodeURIComponent(JSON.stringify(addressList[index+1]))" class="practice-list">
                            <img :src="IMGURL+addressList[index+1].picUrl">
                            <div class="hos-info">
                                <p>{{addressList[index+1].name}}</p>
                                <p>{{addressList[index+1].summary}}</p>
                            </div>
                        </a>
                    </swiper-item>
                </swiper>
            </div>
        </div>
        <div class="divide"></div>
        <swiper id="swiper" v-if="swiperList.length" :list="swiperList"  auto loop :interval="5000" dots-position="center" :aspect-ratio="222/750"></swiper>
        <div v-if="swiperList.length" class="divide"></div>
        <div class="doc-box">
            <div class="doc-title">
                <span v-for="n in deptlist" :class="{'active':deptId==n.deptId}" @click="doctorlist(n.deptId)">{{n.deptName}}</span>
            </div>
            <div class="doc-list">
                <a :href="'#/doctordetail/1/'+n.doctorId+'/'+n.addressId" class="doc-item" v-for="n in doclist">
                    <img :src="IMGURL+n.doctorPhoto" :onerror="defaultImg">
                    <div class="doc-info">
                        <p>{{n.doctorName}}<span>{{n.doctorTitle}}</span><a v-show="n.surplusNum>0">预约</a><a v-show="n.surplusNum<1" class="gray">约满</a></p>
                        <p>{{n.hospitalName}} {{n.deptName}}</p>
                        <p>擅长：{{n.goodAt}}</p>
                        <div class="position">
                            <img src="../assets/icon_position.png"><span>{{n.addressName}}</span>
                            <span>{{n.nearlyDay}}</span>
                        </div>
                    </div>
                </a>
                <div class="tips">
                    <img src="../assets/logo@2x.png">
                    <span>乐医汇，优质医疗健康</span>
                </div>
            </div>
        </div>
        <div class="block"></div>
    </div>
</template>
<script>
    import {Swiper,SwiperItem,Tabbar,TabbarItem} from 'vux'
    import api from '../server'
    export default{
        components:{
            Swiper,
            SwiperItem,
            Tabbar,
            TabbarItem
        },
        created(){

        },
        data(){
            return{
                center:{lng:0,lat:0},
                swiperList:[],
                addressList:[],
                deptlist:[],
                deptId:'',
                doclist:[],
                IMGURL:api.BASEIMGURL,
                defaultImg: 'this.src="' + require('../assets/head_default@2x.png') + '"',//默认图片
            }
        },
        methods:{
            handler({BMap, map}){ //百度地图
                const _this = this;
                const geolocation = new BMap.Geolocation();
                geolocation.getCurrentPosition(function(r){
                    if(r.point && r.point.lng && r.point.lat){
                        _this.center = _this.myPoint = r.point;
                        let pt = new BMap.Point(r.point.lng,r.point.lat);
                        let myIcon = new BMap.Icon(
                            require("../assets/icon_positon_blue@1x.png"),
                            new BMap.Size(39, 25),
                            {
                                anchor : new BMap.Size(13,25)
                            }
                        );
                        let marker2 = new BMap.Marker(pt, {icon: myIcon});  // 创建标注
                        map.addOverlay(marker2);
                    }
                    let pointStr = '';
                    if(_this.center.lat && _this.center.lng) pointStr = _this.center.lng + ',' + _this.center.lat;
                    //渲染附近执业点
                    api.queryAddressList(pointStr).then(function (res) { //获取附近执业点
                        if(res.code == '000'){
                            _this.addressList = res.data;
                            for(let i = 0; i<_this.addressList.length; i++){
                                let point = {
                                    lat: _this.addressList[i].latitude,
                                    lng: _this.addressList[i].longitude
                                };
                                let marker = new BMap.Marker(point);
                                map.addOverlay(marker);
                                marker.setAnimation('BMAP_ANIMATION_BOUNCE');
                                let label = new BMap.Label("<span class='marker-text'>"+ _this.addressList[i].name +"</span>", {offset: new BMap.Size(30, -4)});
                                marker.setLabel(label);
                            }
                        }
                    });
                },{enableHighAccuracy: true});

            },
            doctorlist(id){ //查询医生列表
                const _this = this;
                _this.deptId = id;
                if(id){
                    var data = {
                        deptId:id
                    };
                }
                api.queryDoctorOneList(data).then(function (res) { //搜索医生
                    if(res.code == '000'){
                        let data = res.data;
                        data.map(function (index) {
                            if(index.nearlyDay){
                                var weekArr = ['周日','周一','周二','周三','周四','周五','周六'];
                                var nowTime = new Date(index.nearlyDay);
                                var year = nowTime.getFullYear();
                                var month = (nowTime.getMonth()+1<10?'0'+(nowTime.getMonth()+1):nowTime.getMonth()+1);
                                var date = (nowTime.getDate()<10?'0'+nowTime.getDate():nowTime.getDate());
                                var day = nowTime.getDay();
                                var week = weekArr[day];
                                index.nearlyDay = month+'月'+date+'日'+'('+week+')'
                            }
                        });
                        _this.doclist = data;
                    }
                })
            }
        },
        mounted:function () {
            const _this = this;
            api.queryDeptList().then(function (res) { //查询科室
                if(res.code == '000'){
                    _this.deptlist = [{deptName:'全部',deptId:''}].concat(res.data);
                }
            });
            this.doctorlist(this.deptId);
            api.getBanner().then(function (res) { //获取中间banner
                const data = res.data;
                data.map(function (index) {
                    index.img = _this.IMGURL + index.coverImgUrl;
                    delete index.title;
                    _this.swiperList.push(index);
                })
            });
        }
    }
</script>
<style lang="less">
    #oneHome{
        font-size: 12px;
        #container{width: 100%;height: 1.29rem;}
        .BMapLabel{border:none !important;background: transparent !important;}
        .marker-text{font-family: 'Microsoft YaHei',sans-serif;padding: 0 10px;background: #fff;border-radius: 4px;color: #333;
            font-size: 14px;position: relative;height: 30px;display: block;line-height: 30px;}
        .marker-text:before{content: ''; position: absolute; border-width: 10px; border-color: transparent #fff transparent transparent; left: -19px; bottom: 5px; border-style: solid;}
        .divide{width: 100%;height: .1rem;background-color: #f2f2f2;}
        .practice-box{
            width: 100%;height: 1.45rem;overflow: hidden;
            .practice{margin-top: .16rem;font-size: .16rem;color: #666;
                img{height: .18rem;width: .05rem;margin-right: .08rem;vertical-align: middle}
                span{display: inline-block;vertical-align: middle;}
            }
        }
        .practice-info{
            width: calc(~'100% - .24rem');overflow: hidden;padding: 0 .12rem;
            .practice-list:not(:first-child){margin-left: .12rem;}
            .practice-list{
                width: calc(~'50% - .06rem');
                float: left;
                overflow: hidden;
                margin-top: .14rem;
                img{width: .76rem;height: .76rem;border-radius: .04rem;float: left;margin-right: .1rem}
                .hos-info{
                    float: left;width: calc(~'100% - .86rem');
                    p:first-child{color: #333; font-size: .14rem; margin-bottom: .06rem; height: .19rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;}
                    p:last-child{color: #999;font-size: .12rem;word-break: break-all;}
                }
            }
        }
        //中间轮播
        .swiper-demo-img img {width: 100%;}
        .vux-icon-dot{width: .06rem;height: .06rem;border-radius: .04rem;background-color: #dfdfdf}
        .vux-icon-dot.active{background-color: #01A7E1;}

        //医生板块
        .doc-box{
            width: 100%;overflow: hidden;
            .doc-title{
                padding-left: .12rem;width: calc(~'100% - .12rem');overflow-x: auto;white-space: nowrap;height:.49rem;border-bottom: 1px solid #e9e9e9;
                span{
                    font-size: .14rem;color: #999;margin-right: .32rem;display: inline-block;height: 100%;
                    line-height: .49rem;position: relative;
                }
                span.active{color: #01a7e1;}
                span.active:after{content: '';display: inline-block;height: 2px;width: .16rem;background-color: #01A7E1;position: absolute;margin-left:-.08rem;left: 50%;bottom: 0;}
            }
            .doc-list{
                width: 100%;
                .doc-item{
                    padding: .14rem 0 .14rem .12rem;overflow: hidden;display: block;
                    >img{float: left;width: .48rem;height: .48rem;border-radius: .48rem;margin-right: .1rem}
                    .doc-info{
                        float: left; width: calc(~'100% - .7rem'); border-bottom: 1px solid #e9e9e9; padding-bottom: .14rem; padding-right: .12rem;
                        p:first-child{
                            color: #333;font-size: .16rem;overflow: hidden;margin-bottom: .05rem;
                            span{display: inline-block;margin-left: .08rem;color: #666;font-size: .14rem;}
                            a{float: right;display: inline-block;height: .24rem;padding: 0 .1rem;font-size: .14rem;color: #fff;background-color: #01a7e1;text-align: center;line-height: .24rem;border-radius: .24rem;}
                            a.gray{background-color: #ccc;}
                        }
                        p:nth-of-type(2){color: #333;font-size: .14rem;margin-bottom: .05rem;}
                        p:nth-of-type(3){display: inline-block;width: 100%;white-space: nowrap;word-wrap: normal;overflow: hidden;text-overflow: ellipsis;font-size: .12rem;color: #999;}
                        .position{
                            width: 100%;overflow: hidden;color: #666;font-size: .12rem;
                            img{height: .12rem;vertical-align: middle;margin-right: .06rem;}
                            span{display: inline-block;vertical-align: middle;}
                            span:last-child{float: right;color: #fe7b4f;padding-top: .02rem;}
                        }
                    }
                }
                .tips{
                    width: 100%;height: .34rem;text-align: center;line-height: .34rem;
                    img{height: .14rem;vertical-align: middle}
                    span{display: inline-block;vertical-align: middle;font-size: .12rem;color: #ccc;}
                }
            }
        }
        .block{width: 100%;height: .6rem;}
    }
</style>