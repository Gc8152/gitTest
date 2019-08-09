var juryAllQuery = "all"+getMillisecond();
var juryAllobj = getCurrentPageObj().find("#juryTableInfo");
var juryAllurl = dev_construction+'GJury/queryJuryList.asp?call='+juryAllQuery+'&SID='+SID+'&jury_status=';
initSJuryInfo(juryAllobj,juryAllurl,juryAllQuery);

$(function(){
	getCurrentPageObj().find("#queryJury").click(function(){
		queryJuryTable(juryAllobj,juryAllurl);
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#queryJury").click();});	
});

