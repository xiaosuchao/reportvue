<template>
  <div :style="{'background':defConf.chart.datas[0]['backgroudColor']}" class="chart_today">
    <div >
      <p>{{ (defData && defData.series && defData.series.length)? defData.series[0]['data'][0]['y']:'' }}</p>
      <p v-html="(defData && defData.series && defData.series.length)? defData.series[0]['data'][0]['z'] :''"/>
      <p>
        {{ (defData && defData.series && defData.series.length)? defData.series[0]['name'] :'' }}
        <el-tooltip v-if="defConf['icontent']" placement="right" effect="light" popper-class="charthtip">
          <div slot="content" v-html="defConf['icontent']"/>
          <svg-icon icon-class="linequestion" />
        </el-tooltip>
      </p>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    defData: {
      type: Object,
      required: true
    },
    defConf: {
      type: Object,
      required: true
    }
  },
  data() {
    return {

    }
  }
}
</script>
<style lang="scss" scoped>

.chart_today{
    margin:0px 8px; min-height: 146px;
    p:nth-child(1){
        color:#fff;
        padding-top: 25px;
        padding-right:10px;
        text-align: right;
        font-size: 34px;
        line-height: 36px;
        letter-spacing: -1px;
        margin-bottom: 0px;
    }
    p:nth-child(2){
        color:#fff;
        padding-top: 0px;
        padding-right:10px;
        text-align: right;
        font-size: 14px;
        line-height: 20px;
        letter-spacing: -1px;
        margin-bottom: 0px;
    }
    p:nth-child(3){
        color:#fff;
        padding-top: 0px;
        padding-right:10px;
        padding-bottom:6px;
        text-align: right;
        font-size: 16px;
        line-height: 26px;
        letter-spacing: -1px;
        margin-bottom: 0px;
    }
}

</style>
