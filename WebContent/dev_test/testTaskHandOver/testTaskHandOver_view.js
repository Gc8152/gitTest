
//查询列表显示table
function initHandOverClickButton(item) {
	var $page = getCurrentPageObj();//当前页
	autoInitSelect($page);//初始化下拉选
	var quaryHandOverCall=getMillisecond();//table回调方法名
	var project_id = item.PROJECT_ID;
	var test_round= item.TEST_ROUND;
	initHandOverRangeInfo();
	
	
	//重置按钮
	$page.find("[name='resetViewTask']").click(function(){
		$page.find("table input").val("");
		$page.find("select").val(" ").select2();
	});
	
	//查询按钮
	//getCurrentPageObj().find("#queryHandOver").unbind("click");
	getCurrentPageObj().find("[name='queryHandOver']").click(function(){	
		var param = getCurrentPageObj().find("#HandOverTaskQuerytFormView").serialize();
		getCurrentPageObj().find("#AcceptRangeViewTable").bootstrapTable('refresh',{
			url:dev_test + "testTaskHandOver/queryHandOverTaskList.asp?SID=" + SID + "&PROJECT_ID=" + project_id +"&TEST_ROUND=" + test_round +"&call=" + quaryHandOverCall +'&'+param
			});		
	});
	
	
	function initHandOverRangeInfo(){
	/*	var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset //页码
			};
			return temp;
		};*/
		$("#AcceptRangeViewTable").bootstrapTable(
				{
					//请求后台的URL（*）
					url : dev_test + "testTaskHandOver/queryHandOverTaskList.asp?SID=" + SID + "&PROJECT_ID=" + project_id+"&TEST_ROUND="+test_round + "&call=" + quaryHandOverCall,
					method : 'get', //请求方式（*）   
					striped : false, //是否显示行间隔色
					cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
					sortable : true, //是否启用排序
					sortOrder : "asc", //排序方式
					//queryParams : queryParams,//传递参数（*）
					sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
					pagination : true, //是否显示分页（*）
					pageList : [5,10,15],//每页的记录行数（*）
					pageNumber : 1, //初始化加载第一页，默认第一页
					pageSize : 10,//可供选择的每页的行数（*）
					clickToSelect : true, //是否启用点击选中行
					uniqueId : "PROJECT_ID", //每一行的唯一标识，一般为主键列
					cardView : false, //是否显示详细视图
					detailView : false, //是否显示父子表
					jsonpCallback:quaryHandOverCall,// 是否显示父子表
					onLoadSuccess : function(data){
						gaveInfo();
					},onPostBody :function(data){
						
					},
					columns : [{
						field : '',
						title : '序号',
						align : "center",
						width : "40",
						sortable: true,
						formatter: function (value, row, index) {
							return index+1;
						}
					}, {
						field : "TASK_NUM",
						title : "任务编号",
						width : "200",
						align : "center"
					}, {
						field : "TASK_NAME",
						title : "任务名称",
						width : "200",
						align : "center"
					}, {
						field : "REQ_TASK_STATE_NAME",
						title : "任务状态",
						width : "80",
						align : "center"
					}, {
						field : "PLANN_PRODUCT_TIME",
						title : "预计投产时间",
						width : "120",
						align : "center"
					}, {
						field : "REQ_TASK_TYPE_NAME",
						title : "任务类型",
						width : "80",
						align : "center"
					}, {
						field : "CHANGE_TYPE_NAME",
						title : "变更类型",
						width : "80",
						align : "center"
					}, {
						field : "PROJECT_NUM",
						title : "项目编号",
						width : "200",
						align : "center"
					}, {
						field : "PROJECT_NAME",
						title : "项目名称",
						width : "200",
						align : "center"
					}, {
						field : "SYSTEM_NAME",
						title : "应用名称",
						width : "80",
						align : "center"
					}, {
						field : "ACCEPT_RESULT_NAME",
						title : "移交受理结论",
						width : "120",
						align : "center"
					}, {
						field : "REMARK",
						title : "备注说明",
						width : "100",
						align : "center"	
					}, {
						field : "TEST_MAN_NAME",
						title : "测试人员",
						width : "100",
						align : "center"
					}]
				});
		}
};


