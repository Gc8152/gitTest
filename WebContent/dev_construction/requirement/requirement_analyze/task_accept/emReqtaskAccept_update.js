
//初始化按钮
initEmReqTaskAcceptBtn();
function initEmReqTaskAcceptBtn(){
	//提交并保存,同时生成需求分析项目
	
	getCurrentPageObj().find('#emtaskAccept_save').click(function(){
		var req_acc_classify=getCurrentPageObj().find("#ETAreq_acc_classify").val();
		//紧急需求提交受理
		if(req_acc_classify=="00"){
			if(!vlidate($("#g_emreqtask_accept"),"",true)){
				 alert("请按要求填写图表中的必填项！");
				return ;
			}
			    var params={};
			    var req_task_id=getCurrentPageObj().find('#ETAreq_task_id').val();
			    params["req_id"]=getCurrentPageObj().find('#ETAreq_id').val();
			    params["sub_req_code"]=getCurrentPageObj().find('#ETAsub_req_code').text();
			    params["sub_req_id"]=getCurrentPageObj().find('#ETAsub_req_id').val();
			    params["req_task_relation"]=getCurrentPageObj().find('#ETAreq_task_relation').val();
			    params["is_inter"]=getCurrentPageObj().find('#ETAis_inter').val();
			    params["req_task_analyzer"]=getCurrentPageObj().find('#ETAreq_task_analyzer').val();
			    params["system_no"]=getCurrentPageObj().find('#ETAsystem_no').val();
			    params["system_name"]=getCurrentPageObj().find('#ETAsystem_name').val();
			    params["config_man_id"]=getCurrentPageObj().find('#ETAconfig_man_id').val();
			    params["project_man_id"]=getCurrentPageObj().find('#ETAproject_man_id').val();
			    params["p_owner_id"]=getCurrentPageObj().find('#ETAp_owner').val();
			    params["req_task_code"]=getCurrentPageObj().find('#ETAreq_task_code').val();
			    params["req_task_name"]=getCurrentPageObj().find('#ETAreq_task_name').val();
			    
			    var accept_result=getCurrentPageObj().find("input:radio[name='ETA.accept_result']:checked").val();
			    var accept_view=getCurrentPageObj().find('#ETAaccept_view').val();
			    var req_task_relation = getCurrentPageObj().find('#ETAreq_task_relation').val();
			    if(req_task_relation=="01"&&accept_result=="02"){
			    	alert("主线任务不允许退回！");
			    	return;
			    }
			    if(accept_view.length>250){
			    	alert("结论意见至多可输入250汉字！");
			    	return;
			    }
			    params["accept_result"]=accept_result;
			    params["accept_view"]=accept_view;
			    /*********提醒参数**********/
			    params["b_id"] = req_task_id;
			    params["b_code"] = getCurrentPageObj().find('#ETAreq_task_code').val();
			    params["remind_type"] = "PUB2017171";
			    params["req_task_relation"]=req_task_relation;//主线01，配合02
			    var name = getCurrentPageObj().find("#ETAreq_task_name").val()+"（编号："+params["b_code"]+"）";
			    if(accept_result=="01"){
			    	 params["b_name"] = name+"任务受理成功";
			    }else if(accept_result=="02"){
			    	 params["b_name"] = name+"任务退回成功";
			    	 params["p_owner_id"]=getCurrentPageObj().find('#ETAreq_analysis').val();
			    }
			     baseAjaxJsonp(dev_construction+"req_taskaccept/updateEmReqTaskAccept.asp?SID="+SID+"&req_task_id="+req_task_id, params , function(data) {
					if (data != undefined && data != null && data.result=="true") {
						 if(accept_result=='02'){
							 alert("任务退回成功");
						  }else if(accept_result=="01"){
							 alert("任务受理成功"); 
						  }
						closePageTab("emreq_taskAccept");
					}else{
						var mess=data.mess;
						if(mess!=undefined){
							alert("任务受理或退回失败："+mess);
						}else{
							alert("任务受理或退回失败");
						}
						
					}
			       }); 
		}
		});

//查看关联任务详情
	getCurrentPageObj().find('#emReqtaskDetail_view').click(function(){
	var id = $("#gEmReqTaskTableList").bootstrapTable('getSelections');
	var req_task_id = $.map(id, function (row) {return row.REQ_TASK_ID;});
	if(id.length==1){
		closeAndOpenInnerPageTab("req_taskDetail","任务详情页面","dev_construction/requirement/requirement_analyze/task_accept/task_detail.html",function(){
			initReqTaskDetailLayout(req_task_id);
		  });
	}else{
		
        alert("请选择一条任务进行查看！");
	}
	
});
	
	
}	

