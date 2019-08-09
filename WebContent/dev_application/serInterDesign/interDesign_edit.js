//页面返回按钮
getCurrentPageObj().find("#GoBackESBAnalysedList").click(function(){
	closeCurrPageTab();
});

var dic_data_I_DIC_INTER_DATA_TYPE;
var dic_data_S_DIC_YN;

//加载页面表单数据
function initDesignDetail(item){
	initVlidate(getCurrentPageObj().find("#interBasicInfo"));
	var currTab = getCurrentPageObj();
	for (var key in item) {
		currTab.find("#"+key).html(item[key]);
		currTab.find("input[name='I."+key+"']").val(item[key]);
		currTab.find("select[name^='I."+key+"']").val(item[key]);
		currTab.find("textarea[name^='I."+key+"']").val(item[key]);
	}
	initSelect(currTab.find("#inter_office_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"I_DIC_INTER_OFFICE_TYPE"},item.INTER_OFFICE_TYPE);
	//初始化报文信息
	initDesignInfo(item["APP_ID"]);
	
	currTab.find("#next_step").click(function(){
		//$('#InterDesign li:eq(0) a').tab('show');
		if(!vlidate(getCurrentPageObj().find("#design_anal_tab"))){
			alert("请填写相关必填项");
			return ;
		}
		$('#InterDesign li:eq(2) a').tab('show');
		//$("#InterDesign > ul").tabs({fx:{opacity:"toggle",height:"toggle"}, selected:1}); 
	});
	
	//输入内容选择新增按钮
	currTab.find("#input_selectData").click(function(){
		var $tab1_input = getCurrentPageObj().find("#InputContentTable");
		var inforMaintence_pop = getCurrentPageObj().find("[mod='seleInterPop']");
		changeInforMaintenace_seleDataPop(inforMaintence_pop,"InputContentTable","00","inputData_from");
	});
	//输入内容选择新增按钮
	currTab.find("#out_selectData").click(function(){
		var $tab2_input = getCurrentPageObj().find("#OutputContentTable");
		var inforMaintence_pop = getCurrentPageObj().find("[mod='seleInterPop']");
		changeInforMaintenace_seleDataPop(inforMaintence_pop,"OutputContentTable","01","outputData_from");
	});
	//保存
	currTab.find("#save_data").click(function(){
		var scall = getMillisecond();
		var url = dev_application+'IDesign/submitContent.asp?call='+scall+'&SID='+SID+'&save=save';
		saveAndSubmit(url,scall);
	});
	//保存&&提交
	currTab.find("#submit_data").click(function(){
		var sscall = getMillisecond();
		var url = dev_application+'IDesign/submitContent.asp?call='+sscall+'&SID='+SID+'&save=submit';
		saveAndSubmit(url,sscall);
	});

	
	//报文内容导入
	currTab.find("[btn='message_into']").click(function(){
		currTab.find("#input_import").modal("show");
	});
	
	//报文内容清空
	currTab.find("[btn='message_clear']").click(function(){
		nconfirm('确定清空现有报文输入及输出内容?',function(){
			currTab.find("#InputContentTable").bootstrapTable('removeAll');
			currTab.find("#OutputContentTable").bootstrapTable('removeAll');
			
		});
		
	});
	
	
	//点击打开模态框
	var tablefile = currTab.find("#filetable");
	var addfile = currTab.find("#add_file");
	addfile.click(function(){
		var paramObj = new Object();
		paramObj["SYSTEM_NAME"] = item.SER_SYSTEM_NAME;
		paramObj["INTER_CODE"] = currTab.find("#INTER_CODE").html();
		openFileFtpUpload(currTab.find("#add_modalfile"), tablefile, 'GZ1070',item.FILE_ID, '00', 'S_DIC_INTER_DESIGN_FILE', false,false, paramObj);
	});
	//附件删除
	var delete_file = currTab.find("#delete_file");
	delete_file.click(function(){
		delFtpFile(tablefile, item.FILE_ID, "00");
	});
	getFtpFileList(tablefile, currTab.find("#add_fileview_modal"), item.FILE_ID, "00");
	
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
		url :dev_application+'IAnalyse/queryOptHistoryTable.asp?call='+queryOpt_call+'&SID='+SID+'&APP_ID='+item["APP_ID"],
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
}

//保存&&提交
function saveAndSubmit(url,call){
	
	var aaa=getCurrentPageObj().find("[name='I.INTER_DESCR']").val();
    if(aaa.length>150){
    	alert("接口描述至多可输入150汉字！");
    	return;
    }

	var input_formRow = getCurrentPageObj().find("#InputContentTable").bootstrapTable("getData").length;
	if(input_formRow == 0){
		alert("请填写输入内容");
		return ;
	}
//	var output_formRow = getCurrentPageObj().find("#OutputContentTable").bootstrapTable("getData").length;
//	if(output_formRow == 0){
//		alert("请填写输出内容");
//		return ;
//	}
	if(!vlidate(getCurrentPageObj().find("#inputData_from"))||!vlidate(getCurrentPageObj().find("#outputData_from"))){
		alert("请填写相关必填项");
		hideVlidateTag();
		return ;
	}
	$('#InterDesign li:eq(1) a').tab('show');
	if(!vlidate(getCurrentPageObj().find("#interBasicInfo"))||!vlidate(getCurrentPageObj().find("#designAttr").find("table[tb=attrTable] tbody"))){
		alert("请填写相关必填项");
		return ;
	}
	

	//alert('成功');

	var result = getData();//影响分析
		baseAjax(url, result.param, function(data){
		if (data != undefined&&data!=null&&data.result=="true") {
			alert("保存成功！",function(){
				closeCurrPageTab();
			});
		} else {
			alert("保存失败！");
		}
	});	
};
function hideVlidateTag(){
	$(".tag-content").on("click",function(){
		$(this).siblings("input:visible").click();
		$(this).siblings("input:visible").focus();
		/*$(this).siblings("select:visible").select2("open"); */
		$(this).remove();
	});
}





function getData(){
	var result = new Object();
	var currTab = getCurrentPageObj();
	var param = {};
	param = getPageParam("I");
	//输入
	var sendTaskData = currTab.find("#InputContentTable").bootstrapTable('getData');
	var inputData_from = currTab.find("#inputData_from");
	$.each(sendTaskData, function(j) {
		sendTaskData[j].DATA_TYPE = currTab.find("#data_type"+j).val();
		sendTaskData[j].IS_NECESSARY = currTab.find("#is_necessary"+j).val();
		sendTaskData[j].DATA_CHNNAME = currTab.find("#data_chnname"+j).val();
		sendTaskData[j].DATA_ENGNAME = currTab.find("#data_engname"+j).val();
		sendTaskData[j].DATA_ENGNAMEA = inputData_from.find("#data_engnamea"+j).val()== undefined?"":inputData_from.find("#data_engnamea"+j).val();
		sendTaskData[j].DATA_ENGNAMEB = inputData_from.find("#data_engnameb"+j).val()== undefined?"":inputData_from.find("#data_engnameb"+j).val();
		sendTaskData[j].MSG_LENGTH = currTab.find("#msg_length"+j).val();
		sendTaskData[j].STANDARD_CODE = inputData_from.find("#standard_code"+j).val()== undefined?"":inputData_from.find("#standard_code"+j).val();
		sendTaskData[j].DATA_INSTRUCTION = inputData_from.find("#data_instruction"+j).val()== undefined?"":inputData_from.find("#data_instruction"+j).val();
		sendTaskData[j].INFO_REMARK = inputData_from.find("#info_remark"+j).val()== undefined?"":inputData_from.find("#info_remark"+j).val();
	});
	param["InputContentData"] = JSON.stringify(sendTaskData);
	
	//输出
	var sendOutputData = currTab.find("#OutputContentTable").bootstrapTable('getData');
	if(sendOutputData.length>0){
		var outputData_from = currTab.find("#outputData_from");
		$.each(sendOutputData, function(j) {
			sendOutputData[j].DATA_TYPE = currTab.find("#data_type_"+j).val();
			sendOutputData[j].IS_NECESSARY = currTab.find("#is_necessary_"+j).val();
			sendOutputData[j].DATA_CHNNAME = currTab.find("#data_chnname_"+j).val();
			sendOutputData[j].DATA_ENGNAME = currTab.find("#data_engname_"+j).val();
			sendOutputData[j].DATA_ENGNAMEA = outputData_from.find("#data_engnamea_"+j).val()== undefined?"":outputData_from.find("#data_engnamea_"+j).val();
			sendOutputData[j].DATA_ENGNAMEB = outputData_from.find("#data_engnameb_"+j).val()== undefined?"":outputData_from.find("#data_engnameb_"+j).val();
			sendOutputData[j].MSG_LENGTH = currTab.find("#msg_length_"+j).val();
			sendOutputData[j].STANDARD_CODE = outputData_from.find("#standard_code_"+j).val()== undefined?"":outputData_from.find("#standard_code_"+j).val();
			sendOutputData[j].DATA_INSTRUCTION = outputData_from.find("#data_instruction_"+j).val()== undefined?"":outputData_from.find("#data_instruction_"+j).val();
			sendOutputData[j].INFO_REMARK = outputData_from.find("#info_remark_"+j).val()== undefined?"":outputData_from.find("#info_remark_"+j).val();
		});
		param["OutputContentData"] = JSON.stringify(sendOutputData);
	}
	var modObj = getCurrentPageObj().find("#designAttr");
	var $attrTable = modObj.find("table[tb=attrTable] tbody");
	var attrInfoArr = new Array();
	$attrTable.find("[name='attrInfoList']").each(//获取属性值
			function() {
				var $obj = $(this).find("[attr_type]");
				var attr_type = $obj.attr("attr_type");
				var attr_id = $obj.attr("attr_id");
				var default_value = "||";
				if(attr_type == "input" || attr_type == "select"){
					default_value = $obj.val()||"||";
				}else if(attr_type == "mul_select"){
					if($obj.val()){
						default_value = $obj.val().join(",");
					}
				}else if(attr_type == "radio"){
					var rvalue = $obj.find("input[name='"+$obj.attr("attr_id")+"']:checked").val();
					default_value = rvalue == undefined ? "||" : rvalue;
				}
				attrInfoArr.push(attr_id + "%%" + default_value);
			});
	param["attrInfoArr"] = attrInfoArr;
	
	//param["sendData"] = JSON.stringify(sendData);
	result.result = true;
	result.param = param;
	return result;
}


//初始化页面table  
function initDesignInfo(APP_ID) {	
	var currTab = getCurrentPageObj();
	var queryInput_call = getMillisecond()+'input';
	var queryParams=function(params){
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
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "DATA_ID", //每一行的唯一标识，一般为主键列
		jsonpCallback:queryInput_call,
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		onLoadSuccess:function(data){
			//gaveInfo();
			baseAjax("SDic/findItemByDic.asp",{dic_code:"I_DIC_INTER_DATA_TYPE"},function(data){
				if(data!=undefined){
					dic_data_I_DIC_INTER_DATA_TYPE = data;
				}
			}, false);
			baseAjax("SDic/findItemByDic.asp",{dic_code:"S_DIC_YN"},function(data){
				if(data!=undefined){
					dic_data_S_DIC_YN = data;
				}
			},false);
			
			//初始化字典项
			if(data.rows) {
				for(var i=0; i<data.rows.length; i++) {
					initSelectByData(getCurrentPageObj().find("#data_type"+i),{value:"ITEM_CODE",text:"ITEM_NAME"},dic_data_I_DIC_INTER_DATA_TYPE,data.rows[i].DATA_TYPE);
					initSelectByData(getCurrentPageObj().find("#is_necessary"+i),{value:"ITEM_CODE",text:"ITEM_NAME"},dic_data_S_DIC_YN,data.rows[i].IS_NECESSARY);
				}						
			}
			initVlidate(getCurrentPageObj().find("#inputData_from"));
		},
		columns : [ {
			field : 'Number',
			title : '序号',
			align : "center",
			width : "100",
			sortable: true,
			formatter: function (value, row, index) {
				return index+1;
			}
		},{
			field : "DATA_CHNNAME",
			title : "字段名(中文)",
			align : "center",
			width : "120",
			formatter:function(value, row, index) {
				var IS_STANDARD = row.IS_STANDARD;
				var disabled="";
				if(IS_STANDARD=='00'){
					disabled="readonly";
				}
				var str = '<input type="text" '+disabled+' id="data_chnname'+index+'" value="'+value+'" validate="v.required" valititle="该项为必填项">';
				return str;
			}
		}, {
			field : "DATA_ENGNAME",
			title : "1级字段名(英文)",
			align : "center",
			width : "120",
			formatter:function(value, row, index) {
				var IS_STANDARD = row.IS_STANDARD;
				var disabled="";
				if(IS_STANDARD=='00'){
					disabled="disabled";
				}
				var str = '<input type="text" '+disabled+' id="data_engname'+index+'" value="'+value+'" validate="v.required" valititle="该项为必填项" >';
				return str;
			}
		}, {
			field : "DATA_ENGNAMEA",
			title : "2级字段名(英文)",
			align : "center",
			width : "120",
			formatter:function(value, row, index) {
				var IS_STANDARD = row.IS_STANDARD;
				var disabled="";
				if(IS_STANDARD=='00'){
					disabled="disabled";
				}
				if(value == undefined){value = '';}
				var str = '<input type="text" '+disabled+' id="data_engnamea'+index+'" value="'+value+'" >';
				return str;
			}
		}, {
			field : "DATA_ENGNAMEB",
			title : "3级字段名(英文)",
			align : "center",
			width : "120",
			formatter:function(value, row, index) {
				var IS_STANDARD = row.IS_STANDARD;
				var disabled="";
				if(IS_STANDARD=='00'){
					disabled="disabled";
				}
				if(value == undefined){value = '';}
				var str = '<input type="text" '+disabled+' id="data_engnameb'+index+'" value="'+value+'"  >';
				return str;
			}
		}, {
			field : 'DATA_TYPE',
			title : '类型',
			align : "center",
			width : "120",
			formatter:function(value, row, index) {
				var IS_STANDARD = row.IS_STANDARD;
				var disabled="";
				if(IS_STANDARD=='00'){
					disabled="disabled";
				}
				var str = '<select id="data_type'+index+'" validate="v.required" '+disabled+' valititle="该项为必填项"></select>';
				return str;
			}
		}, {
			field : "MSG_LENGTH",
			title : "长度",
			align : "center",
			width : "100",
			formatter:function(value, row, index) {
				var IS_STANDARD = row.IS_STANDARD;
				var disabled="";
				if(IS_STANDARD=='00'){
					disabled="disabled";
				}
				var str = '<input type="text" '+disabled+' id="msg_length'+index+'" value="'+value+'" validate="v.required" valititle="该项为必填项">';
				return str;
			}
		},{
			field : "IS_NECESSARY",
			title : "是否必输",
			align : "center",
			width : "100",
			formatter:function(value, row, index) {
				var str = '<select id="is_necessary'+index+'" validate="v.required" valititle="该项为必填项"></select>';
				return str;
			}
		}, {
			field : "STANDARD_CODE",
			title : "标准代码",
			align : "center",
			width : "100",
			formatter:function(value, row, index) {
				var IS_STANDARD = row.IS_STANDARD;
				var disabled="";
				if(IS_STANDARD=='00'){
					disabled="disabled";
				}
				var str = "";
				if(value==undefined){
					str = '<input type="text" '+disabled+' id="standard_code'+index+'" value="" >';
				}else{
					str = '<input type="text" '+disabled+' id="standard_code'+index+'" value="'+value+'" >';
				}
				return str;
			}
		},{
			field : "DATA_INSTRUCTION",
			title : "内容说明",
			align : "center",
			width : "120",
			formatter:function(value, row, index) {
				var IS_STANDARD = row.IS_STANDARD;
				var disabled="";
				if(IS_STANDARD=='00'){
					disabled="disabled";
				}
				var str = "";
				if(value==undefined){
					str = '<input type="text" '+disabled+' id="data_instruction'+index+'" value="" ';
				}else{
					str = '<input type="text" '+disabled+' id="data_instruction'+index+'" value="'+value+'" ';
				}
				return str;
			}
		},{
			field : "INFO_REMARK",
			title : "备注",
			align : "center",
			width : "120",
			formatter:function(value, row, index) {
				var str = "";
				if(value==undefined){
					str = '<input type="text" id="info_remark'+index+'" value="" >';
				}else{
					str = '<input type="text" id="info_remark'+index+'" value="'+value+'" >';
				}
				return str;
			}
		},{
			field : "DATA_ID",
			title : "操作",
			align : "center",
			width : "100",
			formatter:function(value, row, index) {
				var edit="<span class='hover-view'"+
				//'onclick="delSendProTask('+row.DATA_ID+','');">删除</span>';
				//"onclick='delSendProTask(\""+row.DATA_ID+"\",\""+row.id+"\");'>删除</span>";
				"onclick='delInputData(\""+row.DATA_ID+"\");'>删除</span>";
				 return edit; 
			}
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
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "DATA_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		jsonpCallback:queryOutput_call,
		detailView : false, //是否显示父子表
		singleSelect: true,
		onLoadSuccess:function(data){
			//gaveInfo();	
			baseAjax("SDic/findItemByDic.asp",{dic_code:"I_DIC_INTER_DATA_TYPE"},function(data){
				if(data!=undefined){
					dic_data_I_DIC_INTER_DATA_TYPE = data;
				}
			}, false);
			baseAjax("SDic/findItemByDic.asp",{dic_code:"S_DIC_YN"},function(data){
				if(data!=undefined){
					dic_data_S_DIC_YN = data;
				}
			},false);
			//初始化字典项
			if(data.rows) {
				for(var i=0; i<data.rows.length; i++) {
					initSelectByData(getCurrentPageObj().find("#data_type_"+i),{value:"ITEM_CODE",text:"ITEM_NAME"},dic_data_I_DIC_INTER_DATA_TYPE,data.rows[i].DATA_TYPE);
					initSelectByData(getCurrentPageObj().find("#is_necessary_"+i),{value:"ITEM_CODE",text:"ITEM_NAME"},dic_data_S_DIC_YN,data.rows[i].IS_NECESSARY);
				}						
			}
			initVlidate(getCurrentPageObj().find("#outputData_from"));
		},
		columns : [ {
			field : 'Number',
			title : '序号',
			align : "center",
			sortable: true,
			width : "120",
			formatter: function (value, row, index) {
				return index+1;
			}
		},{
			field : "DATA_CHNNAME",
			title : "字段名(中文)",
			align : "center",
			width : "120",
			formatter:function(value, row, index) {
				var IS_STANDARD = row.IS_STANDARD;
				var disabled="";
				if(IS_STANDARD=='00'){
					disabled="disabled";
				}
				var str = '<input type="text" '+disabled+' id="data_chnname_'+index+'" value="'+value+'" validate="v.required" valititle="该项为必填项">';
				return str;
			}
		}, {
			field : "DATA_ENGNAME",
			title : "1级字段名(英文)",
			align : "center",
			width : "120",
			formatter:function(value, row, index) {
				var IS_STANDARD = row.IS_STANDARD;
				var disabled="";
				if(IS_STANDARD=='00'){
					disabled="disabled";
				}
				var str = '<input type="text" '+disabled+' id="data_engname_'+index+'" value="'+value+'" validate="v.required" valititle="该项为必填项" >';
				return str;
			}
		}, {
			field : "DATA_ENGNAMEA",
			title : "2级字段名(英文)",
			align : "center",
			width : "120",
			formatter:function(value, row, index) {
				var IS_STANDARD = row.IS_STANDARD;
				var disabled="";
				if(IS_STANDARD=='00'){
					disabled="disabled";
				}
				if(value == undefined){value = '';}
				var str = '<input type="text" '+disabled+' id="data_engnamea_'+index+'" value="'+value+'"  >';
				return str;
			}
		}, {
			field : "DATA_ENGNAMEB",
			title : "3级字段名(英文)",
			align : "center",
			width : "120",
			formatter:function(value, row, index) {
				var IS_STANDARD = row.IS_STANDARD;
				var disabled="";
				if(IS_STANDARD=='00'){
					disabled="disabled";
				}
				if(value == undefined){value = '';}
				var str = '<input type="text" '+disabled+' id="data_engnameb_'+index+'" value="'+value+'" >';
				return str;
			}
		}, {
			field : 'DATA_TYPE',
			title : '类型',
			align : "center",
			width : "120",
			formatter:function(value, row, index) {
				var IS_STANDARD = row.IS_STANDARD;
				var disabled="";
				if(IS_STANDARD=='00'){
					disabled="disabled";
				}
				var str = '<select id="data_type_'+index+'" validate="v.required" '+disabled+' valititle="该项为必填项"></select>';
				return str;
			}
		}, {
			field : "MSG_LENGTH",
			title : "长度",
			align : "center",
			width : "100",
			formatter:function(value, row, index) {
				var IS_STANDARD = row.IS_STANDARD;
				var disabled="";
				if(IS_STANDARD=='00'){
					disabled="disabled";
				}
				var str = '<input type="text" '+disabled+' id="msg_length_'+index+'" value="'+value+'" validate="v.required" valititle="该项为必填项">';
				return str;
			}
		},{
			field : "IS_NECESSARY",
			title : "是否必输",
			width : "100",
			formatter:function(value, row, index) {
				var str = '<select id="is_necessary_'+index+'" validate="v.required" valititle="该项为必填项"></select>';
				return str;
			}
		}, {
			field : "STANDARD_CODE",
			title : "标准代码",
			align : "center",
			width : "100",
			formatter:function(value, row, index) {
				var IS_STANDARD = row.IS_STANDARD;
				var disabled="";
				if(IS_STANDARD=='00'){
					disabled="disabled";
				}
				var str = "";
				if(value==undefined){
					str = '<input type="text" '+disabled+' id="standard_code_'+index+'" value="" >';
				}else{
					str = '<input type="text" '+disabled+' id="standard_code_'+index+'" value="'+value+'" >';
				}
				return str;
			}
		},{
			field : "DATA_INSTRUCTION",
			title : "内容说明",
			align : "center",
			width : "120",
			formatter:function(value, row, index) {
				var IS_STANDARD = row.IS_STANDARD;
				var disabled="";
				if(IS_STANDARD=='00'){
					disabled="disabled";
				}
				var str = "";
				if(value==undefined){
					str = '<input type="text" '+disabled+' id="data_instruction_'+index+'" value="" ';
				}else{
					str = '<input type="text" '+disabled+' id="data_instruction_'+index+'" value="'+value+'" ';
				}
				return str;
			}
		},{
			field : "INFO_REMARK",
			title : "备注",
			align : "center",
			width : "120",
			formatter:function(value, row, index) {
				var str = "";
				if(value==undefined){
					str = '<input type="text" id="info_remark_'+index+'" value="" >';
				}else{
					str = '<input type="text" id="info_remark_'+index+'" value="'+value+'" >';
				}
				return str;
			}
		},{
			field : "DATA_ID",
			title : "操作",
			align : "center",
			width : "100",
			formatter:function(value, row, index) {
				var edit="<span class='hover-view'"+
				"onclick='delOutputData(\""+row.DATA_ID+"\");'>删除</span>";
				 return edit; 
			}
		}]
	});
	
	initAttrTable(APP_ID);
	//初始化属性table
	function initAttrTable(app_id){
		var rowCall = getMillisecond();
		baseAjaxJsonp(dev_application+"useApplyManage/initInterAttr.asp?SID=" + SID + "&call=" + rowCall, {app_id : app_id}, function(data) {
			if(data && data.attrRowList){
				//先动态生成表列内容
				var appendHtml = getTableBodyHtml(data.attrRowList);
				var modObj = getCurrentPageObj().find("#designAttr");
				var table = modObj.find("table[tb=attrTable] tbody");
				table.html("");
				//再加载进表
				table.append(appendHtml);
				initVlidate(table);
				//最后初始化字典项
				autoInitSelectAndRadio(table);
			}
			else{
				baseAjaxJsonp(dev_application+"useApplyManage/initInterAttr.asp?SID=" + SID + "&call=" + rowCall, {app_id : undefined}, function(data) {
					if(data && data.attrRowList){
						//先动态生成表列内容
						var appendHtml = getTableBodyHtml(data.attrRowList);
						var modObj = getCurrentPageObj().find("#designAttr");
						var table = modObj.find("table[tb=attrTable] tbody");
						table.html("");
						//再加载进表
						table.append(appendHtml);
						initVlidate(table);
						//最后初始化字典项
						autoInitSelectAndRadio(table);
					}
				},rowCall,false);
			}
		},rowCall,false);
	}
	
	//初始化动态类型表格
	function getTableBodyHtml(attrField){
		var rowNum = 2;
		var appendHtml = "";
		var fieldNum = 1;
		for ( var i = 0; i < attrField.length; i++) {
			appendHtml += fieldNum%rowNum==1?"<tr>":"";
			appendHtml += getRowLine(attrField[i]);
			appendHtml += fieldNum%rowNum==0?"</tr>":"";
			fieldNum++;
		}
		//补全因非结束产生的表格不全的情况;
		if(!(fieldNum%rowNum==1)){
			while(!(fieldNum%rowNum==1)){
				appendHtml += "<td colspan='2'></td>";
				fieldNum++;
			}
			appendHtml += "</tr>";
		}
		return appendHtml;
	}
	
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
			str += "<td name='attrInfoList'><select attr_type='select' style='width:100%' "+is_necessary+" attr_id='" + item.ATTR_ID + "' diccode='"+item.DIC_INFO+"' value='"+item.DEFAULT_VALUE+"'></select></td>";
		} else if(item.ATTR_TYPE=="02"){//02表示下拉多选
			str += "<td name='attrInfoList'><select style='width:100%' attr_type='mul_select' "+is_necessary+" attr_id='" + item.ATTR_ID + "' diccode='"+item.DIC_INFO+"' multiple='multiple' value='"+item.DEFAULT_VALUE+"'></select></td>";
		} else if(item.ATTR_TYPE=="03"){//二选一
			str += "<td name='attrInfoList'><span attr_type='radio' attr_id='" + item.ATTR_ID + "' radiocode='"+item.DIC_INFO+" 'value='"+item.DEFAULT_VALUE+"' class='citic-sele-ast'></span></td>";
		}
		return str;
	}
	
	//初始化字典项
	function autoInitSelectAndRadio(tableObj){
		//初始化下拉选
		var seles = tableObj.find("select");
		for(var i = 0; i < seles.length; i++){
			if(typeof($(seles[i]).attr("multiple"))=="undefined"){//当是下拉单选时
				initSelect($(seles[i]),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:$(seles[i]).attr("diccode")},$(seles[i]).attr("value"), null);
			}else{//否则是下拉多选
				 initMoreSelect($(seles[i]),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:$(seles[i]).attr("diccode")},$(seles[i]).attr("value"), null);
			}
		}
		//初始化radio
		var radios = tableObj.find("span[radiocode]");
		for(var j=0 ; j < radios.length; j++){
			var $radio = $(radios[j]);
			autoInitRadio({dic_code:$.trim($radio.attr("radiocode"))},$radio,$radio.attr("attr_id"),{labClass:"ecitic-radio-inline",value:$radio.attr("value")});
		}
		
	}

	
};

