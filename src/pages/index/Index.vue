<template>
  <div v-loading="loading" class="homepage re-input-placeholder">
    <div class="app-main common-section sales-view">
      <div class="card-list" v-loading="overviewLoading">
        <div class="card-item" v-for="(item, index) in cardListData" :key="index" @click="goXgBasicAll()">
          <div class="item-content">
            <div class="cont-left">
              <div class="cont-left-number">{{item.number}}</div>
              <div class="cont-left-title">{{item.title}}</div>
            </div>
            <div class="cont-right">
              <img :src="item.icon" alt>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 销售数据趋势 -->
    <div class="app-main common-section  sales-trend">
      <div class="pos-rel line home-sesstion-search margin-bottom-20">
        <el-form :inline="true" label-width="110px" size="small">
          <el-form-item label="销售数据趋势">
            <el-select
              class="basic-width"
              v-model="trend.type"
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

          <el-form-item label v-show="trend.type === 0">
            <select-tree
              :options="trendOrgOptions"
              v-model="trend.orgSelected"
              type="trend.orgSelected"
              placeholder="请选择组织"
              v-on:tree-selected="treeSelect"
              ref="trendOtree"
              :keys="initOrgSelected"
              v-if="trendHashReset"
              init="true"
            />
          </el-form-item>
          <!-- <el-form-item label v-show="trend.type === 0">
            <select-tree
              width="200"
              :options="trendLabelOptions"
              v-model="trend.labelSelected"
              type="trend.labelSelected"
              placeholder="请选择标签"
              v-on:tree-selected="treeSelect"
              ref="trendLtree"
            />
          </el-form-item> -->
          <el-form-item label v-show="trend.type === 0">
            <select-tree-orgin
              width="200"
              :options="trendLabelOptions"
              v-model="trend.labelSelected"
              type="trend.labelSelected"
              placeholder="请选择标签"
              v-on:tree-selected="treeSelect"
              ref="trendLtree"
            />
          </el-form-item>

          <!-- 按单店 -->
          <el-form-item v-if="trend.type === 2">
            <el-select v-model="trend.store" filterable placeholder="请选择店" class="basic-width">
              <el-option
                v-for="item in trendOptionsStore"
                :key="item.area_id"
                :label="item.name"
                :value="item.area_id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label>
            <el-select v-model="trend.date_type" @visible-change="optionChange($event)" class="basic-width">
              <el-option
                v-for="item in tOptionsTime"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <!-- <el-form-item>
                <el-checkbox v-model="filter.clearCache">清除缓存</el-checkbox>
          </el-form-item>-->
          <el-form-item>
            <el-button
              type="primary"
              size="small"
              round
              icon="el-icon-search"
              class="m-l-28"
              @click="searchFn('trend', 'getIndexTrend')"
            >查询</el-button>
            <el-button
              plain
              size="small"
              round
              icon="el-icon-delete"
              @click="resetFn('trend', 'getIndexTrend')"
            >清空查询条件</el-button>
          </el-form-item>
        </el-form>

        <!-- <div class="question" @click="dialogShow()">
            <el-button type="info" size="mini" icon="fas fa-question" circle></el-button>
        </div>-->
      </div>
      <div class="trend-content">
        <div class="trend-nav">
          <el-radio-group v-model="trendRadio" size="small" @change="setChart">
            <el-radio-button
              :label="index"
              v-for="(item, index) in trendRadioOptions"
              :key="index"
            >{{item}}</el-radio-button>
          </el-radio-group>
        </div>
        <div class="trend-chart" v-loading="trendLoading">
          <!-- 我是{{trendRadioOptions[trendRadio]}}图表 -->
          <x-chart
            :id="id"
            :option="chartOptions"
            @click="parentMethod"
            ref="child1"
            v-if="showChart && isShowChart"
          ></x-chart>
          <div v-show="showNoChart" class="data-empty">
            暂无数据
          </div>
        </div>
      </div>
    </div>

    <!-- 4s店业绩排名 +  销售精英榜 -->
    <div class="ranking-list">
      <div class="app-main common-section ranking-item shop-ranking">
        <div class="pos-rel line margin-bottom-20 ranking-form">
          <div class="ranking-form-label">4s店业绩排名</div>
          <el-form :inline="true" label-width="110px" size="small" style="flex: 1;">
            <!-- <el-form-item label="4s店业绩排名" style="display: block; margin-bottom: 0px"></el-form-item> -->
            <el-form-item label v-show="ranking.type === 0">
              <select-tree
                :options="rankingOrgOptions"
                v-model="ranking.orgSelected"
                type="ranking.orgSelected"
                placeholder="请选择组织"
                v-on:tree-selected="treeSelect"
                ref="rankingOtree"
                :keys="initOrgSelected"
                v-if="rankingHashReset"
                init="true"
              />
            </el-form-item>
            <el-form-item label v-show="ranking.type === 0">
              <select-tree-orgin
                width="200"
                :options="rankingLabelOptions"
                v-model="ranking.labelSelected"
                type="ranking.labelSelected"
                placeholder="请选择标签"
                v-on:tree-selected="treeSelect"
                ref="rankingLtree"
              />
            </el-form-item>

            <el-form-item label>
              <el-select v-model="ranking.shop_type" @visible-change="optionChange($event)" class="basic-width">
                <el-option
                  v-for="item in shopOptionsType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label>
              <el-date-picker
                class="basic-width"
                v-model="ranking.month"
                type="month"
                placeholder="选择月"
                value-format="yyyy-MM"
              ></el-date-picker>
            </el-form-item>

            <!-- <el-form-item>
                  <el-checkbox v-model="ranking.clearCache">清除缓存</el-checkbox>
            </el-form-item>-->
            <el-form-item>
              <el-button
                type="primary"
                size="small"
                round
                icon="el-icon-search"
                class="m-l-28"
                @click="searchFn('ranking', 'getIndexRanking')"
              >查询</el-button>
              <el-button
                plain
                size="small"
                round
                icon="el-icon-delete"
                @click="resetFn('ranking', 'getIndexRanking')"
              >清空查询条件</el-button>
            </el-form-item>
          </el-form>

          <!-- <div class="question" @click="dialogShow()">
              <el-button type="info" size="small" icon="fas fa-question" circle></el-button>
          </div>-->
        </div>
        <el-table :data="shopTableData" v-loading="rankingLoading" stripe style>
          <el-table-column label="4S店">
            <template slot-scope="scope">
              <img :src="topIcon[scope.$index]" alt v-if="scope.$index <= 2" width="30px" height="34px">
              <span class="top-number" v-else>{{scope.$index + 1}}</span>
              <span style="margin-left: 10px">{{scope.row.area_name}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="order_total" label="订单数" width="180"></el-table-column>
          <el-table-column prop="success_order" label="交车数" width="180"></el-table-column>
        </el-table>
      </div>

      <div class="app-main common-section ranking-item sales-ranking">
        <div class="pos-rel line  margin-bottom-20 ranking-form">
          <div class="ranking-form-label">销售精英榜</div>
          <el-form :inline="true" label-width="110px" size="small" style="flex: 1;">
            <!-- <el-form-item label="销售精英榜" style="display: block; margin-bottom: 0px"></el-form-item> -->
            <el-form-item label>
              <el-select v-model="elite.type" placeholder="请选择" class="basic-width">
                <el-option
                  v-for="item in tOptionsType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label v-show="elite.type === 0">
              <select-tree
                :options="eliteOrgOptions"
                v-model="elite.orgSelected"
                type="elite.orgSelected"
                placeholder="请选择组织"
                v-on:tree-selected="treeSelect"
                ref="eliteOtree"
                :keys="initOrgSelected"
                v-if="eliteHashReset"
                init="true"
              />
            </el-form-item>
            
            <el-form-item label v-show="elite.type === 0">
              <select-tree-orgin
                width="200"
                :options="eliteLabelOptions"
                v-model="elite.labelSelected"
                type="elite.labelSelected"
                placeholder="请选择标签"
                v-on:tree-selected="treeSelect"
                ref="eliteLtree"
              />
            </el-form-item>

            <!-- 按单店 -->
            <el-form-item v-if="elite.type === 2">
              <el-select v-model="elite.store" filterable placeholder="请选择店" class="basic-width">
                <el-option
                  v-for="item in eliteOptionsStore"
                  :key="item.area_id"
                  :label="item.name"
                  :value="item.area_id"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label>
              <el-select v-model="elite.shop_type" @visible-change="optionChange($event)" class="basic-width">
                <el-option
                  v-for="item in shopOptionsType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label>
              <el-date-picker
                class="basic-width"
                v-model="elite.month"
                type="month"
                placeholder="选择月"
                value-format="yyyy-MM"
              ></el-date-picker>
            </el-form-item>

            <!-- <el-form-item>
                  <el-checkbox v-model="filter.clearCache">清除缓存</el-checkbox>
            </el-form-item>-->
            <el-form-item>
              <el-button
                type="primary"
                size="small"
                round
                icon="el-icon-search"
                class="m-l-28"
                @click="searchFn('elite', 'getIndexElite')"
              >查询</el-button>
              <el-button
                plain
                size="small"
                round
                icon="el-icon-delete"
                @click="resetFn('elite', 'getIndexElite')"
              >清空查询条件</el-button>
            </el-form-item>
          </el-form>

          <!-- <div class="question" @click="dialogShow()">
              <el-button type="info" size="mini" icon="fas fa-question" circle></el-button>
          </div>-->
        </div>
        <el-table :data="salesTableData" v-loading="eliteLoading" stripe style="width: 100%">
          <el-table-column label="4S店">
            <template slot-scope="scope">
              <img :src="topIcon[scope.$index]" alt v-if="scope.$index <= 2" width="30px" height="34px">
              <span class="top-number" v-else>{{scope.$index + 1}}</span>
              <span style="margin-left: 10px">{{scope.row.advisor_name}}
              <span v-if="scope.row.area_name">({{scope.row.area_name}})</span></span>
            </template>
          </el-table-column>
          <el-table-column prop="order_total" label="订单数" width="180"></el-table-column>
          <el-table-column prop="success_order" label="交车数" width="180"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import * as Http from "@/api/home";
import * as userInfo from "@/utils/commonService/getUserInfo";
// 导入chart组件
// import XChart from 'components/chart.vue'

export default {
  components: {
    // XChart
  },
  data() {
    // let option = options.bar
    return {
      id: "container",
      chartOptions: {},
      tableType: 1,
      loading: false,
      activeName: "trend", // tab默认选中
      filter: {
        type: 0, // 统计维度 0-集团 1-品牌 2-单店
        date_type: 1, // 统计时间类型 0-年 1-月 2-日
        year: new Date().getFullYear().toString(), // 选择的年份 （默认按最新1年的12个月统计）
        month: moment(new Date()).format("YYYY-MM"), // 选择的月份 （默认获取当前年月份）
        day: moment(new Date()).format("YYYY-MM-DD"), // 选择的日期 （默认获取当前年当前月份的日期）
        brand: "",
        store: "",
        clearCache: false,
        label: ""
      },
      optionsBrand: [], // 按品牌下拉框
      optionsStore: [], // 按单店下拉框
      optionsLabel: [], // 按标签下拉框
      optionsData: {}, // 搜索选项 label:标签 org:组织 area:单店
      tOptionsType: [
        {
          //
          value: 0,
          label: "按组织筛选"
        },
        {
          value: 2,
          label: "按单店筛选"
        }
      ],
      tOptionsTime: [
        {
          value: 1,
          label: "本月"
        },
        {
          // 时间下拉框
          value: 0,
          label: "本年"
        },
      ],
      cardListData: [
        {
          title: "低风险任务的数量",
          number: 0,
          icon: require("../../assets/images/market/card_01.png")
        },
        {
          title: "中等风险的任务数量",
          number: 0,
          icon: require("../../assets/images/market/card_02.png")
        },
        {
          title: "高风险的任务数量",
          number: 0,
          icon: require("../../assets/images/market/card_03.png")
        },
        {
          title: "新增试驾",
          number: 0,
          icon: require("../../assets/images/market/card_04.png")
        },
        {
          title: "严峻风险的任务数量",
          number: 0,
          icon: require("../../assets/images/market/card_05.png")
        },
        {
          title: "未管控任务数量",
          number: 0,
          icon: require("../../assets/images/market/card_06.png")
        },
        {
          title: "已管控任务数量",
          number: 0,
          icon: require("../../assets/images/market/card_07.png")
        }
      ],
      trendRadio: 0,
      trendRadioOptions: [
        "DCC客流",
        "客流",
        "建卡",
        "试驾",
        "跟进",
        "订单",
        "交车",
        "战败"
      ],
      shopFilter: {
        shop_type: 0
      },
      shopOptionsType: [
        {
          value: 0,
          label: "按订单数"
        },
        {
          value: 1,
          label: "按交车数"
        }
      ],
      tableData: [
        {
          name: "湖南省雷克萨斯旗舰店",
          order: "43434",
          car: "244"
        },
        {
          name: "湖南雷克萨斯旗舰店",
          order: "43434",
          car: "244"
        },
        {
          name: "湖南雷克萨斯旗舰店",
          order: "43434",
          car: "244"
        },
        {
          name: "湖南雷克萨斯旗舰店",
          order: "43434",
          car: "244"
        },
        {
          name: "湖南雷克萨斯旗舰店",
          order: "43434",
          car: "244"
        },
        {
          name: "湖南雷克萨斯旗舰店",
          order: "43434",
          car: "244"
        },
        {
          name: "湖南雷克萨斯旗舰店",
          order: "43434",
          car: "244"
        },
        {
          name: "湖南雷克萨斯旗舰店",
          order: "43434",
          car: "244"
        },
        {
          name: "湖南雷克萨斯旗舰店",
          order: "43434",
          car: "244"
        },
        {
          name: "湖南雷克萨斯旗舰店",
          order: "43434",
          car: "244"
        }
      ],
      shopTableData: [],
      salesTableData: [],
      topIcon: [
        require("../../assets/images/market/top_01.png"),
        require("../../assets/images/market/top_02.png"),
        require("../../assets/images/market/top_03.png")
      ],
      series: [
        {
          name: "DCC客流",
          data: []
        },
        {
          name: "客流",
          data: []
        },
        {
          name: "建卡",
          data: []
        },
        {
          name: "试驾",
          data: []
        },
        {
          name: "跟进",
          data: []
        },
        {
          name: "订单",
          data: []
        },
        {
          name: "交车",
          data: []
        },
        {
          name: "战败",
          data: []
        }
      ],
      // 默认选中值
      orgSelected: [],
      labelSelected: [],
      // 数据默认字段
      defaultProps: {
        // parent: 'parentId',   // 父级唯一标识
        value: "id", // 唯一标识
        label: "label", // 标签显示
        children: "childs" // 子级
      },
      orgProps: {
        value: "org_id", // 唯一标识
        label: "name", // 标签显示
        children: "childs" // 子级
      },
      labelProps: {
        value: "org_id", // 唯一标识
        label: "name", // 标签显示
        children: "childs" // 子级
      },
      // 数据列表
      orgOptions: [
        {
          org_id: 1,
          name: "中机集团",
          disabled: false,
          childs: [
            {
              org_id: 82,
              name: "测试1",
              childs: [],
              disabled: false
            },
            {
              org_id: 85,
              name: "测试2",
              childs: [],
              disabled: false
            },
            {
              org_id: 87,
              name: "测试3",
              childs: [],
              disabled: false
            }
          ]
        },
        {
          org_id: 2,
          name: "中机集团22",
          disabled: false,
          childs: [
            {
              org_id: 22,
              name: "测试122",
              childs: [],
              disabled: false
            },
            {
              org_id: 25,
              name: "测试222",
              childs: [],
              disabled: false
            },
            {
              org_id: 27,
              name: "测试322",
              childs: [],
              disabled: false
            }
          ]
        }
      ],
      labelOptions: [
        {
          org_id: 1,
          name: "中机集团",
          disabled: false,
          childs: [
            {
              org_id: 82,
              name: "测试1",
              childs: [],
              disabled: false
            },
            {
              org_id: 85,
              name: "测试2",
              childs: [],
              disabled: false
            }
          ]
        },
        {
          org_id: 2,
          name: "中机集团22",
          disabled: false,
          childs: [
            {
              org_id: 22,
              name: "测试122",
              childs: [],
              disabled: false
            },
            {
              org_id: 25,
              name: "测试222",
              childs: [],
              disabled: false
            },
            {
              org_id: 27,
              name: "测试322",
              childs: [],
              disabled: false
            }
          ]
        }
      ],
      categories: [
        "1月",
        "2月",
        "3月",
        "4月",
        "5月",
        "6月",
        "7月",
        "8月",
        "9月",
        "10月",
        "11月",
        "12月"
      ],
      showChart: false,
      showNoChart: false,
      initOrgSelected: [],
      initLabelSelected: [],

      overviewLoading: false,
      trendLoading: false,
      rankingLoading: false,
      eliteLoading: false,

      overviewHashReset: true,
      trendHashReset: true,
      rankingHashReset: true,
      eliteHashReset: true,

      overviewOrgOptions: [],
      overviewLabelOptions: [],
      overviewOptionsStore: [],
      trendOrgOptions: [],
      trendLabelOptions: [],
      trendOptionsStore: [],
      rankingOrgOptions: [],
      rankingLabelOptions: [],
      rankingOptionsStore: [],
      eliteOrgOptions: [],
      eliteLabelOptions: [],
      eliteOptionsStore: [],
      overview: {
        type: 0, // 统计维度 0-集团 1-品牌 2-单店
        date_type: 1, // 统计时间类型 0-年 1-月 2-日
        year: new Date().getFullYear().toString(), // 选择的年份 （默认按最新1年的12个月统计）
        month: moment(new Date()).format("YYYY-MM"), // 选择的月份 （默认获取当前年月份）
        day: moment(new Date()).format("YYYY-MM-DD"), // 选择的日期 （默认获取当前年当前月份的日期）
        brand: "",
        store: "",
        clearCache: false,
        label: "",
        orgSelected: [],
        labelSelected: [],
        shop_type: ""
      },
      trend: {
        type: 0, // 统计维度 0-集团 1-品牌 2-单店
        date_type: 1, // 统计时间类型 0-年 1-月 2-日
        year: new Date().getFullYear().toString(), // 选择的年份 （默认按最新1年的12个月统计）
        month: moment(new Date()).format("YYYY-MM"), // 选择的月份 （默认获取当前年月份）
        day: moment(new Date()).format("YYYY-MM-DD"), // 选择的日期 （默认获取当前年当前月份的日期）
        brand: "",
        store: "",
        clearCache: false,
        label: "",
        orgSelected: [],
        labelSelected: [],
        shop_type: ""
      },
      ranking: {
        type: 0, // 统计维度 0-集团 1-品牌 2-单店
        date_type: 0, // 统计时间类型 0-年 1-月 2-日
        year: new Date().getFullYear().toString(), // 选择的年份 （默认按最新1年的12个月统计）
        month: moment(new Date()).format("YYYY-MM"), // 选择的月份 （默认获取当前年月份）
        day: moment(new Date()).format("YYYY-MM-DD"), // 选择的日期 （默认获取当前年当前月份的日期）
        brand: "",
        store: "",
        clearCache: false,
        label: "",
        orgSelected: [],
        labelSelected: [],
        shop_type: 0
      },
      elite: {
        type: 0, // 统计维度 0-集团 1-品牌 2-单店
        date_type: 0, // 统计时间类型 0-年 1-月 2-日
        year: new Date().getFullYear().toString(), // 选择的年份 （默认按最新1年的12个月统计）
        month: moment(new Date()).format("YYYY-MM"), // 选择的月份 （默认获取当前年月份）
        day: moment(new Date()).format("YYYY-MM-DD"), // 选择的日期 （默认获取当前年当前月份的日期）
        brand: "",
        store: "",
        clearCache: false,
        label: "",
        orgSelected: [],
        labelSelected: [],
        shop_type: 0
      },
      menus: [],
      isShowChart: false
    };
  },
  created() {
    this.getIndexOption();
    this.initChart();

    setTimeout(() => {
    }, 1000);
  },
  mounted() {
    // 延迟渲染趋势图 避免切换时宽度未占满
    setTimeout(() => {
      this.isShowChart = true;
    }, 1000);
  },
  methods: {
    getIndexOption() {
      let user_info = userInfo.getUserInfo() && JSON.parse(userInfo.getUserInfo());
      this.loading = true;
      Http.getIndexOption({token: user_info.token})
        .then(res => {
          this.loading = false;
          this.$handleResponse(res, res => {
              this.cardListData[0].number = res.risk_low;
              this.cardListData[1].number = res.risk_normal;
              this.cardListData[2].number = res.risk_high;
              this.cardListData[3].number = res.risk_serious;
              this.cardListData[4].number = res.un_check;
              this.cardListData[5].number = res.has_check;
              // this.cardListData[6].number = res.defeated_total;
          });
        })
        .catch(error => {
          this.loading = false;
          console.log(error);
        });
    },
    handleOrgOptionsInit(orgOptions) {
      // 组织下拉框初始化，一级被选中，二级被禁用
      this.initOrgSelected = [];
      orgOptions.forEach(element => {
        this.initOrgSelected.push(element.org_id);
        this.overview.orgSelected.push(element.org_id);
        this.trend.orgSelected.push(element.org_id);
        this.ranking.orgSelected.push(element.org_id);
        this.elite.orgSelected.push(element.org_id);
        this.$set(element, "disabled", false);
        if (element.childs && element.childs.length) {
          element.childs.forEach(child => {
            this.initOrgSelected.push(child.org_id);
            // 一级选中时，二级的id也要传递给后台
            this.overview.orgSelected.push(child.org_id);
            this.trend.orgSelected.push(child.org_id);
            this.ranking.orgSelected.push(child.org_id);
            this.elite.orgSelected.push(child.org_id);
            this.$set(child, "disabled", true);
          });
        }
      });
      return orgOptions;
    },
    handleTreeData(array) {
      array.forEach(element => {
        this.$set(element, "disabled", false);
        this.$set(element, "checked", true);
        if (element.childs && element.childs.length) {
          element.childs.forEach(child => {
            this.$set(child, "disabled", false);
          });
        }
      });
      return array;
    },
    searchFn(ctype = "", typeName = "") {
      // this.$refs.tree.onCloseTree();//同时也可以调用子组件中的属性

      let date = "";
      if (ctype == "overview" || ctype == "trend") {
        if (this[ctype].date_type == 0) {
          date = new Date().getFullYear().toString();
        } else if (this[ctype].date_type == 1) {
          date = moment(new Date()).format("YYYY-MM");
        }
      } else {
        date = this[ctype].month;
      }

      let stat_date_type =
        ctype == "ranking" || ctype == "elite" ? 1 : this[ctype].date_type;

      let params = {
        stat_dimension: this[ctype].type,
        stat_date_type: stat_date_type,
        org_id: this[ctype].type == 0 ? this[ctype].orgSelected : "",
        label_id: this[ctype].type == 0 ? this[ctype].labelSelected : "",
        area_id: this[ctype].type == 2 ? this[ctype].store : "",
        clear_cache: this[ctype].clearCache ? 1 : 0,
        sort:
          ctype == "ranking" || ctype == "elite" ? this[ctype].shop_type : "",
        date: date
      };
      if (params.stat_dimension === 0 && params.org_id.length === 0) {
        this.$message.error("请选择组织");
        return;
      }
      if (params.stat_dimension === 2 && params.area_id === "") {
        this.$message.error("请选择店");
        return;
      }
      this.queryData(ctype, params, typeName);
    },
    queryData(ctype = "", params = {}, typeName = "") {
      // 查询数据
      if(!this.loading){
        if(ctype == 'overview'){
          this.overviewLoading = true;
        }else if(ctype == 'trend'){
          this.trendLoading = true;
        }else if(ctype == 'ranking'){
          this.rankingLoading = true;
        }else if(ctype == 'elite'){
          this.eliteLoading = true;
        }
      }
      
      Http[typeName](params)
        .then(res => {
          this.loading = false;
          this.overviewLoading = false;
          this.trendLoading = false;
          this.rankingLoading = false;
          this.eliteLoading = false;
          this.$handleResponse(res, res => {
            switch (ctype) {
              case "overview":
                if(res && res.length == 0){   // 后台接口报错处理
                  this.cardListData[0].number = 0;
                  this.cardListData[1].number = 0;
                  this.cardListData[2].number = 0;
                  this.cardListData[3].number = 0;
                  this.cardListData[4].number = 0;
                  this.cardListData[5].number = 0;
                  this.cardListData[6].number = 0;
                  return ;
                }
                this.cardListData[0].number = res.result.dcc_clue_total;
                this.cardListData[1].number = res.result.reception_total;
                this.cardListData[2].number = res.result.archive_total;
                this.cardListData[3].number = res.result.driving_total;
                this.cardListData[4].number = res.result.order_total;
                this.cardListData[5].number = res.result.success_order;
                this.cardListData[6].number = res.result.defeated_total;
                break;
              case "trend":
                this.series.forEach(ele => {
                  ele.data = [];
                });
                if(res && (res.length == 0 || res.result.length == 0)){
                  console.log('没有顾问')
                  this.showChart = false;
                  this.showNoChart = true;
                  return ;
                }
                this.showNoChart = false;
                res.result.forEach(element => {
                  this.series[0].data.push(
                    this.handleTrendData(element.dcc_clue_total)
                  );
                  this.series[1].data.push(
                    this.handleTrendData(element.reception_total)
                  );
                  this.series[2].data.push(
                    this.handleTrendData(element.archive_total)
                  );
                  this.series[3].data.push(
                    this.handleTrendData(element.driving_total)
                  );
                  this.series[4].data.push(
                    this.handleTrendData(element.sell_log_total)
                  );
                  this.series[5].data.push(
                    this.handleTrendData(element.order_total)
                  );
                  this.series[6].data.push(
                    this.handleTrendData(element.success_order)
                  );
                  this.series[7].data.push(
                    this.handleTrendData(element.defeated_total)
                  );
                });
                this.categories = [];
                for (var j = 0; j < res.header.length; j++) {
                  this.categories.push(res.header[j]);
                }
                this.initChart(this.trendRadio);
                this.parentMethod(this.trendRadio);
                break;
              case "ranking":
                this.shopTableData = res;
                break;
              case "elite":
                this.salesTableData = res;
                break;
              default:
                break;
            }
          },true);
        })
        .catch(error => {
          this.loading = false;
          this.overviewLoading = false;
          this.trendLoading = false;
          this.rankingLoading = false;
          this.eliteLoading = false;
          console.log(error);
        });

      // // 配置导出时
      // this.configExportFn();
    },
    handleTrendData(str) {
      // console.log(isNaN(Number(str)))
      return isNaN(Number(str)) ? 0 : Number(str);
    },
    resetFn(ctype = "", typeName = "") {
      if(ctype != 'overflow'){
        this.$refs[`${ctype}Otree`].labelModelNull();
        this.$refs[`${ctype}Ltree`].labelModelNull();
      }
      this[`${ctype}HashReset`] = false;
      this.$nextTick(() => {
        this[`${ctype}HashReset`] = true;
      });
      this[ctype] = {
        type: 0, // 统计维度 0-集团 1-品牌 2-单店
        date_type: 1, // 统计时间类型 0-年 1-月 2-日
        year: new Date().getFullYear().toString(), // 选择的年份 （默认按最新1年的12个月统计）
        month: moment(new Date()).format("YYYY-MM"), // 选择的月份 （默认获取当前年月份）
        day: moment(new Date()).format("YYYY-MM-DD"), // 选择的日期 （默认获取当前年当前月份的日期）
        brand: "",
        store: "",
        clearCache: false,
        label: "",
        orgSelected: [],
        labelSelected: [],
        shop_type: 0
      }
      this[ctype].orgSelected = [];
      this[ctype].labelSelected = [];
      let optOrgOptions = `${ctype}OrgOptions`;
      this[`${ctype}OrgOptions`] = JSON.parse(JSON.stringify(this.orgOptions));
      this[`${ctype}LabelOptions`] = JSON.parse(
        JSON.stringify(this.labelOptions)
      );
      this[`${ctype}OptionsStore`] = JSON.parse(
        JSON.stringify(this.optionsData.area)
      );
      // this.trendOrgOptions = JSON.parse(JSON.stringify(this.orgOptions));
      // this.trendLabelOptions = JSON.parse(JSON.stringify(this.labelOptions));
      // this.trendOptionsStore = JSON.parse(JSON.stringify(this.optionsData.area));
      let params = {
        stat_dimension: 1,
        stat_date_type: 1,
        // stat_date_type: ctype == "ranking" || ctype == "elite" ? 1 : 0,
        org_id: [],
        label_id: [],
        area_id: "",
        clear_cache: 0,
        sort: ctype == "ranking" || ctype == "elite" ? 0 : "",
        date: moment(new Date()).format("YYYY-MM"),
        // date:
        //   ctype == "ranking" || ctype == "elite"
        //     ? moment(new Date()).format("YYYY-MM")
        //     : new Date().getFullYear().toString()
      };
      this[`${ctype}`].orgSelected = [];
      this.orgOptions.forEach(element => {
        this[`${ctype}`].orgSelected.push(element.org_id);
        element.childs.forEach(ele => {
          this[`${ctype}`].orgSelected.push(ele.org_id);
        })
      });
      params.org_id = this[`${ctype}`].orgSelected;
      this.queryData(ctype, params, typeName);
    },
    initChart(index = 0) {
      this.showChart = false;
      this.chartOptions = {
        chart: {
          type: "area"
        },
        title: {
          text: this.trendRadioOptions[index] + "趋势",
          align: "left",
          x: 0,
          y: 25,
          style: {
            color: "#409EFF",
            fontSize: "14px"
          }
        },
        credits: {
          enabled: false
        },
        tooltip: {
          formatter: function() {
            return "<b>" + this.y + "</b>";
          }
        },
        subtitle: {
          text: null
        },
        xAxis: {
          crosshair: {
            width: 1,
            color: "#409eff33"
          },
          type: "category",
          categories: this.categories
        },
        yAxis: {
          title: {
            text: null
          }
        },
        legend: {
          align: "right",
          verticalAlign: "top",
          x: 0,
          y: -30
        },
        plotOptions: {
          area: {
            label: {
              connectorAllowed: false
            },
            fillColor: '#eff5fb',
            // fillColor: '#1494eb0d',
            fillOpacity: 0.05,
            // fillColor: {
            //   linearGradient: {
            //     x1: 0,
            //     y1: 0,
            //     x2: 0,
            //     y2: 1
            //   },
            //   stops: [
            //     [0, "#1494eb0d"], // #1494eb 0.05
            //     [1, "#1494eb0d"]
            //   ]
            // },
            // marker: {
            //   radius: 2
            // },
            // lineWidth: 1,
            // states: {
            //   hover: {
            //     lineWidth: 1
            //   }
            // },
            // threshold: null,
            events: {
              legendItemClick: function(event) {
                return false;
              }
            }
          }
        },
        series: [
          {
            // type: 'area',
            name: this.trendRadioOptions[index],
            data: this.series[index].data
          }
        ],
        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 500
              },
              chartOptions: {
                legend: {
                  layout: "horizontal",
                  align: "center",
                  verticalAlign: "bottom"
                }
              }
            }
          ]
        }
      };
      // this.chartOptions.xAxis[0].setCategories( this.categories, true)
      // for(var j=0;j<this.categories.length;j++){
      //     this.chartOptions.xAxis.categories.push(this.categories[j]);
      // }
      this.showChart = true;

      // console.log(this.chartOptions.xAxis.categories)
      // this.chartOptions.xAxis.categories.push(this.categories)
    },
    setChart(value) {
      this.parentMethod(value);
      // this.initChart(4);
    },
    parentMethod(index = 0) {
      let chartOptions = JSON.parse(JSON.stringify(this.series[index])); 
      //返回的是一个vue对象，所以可以直接调用其方法
      if (this.$refs.child1) {
        this.$refs.child1.childMethod(
          this.trendRadioOptions[index],
          chartOptions,
          this.categories
        );
      }
    },
    treeSelect(somedata, type) {
      this[type.split(".")[0]][type.split(".")[1]] = somedata;
    },
    treeSelectOrign(somedata, type) {
      this[type.split(".")[0]][type.split(".")[1]] = somedata;
    },
    optionChange(callback) {
      // 解决组织下拉框不隐藏的问题
      if (callback) {
        document.querySelector("#app").click();
      }
    },
    goXgBasicAll(){
      this.menus = JSON.parse(localStorage.getItem('catchMenus'))
      let key = "/xg";
      this.$eventHub.$emit('activeHeader', '/xg');    // 高亮当前菜单
      if (this.menus && this.menus.length) {
          for (let i = 0; i < this.menus.length; i++) {
            if (key == ('/' + this.menus[i].url)) {
              let child = this.menus[i].child && this.menus[i].child.length ? this.menus[i].child : []
              this.$eventHub.$emit('getNav', child, true); // 第三个参数true代表点击事件
              let para = JSON.stringify(this.overview)
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
                JSON.stringify(this.overview.orgSelected)
              );
              if (
                this.overview.orgSelected.indexOf(this.overviewOrgOptions[0].org_id) > -1
              ) {
                sessionStorage.setItem(
                  "initOrgSelected",
                  JSON.stringify(this.initOrgSelected)
                );
              } else {
                sessionStorage.setItem(
                  "initOrgSelected",
                  JSON.stringify(this.overview.orgSelected)
                );
              }
              // 标签缓存
              let labelSelect = [].concat(this.overview.labelSelected);
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
                JSON.stringify(this.overview.labelSelected)
              );

              sessionStorage.setItem("optionsData", JSON.stringify(this.optionsData));
              this.$router.push({path: "/xg/basic/all", query: {params: para}});   // 跳转到对应子菜单
              if(!child || !child.length){
                this.$store.dispatch('ShowSidebar', false);
              }else{
                this.$store.dispatch('ShowSidebar', true);
              }
              return;
            }
          }
        }
    }
  }
};
</script>

