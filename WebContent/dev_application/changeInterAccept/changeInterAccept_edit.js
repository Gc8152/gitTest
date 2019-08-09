//初始化列表

function initTableInfo(item) {
	var currTab = getCurrentPageObj();
	for (var key in item) {
		currTab.find("#"+key).html(item[key]);
	}
	currTab.find("input[name^='C.app_id']").val(item["APP_ID"]);
	currTab.find("input[name^='C.inter_id']").val(item["INTER_ID"]);
	currTab.find("input[name^='C.record_app_num']").val(item["RECORD_APP_NUM"]);
	initChangeAcceptInfo(item.APP_ID,item.INTER_ID,item.INTER_VERSION,item.RECORD_APP_NUM);

	initPageSelect();
	//初始化下拉菜单
	function initPageSelect(){
		//申请单打回原因
		initSelect(getCurrentPageObj().find("#mng_repulse_reasonCA1"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"I_DIC_REPULSE_REASON"});

	}
	
	
	//同意开放隐藏打回原因
	currTab.find(":radio").click(function(){
		var rv = $(this).val();
		if(rv == '01'){
			currTab.find("#cAcceptTable").find('tr:eq(0)').find('td:eq(2)').hide();
			currTab.find("#cAcceptTable").find('tr:eq(0)').find('td:eq(3)').hide();
			currTab.find("#cAcceptTable").find('tr:eq(0)').find('td:eq(1)').attr("colspan","3");
			currTab.find("#cAcceptTable").find("#mng_repulse_reasonCA1").attr({validate:"",valititle:""});
		}else{
			currTab.find("#cAcceptTable").find('tr:eq(0)').find('td:eq(2)').show();
			currTab.find("#cAcceptTable").find('tr:eq(0)').find('td:eq(3)').show();
			currTab.find("#cAcceptTable").find('tr:eq(0)').find('td:eq(1)').attr("colspan","1");
			currTab.find("#cAcceptTable").find("#mng_repulse_reasonCA1").attr({validate:"v.required",valititle:"该项为必填项"});
		}
	});
	
	
	//保存
	$('#save_button').click(function(){
		var param = getPageParam("C");
		var mng_accept_result = param["mng_accept_result"];
		var remindParam={};
		remindParam["b_code"] = param["record_app_num"];
		remindParam["b_id"] = param["record_app_num"];
		remindParam["user_id"] = item["APP_USER"];
		var changeCall = getMillisecond()+'1';
		var spCall = getMillisecond();
		
		var aaa=getCurrentPageObj().find("#MNG_ACCEPT_REMARK").val();
	    if(aaa.length>250){
	    	alert("受理意见至多可输入250汉字！");
	    	return;
	    }
		
		var url = dev_application+'interChangeAccept_info/updateInterChangeAccept.asp?call='+spCall+'&SID='+SID;
		baseAjaxJsonp(url, param, function(data){
			if (data != undefined&&data!=null&&data.result=="true") {
				alert("保存成功！",function(){
					if(mng_accept_result=='00'){//拒绝(变更申请单被管理岗打回)
						remindParam["b_name"] = "您的接口变更申请单（"+remindParam["b_code"]+"）被管理岗打回";
						baseAjaxJsonp(dev_workbench+"Remind/remindAdd.asp?SID="+SID+"&call="+changeCall+"&remind_type=PUB2017159",
								remindParam, function(mes){
							//接口使用申请插入提醒成功
							}, changeCall);
					}else{//同意(变更申请单已受理)
						remindParam["b_name"] = "您的接口变更申请单（"+remindParam["b_code"]+"）管理岗已受理";
						baseAjaxJsonp(dev_workbench+"Remind/remindAdd.asp?SID="+SID+"&call="+changeCall+"&remind_type=PUB2017159",
								remindParam, function(mes){
							//接口使用申请插入提醒成功
							}, changeCall);
					}
					closeCurrPageTab();
				});
			} else {
				alert(data.msg);
			}
		}, spCall);
	});
	
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
	getCurrentPageObj().find("#ac_useRelationTable").bootstrapTable({
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
	
	///var queryAttrParams=function(params){
		///var temp={
		//	limit: params.limit, //页面大小
			//offset: params.offset //页码
		//};
		
		///return temp;
	//};
	var queryChange_call = getMillisecond()+'attr';
	getCurrentPageObj().find("#changeAttrTable").bootstrapTable({
		
		//请求后台的URL（*）
		url :dev_application+'IAnalyse/queryInterChageInfo.asp?call='+queryChange_call+'&SID='+SID+'&APP_ID='+APP_ID+'&INTER_ID='+INTER_ID+'&INTER_VERSION='+INTER_VERSION,
		method : 'get', //请求方式（*）   
		striped : true, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		//queryParams : queryAttrParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		clickToSelect : false, //是否启用点击选中行
		uniqueId : "apply_id", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		jsonpCallback:queryChange_call,
		detailView : false, //是否显示父子表
		onLoadSuccess:function(data){
			gaveInfo();	
			//初始化字典项
			CiAcceptAutoInitSelect(getCurrentPageObj().find("#changeAttrTable"));
		},
		columns : [{
			field : "ATTR_NAME",
			title : "属性名",
			align : "center",
			width : "33.333%",
		}, {
			field : "OLD_ATTR_VALUE_NAME",
			title : "变更前",
			align : "center",
			width : "33.333%",
		}, {
			field : 'CHANG_VALUE',
			title : '变更后',
			align : "center",
			width : "33.333%",
			formatter:function(value, row, index) {
				var str = "";
				if(row.ATTR_TYPE=="00"){//00表示文本框
					str += "<div  attr_id='" + row.ATTR_ID + "'>"+ row.CHANG_VALUE + "</div>";
				} else if(row.ATTR_TYPE=="01"){//01表示下拉单选
					str += "<div value='"+ row.CHANG_VALUE + "' diccode='"+row.DIC_INFO+"'></div>";
				} else if(row.ATTR_TYPE=="02"){//02表示下拉多选
					str += "<div value='"+ row.CHANG_VALUE +"' diccode='"+row.DIC_INFO+"'></div>";
				} else if(row.ATTR_TYPE=="03"){//二选一
					str += "<div value='"+ row.CHANG_VALUE + "' diccode='"+row.DIC_INFO+"'></div>";
				}
				return str;
			}
		}]
	});
	var opeCall = getMillisecond();
	getCurrentPageObj().find("#changeInterAccEOHTable").bootstrapTable('destroy').bootstrapTable({
		//请求后台的URL（*）
		url :dev_application+'serUseInterAccept/querySerOperationHistory.asp?SID='+SID+'&call='+opeCall+'&RECORD_APP_NUM='+RECORD_APP_NUM,
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
		jsonpCallback : opeCall,
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
//初始化div内容根据DIC_CODE和Item_code
function CiAcceptAutoInitSelect(tableObj) {
	// 初始化下拉选d
	var divs = tableObj.find("[diccode]");
	for (var i = 0; i < divs.length; i++) {
			var obj = getCurrentPageObj().find(divs[i]);
			var attr_value = getCurrentPageObj().find(divs[i]).attr("value");
			var dcode = getCurrentPageObj().find(divs[i]).attr("diccode");
			if (dcode!= "" &&dcode != undefined) {
				baseAjax("SDic/findItemByDic.asp", { dic_code : dcode }, function(data) {
					if (data != undefined) {
						var strs = new Array(); // 定义一数组
						strs = attr_value.split(","); // 字符分割
							var str = "";
							for ( var j = 0; j < strs.length; j++) {
								for ( var i = 0; i < data.length; i++) {
									if (data[i]["ITEM_CODE"] == strs[j]) {
										if (j != strs.length - 1) {
											str += data[i]["ITEM_NAME"] + ",";
										} else {
											str += data[i]["ITEM_NAME"];
										}
									}// if
								}// for
							}// for
						obj.text(str);
						}
					
				},false);
			}//if
	}//for
}