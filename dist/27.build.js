webpackJsonp([27],{154:function(t,o,c){c(469);var n=c(0)(c(314),c(434),null,null);t.exports=n.exports},314:function(t,o,c){"use strict";Object.defineProperty(o,"__esModule",{value:!0}),o.default={data:function(){return{localId:""}},created:function(){},methods:{record:function(){this.$wechat.startRecord()},stop:function(){var t=this;this.$wechat.stopRecord({success:function(o){t.localId=o.localId,alert(JSON.stringify(o))}})},play:function(){this.$wechat.playVoice({localId:this.localId})},upload:function(){this.$wechat.uploadVoice({localId:this.localId,isShowProgressTips:1,success:function(t){alert(JSON.stringify(t))}})}}}},344:function(t,o,c){o=t.exports=c(1)(),o.push([t.i,"",""])},434:function(t,o){t.exports={render:function(){var t=this,o=t.$createElement,c=t._self._c||o;return c("div",{attrs:{id:"errorBox"}},[c("button",{on:{click:t.record}},[t._v("录音")]),t._v(" "),c("button",{on:{click:t.stop}},[t._v("停止")]),t._v(" "),c("button",{on:{click:t.play}},[t._v("播放")]),t._v(" "),c("button",{on:{click:t.upload}},[t._v("上传")])])},staticRenderFns:[]}},469:function(t,o,c){var n=c(344);"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);c(2)("5415c7e9",n,!0)}});