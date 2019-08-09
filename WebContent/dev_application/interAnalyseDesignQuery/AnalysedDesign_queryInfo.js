//页面返回按钮
getCurrentPageObj().find("#GoBackESBAnalysedList").click(function(){
	closeCurrPageTab();
});
//加载页面表单数据
function initAnalyDesignDetail(item,view){
	var currTab = getCurrentPageObj();
	initVlidate(getCurrentPageObj().find("#changeVlidate"));
	initVlidate(getCurrentPageObj().find("#affectVlidate"));
	for (var key in item) {
		currTab.find("#"+key).html(item[key]);
		currTab.find("input[name^='I."+key+"']").val(item[key]);
		//currTab.find("select[name^=I."+key+"]").val(item[key]);
		//currTab.find("textarea[name^=I."+key+"]").val(item[key]);
		if(key == 'ESB_ACCEPT_REMARK'){
			currTab.find("#esb_accept_remark").text(item[key]);
		}
	}
	if(item.APP_TYPE=='02'){
		//currTab.find("#change_accept").show();
		currTab.find("#appInfoTable").find('tr:eq(3)').find('td:eq(2)').hide();
		currTab.find("#appInfoTable").find('tr:eq(3)').find('td:eq(3)').hide();
		currTab.find("#appInfoTable").find('tr:eq(3)').find('td:eq(4)').show();
		currTab.find("#appInfoTable").find('tr:eq(9)').find('td:eq(0)').show();
		currTab.find("#appInfoTable").find('tr:eq(9)').find('td:eq(1)').show();
	}else{
		currTab.find("#change_info_tab").hide();
	}

	
	initESBUseAnalysedInfo(item["APP_ID"],item["INTER_ID"],item["INTER_VERSION"],item.APP_TYPE,view);
	//autoInitRadio("dic_code=G_DIC_ACCEPT_CONCLUSION",getCurrentPageObj().find("#accept_result"),"I.ESB_ACCEPT_RESULT",{labClass:"labelRadio",type:"update",value:item.ESB_ACCEPT_RESULT});
	
	
	//添加影响分析应用
	currTab.find("#addAffectAnalyse").click(function(){
		openAffSystemPop("popAffect",{sysno:getCurrentPageObj().find("#system_id"),sysname:getCurrentPageObj().find("#system_name")});
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

		if(result.result == true){
			var call = getMillisecond();
			var url = dev_application+'IAnalyse/submitAnalyse.asp?call='+call+'&SID='+SID;
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
	});
		
	//初始化文件列表
	var tablefile = getCurrentPageObj().find("#filetable");
	getFtpFileList(tablefile, getCurrentPageObj().find("#add_fileview_modal"), item["FILE_ID"], "00");
}

function getAnlyData(app_type){
	var result = new Object();
	var currTab = getCurrentPageObj();
	var param = {};
	param = getPageParam("I");
	//接口分析
	var sendData = currTab.find("#AffectAnalyseTable").bootstrapTable('getData');
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
		obj.TASK_REMARK = currTab.find("#task_remark"+i).val();
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
			width : "20%"
		},{
			field : "INFO_REMARK",
			title : "备注",
			align : "center",
			width : "20%"
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
			width : "20%"
		},{
			field : "INFO_REMARK",
			title : "备注",
			align : "center",
			width : "20%"
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
		//pagination : true, //是否显示分页（*）
		//pageList : [100,200],//每页的记录行数（*）
		//pageNumber : 1, //初始化加载第一页，默认第一页
		//pageSize : 100,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "apply_id", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		clickToSelect : false, //是否启用点击选中行
		jsonpCallback:queryChange_call,
		detailView : false, //是否显示父子表
		singleSelect: true,
		onLoadSuccess:function(data){
				gaveInfo();
			AnalyseDesignInitTable(getCurrentPageObj().find("#changeAttrTable"));
		},
		columns : [{
			field : "ATTR_NAME",
			title : "属性名",
			align : "center",
			width: "33.3333%"
		}, {
			field : "OLD_ATTR_VALUE_NAME",
			title : "变更前",
			align : "center",
				width: "33.3333%"
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
	
	/*var queryEffectParams=function(params){
		var temp={
			limit: params.limit, //页面大小
			offset: params.offset//页码
		};
		return temp;
	};*/
	var queryEffect_call = getMillisecond()+'effect';
	getCurrentPageObj().find("#AffectAnalyseTable").bootstrapTable({
		//请求后台的URL（*）
		url :dev_application+'IAnalyse/queryInterEffectInfo.asp?call='+queryEffect_call+'&SID='+SID+'&APP_ID='+APP_ID,
		method : 'get', //请求方式（*）   
		striped : true, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : null,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
//		pagination : true, //是否显示分页（*）
//		pageList : [100,200],//每页的记录行数（*）
//		pageNumber : 1, //初始化加载第一页，默认第一页
//		pageSize : 100,//可供选择的每页的行数（*）
	clickToSelect : true, //是否启用点击选中行
		uniqueId : "RELE_SYSTEM_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		jsonpCallback:queryEffect_call,
		detailView : false, //是否显示父子表
		singleSelect: true,
		onLoadSuccess:function(data){
			gaveInfo();	
			AnalyseDesignInitTable(getCurrentPageObj().find("#AffectAnalyseTable"));
			fileData = getInterFileList();
			initFileUploadAction(fileData);
			/*if(data.rows) {
				for(var i=0; i<data.rows.length; i++) {
					//initSelect(,{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_YN"},'00');
					 AnalyseDesignInitDIC(currTab.find("#is_effect"+i),"S_DIC_YN",currTab.find("#is_effect"+i).attr("value"));
				}						
			}*/
			
		},
		columns : [ {
			field : 'Number',
			title : '序号',
			align : "center",
			width : "70px",
			sortable: true,
			formatter: function (value, row, index) {
				return index+1;
			}
		},{
			field : "SYSTEM_NAME",
			title : "关联应用",
			align : "center"
		}, {
			field : "RELE_TYPE_NAME",
			title : "类型",
			align : "center"
		}, {
			field : "IS_EFFECT",
			title : "是否影响",
			align : "center",
			width: 110,
			formatter:function(value, row, index) {
				//row.RELE_TYPE=='00'||row.RELE_TYPE=='01'
				var str = '<div id="is_effect'+index+
						  '" diccode="S_DIC_YN" value="'+row.IS_EFFECT+'"></div>';
				return str;
			}
		}, {
			field : "EFFECT_ANALYSE",
			title : "关联性影响分析",
			align : "center",
			/*formatter:function(value, row, index) {
				var str = '<div id="effect_analyse'+index+'" diccode="S_DIC_YN" value="'+row.ANALYSE_ID+'"></div>';
				return str;
			}*/
		}, {
			field : "explain",
			title : "接口调用说明",
			align : "center",
			formatter:function(value, row, index){
				var str = "<div name='file_info_div' style='margin: 0 auto 10px 0' bid='"+row.FILE_ID+"' index='"+index+"'>";
				str += "<a name='inter_use_file_detail' style='margin-left:10px;display:none;'>查看</a>" +
				"<a name='inter_use_file_download' style='margin-left:10px;display:none;'>下载</a>";
				str +="<div/>";
				return str;
			}
		}, {
			field : "DATA_ID",
			title : "操作",
			align : "center",
			width : "60px",
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
		}]
	});
	
	var fileData = null;
	var file_view_div = getCurrentPageObj().find("#add_fileview_modal");
	function initFileUploadAction(){
		var $details = getCurrentPageObj().find("#AffectAnalyseTable").find("a[name=inter_use_file_detail]");
		var $downloads = getCurrentPageObj().find("#AffectAnalyseTable").find("a[name=inter_use_file_download]");
		
		//初始化查看按钮
		$details.unbind('click').click(function(){
			var $div = $(this).parent();
			var file_id = $div.attr("file_id");
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
					var $div = getCurrentPageObj().find("#AffectAnalyseTable").find("div[bid="+file["BUSINESS_CODE"]+"]");
					$div.attr("file_id", file.ID);
					if(typeof(file["BUSINESS_CODE"])!="undefined"){
						$div.find("a[name=inter_use_file_detail]").show();
						$div.find("a[name=inter_use_file_download]").show();
					}
				}
			}
			return fileData;
		}
		return null;
	}
	
	/*var querySplitParams=function(params){
		var temp={
			limit: params.limit, //页面大小
			offset: params.offset//页码
		};
		return temp;
	};*/
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
		     	queryParams : null,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
//				pagination : true, //是否显示分页（*）
//				pageList : [100,200],//每页的记录行数（*）
//				pageNumber : 1, //初始化加载第一页，默认第一页
//				pageSize : 100,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "SYSTEM_ID", //每一行的唯一标识，一般为主键列
				jsonpCallback:querySplit_call,
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: true,
				onLoadSuccess : function(data){
					gaveInfo();
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
					/*formatter:function(value, row, index) {
						var str = '<input type="text" id="task_remark'+index+'" val="'+value+'" validate="v.required" valititle="该项为必填项">';
						return str;
					},*/
					
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
				}
				
				]
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
		initSelect(currTab.find("#is_effect"+i),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_YN"});
		
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

//根据DIC_CODE和Item_code初始化bootstraprable的值
function AnalyseDesignInitTable(tableObj) {
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

