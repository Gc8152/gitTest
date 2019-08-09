//初始化需求的基本信息
function initReqInfoInView(p) {
	var currTab = getCurrentPageObj();
	//currTab.find(".file_template_style").hide();
	currTab.find("a[name=normal]").hide();
	currTab.find("a[name=emergent]").hide();
	var call_req = getMillisecond()+'1';
	var url = dev_construction+'GFollowerTask/queryReqBasicInfo.asp?call='+call_req+'&SID='+SID+'&req_id='+p;
	baseAjaxJsonp(url, null, function(data){
		if (data != undefined&&data!=null&&data.result=="true") {
			if(data.info){
				for(var k in data.info){
					if(k=="is_emergency_req"){
					if(data.info["is_emergency_req"]=="01"){//紧急需求不展示需求评估信息
						currTab.find("#pinggu").css("display","block");
					    var reqAssReturnCall=getMillisecond();
						baseAjaxJsonp(dev_construction+"requirement_splitreq/querySplitSubReqPageById.asp?SID="+SID+"&req_id="+p+"&call="+reqAssReturnCall, null , function(data) {
								  var map=data[2];
							     for(var k in map){
									var str=map[k];
									k = k.toLowerCase();//大写转换为小写
							    if(k=="req_acc_result"){
							    	getCurrentPageObj().find("input[name='DM."+k+"']"+"[value="+str+"]").attr("checked",true);
							    	if(str=="02"){//需求状态为退回时显示退回原因
							    		currTab.find("#DMreq_acc_reason").css("display","block");
							    		currTab.find("#reason").css("display","block");
							    	}
							    }else if(k=="req_analytic_result"){
									getCurrentPageObj().find("#DMreq_analytic_result").val(str);
								}else{
									getCurrentPageObj().find("input[name='DM."+k+"']").val(str);
								  }
							     }
						},reqAssReturnCall);
					}
					}else if(k=="req_code") {
						currTab.find("#reqBasicInfo #"+k).text(data.info[k].toUpperCase());
					}else if(k=="req_product_man_name") {
						
						if(data.info["req_acc_productman"]!=null && data.info["req_acc_productman"]!="" && data.info["req_acc_productman"]!=undefined){
							currTab.find("#reqBasicInfo #req_product_man_name").text(data.info["req_acc_productman"]);
						}
						else{
							currTab.find("#reqBasicInfo #req_product_man_name").text(data.info[k]);
						}
					}else if(k=="instance_id"&&data.info["instance_id"]!=undefined){
						currTab.find("#shenpi").css("display","block");
						initReqApprovalDetailInfo(data.info[k],'0');

						var reqAprDetailCall=getMillisecond();
						baseAjaxJsonp(dev_construction+"requirement_splitreq/querySplitSubReqById.asp?SID="+SID+"&req_id="+p+"&call="+reqAprDetailCall, null , function(data) {
								for ( var f in data) {
									var map=data[f];
									   if(f==1){
										 //初始化流程数据
											initTitle(map["INSTANCE_ID"]);
									   }
								    }
							},reqAprDetailCall);
					}
						
					else {
						currTab.find("#reqBasicInfo #"+k).text(data.info[k]);
					}
				}
			   
				/**********文档上传*********/
				var is_emergency_req = data.info["is_emergency_req"];//00:紧急需求，01：一般需求
				var req_state = data.info["req_state"];
				var business_code = "";
				var dic = "";
				if(is_emergency_req !='00'){//一般需求
					business_code = data.info["req_code"]==undefined?data.info["input_file_id"].toUpperCase():data.info["req_code"].toUpperCase();
					dic = 'S_DIC_REQ_PUT_FILE';
					currTab.find("a[name=normal]").show();
				}else{//紧急需求，审批通过后才有需求编号
					business_code = data.info["req_code"]==undefined?data.info["input_file_id"].toUpperCase():data.info["req_code"].toUpperCase();
					dic = 'S_DIC_EMREQ_PUT_FILE';
					currTab.find("a[name=emergent]").show();
				}
				
				if(req_state=='01' || is_emergency_req=='00'){//一般需求：草拟状态，不显示业务需求说明书补录；紧急需求：没有业务需求说明书，所以隐藏
					currTab.find("#reqAssessDiv").hide();
				}
				
				/*********需求申请书补录************/
				
				//上传
				/*var reqAssReturnCall=getMillisecond();*/
				baseAjaxJsonpNoCall(dev_application+"applicationManager/queryAppUserByRole.asp?user_no="+SID, {}, function(data){
						if(data["result"]=="true"){
							currTab.find("#reqApply_addfile").css("display","block");
							currTab.find("#reqApply_deletefile").css("display","block");
							currTab.find("#reqAssess_addfile").css("display","block");
							currTab.find("#reqAssess_deletefile").css("display","block");
						}
				},false);
				var reqApply_tablefile = currTab.find("#reqApply_tablefile");
				var apply_add = currTab.find("#reqApply_addfile");
				var paramObj = new Object();
				paramObj.FILE_DIR = business_code;
				paramObj.REQ_CODE = business_code;
				//删除
				var apply_del = currTab.find("#reqApply_deletefile");
				apply_del.click(function(){
					if(req_state!="10"&&req_state!="11"&&req_state!="12"&&req_state!="08"){//审批前的状态,按照file_id来删除，加载文档
						delSvnFile(reqApply_tablefile, data.info["input_file_id"].toUpperCase(), "0101");
					}else{//审批后的按照需求编号来删除文档
						delSvnFile(reqApply_tablefile, business_code, "0101");
					}
				});
				
				if(req_state!="10"&&req_state!="11"&&req_state!="12"&&req_state!="08"){//审批前的状态,按照file_id来删除，加载文档
					apply_add.click(function(){
						paramObj.FILE_DIR = data.info["input_file_id"].toUpperCase();
						if(is_emergency_req !='00'){//一般需求
							openFileSvnUpload(currTab.find("#reqApply_filemudel"), reqApply_tablefile, 'GZ1063',data.info["input_file_id"].toUpperCase(), '0101', dic, false, false, paramObj);
						}else{
							//paramObj.FILE_DIR = business_code;
							openFileSvnUpload(currTab.find("#reqApply_filemudel"), reqApply_tablefile, 'GZ1076',data.info["input_file_id"].toUpperCase(), '0101', dic, false, false, paramObj);
						}
					});
					//初始化文件列表
					getSvnFileList(reqApply_tablefile,currTab.find("#reqApply_filelist"), data.info["input_file_id"].toUpperCase(), "0101");
				}else{//审批后的按照需求编号来删除，加载文档
					paramObj.SYSTEM_NAME = currTab.find("#system_name").text();
					apply_add.click(function(){
						var system_name=getCurrentPageObj().find("#system_name").text();
						if(system_name==null || system_name=="" || system_name==undefined){
							alert("请联系系统管理员补充需求的应用名称");
							return;
						}
						openFileSvnUpload(currTab.find("#reqApply_filemudel"), reqApply_tablefile, 'GZ1066',business_code, '0101', dic, false, false, paramObj);
					});
					//初始化文件列表
					getSvnFileList(reqApply_tablefile,currTab.find("#reqApply_filelist"), business_code, "0101");
				}
				
				
				
				/*************业务需求说明书补录**************/
				var reqAssess_tablefile = currTab.find("#reqAssess_tablefile");
				//上传按钮
				var assess_add = currTab.find("#reqAssess_addfile");
				//删除
				var assess_del = currTab.find("#reqAssess_deletefile");
				assess_del.click(function(){
					if(req_state!="10"&&req_state!="11"&&req_state!="12"&&req_state!="08"){//审批前的状态,按照file_id来删除，加载文档
						delSvnFile(reqAssess_tablefile,data.info["accept_file_id"].toUpperCase(), "0102");	
					}else{//审批后的按照需求编号来删除文档
						delSvnFile(reqAssess_tablefile, business_code, "0102");	
					}
				});
				if(req_state!="10"&&req_state!="11"&&req_state!="12"&&req_state!="08"){//审批前的状态,按照file_id来删除，加载文档
					var accept_file_id = data.info["accept_file_id"]==undefined?"1":data.info["accept_file_id"];
					paramObj.FILE_DIR = accept_file_id.toUpperCase();
					assess_add.click(function(){
						openFileSvnUpload(getCurrentPageObj().find("#reqApply_filemudel"), reqAssess_tablefile, 'GZ1063',accept_file_id.toUpperCase(), '0102', 'S_DIC_REQ_ACC_FILE', false, false, paramObj);	
					});
					//初始化附件列表
					getSvnFileList(reqAssess_tablefile, getCurrentPageObj().find("#reqAssess_filelist"), accept_file_id.toUpperCase(), "0102");
				}else{//审批后的按照需求编号来删除，加载文档
					paramObj.SYSTEM_NAME = getCurrentPageObj().find("#system_name").text();
					assess_add.click(function(){
						var system_name=getCurrentPageObj().find("#system_name").text();
						if(system_name==null || system_name=="" || system_name==undefined){
							alert("请联系系统管理员补充需求的应用名称");
							return;
						}
						openFileSvnUpload(getCurrentPageObj().find("#reqApply_filemudel"), reqAssess_tablefile, 'GZ1067',business_code, '0102', 'S_DIC_REQ_ACC_FILE', false, false, paramObj);	
					});
					//初始化附件列表
					getSvnFileList(reqAssess_tablefile, getCurrentPageObj().find("#reqAssess_filelist"), business_code, "0102");
				}
			}
		}
	}, call_req);
	
	
	
	
	//需求点列表
	var call_subReq = getMillisecond()+'2';
	var queryParams_subReq = function(params){
		var temp = {};
		temp["limit"] = params.limit;
		temp["offset"] = params.offset;
		return temp;
	};
	getCurrentPageObj().find("#subReqTable").bootstrapTable(
			{
				url : dev_construction+'GFollowerTask/querySubReqListinView.asp?call='+call_subReq+'&SID='+SID+'&req_id='+p,
				method : 'get', //请求方式（*）   
				striped : false, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams_subReq,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				//pagination : false, //是否显示分页（*）
				pageList : [5,10],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 10,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "SUB_REQ_ID", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: true,
				jsonpCallback: call_subReq,
				onLoadSuccess:function(data){
					gaveInfo();
				},
				columns : [ {
					checkbox : true,
					rowspan : 2,
					align : 'center',
					valign : 'middle'
				},{
					field: 'SUB_REQ_ID',
					title : '需求点ID',
					align : "center",
					visible: false
				},{
					field : 'SUB_REQ_CODE',
					title : '需求点编号',
					align : 'center'
				},{
					field : 'SUB_REQ_NAME',
					title : '需求点名称',
					align : 'center'
				},{
					field : 'SUB_STATE',
					title : '需求点状态',
					align : 'center'
				},{
					field : 'PLAN_ONLINETIME',
					title : '计划投产时间',
					align : "center"
				},{
					field : 'SUB_REQ_CONTENT',
					title : '需求点描述',
					align : "center",
				}]
			});
	
	//需求任务列表
	var call_reqTask = getMillisecond()+'2';
	var queryParams_reqTask = function(params){
		var temp = {};
		temp["limit"] = params.limit;
		temp["offset"] = params.offset;
		return temp;
	};
	getCurrentPageObj().find("#reqTaskTable").bootstrapTable(
			{
				url : dev_construction+'GFollowerTask/queryReqTaskListinView.asp?call='+call_reqTask+'&SID='+SID+'&req_id='+p,
				method : 'get', //请求方式（*）   
				striped : false, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams_reqTask,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				//pagination : false, //是否显示分页（*）
				pageList : [5,10],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 10,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: true,
				jsonpCallback: call_reqTask,
				onLoadSuccess:function(data){
					gaveInfo();
				},
				columns : [ {
					checkbox : true,
					rowspan : 2,
					align : 'center',
					valign : 'middle'
				},{
					field: 'REQ_TASK_ID',
					title : '任务ID',
					align : "center",
					visible: false
				},{
					field : 'REQ_TASK_CODE',
					title : '任务编号',
					align : 'center'
				},{
					field : 'REQ_TASK_NAME',
					title : '任务名称',
					align : 'center'
				},{
					field : 'SUB_REQ_CODE',
					title : '需求点编号',
					align : 'center',
					visible : false
				},{
					field : 'REQ_TASK_RELATION_NAME',
					title : '从属关系',
					align : "center",
					width : 80,
				},{
					field : 'REQ_TASK_STATE_NAME',
					title : '任务状态',
					align : "center",
					formatter:function(value,row,index){if(value!=0){return '<span  style="font-weight:bold;text-align: center; width: 110px; ";>'+row.REQ_TASK_STATE_NAME+'</span>';}}
					
				}, {
					field : "SYSTEM_NAME",
					title : "所属应用",
					align : "center",
					width : 80,
				},/*{
					field : "SUM_WORKLOAD",
					title : "估算工作量",
					align : "center",
				},*/{
					field : "PROJECT_NUM",
					title : "所属项目编号",
					align : "center",
					visible : false
				},{
					field : "VERSION_NAME",
					title : "所属版本",
					align : "center"
				},{
					field : "P_OWNER_NAME",
					title : "任务项目经理",
					align : "center",
					width : 80,
				},{
					field : "CREATE_TIME",
					title : "创建时间",
					align : "center",
				} ]
			});
}

