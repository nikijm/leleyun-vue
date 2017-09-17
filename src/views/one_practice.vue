<template>
    <div id="onePractice">
        <div class="doc-title">
            <span v-for="item in deptList" :class="{active:item.deptId==currentDeptId}" @click="getDoctorList(item.deptId,currentAddressModal.wecaId)">{{item.deptName}}</span>
        </div>
        <baidu-map id="map" :center="center" :zoom="12" :scroll-wheel-zoom="true" @ready="handler"></baidu-map>
        <div class="swiper-box" id="swiper-box">
            <swiper :options="swiperOption" ref="mySwiper">
                <swiper-slide v-for="item in doctorList" :key="item">
                    <router-link :to="'/doctordetail/1/'+item.doctorId+'/'+item.addressId" class="out-box" :data-addressid="item.addressId">
                        <img :src="IMGURL+item.doctorPhoto" :onerror="defaultImg">
                        <div class="doc-info">
                            <p><span class="name">{{item.doctorName}}</span><span class="title">{{item.doctorTitle}}</span><span class="date">{{item.nearlyDay}}</span></p>
                            <p>{{item.hospitalName}}&emsp;{{item.deptName}}</p>
                            <p><img src="../assets/icon_position.png"><span>{{item.addressName}}</span><span v-if="distanceObj[item.addressId]">{{(distanceObj[item.addressId]/1000).toFixed(1)}}km</span></p>
                        </div>
                    </router-link>
                </swiper-slide>
            </swiper>
        </div>
    </div>
</template>
<script>
    import {swiper,swiperSlide} from 'vue-awesome-swiper'
    import api from '../server'
    export default{
        components:{
            swiper,
            swiperSlide,
        },
        data(){
            const _this = this;
            return {
                center:{lat:30.663659,lng:104.072249},
                myPoint : {},
                BMap:{},
                map:{},
                driving : {},
                swiperOption : {
                    slidesPerView:'auto',
                    centeredSlides: true,
                    speed:500,
                    spaceBetween:10,
                    onSlideChangeEnd(swiper){
                        let index = swiper.realIndex;
                        const addressId = $('.out-box').eq(index).attr('data-addressid');
//                        _this.center = _this.pointObj[addressId];
                        //驾车路线
//                        _this.driving.clearResults && _this.driving.clearResults();
//                        _this.driving = new _this.BMap.DrivingRoute(_this.map, {
//                            renderOptions: {map: _this.map, autoViewport: true}
//                        });
//                        _this.driving.search(new _this.BMap.Point(_this.myPoint.lng,_this.myPoint.lat),new _this.BMap.Point(_this.center.lng,_this.center.lat));
                    }
                },
                deptList:[],
                currentDeptId : '',
                currentAddressModal : JSON.parse(decodeURIComponent(this.$route.params.modal)),
                doctorList : [],
                IMGURL:api.BASEIMGURL,
                defaultImg: 'this.src="' + require('../assets/head_default@2x.png') + '"',//默认图片
                distanceObj : {},
                pointObj : {}
            }
        },
        mounted(){
            const _this = this;
            api.queryDeptList().then(function (res) { //查询科室
                if(res.code == '000'){
                    _this.deptList = [{deptName:'全部',deptId:''}].concat(res.data);
                }
            });
        },
        methods:{
            handler({BMap, map}){
                const _this = this;
                _this.BMap = BMap;
                _this.map = map;
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
                    if(_this.currentAddressModal.wecaId == '-1'){ //查询附近所有执业点
                        _this.currentAddressModal.wecaId = '';
                        document.title = '附近执业点';
                        //渲染附近执业点
                        let pointStr = '';
                        if(_this.center.lat && _this.center.lng) pointStr = _this.center.lng + ',' + _this.center.lat;
                        api.queryAddressList(pointStr).then(function (res) { //获取附近执业点
                            if(res.code == '000'){
                                _this.addressList = res.data;
                                for(let i = 0; i<_this.addressList.length; i++){
                                    let point = new BMap.Point(_this.addressList[i].longitude, _this.addressList[i].latitude);
                                    let myIcon = new BMap.Icon(
                                        require("../assets/icon_positon_red@1x.png"),
                                        new BMap.Size(39, 25),
                                        {
                                            anchor : new BMap.Size(13,25)
                                        }
                                    );
                                    let marker = new BMap.Marker(point, {icon: myIcon});  // 创建标注
                                    map.addOverlay(marker);
                                    let label = new BMap.Label("<span class='marker-text'>"+ _this.addressList[i].name +"</span>", {offset: new BMap.Size(30, -4)});
                                    marker.setLabel(label);
                                    _this.distanceObj[_this.addressList[i].wecaId] = _this.addressList[i].distance;
                                    _this.pointObj[_this.addressList[i].wecaId] = {lng:_this.addressList[i].longitude,lat:_this.addressList[i].latitude};
                                }
                                _this.getDoctorList(_this.currentDeptId,_this.currentAddressModal.wecaId);
                            }
                        });
                    }else{
                        document.title = _this.currentAddressModal.name;
                        let point = new BMap.Point(_this.currentAddressModal.longitude, _this.currentAddressModal.latitude);
                        let myIcon = new BMap.Icon(
                            require("../assets/icon_positon_red@1x.png"),
                            new BMap.Size(39, 25),
                            {
                                anchor : new BMap.Size(13,25)
                            }
                        );
                        let marker = new BMap.Marker(point, {icon: myIcon});  // 创建标注
                        map.addOverlay(marker);
                        let label = new BMap.Label("<span class='marker-text'>"+ _this.currentAddressModal.name +"</span>", {offset: new BMap.Size(30, -4)});
                        marker.setLabel(label);
                        _this.distanceObj[_this.currentAddressModal.wecaId] = _this.currentAddressModal.distance;
                        _this.pointObj[_this.currentAddressModal.wecaId] = {lng:_this.currentAddressModal.longitude,lat:_this.currentAddressModal.latitude};
                        _this.getDoctorList(_this.currentDeptId,_this.currentAddressModal.wecaId);
                    }
                },{enableHighAccuracy: true});
            },
            getDoctorList(deptId,addressId){
                const _this = this;
                _this.currentDeptId = deptId;
                let data = {};
                if(deptId) data.deptId = deptId;
                if(addressId) data.addressId = addressId;
                _this.map.centerAndZoom(_this.center,12);
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
                        _this.doctorList = data;
                    }
                })
            }
        }
    }
