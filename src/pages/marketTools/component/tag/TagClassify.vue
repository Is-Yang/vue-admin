<template>
  <div class="tag__classify">
    <el-button v-bind="$attrs" :style="{'width': Tconfigs.btnWidth}"  @click="add">
      <i :class="Tconfigs.icon"></i> {{Tconfigs.btnName}}
    </el-button>
    <div class="mt20 tag_reset" v-show="seleTags && seleTags.length">
      <el-tag
        class="tag__demo"
        :key="index"
        v-for="(tag,index) in seleTags"
        closable
        :disable-transitions="false"
        @close="closeTag(tag, index)">
        {{tag[Tconfigs.name]}}
      </el-tag>
    </div>

    <tag-operate v-bind="$attrs" v-if="showDialog" showCheckbox showfooter :seleTags='seleTags' @closeDialog="closeDialog"></tag-operate>

  </div>
</template>

<script>
import TagOperate from './TagOperate'
export default {
  components: {
    TagOperate
  },
  props: {
    seleTags: {
      type:Array,
      default(){
        return []
      }
    },
    config: {
      type: Object,
      default(){
        return {}
      }
    }
  },
  data(){
    return{
      Tconfigs: {
        icon: '', // 按钮的icon
        btnName: '海报分类', // 按钮的名字
        name: 'name', // 显示tag的属性值
        btnWidth: '100px', // 按钮的宽
      },
      showDialog: false
    }
  },
  created(){
    this.Tconfigs = Object.assign(this.Tconfigs, this.config); // 覆盖默认的属性  T代表内部的变量
  },
  methods:{
    closeTag(tag, index){
      this.seleTags.splice(index, 1);
    },
    add(){
      this.showDialog = true
    },
    closeDialog(type,item){
      if(type == 'success'){
        if(this.seleTags){
          this.seleTags.splice(0, this.seleTags.length, ...item); // 获取重新的选中的数组
        }
      }
      this.showDialog = false;
    }
  }
  
}
</script>

<style lang="scss" scoped>
.tag__classify{
  .tag_reset {
    .el-tag{
      border: 1px solid #eee;
      color: #454545;
      background: #fff;
    }
  }
  .tag__demo{
    margin-right: 10px;
    margin-bottom: 10px;
  }
}

.tag__classify .tag_reset /deep/.el-tag .el-icon-close {
  color: #444;
}

.tag__classify .tag_reset /deep/.el-tag .el-icon-close:hover {
  background: #fff;
  color: #444;
}
</style>
