;function initProblemQuenyInfoLayout(PROBLEM_ID){
	var currTab = getCurrentPageObj();
	var form = currTab.find("#problem_basic_table");
	
	//返回
	currTab.find("#back_problemInfo").click(function(){
		closeCurrPageTab();
	});
	
	//初始化数据信息。
	initLayout();
	function initLayout(){
		var call = getMillisecond();
		baseAjaxJsonp(dev_construction+"Problem/problemQueryInfo.asp?call="+call+"&SID="+SID+"&PROBLEM_ID="+PROBLEM_ID, null, function(result){
			//项目项目基本信息
			for(var i in result){
				currTab.find("span[name="+i+"]").html(result[i]);
				currTab.find("div[name="+i+"]").html(result[i]);
				currTab.find("input[name="+i+"]").val(result[i]);
				/*currTab.find("select[name="+i+"]").attr("value",result[i]);*/
				currTab.find("textarea[name="+i+"]").val(result[i]);
			}
			//返回两radio 可否数据中心处理：
			if(result.IS_DC_DEAL=="00"){
				currTab.find("div[name='IS_DC_DEAL']").html("是");
			}else{
				currTab.find("div[name='IS_DC_DEAL']").html("否");
			}
			//
			if(result.IS_SEND=="00"){
				currTab.find("div[name='IS_SEND']").html("是");
			}else{
				currTab.find("div[name='IS_SEND']").html("否");
			}
			TaskQueryList(PROBLEM_ID);
		},call);
	}

	
//查询问题单的所有  需求任务
function TaskQueryList(PROBLEM_ID){
	//显示   已经由问题单 分配出来的 需求任务！！！	
	/**		初始化table	**/
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	var currTab = getCurrentPageObj();
	var call = getMillisecond();
	var table = currTab.find("#problemapprove_quenyInfo_table");
	table.bootstrapTable('destroy').bootstrapTable({
		//请求后台的URL（*）
		url : dev_construction+'Problem/problemTaskQueryList.asp?call='+call+'&SID='+SID+'&PROBLEM_ID='+PROBLEM_ID,
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [10,15],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "REQ_TASK_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:call,
		singleSelect: true,
		columns : [ /*{
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		}, {
			field : 'REQ_TASK_ID',
			title : '需求任务ID',
			align : "center",
		}, */{
			field : 'REQ_TASK_RELATION_NAME',
			title : '从属关系',
			align : "center"
		}, {
			field : "SYSTEM_NAME",
			title : "实施应用",
			align : "center"
		}, {
			field : "PLANN_PRODUCT_TIME",
			title : "计划投产时间",
			align : "center"
		}, {
			field : "PLANN_SUBMIT_PRODUCT_TIME",
			title : "计划提交投产时间",
			align : "center"
		}, {
			field : "PERSON_AMOUNT",
			title : "工作量(人日)",
			align : "center"
		}, {
			field : "TASK_CONTENT",
			title : "优化内容",
			align : "center"
		}, {
			field : "PROJECT_MAN",
			title : "项目经理",
			align : "center"
		}, {
			field : "REQ_TASK_STATE_NAME",
			title : "状态",
			align : "center"
		}, {
			field : "REQ_TASK_CODE",
			title : "任务编号",
			align : "center"
		}]
	});
	
}




}