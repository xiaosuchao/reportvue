window.objVisualConf = {
  pubparams: [
    {
      name: 'loc', // 选择店的名称    配置文件里的名称应该不同 与ID一样
      type: 'loc', // 类型 loc 店地址  date 日期
      isshow: true, // 是否显示
      position: 'showpuborgtree', // 位置
      pubpams: true, // 是否是公共参数
      id: 'loc', // 对象ID  ,店不受JS控制ID固定为loc
      multival: false // 多参数选择 非图表店参数的多参数属性必须是假 不然图表里的楼层没法更改
    },
    {
      name:	'dates',			// 年月日选择  日期控件更改不了，暂时固定名称为dates
      isshow:	true,				// 是否显示
      pubpams: true, // 是否是公共参数
      position:	'selecttimediv',	// 位置
      id:	'dates',			// 对象ID,日期不受JS控制固定为dates
      multival: true, // 日期是日期点还是时间范围
      defvalue: '{config_page_env:initdate}'
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
    [{ id: 'yaoyue', col: 24, classname: 'a', type: 'chart', title: '邀约能力分析' }]
  ],
  components: [
    {
      title: '邀约能力分析',				// 图表名称

      id:	'yaoyue',				// 图一 ID
      icon: true,
      icontent: '邀约能力分析</br>重复客流一般被认为属于二次邀约顾客，这部分顾客在总客流中的占比可以体现店内顾客二次邀约能力的强弱',

      char_pos: {
        pos_id:	'yaoyue'		// 图表显示所在DIV位置
      },

      layout: {
        titlebar: true,					// 图表 titlebar
        title:	'重复客流占比'
      },
      params: [
        {
          name:	'last30loc',						// 地址ID
          type:	'loc',
          fixvalue:	false, // 值是否固定
          defvalue:	'{pubchar_pams:loc}', // 默认值
          multival:	false, // 如果多选，多个value之间用"|"间隔
          pubpams:	true,						// 是否是公共参数
          title:	'店',						// 参数名称
          value:	''							// 值
        },
        {
          name: 'monthcustomerdate',
          type: 'date',
          fixvalue: false,
          defvalue: '{config_page_env:initdate}', // 当前时间格式 yyyymmddhhiiss   yyyy年 mm月 dd日 hh 时 ii分 ss秒  需小写
          dateformat: 'yyyy-mm-dd',
          minval: '2015-04-01',
          maxval: '2025-12-31',
          preval: 'stopdate',
          rangeval: true,
          offsets: '', // 参数值偏移量
          pubpams: true,
          title: '日期',
          value: ''
        }
      ],
      chart: {
        type: 'line',
        framework: 'hicharts', // hicharts, echarts
        title: '重复客流占比',
        credits: {
          enabled: false
        },
        tooltip: {
          shared: true,
          pointFormat: '{series.name}: <b>{point.y}</b><br/>'
        },
        xAxis: {
          crosshair: true,
          type: 'category',
          // categories: [],
          isfulsh: true
        },
        yAxis: {
          allowDecimals: false,
          title: {
            text: '百分比'
          }
        },

        series: {
          fromurl: true
        },

        datas: [
          {
            title: '重复客流占比',
            type: 'line',
            url: 'https://api.auc2.com/api/v1/tag/tag_c0000000000_1005/last/full?unitid=C0000000201&aid={last30loc}&date={monthcustomerdate}',
            // data  : [{x:'20180520', y:30},{x:'20180521', y:20},{x:'20180522', y:25},{x:'20180523', y:39},{x:'20180524', y:28}],
            expandparam: false,
            showtable: false
          }
        ]
      }
    }

  ]

}

