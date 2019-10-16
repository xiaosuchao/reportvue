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
      name: 'dates',            // 年月日选择  日期控件更改不了，暂时固定名称为dates
      isshow:   true,               // 是否显示
      pubpams: true, // 是否是公共参数
      position: 'selecttimediv',    // 位置
      id:   'dates',            // 对象ID,日期不受JS控制固定为dates
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
    [{ id: 'gender', col: 12, classname: 'a', type: 'chart', title: '客户性别' },{ id: 'age', col: 12, classname: 'a', type: 'chart', title: '客户年龄' }],
    [{ id: 'star', col: 12, classname: 'a', type: 'chart', title: '客户星座' },{ id: 'education', col: 12, classname: 'a', type: 'chart', title: '客户学历' }],
    [{ id: 'business', col: 12, classname: 'a', type: 'chart', title: '客户职业' },{ id: 'car', col: 12, classname: 'a', type: 'chart', title: '客户车辆拥有状况' }],
    [{ id: 'house', col: 12, classname: 'a', type: 'chart', title: '客户住房拥有状况' }]
  ],
  components: [
      {
        title: "客户性别",              //图表名称
        id: 'gender',               //图一 ID
        char_pos: {
            pos_id: 'gender'        //图表显示所在DIV位置
        },
        layout: {
            titlebar: true,                 //图表 titlebar
            title: '客户性别'
        },
        params: [
            {
                name: "tagloc",                     //地址ID
                type: "loc",
                fixvalue: false,                        //值是否固定
                defvalue: "{pubchar_pams:loc}",             //默认值
                multival: false,                    //如果多选，多个value之间用"|"间隔
                pubpams: true,                      //是否是公共参数
                title: '店',                     //参数名称
                value: ''                           //值
            },
            {
                name: "tagdate",
                type: "date",
                fixvalue: false,
                defvalue: "{config_page_env:initdate}",                       //当前时间格式 yyyymmddhhiiss   yyyy年 mm月 dd日 hh 时 ii分 ss秒  需小写
                dateformat: 'yyyy-mm-dd',
                minval: "2015-04-01",
                maxval: "2025-12-31",
                preval: "stopdate",
                rangeval: true,
                offsets: '',                                 //参数值偏移量
                pubpams: true,
                title: '日期',
                value: ''
            }
        ],
        chart: {
            framework: "hicharts",       //hicharts, echarts
            title: '客户性别',
            type: 'pie',
            credits: {
                enabled: false
            },
            tooltip: {
                shared: true,
                pointFormat: '{series.name}: <b>{point.y}</b><br/>'
            },
            xAxis: {
                isfulsh:true,
                type: 'category'
            },
            yAxis: {
                allowDecimals: false,
                title: {
                    text: '客户性别'
                }
            },
            chart: {
                type: 'pie',
                options3d: {
                    enabled: true,
                    alpha: 45,
                    beta: 0
                }
            },
            lang: {
                noData: '所选范围样本量不足500，请扩大选取范围'
            },
            noData: {
                style: {
                    fontWeight: 'bold',
                    fontSize: '15px',
                    color: '#303030'
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    depth: 35,
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}: {y:.0f}<b>/{point.percentage:.1f}%</b>',
                        style: {
                            fontWeight: 'bold',
                            fontSize: '12px',
                            color: 'black',
                            textOutline: "0px 0px contrast"
                        }
                    }
                }
            },
            datas: [
                {
                    title: "客户性别",
                    type: 'pie',
                    //url: "https://api.auc2.com/api/v1/external/umeng/portrait?unitid=C0000000201&aid={tagloc}&tag=gender&date={tagdate}",
                    data:[{"x":"男","y":756},{"x":"女","y":341}],
                    expandparam: false,
                    showtable: false
                }
            ]
        }
    },
    {
        title: "客户年龄",				//图表名称
        id: 'age',				//图一 ID
        char_pos: {
            pos_id: 'age'		//图表显示所在DIV位置
        },
        layout: {
            titlebar: true,					//图表 titlebar
            title: '客户年龄'
        },
        params: [
            {
                name: "tagloc",						//地址ID
                type: "loc",
                fixvalue: false,            			//值是否固定
                defvalue: "{pubchar_pams:loc}",   	        //默认值
                multival: false,           			//如果多选，多个value之间用"|"间隔
                pubpams: true,						//是否是公共参数
                title: '店',						//参数名称
                value: ''							//值
            },
            {
                name: "tagdate",
                type: "date",
                fixvalue: false,
                defvalue: "{config_page_env:initdate}",                       //当前时间格式 yyyymmddhhiiss   yyyy年 mm月 dd日 hh 时 ii分 ss秒  需小写
                dateformat: 'yyyy-mm-dd',
                minval: "2015-04-01",
                maxval: "2025-12-31",
                preval: "stopdate",
                rangeval: true,
                offsets: '',                                 //参数值偏移量
                pubpams: true,
                title: '日期',
                value: ''
            }
        ],
        chart: {
            framework: "hicharts",       //hicharts, echarts
            title: '客户年龄',
            type: 'column',
            credits: {
                enabled: false
            },
            tooltip: {
                shared: true,
                pointFormat: '{series.name}: <b>{point.y}</b><br/>'
            },
            xAxis: {
                isfulsh:true,
                type: 'category'
            },
            yAxis: {
                allowDecimals: false,
                title: {
                    text: '客户年龄'
                }
            },
			lang: {
				noData: '所选范围样本量不足500，请扩大选取范围'
			},
			noData: {
				style: {
					fontWeight: 'bold',
					fontSize: '15px',
					color: '#303030'
				}
			},
			plotOptions: {
				column: {
					dataLabels: {
						enabled: true,
						format: '{y:.0f}',
						allowOverlap: true, // 允许数据标签重叠
						style: {
							fontWeight: 'bold',
							fontSize: '12px',
							color: 'black',
							textOutline: "0px 0px contrast"
						}
					}
				}
			},
            datas: [
                {
                    title: "客户年龄",
                    type: 'column',
                    //url: "https://api.auc2.com/api/v1/external/umeng/portrait?unitid=C0000000201&aid={tagloc}&tag=age&date={tagdate}",
                    data:[{"x":"18-24岁","y":170},{"x":"25-29岁","y":284},{"x":"30-34岁","y":217},{"x":"35-39岁","y":162},{"x":"40-49岁","y":186},{"x":"50-59岁","y":55},{"x":"60岁及以上","y":13}],
                    expandparam: false,
                    showtable: false
                }
            ]
        }
    },
        {
        title: "客户星座",              //图表名称
        id: 'star',             //图一 ID
        char_pos: {
            pos_id: 'star'      //图表显示所在DIV位置
        },
        layout: {
            titlebar: true,                 //图表 titlebar
            title: '客户星座'
        },
        params: [
            {
                name: "tagloc",                     //地址ID
                type: "loc",
                fixvalue: false,                        //值是否固定
                defvalue: "{pubchar_pams:loc}",             //默认值
                multival: false,                    //如果多选，多个value之间用"|"间隔
                pubpams: true,                      //是否是公共参数
                title: '店',                     //参数名称
                value: ''                           //值
            },
            {
                name: "tagdate",
                type: "date",
                fixvalue: false,
                defvalue: "{config_page_env:initdate}",                       //当前时间格式 yyyymmddhhiiss   yyyy年 mm月 dd日 hh 时 ii分 ss秒  需小写
                dateformat: 'yyyy-mm-dd',
                minval: "2015-04-01",
                maxval: "2025-12-31",
                preval: "stopdate",
                rangeval: true,
                offsets: '',                                 //参数值偏移量
                pubpams: true,
                title: '日期',
                value: ''
            }
        ],
        chart: {
            framework: "hicharts",       //hicharts, echarts
            title: '客户星座',
            type: 'column',
            credits: {
                enabled: false
            },
            chart: {
                polar: true,
                type: 'line'
            },
            tooltip: {
                shared: true,
                pointFormat: '{series.name}: <b>{point.y}</b><br/>'
            },
            xAxis: {
                isfulsh:true,
                type: 'category'
            },
            yAxis: {
                allowDecimals: false,
                labels: {
                    enabled: false
                }
            },
            lang: {
                noData: '所选范围样本量不足500，请扩大选取范围'
            },
            noData: {
                style: {
                    fontWeight: 'bold',
                    fontSize: '15px',
                    color: '#303030'
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
                                textOutline: "0px 0px contrast"
                            }
                    }
                }
            },
            datas: [
                {
                    title: "客户星座",
                    type: 'column',
                    //url: "https://api.auc2.com/api/v1/external/umeng/portrait?unitid=C0000000201&aid={tagloc}&tag=star&date={tagdate}",
                    data:[{"x":"白羊座","y":79},{"x":"金牛座","y":70},{"x":"双子座","y":83},{"x":"巨蟹座","y":63},{"x":"狮子座","y":79},{"x":"处女座","y":86},{"x":"天秤座","y":114},{"x":"天蝎座","y":83},{"x":"射手座","y":86},{"x":"魔羯座","y":67},{"x":"水瓶座","y":92},{"x":"双鱼座","y":82}],
                    expandparam: false,
                    showtable: false
                }
            ]
        }
    }, 
    {
        title: "客户学历",				//图表名称
        id: 'education',				//图一 ID
        char_pos: {
            pos_id: 'education'		//图表显示所在DIV位置
        },
        layout: {
            titlebar: true,					//图表 titlebar
            title: '客户学历'
        },
        params: [
            {
                name: "tagloc",						//地址ID
                type: "loc",
                fixvalue: false,            			//值是否固定
                defvalue: "{pubchar_pams:loc}",   	        //默认值
                multival: false,           			//如果多选，多个value之间用"|"间隔
                pubpams: true,						//是否是公共参数
                title: '店',						//参数名称
                value: ''							//值
            },
            {
                name: "tagdate",
                type: "date",
                fixvalue: false,
                defvalue: "{config_page_env:initdate}",                       //当前时间格式 yyyymmddhhiiss   yyyy年 mm月 dd日 hh 时 ii分 ss秒  需小写
                dateformat: 'yyyy-mm-dd',
                minval: "2015-04-01",
                maxval: "2025-12-31",
                preval: "stopdate",
                rangeval: true,
                offsets: '',                                 //参数值偏移量
                pubpams: true,
                title: '日期',
                value: ''
            }
        ],
        chart: {
            framework: "hicharts",       //hicharts, echarts
            title: '客户学历',
            type: 'column',
            credits: {
                enabled: false
            },
            tooltip: {
                shared: true,
                pointFormat: '{series.name}: <b>{point.y}</b><br/>'
            },
            xAxis: {
                isfulsh:true,
                type: 'category'
            },
            yAxis: {
                allowDecimals: false,
                title: {
                    text: '客户学历'
                }
            },
			lang: {
				noData: '所选范围样本量不足500，请扩大选取范围'
			},
			noData: {
				style: {
					fontWeight: 'bold',
					fontSize: '15px',
					color: '#303030'
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
								textOutline: "0px 0px contrast"
							}
					}
				}
			},
            datas: [
                {
                    title: "客户学历",
                    type: 'column',
                    //url: "https://api.auc2.com/api/v1/external/umeng/portrait?unitid=C0000000201&aid={tagloc}&tag=education&date={tagdate}",
                    data:[{"x":"初高中","y":2},{"x":"专科","y":43},{"x":"本科","y":109},{"x":"硕士","y":14}],
                    expandparam: false,
                    showtable: false
                }
            ]
        }
    },    
    {
        title: "客户职业",				//图表名称
        id: 'business',				//图一 ID
        char_pos: {
            pos_id: 'business'		//图表显示所在DIV位置
        },
        layout: {
            titlebar: true,					//图表 titlebar
            title: '客户职业'
        },
        params: [
            {
                name: "tagloc",						//地址ID
                type: "loc",
                fixvalue: false,            			//值是否固定
                defvalue: "{pubchar_pams:loc}",   	        //默认值
                multival: false,           			//如果多选，多个value之间用"|"间隔
                pubpams: true,						//是否是公共参数
                title: '店',						//参数名称
                value: ''							//值
            },
            {
                name: "tagdate",
                type: "date",
                fixvalue: false,
                defvalue: "{config_page_env:initdate}",                       //当前时间格式 yyyymmddhhiiss   yyyy年 mm月 dd日 hh 时 ii分 ss秒  需小写
                dateformat: 'yyyy-mm-dd',
                minval: "2015-04-01",
                maxval: "2025-12-31",
                preval: "stopdate",
                rangeval: true,
                offsets: '',                                 //参数值偏移量
                pubpams: true,
                title: '日期',
                value: ''
            }
        ],
        chart: {
            framework: "hicharts",       //hicharts, echarts
            title: '客户职业',
            type: 'column',
            credits: {
                enabled: false
            },
            tooltip: {
                shared: true,
                pointFormat: '{series.name}: <b>{point.y}</b><br/>'
            },
            xAxis: {
                isfulsh:true,
                type: 'category'
            },
            yAxis: {
                allowDecimals: false,
                title: {
                    text: '客户职业'
                }
            },
			lang: {
				noData: '所选范围样本量不足500，请扩大选取范围'
			},
			noData: {
				style: {
					fontWeight: 'bold',
					fontSize: '15px',
					color: '#303030'
				}
			},
			plotOptions: {
				column: {
					dataLabels: {
							enabled: true,
							format: '{y:.0f}',
							style: {
								fontWeight: 'bold',
								fontSize: '12px',
								color: 'black',
								textOutline: "0px 0px contrast"
							}
					}
				}
			},
            datas: [
                {
                    title: "客户职业",
                    type: 'column',
                    //url: "https://api.auc2.com/api/v1/external/umeng/portrait?unitid=C0000000201&aid={tagloc}&tag=business&date={tagdate}",
                    data:[{"x":"公司职员","y":502},{"x":"个体经营/服务人员","y":88},{"x":"教职工","y":30},{"x":"学生","y":15},{"x":"金融从业者","y":19},{"x":"医务人员","y":18},{"x":"公务员","y":8},{"x":"工人","y":9},{"x":"媒体从业者","y":5},{"x":"科研人员","y":1}],
                    expandparam: false,
                    showtable: false
                }
            ]
        }
    }, 

    /*{
        title: "顾客城市层级",				//图表名称
        id: 'citylevel',				//图一 ID
        char_pos: {
            pos_id: 'citylevel'		//图表显示所在DIV位置
        },
        layout: {
            titlebar: true,					//图表 titlebar
            title: '顾客城市层级'
        },
        params: [
            {
                name: "tagloc",						//地址ID
                type: "loc",
                fixvalue: false,            			//值是否固定
                defvalue: "{pubchar_pams:loc}",   	        //默认值
                multival: false,           			//如果多选，多个value之间用"|"间隔
                pubpams: true,						//是否是公共参数
                title: '店',						//参数名称
                value: ''							//值
            },
            {
                name: "tagdate",
                type: "date",
                fixvalue: false,
                defvalue: "{config_page_env:initdate}",                       //当前时间格式 yyyymmddhhiiss   yyyy年 mm月 dd日 hh 时 ii分 ss秒  需小写
                dateformat: 'yyyy-mm-dd',
                minval: "2015-04-01",
                maxval: "2025-12-31",
                preval: "stopdate",
                rangeval: true,
                offsets: '',                                 //参数值偏移量
                pubpams: true,
                title: '日期',
                value: ''
            }
        ],
        chart: {
            framework: "hicharts",       //hicharts, echarts
            title: '顾客城市层级',
            credits: {
                enabled: false
            },
            tooltip: {
                shared: true,
                pointFormat: '{series.name}: <b>{point.y}</b><br/>'
            },
            xAxis: {
                isfulsh:true,
                type: 'category'
            },
            yAxis: {
                allowDecimals: false,
                title: {
                    text: '顾客城市层级'
                }
            },
			lang: {
				noData: '所选范围样本量不足500，请扩大选取范围'
			},
			noData: {
				style: {
					fontWeight: 'bold',
					fontSize: '15px',
					color: '#303030'
				}
			},
            datas: [
                {
                    title: "顾客城市层级",
                    type: 'column',
                    url: "https://api.auc2.com/api/v1/external/umeng/portrait?unitid=C0000000201&aid={tagloc}&tag=citylevel&date={tagdate}",
                    expandparam: false,
                    showtable: false
                }
            ]
        }
    }, */
    {
        title: "客户车辆拥有状况",				//图表名称
        id: 'car',				//图一 ID
        char_pos: {
            pos_id: 'car'		//图表显示所在DIV位置
        },
        layout: {
            titlebar: true,					//图表 titlebar
            title: '客户车辆拥有状况'
        },
        params: [
            {
                name: "tagloc",						//地址ID
                type: "loc",
                fixvalue: false,            			//值是否固定
                defvalue: "{pubchar_pams:loc}",   	        //默认值
                multival: false,           			//如果多选，多个value之间用"|"间隔
                pubpams: true,						//是否是公共参数
                title: '店',						//参数名称
                value: ''							//值
            },
            {
                name: "tagdate",
                type: "date",
                fixvalue: false,
                defvalue: "{config_page_env:initdate}",                       //当前时间格式 yyyymmddhhiiss   yyyy年 mm月 dd日 hh 时 ii分 ss秒  需小写
                dateformat: 'yyyy-mm-dd',
                minval: "2015-04-01",
                maxval: "2025-12-31",
                preval: "stopdate",
                rangeval: true,
                offsets: '',                                 //参数值偏移量
                pubpams: true,
                title: '日期',
                value: ''
            }
        ],
        chart: {
            framework: "hicharts",       //hicharts, echarts
            title: '客户车辆拥有状况',
            type: 'column',
            credits: {
                enabled: false
            },
            tooltip: {
                shared: true,
                pointFormat: '{series.name}: <b>{point.y}</b><br/>'
            },
            xAxis: {
                isfulsh:true,
                type: 'category'
            },
            yAxis: {
                allowDecimals: false,
                title: {
                    text: '客户车辆拥有状况'
                }
            },
			lang: {
				noData: '所选范围样本量不足500，请扩大选取范围'
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
								textOutline: "0px 0px contrast"
							}
					}
				}
			},
			noData: {
				style: {
					fontWeight: 'bold',
					fontSize: '15px',
					color: '#303030'
				}
			},
            datas: [
                {
                    title: "客户车辆拥有状况",
                    type: 'column',
                    //url: "https://api.auc2.com/api/v1/external/umeng/portrait?unitid=C0000000201&aid={tagloc}&tag=car&date={tagdate}",
                    data:[{"x":"拥有","y":184},{"x":"无","y":219}],
                    expandparam: false,
                    showtable: false
                }
            ]
        }
    },
    {
        title: "客户住房拥有状况",				//图表名称
        id: 'house',				//图一 ID
        char_pos: {
            pos_id: 'house'		//图表显示所在DIV位置
        },
        layout: {
            titlebar: true,					//图表 titlebar
            title: '客户住房拥有状况'
        },
        params: [
            {
                name: "tagloc",						//地址ID
                type: "loc",
                fixvalue: false,            			//值是否固定
                defvalue: "{pubchar_pams:loc}",   	        //默认值
                multival: false,           			//如果多选，多个value之间用"|"间隔
                pubpams: true,						//是否是公共参数
                title: '店',						//参数名称
                value: ''							//值
            },
            {
                name: "tagdate",
                type: "date",
                fixvalue: false,
                defvalue: "{config_page_env:initdate}",                       //当前时间格式 yyyymmddhhiiss   yyyy年 mm月 dd日 hh 时 ii分 ss秒  需小写
                dateformat: 'yyyy-mm-dd',
                minval: "2015-04-01",
                maxval: "2025-12-31",
                preval: "stopdate",
                rangeval: true,
                offsets: '',                                 //参数值偏移量
                pubpams: true,
                title: '日期',
                value: ''
            }
        ],
        chart: {
            framework: "hicharts",       //hicharts, echarts
            title: '客户住房拥有状况',
            type: 'column',
            credits: {
                enabled: false
            },
            tooltip: {
                shared: true,
                pointFormat: '{series.name}: <b>{point.y}</b><br/>'
            },
            xAxis: {
                isfulsh:true,
                type: 'category'
            },
            yAxis: {
                allowDecimals: false,
                title: {
                    text: '客户住房拥有状况'
                }
            },
			lang: {
				noData: '所选范围样本量不足500，请扩大选取范围'
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
								textOutline: "0px 0px contrast"
							}
					}
				}
			},
			noData: {
				style: {
					fontWeight: 'bold',
					fontSize: '15px',
					color: '#303030'
				}
			},
            datas: [
                {
                    title: "客户住房拥有状况",
                    type: 'column',
                    //url: "https://api.auc2.com/api/v1/external/umeng/portrait?unitid=C0000000201&aid={tagloc}&tag=house&date={tagdate}",
                    data:[{"x":"拥有","y":315},{"x":"无","y":587}],
                    expandparam: false,
                    showtable: false
                }
            ]
        }
    },
]

}
	
						
		

		
 


