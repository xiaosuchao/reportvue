<template>
  <div>
    <div ref="highchartcon" class="highcharts-container" />
    <div v-if="defData.labelTxts && defData.labelTxts.length" class="labelsbox">
      <template v-for="(item,i) in defData.labelTxts">
        <div :style="item.style" :key="'t'+i" v-html="item.html" />
      </template>
    </div>
  </div>
</template>
<script>
import Highcharts from 'highcharts/highstock'
import HighchartsMore from 'highcharts/highcharts-more'
import HighchartsDrilldown from 'highcharts/modules/drilldown'
import Highcharts3D from 'highcharts/highcharts-3d'
// 树状图中的点（矩形）的颜色是由和它同级的数据点的值来计算的。
// 如果需要 colorAxis 功能则需额外的引入http://cdn.hcharts.cn/highcharts/modules/heatmap.js 。
import HeatMap from 'highcharts/modules/heatmap'
import Exporting from 'highcharts/modules/exporting'
import ExportData from 'highcharts/modules/export-data'
import noData from 'highcharts/modules/no-data-to-display'
import TreeMap from 'highcharts/modules/treemap'
import Funnel from 'highcharts/modules/funnel'
HighchartsMore(Highcharts)
HighchartsDrilldown(Highcharts)
Highcharts3D(Highcharts)
HeatMap(Highcharts)
Exporting(Highcharts)
TreeMap(Highcharts)
Funnel(Highcharts)
ExportData(Highcharts)
noData(Highcharts)
export default {
  name: 'Highcharts',
  props: {
    defData: {
      type: Object,
      required: true
    },
    styles: {
      type: Object,

      required: true,
      default() {
        return {}
      }
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      chart: null
      // divNumber: this.$store.state.test.divNumbers
    }
  },
  watch: {
    // 当外面传进来的defData有变化时重新渲染视图
    defData: function(val, oldVal) {
      this.initChart()
    }
  },
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      // 根据传进来的style设置宽高
      // this.$el.style.width = (this.styles.width || 800) + 'px'
      this.$el.style.width = '100%'
      // this.$el.style.height = (this.styles.height || 400) + 'px'

      Highcharts.setOptions({
        lang: {
          noData: '暂无数据'
        }
      })
      console.log(Highcharts)
      this.chart = new Highcharts.Chart(this.$refs.highchartcon, this.defData)
    },
    exportExcel() {
      alert(this.chart.getCSV())
    }
  }
}
</script>
<style lang='scss'>
.highcharts-container {
  /* width: 800px; */
  /* height: 400px; */
  width: 100%;
}
.labelsbox {
  margin-left: 2%;
  div {
    margin-top: -8px;
  }
}
</style>
