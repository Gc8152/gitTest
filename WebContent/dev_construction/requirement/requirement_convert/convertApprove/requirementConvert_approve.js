var call_func = proj_func;
/**
 * 
 * @param result 审批结果：true;false
 * @param mark 审批标识：over;reject;back;
 * @param biz_id 业务ID
 * @param msg 审批提示内容
 */
function proj_func(result,mark,biz_id,msg){
	if(mark=='over'){//审批通过
		convertApprOver(biz_id,"01"); //业务id
	}else if(mark=='reject'){
		convertApprOver(biz_id,"02");//审批打回
	}else if(mark=='back'){
		convertApprOver(biz_id,"03");//审批撤销
	}else{
		alert(msg);
	}
}
//执行审批方法
function convertApprOver(CONVERT_NO,type){
	var currTab = getCurrentPageObj();
	var params = {};
	params['type'] = type;
	params['CONVERT_NO'] = CONVERT_NO;
	params['SUB_REQ_ID'] = currTab.find("span[name=SUB_REQ_ID]").text();
	params['version_id'] = currTab.find("span[name=VERSION_ID]").text();
	params['version_name'] = currTab.find("span[name=VERSION_NAME]").text();
	var appCall = getMillisecond();
    baseAjaxJsonp(dev_construction+'ReqConvert/updateConvertStatus.asp?call='+appCall+'&SID='+SID,params, function(data) {
		if (data != undefined&&data!=null&&data.result=="true") {
			alert(data.msg);
			closeCurrPageTab();
		}else{
			alert(data.msg);
		}
	},appCall);
}


function initConvertApprove(item){
	var currTab = getCurrentPageObj();
	currTab.find("span[name=SUB_REQ_ID]").hide();
	currTab.find("span[name=VERSION_ID]").hide();
	for(var k in item){
		var value = item[k];
		currTab.find("span[name="+k+"]").text(value);
	}
	initConvertTask(item["CONVERT_NO"]);
	var approve = currTab.find("#approve");
	approve.click(function(){
		convertApprOver(item["CONVERT_NO"],'01');
	});
}

function initConvertTask(CONVERT_NO){
	var currTab = getCurrentPageObj();
	var initTask_call = getMillisecond();
	var queryParams = function(params){
		var temp = {};
		temp["limit"] = params.limit;
		temp["offset"] = params.offset;
		temp["call"] = initTask_call;
		return temp;
	};
	currTab.find("#ConvertApproveTable").bootstrapTable({
		//需求点00为初始为了表头
			url : dev_construction+'ReqConvert/queryTaskByConvertNo.asp?&SID='+SID+"&CONVERT_NO="+CONVERT_NO,
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
			jsonpCallback: initTask_call,
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
//打开任务详情页面
function openReqTaskDetail(req_task_id){
	closeAndOpenInnerPageTab("req_taskDetail","任务详情页面","dev_construction/requirement/requirement_analyze/task_accept/task_detail.html",function(){
		initReqTaskDetailLayout(req_task_id);
	  });
}