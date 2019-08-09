//初始化列表
function initProjectRange(row){
	var currTab = getCurrentPageObj();
	var table = currTab.find("#projectRangeTable");
	var tableCall = getMillisecond();
	var viewTask="1";
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	
	table.bootstrapTable('destroy').bootstrapTable({
		//请求后台的URL（*）
		url : dev_construction+"requirement_splitTask/queryTaskInfoProjectId.asp?SID="+SID+"&project_id="+row.PROJECT_ID+"&viewTask="+viewTask+"&call="+tableCall,
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [5,10],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "REQ_TASK_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:tableCall,
		singleSelect: true,
		onLoadSuccess:function(data){
			gaveInfo();
		},
		columns : [ {
			field : '序号',
			title : '序号',
			align : "center",
			width:50,
			formatter: function(value, row, index) {
				return index+1;
			},
			width: "4%"
		},{
			field : 'REQ_TASK_CODE',
			title : '任务编号',
			align : "center",
			width: "15%",
		},{
			field : "REQ_TASK_NAME",
			title : "任务名称",
			align : "center",
			formatter: function (value, row, index) {
				return '<span class="hover-view" '+
				'onclick="initRangeTaskInfo('+row.REQ_TASK_ID+')">'+value+'</span>';
			},
			width: "17%"
		},{
			field : 'REQ_TASK_TYPE_NAME',
			title : '任务类型',
			align : "center",
			width: "8.5%"
		},{
			field : "SUB_REQ_NAME",
			title : "需求点名称",
			align : "center",
			formatter: function (value, row, index) {
				return '<span class="hover-view" '+
				'onclick="initRangeReqInfo('+row.REQ_ID+')">'+value+'</span>';
			},
			width: "17%"
		},{
			field : 'REQ_TASK_RELATION_DISPLAY',
			title : '从属关系',
			align : "center",
			width: "8.5%"
		},{
			field : 'REQ_TASK_STATE_DISPLAY',
			title : '任务状态',
			align : "center",
			width: "10%",
			formatter:function(value,row,index){if(value!=0){return '<span  style="font-weight:bold;text-align: center; width: 110px; ";>'+row.REQ_TASK_STATE_DISPLAY+'</span>';}}
		
		}, {
			field : "SYSTEM_NAME",
			title : "应用名称",
			align : "center",
			width: "10%"
		}, {
			field : "DEMAND_TASK",
			title : "关联任务数",
			align : "center",formatter: function (value, row, index) {
				return '<span >'+value+'</span>';
			},
			width: "10%"
		}]
	});
}
//需求任务详情
function initRangeTaskInfo(req_task_id){
	closePageTab("req_taskDetail");
	openInnerPageTab("req_taskDetail","任务详情页面","dev_construction/requirement/requirement_analyze/task_accept/task_detail.html",function(){
		initReqTaskDetailLayout(req_task_id);
	});
}

//需求点详情
function initRangeReqInfo(req_id){
	closeAndOpenInnerPageTab("subreq_detail","需求点详情","dev_construction/requirement/requirement_analyze/split_subreq/splitSubreq_detail.html",function(){
		initSplitReqDetailLayOut(req_id);
	});
}
