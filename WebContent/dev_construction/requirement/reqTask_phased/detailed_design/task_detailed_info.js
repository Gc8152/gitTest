
initReqTaskDetailBtn();

//初始化按钮
function initReqTaskDetailBtn(){
	//提交并保存
	getCurrentPageObj().find('#taskPhase_save').click(function(){
		var params={};
	    var file_id = getCurrentPageObj().find("input[name=FILE_ID]").val();
	    var req_task_id = getCurrentPageObj().find("#req_task_id").val();
	    params["req_task_id"]=req_task_id;
	    params["phased_state"]="06";
	    params["file_id"] = file_id;
	    saveTaskPhased(params);
	});
}	

 
 





