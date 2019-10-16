<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row type="flex" class="row-bg" justify="end">
        <el-input
          v-model=" listQuery.facesetToken"
          style="max-width: 200px;"
          placeholder="根据token查询..."/>
        <el-button type="primary" style="margin-left:10px;" @click="search">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </el-row>
    </div>

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
          <el-table-column :fixed="item.fixed" :key="item.displayName" :prop="item.prop" :label="item.label" :min-width="item.width" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row[item.prop] | showstr(item.prop) }}</span>
            </template>
          </el-table-column>
        </template>
        <el-table-column align="center" prop="created_at" label="操作" width="260">
          <template slot-scope="scope">
            <template>
              <el-button type="primary" size="small" icon="el-icon-view" @click="ToView(scope.row.facesetToken)">查看详情</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="$nextTick(()=>{getList()})" />

    </div>
  </div>
</template>
<style scoped>

</style>

<script>
import { userRecordList as fetchList } from '@/api/face'
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
        { prop: 'recordCount', label: '到访次数', fixed: true, width: '' },
        { prop: 'createTime', label: '最近一次到访时间', fixed: true, width: '' }
      ],

      listQuery: {
        page: 1,
        limit: 10,
        storeNo: '0002',
        searchVal: '',
        sort: '+id'
      },
      total: 0,
      list: [],
      formdata: {},
      dialogStatus: '',
      listLoading: false,
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
      this.facesetToken = ''
      this.getList()
    },
    search() { // 搜索
      this.listQuery.page = 1
      this.getList()
    },
    ToView(token) {
      console.log(token)
      this.$router.push({ name: 'operationuseronerecords', query: { facesetToken: token }})
    },
    getList() {
      fetchList(this.listQuery).then(res => {
        this.listLoading = false
        this.list = res.data.list || []
        this.total = res.data.total
      })
    }
  }
}
</script>
