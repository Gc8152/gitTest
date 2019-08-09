/**
 * 
 */


var call = getMillisecond();
var queryParams = function(params) {
	temp={};
	temp["limit"] = params.limit;
	temp["offset"] = params.offset;
	return temp;
};
$(function(){
	
	initStatusSelect();
	
	//重置按钮
	$("#work_lookup_reset").click(function() {
		$("#staff_name").val("");
		$("#w_date").val(" ");
		$("#status").val(" ");
		$("#status").select2();
		$("#staff_code").val(" ");
	});
	
	//查询按钮
	$("#work_lookup_serch").click(function() {
		var staff_code=$("#staff_code").val();
		var w_date=$("#w_date").val();
		var status=$("#status").val();
		$("#projectList_lookup").bootstrapTable("refresh",{url:dev_planwork + 'workCon/queryWorkBooingLookup.asp?call=' + call+ '&SID=' + SID+ '&staff_code=' + staff_code+'&w_date=' + w_date+'&status=' +status});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#work_lookup_serch").click();});
	
	
	$("#projectList_lookup").bootstrapTable({
		// 请求后台的URL（*）
		url : dev_planwork + 'workCon/queryWorkBooingLookup.asp?call=' + call+ '&SID=' + SID,
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
		jsonpCallback : call,
		detailView : false, // 是否显示父子表
		singleSelect : true,
		columns : [ /*{
			field : 'middle',
			checkbox : true,
			rowspan : 2,
			align : 'center',
			valign : 'middle'
		},*/{
			field : "PK_ID",
			title : "主键",
			align : "center",
			visible:false
		},{
			field : "STAFF_ID",
			title : "人员编号",
			align : "center"
		}, {
			field : "USER_NAME",
			title : "人员名称",
			align : "center"
		}, {
			field : "W_DATE",
			title : "日期",
			align : "center"
		},{
			field : "INPUT_TIME",
			title : "报工工时",
			align : "center"
		}, {
			field : "INPUT_PERCENT",
			title : "任务完成比例",
			align : "center"
		}, {
			field : "PLAN_NAME",
			title : "任务名称",
			align : "center",
			width : "15%"
		}, {
			field : "END_TIME",
			title : "报工详情",
			align : "center",
			visible:false
		}, {
			field : "STATUS",
			title : "审批状态",
			align : "center"
		} ],
		onClickRow:function(rowIndex,rowData){
			
			
			
        }
	});
});


//人员选择模态框
$("#staff_name").click(function(){
//加载userPop.html
	/*$(window.top.document.body).append("<div id='staffPOP'></div>"); */
	$("#staffPOP").load("pages/suser/suserPop.html");
	openUserPop("staffPOP",{name:$("#staff_name"),no:$("#staff_code")});
	
});

//下拉列表数据
function initStatusSelect(){
	//初始化任务类型数据
	initSelect($("#status"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_BOOK_STATUS"});
}

//时间控件
function initDate(){
	WdatePicker({
			dateFmt : 'yyyy-MM-dd',
			minDate : '1990-01-01',
			maxDate : '2050-12-01'
	});
 }