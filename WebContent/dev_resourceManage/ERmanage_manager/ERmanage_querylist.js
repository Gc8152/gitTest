(function (){
	$("#addERManager").click(function (){
		closeAndOpenInnerPageTab("addERManager", "新增环境资源","dev_resourceManage/ERmanage_manager/ERmanage_add.html",function(){});
	});
	$("#updateERManager").click(function (){
		
		closeAndOpenInnerPageTab("updateERManager", "变更环境资源","dev_resourceManage/ERmanage_manager/ERmanage_add.html",function(){});
	});
})();