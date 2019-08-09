function initWeeklyList(p) {
	var queryParams=function(params){
		temp = {};
		temp["sub_req_code"] = p;
		temp["limit"] = params.limit;
		temp["offset"] = params.offset;
		return temp;
	};
	var call = getMillisecond()+'1';
	getCurrentPageObj().find("#weeklyListTable").bootstrapTable(
			{
				url : dev_construction+'UatTracking/queryallweekly.asp?call='+call+'&SID='+SID,
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
				uniqueId : "id", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: true,
				jsonpCallback: call,
				onLoadSuccess:function(data){
					gaveInfo();
				},
				columns : [ {
					field: 'middle',
					checkbox: true,
					rowspan: 2,
					align: 'center',
					valign: 'middle'
				},{
					field : 'ID',
					title : '主键',
					align : 'center',
					visible:false
				},{
					field : 'SUB_REQ_CODE',
					title : '需求点编号',
					align : 'center',
				},{
					field : 'SUB_REQ_NAME',
					title : '需求点名称',
					align : "center"
				},{
					field : "TEST_PERSON",
					title : "测试人员",
					align : "center"
				}, {
					field : "UAT_START_TIME",
					title : "UAT开始时间",
					align : "center"
				}, {
					field : "UAT_END_TIME",
					title : "UAT结束时间",
					align : "center"
				}, {
					field : "WEEKLY_PERIOD",
					title : "周报周期(时间段)",
					align : "center"
				}, {
					field : "TEST_NUM",
					title : "测试人数",
					align : "center"
				}, {
					field : "TEST_WORKLOAD",
					title : "测试工作量（人天）",
					align : "center"
				}, {
					field : "TEST_STAGE",
					title : "测试阶段",
					align : "center"
				}, {
					field : "TEST_EXAMPLE",
					title : "测试用例数",
					align : "center"
				}, {
					field : "EXA_EXECUTE_NUM",
					title : "用例执行数",
					align : "center"
				}, {
					field : "EXA_PASS_NUM",
					title : "用例通过数",
					align : "center"
				}, {
					field : "EXECUTE_RATE",
					title : "执行率",
					align : "center"
				}, {
					field : "PASS_RATE",
					title : "通过率",
					align : "center"
				}, {
					field : "PRO_PROBLEM",
					title : "需求/项目问题或风险",
					align : "center"
				}   ]
			});
}

//初始化页面按钮事件
(function() {
	getCurrentPageObj().find("#weeklyDetail").unbind("click");
	getCurrentPageObj().find("#weeklyDetail").click(function(){
		var selection = getCurrentPageObj().find("#weeklyListTable").bootstrapTable('getSelections');
		if(selection.length!=1){
			alert("请选择一条数据进行操作!");
			return ;
		}
		var ids = $.map(selection, function (row) {
			return row.ID;                    
		});
		closeAndOpenInnerPageTab("uatTracking_weeklyDetail","UAT周报详情","dev_construction/uat_test/uattracking/uatTracking_weeklyDetail.html",function(){
			initWeeklyDetail(ids);
		});
	});
})();