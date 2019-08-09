/**
 * 树信息
 * @param executeTreeInfo
 * @param $page
 */
(function(executeTreeInfo,$page){
	var setting = {
	        view: {
	            selectedMulti: false //禁止多点选中  
	        },
	        async:{dataType:"application/json"},
	        data: {
	            simpleData: {  //setting.data.key.name;
	                enable:true,  
	                idKey: "ID",  
	                pIdKey: "PID",
	                formatterNodeName:function(node){
	                	var id=node.ID;
	                	if(id.length>2&&"XQ"==id.substring(0,2)){
	                		return node.NAME+"("+node.ID+")";
	                	}
	                	return node.NAME+"";
	                },formatterNodeTitle:function(node){
	                	var id=node.ID;
	                	if(id.length>2&&"XQ"==id.substring(0,2)){
	                		return node.NAME+"("+node.ID+")";
	                	}
	                	return node.NAME+"";
	                }
	            },
	            key: {
	            	name:"NAME"
	            }
	        },  
	        callback: {
	        	onClick: function(event,treeId,treeNode) {
	        		executeCaseSum.initExecuteInfo(treeNode.level,treeNode.ID);
	        	}
	        }
	    };
	executeTreeInfo.init=function(project_id){
		baseAjaxJsonpNoCall(dev_test+"testTaskExecute/queryExecuteTestTreeInfo.asp",{project_id:project_id},function(data){
			var treeObj=$.fn.zTree.init($page.find("#treeExecuteTest1"),setting, data);
			treeObj.expandAll(true);
		});
		//显示案例执行页签信息
		executeTreeInfo.showCaseExecute=function(){
			$page.find("#case_executeActive").show();
			$page.find("#case_executeActive,#menu_info2").addClass("active");
			$page.find("#case_InfoActive,#menu_info1").removeClass("active");
		};
		//隐藏案例执行页签信息
		executeTreeInfo.hideCaseExecute=function(){
			$page.find("#case_executeActive").hide();
			executeTreeInfo.toCaseExecuteList();
			var nodes=$.fn.zTree.getZTreeObj("treeExecuteTest1").getNodes();
			if(nodes&&nodes.length>0){
				executeCaseSum.initExecuteInfo(0,nodes[0].ID);
			}
		};
		//切换到案例列表信息
		executeTreeInfo.toCaseExecuteList=function(){
			$page.find("#case_executeActive,#menu_info2").removeClass("active");
			$page.find("#case_InfoActive,#menu_info1").addClass("active");
		};
		$page.find("#executeCasesDesign").unbind("click").click(function(){
			var selections=$page.find("#executeCaseListInfo").bootstrapTable("getSelections");
			if(selections.length!=1){
				alert("请选择一条案例!");
			}else{
				executeTreeInfo.showCaseExecute();
//				$page.find("#case_execute_sum_info").hide();
//				$page.find("#case_execute_info").show();
				executeCaseInfo.initCaseInfo(selections[0]["TESTPOINT_ID"]);
			}
		});
		
		$page.find("#addCasesDesign").unbind("click").click(function(){
			 closeAndOpenInnerPageTab("designTestCases","测试案例设计","dev_test/designTestCases/casesDesign_view.html", function(){
				 designTestCases({"PROJECT_ID":project_id,"TEST_TASK_ID":""});
				});
		});
	};
})(executeTreeInfo={},getCurrentPageObj());

/**
 * 案例执行信息汇总
 * @param executeCaseSum
 * @param $page
 */
