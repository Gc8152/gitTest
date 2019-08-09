
var fsCall = getMillisecond() + '1';//功能点
function testTaskAnalyze(seles){
		var project_id = seles.PROJECT_ID;
//		var project_num = seles.PROJECT_NUM;
		var maCall = getMillisecond() + '2';//要点
		var ststCall = getMillisecond() + '3';//统计
		var call = getMillisecond() + '4';
		var $page = getCurrentPageObj();//当前页
		autoInitSelect($page);//初始化下拉选
		var $prjShow = $page.find("#project_tab");
    	var $taskShow = $page.find("#reqtask_tab");
    	initRefresh();//刷新初始化页面
    	function initRefresh(){
    		$prjShow.show();
    		$taskShow.hide();
			initStatiTable();//初始化统计信息表
			initTestTaskInfo();//初始化测试任务信息
			initZtree();//初始化ZTREE
			initFuncSplitTable();//初始化功能点表
			initTestPointTable();//初始化测试要点表
    	}
    	/**
    	 * 新增测试任务信息
    	 */
    	$page.find("#add_Test_Task").unbind("click").click(function(){
    		taskInfoPop.openPop(
					{
						system_id:seles["SYSTEM_ID"],
						system_name:seles["SYSTEM_NAME"],
						project_id:seles["PROJECT_ID"],
						project_name:seles["PROJECT_NAME"],
						func_info:"",
						success_call:function(data){
							$page.find("#testTaskTable").bootstrapTable("refresh",{url : dev_test+"testTaskAnalyze/findTestTaskInfo.asp?SID=" + SID + "&call=jq_1524539268434_tti&project_id="+seles["PROJECT_ID"]});
						}
					}
			);
		});
    	/**
    	 * 修改测试任务信息
    	 */
    	$page.find("#update_Test_Task").unbind("click").click(function(){
    		var selects=$page.find("#testTaskTable").bootstrapTable("getSelections");
    		if(selects.length!=1){
    			alert("请选择一条数据进行修改!");
    		}else if(selects[0]["TEST_TASK_STATE"]!='00'){
    			alert("请选择待执行的测试任务进行修改!");
    		}else{
    			taskInfoPop.openPop(
    					{
    						system_id:seles["SYSTEM_ID"],
    						system_name:seles["SYSTEM_NAME"],
    						project_id:seles["PROJECT_ID"],
    						project_name:seles["PROJECT_NAME"],
    						func_info:"",
    						success_call:function(data){
    							$page.find("#testTaskTable").bootstrapTable("refresh",{url : dev_test+"testTaskAnalyze/findTestTaskInfo.asp?SID=" + SID + "&call=jq_1524539268434_tti&project_id="+seles["PROJECT_ID"]});
    						}
    					}
    			);
    			taskInfoPop.setUpdateData({testtask_id:selects[0]["TEST_TASK_ID"],task:selects[0]});
    		}
    	});
    	
    	/**
    	 * 删除测试任务信息
    	 */
    	$page.find("#del_Test_Task").unbind("click").click(function(){
    		var selects=$page.find("#testTaskTable").bootstrapTable("getSelections");
    		if(selects.length==0){
    			alert("请选择要删除的任务!");
    		}else if(selects[0]["TEST_TASK_STATE"]!='00'){
    			alert("请选择待执行的测试任务进行删除!");
    		}else{
    			nconfirm("确定要删除这些测试任务?",function(){
    				var test_task_ids="";
    				for (var i=0;i<selects.length;i++) {
    					test_task_ids+="&test_task_ids="+selects[i]["TEST_TASK_ID"];
					}
    				baseAjaxJsonpNoCall(dev_test+"testTaskAnalyze/deleteTestTaskInfoById.asp?1=1"+test_task_ids,"",function(msg){
    					if(msg&&msg.result=="true"){
    						alert("删除成功!");
    					}else{
    						alert("删除失败!");
    					}
    					$page.find("#testTaskTable").bootstrapTable("refresh",{url : dev_test+"testTaskAnalyze/findTestTaskInfo.asp?SID=" + SID + "&call=jq_1524539268434_tti&project_id="+seles["PROJECT_ID"]});
    				});
    			});
    		}
    	});
		//初始化树结构
		function initZtree(){
			var zNodes = new Array();
			
			var setting = {  
		            view: {  
		                selectedMulti: false //禁止多点选中  
		            },	            
		            async:{dataType:"application/json"},

		            data: {  
		                simpleData: {  
		                    enable:true,  
		                    idKey: "ID",  
		                    pIdKey: "PID",  
		                    rootPId: "",
		                    formatterNodeName:function(node){
		                    	if(node.func_num){
		                    		return node.name+"("+node.func_num+")";
		                    	}
		                    	return node.name;
		                    } 
		                }  
		            },  
		            callback: {
		                onClick: function(event,treeId,treeNode) {
		                	var lev = treeNode.level;
		                	if(lev == '0'){//点击根节点
		                		$prjShow.show();
		                		$taskShow.hide();
		                		$page.find("[tb='statiTable']").bootstrapTable('refresh',{
		        					url:dev_test+"testTaskAnalyze/queryStatisticsInfo.asp?SID=" + SID + "&call=" + ststCall + "&PROJECT_ID=" + project_id});
		                	}else if(lev == '1'){//点击需求任务
		                		$taskShow.show();
		                		$prjShow.hide();
		                		$page.find("#L2").show();
		                		$page.find("#L3").hide();
		                		$page.find("#L4").hide();
		                		$page.find("[vie='LL']").hide();
		                		$page.find(".tab-pane").removeClass("active");
		                		$page.find("#task_explain").addClass("active");
		                		$page.find("li").removeClass("active");
		                		$page.find("#L1").addClass("active");
		                		initTask(treeId,treeNode);
		                		//此处添加按钮功能，标记该需求任务为已分析
		                	}
	 	                }
		            }
		        };  
			
			baseAjaxJsonp(dev_test+'testTaskAnalyze/queryAnalyzeTree.asp?PROJECT_ID='+project_id+'&call='+call+'&SID='+SID,null,function(data) {
				if (data != undefined && data != null && data.result=="true") {
					var task = data.analyzeTree;
					if(task != null && task.length > 0) {
						for(var i = 0;i<task.length; i++) {
	          				var arr={"ID":task[i].ID,
	          						"PID":task[i].PID,
	          						"name":task[i].NAME,
	          						"func_num":task[i].FUNC_NUM};
							zNodes.push(arr);
						}
					}
					var treeObj = $.fn.zTree.init($("#treeTestTask"),setting, zNodes);
					var node = treeObj.getNodeByParam("ID", project_id, null);
					treeObj.expandNode(node);
					//treeObj.expandAll(true);//默认展开或折叠全部节点
				}else{
					alert("查询失败");
				}
			},call);
			
		}//初始化树结构END
		
		
		//初始化点击项目所关联的统计表
		function initStatiTable(){
			$page.find("[tb='statiTable']").bootstrapTable({
				url : dev_test+"testTaskAnalyze/queryStatisticsInfo.asp?SID=" + SID + "&call=" + ststCall + "&PROJECT_ID=" + project_id,
				method : 'get', // 请求方式（*）
				striped : false, // 是否显示行间隔色
				cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, // 是否启用排序
				sortOrder : "asc", // 排序方式
				sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
				pagination : false, // 是否显示分页（*）
				clickToSelect : false, // 是否启用点击选中行
				// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
				uniqueId : "", // 每一行的唯一标识，一般为主键列
				cardView : false, // 是否显示详细视图
				detailView : false, // 是否显示父子表
				singleSelect : false,// 复选框单选
				jsonpCallback : ststCall,
				onDblClickRow : function(row){
				},onLoadSuccess : function(data){
					gaveInfo();
				},
				columns : [ {
					field : "ITEM",
					title : "统计项",
					align : "center"
				}, {
					field : "ANALYZE_NUM",
					title : "当前总数",
					align : "center"
				}, {
					field : "WAIT_ANALYZE",
					title : "待分析",
					align : "center",
					formatter: function (value, row, index) {
						var num = row.ANALYZE_NUM - row.ALREADY_ANALYZE;
						return num;
					}
				}, {
					field : "ALREADY_ANALYZE",
					title : "已分析",
					align : "center"
				}
				]
			});
		}
		
		function initTestTaskInfo(){
			var queryParams = function(params) {
				var temp = {
					limit : params.limit, // 页面大小
					offset : params.offset
				// 页码
				};
				return temp;
			};
			$page.find("#testTaskTable").bootstrapTable({
		        url : dev_test+"testTaskAnalyze/findTestTaskInfo.asp?SID=" + SID + "&call=jq_1524539268434_tti&project_id="+project_id,
				method : 'get', // 请求方式（*）
				striped : false, // 是否显示行间隔色
				cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, // 是否启用排序
				sortOrder : "asc", // 排序方式
				queryParams : queryParams,// 传递参数（*）
				sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
				pagination : false, // 是否显示分页（*）
				pageList : [ 5, 10, 15 ], // 可供选择的每页的行数（*）
				pageNumber : 1, // 初始化加载第一页，默认第一页
				pageSize : 10, // 每页的记录行数（*）
				clickToSelect : true, // 是否启用点击选中行
				// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
				uniqueId : "TEST_TASK_NUM", // 每一行的唯一标识，一般为主键列
				cardView : false, // 是否显示详细视图
				detailView : false, // 是否显示父子表
				singleSelect : false,// 复选框单选
				jsonpCallback:"jq_1524539268434_tti",
				onLoadSuccess : function(data){
				},
				columns : [ {
					checkbox : true,
					rowspan : 2,
					align : 'center',
					valign : 'middle'
				},{
					field : 'ORDER_ID',
					title : '序号',
					align : "center",
					width : "80",
					visible:false,
					formatter:function(value,row,index){
						return index + 1;
					}
				}, {
					field : "TEST_TASK_NAME",
					title : "任务名称",
					width : "180",
					align : "center",
					edit:{type:"text"}
				} ,{
					field : "TEST_TASK_NUM",
					title : "任务编号",
					width : "180",
					align : "center"
				} ,{
					field : "TEST_START_DATE",
					title : "任务开始时间",
					width : "180",
					align : "center",
					edit:{type:"text","click":function(){WdatePicker({});}}
				} ,{
					field : "TEST_END_DATE",
					title : "任务结束时间",
					width : "180",
					align : "center",
					edit:{type:"text","click":function(){WdatePicker({});}}
				} ,{
					field : "TEST_TASK_MAN_NAME",
					title : "任务执行人",
					width : "180",
					align : "center",
					edit:{type:"text","click":function(data){
						
					}}
				} ,{
					field : "TEST_TASK_STATE_NAME",
					title : "任务状态",
					width : "180",
					align : "center"
				},{
					field : "REQ_TASK_NUM",
					title : "需求任务编号",
					width : "180",
					align : "center",
					visible:false
				} ,{
					field : "FUNC_COUNT",
					title : "需求任务总数",
					width : "180",
					align : "center",
					formatter: function (value, row, index) {
						return '<a href=javascript:showTaskFuncModal("'+row.TEST_TASK_ID+'") style="color:blue;">'+value+'</a>';
					}
				}]
			});
		}
		//初始化需求任务页面的附件列表
		/*function initFileTable(file_id,$tableObj,$modalObj) {
				 var business_code = file_id;
				 getFtpFileList($tableObj, $modalObj, business_code, "0101");
				 getFtpFileList($tableObj, $modalObj, business_code, "test_case_design"); 
		}*/
		
		
		//点击需求任务页面
		function initTask(treeId,treeNode){
			//初始化需求基本信息
			initReqInfo(treeNode.ID,null);
			//测试功能点表刷新
			refreshFuncTable(treeNode.ID);
    		
    		//新增功能点
    		$page.find("button[name='func_add']").unbind("click");
    		$page.find("button[name='func_add']").click(function(){
				var $addPop= $page.find("[mod='add_func_modal']");
				var system_id = $page.find("#T_SYSTEM_NO").text();
				var system_name = $page.find("#T_SYSTEM_NAME").text();
				add_func_Pop($addPop, { SYSTEM_ID: system_id,
										SYSTEM_NAME: system_name,
										TASK_NUM: treeNode.ID},function(){
											refreshFuncTable(treeNode.ID);
										});
				
    		});
    		
    		//选择已有功能点
    		$page.find("button[name='func_choose']").unbind("click");
    		$page.find("button[name='func_choose']").click(function(){
    			var $choosePop= $page.find("[mod='choose_func_modal']");
    			var system_id = $page.find("#T_SYSTEM_NO").text();
				var system_name = $page.find("#T_SYSTEM_NAME").text();
				choose_func_Pop($choosePop, { SYSTEM_ID: system_id,
										SYSTEM_NAME: system_name,
										TASK_NUM: treeNode.ID},function(){
											refreshFuncTable(treeNode.ID);
										});
    		});
    		
    		//导入功能点
    		$page.find("button[name='importFuncMain']").unbind("click");
    		$page.find("button[name='importFuncMain']").click(function(){
    			var system_id = $page.find("#T_SYSTEM_NO").text();
				var system_name = $page.find("#T_SYSTEM_NAME").text();
				importFunc.import_func_Pop({ system_id: system_id,
										SYSTEM_NAME: system_name,
										task_num: treeNode.ID},function(){
											refreshFuncTable(treeNode.ID);
										});
    		});
    		//创建测试任务
    		$page.find("button[name='addTestTask']").unbind("click").click(function(){
    			var rows = $page.find("[tb='funcSplitTable']").bootstrapTable("getSelections");
    			if(rows.length==0){
    				alert("请选择功能点!");
    				return;
    			}
    			var isPublish=false;
    			var isInit=false;
    			var task_num="";
    			var func_info={};//任务关联的功能信息
    			for(var i=0;i<rows.length;i++){
    				func_info["taskFuncInfo["+i+"]"]=rows[i]["FUNC_ID"];
    				if("00"!=rows[i]["TF_STATE"]){
    					isPublish=true;
    				}else{
    					isInit=true;
    				}
    				task_num=rows[i]["TASK_NUM"];
    			}
    			func_info['testTaskInfo["req_task_num"]']=task_num;
    			if(!isInit){
    				alert("请选择未分配的功能点！");
    			}else if(isPublish){
    				nconfirm("选择的功能点中存在已分配的功能点,是否自动过滤？",function(){
    					openTaskInFo(seles,func_info,task_num);
    				});
    			}else{
    				openTaskInFo(seles,func_info,task_num);
    			}
    		});
		}
		function openTaskInFo(seles,func_info,task_num){
			taskInfoPop.openPop(
					{
						system_id:seles["SYSTEM_ID"],
						system_name:seles["SYSTEM_NAME"],
						project_id:seles["PROJECT_ID"],
						project_name:seles["PROJECT_NAME"],
						func_info:func_info,
						success_call:function(data){
							refreshFuncTable(task_num);
						}
					}
			);
		}
		
			//删除功能点
			$page.find("button[name='func_delete_btn']").unbind("click");
			$page.find("button[name='func_delete_btn']").click(function(){
				var rows = $page.find("[tb='funcSplitTable']").bootstrapTable("getSelections");
				if(rows.length>0){
					var ids = "";
					for(var i in rows){
						ids += "," + rows[i].FUNC_ID;
					}
				}
				var func_id = ids.substring(1);
				deleteFunc(rows[0].TASK_NUM,func_id,rows);
			});
		
//	}
		
		
		//点击功能点页面    写到这里
		function initFunc(treeId,treeNode){
			//初始化需求及功能点基本信息
			initReqInfo(treeNode.PID,treeNode.ID);
	
			$page.find("[tb='testPointTable']").bootstrapTable('refresh',{
				url:dev_test+"testTaskAnalyze/queryMainPointByFunc.asp?SID=" + SID + "&call=" + maCall +"&FUNC_ID="+treeNode.ID});
			
			//新增测试要点
			$page.find("[name='main_add']").unbind("click");
			$page.find("[name='main_add']").click(function(){
				var tableDate = getCurrentPageObj().find("[tb='testPointTable']").bootstrapTable('getData');
				var main_order = tableDate.length + 1;
				var testMainInfo = {};
				testMainInfo["TESTPOINT_NAME"] = "";
				testMainInfo["TEST_ATTRIBUTE"] = "";
				testMainInfo["TEST_EXPLAIN"] = "";
				testMainInfo["TYPE"] = "01";
				testMainInfo["TESTPOINT_ID"] = "";
				testMainInfo["ROW_NUM"] = main_order;
				getCurrentPageObj().find("[tb='testPointTable']").bootstrapTable('append',testMainInfo);
				autoInitSelect($page);//初始化下拉选
			});
			
			//保存要点分析
			$page.find("[name='main_save']").unbind("click");
			$page.find("[name='main_save']").click(function(){
					var params = {};
					var tableDate = getCurrentPageObj().find("[tb='testPointTable']").bootstrapTable('getData');
					if(0 == tableDate.length){
						alert("尚未进行要点分析");
						return;
					}else{
						var mainArr = new Array();
					    for(var k=0;k<tableDate.length;k++){
					    	if(tableDate[k].TESTPOINT_NAME==''||tableDate[k].TEST_ATTRIBUTE==''||tableDate[k].TEST_EXPLAIN==''){
								alert('请完善测试要点信息');
								return;
							}
							mainArr.push({"TESTPOINT_NAME":tableDate[k].TESTPOINT_NAME,
										"TEST_ATTRIBUTE":tableDate[k].TEST_ATTRIBUTE,
										"TEST_EXPLAIN":tableDate[k].TEST_EXPLAIN,
										"TYPE":tableDate[k].TYPE,
										"TESTPOINT_ID":tableDate[k].TESTPOINT_ID});
					    }
						params["MAIN_ARR"] = JSON.stringify(mainArr);
					}
					params["FUNC_ID"] = treeNode.ID;
			
					var sMainCall = getMillisecond();
					baseAjaxJsonp(dev_test+"testTaskAnalyze/saveMainPoint.asp?SID=" + SID + "&call=" + sMainCall, params, function(data) {
						if(data && data.result=="true"){
							alert(data.msg);
							//initRefresh();//刷新初始化页面
							var FUNC_ID_str = treeNode.ID;
							$page.find("[tb='testPointTable']").bootstrapTable('refresh',{
								url:dev_test+"testTaskAnalyze/queryMainPointByFunc.asp?SID=" + SID + "&call=" + maCall +"&FUNC_ID="+FUNC_ID_str});
						}else{
							alert(data.msg);
							//initRefresh();//刷新初始化页面
						}
					},sMainCall,false);
			});
		
		}
		
		
		
		//根据需求任务编号查询已分析功能点表
		function initFuncSplitTable(){
			$page.find("[tb='funcSplitTable']").bootstrapTable({
				url : dev_test+"testTaskAnalyze/queryFuncByTask.asp?SID=" + SID + "&call="+ fsCall + "&TASK_NUM=x",
				method : 'get', // 请求方式（*）
				striped : false, // 是否显示行间隔色
				cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, // 是否启用排序
				sortOrder : "asc", // 排序方式
				sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
				pagination : true, // 是否显示分页（*）
				clickToSelect : true, // 是否启用点击选中行
				pageList : [ 5, 10, 15 ],
				pageSize : 10,
				// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
				uniqueId : "FUNC_ID", // 每一行的唯一标识，一般为主键列
				cardView : false, // 是否显示详细视图
				detailView : false, // 是否显示父子表
				singleSelect : false,// 复选框单选
				jsonpCallback:fsCall,
				onDblClickRow : function(row){
				},onLoadSuccess : function(data){
					gaveInfo();
				},onPostBody :function(data){
				
				},
				onAll: function(name,args) {
					$page.find("[tb='funcSplitTable']").find("span[name=view_file]").click(function(){
						var index = $(this).attr("index");
						var rowObj = $page.find("[tb='funcSplitTable']").bootstrapTable('getData')[index];
						var spans = view_modal.find("span");
						for(var i=0; i<spans.length; i++){
							var span_name = $(spans[i]).attr("name");
							$(spans[i]).html(rowObj[span_name]);
						}
						view_modal.modal('show');
					});		
				},
				columns : [{
					 field: 'middle',
					 checkbox: true,
					 rowspan: 1,
					 align: 'center',
					 valign: 'middle'
				}, {
					field : "SYSTEM_NAME",
					title : "应用名称",
					align : "center"
				}, {
					field : "MODULE_NAME",
					title : "模块名称",
					align : "center"
				}, {
					field : "FUNC_NAME",
					title : "功能点名称",
					align : "center"
				},{
					field : "FUNC_REMARK",
					title : "功能点描述",
					align : "center",
					formatter: function (value, row, index) {
						if(undefined == row.FUNC_REMARK){
							row.FUNC_REMARK = '';
						}
						return "<input type='text' name='FUNC_REMARK' index='"+index+"' value='"+row.FUNC_REMARK+"'>" ;
					}
				}, {
					field : "OPERATION",
					title : "操作",
					align : "center",
					formatter: function (value, row, index) {
						return "<a style='color:blue'  href='javascript:void(0)' onclick=updateFunc('"+row.TASK_NUM+"','"+row.FUNC_ID+"','"+index+"')>保存</a>";
					}
				}]
			});
			
		}
		
		//测试要点表
		function initTestPointTable(){
			
			$page.find("[tb='testPointTable']").bootstrapTable({
				url : dev_test+"testTaskAnalyze/queryMainPointByFunc.asp?SID=" + SID + "&call=" + maCall + "&FUNC_ID=x",
				method : 'get', // 请求方式（*）
				striped : false, // 是否显示行间隔色
				cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, // 是否启用排序
				sortOrder : "asc", // 排序方式
				sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
				pagination : false, // 是否显示分页（*）
				clickToSelect : false, // 是否启用点击选中行
				// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
				uniqueId : "ROW_NUM", // 每一行的唯一标识，一般为主键列
				cardView : false, // 是否显示详细视图
				detailView : false, // 是否显示父子表
				singleSelect : false,// 复选框单选
				jsonpCallback:maCall,
				onDblClickRow : function(row){
				},onLoadSuccess : function(data){
					gaveInfo();
					autoInitSelect(getCurrentPageObj());
				},onPostBody :function(data){
					var bootData = getCurrentPageObj().find("[tb='testPointTable']").bootstrapTable("getData");
					var inputs = getCurrentPageObj().find("[tb='testPointTable']").find("input");
					inputs.unbind("change").bind("change", function(e){
						if($(this).attr("name") != 'btSelectItem'){
							var index = $(this).attr("index");
							var bootrow = bootData[index];
							bootrow[$(this).attr("name")] = $(this).val();
						}
					});
					var seles = getCurrentPageObj().find("[tb='testPointTable']").find("select");
					seles.unbind("change").bind("change", function(e){
						var index = $(this).attr("index");
						var bootrow2 = bootData[index];
						bootrow2[$(this).attr("name")] = $(this).val();
					});
				},
				columns : [ {
					field : 'ORDER_ID',
					title : '序号',
					align : "center",
					width : "120",
					formatter:function(value,row,index){
						return index + 1;
					}
				},{
					field : "TESTPOINT_NAME",
					title : "测试要点",
					align : "center",
					formatter: function (value, row, index) {
						var isReadonly = '';
						if(row.TYPE == '00'){
							isReadonly = 'readonly';
						}
						if(undefined == row.TESTPOINT_NAME){
							row.TESTPOINT_NAME = '';
						}
						return "<input type='text' name='TESTPOINT_NAME' index='"+index+"' value='"+row.TESTPOINT_NAME+"'  "+isReadonly+">" ;
					}
				}, {
					field : "TEST_ATTRIBUTE",
					title : "属性",
					align : "center",
					formatter: function (value, row, index) {
						var isReadonly = '';
						if(row.TYPE == '00'){
							isReadonly = 'readonly';
							return "<input type='text' name='TEST_ATTRIBUTE' index='"+index+"' value='"+row.TEST_ATTRIBUTE_NAME+"'   "+isReadonly+">" ;

						}else{
							return "<select   name='TEST_ATTRIBUTE'  index='"+index+"' value='"+value+"'     diccode='TM_DIC_TEST_ATTRIBUTE'  class='requirement-ele-width' style='width: 100%'></select>" ;
						}
					}
				}, {
					field : "TEST_EXPLAIN",
					title : "测试说明",
					align : "center",
					formatter: function (value, row, index) {
						var isReadonly = '';
						if(row.TYPE == '00'){
							isReadonly = 'readonly';
						}
						if(undefined == row.TEST_EXPLAIN){
							row.TEST_EXPLAIN = '';
						}
						return "<input type='text' name='TEST_EXPLAIN' index='"+index+"' value='"+row.TEST_EXPLAIN+"'   "+isReadonly+">" ;
					}
				}, {
					field :	"ROW_NUM",
					title :	"操作",
					align : "center",
					width : "10%",
					formatter: function (value, row, index) {
						return "<a style='color:blue'  href='javascript:void(0)' onclick=deleteMain('"+row.ROW_NUM+"')>删除</a>" ;
					}
				}
				]
			});
			
		}
		
		//查询需求信息及功能点信息
		function initReqInfo(task_num,func_id){
			var reqCall = getMillisecond();
			baseAjaxJsonp(dev_test+"testTaskAnalyze/queryReqInfo.asp?SID=" + SID + "&call=" + reqCall + "&TASK_NUM="+task_num + "&FUNC_ID="+func_id, null, function(data) {
				if (data != undefined && data != null && data.result=="true") {
					var reqinfo = data.reqinfo;
					if(reqinfo != null && reqinfo.length > 0) {
						var file_id = '';
			            for(var k in reqinfo[0]){
			            	$page.find("#T_"+k).text(reqinfo[0][k]);
			            	if(k == 'SYSTEM_NAME'){
			            		$page.find("#F_"+k).text(reqinfo[0][k]);
			            	}
			            	if(k == 'REQ_CODE'){
			            		file_id = reqinfo[0][k];
			            	} 
			            }
			            var $tableObj = $page.find("[tb='taskFileTable']");
			            var $modalObj = $page.find("#file_reqtask_modal");
//			            var paramObj = new Object();
			           /* initFileTable(file_id,$tableObj,$modalObj);*/
			            var req_state = parseInt(reqinfo[0].REQ_STATE);
//			            paramObj.afterUpload = function (){
//			    		if(req_state>=10){
			    		  getFtpFileList($tableObj,$modalObj, reqinfo[0].TASK_NUM, "03");	
//			    		}else{
//			    		  getFtpFileList($tableObj,$modalObj, reqinfo[0].FILE_ID, "03");
//			    		}
//			            };
//			    		openFileFtpUpload($modalObj, $tableObj, 'GZ1077',reqinfo[0].FILE_ID, '0101', 'TM_DIC_SCREENSHOT', false, false, paramObj);
					}
					var funcinfo = data.funcinfo;
					if(funcinfo != null && funcinfo.length > 0) {
						for(var k in funcinfo[0]){
							$page.find("#F_"+k).text(funcinfo[0][k]);
						}
					}
				}else{
					alert("数据异常");
					//initRefresh();//刷新初始化页面
				}
			},reqCall,false);
		}
}
//删除测试要点
function deleteMain(row_num){
	getCurrentPageObj().find("[tb='testPointTable']").bootstrapTable('removeByUniqueId', row_num);
	autoInitSelect(getCurrentPageObj());
}

