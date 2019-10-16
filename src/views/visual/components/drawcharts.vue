<template>
  <div id="vrt" class="vrt">
    <div class="filter-container">
      <el-form :inline="true" class="demo-form-inline" label-width="80px">
        <el-form-item v-show="pubparams.paramaid.isshow" label="选择门店">
          <el-input v-model="locname" placeholder="选择门店" @focus="isshowtreedialog=true" />
        </el-form-item>

        <el-form-item v-show="pubparams.paramdate.isshow" label="选择日期">
          <!-- <template v-if="pubparams.paramdate.muti">
            <el-date-picker
              v-model="pubparams.paramdate.value"
              :picker-options="pickerOptions"
              :format="pubparams.paramdate.valueformat.indexOf('HH')>0?'yyyy-MM-dd HH:MM':'yyyy-MM-dd'"
              :value-format="pubparams.paramdate.valueformat"
              :type="pubparams.paramdate.valueformat.indexOf('HH')>0?'datetimerange':'daterange'"
              start-placeholder="开始日期"
              end-placeholder="结束日期"/>
          </template>
          <template v-else>
            <el-date-picker
              v-model="pubparams.paramdate.value"
              :format="pubparams.paramdate.valueformat.indexOf('HH')>0?'yyyy-MM-dd HH:MM':'yyyy-MM-dd'"
              :value-format="pubparams.paramdate.valueformat"
              :type="pubparams.paramdate.valueformat.indexOf('HH')>0?'datetime':'date'"
              placeholder="选择日期"/>

          </template>-->

          <el-date-picker
            v-model="pubparams.paramdate.value"
            :picker-options="pubparams.paramdate.valueformat.indexOf('HH')>0?'':'pickerOptions'"
            :format="pubparams.paramdate.valueformat.indexOf('HH')>0?'yyyy-MM-dd HH:MM':'yyyy-MM-dd'"
            :value-format="pubparams.paramdate.valueformat"
            :type="pubparams.paramdate.muti?(pubparams.paramdate.valueformat.indexOf('HH')>0?'datetimerange':'daterange'):(pubparams.paramdate.valueformat.indexOf('HH')>0?'datetime':'date')"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button v-if="pubparams.btnfresh.isshow" type="primary" @click="freshChart">刷新</el-button>
        </el-form-item>
      </el-form>
    </div>

    <template v-for="(row,ri) in chartslay">
      <el-row :key="'r'+ri">
        <template v-for="(cell,ci) in row">
          <el-col :span="cell.col" :key="'c'+ci">
            <template v-if="cell.type==='chart'">
              <dl>
                <dt>
                  <strong>{{ chartslay[ri][ci]['title'] || (chartsdata[layindex[ri+','+ci]]['title']?chartsdata[layindex[ri+','+ci]]['title']['text']:'') }}</strong>
                  <el-tooltip
                    v-if="chartsconfig[layindex[ri+','+ci]]['icontent']"
                    placement="right"
                    effect="light"
                    popper-class="charthtip"
                  >
                    <div slot="content" v-html="chartsconfig[layindex[ri+','+ci]]['icontent']" />
                    <svg-icon icon-class="linequestion" />
                  </el-tooltip>
                </dt>
                <dd>
                  <div class="filter-container">
                    <template v-for="param in chartsparams[ri+ci]">
                      <template v-if="param.type==='date' && param.isshow">
                        <el-form
                          :inline="true"
                          :key="'pfiler'+param.name"
                          class="demo-form-inline"
                          label-width="80px"
                        >
                          <el-form-item label="选择日期">
                            <el-date-picker
                              v-model="param.value"
                              type="date"
                              value-format="yyyy-MM-dd"
                              placeholder="选择日期"
                              @change="changeparam(layindex[ri+','+ci])"
                            />
                          </el-form-item>
                        </el-form>
                      </template>
                    </template>
                  </div>
                  <highcharts-container
                    :def-data="chartsdata[layindex[ri+','+ci]]"
                    :index="ci+ri"
                    :styles="sty"
                  />
                </dd>
              </dl>
            </template>
            <template v-else-if="cell.type==='block'">
              <block
                :def-data="chartsdata[layindex[ri+','+ci]]"
                :def-conf="chartsconfig[layindex[ri+','+ci]]"
              />
            </template>
            <template v-else-if="cell.type==='weather'">
              <dl>
                <dt>
                  <strong>{{ chartslay[ri][ci]['title'] || (chartsdata[layindex[ri+','+ci]]['title']?chartsdata[layindex[ri+','+ci]]['title']['text']:'') }}</strong>
                  <el-tooltip
                    v-if="chartsconfig[layindex[ri+','+ci]]['icontent']"
                    placement="right"
                    effect="light"
                    popper-class="charthtip"
                  >
                    <div slot="content" v-html="chartsconfig[layindex[ri+','+ci]]['icontent']" />
                    <svg-icon icon-class="linequestion" />
                  </el-tooltip>
                </dt>
              </dl>
              <weather :def-data="chartsdata[layindex[ri+','+ci]]" :notice-org="pubparams.paramaid.value" :begin-date="pubparams.paramdate.value" />
            </template>
            <template v-else-if="cell.type==='heatcavmap'">
              <heatcavmap
                v-if="isshowChart"
                :def-data="chartsdata[layindex[ri+','+ci]]"
                :def-conf="chartsconfig[layindex[ri+','+ci]]"
              />
            </template>
            <template v-else-if="cell.type==='table'">
              <h3>
                <div class="ltbox">
                  <strong>{{ chartslay[ri][ci]['title'] || (chartsdata[layindex[ri+','+ci]]['title']?chartsdata[layindex[ri+','+ci]]['title']['text']:'') }}</strong>
                  <el-tooltip
                    v-if="chartsconfig[layindex[ri+','+ci]]['icontent']"
                    placement="right"
                    effect="light"
                    popper-class="charthtip"
                  >
                    <div slot="content" v-html="chartsconfig[layindex[ri+','+ci]]['icontent']" />
                    <svg-icon icon-class="linequestion" />
                  </el-tooltip>
                </div>
                <div class="rtbox">
                  <el-form :inline="true" class="demo-form-inline" label-width="80px">
                    <template v-for="param in chartsparams[ri+ci]">
                      <template v-if="param.isshow ">
                        <el-form-item :label="param.title" :key="'pfiler'+param.name">
                          <template v-if="param.type==='date'">
                            <el-date-picker
                              v-model="param.value"
                              type="date"
                              value-format="yyyy-MM-dd"
                              placeholder="选择日期"
                              @change="changeparam(layindex[ri+','+ci])"
                            />
                          </template>
                          <template v-else-if="param.type==='level'">
                            <el-select
                              v-model="param.value"
                              placeholder="请选择"
                              @change="changeparam(layindex[ri+','+ci])"
                            >
                              <el-option
                                v-for="opt in param.aropts"
                                :key="opt.value"
                                :label="opt.label"
                                :value="opt.value"
                              />
                            </el-select>
                          </template>
                        </el-form-item>
                      </template>
                    </template>
                  </el-form>
                </div>
              </h3>
              <tablec
                :def-data="chartsdata[layindex[ri+','+ci]]"
                :def-conf="chartsconfig[layindex[ri+','+ci]]"
              >111</tablec>
            </template>
          </el-col>
        </template>
      </el-row>
    </template>

    <orgtree
      v-if="confurl"
      :isshowtreedialog="isshowtreedialog"
      :orgtreedepth="orgtreedepth"
      @chloc="selectloc"
    />
    <remotejs v-if="switchLoadJs" :js-load-call-back="dealConf" :js-url="confurl" />
  </div>