initReq360Btn();
function initReq360Btn(){
	//查看需求点详情
	
	getCurrentPageObj().find('#subReqDetail_view').click(function(){
		var id = getCurrentPageObj().find("#subReqTable").bootstrapTable('getSelections');
		var req_id=$.map(id, function (row) {return row.REQ_ID;});
		var req_acc2=$.map(id, function (row) {return row.REQ_ACC_CLASSIFY;});
		var sub_req_id=$.map(id, function (row) {return row.SUB_REQ_ID;});
		var detail="00";
		var type="00";
		if(id.length==1){
			var call = getMillisecond();
			baseAjaxJsonp(dev_construction+"requirement_splitTask/querySplitTaskList.asp?SID="+SID+"&call="+call+"&sub_req_id="+sub_req_id+"&limit="+"10"+"&offset="+"0"+"&detail="+detail+"&type="+type,null, function(data){
				closeAndOpenInnerPageTab("req_splitTask_detail","需求点详情页面","dev_construction/requirement/requirement_analyze/split_task/splitTask_detail.html",function(){
					initSplitTaskDetailLayOut(data.rows[0]);
				});
			}, call);
			/*if(req_acc2=="00"){
				closeAndOpenInnerPageTab("emsubreq_detail","紧急需求点详情","dev_construction/requirement/requirement_analyze/split_subreq/splitEmSubreq_detail.html",function(){
					initEmReqSplitDetail(req_id);//初始化页面信息
					});	
			}
			else{
				closeAndOpenInnerPageTab("subreq_detail","需求点详情","dev_construction/requirement/requirement_analyze/split_subreq/splitSubreq_detail.html",function(){
				initSplitReqDetailLayOut(req_id);
				});
			}*/
			
//			closeAndOpenInnerPageTab("subreq_detail","需求点详情","dev_construction/requirement/requirement_analyze/split_subreq/splitSubreq_detail.html",function(){
//				initSplitReqDetailLayOut(req_id);
//			});
		}else{
			alert("请选择一条子需求进行查看");
		}
	});
	
	//查看任务详情
    getCurrentPageObj().find('#taskDetail_view').click(function(){
		var id = getCurrentPageObj().find("#reqTaskTable").bootstrapTable('getSelections');
		var req_task_id=$.map(id, function (row) {return row.REQ_TASK_ID;});
		if(id.length==1){
			closeAndOpenInnerPageTab("req_taskDetail","任务详情页面","dev_construction/requirement/requirement_analyze/task_accept/task_detail.html",function(){
				initReqTaskDetailLayout(req_task_id);
			  });
		}else{
			alert("请选择一条任务进行查看");
		}
	});
    
    //查看跟踪任务详情
    getCurrentPageObj().find('#followTaskDetail_view').click(function(){
		var id = getCurrentPageObj().find("#gGFollowerTaskTable").bootstrapTable('getSelections');
		var req_task_id=$.map(id, function (row) {return row.REQ_TASK_ID;});
		if(id.length==1){
			closeAndOpenInnerPageTab("req_taskDetail","任务详情页面","dev_construction/requirement/requirement_analyze/task_accept/task_detail.html",function(){
				initReqTaskDetailLayout(req_task_id);
			  });
		}else{
			alert("请选择一条任务进行查看");
		}
	});
}

