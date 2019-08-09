var themecall = getMillisecond();
initNotConformConfigTab();
initBtnEvent();
initSelectVal();

//初始化页面下拉框的值
function initSelectVal(){
	initSelect(getCurrentPageObj().find("select[name='TYP']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_TYP"});
	initSelect(getCurrentPageObj().find("select[name='STATUS']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_PROJECT_STATUS"});
}

//初始化列表
function initNotConformConfigTab(){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	
	getCurrentPageObj().find("#PQManageTable").bootstrapTable('destroy').bootstrapTable({
		//请求后台的URL（*）
		url : dev_project
			+'qualityManager/queryListQuality.asp?call='
			+themecall+'&SID='+SID,
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
		uniqueId : "PROJECT_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:themecall,
		singleSelect: true,
		columns : [{
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle',
		}, {
			field : "PROJECT_NUM",
			title : "项目编号",
			align : "center",
		}, {
			field : "PROJECT_NAME",
			title : "项目名称",
			align : "center",
		}, {
			field : "PROJECT_TYPE_NAME",
			title : "项目类型",
			align : "center",
		}, {
			field : "PROJECT_MAN_NAME",
			title : "项目经理",
			align : "center",
		}, {
			field : "SYSTEM_NAME",
			title : "应用名称",
			align : "center",
		}, {
			field : "PRESENT_USER_NAME",
			title : "提出人",
			align : "center",
		},{
			field : "PROJECT_STATUS_NAME",
			title : "项目状态",
			align : "center"
		},{
			field : "QUALITY_STATUS_NAME",
			title : "不符合项状态",
			align : "center"
		}]
	});
}

//初始化页面按钮事件
function initBtnEvent(){
	var currTab = getCurrentPageObj();
	//查询按钮
	currTab.find("#commit").click(function(){
		var project_num = currTab.find("#project_num").val();
		var project_name = currTab.find("#project_name").val();
		var system_name = currTab.find("#system_name").val();
		var typ = currTab.find("#typ").val();
		var status = currTab.find("#status").val();
		
		getCurrentPageObj().find("#PQManageTable").bootstrapTable('refresh',{url : dev_project
			+ 'qualityManager/queryListQuality.asp?call='
			+ themecall + '&SID=' + SID + "&project_num="
			+ project_num + "&project_name=" + project_name
			+ "&system_name=" + system_name
			+ "&project_status=" + status
			+ "&typ=" + typ});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#commit").click();});
	//重置按钮点击事件
	$("#reset").click(function(){
		$("#qualityManage_query").find("input").val("");
		$("#qualityManage_query").find("select").val("");
		$("#qualityManage_query").find("select").select2();
	});
	//详情按钮事件
	$("#qualityManage_detail").click(function(){
		var rows = $("#PQManageTable").bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行查看!");
			return ;
		}
		openInnerPageTab("qualityManage_queryInfo","查看不符合项","dev_project/qualityManage/qualityManage_queryInfo.html",function(){
			initQualityManageInfoLayout(rows[0].QUALITY_ID);
		});
	});
}