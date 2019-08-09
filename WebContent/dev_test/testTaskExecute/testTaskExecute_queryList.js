//初始化事件
initExecuteList();

function initExecuteList(){
	var $page = getCurrentPageObj();//当前页
	autoInitSelect($page);//初始化下拉选
	var formObj = $page.find("#executeForm");//表单对象
	var initTableCall = getMillisecond();//table回调方法名
	var testExecute = $page.find("[tb='testExecute']");
	
	//初始化列表
	inittestExecute();
	//重置按钮
	$page.find("[name='resetExecute']").click(function(){
		$page.find("table input").val("");
		$page.find("select").val(" ").select2();
	});
	
	//查询按钮
	 $page.find("[name='queryExecute']").click(function(){
		 var param = formObj.serialize();
		 testExecute.bootstrapTable('refresh',{
                   url:dev_test+"testTaskExecute/queryExecuteList.asp?SID=" + SID + "&call=" + initTableCall +'&'+param});
	 });
	//enter触发查询
		enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("[name='queryExecute']").click();});
	//执行测试
	 $page.find("[name='testExecute']").click(function(){
		 var seles = testExecute.bootstrapTable("getSelections");
			if(seles.length!=1){
					alert("请选择一条数据进行提交!");
					return;
			}
			if (seles[0].ACCEPT_STATE == '05'){
				alert("该项目状态为已完成!");
				return;
		}
			 //修改状态
		if(seles[0].ACCEPT_STATE =='10'){
			if(seles[0].HAND_OVER_STATE=='00'){
			alert("该项目没有移交的任务和缺陷不能执行");	
			return;
			}
			else{
		    var eCall = getMillisecond();
			var ACCEPT_STATE = '11';
			var PROJECT_ID = seles[0].PROJECT_ID;
			var TEST_ROUND = seles[0].TEST_ROUND;
		    baseAjaxJsonp(dev_test+"testTaskExecute/editAcceptState.asp?SID=" + SID +"&ACCEPT_STATE=" +ACCEPT_STATE+"&PROJECT_ID=" +PROJECT_ID +"&TEST_ROUND="+TEST_ROUND+"&call=" + eCall,null,function(data) {
				if(data && data.result=="true"){
				}
			},eCall,false);}
		}
		  closeAndOpenInnerPageTab("testExecute","测试案例执行","dev_test/testTaskExecute/executeTest_view.html", function(){
				 testTaskExecute(seles[0]);
				});
		
			 
	 });
	//完成测试
	 $page.find("[name='testFinish']").click(function(){
		 var seles = testExecute.bootstrapTable("getSelections");
			if(seles.length!=1){
					alert("请选择一条数据进行提交!");
					return;
			}
			if (seles[0].ACCEPT_STATE == '05'){
					alert("该项目状态为已完成!");
					return;
			}
			if(seles[0].ACCEPT_STATE == '10'){
				alert("该项目还未执行测试不能结束!");
				return;
			}
			if(seles[0].ACCEPT_STATE == '11'){
//				debugger;
				if(seles[0].HAND_OVER_STATE=='02'){
					var testCall = getMillisecond();
					var ACCEPT_STATE = '05';
					var PROJECT_ID = seles[0].PROJECT_ID;
					var TEST_ROUND = seles[0].TEST_ROUND;
					baseAjaxJsonp(dev_test+"testTaskExecute/saveTestState.asp?SID=" + SID +"&ACCEPT_STATE=" +ACCEPT_STATE+"&PROJECT_ID=" +PROJECT_ID +"&TEST_ROUND="+TEST_ROUND+"&call=" + testCall, null,function(data) {
						if(data && data.result=="true"){
							alert(data.msg);
							 testExecute.bootstrapTable('refresh',{
				                   url:dev_test+"testTaskExecute/queryExecuteList.asp?SID=" + SID + "&call=" + initTableCall});
						}else{
							alert(data.msg);
						}
					},testCall,false);
					}
				else{
					
					alert("该项目还有未移交的任务和缺陷不能结束测试");	
					return;
				}
				
			}
	 });
	
	
	//测试案例评审
	 $page.find("button[name='detail']").click(function(){
		 closeAndOpenInnerPageTab("detail","缺陷详情","dev_test/defectManagement/details/defect_viewdetail.html", function(){
			 defectAdd(null);
			});
	 }); 
	 
	  //初始化表
	function inittestExecute() {
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		testExecute.bootstrapTable({
					url : dev_test+"testTaskExecute/queryExecuteList.asp?SID=" + SID + "&call=" + initTableCall,
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
					uniqueId : "PROJECT_NUM", // 每一行的唯一标识，一般为主键列
					cardView : false, // 是否显示详细视图
					detailView : false, // 是否显示父子表
					singleSelect : true,// 复选框单选
					jsonpCallback:initTableCall,
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
						width : "50",
						formatter:function(value,row,index){
							return index + 1;
						}
					}, {
						field : "PROJECT_NUM",
						title : "项目编号",
						width : "200",
						align : "center"
					}, {
						field : "PROJECT_NAME",
						title : "项目名称",
						width : "380",
						align : "center"
					}, {
						field : "VERSIONS_NAME",
						title : "版本名称",
						width : "300",
						align : "center"
					},{
						field : "TEST_TYPE",
						title : "测试类型",
						width : "80",
						align : "center",
						visible:false
					}, {
						field : "TEST_COUNT_NAME",
						title : "测试轮次",
						align : "center",
						width : "80"
					}, {
						field : "ACCEPT_STATE_NAME",
						title : "执行状态",
						align : "center",
						width : "120",
						visible: false
					},  {
						field : "TEST_VERSION",
						title : "测试版本号",
						align : "center",
						width : "100",
						visible: false
					}, {
						field : "VERSION_PUSH_DATA",
						title : "版本发布日期",
						align : "center",
						width : "120"
					}, {
						field : "SYSTEM_NAME",
						title : "应用名称",
						width : "120",
						align : "center"
					},{
						field : "HAND_OVER_STATE_NAME",
						title : "移交状态",
						width : "80",
						align : "center",
						visible: false
					}, {
						field : "COUNT_TASK",
						title : "移交任务数",
						align : "center",
						width : "100"
					}, {
						field : "HAND_OVER_DEFECT_NUM",
						title : "移交缺陷数",
						align : "center",
						width : "100",
						visible: false
					},  {
						field : "CASE_COUNT",
						title : "执行案例数",
						align : "center",
						width : "100"
					},  {
						field : "EXECUTED_CASE_COUNT",
						title : "已执行案例数",
						align : "center",
						width : "100"
					}, {
						field : "HAND_OVER_DEFECT_NUM",
						title : "发现缺陷数",
						align : "center",
						width : "100",
						visible: false
					}]
				});
	}
	
}