function initviewproChange(data){
	var currTab = getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题
	var infoTable = currTab.find("#table_basic_info");
	currTab.find("#CHANGE_ID").hide();
	currTab.find("#PRESENT_USER").hide();
	var tableCall = getMillisecond();
	//新建应用项目，现有应用改造项目
	if(data.PROJECT_TYPE == "SYS_DIC_NEW_PROJECT" || data.PROJECT_TYPE == "SYS_DIC_NEW_VERSION_PROJECT"){
		infoTable.find("#VERSION_NAMETR").show();
	}else{
		infoTable.find("#VERSION_NAMETR").hide();
	}
	//赋值
	for(var i in data){
		infoTable.find("div[name="+i+"]").html(data[i]);
	}
	
	//列表显示
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	currTab.find("#plan_table_milestoneview").bootstrapTable({
		//请求后台的URL（*）
		url : dev_project + 'proChange/queryMilestoneByChangeId.asp?call='+tableCall+'&SID='+SID+'&change_id='+data["CHANGE_ID"],
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		//pagination : true, //是否显示分页（*）
		pageList : [5,10,15],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "CHANGE_RECORD_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:tableCall,
		singleSelect: true,
		columns : [{
			field : 'Number',
			title : '序号',
			width:30,
			align : "center",
			formatter: function (value, row, index) {
				return index+1;
			}
		}, {
			field : "PLAN_NAME",
			title : "里程碑名称",
			align : "center"
		}, {
			field : "IS_CHOICE_NAME",
			title : "是否必选",
			align : "center"
		}, {
			field : "BEFORE_END_TIME",
			title : "计划结束日期(调整前)",
			align : "center"
		}, {
			field : "AFTER_END_TIME",
			title : "计划结束日期(调整后)",
			align : "center"
		}, {
			field : "DIFF_DAY",
			title : "里程碑偏差（天）",
			align : "center"
		}, {
			field : "EXECUTE_STATUS_NAME",
			title : "执行状态",
			align : "center"
		}]
	});
	
}