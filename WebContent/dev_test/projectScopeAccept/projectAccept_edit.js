//初始化事件

function initTaskList(item){
	//debugger;
	var $page = getCurrentPageObj();//当前页
	autoInitSelect($page);//初始化下拉选
	var formObj = $page.find("#taskForm");//表单对象
	var initTableCall = getMillisecond();//table回调方法名
	var taskTable = $page.find("[tb='taskTable']");
	var project_id = item.PROJECT_ID;
    for (var k in item){
    	getCurrentPageObj().find("#"+k).text(item[k]);
    }
    
	initTaskTable();//初始化列表
	//重置按钮
	$page.find("[name='resetTask']").click(function(){
		$page.find("table input").val("");
		$page.find("select").val(" ").select2();
	});
	
	//查询按钮
	 $page.find("[name='queryTask']").click(function(){
		 var param = formObj.serialize();
		 taskTable.bootstrapTable('refresh',{
		 url:dev_test + "projectScopeAccept/queryTaskList.asp?SID=" + SID + "&PROJECT_ID=" + project_id +"&call=" + initTableCall +'&'+param});
	 });

	 
	//保存
	$page.find("[btn='saveAccept']").click(function(){
		
		saveAccept('save');
		
	});
	//保存&提交
	$page.find("[btn='saveSubmitAccept']").click(function(){
		
		saveAccept('submit');
		
	});
		
	function saveAccept(type){
		var params = {};
		params["TYPE"] = type;
		params["PROJECT_ID"] = project_id;
		var tableDate = getCurrentPageObj().find("[tb='taskTable']").bootstrapTable('getData');
		//console.log(tableDate);
		if(0 == tableDate.length){
			params["ACCEPT_INFO"] = '';
		}else{
			var acceptInfo = new Array();
			for(var k =0;k<tableDate.length;k++){
				if(tableDate[k].ACCEPT_RESULT != undefined && 
						tableDate[k].ACCEPT_RESULT != ''){
					if(tableDate[k].ACCEPT_RESULT == '01' && tableDate[k].REMARK == ''){
						alert("受理结论为“不受理”的任务，备注是必填");
						return;
					}
					acceptInfo.push({"TASK_ID":tableDate[k].TASK_ID,
						 "ACCEPT_RESULT":tableDate[k].ACCEPT_RESULT,
						 "REMARK":tableDate[k].REMARK});
				}
			}
			params["ACCEPT_INFO"] = JSON.stringify(acceptInfo);
		}
		
		var acceptCall = getMillisecond();
		baseAjaxJsonp(dev_test+"projectScopeAccept/saveAccept.asp?SID=" + SID + "&call=" + acceptCall, params, function(data) {
			if(data && data.result=="true"){
				alert(data.msg);
				closeCurrPageTab();
			}else{
				alert(data.msg);
			}
		},acceptCall,false);
				
	}
		
	 
	 //初始化表
	function initTaskTable() {
	
		taskTable.bootstrapTable({
					url : dev_test + "projectScopeAccept/queryTaskList.asp?SID=" + SID + "&PROJECT_ID=" + project_id + "&call=" + initTableCall,
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
					jsonpCallback:initTableCall,
					onLoadSuccess : function(data){//debugger;
						gaveInfo();
						autoInitSelect($page);
					},onPostBody :function(data){//debugger;
						var bootData = getCurrentPageObj().find("[tb='taskTable']").bootstrapTable("getData");
						var inputs = getCurrentPageObj().find("[tb='taskTable']").find("input");
						inputs.unbind("change").bind("change", function(e){//debugger;
							if($(this).attr("name") != 'btSelectItem'){
								var index = $(this).attr("index");
								var bootrow = bootData[index];
								bootrow[$(this).attr("name")] = $(this).val();
							}
						});
						var seles = getCurrentPageObj().find("[tb='taskTable']").find("select");
						seles.unbind("change").bind("change", function(e){//debugger;
							var index = $(this).attr("index");
							var bootrow2 = bootData[index];
							bootrow2[$(this).attr("name")] = $(this).val();
						});
						
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
						field : "ACCEPT_RESULT",
						title : "受理结论",
						align : "center",
						formatter: function (value, row, index) {
							return "<select   name='ACCEPT_RESULT'  index='"+index+"' value='"+value+"'      diccode='TM_DIC_ACCEPT_RESULT'  class='requirement-ele-width' style='width: 100%'></select>" ;
						}
					}, {
						field : "REMARK",
						title : "备注说明",
						align : "center",
						formatter: function (value, row, index) {
							if(undefined == row.REMARK){
								row.REMARK = '';
							}
							return "<input type='text' name='REMARK' index='"+index+"' value='"+row.REMARK+"'>" ;
						}
					}]
				});
	}
	
}