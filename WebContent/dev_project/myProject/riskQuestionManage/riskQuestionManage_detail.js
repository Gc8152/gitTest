;function initRiskQuestionDetailLayout(id, risk_id, risk_type){
	
	var currTab = getCurrentPageObj();
	
	var form = currTab.find("#riskQuestionInfo_add_common");
	var riskForm = currTab.find("#riskQuestionInfo_add_risk");
	var questionForm = currTab.find("#riskQuestionInfo_add_question");
	var risk_div = currTab.find("#riskQuestionInfo_add_risk_div");
	var question_div = currTab.find("#riskQuestionInfo_add_question_div");
	var table = currTab.find("#riskQuestionValidate_table");
	//initVlidate(form)
	
	var back = currTab.find("#riskQuestionInfo_add_back");
	back.click(function(e){
		closeCurrPageTab();
	});
	
	var type = currTab.find("select[name=FIRST_CLASSIFY]");
	type.bind('change',function(){
		if(type.val()=='01'){
			risk_div.show();
			question_div.hide();
		} else if(type.val()=='02') {
			risk_div.hide();
			question_div.show();
		}
	});
	
	initLayout();
	function initLayout(){
		if(risk_type=='01'){
			question_div.hide();
		} else if(risk_type='02'){
			risk_div.hide();
		}
	}
	
	if(risk_id){
		//update
		var call = getMillisecond()+1;
		baseAjaxJsonp(dev_project+"riskQuestionManage/queryOneProjectRisk.asp?call="+call+"&SID="+SID+"&RISK_ID="+risk_id, null, function(result){
			//项目项目基本信息
			for(var i in result){
				form.find("div[name="+i+"]").html(result[i]);
				if(risk_type=='01'){
					riskForm.find("div[name="+i+"]").html(result[i]);
				} else if(risk_type=='02'){
					questionForm.find("div[name="+i+"]").html(result[i]);
				}
			}
		},call);
	}
	
	/**		初始化table	**/
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	var tableCall = getMillisecond();
	table.bootstrapTable("destroy").bootstrapTable({
		//请求后台的URL（*）
		url : dev_project+"riskQuestionManage/queryProjectRiskRecord.asp?SID="+SID+"&call="+tableCall+"&RISK_ID="+risk_id,
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [10,15],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "RECORD_ID", //每一行的唯一标识，一般为主键列
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
			field : 'OPERATE_TIME',
			title : '日期',
			align : "center"
		}, {
			field : "OPERATE_USER_NAME",
			title : "操作人",
			align : "center"
		}, {
			field : "OPERATE_STATUS",
			title : "操作",
			align : "center"
		}, {
			field : "DESCR",
			title : "备注",
			align : "center"
		}, {
			field : "RISK_STATUS_NAME",
			title : "风险状态",
			align : "center"
		}, {
			field : "FILE_ID",
			title : "附件",
			align : "center"
		}]
	});
	
}