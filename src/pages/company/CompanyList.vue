<template>
  <div>
    <div class="margin-bottom-20 text-right">
      <router-link to="company/add" v-if="propity === 2">
        <el-button type="primary" size="small">创建公司</el-button>
      </router-link>
    </div>
    <el-table v-loading="loading" border :data="listData" tooltip-effect="dark">
      <el-table-column prop="company_name" label="公司名字"></el-table-column>
      <el-table-column prop="company_type_text" label="公司类型" width="120px"></el-table-column>
      <el-table-column prop="company_info" label="公司信息"></el-table-column>
      <el-table-column label="四色图1" width="100px">
        <template slot-scope="scope">
          <a :href="scope.row.company_img_1" target="_blank">
            <img :src="scope.row.company_img_1" style="width: 100%;" />
          </a>
        </template>
      </el-table-column>
      <el-table-column label="四色图2" width="100px">
        <template slot-scope="scope">
          <a :href="scope.row.company_img_2" target="_blank">
            <img :src="scope.row.company_img_2" style="width: 100%;" />
          </a>
        </template>
      </el-table-column>
      <el-table-column label="四色图3" width="100px">
        <template slot-scope="scope">
          <a :href="scope.row.company_img_3" target="_blank">
            <img :src="scope.row.company_img_3" style="width: 100%;" />
          </a>
        </template>
      </el-table-column>
      <el-table-column label="四色图4" width="100px">
        <template slot-scope="scope">
          <a :href="scope.row.company_img_4" target="_blank">
            <img :src="scope.row.company_img_4" style="width: 100%;" />
          </a>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="240px">
        <template slot-scope="scope">
          <el-button size="mini" type="success" plain icon="el-icon-download" @click="downloadFn(scope.row)" title="导出">
          </el-button>
          <el-button size="mini" type="success" plain icon="el-icon-view" @click="viewFn(scope.row)" title="查看地图">
          </el-button>
          <el-button size="mini" v-if="propity === 2" type="primary" plain icon="el-icon-edit"  @click="editFn(scope.row)"
            title="编辑"></el-button>
          <el-button size="mini" v-if="propity === 2" type="danger" plain icon="el-icon-delete" @click="deleteFn(scope.row)"
            title="删除"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="page.current"
      :page-size="page.size" :total="page.total" :page-sizes="[10, 20, 50, 100, 200]"
      layout="total, sizes, prev, pager, next, jumper"></el-pagination>
  
    <el-dialog title="地图点" :visible.sync="dialog.show" width="1000px" :before-close="handleClose">
        <v-map :mapXY="dialog.mapXY"></v-map>
    </el-dialog>
    <el-dialog title="请选择分类来进行企业信息导出" :visible.sync="dialog.typeShow" width="400px" :before-close="handleTypeClose">
      <el-select v-model="positionId" clearable filterable placeholder="请选择" style="width: 300px">
        <el-option
          v-for="item in options"
          :key="item.position_id"
          :label="item.position_name"
          :value="item.position_id">
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleTypeClose">取 消</el-button>
        <el-button type="primary" @click="handleTypeOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as Http from "@/api/home";
import * as userInfo from "@/utils/commonService/getUserInfo";
import VMap from './Map'
export default {
  components: {
    VMap
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
        typeShow: false,
        mapXY: {}
      },
      propity: 2,
      options: [],
      positionId: ''
    };
  },
  created() {
    this.getListData();
  },
  methods: {
    getListData() {
      // 菜单列表数据
      this.loading = true;
      let user_info = userInfo.getUserInfo() && JSON.parse(userInfo.getUserInfo());
      this.propity = user_info && user_info.propity;
      
      let params = {
        propity: this.propity,
        page: this.page.current
      };
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
    editFn(data){ 
       // 编辑
      this.$router.push({
        path: "company/edit",
        query: {
          companyId: data.company_id
        }
      });
    },
    deleteFn(data) {
      // 删除
      this.$confirm("请确认是否继续删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.doDelete(data.company_id);
      }).catch(() => {});
    },
    doDelete(id) {
      this.loading = true;
      let params = {
        company_id: id
      };
      Http.delCompany(params)
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
    downloadFn(data) {
      Http.getCompanyPostion({
        company_id: data.company_id
      }).then(res => {
          this.$handleResponse(res, res => {
            this.options = res.data.positions;
            this.dialog.typeShow = true;
          });
      })

    },  
    viewFn(data) {
      this.dialog.mapXY = {
        xData: data.company_x,
        yData: data.company_y,
        edit: false
      }
      this.dialog.show = true;
    },
    handleTypeOk() {
        this.loading = true;
        Http.exportWord(
          {
            position_id: this.positionId
          }
        ).then(res => {
          this.$handleResponse(res, res => {
            this.loading = false;
            let blob = new Blob([res], {type: "application/msword;charset=utf-8"});
            let objectUrl = URL.createObjectURL(blob);
            let link = document.createElement("a");
            let fname = '企业信息';
            link.href = objectUrl;
            link.setAttribute("download", fname);
            document.body.appendChild(link);
            link.click();
          });
        })
        .catch(err => {
          this.loading = false;
        });
        this.handleTypeClose();
    },
    handleClose() {
      this.dialog.show = false;
      this.dialog.mapXY = {};
    },
    handleTypeClose() {
      this.dialog.typeShow = false;
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

