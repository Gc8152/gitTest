// 基于准备好的dom，初始化echarts图表
var man_echarts = echarts.init(document.getElementById('Man_echarts'));//人员级别分布
var manCategory_echarts=echarts.init(document.getElementById('manCategory_echarts'));
var manPlace_echarts=echarts.init(document.getElementById('manPlace_echarts'));//项目人员到位情况
var faultConditionCharts=echarts.init(document.getElementById('faultConditionCharts'));//故障状态个数统计
var inconformity_Charts=echarts.init(document.getElementById('inconformity_Charts'));//不符合项状态个数统计
var inconformityCharts_Num_Charts=echarts.init(document.getElementById('inconformityCharts_Num_Charts'));//不符合项状态个数统计
var inconformity_rankCharts=echarts.init(document.getElementById('inconformity_rankCharts'));//不符合项等级分布
var riskSolveCharts=echarts.init(document.getElementById('riskSolveCharts'));
var riskTypeCharts=echarts.init(document.getElementById('riskTypeCharts'));//风险类型占比
var questionTypeCharts=echarts.init(document.getElementById('questionTypeCharts'));//问题类型占比
option = {
	    title : {
	        text: '人员级别分布',
	        x:'center'
	    },
	    tooltip : {
	        trigger: 'item',
	        formatter: "{a} <br/>{b} : {c} ({d}%)"
	    },
	    legend: {
	        orient : 'vertical',
	        x : 'left',
	        data:['初级','高级','中级']
	    },
	    toolbox: {
	        show : true,
	        feature : {
	            mark : {show: true},
	            dataView : {show: true, readOnly: false},
	            magicType : {
	                show: true, 
	                type: ['pie', 'funnel'],
	                option: {
	                    funnel: {
	                        x: '25%',
	                        width: '50%',
	                        funnelAlign: 'left',
	                        max: 1548
	                    }
	                }
	            },
	            restore : {show: true},
	            saveAsImage : {show: true}
	        }
	    },
	    calculable : true,
	    series : [
	        {
	            name:'访问来源',
	            type:'pie',
	            radius : '55%',
	            center: ['50%', '60%'],
	            data:[
	                {value:60, name:'初级'},
	                {value:50, name:'中级'},
	                {value:30, name:'高级'}
	            ]
	        }
	    ]
	};
//为echarts对象加载数据 
man_echarts.setOption(option); 

option = {
	    tooltip : {
	        trigger: 'axis',
	        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	        }
	    },
	    legend: {
	        data:['初级','中级','高级']
	    },
	    toolbox: {
	        show : true,
	        orient: 'vertical',
	        x: 'right',
	        y: 'center',
	        feature : {
	            mark : {show: true},
	            dataView : {show: true, readOnly: false},
	            magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
	            restore : {show: true},
	            saveAsImage : {show: true}
	        }
	    },
	    calculable : true,
	    xAxis : [
	        {
	            type : 'category',
	            data : ['需求岗','开发岗','测试岗','项目经理岗']
	        }
	    ],
	    yAxis : [
	        {
	            type : 'value'
	        }
	    ],
	    series : [
	        {
	            name:'高级',
	            type:'bar',
	            stack: '广告',
	            data:[5, 12, 8,6]
	        }
	      	,       
	      	{
	            name:'中级',
	            type:'bar',
	            stack: '广告',
	            data:[16, 28, 17,11]
	        },
	      	{
	            name:'初级',
	            type:'bar',
	            stack: '广告',
	            data:[22, 35, 28,24]
	        }
	      
	    ]
	};
manCategory_echarts.setOption(option); 

option = {
	    title : {
	        text: '项目人员到位情况',
	    },
	    tooltip : {
	        trigger: 'axis'
	    },
	    legend: {
	        data:['人数']
	    },
	    toolbox: {
	        show : true,
	        feature : {
	            mark : {show: true},
	            dataView : {show: true, readOnly: false},
	            magicType : {show: true, type: ['line', 'bar']},
	            restore : {show: true},
	            saveAsImage : {show: true}
	        }
	    },
	    calculable : true,
	    xAxis : [
	        {
	            type : 'category',
	            data : ['已进场','待进场','已离场']
	        }
	    ],
	    yAxis : [
	        {
	            type : 'value'
	        }
	    ],
	    series : [
	        {
	            name:'人数',
	            type:'bar',
	            data:[20, 4, 3],
	            markPoint : {
	                data : [
	                    {type : 'max', name: '最大值'},
	                    {type : 'min', name: '最小值'}
	                ]
	            },
	            markLine : {
	                data : [
	                    {type : 'average', name: '平均值'}
	                ]
	            }
	        }
	    ]
	};
