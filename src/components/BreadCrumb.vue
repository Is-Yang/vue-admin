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
        '/account/add': [{"name": '创建员工','path': ''}],
        '/account/edit': [{"name": '编辑员工','path': ''}],
        '/account/addGovernment': [{"name": '创建政府账号','path': ''}],
        '/account/editGovernment': [{"name": '编辑政府账号','path': ''}],
        '/account/addCompany': [{"name": '创建企业账号','path': ''}],
        '/account/editCompany': [{"name": '编辑企业账号','path': ''}],
        '/company/add': [{"name": '创建公司','path': ''}],
        '/company/edit': [{"name": '编辑公司','path': ''}],
        'monitorDetail': [{"name": '隐患整改详情','path': ''}],
        'none': []
      },
      bread: []
    }
  },
  mounted(){
    if(!this.dataIsArr){
      this.bread = this.breadList[this.breadName];
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
