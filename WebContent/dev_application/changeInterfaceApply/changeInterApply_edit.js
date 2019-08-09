var interAppCall = getMillisecond();//table回调方法名
var new_changeAttr_flag = false;
var new_changeInput_flag = false;
var new_changeOutput_flag = false;

var dic_data_I_DIC_INTER_DATA_TYPE;
var dic_data_S_DIC_YN;
//初始化事件
function initChangeAppLayOut(item,view){
	var $page = getCurrentPageObj();//当前页
	initVlidate($page);//渲染必填项
	//var qRecord_app_num = "";
	if(item){//初始化申请信息
		//修改申请隐藏占位列
		if(item.is_new=="00"){
			getCurrentPageObj().find("#td3").show();
			getCurrentPageObj().find("#td1").hide();
			getCurrentPageObj().find("#td2").hide();
			//从信息跳转过来的。初始化报文
			var int=setInterval(function(){
				if(new_changeAttr_flag && new_changeInput_flag && new_changeOutput_flag){
					clearInterval(int);
					getChangeUrl(item.INTER_ID,item.INTER_VERSION);
				}
			},300);
			
		}
		else{
		getCurrentPageObj().find("#td3").hide();
		getCurrentPageObj().find("#td1").show();
		getCurrentPageObj().find("#td2").show();
		}
		initAppInfo(item);
		//var qRecord_app_num = item.RECORD_APP_NUM;
		initApplyChangeInfo(item.APP_ID,item.INTER_ID,item.INTER_VERSION,view);
		$page.find("#file_id").val(item.FILE_ID);
		
	}else{	
		//填写申请单;
		getCurrentPageObj().find("#td3").show();
		getCurrentPageObj().find("#td1").hide();
		getCurrentPageObj().find("#td2").hide();
		initApplyChangeInfo("0");
	}
	//初始化按钮事件
	initButtonEvent();
	initVlidate($("#appChangeInfo"));
	
	//点击打开模态框
	var tablefile = $page.find("#filetable");
	var addfile = $page.find("#add_file");
	var business_code = $page.find("#file_id").val();
	if(typeof($page.find("#file_id").val())=="undefined"||$page.find("#file_id").val()==""){
		business_code = Math.uuid();
		$page.find("#file_id").val(business_code);
	}
	addfile.click(function(){
		var paramObj = new Object();
		paramObj["SYSTEM_NAME"] = $page.find("input[name='IU.ser_system_name']").val();
		paramObj["INTER_CODE"] = $page.find("#inter_code").val();
		openFileFtpUpload($page.find("#add_modalfile"), tablefile, 'GZ1070',business_code, '00', 'S_DIC_INTER_DESIGN_FILE', false,false, paramObj);
	});
	//附件删除
	var delete_file = $page.find("#delete_file"); 
	delete_file.click(function(){
		delFtpFile(tablefile, business_code, "00");
	});
	getFtpFileList(tablefile, $page.find("#add_fileview_modal"), business_code, "00");
	
	/***************初始化变更接口属性******************/

	//输入内容选择新增按钮
	$page.find("#input_selectData").click(function(){
		var $tab1_input = getCurrentPageObj().find("#InputContentTable");
		var inforMaintence_pop = getCurrentPageObj().find("[mod='seleInterPop']");
		changeInforMaintenace_seleDataPop(inforMaintence_pop,'InputContentTable',"00","inputData_from");
	});
	//输出内容选择新增按钮
	$page.find("#out_selectData").click(function(){
		var $tab2_input = getCurrentPageObj().find("#OutputContentTable");
		var inforMaintence_pop = getCurrentPageObj().find("[mod='seleInterPop']");
		changeInforMaintenace_seleDataPop(inforMaintence_pop,'OutputContentTable',"01","outputData_from");
	});

/****************************以下内部方法**********************************/	
	//初始化申请信息
	function initAppInfo(item){
		for(var k in item){
			k1 = k.toLowerCase();
			$page.find("[name='IU."+ k1 +"']").val(item[k]);
		}
		/*
		 * 不可修改，防止修改的时候切换了服务方应用并选了切换后的服务方的现有接口，但是最后却没有保存，
		 * 造成申请单选的服务方应用与所申请的现有接口的服务方应用不对应(申请单信息与子表接口申请不同步保存，
		 * 	要同步保存改造太大，目前先这样，后续需要再改造)
		 */
		$page.find("[name='IU.ser_system_name']").attr("disabled", "disabled");
		$page.find("[name='IU.app_name']").attr("disabled", "disabled");
	}
	
	//按钮事件
	function initButtonEvent(){
		
		
		//报文内容导入
		$page.find("[btn='message_into']").click(function(){
			$page.find("#input_import").modal("show");
		});
		
		//报文内容清空
		$page.find("[btn='message_clear']").click(function(){
			nconfirm('确定清空现有报文输入及输出内容?',function(){
				$page.find("#InputContentTable").bootstrapTable('removeAll');
				$page.find("#OutputContentTable").bootstrapTable('removeAll');
				
			});
			
		});
		
		//消费方 pop框按钮
		$page.find("[name='IU.con_system_name']").click(function(){
			var $id = $page.find("[name='IU.con_system_id']");
			var $name = $(this);
			var $systemPop = $page.find("[mod='systemPop']");
			useInterfaceApply_systemPop($systemPop, {id : $id, name : $name, type : "con"});
		});
		
		//服务方 pop框按钮
		$page.find("[name='IU.ser_system_name']").click(function(){
			var $id = $page.find("[name='IU.ser_system_id']");
			var $name = $(this);
			var $systemPop = $page.find("[mod='systemPop']");
			changeInterfaceApply_systemPop($systemPop, {id : $id, name : $name});
		});
		
		//需求任务 pop框按钮
		$page.find("[name='IU.req_task_code']").click(function(){
			var system_id = $page.find("[name='IU.ser_system_id']").val();
			if(!system_id){
				alert("请选择服务方应用");
				return;
			}
			var $id = $page.find("[name='IU.req_task_id']");
			var $code = $(this);
			var $name = $page.find("[name='IU.req_task_name']");
			var $taskPop = $page.find("[mod='taskPop']");
			useInterfaceApply_taskPop($taskPop, {system_id : system_id,id : $id, name : $name, code : $code});
		});
		
		//选择现有接口按钮
		$page.find("#inter_code").click(function(){
			var ser_system_id = $page.find("[name='IU.ser_system_id']").val();
			if(!ser_system_id){
				alert("请选择服务方应用");
				return;
			}
			
			var $seleInterPop = $page.find("[mod='seleInterPop']");
			var param = {};
			param.ser_system_id = ser_system_id;
			param.inter_code = $page.find("#inter_code");
			param.inter_id = $page.find("#inter_id");
			param.inter_name = $page.find("#inter_name");
			param.trade_code = $page.find("#trade_code");
			param.inter_status = $page.find("#inter_status");
			param.inter_version = $page.find("#inter_version");
			param.inter_office_type = $page.find("#inter_office_type");
			useInterfaceApply_seleInterPop($seleInterPop, param);
			//$page.find("[name='IU.ser_system_name']").attr("disabled", "disabled");
		 });
		
		 
		
	};
	
}


