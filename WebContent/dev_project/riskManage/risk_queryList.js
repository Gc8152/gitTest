var tableCall = getMillisecond();
initRiskManageTab();
initBtnEvent_riskPage();
initRiskDicCode();

//加载字典项
function initRiskDicCode(){
	initSelect(getCurrentPageObj().find("#risk_level"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_RISK_LEVEL"});
	initSelect(getCurrentPageObj().find("#risk_possible"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_RISK_POSSIBLE"});
	initSelect(getCurrentPageObj().find("#risk_effect"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_RISK_EFFECT"});
}
//初始化风险列表
function initRiskManageTab(){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	getCurrentPageObj().find("#riskManageTable").bootstrapTable({
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
			field : "RISK_NAME",
			title : "风险名称",
			align : "center"
			/*field : "flag",
			title : "标识",
			align : "center"*/
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
			title : "风险类型",
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
			field : "RISK_PROBABILITYS",
			title : "风险可能性",
			align : "center"
		}, {
			field : "PRESENT_TIME",
			title : "提出日期",
			align : "center"
		}, {
			field : "NO_RISK",
			title : "风险是否关闭",
			align : "center",
			formatter:function(value,row,index){if(value=="00"){return "是";}return "否";}
		}]
	});
}
//初始化页面按钮事件
function initBtnEvent_riskPage(){
	//提出按钮事件
	getCurrentPageObj().find("#risk_present").click(function(){
		openInnerPageTab(
				"risk_add",
				"风险提出",
				"dev_project/riskManage/risk_add.html",
				function() {
					
				});

	});
	//跟踪按钮事件
	getCurrentPageObj().find("#risk_track").click(function(){
		var rows = getCurrentPageObj().find("#riskManageTable").bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据!");
			return ;
		}
		ida=rows[0];
		if(ida.NO_RISK=='00'){
			alert("该风险已关闭!");
			return ;
		}
		var currentLoginName=$("#currentLoginName").val();
		if(ida.DUTY_USER_NAME!=currentLoginName){
			alert("您不是该项目的责任人!");
			return ;
		}
		openInnerPageTab(
				"risk_track",
				"风险跟踪",
				"dev_project/riskManage/risk_follow.html",
				function() {
					initRiskFollowBtn(ida);
				});

	});
	//风险关闭按钮事件
	getCurrentPageObj().find("#risk_close").click(function(){
		var rows = getCurrentPageObj().find("#riskManageTable").bootstrapTable('getSelections');
		var risk_from =rows[0].RISK_FROM_ID;
		var risk_name =rows[0].PRESENT_USER_NAME;
		var risk_riskname =rows[0].RISK_NAME;
		if(rows.length!=1){
			alert("请选择一条数据!");
			return ;
		}
		var currentLoginName=$("#currentLoginName").val();
		if(risk_name!=currentLoginName){
			alert("您不是该项目的提出人!");
			return ;
		}
		var risk_cid = '02';
		nconfirm("是否确定关闭风险？",function(){
			getCurrentPageObj().find('#riskManageTable').bootstrapTable('refresh',{
				url: dev_project+"riskQuestionManage/queryListProjectRisk.asp?SID="+SID+"&call="+tableCall+'&risk_from='+risk_from+'&risk_cid='+risk_cid+'&risk_riskname='+risk_riskname
			});
			alert("风险关闭成功!");
		});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#risk_close").click();});
	//转问题
	getCurrentPageObj().find("#turn_question").click(function(){
		var rows = getCurrentPageObj().find("#riskManageTable").bootstrapTable('getSelections');
		var risk_from =rows[0].RISK_FROM_ID;
		if(rows.length!=1){
			alert("请选择一条数据!");
			return ;
		}
		ida=rows[0];
		if(ida.NO_RISK=='00'){
			alert("该风险已关闭!");
			return ;
		}
		if(ida.RISK_PROBABILITYS==null){
			alert("该风险尚未跟踪!");
			return ;
		}
		var risk_namea=ida.RISK_NAME;
		var risk_typea=ida.FIRST_CLASSIFY;
		var risk_gradea=ida.RISK_GRADE;
		var risk_nameb =ida.PRESENT_USER_ID;
		var risk_mana =ida.DUTY_USER_ID;
		
		var risk_desc = ida.RISK_DESC;
		var find_time=ida.FIND_TIME;
		var present_time=ida.PRESENT_TIME;
		var risk_probability=ida.RISK_PROBABILITY;
		var risk_influence =ida.RISK_INFLUENCE;
		var respond_measure=ida.RESPOND_MEASURE;
		var remission_measure=ida.REMISSION_MEASURE;
		var reply_measure=ida.REPLY_MEASURE;
		var dispose_plan =ida.DISPOSE_PLAN;
		var question_affrct_analyse=ida.QUESTION_AFFECT_ANALYSE
		var url=dev_project+"riskQuestionManage/queryListProjectRiskChange.asp?";
		nconfirm("是否确定转问题？",function(){
		baseAjaxJsonp(url,{SID:SID,risk_from:risk_from,risk_namea:risk_namea,risk_typea:risk_typea,risk_gradea:risk_gradea,risk_nameb:risk_nameb,risk_mana:risk_mana
			,risk_desc:risk_desc,find_time:find_time,present_time:present_time,risk_probability:risk_probability,risk_influence:risk_influence,respond_measure:respond_measure
			,remission_measure:remission_measure,reply_measure:reply_measure,dispose_plan:dispose_plan,question_affrct_analyse:question_affrct_analyse},function(msg){
			alert("转问题成功！");
		    });
		});
	});
	//查询
	getCurrentPageObj().find("#query_riskList").click(function(){
		var risk_int = $.trim(getCurrentPageObj().find("#risk_int").val());
		var risk_name = $.trim(getCurrentPageObj().find("#risk_name").val());
		var risk_possible = getCurrentPageObj().find("#risk_possible").val();
		var risk_level = getCurrentPageObj().find("#risk_level").val();
		var risk_effect = getCurrentPageObj().find("#risk_effect").val();
		getCurrentPageObj().find('#riskManageTable').bootstrapTable('refresh',{
			url: dev_project+"riskQuestionManage/queryListProjectRisk.asp?SID="+SID+"&call="+tableCall+'&risk_int='+escape(encodeURIComponent(risk_int))
			+'&risk_name='+escape(encodeURIComponent(risk_name))+"&risk_possible="+risk_possible+'&risk_level='+risk_level+'&risk_effect='+risk_effect
		});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#query_riskList").click();});
	//重置
	getCurrentPageObj().find("#reset_riskForm").click(function(){
		getCurrentPageObj().find("#risk_int").val("");
		getCurrentPageObj().find("#risk_name").val("");
		var select1 =getCurrentPageObj().find("#risk_possible").val("");
		var select2 =getCurrentPageObj().find("#risk_level").val("");
		var select3 =getCurrentPageObj().find("#risk_effect").val("");
		select1.val(" ");
		select1.select2();
		select2.val(" ");
		select2.select2();
		select3.val(" ");
		select3.select2();
	});
}