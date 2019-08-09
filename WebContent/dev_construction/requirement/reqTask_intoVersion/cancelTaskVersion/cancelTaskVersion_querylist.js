
initTaskCancelVersionListLayout();
//加载任务入版查询页面信息
function initTaskCancelVersionListLayout(){
	var currTab = getCurrentPageObj();
	var queryForm = currTab.find("#taskCancelVersionQuery");
	var table = currTab.find("#gReqTaskTableForCancelVersion");
	var taskCancelVersionQueryListCall=getMillisecond();
 ///初始化字典项
 autoInitSelect(queryForm);

//初始化按钮
 initTaskCancelVersionListBtn();
function initTaskCancelVersionListBtn() {

	// 查询
	currTab.find("#serach_TversionQuery").click(function() {
		var param = queryForm.serialize();
		table.bootstrapTable('refresh',{
			url:dev_construction+"reqtask_intoVersion/queryTaskForVerisonList.asp?SID="+SID+
		         "&call="+taskCancelVersionQueryListCall+"&"+param+"&menu=02"});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#serach_TversionQuery").click();});
	//重置
	currTab.find('#reset_TversionQuery').click(function() {
		queryForm[0].reset();
		currTab.find('#system_noTV').val("");//在非ie8的情况下reset()方法不能重置隐藏项
		currTab.find('#version_idTV').val("");
		var selects = currTab.find("select");
		for(var i=0; i<selects.length; i++){
			$(selects[i]).select2();
		}
	});
	
	
//取消入版
currTab.find('#cancel_version').click(function(){
	var id = table.bootstrapTable('getSelections');
	var req_task_id = $.map(id, function (row) {return row.REQ_TASK_ID;});
	var req_task_relation = $.map(id, function (row) {return row.REQ_TASK_RELATION;});
	var is_version = $.map(id, function (row) {return row.IS_VERSION;});
	var versions_id = $.map(id, function (row) {return row.VERSION_ID;});
	var system_no = $.map(id, function (row) {return row.SYSTEM_NO;});
	if(id.length==1){
	    if(req_task_relation=="02"){
		   alert("配合类任务不能取消入版");
		   return;
	      }
	    
	   if(is_version=="01"||is_version=="02"){
		  alert("该任务还没有入版");
		  return;
	   } 
	nconfirm("是否确定取消入版？",function(){
	baseAjaxJsonp(dev_construction+"reqtask_intoVersion/cancelReqTaskVersion.asp?SID="+SID+"&req_task_id="+req_task_id+"&versions_id="+versions_id+"&system_id="+system_no,null, function(data) {
			if (data != undefined && data != null && data.result=="true") {
						alert("取消入版成功");
						table.bootstrapTable("refresh");
					}else{
						var mess = data.mess;
						if(mess!=undefined){
							alert("取消入版失败:"+mess);
						}else{
						  alert("取消入版失败");
						}
					}
	       });
	});
	}else{
		alert("请选择一条任务进行操作");
	}
  });

//查看入版详情
currTab.find('#versionDetail_view').click(function(){
	var id = table.bootstrapTable('getSelections');
	var ids=JSON.stringify(id);
	var params=JSON.parse(ids);
	if(id.length==1){
	closeAndOpenInnerPageTab("versionDetail_view","需求任务入版详情","dev_construction/requirement/reqTask_intoVersion/taskVersion_detail.html",function(){
		for(var k in params[0]){
			var str=params[0][k];
			k = k.toLowerCase();//大写转换为小写
			 if(k=="req_code"){
				getCurrentPageObj().find('#TVDreq_code').text(str);
			}else if(k=="sub_req_code"){
				getCurrentPageObj().find('#TVDsub_req_code').text(str);
			}else if(k=="version_content"){
				getCurrentPageObj().find('#TVDversion_content').val(str);
			}else {
				getCurrentPageObj().find("input[name='TVD."+k+"']").val(str);
			}
		}
		//初始化同个子需求下关联任务列表
		initSubReqTaskList5Version();	
	});
	}else{
		alert("请选择一条任务进行查看");
	}
});

 //加载系统应用pop
 currTab.find('#system_nameTV').click(function(){
	openTaskSystemPop("tvsystem_pop",{sysno:currTab.find('#system_noTV'),sysname:currTab.find('#system_nameTV')});
 });	

//加载版本pop
 currTab.find('#version_nameTV').click(function(){
	openTaskVersionPop("tvVsersion_pop",{versionsid:currTab.find('#version_idTV'),versionsname:currTab.find('#version_nameTV')});
   });
 }	


//初始化列表
initTaskAcceptQueryTable();
function initTaskAcceptQueryTable() {
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		table.bootstrapTable("destroy").bootstrapTable({
					url :dev_construction+"reqtask_intoVersion/queryTaskForVerisonList.asp?SID="+SID+"&call="+taskCancelVersionQueryListCall+"&menu=02",
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
					uniqueId : "REQ_TASK_CODE", // 每一行的唯一标识，一般为主键列
					cardView : false, // 是否显示详细视图
					detailView : false, // 是否显示父子表
					jsonpCallback:taskCancelVersionQueryListCall,
					singleSelect : true,// 复选框单选
					onLoadSuccess:function(data){
						gaveInfo();
					},
					columns : [ {
						checkbox : true,
						rowspan : 2,
						align : 'center',
						valign : 'middle'
					},{
						field : 'REQ_TASK_ID',
						title : '任务序列号',
						align : "center",
						visible:false,
					},{
						field : 'SUB_REQ_ID',
						title : '需求点序列号',
						align : "center",
						visible:false,
					},{
						field : 'REQ_ID',
						title : '需求序列号',
						align : "center",
						visible:false,
					},{
						field : 'REQ_TASK_CODE',
						title : '任务编号',
						align : "center",
						width : 180,
					}, {
						field : 'REQ_TASK_NAME',
						title : '任务名称',
						align : "center",
						width : 200,
					}, {
						field : "SUB_REQ_NAME",
						title : "需求点名称",
						align : "center",
						width : 200,
					}, {
						field : "REQ_TASK_RELATION_DISPLAY",
						title : "从属关系",
						align : "center",
						width : 80,
					},  {
						field : "REQ_TASK_TYPE_DISPLAY",
						title : "任务来源",
						align : "center",
						width : 100,
					}, {
						field : "REQ_TASK_STATE_DISPLAY",
						title : "任务状态",
						align : "center",
						width : 105,
					}, {
						field : "SYSTEM_NAME",
						title : "应用名称",
						align : "center",
						width : 120,
					},{
						field : "PLAN_ONLINETIME",
						title : "计划投产时间",
						align : "center",
						width : 110,
					},/*{
						field : "IS_WORKLOAD_ASSESS",
						title : "是否工作量评估",
						align : "center",
						formatter:function(value,row,index){
							 if(value=="00") 
								 return "是";
							 else
								 return "否";
						 },
					},*/{
						field :"ANALYZE_NAME",
						title :"任务分析评审状态",
						align :"center",
						width : 130,
						formatter:function(value,row,index){
							 if(value=="" || value == undefined || value==null) 
								 return "未评审";
							 else
								 return value;
						 },
					},{
						field : "JOIN_NOTACCEPT",
						title : "协办未受理数",
						align : "center",
						width : 105,
					},{
						field : "IS_VERSION",
						title : "是否入版",
						align : "center",
						width : 80,
						formatter:function(value,row,index){
							 if(value=="00") 
								 return "是";
							 else
								 return "否";
						 },
					},{
						field : "VERSION_NAME",
						title : "申请纳入版本",
						align : "center",
						width : 140,
					},{
						field : "P_OWNER",
						title : "当前责任人",
						align : "center",
						visible:false,
					},{
						field : "REQ_TASK_STATE",
						title : "需求任务状态",
						align : "center",
						visible:false,
					}]
				});
	}
}
