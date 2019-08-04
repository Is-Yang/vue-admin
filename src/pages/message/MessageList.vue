<template>
  <div>
    <div class="margin-bottom-20 text-right">
      <el-button type="primary" size="small" @click="dialog.show = true">发送消息</el-button>
    </div>
    <el-table v-loading="loading" border :data="listData" tooltip-effect="dark">
      <el-table-column prop="message_from" label="消息发送者"></el-table-column>
      <el-table-column prop="message_title" label="消息标题"></el-table-column>
      <el-table-column prop="message_content" label="消息内容"></el-table-column>
      <el-table-column prop="create_time_text" label="发送时间"></el-table-column>
      <el-table-column label="操作" width="120px">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" plain icon="el-icon-delete" @click="deleteFn(scope.row)"
            title="删除"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="page.current"
      :page-size="page.size" :total="page.total" :page-sizes="[10, 20, 50, 100, 200]"
      layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    
    <!-- 发送应急消息 -->
    <message-handle
      v-if="dialog.show"
      :pageType = '2'
      @cancel="dialog.show = !dialog.show"
      @success="dialogSuccess">
    </message-handle>
  </div>
</template>

<script>
import * as Http from "@/api/home";
import MessageHandle from './MessageHandle';
export default {
  components: {
    MessageHandle
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
      }
    };
  },
  created() {
    this.getListData();
  },
  methods: {
    getListData() {
      this.loading = true;
      let params = {
        page: this.page.current
      };
      Http.getMessageList(params)
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
    deleteFn(data) {
      // 删除
      this.$confirm("请确认是否继续删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.doDelete(data.message_id);
        })
        .catch(() => {});
    },
    doDelete(id) {
      this.loading = true;
      let params = {
        message_id: id
      };
      Http.delMessage(params)
        .then(res => {
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
    dialogSuccess() {
      this.dialog.show = false;
      this.getListData();
    }
  }
};
</script>

