//列表上面的按钮效果
function moreIlsh(){
	var buttons = getCurrentPageObj().find("#moreIlsh").parent().children();
	for(var i=3;i<buttons.length-1;i++){
		$(buttons[i]).toggle();
	}
	getCurrentPageObj().find("#moreIlsh").toggleClass("moreIlshBg");
}
moreIlsh();
/*getCurrentPageObj().find("#ecitic-table").css({"height":"47px"});*/
getCurrentPageObj().find("#seniorQuery").click(function() {
	var EciticInquire=getCurrentPageObj().find("#ecitic-inquire");
	var EciticTable=getCurrentPageObj().find("#ecitic-table");
	if($(this).is(".open")){
		$(this).removeClass("open");
		EciticInquire.css({"height":"47px"});
		EciticTable.css({"height":"47px"});
		$(this).children("span").removeClass("seniorQuerySub");
	}else{
		$(this).addClass("open");
		EciticInquire.css({"height":"95px"});
		EciticTable.css({"height":"95px"});
		$(this).children("span").addClass("seniorQuerySub");
	}
});