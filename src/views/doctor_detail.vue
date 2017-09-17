<template>
    <div id="oneDetail">
        <div class="doc-card-box">
            <div class="doc-card">
                <div class="info">
                    <div class="avatar-box">
                        <img :src="IMGURL+doctorInfo.doctorPhoto+'@120w_120h_90Q.jpg'" :onerror="defaultImg" class="avatar">
                    </div>
                    <p class="head">
                        <span class="name">{{doctorInfo.doctorName}}</span>
                        <span class="title">{{doctorInfo.doctorTitle}}</span>
                    </p>
                    <p class="hospital">{{doctorInfo.hospitalName}} {{doctorInfo.deptName}}</p>
                </div>
                <div class="data">
                    <div class="data-item">
                        <p class="num">{{doctorInfo.phone_num || doctorInfo.orderNum || '0'}}</p>
                        <p class="text">咨询</p>
                    </div>
                    <div class="data-item">
                        <p class="num">{{doctorInfo.percent  || '100'}}%</p>
                        <p class="text">好评</p>
                    </div>
                    <div class="data-item">
                        <p class="num">{{doctorInfo.score || '5.0'}}</p>
                        <p class="text">评分</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="divide"></div>
        <template v-if="showOneService">
            <div class="address-box" @click="navigation({lat:doctorInfo.latitude,lng:doctorInfo.longitude,address:doctorInfo.detailAddress})">
                <img src="../assets/icon_position@2x.png" alt="">
                <span>{{doctorInfo.address}}</span>
            </div>
            <div class="divide"></div>
            <div class="table-box">
                <table class="table-left">
                    <thead><tr><td>排<br>班</td></tr></thead>
                    <tbody><tr><td>上<br>午</td></tr></tbody>
                    <tbody><tr><td>下<br>午</td></tr></tbody>
                    <tbody><tr><td>晚<br>上</td></tr></tbody>
                </table>
                <div class="table-list-box">
                    <swiper :options="swiperOption">
                        <swiper-slide>
                            <table class="table-list">
                                <thead>
                                <tr>
                                    <td v-for="item in weekList" :data-index="item.weekIndex" :data-date="item.date">
                                        <p>{{item.weekStr}}</p><p>{{item.dateStr}}</p>
                                    </td>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td @click="goLink($event)"></td>
                                    <td @click="goLink($event)"></td>
                                    <td @click="goLink($event)"></td>
                                    <td @click="goLink($event)"></td>
                                    <td @click="goLink($event)"></td>
                                    <td @click="goLink($event)"></td>
                                    <td @click="goLink($event)"></td>
                                </tr>
                                <tr>
                                    <td @click="goLink($event)"></td>
                                    <td @click="goLink($event)"></td>
                                    <td @click="goLink($event)"></td>
                                    <td @click="goLink($event)"></td>
                                    <td @click="goLink($event)"></td>
                                    <td @click="goLink($event)"></td>
                                    <td @click="goLink($event)"></td>
                                </tr>
                                <tr>
                                    <td @click="goLink($event)"></td>
                                    <td @click="goLink($event)"></td>
                                    <td @click="goLink($event)"></td>
                                    <td @click="goLink($event)"></td>
                                    <td @click="goLink($event)"></td>
                                    <td @click="goLink($event)"></td>
                                    <td @click="goLink($event)"></td>
                                </tr>
                                </tbody>
                            </table>
                        </swiper-slide>
                        <swiper-slide></swiper-slide>
                    </swiper>
                </div>
                <div class="clear"></div>
                <p class="tips">
                    <img src="../assets/icon_tip@2x.png" alt="">
                    <span>点击蓝色区域可预约医生</span>
                </p>
            </div>
            <div class="divide"></div>
        </template>
        <template v-if="showPhoneService">
            <router-link :to="'/phoneorder/'+doctorInfo.doctorId+'/0'" class="price-box">
                <p class="title">名医电话</p>
                <p class="price">{{doctorInfo.money || doctorInfo.phonePrice || 0}}元/{{doctorInfo.calltime || doctorInfo.callTime || 0}}分钟</p>
            </router-link>
            <div class="divide"></div>
        </template>
        <div class="desc-box">
            <p class="title">擅长</p>
            <p class="text">{{doctorInfo.goodAt || '暂无'}}</p>
            <p class="title">简介</p>
            <p class="text">{{doctorInfo.doctorSummary || '暂无'}}</p>
        </div>
        <div class="divide"></div>
        <a href="javascript:;" class="promise-box" @click="showPopup">
            <span class="title">服务承诺：</span>
            <span class="tag-item">
                <img src="../assets/icon_choose@2x.png" alt="">
                <span class="text">医生本人</span>
            </span>
            <span class="tag-item" v-if="showOneService">
                <img src="../assets/icon_choose@2x.png" alt="">
                <span class="text">可退款</span>
            </span>
            <span class="tag-item" v-if="showPhoneService">
                <img src="../assets/icon_choose@2x.png" alt="">
                <span class="text">当天接通</span>
            </span>
            <img src="../assets/arrow_more@2x.png" alt="" class="arrow-right">
        </a>
        <div class="divide"></div>
        <div class="evaluate-box">
            <p class="title">评价</p>
            <div v-if="doctorCommentTags.length" class="evaluate-tag-box">
                <span class="evaluate-tag-item" v-for="one in doctorCommentTags">{{one.tagName}}({{one.count}})</span>
            </div>
            <div class="comment-box" v-if="doctorCommentInfo.length">
                <div class="comment-item" v-for="one in doctorCommentInfo">
                    <div class="head">
                        <span class="comment-user">{{one.patient}}</span>
                        <span class="comment-time">{{one.date}}</span>
                    </div>
                    <p class="comment-text">
                        {{one.content || '&emsp;'}}
                    </p>
                </div>
                <load-more v-show="loadingList" tip="正在加载" background-color="#fff"></load-more>
                <load-more v-show="loadingEnd" :show-loading="false" tip="暂无更多数据" background-color="#fff"></load-more>
            </div>
            <div v-if="!doctorCommentInfo.length" class="comment-empty">
                <img src="../assets/icon_comment_successed@2x.png" alt="">
                <p>暂无评价内容</p>
            </div>
        </div>
        <popup v-model="popupStatus">
            <div class="popup-box">
                <p class="head">服务承诺</p>
                <p class="title">医生本人</p>
                <p class="text">本平台医生均为认证医生，保证医生本人</p>
                <p class="title" v-if="showOneService">全额退款</p>
                <p class="text" v-if="showOneService">预约专家一对一服务，提前24小时可拨打医助电话申请全额退款</p>
                <p class="title" v-if="showPhoneService">当天接通（未接通全额退款）</p>
                <p class="text" v-if="showPhoneService">如因医生忙、出差、手术等原因导致医生无法接听电话，或等待时间较长您无法接受，可联系客服全额退款</p>
                <p class="info">
                    <span>医助电话：</span>
                    <a href="tel:400-181-6106">400-181-6106</a>
                </p>
                <p class="info"><span>工作时间：</span>9:00-21:00</p>
                <a href="javascript:;" class="close" @click="showPopup">确定</a>
            </div>
        </popup>
    </div>
