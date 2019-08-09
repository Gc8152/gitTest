//initReqTaskVersionJoinBtn();
//初始化按钮
//function initReqTaskVersionJoinBtn(){
//	//提交并保存
//	getCurrentPageObj().find('#taskPhase_save').click(function(){
//	    var params={};
//	    var file_id = getCurrentPageObj().find("input[name=FILE_ID]").val();
//	    var req_task_id = getCurrentPageObj().find("#req_task_id").val();
//	    params["req_task_id"]=req_task_id;
//	    params["phased_state"]="03";
//	    params["file_id"] = file_id;
//	    saveTaskPhased(params);
//	 });
//}	

//查看需求详情信息
function viewReqDetailTan(){
	var req_id=getCurrentPageObj().find('#req_id').val();
	closeAndOpenInnerPageTab("Requirement_detail","需求详情","dev_construction/requirement/requirement_input/req_detail.html",function(){
		initReqDetailLayout(req_id);
	});
	
}

//查看需求点详情
function viewSubReqDetailTan(){
	var req_id=getCurrentPageObj().find('#req_id').val();
	closeAndOpenInnerPageTab("subreq_detail","需求点详情","dev_construction/requirement/requirement_analyze/split_subreq/splitSubreq_detail.html",function(){
		initSplitReqDetailLayOut(req_id);//初始化页面信息
	 });
}
 
 