//删除一行
function delOutputData(data_id){
	deleteData('OutputContentTable','outputData_from','_',data_id);
}
function delInputData(data_id){
	 deleteData('InputContentTable','inputData_from','',data_id);
}
function deleteData(tableId,vlidateId,v_,data_id){
	
	//添加报文输出信息
	var currTab = getCurrentPageObj();
		var sendData = currTab.find("#"+tableId).bootstrapTable('getData');
		var i = v_+sendData.length;
		$.each(sendData, function(j) {
			sendData[j].DATA_TYPE = currTab.find("#data_type"+v_+j).val();
			sendData[j].IS_NECESSARY = currTab.find("#is_necessary"+v_+j).val();
			sendData[j].DATA_CHNNAME = currTab.find("#data_chnname"+v_+j).val();
			sendData[j].DATA_ENGNAME = currTab.find("#data_engname"+v_+j).val();
			sendData[j].DATA_ENGNAMEA = currTab.find("#data_engnamea"+v_+j).val();
			sendData[j].DATA_ENGNAMEB = currTab.find("#data_engnameb"+v_+j).val();
			sendData[j].MSG_LENGTH = currTab.find("#msg_length"+v_+j).val();
			sendData[j].STANDARD_CODE = currTab.find("#standard_code"+v_+j).val();
			sendData[j].DATA_INSTRUCTION = currTab.find("#data_instruction"+v_+j).val();
			sendData[j].INFO_REMARK = currTab.find("#info_remark"+v_+j).val();
		});
		
		getCurrentPageObj().find("#"+tableId).bootstrapTable("removeByUniqueId", data_id);	
		
		
		//旧的行，把原来的放进去
		for(var k=0; k<sendData.length; k++) {
			initSelectByData(currTab.find("#data_type"+v_+k),{value:"ITEM_CODE",text:"ITEM_NAME"},dic_data_I_DIC_INTER_DATA_TYPE,sendData[k]['DATA_TYPE']);
			initSelectByData(currTab.find("#is_necessary"+v_+k),{value:"ITEM_CODE",text:"ITEM_NAME"},dic_data_S_DIC_YN,sendData[k]['IS_NECESSARY']);
			//initSelect(currTab.find("#data_type"+v_+k),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"I_DIC_INTER_DATA_TYPE"},sendData[k].DATA_TYPE);
			//initSelect(currTab.find("#is_necessary"+v_+k),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_YN"},sendData[k].IS_NECESSARY);
			currTab.find("#data_type"+v_+k).val(sendData[k].DATA_TYPE);
			currTab.find("#is_necessary"+v_+k).val(sendData[k].IS_NECESSARY);
			currTab.find("#data_chnname"+v_+k).val(sendData[k].DATA_CHNNAME);
			currTab.find("#data_engname"+v_+k).val(sendData[k].DATA_ENGNAME);
			currTab.find("#data_engnamea"+v_+k).val(sendData[k].DATA_ENGNAMEA);
			currTab.find("#data_engnameb"+v_+k).val(sendData[k].DATA_ENGNAMEB);
			currTab.find("#msg_length"+v_+k).val(sendData[k].MSG_LENGTH);
			currTab.find("#standard_code"+v_+k).val(sendData[k].STANDARD_CODE);
			currTab.find("#data_instruction"+v_+k).val(sendData[k].DATA_INSTRUCTION);
			currTab.find("#info_remark"+v_+k).val(sendData[k].INFO_REMARK);
		}
		initVlidate($("#"+vlidateId));
	
}

