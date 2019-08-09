//初始化事件
initDesignList();

function initDesignList(){
	var $page = getCurrentPageObj();//当前页
	autoInitSelect($page);//初始化下拉选
	var formObj = $page.find("#designForm");//表单对象
	var initTableCall = getMillisecond();//table回调方法名
	var testCases = $page.find("[tb='testCases']");
	
	//初始化列表
	inittestCases();
	//重置按钮
	$page.find("[name='resetDesign']").click(function(){
		$page.find("table input").val("");
		$page.find("select").val(" ").select2();
	});
	
	//查询按钮
	 $page.find("[name='queryCases']").click(function(){
		 var param = formObj.serialize();
		 testCases.bootstrapTable('refresh',{
			    url:dev_test+"designTestCases/queryDesignList.asp?SID=" + SID + "&call=" + initTableCall +'&'+param});
	 });
	//enter触发查询
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("[name='queryCases']").click();});
	//测试案例设计
	 $page.find("[name='testCasesDedign']").click(function(){
		 var seles = testCases.bootstrapTable("getSelections");
			if(seles.length!=1){
					alert("请选择一条数据进行案例设计!");
					return;
			}
			var test_task_state = seles[0].TEST_TASK_STATE;
			if("02"==test_task_state){
				alert('已完成任务的不能重复设计!');
				return ;
			}
//			if(seles[0].REQ_CHANGE_STATUS !="00"){
//				alert("该申请不是草拟状态");
//				return;
//			}
			 closeAndOpenInnerPageTab("designTestCases","测试案例设计","dev_test/designTestCases/casesDesign_view.html", function(){
				 designTestCases(seles[0]);
				});
	 });
	 
	
	/*//测试案例评审
	 $page.find("[name='testCasesReview']").click(function(){
		 var seles = testCases.bootstrapTable("getSelections");
			if(seles.length!=1){
					alert("请选择一条数据!");
					return;
			}
			var accept_state = seles[0].ACCEPT_STATE;
			if(accept_state != '08'){
				alert('该项目不在待评审状态');
				return;
			}
			if(accept_state == '09'){
				alert('该项目已经发起评审');
				return;
			}
			var params = {};
			params["PROJECT_ID"] = seles[0].PROJECT_ID;
			params["PROJECT_NAME"] = seles[0].PROJECT_NAME;
			nconfirm("确定发起评审?",function(){
				var juryCall = getMillisecond();
				baseAjaxJsonp(dev_test+"designTestCases/designCaseJury.asp?SID=" + SID + "&call=" + juryCall, params, function(data) {
					if(data && data.result=="true"){
						alert(data.msg);
						refreshTable();
					}else{
						alert(data.msg);
					}
				},juryCall,false);
    		});
		
		
	 });*/
	 
	 
	//案例设计完成 
	 $page.find("[name='testCasesEnd']").click(function(){
		 var seles = testCases.bootstrapTable("getSelections");
			if(seles.length!=1){
					alert("请选择一条数据!");
					return;
			}
			var test_task_state = seles[0].TEST_TASK_STATE;
			if("02"==test_task_state){
				alert('已完成任务的不能重复完成!');
				return ;
			}
		/*	var accept_state = seles[0].ACCEPT_STATE;
			if(accept_state != '02' && accept_state != '13'){
				alert('该项目不在待设计或设计中状态');
				return;
			}*/
			var params = {};
			params["PROJECT_ID"] = seles[0].PROJECT_ID;
			params["TEST_TASK_ID"] = seles[0].TEST_TASK_ID;
			
			var NOTDESIGNED_num = seles[0].NOTDESIGNED;
			if(NOTDESIGNED_num > 0){//待设计案例数大于零
				nconfirm("存在测试要点未完成案例设计，确定完成案例设计？",function(){
					var endCall = getMillisecond();
					baseAjaxJsonp(dev_test+"designTestCases/designCaseEnd.asp?SID=" + SID + "&call=" + endCall, params, function(data) {
						if(data && data.result=="true"){
							alert(data.msg);
							refreshTable();
						}else{
							alert(data.msg);
						}
					},endCall,false);
	    		});
			}else{
				nconfirm("确定完成案例设计?",function(){
					var endCall = getMillisecond();
					baseAjaxJsonp(dev_test+"designTestCases/designCaseEnd.asp?SID=" + SID + "&call=" + endCall, params, function(data) {
						if(data && data.result=="true"){
							alert(data.msg);
							refreshTable();
						}else{
							alert(data.msg);
						}
					},endCall,false);
	    		});
			}
			
			
			
		
		
	 });
	 
	 //初始化表
	function inittestCases() {
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		testCases.bootstrapTable({
	        url : dev_test+"designTestCases/queryDesignList.asp?SID=" + SID + "&call=" + initTableCall,
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
				width : "80",
				formatter:function(value,row,index){
					return index + 1;
				}
			}, {
				field : "TEST_TASK_NAME",
				title : "任务名称",
				width : "180",
				align : "center"
			} ,{
				field : "TEST_TASK_NUM",
				title : "任务编号",
				width : "180",
				align : "center"
			} ,{
				field : "TEST_TASK_MAN_NAME",
				title : "任务执行人",
				width : "180",
				align : "center"
			}  ,{
				field : "TEST_TASK_STATE_NAME",
				title : "任务状态",
				width : "180",
				align : "center"
			}  ,{
				field : "TEST_START_DATE",
				title : "任务开始时间",
				width : "180",
				align : "center"
			} ,{
				field : "TEST_END_DATE",
				title : "任务结束时间",
				width : "180",
				align : "center"
			} ,{
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
				field : "FUNC_NUM",
				title : "功能点数",
				width : "100",
				align : "center"
			}/*, {
				field : "TESTPOINTQUANTITY",未做
				title : "测试要点数",
				width : "100",
				align : "center"
			},{
				field : "NOTDESIGNED",
				title : "待设计测试案例数",
				width : "140",
				align : "center"
			}*//*, {
				field : "PENDINGCASENUM",
				title : "待评审测试案例数",未做
				align : "center",
				width : "140"
			}*//*, {
				field : "SYSTEM_NAME",
				title : "应用名称",
				align : "center",
				width : "120"
			}*/,  {
				field : "VERSION_NAME",
				title : "版本名称",
				align : "center",
				width : "200"
			}, {
				field : "TEST_MAN_NAME",
				title : "测试经理",
				align : "center",
			}, {
				field : "ACCEPT_STATE_NAME",
				title : "项目状态",
				align : "center",
				visible:false
			}]
		});
	}
	function refreshTable(){
		testCases.bootstrapTable('refresh',{
			url:dev_test+"designTestCases/queryDesignList.asp?SID=" + SID + "&call=" + initTableCall});
	}

}




