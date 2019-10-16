<template>
  <div class="app-container">
    <el-row type="flex" class="row-bg" style="padding-bottom:15px;">
      <el-col :span="12">
        <el-button type="primary" @click="historyBack">返回上一级</el-button>
      </el-col>
      <el-col :span="12" style="display:flex; justify-content:flex-end;">
        <el-input
          v-model=" listQuery.faceToken"
          style="max-width: 200px;"
          placeholder="根据facetoken查询..."/>
        <el-button type="primary" style="margin-left:10px;" @click="search">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </el-col>

    </el-row>
    <div class="faceData">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row>
        <el-table-column label="序号" type="index" width="50" fixed align="center">
          <template slot-scope="scope">
            <span>{{ (listQuery.page-1) * listQuery.limit + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <template v-for="item in colTable">
          <el-table-column :fixed="item.fixed" :key="item.faceToken" :prop="item.prop" :label="item.label" :min-width="item.width" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row[item.prop] | showstr(item.prop) }} </span>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="$nextTick(()=>{getList()})" />
    </div>
  </div>
</template>

<script>
import { facelistByfaceset as fetchList } from '@/api/face'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'

export default {
  filters: {
    showstr(v, prop) {
      if (prop === 'createTime' || prop === 'endTime') { return parseTime(v) }
      return v
    }
  },
  components: {
    Pagination
  },
  data() {
    return {
      colTable: [
        { prop: 'faceToken', label: 'faceToken', fixed: true, width: '' },
        { prop: 'facesetToken', label: 'facesetToken', fixed: true, width: '' },
        { prop: 'storeNo', label: '门店', fixed: true, width: '' },
        { prop: 'deviceNo', label: '设备', fixed: true, width: '' },
        { prop: 'createTime', label: '到访时间', fixed: true, width: '' }
      ],
      listQuery: {
        page: 1,
        pageSize: 20,
        facesetToken: this.$route.query.facesetToken,
        faceToken: this.$route.query.faceToken,
        sort: '+id',
        storeNo: '0002',
        deviceNo: '',
        createTime: ''

      },
      total: 0,
      list: [],
      formdata: {},
      dialogStatus: '',
      listLoading: true,
      isShowDialog: false,
      optsStatus: [],
      facesetToken: '',
      proporg: {
        label: 'organizationName',
        value: 'organizationId',
        children: 'children'
      },
      showGrantDialog: false,
      defaultGrantTab: 'tabGrantData',
      pages: ''
    }
  },
  computed: {

  },
  created() {
    this.getList()
  },
  methods: {
    reset() { // 重置
      this.faceToken = ''
      this.getList()
    },
    search() { // 搜索
      this.listQuery.page = 1
      this.getList()
    },
    historyBack() {
      window.history.back()
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(res => {
        this.listLoading = false
        this.list = res.data.list || []
        this.total = res.data.total
      })
    }

  }
}
</script>
