//加载基本信息
 var table =getCurrentPageObj().find("#gTaskInfoTable");
 var reqQueryListCall=getMillisecond();
function initStreamInfoForSure(item){
	for ( var k in item) {
		if(k=="STREAM_TYPE"){
			if(item[k]=="00"){
				getCurrentPageObj().find("#"+k).text("任务流");
				initStreamTask(item["REQ_TASK_ID"]);
			}else{
				getCurrentPageObj().find("#"+k).text("版本流");
			}
			}else{
			getCurrentPageObj().find("#"+k).text(item[k]);
		}
	}
}
//初始化流关联的任务
function initStreamTask(req_task_id){
	//var system_id=getCurrentPageObj().find('#system_id').val();
	var queryParams = function(params) {
		var temp = {
			limit : params.limit, // 页面大小
			offset : params.offset
		// 页码
		};
		return temp;
	};
	var reqTaskListCall = getMillisecond();
	getCurrentPageObj().find('#requirement_task').bootstrapTable("destroy").bootstrapTable({
				url :dev_resource+"StreamApply/findTaskByStreamTask.asp?SID="+SID+"&req_task_id="+req_task_id+"&call="+reqTaskListCall,
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
					field : 'REQ_TASK_CODE',
					title : '任务编号',
					align : "center",
				},{
					field : 'REQ_TASK_NAME',
					title : '任务名称',
					align : "center",
					formatter:function(value,row,index){return '<a style="color:blue" href="javascript:void(0)" onclick="openReqTaskDetail(\''+row.REQ_TASK_ID+'\')";>'+value+'</a>';}
				},{
					field : 'SUB_REQ_NAME',
					title : '子需求名称',
					align : "center",
				},{
					field : 'VERSIONS_NAME',
					title : '版本名称',
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
				}]
			});
} 
//初始化列表
function initReuirementQueryTable(system_id,version_id) {	
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		table.bootstrapTable("destroy").bootstrapTable({
					url :dev_application+"applicationManager/findTaskBySystemIdAndVersionId.asp?SID="+SID+"&call="+reqQueryListCall+"&system_no="+system_id+"&version_id="+version_id,
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
					uniqueId : "req_task_code", // 每一行的唯一标识，一般为主键列
					cardView : false, // 是否显示详细视图
					detailView : false, // 是否显示父子表
					jsonpCallback:reqQueryListCall,
					singleSelect : true,// 复选框单选
					onLoadSuccess : function(data){
						gaveInfo();
					},
					columns : [ {
						field : 'REQ_TASK_CODE',
						title : '任务编号',
						align : "center",
						width : "20%"
					},{
						field : 'REQ_TASK_NAME',
						title : '任务名称',
						align : "center",
						width : "20%",
						formatter:function(value,row,index){return '<a style="color:blue" href="javascript:void(0)" onclick="openReqTaskDetail(\''+row.REQ_TASK_ID+'\')";>'+value+'</a>';}
					},{
						field : 'REQ_TASK_RELATION_DISPLAY',
						title : '从属关系',
						align : "center",
						width : "13%"
					},{
						field : "REQ_TASK_STATE_DISPLAY",
						title : "任务状态",
						align : "center",
						width : "13%"
					}, {
						field : "P_OWNER_DISPLAY",
						title : "当前责任人",
						align : "center",
						width : "10%"
					}]
				});
	}
//打开任务详情页面
function openReqTaskDetail(req_task_id){
	closeAndOpenInnerPageTab("req_taskDetail","任务详情页面","dev_construction/requirement/requirement_analyze/task_accept/task_detail.html",function(){
		initReqTaskDetailLayout(req_task_id);
	  });
}