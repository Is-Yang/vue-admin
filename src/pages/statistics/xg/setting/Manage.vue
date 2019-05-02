<template>
  <div class="m20 setting-manage">
    <bread-crumb :dataIsArr="false" breadName="xgSetting"></bread-crumb>
    <div class="common-section role-manage">
      <el-alert title type="warning" :closable="false" class="tips-bg">
        <div class="padding-5">支持通过将4S店进行标签归类，用于统计等场景进行快速的筛选。</div>
      </el-alert>
      <el-row class="margin-top-20 margin-bottom-20 line">
        <el-col :span="20">
          <el-form :inline="true" size="small">
            <el-form-item label="搜索内容">
              <el-input v-model="filter.keyword" placeholder="标签名称/子标签"></el-input>
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
      <!-- <TableExport
      :url="configExport.url"
      :params="configExport.params"
      :filename="configExport.filename"
      method="get"
      ></TableExport>-->
      <el-button
        plain
        size="small"
        type="primary"
        round
        icon="el-icon-plus"
        class="margin-bottom-20 re-primary-button"
        @click="setLabel('add', {})"
      >新增标签</el-button>
      <el-table border v-loading="loading" :data="roleList" size="small">
        <el-table-column label="序号">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="标签名称" prop="label_name"></el-table-column>
        <el-table-column label="子标签" prop="child"></el-table-column>
        <el-table-column label="创建时间" prop="created_at"></el-table-column>
        <el-table-column label="操作" width="280">
          <template slot-scope="scope">
            <el-button
              class="re-primary-button"
              size="mini"
              type="primary"
              plain
              round
              @click="go('setting/list', { label_id: scope.row.label_id})"
            >子标签管理</el-button>

            <el-button
              class="re-primary-button"
              size="mini"
              type="primary"
              plain
              round
              @click="setLabel('edit', scope.row)"
              v-if="scope.row.label_name != '品牌' && scope.row.label_name != '地区'"
            >编辑</el-button>

            <el-button
              class="re-primary-button"
              size="mini"
              type="primary"
              plain
              round
              @click="handleDelete(scope.row)"
              v-if="scope.row.label_name != '品牌' && scope.row.label_name != '地区'"
            >删除</el-button>
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
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>

      <el-dialog :title="labelDialog.title" :visible.sync="labelDialog.show" width="600px">
        <div class="form__content" v-loading="loading" style="width:520px">
          <el-form
            :model="labelDialog"
            :label-position="'right'"
            ref="labelInfo"
            :rules="rules"
            size="medium"
            @keyup.enter.native="onSubmit('labelInfo')"
            label-width="100px"
          >
            <el-form-item prop="name" label="标签名称：">
              <el-input type="text" v-model="labelDialog.name" placeholder="10个字符以内" maxlength=10></el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="medium" round @click="handleClose">取 消</el-button>
          <el-button size="medium" round type="primary" @click="onSubmit('labelInfo')">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import * as Http from "@/api/statistics";
export default {
  inject: ["reload"],
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
      labelDialog: {
        type: "",
        title: "",
        show: false,
        name: "",
        id: ""
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入标签名称",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
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
      // 角色列表
      this.loading = true;
      let { keyword } = this.filter;
      this.params = {
        page: this.page.current,
        pageSize: this.page.size,
        keyword: keyword
      };
      Http.getLabel(this.params)
        .then(res => {
          this.loading = false;
          this.$handleResponse(res, res => {
            this.roleList = res.result;
            this.page.total = res.total;
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
      params.is_report = 1; // 导出

      // 导出传递所需参数
      this.configExport = {
        url: "/report/statistics/" + this.tableType,
        params: params,
        filename:
          this.tableType === 1
            ? "基础统计表"
            : this.tableType === 2
            ? "展厅部门统计表"
            : "DCC部门统计表"
      };
    },
    setLabel(type, row) {
      this.labelDialog.type = type;
      this.labelDialog.title = type == "add" ? "新增标签" : "编辑标签";
      this.labelDialog.id = row && row.label_id;
      this.labelDialog.name = row && row.label_name;
      this.labelDialog.show = true;
      console.log(this.labelDialog);
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          let params = {
            label_name: this.labelDialog.name
          };
          if (this.labelDialog.type == "add") {
            Http.addLabel(params)
              .then(res => {
                this.loading = false;
                this.$handleResponse(res, res => {
                  this.$message({
                    type: "success",
                    message: "新增标签成功"
                  });
                  this.reload();
                  this.$emit("success");
                });
              })
              .catch(err => {
                this.loading = false;
              });
          } else {
            Http.updateLabel(this.labelDialog.id, params)
              .then(res => {
                this.loading = false;
                this.$handleResponse(res, res => {
                  this.$message({
                    type: "success",
                    message: "更新标签成功"
                  });
                  this.reload();
                  this.$emit("success");
                });
              })
              .catch(err => {
                this.loading = false;
              });
          }
        }
      });
    },
    handleClose() {
      this.labelDialog.show = false;
    },
    handleDelete(row) {
      this.$confirm("您确定要删除此标签吗？")
        .then(_ => {
          this.loading = true;
          Http.deleteLabel(row.label_id, {})
            .then(res => {
              this.loading = false;
              this.$handleResponse(res, res => {
                this.$message({
                  type: "success",
                  message: "删除标签成功"
                });
                this.reload();
                this.$emit("success");
              });
            })
            .catch(err => {
              this.loading = false;
            });
        })
        .catch(_ => {});
    },
    go(path, query){
      this.$router.push({ path:path, query: query});
    }
  }
};
</script>
