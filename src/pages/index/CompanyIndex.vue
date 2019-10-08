<template>
    <div class="company-index">
        <el-row type="flex" class="flex-wrap" :gutter="15">
            <el-col :span="9">
                <div class="card-item">
                    <h3>{{chartTitle[0]}}</h3>
                    <v-chart v-if="dataId[0] || chartOptions[0] || chartData[0] || seriesData[0]" style="height: 340px;"
                        :chartName="dataId[0]" 
                        :chartId="dataId[0]"
                        :chartOptions="chartOptions[0]"
                        :chartData="chartData[0]"
                        :seriesData="seriesData[0]"></v-chart>
                    <div class="bottom-legend" v-if="!chartOptions[0].enabled && seriesData && seriesData[0] && seriesData[0][0] && seriesData[0][0].data">
                        <span v-for="(label, i) in seriesData[0][0].data" :key="i" @click="getRickTask(label.value)">
                            <i :style="{'background-color': chartOptions[0].dataColors[i]}"></i>
                            {{label.name}}
                        </span>
                    </div>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="card-item" style="height: 420px;">
                    <h3>安全风险管控情况</h3>
                    <p class="text-right margin-bottom-20">完成率：
                        <span style="color: #fd6b6b; font-weight: 600;">{{complete_rate*100}}%</span>
                    </p>
                    <div class="monitoring-table">
                        <ul class="table-head">
                            <li></li>
                            <li>重大风险</li>
                            <li>较大风险</li>
                            <li>一般风险</li>
                            <li>低风险</li>
                        </ul>
                        <div class="table-body">
                            <ul>
                                <li>已监控</li>
                                <li>
                                    <a href="javascript:;" @click="getTypeTask(3, 0)">{{monitoringInfo.risk_history_serious}}</a>
                                </li>
                                <li>
                                    <a href="javascript:;" @click="getTypeTask(2, 0)">{{monitoringInfo.risk_history_high}}</a>
                                </li>
                                <li>
                                    <a href="javascript:;" @click="getTypeTask(1, 0)">{{monitoringInfo.risk_history_normal}}</a>
                                </li>
                                <li>
                                    <a href="javascript:;" @click="getTypeTask(0, 0)">{{monitoringInfo.risk_history_low}}</a>
                                </li>
                            </ul>
                            <ul class="txt-danger">
                                <li>未监控</li>
                                <li>
                                    <a href="javascript:;" @click="getTypeTask(3, 1)">{{monitoringInfo.risk_undo_serious}}</a>
                                </li>
                                <li>
                                    <a href="javascript:;" @click="getTypeTask(2, 1)">{{monitoringInfo.risk_undo_high}}</a>
                                </li>
                                <li>
                                    <a href="javascript:;" @click="getTypeTask(1, 1)">{{monitoringInfo.risk_undo_normal}}</a>
                                </li>
                                <li>
                                    <a href="javascript:;" @click="getTypeTask(0, 1)">{{monitoringInfo.risk_undo_low}}</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :span="7">
                <div class="card-item" style="height: 420px;">
                    <h3>相关链接</h3>
                    <ul>
                        <li v-for="(item, index) in relatedLinks" :key="index" class="link">
                            <router-link :to="'/showPage?page=' + item.flag">
                                {{item.title}}
                            </router-link>
                        </li>
                    </ul>
                </div>
            </el-col>
            <el-col :span="9">
                <div class="card-item">
                    <h3>{{chartTitle[1]}}</h3>
                    <v-chart v-if="dataId[1] || chartOptions[1] || chartData[1] || seriesData[1]" style="height: 340px;"
                        :chartName="dataId[1]" 
                        :chartId="dataId[1]"
                        :chartOptions="chartOptions[1]"
                        :chartData="chartData[1]"
                        :seriesData="seriesData[1]"></v-chart>
                    <div class="bottom-legend" v-if="!chartOptions[1].enabled && seriesData && seriesData[1] && seriesData[1][0] && seriesData[1][0].data">
                        <span v-for="(label, i) in seriesData[1][0].data" :key="i" @click="getProblemTask(label.value)">
                            <i :style="{'background-color': chartOptions[1].dataColors[i]}"></i>
                            {{label.name}}
                        </span>
                    </div>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="card-item">
                    <h3>安全风险四色分布图</h3>
                    <div class="imageShow">
                        <img :src="imageData" />
                    </div>
                </div>
            </el-col>
            <el-col :span="7">
                <div class="card-item" style="height: 420px;">
                    <h3>企业电子图定位</h3>
                    <div>
                        <v-map :mapXY="mapXY" style="width: 100%; height: 380px;"></v-map>
                    </div>
                </div>
            </el-col>
        </el-row>

        <!-- 企业风险功能 -->
        <rick-task v-if="dialog.rickShow"
            :level="dialog.rickTask"
            @cancel="dialog.rickShow = !dialog.rickShow"
            @success="dialogSuccess">
        </rick-task>

        <!-- 监控任务 -->
        <type-task v-if="dialog.typeShow"
            :typeTask="dialog.typeTask"
            @cancel="dialog.typeShow = !dialog.typeShow"
            @success="dialogSuccess">
        </type-task>

        <!-- 隐患功能 -->
        <problem-task v-if="dialog.problemShow"
            :level="dialog.problemTask"
            @cancel="dialog.problemShow = !dialog.problemShow"
            @success="dialogSuccess">
        </problem-task>
    </div>
</template>

