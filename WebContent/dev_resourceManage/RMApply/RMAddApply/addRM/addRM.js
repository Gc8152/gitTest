(function (){
	$("#addSoftWare").click(function (){
		closeAndOpenInnerPageTab("addSoftWare", "新增软件","dev_resourceManage/RMApply/RMAddApply/addRM/addSoftWare.html",function(){});
	});	
})();
//时间控件
function initDate(){
	WdatePicker({
		dateFmt : 'yyyy-MM-dd',
		minDate : '1990-01-01',
		maxDate : '2050-12-01'
	});
}
/* 显示更多表格内容 */
function chebox(showMore){
	if($(".hide").is(":hidden")){
		$(showMore).find("i").attr("class","icon-chevron-down");
		$(".combine2").attr("rowspan","3");
	}else{
		$(showMore).find("i").attr("class","icon-chevron-right");
		$(".combine2").attr("rowspan","1");
	}
	$(".hide").toggle();
}