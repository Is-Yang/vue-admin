<template>
    <div :id="chartId"></div>
</template>

<script>
import HighCharts from 'highcharts'
export default {
    props: ['chartName', 'chartId', 'chartOptions', 'chartData', 'seriesData'],
    data() {
        return {
            
        }
    },
    watch: {
        'chartOptions': {
            handler(newVal, oldVal) {
                this.createChart(this.chartName, this.chartId, this.chartOptions, this.chartData, this.seriesData);
            },
            deep: true
        },
        'chartData': {
            handler(newVal, oldVal) {
                this.createChart(this.chartName, this.chartId, this.chartOptions, this.chartData, this.seriesData);
            },
            deep: true
        },
        'seriesData': {
            handler(newVal, oldVal) {
                this.createChart(this.chartName, this.chartId, this.chartOptions, this.chartData, this.seriesData);
            },
            deep: true
        }
    },
    mounted() {
        this.createChart(this.chartName, this.chartId, this.chartOptions, this.chartData, this.seriesData);
    },
    created () {
    },
    methods: {
        createChart(chartName, chartId, chartOptions, chartData, seriesData) {
            let count = 0;
            chartName = HighCharts.chart(chartId, {
                series: seriesData, 
                navigation: {
                    buttonOptions: {
                        verticalAlign: 'top',
                        enabled: false
                    }
                },
                chart: {
                    type: chartOptions.type || 'line',  // 图表类型
                    zoomType: chartOptions.zoomType || '',  // 缩放方式
                    marginBottom: chartOptions.marginBottom || null, // 距离底部的距离
                    spacing: chartOptions.dataSpacing || [30, 0, 30, 0],  // 图表的内边距

                },
                exporting: {  // 导出功能
                    sourceWidth: this.exportWidth || undefined,
                    enabled: chartOptions.isExport || false,
                    filename: chartOptions.filename
                },
                title: { // 主标题
                    text: chartData && chartData.titleText || '', // 文字
                    useHTML: chartOptions.useHTML || false,   // 是否使用HTML渲染标题
                    style: chartOptions.titleStyle || { 'fontSize': '16px', 'fontWeight': 'bold' },
                    align: chartOptions.titleAlign || 'center', // 水平对齐方式
                    verticalAlign: chartOptions.titleVerticalAlign || 'middle', // 垂直对齐方式
                    y: chartOptions.titleY || 0, // y轴偏移量
                    x: chartOptions.titleX || 0, // x轴偏移量
                },
                subtitle: { // 副标题
                    text: chartData && chartData.subtitleText || '', // 文字
                    align: chartOptions.subtitleAlign || 'center', // 水平对齐方式
                    verticalAlign: chartOptions.subtitleVerticalAlign || 'middle', // 垂直对齐方式
                    style: chartOptions.subtitleStyle || { 'color': '#a4a4a4' },
                    y: chartOptions.subtitleY || 0, // y轴偏移量
                    x: chartOptions.subtitleX || 0,// x轴偏移量
                },
                credits: { // highchat版权信息显示
                    enabled: false
                },
                plotOptions: { // 数据列配置
                    series: {
                        stacking: chartOptions.seriesStack || null,
                        connectNulls: true,   // 是否连接空值
                        pointWidth: chartOptions.pointWidth || null,  // 图形宽度
                        events: {
                            // 图例项点击事件处理 (不适用于饼图)
                            legendItemClick: chartOptions.seriesEvent ? function (event) { 
                                // 必选一个数据
                                if (event.target.visible == true) {
                                    count++;
                                } else {
                                    count--;
                                }
                                if (count == chartName.series.length) {
                                    count = chartName.series.length - 1;
                                    return false;
                                }
                            } : null
                        }
                    },
                    area: {  // 面积图配置
                        fillOpacity: chartOptions.fillOpacity || 0.5,
                    },
                    pie: { // 饼图配置
                        cursor: 'pointer',
                        center: ['50%', '50%'],
                        dataLabels: { // 标签配置
                            enabled: chartOptions.dataLabelsEnabled || false, // 是否启用标签
                            softConnector: chartOptions.dataLabelsSoftConnector || false, // 标签线设置
                            format: '<span style="color:#666;">{point.name}: {y}</span>',
                        },
                        allowPointSelect: true,  // 可点击选择查看
                        showInLegend: chartOptions.dataShowInLegend || false, // 是否启用图例
                        tooltip: {
                            pointFormat: '<b>数量：{point.y}</b><br/><b>占比：{point.percentage:.1f}%</b>'
                        },
                        colors: chartOptions.dataColors || null,
                    },
                    bar: {
                        dataLabels: { // 标签配置
                            enabled: chartOptions.dataLabelsEnabled || false, // 是否启用标签
                            softConnector: chartOptions.dataLabelsSoftConnector || false, // 标签线设置
                        },
                        showInLegend: chartOptions.dataShowInLegend || false, // 是否启用图例
                    },
                    line: {
                        dataLabels: {
                            enabled: chartOptions.dataLabelsEnabled || false, // 开启数据标签
                            softConnector: chartOptions.dataLabelsSoftConnector || false, // 标签线设置
                        },
                        showInLegend: chartOptions.dataShowInLegend || false // 是否启用图例
                    },
                    spline: {
                        dataLabels: { // 标签配置
                            enabled: chartOptions.dataLabelsEnabled || false, // 是否启用标签
                            softConnector: chartOptions.dataLabelsSoftConnector || false, // 标签线设置
                            format: '{y}%'
                        },
                        showInLegend: chartOptions.dataShowInLegend || false // 是否启用图例
                    },
                    column: {
                        dataLabels: {
                            enabled: chartOptions.dataLabelsEnabled || false, // 是否启用标签
                            color: chartOptions.labelColor || 'white',
                            style: {
                                // 如果不需要数据标签阴影，可以将 textOutline 设置为 'none'
                                textOutline: 'none',
                                fontWeight: '500',   // 不加粗
                            }
                        },
                        showInLegend: chartOptions.dataShowInLegend || false // 是否启用图例
                    }
                },
                tooltip: { // 数据提示框  
                    // pointFormat: '<b>{point.y}</b><br/>',
                    enabled: true,
                    shared: true,  // 是否共享
                    formatter: chartOptions.dataFormatter || null
                },
                legend: {  // 图例样式
                    enabled: chartOptions.enabled || false,  // 是否开启图例
                    align: chartOptions.chartAlign || 'center',
                    verticalAlign: 'bottom',
                    floating: chartOptions.floating || false,  // 图例容器是否可以浮动
                    x: 0,
                    y: 0,
                    symbolHeight: 12,
                    symbolWidth: 12,
                    symbolRadius: 0,
                    padding: 12,
                    itemDistance: 80,
                    itemHoverStyle: {
                        color: "#409eff"
                    }
                },
                xAxis: chartData && chartData.chartDataXAxisList || {  // X轴
                    categories: chartData && chartData.chartDataXAxis || '',
                    // labels: {
                    //     overflow: 'justify',
                    //     rotation: chartOptions.xAxisRotat || 0
                    // }
                },
                yAxis: chartData && chartData.chartDataYAxisList || {  // Y轴
                    title: {
                        text: ''
                    },
                    stackLabels: {
                        enabled: chartOptions.stackLabels || false,   // 计算堆叠数据-标签
                        style: {
                            fontWeight: 'bold',
                            color: (HighCharts.theme && HighCharts.theme.textColor) || 'gray'
                        }
                    }
                }
            }) 
        }
    }
}
</script>
