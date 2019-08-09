initVlidate(getCurrentPageObj());
initaddSupplierBtn();

function initaddSupplierBtn(item){
	var currTab = getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题    			
	/**初始化按钮开始**/	
	//点击保存按钮1
	var save = currTab.find("#problem_save");
	save.click(function(){
		if(!vlidate(currTab,"",true)){
			alert("您还有必填项没有填写！");
			return ;
		}
		var problem_description=getCurrentPageObj().find("#PROBLEM_DESCRIPTION").val();
		if(problem_description.length>1000){
			alert("问题描述过长，已超过3000字符！");
			return ;
		}
		var problem_name=getCurrentPageObj().find("#problem_name").val();
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
			  alert("该问题还未上传相应文件！");
			  return;
		  }*/
		initsave(false);
	});

	//返回
	var back = currTab.find("#back_uat");
	back.click(function(){
		closeCurrPageTab();
	});
	
	//点击保存按钮2
	function initsave(isCommit){
		//获取上传文件的文件名file_name
		var j=0;
		var checkResult="";
		var file_id=business_code;
		var call = getMillisecond();
		var param = getCurrentPageObj().find("#problem_from").serialize();
		var problem_names=getCurrentPageObj().find("#problem_name").val();
		baseAjax('Problem/findProblemAll1.asp?problem_name='+escape(encodeURIComponent(problem_name)), null,function(data) {
			if(data != "" && data != null && data.result=="true" ){
					if(data.rows.length==0){
						baseAjax(dev_background+"Problem/findProblemAdd.asp?file_id="+file_id+'&SID='+SID,param,function(data){
							if (data != undefined && data != null && data.result=="true" ) {
					       		alert("保存成功");
					       		closeCurrPageTab();
							}else{ 
								alert("系统异常，请稍后！");
							}
						});
					}
				   for(var i=0;i<data.rows.length;i++){
					   var name=data.rows[i].PROBLEM_NAME;
					   if(problem_names == name ){
						   checkResult="true";
							j=j+1;
						   alert("该问题名已经存在！！！");
					   }else{
						   checkResult="false";
					   }
				   	}
				   if(checkResult=="false" && j==0){
						baseAjax(dev_background+"Problem/findProblemAdd.asp?file_id="+file_id,param,function(data){
							if (data != undefined && data != null && data.result=="true" ) {
					       		alert("保存成功");
					       		closeCurrPageTab();
							}else{ 
								alert("系统异常，请稍后！");
							}
						});
					}
			   }
		});
	}
	/**初始化按钮结束**/
	/***附件***/
	/***页面生成需求id，用于判断添加问题的问题名称是否已经输入***/
	/***一开始设置file_id是为了方便保存***/
	var business_code = "";
	initReqId();
	function initReqId(){
		 var tablefile = getCurrentPageObj().find("#reqadd_filetable");
		 var aaa=getCurrentPageObj().find("#problem_from").serialize().problem_name;
		 if(aaa==null && aaa==''){
			 		alert("页面初始生成需求id失败:"+mess);
		 }else {
			  business_code = Math.uuid();
				 }
		 
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
		 
		 //初始化上传列表
		 getFtpFileList(tablefile, getCurrentPageObj().find("#reqadd_fileview_modal"), business_code, "0101");
	}
}