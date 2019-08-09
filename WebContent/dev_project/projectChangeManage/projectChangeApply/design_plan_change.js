function initDesignPlanChangeBtn(param){
	var currTab = getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题
	initVlidate(currTab);
	currTab.find("input[name=PRESENT_USER_ID]").val(param.PRESENT_USER_ID);
	currTab.find("input[name=PRESENT_USER_NAME]").val(param.PRESENT_USER_NAME);
	currTab.find("input[name=PRESENT_DATE]").val(param.PRESENT_DATE);
	var project_num = currTab.find("input[name=PROJECT_NUM]");
	project_num.click(function(){
		openProPop(currTab.find("#choosePro"),{User_id:currTab.find("input[name=PRESENT_USER_ID]"),Pro_id:currTab.find("input[name=PROJECT_ID]"),
		Pro_num:currTab.find("input[name=PROJECT_NUM]"),Pro_name:currTab.find("input[name=PROJECT_NAME]"),Pro_stage:currTab.find("input[name=PROJECT_STAGE]")
		});
	});
}
