//查询列表显示table
function initTaskSyncEditLayout(project_id, action) {
	var themecall = getMillisecond();
	var currTab = getCurrentPageObj();
	
	currTab.find("#taskSyncListTable").bootstrapTable({
		//请求后台的URL（*）
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		pagination : false, //是否显示分页（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "PLAN_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: false,
		columns : [ {
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		},{
			field : '',
			title : '序号',
			align : "center",
			formatter : function(value,row,index){
				return (index + 1);
			}
		},{
			field : 'PLAN_NAME',
			title : '任务名称',
			align : "center"
		}, {
			field : "TYPE_NAME",
			title : "类别",
			align : "center"
		}, {
			field : "TASK_TYPE_NAME",
			title : "任务类型",
			align : "center"
		}, {
			field : "WORK_MAN",
			title : "责任人",
			align : "center"
		}, {
			field : "START_TIME",
			title : "开始时间",
			align : "center"
		},{
			field : "END_TIME",
			title : "结束时间",
			align : "center"
		}, {
			field : "SYSTEM_SHORT",
			title : "归属应用简称",
			align : "center"
		}, {
			field : "SYNC_ID",
			title : "同步状态",
			align : "center",
			formatter:function(value, row, index){
				if(typeof(value)=="undefined" || typeof(value)==null){
					return "未同步";
				} else {
					return "已同步";
				}
			}
		} ]
	});
	
	initTable();
	//初始化任务列表
	function initTable(){
		baseAjaxJsonp(dev_planwork + "TaskSync/queryTasksByProjectId.asp?SID=" + SID + "&call=" + themecall, {project_id : project_id}, function(result) {
			if(result.result=="true"){
				currTab.find("#taskSyncListTable").bootstrapTable("load", result.data);
			} else {
				alert("工作任务查询失败");
			}
		}, themecall);
	}
	
	//工作任务同步
	currTab.find("#task_sync_action").click(function(){
		var selRow = currTab.find('#taskSyncListTable').bootstrapTable("getSelections");
		if(selRow.length>0){
			var valid = true;
			var plan_id = "";
			var sync_plan = 0;
			for(var i=0; i<selRow.length; i++){
				var row = selRow[i];
				if(row["STREAM_NAME"]!=undefined && row["STREAM_NAME"]!="" && row["SYSTEM_SHORT"]!=undefined && row["SYSTEM_SHORT"]!="" &&
					row["WORK_MAN"]!=undefined && row["WORK_MAN"]!=""){
					valid = false;
				} else if(typeof(row["SYNC_ID"])=="undefined" || typeof(row["SYNC_ID"])==null){
					sync_plan += 1;
					plan_id += "," + row["PLAN_ID"];
				}
			}
			if(sync_plan<=selRow.length){
				if(sync_plan<0){
					alert("所选任务中包含已同步任务,已同步任务将不在进行同步");
				}
				if(valid&& plan_id!==""){
					var url = dev_planwork + "TaskSync/syncTasksByPlanId.asp?SID=" + SID + "&call=" + themecall;
					baseAjaxJsonp(url, {plan_id : plan_id}, function(result) {
						if(result.result=="true"){
						//	console.log(result.fail);
							if(result["fail"]==0){
								alert("同步成功");
							} else {
								alert("总共同步 "+ result.sum + " 条任务, 其中失败 " + result.fail + " 条");
							}
						} else {
							alert("同步失败");
						}
						initTable();
					}, themecall);
				} else {
					alert("任务信息不全，无法进行同步");
				}
			} else {
				alert("请至少选择一条未同步任务");
			}
		} else {
			alert("请选择任务");
		}
	});
};
