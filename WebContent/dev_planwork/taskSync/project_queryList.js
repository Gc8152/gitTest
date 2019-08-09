initTaskSyncTab();
//查询列表显示table
function initTaskSyncTab() {
	var themecall = getMillisecond();
	var currTab = getCurrentPageObj();
	initSelect(currTab.find("#status"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_PROJECT_STATUS"});
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	currTab.find("#projectTaskInfoTab").bootstrapTable({
		//请求后台的URL（*）
		url : dev_planwork
				+ "Wbs/queryAllProjectInfo.asp?SID=" + SID + "&call=" + themecall,
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
		uniqueId : "PROJECT_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback : themecall,
		singleSelect: true,
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
			field : 'PROJECT_NUM',
			title : '项目编码',
			align : "center"
		}, {
			field : "PROJECT_NAME",
			title : "项目名称",
			align : "center"
		}, {
			field : "PROJECT_TYPE_NAME",
			title : "项目类型",
			align : "center"
		},{
			field : "PROJECT_TYPE_CHILD_NAME",
			title : "项目类型子分类",
			align : "center"
		}, {
			field : "ORG_NAME",
			title : "归属部门",
			align : "center"
		}, {
			field : "SYSTEM_NAME",
			title : "归属应用",
			align : "center"
		}, {
			field : "PROJECT_MAN_NAME",
			title : "项目经理",
			align : "center"
		}, {
			field : "STATUS_NAME",
			title : "项目状态",
			align : "center",
		}, {
			field : "PROJECT_PLAN",
			title : "项目计划",
			align : "center"
		} ]
	});
	
	//查询按钮事件
	currTab.find("#queryProjectTaskList").click(function() {
		var project_name = currTab.find("#project_name").val();
		var project_num = currTab.find("#project_num").val();
		var status = currTab.find("#status").val();
		var organ_id = currTab.find("#organ_id").val();
		var system_id = currTab.find("#system_id").val();
		var project_man_id = currTab.find("#project_man_id").val();
		
		currTab.find('#projectTaskInfoTab').bootstrapTable('refresh',{url:dev_planwork
			+ 'Wbs/queryAllProjectInfo.asp?project_name='
			+ encodeURI(project_name) + "&project_num=" + project_num + "&status=" + status + "&organ_id="
			+ organ_id + "&system_id=" + system_id + "&project_man_id="
			+ project_man_id + "&SID=" + SID + "&call=" + themecall});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#queryProjectTaskList").click();});
	//重置按钮事件
	currTab.find("#resetProjectTask").click(function() {
		currTab.find("#project_name").val("");
		currTab.find("#project_num").val("");
		currTab.find("#status").val(" ");
		currTab.find("#status").select2();
		currTab.find("#organ_id").val(" ");
		currTab.find("#system_id").val("");
		currTab.find("#project_man_id").val("");
	});
	//工作任务同步
	currTab.find("#task_sync").click(function(){
		var selRow = currTab.find('#projectTaskInfoTab').bootstrapTable("getSelections");
		if (selRow.length == 1) {
			var status = selRow[0].STATUS;
			if(status =="06"||status =="01"){
				 closeAndOpenInnerPageTab("taskSync_edit","工作任务同步","dev_planwork/taskSync/taskSync_edit.html", function(){
					 initTaskSyncEditLayout(selRow[0]["PROJECT_ID"],'edit');
				 });
			}else{
				alert("只有立项审批通过和执行中可以进行任务同步");
			return;
			}
		}else{
			alert("请选择一条项目！");
			return;
		}
	});
	//查看工作任务同步情况
	currTab.find("#task_sync_status").click(function(){
	});
};
