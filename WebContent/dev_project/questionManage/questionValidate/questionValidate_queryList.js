initQuestionValidateLayout();
function initQuestionValidateLayout(){
	var currTab=getCurrentPageObj();
	var validateForm = currTab.find("#questionValidateForm");
	var validatetable = currTab.find("#questionValidateTable");
    var validateCall = getMillisecond();
    
//初始化字典项
autoInitSelect(validateForm);
//初始化查询和重置
initValidateBtn();
function initValidateBtn(){
	//查询
	var validatequery=currTab.find("#query_questionValidateList");
	validatequery.click(function(){
		var param = validateForm.serialize();
		validatetable.bootstrapTable('refresh',{url:dev_project+"QuestionValidate/questionValidateQueryList.asp?SID="+SID+
			"&call="+validateCall + "&" + param});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#query_questionValidateList").click();});
	//重置
	var validatereset=currTab.find("#reset_qestionValidateList");
	validatereset.click(function(){
		validateForm[0].reset();
		var selects = currTab.find("select");
		for(var i=0; i<selects.length; i++){
			$(selects[i]).select2();
		}
	});
}   
//初始化风险列表
initQuestionValidateList();
function initQuestionValidateList(){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	
	validatetable.bootstrapTable("destroy").bootstrapTable({
		//请求后台的URL（*）
		url : dev_project+"QuestionValidate/questionValidateQueryList.asp?SID="+SID+"&call="+validateCall,
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
		jsonpCallback : validateCall,
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
			title : "所属项目",
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
		}/*, {
			field : "CLOSE_DATE",
			title : "关闭日期",
			align : "center"
		}*/]
	});
}

//初始化页面按钮事件
initBtnEvent_validate();
function initBtnEvent_validate(){
	
	//验证按钮事件
	currTab.find("#questionValidate_validate").click(function(){
		var select = getCurrentPageObj().find("#questionValidateTable").bootstrapTable('getSelections');
		if(select.length!=1){
			alert("请选择一条数据!");
			return ;
		}
		closeAndOpenInnerPageTab("questionValidate_validate","验证问题","dev_project/questionManage/questionValidate/questionValidate_validate.html",
				function() {
			initViladateLayout();
			var selecsInfo=JSON.stringify(select);
			var params=JSON.parse(selecsInfo);
			initquestionValidate_viladateInfo(params[0]);
			initqVOperateLogList(params[0].RISK_ID);
			initqVHandelLogList(params[0].RISK_ID);
		});		
		
	});
	
	//详情按钮
	getCurrentPageObj().find("#questionValidate_detail").click(function(){
		var selecs = getCurrentPageObj().find("#questionValidateTable").bootstrapTable('getSelections');
		if(selecs.length!=1){
			alert("请选择一条数据!");
			return ;
		}
		closeAndOpenInnerPageTab(
				"questionValidate_detail",
				"问题详情",
				"dev_project/questionManage/questionValidate/questionValidate_queryInfo.html",
				function() {
					var selecsInfo=JSON.stringify(selecs);
					var params=JSON.parse(selecsInfo);
					initqVQueryInfo(params[0]);
					initqVInfoOperateLogList(params[0].RISK_ID);
					initqVInfoHandelLogList(params[0].RISK_ID);
				});
		
	});

	
}
//修改问题状态
function updateQuestionStatus(obj){
	alert(obj);
 }
}