<script>
import * as Http from '@/api/home'
import VMap from '../company/Map';
import RickTask from './RickTask';
import TypeTask  from './TypeTask';
import ProblemTask from './ProblemTask';
export default {
    components: {
        VMap,
        RickTask,
        TypeTask,
        ProblemTask
    },
   data () {
    return {
        mapXY: {},
        dialog: {
            rickShow: false,
            typeShow: false,
            problemShow: false,
            rickTask: '',
            typeTask: {},
            problemTask: '',
            infoShow: false,
            infoData: {}
        },
        complete_rate: 0,
        chartTitle: ['安全风险实时统计', '安全隐患实时统计'],
        dataId: ['risk', 'danger'],
        chartOptions: [
            { 
                type: 'pie',
                enabled: false, 
                marginBottom: 80, 
                dataShowInLegend: true,
                useHTML: true,
                dataColors: ['#fd6b6b', '#FDB582', '#ffd555', '#1494EB']
            },
            { 
                type: 'pie',
                enabled: false,
                marginBottom: 80, 
                dataShowInLegend: true,
                useHTML: true,
                dataColors: ['#fd6b6b', '#1494EB'] 
            },
        ],
        chartData: [],
        seriesData: [],
        relatedLinks: [
            {
                title: '隐患排查治理信息系统',
                link: 'http://ent.hazard.scaqjg.com',
                flag: 1,
            }, {
                title: '社会单位消防安全户籍化管理系统',
                link: 'http://202.61.89.197:85/FrameSet/Login.aspx',
                flag: 2,
            }, {
                title: '四川省安全社区信息管理平台',
                link: 'http://aqsq.tccxfw.com',
                flag: 3,
            }, {
                title: '四川省安全评价信息公开平台',
                link: 'http://www.czax.org/cyxx',
                flag: 4,
            }
        ],
        monitoringInfo: {},
        imageData: ''
    }
  },
  created () {
      this.init();
  },
  methods: {
        init() {
            this.$store.dispatch('openLoading', 'full');
            Http.getCompanyShowInfo().then(res => {
                this.$store.dispatch('closeLoading', 'full');
                this.$handleResponse(res, res => {
                    this.monitoringInfo = res.risk_info;
                    this.imageData = res.company.company_img_1;
                    this.complete_rate = res.complete_rate;
                    this.mapXY = {
                        xData: res.company.company_x,
                        yData: res.company.company_y,
                    }
                    this.showRiskStat(res.risk_info);
                    this.$store.dispatch('GetEnterpriseInfo', res.company);
                });
            }).catch(err => {
                this.$store.dispatch('closeLoading', 'full');
                console.log(err)
            });
        },
        getTypeTask(level, type) {
            this.dialog.typeShow = true;
            this.dialog.typeTask = {
                level: level,
                type: type
            };
        },
        getRickTask(data) {
            this.dialog.rickShow = true;
            this.dialog.rickTask = data;
        },
        getProblemTask(data) {
            this.dialog.problemShow = true;
            this.dialog.problemTask = data;
        },
        dialogSuccess() {
            this.dialog.typeShow = false;
            this.dialog.rickShow = false;
            this.dialog.problemShow = false;
            this.init();
        },
        showRiskStat(data) {
            let {
                risk_low,
                risk_high,
                risk_serious,
                risk_normal,
                danger_serious,
                danger_normal
            } = data;
            let riskTotal = risk_low + risk_high + risk_serious + risk_normal;
            let dangerTotal = danger_serious + danger_normal
            this.chartData = [
                {
                    titleText: '<div class="text-center"><p>总风险数</p><span>'+ riskTotal +'</span></div>'
                }, {
                    titleText: '<div class="text-center"><p>总隐患数</p><span>'+ dangerTotal +'</span></div>'
                }
            ]

            this.seriesData = [
                // 风险
                [{
                    innerSize: '65%',
                    data: [{
                        name: '重大风险',
                        y: risk_serious,
                        value: 3
                    }, {
                        name: '较大风险',
                        y: risk_high,
                        value: 2
                    }, {
                        name: '一般风险',
                        y: risk_normal,
                        value: 1
                    }, {
                        name: '低风险',
                        y: risk_low,
                        value: 0
                    }]
                }],
                // 隐患
                [{
                    innerSize: '65%',
                    data: [{
                        name: '重大隐患',
                        y: danger_serious,
                        value: 1
                    }, {
                        name: '一般隐患',
                        y: danger_normal,
                        value: 0
                    }]
                }],
            ]
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss">
 .company-index {
     ul {
        list-style: none;
     }
     .flex-wrap {
         flex-wrap: wrap;
        >.el-col {
            margin-bottom: 20px;
        }
     }
     .card-item {
        position: relative;
        padding: 20px 18px;
        background: #fff;
        box-shadow: 4px 4px 40px rgba(0,0,0,.05);
        border-color: 1px solid rgba(0,0,0,.05);

        h3 {
            padding-bottom: 15px;
            font-weight: normal;
            font-size: 18px;
            font-weight: 600;
        }

        .link {
            font-size: 15px;
            color: #1494EB;
            padding: 15px 0 15px 20px;
            border-bottom: 1px solid #eee;

            a {
                transition: all .2s linear;
                &:hover {
                    padding-left: 10px;
                }
            }
        }

        .imageShow {
            height: 340px;
            overflow: hidden;

            img {
                max-width: 100%;
                max-height: 100%;
            }
        }
     }

    .bottom-legend {
        position: absolute;
        bottom: 60px;
        left: 0;
        right: 0;
        text-align: center;
        z-index: 9;

        span {
            margin: 0 5%;
            color: #333333;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
            &:hover {
                color: #409eff;
            }

            i {
                width: 12px;
                height: 12px;
                display: inline-block;
                vertical-align: text-top;
            }
        }
    }
 }
</style>