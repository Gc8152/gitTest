/**
 * 状态控制
 * @param state_type
 * @param biz_id
 */
function leaveAppUpdateOutPersonState(state_type,biz_id){
	baseAjaxJsonp(dev_outsource+"outperson/leaveUpdateOutPersonState.asp?call=jq_1520475159620&SID="+SID,{op_id:biz_id,state_type:state_type},function(data){
		
	},"jq_1520475159620");
}
/**
 * 
 * @param result 审批结果：true;false
 * @param mark 审批标识：over;reject;back;
 * @param biz_id 业务ID
 * @param msg 审批提示内容
 */
getCurrentPageObj()[0].call_func=function(result,mark,biz_id,msg){
	if(mark=='over'){//审批通过
		leaveAppUpdateOutPersonState("over",biz_id);
	}else if(mark=='reject'){
		leaveAppUpdateOutPersonState("reject",biz_id);
	}else if(mark=='back'){
		leaveAppUpdateOutPersonState("back",biz_id);
	}else{
		alert(msg);
	}
};