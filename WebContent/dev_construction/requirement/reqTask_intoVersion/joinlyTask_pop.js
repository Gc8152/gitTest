//页面div调用pop的id，需要返回值的input框的id数组
function openTaskNotAccept(id,params){
	$('#myModal_joinlytask').remove();
	getCurrentPageObj().find("#"+id).load("dev_construction/requirement/reqTask_intoVersion/joinlyTask_Pop.html",{},function(){
		$("#myModal_joinlytask").modal("show");
		initJoinlyTaskTable(id,params);
	});

}



function initJoinlyTaskTable(id,params){
	var queryParams = function(params) {
		var temp = {
			limit : params.limit, // 页面大小
			offset : params.offset
		// 页码
		};
		return temp;
	};
	
	getCurrentPageObj().find('#joinlytask_table').bootstrapTable("destroy").bootstrapTable({
				url :dev_construction+"reqtask_intoVersion/queryJoinlyTaskBySubReqId.asp?SID="+SID+"&sub_req_id="+params,
				method : 'get', // 请求方式（*）
				striped : true, // 是否显示行间隔色
				cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, // 是否启用排序
				sortOrder : "asc", // 排序方式
				queryParams : queryParams,// 传递参数（*）
				sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
				pagination : true, // 是否显示分页（*）
				pageList : [ 5, 10, 15 ], // 可供选择的每页的行数（*）
				pageNumber : 1, // 初始化加载第一页，默认第一页
				pageSize : 5, // 每页的记录行数（*）
				clickToSelect : true, // 是否启用点击选中行
				// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
				uniqueId : "VERSIONS_ID", // 每一行的唯一标识，一般为主键列
				cardView : false, // 是否显示详细视图
				detailView : false, // 是否显示父子表
				singleSelect : true,// 复选框单选
				onLoadSuccess:function(data){
					gaveInfo();
				},
				columns : [ {
					field : 'REQ_TASK_CODE',
					title : '任务编号',
					align : "center",
				},{
					field : 'REQ_TASK_NAME',
					title : '任务名称',
					align : "center",
				}, {
					field : 'REQ_TASK_STATE',
					title : '任务状态',
					align : "center"
				}, {
					field : 'REQ_TASK_RELATION',
					title : '任务从属关系',
					align : "center"
				}, {
					field : 'SYSTEM_NAME',
					title : '应用名称',
					align : "center"
				}, {
					field : 'P_OWNER',
					title : '责任人',
					align : "center"
				}]
        });
	
}




			
		
		