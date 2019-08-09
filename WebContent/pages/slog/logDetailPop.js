function showLogDetail(id,row){
	getCurrentPageObj().find("#"+id).load("pages/slog/logDetailPop.html",{},function(){
		$("#logDetailPop").modal("show");
		$("#opt_person").val(row[0].USER_NAME);
		$("#opt_time").val(row[0].OPT_TIME);
		$("#business_id").val(row[0].BUSINESS_ID);
		$("#memo").val(row[0].MEMO);
		$("#closeLogDetailPop").click(function(){
			$("#logDetailPop").modal("hide");
		});
	});
}