//查看项目的360视图
function viewProjectInfo(index) {
	
}

//第二个页签-----------------------------------------------------------------------


//初始化列表
function initFollowerTaskQuery(p) {
	// 页码
	var queryParams = function(params) {
		var temp = {
			limit : params.limit, // 页面大小
			offset : params.offset
		};
		return temp;
	};
	getCurrentPageObj().find('#gGFollowerTaskTable').bootstrapTable("destroy").bootstrapTable({
		url :dev_construction+"GFollowerTask/queryFollowerTaskListByReqId.asp?SID="+SID+'&req_id='+p,
		method : 'get', // 请求方式（*）
		striped : false, // 是否显示行间隔色
		cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, // 是否启用排序
		sortOrder : "asc", // 排序方式
		queryParams : queryParams,// 传递参数（*）
		sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
		//pagination : true, // 是否显示分页（*）
		pageList : [ 5, 10, 15 ], // 可供选择的每页的行数（*）
		pageNumber : 1, // 初始化加载第一页，默认第一页
		pageSize : 10, // 每页的记录行数（*）
		clickToSelect : true, // 是否启用点击选中行
		// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
		uniqueId : "REQ_TASK_CODE", // 每一行的唯一标识，一般为主键列
		cardView : false, // 是否显示详细视图
		detailView : false, // 是否显示父子表
		singleSelect : false,// 复选框单选
		onLoadSuccess:function(data){
			gaveInfo();
		},
		columns : [ {
			checkbox : true,
			rowspan : 2,
			align : 'center',
			valign : 'middle'
		},{
			field : 'REQ_TASK_ID',
			title : '任务序列号',
			align : "center",
			visible:false,
		},{
			field : 'SUB_REQ_ID',
			title : '需求点序列号',
			align : "center",
			visible:false,
		},{
			field : 'REQ_ID',
			title : '需求序列号',
			align : "center",
			visible:false,
		},{
			field : 'REQ_TASK_CODE',
			title : '任务编号',
			align : "center",
		}, {
			field : 'REQ_TASK_NAME',
			title : '任务名称',
			align : "center"
		}, {
			field : 'SYSTEM_NAME',
			title : '应用名称',
			align : "center"
		},{
			field : "SUB_REQ_NAME",
			title : "需求点名称",
			align : "center"
		},{
			field : "VERSION_NAME",
			title : "申请纳入版本",
			align : "center",
		}, {
			field : "REQ_TASK_RELATION_NAME",
			title : "从属关系",
			align : "center"
		}, {
			field : "REQ_TASK_STATE_DISPLAY",
			title : "任务状态",
			align : "center"
		}, {
			field : "ANALYZE_STATE",
			title : "需求分析",
			align : "center",
//						formatter:function(value,row,index){if(value>0){return "查看";}return "--";}
			formatter:function(value,row,index){if(value>0){return '<a style="color:blue" href="javascript:void(0)" onclick="phasedFollower(03,\''+row.REQ_TASK_ID+'\',\''+row.REQ_TASK_CODE+'\')";>查看</a>';}return "--";}
		},{
			field : "SUMMARY_STATE",
			title : "设计开发",
			align : "center",
			formatter:function(value,row,index){if(value>0){return '<a style="color:blue" href="javascript:void(0)" onclick="phasedFollower(05,\''+row.REQ_TASK_ID+'\',\''+row.REQ_TASK_CODE+'\')";>查看</a>';}return "--";}
		},/*{
			field : "DETAILDESIGN_STATE",
			title : "详细设计",
			align : "center",
			formatter:function(value,row,index){if(value>0){return '<a style="color:blue" href="javascript:void(0)" onclick="phasedFollower(06,\''+row.REQ_TASK_ID+'\')";>查看</a>';}return "--";}
		},*/{
			field : "SIT_CASE_STATE",
			title : "SIT测试",
			align : "center",
			formatter:function(value,row,index){if(value>0){return '<a style="color:blue" href="javascript:void(0)" onclick="phasedFollower(09001,\''+row.REQ_TASK_ID+'\',\''+row.REQ_TASK_CODE+'\')";>查看</a>';}return "--";}
		}/*,{
			field : "UAT_STATE",
			title : "UAT测试",
			align : "center",
			formatter:function(value,row,index){if(value>0){return '<a style="color:blue" href="javascript:void(0)" onclick="phasedFollower(10,\''+row.REQ_TASK_ID+'\')";>查看</a>';}return "--";}
		}*/]
	});
}