</template>

<style lang="scss" scoped>
.vrt {
  padding-bottom: 30px;
}
.el-form--inline .el-form-item {
  margin-bottom: 12px;
}
.filter-container {
  padding: 15px 0 0px;
}
dl,
dd {
  margin: 0;
  padding: 0;
}
.el-col {
  dl {
    padding: 15px;
    dt {
      border-bottom: 1px solid #e6e6e6;
      padding-bottom: 15px;
      strong {
        color: rgb(64, 158, 255);
        font-size: 15px;
        margin-right: 5px;
      }
    }
  }
}
h3 {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e6e6e6;
  padding-bottom: 15px;
  line-height: 40px;
  margin: 0;
  padding: 12px 10px;
  color: #00adef;
  margin-right: 5px;
  font-size: 15px;
  .ltbox {
  }
  .rtbox {
    .el-form--inline .el-form-item {
      margin-bottom: 0px;
      margin-right: 6px;
    }
  }
}
.blockcell {
  margin: 0px 8px;
  p:nth-child(1) {
    color: #fff;
    padding-top: 25px;
    padding-right: 10px;
    text-align: right;
    font-size: 34px;
    line-height: 36px;
    letter-spacing: -1px;
    margin-bottom: 0px;
  }
  p:nth-child(2) {
    color: #fff;
    padding-top: 25px;
    padding-right: 10px;
    text-align: right;
    font-size: 16px;
    line-height: 36px;
    letter-spacing: -1px;
    margin-bottom: 0px;
    font-weight: 300;
  }
}

