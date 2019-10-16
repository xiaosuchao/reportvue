<template>
  <div>
    <div class="filter-container">
      <el-row type="flex" class="row-bg" style="padding:20px 30px;" >
        <el-date-picker
          v-model="pubparams.paramdate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"/>
        <el-button type="primary" style="margin-left:10px;" >搜索</el-button>
      </el-row>
    </div>
    <template v-for="(row,ri) in chartslay">
      <el-row :key = "'r'+ri">
        <template v-for="(col,ci) in row">
          <el-col :span="col.col" :key="'c'+ci">
            <template v-if="col.type==='chart'">
              <EchartsCoponent :chart-data="chartsdata[ri+ci]"/>
            </template>
            <template v-else-if="col.type='block'">
              <div>block</div>
            </template>

          </el-col>
        </template>
      </el-row>
    </template>

  </div>
</template>

<script>
import EchartsCoponent from '../components/echart'
import { parseTime } from '@/utils'

import oldc from '../components/testConf'

import axios from 'axios'
export default {
  name: 'Test',
  components: {
    EchartsCoponent
  },
  data() {
    return {
      paramdate: parseTime(new Date()),
      paramaid: '2103020001001',
      pubparams: {
        paramdate: parseTime(new Date()),
        paramaid: '2103020001001'
      },
      chartsdata: [],
      chartsparams: [],
      needfresh: [],
      config_page_env: oldc.config_page_env,
      chartsconfig: oldc.components,
      chartslay: oldc.layout
    }
  },
  watch: {
    'pubparams.paramdate': {
      handler(newval, oldval) {
        this.syncParams('date')
        this.initChart()
      }
    },
    'pubparams.paramaid': {
      handler(newval, oldval) {
        this.syncParams('loc')
        this.initChart()
      }
    }
  },
  created() {
    this.needfresh.length = this.chartsdata.length = oldc.components.length
    this.chartsdata.fill({})
    this.needfresh.fill(true)

    // 将各表的params和公共参数同步
    this.syncParams()

    this.initChart()
  },
  methods: {
    syncParams(ptype) {
      if (ptype) { this.needfresh = this.chartsparams.map(v => { return v.some(vv => { return vv.type === ptype }) }) }
      this.chartsparams = oldc.components.map(v => {
        return v.params.map(vv => {
          if (vv.type === 'date') { vv.value = this.pubparams.paramdate } else if (vv.type === 'loc') { vv.value = this.pubparams.paramaid }
          return vv
        })
      })
    },
    initChart() {
      this.chartsconfig.forEach((v, i) => {
        if (!this.needfresh[i]) { return false }
        const tmpobj = {
          title: {
            text: v.chart.title
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {},
          xAxis: [
            {
              type: 'category'
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: []
        }
        if (!v.chart.datas.some(v => { return v.url })) {
          tmpobj.series = v.chart.datas.map(v => { return { name: v.title, color: 'rgb(106, 220, 246)', data: v.data } })
          this.chartsdata.splice(i, 1, tmpobj)
        } else {
          const arreqs = v.chart.datas.filter(vv => { return vv.url }).map((vv, ii) => {
            let url = vv.url
            this.chartsparams[i].forEach(vvv => { url = url.replace('{' + vvv.name + '}', vvv.value) })
            return axios.get(url)
          })
          axios.all(arreqs).then(results => {
            tmpobj.series = results.map((vr, ri) => { return { name: v.chart.datas[ri]['title'], type: v.chart.datas[ri]['type'], data: vr.data.map(vv => { return [vv.x, vv.y] }) } })
            this.chartsdata.splice(i, 1, tmpobj)
            if (tmpobj.xAxis) {
              results.map((vr, ri) => {
                tmpobj.xAxis.data = vr.data.map(vData => { return vData.x })
              })
            }
            if (v.chart.type === 'funnel') {
              delete tmpobj.xAxis
              delete tmpobj.yAxis
              tmpobj.series = results.map((vr, ri) => { return { name: v.chart.datas[ri]['title'], type: v.chart.datas[ri]['type'], data: vr.data.map(vv => { return { name: vv.x, value: vv.y } }) } })
            }
          })

          if (v.chart.type === 'funnel') {
            console.log('funnel')
          } else {
            const tmpobj = {
              title: {
                text: '漏斗图',
                subtext: '纯属虚构'
              },
              tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c}%'
              },
              legend: {
                data: ['展现', '点击', '访问', '咨询', '订单']
              },

              series: [
                {

                  data: [
                    { value: 60, name: '访问' },
                    { value: 40, name: '咨询' },
                    { value: 20, name: '订单' },
                    { value: 80, name: '点击' },
                    { value: 100, name: '展现' }
                  ]
                }
              ]
            }
            this.chartsdata[i] = tmpobj
          }
        }
        this.needfresh[i] = false
      })
    }
  }

}
</script>

<style scoped>
</style>
