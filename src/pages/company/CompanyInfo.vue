<template>
  <div>
    <div class="margin-bottom-20 text-right">
        <!-- <el-button size="small" type="primary" @click="dialogShow('add', {})">上传资料</el-button> -->
    </div>

    <!-- <el-tabs v-model="active" type="card" @tab-click="getListData">
      <el-tab-pane label="安全生产培训" name="1"></el-tab-pane>
      <el-tab-pane label="应急救援" name="2"></el-tab-pane>
      <el-tab-pane label="安全生产标准化" name="3"></el-tab-pane> -->

      <el-table v-loading="loading" border :data="listData" tooltip-effect="dark">
        <el-table-column prop="name" label="资料标题"></el-table-column>
        <el-table-column prop="create_time" label="创建时间"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <a :href="scope.row.url" download target="_blank">
              <el-button size="mini" type="success" plain icon="el-icon-download" @click="downloadFn(scope.row)"
                title="下载">
              </el-button>
            </a>
            <el-button size="mini" type="danger" plain icon="el-icon-delete" @click="deleteFn(scope.row)" title="删除">
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="page.current"
        :page-size="page.size" :total="page.total" :page-sizes="[10, 20, 50, 100, 200]"
        layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    <!-- </el-tabs> -->

     <!-- 文件新增或修改 -->
    <file-handle
        v-if="dialog.show"
        :type="dialog.type"
        :fileParent="dialog.fileParent"
        :currentActive="active"
        @cancel="dialog.show = !dialog.show"
        @success="dialogSuccess">
    </file-handle>
  </div>
</template>

<script>
  import * as Http from "@/api/home";
  import * as userInfo from "@/utils/commonService/getUserInfo";
  import FileHandle from './FileHandle';
  let user_info = userInfo.getUserInfo() && JSON.parse(userInfo.getUserInfo());
  export default {
    inject: ["reload"],
    components: {
        FileHandle
    },
    data() {
      return {
        loading: false,
        active: '1',
        listData: [],
        page: {
          current: 1,
          size: 10,
          total: 0
        },
        dialog: {
          show: false,
          type: "",
          active: '1',
          fileParent: {}
        },
      };
    },
    created() {
      this.getListData();
    },
    methods: {
      dialogSuccess() {
        // 新增或修改成功后关闭窗口
        this.dialog.show = false;
        this.getListData();
      },
      // 新增，编辑弹窗显示
      dialogShow(type, initData){ 
        this.dialog.type = type;
        this.dialog.fileParent = initData;
        this.dialog.show = true;
      },
      handleAvatarSuccess(res, file) {
        if (res.result == 'ok') {
          this.$message.success("上传成功");
          this.reload();
        } else {
          this.$message.error("上传失败");
        }
      },
      getListData() {
        let route = this.$route;
        let from = '';
        if (route.path == '/company/zfinfo') {
          from = 1;
        } else if (route.path == '/company/qtinfo') {
          from = 2;
        }
        // 菜单列表数据
        this.loading = true;
        let params = {
          page: this.page.current,
          type: this.active,
          from: from
        };
        Http.getFileList(params)
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
      downloadFn(data) {
        // this.loading = true;
        // Http.downloadFile({
        //     file_name: data.name
        //   })
        //   .then(res => {
        //     if (res.status === 200) {
        //       this.loading = false;
        //       // 创建隐藏的可下载链接
        //       var eleLink = document.createElement('a');
        //       eleLink.download = data.name;
        //       eleLink.style.display = 'none';
        //       // 字符内容转变成blob地址
        //       var blob = new Blob([res.data]);
        //       eleLink.href = URL.createObjectURL(blob);
        //       // 触发点击
        //       document.body.appendChild(eleLink);
        //       eleLink.click();
        //       // 然后移除
        //       document.body.removeChild(eleLink);
        //     } else {
        //       this.$message.error("请刷新页面重试！");
        //     }
        //   }).catch(error => {
        //     console.log(error);
        //   });
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
      }
    }
  };

</script>
