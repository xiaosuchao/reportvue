export default {
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
    [{
      id: 'a',
      col: 24,
      classname: 'a',
      type: 'chart'
    }],
    [{
      id: 'b',
      col: 12,
      classname: 'b',
      type: 'chart'
    }, {
      id: 'c',
      col: 12,
      classname: 'c',
      type: 'chart'
    }]
  ],
  components: [{
    title: '过去30天客流', // 图表名称
    icon: true,
    icontent: '过去30天客流</br>过去30天店内各种客流趋势</br>首次客流，指过去30天内没有到店行为的顾客</br>高意向客流，高意向客流是指当天在店内累计停留超过15分钟的顾客</br>重复客流，过去90天内有过到店的顾客</br>客流批次，系统根据探测到的数据以及计算模型，认为某几个mac是同一组顾客，那么就叫一个批次',

    id: 'monthflow', // 图一 ID

    char_pos: {
      pos_id: 'monthflow' // 图表显示所在DIV位置
    },

    layout: {
      titlebar: true, // 图表 titlebar
      title: '过去30天客流'
    },
    params: [{
      name: 'last30loc', // 地址ID
      type: 'loc',
      fixvalue: false, // 值是否固定
      defvalue: '{pubchar_pams:loc}', // 默认值
      multival: false, // 如果多选，多个value之间用"|"间隔
      pubpams: true, // 是否是公共参数
      title: '店', // 参数名称
      value: '' // 值
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
      type: 'line',
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
        //  type: 'category',
        isfulsh: true
      },
      yAxis: {
        allowDecimals: false,
        title: {
          text: '客流数量'
        }
      },
      datas: [{
        title: '总客流数',
        type: 'line',
        url: 'https://api.auc2.com/api/v1/sqdemo/tag_c0000000000_0007/last30?unitid=C0000000201&aid={last30loc}&date={monthcustomerdate}',
        expandparam: false,
        showtable: false
      },
      {
        title: '客流批次',
        type: 'line',
        url: 'https://api.auc2.com/api/v1/sqdemo/tag_c0000000000_0022/last30?unitid=C0000000201&aid={last30loc}&date={monthcustomerdate}',
        expandparam: false,
        showtable: false
      },
      {
        title: '首次客流',
        type: 'line',
        url: 'https://api.auc2.com/api/v1/sqdemo/newcustomer/last30?unitid=C0000000201&aid={last30loc}&date={monthcustomerdate}',
        expandparam: false,
        showtable: false
      },
      {
        title: '高意向客流',
        type: 'line',
        url: 'https://api.auc2.com/api/v1/sqdemo/tag_c0000000000_0015/last30?unitid=C0000000201&aid={last30loc}&date={monthcustomerdate}',
        expandparam: false,
        showtable: false
      },
      {
        title: '重复客流',
        type: 'line',
        url: 'https://api.auc2.com/api/v1/sqdemo/tag_c0000000000_0010/last30?unitid=C0000000201&aid={last30loc}&date={monthcustomerdate}',
        expandparam: false,
        showtable: false
      } //* /
      ]
    }
  },
  {
    title: '顾客平均停留时间', // 图表名称
    icon: true,
    icontent: '顾客平均停留时间</br>当天内，各种有效顾客在店内停留时间分布，此图可以看出顾客在店内停留多长时间占多数',

    id: 'stayTimeWeek', // 图一 ID

    char_pos: {
      pos_id: 'stayTimeWeek' // 图表显示所在DIV位置
    },

    layout: {
      titlebar: true, // 图表 titlebar
      title: '顾客平均停留时间'
    },
    params: [{
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
      type: 'bar',
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
      datas: [{
        title: '客流',
        barWidth: '60%',
        type: 'bar',
        url: 'https://api.auc2.com/api/v1/sqdemo/tag_c0000000000_0019?unitid=C0000000201&aid={stayTimeWeekloc}&date={stayTimeWeekdate}',
        expandparam: false,
        showtable: false
      }]
    }
  },

  {
    title: '客流漏斗', // 图表名称
    icon: true,
    icontent: '客流漏斗</br>当天内，客流漏斗转化情况展示，可以看出所有顾客到高意向顾客各阶段数量',

    id: 'newrepeatweek', // 图一 ID

    char_pos: {
      pos_id: 'newrepeatweek' // 图表显示所在DIV位置
    },

    layout: {
      titlebar: true, // 图表 titlebar
      title: '客流漏斗'
    },
    params: [{
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
      plotOptions: {
        series: {
          neckWidth: '10%',
          neckHeight: '0%',
          shadow: true
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
      datas: [{
        title: '客流',
        type: 'funnel',
        url: 'https://api.auc2.com/api/v1/sqdemo/custfunnel?unitid=C0000000201&aid={newrepeatweekloc}&date={newrepeatweekdate}',
        // data		: [{"x":"探测移动设备总数","y":1233}, {"x":"客流数量","y":322}, {"x":"高意向客流","y":23}],
        expandparam: false,
        showtable: false
      }]
    }
  }
  ]

}
