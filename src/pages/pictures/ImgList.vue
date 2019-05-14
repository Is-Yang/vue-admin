<template>
  <div>
    <div class="margin-bottom-20 text-right">
        <el-button size="small" type="primary" @click="dialogShow('add', {})">添加宣传图</el-button>
    </div>
    <el-table v-loading="loading" border :data="listData" tooltip-effect="dark">
      <el-table-column prop="title" label="宣传标题"></el-table-column>
      <el-table-column label="宣传图片">
        <template slot-scope="scope">
            <div style="width:60px; height:60px;">
              <img :src="scope.row.img" />
            </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
            <el-button size="mini" type="success" plain icon="el-icon-download" @click="downloadFn(scope.row)" title="下载">
            </el-button>
            <el-button size="mini" type="primary" plain icon="el-icon-edit" @click="dialogShow('edit', scope.row)" title="编辑">
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
    <pictures-handle
        v-if="dialog.show"
        :type="dialog.type"
        :imgParent="dialog.imgParent"
        @cancel="dialog.show = !dialog.show"
        @success="dialogSuccess">
    </pictures-handle>
  </div>
</template>

<script>
  import * as Http from "@/api/home";
  import moment from "moment";
  import PicturesHandle from './PicturesHandle';
  import * as userInfo from "@/utils/commonService/getUserInfo";
  let user_info = userInfo.getUserInfo() && JSON.parse(userInfo.getUserInfo());
  export default {
    components: {
        PicturesHandle
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
          type: "",
          imgParent: {}
        }
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
        this.dialog.imgParent = initData;
        this.dialog.show = true;
      },
      getListData() {
        // 菜单列表数据
        this.loading = true;
        let params = {
          page: this.page.current
        };
        Http.getImgList(params)
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
      updateFn(data) {
        
      },
      downloadFn(data) {
        this.loading = true;
        let img = data.img ? data.img.substring(data.img.lastIndexOf('/')) : '';
        let ext = data.img.substring(data.img.lastIndexOf(".") + 1);
        Http.getImg({
            img: img
          })
          .then(res => {
            if (res.status === 200) {
              this.loading = false;
              // 创建隐藏的可下载链接
              var eleLink = document.createElement('a');
              eleLink.download = data.title + '.' + ext;
              eleLink.style.display = 'none';
              // 字符内容转变成blob地址
              var blob = new Blob([res.data]);
              eleLink.href = URL.createObjectURL(blob);
              // 触发点击
              document.body.appendChild(eleLink);
              eleLink.click();
              // 然后移除
              document.body.removeChild(eleLink);
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
        Http.delImg({
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

<style lang="scss" scoped>
  img {
    width: 100%;
    height: 100%;
  }
</style>
