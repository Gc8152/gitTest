initQuestionHandleLayout();
function initQuestionHandleLayout(){
	var currTab=getCurrentPageObj();
	var handleForm = currTab.find("#questionHandleForm");
	var handletable = currTab.find("#questionHandleTable");
    var handleCall = getMillisecond();
    
//初始化字典项
autoInitSelect(handleForm);
//初始化查询和重置
initHandleBtn();
function initHandleBtn(){
	//查询
	var handlequery=currTab.find("#query_questionHandleList");
	handlequery.click(function(){
		var param = handleForm.serialize();
		handletable.bootstrapTable('refresh',{url:dev_project+"QuestionHandle/questionHandleQueryList.asp?SID="+SID+
			"&call="+handleCall + "&" + param});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#query_questionHandleList").click();});
	//重置
	var reset=currTab.find("#reset_qestionHandleList");
	reset.click(function(){
		handleForm[0].reset();
		var selects = currTab.find("select");
		for(var i=0; i<selects.length; i++){
			$(selects[i]).select2();
		}
	});
}   
//初始化风险列表
initQuestionHandleList();
function initQuestionHandleList(){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	
	handletable.bootstrapTable("destroy").bootstrapTable({
		//请求后台的URL（*）
		url : dev_project+"QuestionHandle/questionHandleQueryList.asp?SID="+SID+"&call="+handleCall,
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
		jsonpCallback : handleCall,
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
		}/*, {
			field : "CLOSE_DATE",
			title : "关闭日期",
			align : "center"
		}*/]
	});
}

//初始化页面按钮事件
initBtnEvent_Handle();
function initBtnEvent_Handle(){
	
	//处理问题按钮事件
	currTab.find("#questionHandle_handle").click(function(){
		var select = getCurrentPageObj().find("#questionHandleTable").bootstrapTable('getSelections');
		if(select.length!=1){
			alert("请选择一条数据!");
			return ;
		}
		if(select[0].RISK_STATUS!='04'){
			alert("请选择一条待处理的问题!");
			return ;
		}
		
		var type="update";
		var calls = getMillisecond()+1;
		var calln = getMillisecond()+2;
		var risk_status='05';
		var question_dispose_status='02';
		baseAjaxJsonp(dev_project+"QuestionHandle/updateQuestionHandleStatus.asp?SID="+SID+"&call="+calls+"&opt_type="+type+"&risk_id="+select[0].RISK_ID+"&risk_status="+risk_status+"&question_dispose_status="+question_dispose_status+"&risk_name="+escape(encodeURIComponent(select[0].RISK_NAME))+"&present_user_id="+select[0].PRESENT_USER_ID+"&duty_user_id="+select[0].DUTY_USER_ID, null, function(data){
			if (data != undefined && data != null) {
				
				if(data.result=="true"){
					
					baseAjaxJsonp(dev_project+"QuestionHandle/questionHandleQueryOneRecord.asp?SID="+SID+"&call="+calln+"&risk_id="+select[0].RISK_ID, null, function(data){
						if (data != undefined && data != null) {
								
								closeAndOpenInnerPageTab("questionHandle_handle","处理问题","dev_project/questionManage/questionHandle/questionHandle_handle.html",
										function() {
									var selecsInfo=JSON.stringify(data.rows);
									var params=JSON.parse(selecsInfo);
									initquestionHandle_Handleinfo(params[0]);
									initqHOperateLogList(params[0].RISK_ID);
									initqHHandelLogList(params[0].RISK_ID);
								});
					        
								
							
						}else{
							alert("查询错误！");
						}
					},calln);
	
				}
			}else{
				alert("更新状态错误！");
			}
		},calls);
		
		/*closeAndOpenInnerPageTab("questionHandle_handle","处理问题","dev_project/questionManage/questionHandle/questionHandle_handle.html",
				function() {
			var selecsInfo=JSON.stringify(select);
			var params=JSON.parse(selecsInfo);
			
			initquestionHandle_Handleinfo(params[0]);
			initqHOperateLogList(params[0].RISK_ID);
			initqHHandelLogList(params[0].RISK_ID);
		});*/
	});
	
	//处理问题按钮事件
	currTab.find("#questionHandle_track").click(function(){
		var select = getCurrentPageObj().find("#questionHandleTable").bootstrapTable('getSelections');
		if(select.length!=1){
			alert("请选择一条数据!");
			return ;
		}
		if(select[0].RISK_STATUS!='05'){
			alert("请选择一条处理中的问题!");
			return ;
		}
		closeAndOpenInnerPageTab("questionHandle_track","处理问题","dev_project/questionManage/questionHandle/questionHandle_handle.html",
				function() {
			var selecsInfo=JSON.stringify(select);
			var params=JSON.parse(selecsInfo);
			initquestionHandle_Handleinfo(params[0]);
			initqHOperateLogList(params[0].RISK_ID);
			initqHHandelLogList(params[0].RISK_ID);
		});
	});
	//处理完成问题按钮事件

	currTab.find("#questionHandle_finish").click(function(){
		
		
	
		var select = getCurrentPageObj().find("#questionHandleTable").bootstrapTable('getSelections');
		if(select.length!=1){
			alert("请选择一条数据!");
			return ;
		}
		if(select[0].RISK_STATUS!="05"){
			alert("该问题未被处理");
			return;
		}
		var risk_id=select[0].RISK_ID;
		var first_classify= select[0].FIRST_CLASSIFY;
		var dispose='03';
		var risk_status='06';
		var qhcall = getMillisecond();
		var type="finish";
		nconfirm("确定完成处理问题吗？",function(){
		
		baseAjaxJsonp(dev_project+"QuestionHandle/updateQuestionHandleStatus.asp?SID="+SID+"&call="+qhcall+"&opt_type="+type+"&risk_id="+risk_id+"&first_classify="+first_classify+"&question_dispose_status="+dispose+"&risk_status="+risk_status+"&risk_name="+escape(encodeURIComponent(select[0].RISK_NAME))+"&present_user_id="+select[0].PRESENT_USER_ID+"&duty_user_id="+select[0].DUTY_USER_ID, null, function(data){
			if (data != undefined && data != null) {
				alert(data.msg);
				if(data.result=="true"){
					getCurrentPageObj().find("#questionHandleTable").bootstrapTable('refresh',{
						url:dev_project+"QuestionHandle/questionHandleQueryList.asp?SID="+SID+"&call="+handleCall});
			}
			}else{
				alert("处理失败！");
			}
		},qhcall);	
		});
	});
	
	
	
	
	//详情按钮
	getCurrentPageObj().find("#questionHandle_detail").click(function(){
		var selecs = getCurrentPageObj().find("#questionHandleTable").bootstrapTable('getSelections');
		if(selecs.length!=1){
			alert("请选择一条数据!");
			return ;
		}
		closeAndOpenInnerPageTab(
				"questionHandle_detail",
				"问题详情",
				"dev_project/questionManage/questionHandle/questionHandle_queryInfo.html",
				function() {
					var selecsInfo=JSON.stringify(selecs);
					var params=JSON.parse(selecsInfo);
					initqHQueryInfo(params[0]);
					initqHInfoOperateLogList(params[0].RISK_ID);
					initqHInfoHandelLogList(params[0].RISK_ID);
					
				});
		
	});

	
}
//修改问题状态
function updateQuestionStatus(obj){
	alert(obj);
 }
}