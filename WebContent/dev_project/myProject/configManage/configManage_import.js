;function initconfigManageImportLayout(id){
	var currTab = getCurrentPageObj();
	var form = currTab.find("#configManage_add");
	
	//导入按钮
	var back = currTab.find("#config_import_import");
	back.click(function(e){
		alert("功能暂定");
	});
	//导入选择按钮
	var back = currTab.find("#config_import_choice");
	back.click(function(e){
		alert("功能暂定");
	});
	
	//返回按钮
	var back = currTab.find("#config_import_back");
	back.click(function(e){
		closeCurrPageTab();
	});
	var back = currTab.find("#config_import_sumit");
	back.click(function(e){
		closeCurrPageTab();
	});
	
	initLayout();
	
	function initLayout(){
	    baseAjaxJsonp(dev_project+"Confignotconform/confignotconformFindProjectQueryOne.asp?SID="+SID+"&PROJECT_ID="+id, null, function(result){
	    	//项目项目基本信息
	    	for(var i in result){
	    		currTab.find("input[name="+i+"]").val(result[i]);
	    	}
	    }); 
	}
}