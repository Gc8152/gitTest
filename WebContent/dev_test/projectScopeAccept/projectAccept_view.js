//初始化事件

function viewTaskList(item){
	var $page = getCurrentPageObj();//当前页
	autoInitSelect($page);//初始化下拉选
	var formObj = $page.find("#viewTaskForm");//表单对象
	var viewCall = getMillisecond();//table回调方法名
	var viewTaskTable = $page.find("[tb='viewTaskTable']");
	var project_id = item.PROJECT_ID;
	var $page = getCurrentPageObj();//当前页
	autoInitSelect($page);//初始化下拉选
	var formObj = $page.find("#taskForm");//表单对象
	var initTableCall = getMillisecond();//table回调方法名
	var taskTable = $page.find("[tb='taskTable']");
	var project_id = item.PROJECT_ID;

    for (var k in item){
    	getCurrentPageObj().find("#"+k).text(item[k]);
    }
	initViewTaskTable();//初始化列表
	//重置按钮
	$page.find("[name='resetViewTask']").click(function(){
		$page.find("table input").val("");
		$page.find("select").val(" ").select2();
	});
	
	//查询按钮
	 $page.find("[name='queryViewTask']").click(function(){
		 var param = formObj.serialize();
		 viewTaskTable.bootstrapTable('refresh',{
		 url:dev_test + "projectScopeAccept/queryTaskList.asp?SID=" + SID + "&PROJECT_ID=" + project_id +"&call=" + viewCall +'&'+param});
	 });

	 
	
	 
	 //初始化表
	function initViewTaskTable() {
	
		viewTaskTable.bootstrapTable({
					url : dev_test + "projectScopeAccept/queryTaskList.asp?SID=" + SID + "&PROJECT_ID=" + project_id + "&call=" + viewCall,
					method : 'get', // 请求方式（*）
					striped : false, // 是否显示行间隔色
					cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
					sortable : true, // 是否启用排序
					sortOrder : "asc", // 排序方式
					//queryParams : queryParams,// 传递参数（*）
					sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
					pagination : true, // 是否显示分页（*）
					pageList : [ 5, 10, 15 ], // 可供选择的每页的行数（*）
					pageNumber : 1, // 初始化加载第一页，默认第一页
					pageSize : 10, // 每页的记录行数（*）
					clickToSelect : true, // 是否启用点击选中行
					// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
					uniqueId : " ", // 每一行的唯一标识，一般为主键列
					cardView : false, // 是否显示详细视图
					detailView : false, // 是否显示父子表
					singleSelect : true,// 复选框单选
					jsonpCallback:viewCall,
					onLoadSuccess : function(data){//debugger;
						gaveInfo();
					},onPostBody :function(data){
						
					},
					columns : [ {
						checkbox : true,
						rowspan : 2,
						align : 'center',
						valign : 'middle'
					},{
						field : 'ORDER_ID',
						title : '序号',
						align : "center",
						formatter:function(value,row,index){
							return index + 1;
						}
					}, {
						field : "TASK_NUM",
						title : "任务编号",
						align : "center"
					}, {
						field : "TASK_NAME",
						title : "任务名称",
						align : "center"
					}
//					, {
//						field : " ",
//						title : "任务状态",
//						align : "center"
//					}, {
//						field : "TASK_TYPE_NAME",
//						title : "任务类型",
//						align : "center"
//					}, {
//						field : "CHANGE_TYPE_NAME",
//						title : "变更类型",
//						align : "center"
//					}
					, {
						field : "SYSTEM_NAME",
						title : "应用名称",
						align : "center"
					}, {
						field : "ACCEPT_RESULT_NAME",
						title : "受理结论",
						align : "center"
					}, {
						field : "REMARK",
						title : "备注说明",
						align : "center"
					}]
				});
	}
	
}