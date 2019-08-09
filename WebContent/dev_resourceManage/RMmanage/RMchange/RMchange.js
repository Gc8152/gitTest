(function (){
	$("#changeRM").click(function (){
		closeAndOpenInnerPageTab("changeRM", "变更资源池设备","dev_resourceManage/RMmanage/RMchange/changeRM.html",function(){});
	});
	$("#upchangeRM").click(function (){
		closeAndOpenInnerPageTab("upchangeRM", "变更资源池设备","dev_resourceManage/RMmanage/RMchange/changeRM.html",function(){});
	});
})();
$("#seniorQuery").click(function() {
	var EciticInquire=getCurrentPageObj().find("#ecitic-inquire");
	var EciticTable=getCurrentPageObj().find("#ecitic-table");
	if($(this).is(".open")){
		$(this).removeClass("open");
		EciticInquire.css({"height":"47px"});
		EciticTable.css({"height":"47px"});
	}else{
		$(this).addClass("open");
		EciticInquire.css({"height":"95px"});
		EciticTable.css({"height":"95px"});
	}
});