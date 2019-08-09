var noConfirmItemRaisecall = getMillisecond();
initSelectVal();

//初始化页面下拉框的值
function initSelectVal(){
	initSelect(getCurrentPageObj().find("select[name='typ']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_TYP"});
	initSelect(getCurrentPageObj().find("select[name='grade']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_GRADE"});
}

//初始化列表
function initNotConformQualityTab(project_id){
	var currTab = getCurrentPageObj();
	var table = currTab.find("#noConformItemTable");
	var currentLoginUser = $("#currentLoginNo").val();
	//查询按钮
	currTab.find("#raiseCommit").click(function(){
		var param = currTab.find("#noConformItem_query").serialize();
		table.bootstrapTable('refresh',{url : dev_project
			+ 'qualityManager/queryListQuality.asp?call='
			+ noConfirmItemRaisecall + '&SID=' + SID
			+ "&"+param+"&project_id="+project_id});
			
	});

	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#raiseCommit").click();});
	//重置按钮点击事件
	currTab.find("#raiseReset").click(function(){
		currTab.find("#noConformItem_query").find("input").val("");
		currTab.find("#noConformItem_query").find("select").val(" ");
		currTab.find("#noConformItem_query").find("select").select2();
	});
	
	//查看审计详情
	currTab.find("#view_auditdetail").click(function(){
		var id = table.bootstrapTable('getSelections');
  		var ids=JSON.stringify(id);
		var params=JSON.parse(ids);
  		if(id.length!=1){
  			alert("请选择一条数据进行查看!");
  			return ;
  		}
  		closeAndOpenInnerPageTab("qualityManage_queryInfo","查看不符合项","dev_project/qualityManage/qualityQuery/qualityManage_queryInfo.html",function(){
			initQualityManageInfoLayout(params[0]);
		});
	});
	
	//受理按钮事件
	currTab.find("#quality_accept").click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行受理!");
			return ;
		}
		if(rows[0].QUALITY_STATUS !== "02"&& rows[0].QUALITY_STATUS !== "06"){
			alert("这条数据不是待受理或验证打回状态，不能进行受理!");
			return ;
		}
		if(rows[0].DUTY_USER_ID != currentLoginUser){
			alert("您不是当前受理人!");
			return ;
		}
		openInnerPageTab("qualityManage_handle","受理不符合项","dev_project/qualityManage/noConformItemAccept/noConformItemAccpet_handle.html",function(){
			initQualityManageHandleLayout(rows[0]);
		});
		
	});
	//处理按钮事件
	currTab.find("#quality_handle").click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行处理!");
			return ;
		}
		if(rows[0].QUALITY_STATUS !== "03"){
			alert("这条数据不是待处理状态，不能进行处理!");
			return ;
		}
		if(rows[0].DUTY_USER_ID != currentLoginUser){
			alert("您不是当前处理人!");
			return ;
		}
		openInnerPageTab("qualityManage_handle","处理不符合项","dev_project/qualityManage/noConformItemManage/noConformItemManage_handle.html",function(){
			initQualityManageHandleLayout(rows[0]);
		});
		
	});
	
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	
	currTab.find("#noConformItemTable").bootstrapTable('destroy').bootstrapTable({
		//请求后台的URL（*）
		url : dev_project
			+'qualityManager/queryListQuality.asp?call='
			+noConfirmItemRaisecall+'&SID='+SID+"&project_id="+project_id,
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
		uniqueId : "QUALITY_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:noConfirmItemRaisecall,
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
			field : "BUSINESS_CODE",
			title : "业务编号",
			align : "center",
		},{
			field : "NO_CONFORM_NAME",
			title : "不符合项名称",
			align : "center",
			width : "20%",
		},{
			field : "CHECK_NAME",
			title : "检查点名称",
			align : "center",
		},{
			field : "GRADE_NAME",
			title : "不符合项等级",
			align : "center",
		},{
			field : "QUALITY_STATUS_NAME",
			title : "不符合项状态",
			align : "center",
		},{
			field : "PRESENT_USER_NAME",
			title : "提出人",
			align : "center",
		},{
			field : "DUTY_USER_NAME",
			title : "责任人",
			align : "center",
		},{
			field : "FIND_DATE",
			title : "发现日期",
			align : "center",
		}/*,{
			field : "REALITY_FINISH_TIME",
			title : "实际解决日期",
			align : "center",
			width : 150,
		},{
			field : "DESCR",
			title : "备注",
			align : "center",
			width : 100,
		}*/]
	});
}

