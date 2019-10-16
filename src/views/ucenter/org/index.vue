<template>
  <div class="app-container">
    <el-row style="padding:10px;">
      <el-col :span="4">
        <el-tree
          ref="treeorg"
          :data="orgtree"
          :props="defaultProps"
          :default-expanded-keys="expnodeId"
          highlight-current
          current-node-key
          class="u_tree"
          icon-class="utreeicon"
          node-key="organizationId"
          @check-change="handleCheckChange"
          @node-click="handleNodeClick"
        />
      </el-col>
      <!-- :default-expand-all="true" -->
      <el-col v-if="isShow" :span="18">
        <div class="filter-container" style="text-align:right">
          <el-button
            v-if="showdel"
            class="filter-item"
            style="margin-left: 10px;"
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete"
          >删除</el-button>
          <el-button
            class="filter-item"
            style="margin-left: 10px;"
            type="primary"
            @click="handleCreate"
          >添加子组织</el-button>
        </div>
        <el-form
          ref="tempdata"
          :rules="rules"
          :model="tempdata"
          class="dialogform"
          label-width="120px"
          width="600"
        >
          <el-form-item label="父级组织">
            <el-input v-model="tempdata.organizationCodePid" readonly placeholder />
          </el-form-item>
          <el-form-item label="组织名称">
            <el-input v-model="tempdata.organizationName" placeholder="用户名" />
          </el-form-item>
          <el-form-item label="是否店铺">
            <el-select v-model="tempdata.organizationDataAnalysis" placeholder="请选择">
              <el-option
                v-for="opt in optsOrgAnalys"
                :key="opt.key"
                :value="opt.key"
                :label="opt.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="排序类型">
            <el-select v-model="tempdata.organizationSort" placeholder="请选择">
              <el-option
                v-for="opt in orgSortData"
                :key="opt.key"
                :value="opt.key"
                :label="opt.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="组织代码">
            <el-input v-model="tempdata.organizationCode" :disabled="true" placeholder="组织代码" />
          </el-form-item>
          <el-form-item label="经销商编码" prop="organizationDealerCode">
            <el-input
              v-model="tempdata.organizationDealerCode"
              placeholder="经销商编码"

            />
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="tempdata.organizationPhone" placeholder="联系电话" />
          </el-form-item>
          <!-- <el-form-item label="网址">
            <el-input v-model="tempdata.organizationUrl" placeholder="工号"/>
          </el-form-item>-->
          <el-form-item label="联系人">
            <el-input v-model="tempdata.organizationLinkman" placeholder="联系人" />
          </el-form-item>
          <!-- <el-form-item label="SSID名称">
            <el-input v-model="tempdata.organizationSsid" placeholder="SSID名称"/>
          </el-form-item>-->
          <el-form-item label="经度">
            <el-input v-model="tempdata.organizationLongitude" placeholder="经度" />
          </el-form-item>
          <el-form-item label="纬度">
            <el-input v-model="tempdata.organizationLatitude" placeholder="纬度" />
          </el-form-item>
          <el-form-item label="地址" prop="codeChainAddr">
            <el-cascader
              :options="arAddrs"
              :props="propsAddr"
              :change-on-select="1<2"
              v-model="codeChainAddr"
              style="width:80%"
              @change="handleAddrChange"
            />
            <div>当前地址代码{{ tempdata.organizationAddressCode }}</div>
          </el-form-item>
          <el-form-item label="地址">
            <el-input v-model="tempdata.organizationAddress" placeholder="地址" />
          </el-form-item>
          <el-form-item label="经销商辅助编码">
            <el-input
              v-model="tempdata.spareDealerCode"
              placeholder="{&quot;dmsCode&quot;:&quot;K0&quot;,&quot;gssnCode&quot;:&quot;NBJL20&quot;}"
            />
          </el-form-item>
          <el-form-item label="说明">
            <el-input v-model="tempdata.remark" type="textarea" placeholder="说明" />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="createSub?createData('tempdata'):updateData('tempdata')"
            >提交</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss">
.u_tree {
  font-size: 16px;
  .el-tree-node__label {
    font-size: 15px;
  }
}
.el-cascader-menu {
  height: 400px !important;
}
.u_tree.el-tree--highlight-current {
  .el-tree-node.is-current > .el-tree-node__content {
    .el-tree-node__label {
      border: 1px sold transparent;
    }
  }
}
</style>

