var juryConfirmQuery = "confirm"+getMillisecond();

var juryConfirmobj = getCurrentPageObj().find("#juryTableInfo");
var juryConfirmurl = dev_construction+'GJury/queryJuryList.asp?call='+juryConfirmQuery+'&SID='+SID+'&jury_status=04';
initSJuryInfo(juryConfirmobj,juryConfirmurl,juryConfirmQuery);


$(function(){
	getCurrentPageObj().find("#queryJury").click(function(){
		queryJuryTable(juryConfirmobj,juryConfirmurl);
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#queryJury").click();});	
});

