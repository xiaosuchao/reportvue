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
      multival: false, // 日期是日期点还是时间范围
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
    [{ 'id': 'today_instore', col: 6, type: 'block', title: '今日客流' }, { 'id': 'today_avgstay', col: 6, type: 'block', title: '平均停留时间' },
      { 'id': 'today_hintent', col: 6, type: 'block', title: '高意向客流' }, { 'id': 'today_repeat', col: 6, type: 'block', title: '重复访客' }],
    [{ id: 'a', col: 24, classname: 'a', type: 'chart', title: '过去30天客流' }],
    [{ id: 'b', col: 12, classname: 'b', type: 'chart', title: '客户平均停留时间' }, { id: 'c', col: 12, classname: 'c', type: 'chart', title: '客流漏斗' }]],
  components: [
    // 方块 店内客流
    {
      title: '今日客流', // 图表名称

      id: 'today_instore', // 图一 ID
      char_pos: {
        pos_id: 'today_instore' // 图表显示所在DIV位置
      },

      layout: {
        titlebar: false, // 图表 titlebar 是否显示
        title: '' // titlebar 名称
      },
      params: [
        {
          name: 'today_instoreloc', // 地址ID
          type: 'loc', // 参数类型
          fixvalue: false, // 值是否固定
          defvalue: '{pubchar_pams:loc}', // 默认值
          multival: false, // 如果多选，多个value之间用"|"间隔
          pubpams: true, // 是否是公共参数
          title: '店', // 参数名称
          value: '' // 值
        },
        {
          name: 'today_instoredate',
          type: 'date',
          fixvalue: false,
          defvalue: '{config_page_env:sysdate}', // 当前时间格式 yyyymmddhhiiss   yyyy年 mm月 dd日 hh 时 ii分 ss秒  需小写
          dateformat: 'yyyy-mm-dd',
          minval: '2015-04-01',
          maxval: '2025-12-31',
          preval: 'stopdate',
          rangeval: false,
          offsets: '', // 参数值偏移量
          pubpams: true,
          title: '日期',
          value: ''
        }
      ],
      chart: {
        framework: 'hicharts', // yChart样式 不可以为空
        title: '今日客流',

        table: { // 数据表格定义
          pos: '', // 数据表格所在的位置 ：top  right,left ,bottom
          style: '' // 数据表格样式：高，宽，背景色等html的style值
        },
        datas: [
          {
            title: '今日客流（人）', // 数据名称
            type: 'ychart', // 图表类型 ychart为单一一个统计数据
            url: 'https://api.auc2.com/api/v1/sqdemo/tag_c0000000000_0007?unitid=C0000000201&aid={today_instoreloc}&date={today_instoredate}',
            expandparam: false,
            backgroundico: 'fa-shopping-cart', // yChart类型专有：地图的图标ICO
            backgroudColor: '#00adef', // yChart类型专有：数据块背景色：英文单词颜色 或 '#RGB'值
            showtable: false // 非yChart类型专有：是否显示数据表格
          }
        ]
      }
    },
    // 方块 平均停留时间
    {
      title: '平均停留时间', // 图表名称

      id: 'today_avgstay', // 图一 ID
      icon: true,
      icontent: '平均停留时间</br>当天内有效客户在店内的平均停留时间',
      char_pos: {
        pos_id: 'today_avgstay' // 图表显示所在DIV位置
      },

      layout: {
        titlebar: false, // 图表 titlebar 是否显示
        title: '' // titlebar 名称
      },
      params: [
        {
          name: 'today_avgstayloc', // 地址ID
          type: 'loc', // 参数类型
          fixvalue: false, // 值是否固定
          defvalue: '{pubchar_pams:loc}', // 默认值
          multival: false, // 如果多选，多个value之间用"|"间隔
          pubpams: true, // 是否是公共参数
          title: '店', // 参数名称
          value: '' // 值
        },
        {
          name: 'today_avgstaydate',
          type: 'date',
          fixvalue: false,
          defvalue: '{config_page_env:sysdate}', // 当前时间格式 yyyymmddhhiiss   yyyy年 mm月 dd日 hh 时 ii分 ss秒  需小写
          dateformat: 'yyyy-mm-dd',
          minval: '2015-04-01',
          maxval: '2025-12-31',
          preval: 'stopdate',
          rangeval: false,
          offsets: '', // 参数值偏移量
          pubpams: true,
          title: '日期',
          value: ''
        }
      ],
      chart: {
        framework: 'hicharts', // yChart样式 不可以为空
        title: '平均停留时间',

        table: { // 数据表格定义
          pos: '', // 数据表格所在的位置 ：top  right,left ,bottom
          style: '' // 数据表格样式：高，宽，背景色等html的style值
        },
        datas: [
          {
            title: '平均停留时间（分钟）', // 数据名称
            type: 'ychart', // 图表类型 ychart为单一一个统计数据
            url: 'https://api.auc2.com/api/v1/sqdemo/tag_c0000000000_0008?unitid=C0000000201&aid={today_avgstayloc}&date={today_avgstaydate}',
            expandparam: false,
            backgroundico: 'fa-bar-chart-o', // yChart类型专有：地图的图标ICO
            backgroudColor: '#00adef', // yChart类型专有：数据块背景色：英文单词颜色 或 '#RGB'值
            showtable: false // 非yChart类型专有：是否显示数据表格
          }
        ]
      }
    },

    // 方块 高意向客流
    {
      title: '高意向客流', // 图表名称

      id: 'today_hintent', // 图一 ID
      icon: true,
      icontent: '高意向客流</br>高意向客流是指当天在店内累计停留超过15分钟的客户',
      char_pos: {
        pos_id: 'today_hintent' // 图表显示所在DIV位置
      },

      layout: {
        titlebar: false, // 图表 titlebar 是否显示
        title: '' // titlebar 名称
      },
      params: [
        {
          name: 'today_hintentloc', // 地址ID
          type: 'loc', // 参数类型
          fixvalue: false, // 值是否固定
          defvalue: '{pubchar_pams:loc}', // 默认值
          multival: false, // 如果多选，多个value之间用"|"间隔
          pubpams: true, // 是否是公共参数
          title: '店', // 参数名称
          value: '' // 值
        },
        {
          name: 'today_instoredate',
          type: 'date',
          fixvalue: false,
          defvalue: '{config_page_env:sysdate}', // 当前时间格式 yyyymmddhhiiss   yyyy年 mm月 dd日 hh 时 ii分 ss秒  需小写
          dateformat: 'yyyy-mm-dd',
          minval: '2015-04-01',
          maxval: '2025-12-31',
          preval: 'stopdate',
          rangeval: false,
          offsets: '', // 参数值偏移量
          pubpams: true,
          title: '日期',
          value: ''
        }
      ],
      chart: {
        framework: 'hicharts', // yChart样式 不可以为空
        title: '高意向客流',

        table: { // 数据表格定义
          pos: '', // 数据表格所在的位置 ：top  right,left ,bottom
          style: '' // 数据表格样式：高，宽，背景色等html的style值
        },
        datas: [
          {
            title: '高意向客流（人）', // 数据名称
            type: 'ychart', // 图表类型 ychart为单一一个统计数据
            url: 'https://api.auc2.com/api/v1/sqdemo/tag_c0000000000_0015?unitid=C0000000201&aid={today_hintentloc}&date={today_instoredate}',
            expandparam: false,
            backgroundico: 'fa-shopping-cart', // yChart类型专有：地图的图标ICO
            backgroudColor: '#00adef', // yChart类型专有：数据块背景色：英文单词颜色 或 '#RGB'值
            showtable: false // 非yChart类型专有：是否显示数据表格
          }
        ]
      }
    },

    // 方块 重复访客
    {
      title: '重复访客', // 图表名称

      id: 'today_repeat', // 图一 ID
      icon: true,
      icontent: '重复访客</br>过去90天内有过到店行为的客户',
      char_pos: {
        pos_id: 'today_repeat' // 图表显示所在DIV位置
      },

      layout: {
        titlebar: true, // 图表 titlebar
        title: '重复访客'
      },
      params: [
        {
          name: 'today_repeatloc', // 地址ID
          type: 'loc',
          fixvalue: false, // 值是否固定
          defvalue: '{pubchar_pams:loc}', // 默认值
          multival: false, // 如果多选，多个value之间用"|"间隔
          pubpams: true, // 是否是公共参数
          title: '店', // 参数名称
          value: '' // 值
        },
        {
          name: 'today_repeatdate',
          type: 'date',
          fixvalue: false,
          defvalue: '{config_page_env:sysdate}', // 当前时间格式 yyyymmddhhiiss   yyyy年 mm月 dd日 hh 时 ii分 ss秒  需小写
          dateformat: 'yyyy-mm-dd',
          minval: '2015-04-01',
          maxval: '2025-12-31',
          preval: 'stopdate',
          rangeval: false,
          offsets: '', // 参数值偏移量
          pubpams: true,
          title: '日期',
          value: ''
        }
      ],
      chart: {
        framework: 'hicharts', // hicharts, echarts
        title: '重复访客',

        table: { // 数据表格定义
          pos: 'left', // 数据表格所在的位置 ：top  right,left ,bottom
          style: '' // 数据表格样式：高，宽，背景色等html的style值
        },

        datas: [
          {
            title: '重复访客（人）', // 数据名称
            type: 'ychart', // 图表类型 ychart为单一一个统计数据
            url: 'https://api.auc2.com/api/v1/sqdemo/tag_c0000000000_0010?unitid=C0000000201&aid={today_repeatloc}&date={today_repeatdate}',
            // data        :   [{"x":"","y":"0"}],
            expandparam: false,
            backgroundico: 'fa-bar-chart-o', // yChart类型专有：地图的图标ICO
            backgroudColor: '#00adef', // yChart类型专有：数据块背景色：英文单词颜色 或 '#RGB'值
            showtable: false // 非yChart类型专有：是否显示数据表格
          }
        ]
      }
    },
    {
      title: '过去30天客流',				// 图表名称
      tool: 'highchart',
      icon: true,
      icontent: '过去30天客流</br>过去30天店内各种客流趋势</br>首次客流，指过去30天内没有到店行为的客户</br>高意向客流，高意向客流是指当天在店内累计停留超过15分钟的客户</br>重复客流，过去90天内有过到店行为的客户</br>客流批次，系统根据探测到的数据以及计算模型，判定某几个MAC是同一组客户，即为一个批次',
      id:	'monthflow',				// 图一 ID

      char_pos: {
        pos_id:	'monthflow'		// 图表显示所在DIV位置
      },

      layout: {
        titlebar: true,					// 图表 titlebar
        title:	'过去30天客流'
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
          defvalue: '{config_page_env:sysdate}', // 当前时间格式 yyyymmddhhiiss   yyyy年 mm月 dd日 hh 时 ii分 ss秒  需小写
          dateformat: 'yyyy-mm-dd',
          minval: '2015-04-01',
          maxval: '2025-12-31',
          preval: 'stopdate',
          rangeval: false,
          offsets: '', // 参数值偏移量
          pubpams: true,
          title: '日期',
          value: ''
        }
      ],
      chart: {
        type: 'spline',
        framework: 'hicharts', // hicharts, echarts
        title: '过去30天客流',
        credits: {
          enabled: false
        },
        tooltip: {
          shared: true,
          pointFormat: '{series.name}: <b>{point.y}</b><br/>'
        },
        xAxis: {
          crosshair: true,
          // type: 'category',
          isfulsh: true
        },
        yAxis: {
          allowDecimals: false,
          title: {
            text: '客流'
          }
        },
        datas: [
          {
            title: '总客流数',
            type: 'spline',
            url: 'https://api.auc2.com/api/v1/sqdemo/tag_c0000000000_0007/last30?unitid=C0000000201&aid={last30loc}&date={monthcustomerdate}',
            expandparam: false,
            showtable: false
          },
          {
            title: '客流批次',
            type: 'spline',
            url: 'https://api.auc2.com/api/v1/sqdemo/tag_c0000000000_0022/last30?unitid=C0000000201&aid={last30loc}&date={monthcustomerdate}',
            expandparam: false,
            showtable: false
          },
          {
            title: '首次客流',
            type: 'spline',
            url: 'https://api.auc2.com/api/v1/sqdemo/newcustomer/last30?unitid=C0000000201&aid={last30loc}&date={monthcustomerdate}',
            expandparam: false,
            showtable: false
          },
          {
            title: '高意向客流',
            type: 'spline',
            url: 'https://api.auc2.com/api/v1/sqdemo/tag_c0000000000_0015/last30?unitid=C0000000201&aid={last30loc}&date={monthcustomerdate}',
            expandparam: false,
            showtable: false
          },
          {
            title: '重复客流',
            type: 'spline',
            url: 'https://api.auc2.com/api/v1/sqdemo/tag_c0000000000_0010/last30?unitid=C0000000201&aid=2301020001001&date={monthcustomerdate}',
            expandparam: false,
            showtable: false
          }
        ]
      }
    },
    {
      title: '客户平均停留时间', // 图表名称
      tool: 'highchart',
      icon: true,
      icontent: '客户平均停留时间</br>当天内有效客户在店内停留时间分布',

      id: 'stayTimeWeek', // 图一 ID

      char_pos: {
        pos_id: 'stayTimeWeek' // 图表显示所在DIV位置
      },

      layout: {
        titlebar: true, // 图表 titlebar
        title: '客户平均停留时间'
      },
      params: [
        {
          name: 'stayTimeWeekmac', // 用户MAC
          type: 'text', // 这是文本输入框类型
          valtype: 'mac', // 值的类型
          fixvalue: false, // 值是否固定
          defvalue: '', // 默认值
          multival: false, // 如果多选，多个value之间用"|"间隔
          value: '', // 配置变量格式必须是"{变量名称:变量key值}"
          pubpams: true,
          title: 'MAC地址'
        },
        {
          name: 'stayTimeWeekloc', // 地址ID
          type: 'loc',
          fixvalue: false, // 值是否固定
          defvalue: '{pubchar_pams:loc}', // 默认值
          multival: false, // 如果多选，多个value之间用"|"间隔
          pubpams: true, // 是否是公共参数
          title: '店', // 参数名称
          value: '' // 值
        },
        {
          name: 'stayTimeWeekdate',
          type: 'date',
          fixvalue: false,
          defvalue: '{config_page_env:sysdate}', // 当前时间格式 yyyymmddhhiiss   yyyy年 mm月 dd日 hh 时 ii分 ss秒  需小写
          dateformat: 'yyyy-mm-dd',
          minval: '2015-04-01',
          maxval: '2025-12-31',
          preval: 'stopdate',
          rangeval: false,
          offsets: '', // 参数值偏移量
          pubpams: true,
          title: '日期',
          value: ''
        }
      ],
      chart: {
        framework: 'hicharts', // hicharts, echarts
        title: '平均停留时间分布',
        type: 'column',
        credits: {
          enabled: false
        },

        table: { // 数据表格定义
          pos: 'left', // 数据表格所在的位置 ：top  right,left ,bottom
          style: '' // 数据表格样式：高，宽，背景色等html的style值
        },
        xAxis: {
          isfulsh: true,
          type: 'category'

        },
        yAxis: {
          title: {
            text: '客流数量'
          }
        },
        plotOptions: {
          column: {
            dataLabels: {
              enabled: true,
              inside: true,
              format: '{y:.0f}',
              style: {
                fontWeight: 'bold',
                fontSize: '12px',
                color: 'black',
                textOutline: '0px 0px contrast'
              }
            }
          }
        },
        datas: [
          {
            title: '客流',
            type: 'column',
            url: 'https://api.auc2.com/api/v1/sqdemo/tag_c0000000000_0019?unitid=C0000000201&aid={stayTimeWeekloc}&date={stayTimeWeekdate}',
            expandparam: false,
            showtable: false
          }
        ]
      },
      relate: [
        {
          chartid: 'monthflow',
          maps: [
            {
              relateparam: 'x',
              myparam: 'stayTimeWeekdate'
            },
            {
              relateparam: 'last30loc',
              myparam: 'stayTimeWeekloc'
            }
          ]
        }
      ]
    },

    {
      title: '客流漏斗', // 图表名称\
      tool: 'highchart',
      icon: true,
      icontent: '客流漏斗</br>当天内，客流漏斗转化情况展示，可以看出所有客户到高意向客户各阶段数量',

      id: 'newrepeatweek', // 图一 ID

      char_pos: {
        pos_id: 'newrepeatweek' // 图表显示所在DIV位置
      },

      layout: {
        titlebar: true, // 图表 titlebar
        title: '客流漏斗'
      },
      params: [
        {
          name: 'newrepeatweekloc', // 地址ID
          type: 'loc',
          fixvalue: false, // 值是否固定
          defvalue: '{pubchar_pams:loc}', // 默认值
          multival: false, // 如果多选，多个value之间用"|"间隔
          pubpams: true, // 是否是公共参数
          title: '店', // 参数名称
          value: '' // 值
        },
        {
          name: 'newrepeatweekdate',
          type: 'date',
          fixvalue: false,
          defvalue: '{config_page_env:sysdate}', // 当前时间格式 yyyymmddhhiiss   yyyy年 mm月 dd日 hh 时 ii分 ss秒  需小写
          dateformat: 'yyyy-mm-dd',
          minval: '2015-04-01',
          maxval: '2025-12-31',
          preval: 'stopdate',
          rangeval: false,
          offsets: '', // 参数值偏移量
          pubpams: true,
          title: '日期',
          value: ''
        }
      ],
      chart: {
        framework: 'hicharts', // hicharts, echarts
        title: '客流漏斗',
        type: 'funnel',
        credits: {
          enabled: false
        },
        colors: ['#00adef', '#176db7', '#00ffff'],
        plotOptions: {
          series: {
            neckWidth: '10%',
            neckHeight: '0%',
            shadow: true
          },
          funnel: {
            dataLabels: {
              enabled: true,
              inside: true,
              format: '{y:.0f}',
              style: {
                fontWeight: 'bold',
                fontSize: '12px',
                color: 'black',
                textOutline: '0px 0px contrast'
              }
            }
          }
        },
        table: { // 数据表格定义
          pos: 'left', // 数据表格所在的位置 ：top  right,left ,bottom
          style: '' // 数据表格样式：高，宽，背景色等html的style值
        },
        xAxis: {
          isfulsh: true,
          type: 'category'

        },
        datas: [
          {
            title: '客流',
            type: 'funnel',
            url: 'https://api.auc2.com/api/v1/sqdemo/custfunnel?unitid=C0000000201&aid={newrepeatweekloc}&date={newrepeatweekdate}',
            // data		: [{"x":"探测移动设备总数","y":1233}, {"x":"客流数量","y":322}, {"x":"高意向客流","y":23}],
            expandparam: false,
            showtable: false
          }
        ]
      }
    }
  ]

}

