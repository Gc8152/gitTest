initSitReportQueryListLayout();

function initSitReportQueryListLayout(){
	
	var currTab = getCurrentPageObj();
	var queryForm = currTab.find("#sitReport_View");
	var table = currTab.find("#sitreport_tableView");//列表
	var tableCall = getMillisecond();
	
	//初始化字典项
	autoInitSelect(queryForm);
	
 initSitTestReportBtn();
 function 	initSitTestReportBtn(){
	//加载版本pop
	currTab.find('#version_name').click(function(){
		openTaskVersionPop("vsersion_pop",{versionsid:getCurrentPageObj().find('#version_id'),versionsname:getCurrentPageObj().find('#version_name')});
	});
	//查询
	var query = currTab.find("#sitview_query");
	query.click(function(){
		var param = queryForm.serialize();		
		table.bootstrapTable('refresh',{url: dev_construction+"GSitReport/queryListSitReport.asp?SID="+SID+
		    "&call="+tableCall+"&menu=02"+"&"+param});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#sitview_query").click();});
	//重置
	var reset = currTab.find("#sitview_reset");
	reset.click(function(){
		queryForm[0].reset();
		currTab.find('#version_id').val("");
		currTab.find("select").select2();
	});
	
	
	/*查看详情*/
	var queryInfo = currTab.find("#sitreport_view");
	queryInfo.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行查看!");
			return ;
		}
		closeAndOpenInnerPageTab("queryInfo","查看SIT测试报告","dev_construction/sit_test_jn/sit_report/sitreport_queryInfo.html",function(){
			initviewsitReport(rows[0]);
			if(rows[0]&&rows[0]["INSTANCE_ID"]){
				initAFApprovalInfo(rows[0]["INSTANCE_ID"],'0');
			}
		});
	});
 }	
	
	/**		初始化table	**/
 initSitTestReportList();
 function initSitTestReportList(){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	table.bootstrapTable("destroy").bootstrapTable({
		//请求后台的URL（*）
		url : dev_construction+"GSitReport/queryListSitReport.asp?SID="+SID+"&call="+tableCall+"&menu=02",
		method : 'get', //请求方式（*）
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [5, 10, 15 ],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "REQ_TASK_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		jsonpCallback : tableCall,
		detailView : false, //是否显示父子表
		singleSelect: false,
		onLoadSuccess:function(data){
			gaveInfo();
		},
		columns : [ {
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
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
			field : 'SUB_REQ_CODE',
			title : '需求点编号',
			align : "center",
			width : "155",
			formatter:function(value,row,index){if(value!=undefined&&value!=" "){return '<a style="color:blue" href="javascript:void(0)" onclick="viewSubReqDetailTD(\''+row.REQ_ID+'\')";>'+value+'</a>';}return '--';}
		},{
			field : 'REQ_ID',
			title : '需求序列号',
			align : "center",
			visible:false,
		},{
			field : 'REQ_TASK_CODE',
			title : '任务编号',
			align : "center",
			visible:false,
		}, {
			field : 'REQ_TASK_NAME',
			title : '任务名称',
			align : "center",
			width :"15%", 
			visible:false,
		},{
			field : "SUB_REQ_NAME",
			title : "需求点名称",
			align : "center",
		}, {
			field : "REQ_TASK_RELATION_NAME",
			title : "从属关系",
			align : "center",
			visible:false,
		}, {
			field : "REQ_TASK_STATE_DISPLAY",
			title : "任务状态",
			align : "center",
		}, {
			field : "SYSTEM_NAME",
			title : "主办应用",
			align : "center",
		},{
			field : "PUTIN_RESULT_NAME",
			title : "测试结论",
			align : "center",
			formatter : function(value, row, index){
				if(value == null || value==""){
					return "无";
				}else{
					return value;
				}
			},
			visible:true,
		},{
			field : "ACCEPT_RESULT_NAME",
			title : "验证结论",
			align : "center",
			formatter : function(value, row, index){
				if(value == null || value==""){
					return "无";
				}else{
					return value;
				}
			}
		},{
			field : "P_TEST_NAME",
			title : "测试经理",
			align : "center",
		},{
			field : "P_OWNER_NAME",
			title : "测试负责人",
			align : "center",
		},{
			field : "CURR_ACTORNO_NAME",
			title : "当前审批人",
			align : "center",
			
		},{
			field : "CREATE_TIME",
			title : "创建时间",
			align : "center",
		},{
			field : "CHANGE_NAME",
			title : "需求变更",
			align : "center",
			formatter:function(value,row,index){
				 if(value=="" || value == undefined || value==null) 
					 return value;
				 else
					 return '<span  style="color:red; width: 110px; ";>'+value+'</span>';
					
			 },
		},{
			field : "REQ_TASK_STATE",
			title : "需求任务状态",
			align : "center",
			visible:false
		}, {
			field : "VERSION_NAME",
			title : "申请纳入版本",
			align : "center",
			formatter:function(value,row,index){if(value!=undefined&&value!=" "){return '<a style="color:blue" href="javascript:void(0)" onclick="openVersionDetail(\''+row.VERSION_ID+'\')";>'+value+'</a>';}return '--';}
		}, {
			field : "SYSTEMS2",
			title : "协办应用",
			align : "center",
			width : 280,
			formatter:function(value,row,index){
				if(value=="" || value == undefined || value==null){
					return "-";
				}else{
					 return value.substring(1,value.length-1);
				}
			 },
			
		}
		
		]
	});
 }
}
//打开版本详情页面
function openVersionDetail(version_id){
	 closePageTab("view_project");
	 var tCall=getMillisecond()+'2';
			baseAjaxJsonp(dev_construction+'annualVersion/queryListAnnualVersion.asp?SID='+SID+'&call='+tCall+"&versions_id="+version_id, null , function(data) {
				openInnerPageTab("view_project","查看计划","dev_construction/versionManage/annualVersionManage/annualVersionPlan_queryInfo.html", function(){
					initAnnualVersionViewEvent(data.rows[0]);
			});
		},tCall);

}

//查看需求点详情	
function viewSubReqDetailTD(req_id){
	closeAndOpenInnerPageTab("requirement_360view","业务需求360页面","dev_construction/requirement/reqTask_follower/requirement_360view.html",function(){
		initReqInfoInView(req_id);
		initFollowerTaskQuery(req_id);
		reqChange_info(req_id);
		reqStop_info(req_id);
	});
}