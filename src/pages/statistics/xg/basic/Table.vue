<template>
  <div class="basic-wrapper">
    <el-tabs v-model="activeName" type="card" @tab-click="handleTable"
      v-loading.fullscreen.lock="loading"
      element-loading-text="请稍后，正在获取统计数据，本系统每小时获取更新一次"
      element-loading-spinner="icon-loading">

      <el-tab-pane label="趋势表" name="trend"></el-tab-pane>
      <el-tab-pane label="对比表" name="contrast"></el-tab-pane>

      <div class="padding-5">
        <!-- 页面释义 -->
        <el-alert title="" type="warning" :closable="false" class="tips-bg">
          <div class="padding-5">
            <!-- 基础总表 -->
            <ul v-if="tableType === 1">
              <li>报表描述：
                <span v-if="activeName === 'trend'">显示汽车销冠在潜客管理过程中的基础数据，可对基础数据进行趋势分析；</span>
                <span v-if="activeName === 'contrast'">显示汽车销冠在潜客管理过程中的基础数据，可对基础数据的进行对比分析；</span>
              </li>
              <li>
                <div style="display: flex;">
                  <div>筛选统计维度：</div>
                  <div>
                    <div v-if="activeName === 'trend'">1、按组织筛选，支持选择当前账号所在组织及其下级组织的数据趋势，同时支持通过标签补充筛选。</div>
                    <div v-if="activeName === 'trend'">2、按单店筛选，支持选择单店的数据趋势。</div>                
                    <div v-if="activeName === 'contrast'">1、单店对比是指针对当前账号管理的单店的基础数据进行对比分析；</div>
                    <div v-if="activeName === 'contrast'">2、组织对比是指所在组织下级组织的基础数据对比分析，如无下级组织则显示所在组织的基础数据；</div>
                    <div v-if="activeName === 'contrast'">3、标签对比是指针对统计标签设置的主标签下子标签之间的基础数据对比分析</div>
                  </div>
                </div>
              </li>
              <li>筛选统计时间：
                <span v-if="activeName === 'trend'">选择“按年/按月”，可以年报/月报的方式显示某年/某月中的数据趋势；</span>
                <span v-if="activeName === 'contrast'">选择“按年/按月/按日”，可对某年/某月/某日的基础数据进行对比分析；</span>
              </li>
            </ul>
            <!-- 展厅部门 -->
            <ul v-if="tableType === 2">
              <li>报表描述：
                <span v-if="activeName === 'trend'">显示汽车销冠中所有展厅部门（统计账号角色为销售顾问）的基础数据汇总，可对展厅部门数据进行趋势分析；</span>
                <span v-if="activeName === 'contrast'">显示汽车销冠中所有展厅部门（统计账号角色为销售顾问）的基础数据汇总，可对展厅部门数据进行对比分析；</span>
              </li>
              <li>
                <div style="display: flex;">
                  <div>筛选统计维度：</div>
                  <div>
                    <div v-if="activeName === 'trend'">1、按组织筛选，支持选择当前账号所在组织及其下级组织的数据趋势，同时支持通过标签补充筛选。</div>
                    <div v-if="activeName === 'trend'">2、按单店筛选，支持选择单店的数据趋势。</div>                
                    <div v-if="activeName === 'contrast'">1、单店对比是指针对当前账号管理的单店的基础数据进行对比分析；</div>
                    <div v-if="activeName === 'contrast'">2、组织对比是指所在组织下级组织的基础数据对比分析，如无下级组织则显示所在组织的基础数据；</div>
                    <div v-if="activeName === 'contrast'">3、标签对比是指针对统计标签设置的主标签下子标签之间的基础数据对比分析</div>
                  </div>
                </div>
              </li>
              <li>筛选统计时间：
                <span v-if="activeName === 'trend'">以年报的方式显示某年中的数据趋势；</span>
                <span v-if="activeName === 'contrast'">按月统计，可对某月的展厅部门数据进行对比分析；</span>
              </li>
            </ul>
            <!-- DCC部门 -->
            <ul v-if="tableType === 3">
              <li>报表描述：
                <span v-if="activeName === 'trend'">显示汽车销冠中所有展厅部门（统计账号角色为DCC网销顾问/DCC邀约员）的基础数据汇总，可对DCC部门数据进行趋势分析；</span>
                <span v-if="activeName === 'contrast'">显示汽车销冠中所有展厅部门（统计账号角色为DCC网销顾问/DCC邀约员）的基础数据汇总，可对DCC部门数据进行对比分析；</span>
              </li>
              <li>
                <div style="display: flex;">
                  <div>筛选统计维度：</div>
                  <div>
                    <div v-if="activeName === 'trend'">1、按组织筛选，支持选择当前账号所在组织及其下级组织的数据趋势，同时支持通过标签补充筛选。</div>
                    <div v-if="activeName === 'trend'">2、按单店筛选，支持选择单店的数据趋势。</div>                
                    <div v-if="activeName === 'contrast'">1、单店对比是指针对当前账号管理的单店的基础数据进行对比分析；</div>
                    <div v-if="activeName === 'contrast'">2、组织对比是指所在组织下级组织的基础数据对比分析，如无下级组织则显示所在组织的基础数据；</div>
                    <div v-if="activeName === 'contrast'">3、标签对比是指针对统计标签设置的主标签下子标签之间的基础数据对比分析</div>
                  </div>
                </div>
              </li>
              <li>筛选统计时间：
                <span v-if="activeName === 'trend'">以年报的方式显示某年中的数据趋势；</span>
                <span v-if="activeName === 'contrast'">按月统计，可对某月的DCC部门数据进行对比分析；</span>
              </li>
            </ul>
          </div>
        </el-alert>

        <!-- 筛选 -->
        <div class="pos-rel line margin-top-20 margin-bottom-20">
          <el-form :inline="true" size="small">
            <el-form-item label="统计维度">
              <!-- 趋势表 -->
              <!-- <el-select v-if="activeName === 'trend'" v-model="filter.type" placeholder="请选择">
                <el-option v-for="item in tOptionsType" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select> -->

              <!-- 对比表 -->
              <!-- <el-select v-if="activeName === 'contrast'" v-model="filter.type" placeholder="请选择">
                <el-option v-for="item in cOptionsType" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select> -->

              <!-- 按品牌 -->
              <!-- <el-select v-if="filter.type === 1" v-model="filter.brand" filterable placeholder="请选择品牌">
                <el-option v-for="item in optionsBrand" :key="item.org_brand_id" :label="item.brand_name" :value="item.org_brand_id">
                </el-option>
              </el-select> -->

              <!-- 按单店 -->
              <!-- <el-select v-if="filter.type === 2" v-model="filter.store" filterable placeholder="请选择店">
                <el-option v-for="item in optionsStore" :key="item.area_id" :label="item.area_name" :value="item.area_id"></el-option>
              </el-select> -->
            <!-- </el-form-item> -->

            <!-- 趋势表 2019年2月27日10:42:41 -->
              <el-select v-model="filter.type" v-if="activeName === 'trend'" @visible-change="optionChange($event)" placeholder="请选择" class="basic-width">
                <el-option
                  v-for="item in tOptionsType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>

              <el-select v-model="filter.type" v-if="activeName === 'contrast'" placeholder="请选择" class="basic-width">
                <el-option
                  v-for="item in cOptionsType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>

            </el-form-item>

            <el-form-item label="" v-if="activeName === 'trend'" v-show="filter.type === 0">
              <select-tree :options="overviewOrgOptions" v-model="filter.orgSelected" type="filter.orgSelected" placeholder="请选择组织" v-on:tree-selected="treeSelect" ref="otree" :keys="initOrgSelected" v-if="overviewHashReset" init="true"/>
            </el-form-item>

            <!-- <el-form-item label="" v-if="activeName === 'trend'" v-show="filter.type === 0">
              <select-tree width="200" :options="overviewLabelOptions" v-model="filter.labelSelected" type="filter.labelSelected" placeholder="请选择标签" v-on:tree-selected="treeSelect" ref="ltree" :keys="initLabelSelected" v-if="overviewHashReset"  init="true"/>
            </el-form-item> -->
            <el-form-item label="" v-if="activeName === 'trend'" v-show="filter.type === 0">
              <select-tree-orgin width="200" :options="overviewLabelOptions" v-model="filter.labelSelected" type="filter.labelSelected" placeholder="请选择标签" v-on:tree-selected="treeSelect" ref="ltree" :keys="initLabelSelected" v-if="overviewHashReset"  init="true"/>
            </el-form-item>

            <!-- 按单店 -->
            <el-form-item class="re-input-placeholder">
              <el-select v-if="filter.type === 2 && activeName === 'trend'" v-model="filter.store" filterable placeholder="请选择店" class="basic-width">
                <el-option v-for="item in overviewOptionsStore" :key="item.area_id" :label="item.name" :value="item.area_id"></el-option>
              </el-select>
            </el-form-item>

            <!-- 对比表 标签对比 标签下拉框 -->
            <el-form-item class="re-input-placeholder">
              <el-select v-if="filter.type === 2 && activeName === 'contrast'" v-model="filter.store" filterable placeholder="请选择标签" class="basic-width">
                <el-option v-for="item in overviewLabelOptions" :key="item.org_id" :label="item.name" :value="item.org_id"></el-option>
              </el-select>
            </el-form-item>



            <el-form-item label="统计时间">
              <!-- 趋势表 -->
              <el-select v-if="tableType === 1 && activeName === 'trend'" v-model="filter.date_type" class="basic-width">
                <el-option v-for="item in tOptionsTime" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <!-- 对比表 -->
              <el-select v-if="tableType === 1 && activeName === 'contrast'" v-model="filter.date_type" class="basic-width">
                <el-option v-for="item in cOptionsTime" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <!-- 按年 -->
              <el-date-picker class="basic-width" v-if="(tableType === 1 && filter.date_type === 0) || (tableType !== 1 && activeName === 'trend')" v-model="filter.year" type="year" placeholder="选择年" value-format="yyyy">
              </el-date-picker>

              <!-- 按月 -->
              <el-date-picker class="basic-width" v-if="(tableType === 1 && filter.date_type === 1) || (tableType !== 1 && activeName === 'contrast')" v-model="filter.month" type="month" placeholder="选择月" value-format="yyyy-MM">
              </el-date-picker>

              <!-- 按日 -->
              <el-date-picker class="basic-width" v-if="(tableType === 1 && filter.date_type === 2)" v-model="filter.day" type="date" placeholder="选择日" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>

            <!-- <el-form-item>
                <el-checkbox v-model="filter.clearCache">清除缓存</el-checkbox>
            </el-form-item> -->

            <div></div>
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

          <div class="question" @click="dialogShow()">
            <el-button type="info" size="mini" icon="fas fa-question" circle></el-button>
          </div>
        </div>

        <!-- 导出 -->
        <TableExport v-if="showTable" :url="configExport.url" :params="configExport.params" :filename="configExport.filename" method="post"></TableExport>
        <div v-if="!showTable">
          <div class="el-table__empty-block">
            <span class="el-table__empty-text">暂无数据</span>
          </div>
        </div>
        <div class="pos-rel" v-if="showTable">
          <!-- 由于使用 el-table-column render-header 时 切换tab时，第二项tab页会不显示设置 所以手动均值定位 -->
          <div class="mean">
            <el-tooltip
              placement="top">
              <div slot="content">月均值 = 不包含当前月的月数据总和 / 当前月的月份数，<br />如当前月为11月，则均值计算为：前10月的总和/10</div>
              <i class="el-icon-question th-icon"></i>
            </el-tooltip>
          </div>

          <!-- 表展示 -->
          <el-table
            :data="tableType === 1 ? basicTable : (tableType === 2 ? exhibitionTable : dccTable)"
            :row-class-name="tableRowClassName"
            :span-method="objectSpanMethod"
            border
            max-height="900"
            size="small"
            class="tableWrapper">
            <template v-for="(col, index) in tableHead">
              <!-- 类型 -->
              <el-table-column v-if="index === 0" :key="index" :label="col" :prop="col" :rowspan="2" width="60" align="center" fixed>
                <template slot-scope="scope">
                  {{scope.row.type}}
                </template>
              </el-table-column>
              <!-- 统计数据 -->
              <el-table-column v-if="index === 1" :key="index" :label="col" :prop="col" width="170" fixed>
                <template slot-scope="scope">
                  <el-popover v-if="scope.row.explain"
                    placement="top-end"
                    width="200"
                    trigger="hover">
                    <p v-for="(ex, k) in scope.row.explain" :key="k" class="padding-5">{{ex}}</p>
                    <span slot="reference">{{scope.row.label}}</span>
                  </el-popover>
                  <span v-if="!scope.row.explain">{{scope.row.label}}</span>
                </template>
              </el-table-column>
              <!-- 月或天 -->
              <el-table-column v-if="index !== 0 && index !== 1 && index !== (tableHead.length - 2) && index !== (tableHead.length - 1)"
                :key="index" :label="col" :prop="col" align="center" :render-header="renderHeader">
                <template slot-scope="scope" v-if="tableBody.length > 0">
                  <span v-if="tableBody[index - 2] && tableBody[index - 2][scope.row.data]">{{tableBody[index - 2][scope.row.data]}}</span>
                </template>
              </el-table-column>
              <!-- 合计 与 均值 添加返回数据为空的判断-->
              <el-table-column v-if="(tableHead.length > 5) && (index === (tableHead.length - 2) || index === (tableHead.length - 1))"
                :key="index" :label="col" :prop="col" align="center" width="90" fixed="right">
                <template slot-scope="scope" v-if="tableBody.length > 0">
                  <span v-if="(tableBody[index - 2] && tableBody[index - 2][scope.row.data])
                    || (tableBody[index - 1] && tableBody[index - 1][scope.row.data])">
                    {{tableBody[index - 2][scope.row.data] || tableBody[index - 1][scope.row.data]}}
                  </span>
                </template>
              </el-table-column>
              <el-table-column v-if="(tableHead.length <= 5) && (index === (tableHead.length - 2) || index === (tableHead.length - 1))"
                :key="index" :label="col" :prop="col" align="center" fixed="right">
                <template slot-scope="scope" v-if="tableBody.length > 0">
                  <span v-if="(tableBody[index - 2] && tableBody[index - 2][scope.row.data])
                    || (tableBody[index - 1] && tableBody[index - 1][scope.row.data])">
                    {{tableBody[index - 2][scope.row.data] || tableBody[index - 1][scope.row.data]}}
                  </span>
                </template>
              </el-table-column>
            </template>
          </el-table>
        </div>
      </div>
    </el-tabs>

    <!-- 释义弹框 -->
    <Explain v-if="qusDialog.show" :type="tableType" @cancel="qusDialog.show = !qusDialog.show">
    </Explain>

    <!-- 包含4s店弹窗 -->
    <area-dialog
      v-if="dialog.menuShow"
      :id="dialog.org_id"
      :pname="dialog.pname"
      v-on:areas-change="listenToAreas"
      @cancel="dialog.menuShow = !dialog.menuShow"
      @success="dialogSuccess">
    </area-dialog>
  </div>
