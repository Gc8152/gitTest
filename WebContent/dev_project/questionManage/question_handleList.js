var tableCall = getMillisecond();
initQuestionkManageTab();
initBtnEvent_question();
//初始化风险列表
function initQuestionkManageTab(){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	
	getCurrentPageObj().find("#questionManageTable").bootstrapTable("destroy").bootstrapTable({
		//请求后台的URL（*）
		url : dev_project+"riskQuestionManage/queryListProjectRisk.asp?SID="+SID+"&call="+tableCall,
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
		jsonpCallback : tableCall,
		detailView : false, //是否显示父子表
		singleSelect: true,
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
			field : "flag",
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
function initBtnEvent_question(){
	
	//受理按钮事件
	getCurrentPageObj().find("#question_handle").click(function(){
		var rows = getCurrentPageObj().find("#questionManageTable").bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据!");
			return ;
		}
		openInnerPageTab(
				"question_update",
				"处理问题",
				"dev_project/questionManage/question_handle.html",
				function() {
					
				});
	});
	
}