//添加报文信息
function addContent(tableId,vlidateId,v_,row){
	//添加报文输出信息
	var currTab = getCurrentPageObj();
		var sendData = currTab.find("#"+tableId).bootstrapTable('getData');
		var item = {};
		if(row!=undefined&&row!=""&&row!="undefined") {
			item = row;
			item['IS_NECESSARY'] = "";
		}else{
			item['DATA_ID'] = getMillisecond();
			item['DATA_CHNNAME'] = "";
			item['DATA_ENGNAME'] = "";
			item['DATA_ENGNAMEA'] = "";
			item['DATA_ENGNAMEB'] = "";
			item['DATA_TYPE'] = "";
			item['MSG_LENGTH'] = "";
			item['IS_NECESSARY'] = "01";
			item['STANDARD_CODE'] = "";
			item['DATA_INSTRUCTION'] = "";
			item['INFO_REMARK'] = "";
			item['IS_STANDARD'] = "01";
		}
		var i = v_+sendData.length;
		$.each(sendData, function(j) {
			sendData[j].DATA_TYPE = currTab.find("#data_type"+v_+j).val();
			sendData[j].IS_NECESSARY = currTab.find("#is_necessary"+v_+j).val();
			sendData[j].DATA_CHNNAME = currTab.find("#data_chnname"+v_+j).val();
			sendData[j].DATA_ENGNAME = currTab.find("#data_engname"+v_+j).val();
			sendData[j].DATA_ENGNAMEA = currTab.find("#data_engnamea"+v_+j).val();
			sendData[j].DATA_ENGNAMEB = currTab.find("#data_engnameb"+v_+j).val();
			sendData[j].MSG_LENGTH = currTab.find("#msg_length"+v_+j).val();
			sendData[j].STANDARD_CODE = currTab.find("#standard_code"+v_+j).val();
			sendData[j].DATA_INSTRUCTION = currTab.find("#data_instruction"+v_+j).val();
			sendData[j].INFO_REMARK = currTab.find("#info_remark"+v_+j).val();
		});
		currTab.find("#"+tableId).bootstrapTable("append",item);
		initSelect(currTab.find("#data_type"+i),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"I_DIC_INTER_DATA_TYPE"},item['DATA_TYPE']);
		initSelect(currTab.find("#is_necessary"+i),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_YN"},item['IS_NECESSARY']);

		//旧的行，把原来的放进去
		for(var k=0; k<sendData.length; k++) {
			
			initSelect(currTab.find("#data_type"+v_+k),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"I_DIC_INTER_DATA_TYPE"},sendData[k].DATA_TYPE);
			initSelect(currTab.find("#is_necessary"+v_+k),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_YN"},sendData[k].IS_NECESSARY);
//			currTab.find("#data_type"+v_+k).val(sendData[k].DATA_TYPE);
//			currTab.find("#is_necessary"+v_+k).val(sendData[k].IS_NECESSARY);
//			currTab.find("#data_chnname"+v_+k).val(sendData[k].DATA_CHNNAME);
//			currTab.find("#data_engname"+v_+k).val(sendData[k].DATA_ENGNAME);
//			currTab.find("#msg_length"+v_+k).val(sendData[k].MSG_LENGTH);
//			currTab.find("#standard_code"+v_+k).val(sendData[k].STANDARD_CODE);
//			currTab.find("#data_instruction"+v_+k).val(sendData[k].DATA_INSTRUCTION);
//			currTab.find("#info_remark"+v_+k).val(sendData[k].INFO_REMARK);
		}
		initVlidate($("#"+vlidateId));
	
}

