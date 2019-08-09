	
function initsitAcceptBtn(item){
	var currTab = getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题
	//初始化下拉选
	autoInitSelect(currTab.find("#table_acceptInfo"));
	//赋值
	for (var key in item) {
		currTab.find("div[name="+key+"]").html(item[key]);
		currTab.find("select[name="+key+"]").val(item[key]);
		currTab.find("textarea[name="+key+"]").val(item[key]);
	}
	initSelect(currTab.find("select[name='ACCEPT_CONCLUSION']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_ACCEPT_CONCLUSION"},item.ACCEPT_CONCLUSION);
	/**初始化按钮开始**/	
	//保存
	var save = currTab.find("#save_sit");
	save.click(function(){
		if(!vlidate(currTab,"",true)){
			return ;
		}
		initsitAcceptsave(false);
	});
	//保存并提交
	var submit = currTab.find("#submit_sit");
	submit.click(function(){
		if(!vlidate(currTab,"",true)){
			return ;
		}
		initsitAcceptsave(true);
	});
	//返回
	var back = currTab.find("#back_sit");
	back.click(function(){
		closeCurrPageTab();
	});
	  
	function initsitAcceptsave(isCommit){
		var param = {};
		param["ACCEPT_CONCLUSION"]=currTab.find("select[name=ACCEPT_CONCLUSION]").val();
		param["ACCEOT_DESCRIBE"]=currTab.find("textarea[name=ACCEOT_DESCRIBE]").val();
		param["SIT_ID"]=item.SIT_ID;
		param["IS_COMMIT"]=isCommit;
		var call = getMillisecond();
		baseAjaxJsonp(dev_construction+"SitAccept/saveSitAccept.asp?call="+call+"&SID="+SID,param, function(data){
			if (data != undefined && data != null && data.result=="true" ) {
	       		alert(data.msg);
	       		closeCurrPageTab();
			}else{ 
				alert(data.msg);
			}
		}, call);
	}
	/**初始化按钮结束**/
	//点击文件上传模态框
	var tablefile = currTab.find("#table_file");
	var business_code = item.FILE_ID;
	getSvnFileList(tablefile, getCurrentPageObj().find("#fileview_modal"), business_code, "00");
}
initVlidate(getCurrentPageObj());