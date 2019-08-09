function initviewproject(data){
	var currTab = getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题
	//赋值
	for (var key in data) {
		currTab.find("div[name="+key+"]").html(data[key]);
	}
	var call = getMillisecond();
	//需求单列表
	$('#proDemandTable').bootstrapTable('destroy').bootstrapTable({
		//请求后台的URL（*）
		url:dev_project+"draftPro/queryListDraftDemandOrder.asp?call="+call+"&SID="+SID+'&DRAFT_ID='+data.DRAFT_ID,
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		//queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : false, //是否显示分页（*）
		pageList : [10,15],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "REQ_CODE", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:call,
		singleSelect: true,
		columns : [ /*{
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		},*/ {
			field : 'Number',
			title : '序号',
			align : "center",
			sortable: true,
			formatter: function (value, row, index) {
				return index+1;
			}
		}, {
			field : 'REQ_ID',
			title : '需求id',
			align : "center",
			visible : false
		}, {
			field : 'REQ_CODE',
			title : '需求编号',
			align : "center",
			formatter: function (value, row, index) {
				return '<span num='+row.REQ_CODE+' class="hover-view" '+
				'onclick="view_demandInfo(this)">'+value+'</span>';
			}
		}, {
			field : "REQ_NAME",
			title : "需求名称",
			align : "center"
		}, {
			field : "REQ_STATE_NAME",
			title : "需求状态",
			align : "center"
		}, {
			field : "SYSTEM_NAME",
			title : "应用名称",
			align : "center"
		}]
	});
	//var schCall = getMillisecond();
	//项目实施进度安排
	$('#schTable').bootstrapTable('destroy').bootstrapTable({
		//请求后台的URL（*）
		url:dev_project+"draftPro/queryScheduleById.asp?call=jq_1525937116858&SID="+SID+'&PROJECT_ID='+data.DRAFT_ID,
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : false, //是否显示分页（*）
		pageList : [10,15],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "Number", //每一行的唯一标识，一般为主键列.
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:"jq_1525937116858",
		singleSelect: true,
		columns : [{
			field : 'Number',
			title : '序号',
			align : "center",
			sortable: true,
			formatter: function (value, row, index) {
				return index+1;
			}
		},{
			field : "BEGIN_TIME",
			title : "开始时间",
			align : "center"
		}, {
			field : "END_TIME",
			title : "结束时间",
			align : "center"
		}, {
			field : "SCHEDULE_CONTENT",
			title : "实施内容和目标",
			align : "center"
		}]
	});
	
	//项目协作部门列表
	$('#departmentTable').bootstrapTable('destroy').bootstrapTable({
		//请求后台的URL（*）
		url:dev_project+"draftPro/queryDepartmentById.asp?call=jq_1525937116857&SID="+SID+'&PROJECT_ID='+data.DRAFT_ID,
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		//queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : false, //是否显示分页（*）
		pageList : [10,15],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "uid", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:"jq_1525937116857",
		singleSelect: true,
		columns : [  {
			field : 'uid',
			title : '序号',
			align : "center",
			sortable: true,
			formatter: function (value, row, index) {
				return index+1;
			}
		},{
			field : "DEPARTMENT_NAME",
			title : "部门名称",
			align : "center"
		}, {
			field : "DEPARTMENT_MAN",
			title : "部门负责人",
			align : "center"
		}, {
			field : "DEPARTMENT_PHONE",
			title : "部门联系电话",
			align : "center"
		}]
	});
	
	
	//项目经费来源预算
	$('#budgetTable').bootstrapTable('destroy').bootstrapTable({
		//请求后台的URL（*）
		url:dev_project+"draftPro/queryBudgetById.asp?call=jq_1525937116856&SID="+SID+'&PROJECT_ID='+data.DRAFT_ID,
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		//queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : false, //是否显示分页（*）
		pageList : [10,15],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "Number", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:"jq_1525937116856",
		singleSelect: true,
		columns : [{
			field : 'Number',
			title : '序号',
			align : "center",
			sortable: true,
			formatter: function (value, row, index) {
				return index+1;
			}
		},{
			field : "BUDGET_SOURCE",
			title : "经费来源",
			align : "center"
		}, {
			field : "BUDGET_NUMBER",
			title : "经费预算",
			align : "center"
		}]
	});
	//返回按钮
	var back = currTab.find("#back");
	back.click(function(){
		closeCurrPageTab();
	});
}
//查看需求单详情信息
function view_demandInfo(obj){
	 var req_code=$(obj).attr("num");
	 opendemandPop("demandInfo",req_code);
}

//页面内容收缩
$(function(){
      EciticTitleI();
})
