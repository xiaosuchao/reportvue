window.objVisualConf = {
  pubparams: [
    {
      name:	'loc', // 选择店的名称    配置文件里的名称应该不同 与ID一样
      type: 'loc',
      isshow:	true,				// 是否显示
      position:	'showpuborgtree',	// 位置
      pubpams: true, // 是否是公共参数
      id:	'loc',				// 对象ID	,店不受JS控制ID固定为loc
      defvalue: '4690060001131',
      multival: false // 多参数选择 非图表店参数的多参数属性必须是假 不然图表里的楼层没法更改
    },
    {
      name:	'dates',			// 年月日选择  日期控件更改不了，暂时固定名称为dates
      type: 'date',
      valueformat: 'yyyyMMddHHmm',
      isshow:	true,				// 是否显示
      pubpams: true, // 是否是公共参数
      position:	'selecttimediv',	// 位置
      id:	'dates',			// 对象ID,日期不受JS控制固定为dates
      multival: true // 日期是日期点还是时间范围
    },
    {
      name: 'btnfresh',
      type: 'btn',
      isshow: true
    }

  ],
  config_env: {
    locid: '1234567890123',
    level: '',
    user: '',
    orgcode: '',
    dates: '',
    maxincome: '',
    web_host: ''
  },
  config_page_env: {
    initdate: '',
    initloc: '',
    unitid: '',
    sysdate: '',
    user_loc: '',
    user_org_code: '',
    user_org_name: '',
    user_unit_id: '',
    user_unit_name: '',
    user_org_org: ''
  },
  layout: [
    [{ id: 'heatmapc', col: 24, classname: 'a', type: 'heatcavmap', title: '热点图' }]
  ],
  components: [
    {
      title: '热区图',				// 图表名称
      type: 'heatcavmap',
      id:	'heatmapc',				// 图一 ID
      icon: true,
      icontent: '热区图',

      char_pos: {
        pos_id:	'heatmapc'		// 图表显示所在DIV位置
      },

      layout: {
        titlebar: true,					// 图表 titlebar
        title:	'重复客流占比'
      },
      params: [
        {
          name: 'loc', // 地址ID
          type: 'loc',
          fixvalue: false, // 值是否固定
          // defvalue    :   "",            //默认值
          defvalue: '{config_page_env:initloc}', // 默认值
          multival: false, // 如果多选，多个value之间用"|"间隔
          pubpams: true, // 是否是公共参数
          title: '店', // 参数名称
          value: '' // 值
        },
        {
          name: 'heatmaptimes',
          type: 'date',
          fixvalue: false,
          defvalue: '{config_page_env:time_yesterday}',
          dateformat: 'yyyyMMddHHmm',
          rangeval: true,
          minval: '',
          maxval: '',
          preval: '',
          offsets: 0,
          pubpams: true,
          title: '时间',
          value: ''
        }

      ],
      chart: {
        type: 'heatcavmap',
        framework: 'hicharts', // hicharts, echarts
        title: '重复客流占比',
        backgroundImg: 'http://report.auc2.com/static/assets/test/map/C0000000201_{loc}.png',
        rotate: 0, // 旋转度数（0、90、180、270、360）必须是90的倍数
        pro: 1, // 实际距离跟现实比例
        max: 0,
        radius: 20,
        gradient: { 0.25: 'rgb(0,0,255)', 0.55: 'rgb(0,255,0)', 0.85: 'yellow', 1.0: 'rgb(255,0,0)' },
        url: 'https://api.auc2.com/api/v1/sqdemo/levelhotNew?unitid=C0000000201&aid={loc}&date={heatmaptimes}',
        // data: [{ 'x': 10, 'y': 120, 'count': 1, 'macs': [] }, { 'x': 232, 'y': 100, 'count': 1, 'macs': [] }, { 'x': 183, 'y': 175, 'count': 1, 'macs': [] }],
        // [

        //                         {"x": 80,"y": 50,"count":35,"macs":["f0:25:b7:97:0f:aa"]},
        //                         {"x": 20,"y": 17,"count":40,"macs":["f0:25:b7:97:0f:aa"]},
        //                         {"x": 90,"y": 35,"count":46,"macs":["f0:25:b7:97:0f:aa"]},
        //                         {"x": 20,"y": 40,"count":27,"macs":["f0:25:b7:97:0f:aa"]},
        //                         {"x": 50,"y": 38,"count":60,"macs":["f0:25:b7:97:0f:aa"]},
        //                         // {"x": 60,"y": 50,"count":30,"macs":["f0:25:b7:97:0f:aa"]},
        //                         // {"x": 70,"y": 100,"count":20,"macs":["00:08:22:0e:cb:33"]},
        //                         // {"x": 90,"y": 80,"count":20,"macs":["00:08:22:0e:cb:33"]},
        //                         // {"x": 110,"y": 30,"count":50,"macs":["00:08:22:0e:cb:33"]},
        //                         // {"x": 130,"y": 100,"count":60,"macs":["00:08:22:0e:cb:33"]},
        //                         // {"x": 80,"y": 120,"count":20,"macs":["00:08:22:0e:cb:33"]},
        //                         // {"x": 70,"y": 120,"count":50,"macs":["00:08:22:0e:cb:33"]},
        //                         // {"x": 180,"y": 90,"count":40,"macs":["00:08:22:0e:cb:33"]},
        //                         // {"x": 190,"y": 130,"count":70,"macs":["00:08:22:0e:cb:33"]},
        //                         // {"x": 200,"y": 100,"count":30,"macs":["00:08:22:0e:cb:33"]},
        //                         // {"x": 160,"y": 110,"count":60,"macs":["00:08:22:0e:cb:33"]},
        //                         // {"x": 100,"y": 130,"count":40,"macs":["00:08:22:0e:cb:33"]},
        //                         // {"x": 160,"y": 90,"count":30,"macs":["00:08:22:0e:cb:33"]},
        //                         ],
        expandparam: false,
        showtable: false
      }
    }

  ]

}

