function initQualityManageImportLayout(id){
	var currTab = getCurrentPageObj();
	
	var form = currTab.find("#qualityManage_import");
	currTab.find("input[name=PROJECT_ID]").val(id);
	var table = currTab.find("#qualityImport_table");
	//选择
	var submit = currTab.find("#selectFile");
	submit.click(function(e){
		alert("选择");
	});
	//导入
	var submit = currTab.find("#importFile");
	submit.click(function(e){
		alert("导入");
	});
	//提交
	var submit = currTab.find("#qualityManage_import_submit");
	submit.click(function(e){
		/*var call = getMillisecond();
		var content = encodeURI(form.serialize());
		baseAjaxJsonp(dev_project+"quality/insertOrUpdateQuality.asp?call="+call+"&SID="+SID+"&"+content, null, function(data){
			if (data != undefined && data != null) {
				alert(data.msg);
				if(data.result=="true"){
					closeCurrPageTab();
				}
			}else{
				alert("未知错误！");
			}
		},call);*/
    });
	
	var back = currTab.find("#qualityManage_import_back");
	back.click(function(e){
		closeCurrPageTab();
	});
	
	initLayout();
	
	function initLayout(){
		var call = getMillisecond();
		baseAjaxJsonp(dev_project+"quality/queryOneProjectInfo.asp?call="+call+"&SID="+SID+"&PROJECT_ID="+id, null, function(result){
			//项目项目基本信息
			for(var i in result){
				currTab.find("input[name="+i+"]").val(result[i]);
			}
		}, call);
	}
	
}