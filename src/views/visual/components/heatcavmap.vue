<template>
  <div class="heatwrap">
    <div class="legout">
      <div class="hlegend">
        <div class="txt">
          <span>0</span>
          <span>{{ maxv }}</span>
        </div>
        <div class="grad"/>
      </div>
    </div>
    <div class="heatout">
      <div id="heatmap" class="heatmap" >
        <!-- <img id="fiximg" :src="fiximgdata" :style="'transform:rotate('+(defConf.chart.rotate||0)+'deg);transform-origin:rotate()'" alt="" @load="loadfiximg"> -->
      </div>
    </div>

  </div>

</template>

<style lang="scss" scoped>
.legout{position: relative; height: 56px;;}
.heatwrap{
  position: relative;
  .hlegend{
    position: absolute; border: 1px solid #666; padding:10px; width: 120px; z-index: 999; right: 20px; top:0px;
    .txt{ display:flex; justify-content: space-between; font-size: 12px; padding-bottom: 2px;}
    .grad{height: 12px;background: -webkit-linear-gradient(left,rgb(0,0,255) ,rgb(0,255,0) ,yellow ,rgb(255,0,0) );}
  }
  .heatout{margin: 8px 20px 0;}
}
</style>

<script>
import Heatmap from 'heatmap.js'
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
      realw: 0,
      realh: 0,
      imgow: 0,
      imgoh: 0,
      ro: 0,
      countpro: 1,
      heatmapInstance: undefined,
      maxv: 0
    }
  },
  watch: {
    'defData.img': {
      handler(newval, oldval) {
        console.log('heatimg src:', newval)
        this.resetCanvas()
        newval && this.loaddataimg(newval)
      },
      immediate: true
    },
    'defData.data': {
      handler(newval, oldval) {
        console.log('heatdata', newval)
        if (newval && newval.length) {
          this.drawheat()
        }
      },
      immediate: true
    }
  },
  created() {
    console.log('components create')
    console.log(this.defData)
  },
  mounted() {
    console.log('mounted')
  },
  methods: {
    loaddataimg(datasrc) {
      const vm = this
      const imgdata = new Image()
      imgdata.src = datasrc
      imgdata.onload = function() {
        vm.conw = document.querySelector('#heatmap').clientWidth
        console.log('imgo loaded')
        const imgow = this.width
        const imgoh = this.height
        vm.imgow = imgow
        vm.imgoh = imgoh
        let w, h, countpro
        const ro = (vm.defConf && vm.defConf.chart && vm.defConf.chart.rotate) ? vm.defConf.chart.rotate : 0
        var canvas_o = document.createElement('canvas')
        canvas_o.id = 'canimg'
        var ctx = canvas_o.getContext('2d')
        switch (ro) {
          case 0:
            console.log('r', 0, 'conw', vm.conw)
            w = vm.conw
            countpro = w / imgow
            h = countpro * imgoh
            canvas_o.width = w
            canvas_o.height = h
            break
          case 90:
            console.log('r', 90)
            h = vm.conw
            countpro = h / imgoh
            w = countpro * imgow
            canvas_o.width = h
            canvas_o.height = w
            ctx.rotate(Math.PI / 2)
            ctx.translate(0, -1 * h)
            document.querySelector('#heatmap').style.height
            break
          case 180:
            console.log('r', 180)
            w = vm.conw
            countpro = w / imgow
            h = countpro * imgoh
            canvas_o.width = w
            canvas_o.height = h
            ctx.rotate(Math.PI)
            ctx.translate(-1 * w, -1 * h)
            break
          case 270:
            console.log('r', 270)
            console.log(document.querySelector('#heatmap').clientWidth)
            h = vm.conw
            countpro = h / imgoh
            w = countpro * imgow
            canvas_o.width = h
            canvas_o.height = w
            console.log('conw', vm.conw, 'h', h, 'imgoh', imgoh, 'w', w, 'ro', countpro)
            ctx.rotate(Math.PI * 3 / 2)
            ctx.translate(-1 * w, 0)
            break
        }
        vm.realw = w
        vm.realh = h
        vm.ro = ro
        vm.countpro = countpro
        ctx.drawImage(imgdata, 0, 0, w, h)
        document.querySelector('#heatmap').appendChild(canvas_o)
        vm.createheat()
        vm.drawheat()
      }
    },
    // loadfiximg() {
    //   const vm = this
    //   console.log('fixed img is loaded')
    //   if (document.querySelector('#fiximg')) {
    //     this.conh = document.querySelector('#fiximg').clientHeight
    //     this.conw = document.querySelector('#fiximg').clientWidth
    //     const tmpimg = new Image()
    //     tmpimg.src = document.querySelector('#fiximg').src
    //     tmpimg.onload = function() {
    //       console.log(this.width, this.height)
    //       vm.imgw = this.width
    //       vm.imgh = this.height
    //       vm.createheat()
    //       vm.drawheat()
    //     }
    //   }
    // },
    createheat() {
      if (!this.heatmapInstance) {
        this.heatopts = {
          container: document.getElementById('heatmap'),
          radius: this.defConf.chart.radius || 10,
          maxOpacity: this.defConf.chart.maxOpacity || 0.5,
          minOpacity: 0,
          blur: this.defConf.chart.blur || 0.75,
          gradient: this.defConf.chart.gradient || { 0.25: 'rgb(0,0,255)', 0.55: 'rgb(0,255,0)', 0.85: 'yellow', 1.0: 'rgb(255,0,0)' }
        }
        this.heatmapInstance = Heatmap.create(this.heatopts)
      }
    },
    drawheat() {
      if (this.heatmapInstance && this.defData && this.defData.data && this.defData.data.length) {
        let tmpdata = [...this.defData.data]
        const confpro = this.defConf.chart.pro || 1
        console.log('draw heat thi.ro', this.ro)
        switch (this.ro) {
          case 0:
            tmpdata = tmpdata.map((v, i) => {
              return {
                x: Math.floor(v.x * this.countpro * confpro),
                y: Math.floor(v.y * this.countpro * confpro),
                value: v.value, macs: v.macs
              }
            })
            break
          case 90:
            tmpdata = tmpdata.map((v, i) => {
              console.log('this.countpro', this.countpro, 'confpro', confpro, 'this.imgoh', this.imgoh, 'v.y', v.y)
              return {
                x: Math.floor((this.imgoh - v.y) * this.countpro * confpro),
                y: Math.floor(v.x * this.countpro * confpro),
                value: v.value, macs: v.macs
              }
            })
            break
          case 180:
            tmpdata = tmpdata.map((v, i) => {
              console.log('this.countpro', this.countpro, 'confpro', confpro, 'this.imgoh', this.imgoh, 'v.y', v.y)
              return {
                x: Math.floor((this.imgow - v.x) * this.countpro * confpro),
                y: Math.floor((this.imgoh - v.y) * this.countpro * confpro),
                value: v.value, macs: v.macs
              }
            })
            break
          case 270:
            tmpdata = tmpdata.map((v, i) => {
              console.log('this.countpro', this.countpro, 'confpro', confpro, 'this.imgoh', this.imgoh, 'v.y', v.y)
              return {
                x: Math.floor(v.y * this.countpro * confpro),
                y: Math.floor((this.imgow - v.x) * this.countpro * confpro),
                value: v.value, macs: v.macs
              }
            })
            break
        }
        this.maxv = tmpdata.reduce((prev, cur) => { return Math.max(prev, cur.value) }, 0)
        this.heatmapInstance.setData({
          max: this.defConf.chart.max || this.maxv * 1,
          min: 0,
          data: tmpdata
        })
      }
    },
    resetCanvas() {
      if (document.querySelector('#heatmap')) {
        document.querySelector('#heatmap').innerHTML = ''
        this.heatmapInstance = undefined
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.heatmap{
    margin-left: 15px;
    img{ max-width: 100%; display: block;}
}
</style>
