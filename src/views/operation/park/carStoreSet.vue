<template>
  <div class="storeSet">
    <el-row :span="24">
      <el-col :span="4" class="leftStore">
        <el-tree
          ref="treeorg"
          :data="selectOrgTree"
          :props="defaultProps"
          :expand-on-click-node="false"
          :default-expanded-keys="expnodeId"
          :highlight-current="true"
          class="u_tree"
          node-key="organizationId"
          @node-click="handleNodeClick"
        />
      </el-col>
      <el-col :span="19">
        <el-form v-if="dataFlag" v-model="dataPower" style="margin-left:20px;margin-top:10px;">
          <!-- <label style="color:#333;font-size:16px;">停车场管理设置</label> -->
          <div v-for="(item,idx) in parkData" :key="idx">
            <el-form-item :label="item.typeName">
              <div v-for="(chk,idx) in item.shopOutAuthos" :key="idx">
                <el-checkbox-group v-model="checkTypes">
                  <el-checkbox :label="chk.fPowercode" :key="chk.fPowercode">{{ chk.fPowername }}</el-checkbox>
                </el-checkbox-group>
                <div style="width:70%;">
                  <div
                    v-for="tag in chk.labelDOS"
                    :key="tag.fId"
                    style="background:#e1e1e1;float:left"
                    @click="checkTags(tag.fPowercode)"
                  >
                    <el-tag>
                      <span @click="checkTags(tag.fPowercode)">{{ tag.fLabelName }}</span>
                    </el-tag>
                  </div>
                </div>
                <div v-if="chk.showTestBox">
                  <el-input-number v-model="customTime" :min="1" style="width:15%" placeholder="请输入内容"/>&nbsp;小时
                </div>
              </div>
            </el-form-item>
          </div>
          <el-form-item>
            <el-button type="primary" @click="getSure()">提交</el-button>
            <el-button @click="reset()">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-dialog
      :visible.sync="$store.state.user.gateList"
      :before-close="beforeClose"
      title="请选择标签"
      width="55%"
    >
      <tag
        :tag-data="tags"
        :powercode="fPowercode"
        :flabelname="dynamicTags"
        :f-aid="carStoreid"
        @checkTag="changeTag"
      />
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import tag from './components/carStoreTag'
// import store from '@/store'
import {
  shopoutautho,
  setShopoutautho
} from '@/api/car'
import {
  getlabels
} from '@/api/tag'
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
  components: {
    tag: tag
  },
  data() {
    return {
      name: 111,
      defaultProps: {
        children: 'children',
        label: 'organizationName',
        isLeaf: 'leaf'
      },
      dataPower: {
        store: '',
        Founder: '',
        radio: '',
        list: []
      },
      carStoreid: '',
      checkTypes: [],
      userToken: this.$store.state.user.token,
      loading: true,
      storeCarBtn: false,
      btnFlagData: [],
      parkData: [],
      appdatas: [],
      dataFlag: false,
      expnodeId: [],
      dynamicTags: [],
      tags: [],
      inputVisible: false,
      inputValue: '',
      fPowercode: '',
      fLabelName: [],
      customTime: '',
      showlabel: false,
      tagShow: false,
      hackReset: false
    }
  },
  computed: {
    ...mapGetters([
      'selectOrgTree',
      'organizationChain'
    ])
  },
  mounted() {
    if (localStorage.carStoreid) {
      const orgAddrCode = localStorage.carStoreid
      let sharenode = findNodeByAddrCode(this.selectOrgTree, orgAddrCode)
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
    if (localStorage.carStoreid) {
      this.carStoreid = localStorage.getItem('carStoreid')
    } else {
      this.carStoreid = this.getFirstOrganizationId(this.selectOrgTree)
    }
    this.expnodeId = [this.carStoreid]
    this.shopoutauthoList(this.carStoreid)
    this.getAllTags()
    this.dataFlag = true
  },
  methods: {
    beforeClose() {
      this.$store.commit('GATELIST_TREEGRENTBUSI', false)
    },
    handleNodeClick(data, node) {
      this.dataFlag = true
      this.carStoreid = node.data.organizationAddressCode
      this.shopoutauthoList(this.carStoreid)
      localStorage.setItem('carStoreid', data.organizationAddressCode)
      localStorage.setItem('carStoreName', data.organizationName)
    },
    shopoutauthoList(data) {
      shopoutautho({ fAid: data, chain: this.organizationChain }).then(res => {
        this.parkData = res.data.shopOutAuthoDTOS
        this.checkTypes = res.data.thisShopPowerCodes
        this.customTime = res.data.customTime

        this.dynamicTags = res.data.thisBrandPushInfoLabelArr
        // res.data.shopOutAuthoDTOS.forEach(v => {
        //   v.shopOutAuthos.filter(vv => {
        //     if (vv.labelDOS) {
        //       this.dynamicTags = vv.labelDOS
        //     }
        //   })
        // })
      })
    },
    getFirstOrganizationId(orgtree) {
      return (orgtree[0].children && orgtree[0].children.length) ? this.getFirstOrganizationId(orgtree[0].children) : orgtree[0].organizationAddressCode
    },
    checkTags(tag) {
      // console.log(tag)
      this.fPowercode = tag
      this.$store.commit('GATELIST_TREEGRENTBUSI', true)
    },
    getAllTags() {
      getlabels({ Authorization: this.userToken, fAid: this.carStoreid, chain: this.organizationChain }).then(res => {
        this.tags = res.data
      })
    },
    changeTag(val) {
      this.inResize = true
      this.fLabelName = []
      this.$nextTick(() => {
        this.shopoutauthoList(this.carStoreid)
      })
    },
    getSure() {
      console.log(this.customTime)
      var data = {
        token: this.userToken,
        fAid: this.carStoreid,
        powerCodes: this.checkTypes,
        customTime: this.customTime
      }
      console.log(data)
      setShopoutautho(data).then(res => {
        this.$message({
          type: 'success',
          message: res.msg
        })
      })
    },
    reset() {
      this.checkTypes = []
      this.tryTypes = []
      this.appdatas = []
    }
  }
}
</script>
<style lang="scss" scoped>
.el-checkbox {
  margin-right: 10px !important;
}
.el-checkbox-group {
  width: 100%;
  display: flex !important;
}
.el-form-item__content {
  // display: flex !important;
}
.storeSet {
  margin-top: 20px;
  margin-left: 20px;
  width: 100%;
  .leftStore {
    width: 20%;
  }
  .el-form {
    width: 100%;
  }
}
.el-tag {
  margin: 10px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
  background: #fff !important;
  border: 1px solid #dcdfe6 !important;
  border-color: #dcdfe6 !important;
  color: #606266 !important;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
