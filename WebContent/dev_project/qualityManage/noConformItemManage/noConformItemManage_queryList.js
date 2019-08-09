
initQualityNoConfirmManage();
function initQualityNoConfirmManage(){
	var currTab = getCurrentPageObj();
	var queryForm = currTab.find("#noConformItemManage_query");
	var table = currTab.find("#noConformItemManageTable");
	var noConfirmManagecall = getMillisecond();
	
	
//初始化页面下拉框的值
initNoConfirmManageSelectVal();
function initNoConfirmManageSelectVal(){
	initSelect(currTab.find("select[name='typ']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_TYP"});
	initSelect(currTab.find("select[name='grade']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_GRADE"});
}
//初始化列表
initNoConfirmManageList();
function initNoConfirmManageList(){
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
			+noConfirmManagecall+'&SID='+SID+"&flag=3",
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
		jsonpCallback:noConfirmManagecall,
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
		}, {
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

//计算两日期差
function daysBetween(sDate1,sDate2){
    var time1 = Date.parse(new Date(sDate1));
    var time2 = Date.parse(new Date(sDate2));
    var nDays = Math.abs(parseInt((time2 - time1)/1000/3600/24));
    return  nDays;
};

//初始化页面按钮事件
initNoConfirmManageBtnEvent();
function initNoConfirmManageBtnEvent(){
	//查询按钮
	currTab.find("#manageCommit").click(function(){
		var param = queryForm.serialize();
		
	table.bootstrapTable('refresh',{url : dev_project
			+ 'qualityManager/queryListQuality.asp?call='
			+ noConfirmManagecall + '&SID=' + SID
			+"&"+param+"&flag=3"});
	});
	enterEventRegister(currTab.attr("class"), function(){currTab.find("#manageCommit").click();});
	
	//重置按钮点击事件
	currTab.find("#manageReset").click(function(){
		queryForm.find("input").val("");
		queryForm.find("select").val(" ");//ie8下需要重置为空格
		queryForm.find("select").select2();
	});
	
	//处理按钮事件
	currTab.find("#qualityManageManage_handle").click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行处理!");
			return ;
		}
		if(rows[0].QUALITY_STATUS !== "03"){
			alert("这条数据不是待处理状态，不能进行处理!");
			return ;
		}
		openInnerPageTab("qualityManage_handle","处理不符合项","dev_project/qualityManage/noConformItemManage/noConformItemManage_handle.html",function(){
			initQualityManageHandleLayout(rows[0]);
		});
		
	});
	//详情按钮事件
	currTab.find("#qualityManageManage_detail").click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行查看!");
			return ;
		}
		closeAndOpenInnerPageTab("qualityManageManage_queryInfo","查看不符合项","dev_project/qualityManage/qualityQuery/qualityManage_queryInfo.html",function(){
			initQualityManageInfoLayout(rows[0]);
		});
	});
}
}
