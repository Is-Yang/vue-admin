<template>
  <div>
    <el-row>
      <el-col :span="20">
        <el-form :inline="true" :model="searchInfo" size="small">
           <el-form-item label="企业名称：">
            <el-input v-model="searchInfo.keyword" placeholder="请输入企业名称"></el-input>
          </el-form-item>

          <el-form-item label="企业区域：">
              <el-select v-model="searchInfo.manager_index" placeholder="请选择区域" size="medium">
                <el-option v-for="item in areaList" :key="item.manager_index" :label="item.area_name" :value="item.manager_index">
                </el-option>
              </el-select>
          </el-form-item>

          <el-form-item label="企业类型：">
            <el-select v-model="searchInfo.company_type" placeholder="请选择公司类型" size="medium">
              <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
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

      <el-col :span="4" class="text-right">
        <router-link to="company/add" v-if="propity === 2">
          <el-button type="primary" size="small">创建公司</el-button>
        </router-link>
      </el-col>
    </el-row>

    <el-table v-loading="loading" border :data="listData" tooltip-effect="dark">
      <el-table-column label="公司名称" min-width="300" v-if="propity == 2">
        <template slot-scope="scope">
          <a class="a-link" href="javascript:;" @click="companyOperate(scope.row.company_id)">{{scope.row.company_name}}</a>
        </template>
      </el-table-column>
      <el-table-column v-else prop="company_name" label="公司名称"></el-table-column>
      <el-table-column prop="company_type_text" label="公司类型" width="130px"></el-table-column>
      <el-table-column prop="company_info" label="公司信息" min-width="280"></el-table-column>
      <el-table-column prop="area_name" label="区域" min-width="100"></el-table-column>
      <!-- <el-table-column label="四色图1" width="100px">
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
      </el-table-column> -->
      <el-table-column label="操作" min-width="180px">
        <template slot-scope="scope">
          <el-button size="mini" type="success" plain icon="el-icon-download" @click="downloadFn(scope.row)" title="导出">
          </el-button>
          <el-button size="mini" type="success" plain icon="el-icon-view" @click="viewFn(scope.row)" title="查看">
          </el-button>
          <el-button size="mini" v-if="propity === 2" type="primary" plain icon="el-icon-edit"  @click="editFn(scope.row)"
            title="编辑"></el-button>
          <el-button size="mini" v-if="propity === 2" type="danger" plain icon="el-icon-delete" @click="deleteFn(scope.row)"
            title="删除"></el-button>
          <!-- <router-link to="/account/company" class="margin-left-10" v-if="propity == 2">
            <el-button type="primary" plain size="mini">企业账号</el-button>
          </router-link>
          <router-link to="/department" v-if="propity == 2">
            <el-button type="primary" plain size="mini">部门列表</el-button>
          </router-link> 
          <router-link to="/account" v-if="propity == 2">
            <el-button type="primary" plain size="mini">员工账号</el-button>
          </router-link> -->
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="page.current"
      :page-size="page.size" :total="page.total" :page-sizes="[10, 20, 50, 100, 200]"
      layout="total, sizes, prev, pager, next, jumper"></el-pagination>
  
      <!-- <v-map :mapXY="dialog.mapXY"></v-map> -->

    <el-dialog title="请选择分类来进行企业信息导出" :visible.sync="dialog.typeShow" width="400px" :before-close="handleTypeClose">
      <el-select v-model="filter.positionId" clearable filterable placeholder="请选择" style="width: 300px">
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

    <el-dialog title="请选择操作" :visible.sync="dialog.selectShow" width="400px" :before-close="handleClose">
      <el-select v-model="selectVal" placeholder="请选择" style="width: 300px">
        <el-option
          v-for="item in selectOptions"
          :key="item.to"
          :label="item.label"
          :value="item.to">
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleSelectOk">确 定</el-button>
      </span>
    </el-dialog>

    <!-- <table-slider-bar></table-slider-bar> -->

    <EnterpriseInfo v-if="dialog.show"
      :infoData="dialog.infoData"   
      @cancel="dialog.show = false"
      @success="dialog.show = false"></EnterpriseInfo>
  </div>
</template>

<script>
import * as Http from "@/api/home";
import * as userInfo from "@/utils/commonService/getUserInfo";
import EnterpriseInfo from './EnterpriseInfo';
import VMap from './Map'
export default {
  components: {
    EnterpriseInfo,
    VMap
  },
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
      dialog: {
        show: false,
        typeShow: false,
        selectShow: false,
        companyId: '',
        mapXY: {},
        infoData: {}
      },
      propity: 2,
      options: [],
      filter: {
        positionId: '',
        companyId: ''
      },
      // 公司类型列表
      typeList: [{
          label: '危险化学品',
          value: 0,
        },
        {
          label: '煤矿',
          value: 1,
        },
        {
          label: '非煤矿山',
          value: 2,
        },
        {
          label: '工贸行业',
          value: 3,
        },
        {
          label: '其他',
          value: 4,
        }
      ],
      areaList: [],
      selectVal: '',
      selectOptions: [
        {
          to: '/account/addCompany',
          label: '创建企业'
        }, {
          to: '/department',
          label: '部门列表'
        }, {
          to: '/account',
          label: '员工账号'
        }
      ]
    };
  },
  created() {
    this.getAreaSelect();
    this.getListData();
  },
  methods: {
    getListData() {
      this.loading = true;
      let user_info = userInfo.getUserInfo() && JSON.parse(userInfo.getUserInfo());
      this.propity = user_info && user_info.propity;

      let {
        company_type,
        manager_index,
        keyword
      } = this.searchInfo
      
      let params = {
        propity: this.propity,
        page: this.page.current,
        company_type: company_type,
        manager_index: manager_index,
        key: keyword
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
    getAreaSelect() {
        Http.geAreaSelect().then(res => {
            this.$handleResponse(res, res => {
              this.areaList = res.data;
            })
        })
    },
    companyOperate(company_id) {
      this.dialog.companyId = company_id;
      this.dialog.selectShow = true;
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
            this.filter.companyId = res.data.company_id;
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
      this.dialog.infoData = data;
      this.dialog.show = true;
    },
    handleSelectOk() {
      this.$router.push({
          path: this.selectVal,
          query: {
            companyId: this.dialog.companyId
          }
      })
    },
    handleTypeOk() {
        this.loading = true;
        Http.exportWord(
          {
            position_id: this.filter.positionId,
            company_id: this.filter.companyId
          }
        ).then(res => {
          this.$handleResponse(res, res => {
              this.loading = false;
              let blob = new Blob([res], {type: "application/msword;charset=utf-8"});
              const a = document.createElement('a');
              let ext = 'doc';
              a.href = window.URL.createObjectURL(blob);
              a.download = `企业信息.${ext}`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
          });
        })
        .catch(err => {
          this.loading = false;
        });
        this.handleTypeClose();
    },
    handleClose() {
      // this.dialog.show = false;
      // this.dialog.mapXY = {};
      this.selectVal = '';
      this.dialog.selectShow = false;
    },
    handleTypeClose() {
      this.dialog.typeShow = false;
    },  
    sizeChange(val) {
      this.page.size = val;
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
    },
    currentChange(val) {
      this.page.current = val;
      this.getListData();
    }
  }
};
</script>

