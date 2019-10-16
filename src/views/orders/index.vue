<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input v-model="listQuery.id" placeholder="订单编号或手机号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.status" placeholder="类型" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in orderStatusOpitons" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
      <el-select v-if="'admin'.indexOf(roles) >-1 " v-model="listQuery.admin_id" placeholder="操作人" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in arUsersList" :key="item.id" :label="item.nickname" :value="item.id"/>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>

      <template v-if="'admin'.indexOf(roles) >-1 ">
        <span style="margin-left:30px;">转移给：</span>
        <el-select v-model="moveToUserId" placeholder="转移给" clearable class="filter-item" style="width: 130px">
          <el-option v-for="item in arUsersList" :key="item.id" :label="item.nickname" :value="item.id"/>
        </el-select>
        <el-button v-waves type="primary" @click="handleTransfer">转移</el-button>
      </template>

    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @row-click="selrow"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55"/>
      <template v-for="item in colTable">
        <el-table-column :fixed="item.fixed" :key="item.id" :prop="item.prop" :label="item.label" :min-width="item.width" align="center" >
          <template slot-scope="scope">
            <span>{{ scope.row[item.prop] | showstr(item.prop) }}</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column align="center" prop="created_at" label="操作" width="170">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status==='0'" type="primary" size="small" @click="hanleClaim(scope.row)">认领</el-button>
          <el-button v-if="scope.row.status==='3' || scope.row.status==='7'" type="primary" size="small" @click="issueHandle(scope.row)">出票</el-button>
          <el-button v-if="scope.row.status==='9'" type="primary" size="small" @click="handleLoadReturn(scope.row)">退票</el-button>
          <el-button type="primary" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :visible.sync="isShowDetail" title="订单详情" width="80%">
      <el-tabs type="border-card">
        <el-tab-pane label="订单信息">
          <el-form ref="infoform" class="col2form" label-width="80px">
            <el-form-item label="订单编号">
              {{ tmpitem.id }}
            </el-form-item>
            <el-form-item label="手机号">
              {{ tmpitem.mobile }}
            </el-form-item>
            <el-form-item label="订单行程">
              {{ tmpitem.departure +' - '+ tmpitem.destination }}
            </el-form-item>
            <el-form-item label="人数">
              {{ tmpitem.contacts.length }}
            </el-form-item>
            <el-form-item label="出发城市">
              {{ tmpitem.departure }}
            </el-form-item>
            <el-form-item label="目的城市">
              {{ tmpitem.destination }}
            </el-form-item>

            <el-form-item label="行程日期">
              {{ tmpitem.start_date }}
            </el-form-item>
            <el-form-item label="返程日期">
              {{ tmpitem.end_date }}
            </el-form-item>

            <el-table :data="tmpitem.contacts">
              <template v-for="item in colPerson">
                <el-table-column :fixed="item.fixed" :key="item.id" :prop="item.prop" :label="item.label" :min-width="item.width" align="center">
                  <template slot-scope="scope">
                    <template v-if="item.prop == 'photo' && scope.row[item.prop]">
                      <div class="photobox">
                        <a v-for="(itemp,pi) in JSON.parse(scope.row[item.prop]) " :href="'http://wuzhou.libokai.cn/'+itemp" :key="'p'+pi" target="_blank" ><img :src="'http://wuzhou.libokai.cn/'+itemp" alt=""></a>
                      </div>
                    </template>
                    <template v-else>
                      <span>{{ scope.row[item.prop] | showstr(item.prop) }}</span>
                    </template>
                  </template>
                </el-table-column>
              </template>
            </el-table>
          </el-form>

        </el-tab-pane>
        <el-tab-pane label="发送行程">
          <el-form ref="scheduleform" :model="scheduleform" :rules="schrules" class="col2form scheduleform" label-width="80px">
            <template v-for="(schitem,i) in scheduleform.ticket_info" >
              <section :key="'sch'+i">
                <el-form-item label="出发城市">
                  <el-input v-model="schitem.start_city" placeholder="出发城市"/>
                </el-form-item>
                <el-form-item label="航司">
                  <el-input v-model="schitem.airport_company" placeholder="航司"/>
                </el-form-item>
                <el-form-item label="航班">
                  <el-input v-model="schitem.airport_no" placeholder="航班"/>
                </el-form-item>
                <el-form-item label="出发机场" class="inp2out">
                  <el-input v-model="schitem.start_airport" placeholder="机场"/>
                  <el-input v-model="schitem.start_tower" placeholder="航站楼"/>
                </el-form-item>
                <el-form-item label="出发时间">
                  <el-date-picker
                    v-model="schitem.start_time"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择时间"/>
                </el-form-item>
                <el-form-item label="飞行时间">
                  <el-input v-model="schitem.duration" placeholder="飞行时间"/>
                </el-form-item>
                <el-form-item label="机型">
                  <el-input v-model="schitem.airport_type" placeholder="机型"/>
                </el-form-item>
                <el-form-item label="到达城市">
                  <el-input v-model="schitem.arrive_city" placeholder="到达城市"/>
                </el-form-item>
                <el-form-item label="到达机场" class="inp2out">
                  <el-input v-model="schitem.arrive_airport" placeholder="到达机场"/>
                  <el-input v-model="schitem.arrive_tower" placeholder="航站楼"/>
                </el-form-item>
                <el-form-item label="到达时间">
                  <el-date-picker
                    v-model="schitem.arrive_time"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="到达时间"/>
                </el-form-item>
                <el-form-item label="转机事项">
                  <el-input v-model="schitem.description" placeholder="转机事项"/>
                </el-form-item>
                <el-form-item label="">
                  <el-checkbox v-model="schitem.is_visa" >需要过境签</el-checkbox>
                </el-form-item>

                <el-button v-if="i>0" type="danger" class="btndel" icon="el-icon-delete" circle @click="delleg(i)"/>
                <el-button v-if="i== scheduleform.ticket_info.length-1" type="success" class="btnadd" icon="el-icon-plus" circle @click="addleg(i)"/>
              </section>

            </template>
            <el-form-item label="订单价格" prop="tot_price">
              <el-input v-model="scheduleform.total" placeholder="订单价格"/>
            </el-form-item>
            <el-form-item label="内部价格">
              <el-input v-model="scheduleform.cost_price" placeholder="内部价格"/>
            </el-form-item>
            <el-form-item label="支付时效" prop="deadline">
              <el-date-picker
                v-model="scheduleform.deadline"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择时间"/>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="scheduleform.note" placeholder="备注"/>
            </el-form-item>
            <el-form-item v-if="scheduleform.status==='1'" >
              <el-button type="primary" size="large" @click="setSchedule" >提交</el-button>
            </el-form-item>
            <el-form-item v-if="scheduleform.status==='5'" >
              <el-button type="primary" size="large" @click="setSchedule" >提交改签行程</el-button>
            </el-form-item>

          </el-form>
        </el-tab-pane>

      </el-tabs>
    </el-dialog>

    <el-dialog :visible.sync="showdialogIssue" title="出票">
      <el-form :model="reform">
        <el-form-item :label-width="formLabelWidth" label="机票票号">
          <el-input
            :rows="3"

            type="textarea"
            placeholder="每个票号一行"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="电子行程单">
          <el-upload
            :on-preview="handleUpPreview"
            :on-remove="handleUpRemove"
            :before-remove="beforeUpRemove"
            :limit="3"
            :on-exceed="handleUpExceed"
            :file-list="fileList"
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            multiple>
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">请上传word格式电子行程单</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showdialogIssue = false">取 消</el-button>
        <el-button type="primary" @click="submitIssue">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="showdialogReturn" title="退票申请">
      <el-form :model ="reform">
        <el-form-item label="申请时间">
          {{ reform.refund_time }}
        </el-form-item>
        <el-form-item label="退票理由">
          <el-input v-model="reform.reason" />
        </el-form-item>
        <el-form-item label="可退金额">
          <el-input v-model="reform.refund_money" />
        </el-form-item>
        <el-form-item label="操作备注">
          <el-input v-model="reform.refund_note" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showdialogReturn = false">取 消</el-button>
        <el-button type="primary" @click="submitReturn">同意退票</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<style scoped>