<style lang="scss">
.card-list {
  display: flex;
  justify-content: space-between;
  color: #fff;
  .card-item {
    width: 250px;
    height: 120px;
    border-radius: 4px;
    margin-left: 13px;
    cursor: pointer;
    &:hover {
      transition: transform 0.2s ease-in;
      transform: translateY(-10px);
    }
    .item-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 32px 20px 0px 30px;
      height: 100%;
      .cont-left {
        .cont-left-number {
          font-size: 36px;
        }
        .cont-left-title {
          font-size: 15px;
        }
      }
      .cont-right img {
        width: 60px;
      }
    }
    @media (max-width: 1680px) {
      .item-content {
        padding: 32px 10px 0px 10px;
      }
    }
    /* @media (max-width: 1440px) {
        .item-content{
          padding: 32px 10px 0px 10px;
        }
      } */
    @media (max-width: 1366px) {
      .item-content {
        padding: 32px 10px 0px 10px;
        .cont-left {
          .cont-left-number {
            font-size: 30px;
          }
          .cont-left-title {
            font-size: 14px;
          }
        }
        .cont-right img {
          width: 55px;
        }
      }
    }
    @media (max-width: 1280px) {
      .item-content {
        padding: 32px 10px 0px 10px;
        .cont-left {
          .cont-left-number {
            font-size: 30px;
          }
          .cont-left-title {
            font-size: 14px;
          }
        }
        .cont-right img {
          width: 50px;
        }
      }
    } /*<=1280的设备*/
    // @media (max-width: 1024px){
    //   .item-content{
    //     padding: 32px 10px 0px 10px;
    //     .cont-left{
    //       .cont-left-number{
    //         font-size: 28px;
    //       }
    //       .cont-left-title{
    //         font-size: 14px;
    //       }
    //     }
    //     .cont-right img{
    //       width: 50px;
    //     }
    //   }
    // } /*<=1024的设备*/
  }
  .card-item:nth-child(1) {
    margin-left: 0px;
    background-color: #5ab3e2;
  }
  .card-item:nth-child(2) {
    background-color: #6b92d8;
  }
  .card-item:nth-child(3) {
    background-color: #888ae1;
  }
  .card-item:nth-child(4) {
    background-color: #76cc7a;
  }
  .card-item:nth-child(5) {
    background-color: #4dc990;
  }
  .card-item:nth-child(6) {
    background-color: #36c3BB;
  }
  .card-item:nth-child(7) {
    background-color: #bf908d;
  }
}
.sales-trend {
  margin: 15px 20px;
  .trend-content {
    .trend-nav {
      .el-radio-button,
      .el-radio-button__inner {
        margin-right: 5px;
      }
      .el-radio-button--small .el-radio-button__inner {
        border-left: 1px solid #dcdfe6;
        border-radius: 4px;
      }
      .el-radio-button--small.is-active .el-radio-button__inner {
        border-left: 1px solid #409eff;
      }
    }
    .trend-chart {
      margin-top: 5px;
      width: 100%;
      height: 400px;
      // border: 1px dotted #dcdfe6;
      .data-empty{
        color: #909399;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
.ranking-list {
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
  overflow: hidden;
  .ranking-item {
    width: calc(50% - 30px);
    .el-table .cell {
      display: flex;
      align-items: center;
      img {
        display: inline-block;
      }
      .top-number {
        display: inline-block;
        width: 30px;
        text-align: center;
        font-size: 16px;
        font-weight: 700;
      }
    }
  }
  .ranking-form {
    display: flex;
  }
  .ranking-form-label {
    width: 110px;
    text-align: right;
    padding: 0 12px 0 0;
    font-size: 14px;
    color: #606266;
    line-height: 28px;
  }
  .shop-ranking {
    margin-right: 10px;
    margin-top: 0px;
  }
  .sales-ranking {
    margin-left: 10px;
    margin-top: 0px;
  }
}

.homepage {
  .sales-view{
    margin-bottom: 15px;
  }
  .home-sesstion-search{
    margin-top: 2px;
    height: 52px;
  }
  .common-section {
    box-shadow: none;
  }
}

.ranking-form /deep/.el-form-item--small .el-form-item__content{
  line-height: 11px;
}

</style>