</template>
<script>
    import { Popup,LoadMore,Scroller } from 'vux'
    import { swiper, swiperSlide } from 'vue-awesome-swiper'
    import api from '../server'
    export default{
        data(){
            return{
                swiperOption : {
                    slidesPerView: 'auto',
                    freeMode: true,
                    roundLengths : true, //防止文字模糊
                },
                weekList : [],
                popupStatus : false,
                showOneService : false,
                showPhoneService : false,
                doctorInfo : {},
                doctorCommentInfo : [],
                doctorCommentTags : [],
                defaultImg: 'this.src="' + require('../assets/head_default@2x.png') + '"',//默认图片
                IMGURL:api.BASEIMGURL,
                loadingList : false,
                loadingEnd : false,
                pageNo : 1
            }
        },
        beforeCreate(){
            if($(document).height() != $('html').height()) location.reload();
        },
        created : function () {
            const _this = this;
            const serviceType = this.$route.params.type;
            if(serviceType === '0'){
                api.queryDoctorDetail(_this.$route.params.id).then(function (res) {
                    if(res.code === '000'){
                        _this.doctorInfo = res.data;
                        api.queryDoctorTags(res.data.doctorUserId).then(function (res) {
                            if(res.code === '000'){
                                _this.doctorCommentTags = res.data;
                            }
                        });
                        if(res.data.expertConsultation == '1'){  //当前医生开通了一对一服务
                            _this.showOneService = true;
                            for(let i = 0; i < 7; i++){
                                const currentTime = new Date(Date.now() + i * 24 * 60 * 60 * 1000);
                                let month = currentTime.getMonth() + 1;
                                month < 10 && (month = '0'+month);
                                let date = currentTime.getDate();
                                date < 10 && (date = '0'+date);
                                let day = currentTime.getDay();
                                const dayArray = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
                                let weekStr = '';
                                if(i === 0) weekStr = '今日';
                                else weekStr = dayArray[day%7];
                                _this.weekList.push({
                                    weekIndex : day%7,
                                    weekStr : weekStr,
                                    dateStr : month + '-' + date,
                                    date : currentTime
                                });
                            }
                            const schedualList = res.data.schedual;
                            setTimeout(function () {
                                for(let i = 0; i<schedualList.length; i++){
                                    let week = schedualList[i].week;
                                    if(week == 7) week = 0 ;
                                    let periodTime = schedualList[i].periodTime;
                                    let surplusNum = schedualList[i].surplusNum;
                                    let index = $('.table-list thead td[data-index="'+ week +'"]').index();
                                    schedualList[i].date = new Date($('.table-list thead td[data-index="'+ week +'"]').attr('data-date')).getTime();
                                    schedualList[i].doctorName = _this.doctorInfo.doctorName;
                                    schedualList[i].doctorTitle = _this.doctorInfo.doctorTitle;
                                    if(surplusNum>0) $('.table-list tbody tr').eq(periodTime).find('td').eq(index).addClass('active').attr({'data-modal':JSON.stringify(schedualList[i])}).text(schedualList[i].price+'元');
                                    else if(surplusNum<=0) $('.table-list tbody tr').eq(periodTime).find('td').eq(index).text('约满');
                                }
                            },0);
                        }
                        if(res.data.doctor_call == '1'){  ////当前医生开通了电话咨询服务
                            _this.showPhoneService = true;
                        }
                    }
                })
            }
            else if(serviceType === '1'){
                _this.showOneService = true;
                for(let i = 0; i < 7; i++){
                    const currentTime = new Date(Date.now() + i * 24 * 60 * 60 * 1000);
                    let month = currentTime.getMonth() + 1;
                    month < 10 && (month = '0'+month);
                    let date = currentTime.getDate();
                    date < 10 && (date = '0'+date);
                    let day = currentTime.getDay();
                    const dayArray = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
                    let weekStr = '';
                    if(i === 0) weekStr = '今日';
                    else weekStr = dayArray[day%7];
                    _this.weekList.push({
                        weekIndex : day%7,
                        weekStr : weekStr,
                        dateStr : month + '-' + date,
                        date : currentTime
                    });
                }
                api.queryDoctorOneInfo(this.$route.params.id,this.$route.params.aid).then(function (res) {
                    if(res.code === '000'){
                        _this.doctorInfo = res.data;
                        _this.loadCommentList();
                        api.queryDoctorTags(_this.doctorInfo.doctorUserId).then(function (res) {
                            if(res.code === '000'){
                                _this.doctorCommentTags = res.data;
                            }
                        });
                        const schedualList = res.data.schedual;
                        for(let i = 0; i<schedualList.length; i++){
                            let week = schedualList[i].week;
                            if(week == 7) week = 0 ;
                            let periodTime = schedualList[i].periodTime;
                            let surplusNum = schedualList[i].surplusNum;
                            let index = $('.table-list thead td[data-index="'+ week +'"]').index();
                            schedualList[i].date = new Date($('.table-list thead td[data-index="'+ week +'"]').attr('data-date')).getTime();
                            schedualList[i].doctorName = _this.doctorInfo.doctorName;
                            schedualList[i].doctorTitle = _this.doctorInfo.doctorTitle;
                            if(surplusNum>0) $('.table-list tbody tr').eq(periodTime).find('td').eq(index).addClass('active').attr({'data-modal':JSON.stringify(schedualList[i])}).text(schedualList[i].price+'元');
                            else if(surplusNum<=0) $('.table-list tbody tr').eq(periodTime).find('td').eq(index).text('约满');
                        }
                    }
                })
            }
            else if(serviceType === '2'){
                _this.showPhoneService = true;
                api.queryDoctorCallInfo(this.$route.params.id).then(function (res) {
                    if(res.code === '000'){
                        _this.doctorInfo = res.data;
                        api.queryDoctorTags(_this.doctorInfo.doctorUserId).then(function (res) {
                            if(res.code === '000'){
                                _this.doctorCommentTags = res.data;
                            }
                        });
                    }
                });
            }

            this.scrollBottom();
        },
        components : {
            swiper,
            swiperSlide,
            Popup,
            LoadMore,
            Scroller
        },
        methods : {
            showPopup : function () {
                this.popupStatus = !this.popupStatus;
            },
            goLink : function (e) {
                const current = $(e.target);
                if(current.attr('data-modal')){
                    this.$router.push('/oneorder/'+current.attr('data-modal'));
                }
            },
            scrollBottom : function () {
                let startX, startY, endX, endY, X, Y;
                const _this = this;
                $('body').off('touchstart touchend','#oneDetail');
                $('body').on('touchstart','#oneDetail',function (e) {
                    startX = e.originalEvent.changedTouches[0].pageX;
                    startY = e.originalEvent.changedTouches[0].pageY;
                });
                $('body').on('touchend','#oneDetail',function (e) {
                    endX = e.originalEvent.changedTouches[0].pageX;
                    endY = e.originalEvent.changedTouches[0].pageY;
                    X = endX - startX;
                    Y = endY - startY;
                    if ( Math.abs(Y) > Math.abs(X) && Y < 0 ) {
                        var bodyHeight = $(document).height();//页面文档高度
                        var scrolTop = $(window).scrollTop();//滚动条高度
                        var windowHeight = $(window).height();//浏览器高度
                        var totalHeight = parseFloat(windowHeight)+parseFloat(scrolTop);
                        if((bodyHeight-200) <= totalHeight){
                            _this.loadCommentList();
                        }
                    }
                })
            },
            loadCommentList : function () {
                const _this = this;
                const pageSize = 10;
                if(!_this.loadingList && !_this.loadingEnd){
                    _this.loadingList = true;
                    $('body').scrollTop = $('body').height();
                    api.queryCommentList({
                        doctorUserId : _this.doctorInfo.doctorUserId,
                        pageNo : _this.pageNo++,
                        pageSize : pageSize
                    }).then(function (res) {
                        _this.loadingList = false;
                        _this.loadingEnd = true;
                        if(res.code === '000'){
                            res.data.map(function (item) {
                                item.date = new Date(item.date+8*3600000).toISOString().replace(/T.*/,'');
                            });
                            if(res.data.length == pageSize) _this.loadingEnd = false;
                                _this.doctorCommentInfo.push.apply(_this.doctorCommentInfo,res.data);
                        }
                     }).catch(function () {
                        _this.loadingList = false;
                        _this.loadingEnd = true;
                    })
                }
            },
            navigation(obj){
                if(obj.lat && obj.lng){
                    this.$wechat.openLocation({
                        latitude: obj.lat,
                        longitude: obj.lng,
                        name: obj.address
                    })
                }else{
                    this.$vux.toast.text('预约地址经纬度获取失败', 'top');
                }
            }
        }
    }