.photobox img{ width: 30px; cursor: pointer;}
</style>

<script>
import { getList as fetchList, updateRowSchdule, returnOrder, issueOrder, getRowSchdule, claimOrder, transferOrder } from '@/api/orders'
import { getList as fetchusersList } from '@/api/users'
import waves from '@/directive/waves'
import { parseTime } from '@/utils/index'
import Pagination from '@/components/Pagination'
import store from '@/store/index'

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
  components: { Pagination },
  directives: { waves },
  filters: {
    showstr(v, prop) {
      if (prop === 'contacts') {
        // return v ? v.length : 0
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
      colTable: [
        { prop: 'id', label: '订单编号', fixed: false, width: '65px' },
        { prop: 'mobile', label: '注册手机', fixed: false, width: '' },
        { prop: 'departure', label: '出发地', fixed: false, width: '' },
        { prop: 'destination', label: '目的地', fixed: false, width: '' },
        { prop: 'start_date', label: '出发日期', fixed: false, width: '' },
        { prop: 'contacts', label: '乘机人', fixed: false, width: '' },
        { prop: 'is_back', label: '类型', fixed: false, width: '' },
        { prop: 'addtime', label: '订单时间', fixed: false, width: '' },
        { prop: 'status', label: '订单状态', fixed: false, width: '' },
        { prop: 'admin_nickname', label: '操作人', fixed: false, width: '' }
      ],
      colPerson: [
        { prop: 'username', label: '姓名', fixed: true, width: '65px' },
        { prop: 'type', label: '身份', fixed: true, width: '' },
        { prop: 'sex', label: '性别', fixed: true, width: '' },
        { prop: 'birthday', label: '出生日期', fixed: true, width: '' },
        { prop: 'type', label: '证件类型', fixed: true, width: '' },
        { prop: 'paper_no', label: '证件号码', fixed: true, width: '' },
        { prop: 'end_date', label: '证件到期日期', fixed: true, width: '' },
        { prop: 'photo', label: '证件照片', fixed: true, width: '' },
        { prop: 'phone', label: '联系方式', fixed: true, width: '' },
        { prop: 'email', label: '邮件', fixed: true, width: '' }
      ],
      multipleSelection: [],
      tmpitem: {
        contacts: []
      },
      listQuery: {
        page: 1,
        limit: 15,
        admin_id: undefined,
        importance: undefined,
        id: undefined,
        status: undefined,
        sort: '+id'
      },
      total: 0,
      list: [],
      scheduleform: {
        id: undefined,
        ticket_info: [
          {
            start_city: ''
          }
        ],
        total: undefined,
        cost_price: undefined,
        deadline: undefined,
        note: ''
      },
      listLoading: true,
      isShowDetail: false,
      orderStatusOpitons,
      schrules: {
        total: [{ required: true, message: '请填写价格', trigger: 'blur' }],
        deadline: [{ required: true, message: '请填写时效', trigger: 'blur' }]
      },
      arUsersList: [],
      moveToUserId: '',
      chkedrows: [],
      reform: {},
      showdialogReturn: false,
      showdialogIssue: false,
      formLabelWidth: '80',
      fileList: []
    }
  },
  computed: {
    roles() {
      return store.getters.roles
    },
    admin_id() {
      return store.getters.admin_id
    },
    admin_nickname() {
      return store.getters.admin_nickname
    }
  },
  created() {
    this.getList()
    this.getUserList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.map(v => {
          v.ticket_info = v.ticket_info || [{ start_city: '' }]
          return v
        })
        this.total = parseInt(response.msg.total)
        this.listLoading = false
      })
    },
    handleEdit(row) {
      this.tmpitem = row
      this.isShowDetail = true
      this.scheduleform = row
      this.$nextTick(() => {
        this.$refs['scheduleform'].clearValidate()
      })
    },
    handleLoadReturn(row) {
      this.reform = row
      this.showdialogReturn = true
      this.$nextTick(() => {

      })
    },
    submitReturn() {
      returnOrder(this.reform).then((res) => {
        if (res.status === 1) {
          this.reform.status = '10'
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '提示',
            message: '操作失败',
            type: 'error',
            duration: 2000
          })
        }
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    hanleClaim(row) {
      this.$confirm('确定认领吗？', '提示', { type: 'warning', confirmButtonText: '确定', cancelButtonText: '取消' }).then(
        () => {
          claimOrder(row).then((res) => {
            if (res.status === 1) {
              row.status = '1'
              row.admin_id = this.admin_id
              row.admin_nickname = this.admin_nickname
              this.$notify({
                title: '成功',
                message: '操作成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '提示',
                message: '操作失败',
                type: 'error',
                duration: 2000
              })
            }
          })
        }
      )
    },
    issueHandle(row) {
      this.reform = row
      this.showdialogIssue = true
    },
    submitIssue() {
      this.reform.order_change = this.reform.status === '7' ? 1 : 2
      issueOrder(this.reform).then((res) => {
        if (res.status === 1) {
          this.reform.status = this.reform.status === '3' ? '4' : '8'
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '提示',
            message: '操作失败',
            type: 'error',
            duration: 2000
          })
        }
      })
    },
    setSchedule() {
      this.$refs['scheduleform'].validate((valid) => {
        if (valid) {
          this.scheduleform.order_change = this.scheduleform.status === '5' ? 1 : 2
          const tmpform = Object.assign({}, this.scheduleform)
          console.log(JSON.stringify(tmpform.ticket_info))
          tmpform.ticket_info = JSON.stringify(tmpform.ticket_info)

          updateRowSchdule(tmpform).then((res) => {
            if (res.status === 1) {
              this.scheduleform.status = this.scheduleform.status === '1' ? '2' : '6'
              this.$notify({
                title: '成功',
                message: '发送行程成功',
                type: 'success',
                duration: 2000
              })
              this.isShowDetail = false
            } else {
              console.log(res.data)
            }
          }).catch(() => {})
        }
      })
    },
    getSchedule(id) {
      getRowSchdule({ id }).then(res => {
        console.log(res)
        if (res.data.status === 1) {
          console.log(res.data)
        }
      })
    },
    getUserList() {
      fetchusersList().then(res => {
        // console.log(res)
        this.arUsersList = res.data
      })
    },
    selrow(row) {
      if (process.env.NODE_ENV !== 'production') console.log('click row', row)
      row.checked = !row.checked
    },
    handleSelectionChange(val) {
      this.chkedrows = val
    },

    handleTransfer() {
      if (!this.chkedrows.length) {
        this.$notify({
          title: '提示',
          message: '请勾选要操作的订单',
          type: 'error',
          duration: 2000
        })
        return
      }
      this.$confirm('要转移所选订单吗', '提示', { type: 'warning', confirmButtonText: '确定', cancelButtonText: '取消' }).then(
        () => {
          transferOrder({ id: this.chkedrows.map(v => { return v.id }), to_userid: this.moveToUserId }).then((res) => {
            if (res.status === 1) {
              this.chkedrows.forEach(v => {
                v.admin_id = this.moveToUserId
              })
              this.$notify({
                title: '成功',
                message: '操作成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '提示',
                message: '操作失败',
                type: 'error',
                duration: 2000
              })
            }
          })
        }
      )
    },
    addleg(i) {
      this.scheduleform.ticket_info.push({
        start_city: ''
      })
    },
    delleg(i) {
      this.$confirm('确实要删除该航段吗', '提示', { type: 'warning', confirmButtonText: '确定', cancelButtonText: '取消' }).then(
        () => { this.scheduleform.ticket_info.splice(i, 1) }
      )
    },
    handleUpRemove(file, fileList) {
      console.log(file, fileList)
    },
    handleUpPreview(file) {
      console.log(file)
    },
    handleUpExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeUpRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    }

  }
}
</script>
