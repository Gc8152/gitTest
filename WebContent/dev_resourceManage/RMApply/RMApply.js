(function (){
	$("#RMAddApply").click(function (){
		closeAndOpenInnerPageTab("RMAddApply", "新增申请","dev_resourceManage/RMApply/RMAddApply/RMAddApply.html",function(){});
	});	
	$("#RMAdjustApply").click(function (){
		closeAndOpenInnerPageTab("RMAdjustApply", "调整申请","dev_resourceManage/RMApply/RMAdjustApply/RMAdjustApply.html",function(){});
	});
	$("#RMReuseApply").click(function (){
		closeAndOpenInnerPageTab("RMReuseApply", "续用申请","dev_resourceManage/RMApply/RMReuseApply.html",function(){});
	});
})();