initTaskAnalyListBtn();
initFollowerTaskQuery();
initTaskAnalyDicCode();

//加载任务状态字典
function initTaskAnalyDicCode(){
	initSelect(getCurrentPageObj().find("#req_task_stateTFV"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQTASK_STATE"});	
}

//初始化按钮
function initTaskAnalyListBtn() {

	// 查询
	getCurrentPageObj().find("#serach_fullviewtask_Query").click(function() {
		var req_task_code =  getCurrentPageObj().find('#req_task_codeTFV').val();
		var req_task_name = getCurrentPageObj().find('#req_task_nameTFV').val();
		var version_id = getCurrentPageObj().find('#version_idTFV').val();
		var system_no =  getCurrentPageObj().find('#system_noTFV').val();
		var req_task_state = getCurrentPageObj().find('#req_task_stateTFV').val();
		var plan_onlinetime = getCurrentPageObj().find('#plan_onlinetimeTFV').val();
		var plan_onlinetime1 = getCurrentPageObj().find('#plan_onlinetimeTFV1').val();
		getCurrentPageObj().find('#g_FullView_TaskTable').bootstrapTable('refresh',{
			url:dev_construction+"GFollowerTask/queryFollowerTaskList.asp?SID="+SID+'&req_task_name='+escape(encodeURIComponent(req_task_name))
			+'&req_task_code='+req_task_code+'&version_id='+version_id+'&plan_onlinetime='+plan_onlinetime+'&system_no='+system_no
			+'&req_task_state='+req_task_state+'&plan_onlinetime1='+plan_onlinetime1
		});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#serach_fullviewtask_Query").click();});
	//重置
	getCurrentPageObj().find('#reset_fullviewtask_Query').click(function() {
		  getCurrentPageObj().find("#task_fullview_Query input").val("");
			var selects = getCurrentPageObj().find("#task_fullview_Query select");
			selects.val(" ");
			selects.select2();
	});
	
	//查看详情
	getCurrentPageObj().find('#view_taskDetail').click(function() {
		var id = getCurrentPageObj().find("#g_FullView_TaskTable").bootstrapTable('getSelections');
		var req_task_id=$.map(id, function (row) {return row.REQ_TASK_ID;});
		if(id.length==1){
			closePageTab("req_taskDetail");
			closeAndOpenInnerPageTab("req_taskDetail","任务详情页面","dev_construction/requirement/requirement_analyze/task_accept/task_detail.html",function(){
			  baseAjaxJsonp(dev_construction+"req_taskaccept/queryTaskOneById.asp?SID="+SID+"&req_task_id="+req_task_id, null , function(data) {
				 if (data != undefined && data != null && data.result=="true") {
				    for(var k in data){
					var str=data[k];
					k = k.toLowerCase();//大写转换为小写
				    if(k=="req_code"){
						getCurrentPageObj().find('#TDreq_code').text(str);
					}else if(k=="sub_req_code"){
						getCurrentPageObj().find('#TDsub_req_code').text(str);
					}else if(k=="req_id"||k=="req_task_id"||k=="sub_req_id"){
						getCurrentPageObj().find("input[name='TD."+k+"']").val(str);
					}else if(k=="accept_result"){
						getCurrentPageObj().find("input[name='TD."+k+"']"+"[value="+str+"]").attr("checked",true);
					}else{
						getCurrentPageObj().find("span[name='TD."+k+"']").text(str);
					}
				    }
				    }
				initTaskWorkLoadDetail();//加载当前任务的工作量信息列表
			  });
			  });
		}else{
			
	        alert("请选择一条任务进行查看！");
		}
	});	
	

//加载系统应用pop
getCurrentPageObj().find('#system_nameTFV').click(function(){
	openTaskSystemPop("tvsystem_pop",{sysno:getCurrentPageObj().find('#system_noTO'),sysname:getCurrentPageObj().find('#system_nameTO')});
});	

//加载版本pop
getCurrentPageObj().find('#version_nameTFV').click(function(){
	openTaskVersionPop("tvVsersion_pop",{versionsid:getCurrentPageObj().find('#version_idTO'),versionsname:getCurrentPageObj().find('#version_nameTO')});
});
}	



//初始化列表
function initFollowerTaskQuery() {
	var queryParams = function(params) {
		var temp = {
			limit : params.limit, // 页面大小
		offset : params.offset
	// 页码
		};
		return temp;
	};
	getCurrentPageObj().find('#g_FullView_TaskTable').bootstrapTable("destroy").bootstrapTable({
		url :dev_construction+"GFollowerTask/queryFollowerTaskList.asp?SID="+SID,
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
		singleSelect : false,// 复选框单选
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
		}, {
			field : 'REQ_TASK_NAME',
			title : '任务名称',
			align : "center"
		}, {
			field : 'SYSTEM_NAME',
			title : '应用名称',
			align : "center"
		},{
			field : "SUB_REQ_NAME",
			title : "需求点名称",
			align : "center"
		},{
			field : "VERSION_NAME",
			title : "申请纳入版本",
			align : "center",
		}, {
			field : "REQ_TASK_RELATION_NAME",
			title : "从属关系",
			align : "center"
		}, {
			field : "REQ_TASK_STATE_DISPLAY",
			title : "任务状态",
			align : "center"
		}, {
			field : "ANALYZE_STATE",
			title : "需求分析",
			align : "center",
//						formatter:function(value,row,index){if(value>0){return "查看";}return "--";}
			formatter:function(value,row,index){if(value>0){return '<a style="color:blue" href="javascript:void(0)" onclick="fullview(03,\''+row.REQ_TASK_ID+'\',\''+row.REQ_TASK_CODE+'\')";>查看</a>';}return "--";}
		},{
			field : "OVERDESIGN_STATE",
			title : "设计开发",
			align : "center",
			formatter:function(value,row,index){if(value>0){return '<a style="color:blue" href="javascript:void(0)" onclick="fullview(05,\''+row.REQ_TASK_ID+'\',\''+row.REQ_TASK_CODE+'\')";>查看</a>';}return "--";}
		},{
			field : "DETAILDESIGN_STATE",
			title : "详细设计",
			align : "center",
			formatter:function(value,row,index){if(value>0){return '<a style="color:blue" href="javascript:void(0)" onclick="fullview(06,\''+row.REQ_TASK_ID+'\',\''+row.REQ_TASK_CODE+'\')";>查看</a>';}return "--";}
		},{
			field : "SIT_STATE",
			title : "SIT测试",
			align : "center",
			formatter:function(value,row,index){if(value>0){return '<a style="color:blue" href="javascript:void(0)" onclick="fullview(09001,\''+row.REQ_TASK_ID+'\',\''+row.REQ_TASK_CODE+'\')";>查看</a>';}return "--";}
		},{
			field : "UAT_STATE",
			title : "UAT测试",
			align : "center",
			formatter:function(value,row,index){if(value>0){return '<a style="color:blue" href="javascript:void(0)" onclick="fullview(10,\''+row.REQ_TASK_ID+'\')";>查看</a>';}return "--";}
		}]
	});
}

//根据不同阶段的任务信息
//查看任务详情
function fullview(task_state,req_task_id,req_task_code){
	
	//closeAndOpenInnerPageTab("task_analyze_info",text,"dev_construction/requirement/reqTask_phased/reqTaskFile_info.html",function(){
		var params = {};
		params['req_task_id'] = req_task_id;
		params["phased_state"]=task_state;
		params['REQ_TASK_CODE']=req_task_code.toString();
		var text="";
		if(task_state=='03'){
			params['phase']='req_task_analyze';
			text="需求任务分析文档详情";
		}else if(task_state=='05'){
			params['phase']='req_task_summary';
			text="设计开发文档详情";
		}else if(task_state=='06'){
			params['phase']='req_task_design';
			text="详细设计文档详情";
		}else if(task_state=='07'){
			params['phase']='req_task_unit_test';
			text="编码开发文档详情";
		}else if(task_state=='08'){
			params['phase']='req_task_joint';
			text="联调测试文档详情";
		}else if(task_state=='09001'){
			params['phase']='req_sit_file';
			text="SIT测试案例文档详情";
		}else if(task_state=='10'){
			params['phase']='req_uat_file';
			text="UAT测试文档详情";
		}
		
		var taskCall = getMillisecond();
		 baseAjaxJsonp(dev_construction+"GTaskPhased/queryTaskPhasedById.asp?SID="+SID+"&call="+taskCall, params , function(data) {
			if (data != undefined && data != null && data.result=="true") {
				viewPhaseTaskDetail(task_state,data.data[0],text);
			}
		},taskCall);
		
		/*if(task_state=='03'){
			params['phase']='req_task_analyze';
			queryTaskPhasedById(params,"S_DIC_REQ_ANL_FILE");
		}else if(task_state=='05'){
			params['phase']='req_task_summary';
			queryTaskPhasedById(params,"S_DIC_SYS_DESIGN_FILE");
		}else if(task_state=='06'){
			params['phase']='req_task_design';
			queryTaskPhasedById(params,"S_DIC_DET_DESIGN_FILE");
		}else if(task_state=='07'){
			params['phase']='req_task_unit_test';
			queryTaskPhasedById(params,"S_DIC_UNIT_TEST_FILE");
		}else if(task_state=='08'){
			params['phase']='req_task_joint';
			queryTaskPhasedById(params,"S_DIC_JOINT_TEST_FILE");
		}else if(task_state=='09001'){
			params['phase']='req_sit_file';
			queryTaskPhasedById(params,"S_DIC_SIT_TEST_FILE");
		}else if(task_state=='10'){
			params['phase']='req_uat_file';
			queryTaskPhasedById(params,"S_DIC_UAT_TEST_FILE");
		}
		*/
		
	//});
}


