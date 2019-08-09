function useInterfaceApply_taskPop(obj,callparams){
	$("#useInterfaceApply_taskPoP").remove();
	//加载pop框内容
	obj.load("dev_application/useInterfaceApply/useInterfaceApply_taskPop.html",{},function(){
		var modObj = getCurrentPageObj().find("#useInterfaceApply_taskPop");
		modObj.modal("show");
		var sCall = getMillisecond();//表回调方法
		
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		var tUrl = dev_application+"useApplyManage/taskQueryList.asp?SID=" + 
				SID + "&call=" + sCall+ "&p_owner=" + SID+ "&system_no=" + callparams.system_id;
		modObj.find("[tb='table_task']").bootstrapTable({
			url :tUrl,
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
			pageSize : 5, // 每页的记录行数（*）
			clickToSelect : true, // 是否启用点击选中行
			// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
			uniqueId : "REQ_TASK_ID", // 每一行的唯一标识，一般为主键列
			cardView : false, // 是否显示详细视图
			detailView : false, // 是否显示父子表
			singleSelect : true,// 复选框单选
			jsonpCallback:sCall,
			onDblClickRow:function(row){
				if(row.IS_ESB == '01'){
					alert('请联系需求对应的需求分析岗,拆分ESB配合任务后再申请');
					return;
				}
				callparams.id.val(row.REQ_TASK_ID);
				callparams.code.val(row.REQ_TASK_CODE);
				callparams.name.val(row.REQ_TASK_NAME);
				modObj.modal("hide");
			},onLoadSuccess : function(data){
				gaveInfo();
			},
			columns : [ {
				field : 'order_id',
				title : '序号',
				align : "center",
				width : "50",
				formatter:function(value,row,index){
					return index + 1;
				}
			}, {
				field : 'IS_ESB',
				title : 'ESB任务',
				align : "center",
				formatter:function(value,row,index){
					if(value=='00'){
						return '已拆分ESB任务';
					}
					if(value=='01'){
						return '<div style="color:red">'+'未拆分ESB任务'+'<div>';
					}
				}
			}, {
				field : 'REQ_TASK_CODE',
				title : '任务编号',
				align : "center"
			}, {
				field : "REQ_TASK_NAME",
				title : "任务名称",
				align : "center"
			}, {
				field : "SYSTEM_NAME",
				title : "应用名称",
				align : "center"
			}, {
				field : "REQ_TASK_RELATION_NAME",
				title : "从属关系",
				align : "center"
			}, {
				field : "REQ_TASK_STATE_NAME",
				title : "任务状态",
				align : "center"
			}, {
				field : "VERSION_NAME",
				title : "入版版本",
				align : "center",
			}, {
				field : "PLAN_ONLINETIME",
				title : "计划投产时间",
				align : "center",
			}]
		});
		
		//重置按钮
		modObj.find("#reset_task").click(function(){
			modObj.find("input").not("input[type='button']").val("");
		});
		//查询按钮
		modObj.find("#query_task").click(function(){
//			var req_task_code = $.trim(modObj.find("input[name='req_task_code']").val());
//			var req_task_name = $.trim(modObj.find("input[name='req_task_name']").val());
			var param = modObj.find("#taskPopForm").serialize();
			var tUrl = dev_application+"useApplyManage/taskQueryList.asp?SID=" + 
					SID + "&call=" + sCall+ "&p_owner=" + SID+ "&system_no=" + callparams.system_id + "&"+ param;
			modObj.find("[tb='table_task']").bootstrapTable('refresh',{
				url:tUrl});
		});	
		//enter触发查询
		enterEventRegister("popModelQueryLevel1", function(){getCurrentPageObj().find("#query_task").click();});
	});
}