//保存按钮
//$page.find("#submitAppInfo").click(function(){
function changeAppSubmit(status_type){

	$('#changeInterAll li:eq(0) a').tab('show');
	if(!vlidate(getCurrentPageObj().find("#appChangeInfo"))){
		alert("请填写相关必填项");
		hideVlidateTagContent();
		return ;
	}
	$('#changeInterAll li:eq(1) a').tab('show');
	if(!vlidate(getCurrentPageObj().find("#changeVlidate"))){
		alert("请填写相关必填项");
		hideVlidateTagContent();
		return ;
	}
	$('#changeInterAll li:eq(2) a').tab('show');
	if(!vlidate(getCurrentPageObj().find("#inputData_from"))||!vlidate(getCurrentPageObj().find("#outputData_from"))){
		alert("请填写相关必填项");
		hideVlidateTagContent();
		return ;
	}
	var tablelength =getCurrentPageObj().find("#InputContentTable").bootstrapTable('getData');
      if (tablelength.length <=0) {
        alert('请添加输入报文信息');
        hideVlidateTagContent();
         return ;
    }
//     var tablelength1 =getCurrentPageObj().find("#OutputContentTable").bootstrapTable('getData');
//    if (tablelength1.length <=0 ) {
//       alert('请添加输出报文信息');
//       hideVlidateTagContent();
//          return ;
//    }
    
    var aaa=getCurrentPageObj().find("[name='IU.app_reason']").val();
    if(aaa.length>100){
    	alert("变更原因至多可输入100汉字！");
    	return;
    }
    var bbb=getCurrentPageObj().find("[name='IU.change_analyse']").val();
    if(bbb.length>100){
    	alert("影响分析至多可输入100汉字！");
    	return;
    }
    
  

	var spCall = getMillisecond();
	var result = getChangeAppData(status_type);
	if(result.result == true){	
		var call = getMillisecond();	
		var url = dev_application+'InterchangeApp/submitChangeApply.asp?call='+call+'&SID='+SID;
		baseAjax(url, result.param, function(data){
			if (data != undefined&&data!=null&&data.result=="true") {
				alert("保存成功！",function(){
					closeCurrPageTab();
				});
			} else {
				alert("保存失败！");
			}
		});
	}
}





