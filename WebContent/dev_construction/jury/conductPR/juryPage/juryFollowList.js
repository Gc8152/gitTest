var juryFollowQuery = "Follow"+getMillisecond();
var juryFollowobj = getCurrentPageObj().find("#juryTableInfo");
var juryFollowurl = dev_construction+'GJury/queryJuryList.asp?call='+juryFollowQuery+'&SID='+SID+'&jury_status=06,07';
initSJuryInfo(juryFollowobj,juryFollowurl,juryFollowQuery);

$(function(){
	getCurrentPageObj().find("#queryJury").click(function(){
		queryJuryTable(juryFollowobj,juryFollowurl);
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#queryJury").click();});	
});

