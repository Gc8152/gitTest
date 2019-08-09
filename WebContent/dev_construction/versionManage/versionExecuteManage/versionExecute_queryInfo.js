

function initVersionExecutePlanEvent(data){
	var currTab=getCurrentPageObj();//获取当前页面对象
	var tabelCall=getMillisecond();//获取table回调函数
	
	var table=currTab.find("#table_versionExecutePlan");
	for(var k in data){
		if (k=="VERSIONS_NAME") {
			currTab.find("input[name='version_name']").val(data[k]);
		}else if(k=="VERSION_TYPE_NAME"){
			currTab.find("input[name='version_type']").val(data[k]);
		}else if(k=="VERSION_STATUS_NAME"){
			currTab.find("input[name='version_status']").val(data[k]);
		}
	}
	
	//查询
	var query = currTab.find("#query_versionExecute");
	query.click(function(){
		//var version_id = $.trim(currTab.find("input[name='version_id']").val());
		var version_id=data["VERSIONS_ID"];
		var task_name = $.trim(currTab.find("input[name='task_name']").val());
		var req_task_code = $.trim(currTab.find("input[name='req_task_code']").val());
		var system_name=$.trim(currTab.find("input[name='system_name']").val());
		table.bootstrapTable('refresh',{
			url:dev_construction+'versionexecute/queryListVersionTask.asp?SID='+SID+'&call='+tabelCall
			+'&task_name='+escape(encodeURIComponent(task_name))
			+'&version_id='+version_id
			+'&req_task_code='+req_task_code
			+'&system_name='+system_name
			});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#query_versionExecute").click();});
	//重置reset_versionExecute
	var reset = currTab.find("#reset_versionExecute");
	reset.click(function(){
		currTab.find("input[name='req_task_code']").val(" ");
		currTab.find("input[name='task_name']").val(" ");
		currTab.find("input[name='system_name']").val(" ");
	});
	
	
	//返回
	var back_versionExecute=currTab.find("#close_back");
	back_versionExecute.click(function(){
		closeCurrPageTab();
	});
	//列表显示
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	var version_id=data["VERSIONS_ID"];
	table.bootstrapTable({
		//请求后台的URL（*）
		url : dev_construction+'versionexecute/queryListVersionTask.asp?SID='+SID+'&call='+tabelCall+'&version_id='+version_id,
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [10,15],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "DRAFT_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		jsonpCallback:tabelCall,
		columns : [{  
			field : 'Number',
			title : '序号',
			align : "center",			
			sortable: true,
			width : 75,
			formatter: function (value, row, index) {
				return index+1;
			}
		},{
			field : "REQ_TASK_CODE",
			title : "需求任务编号",
			align : "center",
			width : 185,
		},{
			field : "REQ_TASK_NAME",
			title : "任务名称",
			align : "center",
			width : 200,
		},{
			field : "REQ_TASK_STATE_DISPLAY",
			title : "任务状态",
			align : "center",
			width : 200,
		},{
			field : 'REQ_NAME',
			title : '需求名称',
			align : "center",
			width : 200,
		}, {
			
			field : 'REQ_CODE',
			title : '需求编号',
			align : "center",
			width : 185,
		},{
			field : "REQ_LEVEL_DISPLAY",
			title : "需求优先级",
			align : "center",
			width : 90,
		},{
			field : "VERSION_NAME",
			title : "纳入版本",
			align : "center",
			width : 145,
			
			
		},{
			field : "SYSTEM_NAME",
			title : "任务所属系统",
			align : "center",
			width : 105,
		},/*{
		    field : "FUNCTIONPOINT_NUM",
		    title : "需求功能点个数",
		    align : "center"
		}, */{
			field : "REQ_TASK_TYPE",
			title : "需求任务来源",
			align : "center"
		}, /*{
			field : "DEPT_NAME",
			title : "所属项目组",
			align : "center"
		}, {
			field : "",
			title : "合作公司工作量",
			align : "center",
			visible: false	
		}, {
			field : "",
			title : "DELPHI工作量",
			align : "center",
			visible: false
		}, */{
			field : "",
			title : "是否年度任务",
			align : "center",
			visible: false
		},{
			field : "ACTUAL_SUBMIT_PRODUCT_TIME",
			title : "提交投产时间",
			align : "center",
			visible: false
		},{
			field : "ACTUAL_PRODUCT_TIME",
			title : "投产时间",
			align : "center",
			width : 110,
		},{
			field : "REQ_TASK_RELATION_NAME",
			title : "从属关系",
			align : "center",
			width : 110,
		},{
			field : "ANALYZE_STATE",
			title : "是否完成需求分析",
			align : "center",
			width : 131,
			formatter : function(value, row, index){
				var a=row.ANALYZE_STATE;
				if (a==undefined) {
					return '否';
				}else if(a=='02'||a=='05'||a=='08'||a=='10'){
					return '是';
				}else{
					return '否';
				}
			}
		},{
			field : "TOTAL_DESIGN_STATE",
			title : "是否完成设计开发",
			align : "center",
			width : 131,
			formatter : function(value, row, index){
				var b=row.TOTAL_DESIGN_STATE;
				if (b==undefined) {
					return '否';
				}else if(b=='02'||b=='05'||b=='08'||b=='10'){
					return '是';
				}else{
					return '否';
				}
			}
		},{
			field : "ACCEPT_RESULT_NAME",
			title : "sit测试结论",
			align : "center"
		},{
			field : "",
			title : "备注",
			align : "center",
			visible: false
		}]
	});
}