<template>
  <div style="width:100%">
    <div class="carStore">
      <p>
        <span @click="treedialog=true"><input v-model = "tempdata.fUnit" style="height:40px;width:200px;border-radius:4px;border:1px solid #dcdfe6;padding-left:10px;color:#606266" type="text" placeholder="请选择店铺"></span>
      </p>
    </div>
    <elTree :isshowtreedialog="treedialog" @chloc="selectloc" />
    <el-dialog :visible.sync="editShowDialog" :title="dialogText[dialogStatus]">
      <el-form ref="tempdata" :model="tempdata" label-width="100px">
        <el-form-item label="模板类型">
          <el-select v-model="tempdata.fCarstatus" placeholder="请选择">
            <el-option v-for="opt in optCarstatus" :key="opt.key" :value="opt.key" :label="opt.label"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="tempdata.fCarstatus===5" label="LED展示信息">
          <el-input v-model="tempdata.fTemplate" placeholder="LED展示信息，{name}代表客户的姓，{sex}代表客户的性别"/>
        </el-form-item>
        <el-form-item v-else label="LED展示信息">
          <el-input v-model="tempdata.fTemplate" placeholder="LED展示信息"/>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogStatus==='add'?createData():updateData()">确定</el-button>
        <el-button @click="editShowDialog = false">取消</el-button>
      </div>
    </el-dialog>
    <div class="filterBox">
      <el-button type="primary" @click="synchro">下发Led模板信息</el-button>
      <el-button type="primary" @click="addinfo">添加Led模板信息</el-button>
    </div>
    <el-table
      :data="list"
      element-loading-text="Loading"
      style="margin-left:5px;margin-right:5px;"
      border
      fit
      highlight-current-row>
      <el-table-column
        label="序号"
        width="50"
        fixed
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index+1 }}</span>
        </template>
      </el-table-column>
      <template v-for="item in colTable">
        <el-table-column :fixed="item.fixed" :key="item.id" :prop="item.prop" :label="item.label" :min-width="item.width" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row[item.prop] | showstr(item.prop) }}</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column align="center" prop="created_at" label="操作" width="260">
        <template slot-scope="scope">
          <div>
            <el-button type="primary" size="small" @click="edit(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="del(scope.row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Cookies from 'js-cookie'
import elTree from './components/selectTree'
import store from '@/store'

import { orgtmplidxList, orgtmplidxUpdate, orgtmplidxDel, orgtmplidxAdd, orgtmplidxsynchro } from '@/api/car'
const fCarstatus = {
  1: '内部车辆入场显示信息模板',
  2: '内部车辆离场显示信息模板',
  3: '试乘试驾车辆入场显示信息模板',
  4: '试乘试驾车辆离场显示信息模板',
  5: '预约客户入场显示信息模板',
  6: '入场默认显示信息模板',
  7: '离场默认显示信息模板',
  8: '临时离场显示信息模板',
  9: '临时离场后入场显示信息模板',
  10: '离场未发放电子放行单显示信息模板',
  11: '离场电子放行单过期显示信息模板',
  12: '人场不自动抬杆显示信息模板',
  13: '内部车辆过期入场显示信息模板',
  14: '内部车辆过期离场显示信息模板'
}
export default {
  components: {
    elTree
  },
  filters: {
    showstr(v, prop) {
      if (prop === 'fCarstatus') { return fCarstatus[v] }
      return v
    }

  },
  data() {
    return {
      treedialog: false,
      defaultProps: {
        children: 'children',
        label: 'organizationName',
        isLeaf: 'leaf'
      },
      dialogText: {
        add: '添加LED模板信息',
        edit: '编辑LED模板信息'
      },
      dialogStatus: '',
      editShowDialog: false,
      tempdata: {
        fAid: '',
        fUnit: '',
        fCarstatus: '',
        fTemplate: '',
        token: this.$store.state.user.token
      },
      optCarstatus: [],
      list: [],
      colTable: [
        { prop: 'fCarstatus', label: '模板类型', fixed: true, width: '' },
        { prop: 'fTemplate', label: 'led展示信息', fixed: true, width: '' }

      ]
    }
  },
  computed: {
    ...mapGetters([
      'selectOrgTree',
      'organizationId',
      'organizationName'
    ])
  },
  created() {
    store.dispatch('SET_TOPACTIVE')
    this.storeTree()
    for (const v in fCarstatus) {
      this.optCarstatus.push({ key: parseInt(v), label: fCarstatus[v] })
    }
  },
  methods: {
    selectloc(obj) {
      this.treedialog = false
      if (obj) {
        localStorage.setItem('carStoreid', obj.organizationAddressCode)
        localStorage.setItem('carStoreName', obj.organizationName)
        this.tempdata.fAid = obj.organizationAddressCode
        this.tempdata.fUnit = obj.organizationName
        Cookies.remove('loadfirstStore', 1)
        this.treedialog = false
        this.orgtmplidxLists()
      }
    },
    addinfo() {
      this.resetTmp()
      this.dialogStatus = 'add'
      this.editShowDialog = true
    },
    storeTree() {
      if (localStorage.getItem('carStoreName')) {
        this.tempdata.fUnit = localStorage.getItem('carStoreName')
        this.tempdata.fAid = localStorage.getItem('carStoreid')
      } else {
        if (this.selectOrgTree) {
          this.tempdata.fUnit = this.getFirstOrganizationName(this.selectOrgTree)
          this.tempdata.fAid = this.getFirstOrganizationId(this.selectOrgTree)
          localStorage.setItem('carStoreid', this.tempdata.fAid)
          localStorage.setItem('carStoreName', this.tempdata.fUnit)
        }
      }
      this.orgtmplidxLists()
    },
    synchro() {
      orgtmplidxsynchro({ fAid: this.tempdata.fAid }).then(res => {
        this.$notify({ title: '成功', message: '操作成功', type: 'success', duration: 2000 })
      })
    },
    getFirstOrganizationName(orgtree) {
      return (orgtree[0].children && orgtree[0].children.length) ? this.getFirstOrganizationName(orgtree[0].children) : orgtree[0].organizationName
    },
    getFirstOrganizationId(orgtree) {
      return (orgtree[0].children && orgtree[0].children.length) ? this.getFirstOrganizationId(orgtree[0].children) : orgtree[0].organizationAddressCode
    },
    handleNodeClick(data, node) {
      localStorage.setItem('carStoreid', node.data.organizationId)
      localStorage.setItem('carStoreName', node.data.organizationName)
      this.tempdata.fAid = node.data.organizationId
      this.tempdata.fUnit = node.data.organizationName
      Cookies.remove('loadfirstStore', 1)
      this.treedialog = false
      this.orgtmplidxLists()
    },
    orgtmplidxLists() {
      orgtmplidxList(this.tempdata).then(res => {
        this.list = res.data
        console.log(res)
      })
    },
    createData() {
      orgtmplidxAdd(this.tempdata).then(res => {
        this.list.unshift(res.data)
        this.editShowDialog = false
      })
    },
    del(row) {
      this.$confirm('确定要删除这条模板信息吗？', '提示', { type: 'warning', cancelButtonText: '取消', confirmButtonText: '确定' }).then(
        () => {
          orgtmplidxDel({ fId: row.fId }).then((res) => {
            this.$notify({ title: '成功', message: '操作成功', type: 'success', duration: 2000 })

            this.list = this.list.filter((v, i) => {
              return v.fId !== row.fId
            })
          })
        }
      )
    },
    edit(row) {
      this.resetTmp()
      this.dialogStatus = 'update'
      this.tempdata = Object.assign({}, row)
      this.editShowDialog = true
    },
    updateData() {
      this.tempdata.token = this.$store.state.user.token
      orgtmplidxUpdate(this.tempdata).then(res => {
        this.editShowDialog = false
        this.$notify({ title: '成功', message: '操作成功', type: 'success', duration: 2000 })
        this.list = this.list.map(v => { return v.fId === this.tempdata.fId ? this.tempdata : v })
      })
    },
    resetTmp() {
      this.tempdata = {
        fAid: this.tempdata.fAid,
        fUnit: this.tempdata.fUnit,
        fCarstatus: '',
        fTemplate: '',
        token: this.$store.state.user.token
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .carStore {
    width: 100%;
    p{
      float:right;
      margin-top:5px;
      display:flex;
      span{
        display:block;
        line-height:50px;
        margin-right:10px;
      }
    }
  }
  .filterBox{
    height:40px;
    width:188px;
     z-index:999;
     display:flex;
     float:right;
     margin-top:70px;
     margin-bottom:10px;
     margin-right:-77px;
  //  float:right;
  //  width:325px;
  //  margin-bottom:10px;
  //  margin-right:-352px;
  //  margin-top:70px;
  //  display:flex;
}

  .edit{
      outline:none;
      border:none;
      border-radius:2px;
      background:#00ADEF;
      color:#fff;
  }
  .del {
      outline:none;
      border:none;
      border-radius:2px;
      border:1px solid #fbc4c4;
      background:#fef0f0;
      color:#f56c;
  }
</style>
