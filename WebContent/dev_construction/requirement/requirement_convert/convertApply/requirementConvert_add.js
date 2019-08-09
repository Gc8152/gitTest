function initConvertAdd(isCreateNumber){
	var currTab = getCurrentPageObj();
	initVlidate(currTab);
	initContentTask();//初始化任务表头
	if(isCreateNumber){
		returnSerialNumber("CONVERT_NO","YB", "G_REQUIREMENT_CONVERTID");//生成变更编号
	}
	initVersionInfo();
	//保存并提交
	var submit = currTab.find("#submitConvert");
	submit.click(function(){
		if(!vlidate(currTab,"",true)){
			alert("你还有必填项未填");
			return ;
		}
		initsave("02");
	});
	function initsave(isCommit){
		var param = {};
		var selectInfo = currTab.find("#table_basicInfo");
		var inputs = selectInfo.find("input");
		var textareas = selectInfo.find("textarea");
		for (var i = 0; i < inputs.length; i++) {
			var obj = $(inputs[i]);
			param[obj.attr("name")] = $.trim(obj.val());
		}
		for (var k = 0; k < textareas.length; k++) {
			var obj2 = $(textareas[k]);
			param[obj2.attr("name")] = $.trim(obj2.val());
		}
		var sendData = getCurrentPageObj().find("#ConvertAddTaskTable").bootstrapTable('getData');
		if(sendData.length == 0) {
			alert("没有要转紧急的任务！");
			return;
		}
	    var version_peoblem=getCurrentPageObj().find("[name='CONVERT_DESC']").val();
	    if(version_peoblem.length>250){
	    	alert("变更影响及原因至多可输入250汉字！");
	    	return;
	    }
		for(var j=0;j<sendData.length;j++){
			var row = sendData[j];
			var check_result = row.CHECK_RESULT;
			if(check_result != "yes"){
				alert("该需求点下存在已提交投产的任务,不能发起变更!");
				return;
			}
		}
		var taskIds="";var version_ids="";var task_states="";
		taskInfo=$.map(sendData, function (row) {
			if(taskIds==""){
				taskIds = row.REQ_TASK_ID;
				version_ids = row.VERSION_ID;
				task_states = row.REQ_TASK_STATE;
			}else{
				taskIds = taskIds+","+row.REQ_TASK_ID;
				version_ids = version_ids+","+row.VERSION_ID;
				task_states = task_states+","+row.REQ_TASK_STATE;
			}
			return row.REQ_TASK_ID;
		});
		param["REQ_TASK_IDS"] = taskIds;
		param["VERSION_IDS"] = version_ids;
		param["REQ_TASK_STATES"] = task_states;
		param["STATUS"]=isCommit;
		param["IS_INSERT"]=getCurrentPageObj().find("#IS_INSERT").val();
		var item = {};
		item["af_id"] = '121';//流程id
		item["systemFlag"] = '03'; //systemFlag：系统标识（合同系统：00，项目系统：01，报销系统：02，工程管理：03）
		item["biz_id"] = param["CONVERT_NO"];//业务id
		item["r_project_group"] = getCurrentPageObj().find("#RES_GROUP_ID").val();//应用对应的负责组id
		item["r_project_manager"] = "101";//总行的项目管理组组长
		approvalProcess(item,function(data){
			var insertCall = getMillisecond()+'1';
		    baseAjaxJsonp(dev_construction+"ReqConvert/insertReqConvert.asp?SID="+SID+"&call="+insertCall,param, function(data){
			  if (data != undefined && data != null && data.result=="true") {
				  alert(data.msg);
				  closeCurrPageTab();
			  } else {
				  alert(data.msg);
			  }
		    }, insertCall,false);
		  });
	}
	
	/**需求任务模态框开始**/
	var reqcode = currTab.find("input[name=REQ_TASK_NAME]");
	reqcode.unbind("click");
	reqcode.click(function(){
		currTab.find("#req_task_modal").modal("show");
		initTaskPop();
	});
	
	var tableCall = getMillisecond();
	function initTaskPop(){
		var reqInfo = currTab.find("#reqtaskTabInfo");
		//需求查询
		var select = currTab.find("#select_req");
		select.unbind("click");
		select.click(function(){
			var TASK_CODE = currTab.find("input[name=TASK_CODE]").val();
			var TASK_NAME = currTab.find("input[name=TASK_NAME]").val();
			reqInfo.bootstrapTable('refresh',{
				url:dev_construction+'ReqConvert/queryListReqtaskInfo.asp?call='+tableCall+'&SID='+SID
				+'&REQ_TASK_CODE=' + TASK_CODE+'&REQ_TASK_NAME=' + encodeURI(TASK_NAME)});
		});
		enterEventRegister("popModelQueryLevel1", function(){getCurrentPageObj().find("#select_req").click();});
		//需求重置
		var reset = currTab.find("#reset_req");
		reset.click(function(){
			currTab.find("input[name=TASK_CODE]").val("");
			currTab.find("input[name=TASK_NAME]").val("");
		});
		//需求模态框列表
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset //页码
			};
			return temp;
		};	
	
		reqInfo.bootstrapTable({		
			//请求后台的URL（*）
			url:dev_construction+'ReqConvert/queryListReqtaskInfo.asp?call='+tableCall+'&SID='+SID,
			method : 'get', //请求方式（*）   
			striped : false, //是否显示行间隔色
			cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : true, //是否启用排序
			sortOrder : "asc", //排序方式
			queryParams : queryParams,//传递参数（*）
			sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
			pagination : true, //是否显示分页（*）
			pageList : [5,10,15],//每页的记录行数（*）
			pageNumber : 1, //初始化加载第一页，默认第一页
			pageSize : 5,//可供选择的每页的行数（*）
			clickToSelect : true, //是否启用点击选中行
			uniqueId : "REQ_TASK_ID", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			detailView : false, //是否显示父子表
			jsonpCallback:tableCall,
			singleSelect: true,
			onLoadSuccess : function(data){
				gaveInfo();
			},
			onDblClickRow:function(row){
				$('#req_task_modal').modal('hide');
				currTab.find("input[name=REQ_TASK_ID]").val(row.REQ_TASK_ID);
				currTab.find("input[name=REQ_TASK_NAME]").val(row.REQ_TASK_NAME);
				currTab.find("input[name=SYSTEM_ID]").val(row.SYSTEM_NO);
				currTab.find("input[name=SYSTEM_NAME]").val(row.SYSTEM_NAME);
				currTab.find("input[name=RES_GROUP_ID]").val(row.RES_GROUP_ID);//所属应用对应的负责组，用于发起流程选对应的项目组长
				//刷新任务列表
				freshSItTaskContent(row.SUB_REQ_ID,row.REQ_TASK_ID);
			},
			columns : [{
				field : 'REQ_TASK_CODE',
				title : '任务编号',
				width : '150',
				align : "center"
			}, {
				field : "REQ_TASK_NAME",
				title : "任务名称",
				width : '150',
				align : "center"
			}, {
				field : "TASK_STATE_NAME",
				title : "任务状态",
				width : '100',
				align : "center"
			}, {
				field : "SYSTEM_NAME",
				title : "应用名称",
				align : "center"
			}]
		});
	}
	
	/**
	 * 初始化任务列表列表
	 */
	function initContentTask() {
		var initTaskContent_call = "jq_1528699071039";
		var queryParams = function(params){
			var temp = {};
			temp["limit"] = params.limit;
			temp["offset"] = params.offset;
			temp["call"] = initTaskContent_call;
			return temp;
		};
		getCurrentPageObj().find("#ConvertAddTaskTable").bootstrapTable({
			//需求点00为初始为了表头
//				url : dev_construction+'ReqConvert/queryTaskBySubId.asp?&SID='+SID+'&sub_req_id=00',
				method : 'get', //请求方式（*）   
				striped : false, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				pagination : false, //是否显示分页（*）
				pageList : [5,10,15],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 10,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "REQ_TASK_ID", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: true,
				jsonpCallback: "jq_1528699071039",
				onLoadSuccess:function(data){
					gaveInfo();	
				},
				columns : [{
					field : 'REQ_TASK_CODE',
					title : '任务编号',
					align : "center",
					width : "15%",
					formatter: function (value, row, index) {
						return  '<span class="hover-view" style="color:blue"'+
						'onclick="openReqTaskDetail('+row.REQ_TASK_ID+')">'+value+'</span>';
					}
				}, {
					field : 'REQ_TASK_NAME',
					title : '任务名称',
					align : "center",
					width : "18%",
				}, {
					field : "SYSTEM_NAME",
					title : "实施应用",
					align : "center",
					width : "17%"
				},{
					field : "VERSION_NAME",
					title : "纳入版本",
					align : "center",
					width : "17%"
				},{
					field : "REQ_TASK_RELATION_NAME",
					title : "从属关系",
					align : "center",
					width : "11%"
				}, {
					field : "REQ_TASK_STATE_DISPLAY",
					title : "任务状态",
					align : "center",
					width : "11%"
				},{
					field : "P_OWNER_NAME",
					title : "任务责任人",
					align : "center",
					width : "11%"
				}]
			});
	}
	
}
/**
 * 重新选择主线后，刷新列表中的任务
 */
