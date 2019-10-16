<template>
  <div >
    <!-- 添加 -->
    <!-- <div class="btnsupertable">
      <el-form>
        <el-form-item v-show="tempdata.orgCode">
          <el-button v-if="deviceauthority.includes('devicegateindexOthersCreate')" type="primary" @click="handleCreate">添加</el-button>
        </el-form-item>
      </el-form>
    </div> -->

    <!-- 增加，编辑单独出来 -->
    <div>
      <el-form ref="dataForm" :rules="rules" :model="tempdata" :validate-on-rule-change="1>2" class="dialogform form2col" label-width="150px">
        <el-form-item style="inputstyle" label="千人千面服务器IP" prop="ip" >
          <el-input v-model="tempdata.ip" placeholder="千人千面服务器IP" />
        </el-form-item>
        <el-form-item label="设备归属" prop="orgCode" label-width="80px">
          <el-select v-model="orgnode.name" placeholder="请选择">
            <el-option :value="orgnode.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="360厂商" prop="threeSixZero" style="inputstyle" label-width="150px">
          <el-select v-model="tempdata.threeSixZero" placeholder="请选择">
            <el-option v-for="item in optsThreeSixZero" :key="item.value" :value="item.value" :label="item.label"/>
          </el-select>
        </el-form-item>
        <el-form-item label="道闸厂商" prop="barrierGate" style="inputstyle" label-width="80px">
          <el-select v-model="tempdata.barrierGate" placeholder="请选择">
            <el-option v-for="item in optsBarrierGate" :key="item.value" :value="item.value" :label="item.label"/>
          </el-select>
        </el-form-item>
        <el-form-item label="360&道闸位置" prop="tszBarrierPosition" label-width="150px">
          <el-select v-model="defaultzaiyiqi" placeholder="请选择" >
            <el-option
              v-for="item in optsTszBPosition"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <div class="zhanweifu"/>
        </el-form-item>
        <el-button type="primary" class="submitcenter" @click="tempdata.id===''?createData():updateData()">提交</el-button>
      </el-form>
    </div>

    <!-- 主体表 -->
    <!-- <div class="devicetbout">
      <el-table
        :data="list"
        border
        fit
        highlight-current-row>
        <el-table-column label="序号" type="index" width="50" fixed align="center">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <template v-for="item in colTable">
          <el-table-column :fixed="item.fixed" :key="item.displayName" :prop="item.prop" :label="item.label" :min-width="item.width" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row[item.prop] | showstr(item.prop) }}</span>
            </template>
          </el-table-column>
        </template>
        <el-table-column align="center" prop="created_at" label="操作" width="100">
          <template slot-scope="scope">
            <template>
              <el-button v-if="menucodes.includes('devicegateindexOthersUpdate')" type="primary" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div> -->

    <!-- 添加对话框 -->
    <!-- <el-dialog :visible.sync="isShowDialog" :title="dialogText[dialogStatus]" >
      <el-form ref="dataForm" :rules="rules" :model="tempdata" class="dialogform form2col" label-width="150px">
        <el-form-item style="inputstyle" label="千人千面服务器IP" prop="ip" >
          <el-input v-model="tempdata.ip" placeholder=" " />
        </el-form-item>

        <el-form-item label="设备归属" prop="orgCode" label-width="80px">
          <el-select v-model="orgnode.name" placeholder="请选择">
            <el-option :value="orgnode.name" />
          </el-select>
        </el-form-item>

        <el-form-item label="360" prop="threeSixZero" style="inputstyle" label-width="150px">
          <el-select v-model="tempdata.threeSixZero" placeholder="请选择">
            <el-option v-for="item in optsThreeSixZero" :key="item.value" :value="item.value" :label="item.label"/>
          </el-select>
        </el-form-item>

        <el-form-item label="道闸" prop="barrierGate" style="inputstyle" label-width="80px">
          <el-select v-model="tempdata.barrierGate" placeholder="请选择">
            <el-option v-for="item in optsBarrierGate" :key="item.value" :value="item.value" :label="item.label"/>
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer ali-cen">
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">提交</el-button>
        <el-button @click="isShowDialog = false">取消</el-button>
      </div>

    </el-dialog> -->
  </div>
</template>