//根据不同阶段的任务信息
function phasedFollower(task_state,req_task_id,req_task_code){
	var text="";
	//closeAndOpenInnerPageTab("task_analyze_info",text+"详情","dev_construction/requirement/reqTask_phased/reqTaskFile_info.html",function(){
	var params = {};
	params['req_task_id'] = req_task_id;
	params["phased_state"]=task_state;
	params['REQ_TASK_CODE']=req_task_code.toString();
	if(task_state=='03'){
		params['phase']='req_task_analyze';
		text="任务分析文档详情";
	}else if(task_state=='05'){
		params['phase']='req_task_summary';
		text="设计开发文档详情";
	}else if(task_state=='06'){
		params['phase']='req_task_design';
		text="详细设计文档详情";
	}else if(task_state=='07'){
		params['phase']='req_task_unit_test';
		text="编码开发文档详情";
	}else if(task_state=='08'){
		params['phase']='req_task_joint';
		text="联调测试文档详情";
	}else if(task_state=='09001'){
		params['phase']='req_sit_file';
		text="SIT测试案例文档详情";
	}else if(task_state=='10'){
		params['phase']='req_uat_file';
		text="UAT测试文档详情";
	}
	
	var taskCall = getMillisecond();
	 baseAjaxJsonp(dev_construction+"GTaskPhased/queryTaskPhasedById.asp?SID="+SID+"&call="+taskCall, params , function(data) {
		if (data != undefined && data != null && data.result=="true") {
			viewPhaseTaskDetail(task_state,data.data[0],text);
		}
	},taskCall);
}

