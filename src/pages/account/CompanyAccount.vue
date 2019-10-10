<template>
  <div>
    <bread-crumb v-if="this.$route.meta.specialModule" :dataIsArr="true" isBack :initBread="customBread"></bread-crumb>

    <div :class="[{ 'minh768 common-section': this.$route.meta.specialModule }]">
      <el-row type="flex">
        <el-col :span="20">
          <el-form :inline="true" :model="searchInfo" size="small">
            <el-form-item label="政府名称：" v-if="pageType == 1">
              <el-input v-model="searchInfo.keyword" placeholder="请输入政府名称"></el-input>
            </el-form-item>
            <el-form-item label="公司名称：" v-else>
              <el-input v-model="searchInfo.keyword" placeholder="请输入公司名称"></el-input>
            </el-form-item>

            <el-form-item label="区域：" v-if="pageType == 1">
                <el-select v-model="searchInfo.manager_index" placeholder="请选择区域" size="medium">
                  <el-option v-for="item in areaList" :key="item.manager_index" :label="item.area_name" :value="item.manager_index">
                  </el-option>
                </el-select>
            </el-form-item>

            <!-- <el-form-item label="类型：">
              <el-select v-model="searchInfo.company_type" placeholder="请选择类型" size="medium">
                <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item> -->

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

        <el-col :span="4" class="text-right margin-bottom-20">
          <router-link v-if="pageType == 1" to="addGovernment">
            <el-button type="primary" size="small">{{'创建政府账号'}}</el-button>
          </router-link>
          <router-link v-else :to="{path: 'addCompany', query: {companyId: searchInfo.companyId, manager_index: searchInfo.manager_index, brea_name: $route.query.brea_name}}">
            <el-button type="primary" size="small">{{'创建企业账号'}}</el-button>
          </router-link>
        </el-col>
      </el-row>

      <el-table v-loading="loading" border :data="listData" tooltip-effect="dark">
        <el-table-column label="区域" v-if="pageType == 1">
          <template slot-scope="scope">
            <router-link :to="{ path: '/account/company', query: {'manager_index': scope.row.manager_index, 'brea_name' : scope.row.area_name}}" class="a-link">
              {{scope.row.area_name}}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="user_name" v-if="pageType == 1" label="政府账号"></el-table-column>
        <el-table-column prop="government_name" v-if="pageType == 1" label="政府名称"></el-table-column>
        <el-table-column prop="company.company_name" label="公司名称" v-if="pageType != 1"></el-table-column>
        <el-table-column prop="user_name" label="企业账号" v-if="pageType != 1"></el-table-column>
        <!-- <el-table-column prop="area_name" label="区域" v-if="pageType != 1"></el-table-column>
        <el-table-column prop="company.company_type_text" label="公司类型" v-if="pageType != 1"></el-table-column> -->
        <el-table-column label="是否允许登录">
          <template slot-scope="scope">
            {{scope.row.can_be_login === 1 ? '允许' : '不允许'}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button size="mini" :disabled="scope.row.user_name == '巴中市test' ? true :false" type="primary" plain icon="el-icon-edit" @click="editFn(scope.row.user_id)"
              title="编辑"></el-button>
            <el-button size="mini" :disabled="scope.row.user_name == '巴中市test' ? true :false" type="danger" plain icon="el-icon-delete" @click="deleteFn(scope.row)"
              title="删除"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="page.current"
        :page-size="page.size" :total="page.total" :page-sizes="[10, 20, 50, 100, 200]"
        layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    </div>
  
  </div>
</template>

<script>
import * as Http from "@/api/home";
import * as userInfo from "@/utils/commonService/getUserInfo";
export default {
  inject: ["reload"],
  data() {
    return {
      loading: false,
      listData: [],
      areaInfo: '',
      page: {
        current: 1,
        size: 10,
        total: 0
      },
      userInfo: {},
      searchInfo: {},
      dialog: {
        show: false,
        type: ""
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
      pageType: 3,
      customBread: []
    };
  },
  created() {
    this.userInfo = userInfo.getUserInfo() && JSON.parse(userInfo.getUserInfo());

    const route = this.$route;
    if (route.path === '/account/company') {
        this.pageType = 3;
    } else if (route.path === '/account/government') {
        this.pageType = 1;
    } 
    if (route.query && route.query.manager_index) {
      this.searchInfo.manager_index = route.query.manager_index;
    }
    if (route.query && route.query.companyId) {
      this.searchInfo.companyId = route.query.companyId;
    }
    this.customBread.push({
      'name': route.query && route.query.brea_name
    });
    
    this.getAreaSelect();
    this.getListData();
  },
  methods: {
    getListData() {
      this.loading = true;
      let propity = 0;
      if (this.userInfo && this.userInfo.propity) {
        propity = this.userInfo.propity;
      }

      let {
        company_type,
        manager_index,
        keyword,
        companyId
      } = this.searchInfo

      let params = {
        page: this.page.current,
        type: propity == 2 ? 1 : 0,  // type未1表示平台端，默认为0表示政府端
        propity: this.pageType,   // 企业账户3， 政府账户2，平台账户列表1
        company_type: company_type,  // 公司类型
        manager_index: manager_index,  // 区域
        key: keyword,  // 公司名称查询
        company_id: companyId
      };
      let queryName = this.pageType == 1 ? 'getMGovAccountList' : 'getCompanyAccount';
      Http[queryName](params)
        .then(res => {
          this.loading = false;
          this.$handleResponse(res, res => {
            this.listData = res.data;
            this.areaInfo = res.area;
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
    editFn(user_id) {
      // 编辑
      this.$router.push({
        path: this.pageType == 1 ? "/account/editGovernment" : "/account/editCompany",
        query: {
          companyId: this.searchInfo.companyId,
          manager_index: this.searchInfo.manager_index,
          userId: user_id,
          brea_name: this.$route.query.brea_name
        }
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
          this.doDelete(data.user_id);
        })
        .catch(() => {});
    },
    doDelete(id) {
      this.loading = true;
      let params = {
        user_id: id
      };
      Http.deleteAccountM(params)
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
    dialogSuccess() {
      // 新增或修改成功后关闭窗口
      this.dialog.show = false;
      this.getListData();
    }
  }
};
</script>
