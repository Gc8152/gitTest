;function initRiskQuestionRecordLayout(risk_id, first_classify){
	
	var currTab = getCurrentPageObj();
	currTab.find("input[name=RISK_ID]").val(risk_id);
	var riskForm = currTab.find("#riskQuestionInfo_record_risk");
	var questionForm = currTab.find("#riskQuestionInfo_record_question");
	var risk_div = currTab.find("#riskQuestionInfo_record_risk_div");
	var question_div = currTab.find("#riskQuestionInfo_record_question_div");
	var table = currTab.find("#riskQuestionRecord_table");
	
	question_div.hide();
	risk_div.hide();
	/*if(first_classify=='01'){
		//autoInitSelect(risk_div);
	} else if(first_classify=='02'){
		//autoInitSelect(question_div);
	}*/
	initVlidate(currTab);
	//跟踪的保存
	var submit = currTab.find("#riskQuestionInfo_record_submit");
	submit.click(function(e){
		var content = "";
		if(!vlidate(currTab,"",true)){
			return ;
		}
		if(first_classify=='01'){
			//content += encodeURI(riskForm.serialize());
			content += riskForm.serialize();
			content += "&RISK_TYPE=01&RISK_ID=" + risk_id;
		} else if(first_classify='02'){
			content += encodeURI(questionForm.serialize());
			content += "&RISK_TYPE=02&RISK_ID=" + risk_id;
		}
		var call = getMillisecond()+1;
		baseAjaxJsonp(dev_project+"riskQuestionManage/riskRecordSave.asp?SID="+SID+"&call="+call+"&"+content, null, function(data){
			if (data != undefined && data != null) {
				alert(data.msg);
				if(data.result=="true"){
					closeCurrPageTab();
				}
			}else{
				alert("未知错误！");
			}
		},call);
    });
	//返回
	var back = currTab.find("#riskQuestionInfo_record_back");
	back.click(function(e){
		closeCurrPageTab();
	});
	//项目、风险、问题项目基本信息
	if(risk_id){
		//update
		var call = getMillisecond()+2;
		baseAjaxJsonp(dev_project+"riskQuestionManage/queryOneProjectRisk.asp?call="+call+"&SID="+SID+"&RISK_ID="+risk_id, null, function(result){
			//项目、风险、问题项目基本信息
			if(first_classify=='01'){
				for(var i in result){
					risk_div.find("div[name="+i+"]").html(result[i]);
					//初始化状态框按钮
					var arr = "01,05,06,07";
					initSelect(currTab.find("#RISK_STATUS_ID"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_RISK_STATUS"},null,null,arr);
					
				}
				question_div.hide();
				risk_div.show();
			} else if(first_classify=='02'){
				for(var i in result){
					question_div.find("div[name="+i+"]").html(result[i]);
					//初始化状态框按钮
					var arr = "01,05,06,07";
					initSelect(currTab.find("#RISK_STATUS_ID2"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_RISK_STATUS"},null,null,arr);
					
				}
				risk_div.hide();
				question_div.show();
			}
		},call);
	} 
	
	//跟踪表数据
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
			/*formatter : function(value, row, index){
				return index+1;
			}*/
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