</script>
<style lang="less">
    #oneDetail{
        font-size: 0;
        .clear{clear: both;}
        .divide{width: 100%;height: .1rem;background-color: #f2f2f2;}
        .doc-card-box{background: url('../assets/bg_yuyue_dr@2x.png');box-sizing: border-box;
            padding: .1rem .12rem; position: relative; height: 1.84rem; background-size: 100%;}
        .doc-card{background: #fff; border-radius: .08rem; font-size: .14rem; box-sizing: border-box; padding: .18rem 0 .14rem;
            height: 100%; width: 100%; position: relative; z-index: 2; box-shadow: 0 3px 10px #ccc;}
        .info{overflow: hidden;}
        .info .avatar-box{width: .6rem;height: .6rem;position: relative;float: left;margin-right: .1rem;border-radius: 50%;
            margin-left: .3rem;border: 1px solid #01A7E1;background: #D4F2FD;overflow: hidden;padding: .05rem;}
        .info .avatar-box .avatar{width: 100%;height: 100%;border-radius: 50%;}
        .info .head{padding: .1rem 0;}
        .info .head .name{font-size: .16rem;color: #333;margin-right: .02rem;}
        .info .head .title{font-size: .12rem;color: #666;}
        .info .hospital{font-size: .14rem;color: #333;}
        .doc-card .data{overflow: hidden; width: 100%; margin-top: 0.15rem;}
        .data .data-item{text-align: center;float: left;width: 33.33%;}
        .data .data-item .num{font-size: .18rem;color: #333;margin-bottom: .05rem;}
        .data .data-item .text{font-size: .12rem;color: #666;}

        .address-box{font-size: .14rem;padding:.14rem .12rem;}
        .address-box>img{width: .2rem;height: .2rem;vertical-align: middle;margin-right: .04rem;}
        .address-box>span{color: #666; vertical-align: middle; display: inline-block; width: 3rem;}

        .table-box{font-size: .14rem;display: inline-block; margin: .12rem 0;}
        .table-left{width: .4rem;float: left;}
        .table-list-box{float: left; width: 3.25rem;overflow: hidden;position: relative;left: -.01rem;}
        .table-list{width: 1rem;}
        .swiper-container{width: 3.65rem;}
        .swiper-slide:not(:first-child){width: .4rem;}
        table{border-collapse: collapse;table-layout: fixed;}
        table td{border: 1px solid #e9e9e9;width: .52rem;height: .52rem;
            text-align: center;box-sizing: border-box;font-size: .14rem;color: #999;}
        table td.active{background: #01A7E1;color: #fff;}
        .table-left td{width: .4rem;}
        .table-list thead tr>td:first-child{color: #01A7E1;}
        .table-box .tips{margin-top: .08rem;}
        .table-box .tips>img{width: .15rem; height: .16rem; vertical-align: middle;
            margin-left: .12rem; position: relative; top: .01rem; margin-right: .02rem;}
        .table-box .tips>span{font-size: .12rem;color: #999;vertical-align: middle;}

        .price-box{background: #fff4f7;border:1px solid #fe7b4f;border-radius: .04rem;margin: .14rem .12rem;
            text-align: center; padding: .12rem 0;display: block;}
        .price-box .title{font-size: .14rem;color: #999;}
        .price-box .price{font-size: .18rem;color: #fe7b4f;margin-top: .08rem;}
        .desc-box{margin-left: .12rem;}
        .desc-box .title:not(:first-child){border-top:1px solid #f8f8f8;}
        .desc-box .title{font-size: .14rem;color: #999;padding: .1rem 0;}
        .desc-box .text{font-size: .14rem;color: #666;line-height: 1.6;padding-bottom: .1rem;}

        .promise-box{padding: .12rem;display: block;}
        .promise-box .title{font-size: .14rem;color: #999;margin-right: .1rem;vertical-align: middle;}
        .promise-box .tag-item{display: inline-block;}
        .promise-box .tag-item img{width: .16rem;height: .16rem;vertical-align: middle;}
        .promise-box .tag-item .text{font-size: .14rem;color: #666;margin-left: .06rem;margin-right: .1rem;vertical-align: middle;}
        .promise-box .arrow-right{width: .06rem; height: .12rem; float: right; margin-top: .04rem;}

        .evaluate-box{}
        .evaluate-box .title{font-size: .14rem;color: #666;line-height: .4rem;border-bottom:1px solid #e9e9e9;padding: 0 .12rem;}
        .evaluate-tag-box{overflow: hidden;padding: .14rem .12rem 0;}
        .evaluate-tag-item{font-size: .14rem;color: #666;padding: .05rem .12rem;margin: 0 .1rem .1rem 0;
            float: left;background: #f2f2f2;border-radius: 1rem;}
        .comment-box{margin-left: .12rem;}
        .comment-item{padding-right: .12rem;border-bottom:1px solid #f4f4f4;margin-top: .1rem;}
        .comment-item .head{overflow: hidden;font-size: .14rem;color: #ccc;margin-bottom: .1rem;}
        .comment-item .head .comment-user{vertical-align: middle;}
        .comment-item .head .comment-time{float: right}
        .comment-item .comment-text{font-size: .14rem;line-height: 1.6;color: #333;margin-bottom: .15rem;}
        .comment-empty{margin: .3rem 0 0;text-align: center;}
        .comment-empty:after{height: .3rem;content: "";display: block;}
        .comment-empty>img{width: 1.3rem;height: 1.05rem;}
        .comment-empty>p{font-size: .14rem;color: #999;margin-top: .12rem;}

        .vux-popup-dialog{background: #fff;overflow: hidden;}
        .popup-box{height: 100%;}
        .popup-box .head{font-size: .16rem;color: #01A7E1;text-align: center;margin-bottom:.14rem;padding-top: .2rem;}
        .popup-box .title{font-size: .14rem;color: #333;margin: 0 .25rem .08rem;position: relative;}
        .popup-box .title:before{content: ''; position: absolute; width: .06rem; height: .06rem; border-radius: 50%; background: #ccc; left: -.14rem; top: .09rem;}
        .popup-box .text{font-size: .14rem;line-height: 1.6;color: #999;margin: 0 .25rem .1rem;}
        .popup-box .info{font-size: .14rem;color: #999;margin: 0 .25rem .08rem;}
        .popup-box .info>span{color: #666}
        .popup-box .info>a{color: #fe7b4f;}
        .popup-box .close{border-radius: .35rem; color: #fff; font-size: .18rem; background-image: linear-gradient(to left, #5dd0f8, #01A7E1);
            display: block; text-align: center; padding: .1rem 0; margin: .2rem .25rem;}

        .buy-phone-box{height: .49rem;}
        .buy-phone-box>a{background-image: linear-gradient(to left, #5dd0f8, #01A7E1);color: #fff; font-size: .18rem;
            position: fixed;text-align: center;width: 100%;max-width: 750px;left:0;bottom:0;height: .49rem;line-height: .49rem;}

        .weui-loadmore{margin-bottom: .2rem;}
    }
</style>
