getCurrentPageObj().find("input[name='close']").click(function(){
	
	closeCurrObj();
});
//初始化列表
function initTableInfo(item) {
	var currTab = getCurrentPageObj();
	for (var key in item) {
		//var key = key.toLowerCase();
		currTab.find("#"+key).html(item[key]);
	}
	currTab.find("input[name^='CA.app_id']").val(item["APP_ID"]);
	currTab.find("input[name^='CA.inter_id']").val(item["INTER_ID"]);
	currTab.find("input[name^='CA.record_app_num']").val(item["RECORD_APP_NUM"]);
	initChangeAcceptInfo(item.APP_ID,item.INTER_ID,item.INTER_VERSION,item.RECORD_APP_NUM);
	if(item["MNG_ACCEPT_RESULT"]=="01"){
		$("#mng_accept_resultCIA1").attr("checked",true);
		currTab.find("#task_analyzer_hide").hide();
		getCurrentPageObj().find('#change_accept_hide').hide();
		getCurrentPageObj().find('#change_accept_hide1').hide();
	}else{
		$("#mng_accept_resultCIA2").attr("checked",true);
	}
	initSelect(getCurrentPageObj().find("#mng_repulse_reasonCA1"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"I_DIC_REPULSE_REASON"},item.MNG_REPULSE_REASON);
	
	
};
//初始化页面table  
function initChangeAcceptInfo(APP_ID,INTER_ID,INTER_VERSION,RECORD_APP_NUM) {	
	// 初始化接口调用关系表
	var queryParams = function(params) {
		var temp = {
			limit : params.limit, // 页面大小
			offset : params.offset
		};
		return temp;
	};
	var call_send = getMillisecond();
	getCurrentPageObj().find("#info_useRelationTable").bootstrapTable({
		url : dev_application
				+ 'InterQuery/interUseRelationQuery.asp?SID=' + SID
				+ '&call=' + call_send + '&inter360_id=' + INTER_ID,
		method : 'get', // 请求方式（*）
		dataType : 'jsonp',
		striped : false, // 是否显示行间隔色
		cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, // 是否启用排序
		sortOrder : "asc", // 排序方式
		queryParams : queryParams,// 传递参数（*）
		sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
		pagination : true, // 是否显示分页（*）
		pageList : [ 10, 15 ],// 每页的记录行数（*）
		pageNumber : 1, // 初始化加载第一页，默认第一页
		pageSize : 10,// 可供选择的每页的行数（*）
		clickToSelect : true, // 是否启用点击选中行
		uniqueId : "con_system_id", // 每一行的唯一标识，一般为主键列
		cardView : false, // 是否显示详细视图
		detailView : false, // 是否显示父子表
		singleSelect : true,
		jsonpCallback : call_send,
		onLoadSuccess : function(data){
			gaveInfo();
		},
		columns : [ {
			field : 'con_system_id',
			title : '序号',
			align : "center",
			sortable : true,
			formatter : function(value, row, index) {
				return index + 1;
			}
		}, {
			field : 'CON_SYSTEM_ID',
			title : '消费方应用编号',
			align : 'center'
		}, {
			field : 'SYSTEM_NAME',
			title : '消费方应用名称',
			align : 'center'
		}, {
			field : 'START_TIME',
			title : '开始日期',
			align : "center"
		} ]
	});
	var currTab = getCurrentPageObj();
	var queryInput_call = getMillisecond()+'input';
	var queryInputParams=function(params){
		var temp={
//			limit: params.limit, //页面大小
//			offset: params.offset, //页码
			WAY_TYPE:'00'
		};
		return temp;
	};
	getCurrentPageObj().find("#InputContentTable").bootstrapTable({
		//请求后台的URL（*）
		url :dev_application+'IAnalyse/queryContentList.asp?call='+queryInput_call+'&SID='+SID+'&APP_ID='+APP_ID,
		method : 'get', //请求方式（*）   
		striped : true, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryInputParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
//		pagination : true, //是否显示分页（*）
//		pageList : [5,10],//每页的记录行数（*）
//		pageNumber : 1, //初始化加载第一页，默认第一页
//		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "apply_id", //每一行的唯一标识，一般为主键列
		jsonpCallback:queryInput_call,
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		onLoadSuccess : function(data){
			gaveInfo();
		},
		columns : [ {
			field : 'Number',
			title : '序号',
			align : "center",
			sortable: true,
			width : "8%",
			formatter: function (value, row, index) {
				return index+1;
			}
		},{
			field : "DATA_CHNNAME",
			title : "字段名(中文)",
			align : "center",
			width : "10%"
		}, {
			field : "DATA_ENGNAME",
			title : "1级字段名(英文)",
			align : "center",
			width : "10%"
		}, {
			field : "DATA_ENGNAMEA",
			title : "2级字段名(英文)",
			align : "center",
			width : "10%"
		}, {
			field : "DATA_ENGNAMEB",
			title : "3级字段名(英文)",
			align : "center",
			width : "10%"
		}, {
			field : 'DATA_TYPE_NAME',
			title : '类型',
			align : "center",
			width : "8%"
		}, {
			field : "MSG_LENGTH",
			title : "长度",
			align : "center",
			width : "8%"
		},{
			field : "IS_NECESSARY_NAME",
			title : "是否必输",
			align : "center",
			width : "8%"
		}, {
			field : "STANDARD_CODE",
			title : "标准代码",
			align : "center",
			width : "8%"
		},{
			field : "DATA_INSTRUCTION",
			title : "内容说明",
			align : "center",
			width : "10%"
		},{
			field : "INFO_REMARK",
			title : "备注",
			align : "center",
			width : "10%"
		}]
	});
	
	var queryOutParams=function(params){
		var temp={
//			limit: params.limit, //页面大小
//			offset: params.offset, //页码
			WAY_TYPE:'01'	
		};
		return temp;
	};
	var queryOutput_call = getMillisecond()+'output';
	getCurrentPageObj().find("#OutputContentTable").bootstrapTable({
		//请求后台的URL（*）
		url :dev_application+'IAnalyse/queryContentList.asp?call='+queryOutput_call+'&SID='+SID+'&APP_ID='+APP_ID,
		method : 'get', //请求方式（*）   
		striped : true, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryOutParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
//		pagination : true, //是否显示分页（*）
//		pageList : [5,10],//每页的记录行数（*）
//		pageNumber : 1, //初始化加载第一页，默认第一页
//		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "apply_id", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		jsonpCallback:queryOutput_call,
		detailView : false, //是否显示父子表
		singleSelect: true,
		onLoadSuccess : function(data){
			gaveInfo();
		},
		columns : [ {
			field : 'Number',
			title : '序号',
			align : "center",
			width : "8%",
			sortable: true,
			formatter: function (value, row, index) {
				return index+1;
			}
		},{
			field : "DATA_CHNNAME",
			title : "字段名(中文)",
			align : "center",
			width : "10%"
		}, {
			field : "DATA_ENGNAME",
			title : "1级字段名(英文)",
			align : "center",
			width : "10%"
		}, {
			field : "DATA_ENGNAMEA",
			title : "2级字段名(英文)",
			align : "center",
			width : "10%"
		}, {
			field : "DATA_ENGNAMEB",
			title : "3级字段名(英文)",
			align : "center",
			width : "10%"
		}, {
			field : 'DATA_TYPE_NAME',
			title : '类型',
			align : "center",
			width : "8%"
		}, {
			field : "MSG_LENGTH",
			title : "长度",
			align : "center",
			width : "8%"
		},{
			field : "IS_NECESSARY_NAME",
			title : "是否必输",
			align : "center",
			width : "8%"
		}, {
			field : "STANDARD_CODE",
			title : "标准代码",
			align : "center",
			width : "8%"
		},{
			field : "DATA_INSTRUCTION",
			title : "内容说明",
			align : "center",
			width : "10%"
		},{
			field : "INFO_REMARK",
			title : "备注",
			align : "center",
			width : "10%"
		}]
	});
	
	var queryAttrParams=function(params){
		var temp={
			limit: params.limit, //页面大小
			offset: params.offset //页码
		};
		return temp;
	};
	var queryChange_call = getMillisecond()+'attr';
	getCurrentPageObj().find("#changeAttrTable").bootstrapTable({
		//请求后台的URL（*）
		url :dev_application+'IAnalyse/queryInterChageInfo.asp?call='+queryChange_call+'&SID='+SID+'&APP_ID='+APP_ID+'&INTER_ID='+INTER_ID+'&INTER_VERSION='+INTER_VERSION,
		method : 'get', //请求方式（*）   
		striped : true, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryAttrParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "apply_id", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		jsonpCallback:queryChange_call,
		detailView : false, //是否显示父子表
		singleSelect: true,
		onLoadSuccess : function(data){
			gaveInfo();
		},
		columns : [{
			field : "ATTR_NAME",
			title : "属性名",
			align : "center",
			width : "33%"
		}, {
			field : "OLD_ATTR_VALUE_NAME",
			title : "变更前",
			align : "center",
			width : "33%"
		}, {
			field : 'CHANGE_VALUE_NAME',
			title : '变更后',
			align : "center",
			width : "25%",
		
		}]
	});
	
	//操作历史
	var opqCall = getMillisecond();
	getCurrentPageObj().find("#changeInterAccQOHTable").bootstrapTable('destroy').bootstrapTable({
		//请求后台的URL（*）
		url :dev_application+'serUseInterAccept/querySerOperationHistory.asp?SID='+SID+'&call='+opqCall+'&RECORD_APP_NUM='+RECORD_APP_NUM,
		method : 'get', //请求方式（*）   
		striped : true, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [5,10],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		//uniqueId : "", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback : opqCall,
		singleSelect: true,
		onLoadSuccess : function(data){
			gaveInfo();
		},
		columns : [{
			field : "OPT_TIME",
			title : "时间",
			align : "center"
		}, {
			field : 'OPT_USER',
			title : '人员',
			align : "center"
		}, {
			field : 'OPT_ACTION',
			title : '操作',
			align : "center"
		},{
			field : 'OPT_RESULT_NAME',
			title : '受理/分析结论',
			align : "center"
		},{
			field : "OPT_REMARK",
			title : "相关说明",
			align : "center"
		}
		
		]
	});
}
