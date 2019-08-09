
initReqTaskVersionJoinBtn();

//初始化按钮
function initReqTaskVersionJoinBtn(){
	//提交并保存
	getCurrentPageObj().find('#taskPhase_save').click(function(){
		var version_id=getCurrentPageObj().find("#version_id").val();
		var file_id = getCurrentPageObj().find("input[name=FILE_ID]").val();
		var file_sit_id = getCurrentPageObj().find("input[name=FILE_SIT_ID]").val();
		var sub_req_id=getCurrentPageObj().find("#sub_req_id").val();
		var params={};
		/*if(version_id==""){
			if(file_id==""){
				alert("请上传任务开发手册");
				return;
			}
		}else{
			if(file_id==""){
				alert("请上传任务开发手册");
				return;
			}else if(file_sit_id==""){
				alert("请上传SIT测试案例");
				return;
			}
		}*/
		/*var params={};
		var parames={};
		var sub_req_id=getCurrentPageObj().find("#sub_req_id").val();
	    var req_task_id = getCurrentPageObj().find("#req_task_id").val();
	    params["SUB_REQ_ID"]=sub_req_id;
	    params["req_task_id"]=req_task_id;
	    params["phased_state"]="05";
	    params["file_id"] = file_id;
	    saveTaskPhased(params);
	    parames["SUB_REQ_ID"]=sub_req_id;
	    parames["req_task_id"]=req_task_id;
	    parames["phased_state"]="09001";
	    parames["file_id"] = file_sit_id;
	    saveTaskPhasedSit(parames);*/
	  /*  baseAjaxJsonp(dev_construction+"sendProduceVerify/saveItemAudit.asp?SID="+SID, params , function(data) {
			if (data != undefined && data != null && data.result=="true") {
				alert("保存成功");
				closeCurrPageTab();
			}else{
				alert("保存失败");
			}
	     }); */
		alert("保存成功");
		closeCurrPageTab();
	});
}	

 
/**
 * 
 * @param phased_file	文件类型字典
 * @param business_code  业务编码
 */
function initFtpFileListAndObject1(params, module_flag){
	var business_codes = params.req_task_code;
	var phase = params.phase;
	var path_id = params.path_id;
	//附件上传
	var currTab = getCurrentPageObj();
	tablefile = currTab.find("#table_file");
	//点击打开上传模态框
	var addfile = currTab.find("#add_file");
	addfile.click(function(){
		openFileSvnUpload(currTab.find("#file_modal"), tablefile, path_id,business_codes, phase, module_flag, true, true);
	});
	//附件删除
	var delete_file = currTab.find("#delete_file");
	delete_file.click(function(){
		delSvnFile(tablefile, business_codes, phase, currTab.find("#file_modal"));
	});
	//初始化附件列表
	getSvnFileList(tablefile,currTab.find("#file_view_modal"),business_codes, phase);
}

/**
 * 
 * @param phased_file	文件类型字典
 * @param business_code  业务编码
 */
function initFtpFileListAndObjectSit(params, module_flag){
	var business_codes = params.req_task_code;
	var phase = params.phase_sit;
	var path_id = params.path_sit_id;
	//附件上传
	var currTab = getCurrentPageObj();
	tablesitfile = currTab.find("#table_sit_file");
	//点击打开上传模态框
	var addfile = currTab.find("#add_sit_file");
	addfile.click(function(){
		openFileSvnUpload(currTab.find("#file_sit_modal"), tablesitfile, path_id,business_codes, phase, module_flag, true, true);
	});
	//附件删除
	var delete_file = currTab.find("#delete_sit_file");
	delete_file.click(function(){
		delSvnFile(tablesitfile, business_codes, phase, currTab.find("#file_sit_modal"));
	});
	//初始化附件列表
	getSvnFileList(tablesitfile,currTab.find("#file_sit_view_modal"),business_codes, phase);
}






