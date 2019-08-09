var call_func = proj_func;
/**
 * 
 * @param result 审批结果：true;false
 * @param mark 审批标识：over;reject;back;
 * @param biz_id 业务ID
 * @param msg 审批提示内容
 */
function proj_func(result,mark,biz_id,msg){
	if(mark=='over'){//审批通过
		proChangeApprOver(biz_id,"01"); //业务id
	}else if(mark=='reject'){
		proChangeApprOver(biz_id,"02");//审批打回
	}else if(mark=='back'){
		reqChangeApprOver(biz_id,"03");//审批撤销
	}else{
		alert(msg);
	}
}


function proChangeApprOver(change_code,type){
	var params = {};
	params['type'] = type;
	params['change_code'] = change_code;
	params['change_id'] = getCurrentPageObj().find("#CHANGE_ID").html();
	/********提醒参数**********/
	params['b_id'] = params['change_id'];
	params['b_code'] = change_code;
	if(type == '01'){//审批通过
		params['b_name'] = getCurrentPageObj().find("#PROJECT_NAME").html()+"计划变更（变更编号："+change_code+"）审批通过";
	}else{
		params['b_name'] = getCurrentPageObj().find("#PROJECT_NAME").html()+"计划变更（变更编号："+change_code+"）审批打回";
	}
	params['remind_type'] = "PUB2017178";
	params['user_id'] = getCurrentPageObj().find("#PRESENT_USER").html();
	
	var expertsCall = getMillisecond();
    baseAjaxJsonp(dev_project+'proChange/upApproveChange.asp?call='+expertsCall+'&SID='+SID,params, function(data) {
		if (data != undefined&&data!=null&&data.result=="true") {
			alert("审批成功");
		}else{
			alert("操作失败");
		}
	},expertsCall);
}
