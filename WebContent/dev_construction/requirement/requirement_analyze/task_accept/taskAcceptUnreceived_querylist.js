
initTaskAcceptListLayOut();

function initTaskAcceptListLayOut(){
	var currTab = getCurrentPageObj();
	var queryForm = currTab.find("#taskAcceptQuery");
	var table = currTab.find("#gReqTaskTableForAccept");	
	var taskAcceptListCall = getMillisecond();
	
//初始化字典
autoInitSelect(queryForm);	
	
//初始化按钮
initTaskAcceptListBtn();
function initTaskAcceptListBtn() {

	// 查询
	getCurrentPageObj().find("#serach_acTaskQuery").click(function() {
		var param = queryForm.serialize();//获取表单的值
		table.bootstrapTable('refresh',{
			url:dev_construction+"req_taskaccept/queryReqLessTaskList.asp?SID="+SID+
			    "&call="+taskAcceptListCall+"&"+param});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#serach_acTaskQuery").click();});
	//重置
	getCurrentPageObj().find('#reset_acTaskQuery').click(function() {
		queryForm[0].reset();
		currTab.find('#system_noTQ').val("");//非ie8下reset()方法不能清除隐藏项的值
		var selects = currTab.find("select");
		for(var i=0; i<selects.length; i++){
			$(selects[i]).select2();
		}
	});
	
	
	
	//任务受理
	getCurrentPageObj().find("#req_taskAccept").click(function(){
		var id = getCurrentPageObj().find("#gReqTaskTableForAccept").bootstrapTable('getSelections');
		var p_owner = $.map(id, function (row) {return row.P_OWNER;});
		var req_acc_classify = $.map(id, function (row) {return row.REQ_ACC_CLASSIFY;});//需求分类：00紧急需求
        var req_task_type = $.map(id, function (row) {return row.REQ_TASK_TYPE;});//任务来源：05紧急任务
	
		var ids=JSON.stringify(id);
		var params=JSON.parse(ids);
		if(id.length==1){
			if(req_acc_classify=='00' || req_task_type=='05'){//紧急需求的任务
				 if(p_owner!=SID){
					  alert("您不是所选任务的当前责任人！");
					  return;
				  }
				  var req_task_state= $.map(id, function (row) {return row.REQ_TASK_STATE;});
				  
				  if(req_task_state!="01"){
					  if(req_task_state=="02"){
						  alert("任务被退回，请让需求分析岗在任务拆分中重新提交后再受理");
						  return;
					    }else{
					      alert("任务非待受理状态,不能操作");
					      return;
					    }
				    }
					closePageTab("emreq_taskAccept");
					closeAndOpenInnerPageTab("emreq_taskAccept","任务受理页面","dev_construction/requirement/requirement_analyze/task_accept/emReqtaskAccept_update.html",function(){
						for(var k in params[0]){
							var str=params[0][k];
							k = k.toLowerCase();//大写转换为小写
							if(k=="accept_view"){
								getCurrentPageObj().find('#ETAaccept_view').val(str);	
							}else if(k=="req_code"){
								getCurrentPageObj().find('#ETAreq_code').text(str);
							}else if(k=="req_acc_classify"){
								getCurrentPageObj().find('#ETAreq_acc_classify').val(str);
							}
							else if(k=="sub_req_code"){
								getCurrentPageObj().find('#ETAsub_req_code').text(str);
							}else if(k=="accept_result"){
								getCurrentPageObj().find("input[name='ETA."+k+"']"+"[value="+str+"]").attr("checked",true);
							}else if(k=="task_content"){
								getCurrentPageObj().find('#ETAtask_content').val(str);
							}else if(k=="config_man_id"){
								getCurrentPageObj().find('#ETAconfig_man_id').val(str);}
							else{
								getCurrentPageObj().find("input[name='ETA."+k+"']").val(str);
							}
							
							if(k=="req_id")
								getCurrentPageObj().find('#req_id').val(str);
						}
						initEmSubReqTaskList();//初始化关联任务列表
					});	
			}else{
			  if(p_owner!=SID){
				  alert("您不是所选任务的当前责任人！");
				  return;
			  }
			  var req_task_state= $.map(id, function (row) {return row.REQ_TASK_STATE;});
			  if(req_task_state!="01"){
				  if(req_task_state=="02"){
					  alert("任务被退回，请让需求分析岗在任务拆分中重新提交后再受理");
					  return;
				    }else{
				      alert("任务非待受理状态,不能操作");
				      return;
				    }
			    }
				closePageTab("req_taskAccept");
				closeAndOpenInnerPageTab("req_taskAccept","任务受理页面","dev_construction/requirement/requirement_analyze/task_accept/taskAccept_update.html",function(){
					for(var k in params[0]){
						var str=params[0][k];
						k = k.toLowerCase();//大写转换为小写
						if(k=="accept_view"){
							getCurrentPageObj().find('#TAaccept_view').val(str);	
						}else if(k=="req_code"){
							getCurrentPageObj().find('#TAreq_code').text(str);
						}else if(k=="req_acc_classify"){
							getCurrentPageObj().find('#TAreq_acc_classify').val(str);
						}
						else if(k=="sub_req_code"){
							getCurrentPageObj().find('#TAsub_req_code').text(str);
						}else if(k=="accept_result"){
							getCurrentPageObj().find("input[name='TA."+k+"']"+"[value="+str+"]").attr("checked",true);
						}else if(k=="task_content"){
							getCurrentPageObj().find('#TAtask_content').val(str);
						}else if(k=="config_man_id"){
							getCurrentPageObj().find('#TAconfig_man_id').val(str);}
						else{
							getCurrentPageObj().find("input[name='TA."+k+"']").val(str);
						}
						if(k=="req_id")
							getCurrentPageObj().find('#req_id').val(str);
					}
					initSubReqTaskList();//初始化关联任务列表
					//initInterTable(params[0].REQ_TASK_CODE);
				});
			}
		}else{
			
	        alert("请选择一条任务进行受理！");
		}
			
	});	

/*//接口任务入版
getCurrentPageObj().find("#req_portTaskIntoversion").click(function(){
 var id = getCurrentPageObj().find("#gReqTaskTableForAccept").bootstrapTable('getSelections');
 var req_task_id = $.map(id, function (row) {return row.REQ_TASK_ID;});
 var p_owner = $.map(id, function (row) {return row.P_OWNER;});
 var sub_req_id = $.map(id, function (row) {return row.SUB_REQ_ID;});
 if(id.length==1){
	 if(p_owner!=SID){
		 alert("您不是所选任务的当前责任人");
		 return;
	 }
  var req_task_type = $.map(id, function (row) {return row.REQ_TASK_TYPE;});
     if(req_task_type!="04"){
    	 alert("您所选的任务不是接口任务");
    	 return;
     }
  var req_task_state = $.map(id, function (row) {return row.REQ_TASK_STATE;});
     if(req_task_state!="03"){
    	 if(req_task_state=="01"){
    	   alert("您所选的任务还未受理");
    	   return;
    	 }else{
    	   alert("您所选的任务已入版"); 
    	   return;
    	 }
     }
    nconfirm("是否确定要入版？",function(){   
    	baseAjaxJsonp(dev_construction+"req_taskaccept/portTaskIntoVersion.asp?SID="+SID+"&req_task_id="+req_task_id+"&sub_req_id="+sub_req_id, null , function(data) {
			if (data != undefined && data != null && data.result=="true") {
						alert("入版成功");
						table.bootstrapTable("refresh");
					}else{
						var mess=data.mess;
						if(mess!=undefined&&mess!=null){
						  alert("入版失败:"+mess);
						}else{
						  alert("入版失败");
						}
					}
	       });  
     });
  }else{
	 alert("请选择一条接口任务");
  }
 });*/
	
	
	
  /*//工作量评估	
  getCurrentPageObj().find("#reqtask_assess").click(function(){
	  var id = getCurrentPageObj().find("#gReqTaskTableForAccept").bootstrapTable('getSelections');
		var p_owner = $.map(id, function (row) {return row.P_OWNER;});
		var ids=JSON.stringify(id);
		var params=JSON.parse(ids);
		if(id.length==1){
		if(p_owner!=SID){
			alert("您不是所选任务的当前责任人！");
			return;
		}
		var req_task_state= $.map(id, function (row) {return row.REQ_TASK_STATE;});
		if(req_task_state=="01"||req_task_state=="02"){
			alert("该任务未受理，不能评估工作量");
			return;
		}
		var is_workload_assess= $.map(id, function (row) {return row.IS_WORKLOAD_ASSESS;});
		if(is_workload_assess=="00"){
			alert("该任务已经完成工作量评估");
			return;
		}
			closePageTab("reqtask_assess");
			closeAndOpenInnerPageTab("reqtask_assess","工作量评估","dev_construction/requirement/requirement_analyze/task_accept/taskwork_assess.html",function(){
				for(var k in params[0]){
					var str=params[0][k];
					k = k.toLowerCase();//大写转换为小写
					if(k=="accept_view"){
						getCurrentPageObj().find('#TWaccept_view').val(str);
					}else if(k=="functionpoint_num"){
						getCurrentPageObj().find('#TWfunctionpoint_num').val(str);
					}else if(k=="workload_description"){
						getCurrentPageObj().find('#TWworkload_description').val(str);		
					}else if(k=="req_code"){
						getCurrentPageObj().find('#TWreq_code').text(str);
					}else if(k=="sub_req_code"){
						getCurrentPageObj().find('#TWsub_req_code').text(str);
					}else if(k=="req_id"||k=="req_task_id"||k=="sub_req_id"){
						getCurrentPageObj().find("input[name='TW."+k+"']").val(str);
					}else if(k=="accept_result"){
						getCurrentPageObj().find("input[name='TW."+k+"']"+"[value="+str+"]").attr("checked",true);
					}else{
						getCurrentPageObj().find("span[name='TW."+k+"']").text(str);
					}
				}
				initTaskWorkLoadList();//加载当前任务的工作量信息列表
			});
		}else{
			
	        alert("请选择一条任务进行评估！");
		}
			
	});	*/
	
	//任务受理-查看详情
	getCurrentPageObj().find("#req_taskDetail").click(function(){
		var id = getCurrentPageObj().find("#gReqTaskTableForAccept").bootstrapTable('getSelections');
		var req_task_id=$.map(id, function (row) {return row.REQ_TASK_ID;});
	var req_acc_classify=$.map(id, function (row) {return row.REQ_ACC_CLASSIFY;});
	
		/*var ids=JSON.stringify(id);
		var params=JSON.parse(ids);*/
		if(id.length==1){
	if(req_acc_classify=='00'){
				closePageTab("emreq_taskDetail");
				closeAndOpenInnerPageTab("emreq_taskDetail","任务详情页面","dev_construction/requirement/requirement_analyze/task_accept/emReqtask_detail.html",function(){
					initemReqTaskDetailLayout(req_task_id);
				  });
			}
			else{
			closePageTab("req_taskDetail");
			closeAndOpenInnerPageTab("req_taskDetail","任务详情页面","dev_construction/requirement/requirement_analyze/task_accept/task_detail.html",function(){
				initReqTaskDetailLayout(req_task_id);
			  });}

		}else{
			
	        alert("请选择一条任务进行查看！");
		}
			
	});
//加载应用pop
getCurrentPageObj().find('#system_nameTQ').click(function(){
	openTaskSystemPop("tqsystem_pop",{sysno:getCurrentPageObj().find("#system_noTQ"),sysname:getCurrentPageObj().find("#system_nameTQ")});
});

//加载版本pop
getCurrentPageObj().find('#version_nameTQ').click(function(){
	openTaskVersionPop("tqversion_pop",{versionsid:getCurrentPageObj().find("#version_idTQ"),versionsname:getCurrentPageObj().find("#version_nameTQ")});
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
					url :dev_construction+"req_taskaccept/queryReqLessTaskList.asp?SID="+SID+"&call="+taskAcceptListCall,
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
					jsonpCallback:taskAcceptListCall,
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
						field : "REQ_NAME",
						title : "需求名称",
						align : "center",
						width : 200,
					}, {
						field : "REQ_TASK_RELATION_DISPLAY",
						title : "从属关系",
						align : "center",
						width : 80,
					}, {
						field : "REQ_TASK_TYPE_DISPLAY",
						title : "任务来源",
						align : "center",
						width : 75,
						formatter:function(value,row,index){
							if(row.REQ_ACC_CLASSIFY=='00'){
							return '<span style="color:red">'+value+'</span>';}
							else{
								return value;
							}
							}
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
						field : "REQ_OPERATION_DATE",
						title : "需求要求投产时间",
						align : "center",
						width : 135,
					},{
						field : "PLAN_ONLINETIME",
						title : "计划投产时间",
						align : "center",
						width : 110,
					},{
						field : "P_OWNER_NAME",
						title : "当前责任人",
						align : "center",
						width : 90,
					},{
						field : "CREATE_TIME",
						title : "创建时间",
						align : "center",
						width : 110,
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
