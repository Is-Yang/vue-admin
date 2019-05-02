<template>
  <div class="m20 single">
    <bread-crumb :initBread="breadList" isBack></bread-crumb>
    <div class="common-section role-manage">
      <el-alert title type="warning" :closable="false" class="tips-bg">
        <div class="padding-5">统计数据于次日更新前一天的数据。</div>
      </el-alert>
      <el-row class="margin-top-20 margin-bottom-20 line">
        <el-col :span="20">
          <el-form :inline="true" size="small">
            <el-form-item label="来源" class="re-input-placeholder">
              <el-select v-model="filter.source" placeholder="请选择" class="basic-width">
                <el-option
                  v-for="item in sourceOptions"
                  :key="item.val"
                  :label="item.label"
                  :value="item.val"
                ></el-option>
              </el-select>
            </el-form-item>
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
        <el-table-column label="4S店名称" prop="area_name" width="200"></el-table-column>
        <el-table-column prop="title" label="文章标题">
          <template slot-scope="scope">
            <span style="text-decoration: underline;color: #409EFF;cursor: pointer;" @click="showContent(scope.row)">{{ scope.row.title}}</span>
          </template>
        </el-table-column>
        <el-table-column label="发送时间" prop="dateline"></el-table-column>
        <el-table-column label="送达人数" prop="target_user"></el-table-column>
        <el-table-column label="浏览量" prop="int_page_read_user"></el-table-column>
        <el-table-column label="转发量" prop="share_user"></el-table-column>
        <el-table-column label="收藏人数" prop="add_to_fav_user"></el-table-column>
        <el-table-column label="来源" prop="source"></el-table-column>
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
      sourceOptions: [],
      contentDialog: false,
      content: "",
      breadList: [{"name": '单店图文统计','path': '/xg/marketing/single'},{"name": '图文详情','path': ''}]
    };
  },
  created() {
    this.params = {
      id: this.$route.query.id // 组织id
    };
    this.breadList[1].name = this.$route.query.name + '图文详情';
    this.getRoleData();
  },
  methods: {
    getRoleData() {
      // 角色列表
      this.loading = true;
      let { title, source } = this.filter;
      this.params = {
        page: this.page.current,
        pageSize: this.page.size,
        title: title,
        source: source
      };
      Http.getSingleDetail(this.$route.query.id, this.params)
        .then(res => {
          this.loading = false;
          this.$handleResponse(res, res => {
            this.roleList = res.list.result;
            this.sourceOptions = res.options;
            this.page.total = res.list.total;
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
        url: "/template/area-statistics/" + this.$route.query.id,
        params: params,
        filename: "单店图文统计详情"
      };
    },
    showContent(row) {
      this.contentDialog = true;
      this.content = row.content;
    }
  }
};
</script>

<style lang="scss" scoped>
  .single /deep/.preview-body img{
    max-width: 760px;
  }
</style>
