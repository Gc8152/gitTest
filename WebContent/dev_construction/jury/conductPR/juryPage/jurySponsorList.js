var jurySponsorQuery = "sponsor"+getMillisecond();
var jurySponsorobj = getCurrentPageObj().find("#juryTableInfo");
var jurySponsorurl = dev_construction+'GJury/queryJuryList.asp?call='+jurySponsorQuery+'&SID='+SID+'&jury_status=01,02,03';
initSJuryInfo(jurySponsorobj,jurySponsorurl,jurySponsorQuery);

$(function(){
	getCurrentPageObj().find("#queryJury").click(function(){
		queryJuryTable(jurySponsorobj,jurySponsorurl);
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#queryJury").click();});	
});

