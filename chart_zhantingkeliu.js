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
    [{ id: 'usertotal', col: 24, classname: 'a', type: 'chart', title: '展厅重点车型客流' }],
    [{ id: 'dayflow', col: 24, classname: 'a', type: 'chart', title: '过去30天的日均客流分布曲线' }]

  ],
  components: [
    {
      title: '展厅重点车型客流',

      id: 'usertotal', // 图二 ID

      char_pos: {
        pos_id: 'usertotal' // 图表显示所在DIV位置
      },

      layout: {
        titlebar: true
      },
      params: [
        {
          name: 'usertotalloc', // 店地址ID
          type: 'loc',
          fixvalue: false, // 值是否固定
          defvalue: '{pubchar_pams:loc}', // 默认值
          multival: false, // 如果多选，多个value之间用"|"间隔
          value: '', // 配置变量格式必须是"{变量名称:变量key值}"
          isshow: false,
          pubpams: true,
          title: '店'
        },
        {
          name: 'usertotaldate',
          type: 'date',
          fixvalue: false,
          defvalue: '{config_page_env:initdate}', // 当前时间格式 yyyymmddhhiiss   yyyy年 mm月 dd日 hh 时 ii分 ss秒  需小写
          dateformat: 'yyyy-mm-dd',
          minval: '2015-04-01',
          maxval: '2025-12-31',
          preval: 'stopdate',
          isshow: false,
          rangeval: true,
          offsets: '', // 参数值偏移量
          pubpams: true,
          title: '日期',
          value: ''
        }

      ],
      chart: {
        framework: 'hicharts',
        title: '展厅重点车型客流',
        type: 'column',
        credits: {
          enabled: false
        },

        table: { // 数据表格定义
          pos: 'bottom', // 数据表格所在的位置 ：top  right,left ,bottom
          style: 'width:80%;' // 数据表格样式：高，宽，背景色等html的style值
        },
        xAxis: {
          // isfulsh:true,
          type: 'category'
        },
        yAxis: {
          title: {
            text: '客流数量'
          }
        },

        series: {
          fromurl: true
        },
        datas: [
          {
            title: '全新BMW X3',
            type: 'column',
            url: 'https://api.auc2.com/api/v1/sqdemo/tag_c0000000000_0030/list?unitid=C0000000201&aid={usertotalloc}&focus=car&date={usertotaldate}',
            // data  : [{x:'20180520', y:13},{x:'20180521', y:7},{x:'20180522', y:6},{x:'20180523', y:9},{x:'20180524', y:10}],
            expandparam: false,
            showtable: false
          }
        ]
      }
    },
    // 当日客流
    {
      title: '过去30天的日均客流分布曲线',

      id: 'dayflow', // 图二 ID

      char_pos: {
        pos_id: 'dayflow' // 图表显示所在DIV位置
      },

      layout: {
        titlebar: true
      },
      params: [
        {
          name: 'usertotalloc', // 店地址ID
          type: 'loc',
          fixvalue: false, // 值是否固定
          defvalue: '{pubchar_pams:loc}', // 默认值
          multival: false, // 如果多选，多个value之间用"|"间隔
          value: '', // 配置变量格式必须是"{变量名称:变量key值}"
          pubpams: true,
          title: '店'
        },
        {
          name: 'usertotaldate',
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
        framework: 'hicharts',
        type: 'column',
        title: '过去30天的日均客流分布曲线',
        credits: {
          enabled: false
        },

        table: { // 数据表格定义
          pos: 'bottom', // 数据表格所在的位置 ：top  right,left ,bottom
          style: 'width:80%;' // 数据表格样式：高，宽，背景色等html的style值
        },
        xAxis: {
          // isfulsh:true,
          type: 'category'
        },
        yAxis: {
          title: {
            text: '客流数量'
          }
        },

        series: {
          fromurl: true
        },
        datas: [
          {
            title: '全新BMW X3',
            type: 'column',
            url: 'https://api.auc2.com/api/v1/tag/tag_c0000000000_0012/avg?unitid=C0000000201&aid={usertotalloc}&date={usertotaldate}',
            // data  : [{x:'20180520', y:13},{x:'20180521', y:7},{x:'20180522', y:6},{x:'20180523', y:9},{x:'20180524', y:10}],
            expandparam: false,
            showtable: false
          }
        ]
      }
    } //* /

  ]

}

