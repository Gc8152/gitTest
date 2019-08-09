initClickButtonEvent();

//按钮方法
function initClickButtonEvent(){
	var $page = getCurrentPageObj();//当前页
	var quaryHandOver=getMillisecond();
	AcceptTableInfo(quaryHandOver);
	//查询
	getCurrentPageObj().find("[name='queryHandOver']").unbind("click");
	getCurrentPageObj().find("[name='queryHandOver']").click(function(){	
		var params = $page.find("#HandOverQuerytForm").serialize();
		$page.find("#accepttable").bootstrapTable('refresh',
				{url:dev_test+'testTaskHandOver/queryHandOverlist.asp?call='+quaryHandOver+'&SID='+SID+'&'+params});		
	});
	//enter触发查询
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("[name='queryHandOver']").click();});
	//重置按钮
	$page.find("[name='resetHandOver']").click(function(){
		$page.find("table input").val("");
		$page.find("select").val(" ").select2();
	});

	//受理移交测试任务
	$page.find("#accept_transfer_test_tasks").unbind("click");
	$page.find("#accept_transfer_test_tasks").click(function(){	
		var seles = getCurrentPageObj().find("#accepttable").bootstrapTable('getSelections');
		if(seles.length != 1) {
			alert("请选择一条数据进行操作!");
			return;
		}
		if(seles[0].ACCEPT_STATE != '12'){
			alert("该项目已受理");
			return;
		}
		else{
		closeAndOpenInnerPageTab("accept_transfer_test_tasks_view","受理移交测试任务","dev_test/testTaskHandOver/testTaskHandOver_edit.html", function(){
			initHandOverClickButton(seles[0]);
		});
		}
	});	
	
	//查看详情
	$page.find("#view_details").unbind("click");
	$page.find("#view_details").click(function(){

		var seles = getCurrentPageObj().find("#accepttable").bootstrapTable('getSelections');
		if(seles.length != 1) {
			alert("请选择一条数据进行操作!");
			return;
		}				
		else{ 
			closeAndOpenInnerPageTab("handOverview","查看详情","dev_test/testTaskHandOver/testTaskHandOver_view.html", function(){
				initHandOverClickButton(seles[0]);
					});
		}
	});	
}
	
//查询列表显示table
function AcceptTableInfo(quaryHandOver) {
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$("#accepttable").bootstrapTable(
			{
				//请求后台的URL（*）
				url :dev_test+'testTaskHandOver/queryHandOverlist.asp?call='+quaryHandOver+'&SID='+SID,
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
				jsonpCallback:quaryHandOver,
				singleSelect: true,
				onLoadSuccess : function(data){
					gaveInfo();
				},
				columns : [ {
					checkbox : true,
					rowspan : 2,
					align : 'center',
					valign : 'middle'
				},{
					field : '',
					title : '序号',
					align : "center",
					width : "40",
					sortable: true,
					formatter: function (value, row, index) {
						return index+1;
					}
				}, {
					field : "PROJECT_NUM",
					title : "项目编号",
					width : "180",
					align : "center"
				}, {
					field : "PROJECT_NAME",
					title : "项目名称",
					width : "300",
					align : "center"
				}, {
					field : "VERSION_NAME",
					title : "版本名称",
					width : "200",
					align : "center"
				}, {
					field : "SYSTEM_NAME",
					title : "应用名称",
					width : "120",
					align : "center"
				}, {
					field : "TEST_ENV_NAME",
					title : "测试类型",
					align : "center",
					width : "120"
				}, {
					field : "TEST_ROUND",
					title : "测试轮次",
					align : "center",
					width : "80"
				}, {
					field : "HAND_OVER_TIME",
					title : "移交时间",
					align : "center",
					width : "160"
				}, {
					field : "ACCEPT_STATE_NAME",
					title : "执行状态",
					align : "center",
					width : "80"
				}, {
					field : "TEST_VERSION",
					title : "测试版本号",
					align : "center",
					width : "160"
				}, {
					field : "VERSION_DATE",
					title : "版本发布日期",
					align : "center",
					width : "150"
				}, {
					field : "ACCERT_TASK_NUM",
					title : "移交任务数",
					align : "center",
					width : "100"
				}, {
					field : "ACCEPT_DEFECT_NUM",
					title : "移交缺陷数",
					align : "center",
					width : "100"
				}]
			});
};


