;function initRiskQuestionValidateLayout(risk_id, first_classify, RISK_STATUS){
	
	var currTab = getCurrentPageObj();
	
	var form = currTab.find("#riskQuestionInfo_validate");
	var validate_div = currTab.find("#riskQuestionInfo_validate_div");
	var table = currTab.find("#riskQuestionValidate_table");
	currTab.find("input[name=RISK_ID]").val(risk_id);
	currTab.find("input[name=RISK_TYPE]").val(first_classify);
	currTab.find("input[name=RISK_STATUS]").val(RISK_STATUS);
	//initVlidate(form)
	
	//保存提交操作
	var submit = currTab.find("#riskQuestionInfo_validate_submit");
	submit.click(function(e){
		var call = getMillisecond();
		var content = '';
		content += form.serialize();
		baseAjaxJsonp(dev_project+"riskQuestionManage/riskValidateSave.asp?SID="+SID+"&call="+call+"&"+content, null, function(data){
			
			if (data != undefined && data != null) {
				alert("保存成功");
				if(data.result=="true"){
					closeCurrPageTab();
				}
			}else{
				alert("未知错误！");
			}
		},call);
    });
	//返回
	var back = currTab.find("#riskQuestionInfo_validate_back");
	back.click(function(e){
		closeCurrPageTab();
	});
	//初始化状态框按钮
	var arr = "01,02,03,04";
	initSelect(currTab.find("#RISK_STATUS_ID"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_RISK_STATUS"},null,null,arr);
	
	//初始化数据
	if(risk_id){
		//update
		var call = getMillisecond();
		baseAjaxJsonp(dev_project+"riskQuestionManage/queryOneProjectRisk.asp?call="+call+"&SID="+SID+"&RISK_ID="+risk_id, null, function(result){
			/*//项目项目基本信息
				for(var i in result){
					validate_div.find("select[name="+i+"]").attr("value",result[i]);
				}*/
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
	
	/*baseAjaxJsonp(dev_project+"riskQuestionManage/queryProjectRiskRecord.asp?SID="+SID+"&call="+tableCall+"&RISK_ID="+risk_id, null, function(result){
		table.bootstrapTable("load",result);
	}, tableCall);*/
	
}