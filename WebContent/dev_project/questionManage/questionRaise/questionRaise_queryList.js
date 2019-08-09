initQuestionManageLayout();
function initQuestionManageLayout(){
	var currTab=getCurrentPageObj();
	var queryForm = currTab.find("#questionRaiseForm");
	var table = currTab.find("#questionRaiseTable");
    var questionManageQueryCall = getMillisecond();
    
//初始化字典项
autoInitSelect(queryForm);
//初始化查询和重置
initQueryBtn();
function initQueryBtn(){
	//查询
	var query=currTab.find("#query_questionRaiseList");
	query.click(function(){
		
		var param = queryForm.serialize();
		table.bootstrapTable('refresh',{url:dev_project+"QuestionRaise/questionRaiseQueryList.asp?SID="+SID+
			"&call="+questionManageQueryCall + "&" + param});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#query_questionRaiseList").click();});
	//重置
	var reset=currTab.find("#reset_qestionRaiseList");
	reset.click(function(){
		queryForm[0].reset();
		var selects = currTab.find("select");
		for(var i=0; i<selects.length; i++){
			$(selects[i]).select2();
		}
	});
}   
//初始化风险列表
initQuestionkManageList();
function initQuestionkManageList(){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	
	table.bootstrapTable("destroy").bootstrapTable({
		//请求后台的URL（*）
		url : dev_project+"QuestionRaise/questionRaiseQueryList.asp?SID="+SID+"&call="+questionManageQueryCall,
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
		uniqueId : "RISK_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		jsonpCallback : questionManageQueryCall,
		detailView : false, //是否显示父子表
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
		},/*{
			field : 'aa',
			title : '序号',
			align : "center",
			width : "50px",
			formatter : function(value, row, index){
				return index+1;
			}
		},*/
		{
			field : "RISK_NAME",
			title : "问题名称",
			align : "center",
			width : "250px"
		},
		{
			field : "FIRST_CLASSIFY_NAME",
			title : "问题分类",
			align : "center"
		},{
			field : "PROJECT_NAME",
			title : "所属项目名称",
			align : "center",
			width : "270px"
		},  {
			field : "RISK_STATUS_NAME",
			title : "问题状态",
			align : "center"
		},
		 {
			field : "PONDERANCE_NAME",
			title : "问题严重程度",
			align : "center"
		},
		{
			field : "RISK_GRADE_NAME",
			title : "问题级别",
			align : "center"
		}
		, {
			field : "PRESENT_USER_ID_NAME",
			title : "提出人",
			align : "center"
		}, {
			field : "DUTY_USER_ID_NAME",
			title : "责任人",
			align : "center"
		},
		/*{
			field : "OPT_USER_ID_NAME",
			title : "处理人",
			align : "center"
		},*/
		{
			field : "PRESENT_TIME",
			title : "提出日期",
			align : "center",
			width : "200px"
		}/*, {
			field : "CLOSE_DATE",
			title : "关闭日期",
			align : "center"
		}*/]
	});
}

//初始化页面按钮事件
initBtnEvent_question();
function initBtnEvent_question(){
	
	//新增按钮事件
	currTab.find("#questionRaise_add").click(function(){
		closeAndOpenInnerPageTab("questionRaise_add","新增问题","dev_project/questionManage/questionRaise/questionRaise_add.html",
				function() {
			initQuestionRaiseDic();
			initRiskQuestionSaveLayout();
		}		
		
		);
		
		
		
	});
	
	//修改按钮事件
	getCurrentPageObj().find("#questionRaise_update").click(function(){
		var rows = getCurrentPageObj().find("#questionRaiseTable").bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据!");
			return ;
		}
		if((rows[0].RISK_STATUS!="01")&&(rows[0].RISK_STATUS!="03"))
		{
		alert("该问题不能修改!");
		return ;	
		}
		closeAndOpenInnerPageTab(
				"questionRaise_update",
				"修改问题",
				"dev_project/questionManage/questionRaise/questionRaise_update.html",
				function() {
					initRiskQuestionUpdateSaveLayout();
					var rowsInfo=JSON.stringify(rows);
					var params=JSON.parse(rowsInfo);
					initQuestionRaiseUpdateInfo(params[0]);
				});
	});
	//删除按钮事件
	getCurrentPageObj().find("#questionRaise_delete").click(function(){
		var rows = getCurrentPageObj().find("#questionRaiseTable").bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据!");
			return ;
		}
		if(rows[0].RISK_STATUS!="01")
			{
			alert("该问题不是草拟状态不可删除!");
			return ;	
			}
		var risk_id=rows[0].RISK_ID;
		var qrdcall = getMillisecond();
		nconfirm("确定删除问题吗？",function(){
		baseAjaxJsonp(dev_project+"QuestionRaise/deleteQuestionRaise.asp?SID="+SID+"&call="+qrdcall+"&risk_id="+risk_id, null, function(data){
			if (data != undefined && data != null) {
				alert(data.msg);
				 if(data.result=="true"){
					 table.bootstrapTable('refresh',{
							url:dev_project+"QuestionRaise/questionRaiseQueryList.asp?SID="+SID+"&call="+questionManageQueryCall});
					}
				
				
			}else{
				alert("删除失败！");
			}
		},qrdcall);});
		
		
		
	});
	//提交按钮事件
	getCurrentPageObj().find("#questionRaise_submit").click(function(){
		var rows = getCurrentPageObj().find("#questionRaiseTable").bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据!");
			return ;
		}
		if((rows[0].RISK_STATUS!="01")&&(rows[0].RISK_STATUS!="03"))
		{
		alert("该问题已经提交!");
		return ;	
		}
	var risk_id=rows[0].RISK_ID;
	var first_classify= rows[0].FIRST_CLASSIFY;
	var qrdcall = getMillisecond();
	nconfirm("确定提交问题吗？",function(){
	baseAjaxJsonp(dev_project+"QuestionRaise/submitQuestionList.asp?SID="+SID+"&call="+qrdcall+"&risk_id="+risk_id+"&first_classify="+first_classify, null, function(data){
		if (data != undefined && data != null) {
			alert(data.msg);
			if(data.result=="true"){
			 table.bootstrapTable('refresh',{
					url:dev_project+"QuestionRaise/questionRaiseQueryList.asp?SID="+SID+"&call="+questionManageQueryCall});
		}
		}else{
			alert("提交失败！");
		}
	},qrdcall);
	
	});});
	
	//验证按钮事件
	getCurrentPageObj().find("#questionRaise_proving").click(function(){
		var rows = getCurrentPageObj().find("#questionRaiseTable").bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据!");
			return ;
		}
		closeAndOpenInnerPageTab(
				"questionRaise_proving",
				"验证问题",
				"dev_project/questionManage/question_proving.html",
				function() {
					
				});
		
	});
	
	//关闭按钮事件
	getCurrentPageObj().find("#questionRaise_close").click(function(){
		var rows = getCurrentPageObj().find("#questionRaiseTable").bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据!");
			return ;
		}
		
		updateQuestionStatus("关闭问题成功！");
	});
	//详情按钮
	getCurrentPageObj().find("#questionRaise_detail").click(function(){
		var selecs = getCurrentPageObj().find("#questionRaiseTable").bootstrapTable('getSelections');
		if(selecs.length!=1){
			alert("请选择一条数据!");
			return ;
		}
		closeAndOpenInnerPageTab(
				"questionRaise_detail",
				"问题详情",
				"dev_project/questionManage/questionRaise/questionRaise_queryInfo.html",
				function() {
					var selecsInfo=JSON.stringify(selecs);
					var params=JSON.parse(selecsInfo);
					initQuestionRaiseOperateLogList(params[0].RISK_ID);
					/*initQuestionRaiseHandleLogList(params[0].RISK_ID);*/
					initqRQueryInfo(params[0]);
				});
		
	});

	
}
//修改问题状态
function updateQuestionStatus(obj){
	alert(obj);
 }
}