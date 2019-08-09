initReqTaskIntoVersionBtn();
function initReqTaskIntoVersionBtn(){
	//查看版本信息
getCurrentPageObj().find('#versionDetail_view').click(function(){
		var versions_id = getCurrentPageObj().find('#TVDversion_id').val();
		baseAjaxJsonp(dev_construction+"reqtask_intoVersion/queryVersionOneById.asp?SID="+SID+"&versions_id="+versions_id, null , function(data) {
		  if (data != undefined && data != null && data.result=="true") {
			  openInnerPageTab("view_project","查看计划","dev_construction/versionManage/annualVersionManage/annualVersionPlan_queryInfo.html", function(){
		        initAnnualVersionViewEvent(data);
			  });
		  }else{
			alert("查询单个版本信息失败");
		  }
		});
	});
}

//查看需求详情
function viewReqDetailTVD(){
	  var req_id=getCurrentPageObj().find("#TVDreq_id").val();
	  closeAndOpenInnerPageTab("requirement_detail","需求详情","dev_construction/requirement/requirement_input/req_detail.html",function(){
	   initReqDetailLayout(req_id);
	  });
	}
//查看子需求详情
function viewSubReqDetailTVD(){
		var req_id=getCurrentPageObj().find("#TVDreq_id").val();
		closeAndOpenInnerPageTab("subreq_detail","需求点详情","dev_construction/requirement/requirement_analyze/split_subreq/splitSubreq_detail.html",function(){
		   initSplitReqDetailLayOut(req_id);
		});
	}
	
//初始化同个子需求下关联任务列表
function initSubReqTaskList5Version(){
	var sub_req_id=getCurrentPageObj().find('#TVDsub_req_id').val();
	var req_task_id=getCurrentPageObj().find('#TVDreq_task_id').val();
	var queryParams = function(params) {
		var temp = {
			limit : params.limit, // 页面大小
			offset : params.offset
		// 页码
		};
		return temp;
	};
	var reqTaskListCall = getMillisecond();
	getCurrentPageObj().find('#gReqTaskTableList4Version').bootstrapTable("destroy").bootstrapTable({
				url :dev_construction+"req_taskaccept/queryAssociationTaskList.asp?SID="+SID+"&sub_req_id="+sub_req_id+"&req_task_id="+req_task_id+"&call="+reqTaskListCall,
				method : 'get', // 请求方式（*）
				striped : false, // 是否显示行间隔色
				cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, // 是否启用排序
				sortOrder : "asc", // 排序方式
				queryParams : queryParams,// 传递参数（*）
				sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
				pagination : true, // 是否显示分页（*）
				pageList : [ 5, 10, 15 ], // 可供选择的每页的行数（*）
				pageNumber : 1, // 初始化加载第一页，默认第一页
				pageSize : 10, // 每页的记录行数（*）
				clickToSelect : true, // 是否启用点击选中行
				// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
				uniqueId : "REQ_TASK_ID", // 每一行的唯一标识，一般为主键列
				cardView : false, // 是否显示详细视图
				detailView : false, // 是否显示父子表
				jsonpCallback:reqTaskListCall,
				singleSelect : true,// 复选框单选
				columns : [{
					checkbox : true,
					rowspan : 2,
					align : 'center',
					valign : 'middle'
				},{
					field : 'REQ_TASK_CODE',
					title : '任务编号',
					align : "center",
				},{
					field : 'REQ_TASK_NAME',
					title : '任务名称',
					align : "center",
				},{
					field : 'SUB_REQ_NAME',
					title : '子需求名称',
					align : "center",
				}, {
					field : 'REQ_TASK_RELATION_DISPLAY',
					title : '从属关系',
					align : "center"
				}, {
					field : "REQ_TASK_STATE_DISPLAY",
					title : "任务状态",
					align : "center"
				}, {
					field : "SYSTEM_NAME",
					title : "实施应用",
					align : "center"
				}, {
					field : "PLAN_ONLINETIME",
					title : "计划投产时间",
					align : "center"
				}, {
					field : "VERSION_NAME",
					title : "申请纳入版本",
					align : "center"
				}]
			});
} 


//查看关联任务详情
getCurrentPageObj().find('#versionTaskDetail_view').click(function(){
var id = $("#gReqTaskTableList4Version").bootstrapTable('getSelections');
var req_task_id = $.map(id, function (row) {return row.REQ_TASK_ID;});
if(id.length==1){
	closeAndOpenInnerPageTab("req_taskDetail","任务详情页面","dev_construction/requirement/requirement_analyze/task_accept/task_detail.html",function(){
		initReqTaskDetailLayout(req_task_id);
	  });
}else{
	
    alert("请选择一条任务进行查看！");
}

});


