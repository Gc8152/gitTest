var SID1=window.parent.SID;
// 基于准备好的dom，初始化echarts图表
/*		 
		var requirement_echarts = echarts.init(document.getElementById('requirement_echarts'));
        var resource_echarts = echarts.init(document.getElementById('resource_echarts'));
        var budget_echarts = echarts.init(document.getElementById('budget_echarts'));
        var develop_echarts = echarts.init(document.getElementById('develop_echarts'));
        var breakdown_echarts = echarts.init(document.getElementById('breakdown_echarts'));*/

function initDate(){
	WdatePicker({
			dateFmt : 'yyyy',
			minDate : '1999',
			maxDate : '2050'
	});
}
         //用户
        function userComponentView(){
        	var users_echarts = echarts.init(document.getElementById('users_echarts'));
        	var date =  getCurrentYMD();
        	var caArr = new Array();
        	var dataArr = new Array();
        	var kv = new Array();
        	var uCall = getMillisecond();
        	baseAjaxJsonp(dev_report + "EConstruction/queryUserComponentList.asp?call=" + uCall+'&SID='+SID1 ,null, function(data) {
        		if (data != undefined&&data!=null&&data.result==true) {
        			
            		var userComponentList = data.userComponentList;
            		var userTotal = data.total;
            		if(userComponentList != null && userComponentList.length > 0) {
            			for(var i = userComponentList.length-1; i >= 0; i--) {
            				var name = userComponentList[i].ITEM_NAME;
            				var value = userComponentList[i].EMP_NUM;
            				var arr = {"value":value,"name":name};
            				caArr.push(name);
            				dataArr.push(value);
            				kv.push(arr);
            			};
            		};
            		var bankerVal = (dataArr[0]/userTotal).toFixed(3);
            		$("#users_date").html("数据时间："+date+'&nbsp;&nbsp;总人数:'+userTotal); 
            			var usersOption = {
        					    tooltip: {
        			                formatter: "{a} <br/>{b} : {c}%"
        			            },
            					legend : {
            						orient : 'horizontal',            						
            						x : 'left',
            						padding :[20,30,20,30],            						
            						selectedMode : false,
            						data : caArr
            					},
        					   grid: { 
        		                     z:-1,    //grid作为柱状图的坐标系，其层级要和仪表图层级不同，同时隐藏
        		                     show:false,
        		                     left: '-30%',
        		                     right: '4%',
        		                     bottom: '3%',
        		                     containLabel: false,
        		                     borderWidth: 0,
        		                     splitLine:{
        		                         show: false    //隐藏分割线
        		                     },
        		                     axisLabel: {
    		                        	 show: false
    		                         },
        		                     axisLine: {
    		                             show: false
    		                         }
    		                         
        		                 },
        		                 xAxis : [   //这里有很多的show，必须都设置成不显示
        		                     {
        		                         type : 'category',
        		                         data : caArr,
        		                         show:false,
        		                         axisLabel: {
        		                        	 show: false
        		                         },
        		                         axisLine: {
        		                             show: false
        		                         },
        		                         splitLine:{
        		                             show: false
        		                         },
        		                         axisTick: {
        		                        	 show: false
        		                         },
        		                         splitArea: {
        		                             show: false
        		                         }
        		                     }
        		                 ],
        		                 yAxis : [ //这里有很多的show，必须都设置成不显示
        		                     {
        		                    	 show:false,
        		                         type : 'value',
        		                         axisLine: {
        		                             show: false
        		                         },
        		                         axisLabel: {
        		                        	 show: false
        		                         },
        		                         axisTick: {
        		                        	 show: false
        		                         },
        		                         splitLine:{
        		                             show: false
        		                         }, splitArea: {
        		                             show: false
        		                         }
        		                     }
        		                 ],

            					toolbox: {
            		                show: false,
            		                feature: {
            		                    mark: {
            		                        show: false
            		                    },
            		                    restore: {
            		                        show: false
            		                    },
            		                    saveAsImage: {
            		                        show: false
            		                    }
            		                }
            		            }, 
            		            series: [{
            		                name: '',
            		                type: 'gauge',
            		                z: 3,
            		                center : ['50%', '65%'],  
            		                radius: [0, '75%'],
            		                min: 0, // 最小值
                                    max: 100, // 最大值
                                    splitNumber: 10, // 分割段数，默认为5
            		                detail: {
            		                    formatter: userTotal
            		                },
            		                axisLine: { // 坐标轴线
            		                    show: true, // 默认显示，属性show控制显示与否
            		                    lineStyle: { // 属性lineStyle控制线条样式
            		                    	 color: [
            		                                  [bankerVal, 'orange'],
            		                                  [0.999, 'lightgreen'],
            		                                  [1, 'lightgreen']
            		                              ],
//            		                    	
            		                        width: 30
            		                    }
            		                },
            		                axisLabel: { // 坐标轴文本标签，详见axis.axisLabel
            		                	show: true,
            		                	formatter: function(v) {
        		                          switch (v+'') {
        		                          	  case '10' : 
        		                                  return caArr[0]+":"+dataArr[0]+"人";
        		                          	  case '80' : 
        		                            	  return caArr[1]+":"+dataArr[1]+"人";
        		                              default:
        		                                  return '';
        		                          }
        		                       },
            		                    textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
            		                       color: '#666',
            		                       fontSize: 12
            		                    }
            		                },

            		                pointer: { //指针
            	                        show: false,
            	                        //指针长度
            	                        length:'90%',
            	                        width:0
            	                    },

            	                    data : [{
            	                        value: userTotal,
            	                        name: ''
            	                    }]
                                },

                                {
                                    name: caArr[0],
                                    type:'bar',
                                    barWidth: '60%',
                                    data:[0],
                                    itemStyle: {
                                        normal: {
                                            color: 'orange'  //这里的图例要注意，颜色设置和仪表盘的颜色对应起来
                                        }
                                    }
                                }, {
                                    name:caArr[1],
                                    type:'bar',
                                    barWidth: '60%',
                                    data:[0],
                                    itemStyle: {
                                        normal: {
                                            color: 'lightgreen'  //这里的图例要注意，颜色设置和仪表盘的颜色对应起来
                                        }
                                    }
                                }
            		            ]
            		        };
            			users_echarts.setOption(usersOption);
            	};
            	
        	},uCall,false);
        	
        };	

        //需求
        function requirementComponentView(){
        	var requirement_echarts = echarts.init(document.getElementById('requirement_echarts'));
        	var allName = ['待分发','待受理','审批中','进行中','完成','其他'];
        	var date =  getCurrentYMD();
        	var dataArr = new Array();
        	var sum = 0;
        	var rCall = getMillisecond();
        	baseAjaxJsonp(dev_report + "EConstruction/queryRequirementComponentList.asp?call=" + rCall+'&SID='+SID1 ,null, function(data) {
        		if (data != undefined&&data!=null&&data.result==true) {
            		var requirementComponentList = data.requirementComponentList;
            		var reqTotal = data.total;
            		if(requirementComponentList != null && requirementComponentList.length > 0) {
            			for(var i = 0 ; i <= requirementComponentList.length-1; i++) {
            				var value = requirementComponentList[i];            				
            				sum += requirementComponentList[i];;
            				dataArr.push(value);
            			}
            		}
            		$("#requirement_date").html("数据时间："+date+'&nbsp;&nbsp;总需求:'+reqTotal);
            
            		var code1 = (dataArr[0]/reqTotal).toFixed(3);
            		var code2 = (dataArr[1]/reqTotal).toFixed(3);
            		var code3 = (dataArr[2]/reqTotal).toFixed(3);
            		var code4 = (dataArr[3]/reqTotal).toFixed(3);
            		var code5 = (dataArr[4]/reqTotal).toFixed(3);
            		
            		if(code1 == "0.000"){
            			code1 = 0.001;
            		}
            		if(code2 == "0.000"){
            			code2 = 0.001;
            		}
            		if(code3 == "0.000"){
            			code3 = 0.001;
            		}
            		if(code4 == "0.000"){
            			code4 = 0.001;
            		}
            		if(code5 == "0.000"){
            			code5 = 0.001;
            		}
            		var color1 = parseFloat(code1).toFixed(3);
            		var color2 = (parseFloat(code1)+parseFloat(code2)).toFixed(3);
            		var color3 = (parseFloat(code3)+parseFloat(color2)).toFixed(3);
            		var color4 = (parseFloat(code4)+parseFloat(color3)).toFixed(3);
            		var color5 = (parseFloat(code5)+parseFloat(color4)).toFixed(3);
            		
            		
            		//console.log(dataArr);
            		//console.log(caArr);
            		/*第8个panel加载*/
            		
            			var evaluateOption = {
            					
            					tooltip : {
            						trigger : 'item',
            						formatter : "{a} <br/>{b} : {c} ({d}%)"
            					},
            					legend : {
            						orient : 'horizontal',            						
            						x : 'left',
            						padding :[20,30],
            						selectedMode : false,
            						itemWidth: 15,
            						itemHeight: 10,
            						data : allName
            					},
            					grid: { 
       		                     z:-1,    //grid作为柱状图的坐标系，其层级要和仪表图层级不同，同时隐藏
       		                     show:false,
       		                     left: '-30%',
       		                     right: '4%',
       		                     bottom: '3%',
       		                     containLabel: false,
       		                     borderWidth: 0,
       		                     splitLine:{
       		                         show: false    //隐藏分割线
       		                     },
       		                     axisLabel: {
   		                        	 show: false
   		                         },
       		                     axisLine: {
   		                             show: false
   		                         }
   		                         
       		                 },
       		                 xAxis : [   //这里有很多的show，必须都设置成不显示
       		                     {
       		                         type : 'category',
       		                         data : allName,
       		                         show:false,
       		                         axisLabel: {
       		                        	 show: false
       		                         },
       		                         axisLine: {
       		                             show: false
       		                         },
       		                         splitLine:{
       		                             show: false
       		                         },
       		                         axisTick: {
       		                        	 show: false
       		                         },
       		                         splitArea: {
       		                             show: false
       		                         }
       		                     }
       		                 ],
       		                 yAxis : [ //这里有很多的show，必须都设置成不显示
       		                     {
       		                    	 show:false,
       		                         type : 'value',
       		                         axisLine: {
       		                             show: false
       		                         },
       		                         axisLabel: {
       		                        	 show: false
       		                         },
       		                         axisTick: {
       		                        	 show: false
       		                         },
       		                         splitLine:{
       		                             show: false
       		                         }, splitArea: {
       		                             show: false
       		                         }
       		                     }
       		                 ],

            					toolbox: {
            		                show: false,
            		                feature: {
            		                    mark: {
            		                        show: false
            		                    },
            		                    restore: {
            		                        show: false
            		                    },
            		                    saveAsImage: {
            		                        show: false
            		                    }
            		                }
            		            }, 
            		            series: [{
            		                name: '总用户',
            		                type: 'gauge',
            		                z:3,
            		                center : ['50%', '65%'],  
            		                min: 0, // 最小值
                                    max: 100, // 最大值
                                    splitNumber: 10, // 分割段数，默认为5
            		                detail: {
            		                    formatter:reqTotal 
            		                },
            		                axisLine: { // 坐标轴线
            		                    show: true, // 默认显示，属性show控制显示与否
            		                    lineStyle: { // 属性lineStyle控制线条样式
            		                    	color:[
            		                    	       [color1, 'orange'],[color2, 'lightgreen'],
            		                    	       [color3, '#B162D5'],[color4, '#F1F26F'],
            		                    	       [color5, '#3373CC'],
            		                    	       [1, '#C72986']],
            		                        width: 30
            		                    }
            		                },
            		                axisLabel: { // 坐标轴文本标签，详见axis.axisLabel
            		                	show: true,
            		                	formatter: function(v) {
        		                          switch (v+"") {
		    		                          case '0' : 
				                                  return allName[0]+":"+dataArr[0]+"条";
        		                          	  case '20' : 
        		                          		  return allName[2]+":"+dataArr[2]+"条";
        		                          	  case '60' : 
        		                            	  return allName[4]+":"+dataArr[4]+"条";
        		                          	  case '70' : 
				                                  return allName[3]+":"+dataArr[3]+"条";
	       		                          	  case '90' : 	       		                               
	       		                                  return allName[1]+":"+dataArr[1]+"条";
        		                              default:
        		                            	  return '';
        		                          }
        		                       },
            		                    textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
            		                        color: '#666',
            		                        fontSize: 11
            		                    }
            		                },
            		                pointer: { //指针
            	                        show: false,
            	                        //指针长度
            	                        length:'90%',
            	                        width:0
            	                    },
            	                    data : [{
            	                        value: reqTotal,
            	                        name: ''
            	                    }]
                                },
                                {
                                    name: "待分发",
                                    type:'bar',
                                    barWidth: '60%',
                                    data:[0],
                                    itemStyle: {
                                        normal: {
                                            color: 'orange'  //这里的图例要注意，颜色设置和仪表盘的颜色对应起来
                                        }
                                    }
                                }, {
                                    name:"待受理",
                                    type:'bar',
                                    data:[0],
                                    itemStyle: {
                                        normal: {
                                            color: 'lightgreen'  //这里的图例要注意，颜色设置和仪表盘的颜色对应起来
                                        }
                                    }
                                }, {
                                    name:"审批中",
                                    type:'bar',
                                    data:[0],
                                    itemStyle: {
                                        normal: {
                                            color: '#B162D5'  //这里的图例要注意，颜色设置和仪表盘的颜色对应起来
                                        }
                                    }
                                }, {
                                    name:"进行中",
                                    type:'bar',
                                    data:[0],
                                    itemStyle: {
                                        normal: {
                                            color: '#F1F26F'  //这里的图例要注意，颜色设置和仪表盘的颜色对应起来
                                        }
                                    }
                                }, {
                                    name:"完成",
                                    type:'bar',
                                    data:[0],
                                    itemStyle: {
                                        normal: {
                                            color: '#3373CC'  //这里的图例要注意，颜色设置和仪表盘的颜色对应起来
                                        }
                                    }
                                }, {
                                    name:'其他',
                                    type:'bar',
                                    data:[0],
                                    itemStyle: {
                                        normal: {
                                            color: '#C72986'  //这里的图例要注意，颜色设置和仪表盘的颜色对应起来
                                        }
                                    }
                                }
            		            ]
            		        };
            			requirement_echarts.setOption(evaluateOption);
            	}
        		
        	},rCall);
        
        };	
        
        // 需求任务				
        function DemandtaskView() {
        	//等到当前时间
        	var date =  getCurrentYMD();
        	var task_echarts = echarts.init(document.getElementById('Task_echarts'));
        	//做两个数组存放分类名和值
        	//var caArr =['SIT测试','UAT测试','提交投产','任务完成','其他'];
        	var caArr =['开发','测试','待投产','提交投产','完成','其他'];
        	var dataArr = new Array();
        	//设变量承载5个阶段所占百分比
        	var tem=0;  //任务完成
        	var tem1=0; //设计开发
        	var tem2=0; //测试
        	var tem3=0; //待提交投产
        	var tem4=0; //提交投产
        	//其他阶段综合
        	var tem5=0; //验证失败 或终止
        	//数据值
        	var data0=0; //设计开发
        	var data1=0; //测试
        	var data2=0; //待提交投产
        	var data3=0; //提交投产
        	var data4=0; //任务完成
        	//各阶段的总和
        	var Svalue=0;
        	
        	var taskQueryListCall = getMillisecond();
        	baseAjaxJsonp(dev_report+"EConstruction/taskQueryList.asp?SID="+SID1+"&call="+taskQueryListCall,null, function(data) {
        		if (data != undefined&&data!=null&&data.result==true) {
            		var taskQueryList = data.taskQueryList;           
            		if(taskQueryList != null && taskQueryList.length > 0) {
            			for(var i = 0;i<taskQueryList.length; i++) {
            				var state = taskQueryList[i].REQ_TASK_STATE;
            				var name = taskQueryList[i].REQ_TASK_DIC;   
            				var value = taskQueryList[i].REQ_TASK_NUM;
            				var arr = {"value":value,"name":name};           				
            				Svalue=Svalue+value; //入版任务数
                			
            				switch (state) {		
	            				case '04'://设计开发阶段
	                            	tem1=tem1+value;
	                            	break;
	            				case '05'://设计开发
	            					tem1=tem1+value;
	                            	break;
	            				case '06'://详细设计
	            					tem1=tem1+value;
	                            	break;
	            				case '07'://编码开发
	            					tem1=tem1+value;
	                            	break;
	            				case '08'://联调测试
	            					tem1=tem1+value;
	                            	break;
	                            case '09'://SIT移交
	                            	tem2=tem2+value;
	                                break;
	                            case '090'://SIT测试
	                            	tem2=tem2+value;
	                                break;
	                            case '11'://待提交投产
	                            	tem3=value;
	                                break;
	                            case '12'://提交投产
	                            	tem4=value;
	                                break;
	                            case '13'://任务完成
	                                 tem=value;
	                                break;
	                            default:
	                                tem5=tem5+value;
            				}
            				dataArr.push(arr);
            				
            			}
            			dataArr.push({"value":tem5,"name":'其他'});

            			if(tem!=0)
            			{
            				tem=parseInt(tem*1000/Svalue);
            				data4=parseInt(tem/10);
            			}else{tem=1;}
            			if(tem1!=0)
            			{
            				tem1=parseInt(tem1*1000/Svalue);
            				data0=parseInt(tem1/10);
            			}else{tem1=1;}
            			if(tem2!=0)
            			{
            				tem2=parseInt(tem2*1000/Svalue);
            				data1=parseInt(tem2/10);
            			}else{tem2=1;}
            			if(tem3!=0)
            			{
            				tem3=parseInt(tem3*1000/Svalue);
            				data2=parseInt(tem3/10);
            			}else{tem3=1;}
            			if(tem4!=0)
            			{
            				tem4=parseInt(tem4*1000/Svalue);
            				data3=parseInt(tem4/10);
            			}else{tem4=1;}
            			if(tem5!=0)
            			{
            				tem5=parseInt(tem5*1000/Svalue);
            			}else{tem5=1;}
            			
            		}
            		$("#taskDateTime").html("数据时间："+date+'&nbsp;&nbsp;已入版:'+Svalue);
            		var taskoption = {
            	        tooltip: {
            	            //formatter: "{a} <br/>{b} : {c}%"
            	        	trigger : 'item',
            	        	formatter: "{a} <br/>{b} : {c} ({d}%)"
            	        },
    					legend : {
    						orient : 'horizontal',            						
    						x : 'left',
    						//padding :[25,30,20,30],
    						padding :[20,30],
    						selectedMode : false,
    						itemWidth: 15,
    						itemHeight: 10, 
    						data : caArr
    					},
    					grid: { 
		                     z:-1,    //grid作为柱状图的坐标系，其层级要和仪表图层级不同，同时隐藏
		                     show:false,
		                     left: '-30%',
		                     right: '4%',
		                     bottom: '3%',
		                     containLabel: false,
		                     borderWidth: 0,
		                     splitLine:{
		                         show: false    //隐藏分割线
		                     },
		                     axisLabel: {
	                        	 show: false
	                         },
		                     axisLine: {
	                             show: false
	                         }
	                         
		                 },
		                 xAxis : [   //这里有很多的show，必须都设置成不显示
		                     {
		                         type : 'category',
		                         data : caArr,
		                         show:false,
		                         axisLabel: {
		                        	 show: false
		                         },
		                         axisLine: {
		                             show: false
		                         },
		                         splitLine:{
		                             show: false
		                         },
		                         axisTick: {
		                        	 show: false
		                         },
		                         splitArea: {
		                             show: false
		                         }
		                     }
		                 ],
		                 yAxis : [ //这里有很多的show，必须都设置成不显示
		                     {
		                    	 show:false,
		                         type : 'value',
		                         axisLine: {
		                             show: false
		                         },
		                         axisLabel: {
		                        	 show: false
		                         },
		                         axisTick: {
		                        	 show: false
		                         },
		                         splitLine:{
		                             show: false
		                         }, splitArea: {
		                             show: false
		                         }
		                     }
		                 ],

            			toolbox: {
                            show: false,
                            feature: {
                                mark: {
                                    show: false
                                },
                                restore: {
                                    show: false
                                },
                                saveAsImage: {
                                    show: false
                                }
                            }
                        },                       
                        series: [{
                            name: '',
                            type: 'gauge',
                            z : 3,
                            center: ['50%', '65%'], // 默认全局居中
                            radius: [0, '75%'],
                            data : dataArr,
                            min: 0, // 最小值
                            max: 100, // 最大值
                            splitNumber: 10, // 分割段数，默认为5
                            detail: {
    		                    formatter:Svalue 
    		                },
    		                axisLine: { // 坐标轴线
    		                    show: true, // 默认显示，属性show控制显示与否
    		                    lineStyle: { // 属性lineStyle控制线条样式
    		                    	color:[
    		                    	       [tem1/1000, '#F1F26F'],[tem2/1000+tem1/1000, 'lightgreen'],
    		                    	       [tem3/1000+tem2/1000+tem1/1000, 'orange'],
                                           [tem4/1000+tem3/1000+tem2/1000+tem1/1000, 'skyblue'], 
                                           [tem/1000+tem4/1000+tem3/1000+tem2/1000+tem1/1000,'#ff4500'],
                                           [1,'#C72986']
    		                    	],
    		                        width: 30
    		                    }
    		                },
    		                axisLabel: { // 坐标轴文本标签，详见axis.axisLabel
    		                	show: true,
   		                	formatter: function(v) {
		                          switch (v+'') {		                         
		                                  case '0':
		                                      return '开发:'+data0+'%';
		                                  case '20':
		                                      return '测试:'+data1+'%';
		                                  case '60':
		                                      return '待投产:'+data2+'%';
		                                  case '70':
		                                      return '提交投产:'+data3+'%';
		                                  case '90':
		                                      return '完成:'+data4+'%';
		                                  default:
		                                      return '';
		                          }
		                      },                         
    		            textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
		                        color: '#666',
		                        fontSize: 12
		                    }
		                },
		                pointer: { //指针
	                        show: false,
	                        //指针长度
	                        length:'90%',
	                        width:0
	                    },	                    
	                    data : [{
	                        value: Svalue,
	                        name: ''
	                    }]
                        },
                        
                        {
                            name: '开发',
                            type:'bar',
                            data:[0],
                            itemStyle: {
                                normal: {
                                    color: '#F1F26F'  //这里的图例要注意，颜色设置和仪表盘的颜色对应起来
                                }
                            }
                        },
                        {
                            name: '测试',
                            type:'bar',
                            data:[0],
                            itemStyle: {
                                normal: {
                                    color: 'lightgreen'  //这里的图例要注意，颜色设置和仪表盘的颜色对应起来
                                }
                            }
                        },
                        {
                            name: '待投产',
                            type:'bar',
                            data:[0],
                            itemStyle: {
                                normal: {
                                    color: 'orange'  //这里的图例要注意，颜色设置和仪表盘的颜色对应起来
                                }
                            }
                        },
                        {
                            name: '提交投产',
                            type:'bar',
                            data:[0],
                            itemStyle: {
                                normal: {
                                    color: 'skyblue'  //这里的图例要注意，颜色设置和仪表盘的颜色对应起来
                                }
                            }
                        },
                        {
                            name:'完成',
                            type:'bar',
                            data:[0],
                            itemStyle: {
                                normal: {
                                    color: '#ff4500'  //这里的图例要注意，颜色设置和仪表盘的颜色对应起来
                                }
                            }
                        },
                        {
                            name:'其他',
                            type:'bar',
                            data:[0],
                            itemStyle: {
                                normal: {
                                    color: '#C72986'  //这里的图例要注意，颜色设置和仪表盘的颜色对应起来
                                }
                            }
                        }
                        
    		            ]
    		        };
           		           		
            		task_echarts.setOption(taskoption);

/*        		}else{
        			alert("查询失败");*/
        		}
        		
        	},taskQueryListCall);
        	
        }        	

        //统计分析页面
        function userComponentDetail(){
        	
        	var users_detail = echarts.init(document.getElementById('users_detail'));
        	 
        	//得到当前时间
        	var date =  getCurrentYMD();
        	$("#statisticalTime").html("数据时间："+date);

        	//部门名称的集合
        	var org_name=new Array();
        	//行员分布
        	var banker=new Array();
        	//非行员分布
        	var no_banker=new Array();
        	//行员数和非行员数
        	var b_num=0;
        	var nb_num=0;
        	var num=0;

        	//行员分布数据
        	var d_new_banker=new Array();
        	//非行员分布数据
        	var d_new_no_banker=new Array();
        	
        	var userDetailCall = getMillisecond();
        	baseAjaxJsonp(dev_report+"EConstruction/queryUserComponentDetail.asp?SID="+SID1+"&call="+userDetailCall,null, function(data) {
        		if (data != undefined&&data!=null&&data.result==true) {
        			var bankerDetail = data.bankerDetail;
        			var nobankerDetail = data.nobankerDetail;       			
        			var deptDetail = data.deptDetail;
        			
        			if(bankerDetail != null && bankerDetail.length > 0) {
            			for(var i = 0;i<bankerDetail.length; i++) {
            				var b_name = bankerDetail[i].ORG_NAME;            				
            				var b_value = bankerDetail[i].B_NUM;
            				var b_arr = {"value":b_value,"name":b_name};            				            				
            				banker.push(b_arr);
            				b_num=b_num+b_value;
            			}
            		}        			
        			
        			if(nobankerDetail != null && nobankerDetail.length > 0) {
	
            			for(var i = 0;i<nobankerDetail.length; i++) {
            				var b_name = nobankerDetail[i].ORG_NAME;            				
            				var b_value = nobankerDetail[i].B_NUM;
            				var b_arr = {"value":b_value,"name":b_name};                    				
            				no_banker.push(b_arr);
            				nb_num=nb_num+b_value;            				
            			}
            		}
        			
        			if(deptDetail != null && deptDetail.length > 0) {
        				var b_name ='';
        				var temp1=false;
        				var temp2=false;
        	        	//var new_banker=new Array();
        	        	//var new_no_banker=new Array();

            			for(var i = 0;i<deptDetail.length; i++) {
            				b_name = deptDetail[i].ORG_NAME;            				
            				org_name.push(b_name);

            				for(var j = 0;j<no_banker.length; j++) {
            					if (no_banker[j].name==b_name){
            						temp1=true;
            						//new_no_banker.push(no_banker[j]);
            						d_new_no_banker.push(no_banker[j].value);
            						break;
            					}else{
            						continue;
            					}
            					
            				}
            				
            				if(!temp1){
            					//new_no_banker.push({"value":0,"name":b_name});
            					d_new_no_banker.push(0);
            				}
            				
            				for(var k = 0;k<banker.length; k++) {
            					if (banker[k].name==b_name){
            						temp2=true;
            						//new_banker.push(banker[k]);
            						d_new_banker.push(banker[k].value);
            						break;
            					}else{
            						continue;
            					}
            					
            				}
            				
            				if(!temp2){
            					//new_banker.push({"value":0,"name":b_name});
            					d_new_banker.push(0);
            				}
            				
            			}
            			
            			//banker=new_banker;
            			//no_banker=new_no_banker;
            		} 
        			
        			num=b_num+nb_num;
        			
        			$("#b_users_num").html(num);
        			$("#banker_num").html(b_num);
        			$("#nobanker_num").html(nb_num);
        			$("#banker_percent").html(parseInt(b_num*100/num)+"%");
        			$("#nobanker_percent").html(100-parseInt(b_num*100/num)+"%");
        			
        			
                	var userdetailoption = {
               			 title : {
                		        text: '山西农村信用社用户明细',
                		        subtext: '行员/非行员分布情况'
                		    },
                		    tooltip : {
                		        trigger: 'axis'
                		    },
                		    legend: {
                		        data:["行员","非行员"]
                		    },
                		    toolbox: {
                		        show : true,
                		        feature : {
                		            dataView : {show: true, readOnly: false},
                		            magicType : {show: true, type: ['line', 'bar']},
                		            restore : {show: true},
                		            saveAsImage : {show: true}
                		        }
                		    },
                		    calculable : true,
                		    xAxis : [
                		        {
                		        	name :'所在部门',
                		            type : 'category',
                		            axisTick:{
                		            	alignWithLabel:true,
                		            	interval:0
                		            	},
       		                        axisLabel:{
       		                        	rotate: -45,
       		                        	textStyle:{
       		                        		fontSize:10,
       		                        		baseline:'top'}
    		                         },
                		            data : org_name
                		        }
                		    ],
                		    yAxis : [
                		        {
                		            type : 'value'
                		        }
                		    ],
                		    series : [
                		        {
                		            name:'行员',
                		            type:'bar',
                		            data:d_new_banker,
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
                		            name:'非行员',
                		            type:'bar',
                		            data:d_new_no_banker,
                		            markPoint : {
                		                data : [
                		                    {type : 'max', name: '最大值'},
                		                    {type : 'min', name: '最小值'}
                		                ]
                		            },
                		            markLine : {
                		                data : [
                		                    {type : 'average', name : '平均值'}
                		                ]
                		            }
                		        }]
               		};
               	
               	users_detail.setOption(userdetailoption);
        			
        			}
        		},userDetailCall);
        	
        }
        
        //统计需求明细
        
        function requirementComponentDetail(org_code){
        	       	
        	var requirement_detail = echarts.init(document.getElementById('requirement_detail'));
        	
        	//需求明细--暂时未用
        	var RD=new Array();    
        	//时间轴
        	var Time=new Array();
        	//已受理需求数
        	var accept=new Array();
        	//已评估需求书
        	var assess=new Array();
        	
        	//部门小列表呈现
        	var flag=false;
        	//三个列值
        	var d_Time=new Array();
        	var d_accept=new Array();
        	var d_assess=new Array();
        	        	
        	
        	//得到当前时间
        	var date =  getCurrentYMD();
        	var now=parseInt(date.substring(0,4));
 
        	$("#requirementDetailTime").html("数据时间："+date);
        	
        	var requirementDetailCall = getMillisecond();
        	baseAjaxJsonp(dev_report+"EConstruction/RequirementComponentDetail.asp?SID="+SID1+"&call="+requirementDetailCall,null, function(data) {
        		if (data != undefined&&data!=null&&data.result==true) {

        			//得到后台数据
        			 var c= data.RequirementComponentDetail;
        			 var list=data.ExpandableRequirementListView;
        			 
        			 //展开小菜单
        			 if(org_code!="1"){
        				//建临时变量用于往年的需求量总统计
            			 var temp1=0;
            			 var temp2=0;
            			 var temp3=0;
            			 //标志位
            			 var change=0;
            			 var tem=false;
            			 
        				 if(list != null && list.length > 0){
            				 for(var k = 0;k<list.length; k++) {
            					 var b_name = list[k].CREATE_TIME;            				
                 				var b_value1 = list[k].ACCEPT_COUNT;
                 				var b_value2 = list[k].ASSESS_COUNT;
                 				var b_value3 = list[k].ORG_CODE;
                 				
                 				if(org_code==b_value3){
                 					//console.info(org_code +"---"+b_value3+"---"+b_name+"----"+b_value1+"-----"+b_value2);
                 					var year=parseInt(b_name.substring(0,4));

                    				if(!tem)
                    				{
                    					change=year;
                    				}
                    				
                    				if(year<=now){
                    				  tem=true;
              	        			  temp1=year-1;
            	        			  temp2=temp2+b_value1;
            	        			  temp3=temp3+b_value2;
            	        			  if(year!=change){
	                						//都加了第二年的第一个月
	                						/*console.info("2、---"+temp2+"-----"+b_value1);*/
	                						d_Time.push(temp1);                    				
	                						d_accept.push(parseInt( temp2-b_value1));                    				
	                						d_assess.push(parseInt( temp3-b_value2));
	                        				temp1=year;          	        			 
	                	        			temp2=b_value1;
	                	        			temp3=b_value2;
	                	        			  
	                	        			change=year;
	                	        			tem=false;
            	        			  }
                    				}
                    				
                    				if(year==now){
	                    				//放今年的历月数据
	                    				d_Time.push(b_name);           				
	                    				d_accept.push(b_value1);           				
	                    				d_assess.push(b_value2);
	                    				
	                    				flag=true;
                    				}                 					
                 				}else{
                 					continue;
                 				}                					
                 				
            				 }
            				 flag=true; 
              			//每次加载清楚上次统计的数据（放在循环外）
                         	$("tr[name='requirementDetailList']").remove();
              				
              				if(!flag){
              					
                 				 appendAddTr("requirementCountTable","00","无数据","-","-");
                 				 
                			 }else{
                				 
                              	for(var j = 0;j<d_Time.length; j++)                    		
                              	{
                              		appendAddTr("requirementCountTable",j,d_Time[j],d_accept[j],d_assess[j]);
                              		
                              	} 
                				 
                              	var requirementDetailoption = {
                            			 title : {
                             		        text: '山西农村信用社需求明细',
                             		        subtext: '受理/评估数量历月分布'
                             		    },
                             		    tooltip : {
                             		        trigger: 'axis'
                             		    },
                             		    legend: {
                             		        data:["已受理","已评估"]
                             		    },
                             		    toolbox: {
                             		        show : true,
                             		        feature : {
                             		            dataView : {show: true, readOnly: false},
                             		            magicType : {show: true, type: ['line', 'bar']},
                             		            restore : {show: true},
                             		            saveAsImage : {show: true}
                             		        }
                             		    },
                             		    calculable : true,
                             		    xAxis : [
                             		        {
                             		        	name :'年月',
                             		            type : 'category',
                             		            axisTick:{
                             		            	alignWithLabel:true,
                             		            	interval:0
                             		            	},
                    		                        axisLabel:{
                    		                        	rotate: -45,
                    		                        	textStyle:{
                    		                        		fontSize:12,
                    		                        		baseline:'top'}
                 		                         },
                             		            data : d_Time
                             		        }
                             		    ],
                             		    yAxis : [
                             		        {
                             		            type : 'value'
                             		        }
                             		    ],
                             		    series : [
                             		        {
                             		            name:'已受理',
                             		            type:'bar',
                             		            data:d_accept,
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
                             		            name:'已评估',
                             		            type:'bar',
                             		            data:d_assess,
                             		            markPoint : {
                             		                data : [
                             		                    {type : 'max', name: '最大值'},
                             		                    {type : 'min', name: '最小值'}
                             		                ]
                             		            },
                             		            markLine : {
                             		                data : [
                             		                    {type : 'average', name : '平均值'}
                             		                ]
                             		            }
                             		        }]
                            		};
                              		//if(requirementDetailoption >0 )
                              			requirement_detail.setOption(requirementDetailoption);
                          	
                			 }                        	
              				
            			 }
        				 
        			 }else{
        				 
            			 //建临时变量用于往年的需求量总统计
            			 var temp1=0;
            			 var temp2=0;
            			 var temp3=0;
            			 //标志位
            			 var change=0;
            			 var tem=false;
            			 
            			if(c != null && c.length > 0) {
                			for(var i = 0;i<c.length; i++) {
                				var b_name = c[i].CREATE_TIME;            				
                				var b_value1 = c[i].ACCEPT_COUNT;
                				var b_value2 = c[i].ASSESS_COUNT;
                				var b_arr = {"value2":b_value2,"value1":b_value1,"name":b_name};            				            				
                				RD.push(b_arr);
                				
                				var year=parseInt(b_name.substring(0,4));

                				if(!tem)
                				{
                					change=year;
                				}
                				
                				if(year<=now)
                				{
                				  tem=true;
          	        			  temp1=year-1;
        	        			  temp2=temp2+b_value1;
        	        			  temp3=temp3+b_value2;
                					           					               				
                					if(year!=change){
                						//都加了第二年的第一个月
                						Time.push(temp1);   
                						accept.push(parseInt( temp2-b_value1));                    				
                						assess.push(parseInt( temp3-b_value2));
                        				/*accept.push(temp2-b_value1);                    				
                        				assess.push(temp3-b_value2);*/
                        				  
                        				  temp1=year;          	        			 
                	        			  temp2=b_value1;
                	        			  temp3=b_value2;
                	        			  
                	        			  change=year;
                	        			  tem=false;
                        				}           					
                					
                				}
                				
                				if(year==now){
                				//放今年的历月数据
                				Time.push(b_name);           				
                				accept.push(b_value1);           				
                				assess.push(b_value2);
                				}
               			
                			}
                			

                        	//每次加载清楚上次统计的数据（放在循环外）
                        	$("tr[name='requirementDetailList']").remove();
                        	
                        	for(var j = 0;j<Time.length; j++)                    		
                        	{
                        		appendAddTr("requirementCountTable",j,Time[j],accept[j],assess[j]);
                        		
                        	}
                		}

                    	var requirementDetailoption = {
                      			 title : {
                       		        text: '山西农村信用社需求明细',
                       		        subtext: '受理/评估数量历月分布'
                       		    },
                       		    tooltip : {
                       		        trigger: 'axis'
                       		    },
                       		    legend: {
                       		        data:["已受理","已评估"]
                       		    },
                       		    toolbox: {
                       		        show : true,
                       		        feature : {
                       		            dataView : {show: true, readOnly: false},
                       		            magicType : {show: true, type: ['line', 'bar']},
                       		            restore : {show: true},
                       		            saveAsImage : {show: true}
                       		        }
                       		    },
                       		    calculable : true,
                       		    xAxis : [
                       		        {
                       		        	name :'年月',
                       		            type : 'category',
                       		            axisTick:{
                       		            	alignWithLabel:true,
                       		            	interval:0
                       		            	},
              		                        axisLabel:{
              		                        	rotate: -45,
              		                        	textStyle:{
              		                        		fontSize:12,
              		                        		baseline:'top'}
           		                         },
                       		            data : Time
                       		        }
                       		    ],
                       		    yAxis : [
                       		        {
                       		            type : 'value'
                       		        }
                       		    ],
                       		    series : [
                       		        {
                       		            name:'已受理',
                       		            type:'bar',
                       		            data:accept,
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
                       		            name:'已评估',
                       		            type:'bar',
                       		            data:assess,
                       		            markPoint : {
                       		                data : [
                       		                    {type : 'max', name: '最大值'},
                       		                    {type : 'min', name: '最小值'}
                       		                ]
                       		            },
                       		            markLine : {
                       		                data : [
                       		                    {type : 'average', name : '平均值'}
                       		                ]
                       		            }
                       		        }]
                      		};
                      	
                    	requirement_detail.setOption(requirementDetailoption);
        				 
        			 }
        			 
        			 
        		}       		
        		
        	},requirementDetailCall);
        	        	
        }
        
      //增加列表行（循环调用）
        function appendAddTr(Table,ID,name,value1,value2){
        	var Obj = $("#"+Table);
        	var tr = "<tr name='requirementDetailList' id='t"+ID+"'>" 
        				+"<th>"+name+"：</th>"
        				+"<td >" +value1+"</td>"
        				+"<td >" +value2+"</td>"
        			+"</tr>";
        	Obj.append(tr);
        	
        }
        
        //统计部门需求明细
        
        function requirementDepartmentsDetail(){        	       	        	   
        	
        	var requirementDepartmentsCall = getMillisecond();
        	
        	var queryParams=function(params){
        		var temp={
        				limit: params.limit, //页面大小
        				offset: params.offset //页码
        		};
        		return temp;
        	};
        	$("#requirementDepartmentsTable").bootstrapTable({
        		url : dev_report+'EConstruction/RequirementDepartmentsDetail.asp?call='+requirementDepartmentsCall+'&SID='+SID1,
        		method : 'get', //请求方式（*）   
        		striped : false, //是否显示行间隔色
        		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        		sortable : true, //是否启用排序
        		sortOrder : "asc", //排序方式
        		queryParams : queryParams,//传递参数（*）
        		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
        		pagination : true, //是否显示分页（*）
        		pageList : [5,10,15],//每页的记录行数（*）
        		pageNumber : 1, //初始化加载第一页，默认第一页
        		pageSize : 10,//可供选择的每页的行数（*）
        		clickToSelect : false, //是否启用点击选中行
        		uniqueId : "ORG_NAME", //每一行的唯一标识，一般为主键列
        		cardView : false, //是否显示详细视图
        		detailView : false, //是否显示父子表
        		jsonpCallback:requirementDepartmentsCall,
        		singleSelect: true,
        		/*showFooter:true,*/ //用于分页合计
        		onLoadSuccess : function(data){
        			gaveInfo();
        		},
        		columns : [ {
        			field : 'Number',
        			title : '序号',
        			align : "center",
        			width : "5%",
        			formatter: function (value, row, index) {
        				return index+1;
        			}
        		}, {
        			field : "ORG_NAME",
        			title : "部门",
        			align : "center",
        			width : "18%"/*,
        			footerFormatter: function (value) {         				 
        				return "合计(页):";
        				}*/
        		}, {
        			field : "COUNT",
        			title : "总量",
        			align : "center",
        			width : "13%" /*,
        			footerFormatter: function (value) { 
        				var count = 0; 
        				for (var i=0;i<value.length;i++) { 
        					count += value[i].COUNT;
        					} 
        				return count+"";
        				}*/
        		}, {
        			field : "NCOUNT",
        			title : "不处理",
        			align : "center",
        			width : "13%"/*,
        			footerFormatter: function (value) { 
        				var count1 = 0; 
        				for (var j=0;j<value.length;j++) { 
        					count1 += value[j].NCOUNT;
        					}
        				return count1+"";
        				}*/
        		}, {
        			field : "AACOUNT",
        			title : "发送建议",
        			align : "center",
        			width : "13%"/*,
        			footerFormatter: function (value) { 
        				var count1 = 0; 
        				for (var j=0;j<value.length;j++) { 
        					count1 += value[j].NCOUNT;
        					}
        				return count1+"";
        				}*/
        		}, {
        			field : "OCOUNT",
        			title : "已终止",
        			align : "center",
        			width : "13%"/*,
        			footerFormatter: function (value) { 
        				var count2 = 0; 
        				for (var k=0;k<value.length;k++) { 
        					count2 += value[k].OCOUNT;
        					}
        				return count2+"";
        				}*/
        		}, {
        			field : "ACOUNT",
        			title : "已完成",
        			align : "center",
        			width : "13%"/*,
        			footerFormatter: function (value) { 
        				var count3 = 0; 
        				for (var h=0;h<value.length;h++) { 
        					count3 += value[h].ACOUNT;
        					}
        				return count3+"";
        				}*/
        		}, {
        			field : "NACOUNT",
        			title : "未完成",
        			align : "center",
        			width : "13%"/*,
        			footerFormatter: function (value) { 
        				var count4 = 0; 
        				for (var g=0;g<value.length;g++) { 
        					count4 += value[g].NACOUNT;
        					}
        				return count4+"";
        				}*/
        		}]
        	},requirementDepartmentsCall);
        	
        	/*baseAjaxJsonp(dev_report+"EConstruction/RequirementDepartmentsDetail.asp?SID="+SID1+"&call="+requirementDepartmentsCall,null, function(data) {
        		if (data != undefined&&data!=null&&data.result==true) {

        			//得到后台数据
        			 var d= data.RequirementDepartmentsDetail;
       			 
        			if(d != null && d.length > 0) {
        				
        				//合计
        				var z_value1 = 0;
        				var z_value2 = 0;
        				var z_value3 = 0;
        				var z_value4 = 0;
        				var z_value5 = 0;
        				
        				//每次加载清楚上次统计的数据（放在循环外）
                    	$("tr[name='requirementDepartList']").remove();
                    	
            			for(var i = 0;i<d.length; i++) {
            				var b_name = d[i].ORG_NAME;            				
            				var b_value1 = d[i].COUNT;
            				var b_value2 = d[i].NCOUNT;
            				var b_value3 = d[i].OCOUNT;
            				var b_value4 = d[i].ACOUNT;
            				var b_value5 = b_value1-b_value2-b_value3-b_value4;           				  
            				
            				appendDepartTr("requirementDepartmentsTable",i,b_name,b_value1,b_value2,b_value3,b_value4,b_value5);
           			         
            				 z_value1 = z_value1+b_value1;
            				 z_value2 = z_value2+b_value2;
            				 z_value3 = z_value3+b_value3;
            				 z_value4 = z_value4+b_value4;
            				 z_value5 = z_value5+b_value5;
            				
            			}
            			
            			appendDepartTr("requirementDepartmentsTable",d.length,"合计",z_value1,z_value2,z_value3,z_value4,z_value5);
	
            		}
                  	
        		}       		
        		
        	},requirementDepartmentsCall);*/
        	        	
        }
        
