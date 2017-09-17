<template>
    <div id="errorBox">
        <img src="../assets/qrcode.jpg" alt="">
        <p>请使用微信打开并关注公众号后再使用<br>（微信内长按识别二维码）</p>
    </div>
</template>
<script>
    export default {
    }
</script>
<style lang="less">
   #errorBox{
       text-align: center;
       padding-top: .8rem;
       >img{width: 3rem;height: 3rem;}
       >p{color: #666; font-size: .16rem;}
   }
</style>