</template>

<script>
  import moment from "moment";
  import * as Http from '@/api/statistics';
  import * as userInfo from '@/utils/commonService/getUserInfo';
  import Explain from './Explain';
  import { setTimeout } from 'timers';
  import AreaDialog from './AreaDialog';
  export default {
    components: {
      Explain,
      AreaDialog
    },
    data() {
      return {
        tableType: 1,
        loading: false,
        activeName: 'trend', // tab默认选中
        filter: {
          type: 0, // 统计维度 0-集团 1-品牌 2-单店
          date_type: 0, // 统计时间类型 0-年 1-月 2-日
          year: new Date().getFullYear().toString(), // 选择的年份 （默认按最新1年的12个月统计）
          month: moment(new Date()).format('YYYY-MM'), // 选择的月份 （默认获取当前年月份）
          day: moment(new Date()).format('YYYY-MM-DD'), // 选择的日期 （默认获取当前年当前月份的日期）
          brand: '',
          store: '',
          clearCache: false,
          orgSelected: [],
          labelSelected: []
        },
        configExport: {}, // 导出
        // 统计维度类型下拉框
        tOptionsType: [{ // 趋势
          value: 0,
          label: '按组织'
        }, {
          value: 2,
          label: '按单店'
        }],
        cOptionsType: [{ // 对比(对比表时没有按店选择)
          value: 0,
          label: '单店对比'
        }, {
          value: 1,
          label: '组织对比'
        }, {
          value: 2,
          label: '标签对比'
        }],
        optionsBrand: [], // 按品牌下拉框
        optionsStore: [], // 按单店下拉框
        tOptionsTime: [{ // 趋势表-时间下拉框
          value: 0,
          label: '按年'
        }, {
          value: 1,
          label: '按月'
        }],
        cOptionsTime: [{ // 对比表-时间下拉框
          value: 0,
          label: '按年'
        }, {
          value: 1,
          label: '按月'
        }, {
          value: 2,
          label: '按日'
        }],
        tableBody: [],
        tableHead: [],
        headerIds: {},
        allStore: [], // 所有店
        // 基础统计总表
        basicTable: [
          {
              type: '客流',
              label: '客流总数',
              data: 'reception_total',
              level: 1,
              explain: ['【字段解释】根据展厅的客流量，通过汽车销冠创建的客流总数；', '【计算规则】客流总数=首次到店客流总数+二次到店客流总数+非意向客流总数+未完善客流总数']
          },
          {
              type: '客流',
              label: '首次到店客流总数',
              data: 'first_shop_total',
              level: 2,
              explain: ['【字段解释】客流类型为首次到店看车的客流数，可细分为三类：首次到店并留档、已建卡首次到店、看车未留档；', '【计算规则】首次到店客流总数=首次到店并留档+已建卡首次到店+看车未留档']
          },
          {
              type: '客流',
              label: '首次到店并留档',
              data: 'no_archive',
              explain: ['【字段解释】客流类型为首次到店看车并留档的客流数，此数据也代表展厅客流的建卡数；']
          },
          {
              type: '客流',
              label: '已建卡首次到店',
              data: 'has_archive',
              explain: ['【字段解释】客流类型为已经建卡但属于首次到店的客流数，此类客户一般是：DCC首次邀约到店的客户，车展已建卡首次邀约到店的客户等；']
          },
          {
              type: '客流',
              label: '看车未留档',
              data: 'not_filing',
              explain: ['【字段解释】客流类型为意向潜客到店看车但并未留档的客流数；']
          },
          {
              type: '客流',
              label: '二次到店客流总数',
              data: 'more_shop_total',
              explain: ['【字段解释】客流类型为已经建卡并再次到店看车的客流数，此类客户一般是：再次邀约到店看车的客户；'],
              level: 2,
              explain: ['【字段解释】客流类型为已经建卡并再次到店看车的客流数，此类客户一般是：再次邀约到店看车的客户；']
          },
          {
              type: '客流',
              label: '非意向客流总数',
              data: 'no_intention_total',
              level: 2,
              explain: ['【字段解释】客流类型为非意向的客流数，可细分为五类：办理手续，办理交车，办理退订，维修保养，其他；']
          },
          {
              type: '客流',
              label: '未完善客流总数',
              data: 'faultiness',
              level: 2,
              explain: ['【字段解释】创建了展厅客流信息，但顾问未对客流信息进行完善的客流数量；']
          },
          {
              type: '客流',
              label: '客流留档率',
              data: 'add_archive_rate',
              explain: ['【字段解释】客流中意向潜客的留档比率；',
                '【计算规则】客流留档率=首次到店并留档/(首次到店并留档+看车未留档)'
              ],
              level: 3
          }, {
              type: '线索',
              label: 'dcc线索总数',
              data: 'dcc_clue_total',
              level: 1,
              explain: ['【字段解释】线索管理模块通过人工导入下发及系统自动下发的DCC线索总数，仅包含导入成功（号码去重）且分配过顾问的线索；线索总数可根据处理状态可细分为：有效建卡、非意向、已有档案、待跟进；',
                '【计算规则】DCC线索总数=有效建卡+非意向+已有档案+待跟进'
              ]
          },
          {
              type: '线索',
              label: '有效建卡',
              data: 'valid_clue',
              explain: ['【字段解释】通过汽车销冠APP线索池进行DCC线索跟进后，确认线索有效且有效建卡的线索数，此数据也代表DCC线索建卡数；']
          },
          {
              type: '线索',
              label: '非意向',
              data: 'no_intention_clue',
              explain: ['【字段解释】通过汽车销冠APP线索池进行DCC线索跟进后，确认线索无效且标记成非意向的线索数，非意向类型可细分为：空错号、多次无人接听、无购车意向、已购本品、已购竞品、省外客户、本省其他地区客户、其他；']
          },
          {
              type: '线索',
              label: '已有档案',
              data: 'has_archive_clue',
              explain: [`【字段解释】DCC线索导入或下发到线索池后，顾问未对线索进行有效建卡或标记非意向，通过其他非线索池渠道（展厅客流建卡等）对该线索进行了建卡操作，则该线索标记成已有档案；
                      已有档案统计不包含：导入线索时已经有档案存在而被去重且无法的线索数；`]
          },
          {
              type: '线索',
              label: '待跟进',
              data: 'todo_clue',
              explain: ['【字段解释】已经分配给顾问但还未进行跟进处理的线索数；']
          },
          {
              type: '线索',
              label: 'DCC线索建卡率',
              data: 'clue_archive_rate',
              level: 3,
              explain: ['【字段解释】DCC线索跟进处理后，有效建卡的线索的占比，计算时不包含待跟进的线索数；',
                '【计算规则】DCC线索建卡率=有效建卡/（有效建卡+非意向+已有档案）*100%'
              ]
          }, {
              type: '建卡',
              label: '建卡总数',
              data: 'archive_total',
              level: 1,
              explain: ['【字段解释】通过汽车销冠建卡的潜客总数；跟进建卡渠道可细分为：展厅客流建卡、DCC线索建卡、其他建卡；',
                '【计算规则】建卡总数=展厅客流建卡+DCC线索建卡+其他建卡'
              ]
          },
          {
              type: '建卡',
              label: '展厅客流建卡',
              data: 'reception_archive',
              explain: ['【字段解释】完善展厅客流时，同步进行了建卡操作的潜客总数，等于客流统计中的“首次到店并留档”数；']
          },
          {
              type: '建卡',
              label: 'dcc线索建卡',
              data: 'dcc_archive',
              explain: ['【字段解释】处理线索池DCC线索时，进行了建卡操作的潜客总数，等于线索统计中的“有效建卡”数；']
          },
          {
              type: '建卡',
              label: '其他建卡',
              data: 'other_archive',
              explain: ['【字段解释】通过APP首页“+”号直接建档（无客流信息的车展客户、外拓客户等），或通过后台潜客管理直接导入（系统初次启用导入之前系统的潜客）的潜客数；']
          }, {
              type: '试驾',
              label: '试驾总数',
              data: 'driving_total',
              level: 1,
              explain: ['【字段解释】通过汽车销冠进行了试驾登记的试驾总数，包含智能试驾及普通试驾；',
                '【计算规则】试驾总数=智能试驾+普通试驾']
          },
          {
              type: '试驾',
              label: '智能试驾',
              data: 'smart_driving',
              explain: ['【字段解释】通过汽车销冠进行了智能试驾登记的试驾数，智能试驾需完成：扫描驾照、签署电子试驾协议等操作；']
          },
          {
              type: '试驾',
              label: '普通试驾',
              data: 'general_driving',
              explain: ['【字段解释】通过汽车销冠进行了普通试驾登记的试驾数，普通试驾只需要在补充客流信息时选择事件“试驾”，无需扫描驾照及签署电子试驾协议等操作；']
          },
          {
              type: '试驾',
              label: '到店客户试驾率',
              data: 'shop_driving_rate',
              explain: [
              '【字段解释】计算客流列表中，所有到店看车潜客的试驾率；',
              '【计算规则】到店客户试驾率=试驾总数/（首次到店并留档+已建卡首次到店+再次到店客流总数）'
              ],
              level: 3
          }, {
              type: '试驾',
              label: '到店客户智能试驾率',
              data: 'smart_driving_rate',
              explain: [
              '【字段解释】计算客流列表中，所有到店看车潜客的智能试驾率；',
              '【计算规则】到店客户智能试驾率=智能试驾/（首次到店并留档+已建卡首次到店+再次到店客流总数）'
              ],
              level: 3
          },{
              type: '跟进',
              label: '跟进总数',
              data: 'sell_log_total',
              level: 1,
              explain: [
              '【字段解释】通过汽车销冠进行了跟进总数，跟进方式包含：智能通话、普通电话、其他跟进；',
              '【计算规则】跟进总数=智能通话+普通电话+其他跟进'],
          },
          {
              type: '跟进',
              label: '智能通话',
              data: 'smart_phone',
              explain: [
              '【字段解释】通过汽车销冠的智能通话（通话录音及通话时长）功能进行的跟进数；']
          },
          {
              type: '跟进',
              label: '普通电话',
              data: 'phone',
              explain: ['【字段解释】通过汽车销冠的普通电话（电话标签及通话时长）功能进行的跟进数；']
          },
          {
              type: '跟进',
              label: '其他跟进',
              data: 'other_log',
              explain: ['【字段解释】未通过汽车销冠进行智能电话或不同电话呼出，直接添加跟进记录的跟进数；']
          }, {
              type: '邀约',
              label: '邀约到店总数',
              data: 'invite_total',
              level: 1,
              explain: ['【字段解释】代表所有已建卡客户首次邀约到店或再次邀约到店的总次数，对应客流列表中的客流类型为：已建卡首次到店客流、再次到店客流；',
                '【计算规则】邀约到店总数=已建卡首次到店客流+再次到店客流=已登记邀约到店+未登记邀约到店']
          },
          {
              type: '邀约',
              label: '已登记邀约到店',
              data: 'register_invite',
              explain: ['【字段解释】若该客户邀约到店前，顾问通过汽车销冠对该客户添加了“邀约”事件及计划，且客户按计划到店，则该客户判断为已登记邀约到店；']
          },
          {
              type: '邀约',
              label: '未登记邀约到店',
              data: 'other_invite',
              explain: [
              '【字段解释】若该客户邀约到店前，顾问未通过汽车销冠对该客户添加了“邀约”事件及计划，或客户未按计划到店，则该客户判断为未登记邀约到店；'
              ]
          },
          {
              type: '邀约',
              label: '邀约到店客户占比',
              data: 'invite_rate',
              level: 3,
              explain: ['【字段解释】到店看车潜客中，邀约到店的客户所占比例；',
                '【计算规则】邀约到店客户占比=邀约到店总数/（首次到店客流总数+再次到店客流总数）']
          }, {
              type: '成交',
              label: '总订单数',
              data: 'order_total',
              level: 1,
              explain: ['【字段解释】通过汽车销冠进行下订操作的订单总数，包含：首次到店并留档下订、已建卡首次到店下订、再次到店下订、其他下订；',
                '【计算规则】总订单数=首次到店并留档下订+已建卡首次到店下订+再次到店下订+其他下订']
          },
          {
              type: '成交',
              label: '首次到店并留档下订',
              data: 'first_order',
              explain: ['【字段解释】客流类型为首次到店看车并留档，且进行下订操作的订单数；']
          },
          {
              type: '成交',
              label: '已建卡首到店下订',
              data: 'has_archive_order',
              explain: ['【字段解释】客流类型为已建卡首次到店，且进行下订操作的订单数；']
          },
          {
              type: '成交',
              label: '再次到店下订',
              data: 'more_shop_order',
              explain: ['【字段解释】客流类型为再次到店，且进行下订操作的订单数；']
          },
          {
              type: '成交',
              label: '其他下订',
              data: 'other_order',
              explain: ['【字段解释】直接通过添加跟进记录进行下订的订单数，该订单不是在补充客流时同步进行的下订操作；']
          },
          {
              type: '成交',
              label: '交车数',
              data: 'success_order',
              explain: ['【字段解释】通过汽车销冠进行交车操作的交车总数；']
          },
          {
              type: '成交',
              label: '退订数',
              data: 'cancel_order',
              explain: ['【字段解释】通过汽车销冠进行取消订单操作的退订总数；']
          },
          {
              type: '成交',
              label: '首次到店并留档成交率',
              data: 'first_order_rate',
              explain: [
              '【字段解释】客流类型为首次到店看车并留档客户的到店成交率；',
              '【计算规则】首次到店并留档成交率=首次到店并留档下订数/首次到店并留档客流数'
              ],
              level: 3
          },
          {
              type: '成交',
              label: '已建卡首次到店成交率',
              data: 'has_archive_order_rate',
              explain: ['【字段解释】客流类型为已建卡首次到店客户的到店成交率；',
              '【计算规则】已建卡首次到店成交率=已建卡首次到店下订数/已建卡首次到店客流数'],
              level: 3
          },
          {
              type: '成交',
              label: '再次到店成交率',
              data: 'more_shop_order_rate',
              explain: ['【字段解释】客流类型为再次到店客户的到店成交率；',
              '【计算规则】再次到店成交率=再次到店下订数/再次到店客流数'],
              level: 3

          }, {
              type: '战败',
              label: '申请战败总数',
              data: 'defeated_total',
              level: 1,
              explain: ['【字段解释】通过汽车销冠进行申请战败的申请总数，战败申请的处理状态可分为：已同意战败、已拒绝战败、未处理战败；',
              '【计算规则】申请战败总数=已同意战败+已拒绝战败+未处理战败'],
          },{
              type: '战败',
              label: '已同意战败',
              data: 'defeated_agree',
              explain: ['【字段解释】汽车销冠的战败申请中，已进行同意战败操作的申请数；']
          },{
              type: '战败',
              label: '已拒绝战败',
              data: 'defeated_reject',
              explain: ['【字段解释】汽车销冠的战败申请中，已进行不同意战败操作的申请数；']
          },{
              type: '战败',
              label: '未处理战败',
              data: 'defeated_todo',
              explain: ['【字段解释】汽车销冠的战败申请中，还未进行战败审核的申请数；']
          },{
              type: '战败',
              label: '战败审核拒绝率',
              data: 'defeated_reject_rate',
              level: 3,
              explain: ['【字段解释】申请战败总数中，审核中进行了不同意战败操作申请数的所占比例；', '【计算规则】战败审核拒绝率=已拒绝战败/申请战败总数']
          }
        ],
        // 展厅部门统计表
        exhibitionTable: [
          {
              type: '客流',
              label: '客流总数',
              data: 'reception_total',
              level: 1,
              explain: ['【字段解释】根据展厅的客流量，通过汽车销冠创建的客流总数；',
              '【计算规则】客流总数=首次到店客流总数+二次到店客流总数+非意向客流总数+未完善客流总数']
          },
          {
              type: '客流',
              label: '首次到店客流总数',
              data: 'first_shop_total',
              level: 2,
              explain: ['【字段解释】客流类型为首次到店看车的客流数，可细分为三类：首次到店并留档、已建卡首次到店、看车未留档；',
              '【计算规则】首次到店客流总数=首次到店并留档+已建卡首次到店+看车未留档']
          },
          {
              type: '客流',
              label: '首次到店并留档',
              data: 'no_archive',
              explain: ['【字段解释】客流类型为首次到店看车并留档的客流数，此数据也代表展厅客流的建卡数；']
          },
          {
              type: '客流',
              label: '已建卡首次到店',
              data: 'has_archive',
              explain: ['【字段解释】客流类型为已经建卡但属于首次到店的客流数，此类客户一般是：DCC首次邀约到店的客户，车展已建卡首次邀约到店的客户等；']
          },
          {
              type: '客流',
              label: '看车未留档',
              data: 'not_filing',
              explain: ['【字段解释】客流类型为意向潜客到店看车但并未留档的客流数；']
          },
          {
              type: '客流',
              label: '再次到店客流总数',
              data: 'more_shop_total',
              explain: ['【字段解释】客流类型为已经建卡并再次到店看车的客流数，此类客户一般是：再次邀约到店看车的客户；'],
              level: 2
          },
          {
              type: '客流',
              label: '非意向客流总数',
              data: 'no_intention_total',
              level: 2,
              explain: ['【字段解释】客流类型为非意向的客流数，可细分为五类：办理手续，办理交车，办理退订，维修保养，其他；'],
          },
          {
              type: '客流',
              label: '未完善客流总数',
              data: 'faultiness_total',
              level: 2,
              explain: ['【字段解释】创建了展厅客流信息，但顾问未对客流信息进行完善的客流数量；'],
          },
          {
              type: '客流',
              label: '客流留档率',
              data: 'add_archive_rate',
              explain: ['【字段解释】客流中意向潜客的留档比率；',
              '【计算规则】客流留档率=首次到店并留档/(首次到店并留档+看车未留档)'
              ],
              level: 3
          }, {
              type: '建卡',
              label: '建卡总数',
              data: 'archive_total',
              level: 1,
              explain: ['【字段解释】通过汽车销冠建卡的潜客总数；跟进建卡渠道可细分为：展厅客流建卡、其他建卡；',
              '【计算规则】建卡总数=展厅客流建卡+其他建卡'
              ],
          },
          {
              type: '建卡',
              label: '展厅客流建卡',
              data: 'reception_archive',
              explain: ['【字段解释】完善展厅客流时，同步进行了建卡操作的潜客总数，等于客流统计中的“首次到店并留档”数；'],
          },
          {
              type: '建卡',
              label: '其他建卡',
              data: 'other_archive',
              explain: ['【字段解释】通过APP首页“+”号直接建档（无客流信息的车展客户、外拓客户等），或通过后台潜客管理直接导入（系统初次启用导入之前系统的潜客）的潜客数；'],
          },
          {
              type: '建卡',
              label: '本月初遗留潜客',
              data: 'month_customer',
              explain: ['【字段解释】本月月初1号凌晨0点，遗留未成交的潜客数，包含：H级、A级、B级、C级，本数据月初统计一次，之后不会再变更；']
          }, {
              type: '试驾',
              label: '试驾总数',
              data: 'driving_total',
              level: 1,
              explain: ['【字段解释】通过汽车销冠进行了试驾登记的试驾总数，包含智能试驾及普通试驾；',
              '【计算规则】试驾总数=智能试驾+普通试驾']
          },
          {
              type: '试驾',
              label: '智能试驾',
              data: 'smart_driving',
              explain: ['【字段解释】通过汽车销冠进行了智能试驾登记的试驾数，智能试驾需完成：扫描驾照、签署电子试驾协议等操作；']
          },
          {
              type: '试驾',
              label: '普通试驾',
              data: 'general_driving',
              explain: ['【字段解释】通过汽车销冠进行了普通试驾登记的试驾数，普通试驾只需要在补充客流信息时选择事件“试驾”，无需扫描驾照及签署电子试驾协议等操作；']
          },
          {
              type: '试驾',
              label: '到店智能试驾率',
              data: 'shop_driving_rate',
              explain: [
              '【字段解释】计算客流列表中，所有到店看车潜客的智能试驾率；',
              '【计算规则】到店客户智能试驾率=智能试驾/（首次到店并留档+已建卡首次到店+再次到店客流总数）'
              ],
              level: 3
          },
          {
              type: '试驾',
              label: '到店客户试驾率',
              data: 'smart_driving_rate',
              explain: [
              '【字段解释】计算客流列表中，所有到店看车潜客的试驾率；',
              '【计算规则】到店客户试驾率=试驾总数/（首次到店并留档+已建卡首次到店+再次到店客流总数）'
              ],
              level: 3
          }, {
              type: '邀约',
              label: '邀约到店总数',
              data: 'invite_total',
              level: 1,
              explain: [
              '【字段解释】代表所有已建卡客户首次邀约到店或再次邀约到店的总次数，对应客流列表中的客流类型为：已建卡首次到店客流、再次到店客流；',
              '【计算规则】邀约到店总数=已建卡首次到店客流+再次到店客流'
              ]
          },
          {
              type: '邀约',
              label: '邀约到店率',
              data: 'invite_shop_rate',
              level: 3,
              explain: [
              '【字段解释】已留档潜客邀约到店的比率；',
              '【计算规则】邀约到店率=邀约到店总数/（本月建卡总数+本月初遗留潜客数）'
              ]
          }, {
              type: '成交',
              label: '订单数',
              data: 'order_total',
              explain: ['【字段解释】通过汽车销冠进行下订操作的订单总数；']
          },
          {
              type: '成交',
              label: '潜客转化率',
              data: 'customer_transform_rate',
              level: 3,
              explain: ['【字段解释】已留档潜客下订单的比率；',
              '【计算规则】潜客转化率=订单数/（本月建卡总数+本月初遗留潜客数）']
          },
          {
              type: '成交',
              label: '战败数',
              data: 'defeated_agree',
              explain: ['【字段解释】通过汽车销冠进行战败操作的战败总数，仅包含已同意战败的战败客户数；']
          },
          {
              type: '成交',
              label: '战败率',
              data: 'defeated_agree_rate',
              level: 3,
              explain: [
              '【字段解释】已留档潜客战败的比率；',
              '【计算规则】战败率=战败数/（本月战败总数+本月初遗留潜客数）'
              ]
          },
          {
              type: '成交',
              label: '本月初遗留订单数',
              data: 'month_order',
              explain: ['【字段解释】本月月初1号凌晨0点，遗留未交车的订单数；']
          },
          {
              type: '成交',
              label: '交车数',
              data: 'success_order',
              explain: ['【字段解释】通过汽车销冠进行交车操作的交车总数；']
          },
          {
              type: '成交',
              label: '订单交车率',
              data: 'success_order_rate',
              level: 3,
              explain: ['【字段解释】已下订客户的交车比率；',
              '【计算规则】订单交车率=交车数/（本月下订总数+本月初遗留订单数）']
          },
          {
              type: '成交',
              label: '退订数',
              data: 'cancel_order',
              explain: ['【字段解释】通过汽车销冠进行取消订单操作的退订总数；']
          },
          {
              type: '成交',
              label: '订单退订率',
              data: 'cancel_order_rate',
              level: 3,
              explain: ['【字段解释】已下订客户的退订比率；',
              '【计算规则】订单退订率=退订数/（本月下订总数+本月初遗留订单数）']
          }
        ],
        // dcc部门统计表
        dccTable: [
          {
            type: '客流',
            label: '客流总数',
            data: 'reception_total',
            level: 1,
            explain: ['【字段解释】根据展厅的客流量，通过汽车销冠创建的客流总数；',
              '【计算规则】客流总数=首次到店客流总数+二次到店客流总数+非意向客流总数+未完善客流总数'],
          },
          {
            type: '客流',
            label: '首次到店客流总数',
            data: 'first_shop_total',
            level: 2,
            explain: ['【字段解释】客流类型为首次到店看车的客流数，可细分为三类：首次到店并留档、已建卡首次到店、看车未留档；',
              '【计算规则】首次到店客流总数=首次到店并留档+已建卡首次到店+看车未留档'],
          },
          {
            type: '客流',
            label: '首次到店并留档',
            data: 'no_archive',
            explain: ['【字段解释】客流类型为首次到店看车并留档的客流数，此数据也代表展厅客流的建卡数；']
          },
          {
            type: '客流',
            label: '已建卡首次到店',
            data: 'has_archive',
            explain: ['【字段解释】客流类型为已经建卡但属于首次到店的客流数，此类客户一般是：DCC首次邀约到店的客户，车展已建卡首次邀约到店的客户等；']
          },
          {
            type: '客流',
            label: '看车未留档',
            data: 'not_filing',
            explain: ['【字段解释】客流类型为意向潜客到店看车但并未留档的客流数；']
          },
          {
            type: '客流',
            label: '再次到店客流总数',
            data: 'more_shop_total',
            explain: ['【字段解释】客流类型为已经建卡并再次到店看车的客流数，此类客户一般是：再次邀约到店看车的客户；'],
            level: 2
          },
          {
            type: '客流',
            label: '非意向客流总数',
            data: 'no_intention_total',
            level: 2,
            explain: ['【字段解释】客流类型为非意向的客流数，可细分为五类：办理手续，办理交车，办理退订，维修保养，其他；']
          },
          {
            type: '客流',
            label: '未完善客流总数',
            data: 'faultiness',
            level: 2,
            explain: ['【字段解释】创建了展厅客流信息，但顾问未对客流信息进行完善的客流数量；']
          },
          {
            type: '客流',
            label: '客流留档率',
            data: 'add_archive_rate',
            explain: ['【字段解释】客流中意向潜客的留档比率；',
            '【计算规则】客流留档率=首次到店并留档/(首次到店并留档+看车未留档)'
            ],
            level: 3
          }, {
            type: '线索',
            label: 'dcc线索总数',
            data: 'dcc_clue_total',
            level: 1,
            explain: ['【字段解释】线索管理模块通过人工导入下发及系统自动下发的DCC线索总数，仅包含导入成功（号码去重）且分配过顾问的线索；线索总数可根据处理状态可细分为：有效建卡、非意向、已有档案、待跟进；',
            '【计算规则】DCC线索总数=有效建卡+非意向+已有档案+待跟进'
            ]
          },
          {
            type: '线索',
            label: '有效建卡',
            data: 'valid_clue',
            explain: ['【字段解释】通过汽车销冠APP线索池进行DCC线索跟进后，确认线索有效且有效建卡的线索数，此数据也代表DCC线索建卡数；']
          },
          {
            type: '线索',
            label: '非意向',
            data: 'no_intention_clue',
            explain: ['【字段解释】通过汽车销冠APP线索池进行DCC线索跟进后，确认线索无效且标记成非意向的线索数，非意向类型可细分为：空错号、多次无人接听、无购车意向、已购本品、已购竞品、省外客户、本省其他地区客户、其他；']
          },
          {
            type: '线索',
            label: '已有档案',
            data: 'has_archive_clue',
            explain: [`【字段解释】DCC线索导入或下发到线索池后，顾问未对线索进行有效建卡或标记非意向，通过其他非线索池渠道（展厅客流建卡等）对该线索进行了建卡操作，则该线索标记成已有档案；
              已有档案统计不包含：导入线索时已经有档案存在而被去重且无法的线索数；`]
          },
          {
            type: '线索',
            label: '待跟进',
            data: 'todo_clue',
            explain: ['【字段解释】已经分配给顾问但还未进行跟进处理的线索数；']
          },
          {
            type: '线索',
            label: 'DCC线索建卡率',
            data: 'clue_archive_rate',
            level: 3,
            explain: ['【字段解释】DCC线索跟进处理后，有效建卡的线索的占比，计算时不包含待跟进的线索数；',
              '【计算规则】DCC线索建卡率=有效建卡/（有效建卡+非意向+已有档案）*100%']
          }, {
            type: '建卡',
            label: '建卡总数',
            data: 'archive_total',
            level: 1,
            explain: ['【字段解释】通过汽车销冠建卡的潜客总数；跟进建卡渠道可细分为：展厅客流建卡、其他建卡；',
              '【计算规则】建卡总数=展厅客流建卡+其他建卡']
          },
          {
            type: '建卡',
            label: 'DCC线索建卡',
            data: 'dcc_archive',
            explain: ['【字段解释】处理线索池DCC线索时，进行了建卡操作的潜客总数，等于线索统计中的“有效建卡”数；']
          },
          {
            type: '建卡',
            label: '其他建卡',
            data: 'other_archive',
            explain: ['【字段解释】通过APP首页“+”号直接建档（无客流信息的车展客户、外拓客户等），或通过后台潜客管理直接导入（系统初次启用导入之前系统的潜客）的潜客数；']
          },
          {
            type: '建卡',
            label: '本月初遗留潜客数',
            data: 'month_customer',
            explain: [
            '【字段解释】本月月初1号凌晨0点，遗留未成交的潜客数，包含：H级、A级、B级、C级，本数据月初统计一次，之后不会再变更；'
            ]
          }, {
            type: '试驾',
            label: '试驾总数',
            data: 'driving_total',
            level: 1,
            explain: ['【字段解释】通过汽车销冠进行了试驾登记的试驾总数，包含智能试驾及普通试驾；',
              '【计算规则】试驾总数=智能试驾+普通试驾']
          },
          {
            type: '试驾',
            label: '智能试驾',
            data: 'smart_driving',
            explain: ['【字段解释】通过汽车销冠进行了智能试驾登记的试驾数，智能试驾需完成：扫描驾照、签署电子试驾协议等操作；']
          },
          {
            type: '试驾',
            label: '普通试驾',
            data: 'general_driving',
            explain: ['【字段解释】通过汽车销冠进行了普通试驾登记的试驾数，普通试驾只需要在补充客流信息时选择事件“试驾”，无需扫描驾照及签署电子试驾协议等操作；']
          },
          {
            type: '试驾',
            label: '到店智能试驾率',
            data: 'smart_driving_rate',
            explain: [
            '【字段解释】计算客流列表中，所有到店看车潜客的智能试驾率；',
            '【计算规则】到店客户智能试驾率=智能试驾/（首次到店并留档+已建卡首次到店+再次到店客流总数）'],
            level: 3
          },
          {
            type: '试驾',
            label: '到店客户试驾率',
            data: 'shop_driving_rate',
            explain: [
            '【字段解释】计算客流列表中，所有到店看车潜客的试驾率；',
            '【计算规则】到店客户试驾率=试驾总数/（首次到店并留档+已建卡首次到店+再次到店客流总数）'
            ],
            level: 3
          }, {
            type: '邀约',
            label: '邀约到店总数',
            data: 'invite_total',
            level: 1,
            explain: [
            '【字段解释】代表所有已建卡客户首次邀约到店或再次邀约到店的总次数，对应客流列表中的客流类型为：已建卡首次到店客流、再次到店客流；',
            '【计算规则】邀约到店总数=首次邀约到店+二次邀约到店=已建卡首次到店客流+再次到店客流']
          },
          {
            type: '邀约',
            label: '首次邀约到店',
            data: 'first_invite',
            explain: [
            '【字段解释】代表所有已建卡客户首次邀约到店的客户数，对应客流列表中的客流类型为：已建卡首次到店客流；']
          },
          {
            type: '邀约',
            label: '再次邀约到店',
            data: 'more_invite',
            explain: ['【字段解释】代表所有再次邀约到店的总次数，对应客流列表中的客流类型为：再次到店客流；']
          },
          {
            type: '邀约',
            label: '邀约到店率',
            data: 'first_invite_rate',
            level: 3,
            explain: ['【字段解释】已留档潜客邀约到店的比率；',
              '【计算规则】邀约到店率=邀约到店总数/（本月建卡总数+本月初遗留潜客数）']
          },
          {
            type: '邀约',
            label: '再次邀约到店率',
            data: 'more_invite_rate',
            explain: [
            '【字段解释】已留档潜客再次邀约到店的比率；',
            '【计算规则】邀约到店率=再次邀约到店数/（本月建卡总数+本月初遗留潜客数）'],
            level: 3
          }, {
            type: '成交',
            label: '订单数',
            data: 'order_total',
            explain: ['【字段解释】通过汽车销冠进行下订操作的订单总数；']
          },
          {
            type: '成交',
            label: '邀约到店转化率',
            data: 'invite_transform_rate',
            explain: [
            '【字段解释】邀约到店客户下订单的比例；',
            '【计算规则】邀约到店成交率=订单数/邀约到店总数'],
            level: 3
          },
          {
            type: '成交',
            label: '潜客转化率',
            data: 'customer_transform_rate',
            level: 3,
            explain: [
            '【字段解释】已留档潜客下订单的比率；',
            '【计算规则】潜客转化率=订单数/（本月建卡总数+本月初遗留潜客数）']
          },
          {
            type: '成交',
            label: '战败数',
            data: 'defeated_agree',
            explain: ['【字段解释】通过汽车销冠进行战败操作的战败总数，仅包含已同意战败的战败客户数；']
          },
          {
            type: '成交',
            label: '战败率',
            data: 'defeated_agree_rate',
            level: 3,
            explain: [
            '【字段解释】已留档潜客战败的比率；',
            '【计算规则】战败率=战败数/（本月战败总数+本月初遗留潜客数）']
          },
          {
            type: '成交',
            label: '本月初遗留订单数',
            data: 'month_order',
            explain: ['【字段解释】本月月初1号凌晨0点，遗留未交车的订单数；']
          },
          {
            type: '成交',
            label: '交车数',
            data: 'success_order',
            explain: ['【字段解释】通过汽车销冠进行交车操作的交车总数；']
          },
          {
            type: '成交',
            label: '订单交车率',
            data: 'success_order_rate',
            level: 3,
            explain: ['【字段解释】已下订客户的交车比率；',
            '【计算规则】订单交车率=交车数/（本月下订总数+本月初遗留订单数）']
          },
          {
            type: '成交',
            label: '退订数',
            data: 'cancel_order',
            explain: ['【字段解释】通过汽车销冠进行取消订单操作的退订总数；']
          },
          {
            type: '成交',
            label: '订单退订率',
            data: 'cancel_order_rate',
            level: 3,
            explain: ['【字段解释】已下订客户的退订比率；',
            '【计算规则】订单退订率=退订数/（本月下订总数+本月初遗留订单数）']
          }
        ],
        qusDialog: {
          show: false
        },
        initOrgSelected: [],
        initLabelSelected: [],
        overviewHashReset: true,
        overviewOrgOptions: [],
        overviewLabelOptions: [],
        overviewOptionsStore: [],
        dialog: {
          menuShow: false,
          type: '',
          menuId: 0,
          pname: ''
        },
        initParams: {},
        showTable: true // 显示表格
      }
    },
    mounted() {
      window.addEventListener('resize', this.handleResize, true);
    },
    created() {
      this.initParams = this.$route.query.params && JSON.parse(this.$route.query.params);
      if(this.initParams && sessionStorage.getItem("orgOptions")){
        Object.assign(this.filter, this.initParams)
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
        this.init();
      }else{
        // this.params = this.initParams;
          this.getIndexOption();
    
      
        // this.getOrgBrand();
        // this.getOrgArea();
        
      }

      // setTimeout(() => {
      //   this.handleResize();
      // }, 1000);
    },
    methods: {
      getIndexOption() {
        // 获取搜索选项
        let that = this;
        Http.getIndexOption()
          .then(res => {
            that.$handleResponse(res, res => {
              that.optionsData = res;
              that.orgOptions = [].concat(that.optionsData.org);
              that.labelOptions = that.optionsData.label;

              that.orgOptions = that.handleOrgOptionsInit(that.orgOptions);   // 添加字段 disabled:false
              that.labelOptions = that.handleTreeData(that.labelOptions);


              that.labelOptions = JSON.parse(JSON.stringify(that.labelOptions).replace(/id/g,"org_id"));    // 字段名称修改 id => org_id
              that.labelOptions = JSON.parse(JSON.stringify(that.labelOptions).replace(/label/g,"name"));

              that.overviewOrgOptions = JSON.parse(JSON.stringify(that.orgOptions));
              that.overviewLabelOptions = JSON.parse(JSON.stringify(that.labelOptions));
              that.overviewOptionsStore = JSON.parse(JSON.stringify(that.optionsData.area));
            });
          })
          .catch(error => {
            that.loading = false;
            console.log(error);
          }).then(function(){
            that.init();
          })
        
      },
      handleResize() {
        let _head = document.getElementsByClassName("el-table__header-wrapper");
        let _bodyWrapper = document.getElementsByClassName("el-table__body-wrapper")[0];
        let _fixedBody = document.getElementsByClassName("el-table__fixed-body-wrapper");
        let _patch = document.getElementsByClassName("el-table__fixed-right-patch");
        let _height = '';
        let eleHeight = document.documentElement.clientHeight - 160;

        setTimeout(() => {
          // 设置活动body的高度
          if (_bodyWrapper) {
            _bodyWrapper.style.height = eleHeight + 'px';
          }

          // 设置固定body的高度
          for (let i = 0; i < _fixedBody.length; i++) {
            // 将带有px单位转换为数字
            let bodyParent = parseInt(_fixedBody[i].parentNode.style.bottom);
            // 如果出现滚动条则减去获取到bottom的像素
            if (bodyParent) {
              _fixedBody[i].style.height = eleHeight - bodyParent + 'px';
            } else {
              _fixedBody[i].style.height = eleHeight + 'px';
            }
          }

          // 缩小窗口时，头部内容多时，设置三表头对齐
          if (_head[0] && _head[0].clientHeight) {
              _height = _head[0].clientHeight + 'px';
              if (_patch[0]) {
                _patch[0].style.height = _height;
              }

              for (let i = 0; i < _fixedBody.length; i++) {
                if (_fixedBody[i].style.top !== _height) {
                  _fixedBody[i].style.top = _height;
                }
              }
          } else {
            return;
          }
        }, 100);
      },
      init() {
        // 根据当前路由，对应不同统计表
        const route = this.$route;
        if (route.path === '/xg/basic/all') {
          this.tableType = 1;
        } else if (route.path === '/xg/basic/exhibition') {
          this.tableType = 2;
        } else if (route.path === '/xg/basic/dcc') {
          this.tableType = 3;
        }

        // 获取登录成功后返回的用户信息
        this.user_info = userInfo.getUserInfo() && JSON.parse(userInfo.getUserInfo());

        // 查询数据
        this.queryData();
      },
      // 接口所需参数
      forParams () {
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
          labelSelected
        } = this.filter;

        return {
          // 统计维度 0-集团 1-品牌 2-单店
          stat_dimension: this.handleParamsType(type),
          // 统计时间（2018或2018-10）tableType 为基础表时 需筛选年或月
          date: (this.tableType !== 1 && this.activeName === 'contrast') ? month : (date_type === 0 ? year : (date_type === 1 ? month : day)),
          // 统计时间类型 0-年 1-月 2-日
          stat_date_type: (this.tableType !== 1 && this.activeName === 'contrast') ? 1 : date_type,
          // 报表类型 0-趋势表 1-对比表
          // report_type: this.activeName === 'trend' ? 0 : 1,
          // 0-不导出 1-导出
          is_report: 0,
          // 统计类型 1-基础统计 2-展厅部门统计 3-dcc统计
          stat_type: this.tableType,
          // 组织id（stat_dimension = 0时必填）
          // org_id: this.user_info && this.user_info.org_id,
          org_id: this.handleParamsOrgId(type, orgSelected),
          // org_id: type == 0 ? orgSelected : '',
          // 组织品牌id（stat_dimension=1时必填，等于0时为全部）
          // org_brand_id: brand,
          // 组织品牌门店id（stat_dimension=2时必填）
          area_id: this.activeName === 'trend' ? store: '',
          // 是否清除缓存 0-否 1-是
          clear_cache: clearCache ? 1 : 0,
          // 标签id
          // label: this.activeName === 'trend' ? this.handleParamsLabel(type, labelSelected, store) : '',
          // label_id: this.activeName === 'contrast' ? this.handleParamsLabel(type, labelSelected, store): '',
          label_id: this.handleParamsLabel(type, labelSelected, store),
        };
      },
      // stat_dimension参数处理
      handleParamsType(type) {
        if(this.activeName === 'trend'){
          return type;
        }else if(this.activeName === 'contrast'){
          switch(type){ // 统计维度 2-单店 4-标签 5-组织
            case 0:
              return 2;
              break;
            case 1:
              return 5;
              break;
            case 2:
              return 4;
              break;
            default:
              break;
          }
        }
      },
      // org_id 参数处理
      handleParamsOrgId(type, orgSelected){
        if(this.activeName ===  'trend' && type == 0){
          return orgSelected;
          // return [31];    // 暂时写死
        }else if(this.activeName === 'contrast'){
          return this.user_info && this.user_info.org_id;
        }
      },
      // 标签参数处理
      handleParamsLabel(type, labelSelected, store) {
        if(this.activeName === 'trend' && type == 0){
          return labelSelected;
        }else if(this.activeName === 'contrast' && type == 2){
          return store;
        }else {
          return '';
        }
      },
      // 配置导出方法
      configExportFn () {
        this.params = this.forParams();
        const params = Object.assign({}, this.params);
        params.is_report = 1  // 导出

        // 导出传递所需参数
        let urlName = this.activeName === 'trend' ? '/report/statistics/': '/report/contrast/';
        this.configExport = {
            url: urlName + this.tableType,
            params: params,
            filename: this.tableType === 1 ? '基础统计表' : (this.tableType === 2 ? '展厅部门统计表' : 'DCC部门统计表')
        }
      },
      getOrgBrand() { // 获取品牌信息
        Http.orgBrand().then(res => {
          this.$handleResponse(res, res => {
            this.optionsBrand = res;
          });
        }).catch(error => {
          this.loading = false;
          console.log(error);
        })
      },
      getOrgArea() { // 获取门店信息
        Http.orgArea().then(res => {
          this.$handleResponse(res, res => {
            this.optionsStore = res;
          });
        }).catch(error => {
          this.loading = false;
          console.log(error);
        })
      },
      searchFn() { // 查询
        if (this.activeName === 'trend') {
          if(this.filter.type === 0 && this.filter.orgSelected.length === 0){
            this.$message.error("请选择组织");
            return;
          }
          if(this.filter.type === 2 && !this.filter.store){
            this.$message.error("请选择店");
            return;
          }
        }else if( this.activeName === 'contrast'){
          if(this.filter.type === 2 && !this.filter.store){
            this.$message.error("请选择标签");
            return;
          }
        }
        this.queryData();
      },
      queryData() { // 查询数据
        this.loading = true;
        this.params = this.forParams();
        // setTimeout(() => {
          this.tableBody = [];
        let queryDataName = this.activeName === 'trend' ? 'statisticsData': 'contrastData';
        sessionStorage.clear();

        // this.loading = false; return;
        Http[queryDataName](this.tableType, this.params).then(res => {
          this.$handleResponse(res, res => {
              if(res && res.length == 0){
                this.showTable = false;
                return ;
              }
              this.showTable = true;
              const {
                header,
                result,
                headerIds
              } = res;
              this.spanArr = [];
              // 表头部数据
              this.tableHead = header;
              // 组织id
              this.headerIds = headerIds;
              // 表体数据
              if (result) {
                this.tableBody = result;
              }
              this.getSpanArr(this.tableType === 1 ? this.basicTable : (this.tableType === 2 ? this.exhibitionTable : this.dccTable));
              this.loading = false;

          }, true);
          this.loading = false;
        }).catch(error => {
          this.loading = false;
          console.log(error);
        }).then(()=>{
          this.handleResize(); //调整窗口
        })

        // 配置导出时
        this.configExportFn();
        // }, 1000);

      },
      handleTable() { // 处理表数据
        this.resetFn();
        let optionsBrand = this.optionsBrand;
        if(optionsBrand.length !== 0) {
          if (this.activeName === 'contrast' && optionsBrand[0].brand_name !== '全部' && optionsBrand[0].org_brand_id !== 0) {
            optionsBrand.unshift({
              brand_name: "全部",
              org_brand_id: 0
            });
          } else if(this.activeName === 'trend' && optionsBrand[0].brand_name === '全部' && optionsBrand[0].org_brand_id === 0) {
            optionsBrand.splice(0, 1);
          }
        }
      },
      dialogShow() {
        this.qusDialog.show = true;
      },
      resetFn() { // 重置
        // 表格容器滚动条重置到最顶
        if(this.showTable){
          document.getElementsByClassName("el-table__body-wrapper")[0].scrollTop = 0;
        }

        // 重置高度
        setTimeout(() => {
          this.handleResize();
        }, 1000);

        // this.$refs.otree.labelModelNull();
        // this.$refs.ltree.labelModelNull();
        // this.filter.orgSelected = [];
        // this.filter.labelSelected = [];
         if (!this.overviewOrgOptions[0] || !this.overviewOrgOptions[0].length) {
          this.filter.orgSelected = [];
          this.filter.labelSelected = [];
          this.overviewOrgOptions = JSON.parse(JSON.stringify(this.orgOptions));
          this.overviewLabelOptions = JSON.parse(JSON.stringify(this.labelOptions));
          this.overviewOptionsStore = JSON.parse(JSON.stringify(this.optionsData.area));
        }
        this.filter = {
          type: 0,
          date_type: this.tableType === 1 && this.activeName === 'contrast' ? 1 : 0,  // 基础表-对比表时，默认按月筛选
          year: new Date().getFullYear().toString(),
          month: moment(new Date()).format('YYYY-MM'),
          day: moment(new Date()).format('YYYY-MM-DD'), // 选择的日期 （默认获取当前年当前月份的日期）
          brand: this.optionsBrand.length === 0 || this.activeName == 'trend' ? '' : 0,
          store: '',
          clearCache: false,
          orgSelected: [],
          labelSelected: []
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
        this.queryData();
      },
      tableRowClassName ({ row }) {
        return row.level == 1 ? 'p-total' : row.level == 2 ? 'c-total' : row.level == 3 ? 'rate' : '';
      },
      getSpanArr (data) {
        for (var i = 0; i < data.length; i++) {
          if (i === 0) {
            this.spanArr.push(1);
            this.pos = 0;
          } else {
            // 判断当前元素与上一个元素是否相同
            if(data[i].type === data[i - 1].type) {
              this.spanArr[this.pos] += 1;
              this.spanArr.push(0);
            } else {
              this.spanArr.push(1);
              this.pos = i;
            }
          }
        } 
      },
      // 合并单元格
      objectSpanMethod ({ row, column, rowIndex, columnIndex}) {
        if(columnIndex === 0) {
         const _row = this.spanArr[rowIndex];
         return {
           rowspan: _row,
           colspan: 1
         }
        }
      },
      renderHeader (h,{column}) { // h即为cerateElement的简写，具体可看vue官方文档
        let self = this;
        if(this.activeName === 'contrast' && (this.params.stat_dimension === 4 || this.params.stat_dimension === 5) && column.label != '合计' && column.label != '均值'){ // 对比表，统计维度为组织对比和标签对比
          return h(
            'span',
            [
              h('span', column.label),
              // h('i', {
              //   class:'el-icon-location',
              //   style:'color:#409eff;margin-left:5px;'
              // }),
              h('el-popover', { props: { placement: 'top-start', width: '200', trigger: 'click'}},
              [
                h('span', {
                // class:'el-icon-question',
                style:'color:#409eff;margin-left:5px;cursor:pointer;',
                on: {
                  click: () => {
                    self.queryDataArea(column);
                  }
                }
              },' 包含4S店'),
                h('i', { slot: 'reference', class:'', style:"font-size: 14px;cursor:pointer;"}, '...')
              ]
              )
            ],
          );
        }else{
          return h(
            'span',
            [
              h('span', column.label)
            ],
          );
        }

      },
      queryDataArea(column) {
        let org_id = this.headerIds[column.label];
        let pname = '';
        if(this.params.stat_dimension == 4){    // 标签对比
          pname = 'label_id';
        }else if(this.params.stat_dimension == 5){
          pname = 'org_id';
        }
        this.areaDialogShow('add', org_id, pname);
        
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
          this.$set(element, 'disabled', false);
          if(element.childs && element.childs.length){
            element.childs.forEach(child => {
              this.$set(child, 'disabled', false);
            });
          }
        });
        return array
      },
      treeSelect(somedata, type) {
        this[type.split('.')[0]][type.split('.')[1]] = somedata
      },
      areaDialogShow(type, org_id, pname) {  // 新增，编辑菜单弹窗显示
        this.dialog.type = type;
        this.dialog.org_id = org_id;
        this.dialog.pname = pname;
        this.dialog.menuShow = true;
      },
      dialogSuccess() { // 新增或修改成功后关闭窗口
        this.dialog.menuShow = false;
        this.getMenuData();
      },
      listenToAreas(somedata) {
        // this.org.relationAreasData = somedata
      },
      optionChange(callback){ // 解决组织下拉框不隐藏的问题
        if(callback){
          document.querySelector("#app").click();
        }
      }
    }
  }

</script>

<style lang="scss">
  .basic-wrapper {
    .el-table.tableWrapper{
      .p-total {
        background-color: rgb(217, 236, 255);
      }
      .c-total {
        background-color: rgb(239, 249, 235);
      }
      .rate {
        background-color: oldlace;
      }

    }

    .mean {
      position: absolute;
      top: 8px;
      right: 30px;
      z-index: 9;
      .th-icon {
        font-size: 16px;
        cursor: pointer;
        color: #909399;
      }
    }
  }
  .basic-wrapper .tips-bg{
    background-color: #FAEBCC;
    color: #C09B60;
  }
  .basic-wrapper .tips-bg li{
    color: #C09B60;
    font-size: 14px;
  }
</style>