//查看需求详情
function viewReqDetailETA(){
	var req_acc1=getCurrentPageObj().find("#ETAreq_acc_classify").val();
	var ids=getCurrentPageObj().find('#ETAreq_id').val();
	if(req_acc1=="00"){
		closeAndOpenInnerPageTab("EmRequirement_detail1","紧急需求详情","dev_construction/requirement/requirement_analyze/task_accept/emreq_detail.html",function(){
			initEmReqDetailLayout(ids);
		});	
	}
	else{
	closeAndOpenInnerPageTab("requirement_detail","需求详情","dev_construction/requirement/requirement_input/req_detail.html",function(){
		initReqDetailLayout2(ids);
	});}
}
//查看需求点详情	
function viewSubReqDetailETA(){
	var req_acc2=getCurrentPageObj().find("#ETAreq_acc_classify").val();
	var ids=getCurrentPageObj().find('#req_id').val();
	if(req_acc2=="00"){
		closeAndOpenInnerPageTab("emsubreq_detail","紧急需求点详情","dev_construction/requirement/requirement_analyze/split_subreq/splitEmSubreq_detail.html",function(){
			initEmReqSplitDetail(ids);//初始化页面信息
			});	
	}
	else{
		closeAndOpenInnerPageTab("subreq_detail","需求点详情","dev_construction/requirement/requirement_analyze/split_subreq/splitSubreq_detail.html",function(){
		initSplitReqDetailLayOut(ids);
		});
	}
}	

 
//初始化同个子需求下关联任务列表
function initEmSubReqTaskList(){
	var sub_req_id=getCurrentPageObj().find('#ETAsub_req_id').val();
	var req_task_id=getCurrentPageObj().find('#ETAreq_task_id').val();
	var queryParams = function(params) {
		var temp = {
			limit : params.limit, // 页面大小
			offset : params.offset
		// 页码
		};
		return temp;
	};
	var reqTaskListCall = getMillisecond();
	getCurrentPageObj().find('#gEmReqTaskTableList').bootstrapTable("destroy").bootstrapTable({
				url :dev_construction+"req_taskaccept/queryAssociationTaskList.asp?SID="+SID+"&sub_req_id="+sub_req_id+"&req_task_id="+req_task_id+"&call="+reqTaskListCall,
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
				uniqueId : "REQ_TASK_ID", // 每一行的唯一标识，一般为主键列
				cardView : false, // 是否显示详细视图
				detailView : false, // 是否显示父子表
				jsonpCallback:reqTaskListCall,
				singleSelect : true,// 复选框单选
				columns : [{
					checkbox : true,
					rowspan : 2,
					align : 'center',
					valign : 'middle'
				},{
					field : 'REQ_TASK_CODE',
					title : '任务编号',
					align : "center",
				},{
					field : 'REQ_TASK_NAME',
					title : '任务名称',
					align : "center",
				},{
					field : 'SUB_REQ_NAME',
					title : '子需求名称',
					align : "center",
				}, {
					field : 'REQ_TASK_RELATION_DISPLAY',
					title : '从属关系',
					align : "center"
				}, {
					field : "REQ_TASK_STATE_DISPLAY",
					title : "任务状态",
					align : "center"
				}, {
					field : "SYSTEM_NAME",
					title : "实施应用",
					align : "center"
				}, {
					field : "PLAN_ONLINETIME",
					title : "计划投产时间",
					align : "center"
				}, {
					field : "VERSION_NAME",
					title : "申请纳入版本",
					align : "center"
				}]
			});
	
	var req_task_relation1=getCurrentPageObj().find('#ETAreq_task_relation').val();
	getCurrentPageObj().find('#ETAaccept_result1').attr("checked",true);
	if(req_task_relation1=="01"){
	//默认任务受理结论为接受	
	
 //受理结果为受理时显示需求任务分析师
 getCurrentPageObj().find('#ETAaccept_result1').click(function(){
	 getCurrentPageObj().find('#task_analyzer_hide').show();
	 getCurrentPageObj().find('#ETAreq_task_analyzer_name').show();
	 getCurrentPageObj().find('#ETAreq_task_analyzer_name').attr("validate","v.required");
	 getCurrentPageObj().find('#ETAreq_task_analyzer_name+strong').show();
 });
//受理结果为退回时隐藏需求任务分析师
 getCurrentPageObj().find('#ETAaccept_result2').click(function(){
	 getCurrentPageObj().find('#task_analyzer_hide').hide();
	 getCurrentPageObj().find('#ETAreq_task_analyzer_name').hide();
	 getCurrentPageObj().find('#ETAreq_task_analyzer_name').removeAttr("validate");
	 getCurrentPageObj().find('#ETAreq_task_analyzer_name').val("");
	 getCurrentPageObj().find('#ETAreq_task_analyzer').val("");
	 getCurrentPageObj().find('#ETAreq_task_analyzer_name+strong').hide();
 });	
	}else{
		 getCurrentPageObj().find('#task_analyzer_hide').hide();
		 getCurrentPageObj().find('#ETAreq_task_analyzer_name').hide();
		 getCurrentPageObj().find('#ETAreq_task_analyzer_name').removeAttr("validate");
		 getCurrentPageObj().find('#ETAreq_task_analyzer_name').val("");
		 getCurrentPageObj().find('#ETAreq_task_analyzer').val("");
		 getCurrentPageObj().find('#ETAreq_task_analyzer_name+strong').hide();
		
	}
	
}



