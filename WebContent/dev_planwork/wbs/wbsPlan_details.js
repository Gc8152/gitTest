
//根据计划ID查询任务详情
function getWbsPlanDetailsByPlanId(plan_id){
	var call = getMillisecond();
	var url = dev_planwork
	+ 'Wbs/getWbsPlanDetailsByPlanId.asp?SID=' + SID + "&call=" + call;
	baseAjaxJsonp(url,
			 {
		plan_id : plan_id
		  },function(data){
			  var plan_name = data.PLAN_NAME;
			  var type_name = data.TYPE_NAME;
			  var is_finish_affirm_name = data.IS_FINISH_AFFIRM_NAME;
			  var is_key_task_name = data.IS_KEY_TASK_NAME;
			  var pre_task = data.PRE_TASK;
			  var task_type_name = data.TASK_TYPE_NAME;
			  var file_id = data.FILE_ID;
			  var create_user_name = data.CREATE_USER_NAME;
			  var duty_man_name = data.DUTY_MAN_NAME;
			  var describe = data.DESCRIBE;
			  var start_time = data.START_TIME;
			  var end_time = data.END_TIME;
			  var plan_work_day = data.PLAN_WORK_DAY;
			  var plan_work_hour = data.PLAN_WORK_HOUR;
			  var reality_start_time = data.REALITY_START_TIME;
			  var reality_end_time = data.REALITY_END_TIME;
			  var reality_work_day = data.REALITY_WORK_DAY;
			  var reality_work_hour = data.REALITY_WORK_HOUR;
			  var work_percentage = data.WORK_PERCENTAGE;
			  var task_percentage = data.TASK_PERCENTAGE;
			  var release_status_name = data.RELEASE_STATUS_NAME;
			  $("#D_plan_id").val(plan_id);
			  $("#D_plan_name").val(plan_name);
			  $("#D_type_name").val(type_name);
			  $("#D_is_finish_affirm_name").val(is_finish_affirm_name);
			  $("#D_is_key_task_name").val(is_key_task_name);
			  $("#D_pre_task").val(pre_task);
			  $("#D_task_type_name").val(task_type_name);
			  $("#D_file_id").val(file_id);
			  $("#D_create_user_name").val(create_user_name);
			  $("#D_duty_man_name").val(duty_man_name);
			  $("#D_describe").val(describe);
			  $("#D_start_time").val(start_time);
			  $("#D_end_time").val(end_time);
			  if(plan_work_day != null){
				  $("#D_plan_work_day").val(plan_work_day + " 工作日");
			  }
			  if(plan_work_hour != null){
				  $("#D_plan_work_hour").val(plan_work_hour + " 小时");
			  }
			  $("#D_reality_start_time").val(reality_start_time);
			  $("#D_reality_end_time").val(reality_end_time);
			  if(reality_work_day != null){
				  $("#D_reality_work_day").val(reality_work_day + " 工作日");
			  }
			  if(reality_work_hour != null){
				  $("#D_reality_work_hour").val(reality_work_hour + " 小时");
			  }
			  $("#D_work_percentage").val(work_percentage);
			  $("#D_task_percentage").val(task_percentage);
			  $("#D_release_status_name").val(release_status_name);
	},call);
}
