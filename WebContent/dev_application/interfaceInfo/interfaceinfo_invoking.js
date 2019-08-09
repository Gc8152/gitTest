
function interInvokingView(inter_id){
	var invoking_echarts = echarts.init(document.getElementById('invoking_echarts'));
	var nodeArr = new Array();
	var linkArr = new Array();
	var uCall = getMillisecond();
	baseAjaxJsonp(dev_application+"InterQuery/queryInvokingEcharts.asp?call=" + uCall+'&SID='+SID+'&inter_id='+inter_id ,null, function(data) {
		if (data != undefined&&data!=null&&data.result=="true") {
    		var row = data.rows;
    		if(row != null && row.length > 0) {
    			for(var i = row.length-1; i >= 0; i--) {
    				var iname = row[i].INTER_NAME;
    				var icode = row[i].INTER_CODE;
    				var name = row[i].SYSTEM_NAME;
    				var status = row[i].INTER_STATUS;
    				var c = parseInt(status.substring(1));
    				var narr = {};
    				var larr = {};
    				if(i == 0){
    					var param = {category: c , name: '接口', value : 10, label: iname +'\n' +icode};
    					nodeArr.push(param);
    					narr = {category: 4, name: name, value : 5};
    					larr = {source : name, target : '接口', weight : 1, name: '调用'};
    				}else{
    				    narr = {category: 4, name: name, value : 5};
    				    larr = {source : name, target : '接口', weight : 1, name: '调用'};
    				};
    				nodeArr.push(narr);
    				linkArr.push(larr);
    			};
    		};
			var invokingOption = {
					   title : {
			    	        text: '接口调用关系',
			    	        x:'left',
			    	        y:'top'
			    	    },
			    	    tooltip : {
			    	    	show : true,
			    	        trigger: 'item',
			    	       /* confine:false,
			    	        triggerOn:'click',//提示触发条件，mousemove鼠标移至触发，还有click点击触发
		                    alwaysShowContent:false, //默认离开提示框区域隐藏，true为一直显示
		                    showDelay:0,//浮层显示的延迟，单位为 ms，默认没有延迟，也不建议设置。在 triggerOn 为 'mousemove' 时有效。
		                    hideDelay:20,//浮层隐藏的延迟，单位为 ms，在 alwaysShowContent 为 true 的时候无效。
		                    enterable:false,//鼠标是否可进入提示框浮层中，默认为false，如需详情内交互，如添加链接，按钮，可设置为 true。
		                    position:'right',//提示框浮层的位置，默认不设置时位置会跟随鼠标的位置。只在 trigger 为'item'的时候有效。
*/			    	        formatter: '{a} : {b}'
			    	    },
			    	    toolbox: {
			    	        show : true,
			    	        feature : {
			    	            restore : {show: true},
			    	            magicType: {show: true, type: ['chord', 'force']},
			    	            saveAsImage : {show: true}
			    	        }
			    	    },
			    	    legend: {
			    	        x: 'left',
			    	        padding :[40,1],
			    	        selectedMode : false,
			    	        data:['待建','在建','执行中','变更中']
			    	    },
			    	    series : [
			    	        {
			    	            type:'chord',
			    	            name : "接口调用关系",
			    	            ribbonType: false,
			    	            categories : [
			    	                {
			    	                    name: '待建'
			    	                },
			    	                {
			    	                    name: '在建'
			    	                },
			    	                {
			    	                    name: '执行中'
			    	                },
			    	                {
			    	                    name: '变更中'
			    	                },
			    	                {
			    	                    name: '消费方'
			    	                }
			    	            ],
			    	            itemStyle: {
			    	                normal: {
			    	                    label: {
			    	                        show: true,
			    	                        textStyle: {
			    	                            color: '#333'
			    	                        }
			    	                    },
			    	                    nodeStyle : {
			    	                        brushType : 'both',
			    	                        borderColor : 'rgba(255,215,0,0.4)',
			    	                        borderWidth : 1
			    	                    },
			    	                    linkStyle: {
			    	                        type: 'curve'
			    	                    }
			    	                }
			    	            },    
			    	            label : { //=============图形上的文本标签
			                        normal : {
			                            show : true,//是否显示标签。
			                            position : 'inside',//标签的位置。['50%', '50%'] [x,y]
			                            textStyle : { //标签的字体样式
			                                color : '#000', //字体颜色
			                                fontStyle : 'normal',//文字字体的风格 'normal'标准 'italic'斜体 'oblique' 倾斜
			                                fontWeight : 'bolder',//'normal'标准'bold'粗的'bolder'更粗的'lighter'更细的或100 | 200 | 300 | 400...
			                                fontFamily : 'sans-serif', //文字的字体系列
			                                fontSize : 13 //字体大小
			                            }
			                        }
			                    },
			    	            useWorker: false,
			    	            minRadius : 15,
			    	            maxRadius : 25,
			    	            gravity: 1.1,
			    	            scaling: 1.3,
			    	            roam: false,
			    	            nodes:nodeArr,
			    	            links : linkArr
			    	        }
			    	    ]
			    	};
			invoking_echarts.setOption(invokingOption);
		};
	
	},uCall);
	
};	
