initQualityNoconfirmQueryLayOut();

function initQualityNoconfirmQueryLayOut(){
	var currTab = getCurrentPageObj();
	var queryForm = currTab.find("#qualityManage_query");
	var table = currTab.find("#PQManageQueryTable");
	var qualityQueryCall = getMillisecond();
//初始化页面下拉框的值
initNoConfirmQuerySelectVal();
function initNoConfirmQuerySelectVal(){
	initSelect(currTab.find("select[name='typ']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_TYP"});
	initSelect(currTab.find("select[name='grade']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_GRADE"});
}

//初始化列表
initNotConfirmQueryList();
function initNotConfirmQueryList(){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	
	table.bootstrapTable('destroy').bootstrapTable({
		//请求后台的URL（*）
		url : dev_project
			+'qualityManager/queryListQuality.asp?call='
			+qualityQueryCall+'&SID='+SID,
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
		jsonpCallback:qualityQueryCall,
		singleSelect: true,
		onLoadSuccess:function(data){
			gaveInfo();
		},
		columns : [{
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle',
		},{
			field : "PROJECT_NAME",
			title : "项目名称",
			align : "center",
			width : 200,
		},{
			field : "BUSINESS_CODE",
			title : "业务编号",
			align : "center",
			width : 180,
		},{
			field : "NO_CONFORM_NAME",
			title : "不符合项名称",
			align : "center",
			width : 180,
		},{
			field : "CHECK_NAME",
			title : "检查点名称",
			align : "center",
			width : 180,
		},{
			field : "GRADE_NAME",
			title : "不符合项等级",
			align : "center",
			width : 150,
		},{
			field : "QUALITY_STATUS_NAME",
			title : "不符合项状态",
			align : "center",
			width : 150,
		},{
			field : "FIND_DATE",
			title : "发现日期",
			align : "center",
			width : 130,
		},{
			field : "PRESENT_USER_NAME",
			title : "提出人",
			align : "center",
			width : 90,
		},{
			field : "DUTY_USER_NAME",
			title : "责任人",
			align : "center",
			width : 90,
		},{
			field : "DISPOSE_USER_NAME",
			title : "处理人",
			align : "center",
			width : 90,
		},{
			field : "REALITY_FINISH_TIME",
			title : "实际解决日期",
			align : "center",
			width : 150,
		},{
			field : "DESCR",
			title : "备注",
			align : "center",
			width : 100,
		}]
	});
}

//初始化页面按钮事件
initNoConfirmQueryBtnEvent();
function initNoConfirmQueryBtnEvent(){
	//查询按钮
	currTab.find("#commit").click(function(){
		var param = queryForm.serialize();
		table.bootstrapTable('refresh',{url : dev_project
			+ 'qualityManager/queryListQuality.asp?call='
			+ qualityQueryCall + '&SID=' + SID 
			+ "&"+param
			
		});
	});
	//enter按键绑定查询按钮事件
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#commit").click();});
	
	
	//重置按钮点击事件
	currTab.find("#reset").click(function(){
		queryForm.find("input").val("");
		queryForm.find("select").val(" ");//ie8下要重置为空格
		queryForm.find("select").select2();
	});
	
	//详情按钮事件
	currTab.find("#qualityManage_detail").click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行查看!");
			return ;
		}
		openInnerPageTab("qualityManage_queryInfo","查看不符合项","dev_project/qualityManage/qualityQuery/qualityManage_queryInfo.html",function(){
			initQualityManageInfoLayout(rows[0]);
		});
	});
}
}