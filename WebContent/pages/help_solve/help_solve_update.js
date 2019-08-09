initVlidate(getCurrentPageObj());
function initUpdateProblemBtn(item){
	var currTab = getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题    			
	
	//赋值
	if(item){
		for (var key in item) {
			currTab.find("input[id="+key+"]").val(item[key]);
			currTab.find("textarea[id="+key+"]").val(item[key]);
		}
	}
	var file=item.FILE_ID;
	initReqId(file);
	/**初始化按钮开始**/	
	//保存
	var save = currTab.find("#problem_save");
	save.click(function(){
		if(!vlidate(currTab,"",true)){
			return ;
		}
		var problem_description=getCurrentPageObj().find("#PROBLEM_DESCRIPTION").val();
		if(problem_description.length>1000){
			alert("问题描述过长，已超过3000字符！");
			return ;
		}
		var problem_name=getCurrentPageObj().find("#PROBLEM_NAME").val();
		if(problem_name.length>333){
			alert("问题名称过长，已超过1000字符！");
			return ;
		}
		var problem_solution=getCurrentPageObj().find("#PROBLEM_SOLUTION").val();
		
		if(problem_solution.length>1000){
			alert("解决方案过长，已超过3000字符！");
			return ;
		}
		/*var filedata = getCurrentPageObj().find("#reqadd_filetable").bootstrapTable("getData");
		if(filedata==""){
			  alert("该需求还未上传相应文件！");
			  return;
		  }*/
		initsave(false);
	});
	
	//返回
	var back = currTab.find("#back_uat");
	back.click(function(){
		closeCurrPageTab();
	});
	
	function initsave(isCommit){
		var params = getCurrentPageObj().find("#problemUpdate_form").serialize();
		var call = getMillisecond();
		baseAjax(dev_background+"Problem/findProblemUpdate.asp?",params,function(data){
			if (data != undefined && data != null && data.result=="true" ) {
	       		alert("保存成功");
	       		closeCurrPageTab();
			}else{ 
				alert("系统异常，请稍后！");
			}
		});
		
	}
	/**初始化按钮结束**/
/***附件***/
//页面生成需求id，用于马上提交和文件上传
function initReqId(file){
	 var tablefile = getCurrentPageObj().find("#reqadd_filetable");
	 var business_code=file;
	 /**初始化按钮结束**/
	 //附件上传
	 //点击打开模态框
	 var addfile = getCurrentPageObj().find("#reqadd_file");
	 addfile.click(function(){
		 var paramObj = new Object();
		 paramObj.FILE_DIR = business_code;
		//var req_id=getCurrentPageObj().find('#req_id_reqAdd').val();
	 	openFileFtpUpload(getCurrentPageObj().find("#reqadd_modalfile"), tablefile, 'GZ1075',business_code, '0101', 'H_DIC_FILE_HELP_SOLVE', false,false, paramObj);
	 });

	 //附件删除
	 var delete_file = getCurrentPageObj().find("#reqdelete_file");
	 delete_file.click(function(){
	 	delFtpFile(tablefile, business_code, "0101");
	 });
	 
	 getFtpFileList(tablefile, getCurrentPageObj().find("#reqadd_fileview_modal"), business_code, "0101");
}
}; 
