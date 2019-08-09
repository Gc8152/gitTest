var procall = getMillisecond();
var brocall = getMillisecond();
var queryParams = function(params) {
		//var temp = getSinfoParams();
		temp={};
		temp["limit"] = params.limit;
		temp["offset"] = params.offset;
		return temp;
	};
$("program_table").hide();
$("#problem_table").hide();

//项目列表查询
$("#program_query").click(function(){
	var project_num=$("#project_num").val();
	var project_name=$("#project_name").val();
	$('#program_list_table').bootstrapTable('refresh',
			{url:dev_planwork + 'planOutterCon/queryProjectList.asp?call=' + procall+ '&SID=' + SID+'&project_num='+project_num+"&project_name="+project_name});

	
		
});
//问题单任务查询
$("#problem_query").click(function(){
	var req_task_code=$("#req_task_code").val();
	var req_task_name=$("#req_task_name").val();
	$('#problem_list_table').bootstrapTable('refresh',
			{url:dev_planwork + 'planOutterCon/queryProblemList.asp?call=' + brocall+ '&SID=' + SID+'&req_task_code='+req_task_code+"&req_task_name="+req_task_name});

	
		
});
//项目列表重置
$("#program_reset").click(function(){
	$("#project_num").val("");
	$("#project_name").val("");
	
		
});
//项目列表重置
$("#problem_reset").click(function(){
	$("#req_task_name").val("");
	$("#req_task_code").val("");
		
});

//项目列表
function initProjectTable(){
	
	// 获取表格和查询参数
	
	$("#program_list_table").bootstrapTable({
		// 请求后台的URL（*）
		url : dev_planwork + 'planOutterCon/queryProjectList.asp?call=' + procall+ '&SID=' + SID,
		method : 'get', // 请求方式（*）
		striped : false, // 是否显示行间隔色
		cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, // 是否启用排序
		sortOrder : "asc", // 排序方式
		queryParams : queryParams,// 传递参数（*）
		sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
		pagination : true, // 是否显示分页（*）
		pageList : [ 10, 15 ],// 每页的记录行数（*）
		pageNumber : 1, // 初始化加载第一页，默认第一页
		pageSize : 10,// 可供选择的每页的行数（*）
		clickToSelect : true, // 是否启用点击选中行
		uniqueId : "aa", // 每一行的唯一标识，一般为主键列
		cardView : false, // 是否显示详细视图
		detailView : false, // 是否显示父子表
		jsonpCallback : procall,
		singleSelect : false,
		columns : [ {
			field : 'middle',
			checkbox : true,
			rowspan : 2,
			align : 'center',
			valign : 'middle'
		}, {
			title : '序号',
			align : "center",
			formatter : function(value, rows, index) {
				return index + 1;
			}
		},{
			field : "PROJECT_ID",
			title : "项目主键",
			align : "center",
			visible:false
		},  {
			field : "PLAN_ID",
			title : "计划主键",
			align : "center",
			visible:false
		}, {
			field : "PROJECT_NUM",
			title : "项目编码",
			align : "center"
		}, {
			field : "PROJECT_NAME",
			title : "项目名称",
			align : "center"
		}, {
			field : "PROJECT_TYPE",
			title : "项目类型",
			align : "center"
		}, {
			field : "PROJECT_MAN_ID",
			title : "项目经理",
			align : "center"
		}],
          onClickRow:function(rowIndex,rowData){
        	var proName=rowIndex.PROJECT_NAME;
        	$("#associate_name").val(proName);//项目名称
        	$("#associate_code").val(rowIndex.PROJECT_ID);//计划外任务关联项目主键
        	$("#top_plan_id").val(rowIndex.PLAN_ID);//上级计划id
        	$("#associate_type").val("00");//00代表关联项目
        	$("#myModal_associate").modal("hide");
          }
	}); 

	
}

function initProblemTable(){
	// 获取表格和查询参数
	
	$("#problem_list_table").bootstrapTable({
		// 请求后台的URL（*）
		url : dev_planwork + 'planOutterCon/queryProblemList.asp?call=' + brocall+ '&SID=' + SID,
		method : 'get', // 请求方式（*）
		striped : false, // 是否显示行间隔色
		cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, // 是否启用排序
		sortOrder : "asc", // 排序方式
		queryParams : queryParams,// 传递参数（*）
		sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
		pagination : true, // 是否显示分页（*）
		pageList : [ 10, 15 ],// 每页的记录行数（*）
		pageNumber : 1, // 初始化加载第一页，默认第一页
		pageSize : 10,// 可供选择的每页的行数（*）
		clickToSelect : true, // 是否启用点击选中行
		uniqueId : "aa", // 每一行的唯一标识，一般为主键列
		cardView : false, // 是否显示详细视图
		detailView : false, // 是否显示父子表
		jsonpCallback : brocall,
		singleSelect : false,
		columns : [ {
			field : 'middle',
			checkbox : true,
			rowspan : 2,
			align : 'center',
			valign : 'middle'
		}, {
			title : '序号',
			align : "center",
			formatter : function(value, rows, index) {
				return index + 1;
			}
		},{
			field : "REQ_TASK_ID",
			title : "主键",
			align : "center",
			visible:false
		},  {
			field : "REQ_TASK_CODE",
			title : "问题单编码",
			align : "center"
		}, {
			field : "REQ_TASK_NAME",
			title : "问题单名称",
			align : "center"
		}, {
			field : "CREATE_TIME",
			title : "提出时间",
			align : "center"
		}],
          onClickRow:function(rowIndex,rowData){
        	var proName=rowIndex.REQ_TASK_NAME;
          	$("#associate_name").val(proName);//问题单任务名称
          	$("#associate_code").val(rowIndex.REQ_TASK_ID);//计划外任务关联问题单任务主键
          	$("#associate_type").val("01");//01代表关联问题单任务
          	$("#myModal_associate").modal("hide");
          }
	}); 

	
}