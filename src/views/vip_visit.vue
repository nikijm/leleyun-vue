<template>
    <div id="vipVisit">
        <img src="../assets/banner_yishengsuifang@2x.png" class="banner">
        <div class="tip">
            <img src="../assets/icon_tip@2x.png" >
            <p>先心病需要术后进行长期随访，包括同时，对出现的一些异常情况进行及早发现、及早干预。</p>
        </div>
        <div class="divide"></div>
        <div class="visit-box">
            <div class="visit-title">
                随访健康档案
            </div>
            <div class="visit-text">
                <p class="info">术后第1、3、6、12个月以及每年常规随访，包括临床体检、心电图和心脏超声检查。</p>
                <p class="suifang"><img src="../assets/suifangdangan_icon_edit@2x.png"><span>随访档案填写</span><img src="../assets/arrow_more_lanse@2x.png"></p>
            </div>
        </div>
        <div class="divide"></div>
        <div class="visit-box">
            <div class="visit-title">
                专家电话回访
            </div>
            <div class="visit-text">
                <p class="info">
                    华西儿童细血管科专家随访服务,在术后1个月、3个月、6个月、12个月以及第二年、第三年、第五年。
                    定期进行电话咨询指导病情康复、解答疑问，用药情况、报告解读。
                </p>
            </div>
        </div>
        <p class="footer">
            如有疑问可联系医助：<a>400-181-6106</a>
        </p>
    </div>
</template>
<script>
    export default{

    }
</script>
<style lang="less">
    #vipVisit{
        font-size: 0;
        min-height: 100%;
        background-color: #f2f2f2;
        .divide{width: 100%;height: .1rem;background-color: #f2f2f2;}
        .banner{width: 100%;height: 1.5rem;}
        .tip{padding: .12rem;overflow: hidden;background-color: #fff;}
        .tip>*{float: left}
        .tip img{width: .14rem;margin-right: .1rem;margin-top: .02rem;}
        .tip p{color: #666;font-size: .14rem;width: 3.27rem;}
        .visit-box{width:100%;overflow: hidden;background-color: #fff;}
        .visit-title{padding-left:.12rem;height: .4rem;border-bottom: 1px solid #e9e9e9;line-height: .4rem;color: #999;font-size: .14rem;}
        .visit-text{padding: .12rem;}
        .visit-text .info{color: #666;font-size: .14rem;text-align: justify;}
        .visit-text .suifang{color: #e2bc81;font-size: .14rem;text-align: center;margin-top: .2rem;margin-bottom: .08rem;vertical-align: middle;
            img{height: .14rem;vertical-align: middle}
            span{height: 100%;vertical-align: middle;margin-left: .1rem;margin-right: .08rem;}
        }
        .footer{font-size: .12rem;text-align: center;color: #666;margin-top: .2rem;}
        .footer a{color: #fe7b4f}
    }
</style>