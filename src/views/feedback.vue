<template>
    <div id="feedback">
        <div class="text-box">
            <textarea placeholder="请输入反馈内容" class="feedback-text"></textarea>
        </div>
        <div class="write-box">
            <group>
                <x-input name="mobile" placeholder="请输入您的联系方式" keyboard="number" is-type="china-mobile" :max="11" ></x-input>
            </group>
        </div>
        <div class="btn">
            <button>提交</button>
        </div>
    </div>
</template>
<script>
    import {XInput,Group} from 'vux'
    export default{
        components:{
            XInput,
            Group
        }
    }
</script>
<style lang="less">
    #feedback{
        font-size: 12px;
        .text-box{
            padding: .3rem .12rem;
            .feedback-text{
                padding: .1rem;
                width: calc(~'100% - .2rem');
                height: 1.5rem;
                background-color: #f6f6f6;
                border-radius: .04rem;
                resize: none;
                outline: none;
                font-size: .16rem;
                color: #666;
                line-height: .25rem;
                border: none;
                text-align: justify;
            }
        }
        .write-box{
            padding-bottom: .12rem;
            margin: 0 .12rem .4rem .12rem;
            border-bottom: 1px solid #e9e9e9;
            .weui-cells{margin-top: 0;}
            .weui-cells:before,.weui-cells:after{border: none}
            .weui-cell{padding: 0;}
            input{width: 100%;text-align: center;font-size: .16rem;color: #333;border: none;outline: none}
        }
        .btn{
            width: 100%;text-align: center;
            button{
                height: .44rem;width: calc(~'100% - .5rem');
                border-radius: .35rem;
                color: white;
                border: none;
                outline: none;
                font-size: .18rem;
                background: linear-gradient(to left, #5dd0f8, #01A7E1)
            }
        }

    }
</style>