<style lang="scss">
.zhanweifu{
  width: 40%;
  height: 50px;
}
.submitcenter{
  display:block;
  margin:0 auto;
}
</style>

<script>
import { othersAdd as addRow, othersEnum, othersList as fetchList, othersUpdate as updateRow } from '@/api/device'
import { mapGetters } from 'vuex'

const jsonThreeSixZero = {}
const jsonBarrierGate = {}

export default {
  filters: {
    showstr(v, prop) {
      if (prop === 'threeSixZero') { return jsonThreeSixZero[v] }
      if (prop === 'barrierGate') { return jsonBarrierGate[v] }
      // if (prop === 'tszBarrierPosition') { return v === '1' ? '在一起' : '不在一起' }
      return v
    }
  },
  props: {
    deviceauthority: {
      type: Array,
      default: () => { return [] }
    },
    orgnode: {
      type: Object,
      default: () => { return {} }
    },
    isactive: {
      type: Boolean,
      default: false
    },
    enum: {
      type: Number,
      default: 0
    }
  },
  data() {
    // const validateName = (rule, value, callback) => {
    //   if (!this.tempdata.tszBarrierPosition && this.isHaveTo) {
    //     callback(new Error('请输入360&道闸位置'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      name: 'ucenterorgindex',
      optsTszBPosition: [
        { value: '1', label: '在一起' },
        { value: '2', label: '不在一起' }
      ],
      defaultzaiyiqi: '1',
      tempdata: {
        id: '',
        ip: '',
        threeSixZero: '',
        barrierGate: '',
        tszBarrierPosition: '',
        orgCode: this.orgnode.code,
        orgName: this.orgnode.name
      },
      listQuery: {
        page: 1,
        limit: 10,
        sort: '+id',
        orgCode: '0002'
      },
      optsThreeSixZero: [],
      optsBarrierGate: [],
      rules: {
        ip: [{ type: 'string', pattern: /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/, message: '请输入正确的Ip地址' }]
        // barrierGate: [{ required: true, message: '请选择道闸', trigger: 'blur' }]
        // tszBarrierPosition: [{ validator: validateName }]
      }
      // list: [],
      // colTable: [
      //   { prop: 'ip', label: '千人千面服务器IP', fixed: true, width: '' },
      //   { prop: 'threeSixZero', label: '360', fixed: true, width: '' },
      //   { prop: 'barrierGate', label: '道闸', fixed: true, width: '' }
      // ],
      // dialogStatus: 'create',
      // isShowDialog: false,
      // tempdata: {
      //   id: '',
      //   ip: '',
      //   orgCode: this.orgnode.code,
      //   orgName: this.orgnode.name,
      //   threeSixZero: '',
      //   barrierGate: ''
      // },
      // dialogText: {
      //   update: '编辑',
      //   create: '添加'
      // },
    }
  },
  computed: {
    ...mapGetters([
      'menucodes'
    ])
    // isHaveTo: function() {
    //   return (this.tempdata.barrierGate && this.tempdata.threeSixZero) !== ''
    // }
  },
  watch: {
    'orgnode.code': {
      handler(newval, oldval) {
        console.log(newval)
        console.log(this.listQuery)
        this.listQuery.orgCode = newval
        this.tempdata.orgCode = newval
        this.tempdata.orgName = this.orgnode.name
        if (this.isactive && this.orgnode.code) { this.getList() } else { this.needfresh = true }
      },
      immediate: true
    },
    'isactive': {
      handler(newval, oldval) {
        // if (newval && this.needfresh) { this.getList(); this.needfresh = false }
        if (newval && this.orgnode.code) { this.getList(); this.needfresh = false }
      }
    }
  },
  created() {
    this.getDeviceTypeList()
  },
  updated() {
    this.$nextTick(() => {
      this.$refs['dataForm'].clearValidate()
    })
  },
  methods: {
    handleCheckChange(data, checked, indeterminate) {
      // console.log(data, checked, indeterminate)
    },
    getDeviceTypeList() {
      othersEnum().then(res => {
        this.optsThreeSixZero = res.data.picList.map(v => {
          jsonThreeSixZero[v.index] = v.value
          return { label: v.value, value: v.index.toString() }
        })
        this.optsBarrierGate = res.data.barrierList.map(v => {
          jsonBarrierGate[v.index] = v.value
          return { label: v.value, value: v.index.toString() }
        })
      })
    },
    getList() {
      const tmpQuery = Object.assign({}, this.listQuery, { orgCode: this.listQuery.orgCode })
      fetchList(tmpQuery).then(res => {
        if (res.data.list.length > 0) {
          this.tempdata = res.data.list[0]
          console.log('55555', res.data)
        } else {
          this.resetTemp()
        }
      })
    },
    updateData() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          const formdata = Object.assign({}, this.tempdata)
          updateRow(formdata).then(res => {
            this.$notify({ title: '成功', message: '修改成功', type: 'success', duration: 2000 })
            // this.tempdata = this.tempdata.map(v => { return v.id === this.tempdata.id ? this.tempdata : v })
          })
        }
      })
    },
    createData() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          const formdata = Object.assign({}, this.tempdata, { orgCode: this.listQuery.orgCode })
          addRow(formdata).then(res => {
            // this.list.unshift(Object.assign({}, res.data, { barrierGate: res.data.barrierGate.toString(), threeSixZero: res.data.threeSixZero.toString() }))
            this.$notify({ title: '成功', message: '创建成功', type: 'success', duration: 2000 })
            this.tempdata.id = res.data.id
          })
        }
      })
    },

    resetTemp() {
      this.tempdata = {
        id: '',
        ip: '',
        threeSixZero: '',
        barrierGate: '',
        resetTemp: '',
        orgCode: this.orgnode.code,
        orgName: this.orgnode.name
      }
    }
    // handleCheckChange(data, checked, indeterminate) {
    //   // console.log(data, checked, indeterminate)
    // },
    // getDeviceTypeList() {
    //   othersEnum().then(res => {
    //     this.optsThreeSixZero = res.data.picList.map(v => {
    //       jsonThreeSixZero[v.index] = v.value
    //       return { label: v.value, value: v.index.toString() }
    //     })
    //     this.optsBarrierGate = res.data.barrierList.map(v => {
    //       jsonBarrierGate[v.index] = v.value
    //       return { label: v.value, value: v.index.toString() }
    //     })
    //   })
    // },
    // getList() {
    //   const tmpQuery = Object.assign({}, this.listQuery, { orgCode: this.listQuery.orgCode })
    //   fetchList(tmpQuery).then(res => {
    //     this.list = res.data.list || []
    //     this.total = res.data.total
    //   })
    // },
    // handleCreate() {
    //   if (!this.tempdata.orgCode) {
    //     this.$notify({ title: '错误', message: '请先选择组织', type: 'error', duration: 2000 })
    //     return false
    //   }
    //   this.resetTemp()
    //   this.dialogStatus = 'create'
    //   this.isShowDialog = true
    //   this.$nextTick(() => {
    //     this.$refs['dataForm'].clearValidate()
    //   })
    // },
    // handleEdit(row) {
    //   this.dialogStatus = 'update'
    //   this.tempdata = Object.assign({}, row)
    //   this.isShowDialog = true
    //   this.$nextTick(() => {
    //     this.$refs['dataForm'].clearValidate()
    //   })
    // },
    // updateData() {
    //   this.$refs.dataForm.validate((valid) => {
    //     if (valid) {
    //       const formdata = Object.assign({}, this.tempdata)
    //       updateRow(formdata).then(res => {
    //         this.$notify({ title: '成功', message: '操作成功', type: 'success', duration: 2000 })
    //         this.isShowDialog = false
    //         this.list = this.list.map(v => { return v.id === this.tempdata.id ? this.tempdata : v })
    //       })
    //     }
    //   })
    // },
    // createData() {
    //   this.$refs.dataForm.validate(valid => {
    //     if (valid) {
    //       const formdata = Object.assign({}, this.tempdata, { orgCode: this.listQuery.orgCode })
    //       addRow(formdata).then(res => {
    //         this.list.unshift(Object.assign({}, res.data, { barrierGate: res.data.barrierGate.toString(), threeSixZero: res.data.threeSixZero.toString() }))
    //         // this.list.unshift(res.data)
    //         // this.list.unshift(Object.assign({}, this.tempdata, res.data))
    //         this.$notify({ title: '成功', message: '创建成功', type: 'success', duration: 2000 })
    //         this.isShowDialog = false
    //       })
    //     }
    //   })
    // },
  }
}
</script>

