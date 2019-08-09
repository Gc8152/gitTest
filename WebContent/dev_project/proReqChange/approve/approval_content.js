
//定义批量操作流程的回调函数名
var batch_callFunc = change_batchfunc;

/**
 * 定义版本变更审批操作回调函数名
 * @param result 审批结果：true;false
 * @param mark 审批标识：over;reject;back;
 * @param biz_id 业务ID
 * @param msg 审批提示内容
 */
getCurrentPageObj()[0].call_func = function proVersionChange_func(result,mark,biz_id,msg){
	if(mark=='over'){//审批通过
		//alert("审批通过");
		reqChangeApprOver(biz_id,"01"); //业务id
	}else if(mark=='reject'){
		reqChangeApprOver(biz_id,"02");//审批打回
	}else if(mark=='back'){
		reqChangeApprOver(biz_id,"03");//审批撤销
	}else{
		alert(msg);
	}
};


/**
 * 批量操作流程的回调函数
 * @param data
 */
function change_batchfunc(data){
	if(data.result=='true'){
		 
		
		if(data.batchMark == 'batchLaunchSucc'){
			//TODO 批量发起成功后业务处理
		}else if(data.batchMark == 'batchApprovalSucc'){
			//TODO 批量审批通过后业务处理
			batchChangeApprAll(data);
		}else if(data.batchMark == 'batchRejectSucc'){
			//TODO 批量审批拒绝后业务处理
		}else if(data.batchMark == 'batchBackupSucc'){
			//TODO 批量审批撤回后业务处理
		}
	}else {
		alert(data.msg);
	}
}


//执行删除的方法
function batchChangeApprAll(data){
	var change_codes = "";
	var param = data.lists;
	for(var i=0;i<param.length;i++){
		if(param[i]['mark']=='over' && change_codes=="")
			change_codes = "'"+param[i]['biz_id']+"'";
		else if(param[i]['mark']=='over' && change_codes!="")
			change_codes =change_codes +","+ "'"+param[i]['biz_id']+"'";
	}
	if(change_codes=='') {
		getCurrentPageObj().find('#changeReqTableInfo').bootstrapTable('refresh',
				{url:dev_project+'PChangeReq/queryApproveList.asp?call='+changeAppQuery+'&SID='+SID+"&type=1"});
		return alert(data.msg);
	};
	var expertsCall = getMillisecond();
	var params = {};
	params["change_code"] = change_codes;
	baseAjaxJsonp(dev_project+'PChangeReq/upChangeApproveAll.asp?call='+expertsCall+'&SID='+SID,params, function(data) {
		if (data != undefined&&data!=null&&data.result=="true") {
			alert("审批成功");
			getCurrentPageObj().find('#changeReqTableInfo').bootstrapTable('refresh',
				{url:dev_project+'PChangeReq/queryApproveList.asp?call='+changeAppQuery+'&SID='+SID+"&type=1"});
		}else{
			alert("批量审批成功失败");
		}
	},expertsCall);
}