//保存功能点描述
function updateFunc(task_num,func_id,index){
	var func_remark = getCurrentPageObj().find("[tb='funcSplitTable']").find("[index='"+index+"']").val();
	baseAjaxJsonpNoCall(dev_test+"testTaskAnalyze/funcOptById.asp?&FUNC_ID="+func_id+"&OPT=update&FUNC_REMARK="+func_remark, null, function(data) {
		if (data != undefined && data != null && data.result=="true") {
			alert(data.msg);
			refreshFuncTable(task_num);
		}else{
			alert("数据异常");
			//initRefresh();//刷新初始化页面
		}
	},false);
}

//删除测试功能点
function deleteFunc(task_num,func_id,rows){
	nconfirm("删除功能点，将删除功能点下的测试要点，确定删除？",function(){
	baseAjaxJsonpNoCall(dev_test+"testTaskAnalyze/funcOptById.asp?FUNC_ID="+func_id+"&OPT=del", null, function(data) {
		if (data != undefined && data != null && data.result=="true") {
			alert(data.msg);
			refreshFuncTable(task_num);//更新表
			if(rows.length>0){
				for(var i in rows){
				var treeObj = $.fn.zTree.getZTreeObj("treeTestTask");//从tree中删除该功能点
				var node = treeObj.getNodeByParam("ID", rows[i].FUNC_ID, null);
				treeObj.removeNode(node);
				}
			}
		}else{
			alert("数据异常");
			//initRefresh();//刷新初始化页面
		}
	},false);
	
	});
}

