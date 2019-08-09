
initReqTaskVersionJoinBtn();

//初始化按钮
function initReqTaskVersionJoinBtn(){
	//初始化验证
	initVlidate(getCurrentPageObj());
	//提交并保存
	getCurrentPageObj().find('#taskVersion_Update').click(function(){
		if(!vlidate(getCurrentPageObj().find("#U_reqtask_joinVersion"),"",true)){
			return ;
		}
	    var params={};
	    var req_task_id=getCurrentPageObj().find('#UVreq_task_id').val();
	    var version_id=getCurrentPageObj().find("#UVversion_id").val();
	    var version_content=getCurrentPageObj().find('#UVversion_content').val();
	    var version_name = getCurrentPageObj().find('#UVversion_name').val();
	    if(version_content.length>230){
	    	alert("入版主要内容至多可输入230汉字！");
	    	return;
	    }
	    params["version_type"] = getCurrentPageObj().find("#UVversion_type").val();
	    params["version_id"]=version_id;
	    params["version_content"]=version_content;
	    params["version_name"] = version_name;
		baseAjaxJsonp(dev_construction+"reqtask_intoVersion/updateVsersion.asp?SID="+SID+"&req_task_id="+req_task_id, params , function(data) {
			if (data != undefined && data != null && data.result=="true") {
				   alert(data.msg);
				   closeCurrPageTab();
			}else{
				alert(data.msg);
			}
	   });
   });
	
//弹出版本pop
getCurrentPageObj().find('#UVversion_name').click(function(){	
	openTaskVersionPop("getTaskVersion",{versionsname:getCurrentPageObj().find('#UVversion_name'),versionsid:getCurrentPageObj().find('#UVversion_id'),versionstype:getCurrentPageObj().find("#UVversion_type"),vm:"10"});
});
//查看版本信息
getCurrentPageObj().find('#versionDetail_viewU').click(function(){
	var versions_id = getCurrentPageObj().find('#UVversion_id').val();
	if(versions_id==null||versions_id==""){
		alert("请选择一个版本");
		return;
	}
	baseAjaxJsonp(dev_construction+"reqtask_intoVersion/queryVersionOneById.asp?SID="+SID+"&versions_id="+versions_id, null , function(data) {
	  if (data != undefined && data != null && data.result=="true") {
		  closeAndOpenInnerPageTab("view_project","查看版本计划","dev_construction/versionManage/annualVersionManage/annualVersionPlan_queryInfo.html", function(){
	        initAnnualVersionViewEvent(data);
		  });
	  }else{
		alert("查询单个版本信息失败");
	  }
	});
});

}	

function checkVersion(req_id,version_id){
	baseAjaxJsonp(dev_construction+"reqtask_intoVersion/checkVersion.asp?SID="+SID+"&version_id="+version_id+"&req_id="+req_id, null , function(data) {
		  if (data != undefined && data != null && data.result=="true") {
			  getCurrentPageObj().find('#UVversion_name').val("");
			  getCurrentPageObj().find('#UVversion_id').val("");
			  getCurrentPageObj().find("#UVversion_type").val("");
			  alert("该立项项目已存在相同版本！");
		  }
		});
}

function viewReqDetailUV(){
  var req_id=getCurrentPageObj().find("#UVreq_id").val();
  closeAndOpenInnerPageTab("requirement_detail","需求详情","dev_construction/requirement/requirement_input/req_detail.html",function(){
   initReqDetailLayout(req_id);
  });
}

function viewSubReqDetailUV(){
	var req_id=getCurrentPageObj().find("#UVreq_id").val();
	closeAndOpenInnerPageTab("subreq_detail","需求点详情","dev_construction/requirement/requirement_analyze/split_subreq/splitSubreq_detail.html",function(){
	   initSplitReqDetailLayOut(req_id);
	});
}

//初始化同个子需求下关联任务列表
function initSubReqTaskList4Version(){
	var sub_req_id=getCurrentPageObj().find('#UVsub_req_id').val();
	var req_task_id=getCurrentPageObj().find('#UVreq_task_id').val();
	var queryParams = function(params) {
		var temp = {
			limit : params.limit, // 页面大小
			offset : params.offset
		// 页码
		};
		return temp;
	};
	var reqTaskListCall = getMillisecond();
	$('#gReqTaskTableListUVersion').bootstrapTable("destroy").bootstrapTable({
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
				}, {
					field : "P_OWNER",
					title : "申请纳入版本",
					align : "center",
					visible:false
				}]
			});
} 


//查看关联任务详情
getCurrentPageObj().find('#versionTaskDetail_viewU').click(function(){
var id = $("#gReqTaskTableListUVersion").bootstrapTable('getSelections');
var req_task_id = $.map(id, function (row) {return row.REQ_TASK_ID;});
if(id.length==1){
	closeAndOpenInnerPageTab("req_taskDetail","任务详情页面","dev_construction/requirement/requirement_analyze/task_accept/task_detail.html",function(){
		initReqTaskDetailLayout(req_task_id);
	  });
}else{
	
    alert("请选择一条任务进行查看！");
}

});


