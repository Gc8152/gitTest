var call_func = proj_func;

//定义批量操作流程的回调函数名
var Sendbatch_callFunc = sendPro_batchfunc;
/**
 * 
 * @param result 审批结果：true;false
 * @param mark 审批标识：over;reject;back;
 * @param biz_id 业务ID
 * @param msg 审批提示内容
 */
function proj_func(result,mark,biz_id,msg){
	if(mark=='over'){//审批通过
		//alert("审批通过");
		updateProduceApplyStatus(biz_id,"03"); //业务id
	}else if(mark=='reject'){
		updateProduceApplyStatus(biz_id,"04");//审批打回
	}else if(mark=='back'){
		//nahui(data.biz_id);//审批撤销
	}else{
		alert(msg);
		updateCurrDisposeMan(biz_id);
	}
	
	
}


/**
 * 批量操作流程的回调函数
 * @param data
 */
function sendPro_batchfunc(data){
	if(data.result=='true'){
		 
		
		if(data.batchMark == 'batchLaunchSucc'){
			//TODO 批量发起成功后业务处理
		}else if(data.batchMark == 'batchApprovalSucc'){
			//TODO 批量审批通过后业务处理
			batchSendApprAll(data);
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
function batchSendApprAll(data){
	var audit_nos = "";
	var param = data.lists;
	for(var i=0;i<param.length;i++){
		if(param[i]['mark']=='over' && audit_nos=="")
			audit_nos = "'"+param[i]['biz_id']+"'";
		else if(param[i]['mark']=='over' && audit_nos!="")
			audit_nos =audit_nos +","+ "'"+param[i]['biz_id']+"'";
	}
	if(audit_nos==''){
		getCurrentPageObj().find("#sendProduceTable").bootstrapTable("refresh",
				{url:dev_construction+'sendProduceApprove/queryAllSendProInfo.asp?call='+sendProduceApply_queryList_call+'&SID='+SID});
		return alert(data.msg);
	}
	var params = {};
	params["audit_no"] = audit_nos;
	params["approve_status"] = "03";
	var call = getMillisecond();
    baseAjaxJsonp(dev_construction+'sendProduceApply/allowApproveAll.asp?call='+call+'&SID='+SID,params, function(data) {
		if (data != undefined&&data!=null&&data.result=="true") {
			alert("审批成功");
			getCurrentPageObj().find("#sendProduceTable").bootstrapTable("refresh",{url:dev_construction+'sendProduceApprove/queryAllSendProInfo.asp?call='+call+'&SID='+SID});
		}else{
			alert("批量审批成功失败");
		}
	},call);
}
