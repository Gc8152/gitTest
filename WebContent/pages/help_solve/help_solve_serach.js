initVlidate(getCurrentPageObj());
function initSearchProblemBtn(item){
	var currTab = getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题    			
	
	//赋值
	if(item){
		for (var key in item) {
			currTab.find("input[id="+key+"]").val(item[key]);
			currTab.find("textarea[id="+key+"]").val(item[key]);
		}
	}
	initReqId(item.FILE_ID);
	/**初始化按钮开始**/	
	
	//返回
	var back = currTab.find("#back_uat");
	back.click(function(){
		closeCurrPageTab();
	});
	
	/**初始化按钮结束**/
}; 
/***附件***/

//页面生成需求id，用于马上提交和文件上传
function initReqId(file_id){
	 var tablefile = getCurrentPageObj().find("#reqadd_filetable");
	 var business_code = file_id;
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
