//定义单个流程发起成功后的回调函数名
var launch_func = launchFunc;
//单个流程审批结束、拒绝、拿回操作的回调函数名
var call_func = proj_func;
//定义批量操作流程的回调函数名
var batch_callFunc = proj_batchfunc;

/**
 * 单个发起流程成功后的回调函数
 * @param data
 */
function launchFunc(data){
	//TODO 根据返回的data（json格式）数据做相应的业务处理
}

/**
 * 单个流程审批结束、拒绝、拿回操作的回调函数
 * @param result 审批结果：true;false
 * @param mark 审批标识：over;reject;back;
 * @param biz_id 业务ID
 * @param msg 审批提示内容
 */
function proj_func(result,mark,biz_id,msg){
	if(mark == 'reject'){
		repulsed(biz_id);
	}else if(mark == 'back'){
		nahui(biz_id);
	}else if(mark == 'over'){
		approved(biz_id);
	}else {
		alert(msg);
	}
}

/**
 * 批量操作流程的回调函数
 * @param data
 */
function proj_batchfunc(data){
	if(data.result=='true'){
		alert(data.batchMark);
		if(data.batchMark == 'batchLaunchSucc'){
			//TODO 批量发起成功后业务处理
		}else if(data.batchMark == 'batchApprovalSucc'){
			//TODO 批量审批通过后业务处理
		}else if(data.batchMark == 'batchRejectSucc'){
			//TODO 批量审批拒绝后业务处理
		}else if(data.batchMark == 'batchBackupSucc'){
			//TODO 批量审批撤回后业务处理
		}
	}else {
		alert(data.msg);
	}
}