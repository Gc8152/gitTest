//初始化事件
initAnalyzeList();

function initAnalyzeList(){
	var $page = getCurrentPageObj();//当前页
	autoInitSelect($page);//初始化下拉选
	var formObj = $page.find("#analyzeForm");//表单对象
//	var taskTableCall = getMillisecond();//table回调方法名
	var taskAnalzyeTable = $page.find("[tb='taskAnalyzeTable']");
	
	//初始化列表
	initTaskAnalzyeTable();
	//重置按钮
	$page.find("[name='resetTask']").click(function(){
		$page.find("table input").val("");
		$page.find("select").val(" ").select2();
		
	});
	
	//查询按钮
	 $page.find("[name='queryTask']").click(function(){
		 var param = formObj.serialize();
		 taskAnalzyeTable.bootstrapTable('refresh',{
				url:dev_test+"testTaskAnalyze/queryAnalyzeList.asp?SID=" + SID + "&call=jq_1524706312869_ttc&"+param});
	 });
	//enter触发查询
		enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("[name='queryTask']").click();});

	 
	//分析测试任务
	 $page.find("[name='taskAnalyze']").click(function(){
		 var seles = taskAnalzyeTable.bootstrapTable("getSelections");
			if(seles.length!=1){
					alert("请选择一条数据!");
					return;
			}

			 closeAndOpenInnerPageTab("testTaskAnalyze","分析测试任务","dev_test/testTaskAnalyze/testTaskAnalyze_edit.html", function(){
				 testTaskAnalyze(seles[0]);
				});
	 });
	 
	//分析完成
	 $page.find("[name='endAnalyze']").click(function(){
		 var seles = taskAnalzyeTable.bootstrapTable("getSelections");
			if(seles.length!=1){
					alert("请选择一条数据!");
					return;
			}
			var accept_state = seles[0].ACCEPT_STATE;
			if(accept_state != '01'){
				alert('该项目不在待分析状态');
				return;
			}
			var params = {};
			params["PROJECT_ID"] = seles[0].PROJECT_ID;
			nconfirm("确定完成测试任务分析?",function(){
				var endCall = getMillisecond();
				baseAjaxJsonp(dev_test+"testTaskAnalyze/analyzeEnd.asp?SID=" + SID + "&call=" + endCall, params, function(data) {
					if(data && data.result=="true"){
						alert(data.msg);
						refreshTable();
					}else{
						alert(data.msg);
					}
				},endCall,false);
    		});
		
		
	 });

	 //初始化表
	function initTaskAnalzyeTable() {
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		taskAnalzyeTable.bootstrapTable({
					url : dev_test+"testTaskAnalyze/queryAnalyzeList.asp?SID=" + SID + "&call=jq_1524706312869_ttc" ,
					method : 'get', // 请求方式（*）
					striped : false, // 是否显示行间隔色
					cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
					sortable : true, // 是否启用排序
					sortOrder : "asc", // 排序方式
					queryParams : queryParams,// 传递参数（*）
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
					jsonpCallback:"jq_1524706312869_ttc",
					onLoadSuccess : function(data){
						gaveInfo();
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
						width : "60",
						formatter:function(value,row,index){
							return index + 1;
						}
					}, {
						field : "PROJECT_NUM",
						title : "项目编号",
						width : "180",
						align : "center"
					}, {
						field : "PROJECT_NAME",
						title : "项目名称",
						width : "180",
						align : "center"
					},{
						field : "ACCEPT_STATE_NAME",
						title : "项目测试状态",
						width : "120",
						align : "center",
						visible:false
					},{
						field : "TASK_NUM",
						title : "任务数",
						width : "100",
						align : "center"
					}, {
						field : "ANALYZE_TASK_NUM",
						title : "已分析任务数",
						align : "center",
						width : "120"
					}, {
						field : "VERSION_NAME",
						title : "版本名称",
						align : "center",
						width : "180"
					}/*, {
						field : "SYSTEM_NAME",
						title : "应用名称",
						align : "center",
						width : "120"
					}*/, {
						field : "TEST_MAN_NAME",
						title : "测试经理",
						align : "center",
						width : "120"
					}]
				});
	}
	
	
	function refreshTable(){
		taskAnalzyeTable.bootstrapTable('refresh',{
			url:dev_test+"testTaskAnalyze/queryAnalyzeList.asp?SID=" + SID + "&call=jq_1524706312869_ttc" });
	}
	
}



