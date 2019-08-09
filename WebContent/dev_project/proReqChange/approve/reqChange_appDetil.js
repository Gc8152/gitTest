$(function(){
	$("#application_purpose").css("height","200px");
	
});

//按钮方法
function initChangeButtonEvent(req_change_id){	
	initVerChangContent(req_change_id);
}

var initVerChange_call = getMillisecond();
/**
 * 初始化任务列表列表
 */
function initVerChangContent(req_change_id) {
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	//getCurrentPageObj().find("#sendProContent").bootstrapTable("destory");
	getCurrentPageObj().find("#tableChaneTaskInfo").bootstrapTable({
		url : dev_project+'PChangeReq/queryChangeVerTaskList.asp?call='+initVerChange_call+'&SID='+SID+'&req_change_id='+req_change_id,
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : false, //是否显示分页（*）
		pageList : [5,10],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "REQ_TASK_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		jsonpCallback: initVerChange_call,
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
			field : "P_OWNER",
			title : "当前责任人",
			align : "center",
			visible:false,
		},{
			field : "VERSION_NAME",
			title : "已纳入版本",
			align : "center",
		},{
			field : "REQ_TASK_STATE",
			title : "需求任务状态",
			align : "center",
			visible:false,
		}]
	});
}


function saveChange(change_state){
	var sendData = getCurrentPageObj().find("#tableChaneTaskInfo").bootstrapTable('getData');
	if(sendData.length == 0) {
		alert("没有要变更的任务！");
		return;
	}
	
	var taskInfos="";
	var old_versions_ids = "";
	taskInfo=$.map(sendData, function (row) {
		if(taskInfos==""){
			taskInfos = row.REQ_TASK_ID;
			old_versions_ids = row.VERSION_ID;
		}else{
			taskInfos = taskInfos+","+row.REQ_TASK_ID;
			old_versions_ids = old_versions_ids+","+row.VERSION_ID;
		}
		return row.REQ_TASK_ID;
	});
	var expertsCall = getMillisecond();
    var params = getPageParam("G");		//遍历当前页面的input,text,select
    params['change_state'] = change_state;
    params['req_task_ids'] = taskInfos;
    params['old_versions_ids'] = old_versions_ids;
	baseAjaxJsonp(dev_project+'PChangeReq/insertChangeReq.asp?call='+expertsCall+'&SID='+SID,params, function(data) {
		if (data != undefined&&data!=null&&data.result=="true") {
			closePageTab("changeReq_add");
			
			alert("添加成功");
		}else{
			alert("添加失败");
		}
	},expertsCall);
}


//$("#orgDivPop").load("pages/sorg/sorgPop.html");
//initAddExpertButtonEvent();
initSUserType();
