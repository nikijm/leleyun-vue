<template>
    <div id="errorBox">
        <button @click="record">录音</button>
        <button @click="stop">停止</button>
        <button @click="play">播放</button>
        <button @click="upload">上传</button>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                localId : ''
            }
        },
        created(){
        },
        methods :{
            record(){
                this.$wechat.startRecord();
            },
            stop(){
                var _this = this;
                this.$wechat.stopRecord({
                    success: function (res) {
                        _this.localId = res.localId;
                        alert(JSON.stringify(res));
                    }
                });
            },
            play(){
                this.$wechat.playVoice({
                    localId : this.localId
                });
            },
            upload(){
                this.$wechat.uploadVoice({
                    localId:  this.localId,
                    isShowProgressTips: 1, // 默认为1，显示进度提示
                    success: function (res) {
                        alert(JSON.stringify(res));
                    }
                })
            }
        }
    }
</script>
<style lang="less">

</style>
