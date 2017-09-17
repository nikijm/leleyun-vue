<template>
    <div id="oneDocList">
        <!--顶部栏-->
        <div class="header">
            <div class="header-list" :class="{three:showtype==2}" @click="headerChange($event)">
                <span>{{hosname}}</span><img src="../assets/list_icon_shouqi@2x.png">
            </div>
            <div class="header-list" :class="{three:showtype==2}" @click="headerChange($event)">
                <span>{{dept}}</span><img src="../assets/list_icon_shouqi@2x.png">
            </div>
            <div v-show="showtype==1" class="header-list" @click="headerChange($event)">
                <span>{{time}}</span><img src="../assets/list_icon_shouqi@2x.png">
            </div>
            <div class="header-list" :class="{three:showtype==2}" @click="headerChange($event)">
                <span>{{ordername}}</span><img src="../assets/list_icon_shouqi@2x.png">
            </div>
        </div>
        <div class="modal" v-show="showModal" @click="showModal=false">
            <div class="modal-box" @click.stop>
                <div v-if="headerIndex==0" class="modal-list" v-for="n in showList" :data-id="n.hospitalId" @click="select($event)" v-bind:class="{active:(n.hospitalName==hosname)}">
                    {{n.hospitalName}}
                </div>
                <div v-if="headerIndex==1" class="modal-list" v-for="n in showList" :data-id="n.deptId" @click="select($event)" v-bind:class="{active:(n.deptname==dept)}">
                    {{n.deptname}}
                </div>
                <div v-if="headerIndex==2" class="modal-list" v-for="n in showList" :data-id="n.rid" @click="select($event)" v-bind:class="{active:(n.name==time)}">
                    {{n.name}}
                </div>
                <div v-if="headerIndex==3" class="modal-list" v-for="n in showList" :data-id="n.rid" @click="select($event)" v-bind:class="{active:(n.name==ordername)}">
                    {{n.name}}
                </div>
            </div>
        </div>
        <!--医生列表栏-->
        <div class="doc-box">
          <a :href="'#/doctordetail/'+showtype+'/'+n.doctorId+'/'+n.addressId" class="recommend-list"  v-for="n in doctorList">
                <img :src="IMGURL+n.doctorPhoto+'@120w_120h_90Q.jpg'" :onerror="defaultImg">
                <div class="info">
                    <p class="name">{{n.doctorName}} <span>{{n.doctorTitle}}</span><span class="not-full" v-if="showtype==1" v-show="n.surplusNum>0">预约</span>
                        <span class="full" v-if="showtype==1" v-show="n.surplusNum<1">近一周已满</span><span v-if="showtype==2" class="price" v-show="n.money">{{n.money}}元/{{n.calltime}}分钟</span>
                    </p>
                    <p class="hos">{{n.hospitalName}} {{n.deptName}}</p>
                    <p class="goodat">擅长：{{n.goodAt}}</p>
                    <p class="date" v-if="showtype==1">最近可约：{{n.nearlyDay}}</p>
                </div>
            </a>
            <div class="not-doctor" v-show="doctorList.length<1">
                <img src="../assets/icon_dr_list_successed@2x.png" alt="">
                <p>暂无医生</p>
            </div>
        </div>
    </div>
