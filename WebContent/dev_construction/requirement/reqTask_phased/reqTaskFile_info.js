
//查看任务详情
function viewTaskDetail(req_task_id,req_task_code,task_state){
	
	closeAndOpenInnerPageTab("task_analyze_info","需求任务文档详情","dev_construction/requirement/reqTask_phased/reqTaskFile_info.html",function(){
		var params = {};
		params['req_task_id'] = req_task_id;
		params["phased_state"]=task_state;
		params['req_task_code']=req_task_code.toString();
		if(task_state=='03'){
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
		
	});
}


 
 





