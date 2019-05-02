<template>
  <el-dialog class="adjust__store" :title="'上架范围'" visible width="620px" @close="closeDialog()">
    <div class="adjust__stor por">
      <span class="adjust__title poa">上架范围</span>
      <shelf-area class="adjust_content" :title="'全部4s店'" :configs="configs"></shelf-area>
    </div>
    <div slot="footer" class="dialog-footer text-center mb10">
      <el-button style="width: 90px;" type="primary" size="medium" :loading="isLoading" round @click="save()">保存</el-button>
      <el-button style="width: 90px;" @click="closeDialog()" size="medium" round>取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
// 此组件为调整上架范围组件，我的图文列表
import ShelfArea from './ShelfArea';
export default {
  components:{
    ShelfArea
  },
  props: ['configs'],
  data(){
    return{
      isLoading:false
    }
  },
  methods: {
    save(){ // 保存
      const {sale_target, relationAreasOptions} = this.configs;
      if(sale_target == 2){ // 2 为自定义
         if(relationAreasOptions && relationAreasOptions.length == 0){
           this.$message.error('请选择门店');
           return;
         }
         this.$emit("close","update");
      }else if(sale_target == 1){
        this.$emit("close","update");
      }else {
        this.$message.error('请选择门店');
      }
    },
    closeDialog(){ // 取消
      this.$emit("close","cancel");
    }
  }
}
</script>

<style lang="scss" scoped>
.adjust__store{
  .adjust__title{
    top: 0;
    left: 10px;
    &::after {
      content: '*';
      color: red;
      margin-left: 5px;
      vertical-align: middle;
    }
  }
  .adjust_content{
    margin-left: 110px;
  }
}

.adjust__store /deep/.el-dialog__title{
  margin-left: 10px;
}

</style>