</template>
<script>
    import api from '../server'
    export default{
        components:{

        },
        data(){
            return {
                showModal:false,//模板是否弹出
                headerIndex:'',
                hosname:'医院',
                hospitalId:'',
                hoslist:[{hospitalName:'全部',hospitalId:''}],
                dept:'科室',
                deptId:'',
                deptList:[{deptname:'全部',deptId:''}],
                time:'时间',
                timeId:'',
                ordername:'排序',
                orderId:'',
                orderlist:[{name:'全部',rid:''},{name:'医院',rid:'hospital'},{name:'科室',rid:'dept'},{name:'职称',rid:'title'}],
                showList:[],
                doctorList:[],
                defaultImg: 'this.src="' + require('../assets/head_default@2x.png') + '"',//默认图片
                IMGURL:api.BASEIMGURL
            }
        },
        created:function () {

        },
        computed:{
            showtype(){return this.$route.params.type},
            timelist(){
                var nowTime = new Date();
                var weekArr = ['周日','周一','周二','周三','周四','周五','周六'];
                var timeArr = [];
                for(var i =0;i<7;i++){//循环2周日期数据
                    if(i>0){
                        nowTime = nowTime.valueOf()+1000*60*60*24;
                        nowTime = new Date(nowTime);
                    }
                    var year = nowTime.getFullYear();
                    var month = (nowTime.getMonth()+1<10?'0'+(nowTime.getMonth()+1):nowTime.getMonth()+1);
                    var date = (nowTime.getDate()<10?'0'+nowTime.getDate():nowTime.getDate());
                    var day = nowTime.getDay();
                    var week = weekArr[day];
                    timeArr.push({week:week,year:year,month:month,date:date});
                }
                var dateList = [{name:'全部',rid:''}];
                for(let i=0;i<timeArr.length;i++){
                    var index = {name:timeArr[i].month+'-'+timeArr[i].date+' '+timeArr[i].week,rid:timeArr[i].year+'-'+timeArr[i].month+'-'+timeArr[i].date};
                    dateList.push(index);
                }
                return dateList;
            },
            requestModal(){
                return {
                    hospitalId : this.hospitalId,
                    deptId : this.deptId,
                    date : this.timeId,
                    sortBy : this.orderId,
                    wxGoodsId : this.wxGoodsId
                }
            }
        },
        mounted:function () {
            const _this = this;
            //查询医院列表
            api.queryHospitalList().then(function (res) {
                if(res.code === '000'){
                    _this.hoslist = [{hospitalName:'全部',hospitalId:''}].concat(res.data);
                    //初始化科室列表
                    api.queryDeptTypeByHospitalId(res.data[0].hospitalId).then(function (res) {
                        if(res.code === '000'){
                            _this.deptList = [{deptname:'全部',deptId:''}].concat(res.data);
                        }
                    });
                }
            });
            if(this.$route.params.filter){
                let filterObj;
                try{
                    filterObj = JSON.parse(decodeURIComponent(this.$route.params.filter));
                }catch (e){
                    filterObj = {};
                }
                if(filterObj.wxGoodsId) this.wxGoodsId = filterObj.wxGoodsId;
                if(filterObj.hospitalId) this.hospitalId = filterObj.hospitalId;
                if(filterObj.deptId) this.deptId = filterObj.deptId;
            }
            this.search(this.requestModal);
        },
        watch:{
            showModal:function () {
                if(this.showModal == false){
                    $('.header-list').removeClass('active').find('img').attr('src',require('../assets/list_icon_shouqi@2x.png'));
                    this.headerIndex = '';
                }
            }
        },
        methods:{
            headerChange(event){
                var $this = event.currentTarget;
                var showIndex = $('.header-list').index($this);
                $($this).addClass('active').find('img').attr('src',require('../assets/list_icon_zhankai@2x.png'));
                $($this).siblings().removeClass('active').find('img').attr('src',require('../assets/list_icon_shouqi@2x.png'));
                this.showModal = true;
                this.headerIndex = showIndex;
                if(showIndex == 0){
                    this.showList = this.hoslist;
                }else if(showIndex == 1){
                    this.showList = this.deptList
                }else if(showIndex == 2){
                    this.showList = this.timelist
                }else if(showIndex == 3){
                    this.showList = this.orderlist
                }
            },
            select(event){
                var headerIndex = $('.header-list').index($('.header-list.active'));
                var selectId = $(event.currentTarget).attr('data-id');
                var _this = this;
                setTimeout(function () {
                    _this.showModal = false;
                },100);
                if(headerIndex == 0){
                    this.hospitalId = selectId || '619';
                    this.hosname = $(event.currentTarget).text().trim();
                    //查询科室列表
                    api.queryDeptTypeByHospitalId(_this.hospitalId).then(function (res) {
                        if(res.code === '000'){
                            _this.deptList = [{deptname:'全部',deptId:''}].concat(res.data);
                        }
                    });
                }else if(headerIndex == 1){
                    this.deptId = selectId;
                    this.dept = $(event.currentTarget).text().trim();
                }else if(headerIndex == 2){
                    this.timeId = selectId;
                    this.time = $(event.currentTarget).text().trim();
                }else if(headerIndex == 3){
                    this.orderId = selectId;
                    this.ordername = $(event.currentTarget).text().trim();
                }
                _this.search(_this.requestModal);
            },
            search(modal){  //查询数据
                const _this = this;
                for(let i in modal){if(!modal[i]) delete modal[i];}
                if(_this.showtype == 1){
                    document.title = '专家一对一';
                    api.queryDoctorOneList(modal).then(function (res) {
                        if(res.code === '000'){
                            const data = res.data;
                            const weekArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
                            data.map(function (index) {
                                if(index.nearlyDay){
                                    var nearTime = new Date(index.nearlyDay);
                                    var month = (nearTime.getMonth()+1<10?'0'+(nearTime.getMonth()+1):nearTime.getMonth()+1);
                                    var date = (nearTime.getDate()<10?'0'+nearTime.getDate():nearTime.getDate());
                                    var day = nearTime.getDay();
                                    var week = weekArr[day];
                                    index.nearlyDay = month+'月'+date+'日'+' '+week
                                }

                            });
                            _this.doctorList = data
                        }
                    })
                }else if(this.showtype == 2){
                    document.title = '名医电话';
                    api.queryDoctorCallList(modal).then(function (res) {
                        if(res.code === '000'){
                            _this.doctorList = res.data;
                        }
                    })
                }
            }
        }

    }
