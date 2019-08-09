initQuestionManageLayout();
function initQuestionManageLayout(){
	var currTab=getCurrentPageObj();
	var queryForm = currTab.find("#questionQueryForm");
	var table = currTab.find("#questionManageTable");
    var questionManageQueryCall = getMillisecond();
    
//初始化字典项
autoInitSelect(queryForm);
	
//初始化查询和重置
initQueryBtn();
function initQueryBtn(){
	//查询
	var query=currTab.find("#query_questionList");
	query.click(function(){
		var param = queryForm.serialize();
		table.bootstrapTable('refresh',{url:dev_project+"riskQuestionManage/queryListProjectRisk.asp?SID="+SID+
			"&call="+questionManageQueryCall + "&" + param});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#query_questionList").click();});
	//重置
	var reset=currTab.find("#reset_qestionForm");
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
		url : dev_project+"riskQuestionManage/queryListProjectRisk.asp?SID="+SID+"&call="+questionManageQueryCall,
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
		},{
			field : 'aa',
			title : '序号',
			align : "center",
			formatter : function(value, row, index){
				return index+1;
			}
		}, {
			field : "RISK_ID",
			title : "标识",
			align : "center"
		}, {
			field : "RISK_FROM_ID",
			title : "风险出处",
			align : "center"
		}, {
			field : "RISK_DESC",
			title : "风险描述",
			align : "center"
		}, {
			field : "FIRST_CLASSIFY_NAME",
			title : "一级分类",
			align : "center"
		}, {
			field : "SECOND_CLASSIFY_NAME",
			title : "二级分类",
			align : "center"
		}, {
			field : "PRIORITY_NAME",
			title : "优先级",
			align : "center"
		}, {
			field : "RISK_GRADE_NAME",
			title : "风险级别",
			align : "center"
		}, {
			field : "DUTY_USER_NAME",
			title : "责任人",
			align : "center"
		}, {
			field : "RISK_STATUS_NAME",
			title : "风险状态",
			align : "center"
		}, {
			field : "PRESENT_TIME",
			title : "提出日期",
			align : "center"
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
	currTab.find("#question_add").click(function(){
		closeAndOpenInnerPageTab("question_add","新增问题","dev_project/questionManage/question_add.html");
	});
	
	//修改按钮事件
	getCurrentPageObj().find("#question_update").click(function(){
		var rows = getCurrentPageObj().find("#questionManageTable").bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据!");
			return ;
		}
		openInnerPageTab(
				"question_update",
				"修改问题",
				"dev_project/questionManage/question_add.html",
				function() {
					
				});
	});
	//提交按钮事件
	getCurrentPageObj().find("#question_submit").click(function(){
		var rows = getCurrentPageObj().find("#questionManageTable").bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据!");
			return ;
		}
		
		updateQuestionStatus("提交问题成功！");
	});
	
	//验证按钮事件
	getCurrentPageObj().find("#question_proving").click(function(){
		var rows = getCurrentPageObj().find("#questionManageTable").bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据!");
			return ;
		}
		openInnerPageTab(
				"question_proving",
				"验证问题",
				"dev_project/questionManage/question_proving.html",
				function() {
					
				});
		
	});
	
	//关闭按钮事件
	getCurrentPageObj().find("#question_close").click(function(){
		var rows = getCurrentPageObj().find("#questionManageTable").bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据!");
			return ;
		}
		
		updateQuestionStatus("关闭问题成功！");
	});
}
//修改问题状态
function updateQuestionStatus(obj){
	alert(obj);
 }
}