/*      //增加列表行（循环调用）
        function appendDepartTr(Table,ID,name,value1,value2,value3,value4,value5){
        	var Obj = $("#"+Table);
        	var tr = "<tr name='requirementDepartList' id='d"+ID+"'>" 
        				+"<th>"+name+"：</th>"
        				+"<td >" +value1+"</td>"
        				+"<td >" +value2+"</td>"
        				+"<td >" +value3+"</td>"
        				+"<td >" +value4+"</td>"
        				+"<td >" +value5+"</td>"
        			+"</tr>";
        	Obj.append(tr);
        	
        } */
        
        //统计需求处理意见数量分布
        
        function RequirementDisposeDetail(){
        	
        	var dispose_detail=echarts.init(document.getElementById('dispose_detail'));
        	
        	var RequirementDisposeDetailCall = getMillisecond();
        	baseAjaxJsonp(dev_report+"EConstruction/RequirementDisposeDetail.asp?SID="+SID1+"&call="+RequirementDisposeDetailCall,null, function(data) {
        		if (data != undefined&&data!=null&&data.result==true) {

        			//得到后台数据
        			 var d= data.RequirementDisposeDetail;
       			 
        			if(d != null && d.length > 0) {
        				                             			           				
            				var b_value1 = d[0].SUGGEST;
            				var b_value2 = d[0].RCOUNT;
            				var b_value3 = d[0].XCOUNT;
            				var b_value4 = d[0].NCOUNT;
            				
            				$("#Dispose1").html(b_value1);
            				$("#Dispose2").html(b_value2);
            				$("#Dispose3").html(b_value3);
            				$("#Dispose4").html(b_value4);           			            				
            		
       			
        		var disposeDetailoption = {
        				    tooltip : {
        				        trigger: 'item',
        				        formatter: "{a} <br/>{b} : {c} ({d}%)"
        				    },
        				    series : [
        				        {
        				            name: '处理意见',
        				            type: 'pie',
        				            radius : '75%',
        				            center: ['50%', '60%'],
        				            data:[
        				                {value:b_value1, name:'发送需求建议'},
        				                {value:b_value2, name:'改造类(任务)'},
        				                {value:b_value3, name:'项目'},
        				                {value:b_value4, name:'不处理'}
        				            ],
        				            itemStyle: {
        				                emphasis: {
        				                    shadowBlur: 10,
        				                    shadowOffsetX: 0,
        				                    shadowColor: 'rgba(0, 0, 0, 0.5)'
        				                }
        				            }
        				        }
        				    ]
        				};
        		
        			dispose_detail.setOption(disposeDetailoption);
        			
        			}
        		}       		
        		
        	},RequirementDisposeDetailCall);
        	        	
        }
        
      //统计需求评估数量
        
        
        function RequirementAssessDetail(){
        	
        	var assess_detail=echarts.init(document.getElementById('assess_detail'));
        	var noassess_detail=echarts.init(document.getElementById('noassess_detail'));
        	//或缺当前时间
        	var date =  getCurrentYMD();
/*        	var year =parseInt(date.substring(0,4));
        	var month =parseInt(date.substring(5,7));
        	var day =parseInt(date.substring(8));*/
        	
        	//前台传值
        	var a_value1 = 0;
			var a_value2 = 0;
			var a_value3 = 0;
			
        	var na_value1 = 0;
			var na_value2 = 0;
			var na_value3 = 0;
			
        	var RequirementAssessDetailCall = getMillisecond();
        	baseAjaxJsonp(dev_report+"EConstruction/RequirementAssessDetail.asp?SID="+SID1+"&call="+RequirementAssessDetailCall,null, function(data) {
        		if (data != undefined&&data!=null&&data.result==true) {

        			//得到后台数据
        			 var a= data.RequirementAssessDetail;
        			 var na= data.RequirementNoAssessDetail;
       			 
        			if(a != null && a.length > 0) {
        				for(var i = 0;i<a.length; i++) {                             			           				
            				/*var t_value1 = a[i].CREATE_TIME;
            				var t_value2 = a[i].OPT_TIME;

            				var s_value1 = new Date(t_value1.replace(/-/g,"/"));
            				var s_value2 = new Date(t_value2.replace(/-/g,"/"));
            				console.info(s_value2+"----"+s_value1);	
            				if(s_value2-s_value1<7){
            					a_value1 =a_value1 +1;
            				}else if(s_value2-s_value1<14){
            					a_value2 =a_value2 +1;
            				}else{
            					a_value3=a_value3+1;
            				}*/   
        					var s_value1 = a[i].BETWEEN_DAY;
        					if(s_value1<7){
            					a_value1 =a_value1 +1;
            				}else if(s_value1<14){
            					a_value2 =a_value2 +1;
            				}else{
            					a_value3=a_value3+1;
            				}
            				
        				}   			            				
            		
        				$("#Assess1").html(a_value1);
        				$("#Assess2").html(a_value2);
        				$("#Assess3").html(a_value3);
        				
        		var assessDetailoption = {
        				    tooltip : {
        				        trigger: 'item',
        				        formatter: "{a} <br/>{b} : {c} ({d}%)"
        				    },
        				    series : [
        				        {
        				            name: '处理意见',
        				            type: 'pie',
        				            radius : '75%',
        				            center: ['50%', '60%'],
        				            data:[
        				                {value:a_value1, name:'一周内完成'},
        				                {value:a_value2, name:'两周内完成'},
        				                {value:a_value3, name:'两周以上完成'}
        				            ],
        				            itemStyle: {
        				                emphasis: {
        				                    shadowBlur: 10,
        				                    shadowOffsetX: 0,
        				                    shadowColor: 'rgba(0, 0, 0, 0.5)'
        				                }
        				            }
        				        }
        				    ]
        				};
        		
        			assess_detail.setOption(assessDetailoption);
        			
        			}
        			
        			//没评估
        			
           			if(na != null && na.length > 0) {

           				for(var i = 0;i<na.length; i++) {                             			           				
            				/*var t_value1 = na[i].CREATE_TIME;
            				//var t_value2 = na[i].OPT_TIME;

            				var s_value1 = new Date(t_value1.replace(/-/g,"/"));
            				var s_value2 = new Date(date.replace(/-/g,"/"));
            					
            				if(s_value2-s_value1<7){
            					na_value1 =na_value1 +1;
            				}else if(s_value2-s_value1<14){
            					na_value2 =na_value2 +1;
            				}else{
            					na_value3=na_value3+1;
            				}*/
           					var s_value1 = na[i].BETWEEN_DAY;
           					
           					if(s_value1<7){
            					na_value1 =na_value1 +1;
            				}else if(s_value1<14){
            					na_value2 =na_value2 +1;
            				}else{
            					na_value3=na_value3+1;
            				}
           				}
        		
           				$("#NoAssess1").html(na_value1);
        				$("#NoAssess2").html(na_value2);
        				$("#NoAssess3").html(na_value3);
   			
        	    		var noassessDetailoption = {
                     			 title : {
                        		        text: '山西农村信用社需求未评估',
                        		        subtext: '周期评估数量分布'
                        		    },
        	    			    color: ['#3398DB'],
        	    			    tooltip : {
        	    			        trigger: 'axis',
        	    			        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
        	    			            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        	    			        }
        	    			    },
        	    			    grid: {
        	    			        left: '3%',
        	    			        right: '4%',
        	    			        bottom: '3%',
        	    			        containLabel: true
        	    			    },
        	    			    xAxis : [
        	    			        {
        	    			            type : 'category',
        	    			            data : ['前一周内提出','前两周内提出','前两周以上提出'],
        	    			            axisTick: {
        	    			                alignWithLabel: true
        	    			            }
        	    			        }
        	    			    ],
        	    			    yAxis : [
        	    			        {
        	    			            type : 'value'
        	    			        }
        	    			    ],
        	    			    series : [
        	    			        {
        	    			            name:'没评估',
        	    			            type:'bar',
        	    			            barWidth: 23,
        	    			            data:[na_value1, na_value2, na_value3]
        	    			        }
        	    			    ]
        	    			};
    		
    			noassess_detail.setOption(noassessDetailoption);
    			
    			}
        			
        		}       		
        		
        	},RequirementAssessDetailCall);
        	        	
        }
        
        
        
        
        //统计任务明细
        
        function taskDetail(){
        	       	
        	var task_detail = echarts.init(document.getElementById('task_detail'));
        	    
        	//时间轴
        	var time=new Array();
        	//任务提出
        	var present=new Array();
        	//提交评审
        	var jury=new Array();
        	//测试完成
        	var test=new Array();
        	//开发完成
        	var achieve=new Array();
        	        	        	
        	//得到当前时间
        	var date =  getCurrentYMD();
        	var now=parseInt(date.substring(0,4));
 
        	$("#taskDetailTime").html("数据时间："+date);
        	
        	var taskDetailCall = getMillisecond();
        	baseAjaxJsonp(dev_report+"EConstruction/TaskSectionDetail.asp?SID="+SID1+"&call="+taskDetailCall,null, function(data) {
        		if (data != undefined&&data!=null&&data.result==true) {

        			//得到后台数据
        			 var t= data.TaskSectionDetail;
        			 
        			 //建临时变量用于往年的需求量总统计
        			 var temp1=0;
        			 var temp2=0;
        			 var temp3=0;
        			 var temp4=0;
        			 var temp5=0;
        			 //标志位
        			 var change=0;
        			 var tem=false;
        			 
        			if(t != null && t.length > 0) {
            			for(var i = 0;i<t.length; i++) {
            				var b_name = t[i].CREATE_TIME;            				
            				var b_value1 = t[i].PRESENTT_COUNT;
            				var b_value2 = t[i].JURY_COUNT;
            				var b_value3 = t[i].TEST_COUNT;
            				var b_value4 = t[i].ACHIEVE_COUNT;
            				            				
            				var year=parseInt(b_name.substring(0,4));

            				if(!tem)
            				{
            					change=year;
            				}
            				
            				if(year<=now)
            				{
            					tem=true;
      	        			  temp1=year;
    	        			  temp2=temp2+b_value1;
    	        			  temp3=temp3+b_value2;
    	        			  temp4=temp4+b_value3;
    	        			  temp5=temp5+b_value4;
            					           					               				
            					if(year!=change){
            						            						
            							//都加了第二年的第一个月
                						time.push(change);                    				
                						present.push(temp2-b_value1);                    				
                						jury.push(temp3-b_value2);
                						test.push(temp4-b_value3);
                        				achieve.push(temp5-b_value4);
                        				
                        				temp1=year;
              	        			  	temp2=b_value1;
              	        			  	temp3=b_value2;
              	        			  	temp4=b_value3;
              	        			  	temp5=b_value4;
              	        			  
              	        			  	change=year;
              	        			  	tem=false;           						
                    				           	        			  
                    				}
            					
            					if(year==now){
    							//放今年的历月数据
                				time.push(b_name);           				
                				present.push(b_value1);           				
                				jury.push(b_value2);
                				test.push(b_value3);
                				achieve.push(b_value4);
                				}
            				}
            				            				           			
            			}
            			
                    	//每次加载清楚上次统计的数据（放在循环外）
                    	$("tr[name='taskDetailList']").remove();
                    	
                    	for(var j = 0;j<time.length; j++)
                    	{
                    		appendTaskTr("taskDetailTable",j,time[j],present[j],jury[j],test[j],achieve[j]);
                    	}
                    	
            		}

                	var taskdetailoption = {
                  			 title : {
                   		        text: '山西农村信用社任务明细',
                   		        subtext: '历月任务阶段数量'
                   		    },
                   		    tooltip : {
                   		        trigger: 'axis'
                   		    },
                   		    legend: {
                   		        data:["已提出","已完成"]
                   		    },
                   		    toolbox: {
                   		        show : true,
                   		        feature : {
                   		            dataView : {show: true, readOnly: false},
                   		            magicType : {show: true, type: ['line', 'bar']},
                   		            restore : {show: true},
                   		            saveAsImage : {show: true}
                   		        }
                   		    },
                   		    calculable : true,
                   		    xAxis : [
                   		        {
                   		        	name :'年月',
                   		            type : 'category',
                   		            axisTick:{
                   		            	alignWithLabel:true,
                   		            	interval:0
                   		            	},
          		                        axisLabel:{
          		                        	rotate: -45,
          		                        	textStyle:{
          		                        		fontSize:12,
          		                        		baseline:'top'}
       		                         },
                   		            data : time
                   		        }
                   		    ],
                   		    yAxis : [
                   		        {
                   		            type : 'value'
                   		        }
                   		    ],
                   		    series : [
                   		        {
                   		            name:'已提出',
                   		            type:'bar',
                   		            data:present,
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
                   		            name:'已完成',
                   		            type:'bar',
                   		            data:achieve,
                   		            markPoint : {
                   		                data : [
                   		                    {type : 'max', name: '最大值'},
                   		                    {type : 'min', name: '最小值'}
                   		                ]
                   		            },
                   		            markLine : {
                   		                data : [
                   		                    {type : 'average', name : '平均值'}
                   		                ]
                   		            }
                   		        }]
                  		};
                  	
                	task_detail.setOption(taskdetailoption);
        		}       		
        		
        	},taskDetailCall);
        	        	
        }
        
      //增加列表行（循环调用）
        function appendTaskTr(Table,ID,name,value1,value2,value3,value4){
        	var Obj = $("#"+Table);
        	var tr = "<tr name='taskDetailList' id='ta"+ID+"'>" 
        				+"<th>"+name+"：</th>"
        				+"<td >" +value1+"</td>"
        				+"<td >" +value2+"</td>"
        				+"<td >" +value3+"</td>"
        				+"<td >" +value4+"</td>"
        			+"</tr>";
        	Obj.append(tr);       	
        }        
        
        //已完成任务各类进度情况
        function TaskProgressStatusDetail(){
        	
        	var TaskProgressStatusCall = getMillisecond();
        	//固定左表头
        	var left=["管理系统","核心","卡与结算","手机网银","数据","信贷与风险","中间业务","自助设备","需求测试"];
        	//存放总数
        	var count=new Array();
        	//提前完成
        	var count1=new Array();
        	//按计划完成
        	var count2=new Array();
        	//逾期完成
        	var count3=new Array();
        	
        	//标志位
        	var flag=false;
        	
        	baseAjaxJsonp(dev_report+"EConstruction/TaskProgressStatusDetail.asp?SID="+SID1+"&call="+TaskProgressStatusCall,null, function(data) {
        		if (data != undefined&&data!=null&&data.result==true) {

        			//得到后台数据
        			 var t1= data.TaskProgressStatusDetail;
        			 var t2= data.TaskInfoDetail;

        			 //存完成总数量列
        			if(t1 != null && t1.length > 0) { 
        				
        				for(var i=0;i<left.length;i++){
        					flag=false;           				
        					for(var j=0;j<t1.length;j++){
        						
        						if(t1[j].ORG_NAME==left[i]){
        							flag=true;
        							count.push(t1[j].ACHIEVE_NUM);						        						       							
        							break;
        						}else{
        							continue;
        						}        						
        					}
        					if(!flag){
        						count.push("0");        						        						
        					}        					        					
        				}

        			}else{
        				
        				var r=0;
        				while(r<9){
        					count.push("0");
        					count1.push("0");
    						count2.push("0");
    						count3.push("0");
    						r++;
        				}
        			}
        			
        			if(t2 != null && t2.length > 0){		
        				//存提前完成列，按计划完成列，逾期完成列

        				for(var k=0;k<left.length;k++){
        					//三个数
        					var c_value1 = 0;
            				var c_value2 = 0;
            				var c_value3 = 0;
            				
        					for(var h=0;h<t2.length;h++){        						
        						if(t2[h].ORG_NAME == left[k]){					
        							var time_p=t2[h].PLAN_PRODUCT_TIME;
        							var time_a=t2[h].ACTUAL_PRODUCT_TIME;
        							
        							var plan= new Date(time_p.replace(/-/g,"/"));
        							var actual= new Date(time_a.replace(/-/g,"/"));
        							if(actual-plan>0){
        								c_value3 =c_value3 +1;
        							}else if(actual-plan<0){
        								c_value1 = c_value1+1;
        							}else{
        								c_value2 =c_value2 +1;
        							}        					       							
        						}else{
        							continue;
        						}
        						
        					}       						
        						count1.push(c_value1);
        						count2.push(c_value2);
        						count3.push(c_value3);       						       					        					
        				}
        				
        			}        				        		
        				       				
        				//每次加载清楚上次统计的数据（放在循环外）
                    	$("tr[name='TaskProgressStatusList']").remove();

            			for(var u = 0;u<left.length; u++) {
            				var b_name = left[u];            				
            				var b_value1 = count[u];
            				var b_value2 = count1[u];            				
            				var b_value4 = count2[u];            				
            				var b_value6 = count3[u];
       					 	var b_value3 ="0";
       					 	var b_value5 ="0";
       					 	var b_value7 ="0";
       					 	
            				if(count[u]!=0){
                				 b_value3 =(parseFloat(b_value2*100/b_value1)).toFixed(2)+"%";
                				 b_value5 =(parseFloat(b_value4*100/b_value1)).toFixed(2)+"%";
                				 b_value7 = (100-parseFloat(b_value2*100/b_value1)-parseFloat(b_value4*100/b_value1)).toFixed(2)+"%";
            				}            				
            				appendTaskProgressStatusTr("ProgressStatusTable",u,b_name,b_value1,b_value2,b_value3,b_value4,b_value5,b_value6,b_value7);          			                    				
            			}           			           			
            		                	
        		}       		        		
        	},TaskProgressStatusCall);       	
        }
        
        //增加列表行（循环调用）
        function appendTaskProgressStatusTr(Table,ID,name,value1,value2,value3,value4,value5,value6,value7){
        	var Obj = $("#"+Table);
        	var tr = "<tr name='TaskProgressStatusList' id='tp"+ID+"'>" 
        				+"<th>"+name+"：</th>"
        				+"<td >" +value1+"</td>"
        				+"<td >" +value2+"</td>"
        				+"<td >" +value3+"</td>"
        				+"<td >" +value4+"</td>"
        				+"<td >" +value5+"</td>"
        				+"<td >" +value6+"</td>"
        				+"<td >" +value7+"</td>"
        			+"</tr>";
        	Obj.append(tr);       	
        }
        
        function TaskBackDetail(){
        	
        	var TaskBackCall = getMillisecond();

        	
        	baseAjaxJsonp(dev_report+"EConstruction/TaskBackDetail.asp?SID="+SID1+"&call="+TaskBackCall,null, function(data) {
        		if (data != undefined&&data!=null&&data.result==true) {
        		
        			var t= data.TaskBackDetail;
        			
        			var value1=t[0].DEVELOP_NO_NUM;
        			var value2=t[0].DEVELOP_NUM;
        			var value3=t[0].SIT_NO_NUM;
        			var value4=t[0].SIT_NUM;
        			var value5=t[0].CHANGE_NO_NUM;
        			var value6=t[0].CHANGE_NUM;
        			var value7=t[0].FREEZE_VERSIONS_NUM;
        			var value8=t[0].VERSIONS_NUM;      			
        			
        			var bf1="0";
        			var bf2="0";
        			var bf3="0";
        			var bf4="0";
        			
        			if(value1!=0){
        				bf1=(parseFloat(value1*100/value2)).toFixed(2)+"%";
        			}
        			if(value3!=0){
        				bf2=(parseFloat(value3*100/value4)).toFixed(2) +"%";
        			}
        			if(value5!=0){
        				bf3=(parseFloat(value5*100/value6)).toFixed(2) +"%";
        			}
        			if(value7!=0){
        				bf4=(parseFloat(value7*100/value8)).toFixed(2) +"%";
        			}
        			
        			//每次加载清楚上次统计的数据（放在循环外）
                	$("tr[name='taskBackList']").remove();
                	
        			appendTaskBackTr("sendBackTable",0,"开发",value2,value1,bf1);
        			appendTaskBackTr("sendBackTable",1,"测试",value4,value3,bf2);
        			appendTaskBackTr("sendBackTable",3,"版本审核",value8,value7,bf4);
        			appendTaskBackTr("sendBackTable",2,"生产变更评审",value6,value5,bf3);
        			
        		}
        		        		
        	},TaskBackCall);        	
        }
        
        //增加列表行（循环调用）
        function appendTaskBackTr(Table,ID,name,value1,value2,value3){
        	var Obj = $("#"+Table);
        	var tr = "<tr name='taskBackList' id='atb"+ID+"'>" 
        				+"<th>"+name+"：</th>"
        				+"<td >" +value1+"</td>"
        				+"<td >" +value2+"</td>"
        				+"<td >" +value3+"</td>"        				
        			+"</tr>";
        	Obj.append(tr);       	
        }
        
      //查询任务规模分布
        
      function  TaskDemandSizeDetail(){
    	  
    	 var DemandSizeCall = getMillisecond();
    	//等到当前时间
      	var date =  getCurrentYMD();
      	var size_echarts = echarts.init(document.getElementById('Size_details'));
      	
      	$("#sizeDateTime").html("数据时间："+date);
      	
      	baseAjaxJsonp(dev_report+"EConstruction/TaskDemandSizeDetail.asp?SID="+SID1+"&call="+DemandSizeCall,null, function(data) {
      		if (data != undefined&&data!=null&&data.result==true) {
      			var t= data.TaskDemandSizeDetail;
      			
      			var s1="0";
    			var s2="0";
    			var s3="0";
    			var s4="0";
    			     			     			
      			if(t != null && t.length > 0){
      				
    				//存提前完成列，按计划完成列，逾期完成列
    				for(var i=0;i<t.length;i++){
    					var value1=t[i].REQ_DEMAND_SIZE;
    					var value2=t[i].CNUM;
    					
    	      			if(value1=="01"){
    	      				s1=value2;
    	      			}
    	      			if(value1=="02"){
    	      				s2=value2;
    	      			}
    	      			if(value1=="03"){
    	      				s3=value2;
    	      			}
    	      			if(value1=="04"){
    	      				s4=value2;
    	      			}
    				}
    				
    				$("#Size1").html(s1);
      				$("#Size2").html(s2);
      				$("#Size3").html(s3);
      				$("#Size4").html(s4);
    				    				
    				var sizeDateoption={
    						tooltip : {
        				        trigger: 'item',
        				        formatter: "{a} <br/>{b} : {c} ({d}%)"
        				    },
        				    series : [
        				        {
        				            name: '任务规模',
        				            type: 'pie',
        				            radius : '75%',
        				            center: ['50%', '60%'],
        				            data:[
        				                {value:s1, name:'超大型'},
        				                {value:s2, name:'大型'},
        				                {value:s3, name:'中型'},
        				                {value:s4, name:'小型'}
        				            ],
        				            itemStyle: {
        				                emphasis: {
        				                    shadowBlur: 10,
        				                    shadowOffsetX: 0,
        				                    shadowColor: 'rgba(0, 0, 0, 0.5)'
        				                }
        				            }
        				        }
        				    ]
        				};
        		
    				size_echarts.setOption(sizeDateoption);   				
    			}    			      			     			
      		}    		        		
      	},DemandSizeCall);
      } 
       
    //查询完成计划分布
      
      function TaskCompletedScheduleDetail(){     	
      	
      //得到当前时间
    	var date =  getCurrentYMD();
    	var now=parseInt(date.substring(0,4));
    	
    	var TaskCompletedScheduleCall = getMillisecond();
    	baseAjaxJsonp(dev_report+"EConstruction/TaskCompletedScheduleDetail.asp?SID="+SID1+"&call="+TaskCompletedScheduleCall,null, function(data) {
    		if (data != undefined&&data!=null&&data.result==true) {

    			//得到后台数据
    			 var t= data.TaskCompletedScheduleDetail;
    			 
    			//各列合计
    		      	var line1=0;
    		      	var line2=0;
    		      	var line3=0;
    		      	var line4=0;
    		      	var line5=0;
    		      	var line6=0;
    		      	var line7=0;
    		      	var line8=0;
    		      	var line9=0;
    		      	
    		      	//存放往年合计
    		      	var z1=0;
    		      	var z2=0;
    		      	var z3=0;
    		      	var z4=0;
    		      	var z5=0;
    		      	var z6=0;
    		      	var z7=0;
    		      	var z8=0;
    		      	var z9=0;
    		      	var z10=0;
    			//第一条数据的年份
    		      	var zyear=parseInt(t[0].CREATE_TIME.substring(0,4));
    		      	
    			if(t != null && t.length > 0) {
    				
    				//每次加载清楚上次统计的数据（放在循环外）
                	$("tr[name='CompletedScheduleList']").remove();
        			for(var i = 0;i<t.length; i++) {
        				var b_name = t[i].CREATE_TIME;            				
        				var b_value1 = t[i].MANAGER_COUNT;
        				var b_value2 = t[i].KERNEL_COUNT;
        				var b_value3 = t[i].CARD_COUNT;
        				var b_value4 = t[i].MOBILEPHONE_COUNT;
        				var b_value5 = t[i].DATA_COUNT;
        				var b_value6 = t[i].CREDIT_COUNT;
        				var b_value7 = t[i].INTERMEDIATE_COUNT;
        				var b_value8 = t[i].EQUIPMENT_COUNT;
        				var b_value9 = t[i].TEST_COUNT;        				
        				            				
        				var year=parseInt(b_name.substring(0,4));
        				
        				if(year<=now)
        				{       				
        					line1=line1+b_value1;
        					line2=line2+b_value2;
        					line3=line3+b_value3;
        					line4=line4+b_value4;
        					line5=line5+b_value5;
        					line6=line6+b_value6;
        					line7=line7+b_value7;
        					line8=line8+b_value8;
        					line9=line9+b_value9;
        					           					               				
        					if(year==now){
        						
        	                	if(zyear!= now){
        	                		 z1=line1-b_value1;
        	        		      	 z2=line2-b_value2;
        	        		      	 z3=line3-b_value3;
        	        		      	 z4=line4-b_value4;
        	        		      	 z5=line5-b_value5;
        	        		      	 z6=line6-b_value6;
        	        		      	 z7=line7-b_value7;
        	        		      	 z8=line8-b_value8;
        	        		      	 z9=line9-b_value9;
        	        		      	 z10=z1+z2+z3+z4+z5+z6+z7+z8+z9;
            						//都加了今年的第一个月                    				        						                				
                    				appendCompletedScheduleTr("CompletedScheduleDetailTable","00","2016(含)前",z1,z2,z3,z4,z5,z6,z7,z8,z9,z10);
                    				zyear= now;
        	                	}else{
                    					//放今年的历月数据
                    				appendCompletedScheduleTr("CompletedScheduleDetailTable",i,b_name,b_value1,b_value2,
                    						b_value3,b_value4,b_value5,b_value6,b_value7,b_value8,b_value9,b_value1+b_value2+b_value3+b_value4+b_value5+b_value6+b_value7+b_value8+b_value9);
                    					
                    				}
        	                	}					
        				}
        				       				           			
        			}
        			//合计
        			appendCompletedScheduleTr("CompletedScheduleDetailTable","000","合计",line1+z1,line2+z2,
        			line3+z3,line4+z4,line5+z5,line6+z6,line7+z7,line8+z8,line9+z9,line1+line2+line3+line4+line5+line6+line7+line8+line9+z10);
        			
        		}

    		}       		
    		
    	},TaskCompletedScheduleCall);
      	
      }
      
      //增加列表行（循环调用）
      function appendCompletedScheduleTr(Table,ID,name,value1,value2,value3,value4,value5,value6,value7,value8,value9,value10){
      	var Obj = $("#"+Table);
      	var tr = "<tr name='CompletedScheduleList' id='cs"+ID+"'>" 
      				+"<th>"+name+"：</th>"
      				+"<td >" +value1+"</td>"
      				+"<td >" +value2+"</td>"
      				+"<td >" +value3+"</td>"
      				+"<td >" +value4+"</td>"
      				+"<td >" +value5+"</td>"
      				+"<td >" +value6+"</td>"
      				+"<td >" +value7+"</td>"
      				+"<td >" +value8+"</td>"
      				+"<td >" +value9+"</td>"
      				+"<td >" +value10+"</td>"
      			+"</tr>";
      	Obj.append(tr);       	
      }
      
      //增加列表行（循环调用）
      function appendPeriodicDataDetailTr(Table,ID,name,value1,value2,value3,value4,value5,value6,value7,value8,value9,value10){
      	var Obj = $("#"+Table);
      	var tr = "<tr name='PeriodicDataDetail' id='cs"+ID+"'>" 
      				+"<th>"+name+"：</th>"
      				+"<td >" +value1+"</td>"
      				+"<td >" +value2+"</td>"
      				+"<td >" +value3+"</td>"
      				+"<td >" +value4+"</td>"
      				+"<td >" +value5+"</td>"
      				+"<td >" +value6+"</td>"
      				+"<td >" +value7+"</td>"
      				+"<td >" +value8+"</td>"
      				+"<td >" +value9+"</td>"
      				+"<td >" +value10+"</td>"
      			+"</tr>";
      	Obj.append(tr);       	
      }
      
    //查询各阶段数量分布(共用appendCompletedScheduleTr因与上表同一页此表就不用移除方法注意ID+20避免重复)
      function TaskPeriodicDataDetail(){
      	
      	var TaskPeriodicDataDetailCall = getMillisecond();
      	//var stage=["管理系统","核心","卡与结算","手机网银","数据","信贷与风险","中间业务","自助设备"];
      	var name=["开发","测试","版本提交","生产变更","生产变更评审","紧急变更中","合计"];
      	
      	//列值
      	var line1=new Array();
      	var line2=new Array();
      	var line3=new Array();
      	var line4=new Array();
      	var line5=new Array();
      	var line6=new Array();
      	var line7=new Array();
      	var line8=new Array();
      	var line9=new Array();
      	var line10=new Array();
      	
      	
      	baseAjaxJsonp(dev_report+"EConstruction/TaskPeriodicDataDetail.asp?SID="+SID1+"&call="+TaskPeriodicDataDetailCall,null, function(data) {
      		if (data != undefined&&data!=null&&data.result==true) {

      			//得到后台数据（注意：此次SQL检索的行值未前台表的列值！）
      			 var t= data.TaskPeriodicDataDetail; 
      		      	
      			if(t != null && t.length > 0) {
      				
      			//累和其他
      		      	var otherline1=0;
      		      	var otherline2=0;
      		      	var otherline3=0;
      		      	var otherline4=0;
      		      	var otherline5=0;
      		      	var otherline6=0;
      		      	var otherline7=0;
      				
          			for(var i = 0;i<t.length; i++) {
          				          				
          				var p_name = t[i].ORGAN_NAME;            				
          				var p_value1 = t[i].DEVELOP_NUM;
          				var p_value2 = t[i].SIT_NUM;
          				var p_value3 = t[i].VERSIONS_NUM;
          				var p_value4 = t[i].PRODUCT_NUM;
          				var p_value5 = t[i].PRODUCT_APPROVE_NUM;
          				var p_value6 = t[i].INSTANCY_PRODUCT_NUM;
        				var p_value7 = t[i].TOTAL;
          						
          						switch (p_name){
          						case "管理系统":
          							line1=pushArray(p_value1,p_value2,p_value3,p_value4,p_value5,p_value6,p_value7);
          						break;
          						case "核心":
          							line2=pushArray(p_value1,p_value2,p_value3,p_value4,p_value5,p_value6,p_value7);
          						break;
          						case "卡与结算":
          							line3=pushArray(p_value1,p_value2,p_value3,p_value4,p_value5,p_value6,p_value7);
          						break;
          						case "手机网银":
          							line4=pushArray(p_value1,p_value2,p_value3,p_value4,p_value5,p_value6,p_value7);
          						break;
          						case "数据":
          							line5=pushArray(p_value1,p_value2,p_value3,p_value4,p_value5,p_value6,p_value7);
          						break;
          						case "信贷与风险":
          							line6=pushArray(p_value1,p_value2,p_value3,p_value4,p_value5,p_value6,p_value7);
          						break;
          						case "中间业务":
          							line7=pushArray(p_value1,p_value2,p_value3,p_value4,p_value5,p_value6,p_value7);
          						break;
          						case "自助设备":
          							line8=pushArray(p_value1,p_value2,p_value3,p_value4,p_value5,p_value6,p_value7);
              					break;
          						default:
          							otherline1=otherline1+p_value1;
          							otherline2=otherline2+p_value2;
          							otherline3=otherline3+p_value3;
          							otherline4=otherline4+p_value4;
          							otherline5=otherline5+p_value5;
          							otherline6=otherline6+p_value6;
          							otherline7=otherline7+p_value7;
          						}

          				            				         				       				           			
          			}
          			//得到其他
          			line9=pushArray(otherline1,otherline2,otherline3,otherline4,otherline5,otherline6,otherline7);
          			
          			var deleteNull=[line1,line2,line3,line4,line5,line6,line7,line8,line9];
          			for(var j=0;j<deleteNull.length;j++){
          				//判断这九列谁是空赋值“0”
          				if(deleteNull[j].length==0){
          					for(var q=0;q<7;q++){
          						deleteNull[j].push("0");
          					}
          				}
          			}
          			
          			//得到合计列
          			var t1=0;
          			var t2=0;
          			var t3=0;
          			var t4=0;
          			var t5=0;
          			var t6=0;
          			var t7=0;
          			
          			for(var k=0;k<deleteNull.length;k++){          				         				
          				t1=t1+parseInt(deleteNull[k][0]);
          				t2=t2+parseInt(deleteNull[k][1]);
          				t3=t3+parseInt(deleteNull[k][2]);
          				t4=t4+parseInt(deleteNull[k][3]);
          				t5=t5+parseInt(deleteNull[k][4]);
          				t6=t6+parseInt(deleteNull[k][5]);
          				t7=t7+parseInt(deleteNull[k][6]);
          			}
          			line10=pushArray(parseInt(t1),parseInt(t2),parseInt(t3),parseInt(t4),parseInt(t5),parseInt(t6),parseInt(t7));
          			
          			//每次加载清楚上次统计的数据（放在循环外）
                	$("tr[name='PeriodicDataDetail']").remove();
          			for(var h=0;h<7;h++){
          				appendPeriodicDataDetailTr("TaskPeriodicDataDetailTable",h+20,name[h],line1[h],line2[h],line3[h],line4[h],line5[h],line6[h],line7[h],line8[h],line9[h],line10[h]);	
          			}          			          			          			
          		}
      		}       		
      		
      	},TaskPeriodicDataDetailCall);
      }

		//数组赋值
		function pushArray(p_value1,p_value2,p_value3,p_value4,p_value5,p_value6,p_value7){	
			var array=new Array();
			array.push(p_value1);
			array.push(p_value2);
			array.push(p_value3);
			array.push(p_value4);
			array.push(p_value5);
			array.push(p_value6);
			array.push(p_value7);
			return array;
		} 
      
     //历月已完成任务生产变更质量
      
		function TaskProductDetail(){
			
			var TaskProductCall = getMillisecond();
			
			//时间轴
        	var time=new Array();
        	//投产数
        	var product=new Array();
        	//紧急投产
        	var instancy=new Array();
        	//百分数
        	var bf=new Array();
        	var bfx=new Array();
        	
	    	//等到当前时间
	      	var date =  getCurrentYMD();
	      	var now=parseInt(date.substring(0,4));
	      	
	      	var product_echarts = echarts.init(document.getElementById('product_detail'));
	      	
	      	$("#productDateTime").html("数据时间："+date);
	      
	      	baseAjaxJsonp(dev_report+"EConstruction/TaskProductDetail.asp?SID="+SID1+"&call="+TaskProductCall,null, function(data) {
        		if (data != undefined&&data!=null&&data.result==true) {

        			//得到后台数据
        			 var t= data.TaskProductDetail;
        			 
        			 //建临时变量用于往年的需求量总统计
        			 var temp1=0;
        			 var temp2=0;
        			 var temp3=0;
        			 
        			 //标志位
        			 var change=0;
        			 var tem=false;
        			if(t != null && t.length > 0) {
            			for(var i = 0;i<t.length; i++) {
            				var b_name = t[i].MON;            				
            				var b_value1 = t[i].TOTAL;
            				var b_value2 = t[i].INSTANCY;           				
            				            				
            				var year=parseInt(b_name.substring(0,4));
            					
            				if(!tem){
            						change=year;
            					}
            					
           				
            				if(year<=now)
            				{
      	        			  	tem=true; 
      	        			  temp1=year;
    	        			  temp2=temp2+b_value1;
    	        			  temp3=temp3+b_value2;
            					           					               				
            					if(year!=change){
            						            						
            							//都加了第二年的第一个月
                						time.push(change);                    				
                						product.push(temp2-b_value1);                    				
                						instancy.push(temp3-b_value2);                						
                        				
                        				temp1=year;
              	        			  	temp2=b_value1;
              	        			  	temp3=b_value2;
              	        			  
              	        			  	change=year;
              	        			  	tem=false;           						
                    				           	        			  
                    				}
            					
            					if(year==now){
            						//放今年的历月数据
                					time.push(b_name);                    				
            						product.push(b_value1);                    				
            						instancy.push(b_value2);
            					}
    							
            				}
            				            				           			
            			}
            			
            			//得到百分数
            			for(var k = 0;k<time.length; k++){
            				if(product[k]!=0){
            					bf[k]=(parseFloat(instancy[k]*100/product[k])).toFixed(2)+"%";
            					bfx[k]=(parseFloat(instancy[k]*100/product[k])).toFixed(2);
            				}else{
            					bf[k]=0;
            					bfx[k]=0;
            				}           				
            				
            			}
            			
            			
                    	//每次加载清楚上次统计的数据（放在循环外）
                    	$("tr[name='TaskProductDetailList']").remove();
                    	
                    	for(var j = 0;j<time.length; j++)
                    	{
                    		appendProductDetailTr("TaskProductDetilTable",j,time[j],product[j],instancy[j],bf[j]);
                    	}
                    	
            		}

                	var productdetailoption = {
                		    title: {
                		        text: '历月已完成任务生产变更质量表'
                		    }, 
                		    tooltip: {
                		        trigger: 'axis'
                		    },
                		    legend: {
                		        data:['紧急变更比率']
                		    },
                		    grid: {
                		        left: '3%',
                		        right: '4%',
                		        bottom: '3%',
                		        containLabel: true
                		    },
                		    toolbox: {
                		        feature: {
                		            saveAsImage: {}
                		        }
                		    },
                		    xAxis: {
                		        type: 'category',
                		        name:"年月",
                		        boundaryGap: false,
                		        axisLabel:{
                		        	rotate:-45
                		        	},
                		        data:time 
                		    },
                		    yAxis: {
                		        type: 'value',
                		        name:"%",
                		        max:100
                		    },
                		    series: [                		        
                		        {
                		            name:'紧急变更比率',
                		            type:'line',
                		            stack: '百分比',
                		            data:bfx
                		        }
                		    ]
                	};
      
                  	
                	product_echarts.setOption(productdetailoption);
        		}       		
        		
        	},TaskProductCall);
	      	
	      	
			
		}
      
	    //增加列表行（循环调用）
	      function appendProductDetailTr(Table,ID,name,value1,value2,value3){
	      	var Obj = $("#"+Table);
	      	var tr = "<tr name='TaskProductDetailList' id='tp"+ID+"'>" 
	      				+"<th>"+name+"：</th>"
	      				+"<td >" +value1+"</td>"
	      				+"<td >" +value2+"</td>"
	      				+"<td >" +value3+"</td>"
	      			+"</tr>";
	      	Obj.append(tr);
	      	
	      } 
          
     //各系统涉及任务数量排名 
      function TaskSystemDetail(){        	       	        	   
      	
      	var TaskSystemDetailCall = getMillisecond();
      	baseAjaxJsonp(dev_report+"EConstruction/TaskSystemDetail.asp?SID="+SID1+"&call="+TaskSystemDetailCall,null, function(data) {
      		if (data != undefined&&data!=null&&data.result==true) {

      			//得到后台数据
      			 var s= data.TaskSystemDetail;
     			 
      			if(s != null && s.length > 0) {
     				
      				//每次加载清楚上次统计的数据（放在循环外）
                  	$("tr[name='TaskSystemDetailList']").remove();
                  	
          			for(var i = 0;i<s.length; i++) {
          				
          				var b_value2 = s[i].SYSTEM_NAME;
          				var b_value3 = s[i].COUNTR;
          				
          				appendSystemDetailTr("TaskSystemDetailTable",i,i+1,b_value2,b_value3);         				
          			}
	
          		}
                	
      		}       		
      		
      	},TaskSystemDetailCall);
      	        	
      }
      
    //增加列表行（循环调用）
      function appendSystemDetailTr(Table,ID,name,value1,value2){
      	var Obj = $("#"+Table);
      	var tr = "<tr name='TaskSystemDetailList' id='ts"+ID+"'>" 
      				+"<th>"+name+"：</th>"
      				+"<td >" +value1+"</td>"
      				+"<td >" +value2+"</td>"
      			+"</tr>";
      	Obj.append(tr);
      	
      } 
        
   //**********************************************项目********* 
      //TODO
      /**
       * 首页图标渲染，改为供应商图表
       */
      function projectHealthView(){
      	var project_echarts = echarts.init(document.getElementById('Project_echarts'));
      	var date =  getCurrentYMD();
      	
      	var nameArr = ["问题项目","所有项目"];
      	var total =0;
		var risk= 0;
      	var Val=0;
      	
      	var ProjectCall = getMillisecond();
      	baseAjaxJsonp(dev_report + "EConstruction/queryProjectDetail.asp?call=" + ProjectCall+'&SID='+SID1 ,null, function(data) {
      		if (data != undefined&&data!=null&&data.result==true) {

          		var p = data.queryProjectDetail;
          		
          		if(	p!= null && p.length > 0) {
          			
          				total = p[0].TOTAL;
          				risk= p[0].RISK;
          				
          		};
          		
          		$("#projectTime").html("数据时间："+date+'&nbsp;&nbsp;项目数:'+total);
          		
          		Val=(parseFloat(risk/total)).toFixed(2);
          		
          			var ProjectOption = {
      					    tooltip: {
      			                formatter: "{a} <br/>{b} : {c}"
      			            },        		              
          					toolbox: {
          		                show: false,
          		                feature: {
          		                    mark: {
          		                        show: false
          		                    },
          		                    restore: {
          		                        show: false
          		                    },
          		                    saveAsImage: {
          		                        show: false
          		                    }
          		                }
          		            },
          		            series: [{
          		                name: '',
          		                type: 'gauge',
          		                z: 3,
          		                center : ['50%', '65%'],  
          		                radius: [0, '75%'],
          		                min: 0, // 最小值
                                max: 1, // 最大值
                                splitNumber:10, // 分割段数，默认为5
          		                detail: {
          		                    formatter: Val
          		                },
          		                data: [{value: Val, name: '健康指数'}],
          		                axisLine: { // 坐标轴线
          		                    show: true, // 默认显示，属性show控制显示与否
          		                    lineStyle: { // 属性lineStyle控制线条样式
          		                    	 color: [
          		                                  [Val, '#ff4500'],
          		                                  [0.999, 'skyblue'],
          		                                  [1, 'skyblue']
          		                              ],         		                    	
          		                        width: 30
          		                    }
          		                },
          		              axisLabel: { // 坐标轴文本标签，详见axis.axisLabel
      		                	show: false
          		              },
          		                pointer: { //指针
          	                        show: true,
          	                        //指针长度
          	                        length:'90%',
          	                        width:2
          	                    }          	              
                              }
          		            ]
          		        };
          			project_echarts.setOption(ProjectOption);
          	};
          	
      	},ProjectCall);
      	
      }

      /**
       * begin
       */
      //供应商人数图表(饼图)
      function supperNumView(){    	
      	var Project_echarts = echarts.init(document.getElementById('Project_echarts'));
      	var allName=new Array();
      	var date =  getCurrentYMD();
      	var dataArr = new Array();
      	var sum = 0;
      	var rCall = getMillisecond();
      	baseAjaxJsonp(dev_report + "EConstruction/querySupperNumList.asp?call=" + rCall+'&SID='+SID1 ,null, function(data) {
      		if (data != undefined&&data!=null&&data.result==true) {
          		var supperNumList = data.supperNumList;
          		var reqTotal = data.total;
          		if(supperNumList != null && supperNumList.length > 0) {
          			for(var i = 0 ; i <= supperNumList.length-1; i++) {
          				var value = supperNumList[i].SUPPER_NUM;            				
          				sum += supperNumList[i].SUPPER_NUM;
          				dataArr.push(value);
          				allName.push(supperNumList[i].SUP_SIMP_NAME);
          			}
          		}
          		$("#projectTime").html("数据时间："+date+'&nbsp;&nbsp;总需求:'+reqTotal);
          
          		var code1 = (dataArr[0]/reqTotal).toFixed(3);//占总数百分比
          		var code2 = (dataArr[1]/reqTotal).toFixed(3);
          		var code3 = (dataArr[2]/reqTotal).toFixed(3);
          		var code4 = (dataArr[3]/reqTotal).toFixed(3);
          		/*var code5 = (dataArr[4]/reqTotal).toFixed(3);*/
          		
          		if(code1 == "0.000"){
          			code1 = 0.001;
          		}
          		if(code2 == "0.000"){
          			code2 = 0.001;
          		}
          		if(code3 == "0.000"){
          			code3 = 0.001;
          		}
          		if(code4 == "0.000"){
          			code4 = 0.001;
          		}
          		/*if(code5 == "0.000"){
          			code5 = 0.001;
          		}*/
          		var color1 = parseFloat(code1).toFixed(3);
          		var color2 = (parseFloat(code1)+parseFloat(code2)).toFixed(3);
          		var color3 = (parseFloat(code3)+parseFloat(color2)).toFixed(3);
          		var color4 = (parseFloat(code4)+parseFloat(color3)).toFixed(3);
          		/*var color5 = (parseFloat(code5)+parseFloat(color4)).toFixed(3);*/
          		         		         		
          			var supperOption = {
          					
          					tooltip : {
          						trigger : 'item',
          						formatter : "{a} <br/>{b} : {c} ({d}%)"
          					},
          					
          					legend : {
          						orient : 'horizontal',            						
          						x : 'left',
          						padding :[20,30],
          						selectedMode : false,
          						itemWidth: 15,
          						itemHeight: 10,
          						data : allName
          					},
          					grid: { 
     		                     z:-1,    //grid作为柱状图的坐标系，其层级要和仪表图层级不同，同时隐藏
     		                     show:false,
     		                     left: '-30%',
     		                     right: '4%',
     		                     bottom: '3%',
     		                     containLabel: false,
     		                     borderWidth: 0,
     		                     splitLine:{
     		                         show: false    //隐藏分割线
     		                     },
     		                     axisLabel: {
 		                        	 show: false
 		                         },
     		                     axisLine: {
 		                             show: false
 		                         }
 		                         
     		                 },
     		                 xAxis : [   //这里有很多的show，必须都设置成不显示
     		                     {
     		                         type : 'category',
     		                         data : allName,
     		                         show:false,
     		                         axisLabel: {
     		                        	 show: false
     		                         },
     		                         axisLine: {
     		                             show: false
     		                         },
     		                         splitLine:{
     		                             show: false
     		                         },
     		                         axisTick: {
     		                        	 show: false
     		                         },
     		                         splitArea: {
     		                             show: false
     		                         }
     		                     }
     		                 ],
     		                 yAxis : [ //这里有很多的show，必须都设置成不显示
     		                     {
     		                    	 show:false,
     		                         type : 'value',
     		                         axisLine: {
     		                             show: false
     		                         },
     		                         axisLabel: {
     		                        	 show: false
     		                         },
     		                         axisTick: {
     		                        	 show: false
     		                         },
     		                         splitLine:{
     		                             show: false
     		                         }, splitArea: {
     		                             show: false
     		                         }
     		                     }
     		                 ],

          					toolbox: {
          		                show: false,
          		                feature: {
          		                    mark: {
          		                        show: false
          		                    },
          		                    restore: {
          		                        show: false
          		                    },
          		                    saveAsImage: {
          		                        show: false
          		                    }
          		                }
          		            }, 
          		            series: [{
          		                name: '总用户',
          		                type: 'gauge',
          		                z:3,
          		                center : ['50%', '65%'],  
          		                min: 0, // 最小值
                                  max: 100, // 最大值
                                  splitNumber: 10, // 分割段数，默认为5
          		                detail: {
          		                    formatter:reqTotal 
          		                },
          		                axisLine: { // 坐标轴线
          		                    show: true, // 默认显示，属性show控制显示与否
          		                    lineStyle: { // 属性lineStyle控制线条样式
          		                    	color:[//#B162D5蓝紫色   #F1F26F黄色 #C72986紫色#3373CC蓝色
          		                    	       [color1, 'orange'],[color2, 'lightgreen'],
          		                    	       [color3, '#B162D5'],[color4, '#F1F26F']
          		                    	       /*[color5, '#3373CC']*/
          		                    	      /* [1, '#C72986']*/],
          		                        width: 30
          		                    }
          		                },//TODO        		               
          		                axisLabel: { // 坐标轴文本标签，详见axis.axisLabel
          		                	show: true,
          		                	formatter: function(v) {
          		                		 /**
          		                		  * 间隔名称格式器：{string}（Template） | {Function}
          		                		  * {Function}，传递参数同模板变量：
											eg：function (value){return "星期" + "日一二三四五六".charAt(value);'}
          		                		  */
      		                          switch (v+"") {
		    		                          case '0' : 
				                                  return allName[0]+":"+dataArr[0]+"人";
      		                          	  case '20' : 
      		                          		  return allName[1]+":"+dataArr[1]+"人";
      		                          	/*  case '60' : 
      		                            	  return allName[4]+":"+dataArr[4]+"人";*/
      		                          	  case '70' : 
				                                  return allName[2]+":"+dataArr[2]+"人";
	       		                          	  case '90' : 	       		                               
	       		                                  return allName[3]+":"+dataArr[3]+"人";
      		                              default:
      		                            	  return '';
      		                          }
      		                       },
          		                    textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
          		                        color: '#666',
          		                        fontSize: 11
          		                    }
          		                },
          		                pointer: { //指针
          	                        show: false,
          	                        //指针长度
          	                        length:'90%',
          	                        width:0
          	                    },
          	                    data : [{
          	                        value: reqTotal,
          	                        name: ''
          	                    }]
                              },
                              {
                                  name: allName[0],
                                  type:'bar',
                                  barWidth: '60%',
                                  data:[0],
                                  itemStyle: {
                                      normal: {
                                          color: 'orange'  //这里的图例要注意，颜色设置和仪表盘的颜色对应起来
                                      }
                                  }
                              }, {
                                  name:allName[1],
                                  type:'bar',
                                  data:[0],
                                  itemStyle: {
                                      normal: {
                                          color: 'lightgreen'  //这里的图例要注意，颜色设置和仪表盘的颜色对应起来
                                      }
                                  }
                              }, {
                                  name:allName[2],
                                  type:'bar',
                                  data:[0],
                                  itemStyle: {
                                      normal: {
                                          color: '#B162D5'  //这里的图例要注意，颜色设置和仪表盘的颜色对应起来
                                      }
                                  }
                              }, {
                                  name:allName[3],
                                  type:'bar',
                                  data:[0],
                                  itemStyle: {
                                      normal: {
                                          color: '#F1F26F'  //这里的图例要注意，颜色设置和仪表盘的颜色对应起来
                                      }
                                  }
                              }
          		            ]
          		        };
          			Project_echarts.setOption(supperOption);
          	}
      		
      	},rCall);
      
      };	
      
      /**
       * end
       */
      /**
       * 测试缺陷统计首页图表----begin
       */
      function defectComponentView(){    	
        	var Defect_echarts = echarts.init(document.getElementById('Defect_echarts'));
          	var allName=new Array();
          	var date =  getCurrentYMD();
          	var dataArr = new Array();
          	var sum = 0;
          	var rCall = getMillisecond();
          	baseAjaxJsonp(dev_report + "EConstruction/queryDefectNumList.asp?call=" + rCall+'&SID='+SID1 ,null, function(data) {
          		if (data != undefined&&data!=null&&data.result==true) {
              		var defectNumList = data.defectNumList;
              		if(defectNumList != null && defectNumList.length > 0) {
              			for(var i = 0 ; i <= defectNumList.length-1; i++) {
              				var value = defectNumList[i].DEFECT_NUM;            				
              				sum += defectNumList[i].DEFECT_NUM;
              				dataArr.push(value);
              				allName.push(defectNumList[i].SYSTEM_NAME);
              			}
              		}             
              		var code1 = (dataArr[0]/sum).toFixed(3);//占总数百分比
              		var code2 = (dataArr[1]/sum).toFixed(3);
              		var code3 = (dataArr[2]/sum).toFixed(3);
              		var code4 = (dataArr[3]/sum).toFixed(3);
              		//var code5 = (dataArr[4]/sum).toFixed(3);
              		
              		if(code1 == "0.000"){
              			code1 = 0.001;
              		}
              		if(code2 == "0.000"){
              			code2 = 0.001;
              		}
              		if(code3 == "0.000"){
              			code3 = 0.001;
              		}
              		if(code4 == "0.000"){
              			code4 = 0.001;
              		}
              		/*if(code5 == "0.000"){
              			code5 = 0.001;
              		}*/
              		var color1 = parseFloat(code1).toFixed(3);
              		var color2 = (parseFloat(code1)+parseFloat(code2)).toFixed(3);
              		var color3 = (parseFloat(code3)+parseFloat(color2)).toFixed(3);
              		var color4 = (parseFloat(code4)+parseFloat(color3)).toFixed(3);
              		//var color5 = (parseFloat(code5)+parseFloat(color4)).toFixed(3);
              		         		         		
              			var defectOption = {
              					
              					tooltip : {
              						trigger : 'item',
              						formatter : "{a} <br/>{b} : {c} ({d}%)"
              					},
              					
              					legend : {
              						orient : 'horizontal',            						
              						x : 'left',
              						padding :[20,30],
              						selectedMode : false,
              						itemWidth: 15,
              						itemHeight: 10,
              						data : allName
              					},
              					grid: { 
         		                     z:-1,    //grid作为柱状图的坐标系，其层级要和仪表图层级不同，同时隐藏
         		                     show:false,
         		                     left: '-30%',
         		                     right: '4%',
         		                     bottom: '3%',
         		                     containLabel: false,
         		                     borderWidth: 0,
         		                     splitLine:{
         		                         show: false    //隐藏分割线
         		                     },
         		                     axisLabel: {
     		                        	 show: false
     		                         },
         		                     axisLine: {
     		                             show: false
     		                         }
     		                         
         		                 },
         		                 xAxis : [   //这里有很多的show，必须都设置成不显示
         		                     {
         		                         type : 'category',
         		                         data : allName,
         		                         show:false,
         		                         axisLabel: {
         		                        	 show: false
         		                         },
         		                         axisLine: {
         		                             show: false
         		                         },
         		                         splitLine:{
         		                             show: false
         		                         },
         		                         axisTick: {
         		                        	 show: false
         		                         },
         		                         splitArea: {
         		                             show: false
         		                         }
         		                     }
         		                 ],
         		                 yAxis : [ //这里有很多的show，必须都设置成不显示
         		                     {
         		                    	 show:false,
         		                         type : 'value',
         		                         axisLine: {
         		                             show: false
         		                         },
         		                         axisLabel: {
         		                        	 show: false
         		                         },
         		                         axisTick: {
         		                        	 show: false
         		                         },
         		                         splitLine:{
         		                             show: false
         		                         }, splitArea: {
         		                             show: false
         		                         }
         		                     }
         		                 ],

              					toolbox: {
              		                show: false,
              		                feature: {
              		                    mark: {
              		                        show: false
              		                    },
              		                    restore: {
              		                        show: false
              		                    },
              		                    saveAsImage: {
              		                        show: false
              		                    }
              		                }
              		            }, 
              		            series: [{
              		                name: '总缺陷',
              		                type: 'gauge',
              		                z:3,
              		                center : ['50%', '65%'],  
              		                min: 0, // 最小值
                                      max: 100, // 最大值
                                      splitNumber: 10, // 分割段数，默认为5
              		                detail: {
              		                    formatter:sum 
              		                },
              		                axisLine: { // 坐标轴线
              		                    show: true, // 默认显示，属性show控制显示与否
              		                    lineStyle: { // 属性lineStyle控制线条样式
              		                    	color:[//#B162D5蓝紫色   #F1F26F黄色 #C72986紫色#3373CC蓝色
              		                    	       [color1, 'orange'],[color2, 'lightgreen'],
              		                    	       [color3, '#B162D5'],[color4, '#F1F26F']
              		                    	       /*[color5, '#3373CC']*/
              		                    	      /* [1, '#C72986']*/],
              		                        width: 30
              		                    }
              		                },//TODO        		               
              		                axisLabel: { // 坐标轴文本标签，详见axis.axisLabel
              		                	show: true,
              		                	formatter: function(v) {
              		                		 /**
              		                		  * 间隔名称格式器：{string}（Template） | {Function}
              		                		  * {Function}，传递参数同模板变量：
    											eg：function (value){return "星期" + "日一二三四五六".charAt(value);'}
              		                		  */
          		                          switch (v+"") {
    		    		                          case '0' : 
    				                                  return allName[0]+":"+dataArr[0]+"个";
          		                          	  case '20' : 
          		                          		  return allName[1]+":"+dataArr[1]+"个";
          		                          	 /* case '60' : 
          		                            	  return allName[4]+":"+dataArr[4]+"人";*/
          		                          	  case '70' : 
    				                                  return allName[2]+":"+dataArr[2]+"个";
    	       		                          	  case '90' : 	       		                               
    	       		                                  return allName[3]+":"+dataArr[3]+"个";
          		                              default:
          		                            	  return '';
          		                          }
          		                       },
              		                    textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              		                        color: '#666',
              		                        fontSize: 11
              		                    }
              		                },
              		                pointer: { //指针
              	                        show: false,
              	                        //指针长度
              	                        length:'90%',
              	                        width:0
              	                    },
              	                    data : [{
              	                        value: sum,
              	                        name: ''
              	                    }]
                                  },
                                  {
                                      name: allName[0],
                                      type:'bar',
                                      barWidth: '60%',
                                      data:[0],
                                      itemStyle: {
                                          normal: {
                                              color: 'orange'  //这里的图例要注意，颜色设置和仪表盘的颜色对应起来
                                          }
                                      }
                                  }, {
                                      name:allName[1],
                                      type:'bar',
                                      data:[0],
                                      itemStyle: {
                                          normal: {
                                              color: 'lightgreen'  //这里的图例要注意，颜色设置和仪表盘的颜色对应起来
                                          }
                                      }
                                  }, {
                                      name:allName[2],
                                      type:'bar',
                                      data:[0],
                                      itemStyle: {
                                          normal: {
                                              color: '#B162D5'  //这里的图例要注意，颜色设置和仪表盘的颜色对应起来
                                          }
                                      }
                                  }, {
                                      name:allName[3],
                                      type:'bar',
                                      data:[0],
                                      itemStyle: {
                                          normal: {
                                              color: '#F1F26F'  //这里的图例要注意，颜色设置和仪表盘的颜色对应起来
                                          }
                                      }
                                  }
              		            ]
              		        };
              			Defect_echarts.setOption(defectOption);
              	}
          		
          	},rCall);
          
          };
      	//查询应用缺陷数量
        	function initDefectTable(sup_name){
        		var queryParams=function(params){
        			var temp={
        					limit: params.limit, //页面大小
        					offset: params.offset //页码
        			};
        			return temp;
        		};
          	var url="";
          	
          	if (sup_name != undefined&&sup_name!=null) {
          		 url=dev_report+"EConstruction/queryDefectInfoTable.asp?SID="+SID1+"&SUP_NAME="+sup_name+"&YEARS="+years+"&call="+ProjectDetailCall;	 		
          	}else{
          		 url=dev_report+"EConstruction/queryDefectInfoTable.asp?SID="+SID1+"&call="+ProjectDetailCall;	 		
          	}
          	
        		$("#DefectIndexTable").bootstrapTable({
        			url : url,
        			method : 'get', //请求方式（*）   
        			striped : false, //是否显示行间隔色
        			cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        			sortable : true, //是否启用排序
        			sortOrder : "asc", //排序方式
        			queryParams : queryParams,//传递参数（*）
        			sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
        			pagination : true, //是否显示分页（*）
        			pageList : [5,10,15],//每页的记录行数（*）
        			pageNumber : 1, //初始化加载第一页，默认第一页
        			pageSize : 10,//可供选择的每页的行数（*）
        			clickToSelect : true, //是否启用点击选中行
        			uniqueId : "SYSTEM_NAME", //每一行的唯一标识，一般为主键列
        			cardView : false, //是否显示详细视图
        			detailView : false, //是否显示父子表
        			jsonpCallback:ProjectDetailCall,
        			singleSelect: true,
        			onLoadSuccess : function(data){
        				gaveInfo();
        			},
        			columns : [{
        				field : "SYSTEM_NAME",
        				title : "应用名称",
        				align : "center",
        				width : "40%"/*,
        				formatter: function (value, row, index) {
        					return '<span class="hover-view" onclick="initProjectHealthIndex(\''+row.SUP_NUM+'\')">'+value+'</span>';
        				}*/
        			}, {
        				field : "SIT_NUM",
        				title : "SIT数量",
        				align : "center",
        				width : "20%"
        			}, {
        				field : "UAT_NUM",
        				title : "UAT数量",
        				align : "center",
        				width : "20%" 				
        			}, {
        				field : "SIT_NUM+UAT_NUM",
        				title : "总数",
        				align : "center",
        				width : "20%",
        				formatter: function (value, row, index) {
        					return row.SIT_NUM+row.UAT_NUM;
        				}
        			}]
        		},ProjectDetailCall);
        		
        	}
        	//缺陷的柱状图
            function DefectComponentDetail(){
            	
            	var defect_detail = echarts.init(document.getElementById('defect_detail'));
            	 
            	//应用名称的集合
            	var system_name=new Array();
            	//SIT分布
            	var SIT=new Array();
            	//UAT分布
            	var UAT=new Array();
            	//SIT和UAT数
            	var b_num=0;
            	var nb_num=0;
            	var num=0;

            	//SIT分布数据
            	var d_new_SIT=new Array();
            	//UAT分布数据
            	var d_new_UAT=new Array();
            	
            	var defectDetailCall = getMillisecond();
            	baseAjaxJsonp(dev_report+"EConstruction/queryDefectComponentDetail.asp?SID="+SID1+"&call="+defectDetailCall,null, function(data) {
            		if (data != undefined&&data!=null&&data.result==true) {
            			//后台传来的数组，分别为6和2
            			var SITDetail = data.SITDetail;
            			var UATDetail = data.UATDetail;       			
            			var systemDetail = data.systemDetail;
            			
            			if(SITDetail != null && SITDetail.length > 0) {
                			for(var i = 0;i<SITDetail.length; i++) {
                				var b_name = SITDetail[i].SYSTEM_NAME;            				
                				var b_value = SITDetail[i].DEFECT_NUM;
                				var b_arr = {"value":b_value,"name":b_name};            				            				
                				SIT.push(b_arr);
                				b_num=b_num+b_value;
                			}
                		}        			
            			
            			if(UATDetail != null && UATDetail.length > 0) {
                			for(var i = 0;i<UATDetail.length; i++) {
                				var b_name = UATDetail[i].SYSTEM_NAME;            				
                				var b_value = UATDetail[i].DEFECT_NUM;
                				var b_arr = {"value":b_value,"name":b_name};                    				
                				UAT.push(b_arr);
                				nb_num=nb_num+b_value;            				
                			}
                		}
            			
            			if(systemDetail != null && systemDetail.length > 0) {
            				var b_name ='';
            				var temp1=false;
            				var temp2=false;

                			for(var i = 0;i<systemDetail.length; i++) {
                				b_name = systemDetail[i].SYSTEM_NAME;            				
                				system_name.push(b_name);
                				for(var j = 0;j<UAT.length; j++) {
                					if (UAT[j].name==b_name){
                						temp1=true;
                						d_new_UAT.push(UAT[j].value);
                						break;
                					}else{
                						temp1=false;
                						continue;
                					}
                					
                				}
                				
                				if(!temp1){
                					d_new_UAT.push(0);
                				}
                				
                				for(var k = 0;k<SIT.length; k++) {
                					if (SIT[k].name==b_name){
                						temp2=true;
                						d_new_SIT.push(SIT[k].value);
                						break;
                					}else{
                						temp2=false;
                						continue;
                					}
                					
                				}
                				
                				if(!temp2){
                					d_new_SIT.push(0);               					
                				}
                				
                			}

                		} 
            			
            			num=b_num+nb_num;            			
                    	var defectdetailoption = {
                   			 title : {
                    		        text: '缺陷分布',
                    		        subtext: 'SIT/UAT分布情况'
                    		    },
                    		    tooltip : {
                    		        trigger: 'axis'
                    		    },
                    		    legend: {
                    		        data:["SIT","UAT"]
                    		    },
                    		    toolbox: {
                    		        show : true,
                    		        feature : {
                    		            dataView : {show: true, readOnly: false},
                    		            magicType : {show: true, type: ['line', 'bar']},
                    		            restore : {show: true},
                    		            saveAsImage : {show: true}
                    		        }
                    		    },
                    		    calculable : true,
                    		    xAxis : [
                    		        {
                    		        	name :'所属应用',
                    		            type : 'category',
                    		            axisTick:{
                    		            	alignWithLabel:true,
                    		            	interval:0
                    		            	},
           		                        axisLabel:{
           		                        	rotate: -45,
           		                        	textStyle:{
           		                        		fontSize:10,
           		                        		baseline:'top'}
        		                         },
                    		            data : system_name
                    		        }
                    		    ],
                    		    yAxis : [
                    		        {
                    		            type : 'value'
                    		        }
                    		    ],
                    		    series : [
                    		        {
                    		            name:'SIT',
                    		            type:'bar',
                    		            data:d_new_SIT,
                    		            markPoint : {                    		            
                    		                data : [
                    		                    {type : 'max', name: '最大值'},
                    		                    {type : 'min', name: '最小值'}
                    		                ]
                    		            }
                    		           /* markLine : {
                    		                data : [
                    		                    {type : 'average', name: '平均值'}
                    		                ]
                    		            }*/
                    		        },
                    		        {
                    		            name:'UAT',
                    		            type:'bar',
                    		            data:d_new_UAT,
                    		            markPoint : {
                    		                data : [
                    		                    {type : 'max', name: '最大值'},
                    		                    {type : 'min', name: '最小值'}
                    		                ]
                    		            }/*,
                    		            markLine : {
                    		                data : [
                    		                    {type : 'average', name : '平均值'}
                    		                ]
                    		            }*/
                    		        }]
                   		};
                   	
                   	defect_detail.setOption(defectdetailoption);
            			
            			}
            		},defectDetailCall);
            	
            }
            
          	//刷新缺陷列表
          	function refreshDefectTable(system_name){
          		system_name=escape(encodeURIComponent(system_name));
          		$("#DefectIndexTable").bootstrapTable('refresh',
        				{url:dev_report+"EConstruction/queryDefectInfoTable.asp?SID="+SID1+"&SYSTEM_NAME="+system_name+"&call="+ProjectDetailCall});          		
          	
          	}
      /**
       * 测试缺陷统计首页图表----end
       */
     
    //公用
      var ProjectDetailCall =getMillisecond();             
      
  	//查询供应商人数列表
  	function initProjectTable(sup_name,years){
  		var queryParams=function(params){
  			var temp={
  					limit: params.limit, //页面大小
  					offset: params.offset //页码
  			};
  			return temp;
  		};
    	var y=parseInt( getCurrentYMD().substring(0,4));
    	var url="";
    	if(years==" " ||years==""|| years==undefined){years=y;}
    	
    	if (sup_name != undefined&&sup_name!=null) {
    		 url=dev_report+"EConstruction/querySuppuerInfoTable.asp?SID="+SID1+"&SUP_NAME="+sup_name+"&YEARS="+years+"&call="+ProjectDetailCall;	 		
    	}else{
    		 url=dev_report+"EConstruction/querySuppuerInfoTable.asp?SID="+SID1+"&YEARS="+years+"&call="+ProjectDetailCall;	 		
    	}
    	
  		$("#ProjectHealthIndexTable").bootstrapTable({
  			url : url,
  			method : 'get', //请求方式（*）   
  			striped : false, //是否显示行间隔色
  			cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
  			sortable : true, //是否启用排序
  			sortOrder : "asc", //排序方式
  			queryParams : queryParams,//传递参数（*）
  			sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
  			pagination : false, //是否显示分页（*）
  			pageList : [5,10,15],//每页的记录行数（*）
  			pageNumber : 1, //初始化加载第一页，默认第一页
  			pageSize : 10,//可供选择的每页的行数（*）
  			clickToSelect : true, //是否启用点击选中行
  			uniqueId : "SUP_NUM", //每一行的唯一标识，一般为主键列
  			cardView : false, //是否显示详细视图
  			detailView : false, //是否显示父子表
  			jsonpCallback:ProjectDetailCall,
  			singleSelect: true,
  			onLoadSuccess : function(data){
  				gaveInfo();
  			},
  			columns : [{
  				field : "SUP_NAME",
  				title : "供应商名称",
  				align : "center",
  				width : "40%",//TODO
  				//点击事件，将id传递给折线图，哈哈哈哈，6666
  				formatter: function (value, row, index) {
  					return '<span class="hover-view" onclick="initProjectHealthIndex(\''+row.SUP_NUM+'\')">'+value+'</span>';
  				}
  			}, {
  				field : "NO_PROJECT_TASK_NUM",
  				title : "非项目",
  				align : "center",
  				width : "20%"
  			}, {
  				field : "PROJECT_TASK_NUM",
  				title : "包项目",
  				align : "center",
  				width : "20%" 				
  			}, {
  				field : "OTHERS_NUM",
  				title : "其他",
  				align : "center",
  				width : "20%"
  			}]
  		},ProjectDetailCall);
  		
  	}
  	//刷新健康指数表
  	function refreshProjectTable(sup_name,years){
    	var y=parseInt(getCurrentYMD().substring(0,4));
    	if(years==" " ||years=="" ){years=y;}
    	sup_name=escape(encodeURIComponent(sup_name));
  		$("#ProjectHealthIndexTable").bootstrapTable('refresh',
				{url:dev_report+"EConstruction/querySuppuerInfoTable.asp?SID="+SID1+"&SUP_NAME="+sup_name+"&YEARS="+years+"&call="+ProjectDetailCall});
  		
  		//隐藏项目列表
  		//$("#RiskProjectListDiv").hide();
  	
  	}
  	//公用
		var ProjectListCall =getMillisecond();
		
  	//打开有问题项目列表
  	function opeanProjectDetail(org_code){
  		
  		$("#RiskProjectListDiv").hide();
  		$(".manageView_tab3Sub").show();
  		
  		var params={"ORG_CODE":org_code};
  		$("#RiskProjectListTable").bootstrapTable('refresh',
				{url:dev_report+"EConstruction/queryProjectList.asp?SID="+SID1+"&ORG_CODE="+org_code+"&call="+ProjectListCall+'&'+params});
  	}
      

    //右侧折线图渲染：根据供应商id查询每月在场人数
  	//TODO
  	//更改查询表，从考勤表中取数据，同时要取得供应商简称
    function initProjectHealthIndex(sup_num,years){   
  	var project_echarts = echarts.init(document.getElementById('HealthIndex_detail'));
    	var ProjectHealthIndexCall=getMillisecond();
    	//折线图
    	var Arr1=new Array();
    	var Arr2=new Array();
    	var time=["1","2","3","4","5","6","7","8","9","10","11","12"];
    	var url="";
    	//y--->取得当前年份值
    	var y=parseInt(getCurrentYMD().substring(0,4));
  	if(years==" " ||years==""||years==undefined){years=y;}
  	if($("#Healthyears").val()!=" "&&$("#Healthyears").val()!=""&&$("#Healthyears").val()!=undefined){
		years=$("#Healthyears").val();
	}
    	if(sup_num==""){
    			url=dev_report+"EConstruction/querySupperManByYears.asp?SID="+SID1+"&YEARS="+years+"&call="+ProjectHealthIndexCall;
    	}else{
    			url=dev_report+"EConstruction/querySupperManByYears.asp?SID="+SID1+"&SUP_NUM="+sup_num+"&YEARS="+years+"&call="+ProjectHealthIndexCall;	
    		}
    	baseAjaxJsonp(url,null,function(data){
      		if (data != undefined&&data!=null&&data.result==true){
      			var title="驻场人数趋势";
      			//得到后台数据
      			var r= data.querySupperNumMonthly;
      			if( r[0].SUP_SIMP_NAME != undefined&& r[0].SUP_SIMP_NAME!=null){
      				title = r[0].SUP_SIMP_NAME+"驻场人数趋势";
      			}
      			 
      			
      			if(r != null && r.length > 0) {
          			for(var j = 0;j<r.length; j++) {
          				var value6 = r[j].MONTH;//月份，值的格式--2018-01
          				var supper_man_num = r[j].MONTHLY_NUM;//在场总人数	
          				var str=value6+"";
          				var mon=parseInt(str.substring(str.length-1));//月份
          				var ye=parseInt(str.substring(0,4));//年份          				
          				var ar={"mon":mon,"value":supper_man_num,"year":ye};
          				Arr1.push(ar);	         				
          			}
          			//制作时间表(后台数据升序排列)
          			var YearsArr=new Array();
          			var pace=Arr1[r.length-1].year-Arr1[0].year;
          			var start=parseInt(Arr1[0].year);
          			for(var d = 0;d<=pace; d++){
          				YearsArr.push(start+d);
          			}
          			
          			//每次加载清楚上次统计的数据（放在循环外）
                  	$("option[name='ProjectHealthDetailList']").remove();
          			for(var s = 0;s<YearsArr.length; s++) {
          				appendHealthDetailOption("Healthyears",YearsArr[s]);
          			}
          		}  			  			
      			
      			//赋值折线表
      			
      			/**
      			 * time是从1到12月
      			 * arr1是从后台取到的数据，mon是月份
      			 */
  				for(var k = 0;k<time.length; k++){
  					var flag=true;
  					for(var g = 0;g<Arr1.length; g++){
  						
  						if(time[k]==Arr1[g].mon){
              					Arr2.push(Arr1[g].value);
              				flag=false;
              				break;
  						}
  					}
  					if(flag){
  						if(k<new Date().getMonth()){
  							Arr2.push("0");
  						}  							 						
  					}
  				}
					
			
               	var projectdetailoption = {
            		    title: {
            		        text: years+"年"+title,
            		        left:'center'
            		    },             		   
            		    tooltip : {
      						trigger : 'axis',
      						formatter : years+"年{b}月驻场人数 :</br> {c}人"
      					},
            		    legend: {
            		        data:['在场人数']
            		    },
            		    grid: {
            		        left: '3%',
            		        right: '4%',
            		        bottom: '3%',
            		        containLabel: true
            		    },
            		    toolbox: {
            		        feature: {
            		            saveAsImage: {}
            		        }
            		    },
            		    xAxis: {
            		        type: 'category',
            		        name:"月份",
            		        boundaryGap: false,
            		        data:time 
            		    },
            		    yAxis: {
            		        type: 'value',
            		       /* splitNumber: 5,
            		        minInterval: 10,
            		        min:0,
            		        max:50*/
            		    },
            		    series: [
            		        {
            		            name:'在场人数',
            		            type:'line',
            		            stack: '小数',
            		            data:Arr2
            		        }
            		    ]
            	};
              	
               	project_echarts.setOption(projectdetailoption);
      			
      		}       		
      	},ProjectHealthIndexCall);
    }
      //后台同步数据年份
      	function appendHealthDetailOption(Select,years){
	      	var Obj = $("#"+Select);
	      	var option = "<option name='ProjectHealthDetailList' value="+years+">"+years+"</option>";
	      	Obj.append(option);
	      	
	     }
      	
      	//初始化项目列表
      	function initProjectListTable(org_code){
      		
      		var queryParams=function(params){
      			var temp={
      					limit: params.limit, //页面大小
      					offset: params.offset //页码
      			};
      			return temp;
      		};     		
      		
      		$("#RiskProjectListTable").bootstrapTable({
      			url : dev_report+"EConstruction/queryProjectList.asp?SID="+SID1+"&ORG_CODE="+org_code+"&call="+ProjectListCall,
      			method : 'get', //请求方式（*）   
      			striped : false, //是否显示行间隔色
      			cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
      			sortable : true, //是否启用排序
      			sortOrder : "asc", //排序方式
      			queryParams : queryParams,//传递参数（*）
      			sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
      			pagination : false, //是否显示分页（*）
      			pageList : [5,10,15],//每页的记录行数（*）
      			pageNumber : 1, //初始化加载第一页，默认第一页
      			pageSize : 10,//可供选择的每页的行数（*）
      			clickToSelect : true, //是否启用点击选中行
      			uniqueId : "PROJECT_ID", //每一行的唯一标识，一般为主键列
      			cardView : false, //是否显示详细视图
      			detailView : false, //是否显示父子表
      			jsonpCallback:ProjectListCall,
      			singleSelect: true,
      			onLoadSuccess : function(data){
      				gaveInfo();
      			},
      			columns : [{
      				field : "PROJECT_NAME",
      				title : "项目名称",
      				align : "center",
      				width : "50%",
      				formatter: function (value, row, index) {
      					
      					return '<span class="hover-view" onclick="opeanProjectPie(\''+row.PROJECT_ID+'\')">'+value+'</span>';
      				}
      			}, {
      				field : "STATUS",
      				title : "项目状态",
      				align : "center",
      				width : "25%"
      			}, {
      				field : "PROJECT_MAN",
      				title : "项目经理",
      				align : "center",
      				width : "25%"
      			}]
      		},ProjectListCall);
      	}
      	
      	//公用
      	var ProjectRiskTraceCall=getMillisecond();
      	
      	//打开有问题项目列表
      	function opeanProjectPie(project_id){
      		$("#homeThree").removeClass("active");
      		$("li[name='la']").removeClass("active");
      		$("#tabThree3").addClass("active");
      		$("li[name='lb']").addClass("active");
      		$("#ProjectPieDiv").hide();
      		$("#PieTableDiv").show();
      		$("li[name='lb']").show();
      		//打开饼图和进度跟踪表
      		queryProjectMilestone(project_id);
      		//初始化风险问题表
      		initProjectHealthTable(project_id);
      		//刷新
      		var params={"PROJECT_ID":project_id};
      		$("#RiskDetailListTable").bootstrapTable('refresh',
    				{url:dev_report+"EConstruction/queryProjectRiskTrace.asp?SID="+SID1+"&PROJECT_ID="+project_id+"&call="+ProjectRiskTraceCall+'&'+params});
      	}
      	
      	
      	
      	
      //查询任务规模分布
        
        function  queryProjectMilestone(project_id){
      	  
      	 var ProjectMilestoneCall = getMillisecond();
      	//等到当前时间
        	var date =  getCurrentYMD();
        	var dataArr=new Array();
        	var project_echarts = echarts.init(document.getElementById('projectPie_detail'));
        	
        	$("#").html("数据时间："+date);
        	
        	baseAjaxJsonp(dev_report+"EConstruction/queryProjectMilestone.asp?SID="+SID1+"&PROJECT_ID="+project_id+"&call="+ProjectMilestoneCall,null, function(data) {
        		if (data != undefined&&data!=null&&data.result==true) {
        			
        			var p= data.queryProjectMilestone;        			
        			var t= data.queryProjectPie;
        			var s= data.queryMilestoneDeviation;
        			
        			if(p != null && p.length > 0){
        				for(var j=0;j<p.length;j++){
        					
          					var value1=p[j].MILESTONE_TYPE_NAME;
          					var value2=p[j].DAYS;
          					var value4=p[j].SPI;
          					var arr ={"MILESTONE_TYPE_NAME":value1,"DAYS":value2,"SPI":parseFloat(value4).toFixed(2)};
          					dataArr.push(arr);   					
          					
          	      			}
        				
        				$("#nowMilestone").html(dataArr[p.length-1].MILESTONE_TYPE_NAME);
      					$("#deviationDays").html(dataArr[p.length-1].DAYS);
      					$("#SPI").html(dataArr[p.length-1].SPI);
        				
          				}else{
          					
          					$("#nowMilestone").html("-");
          					/*$("#deviationDays").html(s[0].SYS);*/
          					$("#deviationDays").html("-");
          					$("#SPI").html("-");
          				}
        			
        			//存放值	
        			var s1=0;
	      			var s2=0;
	      			var s3=0;
	      			var s4=0;
      			     			     			
        			if(t != null && t.length > 0){
        				
      				for(var i=0;i<t.length;i++){
      					
      					var value1=t[i].PONDERANCE_CODE;
      					var value2=t[i].NUM;
      					
      	      			if(value1=="01"){
      	      				s1=s1+parseInt(value2);
      	      			}
      	      			if(value1=="02"){
      	      				s2=s2+parseInt(value2);
      	      			}
      	      			if(value1=="03"){
      	      				s3=s3+parseInt(value2);
      	      			}
      	      			if(value1=="04"){
      	      				s4=s4+parseInt(value2);
      	      			}
      				}      				
      				    				
      				var projectoption={
      						title: {
                  		        text: '风险问题跟踪'
                  		    },
      						tooltip : {
          				        trigger: 'item',
          				        formatter: "{a} <br/>{b} : {c} ({d}%)"
          				    },
          				    series : [
          				        {
          				            name: '风险问题跟踪',
          				            type: 'pie',
          				            radius : '75%',
          				            center: ['50%', '60%'],
          				            data:[
          				                {value:s1, name:'严重'},
          				                {value:s2, name:'高'},
          				                {value:s3, name:'中'},
          				                {value:s4, name:'低'}
          				            ],
          				            itemStyle: {
          				                emphasis: {
          				                    shadowBlur: 10,
          				                    shadowOffsetX: 0,
          				                    shadowColor: 'rgba(0, 0, 0, 0.5)'
          				                }
          				            }
          				        }
          				    ]
          				};
          		
      				project_echarts.setOption(projectoption);   				
        			}    			      			     			
        		}    		        		
        	},ProjectMilestoneCall);
        } 
      	
      function Pieonclick(){
    		$("#ProjectPieDiv").show();
      }	
            

		
    	//查询项目群范围
      function initProjectHealthTable(project_id){ 		
    		var queryParams=function(params){
    			var temp={
    					limit: params.limit, //页面大小
    					offset: params.offset //页码
    			};
    			return temp;
    		};    		
   		
    		$("#RiskDetailListTable").bootstrapTable({
    			url : dev_report+"EConstruction/queryProjectRiskTrace.asp?SID="+SID1+"&PROJECT_ID="+project_id+"&call="+ProjectRiskTraceCall,
    			method : 'get', //请求方式（*）   
    			striped : false, //是否显示行间隔色
    			cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
    			sortable : true, //是否启用排序
    			sortOrder : "asc", //排序方式
    			queryParams : queryParams,//传递参数（*）
    			sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
    			pagination : false, //是否显示分页（*）
    			pageList : [5,10,15],//每页的记录行数（*）
    			pageNumber : 1, //初始化加载第一页，默认第一页
    			pageSize : 10,//可供选择的每页的行数（*）
    			clickToSelect : true, //是否启用点击选中行
    			uniqueId : "ORG_CODE", //每一行的唯一标识，一般为主键列
    			cardView : false, //是否显示详细视图
    			detailView : false, //是否显示父子表
    			jsonpCallback:ProjectRiskTraceCall,
    			singleSelect: true,
    			onLoadSuccess : function(data){
    				gaveInfo();
    			},
    			columns : [{
    				field : "RISK_NAME",
    				title : "风险问题名称",
    				align : "center",
    				width : "60%"
    			}, {
    				field : "FIRST_CLASSIFY",
    				title : "问题分类",
    				align : "center",
    				width : "20%"
    			}, {
    				field : "RISK_STATUS",
    				title : "问题状态",
    				align : "center",
    				width : "20%"
    			}]
    		},ProjectRiskTraceCall);
    		
    	}
      	
      	
      	
   /*     // 资源
        var option = {
            tooltip: {
                formatter: "{a} <br/>{b} : {c}%"
            },
            toolbox: {
                show: true,
                feature: {
                    mark: {
                        show: false
                    },
                    restore: {
                        show: false
                    },
                    saveAsImage: {
                        show: false
                    }
                }
            },
            series: [{
                name: '业务指标',
                type: 'gauge',
                detail: {
                    formatter: '{value}%'
                },
                axisLine: { // 坐标轴线
                    show: true, // 默认显示，属性show控制显示与否
                    lineStyle: { // 属性lineStyle控制线条样式
                        color: [
                            [0.2, 'lightgreen'],
                            [0.8, 'skyblue'],
                            [1, '#ff4500']
                        ],
                        width: 30
                    }
                },
                axisLabel: { // 坐标轴文本标签，详见axis.axisLabel
                    show: true,
                    formatter: function(v) {
                        switch (v + '') {
                            case '10':
                                return '已投入';
                            case '30':
                                return '已占用';
                            case '90':
                                return '剩余';
                            default:
                                return '';
                        }
                    },
                    textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        color: '#666',
                        fontSize: 12
                    }
                },
                data: [{
                    value: 80,
                    name: ''
                }]
            }]
        };
        // 为echarts对象加载数据 
        resource_echarts.setOption(option);

        // 预算
        var option = {
            tooltip: {
                formatter: "{a} <br/>{b} : {c}%"
            },
            toolbox: {
                show: true,
                feature: {
                    mark: {
                        show: false
                    },
                    restore: {
                        show: false
                    },
                    saveAsImage: {
                        show: false
                    }
                }
            },
            series: [{
                name: '业务指标',
                type: 'gauge',
                detail: {
                    formatter: '{value}亿'
                },
                data: [{
                    value: 2,
                    name: ''
                }]
            }]
        };
        
        // 为echarts对象加载数据 
        budget_echarts.setOption(option);
        // 年度任务
        var option = {
            tooltip: {
                formatter: "{a} <br/>{b} : {c}%"
            },
            toolbox: {
                show: true,
                feature: {
                    mark: {
                        show: false
                    },
                    restore: {
                        show: false
                    },
                    saveAsImage: {
                        show: false
                    }
                }
            },
            series: [{
                name: '',
                type: 'gauge',
                center: ['50%', '50%'], // 默认全局居中
                radius: [0, '75%'],
                startAngle: 140,
                endAngle: -140,
                min: 0, // 最小值
                max: 100, // 最大值
                precision: 0, // 小数精度，默认为0，无小数点
                splitNumber: 10, // 分割段数，默认为5
                axisLine: { // 坐标轴线
                    show: true, // 默认显示，属性show控制显示与否
                    lineStyle: { // 属性lineStyle控制线条样式
                        color: [
                            [0.2, 'lightgreen'],
                            [0.4, 'orange'],
                            [0.7, 'skyblue'],
                            [1, '#ff4500']
                        ],
                        width: 30
                    }
                },
                axisTick: { // 坐标轴小标记
                    show: true, // 属性show控制显示与否，默认不显示
                    splitNumber: 5, // 每份split细分多少段
                    length: 8, // 属性length控制线长
                    lineStyle: { // 属性lineStyle控制线条样式
                        color: '#eee',
                        width: 1,
                        type: 'solid'
                    }
                },
                axisLabel: { // 坐标轴文本标签，详见axis.axisLabel
                    show: true,
                    formatter: function(v) {
                        switch (v + '') {
                            case '10':
                                return '弱';
                            case '30':
                                return '低';
                            case '60':
                                return '中';
                            case '90':
                                return '高';
                            default:
                                return '';
                        }
                    },
                    textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        color: '#333'
                    }
                },
                splitLine: { // 分隔线
                    show: true, // 默认显示，属性show控制显示与否
                    length: 30, // 属性length控制线长
                    lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
                        color: '#eee',
                        width: 2,
                        type: 'solid'
                    }
                },
                pointer: {
                    length: '80%',
                    width: 8,
                    color: 'auto'
                },
                title: {
                    show: true,
                    offsetCenter: ['-65%', -10], // x, y，单位px
                    textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        color: '#333',
                        fontSize: 15
                    }
                },
                detail: {
                    show: true,
                    backgroundColor: 'rgba(0,0,0,0)',
                    borderWidth: 0,
                    borderColor: '#ccc',
                    width: 100,
                    height: 40,
                    offsetCenter: ['-60%', 10], // x, y，单位px
                    formatter: '{value}%',
                    textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        color: 'auto',
                        fontSize: 30
                    }
                },
                data: [{
                    value: 83,
                    name: '完成率'
                }]
            }]
        };
        // 为echarts对象加载数据 
        annual_echarts.setOption(option);

        // 开发效率
        var option = {
            tooltip: {
                formatter: "{a} <br/>{b} : {c}"
            },
            toolbox: {
                show: true,
                feature: {
                    mark: {
                        show: false
                    },
                    restore: {
                        show: false
                    },
                    saveAsImage: {
                        show: false
                    }
                }
            },
            series: [{
                name: '开发效率',
                type: 'gauge',
                detail: {
                    formatter: '{value}'
                },
                axisLine: { // 坐标轴线
                    show: true, // 默认显示，属性show控制显示与否
                    lineStyle: { // 属性lineStyle控制线条样式
                        color: [
                            [0.7, 'orange'],
                            [0.9, '#ff4500']
                        ],
                        width: 30
                    }
                },
                axisLabel: { // 坐标轴文本标签，详见axis.axisLabel
                    show: true,
                    formatter: function(v) {
                        switch (v + '') {
                            case '60':
                                return '低';
                            case '90':
                                return '高';
                            default:
                                return '';
                        }
                    },
                    textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        color: '#666',
                        fontSize: 12
                    }
                },
                data: [{
                    value: '高',
                    name: '高'
                }]
            }            ]
        };
        // 为echarts对象加载数据 
        develop_echarts.setOption(option);
        // 故障密度
        var option = {
            tooltip: {
                formatter: "{a} <br/>{b} : {c}%"
            },
            toolbox: {
                show: true,
                feature: {
                    mark: {
                        show: false
                    },
                    restore: {
                        show: false
                    },
                    saveAsImage: {
                        show: false
                    }
                }
            },
            series: [{
                name: '故障密度',
                type: 'gauge',
                detail: {
                    formatter: '{value}%'
                },
                axisLine: { // 坐标轴线
                    show: true, // 默认显示，属性show控制显示与否
                    lineStyle: { // 属性lineStyle控制线条样式
                        color: [
                            [0.7, '#87CEEB'],
                            [0.9, '#ff4500']
                        ],
                        width: 30
                    }
                },
                axisLabel: { // 坐标轴文本标签，详见axis.axisLabel
                    show: true,
                    formatter: function(v) {
                        switch (v + '') {
                            case '60':
                                return '低';
                            case '90':
                                return '高';
                            default:
                                return '';
                        }
                    },
                    textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        color: '#666',
                        fontSize: 12
                    }
                },
                data: [{
                    value: 33,
                    name: ''
                }]
            }]
        };
        // 为echarts对象加载数据 
        breakdown_echarts.setOption(option);*/