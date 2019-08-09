	
function initSitTestReportInfoLayout(item){
	var currTab = getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题

	var tablefile = currTab.find("#table_file");
	
	//初始化下拉选
	autoInitSelect(currTab.find("#sitReportInfo"));
	//赋值
	if(item){
		for (var key in item) {
			currTab.find("span[name="+key+"]").html(item[key]);
			currTab.find("input[name="+key+"]").val(item[key]);
			currTab.find("select[name="+key+"]").val(item[key]);
			currTab.find("textarea[name="+key+"]").val(item[key]);
		}
	}
	initSelect(currTab.find("select[name='ACCEPT_RESULT']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_ACCEPT_CONCLUSION"},item.ACCEPT_CONCLUSION);
	/**初始化按钮开始**/	
	//保存
	var save = currTab.find("#saveSitReprot");
	save.click(function(){
		if(!vlidate(currTab,"",true)){
			return ;
		}
		initsave(false);
	});
	//保存并提交
	var submit = currTab.find("#submitSitReprot");
	submit.click(function(){
		if(!vlidate(currTab,"",true)){
			return ;
		}
		initsave(true);
	});
	//返回
	var back = currTab.find("#backSitReprot");
	back.click(function(){
		closeCurrPageTab();
	});
	  
	function initsave(isCommit){
		var param = {};
		var selectInfo = currTab.find("#sitReportInfo");
		var inputs = selectInfo.find("input");
		var selects = selectInfo.find("select");
		var textareas = selectInfo.find("textarea");
		for (var i = 0; i < inputs.length; i++) {
			var obj = $(inputs[i]);
			param[obj.attr("name")] = $.trim(obj.val());
		}
		for (var i = 0; i < selects.length; i++) {
			var obj = $(selects[i]);
			param[obj.attr("name")] = $.trim(obj.val());
		}
		for (var i = 0; i < textareas.length; i++) {
			var obj = $(textareas[i]);
			param[obj.attr("name")] = $.trim(obj.val());
		}
		param["SIT_ID"]=item.SIT_ID;
		param["IS_COMMIT"]=isCommit;
		var call = getMillisecond();
		baseAjaxJsonp(dev_construction+"SitReport/saveSitReport.asp?call="+call+"&SID="+SID,param, function(data){
			if (data != undefined && data != null && data.result=="true" ) {
	       		alert(data.msg);
	       		closeCurrPageTab();
			}else{ 
				alert(data.msg);
			}
		}, call);
	}
	/**初始化按钮结束**/
	
	//附件上传
	var file_id = "";
	file_id = currTab.find("input[name=FILE_ID]").val();
	if(!file_id){
		file_id = Math.uuid();
		currTab.find("input[name=FILE_ID]").val(file_id);
	}
	var paramObj = new Object();
	
	//构建文件上传路径拼接所需参数
	paramObj.supplier_name = "宇信珠海";
	paramObj.member_code = "0";
	
	//点击打开上传模态框
	var addfile = currTab.find("#add_file");
	addfile.click(function(){
		openFileSvnUpload(currTab.find("#file_modal"), tablefile, file_id, "S_DIC_SIT_TEST_FILE", "xq2017-3-13", paramObj);
	});
	
	//附件删除
	var delete_file = currTab.find("#delete_file");
	delete_file.click(function(){
		delSvnFile(tablefile, file_id);
	});
	
	//初始化附件列表
	getSvnFileList(tablefile,currTab.find("#file_view_modal"),file_id);
}
initVlidate(getCurrentPageObj());