</script>
<style lang="less">
    #onePractice{
        font-size: 12px;height: 100%;overflow: hidden;
        .doc-title{
            padding-left: .12rem;width: calc(~'100% - .12rem');overflow-x: auto;white-space: nowrap;height:.49rem;border-bottom: 1px solid #e9e9e9;
            span{
                font-size: .14rem;color: #999;margin-right: .32rem;display: inline-block;height: 100%;
                line-height: .49rem;position: relative;
            }
            span.active{color: #01a7e1;}
            span.active:after{content: '';display: inline-block;height: 2px;width: .16rem;background-color: #01A7E1;position: absolute;margin-left:-.08rem;left: 50%;bottom: .05rem;}
        }
        #map{
            width: 100%;height: calc(~'100% - .49rem');
        }
        .BMapLabel{border:none !important;background: transparent !important;}
        .marker-text{font-family: 'Microsoft YaHei',sans-serif;padding: 0 10px;background: #fff;border-radius: 4px;color: #333;
            font-size: 14px;position: relative;height: 30px;display: block;line-height: 30px;}
        .marker-text:before{content: ''; position: absolute; border-width: 10px; border-color: transparent #fff transparent transparent; left: -19px; bottom: 5px; border-style: solid;}

        //swiper
        .swiper-box{
            position: fixed;left: 0;bottom: .14rem;height: 1.07rem;width: 100%;
            .swiper-slide{position: relative; background-color: #fff; height: 1.07rem; width: 3.3rem; border-radius: 4px; box-shadow: 1px 1px 1px #ddd,-1px -1px 1px #ddd;}
            .out-box{
                overflow: hidden;  padding: .16rem .1rem;display: block;
                >img{width: .48rem;height: .48rem;border-radius: .48rem;float: left;margin-right: .1rem;}
                .doc-info{
                    float: left;width: calc(~'100% - .58rem');
                    p:first-child{
                        overflow: hidden;margin-bottom: .05rem;
                        .name{font-size: .16rem;color: #01a7e1;margin-right: .08rem;}
                        .title{font-size: .14rem;color: #666;}
                        .date{float: right;font-size: .14rem;color: #fe7b4f;padding-top: .02rem;}
                    }
                    p:nth-of-type(2){font-size: .14rem;color: #333;margin-bottom: .08rem}
                    p:last-child{
                        color: #999;font-size: .14rem;overflow: hidden;
                        img{height: .14rem;vertical-align: middle;margin-right: .06rem}
                        span{display: inline-block;vertical-align: middle}
                        span:nth-of-type(2){font-size: .12rem;float: right;padding-top: .04rem;}
                    }
                }
            }
        }
    }
</style>