//导入报文输入内容
function importInput(fileId){

	var text = getCurrentPageObj().find('#inputfield').val();
	if(text==""){
		alert("请上传文件");
		return;
	}
	//var app_id = getCurrentPageObj().find('#app_id').val();

	startLoading();
	 $.ajaxFileUpload({
		    url:"messimport/importPhaseFile.asp?SID="+SID,
		    type:"post",
			secureuri:false,
			fileElementId:fileId,
			data:'',
			dataType:"json",
			success:function (msg){
				endLoading();
				getCurrentPageObj().find("#"+fileId).val("");
				getCurrentPageObj().find("#supplierfield").val("");
				$("#input_import").modal("hide");
				if(msg&&msg.result=="true"){
					 if(msg.inlist != null && msg.inlist != undefined){//输入
						 addContents('InputContentTable','inputData_from','',msg.inlist);
					 }
					 if(msg.outlist != null && msg.outlist != undefined){//输出
						 addContents('OutputContentTable','outputData_from','_',msg.outlist);
					 }
					 alert("导入成功！");
				}else if(msg&&msg.result=="false"){
					alert(msg.msg);
				}else{
					alert("读取文件失败！");
				}

			},
			error: function (msg){
				endLoading();
				alert("导入失败！");
			}
	   });
}