manPlace_echarts.setOption(option); 

option = {
	    title : {
	        text: '故障状态个数统计',
	    },
	    tooltip : {
	        trigger: 'axis'
	    },
	    legend: {
	        data:['故障个数']
	    },
	    toolbox: {
	        show : true,
	        feature : {
	            mark : {show: true},
	            dataView : {show: true, readOnly: false},
	            magicType : {show: true, type: ['line', 'bar']},
	            restore : {show: true},
	            saveAsImage : {show: true}
	        }
	    },
	    calculable : true,
	    xAxis : [
	        {
	            type : 'category',
	            data : ['已解决','未解决']
	        }
	    ],
	    yAxis : [
	        {
	            type : 'value'
	        }
	    ],
	    series : [
	        {
	            name:'故障个数',
	            type:'bar',
	            data:[1, 2],
	            markPoint : {
	                data : [
	                    {type : 'max', name: '最大值'},
	                    {type : 'min', name: '最小值'}
	                ]
	            },
	            markLine : {
	                data : [
	                    {type : 'average', name: '平均值'}
	                ]
	            }
	        }
	    ]
	};
faultConditionCharts.setOption(option);
option = {
	    title : {
	        text: '不符合项状态个数统计',
	    },
	    tooltip : {
	        trigger: 'axis'
	    },
	    legend: {
	        data:['不符合项状态个数']
	    },
	    toolbox: {
	        show : true,
	        feature : {
	            mark : {show: true},
	            dataView : {show: true, readOnly: false},
	            magicType : {show: true, type: ['line', 'bar']},
	            restore : {show: true},
	            saveAsImage : {show: true}
	        }
	    },
	    calculable : true,
	    xAxis : [
	        {
	            type : 'category',
	            data : ['打开','关闭','挂起','重现','延时']
	        }
	    ],
	    yAxis : [
	        {
	            type : 'value'
	        }
	    ],
	    series : [
	        {
	            name:'不符合项状态个数',
	            type:'bar',
	            data:[3,8,1,0,2],
	            markPoint : {
	                data : [
	                    {type : 'max', name: '最大值'},
	                    {type : 'min', name: '最小值'}
	                ]
	            },
	            markLine : {
	                data : [
	                    {type : 'average', name: '平均值'}
	                ]
	            }
	        }
	    ]
	};
inconformity_Charts.setOption(option);
option = {
	    title : {
	        text: '不符合项状态个数统计',
	        x:'center'
	    },
	    tooltip : {
	        trigger: 'item',
	        formatter: "{a} <br/>{b} : {c} ({d}%)"
	    },
	    legend: {
	        orient : 'vertical',
	        x : 'left',
	        data:['产品符合性','过程符合性']
	    },
	    toolbox: {
	        show : true,
	        feature : {
	            mark : {show: true},
	            dataView : {show: true, readOnly: false},
	            magicType : {
	                show: true, 
	                type: ['pie', 'funnel'],
	                option: {
	                    funnel: {
	                        x: '25%',
	                        width: '50%',
	                        funnelAlign: 'left',
	                        max: 4
	                    }
	                }
	            },
	            restore : {show: true},
	            saveAsImage : {show: true}
	        }
	    },
	    calculable : true,
	    series : [
	        {
	            name:'访问来源',
	            type:'pie',
	            radius : '55%',
	            center: ['50%', '60%'],
	            data:[
	                {value:1, name:'产品符合性'},
	                {value:4, name:'过程符合性'}
	            ]
	        }
	    ]
	};
inconformityCharts_Num_Charts.setOption(option);
option = {
	    title : {
	        text: '不符合项等级分布',
	        x:'center'
	    },
	    tooltip : {
	        trigger: 'item',
	        formatter: "{a} <br/>{b} : {c} ({d}%)"
	    },
	    legend: {
	        orient : 'vertical',
	        x : 'left',
	        data:['轻微','中等','严重','致命']
	    },
	    toolbox: {
	        show : true,
	        feature : {
	            mark : {show: true},
	            dataView : {show: true, readOnly: false},
	            magicType : {
	                show: true, 
	                type: ['pie', 'funnel'],
	                option: {
	                    funnel: {
	                        x: '25%',
	                        width: '50%',
	                        funnelAlign: 'left',
	                        max: 57
	                    }
	                }
	            },
	            restore : {show: true},
	            saveAsImage : {show: true}
	        }
	    },
	    calculable : true,
	    series : [
	        {
	            name:'访问来源',
	            type:'pie',
	            radius : '55%',
	            center: ['50%', '60%'],
	            data:[
	                {value:57, name:'轻微'},
	                {value:29, name:'中等'},
	              	{value:14, name:'严重'},
	              	{value:0, name:'致命'}
	            ]
	        }
	    ]
	};
