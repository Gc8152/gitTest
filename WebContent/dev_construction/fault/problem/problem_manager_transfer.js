function initproProblemManagerBtn(PROBLEM_ID,PRJ_HANDLER,PRJ_HANDLER_NAME){ 
	var currTab=getCurrentPageObj();
	currTab.find("input[name=Old_PRJ_HANDLER]").val(PRJ_HANDLER);
	currTab.find("div[name=Old_PRJ_HANDLER_NAME]").html(PRJ_HANDLER_NAME);
	
	//转交操New_PRJ_HANDLER_NAME
	currTab.find("input[name=New_PRJ_HANDLER_NAME]").click(function(){ 
		openUserPop("addDivExpert",{name:$("#New_PRJ_HANDLER_NAME"),no:$("#New_PRJ_HANDLER")});
	});
	//确定
	
	currTab.find("#problem_manager_save").click(function(){

		closePageTab("problem_handle",null);
		closePageTab("problem_manager_transfer",null);
		openInnerPageTab("problem_handle","问题单处理页面","dev_construction/fault/problem/problem_handle.html",function(){
			$("#Ulsecond").attr("class","active");
			$("#tab2").removeAttr("class"); 
			$("#tab2").attr("class","tab-pane fade in active");
			$("#home").removeAttr("class"); 
			$("#home").attr("class","tab-pane fade");
			var PRJ_HANDLER_NAME = currTab.find("#New_PRJ_HANDLER_NAME").val();
			var PRJ_HANDLER = currTab.find("#New_PRJ_HANDLER").val();
			initProblemHandleLayout(PROBLEM_ID,PRJ_HANDLER_NAME,PRJ_HANDLER);
		/*	
			currTab.find("#PRJ_HANDLER_NAME").val(PRJ_HANDLER_NAME);
			currTab.find("#PRJ_HANDLER").val(PRJ_HANDLER);*/
		});
	});
}	
