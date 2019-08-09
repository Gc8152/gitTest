//定义批量操作流程的回调函数名
/**
 * 
 * @param result 审批结果：true;false
 * @param mark 审批标识：over;reject;back;
 * @param biz_id 业务ID
 * @param msg 审批提示内容
 */
getCurrentPageObj()[0].call_func=function proj_func(result,mark,biz_id,msg){
	if(mark=='over'){//审批通过
		//alert("审批通过");
		sitReportApprOver(biz_id,"00"); //业务id 
	}else if(mark=='reject'){
		sitReportApprOver(biz_id,"01");//审批打回
	}else if(mark=='back'){
		sitReportApprOver(biz_id,"02");//审批撤销
	}else{
		alert(msg);
	}
};


