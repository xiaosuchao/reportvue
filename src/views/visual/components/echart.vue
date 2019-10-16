<template>
  <div>
    <div ref="echarts" :id="echarts" style="width:98%;height:400px;" class="echarts" />
  </div>
</template>

<script>
// 引入echarts
import echarts from 'echarts'
export default {
  name: 'EchartsComponents',
  props: {
    // 接收父组件传递过来的信息
    chartData: {
      type: Object,
      default: () => []
    }
  },
  data() {
    return {}
  },
  computed: {
    echarts() {
      return 'echarts' + Math.random() * 100000
    }
  },
  watch: {
    // 当外面传进来的defOptions有变化时重新渲染视图
    chartData: function(val, oldVal) {
      this.drawChart()
    }
  },
  // mounted: function() {
  //   const vm = this
  //   vm.$nextTick(() => {
  //     vm.drawChart()
  //   })
  // },
  created: () => { },
  methods: {
    drawChart() {
      // const vm = this
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById(this.echarts))
      // 绘制图表
      myChart.setOption(this.chartData, true)
      window.onresize = () => {
        // 这里使用箭头函数，避免this指向问题
        myChart.resize()
        myChart.resize()
      }
    }
  }
}
</script>

<style scoped>
</style>

