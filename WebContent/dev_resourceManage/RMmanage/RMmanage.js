(function (){
	$("#addER").click(function (){
		closeAndOpenInnerPageTab("addER", "新增环境资源","dev_resourceManage/RMmanage/RMadd/RMListAdd.html",function(){});
	});
	$("#updateER").click(function (){
		
		closeAndOpenInnerPageTab("updateER", "变更环境资源","dev_resourceManage/RMmanage/RMchange/RMchange.html",function(){});
	});
})();