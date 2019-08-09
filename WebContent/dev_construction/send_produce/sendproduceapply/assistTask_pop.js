//页面div调用pop的id，请求参数
function openNoSendProduceTaskPop(id,param,func_call){
	$('#myModal_assisttask').remove();
	getCurrentPageObj().find("#"+id).load("dev_construction/send_produce/sendproduceapply/assistTask_Pop.html",{},function(){
		$("#myModal_assisttask").modal("show");
		initAssistTaskTable(id,param);
		if(func_call){
			func_call();
		}
	});

}

function initAssistTaskTable(id,param){
	//分页
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};	
	var queryAssistCall = getMillisecond()+"3";
	getCurrentPageObj().find('#assisttask_table').bootstrapTable("destroy").bootstrapTable({
				//url :dev_construction+'sendProduceApply/queryNoSendProduceTaskList.asp?call='+queryAssistCall+'&SID='+SID+'&audit_no='+param.audit_no,
				//流程变动为审计通过后自动提交投产，校验当前投产任务未提交投产的配合任务列表用下面的请求
				url :dev_construction+'sendProduceApply/queryNoSendProduceAssistTaskList.asp?call='+queryAssistCall+'&SID='+SID+'&sendData='+encodeURIComponent(param["sendData"]),		
				method : 'get', // 请求方式（*）
				striped : true, // 是否显示行间隔色
				cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, // 是否启用排序
				sortOrder : "asc", // 排序方式
				queryParams : queryParams,// 传递参数（*）
				sidePagination : "client", // 分页方式：client客户端分页，server服务端分页（*）
				pagination : true, // 是否显示分页（*）
				pageList : [5,10, 15 ], // 可供选择的每页的行数（*）
				//pageNumber : 1, // 初始化加载第一页，默认第一页
				pageSize : 5, // 每页的记录行数（*）
				clickToSelect : false, // 是否启用点击选中行s
				//height: 46, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
				uniqueId : "REQ_TASK_CODE", // 每一行的唯一标识，一般为主键列
				cardView : false, // 是否显示详细视图
				detailView : false, // 是否显示父子表
				singleSelect : true,// 复选框单选
				jsonpCallback: queryAssistCall,
				responseHandler: function(data){
		            return data.rows;
		        },
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
					field : 'REQ_TASK_STATE_DISPALY',
					title : '任务状态',
					align : "center"
				}, {
					field : 'SYSTEM_NAME',
					title : '应用名称',
					align : "center"
				}, {
					field : 'P_OWNER_NAME',
					title : '任务责任人',
					align : "center"
				}, {
					field : 'SYS_OWNER_NAME',
					title : '应用负责人',
					align : "center"
				}]
        });
}




			
		
		