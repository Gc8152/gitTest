function opendemandPop(id,req_code){
	$('#modal_demandInfo').remove();
	$("#"+id).load("dev_project/projectEstablishManage/projectEstablish/demandPop.html",{},function(){
		var call = getMillisecond();
		$("#modal_demandInfo").modal("show");
		baseAjaxJsonp(dev_project+"draftPro/queryOneReqInfo.asp?call="+call+"&SID="+SID,{REQ_CODE:req_code}, function(data){
			for ( var k in data) {
				$("div[name="+k+"]").html(data[k]);
			}
		}, call);
	});
}
