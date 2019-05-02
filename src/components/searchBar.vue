<template>
  <div class="search__bar"> 
    <slot></slot>
    <el-row>
      <el-col :span="24">
        <el-button v-bind="$attrs" type="primary"  round icon="el-icon-search" class="m-l-28" @click="find" v-show="searchBar.isSearch">查询</el-button>
        <el-button v-bind="$attrs" plain round icon="el-icon-delete" @click="clear" v-show="searchBar.isSearch">清空查询条件</el-button>
        <div class="f-r skrink_box" v-show="searchBar.isExtend">
          <a class="mr20 shrink pointer" @click="changsearchstyle" v-if="ishidden"><i  class="el-icon-d-arrow-right icon_rotate"></i>收起</a>
          <a class="mr20 shrink pointer" @click="changsearchstyle" v-if="!ishidden"><i class="el-icon-d-arrow-left icon_rotate"></i>展开</a>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>

export default {
  props: {
    search: {
      type: Object,
      default(){
        return {}
      }
    },
  },
  inheritAttrs:true,
  data() {
    return {
      ishidden: true,
      searchBar: {
        isSearch: true, //查询，清除查询默认显示
        isExtend: false, // 是否展开伸展和搜索
      }
    };
  },
  mounted() {
    this.searchBar = Object.assign(this.searchBar,this.search);
  },
  methods: {
    find() {
      this.$emit('find');
    },
    clear() {
      this.$emit('clear');
      this.$eventHub.$emit("clear-change"); // 清空搜索标签
    },
    changsearchstyle() {
      this.ishidden = !this.ishidden //收缩与展开状态切换
      this.searchBar.isSearch = !this.searchBar.isSearch //点击收缩展开改变状态
      this.$emit('searchIshidden')
    }
  },
};

</script>

<style lang="scss" scoped>
.search__bar {
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
  .m-l-28{
    margin-left:28px;
  }
  .skrink_box{
    height: 35px;
    line-height: 35px;
  }
  .shrink{
    color: #b0b9c2;
    font-size: 14px;
  }
  .icon_rotate{
    transform: rotate(-90deg);
  }
}
</style>

