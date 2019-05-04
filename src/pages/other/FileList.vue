<template>
  <div>
    <div class="margin-bottom-20 text-right">
      <el-button type="primary" size="small">上传文件</el-button>
    </div>
    <el-table v-loading="loading" border :data="listData" tooltip-effect="dark">
      <!-- <el-table-column label="文件图片">
        <template slot-scope="scope">
            
        </template>
      </el-table-column> -->
      <el-table-column prop="name" label="文件名称"></el-table-column>
      <el-table-column prop="create_time" label="创建时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
            <el-button size="mini" type="success" plain icon="el-icon-view" @click="viewFn(scope.row.name)" title="查看图片">
            </el-button>
            <el-button size="mini" type="primary" plain icon="el-icon-download" @click="downloadFn(scope.row)" title="下载">
            </el-button>
            <el-button size="mini" type="danger" plain icon="el-icon-delete" @click="deleteFn(scope.row)" title="删除">
            </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="page.current"
      :page-size="page.size" :total="page.total" :page-sizes="[10, 20, 50, 100, 200]"
      layout="total, sizes, prev, pager, next, jumper"></el-pagination>

    <!-- 图片预览 -->
    <view-img
        v-if="dialog.show"
        :imgName="dialog.imgName"
        @cancel="dialog.show = !dialog.show">
    </view-img>
  </div>
</template>

<script>
  import * as Http from "@/api/home";
  import moment from "moment";
  import ViewImg from './ViewImg'
  export default {
    components: {
        ViewImg
    },
    inject: ["reload"],
    data() {
      return {
        loading: false,
        listData: [],
        page: {
          current: 1,
          size: 10,
          total: 0
        },
        dialog: {
          show: false,
          imgName: ""
        }
      };
    },
    created() {
      this.getListData();
    },
    methods: {
      getListData() {
        // 菜单列表数据
        this.loading = true;
        let params = {
          page: this.page.current
        };
        Http.getFileList(params)
          .then(res => {
            this.loading = false;
            this.$handleResponse(res, res => {
              this.listData = res.data;

              this.page.total = res.total_page;
            });
          })
          .catch(err => {
            this.loading = false;
          });
      },
      downloadFn(data) {
        this.loading = true;
        Http.downloadFile({
            file_name: data.name
          })
          .then(res => {
            if (res.status === 200) {
              this.loading = false;
              const blob = new Blob([res.data]);
              const a = document.createElement('a');
              a.href = window.URL.createObjectURL(blob);
              a.download = `${data.name}`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            } else {
              this.$message.error("请刷新页面重试！");
            }
          }).catch(error => {
            console.log(error);
          });
      },
      deleteFn(data) {
        // 删除
        this.$confirm("请确认是否继续删除?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            this.doDelete(data.id);
          })
          .catch(() => {});
      },
      doDelete(id) {
        this.loading = true;
        Http.delFile({
            id: id
          })
          .then(res => {
            this.loading = false;
            this.$handleResponse(res, res => {
              this.$message.success("删除成功");
              this.reload();
            });
          })
          .catch(error => {
            this.loading = false;
            this.$message.error("删除失败");
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
      viewFn(name) {
        this.dialog.imgName = name;
        this.dialog.show = true;
      }
    }
  };

</script>
