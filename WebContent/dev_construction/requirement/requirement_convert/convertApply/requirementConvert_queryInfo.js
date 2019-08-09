function initConvertQueryInfo(item){
	var currTab = getCurrentPageObj();
	for(var k in item){
		var value = item[k];
		currTab.find("span[name="+k+"]").text(value);
	}
	initConvertTask(item["CONVERT_NO"]);
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
	currTab.find("#ConvertViewTaskTable").bootstrapTable({
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