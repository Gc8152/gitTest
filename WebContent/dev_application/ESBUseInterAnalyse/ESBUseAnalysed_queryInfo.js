//@ sourceURL= ESBUseAnalysed_queryInfo.js
//页面返回按钮
getCurrentPageObj().find("#GoBackESBAnalysedList").click(function(){
	closeCurrPageTab();
});
//加载页面表单数据
function initESBAnalyDetail(item,view){
	var currTab = getCurrentPageObj();
	initVlidate(getCurrentPageObj().find("#changeVlidate"));
	initVlidate(getCurrentPageObj().find("#affectVlidate"));
	for (var key in item) {
		currTab.find("#"+key).html(item[key]);
		currTab.find("input[name^='I."+key+"']").val(item[key]);
		//currTab.find("select[name^=I."+key+"]").val(item[key]);
		//currTab.find("textarea[name^=I."+key+"]").val(item[key]);
	}
	if(item.APP_TYPE=='02'){//变更类型
		currTab.find("#change_accept").show();
		currTab.find("#esbinfotable").find('tr:eq(8)').find('td:eq(0)').show();
		currTab.find("#esbinfotable").find('tr:eq(8)').find('td:eq(1)').show();
	}else{
		currTab.find("#addAffectAnalyse").hide();
		currTab.find("#change_info_tab").hide();
		currTab.find("#ContraInfoInput,#ContraInfoOutput").hide();
	}
	initESBUseAnalysedInfo(item["APP_ID"],item["INTER_ID"],item["INTER_VERSION"],item.APP_TYPE,view);
	if(item.APP_TYPE=='00'){
		getCurrentPageObj().find("#AffectAnalyseTable").bootstrapTable('hideColumn', 'DATA_ID');
	}
	autoInitRadio("dic_code=G_DIC_ACCEPT_CONCLUSION",getCurrentPageObj().find("#accept_result"),"I.ESB_ACCEPT_RESULT",{labClass:"labelRadio",type:"add",value:item.ESB_ACCEPT_RESULT});
	
	
	//信息导出
	currTab.find("[btn='message_export']").click(function(){
		if(item.APP_TYPE=="01"){
			param = "INTER_ID="+item["INTER_ID"];
			param += "&INTER_VERSION="+item["INTER_VERSION"];
		}else{
			param = "APP_ID="+ item["APP_ID"];
		}
		var url = 'messimport/exportPhaseFile.asp?&SID='+SID+'&'+param;
		//var url = 'IAnalyse/queryContentList.asp?call='+queryOutput_call+'&SID='+SID+'&'+param;
		
		window.location.href = url;
	});
	
	//添加影响分析应用
	currTab.find("#addAffectAnalyse").click(function(){
		openAffSystemPop("popAffect",{sysno:getCurrentPageObj().find("#system_id"),sysname:getCurrentPageObj().find("#system_name")});
	});
	
	currTab.find("#ContraInfoOutput").click(function(){
		
		gDataContraPop("popAffect",{app_id:item["APP_ID"],inter_id:item["INTER_ID"],way_type:"01"});
	});
	currTab.find("#ContraInfoInput").click(function(){
		
		gDataContraPop("popAffect",{app_id:item["APP_ID"],inter_id:item["INTER_ID"],way_type:"00"});
	});
	
	currTab.find("#submitAnalyse").click(function(){
		var param = getPageParam("I");
		if(param.APP_TYPE=='02'){ //变更类型的先验证是否同意
			if(param.ESB_ACCEPT_RESULT=="00"){//拒绝
				$('#analyseAll li:eq(0) a').tab('show');
			}else{//同意要验证
				$('#analyseAll li:eq(3) a').tab('show');
				if(!vlidate(getCurrentPageObj().find("#affectVlidate"))){
					alert("请填写相关必填项");
					hideVlidateTagContent();
					return ;
				}
				$('#analyseAll li:eq(1) a').tab('show');
				if(!vlidate(getCurrentPageObj().find("#changeVlidate"))){
					alert("请填写相关必填项");
					hideVlidateTagContent();
					return ;
				}
			}
		}else{
			$('#analyseAll li:eq(3) a').tab('show');
			if(!vlidate(getCurrentPageObj().find("#affectVlidate"))){
				alert("请填写相关必填项");
				hideVlidateTagContent();
				return ;
			}
			
		}
		
		var result = getAnlyData(param.APP_TYPE);//影响分析
		result.param["INTER_ID"] = item.INTER_ID;//补充接口id、version参数
		result.param["INTER_VERSION"] = item.INTER_VERSION;
		result.param["RECORD_APP_NUM"] = item.RECORD_APP_NUM;
		if(result.result == true){
			//提醒参数
			var remindParam={};
			remindParam["b_code"] = item.APP_INTER_NUM;
			remindParam["b_id"] = item.APP_ID;
			remindParam["user_id"] = item.APP_USER;
			var remindCall = getMillisecond()+'2';
			var call = getMillisecond();
			var url = dev_application+'IAnalyse/submitAnalyse.asp?call='+call+'&SID='+SID;
			baseAjax(url, result.param, function(data){
				if (data != undefined&&data!=null&&data.result=="true") {
					alert("保存成功！",function(){
						if(param.APP_TYPE=='00' || param.APP_TYPE=='01'){//接口使用申请
							remindParam["b_name"] = "您的接口（编号："+ remindParam["b_code"] +"）使用申请已归档";
							baseAjaxJsonp(dev_workbench+"Remind/remindAdd.asp?SID="+SID+"&call="+remindCall+"&remind_type=PUB2017158",
									remindParam, function(mes){
								//接口使用申请插入提醒成功
								}, remindCall);
						}else{//接口变更
							if(param.ESB_ACCEPT_RESULT=="00"){//拒绝(ESB方拒绝接口变更)
								remindParam["b_name"] = "您的接口（编号："+ remindParam["b_code"] +"）变更申请被ESB方打回";
								baseAjaxJsonp(dev_workbench+"Remind/remindAdd.asp?SID="+SID+"&call="+remindCall+"&remind_type=PUB2017158",
										remindParam, function(mes){
									//接口使用申请插入提醒成功
									}, remindCall);
							}else{//同意(ESB方同意接口变更)
								remindParam["b_name"] = "您的接口（编号："+ remindParam["b_code"] +"）变更申请已归档";
								baseAjaxJsonp(dev_workbench+"Remind/remindAdd.asp?SID="+SID+"&call="+remindCall+"&remind_type=PUB2017158",
										remindParam, function(mes){
									//接口使用申请插入提醒成功
									}, remindCall);
							}
						}
						closeCurrPageTab();
					});
				} else {
					alert("保存失败！");
				}
			});
		}
	});
	
	//接口设计上传文件
	var tablefile = currTab.find("#filetable");
	var addfile = currTab.find("#add_file");
	var delete_file = currTab.find("#delete_file");
	if(item.APP_TYPE!='01'){
		//点击打开模态框
		addfile.click(function(){
			var paramObj = new Object();
			paramObj["SYSTEM_NAME"] = item.SER_SYSTEM_NAME;
			paramObj["INTER_CODE"] = currTab.find("#inter_code").html();
			openFileFtpUpload(currTab.find("#add_modalfile"), tablefile, 'GZ1070',item.FILE_ID, '00', 'S_DIC_INTER_DESIGN_FILE', false,false, paramObj);
		});
		//附件删除
		delete_file.click(function(){
			delFtpFile(tablefile, item.FILE_ID, "00");
		});
		getFtpFileList(tablefile, currTab.find("#add_fileview_modal"), item.FILE_ID, "00");
	} else {
		getFtpFileList(tablefile, currTab.find("#add_fileview_modal"), item.FILE_ID, "00");
		addfile.hide();
		delete_file.hide();
	}
}

