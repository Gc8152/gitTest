	
function initviewsitTurnover(item){
	var currTab = getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题

	var table = currTab.find("#table_sit");
	var queryParams = {};
	queryParams["REQ_TASK_ID"] = item.REQ_TASK_ID;
	//任务SIT移交记录列表
	table.bootstrapTable('destroy').bootstrapTable({
		//请求后台的URL（*）
		url : dev_construction+'SitTurnover/queryListSitToTask.asp?SID='+SID,
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
		uniqueId : "SIT_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		//jsonpCallback:tableCall,
		singleSelect: true,
		columns : [ {
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		}, {
			field : 'REQ_TASK_CODE',
			title : '需求任务编号',
			align : "center"
		}, {
			field : "REQ_TASK_NAME",
			title : "需求任务名称",
			align : "center"
		}, {
			field : "TEST_VERSION_ID",
			title : "测试版本号",
			align : "center"
		}, {
			field : "VERSION_PUSH_DATA",
			title : "版本发布日期",
			align : "center"
		}, {
			field : "ACCEPT_STATUS_NAME",
			title : "受理状态",
			align : "center"
		}, {
			field : "OPT_PERSON_NAME",
			title : "提交人",
			align : "center"
		}, {
			field : "DID",
			title : "操作",
			align : "center",
			formatter: function (value, row, index) {
				return '<span class="hover-view" '+
				'onclick="initSitTaskInfo(\''+row.SIT_ID+'\')">查看</span>';
			}
		}]
	});
	
	//返回
	var back = currTab.find("#back_sit");
	back.click(function(){
		closeCurrPageTab();
	});
	
}

function initSitTaskInfo(task_id){
	var currTab = getCurrentPageObj();
	currTab.find("#SIT_INFO").show();
	var call = getMillisecond();
	var param = {};
	param["SIT_ID"] = task_id;
	baseAjaxJsonp(dev_construction+"SitTurnover/queryListSitTuById.asp?call="+call+"&SID="+SID,param, function(data){
		if (data != undefined && data != null && data.result=="true" ) {
			for (var key in data) {
				currTab.find("div[name="+key+"]").html(data[key]);
			}
		}else{ 
			alert(data.msg);
		}
	}, call);
	
	
}
