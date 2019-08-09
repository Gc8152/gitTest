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
function openpage(){
	closeCurrPageTab();
}
(function(){
	$("#addRegister").click(function (){
		closeAndOpenInnerPageTab("addRegister", "新建登记","dev_resourceManage/ERmanage_manager/ERaddRegister/addRegister.html",function(){});
	});
})();