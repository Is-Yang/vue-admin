<template>
  <div>
    <bread-crumb v-if="this.$route.meta.specialModule" :dataIsArr="true" isBack :initBread="customBread"></bread-crumb>

    <div :class="[{ 'minh768 common-section': this.$route.meta.specialModule }]">
      <el-row type="flex">
        <el-col :span="20">
          <el-form :inline="true" :model="searchInfo" size="small">
            <el-form-item v-if="tableType === 1" label="风险点名称：">
              <el-input v-model="searchInfo.keyword" placeholder="请输入风险点名称"></el-input>
            </el-form-item>
            <el-form-item v-else label="内容关键字：">
              <el-input v-model="searchInfo.keyword" placeholder="请输入搜索内容"></el-input>
            </el-form-item>
            <!-- <el-form-item v-if="tableType === 3" label="三级子项搜索">
              <el-select v-model="searchInfo.position_three_id" placeholder="请选择" filterable>
                <el-option v-for="item in positionThreeList" :key="item.position_three_id"
                  :label="item.position_three_name" :value="item.position_three_id">
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

        <el-col :span="4" class="text-right">
          <el-button v-if="tableType === 1" type="primary" size="small" @click="dialogShow('add', {}, 'big')">创建风险点</el-button>
          <el-button v-if="tableType === 2" type="primary" size="small" @click="dialogShow('add', {}, 'small')">创建二级子项</el-button>
          <el-button v-if="tableType === 3" type="primary" size="small" @click="dialogShow('add', {}, 'three')">创建三级子项</el-button>
        </el-col>
      </el-row>

      <el-table v-if="tableType === 1" v-loading="loading" border :data="listData" tooltip-effect="dark" ref="menuTable">
        <el-table-column prop="company_name" label="公司名称"></el-table-column>
        <el-table-column label="风险点" v-if="pointType == 1">
          <template slot-scope="scope">
            <router-link :to="{ path: '/classify/small', query: {positionId: scope.row.position_id, brea_name: scope.row.position_name}}" class="a-link">{{scope.row.position_name}}</router-link>
          </template>
        </el-table-column>
        <el-table-column label="风险点" v-if="pointType == 2">
          <template slot-scope="scope">
            <router-link :to="{ path: '/tasks/company', query: {companyId: scope.row.company_id, positionId: scope.row.position_id, brea_name: scope.row.position_name}}" class="a-link">{{scope.row.position_name}}</router-link>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250px" v-if="pointType == 1">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" plain icon="el-icon-edit" @click="dialogShow('edit', scope.row, 'big')"
              title="编辑"></el-button>
            <el-button size="mini" type="danger" plain icon="el-icon-delete" @click="deleteFn(scope.row.position_id, 'position_id')"
              title="删除"></el-button>
            <el-button size="mini" type="primary" @click="dialogQCode(scope.row)">二维码</el-button>
            <el-button v-if="userInfo.propity === 3" size="mini" type="success" plain icon="el-icon-download" @click="exportFn(scope.row)"
              title="导出"></el-button>  
          </template>
        </el-table-column>
      </el-table>

      <el-table v-if="tableType === 2" v-loading="loading" border :data="listData" tooltip-effect="dark" ref="menuTable">
        <!-- <el-table-column prop="position_name" label="一级编码"></el-table-column> -->
        <el-table-column label="二级子项" >
          <template slot-scope="scope">
            <router-link :to="{ path: '/classify/three', query: {detailId: scope.row.position_detail_id, brea_name: scope.row.position_detail_name}}" class="a-link">{{scope.row.position_detail_name}}</router-link>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="position_three_name" label="三级子项"></el-table-column> -->
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" plain icon="el-icon-edit" @click="dialogShow('edit', scope.row, 'small')"
              title="编辑"></el-button>
            <el-button size="mini" type="danger" plain icon="el-icon-delete" @click="deleteFn(scope.row.position_detail_id, 'position_detail_id')"
              title="删除"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-table v-if="tableType === 3" v-loading="loading" border :data="listData" tooltip-effect="dark" ref="menuTable">
        <el-table-column prop="position_three_name" label="三级子项"></el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" plain icon="el-icon-edit" @click="dialogShow('edit', scope.row, 'three')"
              title="编辑"></el-button>
            <el-button size="mini" type="danger" plain icon="el-icon-delete" @click="deleteFn(scope.row.position_three_id, 'position_three_id')"
              title="删除"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="page.current"
        :page-size="page.size" :total="page.total" :page-sizes="[10, 20, 50, 100, 200]"
        layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    </div>

    <!-- 新增与编辑 -->
    <classify-handle
      v-if="dialog.show"
      :type="dialog.type"
      :position="dialog.position"
      :classParent="dialog.classParent"
      @cancel="dialog.show = !dialog.show"
      @success="dialogSuccess">
    </classify-handle>

    <el-dialog
      title="二维码"
      :visible.sync="dialogVisible"
      width="300px">
        <div class="text-center">
          <vue-qr :text="qrVal" :margin="0" :size="180" :dotScale="1"></vue-qr>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import * as Http from "@/api/home";
