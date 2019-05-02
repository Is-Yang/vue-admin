<template>
  <div class="shelf__area por">
    <el-radio v-model="configs.sale_target" @change="changeRadio" :label="1">{{title}}</el-radio>
    <a class="poa a_style" @click="upgradeConfig">高级配置</a>
    <div class="mt15 sale_box" v-show="configs.relationAreasOptions && configs.relationAreasOptions.length">
      <div class="sale_style">
        <p v-for="(item,index) in configs.relationAreasOptions" :key='index'>{{item[showAttr]}}</p>
      </div>
    </div>


    <!-- 管理4s店弹窗 -->
    <select-area
      v-if="showDailog"
      :title="'上架范围'"
      :relationAreasOptions="configs.relationAreasOptions"
      :pRelationAreasOptions="configs.pRelationAreasOptions"
      v-on:areas-change="listenToAreas"
      @cancel="showDailog = !showDailog"
    ></select-area>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '全部4S店'
    },
    showAttr:{
      type: String,
      default: 'name'
    },
    configs: {
      type: Object,
      default(){
        return{
          sale_target: 1,
          relationAreasOptions:[], // 已选择
          pRelationAreasOptions:[], // 未选中
        }
      }
    }
  },
  data(){
    return {
      showDailog: false, // 显示弹窗
    }
  },
  methods: {
    changeRadio(value){
      this.configs.relationAreasOptions = [];
    },
    upgradeConfig(){
      this.showDailog = true;
    },
    listenToAreas(somedata) {
      this.configs.relationAreasOptions = somedata;
      if(somedata && somedata.length){
        this.configs.sale_target = 2;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.shelf__area{
  .sale_box{
    width: 360px;
    padding: 15px 0 15px 20px;
    background: #eef3f9;
    border-radius: 5px;
    .sale_style{
      max-height: 317px;
      overflow-y: auto;
    }
  }
  .a_style{
    top: -1px;
    left: 111px;
  }
}

.shelf__area /deep/ .el-radio__input.is-checked+.el-radio__label{
  color:#606266;
}
</style>
