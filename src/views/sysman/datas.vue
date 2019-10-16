<template>
  <div class="app-container">

    <div class="filter-container">
      <el-date-picker
        v-model="daterange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">统计</el-button>
    </div>
    <el-row class="rowdatacards">
      <el-col :xs="8" :sm="6" :md="6" :lg="7" :xl="4" class="datacards" >
        <div class="cardbox bgblue">
          <span>订单数</span>
          <strong>{{ order_count }}</strong>
        </div>
      </el-col>
      <el-col :xs="8" :sm="6" :md="6" :lg="7" :xl="4" class="datacards" >
        <div class="cardbox bggreen">
          <span>销售总价</span>
          <strong>{{ total_sum }}</strong>
        </div>
      </el-col>
      <el-col :xs="8" :sm="6" :md="6" :lg="7" :xl="4" class="datacards" >
        <div class="cardbox bgdanger">
          <span>平台价格</span>
          <strong>{{ cost_price_sum }}</strong>
        </div>
      </el-col>
    </el-row>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <template v-for="item in colTable">
        <el-table-column :fixed="item.fixed" :key="item.id" :prop="item.prop" :label="item.label" :min-width="item.width" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row[item.prop] | showstr(item.prop) }}</span>
          </template>
        </el-table-column>
      </template>

    </el-table>

  </div>
</template>

<script>
import { getSum, getList } from '@/api/datas'
import { parseTime } from '@/utils/index'

const orderStatusOpitons = [
  { key: '-1', display_name: '已取消' },
  { key: '0', display_name: '待认领' },
  { key: '1', display_name: '待出行程' },
  { key: '2', display_name: '待付款' },
  { key: '3', display_name: '待出票' },
  { key: '4', display_name: '已出票' },
  { key: '5', display_name: '待改签' },
  { key: '6', display_name: '待改签补差价' },
  { key: '7', display_name: '改签待出票' },
  { key: '8', display_name: '改签完成' },
  { key: '9', display_name: '待退票' },
  { key: '10', display_name: '退票完成' }
]

const orderStatusMap = orderStatusOpitons.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  filters: {
    showstr(v, prop) {
      if (prop === 'contacts') {
        return v.map(v => { return v.username }).join('\n')
      } else if (prop === 'is_back') {
        return v === '1' ? '往返' : '单程'
      } else if (prop === 'addtime') {
        return parseTime(v)
      } else if (prop === 'status') {
        return orderStatusMap[v]
      }
      return v
    }
  },
  data() {
    return {
      cost_price_sum: 0,
      order_count: 0,
      total_sum: 0,
      colTable: [
        { prop: 'id', label: '订单编号', fixed: true, width: '65px' },
        { prop: 'mobile', label: '注册手机', fixed: true, width: '' },
        { prop: 'departure', label: '出发地', fixed: true, width: '' },
        { prop: 'destination', label: '目的地', fixed: true, width: '' },
        { prop: 'start_date', label: '出发日期', fixed: true, width: '' },
        { prop: 'addtime', label: '订单时间', fixed: true, width: '' },
        { prop: 'status', label: '订单状态', fixed: true, width: '' },
        { prop: 'ticketno', label: '票号', fixed: true, width: '' },
        { prop: 'company', label: '供应商', fixed: true, width: '' },
        { prop: 'total', label: '订单价', fixed: true, width: '' },
        { prop: 'cost_price', label: '内部价', fixed: true, width: '' }
      ],
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        status: 4,
        sort: '+id'
      },
      total: 0,
      list: [],
      formdata: {},
      dialogText: {
        update: '编辑账号',
        create: '添加账号'
      },
      dialogStatus: '',
      listLoading: true,
      isShowDialog: false,
      orderStatusOpitons,
      daterange: ''
    }
  },
  created() {
    this.getList()
    this.getsum()
  },
  methods: {
    getsum() {
      getSum(this.listQuery).then(res => {
        console.log(res)
        this.cost_price_sum = res.data.cost_price_sum
        this.order_count = res.data.order_count
        this.total_sum = res.data.total_sum
      })
    },
    getList() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.data

        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    }
  }
}
</script>