(function(executeCaseSum,$page){
	executeCaseSum.initExecuteInfo=function(level,id){
		executeTreeInfo.toCaseExecuteList();
		var param={};
		if(level==0){
			param["project_id"]=id;
			initExecuteCaseListInfo(id);
		}else if(level==1){
			param["task_num"]=id;
			initExecuteCaseListInfo(null,id);
		}else if(level==2){
			initExecuteCaseListInfo(null,null,id);
			param["func_id"]=id;
		}
		if(level<3){
			$page.find("#case_execute_sum_info").show();
			$page.find("#case_execute_info").hide();
			baseAjaxJsonpNoCall(dev_test+"testTaskExecute/querySumCaseTestInfo.asp",param,function(data){
				if(data&&!data.result){
					$.each(data,function(k,v){
						$page.find("#"+k).text(v);
					});
				}
			});
		}else{
			$page.find("#case_execute_sum_info").hide();
			$page.find("#case_execute_info").show();
			executeCaseInfo.initCaseInfo(id);
		}
	};
	function initExecuteCaseListInfo(project_id,task_num,func_id){
		var param=project_id?"&project_id="+project_id:"";
		 	param+=task_num?"&task_num="+task_num:"";
		 	param+=func_id?"&func_id="+func_id:"";
		$page.find("#executeCaseListInfo").bootstrapTable('destroy').bootstrapTable({
			url:dev_test+"testTaskExecute/findExecuteCaseListInfo.asp?SID="+SID+"&call=jq_1524902594119_b"+param,
			method : 'get', // 请求方式（*）
			striped : false, // 是否显示行间隔色
			cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : true, // 是否启用排序
			sortOrder : "asc", // 排序方式
			sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
			pagination : false, // 是否显示分页（*）
			clickToSelect : true, // 是否启用点击选中行
			uniqueId : "STEP_ID", // 每一行的唯一标识，一般为主键列
			cardView : false, // 是否显示详细视图
			detailView : false, // 是否显示父子表
			singleSelect : true,// 复选框单选
			jsonpCallback:"jq_1524902594119_b",
			onDblClickRow:function(row){
			},onClickRow: function(row,tr) {
			},onLoadSuccess : function(data){
				
			},columns : [ 
	             {
					checkbox : true,
					rowspan : 2,
					align : 'center',
					valign : 'middle'
				}, {
				field : 'CASE_NUM',
				title : '案例编号',
				align : "center",
				width : "50px"
			}, {
				field : 'CASE_NAME',
				title : '案例名称',
				align : "center",
				width : "50px"
			}, {
				field : 'PRI_LEVEL_NAME',
				title : '案例优先级',
				align : "center",
				width : "50px"
			},{
				field : 'EXECUTE_STATE_NAME',
				title : '执行状态',
				align : "center",
				width : "50px"
			},{
				field : 'TASK_NUM',
				title : '需求任务编号',
				align : "center",
				width : "50px"
			},{
				field : 'MODULE_NAME',
				title : '模块名称',
				align : "center",
				width : "50px"
			},{
				field : 'FUNC_NAME',
				title : '功能名称',
				align : "center",
				width : "50px"
			}]
		});
	}
})(executeCaseSum={},getCurrentPageObj());

/**
 * 执行案例信息
 * @param executeCaseInfo
 * @param $page
 */
(function(executeCaseInfo,$page){
	executeCaseInfo.initCaseInfo=function(testpoint_id){
		initRealOptTable();
		initCaseInfo(testpoint_id);
	};
	var resutStepResult=[]; 
	/**
	 * 初始化案例信息
	 */
	function initCaseInfo(point_id){
			baseAjaxJsonpNoCall(dev_test+"designTestCases/findOneDesignCaseInfo.asp?point_id="+point_id, null, function(data) {
				if(data&&data.caseInfo){
					$.each(data.caseInfo,function(k,v){
						$page.find("#I_"+k).text(v);
					});
					executeResultInfo.init(data.caseInfo["TESTPOINT_ID"],data.caseInfo["CASE_ID"]);
				}
				if(data&&data.optList){
					executeResultInfo.findLastExecuteResultInfo(data.caseInfo["CASE_ID"],function(resultDataInfo){
						var resultStepInfo=(resultDataInfo["resultStepInfo"]||[]);
						var resultInfo=(resultDataInfo["resultInfo"]||{});
						resutStepResult=resultStepInfo;
						$.each(data.optList,function(k,v){
							$page.find("[tb='realOptTable']").bootstrapTable('append',v);
							i++;
						});
						if(resultInfo["EXECUTE_STATE"]!="00"){
							for(var i=0;i<data.optList.length;i++){
								$page.find("[tb='realOptTable']").bootstrapTable('beginEditor',i);
							}
							$page.find("#execute_state,#execute_time,#execute_desc").prop({"disabled":false});
							$page.find("#saveAddInfo").show();
							$page.find("#addDef").show();
						}else{
							$page.find("#saveAddInfo").unbind("click").hide();
							$page.find("#addDef").unbind("click").hide();
							$page.find("#execute_state,#execute_time,#execute_desc").prop({"disabled":true});
						}
						$page.find("#execute_state").val(resultInfo["EXECUTE_STATE"]||"").select2();
						$page.find("#execute_time").val(resultInfo["EXECUTE_TIME"]||"");
						$page.find("#execute_desc").val(resultInfo["EXECUTE_DESC"]||"");
					});
				}
				initVlidate($page);
			});
	}
	
	//案例设计_操作步骤表初始化
	function initRealOptTable(){
		$page.find("[tb='realOptTable']").bootstrapTable('destroy').bootstrapTable({
			method : 'get', // 请求方式（*）
			striped : false, // 是否显示行间隔色
			cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : true, // 是否启用排序
			sortOrder : "asc", // 排序方式
			sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
			pagination : false, // 是否显示分页（*）
			clickToSelect : false, // 是否启用点击选中行
			uniqueId : "STEP_ID", // 每一行的唯一标识，一般为主键列
			cardView : false, // 是否显示详细视图
			detailView : false, // 是否显示父子表
			singleSelect : false,// 复选框单选
			jsonpCallback:"jq_1523590716977COList",
			onDblClickRow:function(row){
			},onClickRow: function(row,tr) {
			},onLoadSuccess : function(data){
				
			},columns : [ {
				field : 'OPT_ORDER',
				title : '步骤编号',
				align : "center",
				width : "50px"
			}, {
				field : "OPT_DESCRIPT",
				title : "操作步骤",
				align : "center"
			}, {
				field : "INPUT_DATA",
				title : "输入数据",
				align : "center"
			}, {
				field : "EXPECT_RESULT",
				title : "预期结果",
				align : "center"
			}, {
				field : "REMARK",
				title : "备注",
				align : "center"
			}, {
				field : "RESULT",
				title : "实际结果",
				align : "center",
				edit:{
					type:"textarea",
					attr:'validate="v.required" valititle="该项为必填项"'
				},formatter:function(value,row,index){
					var setp_id=row["STEP_ID"];
					var val="";
					if(resutStepResult){
						for(var i=0;i<resutStepResult.length;i++){
							if(setp_id==resutStepResult[i]["STEP_ID"]){
								val=resutStepResult[i]["RESULT_INFO"];
								row["RESULT"]=val;
								break;
							}
						}
					}
					return val;
				}
			}]
		});
	}
})(executeCaseInfo={},getCurrentPageObj());

