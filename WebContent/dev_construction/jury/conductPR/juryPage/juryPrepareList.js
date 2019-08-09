var juryPrepareQuery = "prepare"+getMillisecond();
var juryPrepareobj = getCurrentPageObj().find("#juryTableInfo");
var juryPrepareurl = dev_construction+'GJury/queryJuryList.asp?call='+juryPrepareQuery+'&SID='+SID+'&jury_status=05';
initSJuryInfo(juryPrepareobj,juryPrepareurl,juryPrepareQuery);

$(function(){
	getCurrentPageObj().find("#queryJury").click(function(){
		queryJuryTable(juryPrepareobj,juryPrepareurl);
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#queryJury").click();});	
});