inconformity_rankCharts.setOption(option);        

option = {
	    tooltip : {
	        trigger: 'axis',
	        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	        }
	    },
	    legend: {
	        data:['已关闭', '未关闭']
	    },
	    toolbox: {
	        show : true,
	        feature : {
	            mark : {show: true},
	            dataView : {show: true, readOnly: false},
	            magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
	            restore : {show: true},
	            saveAsImage : {show: true}
	        }
	    },
	    calculable : true,
	    xAxis : [
	        {
	            type : 'value'
	        }
	    ],
	    yAxis : [
	        {
	            type : 'category',
	            data : ['风险','问题']
	        }
	    ],
	    series : [
	        {
	            name:'已关闭',
	            type:'bar',
	            stack: '总量',
	            itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
	            data:[5, 2]
	        },
	        {
	            name:'未关闭',
	            type:'bar',
	            stack: '总量',
	            itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
	            data:[2, 3]
	        }
	    ]
	};
riskSolveCharts.setOption(option); 
option = {
	    title : {
	        text: '风险类型占比',
	        x:'center'
	    },
	    tooltip : {
	        trigger: 'item',
	        formatter: "{a} <br/>{b} : {c} ({d}%)"
	    },
	    legend: {
	        orient : 'vertical',
	        x : 'left',
	        data:['需求风险','技术和产品风险','资源与环境风险',
	              '进度风险','人员风险','质量风险',
	              '计划外任务风险','管理和协调风险']
	    },
	    toolbox: {
	        show : true,
	        feature : {
	            mark : {show: true},
	            dataView : {show: true, readOnly: false},
	            magicType : {
	                show: true, 
	                type: ['pie', 'funnel'],
	                option: {
	                    funnel: {
	                        x: '25%',
	                        width: '50%',
	                        funnelAlign: 'left',
	                        max: 43
	                    }
	                }
	            },
	            restore : {show: true},
	            saveAsImage : {show: true}
	        }
	    },
	    calculable : true,
	    series : [
	        {
	            name:'访问来源',
	            type:'pie',
	            radius : '55%',
	            center: ['50%', '60%'],
	            data:[
	                {value:14, name:'需求风险'},
	                {value:0, name:'技术和产品风险'},
	              	{value:14, name:'资源与环境风险'},
	              	{value:43, name:'进度风险'},
	                {value:29, name:'人员风险'},
	                {value:0, name:'质量风险'},
	                {value:0, name:'计划外任务风险'},
	                {value:0, name:'管理和协调风险'}
	            ]
	        }
	    ]
};
riskTypeCharts.setOption(option); 
option = {
	    title : {
	        text: '问题类型占比',
	        x:'center'
	    },
	    tooltip : {
	        trigger: 'item',
	        formatter: "{a} <br/>{b} : {c} ({d}%)"
	    },
	    legend: {
	        orient : 'vertical',
	        x : 'left',
	        data:['技术问题','环境问题',
	              '进度问题','人员问题','质量问题',
	              '关联配合问题','成本问题']
	    },
	    toolbox: {
	        show : true,
	        feature : {
	            mark : {show: true},
	            dataView : {show: true, readOnly: false},
	            magicType : {
	                show: true, 
	                type: ['pie', 'funnel'],
	                option: {
	                    funnel: {
	                        x: '25%',
	                        width: '50%',
	                        funnelAlign: 'left',
	                        max: 91
	                    }
	                }
	            },
	            restore : {show: true},
	            saveAsImage : {show: true}
	        }
	    },
	    calculable : true,
	    series : [
	        {
	            name:'访问来源',
	            type:'pie',
	            radius : '55%',
	            center: ['50%', '60%'],
	            data:[
	                {value:0, name:'技术问题'},
	                {value:0, name:'环境问题'},
	              	{value:91, name:'进度问题'},
	              	{value:0, name:'人员问题'},
	                {value:9, name:'质量问题'},
	                {value:0, name:'关联配合问题'},
	                {value:0, name:'成本问题'}
	            ]
	        }
	    ]
	};
questionTypeCharts.setOption(option); 