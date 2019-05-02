<template>
  <div class="m20 group">
    <bread-crumb :dataIsArr="false" breadName="marktingGroup"></bread-crumb>
    <div class="common-section role-manage">
      <el-alert title type="warning" :closable="false" class="tips-bg">
        <div class="padding-5">统计数据于次日更新前一天的数据。</div>
      </el-alert>
      <el-row class="margin-top-20 margin-bottom-20 line">
        <el-col :span="20">
          <el-form :inline="true" size="small">
            <el-form-item label="搜索内容">
              <el-input v-model="filter.title" placeholder="图文名称"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                size="small"
                round
                icon="el-icon-search"
                class="m-l-28"
                @click="searchFn"
              >查询</el-button>
              <el-button plain size="small" round icon="el-icon-delete" @click="resetFn">清空查询条件</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <TableExport
        :url="configExport.url"
        :params="configExport.params"
        :filename="configExport.filename"
        method="get"
      ></TableExport>

      <el-table border v-loading="loading" :data="roleList" size="small">
        <el-table-column label="序号">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="memberNum" label="图文名称" width="180">
          <template slot-scope="scope">
            <span style="text-decoration: underline;color: #409EFF;cursor: pointer;" @click="showContent(scope.row)">{{ scope.row.title}}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="created_date"></el-table-column>
        <el-table-column label="使用总数">
          <template slot-scope="scope">
            <!-- <router-link :to="{ path: 'group/detail', query: { id: scope.row.org_template_msg_id, , name: scope.row.title}}"> -->
            <el-button
              type="text"
              size="mini"
              @click="goDetail(scope.row.org_template_msg_id, scope.row.title)"
            >{{ scope.row.temp_num}}</el-button>
            <!-- </router-link> -->
          </template>
        </el-table-column>
        <el-table-column label="送达人数">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="goDetail(scope.row.org_template_msg_id, scope.row.title)"
            >{{ scope.row.target_user }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="浏览量">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="goDetail(scope.row.org_template_msg_id, scope.row.title)"
            >{{ scope.row.int_page_read_user}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="转发量">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="goDetail(scope.row.org_template_msg_id, scope.row.title)"
            >{{ scope.row.share_user}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="收藏人数">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="goDetail(scope.row.org_template_msg_id, scope.row.title)"
            >{{ scope.row.add_to_fav_user}}</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="sizeChange"
        @current-change="currentChange"
        :current-page="page.current"
        :page-size="page.size"
        :total="page.total"
        :page-sizes="[10, 20, 50, 100, 200]"
        layout="sizes, prev, pager, next, jumper"
      ></el-pagination>

      <el-dialog title :visible.sync="contentDialog" width="800px" class="preview-body">
        <div v-html="content"></div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import * as Http from "@/api/statistics";
export default {
  data() {
    return {
      filter: {},
      roleList: [],
      loading: false,
      page: {
        current: 1,
        size: 10,
        total: 0
      },
      configExport: {}, // 导出
      params: {},
      contentDialog: false,
      content: ""
    };
  },
  created() {
    let catchParams = JSON.parse(sessionStorage.getItem("catchParams"));
    if (catchParams) {
      this.filter = {
        title: catchParams.title
      };
      this.page.current = catchParams.page;
      this.page.size = catchParams.pageSize;
    }
    if(this.$route.query && this.$route.query.title){ // 从营销工具我的图文列表跳过来
      this.filter = {
        title: this.$route.query.title
      };
    }
    this.getRoleData();
  },
  /* activated() {
    console.log(this.$route.meta.isBack)
    if(!this.$route.meta.isBack){
      // 如果isBack是false，表明需要获取新数据，否则就不再请求，直接使用缓存的数据
      this.getRoleData();
    }
    // 恢复成默认的false，避免isBack一直是true，导致下次无法获取数据
    this.$route.meta.isBack=false
  }, */
  methods: {
    getRoleData() {
      console.log(this.page);
      // 角色列表
      this.loading = true;
      let { title } = this.filter;
      this.params = {
        page: this.page.current,
        pageSize: this.page.size,
        title: title
      };
      Http.getGroupList(this.params)
        .then(res => {
          this.loading = false;
          this.$handleResponse(res, res => {
            this.roleList = res.list;
            this.page.total = res.page.total_page * res.page.pageSize;
            sessionStorage.removeItem("catchParams");
          });
        })
        .catch(err => {
          this.loading = false;
        });
      // 配置导出时
      this.configExportFn();
    },
    searchFn() {
      // 搜索
      this.page.current = 1;
      this.getRoleData();
    },
    resetFn() {
      // 清空
      this.filter = {};
      this.getRoleData();
    },
    sizeChange(val) {
      this.page.size = val;
      this.getRoleData();
    },
    currentChange(val) {
      this.page.current = val;
      this.getRoleData();
    },
    // 配置导出方法
    configExportFn() {
      const params = Object.assign({}, this.params);
      params.export = 1; // 导出

      // 导出传递所需参数
      this.configExport = {
        url: "/template/statistics",
        params: params,
        filename: "集团图文统计"
      };
    },
    showContent(row) {
      this.contentDialog = true;
      this.content = row.content;
    },
    goDetail(id, name) {
      this.$router.push({
        path: "group/detail",
        query: { id: id, name: name }
      });
      console.log(this.params);
      sessionStorage.setItem("catchParams", JSON.stringify(this.params));
    }
  }
};
</script>

<style lang="scss" scoped>
  .group /deep/.preview-body img{
    max-width: 760px;
  }
</style>
