
initReqTaskAcceptBtn();
//初始化按钮
function initReqTaskAcceptBtn(){
	//提交并保存,修改任务的评估状态
	getCurrentPageObj().find('#taskworkAssess_save').click(function(){
		if(!vlidate($("#g_reqtask_assess"),"",true)){
			 alert("请按要求填写图表中的必填项！");
			return ;
		}
		var ids=getCurrentPageObj().find("#TWreq_task_id").val();
		var fpoint_num=getCurrentPageObj().find("#TWfunctionpoint_num").val();
		var workload_des=getCurrentPageObj().find("#TWworkload_description").val();
		baseAjaxJsonp(dev_construction+"taskworkload_assess/updateTaskWorkLoadState.asp?SID="+SID+"&req_task_id="+ids,{functionpoint_num:fpoint_num,workload_description:workload_des}, function(data) {
			if(data != undefined && data != null && data.result=="true"){
				alert("保存提交成功");
				closePageTab("reqtask_assess");
			}else{
				var mess=data.mess;
				alert("保存提交失败："+mess);
			}
		});
	});

	//新增工作量评估信息
	getCurrentPageObj().find('#taskWorkLoad_add').click(function(){
		var taskid=getCurrentPageObj().find("#TWreq_task_id").val();
		openTaskWorkLoadPop("taskwork_pop","add",taskid,null);
	});
}	

//查看需求详情
function viewReqDetailTW(){
	var ids=getCurrentPageObj().find('#TWreq_id').val();
	closePageTab("requirement_detail");
	closeAndOpenInnerPageTab("requirement_detail","需求详情","dev_construction/requirement/requirement_input/req_detail.html",function(){
		baseAjaxJsonp(dev_construction+"requirement_input/queryRequirementInfoByID.asp?SID="+SID+"&req_id="+ids, null , function(data) {
			for ( var k in data) {
				    var str=data[k];
				    k = k.toLowerCase();//大写转换为小写
			 if(k=="req_datatable_flag"||k=="req_level"||k=="req_income_flag"){
				 getCurrentPageObj().find("input[name='RD."+k+"']"+"[value="+str+"]").attr("checked",true);
		     }else if(k=="file_id"){
				 getCurrentPageObj().find('#file_id_reqRD').val(str);
			 }else if(k=="req_income_doc"||k=="req_description"){
				 getCurrentPageObj().find("span[name='RD." + k + "']").text(str);
			 }else {
				 getCurrentPageObj().find("span[name='RD." + k + "']").text(str);
			}	
		  }
		});
	});
}
//查看需求点详情	
function viewSubReqDetailTW(){
	var id=getCurrentPageObj().find('#TWreq_id').val();
	if(id==null||id==""){
		alert("页面获取需求id失败");
		return;
	}
	closePageTab("subreq_detail");
	closeAndOpenInnerPageTab("subreq_detail","需求点详情","dev_construction/requirement/requirement_analyze/split_subreq/splitSubreq_detail.html",function(){
		baseAjaxJsonp(dev_construction+"requirement_splitreq/querySplitSubReqPageById.asp?SID="+SID+"&req_id="+id, null , function(data) {
			for ( var f in data) {
				  var map=data[f];
			   if(f=="1"||f=="2"){
			     for(var k in map){
					var str=map[k];
					k = k.toLowerCase();//大写转换为小写
			    if(k=="req_datatable_flag"||k=="req_level"||k=="req_income_flag"||k=="req_dis_result"||k=="req_acc_result"){
			    	getCurrentPageObj().find("input[name='SPD."+k+"']"+"[value="+str+"]").attr("checked",true);
				}else if(k=="req_income_doc"){
					getCurrentPageObj().find("#req_income_doc_reqSPD").val(str);
				}else if(k=="req_description"){
					getCurrentPageObj().find("#req_description_reqSPD").val(str);
				}else if(k=="req_dis_view"){
					getCurrentPageObj().find("#req_dis_viewSPD").val(str);
				}else if(k=="req_scheme"){
					getCurrentPageObj().find("#SPDreq_scheme").val(str);
				}else if(k=="req_analytic_result"){
					getCurrentPageObj().find("#SPDreq_analytic_result").val(str);	
				}else{
					getCurrentPageObj().find("input[name='SPD."+k+"']").val(str);
				}
			    }
			    }
			    }
			initReqSubListDetail();//初始化子需求详情列表
			initReqPlanDetailList();//初始化实施计划详情列表
		});
		});
	}

