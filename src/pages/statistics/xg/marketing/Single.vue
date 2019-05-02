<template>
  <div class="m20 marketing-single">
    <bread-crumb :dataIsArr="false" breadName="marktingSingle"></bread-crumb>
    <div class="common-section role-manage">
      <el-alert title type="warning" :closable="false" class="tips-bg">
        <div class="padding-5">统计数据于次日更新前一天的数据。</div>
      </el-alert>
      <el-row class="margin-top-20 margin-bottom-20 line">
        <el-col :span="20">
          <el-form :inline="true" size="small">
            <el-form-item label="统计维度">
              <el-select
                class="basic-width"
                v-model="filter.type"
                @visible-change="optionChange($event)"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in tOptionsType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label v-show="filter.type === 0">
              <select-tree
                :options="overviewOrgOptions"
                v-model="filter.orgSelected"
                type="filter.orgSelected"
                placeholder="请选择组织"
                v-on:tree-selected="treeSelect"
                ref="otree"
                :keys="initOrgSelected"
                v-if="overviewHashReset"
                init="true"
              />
            </el-form-item>

            <!-- <el-form-item label v-show="filter.type === 0">
              <select-tree
                width="200"
                :options="overviewLabelOptions"
                v-model="filter.labelSelected"
                type="filter.labelSelected"
                placeholder="请选择标签"
                v-on:tree-selected="treeSelect"
                ref="ltree"
                :keys="initLabelSelected"
                v-if="overviewHashReset"
                init="true"
              />
            </el-form-item> -->
            <el-form-item label v-show="filter.type === 0">
              <select-tree-orgin
                width="200"
                :options="overviewLabelOptions"
                v-model="filter.labelSelected"
                type="filter.labelSelected"
                placeholder="请选择标签"
                v-on:tree-selected="treeSelect"
                ref="ltree"
                :keys="initLabelSelected"
                v-if="overviewHashReset"
                init="true"
              />
            </el-form-item>

            <!-- 按单店 -->
            <el-form-item class="re-input-placeholder">
              <el-select
                class="basic-width"
                v-if="filter.type === 2"
                v-model="filter.store"
                filterable
                placeholder="请选择店"
              >
                <el-option
                  v-for="item in overviewOptionsStore"
                  :key="item.area_id"
                  :label="item.name"
                  :value="item.area_id"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="发送时间">
              <!-- <el-date-picker v-model="filter.start_date" type="month" placeholder="开始时间" value-format="yyyy-MM-DD">
            </el-date-picker>
            至
            <el-date-picker v-model="filter.end_date" type="month" placeholder="结束时间" value-format="yyyy-MM-DD">
              </el-date-picker>-->
              <el-date-picker
                class="picker-date"
                v-model="filter.date"
                type="daterange"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :default-time="['00:00:00', '23:59:59']"
              ></el-date-picker>
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
        <el-table-column label="4S店名称" prop="name"></el-table-column>
        <el-table-column label="发布总数">
          <template slot-scope="scope">
            <!-- <router-link :to="{ path: 'single/detail', query: { id: scope.row.id, name: scope.row.name}}"> -->
            <el-button
              type="text"
              size="mini"
              @click="goDetail(scope.row.id, scope.row.name)"
            >{{ scope.row.msg_count}}</el-button>
            <!-- </router-link> -->
          </template>
        </el-table-column>
        <el-table-column label="送达人数">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="goDetail(scope.row.id, scope.row.name)"
            >{{ scope.row.target_user}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="浏览量">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="goDetail(scope.row.id, scope.row.name)"
            >{{ scope.row.int_page_read_user}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="转发量">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="goDetail(scope.row.id, scope.row.name)"
            >{{ scope.row.share_user}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="收藏人数">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="goDetail(scope.row.id, scope.row.name)"
            >{{ scope.row.add_to_fav_user}}</el-button>
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
        layout="sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import * as Http from "@/api/statistics";
export default {
  data() {
    return {
      roleList: [],
      loading: false,
      page: {
        current: 1,
        size: 10,
        total: 0
      },
      configExport: {}, // 导出
      params: {},
      tOptionsType: [
        {
          // 趋势
          value: 0,
          label: "按组织"
        },
        {
          value: 2,
          label: "按单店"
        }
      ],
      filter: {
        type: 0, // 统计维度 0-集团 1-品牌 2-单店
        date_type: 0, // 统计时间类型 0-年 1-月 2-日
        year: new Date().getFullYear().toString(), // 选择的年份 （默认按最新1年的12个月统计）
        month: moment(new Date()).format("YYYY-MM"), // 选择的月份 （默认获取当前年月份）
        day: moment(new Date()).format("YYYY-MM-DD"), // 选择的日期 （默认获取当前年当前月份的日期）
        brand: "",
        store: "",
        clearCache: false,
        orgSelected: [],
        labelSelected: [],
        date: "",
        start_date: moment(new Date()).format("YYYY-MM-DD"),
        end_date: moment(new Date()).format("YYYY-MM-DD")
      },
      initOrgSelected: [],
      initLabelSelected: [],
      overviewHashReset: true,
      overviewOrgOptions: [],
      overviewLabelOptions: [],
      overviewOptionsStore: []
    };
  },
  created() {
    let catchParams = JSON.parse(sessionStorage.getItem("catchParams"));

    if (!catchParams) {
      this.getIndexOption();
    } else {
      this.orgOptions = JSON.parse(sessionStorage.getItem("orgOptions"));
      this.labelOptions = JSON.parse(sessionStorage.getItem("labelOptions"));
      this.overviewOrgOptions = JSON.parse(
        sessionStorage.getItem("overviewOrgOptions")
      );
      this.overviewLabelOptions = JSON.parse(
        sessionStorage.getItem("overviewLabelOptions")
      );
      this.overviewOptionsStore = JSON.parse(
        sessionStorage.getItem("overviewOptionsStore")
      );
      this.initOrgSelected = JSON.parse(
        sessionStorage.getItem("initOrgSelected")
      );
      this.filter.orgSelected = JSON.parse(
        sessionStorage.getItem("orgSelected")
      );
      this.initLabelSelected = JSON.parse(
        sessionStorage.getItem("initLabelSelected")
      );
      this.filter.labelSelected = JSON.parse(
        sessionStorage.getItem("labelSelected")
      );
      this.optionsData = JSON.parse(sessionStorage.getItem("optionsData"));
      this.filter = catchParams;
      this.getRoleData();
    }
  },
  methods: {
    getRoleData() {
      // 角色列表
      // let { title } = this.filter;
      /* this.params = {
        page: this.page.current,
        pageSize: this.page.size,
        title: title
      }; */
      this.forParams();
      if(this.filter.type === 2 && !this.params.area_id){
        this.$message.error("请选择店");
        return;
      }
      this.loading = true;
      Http.getSingleList(this.params)
        .then(res => {
          this.loading = false;
          this.$handleResponse(res, res => {
            this.roleList = res.list;
            this.page.total = res.page.total_page;
            sessionStorage.clear();
          });
        })
        .catch(err => {
          this.loading = false;
        });
      // 配置导出时
      this.configExportFn();
    },
    // 接口所需参数
    forParams() {
      let {
        type,
        date_type,
        year,
        month,
        day,
        brand,
        store,
        clearCache,
        orgSelected,
        labelSelected,
        start_date,
        end_date,
        date
      } = this.filter;
      console.log(this.filter);
      this.params = {
        page: this.page.current,
        pageSize: this.page.size,
        // 统计维度 0-集团 1-品牌 2-单店
        // stat_dimension: type,
        // 统计时间（2018或2018-10）tableType 为基础表时 需筛选年或月
        // date: (this.tableType !== 1 && this.activeName === 'contrast') ? month : (date_type === 0 ? year : (date_type === 1 ? month : day)),
        // 统计时间类型 0-年 1-月 2-日
        // stat_date_type: (this.tableType !== 1 && this.activeName === 'contrast') ? 1 : date_type,
        // 0-不导出 1-导出
        // is_report: 0,
        // 组织id（stat_dimension = 0时必填）
        // org_id: this.user_info && this.user_info.org_id,
        org_ids: type == 0 ? orgSelected : '',
        // 组织品牌门店id（stat_dimension=2时必填）
        area_id:  type == 2 ? store : '',
        // 是否清除缓存 0-否 1-是
        // clear_cache: clearCache ? 1 : 0,
        clear_cache: 1,
        // 标签id
        tag_ids: type == 0 ? labelSelected : '',
        start_date:
          date && date[0] && moment(date[0]).format("YYYY-MM-DD 00:00:00"),
        end_date:
          date && date[1] && moment(date[1]).format("YYYY-MM-DD 23:59:59")
      };
      if(type == 0){
        delete this.params.area_id;
      }
    },
    searchFn() {
      // 搜索
      this.page.current = 1;
      this.getRoleData();
    },
    resetFn() {
      // 清空
      // this.$refs.otree.labelModelNull();
      // this.$refs.ltree.labelModelNull();

      if (!this.overviewOrgOptions[0] || !this.overviewOrgOptions[0].length) {
        this.filter.orgSelected = [];
        this.filter.labelSelected = [];
        this.overviewOrgOptions = JSON.parse(JSON.stringify(this.orgOptions));
        this.overviewLabelOptions = JSON.parse(
          JSON.stringify(this.labelOptions)
        );
        this.overviewOptionsStore = JSON.parse(
          JSON.stringify(this.optionsData.area)
        );
      }

      this.filter = {
        type: 0,
        orgSelected: []
      };
      // this.orgOptions.forEach(element => {
      //   this.filter.orgSelected.push(element.org_id);
      // });
      // 初始化选中值
      this.initOrgSelected = [];
      this.orgOptions.forEach(element => {
        this.initOrgSelected.push(element.org_id);
        this.filter.orgSelected.push(element.org_id);
        element.childs.forEach(ele => {
          this.initOrgSelected.push(ele.org_id);
          this.filter.orgSelected.push(ele.org_id);
        });
      });
      this.initLabelSelected = [];
      this.filter.labelSelected = [];
      this.overviewHashReset = false;
      this.$nextTick(() => {
        this.overviewHashReset = true;
      });
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
        url: "/template/area-statistics",
        params: params,
        filename: "单店图文统计"
      };
    },
    getIndexOption() {
      // 获取搜索选项
      Http.getIndexOption()
        .then(res => {
          /* res = {
              "code": 200,
              "msg": "操作成功",
              "data": {
                  "label": [
                      {
                          "id": 1,
                          "label": "品牌",
                          "childs": [
                              {
                                  "id": 2,
                                  "label": "子标签-A",
                              }
                          ]
                      }
                  ],
                  "org": {
                      "org_id": "25",
                      "name": "大锤集团7",
                      "childs": [
                          {
                              "org_id": "26",
                              "name": "捶捶子集团",
                          }
                      ]
                  },
                  "area": [
                      {
                          "area_id": "5",
                          "name": "深圳金环怡投资有限公司"
                      }
                  ]
              }
          } */
          this.$handleResponse(res, res => {
            this.optionsData = res;
            this.orgOptions = [].concat(this.optionsData.org);
            this.labelOptions = this.optionsData.label;

            this.orgOptions = this.handleOrgOptionsInit(this.orgOptions); // 添加字段 disabled:false
            this.labelOptions = this.handleTreeData(this.labelOptions);

            this.labelOptions = JSON.parse(
              JSON.stringify(this.labelOptions).replace(/id/g, "org_id")
            ); // 字段名称修改 id => org_id
            this.labelOptions = JSON.parse(
              JSON.stringify(this.labelOptions).replace(/label/g, "name")
            );

            this.overviewOrgOptions = JSON.parse(
              JSON.stringify(this.orgOptions)
            );
            this.overviewLabelOptions = JSON.parse(
              JSON.stringify(this.labelOptions)
            );
            this.overviewOptionsStore = JSON.parse(
              JSON.stringify(this.optionsData.area)
            );

            this.getRoleData();
          });
        })
        .catch(error => {
          this.loading = false;
          console.log(error);
        });
    },
    treeSelect(somedata, type) {
      console.log(somedata, type);
      this[type.split(".")[0]][type.split(".")[1]] = somedata;
    },
    handleOrgOptionsInit(orgOptions) {
      // 组织下拉框初始化，一级被选中，二级被禁用
      this.initOrgSelected = [];
      orgOptions.forEach(element => {
        this.initOrgSelected.push(element.org_id);
        this.filter.orgSelected.push(element.org_id);
        this.$set(element, "disabled", false);
        if (element.childs && element.childs.length) {
          element.childs.forEach(child => {
            this.initOrgSelected.push(child.org_id);
            this.filter.orgSelected.push(child.org_id);
            this.$set(child, "disabled", true);
          });
        }
      });
      return orgOptions;
    },
    handleTreeData(array) {
      array.forEach(element => {
        this.$set(element, "disabled", false);
        if (element.childs && element.childs.length) {
          element.childs.forEach(child => {
            this.$set(child, "disabled", false);
          });
        }
      });
      return array;
    },
    goDetail(id, name) {
      this.$router.push({
        path: "single/detail",
        query: { id: id, name: name }
      });
      console.log(this.params);
      sessionStorage.setItem("catchParams", JSON.stringify(this.filter));
      sessionStorage.setItem("orgOptions", JSON.stringify(this.orgOptions));
      sessionStorage.setItem("labelOptions", JSON.stringify(this.labelOptions));
      sessionStorage.setItem(
        "overviewOrgOptions",
        JSON.stringify(this.overviewOrgOptions)
      );
      sessionStorage.setItem(
        "overviewLabelOptions",
        JSON.stringify(this.overviewLabelOptions)
      );
      sessionStorage.setItem(
        "overviewOptionsStore",
        JSON.stringify(this.overviewOptionsStore)
      );
      sessionStorage.setItem(
        "orgSelected",
        JSON.stringify(this.filter.orgSelected)
      );
      if (
        this.filter.orgSelected.indexOf(this.overviewOrgOptions[0].org_id) > -1
      ) {
        sessionStorage.setItem(
          "initOrgSelected",
          JSON.stringify(this.initOrgSelected)
        );
      } else {
        sessionStorage.setItem(
          "initOrgSelected",
          JSON.stringify(this.filter.orgSelected)
        );
      }
      // 标签缓存
      let labelSelect = [].concat(this.filter.labelSelected);
      this.overviewLabelOptions.forEach(element => {
        if(labelSelect.indexOf(element.org_id) > -1){
          element.childs.forEach(ele => {
            labelSelect.push(ele.org_id);
          })
        }
      })
      sessionStorage.setItem(
        "initLabelSelected",
        JSON.stringify(labelSelect)
      );
      sessionStorage.setItem(
        "labelSelected",
        JSON.stringify(this.filter.labelSelected)
      );

      sessionStorage.setItem("optionsData", JSON.stringify(this.optionsData));
    },
    optionChange(callback) {
      // 解决组织下拉框不隐藏的问题
      if (callback) {
        document.querySelector("#app").click();
      }
    }
  }
};
</script>

<style>
.el-date-editor.el-input,
.el-date-editor.picker-date.el-input__inner {
  width: 230px;
}
</style>
