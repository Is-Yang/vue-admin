<template>
  <div class="template__view" :class="{'view__animate': mouseShow}" @mouseenter="mouseShow = true" @mouseleave="mouseShow = false">
    <div class="tem_photo por" :style="{'height': imgHeight +'px'}">
      <img class="photo_img" ref="tem_img" v-show='item[defaultOpt.photo_url]'  :src="item[defaultOpt.photo_url]">
      <img class="photo_img_none" v-show='!item[defaultOpt.photo_url]' src="../../../assets/images/default_image_small.png">
      <div class="poa tem_statue_top" v-show="shelf && item[statusText]">
        <el-button plain size="mini" round>{{item[statusText]}}</el-button>
      </div>
      <!-- slot插槽 -->
      <div v-show='mouseShow' class="poa tem_statue_bottom">
        <slot name="operate"></slot>
      </div>
      
    </div> 
    <h4 class="tem_title text-left">{{item[title]}}</h4>
    
    <p class="tem_scene tem_font text-left ellipsis">{{item[scene]}}</p>

    <el-row class="tem_font">
      <el-col :span="10" class="text-left tem_time">{{item[defaultOpt.time]| dateFilter('YYYY-MM-DD')}}</el-col>
      <el-col :span="14" class="text-right tem_hot">
        <!-- <a class="hot_line">下载活动方案</a> -->
        <slot name="download"></slot>
        <slot name="hot" v-if="!showHot"></slot>
        <span class="hot_button" v-if="showHot"><i class="hot_photo"></i>{{item[defaultOpt.hot]?item[defaultOpt.hot]:0}}</span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 此组件 海报和 软文共用
export default {
  props:{
    item: {
      type: Object,
      default(){
        return {}
      }
    },
    imgHeight: { // 图片的高度
      type: Number,
      default: 50
    },
    shelf: { // 是否显示上下架文字（右上角）
      type: Boolean,
      default: true,
    },
    statusText: { // 显示上下架 文字字段 (右上角，图文库不显示，海报库也不显示)
      type: String,
      default: 'status_text'
    },
    title: {
      type: String,
      default: 'title'
    },
    scene: {
      type: String,
      default: 'scene'
    },
    operate:{ // 显示图片底部的操作操作按钮
      type: Boolean,
      default: true,
    },
    defaultOpt:{ // 经常会变的字段
      type: Object,
      default(){
        return {
          photo_url: 'photo_url', // 图片的photo_url
          time: 'time', // 时间字段
          hot: 'hot', // 热度字段
        }
      }
    },
    showHot: {
      type: Boolean,
      defalut(){
        return true
      }
    }
  },
  data(){
    return{
      mouseShow: false, // 鼠标移动进来显示
      defaultSrc: require('../../../assets/images/default_image_error_497x326.png')
    }
  },
  methods: {

    imgLoadError(item, e){
      if(item.status == 0) {
        e.target.src = this.defaultSrc;
        item.status = 1;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.template__view {
  width: 90%; 
  margin-bottom: 30px;
  border: 1px solid #eee;
  padding-bottom: 15px;
  border-radius: 5px;
  min-height: 180px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,.02), 0 4px 8px rgba(0,0,0,.02);
  .tem_photo {
    width: 100%;
    min-height: 50px;
    display: flex;
    -ms-flex-pack: center;
    justify-content: center;
    -ms-flex-align: center;
    align-items: center;
    overflow: hidden;
    background: #eee;
  }
  .photo_img{
    width: 100%;
    height: 100%;
    -o-object-fit: cover;
    object-fit: cover;
    -o-object-position: center;
    object-position: center;
  }
  .photo_img_none{
    width: 110px;
    height: auto;
    -o-object-fit: cover;
    object-fit: cover;
    -o-object-position: center;
    object-position: center;
  }
  .tem_title{
    font-size: 15px;
    color: #444;
    margin:10px 15px;
    height: 43px;
    overflow:hidden;
  }
  .tem_scene{
    padding: 10px 15px;
    border-top: 1px solid #eee;
    height: 40px;
  }
  .tem_font{
    font-size: 14px;
    color: #9ea8b2;
  }
  .hot_button {
    color: #fff;
    display: inline-block;
    min-width: 50px;
    border-radius: 10px;
    padding: 2px 10px;
    background: #f00;
    text-align: center;
    background: linear-gradient(to right,#ff5101, #f80);
  }
  .hot_photo{
    width: 11px;
    height: 11px;
    margin-right: 5px;
    display: inline-block;
    background: url('../../../assets/images/market/hot.png')center center no-repeat;
  }
  .tem_time {
    padding-left: 15px;
    height: 20px;
    line-height: 20px;
  }
  .tem_hot{
    padding-right: 15px;
  }
  .hot_line{
    color: #3a8ee6;
    text-decoration: underline;
    margin-right: 5px;
  }
  .tem_statue_top {
    top: 10px;
    right: 10px;
  }
  .tem_statue_bottom {
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    line-height: 50px;
    background: rgba(0,0,0, .2);
  }
}

.view__animate{
  transition: transform 0.2s ease-in;
  transform: translateY(-10px);
  box-shadow: 0 1px 3px rgba(0,0,0,.02), 0 16px 32px -4px rgba(0,0,0,.17);
}

.template__view .tem_statue_top .el-button {
  cursor: default;
}

.template__view .tem_statue_top  .is-plain {
  background: #409EFF;
  color: #fff;
  border: 1px solid #409EFF;
  opacity: .8;
}
</style>

