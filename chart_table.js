window.objVisualConf = {
  pubparams: [
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
    [{ id: 'tanzhen', col: 24, classname: 'a', type: 'table', title: '区域探针监测' }],
    [{ id: 'jxstanzhen', col: 24, classname: 'a', type: 'table', title: '经销商探针监测' }]
  ],
  components: [
    {
      title: '区域探针监测',				// 图表名称

      id:	'regionreport',				// 图一 ID

      char_pos: {
        pos_id:	'regionreport'		// 图表显示所在DIV位置
      },

      layout: {
        titlebar: true,					// 图表 titlebar
        title:	'区域探针监测'
      },
      params: [
        {
          name:	'loc',						// 地址ID
          type:	'location',
          fixvalue:	true, // 值是否固定
          defvalue:	'3302031002001', // 默认值
          multival:	false, // 如果多选，多个value之间用"|"间隔
          pubpams:	true,						// 是否是公共参数
          title:	'店',						// 参数名称
          value:	''							// 值
        },
        {
          name: 'sensor',
          type: 'level',
          fixvalue: false,
          defvalue: '%',
          multival: true,
          preval: 'loc',
          menuname: '全部/客流探针/车载探针',
          menuvalue: '%/fixed/car',
          pubpams: false,
          title: '探针类型',
          isshow: true
        },
        {
          name: 'activity',
          type: 'level',
          fixvalue: false,
          defvalue: '%',
          multival: true,
          preval: 'loc',
          menuname: '全部/BMW/MINI',
          menuvalue: '%/BMW/MINI',
          pubpams: false,
          title: '品牌',
          isshow: false
        },
        {
          name: 'dates',
          type: 'date',
          fixvalue: false,
          defvalue: '{config_page_env:initdate}',
          minval: '2015-01-01',
          maxval: '2021-12-31',
          preval: 'stopdate',
          rangeval: true,
          offsets: '', // 参数值偏移量
          pubpams:	true,
          title:	'日期',
          value:	''
        },
        {
          name: 'getAssayChartShow',
          value: 'getAssayChart1'
        }
      ],
      chart: {
        framework: 'table', // hicharts, echarts
        title: '区域探针监测报告',

        table: {						// 数据表格定义
          pos: 'left',			// 数据表格所在的位置 ：top  right,left ,bottom
          style: ''		// 数据表格样式：高，宽，背景色等html的style值
        },
        tabletitle: '',
        datas: [
          {
            title: '活动报告',
            type: 'column',
            // url: 'https://iwp.bmw.com.cn/index.php/show/{getAssayChartShow}?api_type=chart&api_param=/api/v1/bmw/device/status/report/region&unitid=CBMW0000193&sensor={sensor}&date={dates}&aid={activity}',
            url: 'https://api.auc2.com/api/v1/bmw/device/status/report/dealer?unitid=CBMW0000193&sensor={sensor}&date={dates}&aid=%25&rands=0.9182032385237204',
            data: [['总计', '200', '100%', '60', '100%', '30%', '140', '70', '100%', '35%'], ['福州（0725-0726）', '70', '30%', '20', '33%', '20%', '60', '30', '43%', '12%'], ['福州（0801-0802）', '70', '30%', '20', '33%', '10%', '40', '20', '37%', '11%'], ['厦门（0725-0726）', '60', '20%', '20', '33%', '10%', '40', '20', '28%', '12%']],
            expandparam: false,
            showtable: false
          }
        ]
      }
    },
    // 图一 每日累计客流
    {
      title: '经销商探针监测',				// 图表名称

      id:	'activityreport',				// 图一 ID

      char_pos: {
        pos_id:	'activityreport'		// 图表显示所在DIV位置
      },

      layout: {
        titlebar: true,					// 图表 titlebar
        title:	'经销商探针监测'
      },
      params: [
        {
          name:	'loc',						// 地址ID
          type:	'location',
          fixvalue:	true, // 值是否固定
          defvalue:	'3302031002001', // 默认值
          multival:	false, // 如果多选，多个value之间用"|"间隔
          pubpams:	true,						// 是否是公共参数
          title:	'店',						// 参数名称
          value:	''							// 值
        },
        {
          name: 'sensor',
          type: 'level',
          fixvalue: false,
          defvalue: '%',
          multival: true,
          preval: 'loc',
          menuname: '全部/客流探针/车载探针',
          menuvalue: '%/fixed/car',
          pubpams: false,
          title: '探针类型'
        },
        {
          name: 'activity',
          type: 'level',
          fixvalue: false,
          defvalue: '%',
          multival: true,
          preval: 'loc',
          menuname: '全部/BMW/MINI',
          menuvalue: '%/BMW/MINI',
          pubpams: false,
          title: '品牌'
        },
        {
          name: 'dates',
          type: 'date',
          fixvalue: false,
          defvalue: '{config_page_env:initdate}',
          minval: '2015-01-01',
          maxval: '2021-12-31',
          preval: 'stopdate',
          rangeval: true,
          offsets: '', // 参数值偏移量
          pubpams:	true,
          title:	'日期',
          value:	''
        },
        {
          name: 'getAssayChartShow',
          value: 'getAssayChart1'
        }
      ],
      chart: {
        framework: 'table', // hicharts, echarts
        title: '经销商探针监测报告',

        table: {						// 数据表格定义
          pos: 'left',			// 数据表格所在的位置 ：top  right,left ,bottom
          style: ''		// 数据表格样式：高，宽，背景色等html的style值
        },
        tabletitle: '',
        datas: [
          {
            title: '经销商探针监测报告',
            type: 'column',
            // url: 'https://iwp.bmw.com.cn/index.php/show/{getAssayChartShow}?api_type=chart&api_param=/api/v1/bmw/device/status/report/dealer&unitid=CBMW0000193&sensor={sensor}&date={dates}&aid={activity}',
            data: [['总计', '200', '100%', '60', '100%', '30%', '140', '70', '100%', '35%'], ['福州（0725-0726）', '70', '30%', '20', '33%', '20%', '60', '30', '43%', '12%'], ['福州（0801-0802）', '70', '30%', '20', '33%', '10%', '40', '20', '37%', '11%'], ['厦门（0725-0726）', '60', '20%', '20', '33%', '10%', '40', '20', '28%', '12%']],
            expandparam: false,
            showtable: false
          }
        ]
      }
    }
  ]

}

