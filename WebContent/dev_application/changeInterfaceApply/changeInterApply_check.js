var interAppCall = getMillisecond();//table回调方法名
//初始化事件
function initChangeAppLayOut(item,view){
	var $page = getCurrentPageObj();//当前页
	var qRecord_app_num = "";
	if(item){//初始化申请信息
		initAppInfo(item);
		qRecord_app_num = item.RECORD_APP_NUM;
		initApplyChangeInfo(item.APP_ID,item.INTER_ID,item.INTER_VERSION,view);
	}else{		
		initApplyChangeInfo("0");
	}
	//初始化按钮事件
	initButtonEvent();
	initVlidate($("#appChangeInfo"));
	//点击打开模态框
	var tablefile = $page.find("#filetable");
	var business_code = item.FILE_ID;
	if(typeof(business_code)!="undefined"){
		getFtpFileList(tablefile, $page.find("#add_fileview_modal"), business_code, "00");
	}
	/***************初始化变更接口属性******************/
	//输入内容选择新增按钮
	$page.find("#input_selectData").click(function(){
		var inforMaintence_pop = getCurrentPageObj().find("[mod='seleInterPop']");
		changeInforMaintenace_seleDataPop(inforMaintence_pop,"InputContentTable","00","inputData_from");
	});
	//输入内容选择新增按钮
	$page.find("#out_selectData").click(function(){
		var inforMaintence_pop = getCurrentPageObj().find("[mod='seleInterPop']");
		changeInforMaintenace_seleDataPop(inforMaintence_pop,"OutputContentTable","01","outputData_from");
	});

/****************************以下内部方法**********************************/	
	//初始化申请信息
	function initAppInfo(item){
		for(var k in item){
			k1 = k.toLowerCase();
			$page.find("[name='IU."+ k1 +"']").text(item[k]);
		}
		/*
		 * 不可修改，防止修改的时候切换了服务方应用并选了切换后的服务方的现有接口，但是最后却没有保存，
		 * 造成申请单选的服务方应用与所申请的现有接口的服务方应用不对应(申请单信息与子表接口申请不同步保存，
		 * 	要同步保存改造太大，目前先这样，后续需要再改造)
		 */
	}
	
	//按钮事件
	function initButtonEvent(){
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
			param.inter_status = $page.find("#inter_status");
			param.inter_version = $page.find("#inter_version");
			param.inter_office_type = $page.find("#inter_office_type");
			useInterfaceApply_seleInterPop($seleInterPop, param);
			$page.find("[name='IU.ser_system_name']").attr("disabled", "disabled");
		 });
	};
	
				var queryParams=function(params){
					var temp={
						limit: params.limit, //页面大小
						offset: params.offset //页码
					};
					return temp;
				};

				var callChange = getMillisecond();
				getCurrentPageObj().find("#ChangeViewHistoryTable").bootstrapTable('destroy').bootstrapTable({
				//请求后台的URL（*）
				url :dev_application+'serUseInterAccept/querySerOperationHistory.asp?SID='+SID+'&call='+callChange +'&RECORD_APP_NUM='+qRecord_app_num,
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
				jsonpCallback : callChange ,
				singleSelect: true,
				onLoadSuccess : function(data){
					gaveInfo();
				},
				columns : [{
					field : 'OPT_USER',
					title : '操作人',
					align : "center"
				}, {
					field : 'OPT_ACTION',
					title : '操作',
					align : "center"
				},{
					field : 'OPT_RESULT_NAME',
					title : '结论',
					align : "center"
				},{
					field : "OPT_REMARK",
					title : "相关说明",
					align : "center"
				},{
					field : "OPT_TIME",
					title : "操作时间",
					align : "center"
				}
				
				]
			});
}
//保存按钮
//$page.find("#submitAppInfo").click(function(){
//function changeAppSubmit(status_type){
//	$('#changeInterAll li:eq(2) a').tab('show');
//	if(!vlidate(getCurrentPageObj().find("#inputData_from"))||!vlidate(getCurrentPageObj().find("#outputData_from"))){
//		alert("请填写相关必填项");
//		return ;
//	}
//	$('#changeInterAll li:eq(1) a').tab('show');
//	if(!vlidate(getCurrentPageObj().find("#changeVlidate"))){
//		alert("请填写相关必填项");
//		return ;
//	}
//	$('#changeInterAll li:eq(0) a').tab('show');
//	if(!vlidate(getCurrentPageObj().find("#appChangeInfo"))){
//		alert("请填写相关必填项");
//		return ;
//	}
//	var tablelength =getCurrentPageObj().find("#InputContentTable").bootstrapTable('getData');
//      if (tablelength.length <=0) {
//  alert('请添加输入报文信息');
//  return ;}
//     var tablelength1 =getCurrentPageObj().find("#OutputContentTable").bootstrapTable('getData');
//    if (tablelength1.length <=0 ) {
//       alert('请添加输出报文信息');
//      return ;}
//	var spCall = getMillisecond();
//	var result = getChangeAppData(status_type);
//	if(result.result == true){
//		var call = getMillisecond();
//		var url = dev_application+'InterchangeApp/submitChangeApply.asp?call='+call+'&SID='+SID;
//		baseAjaxJsonp(url, result.param, function(data){
//			if (data != undefined&&data!=null&&data.result=="true") {
//				alert("保存成功！",function(){
//					closeCurrPageTab();
//				});
//			} else {
//				alert("保存失败！");
//			}
//		}, call);
//	}
//}
////删除接口申请信息
//function useInterfaceApply_delInterApp(index){
//	var record_app_num = getCurrentPageObj().find("[name='IU.record_app_num']").val();
//	params = getCurrentPageObj().find('[tb="appListTable"]').bootstrapTable("getData")[index];
//	var dCall = getMillisecond();
//	baseAjaxJsonp(dev_application+"useApplyManage/delInterApp.asp?SID="
//			+ SID + "&call=" + dCall,
//			{inter_id : params.INTER_ID,
//			app_id : params.APP_ID,
//			app_type : params.APP_TYPE}, function(data) {
//		if(data && data.result=="true"){
//			getCurrentPageObj().find('[tb="appListTable"]').bootstrapTable('refresh',{
//				url:dev_application+"useApplyManage/queryInterAppListById.asp?SID=" + SID + "&call=" + interAppCall + "&record_app_num=" + record_app_num});
//		}
//	},dCall,false);
//	
//}
//跳转查看现有接口360
function useInterfaceApply_viewDetail(inter_id,modObj){
	if(modObj){//需要关闭模态框时
		getCurrentPageObj().find("#"+modObj).modal("hide");//模态框关闭，关闭遮罩层
	}
	closeAndOpenInnerPageTab("queryInterInfo360","查看接口信息360","dev_application/interfaceInfo/interfaceinfo_360mesbasic.html", function(){
		 
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
			gaveInfo();	
			//初始化字典项
			ApplyCheckAutoInitSelect(getCurrentPageObj().find("#changeAttrTable"));
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
			width : "33.3333%"
			
		}, {
			field : 'CHANG_VALUE',
			title : '变更后',
			align : "center",
			width : "33.3333%",
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
	
	
	
	//var currTab = getCurrentPageObj();
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
			gaveInfo();	
			//初始化字典项
			if(data.rows) {
				for(var i=0; i<data.rows.length; i++) {
					ApplyCheckInitTablebyCode(getCurrentPageObj().find("#data_type"+i),"I_DIC_INTER_DATA_TYPE",data.rows[i].DATA_TYPE);
					ApplyCheckInitTablebyCode(getCurrentPageObj().find("#is_necessary"+i),"S_DIC_YN",data.rows[i].IS_NECESSARY);
					
				}			
			}
			
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
			field : 'DATA_TYPE',
			title : '类型',
			align : "center",
			width : "12%",
			formatter:function(value, row, index) {
				var str = '<div id=data_type'+index+'></div>';
				return str;
			}
		}, {
			field : "MSG_LENGTH",
			title : "长度",
			align : "center",
			width : "8%"
		},{
			field : "IS_NECESSARY",
			title : "是否必输",
			align : "center",
			width : "8%",
			formatter:function(value, row, index) {
				var str = '<div id=is_necessary'+index+'></div>';
				return str;
			}
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
			gaveInfo();	
			//初始化字典项
			if(data.rows) {
				
				for(var i=0; i<data.rows.length; i++) {
					ApplyCheckInitTablebyCode(getCurrentPageObj().find("#data_type_out"+i),"I_DIC_INTER_DATA_TYPE",data.rows[i].DATA_TYPE);
					ApplyCheckInitTablebyCode(getCurrentPageObj().find("#is_necessary_out"+i),"S_DIC_YN",data.rows[i].IS_NECESSARY);
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
			field : 'DATA_TYPE',
			title : '类型',
			align : "center",
			width : "12%",
			formatter:function(value, row, index) {
				var str = '<div id=data_type_out'+index+'></div>';
				return str;
			}
		}, {
			field : "MSG_LENGTH",
			title : "长度",
			align : "center",
			width : "8%"
		},{
			field : "IS_NECESSARY",
			title : "是否必输",
			align : "center",
			width : "8%",
			formatter:function(value, row, index) {
				var str = '<div id=is_necessary_out'+index+'></div>';
				return str;
			}
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
};


//删除一行
//function delOutputData(data_id){
//	deleteData('OutputContentTable','outputData_from','_',data_id);
//}
//function delInputData(data_id){
//	 deleteData('InputContentTable','inputData_from','',data_id);
//}
//function deleteData(tableId,vlidateId,v_,data_id){
//	
//	//添加报文输出信息
//	var currTab = getCurrentPageObj();
//		var sendData = currTab.find("#"+tableId).bootstrapTable('getData');
//		var i = v_+sendData.length;
//		$.each(sendData, function(j) {
//			sendData[j].DATA_TYPE = currTab.find("#data_type"+v_+j).val();
//			sendData[j].IS_NECESSARY = currTab.find("#is_necessary"+v_+j).val();
//			sendData[j].DATA_CHNNAME = currTab.find("#data_chnname"+v_+j).val();
//			sendData[j].DATA_ENGNAME = currTab.find("#data_engname"+v_+j).val();
//			sendData[j].MSG_LENGTH = currTab.find("#msg_length"+v_+j).val();
//			sendData[j].STANDARD_CODE = currTab.find("#standard_code"+v_+j).val();
//			sendData[j].DATA_INSTRUCTION = currTab.find("#data_instruction"+v_+j).val();
//			sendData[j].INFO_REMARK = currTab.find("#info_remark"+v_+j).val();
//		});
//		
//		getCurrentPageObj().find("#"+tableId).bootstrapTable("removeByUniqueId", data_id);	
//		
//		
//		//旧的行，把原来的放进去
//		for(var k=0; k<sendData.length; k++) {
//			
//			initSelect(currTab.find("#data_type"+v_+k),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"I_DIC_INTER_DATA_TYPE"},sendData[k].DATA_TYPE);
//			initSelect(currTab.find("#is_necessary"+v_+k),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_YN"},sendData[k].IS_NECESSARY);
//			currTab.find("#data_type"+v_+k).val(sendData[k].DATA_TYPE);
//			currTab.find("#is_necessary"+v_+k).val(sendData[k].IS_NECESSARY);
//			currTab.find("#data_chnname"+v_+k).val(sendData[k].DATA_CHNNAME);
//			currTab.find("#data_engname"+v_+k).val(sendData[k].DATA_ENGNAME);
//			currTab.find("#msg_length"+v_+k).val(sendData[k].MSG_LENGTH);
//			currTab.find("#standard_code"+v_+k).val(sendData[k].STANDARD_CODE);
//			currTab.find("#data_instruction"+v_+k).val(sendData[k].DATA_INSTRUCTION);
//			currTab.find("#info_remark"+v_+k).val(sendData[k].INFO_REMARK);
//		}
//		initVlidate($("#"+vlidateId));
//	
//}



//组装查询url 
function getChangeUrl(INTER_ID,INTER_VERSION){
	var url = dev_application+'IAnalyse/queryInterChageInfo.asp?call=attr&SID='+SID+'&APP_ID=0&INTER_ID='+INTER_ID+'&INTER_VERSION='+INTER_VERSION;
	getCurrentPageObj().find('#changeAttrTable').bootstrapTable('refresh',{url:url});
	
	var outurl = dev_application+'IAnalyse/queryContentList.asp?call=output&SID='+SID+'&INTER_ID='+INTER_ID+'&INTER_VERSION='+INTER_VERSION;
	getCurrentPageObj().find('#OutputContentTable').bootstrapTable('refresh',{url:outurl});
	var inturl = dev_application+'IAnalyse/queryContentList.asp?call=input&SID='+SID+'&INTER_ID='+INTER_ID+'&INTER_VERSION='+INTER_VERSION;
	getCurrentPageObj().find('#InputContentTable').bootstrapTable('refresh',{url:inturl});
}

////添加报文信息
//function addContent(tableId,vlidateId,v_,row){
//	//添加报文输出信息
//	var currTab = getCurrentPageObj();
//		var sendData = currTab.find("#"+tableId).bootstrapTable('getData');
//		var item = {};
//		if(row!=undefined&&row!=""&&row!="undefined") {
//			item = row;
//			item['DATA_TYPE'] = "";
//			item['IS_NECESSARY'] = "";
//		}else{
//			item['DATA_ID'] = getMillisecond();
//			item['DATA_CHNNAME'] = "";
//			item['DATA_ENGNAME'] = "";
//			item['DATA_TYPE'] = "";
//			item['MSG_LENGTH'] = "";
//			item['IS_NECESSARY'] = "";
//			item['STANDARD_CODE'] = "";
//			item['DATA_INSTRUCTION'] = "";
//			item['INFO_REMARK'] = "";
//		}
//		var i = v_+sendData.length;
//		var flag=true;
//		$.each(sendData, function(j) {
//			if(item.DATA_CHNNAME==currTab.find("#data_chnname"+v_+j).val()){
//				flag=false;
//				return;
//			}
//			sendData[j].DATA_TYPE = currTab.find("#data_type"+v_+j).val();
//			sendData[j].IS_NECESSARY = currTab.find("#is_necessary"+v_+j).val();
//			sendData[j].DATA_CHNNAME = currTab.find("#data_chnname"+v_+j).val();
//			sendData[j].DATA_ENGNAME = currTab.find("#data_engname"+v_+j).val();
//			sendData[j].MSG_LENGTH = currTab.find("#msg_length"+v_+j).val();
//			sendData[j].STANDARD_CODE = currTab.find("#standard_code"+v_+j).val();
//			sendData[j].DATA_INSTRUCTION = currTab.find("#data_instruction"+v_+j).val();
//			sendData[j].INFO_REMARK = currTab.find("#info_remark"+v_+j).val();
//		});
//		if(!flag){
//			alert("不能添加重复的英文字段名");
//			return;
//		}
//		currTab.find("#"+tableId).bootstrapTable("append",item);
//		initSelect(currTab.find("#data_type"+i),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"I_DIC_INTER_DATA_TYPE"});
//		initSelect(currTab.find("#is_necessary"+i),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_YN"});
//
//		
//		//旧的行，把原来的放进去
//		for(var k=0; k<sendData.length; k++) {
//			
//			initSelect(currTab.find("#data_type"+v_+k),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"I_DIC_INTER_DATA_TYPE"},sendData[k].DATA_TYPE);
//			initSelect(currTab.find("#is_necessary"+v_+k),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_YN"},sendData[k].IS_NECESSARY);
//			currTab.find("#data_type"+v_+k).val(sendData[k].DATA_TYPE);
//			currTab.find("#is_necessary"+v_+k).val(sendData[k].IS_NECESSARY);
//			currTab.find("#data_chnname"+v_+k).val(sendData[k].DATA_CHNNAME);
//			currTab.find("#data_engname"+v_+k).val(sendData[k].DATA_ENGNAME);
//			currTab.find("#msg_length"+v_+k).val(sendData[k].MSG_LENGTH);
//			currTab.find("#standard_code"+v_+k).val(sendData[k].STANDARD_CODE);
//			currTab.find("#data_instruction"+v_+k).val(sendData[k].DATA_INSTRUCTION);
//			currTab.find("#info_remark"+v_+k).val(sendData[k].INFO_REMARK);
//		}
//		initVlidate($("#"+vlidateId));
//	
//}


//function getChangeAppData(status_type){
//	var result = new Object();
//	var currTab = getCurrentPageObj();
//	var param = getPageParam("IU");
//	param['app_status']=status_type;
//	//任务拆分
//	var sendTaskData = currTab.find("#InputContentTable").bootstrapTable('getData');
//	$.each(sendTaskData, function(j) {
//		sendTaskData[j].DATA_TYPE = currTab.find("#data_type"+j).val();
//		sendTaskData[j].IS_NECESSARY = currTab.find("#is_necessary"+j).val();
//		sendTaskData[j].DATA_CHNNAME = currTab.find("#data_chnname"+j).val();
//		sendTaskData[j].DATA_ENGNAME = currTab.find("#data_engname"+j).val();
//		sendTaskData[j].MSG_LENGTH = currTab.find("#msg_length"+j).val();
//		sendTaskData[j].STANDARD_CODE = currTab.find("#standard_code"+j).val();
//		sendTaskData[j].DATA_INSTRUCTION = currTab.find("#data_instruction"+j).val();
//		sendTaskData[j].INFO_REMARK = currTab.find("#info_remark"+j).val();
//	});
//	param["InputContentData"] = JSON.stringify(sendTaskData);
//	
//	var sendOutputData = currTab.find("#OutputContentTable").bootstrapTable('getData');
//	$.each(sendOutputData, function(j) {
//		sendOutputData[j].DATA_TYPE = currTab.find("#data_type_"+j).val();
//		sendOutputData[j].IS_NECESSARY = currTab.find("#is_necessary_"+j).val();
//		sendOutputData[j].DATA_CHNNAME = currTab.find("#data_chnname_"+j).val();
//		sendOutputData[j].DATA_ENGNAME = currTab.find("#data_engname_"+j).val();
//		sendOutputData[j].MSG_LENGTH = currTab.find("#msg_length_"+j).val();
//		sendOutputData[j].STANDARD_CODE = currTab.find("#standard_code_"+j).val();
//		sendOutputData[j].DATA_INSTRUCTION = currTab.find("#data_instruction_"+j).val();
//		sendOutputData[j].INFO_REMARK = currTab.find("#info_remark_"+j).val();
//	});
//	param["OutputContentData"] = JSON.stringify(sendOutputData);
//	
//	//接口变更
//	var changeAttrData = currTab.find("#changeAttrTable").bootstrapTable('getData');
//	var changeAttrList = new Array();
//	$.each(changeAttrData, function(i) {
//		var obj = new Object();
//		var ATTR_VALUE = currTab.find("#chang_value"+i).val();
//		var all = "";
//		if(changeAttrData[i].ATTR_TYPE=='02'){
//			getCurrentPageObj().find("#chang_value"+i+" option:selected").each(function() {
//	        	var text= $(this).attr("value");
//	        	text = text.replace(/(^\s*)|(\s*$)/g, "");
//	        	if(text !== '' && typeof(text) !== undefined && text !== null){
//	        		if(all == ""){
//	        			all = text;
//	        		}else{
//	        			all += ","+text;
//	        		}
//	        	}
//	        });
//			ATTR_VALUE = all;
//		}
//		obj.ATTR_VALUE = ATTR_VALUE;
//		obj.ATTR_ID = changeAttrData[i].ATTR_ID;
//		if(changeAttrData[i].ATTR_ID!=""&&changeAttrData[i].ATTR_ID!="undefined"&&changeAttrData[i].ATTR_ID!=undefined)
//			changeAttrList.push(obj);
//	});
//
//	param["changeAttrData"] = JSON.stringify(changeAttrList);
//	result.result = true;
//	result.param = param;
//	return result;
//}

//初始化div内容根据DIC_CODE和Item_code
function ApplyCheckAutoInitSelect(tableObj) {
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
function ApplyCheckInitTablebyCode(Obj,Code,Value) {
	// 初始化下拉选d
			if (Code!= "" &&Code != undefined) {
				baseAjax("SDic/findItemByDic.asp", { dic_code : Code }, function(data) {
					if (data != undefined) {
						var strs = new Array(); // 定义一数组
						strs = Value.split(","); // 字符分割
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
							Obj.text(str);
						}
					
				},false);
			}//if
}




