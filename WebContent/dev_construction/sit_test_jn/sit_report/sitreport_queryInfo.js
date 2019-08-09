	
function initviewsitReport(item){
	var currTab = getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题

	var table = currTab.find("#table_sit");
	var queryParams = {};
	queryParams["req_task_id"] = item.REQ_TASK_ID;	
	currTab.find("#req_task_id").val(item.REQ_TASK_ID);
	//任务SIT移交记录列表
	table.bootstrapTable('destroy').bootstrapTable({
		//请求后台的URL（*）
		url : dev_construction+'GSitReport/queryListReportTask.asp?SID='+SID,
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
		uniqueId : "REPORT_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		//jsonpCallback:tableCall,
		singleSelect: true,
		columns : [ {
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		}, {
			field : 'SIT_START_TIME',
			title : '介入测试日期',
			align : "center"
		}, {
			field : "SIT_END_TIME",
			title : "测试完成日期",
			align : "center"
		}, {
			field : "TEST_NUM",
			title : "测试案例数",
			align : "center"
		}, {
			field : "ALLLEFTDEFECT_NUM",
			title : "总遗留缺陷数",
			align : "center"
		}, {
			field : "ALLDEFECT_NUM",
			title : "总缺陷数",
			align : "center"
		}, {
			field : "ACCEPT_RESULT",
			title : "验收结论",
			align : "center",
			formatter:function(value,row,index){if(value=="00"){return "通过";}return "不通过";}
		
		}, /*{
			field : "PUTIN_RESULT",
			title : "投产结论",
			align : "center",
			formatter:function(value,row,index){if(value=="00"){return "是";}return "否";}
		
		},*/ {
			field : "DID",
			title : "操作",
			align : "center",
			formatter: function (value, row, index) {
				return '<span class="hover-view" '+
				'onclick="initSitTaskInfo(\''+row.REPORT_ID+'\')">查看</span>';
			}
		}]
	});
	
	var business_codes = item.REQ_TASK_CODE;
	var tablefile = currTab.find("#table_file");

	//初始化附件列表
	getSvnFileList(tablefile,currTab.find("#file_view_modal"),business_codes, "09003");
	
	
	//返回
	var back = currTab.find("#back_sit");
	back.click(function(){
		closeCurrPageTab();
	});
	
}

function initSitTaskInfo(report_id){
	var currTab = getCurrentPageObj();
	currTab.find("#SIT_INFO").show();
	var call = getMillisecond();
	var param = {};
	param["req_task_id"] = currTab.find("#req_task_id").val();
	param["report_id"] = report_id;
	
	baseAjaxJsonp(dev_construction+"GSitReport/queryReportTaskById.asp?call="+call+"&SID="+SID,param, function(data){
		if (data != undefined && data != null && data.result=="true" ) {
			var reportMap = data.reportMap;
			for (var key in reportMap) {
				currTab.find("div[name="+key+"]").html(reportMap[key]);
			}
			var adefect_num = reportMap.ADEFECT_NUM;
			var adefect_passnum = reportMap.ADEFECT_PASSNUM;
			currTab.find("div[name='aleave']").html(adefect_num-adefect_passnum);
			var bdefect_num = reportMap.BDEFECT_NUM;
			var bdefect_passnum = reportMap.BDEFECT_PASSNUM;
			currTab.find("div[name='bleave']").html(bdefect_num-bdefect_passnum);
			var cdefect_num = reportMap.CDEFECT_NUM;
			var cdefect_passnum = reportMap.CDEFECT_PASSNUM;
			currTab.find("div[name='cleave']").html(cdefect_num-cdefect_passnum);
			var ddefect_num = reportMap.DDEFECT_NUM;
			var ddefect_passnum = reportMap.DDEFECT_PASSNUM;
			currTab.find("div[name='dleave']").html(ddefect_num-ddefect_passnum);
			var edefect_num = reportMap.EDEFECT_NUM;
			var edefect_passnum = reportMap.EDEFECT_PASSNUM;
			currTab.find("div[name='eleave']").html(edefect_num-edefect_passnum);
			
			currTab.find("div[name='allpass']").html(parseInt(adefect_passnum)
					+parseInt(bdefect_passnum)+parseInt(cdefect_passnum)+parseInt(ddefect_passnum)+parseInt(edefect_passnum));
		}else{ 
			alert(data.msg);
		}
	}, call);
	
//	table_report_taskInfo  queryTaskByReportId
	var table = currTab.find("#table_report_taskInfo");
	var tableCall = "report"+getMillisecond();
	table.bootstrapTable("destroy").bootstrapTable({
		//请求后台的URL（*）
		url : dev_construction+"GSitReport/queryTaskByReportId.asp?SID="+SID+"&call="+tableCall,
		method : 'get', //请求方式（*）
		striped : false, //是否显示行间隔色
		async:true,
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : param,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [10,15],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "REQ_TASK_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		jsonpCallback : tableCall,
		detailView : false, //是否显示父子表
		singleSelect: false,
		columns : [ {
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		},{
			field : 'aa',
			title : '序号',
			align : "center",
			formatter : function(value, row, index){
				return index+1;
			}
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
			field : "REQ_TASK_RELATION_NAME",
			title : "从属关系",
			align : "center"
		}, {
			field : "REQ_TASK_STATE_DISPLAY",
			title : "任务状态",
			align : "center"
		}, {
			field : "SYSTEM_NAME",
			title : "实施应用",
			align : "center",
		},{
			field : "CREATE_TIME",
			title : "创建时间",
			align : "center",
		},{
			field : "REQ_TASK_STATE",
			title : "需求任务状态",
			align : "center",
			visible:false,
		},{
			field : "REQ_TASK_CODE",
			title : "附件信息",
			align : "center",
			formatter:function(value,row,index){if(value!=undefined&&value!=""&&value!=null){return '<a style="color:blue" href="javascript:void(0)" onclick="phasedFollower(09003,\''+row.REQ_TASK_ID+'\',\''+row.REQ_TASK_CODE+'\')";>查看</a>';}return "--";}
		}]
	});
}

//根据不同阶段的任务信息
function phasedFollower(task_state,req_task_id,req_task_code){
	var text="";
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
	}else if(task_state=='09003'){
		params['phase']='S_DIC_SIT_TEST_FILE';
		text="SIT测试报告文档详情";
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