function getAnlyData(app_type){
	var result = new Object();
	var currTab = getCurrentPageObj();
	var param = {};
	param = getPageParam("I");
	//接口分析
	var sendData = currTab.find("#AffectAnalyseTable").bootstrapTable('getData');
	//接口分析文档
	var filesDiv = currTab.find("#AffectAnalyseTable").find("div[name=file_info_div]"); 
	
	var isComplete = true;
	var sendList = new Array();
	$.each(sendData, function(i) {
		var is_effect = currTab.find("#is_effect"+i).val();
		if(is_effect == ' ' || is_effect == '') {//为空
			isComplete = false;
			return false;//终止整个循环
		}
		var obj = new Object();
//		sendData[i].EFFECT_ANALYSE = currTab.find("#effect_analyse"+i).val();
//		sendData[i].IS_EFFECT = is_effect;
		obj.EFFECT_ANALYSE = currTab.find("#effect_analyse"+i).val();
		obj.IS_EFFECT = is_effect;
		obj.SYSTEM_ID = sendData[i].RELE_SYSTEM_ID;
		obj.ANALYSE_ID = sendData[i].ANALYSE_ID;
		obj.RELE_TYPE = sendData[i].RELE_TYPE;
		
		//处理关联的文件信息
		var $fileDiv = $(filesDiv[i]);
		var file_id = $fileDiv.attr("file_id");
		if(typeof(file_id)!="undefined"){
			obj.FILE_ID = $fileDiv.attr("bid");
		}
		if(typeof(file_id)=="undefined"){
			obj.FILE_ID ="";
		}
		
		sendList.push(obj);
	});
	
	if(!isComplete) {
		alert("请选择是否影响分析！");
		return result;
	}
	
	//任务拆分
	var sendTaskData = currTab.find("#queryTaskSplitTable").bootstrapTable('getData');
	var sendTaskList = new Array();
	$.each(sendTaskData, function(i) {
		var obj = new Object();
		var task_name = currTab.find("#task_name"+i).val();
		obj.TASK_REMARK = currTab.find("#task_remark"+i).text();
		obj.TASK_NAME = task_name;
		obj.SPLIT_ID = sendTaskData[i].SPLIT_ID;
		obj.SYSTEM_ID = sendTaskData[i].SYSTEM_ID;
		obj.TASK_TYPE = sendTaskData[i].TASK_TYPE;
		sendTaskList.push(obj);
//		sendTaskData[i].TASK_REMARK = currTab.find("#task_remark"+i).val();
//		sendTaskData[i].TASK_NAME = task_name;
	});
	
	//接口变更
	var changeAttrData = currTab.find("#changeAttrTable").bootstrapTable('getData');
	var changeAttrList = new Array();
	if(app_type=='02'){//如变更类型
		$.each(changeAttrData, function(i) {
			var obj = new Object();
			var ATTR_VALUE = currTab.find("#chang_value"+i).val();
			var all = "";
			if(changeAttrData[i].ATTR_TYPE=='02'){
				getCurrentPageObj().find("#chang_value"+i+" option:selected").each(function() {
		        	var text= $(this).attr("value");
		        	text = text.replace(/(^\s*)|(\s*$)/g, "");
		        	if(text !== '' && typeof(text) !== undefined && text !== null){
		        		if(all == ""){
		        			all = text;
		        		}else{
		        			all += ","+text;
		        		}
		        	}
		        });
				ATTR_VALUE = all;
			}
			obj.ATTR_VALUE = ATTR_VALUE;
			obj.ATTR_ID = changeAttrData[i].ATTR_ID;
			changeAttrList.push(obj);
			//changeAttrData[i].ATTR_VALUE = ATTR_VALUE;
		});
	}
	
	param["changeAttrData"] = JSON.stringify(changeAttrList);
	param["sendTaskData"] = JSON.stringify(sendTaskList);
	param["sendData"] = JSON.stringify(sendList);
	result.result = true;
	result.param = param;
	return result;
}