//第三个页签-----------------------------------------------------------------------
//需求变更列表
var $page = getCurrentPageObj();//当前页
//初始化列表
function reqChange_info(p) {
	var QueryCall = getMillisecond()+'2';
	// 页码
	var queryParams = function(params) {
		var temp = {
			limit : params.limit, // 页面大小
			offset : params.offset
		};
		return temp;
	};
	getCurrentPageObj().find('#reqChange_info').bootstrapTable("destroy").bootstrapTable({
		url :dev_construction+"requirement_change/queryApproveList.asp?SID=" + SID + "&TYPE=3&call=" + QueryCall+"&REQ_ID="+p,
		method : 'get', // 请求方式（*）
		striped : false, // 是否显示行间隔色
		cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, // 是否启用排序
		sortOrder : "asc", // 排序方式
		queryParams : queryParams,// 传递参数（*）
		sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
		pagination : true, // 是否显示分页（*）
		pageList : [ 5, 10, 15 ], // 可供选择的每页的行数（*）
		pageNumber : 1, // 初始化加载第一页，默认第一页
		pageSize : 10, // 每页的记录行数（*）
		clickToSelect : true, // 是否启用点击选中行
		// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
		uniqueId : "REQ_CHANGE_ID", // 每一行的唯一标识，一般为主键列
		cardView : false, // 是否显示详细视图
		detailView : false, // 是否显示父子表
		singleSelect : true,// 复选框单选
		jsonpCallback:QueryCall,
		onLoadSuccess : function(data){
			gaveInfo();
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
			width : "7%",
			formatter:function(value,row,index){
				return index + 1;
			}
		}, {
			field : "REQ_CODE",
			title : "需求编号",
			width : "15%",
			align : "center"
		}, {
			field : "REQ_NAME",
			title : "需求名称",
			width : "18%",
			align : "center"
		}, {
			field : "REQ_CHANGE_STATUS_NAME",
			title : "需求变更状态",
			width : "15%",
			align : "center"
		},{
			field : "CHANGE_BUSINESSER",
			title : "业务联系人",
			width : "12%",
			align : "center"
		}, {
			field : "CREATE_NAME",
			title : "申请人",
			align : "center",
			width : "13%"
		},  {
			field : "SUBMIT_TIME",
			title : "申请时间",
			align : "center",
			width : "15%"
		}]
	});
}

