var juryExecuteQuery = "execute"+getMillisecond();
var juryExecuteobj = getCurrentPageObj().find("#juryTableInfo");
var sponsor_id= $("#currentLoginNo").val();
var juryExecuteurl = dev_construction+'GJury/queryJuryList.asp?call='+juryExecuteQuery+'&SID='+SID+'&jury_status=06'+'&sponsor_id='+sponsor_id;
initSJuryInfo(juryExecuteobj,juryExecuteurl,juryExecuteQuery);

$(function(){
	getCurrentPageObj().find("#queryJury").click(function(){
		queryJuryTable(juryExecuteobj,juryExecuteurl);
	});
});
