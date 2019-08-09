function showTask(data){
	var currTab = getCurrentPageObj();
	//赋值
	for (var key in data) {
		currTab.find("div[name="+key+"]").html(data[key]);
		currTab.find("pre[name="+key+"]").html(data[key]);
		
	}
	if(data.TASK_STATE!="05"){
		getCurrentPageObj().find("#back_reason_tr").hide();
	}
	//返回按钮
	var back = currTab.find("#back");
	back.click(function(){
		closeCurrPageTab();
	});
	
}