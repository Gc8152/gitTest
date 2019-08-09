initDocmProjectQuery();
function initDocmProjectQuery(){
var tableCall = getMillisecond();
initDocManageQueryListTable();
initBtn_docManageQueryList();
initDocManageQueryForm();
function initDocManageQueryListTable(){
	
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	getCurrentPageObj().find("#docManageProjectTable").bootstrapTable({
		//请求后台的URL（*）
		url : dev_project+'docmanage/querydocmMyProjectList.asp?call='+tableCall+'&SID='+SID,
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [5,10,15],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "PROJECT_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback : tableCall,
		singleSelect: true,
		onLoadSuccess : function(data){
			gaveInfo();
		},
		columns : [ {
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		}, {
			field : 'Number',
			title : '序号',
			align : "center",
			width : "7%",
			sortable: true,
			formatter: function (value, row, index) {
				return index+1;
			}
		},{
			field : "PROJECT_NAME",
			title : "项目名称",
			align : "center",
			width : "25%"
		}, {
			field : "STATUS_NAME",
			title : "项目状态",
			align : "center",
			width : "10%"
		},{
			field : "PROJECT_TYPE_NAME",
			title : "项目类型",
			align : "center",
			width : "10%"
		}, 
		 {
			field : "SYSTEM_NAME",
			title : "应用名称",
			align : "center",
			width : "13%"
		},{
			field : "PROJECT_MAN_NAME",
			title : "项目经理",
			align : "center",
			width : "10%"
		}, {
			field : "TEST_MAN_NAME",
			title : "测试经理",
			align : "center",
			width : "10%"
		},  {
		field : "SKILL_MAN_NAME",
		title : "技术经理",
		align : "center",
		width : "10%",
	},
		{
			field : "ORG_NAME",
			title : "所属部门",
			align : "center",
			width : "11%"
		}]
	});
	
}
//初始化按钮事件
function initBtn_docManageQueryList(){
	var currTab = getCurrentPageObj();
	//查询按钮事件
	currTab.find("#query_docManageQueryList").click(function() {
		var param = currTab.find("#docManageQueryList_form").serialize();
		currTab.find("#docManageProjectTable").bootstrapTable('refresh',{url:dev_project
			+ "docmanage/querydocmMyProjectList.asp?SID="+SID+"&call="+tableCall+"&"+param});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#query_docManageQueryList").click();});
	//重置按钮事件
	currTab.find("#reset_docManageQueryList").click(function(){
		currTab.find("#docManageQueryList_form").find("input").val("");
		var queryForm = currTab.find("#docManageQueryList_form");
		queryForm[0].reset();
		var selects = currTab.find("#docManageQueryList_form").find("select");
		for(var i=0; i<selects.length; i++){
			$(selects[i]).select2();
		}
		currTab.find("#docManageQueryList_form").find("input[name=SYSTEM_NAME]").val("");
		currTab.find("#docManageQueryList_form").find("input[name=PROJECT_NAME]").val("");
	});
	//项目任务视图
	currTab.find("#docManageQueryListBtn").click(function(){
		var rows = currTab.find('#docManageProjectTable').bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行操作!");
			return ;
		}
		var project_id=rows[0].PROJECT_ID;
		closeAndOpenInnerPageTab(
				"documentMange_uploadFileList",
				"项目文档管理",
				"dev_project/documentManage/documentManage_ProjectFileList.html",
				function() {
					initProjectDocumentListTable(project_id);
					initfileupload();
				});
		});
	
}
//初始化查询条件中pop、下拉框
function initDocManageQueryForm(){
	var currTab = getCurrentPageObj();
	currTab.find("select[name='STATUS']").empty();
	initSelect(currTab.find("select[name='STATUS']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_PROJECT_STATUS"});
	initSelect(currTab.find("select[name='PROJECT_TYPE']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SYS_DIC_MILESTONE_PROJECT_TYPE"});
}}
