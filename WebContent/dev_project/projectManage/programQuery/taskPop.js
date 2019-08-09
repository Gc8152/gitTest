function openAppPop(id,REQ_TASK_CODE){
	$('#ProjectReqTaskPOP').remove();
	getCurrentPageObj().find("#"+id).load("dev_project/projectManage/programQuery/taskPop.html",{},function(){
		$("#ProjectReqTaskPOP").modal("show");
		queryProjectReqTask(REQ_TASK_CODE);
	});
}

function queryProjectReqTask(REQ_TASK_CODE){
	var ReqTaskCall = getMillisecond();
	
	baseAjaxJsonp(dev_project
			+ "programQuery/queryProjectReqTaskPOP.asp?REQ_TASK_CODE="+REQ_TASK_CODE+"&SID=" + SID + "&call=" + ReqTaskCall,null,function(data) {
		if (data != undefined&&data!=null) {
			
			var z=data.queryProjectReqTaskPOP;
			
			if(z != null && z.length > 0) {

				$("#pop_sub_req_code").html(z[0].SUB_REQ_CODE);
				$("#pop_sub_req_name").html(z[0].SUB_REQ_NAME);
				$("#pop_plan_onlinetime").html(z[0].PLAN_ONLINETIME);
				$("#pop_req_code").html(z[0].REQ_CODE);
				$("#pop_req_name").html(z[0].REQ_NAME);
				$("#pop_req_put_dept").html(z[0].REQ_PUT_DEPT);
				//$("#M_project_name").html(z[0].REQ_TASK_ID);
				$("#pop_req_task_code").html(z[0].REQ_TASK_CODE);
				$("#pop_req_task_name").html(z[0].REQ_TASK_NAME);
				$("#pop_req_task_relation").html(z[0].REQ_TASK_RELATION_NAME);
				$("#pop_req_task_state").html(z[0].REQ_TASK_STATE);
				$("#pop_req_task_type").html(z[0].REQ_TASK_TYPE);
				$("#pop_project_man_name").html(z[0].PROJECT_MAN_NAME);
				$("#pop_p_owner_name").html(z[0].P_OWNER_NAME);
				$("#pop_system_name").html(z[0].SYSTEM_NAME);
				$("#pop_task_content").html(z[0].TASK_CONTENT);
		   
			}
			
		}
	},ReqTaskCall);
}