//初始化页面table  
function initESBUseAnalysedInfo(APP_ID,INTER_ID,INTER_VERSION,type,view) {	
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
	var param = "";
	if(type=="01"){
		param = "INTER_ID="+INTER_ID;
		param += "&INTER_VERSION="+INTER_VERSION;
	}else{
		param = "APP_ID="+ APP_ID;
	}
	getCurrentPageObj().find("#InputContentTable").bootstrapTable({
		//请求后台的URL（*）
		url :dev_application+'IAnalyse/queryContentList.asp?call='+queryInput_call+'&SID='+SID+'&'+param,
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
			width : "11%"
		}, {
			field : "DATA_ENGNAME",
			title : "1级字段名(英文)",
			align : "center",
			width : "11%"
		}, {
			field : "DATA_ENGNAMEA",
			title : "2级字段名(英文)",
			align : "center",
			width : "11%"
		}, {
			field : "DATA_ENGNAMEB",
			title : "3级字段名(英文)",
			align : "center",
			width : "11%"
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
			width : "8%"
		},{
			field : "INFO_REMARK",
			title : "备注",
			align : "center",
			width : "8%"
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
		url :dev_application+'IAnalyse/queryContentList.asp?call='+queryOutput_call+'&SID='+SID+'&'+param,
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
			width : "11%"
		}, {
			field : "DATA_ENGNAME",
			title : "1级字段名(英文)",
			align : "center",
			width : "11%"
		}, {
			field : "DATA_ENGNAMEA",
			title : "2级字段名(英文)",
			align : "center",
			width : "11%"
		}, {
			field : "DATA_ENGNAMEB",
			title : "3级字段名(英文)",
			align : "center",
			width : "11%"
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
			width : "8%"
		},{
			field : "INFO_REMARK",
			title : "备注",
			align : "center",
			width : "8%"
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
		url :dev_application+'IAnalyse/queryInterChageInfo.asp?call='+queryChange_call+'&SID='+SID+'&APP_ID='+APP_ID+"&INTER_ID="+INTER_ID+'&INTER_VERSION='+INTER_VERSION,
		method : 'get', //请求方式（*）   
		striped : true, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryAttrParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [100,200],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 100,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "apply_id", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		clickToSelect : false, //是否启用点击选中行
		jsonpCallback:queryChange_call,
		detailView : false, //是否显示父子表
		singleSelect: true,
		onLoadSuccess:function(data){
			gaveInfo();	
			//初始化字典项
			if(data.rows) {
				for(var i=0; i<data.rows.length; i++) {
					if(data.rows[i].ATTR_TYPE=='01'){
						initSelect(getCurrentPageObj().find("#chang_value"+i),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:data.rows[i].DIC_INFO},data.rows[i].CHANG_VALUE);
					}else if(data.rows[i].ATTR_TYPE=='02'){
						initMoreSelect(getCurrentPageObj().find("#chang_value"+i),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:data.rows[i].DIC_INFO},data.rows[i].CHANG_VALUE);
					}else if(data.rows[i].ATTR_TYPE=="03"){
						autoInitRadio({dic_code:data.rows[i].DIC_INFO},getCurrentPageObj().find("#chang_value"+i),"chang_value"+i,{labClass:"ecitic-radio-inline",value:data.rows[i].CHANG_VALUE,disabled:"true"});
					}
				}						
			}
			//变更后属性设为只读
			getCurrentPageObj().find("#changeAttrTable").find("input,select").attr("disabled","disabled");
			initVlidate(getCurrentPageObj().find("#changeVlidate"));
		},
		columns : [{
			field : "ATTR_NAME",
			title : "属性名",
			align : "center"
		}, {
			field : "OLD_ATTR_VALUE_NAME",
			title : "变更前",
			align : "center"
		}, {
			field : 'CHANG_VALUE',
			title : '变更后',
			align : "center",
			formatter:function(value, row, index) {
				var str = "";
				var is_necessary = "";
				if(row.IS_NECESSARY == "00"){//00表示必填
					is_necessary = 'validate=\"v.required\"';
				}
				var text = row.CHANG_VALUE;
				if(text==undefined || text=="undefined") 
					text="";
				
				//str += "<td  class='table-text' width='20%' >" + row.ATTR_NAME + ":</td>";
				if(row.ATTR_TYPE=="00"){//00表示文本框
					str += "<input id='chang_value"+index+"' attr_type='input' "+is_necessary+" type='text' maxlength='"+row.MAX_LONG+"' attr_id='" + row.ATTR_ID + "' value='"+text+"' />";
				} else if(row.ATTR_TYPE=="01"){//01表示下拉单选
					str += "<select id='chang_value"+index+"' style='width:100%' attr_type='select' "+is_necessary+" attr_id='" + row.ATTR_ID + "' diccode='"+row.DIC_INFO+"' value='"+text+"'></select>";
				} else if(row.ATTR_TYPE=="02"){//02表示下拉多选
					str += "<select id='chang_value"+index+"' style='width:100%' attr_type='mul_select' "+is_necessary+" attr_id='" + row.ATTR_ID + "' diccode='"+row.DIC_INFO+"' multiple='multiple' value='"+text+"'></select>";
				} else if(row.ATTR_TYPE=="03"){//二选一
					str += "<span id='chang_value"+index+"' attr_type='radio' attr_id='" + row.ATTR_ID + "' radiocode='"+row.DIC_INFO+" 'value='"+text+"' class='citic-sele-ast'></span>";
				}
				return str;
				
				/*var str = "";
				if(row.ATTR_TYPE=='01')
					str = '<select style="width:100%" id="chang_value'+index+'" validate="v.required" valititle="该项为必填项"></select>';
				else
					str = '<input type="text" id="chang_value'+index+'" value="'+value+'" validate="v.required" valititle="该项为必填项" >';
				return str;*/
			}
		}]
	});
	
	//生成动态类型表格HTML代码
	function getRowLine(item){
		var str = "";
		var is_necessary = "";
		if(item.IS_NECESSARY == "00"){//00表示必填
			is_necessary = 'validate=\"v.required\"';
		}
		str += "<td  class='table-text' width='20%' >" + item.ATTR_NAME + ":</td>";
		if(item.ATTR_TYPE=="00"){//00表示文本框
			str += "<td name='attrInfoList'><input attr_type='input' "+is_necessary+" type='text' maxlength='"+item.MAX_LONG+"' attr_id='" + item.ATTR_ID + "' value='"+item.DEFAULT_VALUE+"' /></td>";
		} else if(item.ATTR_TYPE=="01"){//01表示下拉单选
			str += "<td name='attrInfoList'><select attr_type='select' "+is_necessary+" attr_id='" + item.ATTR_ID + "' diccode='"+item.DIC_INFO+"' value='"+item.DEFAULT_VALUE+"'></select></td>";
		} else if(item.ATTR_TYPE=="02"){//02表示下拉多选
			str += "<td name='attrInfoList'><select style='width:100%' attr_type='mul_select' "+is_necessary+" attr_id='" + item.ATTR_ID + "' diccode='"+item.DIC_INFO+"' multiple='multiple' value='"+item.DEFAULT_VALUE+"'></select></td>";
		} else if(item.ATTR_TYPE=="03"){//二选一
			str += "<td name='attrInfoList'><span attr_type='radio' attr_id='" + item.ATTR_ID + "' radiocode='"+item.DIC_INFO+" 'value='"+item.DEFAULT_VALUE+"' class='citic-sele-ast'></span></td>";
		}
		return str;
	}
	

	var queryEffectParams=function(params){
		var temp={
			limit: params.limit, //页面大小
			offset: params.offset//页码
		};
		return temp;
	};
	var queryEffect_call = getMillisecond()+'effect';
	getCurrentPageObj().find("#AffectAnalyseTable").bootstrapTable({
		//请求后台的URL（*）
		url :dev_application+'IAnalyse/queryInterEffectInfo.asp?call='+queryEffect_call+'&SID='+SID+'&APP_ID='+APP_ID,
		method : 'get', //请求方式（*）   
		striped : true, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryEffectParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [100,200],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 100,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "RELE_SYSTEM_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		jsonpCallback:queryEffect_call,
		detailView : false, //是否显示父子表
		singleSelect: true,
		onLoadSuccess:function(data){
			//初始化字典项
			if(data.rows) {
				for(var i=0; i<data.rows.length; i++) {
					initSelect(currTab.find("#is_effect"+i),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_YN"},'00');
				}						
			}
			initVlidate(getCurrentPageObj().find("#affectVlidate"));
			if(view=="view")
			getCurrentPageObj().find("input,select,textarea").not("[name='closePageTabConfirm']").attr("disabled","disabled");
		},
		columns : [ {
			field : 'Number',
			title : '序号',
			align : "center",
			width : "60",
			sortable: true,
			formatter: function (value, row, index) {
				return index+1;
			}
		},{
			field : "SYSTEM_NAME",
			title : "关联应用",
			align : "center",
			width : "100"
		},{
			field : "RELE_TYPE_NAME",
			title : "类型",
			align : "center",
			width : "80"
		}, {
			field : "IS_EFFECT",
			title : "是否影响",
			align : "center",
			width : "80",
			formatter:function(value, row, index) {
				var disabled="";
				if(row.RELE_TYPE=='00'||row.RELE_TYPE=='01'||type!='02'){
					disabled = "disabled";
				}
				var str = '<select id="is_effect'+index+
						  '" diccode="S_DIC_YN" '+disabled+" onchange='toDelAnalyseTask("+index+','+row.RELE_SYSTEM_ID+",\""+row.SYSTEM_NAME+"\");'" +
						  		" validate='v.required' valititle='该项为必填项'></select>";
				return str;
			}
		}, {
			field : "EFFECT_ANALYSE",
			title : "关联性影响分析",
			align : "center",
			width : "200",
			formatter:function(value, row, index) {
				var str = '<input type="text" id="effect_analyse'+index+'" val="'+value+'">';
				return str;
			}
		}, {
			field : "explain",
			title : "接口调用说明",
			align : "center",
			width : "200",
			formatter:function(value, row, index){
				var str = "<div name='file_info_div' style='margin: 0 auto 10px 0' bid='"+row.FILE_ID+"' index='"+index+"'>";
				if(row["RELE_TYPE"]=="02"){
					str += "<a name='inter_use_file_upload'>上传</a>" + 
						"<a name='inter_use_file_detail' style='margin-left:10px;display:none;'>查看</a>" +
						"<a name='inter_use_file_download' style='margin-left:10px;display:none;'>下载</a>";
				}
				str +="<div/>";
				return str;
			}
		},{
			field : "DATA_ID",
			title : "操作",
			align : "center",
			width : "60",
			formatter:function(value, row, index) {
				/*if(row.RELE_TYPE=='00'||row.RELE_TYPE=='01'){
					return "--";
				}*/
				if(row.ANALYSE_ID==undefined||row.ANALYSE_ID=="undefined"||row.ANALYSE_ID==""){
					var edit="<span class='hover-view'"+
					"onclick='delAnalyseTask(\""+row.RELE_SYSTEM_ID+"\");'>删除</span>";
					return edit; 
				}else{
					return "--";
				}
			}
		}],
		onPostBody:function(){
			initFileUploadAction();
		    getInterFileList();
		}
	});
	
	
	var upload_div = currTab.find("#add_modalfile");
	var file_view_div = currTab.find("#add_fileview_modal");
	var system_name = currTab.find("#SER_SYSTEM_NAME").text();
	function initFileUploadAction(){
		var $details = getCurrentPageObj().find("#AffectAnalyseTable").find("a[name=inter_use_file_detail]");
		var $uploads = getCurrentPageObj().find("#AffectAnalyseTable").find("a[name=inter_use_file_upload]");
		var $downloads = getCurrentPageObj().find("#AffectAnalyseTable").find("a[name=inter_use_file_download]");
		var fileData = null;
		for(var i=0; i<$details.length; i++){
			var $detail =  $($details[i]);
			var $div = $($detail.parent());
			if($div.attr("bid")!="undefined"){
			var businessCode= new Array();
			businessCode[0]=$div.attr("bid");
			var fileDa = getFtpFileListByBc(businessCode, "00");
			if(fileDa.length>0){
				$detail.show();
			$($downloads[i]).show();}
			}
		}
		
		//初始化上传按钮
		$uploads.unbind('click').click(function(){
			var $div = $(this).parent();
			var business_code = $div.attr("bid");
			if(business_code=="undefined"){
				business_code = Math.uuid();
				var index = $div.attr("index");
				var row  = currTab.find("#AffectAnalyseTable").bootstrapTable("getData")[index];
				row.FILE_ID = business_code;
				$div.attr("bid", business_code);
			}
			var paramObj = new Object();
			paramObj["SYSTEM_NAME"] = system_name;
			
			paramObj["afterUpload"] = function(){
				//删除原有文件
				var old_file = $div.attr("file_id");
				if(typeof(old_file)!="undefined"){
					deleteFTPFileById(old_file);
				}
				$div.find("a[name=inter_use_file_detail]").show();
				$div.find("a[name=inter_use_file_download]").show();
				//重新绑定文件id到相应的
				fileData = getInterFileList();
			};
			openFileFtpUpload(upload_div, null, "GZ1071", business_code, '00', 'S_DIC_INTER_SER_DESIGN_FILE', false, false, paramObj);
		});
		
		//初始化查看按钮
		$details.unbind('click').click(function(){
			var $div = $(this).parent();
			var file_id = $div.attr("file_id");
			fileData = getInterFileList();
			if(fileData!==null){
				for(var k in fileData){
					var file = fileData[k];
					if(file_id==file.ID){
						ftpFileInfoDetailModel(file_view_div, file);
					}
				}
			} else {
				alert("文件不存在！");
			}
		});
		//初始化下载按钮
		$downloads.unbind('click').click(function(){
			var $div = $(this).parent();
			var file_id = $div.attr("file_id");
			verifyFileExit(file_id);
		});
	}
	
	//获取文件列表并绑定文件id到相应的按钮上
	function getInterFileList(){
		var affectTableData = getCurrentPageObj().find("#AffectAnalyseTable").bootstrapTable('getData');
		var businessArr = $.map(affectTableData, function(row) {
			return row.FILE_ID;
		});
		if(businessArr.length>0){
			var fileData = getFtpFileListByBc(businessArr, "00");
			if(fileData.length>0){
				for(var k in fileData){
					var file = fileData[k];
					var $div = getCurrentPageObj().find("#AffectAnalyseTable").find("div[bid="+file.BUSINESS_CODE+"]");
					$div.attr("file_id", file.ID);
				}
			}
			return fileData;
		}
		return null;
	}
	
	var querySplitParams=function(params){
		var temp={
			limit: params.limit, //页面大小
			offset: params.offset//页码
		};
		return temp;
	};
	var querySplit_call = getMillisecond()+'split';
	getCurrentPageObj().find("#queryTaskSplitTable").bootstrapTable(
			{
				//请求后台的URL（*）
				url :dev_application+'IAnalyse/queryTaskSplitTable.asp?call='+querySplit_call+'&SID='+SID+'&APP_ID='+APP_ID,
				method : 'get', //请求方式（*）   
				striped : true, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : querySplitParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				pagination : true, //是否显示分页（*）
				pageList : [100,200],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 100,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "SYSTEM_ID", //每一行的唯一标识，一般为主键列
				jsonpCallback:querySplit_call,
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: true,
				onLoadSuccess:function(data){
					initVlidate(getCurrentPageObj().find("#affectVlidate"));
					if(view=="view")
					getCurrentPageObj().find("input,select,textarea").not("[name='closePageTabConfirm']").attr("disabled","disabled");
				},
				columns : [{
					field : 'Number',
					title : '序号',
					align : "center",
					width : "70px",
					sortable: true,
					formatter: function (value, row, index) {
						return index+1;
					}
				},{
					field : "TASK_TYPE_NAME",
					title : "任务大类",
					align : "center"
				}, {
					field : "SYSTEM_NAME",
					title : "应用名称",
					align : "center"
				}, {
					field : 'TASK_NAME',
					title : '任务名称',
					align : "center",
					formatter:function(value, row, index) {
						var str = '<input type="text" id="task_name'+index+'" val="'+value+'" validate="v.required" valititle="该项为必填项">';
						return str;
					},
					visible:false,
				}, {
					field : "TASK_REMARK",
					title : "任务说明",
					align : "center",
					formatter:function(value, row, index) {
						
						return "<span id=task_remark"+index+">"+$('#INTER_NAME').text()+""+"接口开发任务-【"+""+row.SYSTEM_NAME+"】</span>";
					},
					
				}, {
					field : "DATA_ID",
					title : "操作",
					align : "center",
					width : "60px",
					formatter:function(value, row, index) {
						var edit="<span class='hover-view'"+
						//'onclick="delSendProTask('+row.DATA_ID+','');">删除</span>';
						//"onclick='delSendProTask(\""+row.DATA_ID+"\",\""+row.id+"\");'>删除</span>";
						"onclick='delAnalyseTask(\""+row.SYSTEM_ID+"\");'>删除</span>";
						 return edit; 
					},
					visible:false,
				}]
		});
	var queryOptParams=function(params){
		var temp={
			limit: params.limit, //页面大小
			offset: params.offset//页码
		};
		return temp;
	};
	var queryOpt_call = getMillisecond()+'opt';
	getCurrentPageObj().find("#OptHistoryTable").bootstrapTable({
		//请求后台的URL（*）
		url :dev_application+'IAnalyse/queryOptHistoryTable.asp?call='+queryOpt_call+'&SID='+SID+'&APP_ID='+APP_ID,
		method : 'get', //请求方式（*）   
		striped : true, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryOptParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [5,10],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "apply_id", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		jsonpCallback:queryOpt_call,
		detailView : false, //是否显示父子表
		singleSelect: true,
		onLoadSuccess : function(data){
			gaveInfo();
		},
		columns : [ {
			field: 'OPT_USER',
			title : '操作人',
			align: 'center'
		},{
			field : "OPT_ACTION",
			title : "操作",
			align : "center"
		}, {
			field : "OPT_RESULT_NAME",
			title : "结论",
			align : "center"
		}, {
			field : 'OPT_REMARK',
			title : '相关说明',
			align : "center"
		}, {
			field : "OPT_TIME",
			title : "操作时间",
			align : "center"
		}]
	});
};