//测试功能点表刷新
function refreshFuncTable(task_num){
	getCurrentPageObj().find("[tb='funcSplitTable']").bootstrapTable('refresh',{
			url:dev_test+"testTaskAnalyze/queryFuncByTask.asp?SID=" + SID + "&call=" + fsCall +"&TASK_NUM="+task_num});
}
(function(){
	getCurrentPageObj().find("#view_task_func_table").bootstrapTable({
//		url : dev_test+"testTaskAnalyze/queryFuncByTask.asp?SID=" + SID + "&call=jq_1524556473364_&testtask_id="+testtask_id,
		method : 'get', // 请求方式（*）
		striped : false, // 是否显示行间隔色
		cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, // 是否启用排序
		sortOrder : "asc", // 排序方式
		sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
		pagination : false, // 是否显示分页（*）
		clickToSelect : true, // 是否启用点击选中行
		// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
		uniqueId : "FUNC_ID", // 每一行的唯一标识，一般为主键列
		recallSelect:true,//分页数据选中记忆
		cardView : false, // 是否显示详细视图
		detailView : false, // 是否显示父子表
		singleSelect : false,// 复选框单选
		jsonpCallback:"jq_1524556473364_",
		columns : [{
			field : "SYSTEM_NAME",
			title : "应用名称",
			align : "center"
		}, {
			field : "REQ_TASK_CODE",
			title : "需求任务编号",
			align : "center",
			width:100
		}, {
			field : "REQ_TASK_NAME",
			title : "需求任务名称",
			align : "center"
		}, {
			field : "REQ_TASK_RELATION_DISPLAY",
			title : "从属关系",
			align : "center"
		},{
			field : "REQ_TASK_STATE_DISPLAY",
			title : "需求任务状态",
			align : "center"
		}, {
			field : "PLAN_ONLINETIME",
			title : "预计投产时间",
			align : "center"
		}]
	});
})();

/**
 * 刷新测试任务功能信息数据
 * @param testtask_id
 */
function refreshTaskFuncModal(testtask_id){
	getCurrentPageObj().find("#view_task_func_table").bootstrapTable("refresh",{url : dev_test+"testTaskAnalyze/queryReqTaskInfoByProject.asp?SID=" + SID + "&call=jq_1524556473364_&testtask_id="+testtask_id});
}
function showTaskFuncModal(testtask_id){
	refreshTaskFuncModal(testtask_id);
	getCurrentPageObj().find("#view_task_func_modal").modal("show");
}
