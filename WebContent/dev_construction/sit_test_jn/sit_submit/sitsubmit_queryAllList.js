	
function initsitSubmitAllInfo(){
	var currTab = getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题
	//初始化下拉选
	autoInitSelect(currTab.find("#table_select"));
	
	var tableCall = getMillisecond();
	
	var table = currTab.find("#sitAllTable");
	var form = currTab.find("#sitSubmit");
	//查询
	var query = currTab.find("#query");
	query.click(function(){
		var param = form.serialize();
//		if(param.VERSION_PUSH_DATA == '请选择'){
//			param.VERSION_PUSH_DATA = '';
//		}
		if(param.SUBMIT_STATE == '请选择'){
			param.SUBMIT_STATE = '';
		}
		if(param.CREATE_TIME == '请选择'){
			param.CREATE_TIME = '';
		}
		table.bootstrapTable('refresh',{
			url:dev_construction+'GSitSubmit/queryListSitSubmit.asp?call='+tableCall+'&SID='+SID+'&'+param});
		
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#query").click();});
	//重置
	var reset = currTab.find("#reset");
	reset.click(function(){
		form[0].reset();
		currTab.find("select").select2();
	});
	
	//页面列表
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset, //页码
				type:'2'
		};
		return temp;
	};
	table.bootstrapTable({
		//请求后台的URL（*）
		url : dev_construction+'GSitSubmit/queryListSitSubmit.asp?call='+tableCall+'&SID='+SID,
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
		onLoadSuccess:function(data){
			gaveInfo();
		},
		columns : [ {
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
		
		},{
			field : 'SUB_REQ_CODE',
			title : '需求点编号',
			align : "center",
			width : "160",
			formatter:function(value,row,index){if(value!=undefined&&value!=" "){return '<a style="color:blue" href="javascript:void(0)" onclick="viewSubReqDetailTD(\''+row.REQ_ID+'\')";>'+value+'</a>';}return '--';}
		}, {
			field : "SUB_REQ_NAME",
			title : "需求点名称",
			align : "center",
			width : "200"
		}, {
			field : "TEST_COUNT_NAME",
			title : "测试轮次",
			align : "center",
			width : "100"
		},{
			field : "TEST_VERSION_ID",
			title : "测试版本号",
			align : "center",
			width : "100"
		
		}, {
			field : "REQ_TASK_STATE_DISPLAY",
			title : "主办任务状态",
			align : "center",
			width : "100"
		},{
			field : "VERSIONS_NAME",
			title : "版本名称",
			align : "center",
			width : "180",
			formatter:function(value,row,index){if(value!=undefined&&value!=" "){return '<a style="color:blue" href="javascript:void(0)" onclick="openVersionDetail(\''+row.VERSIONS_ID+'\')";>'+value+'</a>';}return '--';}
		}, {
			field : "SYSTEM_NAME",
			title : "应用名称",
			align : "center",
			width : "120"
		}, {
			field : "STATUS_NAME",
			title : "移交状态",
			align : "center",
			width : "120",
		}, 
		 {
			field : "CREATE_TIME",
			title : "移交时间",
			align : "center",
			width : "120"
		},{
			field : "APPLY_MAN_NAME",
			title : "申请人",
			align : "center"	
		}, {
			field : "VERSION_PUSH_DATA",
			title : "版本发布日期",
			align : "center",
			width : "120"
		
		},{
			field : "CONFIG_MAN_NAME",
			title : "配置管理员",
			align : "center"
		},{
			field : "CONFIG_TIME",
			title : "配置时间",
			align : "center"
		},
		{
			field : "CURRENT_DUTYMAN_NAME",
			title : "当前责任人",
			align : "center"
		},{
			field : "OPT_PERSON_NAME",
			title : "上一操作人",
			align : "center",
			width : "100"
		}]
	});
	
	//查看
	var view = currTab.find("#view_Sit");
	view.bind('click', function(e) {
		var seles = table.bootstrapTable("getSelections");
		if(seles.length!=1){
			alert("请选择一条数据进行查看!");
			return;
		}
		closeAndOpenInnerPageTab("view_Sit","查看SIT测试移交信息","dev_construction/sit_test_jn/sit_submit/sitsubmit_queryInfo.html", function(){
			//initviewsitAccept(seles[0]);
			initsitSubMitInfoBtn(seles[0]);
			getCurrentPageObj().find("#submit_sit").hide();
			getCurrentPageObj().find("#acceot_describe").attr("disabled",true);
			getCurrentPageObj().find("#accept_conclusion").attr("disabled",true);
		});
	});
}
//打开版本详情页面
function openVersionDetail(version_id){
	 closePageTab("view_project");
	 var tCall=getMillisecond()+'2';
			baseAjaxJsonp(dev_construction+'annualVersion/queryListAnnualVersion.asp?SID='+SID+'&call='+tCall+"&versions_id="+version_id, null , function(data) {
				openInnerPageTab("view_project","查看计划","dev_construction/versionManage/annualVersionManage/annualVersionPlan_queryInfo.html", function(){
					initAnnualVersionViewEvent(data.rows[0]);
			});
		},tCall);

}

//查看需求点详情	
function viewSubReqDetailTD(req_id){
	closeAndOpenInnerPageTab("requirement_360view","业务需求360页面","dev_construction/requirement/reqTask_follower/requirement_360view.html",function(){
		initReqInfoInView(req_id);
		initFollowerTaskQuery(req_id);
		reqChange_info(req_id);
		reqStop_info(req_id);
	});
}		
initsitSubmitAllInfo();