</script>
<style lang="less">
    #oneDocList{
        font-size: 12px;
        .header{width: 100%;overflow: hidden;height: .4rem;border-bottom: 1px solid #e9e9e9}
        .header-list{width: 25%;float: left;text-align: center;height: .4rem;line-height: .4rem;color: #666;font-size: .14rem}
        .header-list img{width: .08rem;margin-left: .05rem;vertical-align: middle;}
        .header-list.active{color: #01A7E1}
        .header-list span{display:inline-block;max-width: 5em;overflow: hidden;text-overflow: ellipsis;word-wrap: normal;
                white-space: nowrap;height: 100%;vertical-align: middle}
        .header-list.three{width: 33.33%;}
        /*弹窗*/
        .modal{position: fixed;width: 100%;height: 100%;top: .41rem;background-color: rgba(1,1,1,.5);z-index: 999;max-width: 750px;margin: 0 auto;}
        .modal-box{width: 100%;background-color: #fff}
        .modal-box .modal-list{height: .48rem;line-height: .48rem;border-bottom: 1px solid #e9e9e9;color: #666;font-size: .14rem;
            padding-left: .2rem;position: relative;}
        .modal-list.active{color: #01A7E1}
        .modal-list.active:after{content: '';display: inline-block;width: .08rem;height: .16rem;border-right: 1px solid #01A7E1;border-bottom: 1px solid #01A7E1;
                position: absolute;right: .12rem;top: .12rem;transform: rotate(45deg)}

        /*医生列表*/
        .doc-box{padding-right:.12rem}
        .recommend-list{padding: .12rem 0;width: 100%;overflow: hidden;display: block;}
        .recommend-list+.recommend-list{padding-top:0;}
        .recommend-list>*{float: left}
        .recommend-list img{width: .48rem;height: .48rem;margin:0 .1rem;border-radius: 50%;}
        .recommend-list>div{width: calc(~'100% - .68rem')}
        .recommend-list:not(:last-child) .info{border-bottom: 1px solid #ececec}
        .info p:first-child{color: #333;font-size: .16rem;margin-bottom: .05rem;position: relative}
        .info p:first-child span{color: #666;font-size: .14rem}
        .info p:first-child .not-full,.info p:first-child .full{display: inline-block;padding: 0 .1rem;border-radius: 1rem;color: #fff;font-size: .14rem;
            background-color: #01A7E1;position: absolute;right: 0;height: .24rem;line-height: .24rem}
        .info p.name .full{background-color: #ccc;border-radius: .47rem;}
        .info .name .price{color: #fe7b4f;font-size: .14rem;position: absolute;right: 0;}
        .info p.hos{color: #333;font-size: .14rem;margin-bottom: .03rem;}
        .info p.goodat{color: #999; font-size: .12rem; line-height: .2rem; margin-bottom: .1rem; height: .2rem;
            overflow: hidden; text-overflow: ellipsis; white-space: nowrap;}
        .info p.date{color: #4facfe;font-size: .12rem;margin-bottom: .12rem}

        /*无医生*/
        .not-doctor{width: 100%;text-align: center;overflow: hidden}
        .not-doctor img{margin-top: .6rem;width: 1.56rem;}
        .not-doctor p{color: #999;font-size: .14rem;margin-top: .12rem;}
    }
</style>