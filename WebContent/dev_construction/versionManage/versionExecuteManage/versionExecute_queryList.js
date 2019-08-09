initVersionExecuteEvent();
function initVersionExecuteEvent(){
	var currTab=getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题
	var tCall=getMillisecond();			//table回调方法名
	//初始化下拉选
	autoInitSelect(currTab.find("#version_table"));
	
	var table = currTab.find("#table_versionExecution");
	
	//查询
	var query = currTab.find("#query_versionExecute");
	query.click(function(){
		var version_name = $.trim(currTab.find("input[name='version_name']").val());
		var version_type = $.trim(currTab.find("select[name='version_type']").val());
		var version_status = currTab.find("select[name='version_status']").val();
		table.bootstrapTable('refresh',{
			url:dev_construction+'versionexecute/queryListVersionExecute.asp?SID='+SID+'&call='+tCall
			+'&VERSION_NAME='+escape(encodeURIComponent(version_name))
			+'&VERSION_TYPE='+version_type
			+'&VERSION_STATUS='+version_status
			});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#query_versionExecute").click();});
	//重置
	var reset = currTab.find("#reset_versionExecute");
	reset.click(function(){
		currTab.find("input,select").val(" ");
		currTab.find("select").select2();
	});
	//开启
	var open_versionPlan = currTab.find("#open_versionPlan");
	open_versionPlan.click(function(){
		var id=table.bootstrapTable("getSelections");
		if (id.length!=1) {
			alert("请选择一条数据进行操作！");
			return;
		}else if(id[0].VERSIONS_STATUS!='00'){
			alert("请选择未开启的版本！");
			return;
		}
		var msg="是否开启？";
		nconfirm(msg,function(){
			var params={};
			params["version_id"]=id[0].VERSIONS_ID;
			var tabCall=getMillisecond();
			baseAjaxJsonp(dev_construction+'versionexecute/openVersionExecute.asp?SID='+SID+'&call='+tabCall, params, function(data){
				if (data!=undefined&&data.result=="true") {
					alert("开启成功！");
					table.bootstrapTable('refresh',{
						url:dev_construction+'versionexecute/queryListVersionExecute.asp?SID='+SID+'&call='+tCall});
					query.click();
				}else {
					alert("开启失败！");
				}
			}, tabCall);
		});
	});
	//关闭
	var closePageTabConfirm = currTab.find("#closePageTabConfirm");
	closePageTabConfirm.click(function(){
		var id=table.bootstrapTable("getSelections");
		if (id.length!=1) {
			alert("请选择一条数据进行操作！");
			return;
		}else if(id[0].CLOSING_JUDGMENT!='0'){
			alert("不能关闭：当前版本的需求任务未全部完成投产！");
			return;
		}else if(id[0].VERSION_STATUS=='03'){
			alert("当前版本已关闭！");
			return;
		}
		var msg="是否关闭？";
		nconfirm(msg,function(){
			var params={};
			params["version_id"]=id[0].VERSIONS_ID;
			var tabCall=getMillisecond();
			baseAjaxJsonp(dev_construction+'versionexecute/closeVersionExecute.asp?SID='+SID+'&call='+tabCall, params, function(data){
				if (data!=undefined&&data.result=="true") {
					var mess=data.mess;
					alert(mess);
					table.bootstrapTable('refresh',{
						url:dev_construction+'versionexecute/queryListVersionExecute.asp?SID='+SID+'&call='+tCall});
					query.click();
				}else {
					alert("关闭失败！");
				}
			}, tabCall);
		});
	});
	//冻结
	var freeze_versionPlan=currTab.find("#freeze_versionPlan");
	freeze_versionPlan.click(function(){
		var id=table.bootstrapTable("getSelections");
		if (id.length!=1) {
			alert("请选择一条数据进行操作！");
			return;
		}else if(id[0].VERSIONS_STATUS!='01'){
			alert("请选择开启入版的版本！");
			return;
		}
		var msg="是否冻结？";
		nconfirm(msg,function(){
			var params={};
			params["version_id"]=id[0].VERSIONS_ID;
			//提醒参数
			params["b_id"] = id[0].VERSIONS_ID;
			params["b_code"] = id[0].VERSIONS_ID;
			params["b_name"] = id[0].VERSIONS_NAME+"已冻结，此版本下的任务可发起投产";
			params["remind_type"] = 'PUB2017225';
			var tableCall=getMillisecond();
			baseAjaxJsonp(dev_construction+'versionexecute/freezeVersionExecute.asp?SID='+SID+'&call='+tableCall, params, function(data){
				if (data!=undefined&&data.result=="true") {
					table.bootstrapTable('refresh',{
						url:dev_construction+'versionexecute/queryListVersionExecute.asp?SID='+SID+'&call='+tCall});
					query.click();
					alert("冻结成功！");
				}else {
					alert("冻结失败！");
				}
			}, tableCall);
		});
	});
	//解冻
	var unfreeze_versionPlan=currTab.find("#unfreeze_versionPlan");
	unfreeze_versionPlan.click(function(){
		var id=table.bootstrapTable("getSelections");
		if (id.length!=1) {
			alert("请选择一条数据进行操作！");
			return;
		}else if(id[0].VERSIONS_STATUS!='02'){
			alert("请选择冻结的版本！");
			return;
		}
		var msg="是否解冻？";
		nconfirm(msg,function(){
			var params={};
			params["version_id"]=id[0].VERSIONS_ID;
			var taCall=getMillisecond();
			baseAjaxJsonp(dev_construction+'versionexecute/unfreezeVersionExecute.asp?SID='+SID+'&call='+taCall, params, function(data){
				if (data!=undefined&&data.result=="true") {
					table.bootstrapTable('refresh',{
						url:dev_construction+'versionexecute/queryListVersionExecute.asp?SID='+SID+'&call='+tCall});
					query.click();
					alert("解冻成功！");
				}else {
					alert("解冻失败！");
				}
			}, taCall);
		});
	});
	//导出计划清单
	var export_versionPlan = currTab.find("#export_versionPlan");
	export_versionPlan.click(function(){
		var id=table.bootstrapTable("getSelections");
		if (id.length!=1) {
			alert("请选择一条数据进行操作！");
			return;
		}
	});
	//版本任务查询
	var query_versionTask = currTab.find("#query_versionTask");
	query_versionTask.click(function(){
		var id=table.bootstrapTable("getSelections");
		if (id.length!=1) {
			alert("请选择一条数据进行操作！");
			return;
		}
		 closePageTab("query_versionTask");
		openInnerPageTab("query_versionTask","任务查询","dev_construction/versionManage/versionExecuteManage/versionExecute_queryInfo.html", function(){
			initVersionExecutePlanEvent(id[0]);
		});
	});
	//版本360视图
	var version_views=currTab.find("#version_views");
	version_views.click(function(){
		var id=table.bootstrapTable("getSelections");
		if (id.length!=1) {
			alert("请选择一条数据查看！");
			return;
		}
		openInnerPageTab("query_version_view","版本360视图","dev_construction/versionManage/versionExecuteManage/versionViews_queryList.html", function(){
			initVersionExecuteViewEvent(id[0]);
			//initVersionNeedTree(id[0]);
		});
	});
	//发起评审
	var start_review=currTab.find("#start_review");
	start_review.click(function(){
		var id=table.bootstrapTable("getSelections");
		if (id.length!=1) {
			alert("请选择一条数据发起评审！");
			return;
		}
	});
	//同步数据中心
	var update_dataCenter=currTab.find("#update_dataCenter");
	update_dataCenter.click(function(){
		var id=table.bootstrapTable("getSelections");
		if (id.length!=1) {
			alert("请选择一条数据进行操作！");
			return;
		}
	});
	//版本执行管理列表显示
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};

	table.bootstrapTable({
		//请求后台的URL（*）
		url : dev_construction+'versionexecute/queryListVersionExecute.asp?SID='+SID+'&call='+tCall,
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
		uniqueId : "DRAFT_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		jsonpCallback:tCall,
		onLoadSuccess:function(data){
			gaveInfo();
		},
		columns : [{
			field: 'middle',
			checkbox: true,
			align: 'center'
		},{
			field : '',
			title : '标识',
			align : "center",
			sortable:true,
			width : 70,
			formatter:function(value,row,index){
				if (row.VERSIONS_STATUS=="02") {
					return ""+'<div class="text-red">!<div>';
				}
			}
		},{
			field : 'VERSIONS_NAME',
			title : '版本名称',
			align : "center",
			width : 288,
		}, {
			field : "VERSION_TYPE_NAME",
			title : "版本类型",
			align : "center",
			width : 206,
			
		}, {
			field : "VERSION_STATUS_NAME",
			title : "版本状态",
			align : "center",
			width : 90,
		}, {
			field : "VERSION_CHILD",
			title : "入版子需求个数",
			align : "center",
			visible: false
		},{
			field : "CHANGE_NUM",
			title : "变更总数(审批中)",
			align : "center",
			visible: false
		}, {
			field : "WINDOWS_TIME",
			title : "投产窗口",
			align : "center",
			visible: false
		},{
			field : "SPI",
			title : "SPI",
			align : "center",
			visible: false
		},{
			field : "CPI",
			title : "CPI",
			align : "center",
			visible: false
		},
	    {
			field : "VERSION_NEED",
			title : "入版需求任务总数",
			align : "center",
			visible: false
		}, {
			field : "EXPECT_SECOND_REVIEW",
			title : "提交2级评审",
			align : "center",
			visible: false
		}, {
			field : "EXPECT_SIT",
			title : "提交SIT",
			align : "center",
			visible: false
		}, {
			field : "SUM_ENTRY",
			title : "当前版本任务总数",
			align : "center",
			width : 130,
		}, {
			field : "SUM_UNFINISHED_OPERATION",
			title : "未发起投产任务数",
			align : "center",
			width : 130,
		}, {
			field : "SUM_LAUNCHING_PRODUCTION",
			title : "投产审批中任务数",
			align : "center",
			width : 130,
		}, {
			field : "SUM_COMPLETION_PRODUCTION",
			title : "完成投产任务数",
			align : "center"
		}, {
			field : "CLOSING_JUDGMENT",
			title : "未完成投产任务数",
			align : "center",
			width : 130,
			
		}]
	});
	
}