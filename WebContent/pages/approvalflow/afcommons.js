var instance_id = "";
/**
 * 发起流程函数
 * @param param 发起流程需要传入的参数
 * @param callback 流程发起成功之后的回调函数
 * systemFlag：系统标识（合同系统：00，项目系统：01，报销系统：02，工程管理：03）
 */
function approvalProcess(param,launch_func){
	baseAjax("AFLaunch/startAFProcess.asp",param,function(data){
		if(data && data.result=="true"){
			instance_id=data.instanceid;
			if(launch_func){
				launch_func(data);
			}
		}else if(data && data.msg){
			alert(data.msg);
			return;
		}else {
			alert("流程发起异常！");
			return;
		}
	});
}

/**
 * 批量发起流程函数
 * @param batch_callFunc 批量发起后的回调函数
 */
function batchStartApprBtn(batch_callFunc){
	baseAjax("AFLaunch/batchStartAFProcess.asp",null,function(data){
		batch_callFunc(data);
	});
}

/**
 * 批量审批通过函数
 * @param instance_id 流程实例ID，可以是单个或多个以逗号隔开
 * @param batch_callFunc 批量审批通过后的回调函数
 */
function batchApprPassBtn(instance_id,batch_callFunc){
	var actor_no = $("#currentLoginNo").val();
	baseAjax("AFLaunch/batchApprPass.asp",{instance_id:instance_id,actor_no:actor_no},function(data){
		batch_callFunc(data);
	});
}

/**
 * 批量审批拒绝函数
 * @param instance_id 流程实例ID，可以是单个或多个以逗号隔开
 * @param batch_callFunc 批量审批拒绝后的回调函数
 */
function batchApprRejectBtn(instance_id,batch_callFunc){
	var actor_no = $("#currentLoginNo").val();
	baseAjax("AFLaunch/batchApprReject.asp",{instance_id:instance_id,actor_no:actor_no},function(data){
		batch_callFunc(data);
	});
}

/**
 * 批量审批撤回函数
 * @param instance_id 流程实例ID，可以是单个或多个以逗号隔开
 * @param batch_callFunc 批量审批撤回后的回调函数
 */
function batchApprBackBtn(instance_id,batch_callFunc){
	var actor_no = $("#currentLoginNo").val();
	baseAjax("AFLaunch/batchApprBack.asp",{instance_id:instance_id,actor_no:actor_no},function(data){
		batch_callFunc(data);
	});
}
/*----------------------------------流程demo单击事件实例--------------------------------*/
//批量审批发起单击事件
$("#batchStartApprBtn").click(function(){
	//approvalProcess("",callback);
});

//批量审批通过单击事件
$("#batchApprPassBtn").click(function(){
	var instance_id = '64b2ab7050ac42ce97efd30926c87a80';
	//batchApprPassBtn(instance_id,callback);
});

//批量审批拒绝单击事件
$("#batchApprRejectBtn").click(function(){
	var instance_id = '64b2ab7050ac42ce97efd30926c87a80';
	//batchApprRejectBtn(instance_id,callback);
});

//批量审批撤回（拿回）单击事件
$("#batchApprBackBtn").click(function(){
	var instance_id = '8bf37166c68e412e8b07a8e272c8570a,0476d7896c6c4db3ab42286845dcc50a';
	//batchApprBackBtn(instance_id,callback);
});

//查看审批
$("#viewApprProcess").click(function(){
	//initAFApprovalInfo("e141cb85a06f4c63aefe91f293102388");
});

//查询历史审批记录
$("#historyRecordOpt").click(function(){
	//initHistoryTable("e141cb85a06f4c63aefe91f293102388","historyPopDiv");
});

//撤回审批流程
$("#backupApprProcess").click(function(){
	//$("#instance_id").val("e141cb85a06f4c63aefe91f293102388");
	//approval('02');
});

//页面返回按钮
$("#backToAtherList").click(function(){
	//closeCurrPageTab();
});