function freshSItTaskContent(sub_req_id,req_task_id) {
	getCurrentPageObj().find("#ConvertAddTaskTable").bootstrapTable("refresh",
			{url:dev_construction+'ReqConvert/queryTaskBySubId.asp?SID='+SID+'&sub_req_id='+sub_req_id});
}
/**
 * 生成变更流水号
 * params pre 前缀
 * params seq 序列名称
 */
function returnSerialNumber(inputid,pre,seq){
	var todayDate = new Date();
    var year = todayDate.getFullYear();
    var month = todayDate.getMonth()+1+'';
    if(month.length==1){
    	month="0"+month;
    }
    var date=todayDate.getDate()+'';
    if(date.length==1){
    	date="0"+date;
    }
    var call = getMillisecond()+'1';
    var url = dev_construction+"sendProduceApply/getSerialNumberSeq.asp?SID="+SID+"&call="+call;
	baseAjaxJsonp(url,{seq:seq}, function(data){
		if (data&&data.result=="true") {
			var code =data.seqCode;
			if(code<=9){
				code='000'+data.seqCode;
			}else if(code>=10&&code<99){
				code='00'+data.seqCode;
			}else if(code>=100&&code<=999){
				code='0'+data.seqCode;
			}
			var codeNum=pre+year+month+'-'+code;
			//把生成的编号写到页面
			getCurrentPageObj().find("#"+inputid).val(codeNum);
		} else {
			alert("流水号获取失败！");
		}
	}, call, false);
}

