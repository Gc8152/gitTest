//定义批量操作流程的回调函数名
var batch_callFunc = reqApprovePass_batchfunc;
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
		reqApproveOver(biz_id,"01"); //业务id
	}else if(mark=='reject'){
		reqApproveOver(biz_id,"02");//审批打回
	}else if(mark=='back'){
		//nahui(data.biz_id);//审批撤销
	}else{
		alert(msg);
	}
};

/**
 * 批量操作流程的回调函数
 * @param data
 */
function reqApprovePass_batchfunc(data){
	if(data.result=='true'){
		if(data.batchMark == 'batchLaunchSucc'){
			//TODO 批量发起成功后业务处理
		}else if(data.batchMark == 'batchApprovalSucc'){
			//TODO 批量审批通过后业务处理
			batchReqApprPassAll(data);
		}else if(data.batchMark == 'batchRejectSucc'){
			//TODO 批量审批拒绝后业务处理
		}else if(data.batchMark == 'batchBackupSucc'){
			//TODO 批量审批撤回后业务处理
		}
	}else {
		alert(data.msg);
	}
}


//执行审批通过之后的业务逻辑处理
function batchReqApprPassAll(data){
	var req_ids = "";
	var req_acc_classifies ="";//定义需求分类参数
	var param = data.lists;
	//获取页面需求分类参数
	var valu=getCurrentPageObj().find("#gReqForApproveTable").bootstrapTable('getSelections');
	
	
	for(var i=0;i<param.length;i++){
		if(param[i]['mark']=='over' && req_ids==""){
			req_ids = param[i]['biz_id'];
			//页面获取到值则做判断
			if(valu!=""&&valu!=undefined){
				var req_acc_classifiese=$.map(valu, function (row) {return row.REQ_ACC_CLASSIFY;});
				req_acc_classifies=req_acc_classifiese[i];
			}
		
		}else if(param[i]['mark']=='over' && req_ids!=""){
			req_ids =req_ids +","+ param[i]['biz_id'];
			if(valu!=""&&valu!=undefined){
				var req_acc_classifiese=$.map(valu, function (row) {return row.REQ_ACC_CLASSIFY;});
				req_acc_classifies=req_acc_classifies +","+req_acc_classifiese[i];
			}
		}
		
	}
	if(req_ids==''){//流程未结束时中止返回，不进行下一步的逻辑处理 
		 alert(data.msg);
		 return;
		 getCurrentPageObj().find("#gReqForApproveTable").bootstrapTable("refresh");
	}
	
	
	var reqApprPassAll = getMillisecond();
	var params = {};
	params["req_ids"] = req_ids;
	params["req_acc_classifies"] =req_acc_classifies;
	baseAjaxJsonp(dev_construction+'requirement_accept/reqApproveAllPass.asp?call='+reqApprPassAll+'&SID='+SID+'&approve_result=01',params, function(data) {
		if (data != undefined&&data!=null&&data.result=="true") {
			
			fileMove(valu);
			
			alert("批量审批成功");
			getCurrentPageObj().find("#gReqForApproveTable").bootstrapTable("refresh");
		}else{
			alert("批量审批失败");
		}
	},reqApprPassAll);
	
	function fileMove(list){
		for(var i=0; i<list.length; i++){
			var item = list[i];
			var param = new Object();
		    //"system_name","fromBid","toBid","SID","is_dic"
		    param.system_name=item["SYSTEM_NAME"];
		    param.SID = SID;
		    var fromBid1 = item["FILE_ID"];
		    var fromBid2 = item["ACCE_FILE_ID"]; 
		    
		    if(typeof(fromBid)=="undefined" || typeof(fromBid2)=="undefined"){
		    	param.fromBid = fromBid1 +","+ fromBid2;
		    } else {
		    	param.fromBid = fromBid1+","+fromBid2;
		    }
		    param.toBid = item["REQ_CODE"];
		    param.is_dic = true;
			baseAjax("sfile/mvFTPFile.asp", param, function(result){
		    }, true);
		}
	}
}




