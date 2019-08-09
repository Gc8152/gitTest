//初始化页面按钮
function initQueryListButton(){
	//1.查看实例记录详情
	$('#viewApproval').click(function(){
		var biz_id = '';
		var af_name = '';
		var instance_id = '';
		var instance_state = '';
		var selRow = $('#approvalListTableInfo').bootstrapTable("getSelections");
		if(selRow.length == 1){
			biz_id = selRow[0].BIZ_ID;
			af_name = selRow[0].AF_NAME;
			instance_id = selRow[0].INSTANCE_ID;
			instance_state = selRow[0].INSTANCE_STATENAME;
			closeAndOpenInnerPageTab("checkelement", "查看实例详情", "pages/approvalflow/appr/approval_detail.html", function(){
				initProcessDetail(biz_id,af_name,instance_id,instance_state);
			});
		}else{
			alert("请选择一条数据");
			return;
		}
	});
	//2.查询按钮
	$("#query").click(function() {
		var biz_id = $.trim($("#biz_id").val());
		var af_name = $.trim($("#af_name").val());
		var instance_state = $.trim($("#instance_state").val());
		$('#approvalListTableInfo').bootstrapTable('refresh',{url:'QApproval/queryApprovalList.asp?biz_id='+biz_id+
				'&af_name='+escape(encodeURIComponent(af_name))+'&instance_state='+instance_state});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#query").click();});

	//3.重置按钮
	getCurrentPageObj().find("#reset").click(function() {
		//resetFrom('approvalForm');
		$("#biz_id").val("");
		$("#af_name").val("");
		$("#instance_state").val("");
		$("#instance_state").select2();
	});
}
//初始化数据表格
function initApprovalInfo() {
	var biz_id = $.trim($("#biz_id").val());
	var af_name = $.trim($("#af_name").val());
	var instance_state = $.trim($("#instance_state").val());
	var queryParams=function(params){
		var temp={
			limit: params.limit, //页面大小
			offset: params.offset //页码
		};
		return temp;
	};
	$('#approvalListTableInfo').bootstrapTable({
		url : 'QApproval/queryApprovalList.asp?biz_id='+biz_id+
			'&af_name='+escape(encodeURIComponent(af_name))+'&instance_state='+instance_state,
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [5,10],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "instance_id", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		columns : [{	
			checkbox:true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		},{
			field: 'INSTANCE_ID',
			title : '流程实例ID',
			visible:false,
			align: 'center'	
		},{
			field: 'BIZ_ID',
			title : '业务数据ID',
			align: 'center'	
		},{
			field : 'AF_NAME',
			title : '流程名称',
			align : "center"
		},{
			field : "INSTANCE_STATENAME",
			title : "流程实例状态",
			align : "center"
		}, {
			field : "LAUNCH_ACTORNAME",
			title : "发起人",
			align : "center"
		}, {
			field : "LAUNCH_TIME",
			title : "发起时间",
			align : "center"
		}]
	});
};

//初始化页面流程实例状态
initSelect($("#instance_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"AF_DIC_INSTANCE_STATE"});
initQueryListButton();
initApprovalInfo();