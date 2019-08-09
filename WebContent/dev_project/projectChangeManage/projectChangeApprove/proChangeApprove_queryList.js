;function initproChangeInfo(){
	var currTab = getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题
	//初始化下拉选
	autoInitSelect(currTab.find("#table_select"));
	
	var tableCall = getMillisecond();
	
	var table = currTab.find("#table_proChangeApp");
	var form = currTab.find("#proChangeApp");
	
	//查询
	var query = currTab.find("#select");
	query.click(function(){
		var param = form.serialize();
		table.bootstrapTable('refresh',{
			url:dev_project+'proChange/queryListApprove.asp?call='+tableCall+'&SID='+SID+'&type=1'+"&"+param});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#select").click();});
	//重置
	var reset = currTab.find("#reset");
	reset.click(function(){
		form[0].reset();
		currTab.find("select").select2();
	});
	
	//列表显示
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	table.bootstrapTable({
		//请求后台的URL（*）
		url : dev_project+'proChange/queryListApprove.asp?call='+tableCall+'&SID='+SID+"&type=1",
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [5,10,15],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "CHANGE_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:tableCall,
		singleSelect: true,
		onLoadSuccess:function(data){
			gaveInfo();
		},
		columns : [ {
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		}, {
			field : 'ROW_NUM',
			title : '序号',
			align : "center",
			width:50
		}, {
			field : "CHANGE_CODE",
			title : "变更编号",
			align : "center",
			visible:false
		}, {
			field : "PROJECT_NUM",
			title : "项目编号",
			align : "center",
			visible:false
		}, {
			field : "PROJECT_NAME",
			title : "项目名称",
			align : "center",
			width :"18%"
		}, {
			field : "PROJECT_TYPE_NAME",
			title : "项目类型",
			align : "center"
		}, {
			field : "SYSTEM_NAME",
			title : "应用名称",
			align : "center"
		}, {
			field : "CHANGE_REASON_NAME",
			title : "变更原因",
			align : "center"
		}, {
			field : "PRESENT_USER_NAME",
			title : "提出人",
			align : "center",
		}, {
			field : "PRESENT_DATE",
			title : "提出日期",
			align : "center",
		}, {
			field : "APP_STATUS_NAME",
			title : "变更状态",
			align : "center",
		}, {
			field : "CURR_ACTORNO_NAME",
			title : "当前审批人",
			align : "center",
		}]
	});
	
	//审批按钮
	var add = currTab.find("#app_proChange");
	add.click(function(){
		var seles = table.bootstrapTable("getSelections");
		if(seles.length!=1){
			alert("请选择一条数据进行审批!");
			return;
		}
		openInnerPageTab("proChange_approve","变更审批","dev_project/projectChangeManage/projectChangeApprove/proChange_approve.html", function(){
			initTitle(seles[0]["INSTANCE_ID"]);
			initAFApprovalInfo(seles[0]["INSTANCE_ID"]);
			initviewproChange(seles[0]);
		});
	 });
	
	//查看
	var view = currTab.find("#viewApp_proChange");
	view.bind('click', function(e) {
		var seles = table.bootstrapTable("getSelections");
		if(seles.length!=1){
			alert("请选择一条数据进行查看!");
			return;
		}
		openInnerPageTab("view_proChange","查看变更","dev_project/projectChangeManage/projectChangeApprove/proChangeApprove_detail.html", function(){
			initTitle(seles[0]["INSTANCE_ID"]);
			initAFApprovalInfo(seles[0]["INSTANCE_ID"],'0');
			initviewproChange(seles[0]);
		});
	});
}
		
initproChangeInfo();