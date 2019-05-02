<template>
  <div class="table__template">
    <!-- 表格头部 做成工具栏 右侧搜索，页面 -->
    <el-row class="flex vcenter h80" v-show="Tconfigs.first">
      <el-col :span="12">
        <slot name="tools"></slot>
      </el-col>
      <el-col :span="12">
        <div class="flex vcenter h80 lright">
          <el-pagination @size-change="handleSizeChange" 
            @current-change="handleCurrentChange" 
            :current-page.sync="page.page" 
            :page-sizes="[20, 50, 100, 200]" 
            :page-size="page.page_size" 
            :layout="layoutTop" 
            :total="page.total">
          </el-pagination>
        </div>
      </el-col>
    </el-row>
    
    <!--  中间内容 -->
    <slot name="template"></slot>

    <!-- 表格底部 页码-->
    <el-row class="flex vcenter h66" v-show="Tconfigs.last">
      <el-col :span="12">
        
      </el-col>
      <el-col :span="12">
        <el-pagination @size-change="handleSizeChange" 
          @current-change="handleCurrentChange" 
          :current-page.sync="page.page" 
          :page-size="page.page_size"
          layout="total,prev, pager, next" 
          :total="page.total" 
          class="f-r">
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    configs: {
      type: Object,
      deafult(){
        return {}
      }
    },
    page: { // 由于要实时监控这个值，所以单独一个输入
      type: Object,
      default(){
        return {
          page: 1,
          page_size: 20,
          total: 0,
        }
      }
    },
    layoutTop: {
      type: String,
      default: 'total,sizes, prev, pager, next', // 'total,sizes, prev, pager, next'
    }
  },
  data(){
    return{
      Tconfigs: { // T 表示 table
        first: true,
        last: true,
      }
    }
  },
  mounted(){
    this.Tconfigs = Object.assign(this.Tconfigs, this.configs); // 初始化配置
  },
  methods: {
    handleCurrentChange(val) {
      this.$emit('changePage', { page: this.page.page });
    },
    handleSizeChange(val) {      
      this.page.page_size = val;
      this.page.page = 1;
      this.$emit('changePage', { page: 1, page_size: val });
    },
  },
}
</script>

<style lang="scss" scoped>

</style>