//修改工作量信息
function updateTaskWorkLoad(restype){
	var taskid=getCurrentPageObj().find("#TWreq_task_id").val();
	openTaskWorkLoadPop("taskwork_pop","update",taskid,restype);
}

//删除工作量信息
function deleteTaskWorkLoad(restype){
	var ids=getCurrentPageObj().find("#TWreq_task_id").val();
	if(confirm("确定删除吗？")){
	baseAjaxJsonp(dev_construction+"taskworkload_assess/deleteWorkLoadById.asp?SID="+SID+"&req_task_id="+ids+"&task_res_type="+restype, null , function(data) {
		if(data != undefined && data != null && data.result=="true"){
			alert("删除成功");
			$('#g_reqtask_workload').bootstrapTable("refresh");
		}else{
			var mess=data.mess;
			alert("删除失败："+mess);
		}
	});
	}
}

//初始化工作量文件上传和列表
function initTaskworkloadfile(){
	//附件上传
	var file_id = "";
	file_id = getCurrentPageObj().find("#file_id_reqTW").val();
	if(!file_id){
		file_id = Math.uuid();
		getCurrentPageObj().find("#file_id_reqTW").val(file_id);
	}

	//点击打开模态框
	var addfile = getCurrentPageObj().find("#tw_addfile");
	var tablefile = getCurrentPageObj().find("#tw_tablefile");
	addfile.click(function(){
		openFileSvnUpload(getCurrentPageObj().find("#tw_filemodal"), tablefile, file_id);
	});

	//附件删除
	var delete_file = getCurrentPageObj().find("#tw_deletefile");
	delete_file.click(function(){
		delSvnFile(tablefile, file_id);
	});

	//初始化附件列表
	getSvnFileList(tablefile,getCurrentPageObj().find("#tw_fileview_modal"),file_id);
	
}

//初始化与当前任务关联的工作量评估列表
function initTaskWorkLoadList(){
	var req_task_id=getCurrentPageObj().find('#TWreq_task_id').val();
	
	var queryParams = function(params) {
		var temp = {
			limit : params.limit, // 页面大小
			offset : params.offset
		// 页码
		};
		return temp;
	};
	
	$('#g_reqtask_workload').bootstrapTable("destroy").bootstrapTable({
				url :dev_construction+"taskworkload_assess/queryTaskWorkLoadList.asp?SID="+SID+"&req_task_id="+req_task_id,
				method : 'get', // 请求方式（*）
				striped : true, // 是否显示行间隔色
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
				singleSelect : true,// 复选框单选
				columns : [{
					field : 'REQ_TASK_ID',
					title : '任务序列号',
					align : "center",
					visible:false
				},{
					field : 'TASK_RES_TYPE_DISPLAY',
					title : '资源类型',
					align : "center",
				},{
					field : 'TASK_RES_NUM',
					title : '资源个数',
					align : "center",
				}, {
					field : 'PERSON_AMOUNT',
					title : '工作量',
					align : "center"
				}, {
					field : "PERSON_UNIT_DISPLAY",
					title : "工作量单位",
					align : "center"
				}, {
					field : "PERSON_COSTS",
					title : "预估成本(万元)",
					align : "center"
				},{
					field : "TASK_INSTRUCTION",
					title : "说明",
					align : "center"
				},{
					field : "TASK_RES_TYPE",
					title : "操作",
					align : "center",
					formatter : function(value){
				    	     if(value!=null){
								return "<a href='#' onclick='updateTaskWorkLoad(" + JSON.stringify(value) + ")' style="+'"color:blue"'+">修改</a>" +"&nbsp;&nbsp;"+
									   "<a href='#' onclick='deleteTaskWorkLoad(" + JSON.stringify(value) + ")' style="+'"color:blue"'+">删除</a>";
				    	   }	
						   }	
				           }]
			   });
	initTaskworkloadfile();//初始化文件上传列表
}
