var juryConcluQuery = "conclu"+getMillisecond();
var juryConcluobj = getCurrentPageObj().find("#juryTableInfo");
var juryConcluurl = dev_construction+'GJury/queryJuryList.asp?call='+juryConcluQuery+'&SID='+SID+'&jury_status=06&type=end';
initSJuryInfo(juryConcluobj,juryConcluurl,juryConcluQuery);

$(function(){
	getCurrentPageObj().find("#queryJury").click(function(){
		queryJuryTable(juryConcluobj,juryConcluurl);
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#queryJury").click();});	
});

