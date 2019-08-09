initQuestionQueryLayout();
function initQuestionQueryLayout(){
	var currTab=getCurrentPageObj();
	var queryListForm = currTab.find("#questionQueryForm");
	var querytable = currTab.find("#questionQueryTable");
    var questionQueryCall = getMillisecond();
    
//初始化字典项
autoInitSelect(queryListForm);
//初始化查询和重置
initQuestionQueryBtn();
function initQuestionQueryBtn(){
	//查询
	var query=currTab.find("#query_questionQueryList");
	query.click(function(){
		var param = queryListForm.serialize();
		querytable.bootstrapTable('refresh',{url:dev_project+"QuestionQuery/questionQueryList.asp?SID="+SID+
			"&call="+questionQueryCall + "&" + param});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#query_questionQueryList").click();});
	//重置
	var reset=currTab.find("#reset_qestionQueryList");
	reset.click(function(){
		queryListForm[0].reset();
		var selects = currTab.find("select");
		for(var i=0; i<selects.length; i++){
			$(selects[i]).select2();
		}
	});
}   
//初始化问题查询列表
initQuestionQueryList();
function initQuestionQueryList(){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	
	querytable.bootstrapTable("destroy").bootstrapTable({
		//请求后台的URL（*）
		url : dev_project+"QuestionQuery/questionQueryList.asp?SID="+SID+"&call="+questionQueryCall,
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
		jsonpCallback : questionQueryCall,
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
		{
			field : "OPT_USER_ID_NAME",
			title : "处理人",
			align : "center"
		},
		{
			field : "PRESENT_TIME",
			title : "提出日期",
			align : "center",
			width : "200px"
		}, {
			field : "CLOSE_DATE",
			title : "关闭日期",
			align : "center",
			width : "200px"
		}]
	});
}

//初始化页面按钮事件
initBtnEvent_questionQuery();
function initBtnEvent_questionQuery(){

	//详情按钮事件
	getCurrentPageObj().find("#questionQuery_detail").click(function(){
		var rows = getCurrentPageObj().find("#questionQueryTable").bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据!");
			return ;
		}
		var rowsInfo=JSON.stringify(rows);
		var params=JSON.parse(rowsInfo);
		 closeAndOpenInnerPageTab("questionQuery_queryInfo","问题详情","dev_project/questionManage/questionQuery/questionQuery_queryInfo.html", function(){
			 initQueryInfo(params[0]);
			 initQuestionQueryHandleLogList(params[0].RISK_ID);
			 initQuestionQueryOperateLogList(params[0].RISK_ID);
			});
	});
}
//修改问题状态
function updateQuestionStatus(obj){
	alert(obj);
 }
}