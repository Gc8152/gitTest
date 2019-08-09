function InitDefectInfo(){
	getCurrentPageObj().find("#addDefect").click(function(){
		if(!vlidate(getCurrentPageObj().find("#addDefect_from"))){
			return ;
		}
		var expertsCall = getMillisecond();
	    var params = getPageParam("G");		//遍历当前页面的input,text,select
	    
		baseAjaxJsonp(dev_construction+'GDefect/insertDefect.asp?call='+expertsCall+'&SID='+SID,params, function(data) {
			if (data != undefined&&data!=null&&data.result=="true") {
				closePageTab("defect_edit");
				alert(data.msg);
			}else{
				alert(data.msg);
			}
		},expertsCall);
	});
	
	getCurrentPageObj().find("#jury_task_name").click(function(){
		var jury_task_name = getCurrentPageObj().find("#jury_task_name");
		var task_id = getCurrentPageObj().find("#task_id");
		var jury_id = getCurrentPageObj().find("#jury_id").val();
		openJuryTaskPop("addDivExpert",{name:jury_task_name,no:task_id,jury_id:jury_id});
	});	
	
	getCurrentPageObj().find("#disposeDefect").click(function(){
		getCurrentPageObj().find("#setDefectModel").modal("show");
	});
	getCurrentPageObj().find("#checkDefect").click(function(){
		getCurrentPageObj().find("#setDefectCheckModel").modal("show");
	});
	
	getCurrentPageObj().find("#defect_dispose_save").click(function(){
		if(!vlidate(getCurrentPageObj().find("#defectDispose_form"))){
			return ;
		}
		var expertsCall = getMillisecond();
		var params = {};
		var defect_cause = getCurrentPageObj().find("#defect_cause2").val();
		var defect_question_solve = getCurrentPageObj().find("#defect_question_solve2").val();
		params['save_type'] = getCurrentPageObj().find("#defect_save_type").val();
		params['defect_id'] = getCurrentPageObj().find("#defect_id").val();
		params['at_principal_id'] = getCurrentPageObj().find("#check_user_id").val();
		params['defect_state'] = '02';
		params['defect_cause'] = defect_cause;
		params['defect_question_solve'] = defect_question_solve;
		baseAjaxJsonp(dev_construction+'GDefect/proceOrValid.asp?call='+expertsCall+'&SID='+SID,params, function(data) {
			if (data != undefined&&data!=null&&data.result=="true") {
				getCurrentPageObj().find("#setDefectModel").modal("hide");
				closePageTab("defect_edit");
				alert("添加成功");
			}else{
				alert("添加失败");
			}
		},expertsCall);
	});
	
	getCurrentPageObj().find("#defect_check_save").click(function(){
		if(!vlidate(getCurrentPageObj().find("#defectCheck_form"))){
			return ;
		}
		var expertsCall = getMillisecond();
		var params = {};
		var defect_state = getCurrentPageObj().find("#defect_state2 option:selected").val();
		var defect_case_desc = getCurrentPageObj().find("#defect_case_desc2").val();
		params['defect_case_desc'] = defect_case_desc;
		params['defect_state'] = defect_state;
		params['save_type'] = getCurrentPageObj().find("#defect_save_type").val();
		params['defect_id'] = getCurrentPageObj().find("#defect_id").val();
		params['jury_id'] = getCurrentPageObj().find("#jury_id").val();
		params['req_task_state'] = getCurrentPageObj().find("#req_task_state").val();
		params['jury_grade_key'] = getCurrentPageObj().find("#jury_grade_key").val();
		if(defect_state == '04'){
			params['at_principal_id'] = getCurrentPageObj().find("#sponsor_user_id").val();
		}else{
			params['at_principal_id'] = getCurrentPageObj().find("#sponsor_user_id").val();
		}
		
		baseAjaxJsonp(dev_construction+'GDefect/proceOrValid.asp?call='+expertsCall+'&SID='+SID,params, function(data) {
			if (data != undefined&&data!=null&&data.result=="true") {
				getCurrentPageObj().find("#setDefectCheckModel").modal("hide");
				closePageTab("defect_edit");
				alert("操作成功");
			}else{
				alert("操作失败");
			}
		},expertsCall);
	})
}
InitDefectInfo();

		