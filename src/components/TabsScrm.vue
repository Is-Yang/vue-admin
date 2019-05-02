<template>
  <div class="tabs__scrm">
    <el-tabs v-model="currentTab" type="card" @tab-click="tabClick(currentTab)">
      <el-tab-pane
        :key="item.name"
        v-for="item in tabs"
        :label="item.title"
        :name="item.name">
        {{item.content}}
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  props: {
    tabs: {
      type: Array,
      default: []
    },
    configs: {
      type: Object,
      default(){
        return {}
      }
    }
  },
  data(){
    return{
      currentTab: '0',
      TabConfig: {
        sendObject: false, // 发送给父组件是否为对象，默认只传一个id 值
      }
    }
  },
  mounted(){
    if(this.tabs && this.tabs.length && this.tabs[0].name){
      this.currentTab = this.tabs[0].name;
    };
    this.TabConfig = Object.assign(this.TabConfig, this.configs);
  },
  methods: {
    tabClick(item){
      if(this.TabConfig.sendObject){ // 发送对象给父组件
        let currentObj = {};
        for(let i=0; i<this.tabs.length; i++){
          if(item == this.tabs[i].name){
            currentObj = this.tabs[i];
            break;
          }
        }
        this.$emit('tabChange', currentObj); // 给父组件广播
      }else{
        this.$emit('tabChange', item); // 给父组件广播
      }
      this.$eventHub.$emit("tab-change", item); // 事件广播给其它组件
    }
  }
  
}
</script>

<style lang="scss" scoped>
.tabs__scrm /deep/ .el-tabs--card>.el-tabs__header {
  height: 46px;
  background: #fafcff;
}
.tabs__scrm  /deep/ .el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
  border-top: 4px solid #409eff;
  height: 47px;
  background-color: #fff;
  border-left: 1px solid #e4e7ed;
  border-right: 1px solid #e4e7ed;
}

.tabs__scrm  /deep/ .el-tabs--card>.el-tabs__header .el-tabs__nav{
  border: 0px solid #e4e7ed;
}

.tabs__scrm  /deep/ .el-tabs--card>.el-tabs__header .el-tabs__item{
  border: 0px solid #e4e7ed;
}
</style>

