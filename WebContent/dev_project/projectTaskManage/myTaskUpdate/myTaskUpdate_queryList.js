//初始化事件
initTaskList();

function initTaskList(){
	var $page = getCurrentPageObj();//当前页
	autoInitSelect($page);//初始化下拉选
	var formObj = $page.find("#taskUpdateForm");//表单对象
	var mytaskTable = $page.find("[tb='mytaskTable']");
	var saveCall = getMillisecond() + '3';
	//判断权限，项目经理显示打回和关闭，执行人显示执行按钮,使用创建人进行判断
	//判断权限，看是否为当前执行人
	/*var params={};
	baseAjaxJsonp(dev_project+"myProjectTask/queryUserPower.asp?SID=" + SID + "&call=" + saveCall+"&params="+params, params, function(data) {
		if(data && data.userType=="exector"){
			$page.find("button[name='backTask']").hide();
			$page.find("button[name='closeTask']").hide();
		}else{
			$page.find("button[name='yesTask']").hide();
		}
	},saveCall,false);*/
	//初始化列表
	initTaskTable();
	//重置按钮
	$page.find("[name='resetTask']").click(function(){
		$page.find("table input").val("");
		$page.find("select").val(" ").select2();
		
	});
	
	//查询按钮
	 $page.find("[name='queryTask']").click(function(){
		 var param = formObj.serialize();
		 mytaskTable.bootstrapTable('refresh',{
				url:dev_project+"myProjectTask/querymyUpdateTaskList.asp?SID=" + SID + "&call=jq_1524706312861&"+param});
	 });
	//enter触发查询
		enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("[name='queryTask']").click();});
	 
	 //打回
	 $page.find("[name='backTask']").unbind("click").click(function(){
		 var seles = mytaskTable.bootstrapTable("getSelections");
			if(seles.length!=1){
					alert("请选择一条数据!");
					return;
			}
			if(seles[0].TASK_STATE=='02'){
				alert("该任务未执行，不能打回");
				return;
			}
			if(seles[0].TASK_STATE=='05'){
				alert("该任务已打回");
				return;
			}
			closeAndOpenInnerPageTab("myTaskUpdate","开发任务打回","dev_project/projectTaskManage/myTaskUpdate/myTaskUpdate_backup.html", function(){
				backupMyTask(seles[0]);
			});
	 });	

	 //关闭
	 $page.find("[name='closeTask']").unbind("click").click(function(){
		 var seles = mytaskTable.bootstrapTable("getSelections");
			if(seles.length!=1){
					alert("请选择一条数据!");
					return;
			}
			if(seles[0]["TASK_STATE"]!="04"){
				alert("该任务未完成，不可关闭！");	
				return;
			}
			nconfirm("确定关闭？",function(){
				var params = {};
				params["P_TASK_ID"]=seles[0].P_TASK_ID;
				params["TASK_STATE"]="06";//06为关闭状态
				var saveCall = getMillisecond() + '3';
				baseAjaxJsonp(dev_project+"myProjectTask/changeTaskState.asp?SID=" + SID + "&call="+saveCall+"&params="+params, params, function(data) {
					if(data && data.result=="true"){
						
						alert("关闭成功");
						mytaskTable.bootstrapTable("refresh",{
							url:dev_project+"myProjectTask/querymyUpdateTaskList.asp?SID="+SID+ "&call=jq_1524706312861"});
						
					}else{
						alert(data.msg);
					}
				},saveCall,false);
				

			});				
	 });	
	 
	 
	 //初始化表
	function initTaskTable() {
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		mytaskTable.bootstrapTable({
					url : dev_project+"myProjectTask/querymyUpdateTaskList.asp?SID=" + SID + "&call=jq_1524706312861" ,
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
					jsonpCallback:"jq_1524706312861",
					onLoadSuccess : function(data){
						gaveInfo();
					},
					columns : [ {
						checkbox : true,
						rowspan : 2,
						align : 'center',
						valign : 'middle'
					},{
						field : 'P_TASK_ID',
						title : '序号',
						align : "center",
						width : "60",
						formatter:function(value,row,index){
							return index + 1;
						}
					}, {
						field : "TASK_NAME",
						title : "任务名称",
						width : "180",
						align : "center"
					}, {
						field : "TASK_TYPE_NAME",
						title : "任务类型",
						width : "180",
						align : "center"
					},{
						field : "TASK_STATE_NAME",
						title : "任务状态",
						width : "100",
						align : "center"
					},{
						field : "PROJECT_NAME",
						title : "所属项目",
						align : "center",
						width : "180"
					},{
						field : "REQ_TASK_NAME",
						title : "需求任务",
						align : "center",
						width : "180"
					},{
						field : "TASK_LEVEL_NAME",
						title : "任务优先级",
						align : "center",
						width : "180"
					},{
						field : "EXECUTOR_NAME",
						title : "执行人",
						align : "center",
						width : "120"
					},{
						field : "PLAN_STARTTIME",
						title : "计划开始时间",
						align : "center",
						width : "120"
					},{
						field : "PLAN_ENDTIME",
						title : "计划完成时间",
						align : "center",
						width : "120"
					},{
						field : "ACTUAL_STARTTIME",
						title : "实际开始时间",
						align : "center",
						width : "120"
					},{
						field : "ACTUAL_ENDTIME",
						title : "实际完成时间",
						align : "center",
						width : "120"
					}]
				});
	}
	function refreshTable(){
		mytaskTable.bootstrapTable('refresh',{
			url:dev_project+"myProjectTask/querymyUpdateTaskList.asp?SID=" + SID + "&call=jq_1524706312861" });
	}
	
}



