	
function initsitAcceptInfo(){
	var currTab = getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题
	//初始化下拉选
	autoInitSelect(currTab.find("#table_select"));
	
	var tableCall = getMillisecond();
	
	var table = currTab.find("#sitDeploy_Table");
	var form = currTab.find("#sitDeploy");
	//查询
	var query = currTab.find("#query");
	query.click(function(){
		var param = form.serialize();
		table.bootstrapTable('refresh',{
			url:dev_construction+'GSitDeploy/queryListSitDeploy.asp?call='+tableCall+'&SID='+SID+'&'+param});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#query").click();});
	//重置
	var reset = currTab.find("#reset");
	reset.click(function(){
		form[0].reset();
		currTab.find("select").select2();
	});
	//立项信息列表显示
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	table.bootstrapTable({
		//请求后台的URL（*）
		url : dev_construction+'GSitDeploy/queryListSitDeploy.asp?call='+tableCall+'&SID='+SID,
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
		uniqueId : "SIT_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:tableCall,
		singleSelect: true,
		onLoadSuccess : function(data){
			gaveInfo();
		},
		columns : [ {
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		},{
			field : "SUB_REQ_CODE",
			title : "需求点编号",
			align : "center",
			width : "13%",
		},{
			field : "SUB_REQ_NAME",
			title : "需求点名称",
			align : "center",
			width : "15%",
		},/* {
			field : 'REQ_TASK_CODE',
			title : '需求任务编号',
			align : "center"
		}, {
			field : "REQ_TASK_NAME",
			title : "需求任务名称",
			align : "center"
		}, */{
			field : "TEST_COUNT_NAME",
			title : "测试轮次",
			align : "center",
			width : "8%",
		},{
			field : "TEST_VERSION_ID",
			title : "测试版本号",
			align : "center",
			width : "8%",
		}, {
			field : "VERSION_PUSH_DATA",
			title : "版本发布日期",
			align : "center",
			width : "9%",
		}, {
			field : "VERSIONS_NAME",
			title : "版本名称",
			align : "center",
			width : "12%",
		}, {
			field : "IS_CC",
			title : "是否纳入CC",
			align : "center",
			width : 110,
			formatter:function(value,row,index){if(value=="00"){return "是";}return "否";}
		},{
			field : "SYSTEM_NAME",
			title : "应用名称",
			align : "center",
			width : 110,
		}, {
			field : "STATUS_NAME",
			title : "移交状态",
			align : "center",
			width : 100,
		},{
			field : "OPT_PERSON_NAME",
			title : "上一操作人",
			align : "center",
			width : 110,
		}]
	});
	
	//SIT测试部署验证
	var edit = currTab.find("#edit_Sit");
	edit.click(function(){
		var seles = table.bootstrapTable("getSelections");
		if(seles.length!=1){
			alert("请选择一条数据进行部署!");
			return;
		}
		var state = seles[0].ACCEPT_STATUS;                    
		/*if(state!="00"){
			alert("该信息已受理!");
			return ;
		}*/
		closeAndOpenInnerPageTab("edit_Sit","SIT测试验证部署","dev_construction/sit_test_jn/sit_deploy/sitDeploy_edit.html", function(){
			getCurrentPageObj().find("#STATUS").removeAttr("disabled");
			initsitDeployBtn(seles[0]);
		});
	});
	//查看
	var view = currTab.find("#view_Sit");
	view.bind('click', function(e) {
		var seles = table.bootstrapTable("getSelections");
		if(seles.length!=1){
			alert("请选择一条数据进行查看!");
			return;
		}
		closeAndOpenInnerPageTab("edit_Sit","SIT测试验证部署","dev_construction/sit_test_jn/sit_deploy/sitDeploy_edit.html", function(){
			//initviewsitAccept(seles[0]);
			initsitDeployBtn(seles[0]);
			getCurrentPageObj().find("#submit_sit").hide();
			getCurrentPageObj().find("#TEST_URL").attr("disabled",true);
			//getCurrentPageObj().find("#STATUS").attr("disabled",true);
			getCurrentPageObj().find("#deploy_desc").attr("disabled",true);
		});
	});
}
		
initsitAcceptInfo();