// 基于准备好的dom，初始化echarts图表
        var requirement_echarts = echarts.init(document.getElementById('requirement_echarts'));
        var develop_echarts = echarts.init(document.getElementById('develop_echarts'));
        var budget_echarts = echarts.init(document.getElementById('budget_echarts'));
        var annual_echarts = echarts.init(document.getElementById('annual_echarts'));
        var resource_echarts = echarts.init(document.getElementById('resource_echarts'));
        var breakdown_echarts = echarts.init(document.getElementById('breakdown_echarts'));
        /* 需求 */
        var option = {
        	    tooltip : {
        	        formatter: "{a} <br/>{b} : {c}"
        	    },
        	    toolbox: {
        	        show : false,
        	        feature : {
        	            mark : {show: true},
        	            restore : {show: true},
        	            saveAsImage : {show: true}
        	        }
        	    },
        	    series : [
        	        {
        	            name:'总需求',
        	            type:'gauge',
        	            center : ['50%', '50%'],    // 默认全局居中
        	            radius : [0, '75%'],
        	            
        	            min: 0,                     // 最小值
        	            max: 100,                   // 最大值
        	            precision: 0,               // 小数精度，默认为0，无小数点
        	            splitNumber: 10,             // 分割段数，默认为5
        	            axisLine: {            // 坐标轴线
        	                show: true,        // 默认显示，属性show控制显示与否
        	                lineStyle: {       // 属性lineStyle控制线条样式
        	                    color: [[0.18, 'lightgreen'],[0.4, 'orange'],[0.8, 'skyblue'],[1.01, '#ff4500']], 
        	                    width: 20
        	                }
        	            },
        	            axisTick: {            // 坐标轴小标记
        	                show: true,        // 属性show控制显示与否，默认不显示
        	                splitNumber: 3,    // 每份split细分多少段
        	                length :8,         // 属性length控制线长
        	                lineStyle: {       // 属性lineStyle控制线条样式
        	                    color: '#eee',
        	                    width: 1,
        	                    type: 'solid'
        	                }
        	            },
        	            axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
        	                show: true,
        	                formatter: function(v){
        	                    switch (v+''){
        	                        case '10': return '已投产';
        	                        case '30': return '已入版';
        	                        case '70': return '已受理';
        	                        case '90': return '未受理';
        	                        default: return '';
        	                    }
        	                },
        	                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
        	                    color: '#333'
        	                }
        	            },
        	            splitLine: {           // 分隔线
        	                show: true,        // 默认显示，属性show控制显示与否
        	                length :30,         // 属性length控制线长
        	                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
        	                    color: '#eee',
        	                    width: 2,
        	                    type: 'solid'
        	                }
        	            },
        	            pointer : {
        	                length : '80%',
        	                width : 8,
        	                color : 'auto'
        	            },
        	            title : {
        	                show : true,
        	                offsetCenter: ['-65%', -10],       // x, y，单位px
        	                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
        	                    color: '#333',
        	                    fontSize : 15
        	                }
        	            },
        	            detail : {
        	                show : true,
        	                backgroundColor: 'rgba(0,0,0,0)',
        	                borderWidth: 0,
        	                borderColor: '#ccc',
        	                width: 100,
        	                height: 40,
        	                offsetCenter: ['-60%', 0],       // x, y，单位px
        	                /*formatter:'{value}',*/
        	                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
        	                    
        	                    fontSize : 30
        	                }
        	            },
        	            /*data:[{value: 30, name: ''}],*/
        	            detail : {formatter:'{value}'},
        	            data:[{value: 279, name: ''}],
        	        }
        	    ]
        	};
        	                    

        // 为echarts对象加载数据 
        requirement_echarts.setOption(option); 
        
        /* 开发效率 */
        var option = {
        	    tooltip : {
        	        formatter: "{a} <br/>{b} : {c}"
        	    },
        	    toolbox: {
        	        show : false,
        	        feature : {
        	            mark : {show: true},
        	            restore : {show: true},
        	            saveAsImage : {show: true}
        	        }
        	    },
        	    series : [
        	        {
        	            name:'开发效率',
        	            type:'gauge',
        	            center : ['50%', '50%'],    // 默认全局居中
        	            radius : [0, '75%'],
        	            
        	            min: 0,                     // 最小值
        	            max: 100,                   // 最大值
        	            precision: 0,               // 小数精度，默认为0，无小数点
        	            splitNumber: 10,             // 分割段数，默认为5
        	            axisLine: {            // 坐标轴线
        	                show: true,        // 默认显示，属性show控制显示与否
        	                lineStyle: {       // 属性lineStyle控制线条样式
        	                    color: [[0.8, 'orange']], 
        	                    width: 30
        	                }
        	            },
        	            axisTick: {            // 坐标轴小标记
        	                show: true,        // 属性show控制显示与否，默认不显示
        	                splitNumber: 0,    // 每份split细分多少段
        	                length :'',         // 属性length控制线长
        	                lineStyle: {       // 属性lineStyle控制线条样式
        	                    color: '#eee',
        	                    width: 1,
        	                    type: 'solid'
        	                }
        	            },
        	            axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
        	                show: true,
        	                formatter: function(v){
        	                    switch (v+''){
        	                        case '60': return '低';
        	                        case '90': return '高';
        	                        default: return '';
        	                    }
        	                },
        	                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
        	                    color: '#333'
        	                }
        	            },
        	            splitLine: {           // 分隔线
        	                show: true,        // 默认显示，属性show控制显示与否
        	                length :30,         // 属性length控制线长
        	                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
        	                    color: '#eee',
        	                    width: 2,
        	                    type: 'solid'
        	                }
        	            },
        	            pointer : {
        	                length : '80%',
        	                width : 8,
        	                color : 'auto'
        	            },
        	            title : {
        	                show : true,
        	                offsetCenter: ['-65%', -10],       // x, y，单位px
        	                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
        	                    color: '#333',
        	                    fontSize : 15
        	                }
        	            },
        	            detail : {
        	                show : true,
        	                backgroundColor: 'rgba(0,0,0,0)',
        	                borderWidth: 0,
        	                borderColor: '#ccc',
        	                width: 100,
        	                height: 40,
        	                offsetCenter: ['-50%', 0],       // x, y，单位px
        	                /*formatter:'{value}%',*/
        	                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
        	                    color: 'auto',
        	                    fontSize : 15
        	                }
        	            },
        	            /*data:[{value:96, name: ''}]*/
        	            detail : {formatter:'{value}'},
        	            data:[{value: '高', name: ''}]
        	        }
        	    ]
        	};
        // 为echarts对象加载数据 
        develop_echarts.setOption(option); 
        
        /* 预算 */
        var option = {
        	    tooltip : {
        	        formatter: "{a} <br/>{b} : {c}%"
        	    },
        	    toolbox: {
        	        show : false,
        	        feature : {
        	            mark : {show: true},
        	            restore : {show: true},
        	            saveAsImage : {show: true}
        	        }
        	    },
        	    
        	    series : [
        	        {
        	            name:'业务指标',
        	            type:'gauge',
        	            detail : {formatter:'{value}'},
        	            data:[{value: '2亿', name: ''}],
        	            axisLine: {            // 坐标轴线
        	                show: true,        // 默认显示，属性show控制显示与否
        	                lineStyle: {       // 属性lineStyle控制线条样式
        	                    color: [[0.2, '#4488BB'],[0.8, 'skyblue'],[1, '#ff4500']], 
        	                    width: 30
        	                }
        	            },
        	            axisTick: {            // 坐标轴小标记
        	                show: true,        // 属性show控制显示与否，默认不显示
        	                splitNumber: 4,    // 每份split细分多少段
        	                length :8,         // 属性length控制线长
        	                lineStyle: {       // 属性lineStyle控制线条样式
        	                    color: '#eee',
        	                    width: 1,
        	                    type: 'solid'
        	                }
        	            },
        	        }
        	    ]
        	};
        // 为echarts对象加载数据 
        budget_echarts.setOption(option); 
        
