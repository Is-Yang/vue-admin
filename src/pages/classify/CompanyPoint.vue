<template>
  <div>
    <el-row type="flex">
      <el-col :span="20">
        <el-form :inline="true" :model="searchInfo" size="small">
           <el-form-item label="公司名称：">
            <el-input v-model="searchInfo.keyword" placeholder="请输入公司名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="small"
              round
              icon="el-icon-search"
              @click="onSearch"
            >查询</el-button>
            <el-button plain size="small" round icon="el-icon-delete" @click="onReset">清空查询条件</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-table v-loading="loading" border :data="listData" tooltip-effect="dark" ref="menuTable">
      <el-table-column label="公司名称">
        <template slot-scope="scope">
          <router-link :to="{ path: '/classify/big', query: {companyId: scope.row.company_id, pointType: pointType}}" class="a-link">{{scope.row.company_name}}</router-link>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="page.current"
      :page-size="page.size" :total="page.total" :page-sizes="[10, 20, 50, 100, 200]"
      layout="total, sizes, prev, pager, next, jumper"></el-pagination>
  </div>
</template>

<script>
import * as Http from "@/api/home";
export default {
  inject: ["reload"],
  data() {
    return {
      loading: false,
      listData: [],
      searchInfo: {},
      page: {
        current: 1,
        size: 10,
        total: 0
      },
      pointType: 1,
    };
  },
  created() {
    const route = this.$route;
   // 根据当前路由，对应不同的跳转数据
    if (route.path === '/classify/point') {
        this.pointType = 1;  // 风险点创建
    } else if (route.path === '/classify/taskPoint') {
        this.pointType = 2;  // 风险点任务创建
    } 

    this.getListData();
  },
  methods: {
    getListData() {
      this.loading = true;
      let params = {
        page: this.page.current,
        key: this.searchInfo.keyword
      }
      
      Http.getCompanyList(params)
        .then(res => {
          this.loading = false;
          this.$handleResponse(res, res => {
            this.listData = res.data;
            this.page.total = res.total;
          });
        })
        .catch(err => {
          this.loading = false;
        });
    },
    sizeChange(val) {
      this.page.size = val;
      this.getListData();
    },
    currentChange(val) {
      this.page.current = val;
      this.getListData();
    },
    onSearch() {
      // 搜索
      this.page.current = 1;
      this.getListData();
    },
    onReset() {
      // 清空
      this.searchInfo = {};
      this.getListData();
    }
  }
};
</script>


