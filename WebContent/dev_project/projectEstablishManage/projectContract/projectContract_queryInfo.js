function initviewcontract(data){
	var currTab = getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题
	//赋值
	for (var key in data) {
		currTab.find("div[name="+key+"]").html(data[key]);
	}
	/*var call = getMillisecond();
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
	});*/
	//返回按钮
	var back = currTab.find("#back");
	back.click(function(){
		closeCurrPageTab();
	});
}


//页面内容收缩
$(function(){
      EciticTitleI();
})
