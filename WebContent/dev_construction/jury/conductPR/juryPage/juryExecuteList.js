var juryExecuteQuery = "execute"+getMillisecond();
var juryExecuteobj = getCurrentPageObj().find("#juryTableInfo");
var juryExecuteurl = dev_construction+'GJury/queryJuryList.asp?call='+juryExecuteQuery+'&SID='+SID+'&jury_status=06';
initSJuryInfo(juryExecuteobj,juryExecuteurl,juryExecuteQuery);

$(function(){
	getCurrentPageObj().find("#queryJury").click(function(){
		queryJuryTable(juryExecuteobj,juryExecuteurl);
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#queryJury").click();});	
});