/**
 * 执行结果信息
 * @param executeResultInfo
 * @param $page
 */
(function(executeResultInfo,$page){
	executeResultInfo.init=function(testpoint_id,case_id){
		initSelect($page.find("#execute_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"TM_DIC_EXECUTE_RESULT"});
		$page.find("#execute_time").val(getCurrentYMD());
		initEvent(testpoint_id,case_id);
	};
	/**
	 * 查询最后一次执行操作的结果信息
	 */
	 executeResultInfo.findLastExecuteResultInfo=function(case_id,func_call){
		baseAjaxJsonpNoCall(dev_test+"testTaskExecute/findLastExecuteResultInfo.asp?case_id="+case_id, null, function(data) {
			if(func_call){
				func_call(data);
			}});
	};
	//事件 
	function initEvent(testpoint_id,case_id){
		$page.find("#addDef").unbind("click").click(function(){
			closeAndOpenInnerPageTab("addDefect","新增缺陷","dev_test/defectManagement/add/defect_add.html", function(){
				initPageFormByCaseExecuteInfo(case_id);
			});
		});
		$page.find("#saveAddInfo").unbind("click").click(function(){
			if(vlidate($page)){
				var data=$page.find("[tb='realOptTable']").bootstrapTable('endAllEditor');
				var param={};
				$.each(data,function(i,v){
					param['executeStepResultList['+i+']["step_id"]']=v["STEP_ID"];
					param['executeStepResultList['+i+']["result_info"]']=v["RESULT"];
				});
				var execute_state=$page.find("#execute_state").val();
				param['executeResult["execute_state"]']=execute_state;
				param['executeResult["execute_desc"]']=($page.find("#execute_desc").val()||"");
				param['executeResult["execute_time"]']=$page.find("#execute_time").val();
				param['executeResult["testpoint_id"]']=testpoint_id;
				param['executeResult["case_id"]']=case_id;
				baseAjaxProxyTest("testTaskExecute/saveExecuteResultInfo.asp",param,function(data){
					if(data&&data.result=="true"){
						if(execute_state=="00"){
							executeTreeInfo.hideCaseExecute();
						}
						alert("保存成功!");
					}else{
						alert("保存失败!");
					}
				});
			}
		});
	}
})(executeResultInfo={},getCurrentPageObj());

function testTaskExecute(data){
	executeTreeInfo.init(data["PROJECT_ID"]);//data["PROJECT_ID"]		673
	executeCaseSum.initExecuteInfo(0,data["PROJECT_ID"]);//data["PROJECT_ID"]		673
}













