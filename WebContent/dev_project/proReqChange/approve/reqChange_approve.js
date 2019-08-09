$(function(){
	$("#application_purpose").css("height","200px");
});

//按钮方法
function initChangeButtonEvent(req_change_id){	
	
	//保存
	getCurrentPageObj().find("#changeUp").click(function(){
		var change_code = getCurrentPageObj().find("#change_code").html();
		reqChangeApprOver(change_code,"01");
	});
	
	
	

	
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
			formatter:function(value,row,index){if(value!=undefined&&value!=" "){return '<a style="color:blue" href="javascript:void(0)" onclick="viewSubReqDetailChange(\''+row.REQ_ID+'\')";>'+value+'</a>';}return '--';}
		}, {
			field : 'REQ_TASK_NAME',
			title : '任务名称',
			align : "center",
			formatter:function(value,row,index){return '<a style="color:blue" href="javascript:void(0)" onclick="openReqTaskDetail(\''+row.REQ_TASK_ID+'\')";>'+value+'</a>';}
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
			field : "P_OWNER_NAME",
			title : "当前责任人",
			align : "center",
			
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


function viewSubReqDetailChange(req_id){
	closeAndOpenInnerPageTab("requirement_360view","业务需求360页面","dev_construction/requirement/reqTask_follower/requirement_360view.html",function(){
		initReqInfoInView(req_id);
		initFollowerTaskQuery(req_id);
		reqChange_info(req_id);
		reqStop_info(req_id);
	});
}


function reqChangeApprOver(change_code,type){
	
	var sendData = getCurrentPageObj().find("#tableChaneTaskInfo").bootstrapTable('getData');
	var taskInfos="";
	var old_versions_ids = "";
	taskInfo=$.map(sendData, function (row) {
		if(taskInfos==""){
			taskInfos = row.REQ_TASK_ID;
		}else{
			taskInfos = taskInfos+","+row.REQ_TASK_ID;
		}
		return row.REQ_TASK_ID;
	});

	var expertsCall = getMillisecond();
	var params = getPageParam("P");

	var system_name = getCurrentPageObj().find("#system_name_p").val();
    params['type'] = type;
    params['change_code'] = change_code;
    params['req_task_ids'] = taskInfos;
    params['system_name'] = system_name;
//    var chaneTaskData = getCurrentPageObj().find("#tableChaneTaskInfo").bootstrapTable('getData');
//	var owners = "";
//	for(var i=0;i<chaneTaskData.length;i++){
//		owners += chaneTaskData[i].P_OWNER+",";
//	}
//	owners = owners.substring(0, owners.length-1)+","+getCurrentPageObj().find("#sponsor_person").val();;
	var change_subtype = getCurrentPageObj().find("#change_subtype").val();
    var param2 = {};
	param2["b_id"] = getCurrentPageObj().find("#req_change_id").val();
	param2["b_code"] = getCurrentPageObj().find("#change_code").html();
	if(change_subtype=='03'){
		param2["b_name"] = getCurrentPageObj().find("#system_name").html()+getCurrentPageObj().find("#req_change_subtype_name").html()+"，调出版本为："+
						   getCurrentPageObj().find("#versions_name").html()+"，版本范围变更（变更编号："+param2["b_code"]+"）";
	}else{
		param2["b_name"] = getCurrentPageObj().find("#system_name").html()+getCurrentPageObj().find("#req_change_subtype_name").html()+"到"+
	   getCurrentPageObj().find("#versions_name").html()+"，版本范围变更（变更编号："+param2["b_code"]+"）";
	}
	if(type == '01') param2["b_name"]+"审批通过";
	if(type == '02') param2["b_name"]+"审批打回";
    baseAjaxJsonp(dev_project+'PChangeReq/upChangeApprove.asp?call='+expertsCall+'&SID='+SID,params, function(data) {
		if (data != undefined&&data!=null&&data.result=="true") {
			if(type=='03'){
				alert("拿回成功");
				getCurrentPageObj().find('#changeReqTableInfo').bootstrapTable('refresh',
						{url:dev_project+'PChangeReq/queryApproveList.asp?call='+expertsQuery+'&SID='+SID+"&type=2"});
			}else{
				//插入提醒
				var verChange_call = getMillisecond()+'1';
				var taskIntoVerCall = getMillisecond()+'2';
				if(change_subtype=='01' || change_subtype=='03'){//03版本调出，01紧急加塞
					baseAjaxJsonp(dev_project+'PChangeReq/queryAppRemindUser.asp?call='+verChange_call+'&SID='+SID+'&req_change_id='+param2["b_id"]+'&type=01',null, function(remindData) {
						//插入提醒
						baseAjaxJsonp(dev_workbench+"Remind/remindAdd.asp?SID="+SID+"&call="+taskIntoVerCall+"&remind_type=PUB2017156"+
								"&user_id="+remindData.ids,param2, function(mes){
							//变更审批插入提醒成功
						}, taskIntoVerCall);
					},verChange_call);
				}else{//02补充协办
					baseAjaxJsonp(dev_project+'PChangeReq/queryAppRemindUser.asp?call='+verChange_call+'&SID='+SID+'&req_change_id='+param2["b_id"]+'&type=02',null, function(remindData) {
						baseAjaxJsonp(dev_workbench+"Remind/remindAdd.asp?SID="+SID+"&call="+taskIntoVerCall+"&remind_type=PUB2017156"+
							"&user_id="+remindData.ids,param2, function(mes){
						//变更审批插入提醒成功
						}, taskIntoVerCall);
					},verChange_call);
				}
				alert("审批成功");
			}
		}else{
			alert("操作失败");
		}
	},expertsCall);
}

//打开任务详情页面
function openReqTaskDetail(req_task_id){
	closeAndOpenInnerPageTab("req_taskDetail","任务详情页面","dev_construction/requirement/requirement_analyze/task_accept/task_detail.html",function(){
		initReqTaskDetailLayout(req_task_id);
	  });
}


//$("#orgDivPop").load("pages/sorg/sorgPop.html");
//initAddExpertButtonEvent();

