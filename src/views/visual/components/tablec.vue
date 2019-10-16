<template>
  <div >
    <div class="tbout">
      <table v-if="defData.series && defData.series.length && defData.series[0]['data']" ref="table">
        <tr v-for="(item,i) in defData.series[0]['data']" :key="'tr'+i">
          <td v-for="(cell,ii) in item" :key="'td'+ii">
            {{ cell }}
          </td>
        </tr>
      </table>
    </div>
    <div class="btnbox">
      <el-button type="primary" @click="exportExcel">downloadCSV</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tbout{margin: 10px;}
table{
  border:1px solid #ddd;border-spacing:1;border-collapse:collapse; width: 100%; font-size: 14px; color: #333;
  tr:nth-child(even){ background: #f9f9f9;}
  td{border-right: 1px solid #ddd; border-bottom: 1px solid #ddd; padding: 8px; text-align: center;}
}
.btnbox{ padding-left: 10px;}
</style>

<script>
import FileSaver from 'file-saver'
import XLSX from 'xlsx'

export default {
  props: {
    defData: {
      type: Object,
      required: true
    },
    defConf: {
      type: Object,
      required: true
    }
  },
  data() {
    return {

    }
  },
  methods: {
    // 导出表格所用
    exportExcel() {
      var wb = XLSX.utils.table_to_book(this.$refs.table)
      /* get binary string as output */
      var wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'array'
      })
      try {
        //  name+'.xlsx'表示导出的excel表格名字
        FileSaver.saveAs(
          new Blob([wbout], { type: 'application/octet-stream' }),
          this.defConf.title + '.xlsx'
        )
      } catch (e) {
        if (typeof console !== 'undefined') console.log(e, wbout)
      }
      return wbout
    }
  }

}
</script>