//获取当前年份的紧急版
function initVersionInfo(){
	var VersionCall = getMillisecond()+'1';
    var url = dev_construction+"ReqConvert/queryVersionInfo.asp?SID="+SID+"&call="+VersionCall;
	baseAjaxJsonp(url,null, function(data){
		if (data&&data.result=="true") {
			getCurrentPageObj().find("#VERSION_NAME").val(data.VERSIONS_NAME);
			getCurrentPageObj().find("#VERSION_ID").val(data.VERSIONS_ID);
		} else {
			alert("获取紧急版本失败！");
		}
	}, VersionCall, false);
}

//打开任务详情页面
function openReqTaskDetail(req_task_id){
	closeAndOpenInnerPageTab("req_taskDetail","任务详情页面","dev_construction/requirement/requirement_analyze/task_accept/task_detail.html",function(){
		initReqTaskDetailLayout(req_task_id);
	});
}

/**
 * 重新发起一般转紧急
 * @param sub_req_id
 * @param req_task_id
 * @param req_task_name
 * @param convert_no
 * @param res_group_id
 * @param system_id
 * @param system_name
 */
function reStartToConvert(param){
	freshSItTaskContent(param["sub_req_id"],param["req_task_id"]);
	getCurrentPageObj().find("#REQ_TASK_NAME").val(param["req_task_name"]||"");
	getCurrentPageObj().find("#REQ_TASK_ID").val(param["req_task_id"]||"");
	getCurrentPageObj().find("#CONVERT_NO").val(param["convert_no"]||"");
	getCurrentPageObj().find("#RES_GROUP_ID").val(param["res_group_id"]||"");
	getCurrentPageObj().find("#SYSTEM_ID").val(param["system_id"]||"");
	getCurrentPageObj().find("#SYSTEM_NAME").val(param["system_name"]||"");
	getCurrentPageObj().find("#CONVERT_DESC").val(param["convert_desc"]||"");
	getCurrentPageObj().find("#REQ_TASK_NAME").unbind("click");
	getCurrentPageObj().find("#IS_INSERT").val("00");
}



