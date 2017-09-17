<template>
    <div id="vipNoList">
        <div class="exchange">
            <input type="text" placeholder="输入兑换码"><span>兑换</span>
        </div>
        <div class="no-list">
            <p class="list-title">医生集团会员服务</p>
            <p class="list-text">专属顶级医生集团会员服务，为您打造</p>
            <p class="list-text">好就医体验和高端的医疗条件</p>
            <img src="../assets/tu_yishengjituan@2x.png" alt="">
        </div>
        <div class="no-list">
            <p class="list-title">尊享高价值的会员卡</p>
            <p class="list-text">使用平台医疗服务一对一、名医电话，可</p>
            <p class="list-text">使用会员余额进行支付</p>
            <img src="../assets/vip_hand.jpg" alt="">
        </div>
        <div class="no-list">
            <p class="list-title">私人专属医助服务</p>
            <p class="list-text">提出你的需求，随时联系，对接你</p>
            <p class="list-text">需要的名医资源</p>
            <img src="../assets/tu_sirenyizhu@2x.png" alt="">
        </div>
        <div class="no-list">
            <p class="list-title">健康档案永久管理</p>
            <p class="list-text">根据不同的专科会员档案记录，我们将为</p>
            <p class="list-text">您终生保存，生成您的专属档案</p>
            <img src="../assets/tu_jiankangdangan@2x.png" alt="">
        </div>
        <a class="look" href="#/servicelist">
            查看
        </a>
    </div>
</template>
<script>
    import api from '../server'
    export default{

    }
</script>
<style lang="less">
    #vipNoList{
        font-size: 12px;
        padding-bottom: .2rem;
        .exchange{padding: 0 .2rem;margin: .2rem 0 .3rem 0;
            input{height: .44rem;padding-left: .16rem;border: 1px solid #e9e9e9;border-right: none;border-bottom-left-radius: .08rem;border-top-left-radius: .08rem;
                    width: 2.17rem;outline: none !important;color: #ccc;font-size: .16rem;-webkit-appearance: none;}
            span{height: .47rem;width: 1rem;display: inline-block;line-height: .47rem;text-align: center;color: #fff;font-size: .18rem;background-color: #e2bc81;
                border-bottom-right-radius: .08rem;border-top-right-radius: .08rem;}
        }
        .no-list{width: 100%;overflow: hidden;text-align: center}
        .no-list .list-title{color: #e2bc81;font-size: .2rem;margin-bottom: .08rem;font-weight: bold;}
        .no-list .list-text{color: #999;font-size: .14rem;}
        .no-list .list-text:nth-of-type(2){margin-bottom: .04rem}
        .no-list .list-text:nth-of-type(3){margin-bottom: .16rem;}
        .no-list img{width: 100%;height: 1.7rem;margin-bottom: .3rem;}

        .look{position: fixed;bottom: .65rem;right: .16rem;height: .56rem;width: .56rem;border-radius: .56rem;text-align: center;line-height: .56rem;color: #fff;
            font-size: .16rem;background-color: #e2bc81;box-shadow:#ecb281 0 1px  2px 1px}
    }
</style>