//添加报文信息
function addContents(tableId,vlidateId,v_,rows){
	//添加报文输出信息
		var currTab = getCurrentPageObj();
		var sendData = currTab.find("#"+tableId).bootstrapTable('getData');
		var n = sendData.length;
		
		$.each(sendData, function(j) {
			sendData[j].DATA_TYPE = currTab.find("#data_type"+v_+j).val();
			sendData[j].IS_NECESSARY = currTab.find("#is_necessary"+v_+j).val();
			sendData[j].DATA_CHNNAME = currTab.find("#data_chnname"+v_+j).val();
			sendData[j].DATA_ENGNAME = currTab.find("#data_engname"+v_+j).val();
			sendData[j].DATA_ENGNAMEA = currTab.find("#data_engnamea"+v_+j).val();
			sendData[j].DATA_ENGNAMEB = currTab.find("#data_engnameb"+v_+j).val();
			sendData[j].MSG_LENGTH = currTab.find("#msg_length"+v_+j).val();
			sendData[j].STANDARD_CODE = currTab.find("#standard_code"+v_+j).val();
			sendData[j].DATA_INSTRUCTION = currTab.find("#data_instruction"+v_+j).val();
			sendData[j].INFO_REMARK = currTab.find("#info_remark"+v_+j).val();
		});
	
		for(var i=0;i<rows.length;i++){
			var m = n + i;

			rows[i]['DATA_CHNNAME'];
			rows[i]['DATA_ID'] = getMillisecond()+""+i;
			rows[i]['IS_STANDARD'] = "01";
			var data_type = rows[i]['DATA_TYPE'];
			if(data_type == 'varchar2'){
				rows[i]['DATA_TYPE'] = '00';
			}else if(data_type == 'number'){
				rows[i]['DATA_TYPE'] = '01';
			}else if(data_type == 'char'){
				rows[i]['DATA_TYPE'] = '02';
			};
			var is_necessary = rows[i]['IS_NECESSARY'];
			if(is_necessary == '是'){
				 rows[i]['IS_NECESSARY'] = '00';
			}else if(is_necessary == '否'){
				 rows[i]['IS_NECESSARY'] = '01';
			};
			
			currTab.find("#"+tableId).bootstrapTable("append",rows[i]);
		}
		
		
		for(var i=0;i<rows.length;i++){
			var m = n + i;
			m = v_+m;
			initSelectByData(currTab.find("#data_type"+m),{value:"ITEM_CODE",text:"ITEM_NAME"},dic_data_I_DIC_INTER_DATA_TYPE,rows[i]['DATA_TYPE']);
			initSelectByData(currTab.find("#is_necessary"+m),{value:"ITEM_CODE",text:"ITEM_NAME"},dic_data_S_DIC_YN,rows[i]['IS_NECESSARY']);
		}

		//旧的行，把原来的放进去
		for(var k=0; k<sendData.length; k++) {
//			
			initSelectByData(currTab.find("#data_type"+v_+k),{value:"ITEM_CODE",text:"ITEM_NAME"},dic_data_I_DIC_INTER_DATA_TYPE,sendData[k]['DATA_TYPE']);
			initSelectByData(currTab.find("#is_necessary"+v_+k),{value:"ITEM_CODE",text:"ITEM_NAME"},dic_data_S_DIC_YN,sendData[k]['IS_NECESSARY']);

		}
		initVlidate($("#"+vlidateId));
		
	
}