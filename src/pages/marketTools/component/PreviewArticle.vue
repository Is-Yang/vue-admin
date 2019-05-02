<template>
  <el-dialog :visible.sync="dialogVisible"  
    :append-to-body="appendToBody" 
    :close-on-click-modal='false'  
    class="article__preview" width="400px">
    <div class="por">
      <i class="el-icon-close poa poster_close" @click="close()"></i>
    </div>
    <div>
      <h2 class="article__title">{{item[configs.title]}}</h2>
	    <p class="addtime">{{item[configs.create_time]}} <span class="author">{{item[configs.author]}}</span></p>
	    <img class="poster_img" v-show="item[configs.isShow]" :src="item[configs.src]"/>
	    <div class="preview-body" v-html="item[configs.content]"></div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: ''
    },
    configs: {
      type: Object,
      default: {
        isShow: 'is_show',
        src: 'cover',
        content: 'content',
        create_time: 'create_at', // 创建时间
        author: 'author',
        title: 'title'
      }
    },
    appendToBody:{
      type: Boolean,
      default: true
    }
  },
  data(){
    return{
      dialogVisible: true
    }
  },
  methods: {
    close(){
      this.$emit("close", false)
    }
  }
}
</script>

<style lang="scss" scoped>
.article__preview{
  .poster_close {
    top: -18px;
    right: -60px;
    font-size: 20px;
    border-radius: 50%;
    background: #fff;
    padding: 5px;
    cursor: pointer;
  }
  .poster_img{
    width: 100%;
    height: auto;
    -o-object-fit: cover;
    object-fit: cover;
    -o-object-position: center;
    object-position: center
  }
  .article__title{
    font-size: 16px;
  }
  .addtime{
    font-size: 12px;
    height: 30px;
    line-height: 30px;
  }
  .author{
    color: #999;
    margin-left: 10px;
  }
  .preview-body{
    word-break: break-all;
    overflow: hidden;
    min-height: 200px;
  } 
}

.article__preview /deep/ .el-dialog__header {
  display: none;
}

.article__preview /deep/ .el-dialog__body {
  padding: 20px;
}

.article__preview /deep/.preview-body img{
  width: 100%;
}
</style>