<script>
import { selectRepetition } from '@/api/agency'
import { getSubArea } from '@/api/addr'
import { getSubNodes, updateRow, getRow, addRow, delRow } from '@/api/org'
import { mapGetters } from 'vuex'

const orgAnalysMap = {
  0: '非店铺',
  1: '店铺'
}
const orgSort = {
  0: '默认',
  1: '组织名称',
  2: '组织代码',
  3: '经销商编码'
}
function fillchildren(ar) {
  ar.length && ar.forEach((v, i) => {
    if (v.children) {
      fillchildren(v.children)
    } else {
      v.children = []
    }
  })
  return ar
}
function findNodeByAddrCode(tree, code) {
  let arnode = []
  tree.forEach(v => {
    if (v.organizationAddressCode === code) {
      arnode.push(v)
    } else {
      if (v.children && v.children.length) {
        arnode = arnode.concat(findNodeByAddrCode(v.children, code))
      }
    }
  })
  return arnode
}

export default {
  data() {
    var codeChainAddr = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择地址'))
      } else {
        if (this.tempdata.organizationAddressCode) {
          selectRepetition({ organizationId: this.tempdata.organizationId, organizationAddressCode: this.tempdata.organizationAddressCode }).then(res => {
            console.log(res, 'res')
            if (res.data === false) {
              callback(new Error('地址重复'))
            } else {
              callback()
            }
          }).catch(e => {
            callback(new Error('地址重复'))
          })
        } else {
          callback()
        }
      }
    }
    const organizationDealerCode = (rule, value, callback) => {
      if (this.tempdata.organizationDealerCode) {
        selectRepetition({ organizationDealerCode: this.tempdata.organizationDealerCode, organizationId: this.tempdata.organizationId }).then(res => {
          if (res.data === false) {
            callback(new Error('经销商编码重复'))
          } else {
            callback()
          }
        }).catch(e => {
          callback(new Error('经销商编码重复'))
        })
      } else {
        callback()
      }
    }
    return {
      name: 'ucenterorgindex',
      defaultProps: {
        children: 'children',
        label: 'organizationName',
        isLeaf: 'leaf'
      },
      createSub: false,
      tempdata: {},
      optsOrgAnalys: [],
      orgSortData: [],
      arAddrs: [],
      arFstAddrs: [],
      codeChainAddr: [],
      propsAddr: {
        label: 'name',
        value: 'code',
        children: 'children'
      },
      expkeys: [],
      curnode: undefined,
      rules: {
        name: [{ required: true, message: '请填写用户名', trigger: 'blur' }],
        organizationDealerCode: [{ required: false, validator: organizationDealerCode, trigger: 'blur' }],
        codeChainAddr: [{ required: true, validator: codeChainAddr, trigger: 'change' }]
      },
      isShow: false,
      showdel: true,
      expnodeId: []
    }
  },
  computed: {
    ...mapGetters([
      'orgtree'
    ])
  },
  mounted() {
    if (localStorage.carStoreid) {
      const orgAddrCode = localStorage.carStoreid
      let sharenode = findNodeByAddrCode(this.orgtree, orgAddrCode)
      console.log('sharenode', sharenode, ',orgAddrcode:', orgAddrCode, typeof (orgAddrCode))
      if (sharenode && sharenode.length) {
        sharenode = sharenode[0]
        this.expnodeId = [sharenode.organizationId]
        this.$refs.treeorg.setChecked(sharenode.organizationId)
        this.$refs.treeorg.setCurrentKey(sharenode.organizationId)
      }
    }
  },
  created() {
    this.$store.dispatch('updateOrgTree')
    for (const v in orgAnalysMap) {
      this.optsOrgAnalys.push({ key: parseInt(v), label: orgAnalysMap[v] })
    }
    for (const v in orgSort) {
      this.orgSortData.push({ key: parseInt(v), label: orgSort[v] })
    }
    this.loadSubArea(0, 1)
  },
  updated() {
    this.$nextTick(function() {
      this.$refs['treeorg'].setCurrentKey(localStorage.getItem('setOrganizationId'))
    })
  },
  methods: {
    handleNodeClick(data, node) {
      // console.log(data)
      if (!data.children) {
        this.showdel = true
      } else {
        this.showdel = false
      }
      this.isShow = true
      const _tree = this.$refs.treeorg
      if (!node.checked || this.createSub) {
        if (_tree.getCheckedNodes().length) {
          _tree.setChecked(_tree.getCheckedNodes()[0], false)
        }
        node.checked = true
        this.expkeys = [node.data.organizationId]
        this.curnode = node
        this.createSub = false
        getRow({ organizationId: node.data.organizationId }).then(res => {
          this.tempdata = res.data
          console.log(this.tempdata)
          if (res.data.adreassTree) {
            this.arAddrs = fillchildren(res.data.adreassTree)
            this.codeChainAddr = res.data.codes
          } else {
            this.arAddrs = [...this.arFstAddrs]
            this.codeChainAddr = []
          }
        })
      }
    },
    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate)
      this.expnodeId = [data.organizationId]
      localStorage.setItem('setOrganizationId', data.organizationId)
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve([{
          id: 11,
          label: '悠尼客',
          leaf: 0
        }])
      }
      console.log(node)
      getSubNodes({ organizationCodePid: node.id }).then(res => {
        console.log(res)
        return resolve(res.data)
      })
      return resolve([])
    },
    createData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.tempdata.organizationAddressCode.length < 13) {
            this.$message.error('地址请具体到楼宇这一级')
          } else {
            addRow(this.tempdata).then(res => {
              this.$store.dispatch('updateOrgTree')
              this.$store.dispatch('selectOrgTree')
              this.$notify({ title: '成功', message: '操作成功', type: 'success', duration: 2000 })
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    updateData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.tempdata.organizationAddressCode.length < 13) {
            this.$message.error('地址请具体到楼宇这一级')
          } else {
            const tmpdata = Object.assign({}, this.tempdata)
            delete tmpdata.adreassTree
            updateRow(tmpdata).then(res => {
              this.$store.dispatch('updateOrgTree')
              this.$store.dispatch('selectOrgTree')
              this.$notify({ title: '成功', message: '操作成功', type: 'success', duration: 2000 })
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleDelete() {
      if (!this.tempdata.organizationId) {
        this.$notify({ title: '错误', message: '请先选择组织', type: 'error', duration: 2000 })
        return
      }
      this.$confirm('确定要删除吗？', '提示', { type: 'warning', confirmButtonText: '确定', cancelButtonText: '取消' }).then(res => {
        this.expkeys = this.curnode.parent ? [this.curnode.parent.data.organizationId] : []
        delRow({ organizationId: this.tempdata.organizationId }).then(res => {
          this.$store.dispatch('updateOrgTree')
          this.$store.dispatch('selectOrgTree')
          this.$notify({ title: '成功', message: '操作成功', type: 'success', duration: 2000 })
        })
      })
    },
    handleCreate() {
      if (!this.tempdata.organizationId) {
        this.$notify({ title: '错误', message: '请先选择组织', type: 'error', duration: 2000 })
        return
      }
      const tmpId = this.tempdata.organizationId
      this.createSub = true
      this.resetTemp()
      this.tempdata.organizationCodePid = tmpId
      this.arAddrs = [...this.arFstAddrs]
      this.codeChainAddr = []
      this.$nextTick(() => {
        this.$refs['tempdata'].clearValidate()
      })
    },
    handleAddrChange(val) {
      let addrText = ''
      let lastcode = ''
      const objAddr = val.reduce((prev, cur) => { const objnow = prev.children.filter(v => { return v.code === cur })[0]; addrText += objnow['name']; lastcode = objnow['code']; return objnow }, { children: this.arAddrs })
      this.tempdata.organizationAddress = addrText
      this.tempdata.organizationAddressCode = lastcode
      getSubArea({ parentCode: val[val.length - 1], grade: (val.length + 1) }).then(res => {
        if (res.data.length) {
          const tempar = val.length === 6 ? res.data : res.data.map(v => { v.children = []; return v })
          objAddr.children = tempar
          this.arAddrs = [...this.arAddrs]
        }
      })
    },
    loadSubArea(parentCode, grade) {
      getSubArea({ parentCode, grade }).then(res => {
        const artemp = res.data.map(v => { v.children = []; return v })
        this.arAddrs = artemp
        if (grade === 1) {
          this.arFstAddrs = artemp
        }
      })
    },
    resetTemp() {
      this.tempdata = {
        organizationCodePid: '',
        organizationName: '',
        organizationDataAnalysis: 0,
        organizationCode: '',
        spareDealerCode: '',
        organizationPhone: '',
        organizationUrl: '',
        organizationLinkman: '',
        organizationSsid: '',
        organizationLongitude: '',
        organizationLatitude: '',
        organizationAddressCode: '',
        organizationAddress: '',
        organizationSort: 0,
        remark: ''
      }
    }
  }
}
</script>