body >>> .charthtip.is-light {
  border: 1px solid #e6e6e6;
  color: #333;
  line-height: 20px;
  font-size: 13px;
}
</style>

<script>
import { Loading } from 'element-ui'
import store from '@/store'
import { mapGetters } from 'vuex'
import HighchartsContainer from '../components/chart.vue'
import { parseTime } from '@/utils'
import remotejs from '../../components/remotejs'
import orgtree from './orgtree'
import block from './block'
import weather from './weather'
import heatcavmap from './heatcavmap'
import tablec from './tablec'

import axios from 'axios'
let loadingRequest
export default {
  name: 'Highcharts',
  components: {
    HighchartsContainer,
    remotejs,
    orgtree,
    block,
    weather,
    heatcavmap,
    tablec
  },
  props: {
    confurl: {
      type: String,
      default: ''
    },
    orgtreedepth: {
      type: Number,
      default: 0
    },
    refresh: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // pubparams: 公共参数：店铺选择、日期、刷新按钮的配置
      // switchLoadJs: 重新加载js配置文件的开关
      // locname: 当前店铺的名称
      // isshowtreedialog: 选择店铺弹窗的开关
      // inited: 是否初始化过
      // chartsdata, chartsparams,needfresh：charts的data,params,是否需要刷新的数组

      pubparams: {
        paramdate: {
          value: '',
          muti: false,
          isshow: true,
          valueformat: 'yyyy-MM-dd'
        },
        paramaid: {
          value: '',
          isshow: true
        },
        btnfresh: {
          isshow: false
        }
      },
      switchLoadJs: true,
      locname: '',
      isshowtreedialog: false,
      inited: false,
      chartsdata: [],
      chartsparams: [],
      needfresh: [],
      objrelate: {},

      config_page_env: {},
      chartsconfig: [],
      chartslay: [],
      layindex: {},
      isshowChart: true,

      sty: {
        width: '100%'
      },

      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            console.log('最近一个月', start, end)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近六个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 180)
            picker.$emit('pick', [start, end])
          }
        }]
      }

    }
  },
  computed: {
    ...mapGetters([
      'chartDateSingle',
      'chartLoc',
      'chartDateRange'
    ])
  },
  watch: {
    'pubparams.paramdate.value': {
      handler(newval, oldval) {
        console.log('paramdate change', newval, oldval, 'this.inited:', this.inited)
        if (this.pubparams.paramdate.muti) {
          store.dispatch('setChartDateRange', newval)
        } else {
          store.dispatch('setChartDateSingle', newval)
        }
        this.syncParams('date')
        this.inited && this.draw()
      },
      immediate: true
    },
    'pubparams.paramaid.value': {
      handler(newval, oldval) {
        console.log('loc change', newval, oldval, 'this.inited:', this.inited)
        this.syncParams('loc')
        this.inited && this.draw()
      }
    },
    'confurl': {
      handler(newval, oldval) {
        console.log('watch confurl newval', newval)
        if (loadingRequest) {
          loadingRequest.close()
        }
        this.inited = false
        // this.pubparams.paramaid.value = ''
        this.switchLoadJs = false
        this.$nextTick(() => (this.switchLoadJs = true))
      }
    },
    'refresh': {
      handler(newval, oldval) {
        if (newval) {
          this.freshChart()
          setTimeout(() => this.$emit('donefresh'), 300)
        }
      }
    }
  },
  created() {
  },
  mounted() {

  },
  beforeDestroy() {
    if (loadingRequest) {
      loadingRequest.close()
    }
  },
  methods: {
    // defConf  处理配置文件，分配到各data变量
    dealConf() {
      console.log('loadjs complete ..........')
      const tmppubparams = window.objVisualConf.pubparams
      if (tmppubparams) {
        const tmploc = tmppubparams.filter(v => { return v.type === 'loc' }).length ? tmppubparams.filter(v => { return v.type === 'loc' })[0] : {}
        this.pubparams.paramaid = Object.assign({}, this.pubparams.paramaid, tmploc, { isshow: tmploc.isshow && true })
        const tmpdate = tmppubparams.filter(v => { return v.name === 'dates' }).length ? tmppubparams.filter(v => { return v.name === 'dates' })[0] : {}

        console.log('=======', this.chartDateSingle)
        this.pubparams.paramdate.valueformat = tmpdate.valueformat || 'yyyy-MM-dd'
        if (tmpdate.multival) {
          this.pubparams.paramdate.muti = true
          this.pubparams.paramdate.value = this.chartDateRange ? this.chartDateRange.map((v, i) => { return parseTime(v, this.pubparams.paramdate.valueformat) }) : [parseTime(new Date().getTime() - 3600 * 1000 * 24 * 1, this.pubparams.paramdate.valueformat), parseTime(new Date(), this.pubparams.paramdate.valueformat)]
        } else {
          this.pubparams.paramdate.muti = false
          this.pubparams.paramdate.value = this.chartDateSingle ? parseTime(this.chartDateSingle, this.pubparams.paramdate.valueformat) : parseTime(new Date(), this.pubparams.paramdate.valueformat)
        }

        this.pubparams.btnfresh.isshow = (tmppubparams.some(v => { return v.name === 'btnfresh' }) && tmppubparams.filter(v => { return v.name === 'btnfresh' })[0].isshow)
      }

      this.config_page_env = window.objVisualConf.config_page_env
      this.chartsconfig = window.objVisualConf.components
      this.chartslay = window.objVisualConf.layout
      const objtmpi = {}
      let tmpi = 0
      this.chartslay.forEach((v, i) => {
        v.forEach((vv, ii) => {
          objtmpi[i + ',' + ii] = tmpi
          tmpi++
        })
      })
      this.layindex = objtmpi

      window.chartvue = this
      this.needfresh.length = this.chartsdata.length = this.chartsconfig.length
      this.chartsdata.fill({})
      this.needfresh.fill(true)

      this.chartsconfig.forEach((v, i) => {
        if (v.relate && v.relate.length) {
          v.relate.forEach((vv, ii) => {
            if (!this.objrelate[vv.chartid]) { this.objrelate[vv.chartid] = [] }
            this.objrelate[vv.chartid].push({ index: i, maps: vv.maps })
          })
        }
      })

      // 将各表的params和公共参数同步
      this.syncParams()

      console.log('syncParamed next draw....')
      this.$nextTick(() => { this.draw() })
    },
    syncParams(ptype) {
      if (ptype) { this.needfresh = this.chartsparams.map(v => { return v.some(vv => { return vv.type === ptype }) }) }
      this.chartsparams = this.chartsconfig.map(v => {
        return v.params.map(vv => {
          if (vv.pubpams) {
            if (vv.type === 'date') { vv.value = this.pubparams.paramdate.value } else if (vv.type === 'loc') { vv.value = this.pubparams.paramaid.value }
          } else {
            vv.value = vv.value || (vv.defvalue ? (vv.defvalue.indexOf('{') > -1 ? '' : vv.defvalue) : '')
          }
          if (vv.type === 'level') {
            const artxt = vv.menuname.split('/')
            const arv = vv.menuvalue.split('/')
            vv.aropts = artxt.map((vvv, iii) => { return { label: vvv, value: arv[iii] } })
          }
          return vv
        })
      })
    },
    changeparam(i) {
      this.needfresh[i] = true
      this.draw()
    },
    draw() {
      console.log('start draw,this.inited', this.inited, 'aid isshow', this.pubparams.paramaid.isshow, 'aid value', this.pubparams.paramaid.value)
      if (this.pubparams.paramaid.isshow && !this.pubparams.paramaid.value) { this.inited = true; return }
      console.log('real can draw')
      console.log(this.chartsconfig)
      this.chartsconfig.forEach((v, i) => {
        if (!this.needfresh[i]) { return false }
        if (v.type === 'heatcavmap') {
          const tmpobj = Object.assign({}, this.chartsdata[i])
          tmpobj.img = v.chart.backgroundImg.replace('{loc}', this.pubparams.paramaid.value)
          tmpobj.data = []
          this.chartsdata.splice(i, 1, tmpobj)

          if (v.chart.url) {
            let url = v.chart.url
            this.chartsparams[i].forEach(vvv => { url = url.replace('{' + vvv.name + '}', (vvv.type === 'date' && vvv.rangeval) ? vvv.value.join('||') : vvv.value) })
            console.log(v.chart.type, 'v.chart.type')
            // if (v.chart.type !== 'heatcavmap')loadingRequest = Loading.service({ target: '#vrt', background: 'rgba(0, 0, 0, 0)', text: '正在加载数据...' })
            loadingRequest = Loading.service({ target: '#vrt', background: 'rgba(0, 0, 0, 0)', text: '正在加载数据...' })
            const nowcfgurl = this.confurl
            axios.get(url).then(res => {
              if (nowcfgurl !== this.confurl) { return }
              console.log(res.data)
              this.inited = true
              tmpobj.data = (res.data && res.data.length) ? res.data.map((vv, ii) => { vv.value = vv.count; return vv }) : []
              const aaa = Object.assign({}, tmpobj)
              this.chartsdata.splice(i, 1, aaa)
              loadingRequest.close()
            })
          } else {
            if (v.chart.data) {
              tmpobj.data = v.chart.data.map((vv, ii) => { vv.value = vv.count; return vv })
            }
            this.chartsdata.splice(i, 1, tmpobj)
          }
        } else {
          console.log('vchart', v.chart)
          const tmpobj = Object.assign({ colors: ['#00adef', '#666666', '#fcb326', '#00ffff', '#176db7', '#ff0000',
            '#222222', '#9f0002', '#6adcf6', '#badba4', '#fbabab', '#d87a80',
            '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa',
            '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
            '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089']

          }, v.chart, {
            id: v.id,
            title: {
              text: v.chart.title
            },
            noData: {
              style: {
                fontWeight: 'bold',
                fontSize: '15px',
                color: '#303030'
              }
            },
            labels: { items: [] }
          })
          let cseries = (tmpobj.plotOptions && tmpobj.plotOptions.series) ? tmpobj.plotOptions.series : {}
          cseries = Object.assign({}, cseries, {
            cursor: 'pointer',
            events: {
              click: function(e) {
              }
            }
          })
          tmpobj.plotOptions = tmpobj.plotOptions || {}
          tmpobj.plotOptions = Object.assign({}, tmpobj.plotOptions, { series: cseries })
          tmpobj.lang = Object.assign({}, (tmpobj.lang || {}), {
            printChart: '打印图表',
            viewFullscreen: '全屏视图',
            downloadJPEG: '下载JPEG 图片',
            downloadXLS: '下载XLS文件',
            downloadCSV: '下载CSV文件',
            downloadPDF: '下载PDF文档',
            downloadPNG: '下载PNG 图片',
            downloadSVG: '下载SVG 矢量图',
            exportButtonTitle: '导出图片',
            noData: '暂无数据',
            contextButtonTitle: '导出'
          })
          if (this.objrelate[v.id]) {
            if (this.chartsconfig[i]['tool'] === 'highchart') {
              tmpobj.plotOptions.series.events.click = (e) => {
                this.objrelate[v.id].forEach((vv, ii) => {
                  vv.maps.forEach((vvv, iii) => {
                    let rdata = ''
                    if (vvv.relateparam === 'x') {
                      rdata = e.point.category[0]
                    } else if (vvv.relateparam === 'y') {
                      rdata = e.point.y
                    } else {
                      rdata = this.chartsparams[i].filter(vvvv => { return vvvv.name === vvv.relateparam })[0].value
                    }
                    this.chartsparams[vv.index].filter(vvvv => { return vvvv.name === vvv.myparam })[0].value = vvv.fn ? vvv.fn(rdata) : rdata
                    this.needfresh[vv.index] = true
                  })
                })
                this.draw()
              }
            }
          }

          if (!v.chart.datas.some(v => { return v.url })) {
            tmpobj.xAxis = { categories: v.chart.datas[0].data.map(vv => { return [vv.x] }) }
            tmpobj.series = v.chart.datas.map(v => {
              return Object.assign({}, v, { name: v.title, data: v.data.map(vv => { vv.name = vv.x || vv.name || ''; delete vv.x; return vv }) })
            })
            this.chartsdata.splice(i, 1, tmpobj)
          } else {
            const arreqs = v.chart.datas.filter(vv => { return vv.url }).map((vv, ii) => {
              let url = vv.url
              this.chartsparams[i].forEach(vvv => { url = url.replace('{cityId}', this.pubparams.paramaid.value.substring(0, 6)).replace(new RegExp('\{' + vvv.name + '\}', 'gi'), (vvv.type === 'date' && vvv.rangeval) ? vvv.value.join('||') : vvv.value) })
              return axios.get(url)
            })
            let arIsLabel = []
            const nowcfgurl = this.confurl
            axios.all(arreqs).then(results => {
              if (this.confurl !== nowcfgurl) { return }
              if (results.length && results[0].data && results[0].data.length && results[0].data[0].data) {
                arIsLabel = results[0].data[0].data.filter((vv) => { return vv.labels })

                tmpobj.xAxis = { categories: results[0].data[0].data.map(vv => { return [vv.name] }) }
                tmpobj.series = results[0].data.map((vr, ri) => {
                  console.log('vr', vr)
                  return {
                    name: vr['name'],
                    type: vr['type'],
                    data: vr.data && vr.data.filter(vv => { return !vv.labels }).map(vv => { vv.name = vv.x || vv.name || ''; delete (vv.x); return vv })
                  }
                })
              } else {
                results = results.length ? results : []
                console.log('results', results)
                tmpobj.series = results.map((vr, ri) => {
                  return Object.assign({}, v.chart.datas[ri], { name: v.chart.datas[ri]['title'], data: (vr.data && vr.data.length) ? vr.data.map(vv => { vv.name = vv.x || vv.name || ''; delete (vv.x); return vv }) : [] })
                  // return {
                  //   name: v.chart.datas[ri]['title'],
                  //   type: v.chart.datas[ri]['type'],
                  //   data: vr.data.map(vv => { vv.name = vv.x || vv.name || ''; delete (vv.x); return vv })
                  // }
                })
                results.map((vr, ri) => {
                  tmpobj.xAxis = { categories: (vr.data && vr.data.length) ? vr.data.map(vv => { return [vv.name] }) : [] }
                })
              }

              // 在charts里面的labes
              // if (arIsLabel.length) {
              //   tmpobj.labels.items = arIsLabel.map(vv => {
              //     return {
              //       html: vv.labels.text,
              //       style: vv.labels.style
              //     }
              //   })
              // }
              if (arIsLabel.length) {
                tmpobj.labelTxts = arIsLabel.map(vv => {
                  return {
                    html: '<p style="left: 3px; top: 0px; color: rgb(102, 102, 102); font-size: 12px;font-family: 微软雅黑;">' + vv.labels.text + '</p>'
                    // style: vv.labels.style
                    // html: vv.labels.text,
                  }
                })
              }
              // 如果是30日客流，把周六日的标记颜色 START
              if (tmpobj['id'] === 'monthflow') {
                let arx = [...tmpobj['xAxis']['categories']]
                const strYear = parseTime(this.pubparams.paramdate.value || new Date(), 'yyyy')
                arx = arx.map(vv => { return [6, 0].includes(new Date(strYear + '-' + vv).getDay()) })
                tmpobj.xAxis.categories = tmpobj.xAxis.categories.map((vv, ii) => {
                  if (arx[ii]) {
                    vv = '<a style="color:red" id="toolip">' + vv + '</a>'

                    //  vv.addEventListen
                  }
                  return vv
                })

                // tmpobj.xAxis.labels = { formatter: function() {
                //   return '<span style=color:red>' + this.value + '</span>'
                // } }
                console.log('monthflow...........................', tmpobj.xAxis.categories)
                console.log('this is monthflow', tmpobj, arx)
              }
              console.log('tmpobj', tmpobj)
              // 如果是30日客流，把周六日的标记颜色 END
              this.chartsdata.splice(i, 1, tmpobj)
              this.inited = true
            })

            if (v.chart.type === 'spline') {
              console.log('spline')
            } else if (v.chart.type === 'column') {
              console.log('column')
            } else if (v.chart.type === 'funnel') {
              console.log('funnel')
            } else if (v.chart.type === 'line') {
              console.log('line')
            } else {
              // const tmpobj = {
              //   chart: {
              //     type: 'column'
              //   },
              //   title: {
              //     text: '展厅重点车型客流'
              //   },
              //   subtitle: {
              //     text: '数据来源：thesolarfoundation.com'
              //   },
              //   series: [{
              //     name: '用户',
              //     data: [
              //       ['访问网站', 15654],
              //       ['下载产品', 4064],
              //       ['询价', 1987],
              //       ['发送合同', 976],
              //       ['成交', 846]
              //     ]
              //   }]
              // }
              // this.chartsdata[i] = tmpobj
            }
          }
        }

        this.needfresh[i] = false
      })
    },
    selectloc(obj) {
      console.log('typeofobj', obj, typeof (obj))
      if (obj) {
        this.pubparams.paramaid.value = obj.organizationAddressCode
        this.locname = obj.organizationName
        store.dispatch('setChartLoc', obj)
      }
      this.isshowtreedialog = false
    },
    freshChart() {
      this.needfresh = this.needfresh.map(v => { return true })
      this.draw()
    }
  }
}
</script>
<style lang="scss">
  .highcharts-menu{
    .highcharts-menu-item:nth-child(11){
      display:none!important;
    }
    .highcharts-menu-item:nth-child(12){
      display:none!important;
    }
  }
</style>