import ClassifyHandle from './ClassifyHandle';
import * as userInfo from "@/utils/commonService/getUserInfo";
import VueQr from 'vue-qr'
export default {
  components: {
    ClassifyHandle,
    VueQr
  },
  inject: ["reload"],
  data() {
    return {
      loading: false,
      listData: [],
      tableType: 1,
      searchInfo: {},
      companyId: '',
      positionId: '',
      detailId: '',
      pointType: '',
      page: {
        current: 1,
        size: 10,
        total: 0
      },
      dialog: {
        show: false,
        type: "",
        classParent: {},
        position: ''
      },
      dialogVisible: false,
      qrVal: '',
      customBread: [],
      positionThreeList: [],
    };
  },
  created() {
    this.userInfo = userInfo.getUserInfo() && JSON.parse(userInfo.getUserInfo());

    const route = this.$route;
    this.companyId = route.query && route.query.companyId;
    this.positionId = route.query && route.query.positionId ;
    this.detailId = route.query && route.query.detailId;
    this.pointType = route.query && route.query.pointType;  // pointType = 1 -- 风险点创建 pointType = 2 -- 风险点任务创建

    // 根据当前路由，对应不同分类数据
    if (route.path === '/classify/big') {
        this.tableType = 1;
    } else if (route.path === '/classify/small') {
        this.tableType = 2;
    } else if (route.path === '/classify/three') {
        this.tableType = 3;
        this.getPositionThreeList(this.detailId);
    }

    this.customBread.push({
      'name': route.query && route.query.brea_name
    });

    this.getListData();
  },
  methods: {
    getPositionThreeList(position_detail_id) {
      Http.mGetThree(
        {
          page: 0,
          position_detail_id: position_detail_id
        }
      ).then(res => {
        this.$handleResponse(res, res => {
          if (res) {
            this.positionThreeList = res.data;
          }
        });
      }).catch(err => {});
    },
    // 导出
    exportFn(data) {
        this.loading = true;
        Http.exportWord(
            {
              position_id: data.position_id
            }
          ).then(res => {
            this.$handleResponse(res, res => {
              this.loading = false;
              let blob = new Blob([res], {type: "application/msword;charset=utf-8"});
              const a = document.createElement('a');
              let ext = 'doc';
              a.href = window.URL.createObjectURL(blob);
              a.download = `${data.position_name}.${ext}`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              
            });
          })
          .catch(err => {
            this.loading = false;
          });
    },
    getListData() {
      this.loading = true;
      let params = {
        page: this.page.current,
        key: this.searchInfo.keyword,
      }
      let queryDataName = this.tableType == 1 ? 'getMCompanyPostionList': 
                          this.tableType == 2 ? 'getMPosPostionDetailList' : 'mGetThree';
      this.tableType == 1 ? params.company_id = this.companyId : 
      this.tableType == 2 ?  params.position_id = this.positionId : params.position_detail_id = this.detailId;
      
      if (queryDataName) {
        Http[queryDataName](params)
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
      }
    },
    dialogShow(type, initData, position) {
      this.dialog.type = type;
      this.dialog.classParent = initData;
      this.dialog.position = position;
      this.dialog.show = true;
    },
    deleteFn(id, type) {
      // 删除
      this.$confirm("请确认是否继续删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.doDelete(id, type);
        })
        .catch(() => {});
    },
    doDelete(id, type) {
        this.loading = true;
        let queryDataName = this.tableType === 1 ? 'delPosition': 
                          this.tableType === 2 ? 'delPositionDetail' : 'deleteThree';
        if (queryDataName) {
            let params = {};
            params[type] = id;
            Http[queryDataName](params).then(res => {
                this.$handleResponse(res, res => {
                    this.$message.success("删除成功");
                    this.reload();
                });
            }).catch(error => {
                this.loading = false;
                this.$message.error("删除失败");
            });
        }
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
    },
    dialogQCode(val) {
      this.qrVal = String(val.position_id);
      this.dialogVisible = true;
    }
  }
};
</script>


