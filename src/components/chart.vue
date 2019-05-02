<template>
  <div class="x-bar">
    <div :id="id"
    :option="option"></div>
  </div>
</template>
<script>
import HighCharts from 'highcharts'
export default {
  // 验证类型
  props: {
    id: {
      type: String
    },
    option: {
      type: Object
    }
  },
  data() {
    return {
      chart: null
    };
  },
  mounted() {
    this.chart = HighCharts.chart(this.id,this.option)
  },
  methods: {
    childMethod(title, chartOptions, categories){
      title = {
        text: title + '趋势',
        align: 'left',
        x: 0,
        y: 25,
        style: {
          color: '#409EFF',
          fontSize: '14px',
        }
      },
      this.chart.setTitle(title);   // 标题更新
      this.chart.update({     // 更新
    	series: chartOptions
      })
      this.chart.xAxis[0].setCategories(categories, true);  // x轴刻度值更新
      // this.chart = HighCharts.chart(this.id,this.option)
    }
  }
}
</script>
