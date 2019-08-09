
//初始化任务详情页面
function initemReqTaskDetailLayout(req_task_id){
	var callTime=getMillisecond()+'2';
	baseAjaxJsonp(dev_construction+"req_taskaccept/queryTaskOneById.asp?SID="+SID+"&call="+callTime+"&req_task_id="+req_task_id, null , function(data) {
		 if (data != undefined && data != null && data.result=="true") {
		    for(var k in data){
			var str=data[k];
			k = k.toLowerCase();//大写转换为小写
		    if(k=="req_code"){
				getCurrentPageObj().find('#ETDreq_code').text(str);
			}else if(k=="sub_req_code"){
				getCurrentPageObj().find('#ETDsub_req_code').text(str);
			}else if(k=="req_acc_classify"){
				getCurrentPageObj().find('#ETDreq_acc_classify').val(str);
			}else if(k=="req_id"||k=="req_task_id"||k=="sub_req_id"){
				getCurrentPageObj().find("input[name='ETD."+k+"']").val(str);
			}else if(k=="accept_result"){
				getCurrentPageObj().find("input[name='ETD."+k+"']"+"[value="+str+"]").attr("checked",true);
			}else if(k=="req_task_relation"&&str=="02"	){
				 getCurrentPageObj().find('#task_analyzer_hide').hide();
				 getCurrentPageObj().find('#ETDreq_task_analyzer_name').hide();
				
			}else{
				getCurrentPageObj().find("span[name='ETD."+k+"']").text(str);
			}
		    }
		    }
		 initEmtaskUnionList();//加载关联的任务列表
	  },callTime);
	
}
//查看需求详情
function viewReqDetailETD(){
	var req_accs=getCurrentPageObj().find("#ETDreq_acc_classify").val();
	var ids=getCurrentPageObj().find('#ETDreq_id').val();
	if(req_accs=="00"){
		closeAndOpenInnerPageTab("EmRequirement_detail1","紧急需求详情","dev_construction/requirement/requirement_analyze/task_accept/emreq_detail.html",function(){
			initEmReqDetailLayout(ids);
		});	
	}
	else{
	
	closeAndOpenInnerPageTab("requirement_detail","需求详情","dev_construction/requirement/requirement_input/req_detail.html",function(){
		initReqDetailLayout(ids);
	});}
}
//查看需求点详情	
function viewSubReqDetailETD(){
	var req_acc2=getCurrentPageObj().find("#ETDreq_acc_classify").val();
	var ids=getCurrentPageObj().find('#ETDreq_id').val();
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

//初始化关联任务列表
function initEmtaskUnionList(){
	var sub_req_id=getCurrentPageObj().find('#ETDsub_req_id').val();
	var req_task_id=getCurrentPageObj().find('#ETDreq_task_id').val();
	var queryParams = function(params) {
		var temp = {
			limit : params.limit, // 页面大小
			offset : params.offset
		// 页码
		};
		return temp;
	};
	var  taskunionliskCall = getMillisecond();
	getCurrentPageObj().find('#gReqTaskTableListunionETD').bootstrapTable("destroy").bootstrapTable({
				url :dev_construction+"req_taskaccept/queryAssociationTaskList.asp?SID="+SID+"&sub_req_id="+sub_req_id+"&req_task_id="+req_task_id+"&call="+taskunionliskCall,
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
				jsonpCallback:taskunionliskCall,
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
}

//查看任务详情
getCurrentPageObj().find("#ETDTaskDetail_view").click(function(){
	
	  var id = getCurrentPageObj().find('#gReqTaskTableListunionETD').bootstrapTable('getSelections');
	  var req_task_id = $.map(id, function (row) {return row.REQ_TASK_ID;});
	  if(id.length==1){
	  	closeAndOpenInnerPageTab("req_taskDetail","任务详情页面","dev_construction/requirement/requirement_analyze/task_accept/task_detail.html",function(){
	  		initReqTaskDetailLayout(req_task_id);
	  	  });
	  }else{
	  	
	      alert("请选择一条任务进行查看！");	
	  }
});

