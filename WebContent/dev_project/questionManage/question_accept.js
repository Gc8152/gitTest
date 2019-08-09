

function changeAcceptOption(obj){
	var optionVal = $(obj).val();
	if(optionVal == "02"){//拒绝时，只显示原因说明
		getCurrentPageObj().find(".agreeOption").hide();
		getCurrentPageObj().find(".NotAgreeOption").show();
	}else{
		getCurrentPageObj().find(".agreeOption").show();
		getCurrentPageObj().find(".NotAgreeOption").hide();
	}
}