//        年度任务
        var option = {
        	    tooltip : {
        	        formatter: "{a} <br/>{b} : {c}%"
        	    },
        	    toolbox: {
        	        show : false,
        	        feature : {
        	            mark : {show: true},
        	            restore : {show: true},
        	            saveAsImage : {show: true}
        	        }
        	    },
        	    series : [
        	        {
        	            name:'年度任务',
        	            type:'gauge',
        	            center : ['50%', '50%'],    // 默认全局居中
        	            radius : [0, '75%'],
        	            startAngle: 140,
        	            endAngle : -140,
        	            min: 0,                     // 最小值
        	            max: 100,                   // 最大值
        	            precision: 0,               // 小数精度，默认为0，无小数点
        	            splitNumber: 10,             // 分割段数，默认为5
        	            axisLine: {            // 坐标轴线
        	                show: true,        // 默认显示，属性show控制显示与否
        	                lineStyle: {       // 属性lineStyle控制线条样式
        	                    color: [[0.2, 'lightgreen'],[0.4, 'orange'],[0.8, 'skyblue'],[1, '#ff4500']], 
        	                    width: 30
        	                }
        	            },
        	            axisTick: {            // 坐标轴小标记
        	                show: true,        // 属性show控制显示与否，默认不显示
        	                splitNumber: 5,    // 每份split细分多少段
        	                length :8,         // 属性length控制线长
        	                lineStyle: {       // 属性lineStyle控制线条样式
        	                    color: '#eee',
        	                    width: 1,
        	                    type: 'solid'
        	                }
        	            },
        	            axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
        	                show: true,
        	                formatter: function(v){
        	                    switch (v+''){
        	                        case '10': return '弱';
        	                        case '30': return '低';
        	                        case '60': return '中';
        	                        case '90': return '高';
        	                        default: return '';
        	                    }
        	                },
        	                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
        	                    color: '#333'
        	                }
        	            },
        	            splitLine: {           // 分隔线
        	                show: true,        // 默认显示，属性show控制显示与否
        	                length :30,         // 属性length控制线长
        	                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
        	                    color: '#eee',
        	                    width: 2,
        	                    type: 'solid'
        	                }
        	            },
        	            pointer : {
        	                length : '80%',
        	                width : 8,
        	                color : 'auto'
        	            },
        	            title : {
        	                show : true,
        	                offsetCenter: ['-65%', -10],       // x, y，单位px
        	                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
        	                    color: '#333',
        	                    fontSize : 15
        	                }
        	            },
        	            detail : {
        	                show : true,
        	                backgroundColor: 'rgba(0,0,0,0)',
        	                borderWidth: 0,
        	                borderColor: '#ccc',
        	                width: 100,
        	                height: 40,
        	                offsetCenter: ['-60%', 0],       // x, y，单位px
        	                formatter:'{value}%',
        	                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
        	                    color: 'auto',
        	                    fontSize : 20
        	                }
        	            },
        	            data:[{value: 90, name: '完成率'}]
        	        }
        	    ]
        	};              
        // 为echarts对象加载数据 
        annual_echarts.setOption(option);
        /*资源*/
        var option = {
        	    tooltip : {
        	        formatter: "{a} <br/>{b} : {c}%"
        	    },
        	    toolbox: {
        	        show : false,
        	        feature : {
        	            mark : {show: true},
        	            restore : {show: true},
        	            saveAsImage : {show: true}
        	        }
        	    },
        	    series : [
        	        {
        	            name:'需求',
        	            type:'gauge',
        	            center : ['50%', '50%'],    // 默认全局居中
        	            radius : [0, '75%'],
        	            
        	            min: 0,                     // 最小值
        	            max: 100,                   // 最大值
        	            precision: 0,               // 小数精度，默认为0，无小数点
        	            splitNumber: 10,             // 分割段数，默认为5
        	            axisLine: {            // 坐标轴线
        	                show: true,        // 默认显示，属性show控制显示与否
        	                lineStyle: {       // 属性lineStyle控制线条样式
        	                    color: [[0.3, 'lightgreen'],[0.8, 'skyblue'],[1.01, '#ff4500']], 
        	                    width: 20
        	                }
        	            },
        	            axisTick: {            // 坐标轴小标记
        	                show: true,        // 属性show控制显示与否，默认不显示
        	                splitNumber: 2,    // 每份split细分多少段
        	                length :8,         // 属性length控制线长
        	                lineStyle: {       // 属性lineStyle控制线条样式
        	                    color: '#eee',
        	                    width: 1,
        	                    type: 'solid'
        	                }
        	            },
        	            axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
        	                show: true,
        	                formatter: function(v){
        	                    switch (v+''){
        	                        case '20': return '已投入';
        	                        case '40': return '已占用';
        	                        case '90': return '剩余';
        	                       
        	                        default: return '';
        	                    }
        	                },
        	                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
        	                    color: '#333'
        	                }
        	            },
        	            splitLine: {           // 分隔线
        	                show: true,        // 默认显示，属性show控制显示与否
        	                length :30,         // 属性length控制线长
        	                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
        	                    color: '#eee',
        	                    width: 2,
        	                    type: 'solid'
        	                }
        	            },
        	            pointer : {
        	                length : '80%',
        	                width : 8,
        	                color : 'auto'
        	            },
        	            title : {
        	                show : true,
        	                offsetCenter: ['-65%', -10],       // x, y，单位px
        	                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
        	                    color: '#333',
        	                    fontSize : 15
        	                }
        	            },
        	            detail : {
        	                show : true,
        	                backgroundColor: 'rgba(0,0,0,0)',
        	                borderWidth: 0,
        	                borderColor: '#ccc',
        	                width: 100,
        	                height: 40,
        	                offsetCenter: ['-60%', 0],       // x, y，单位px
        	                /*formatter:'{value}',*/
        	                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
        	                	 color: 'auto',
         	                    fontSize : 20
        	                }
        	            },
        	            /*data:[{value: 30, name: ''}],*/
        	            detail : {formatter:'{value}%'},
        	            data:[{value: '80', name: ''}],
        	        }
        	    ]
        	};
        // 为echarts对象加载数据 
        resource_echarts.setOption(option); 
        /*故障密度*/
        var option = {
        	    tooltip : {
        	        formatter: "{a} <br/>{b} : {c}"
        	    },
        	    toolbox: {
        	        show : false,
        	        feature : {
        	            mark : {show: true},
        	            restore : {show: true},
        	            saveAsImage : {show: true}
        	        }
        	    },
        	    series : [
        	        {
        	            name:'故障密度',
        	            type:'gauge',
        	            center : ['50%', '50%'],    // 默认全局居中
        	            radius : [0, '75%'],
        	           
        	            min: 0,                     // 最小值
        	            max: 100,                   // 最大值
        	            precision: 0,               // 小数精度，默认为0，无小数点
        	            splitNumber: 10,             // 分割段数，默认为5
        	            axisLine: {            // 坐标轴线
        	                show: true,        // 默认显示，属性show控制显示与否
        	                lineStyle: {       // 属性lineStyle控制线条样式
        	                    color: [[0.8, 'skyblue']], 
        	                    width: 30
        	                }
        	            },
        	            axisTick: {            // 坐标轴小标记
        	                show: true,        // 属性show控制显示与否，默认不显示
        	                splitNumber: 0,    // 每份split细分多少段
        	                length :8,         // 属性length控制线长
        	                lineStyle: {       // 属性lineStyle控制线条样式
        	                    color: '#eee',
        	                    width: 1,
        	                    type: 'solid'
        	                }
        	            },
        	            axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
        	                show: true,
        	                formatter: function(v){
        	                    switch (v+''){
        	                        case '60': return '低';
        	                        case '90': return '高';
        	                        default: return '';
        	                    }
        	                },
        	                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
        	                    color: '#333'
        	                }
        	            },
        	            splitLine: {           // 分隔线
        	                show: true,        // 默认显示，属性show控制显示与否
        	                length :30,         // 属性length控制线长
        	                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
        	                    color: '#eee',
        	                    width: 2,
        	                    type: 'solid'
        	                }
        	            },
        	            pointer : {
        	                length : '80%',
        	                width : 8,
        	                color : 'auto'
        	            },
        	            title : {
        	                show : true,
        	                offsetCenter: ['-65%', -10],       // x, y，单位px
        	                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
        	                    color: '#333',
        	                    fontSize : 15
        	                }
        	            },
        	            detail : {
        	                show : true,
        	                backgroundColor: 'rgba(0,0,0,0)',
        	                borderWidth: 0,
        	                borderColor: '#ccc',
        	                width: 100,
        	                height: 40,
        	                offsetCenter: ['-50%', 0],       // x, y，单位px
        	                /*formatter:'{value}%',*/
        	                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
        	                    color: 'auto',
        	                    fontSize : 15
        	                }
        	            },
        	            /*data:[{value:96, name: ''}]*/
        	            detail : {formatter:'{value}%'},
        	            data:[{value: 33, name: ''}]
        	        }
        	    ]
        	};
        
        // 为echarts对象加载数据 
        breakdown_echarts.setOption(option); 
        
        
        
        
     // 基于准备好的dom，初始化echarts图表
        var main_echarts1W = echarts.init(document.getElementById('main_echarts1W'));
        
        /* 需求 */
        var option = {
        	    title : {
        	        text: '资产使用情况：',
        	        subtext: ''
        	    },
        	    tooltip : {
        	        trigger: 'axis'
        	    },
        	    legend: {
        	        data:['IT资产','一般资产']
        	    },
        	    toolbox: {
        	        show : false,
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
        	            boundaryGap : false,
        	            data : ['2016','2016-02','2016-04','2016-08','2016-10','2016-10','2016-12']
        	        }
        	    ],
        	    yAxis : [
        	        {
        	            type : 'value',
        	           axisLabel : {
        	                formatter: '{value}'
        	            },
        	          min:0,
        	          max:30000,
        	          calculable: false,
        	            splitNumber:6
        	          
        	        }
        	    ],
        	    series : [
        	        {
        	            name:'IT资产',
        	            type:'line',
        	            data:[6000, 15500, 20500, 5600, 12000, 29000, 23000],
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
        	        },
        	        {
        	            name:'一般资产',
        	            type:'line',
        	            data:[10000,22000,30000, 15000, 23000, 26000, 21000],
        	            markPoint : {
        	                data : [
        	                    {name : '最小值', value : 0, xAxis: 1, yAxis: -1.5}
        	                ]
        	            },
        	            markLine : {
        	                data : [
        	                    {type : 'average', name : '平均值'}
        	                ]
        	            }
        	        }
        	    ]
        	};
        	                    
        	                    

        // 为echarts对象加载数据 
        main_echarts1W.setOption(option); 