function initQuestionQueryLayout(row){
	var project_id = row.PROJECT_ID;
	var currTab=getCurrentPageObj();
	var queryListForm = currTab.find("#proQuestionQueryForm");
	var querytable = currTab.find("#proQuestionQueryTable");
    var questionQueryCall = "jq_1527672637331_qlist";
    var currentLoginUser = $("#currentLoginNo").val();
    
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
				"&call="+questionQueryCall +"&project_id="+project_id+ "&" + param});
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
			url : dev_project+"QuestionQuery/questionQueryList.asp?SID="+SID+"&call="+questionQueryCall+"&project_id="+project_id,
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
			},
			{
				field : "RISK_NAME",
				title : "问题名称",
				align : "center",
				width : 200,
			},
			{
				field : "FIRST_CLASSIFY_NAME",
				title : "问题分类",
				align : "center"
			}, {
				field : "RISK_STATUS_NAME",
				title : "问题状态",
				align : "center"
			},
			 {
				field : "PONDERANCE_NAME",
				title : "问题严重程度",
				align : "center"
			}/*,{
				field : "RISK_GRADE_NAME",
				title : "问题级别",
				align : "center"
			}*/
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
				width : "120px"
			}/*, {
				field : "CLOSE_DATE",
				title : "关闭日期",
				align : "center",
				width : "120px"
			}*/]
		});
	}
	
	//初始化页面按钮事件
	initBtnEvent_questionQuery();
	function initBtnEvent_questionQuery(){
		var url = dev_project+"QuestionQuery/questionQueryList.asp?SID="+SID+"&call="+questionQueryCall+"&project_id="+project_id;
		//新增按钮事件
		currTab.find("#question_add").click(function(){
			closeAndOpenInnerPageTab("questionRaise_add","新增问题","dev_project/questionManage/questionRaise/questionRaise_add.html",
					function() {
				initQuestionRaiseDic();
				initRiskQuestionSaveLayout();
				getCurrentPageObj().find("tr[name=question_project]").show();
				getCurrentPageObj().find("#project_name").val(row.PROJECT_NAME);
				getCurrentPageObj().find("#duty_user_id_name").val(row.PROJECT_MAN_NAME);
				getCurrentPageObj().find("#project_id").val(row.PROJECT_ID);
				getCurrentPageObj().find("#duty_user_id").val(row.PROJECT_MAN_ID);
				//setSelected(getCurrentPageObj().find("#risk_grade"),"01");
				initSelect(getCurrentPageObj().find("#risk_grade"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_RISK_LEVEL"},"01");
			});		
		});
		
		//修改按钮事件
		currTab.find("#question_update").click(function(){
			var rows = querytable.bootstrapTable('getSelections');
			if(rows.length!=1){
				alert("请选择一条数据!");
				return ;
			}
			if((rows[0].RISK_STATUS!="01")&&(rows[0].RISK_STATUS!="03")){
				alert("该问题不能修改!");
				return ;	
			}
			if(rows[0].PRESENT_USER_ID != currentLoginUser){
				alert("您不是该问题提出人，不能修改!");
				return ;
			}
			closeAndOpenInnerPageTab("questionRaise_update","修改问题","dev_project/questionManage/questionRaise/questionRaise_add.html",
				function() {
					initRiskQuestionSaveLayout();
					var rowsInfo=JSON.stringify(rows);
					var params=JSON.parse(rowsInfo);
					initQuestionRaiseUpdateInfo(params[0]);
				});
		});
		
		//提交按钮事件
		currTab.find("#question_sumbit").click(function(){
			var rows = querytable.bootstrapTable('getSelections');
			if(rows.length!=1){
				alert("请选择一条数据!");
				return ;
			}
			if((rows[0].RISK_STATUS!="01")&&(rows[0].RISK_STATUS!="03")){
				alert("该问题已经提交!");
				return ;	
			}
			if(rows[0].PRESENT_USER_ID != currentLoginUser){
				alert("您不是该问题提出人，不能提交!");
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
						querytable.bootstrapTable('refresh',{url:url});
				}
				}else{
					alert("提交失败！");
				}
			},qrdcall);
		});});
		//受理
		currTab.find("#question_accept").click(function(){
			var select = querytable.bootstrapTable('getSelections');
			if(select.length!=1){
				alert("请选择一条数据!");
				return ;
			}
			if((select[0].RISK_STATUS!="02")&&(select[0].RISK_STATUS!="07")){
				
				alert("该问题不能受理");
				return;
			}
			if(select[0].DUTY_USER_ID != currentLoginUser){
				alert("您不是该问题的责任人，不能进行受理!");
				return ;
			}
			closeAndOpenInnerPageTab("questionAccept_acccept","受理问题","dev_project/questionManage/questionAccept/questionAccept_accept.html",
					function() {
				initAcceptInfoLayout();
				var selecsInfo=JSON.stringify(select);
				var params=JSON.parse(selecsInfo);
				initquestionAccept_Acceptinfo(params[0]);
				initqAOperateLogList(params[0].RISK_ID);
			}		
			);
		});
		//处理问题按钮事件
		currTab.find("#question_handle").click(function(){
			var select = querytable.bootstrapTable('getSelections');
			if(select.length!=1){
				alert("请选择一条数据!");
				return ;
			}
			if(select[0].RISK_STATUS!='04'){
				alert("请选择一条待处理的问题!");
				return ;
			}
			if(select[0].OPT_USER_ID!= currentLoginUser){
				alert("您不是该问题的处理人，不能进行处理!");
				return ;
			}
			var type="update";
			var calls = getMillisecond()+1;
			var calln = getMillisecond()+2;
			var risk_status='05';
			var question_dispose_status='02';
			baseAjaxJsonp(dev_project+"QuestionHandle/updateQuestionHandleStatus.asp?SID="+SID+"&call="+calls+"&opt_type="+type+"&risk_id="+select[0].RISK_ID+"&risk_status="+risk_status+"&question_dispose_status="+question_dispose_status+"&risk_name="+select[0].RISK_NAME+"&present_user_id="+select[0].PRESENT_USER_ID+"&duty_user_id="+select[0].DUTY_USER_ID, null, function(data){
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
		});
		//处理问题按钮事件
		currTab.find("#question_track").click(function(){
			var select = querytable.bootstrapTable('getSelections');
			if(select.length!=1){
				alert("请选择一条数据!");
				return ;
			}
			if(select[0].RISK_STATUS!='05'){
				alert("请选择一条处理中的问题!");
				return ;
			}
			if(select[0].OPT_USER_ID!= currentLoginUser){
				alert("您不是该问题的处理人，不能进行跟踪!");
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
		currTab.find("#question_finish").click(function(){
			var select = querytable.bootstrapTable('getSelections');
			if(select.length!=1){
				alert("请选择一条数据!");
				return ;
			}
			if(select[0].RISK_STATUS!="05"){
				alert("该问题未被处理");
				return;
			}
			if(select[0].OPT_USER_ID!= currentLoginUser){
				alert("您不是该问题的处理人，不能完成确认!");
				return ;
			}
			var risk_id=select[0].RISK_ID;
			var first_classify= select[0].FIRST_CLASSIFY;
			var dispose='03';
			var risk_status='06';
			var qhcall = getMillisecond();
			var type="finish";
			nconfirm("确定完成处理问题吗？",function(){
			baseAjaxJsonp(dev_project+"QuestionHandle/updateQuestionHandleStatus.asp?SID="+SID+"&call="+qhcall+"&opt_type="+type+"&risk_id="+risk_id+"&first_classify="+first_classify+"&question_dispose_status="+dispose+"&risk_status="+risk_status+"&risk_name="+select[0].RISK_NAME+"&present_user_id="+select[0].PRESENT_USER_ID+"&duty_user_id="+select[0].DUTY_USER_ID, null, function(data){
				if (data != undefined && data != null) {
					alert(data.msg);
					if(data.result=="true"){
						querytable.bootstrapTable('refresh',{
							url:dev_project+"QuestionHandle/questionHandleQueryList.asp?SID="+SID+"&call=jq_1527672637331_qlist"});
				}
				}else{
					alert("处理失败！");
				}
			},qhcall);	
			});
		});
		//验证按钮事件
		currTab.find("#question_validate").click(function(){
			var select = querytable.bootstrapTable('getSelections');
			if(select.length!=1){
				alert("请选择一条数据!");
				return ;
			}
			if(select[0].RISK_STATUS!="06"){
				alert("该问题不是处理完成不可验证!");
				return ;	
			}
			if(select[0].PRESENT_USER_ID != currentLoginUser){
				alert("您不是该问题提出人!");
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
		
		//删除按钮事件
		currTab.find("#question_delete").click(function(){
			var rows = querytable.bootstrapTable('getSelections');
			if(rows.length!=1){
				alert("请选择一条数据!");
				return ;
			}
			if(rows[0].RISK_STATUS!="01")
			{
				alert("该问题不是草拟状态不可删除!");
				return ;	
			}
			if(rows[0].PRESENT_USER_ID != currentLoginUser){
				alert("您不是该问题提出人!");
				return ;
			}
			var risk_id=rows[0].RISK_ID;
			var qrdcall = getMillisecond();
			nconfirm("确定删除问题吗？",function(){
			baseAjaxJsonp(dev_project+"QuestionRaise/deleteQuestionRaise.asp?SID="+SID+"&call="+qrdcall+"&risk_id="+risk_id, null, function(data){
				if (data != undefined && data != null) {
					alert(data.msg);
					 if(data.result=="true"){
						 querytable.bootstrapTable('refresh',{
								url:url});
						}
				}else{
					alert("删除失败！");
				}
			},qrdcall);});
		});
		
		//详情按钮事件
		getCurrentPageObj().find("#questionQuery_detail").click(function(){
			var rows = querytable.bootstrapTable('getSelections');
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
}