//删除接口申请信息
function useInterfaceApply_delInterApp(index){
	var record_app_num = getCurrentPageObj().find("[name='IU.record_app_num']").val();
	params = getCurrentPageObj().find('[tb="appListTable"]').bootstrapTable("getData")[index];
	var dCall = getMillisecond();
	baseAjaxJsonp(dev_application+"useApplyManage/delInterApp.asp?SID="
			+ SID + "&call=" + dCall,
			{inter_id : params.INTER_ID,
			app_id : params.APP_ID,
			app_type : params.APP_TYPE}, function(data) {
		if(data && data.result=="true"){
			getCurrentPageObj().find('[tb="appListTable"]').bootstrapTable('refresh',{
				url:dev_application+"useApplyManage/queryInterAppListById.asp?SID=" + SID + "&call=" + interAppCall + "&record_app_num=" + record_app_num});
		}
	},dCall,false);
	
}

//跳转查看现有接口360
function useInterfaceApply_viewDetail(id,version,modObj){
	if(modObj){//需要关闭模态框时
		getCurrentPageObj().find("#"+modObj).modal("hide");//模态框关闭，关闭遮罩层
	}
	closeAndOpenInnerPageTab("queryInterInfo360","查看接口信息360","dev_application/interfaceInfo/interfaceinfo_360mesbasic.html", function(){
		//点击接口详情按钮页面跳转获取详细的接口信息
				var modObj = getCurrentPageObj().find("#inter360_basic_table");
				Inter360InfoDetail(id);
				inter360initAttrTable(id,version,modObj,"table[tb=360attrTable] tbody",null);
				//报文输入输出信息
				initImportContentQuery(id,"AImportContentList",version);
				initExportContentQuery(id,"AExportContentList",version);
				//接口调用关系查询
				initInter_useRelationQuery(id);
				//接口版本信息
				initVersionListTable(id);
				//变更列表信息
				initExchangeListQuery(id);
		});
}



