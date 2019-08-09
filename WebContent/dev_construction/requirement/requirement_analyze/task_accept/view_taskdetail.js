
//查看任务详情，公用方法
function viewTaskDetail(req_task_id) {
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
				 inittaskUnionList();//加载关联的任务列表
				//initTaskWorkLoadDetail();//加载当前任务的工作量信息列表
			  });
			  });
}	

//查看任务关联的任务进度，
function viewTaskSchedule(req_task_id) {
			closePageTab("req_schedule_taskDetail");
			closeAndOpenInnerPageTab("req_scheducle_taskDetail","任务详情页面","dev_construction/requirement/requirement_analyze/task_accept/task_schedule_detail.html",function(){
			initTaskScheduleDetailLayout(req_task_id)
			});
			
	}	
