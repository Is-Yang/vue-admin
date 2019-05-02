<template>
  <div class="bread__crumb common-inner mb20">
    <span class="bread_back" @click="goBack" v-show="isBack">
      <i class="el-icon-back"></i>
    </span>

    <!-- 面包屑 -->
    <a  class="bread_color" v-for="(item,index) in bread" :key="index">
      <span class="bread_font"
        :class="{'frist_bread': index == 0, 'last_bread': index == (bread.length-1)}"
        @click="goTo(item.path, index)"
      >{{item.name}}</span>
      <i class="el-icon-arrow-right" v-show="index != (bread.length-1)"></i>
    </a>
  </div>
</template>

<script>
export default {
  props: {
    isBack: {
      type: Boolean,
      default: false
    },
    breadName: {
      type: String,
      default: 'none'
    },
    initBread: {
      type: Array,
      default(){
        return []
      }
    },
    dataIsArr: {
      type: Boolean,
      default: true
    }
  },
  data(){
    return {
      breadList: {
        'poster': [{"name": '海报模板','path': ''}],
        'posterAdd': [{"name": '海报模板','path': '/marketTool/template/poster'},{"name": '新增模板','path': ''}],
        'posterEdit': [{"name": '海报模板','path': '/marketTool/template/poster'},{"name": '编辑模板','path': ''}],
        'imgText': [{"name": '图文模板','path': ''}],
        'imgTextAdd': [{"name": '图文模板','path': '/marketTool/template/imageText'},{"name": '新增图文','path': ''},],
        'imgTextEdit': [{"name": '图文模板','path': '/marketTool/template/imageText'},{"name": '编辑图文','path': ''},],
        'marktingGroup': [{"name": '集团图文统计','path': ''}],
        'marktingSingle': [{"name": '单店图文统计','path': ''}],
        'xgSetting': [{"name": '统计标签设置','path': ''}],
        'xgSettingList': [{"name": '统计标签设置','path': '/xg/setting'}, {"name": '子标签设置','path': ''}],
        'xgSettingListAdd': [{"name": '统计标签设置','path': '/xg/setting'}, {"name": '子标签设置','path': '/xg/setting/list'}, {"name": '新增子标签','path': ''}],
        'xgSettingListEdit': [{"name": '统计标签设置','path': '/xg/setting'}, {"name": '子标签设置','path': '/xg/setting/list'}, {"name": '编辑子标签','path': ''}],
        'none': []
      },
      bread: []
    }
  },
  mounted(){
    if(!this.dataIsArr){
      this.bread = this.breadList[this.breadName];
      // debugger;
    }else{
      this.bread = this.initBread;
    }
  },
  watch: {
    breadName(newVal){
      if(!this.dataIsArr){
        this.bread = this.breadList[newVal];
      }

    }
  },
  methods: {
    goBack(){
      // 返回上一页
      if(window.history.length <=1){
        this.$router.push({path:'/'})
        return
      }else{
        this.$router.go(-1);
      }
    },
    goTo(path,index){
      if(index == (this.bread.length - 1)){
        return;
      } 
      this.$router.go(-(this.bread.length - 1 - index));
    }
  }
}
</script>

<style lang="scss" scoped>
.bread__crumb {
  display: flex;
  height: 46px;
  .bread_back {
    display: inline-block;
    width: 44px;
    height: 46px;
    line-height: 46px;
    text-align: center;
    background: #1395eb;
    color: #fff;
    font-size: 23px;
    border-radius: 5px 0 0 5px;
    box-shadow: 0px 0px 1px 0px #1395eb;
    cursor: pointer;
  }
  .bread_color{
    color:#1395eb;
    line-height: 50px;
    .bread_font {
      margin: 0 2px 0 5px;
    }
    .frist_bread {
      margin-left: 20px;
    }
    .last_bread {
      color: #454545;
      cursor: default;
    }
  }
}

</style>