//需求变更查看详情
$page.find("#reqChangDetail_view").click(function(){
	var QueryTable = $page.find("#reqChange_info");
	 var seles = QueryTable.bootstrapTable("getSelections");
		if(seles.length!=1){
				alert("请选择一条数据进行查看!");
				return;
		}
		var state = seles[0].REQ_CHANGE_STATUS;
		if(state == '03' || state == '04' || state == '05'){
			closeAndOpenInnerPageTab("QviewQuery","查看申请单","dev_construction/requirement/requirement_change/query/changeQuery_view.html", function(){
			 initTitle(seles[0].INSTANCE_ID);
			 initAFApprovalInfo(seles[0].INSTANCE_ID,'0');
			 changeQueryView(seles[0]);
			});
		}
		if(state == '01'){
			 closeAndOpenInnerPageTab("QviewApply","查看申请单","dev_construction/requirement/requirement_change/initiate/changeInitiate_view.html", function(){
				 changeInitiateView(seles[0]);
			});
			
		}
		if(state == '02'){
			 closeAndOpenInnerPageTab("QviewAnalyze","查看申请单","dev_construction/requirement/requirement_change/analyze/changeAnalyze_view.html", function(){
				 changeAnalyzeView(seles[0]);
			});
			
		}
		
});

//第三个页签-----------------------------------------------------------------------
////需求终止列表
//初始化列表
function reqStop_info(p) {
	var QueryCall = getMillisecond()+'2';
	// 页码
	var queryParams = function(params) {
		var temp = {
			limit : params.limit, // 页面大小
			offset : params.offset
		};
		return temp;
	};
	getCurrentPageObj().find('#reqStop_info').bootstrapTable("destroy").bootstrapTable({
		url :dev_construction+"req_terminate/queryReqTerminateList.asp?SID=" + SID + "&call=" + QueryCall + "&TYPE=4"+"&REQ_ID="+p,
		method : 'get', // 请求方式（*）
		striped : false, // 是否显示行间隔色
		cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, // 是否启用排序
		sortOrder : "asc", // 排序方式
		queryParams : queryParams,// 传递参数（*）
		sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
		pagination : true, // 是否显示分页（*）
		pageList : [ 5, 10, 15 ], // 可供选择的每页的行数（*）
		pageNumber : 1, // 初始化加载第一页，默认第一页
		pageSize : 10, // 每页的记录行数（*）
		clickToSelect : true, // 是否启用点击选中行
		// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
		uniqueId : "REQ_TERMINATE_ID", // 每一行的唯一标识，一般为主键列
		cardView : false, // 是否显示详细视图
		detailView : false, // 是否显示父子表
		singleSelect : true,// 复选框单选
		jsonpCallback:QueryCall,
		onLoadSuccess : function(data){
			gaveInfo();
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
			width : "10%",
			formatter:function(value,row,index){
				return index + 1;
			}
		},{
			field : "REQ_CODE",
			title : "需求编号",
			width : "20%",
			align : "center"
		}, {
			field : "REQ_NAME",
			title : "需求名称",
			width : "20%",
			align : "center"
		},{
			field : 'REQ_TERMINATE_STATE_NAME',
			title : '申请单状态',
			width : "15%",
			align : "center",
		},{
			field : "CREATE_NAME",
			title : "申请人",
			align : "center",
			width : "15%"
		},  {
			field : "CREATE_TIME",
			title : "申请时间",
			align : "center",
			width : "15%"
		}]
	});
}
//查看申请单
$page.find("#reqStopDetail_view").click(function(){
	var QueryTable = $page.find("#reqStop_info");
	 var seles = QueryTable.bootstrapTable("getSelections");
		if(seles.length!=1){
				alert("请选择一条数据进行查看!");
				return;
		}
		closeAndOpenInnerPageTab("viewQuery","查看申请单","dev_construction/requirement/requirement_terminate/query/query_view.html", function(){
			terQueryEdit(seles[0]);
		});
			
});