//初始化页面table  
function initApplyChangeInfo(APP_ID,INTER_ID,INTER_VERSION,view) {
	var queryAttrParams=function(params){
		var temp={
			limit: params.limit, //页面大小
			offset: params.offset //页码
		};
		return temp;
	};
	var queryChange_call = 'attr';
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
		//pagination : true, //是否显示分页（*）
		//pageList : [100,200],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 100,//可供选择的每页的行数（*）
		clickToSelect : false, //是否启用点击选中行
		uniqueId : "apply_id", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		jsonpCallback:queryChange_call,
		detailView : false, //是否显示父子表
		singleSelect: true,
		onLoadSuccess:function(data){
			//gaveInfo();
			new_changeAttr_flag = true;
			//初始化字典项
			if(data.rows) {
				for(var i=0; i<data.rows.length; i++) {
					var attrObj  = getCurrentPageObj().find("#chang_value"+i);
					if(data.rows[i].ATTR_TYPE=='01'){
						initSelect(attrObj,{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:data.rows[i].DIC_INFO},attrObj.attr("value"));
					}else if(data.rows[i].ATTR_TYPE=='02'){
						initMoreSelect(attrObj,{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:data.rows[i].DIC_INFO},attrObj.attr("value"));
					}else if(data.rows[i].ATTR_TYPE=="03"){
						var value = attrObj.attr("value");
						if(value==undefined || value == "undefined") value="01";
						autoInitRadio({dic_code:data.rows[i].DIC_INFO},getCurrentPageObj().find("#chang_value"+i),"chang_value"+i,{labClass:"ecitic-radio-inline",value:value});
					}
				}						
			}
			if(view=="view")
				getCurrentPageObj().find("input,select,textarea").not("[name='closePageTabConfirm']").attr("disabled","disabled");

			initVlidate(getCurrentPageObj().find("#changeVlidate"));
		},
		columns : [{
			field : "ATTR_NAME",
			title : "属性名",
			align : "center",
				width : "33.3333%"
		}, {
			field : "OLD_ATTR_VALUE_NAME",
			title : "变更前",
			align : "center",
			width : "33.3333%",
			
		}, {
			field : 'CHANG_VALUE',
			title : '变更后',
			align : "center",
			width : "33.3333%",
			formatter:function(value, row, index) {
				var str = "";
				var is_necessary = "";
				if(row.IS_NECESSARY == "00"){//00表示必填
					is_necessary = 'validate=\"v.required\"';
				}
				if(!value){
					value = row.OLD_ATTR_VALUE ? row.OLD_ATTR_VALUE : "" ;
				}
				//str += "<td  class='table-text' width='20%' >" + row.ATTR_NAME + ":</td>";
				if(row.ATTR_TYPE=="00"){//00表示文本框
					str += "<input id='chang_value"+index+"' attr_type='input' "+is_necessary+" type='text' maxlength='"+row.MAX_LONG+"' attr_id='" + row.ATTR_ID + "' value='"+value+"' />";
				} else if(row.ATTR_TYPE=="01"){//01表示下拉单选
					str += "<select id='chang_value"+index+"' style='width:100%' attr_type='select' "+is_necessary+" attr_id='" + row.ATTR_ID + "' diccode='"+row.DIC_INFO+"' value='"+value+"'></select>";
				} else if(row.ATTR_TYPE=="02"){//02表示下拉多选
					str += "<select id='chang_value"+index+"' style='width:100%' attr_type='mul_select' "+is_necessary+" attr_id='" + row.ATTR_ID + "' diccode='"+row.DIC_INFO+"' multiple='multiple' value='"+value+"'></select>";
				} else if(row.ATTR_TYPE=="03"){//二选一
					str += "<span id='chang_value"+index+"' attr_type='radio'  attr_id='" + row.ATTR_ID + "' radiocode='"+row.DIC_INFO+" 'value='"+value+"' class='citic-sele-ast'></span>";
				}
				return str;
			}
		}]
	});
	
	
	
	var currTab = getCurrentPageObj();
	var queryInput_call = 'input';
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
		cache : true, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
