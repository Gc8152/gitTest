var pkid;
function initcontractEditBtn(item){
	pkid=item.type;
//	console.log(JSON.stringify(item));//查看获取参数item的值
	var currTab = getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题

	var btableCall = getMillisecond();
	//赋值
	for (var key in item.seles) {
		currTab.find("div[name="+key+"]").html(item.seles[key]);
	}
//	autoInitSelect(currTab.find("#table_info"));自动初始化下拉框中的值
	
	/**初始化按钮开始**/	
	//保存
	var save = currTab.find("#save_project");
	
	save.click(function(){
		/*if(!vlidate(currTab,"",true)){
			return ;
		}*/
		/*console.log(JSON.stringify(pkid));*/
		initsave(false);
	});
	
	//返回
	var back = currTab.find("#back_project");
	back.click(function(){
		closeCurrPageTab();
	});
	
	function initsave(isCommit){
	/*	debugger;*/
		var param = {};
		var projectInfo = currTab.find("#projectInfo");
		var inputs = projectInfo.find("input");
		var textareas = projectInfo.find("textarea");
		for (var i = 0; i < inputs.length; i++) {
			var obj = $(inputs[i]);
			param[obj.attr("name")] = $.trim(obj.val());
		}
		
		for (var i = 0; i < textareas.length; i++) {
			var obj = $(textareas[i]);
			param[obj.attr("name")] = $.trim(obj.val());
		}
	//	console.log(JSON.stringify(pkid));
		param["IS_COMMIT"]=isCommit;
		var call = getMillisecond();
	
		baseAjaxJsonp(dev_project+"draftCont/editContPro.asp?call="+call+"&SID="+SID+"&pkid="+pkid,param, function(data){
			if (data != undefined && data != null && data.result=="true" ) {
	       		alert(data.msg);
	       		closeCurrPageTab();
			}else{ 
				alert(data.msg);
			}
		}, call);
	}
	
	
	//修改时的赋值
	if(item.seles){
		for (var key in item.seles) {
			currTab.find("input[name="+key+"]").val(item.seles[key]);
			currTab.find("textarea[name=CON_BUDGET]").val(item.seles.CON_BUDGET);
		}
	} 
	
}


initVlidate(getCurrentPageObj());

//页面内容收缩
$(function(){
      EciticTitleI();
});
