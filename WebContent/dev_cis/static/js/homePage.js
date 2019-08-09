		var evaluate = echarts.init(document.getElementById('evaluate'));
			var evaluateOption = {
				    title : {
						text : '供应商评价排名',
						x : 'center'
				    },
				    toolbox: {
				    	restore:{
				        	show : true
				        },
				        saveAsImage : {
							show : true
						},
				    },
				    tooltip : {
				        trigger: 'axis',
				        showDelay : 0,
				        formatter : function (params) {
				            if (params.value.length > 1) {
				                return params.seriesName + ' :<br/>'
				                   + params.value[0] + '万元 ' 
				                   + params.value[1] * -1 + '位 ';
				            }
				            else {
				                return params.seriesName + ' :<br/>'
				                   + params.name + ' : '
				                   + params.value * -1 + '位 ';
				            }
				        },
				        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
		                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
		                }
				    },
				    legend: {
				        data:['宇信科技','其它'],
				      	x : 'left'
				    },
				    xAxis : [
				        {
				            type : 'value',
				            scale:true,
				            //splitLine: {show:false},
				            //position: 'top',
				            axisLine: {show: false},
				            axisTick: {show: false},
				            axisLabel : {
				                formatter: '{value} 万元'
				            }
				        }
				    ],
				    yAxis : [
				        {
				        	name : '排名',
				            type : 'value',
				            scale:true,
				            axisLabel : {
				                formatter: function(v){
				                    return - v ;
				                }
				            }
				        }
				    ],
				    series : [
						{
						    name:'宇信科技',
						    type:'scatter',
						    data: [ [1700.3, -1]
						    ],
						    markPoint : {
						        data : [
						            {name: '排名',value : 1, xAxis: '1700.3', yAxis: '-1', symbolSize:9}
						        ]
						    }
						},
				        {
				            name:'其它',
				            type:'scatter',
				            data: [[761.2, -9], [167.5, -20], [659.5, -10], [457.0, -12], [155.8, -21],
				                [370.0, -16], [1290.1, -4], [366.0, -15], [476.2, -14], [460.2, -13],
				                [272.5, -18], [270.9, -17], [872.9, -5], [1330.4, -3], [1600.0, -2],
				                [547.2, -11], [768.2, -8], [175.0, -19], [757.0, -7], [867.6, -6]
				            ],
				            markPoint : {
				                data : [
				                    //{type : 'max', name: '最低排名'},
				                    //{type : 'min', name: '最高排名'}
				                    {name : '最高排名', value : 2, xAxis: '1600.0', yAxis: '-2', symbolSize:9},
			                    	{name : '最低排名', value : 21, xAxis: '155.8', yAxis: '-21', symbolSize:9}
				                ]
				            },
				            markLine : {
				                data : [
				                    {type : 'average', name: '平均排名'}
				                ]
				            }
				        }
				        
				    ]
				};

			//份额占比加载
			var panel1 = echarts.init(document.getElementById('panel1'));
			var option1 = {
				title : {
					text : '份额占比',
					subtext : '',
					x : 'center'
				},
				tooltip : {
					trigger : 'item',
					formatter : "{a} <br/>{b} : {c} ({d}%)"
				},
				legend : {
					orient : 'vertical',
					x : 'left',
					data : [ '宇信科技', '安硕信息', '高伟达', '恒生电子', '软通动力', '神舟数码', '浪潮',
							'其他' ]
				},
				toolbox : {
					show : true,
					feature : {
						mark : {
							show : false
						},
						magicType : {
							show : true,
							type : [ 'pie', 'funnel' ],
							option : {
								funnel : {
									x : '25%',
									width : '50%',
									funnelAlign : 'left',
									max : 1548
								}
							}
						},
						restore : {
							show : true
						},
						saveAsImage : {
							show : true
						}
					}
				},
				calculable : true,
				series : [ {
					name : '份额占比',
					type : 'pie',
					radius : '55%',
					center : [ '50%', '60%' ],
					data : [ {
						value : 335,
						name : '软通动力'
					}, {
						value : 310,
						name : '安硕信息'
					}, {
						value : 234,
						name : '高伟达'
					}, {
						value : 135,
						name : '恒生电子'
					}, {
						value : 1548,
						name : '宇信科技'
					}, {
						value : 450,
						name : '神舟数码'
					}, {
						value : 462,
						name : '浪潮'
					}, {
						value : 100,
						name : '其他'
					} ]
				} ]
			};
			
			/*人员统计*/
			var panel6 = echarts.init(document.getElementById("panel6"));
			var option6 = {
				title : {
					text : '人员统计',
					subtext : '',
					x : 'center'
				},
				tooltip : {
					trigger : 'axis'
				},
				legend : {
					data : [ '人数' ],
					x : 'left'
				},
				toolbox : {
					show : true,
					feature : {
						mark : {
							show : false
						},
						dataView : {
							show : false,
							readOnly : false
						},
						magicType : {
							show : true,
							type : []
						},
						restore : {
							show : true
						},
						saveAsImage : {
							show : true
						}
					}
				},
				calculable : true,
				xAxis : [ {
					type : 'value',
					boundaryGap : [ 0, 0.01 ]
				} ],
				yAxis : [ {
					type : 'category',
					data : [ '离场人数', '待入场人数', '在场人数' ]
				} ],
				series : [ {
					name : '人数',
					type : 'bar',
					data : [ 300, 100, 200 ]
				} ]
			};			
			panel1.setOption(option1);
			evaluate.setOption(evaluateOption);
			panel6.setOption(option6);