//		pagination : true, //是否显示分页（*）
//		pageList : [5,10],//每页的记录行数（*）
//		pageNumber : 1, //初始化加载第一页，默认第一页
//		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "DATA_ID", //每一行的唯一标识，一般为主键列
		jsonpCallback:queryInput_call,
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		onLoadSuccess:function(data){	
			new_changeInput_flag = true;
			//初始化字典项
//			if(data.rows) {
//				for(var i=0; i<data.rows.length; i++) {
//					initSelect(getCurrentPageObj().find("#data_type"+i),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"I_DIC_INTER_DATA_TYPE"},data.rows[i].DATA_TYPE);
//					initSelect(getCurrentPageObj().find("#is_necessary"+i),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_YN"},data.rows[i].IS_NECESSARY);
//				}			
//			}
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
			if(view=="view")
				getCurrentPageObj().find("input,select,textarea").not("[name='closePageTabConfirm']").attr("disabled","disabled");

			initVlidate($("#inputData_from"));
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
	var queryOutput_call = 'output';
	getCurrentPageObj().find("#OutputContentTable").bootstrapTable({
		//请求后台的URL（*）
		url :dev_application+'IAnalyse/queryContentList.asp?call='+queryOutput_call+'&SID='+SID+'&APP_ID='+APP_ID,
		method : 'get', //请求方式（*）   
		striped : true, //是否显示行间隔色
		cache : true, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryOutParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
//		pagination : true, //是否显示分页（*）
//		pageList : [5,10],//每页的记录行数（*）
//		pageNumber : 1, //初始化加载第一页，默认第一页
//		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "DATA_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		jsonpCallback:queryOutput_call,
		detailView : false, //是否显示父子表
		singleSelect: true,
		onLoadSuccess:function(data){	
			new_changeOutput_flag = true;
			//初始化字典项
			if(data.rows) {
				
				for(var i=0; i<data.rows.length; i++) {
					initSelect(getCurrentPageObj().find("#data_type_"+i),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"I_DIC_INTER_DATA_TYPE"},data.rows[i].DATA_TYPE);
					initSelect(getCurrentPageObj().find("#is_necessary_"+i),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_YN"},data.rows[i].IS_NECESSARY);
				}	
				
			}
			if(view=="view")
				getCurrentPageObj().find("input,select,textarea").not("[name='closePageTabConfirm']").attr("disabled","disabled");

			initVlidate($("#outputData_from"));
		},
		columns : [ {
			field : 'Number',
			title : '序号',
			align : "center",
			sortable: true,
			width : "100",
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
			width : "100",
			align : "center",
			formatter:function(value, row, index) {
				var edit="<span class='hover-view'"+
				//'onclick="delSendProTask('+row.DATA_ID+','');">删除</span>';
				//"onclick='delSendProTask(\""+row.DATA_ID+"\",\""+row.id+"\");'>删除</span>";
				"onclick='delOutputData(\""+row.DATA_ID+"\");'>删除</span>";
				 return edit; 
			}
		}]
	});
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
			
			initSelect(currTab.find("#data_type"+v_+k),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"I_DIC_INTER_DATA_TYPE"},sendData[k].DATA_TYPE);
			initSelect(currTab.find("#is_necessary"+v_+k),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_YN"},sendData[k].IS_NECESSARY);
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



//组装查询url 
function getChangeUrl(INTER_ID,INTER_VERSION){
	var url = dev_application+'IAnalyse/queryInterChageInfo.asp?call=attr&SID='+SID+'&APP_ID=0&INTER_ID='+INTER_ID+'&INTER_VERSION='+INTER_VERSION;
	getCurrentPageObj().find('#changeAttrTable').bootstrapTable('refresh',{url:url});
	
	var outurl = dev_application+'IAnalyse/queryContentList.asp?call=output&SID='+SID+'&INTER_ID='+INTER_ID+'&INTER_VERSION='+INTER_VERSION;
	getCurrentPageObj().find('#OutputContentTable').bootstrapTable('refresh',{url:outurl});
	var inturl = dev_application+'IAnalyse/queryContentList.asp?call=input&SID='+SID+'&INTER_ID='+INTER_ID+'&INTER_VERSION='+INTER_VERSION;
	getCurrentPageObj().find('#InputContentTable').bootstrapTable('refresh',{url:inturl});
}

//添加报文信息
function addContent(tableId,vlidateId,v_,row){
	//添加报文输出信息
	var currTab = getCurrentPageObj();
		var sendData = currTab.find("#"+tableId).bootstrapTable('getData');
		var item = {};
		if(row!=undefined&&row!=""&&row!="undefined") {
			item = row;
			//item['DATA_TYPE'] = "";
			item['IS_NECESSARY'] = "";
		}else{
			item['DATA_ID'] = getMillisecond();
			item['DATA_CHNNAME'] = "";
			item['DATA_ENGNAME'] = "";
			item['DATA_ENGNAMEA'] = "";
			item['DATA_ENGNAMEB'] = "";
			item['DATA_TYPE'] = "";
			item['MSG_LENGTH'] = "";
			item['IS_NECESSARY'] = "";
			item['STANDARD_CODE'] = "";
			item['DATA_INSTRUCTION'] = "";
			item['INFO_REMARK'] = "";
		}
		var i = v_+sendData.length;
//		var flag=true;
		$.each(sendData, function(j) {
//			if(item.DATA_CHNNAME==currTab.find("#data_chnname"+v_+j).val()){
//				flag=false;
//				return;
//			}
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
//		if(!flag){
//			alert("不能添加重复的英文字段名");
//			return;
//		}
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


function getChangeAppData(status_type){
	var result = new Object();
	var currTab = getCurrentPageObj();
	var inputData_from = currTab.find("#inputData_from");
	var outputData_from = currTab.find("#outputData_from");
	var param = getPageParam("IU");
	param['app_status']=status_type;
	//
	var sendTaskData = currTab.find("#InputContentTable").bootstrapTable('getData');
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
	
	var sendOutputData = currTab.find("#OutputContentTable").bootstrapTable('getData');
	if(sendOutputData.length>0){
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
	//接口变更
	var changeAttrData = currTab.find("#changeAttrTable").bootstrapTable('getData');
	var changeAttrList = new Array();
	$.each(changeAttrData, function(i) {
		var obj = new Object();
		var ATTR_VALUE="";
		if(changeAttrData[i].ATTR_TYPE=='03'){
			ATTR_VALUE =$('input[name="chang_value'+i+'"]').filter(':checked').val();

		}
		else{
		 ATTR_VALUE =currTab.find("#chang_value"+i).val();
		}
		var alls = "";
		if(changeAttrData[i].ATTR_TYPE=='02'){
			getCurrentPageObj().find("#chang_value"+i+" option:selected").each(function() {
	        	var text= $(this).attr("value");
	        	text = text.replace(/(^\s*)|(\s*$)/g, "");
	        	if(text !== '' && typeof(text) !== undefined && text !== null){
	        		if(alls == ""){
	        			alls = text;
	        		}else{
	        			alls += ","+text;
	        		}
	        	}
	        });
			ATTR_VALUE = alls;
		}
		
		 
		obj.ATTR_VALUE = ATTR_VALUE;
		obj.ATTR_ID = changeAttrData[i].ATTR_ID;
		if(changeAttrData[i].ATTR_ID!=""&&changeAttrData[i].ATTR_ID!="undefined"&&changeAttrData[i].ATTR_ID!=undefined)
			changeAttrList.push(obj);
	});

	param["changeAttrData"] = JSON.stringify(changeAttrList);
	param["file_id"] = currTab.find("#file_id").val();
	result.result = true;
	result.param = param;
	return result;
	
}

function hideVlidateTagContent(){
	$(".tag-content").on("click",function(){
		$(this).siblings("input:visible").click();
		$(this).siblings("input:visible").focus();
		/*$(this).siblings("select:visible").select2("open"); */
		$(this).remove();
	});
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

