var instance_id="";
function initcontentPop(){
	getCurrentPageObj().find('#apphistoryPop').empty();
	getCurrentPageObj().find('#apphistoryPop').append(
		'<div class="ecitic-title">'+
			'<span>流程审批列表<em></em></span>'+
		'</div>'+
		'<div class="ecitic-new">'+
			'<table id="AFApprovalTableInfo" class="table table-bordered table-hover"></table>'+
		'</div>'		
	);

}

var tableCall = getMillisecond();
/*审批列表表格初始化列表*/
function initReqApprovalDetailInfo(instance_id) {
	this.instance_id=instance_id;
	initcontentPop();
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	
	getCurrentPageObj().find('#AFApprovalTableInfo').bootstrapTable({
		url :'AFLaunch/queryAFApprovalLists.asp?instance_id='+instance_id+"&call="+tableCall,
		method : 'get', //请求方式（*）   
		striped : true, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : false, //是否显示分页（*）
		pageList : [5,10],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : false, //是否启用点击选中行
		uniqueId : "af_id", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:tableCall,
		singleSelect: true,
		onLoadSuccess:function (){
			setRowspan("AFApprovalTableInfo");
		},
		columns : [{
			field : 'N_ID',
			title : '审批节点id',
			align : "center",
			visible:false
		},{
			field : 'N_NAME',
			title : '审批岗位',
			align : "center",
			valign: "middle"
		}, {
			field : "APP_PERSON",
			title : "工号",
			align : "center",
			visible:false
		}, {
			field : "APP_PERSON_NAME",
			title : "审批人",
			align : "center"
		}, {
			field : "APP_STATE",
			title : "操作",
			align : "center",
			formatter:function(value,row,index){
        	  if(row.STATE_NAME){
        		  return row.STATE_NAME;
        	  } 
        	  return '--';
          }
		}, {
			field : "APP_CONTENT",
			title : "审批意见",
			align : "center"
		}, {
			field : "OPT_TIME",
			title : "审批时间",
			align : "center"
		}]
	});
}
//合并单元格
function setRowspan(id){
	var tabledata=getCurrentPageObj().find('#'+id).bootstrapTable('getData');
	var n_name = tabledata[0].N_NAME;
	var j=0;
	var k=1;
	for(var i=1;i<tabledata.length;i++){
		if(n_name!=tabledata[i].N_NAME){
			getCurrentPageObj().find('#'+id).bootstrapTable('mergeCells',{index:j,field:'N_NAME',colspan:1,rowspan:k});
			j=i;
			k=1;
			n_name=tabledata[i].N_NAME;
		}else{
			k++;
		}
	}
	getCurrentPageObj().find('#'+id).bootstrapTable('mergeCells',{index:j,field:'N_NAME',colspan:1,rowspan:k});
}