//添加报文信息
function addAffectSystem(row){
	//添加报文输出信息
	var currTab = getCurrentPageObj();
		var sendData = currTab.find("#AffectAnalyseTable").bootstrapTable('getData');
		var item = {};
		item['ANALYSE_ID'] = "";//getMillisecond();
		item['RELE_SYSTEM_ID'] = row.SYSTEM_ID;
		item['RELE_TYPE'] = "02";//消费方类型
		item['RELE_TYPE_NAME'] = "消费方";
		item['SYSTEM_NAME'] = row.SYSTEM_NAME;
		//console.log(row);
		var i = sendData.length;
		var flag=true;
		$.each(sendData, function(j) {
			if(item.RELE_SYSTEM_ID==sendData[j].RELE_SYSTEM_ID){
				flag=false;
				return;
			}
			sendData[j].IS_EFFECT = currTab.find("#is_effect"+j).val();
			sendData[j].EFFECT_ANALYSE = currTab.find("#effect_analyse"+j).val();
		});
		if(!flag){
			alert("不能添加重复的应用");
			return;
		}
		currTab.find("#AffectAnalyseTable").bootstrapTable("append",item);
		initSelect(currTab.find("#is_effect"+i),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_YN"},'00');
		
		//旧的行，把原来的放进去
		for(var k=0; k<sendData.length; k++) {
			initSelect(currTab.find("#is_effect"+k),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_YN"},sendData[k].IS_EFFECT);
			currTab.find("#effect_analyse"+k).val(sendData[k].EFFECT_ANALYSE);
		}
		var taskItem = {}
		taskItem['TASK_TYPE']="00";//消费方任务
		taskItem['SYSTEM_ID']=row.SYSTEM_ID;
		taskItem['SYSTEM_NAME']=row.SYSTEM_NAME;
		taskItem['SPLIT_ID']=row.SPLIT_ID;
		taskItem['TASK_TYPE_NAME']="消费方接口任务";
		currTab.find("#queryTaskSplitTable").bootstrapTable("append",taskItem);
		initVlidate($("#affectVlidate"));
}

function toDelAnalyseTask(i,system_id,system_name){
	var sendTaskData = getCurrentPageObj().find("#queryTaskSplitTable").bootstrapTable('getData');
	var eff  = getCurrentPageObj().find("#is_effect"+i).val();
	/*	var param = {};
	param["SYSTEM_ID"] = data_id;
	param["index"] = i;*/
	if(eff == '01'){
		getCurrentPageObj().find("#queryTaskSplitTable").bootstrapTable("removeByUniqueId", system_id);	
		$.each(sendTaskData, function(j) {
			sendTaskData[j].TASK_REMARK = getCurrentPageObj().find("#task_remark"+j).val();
		});
	}else if(eff == '00'){
		var taskItem = {};
		taskItem['TASK_TYPE']="00";//消费方任务
		taskItem['SYSTEM_ID']=system_id;
		taskItem['SYSTEM_NAME']=system_name;
		taskItem['TASK_TYPE_NAME']="消费方接口任务";
		getCurrentPageObj().find("#queryTaskSplitTable").bootstrapTable("append",taskItem);
		initVlidate($("#affectVlidate"));
	}	
}

function delAnalyseTask(data_id){
	
	//添加报文输出信息
	var currTab = getCurrentPageObj();
	var sendData = currTab.find("#AffectAnalyseTable").bootstrapTable('getData');
	var i = sendData.length;
	$.each(sendData, function(j) {
		sendData[j].IS_EFFECT = currTab.find("#is_effect"+j).val();
		sendData[j].EFFECT_ANALYSE = currTab.find("#effect_analyse"+j).val();
	});
	var sendTaskData = currTab.find("#queryTaskSplitTable").bootstrapTable('getData');
	
	$.each(sendTaskData, function(j) {
		sendTaskData[j].TASK_REMARK = currTab.find("#task_remark"+j).val();
	});
	getCurrentPageObj().find("#AffectAnalyseTable").bootstrapTable("removeByUniqueId", data_id);	
	
	//旧的行，把原来的放进去
	for(var k=0; k<sendData.length; k++) {
		initSelect(currTab.find("#is_effect"+k),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_YN"},sendData[k].IS_EFFECT);
		//currTab.find("#is_effect"+k).val(sendData[k].DATA_TYPE);
		currTab.find("#effect_analyse"+k).val(sendData[k].IS_NECESSARY);
	}
	
	
	getCurrentPageObj().find("#queryTaskSplitTable").bootstrapTable("removeByUniqueId", data_id);	
	$.each(sendTaskData, function(j) {
		sendTaskData[j].TASK_REMARK = currTab.find("#task_remark"+j).val();
	});
	initVlidate($("#affectVlidate"));
}


/**
 *点击 验证提示 自动删除提示，并设置光标 
 **/
function hideVlidateTagContent(){
	$(".tag-content").on("click",function(){
		$(this).siblings("input:visible").click();
		$(this).siblings("input:visible").focus();
		/*$(this).siblings("select:visible").select2("open"); */
		$(this).remove();
	});
}