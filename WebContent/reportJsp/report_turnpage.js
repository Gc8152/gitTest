
function initReportpage(){
	/*var menu_flag = $(".current").attr("tabid");  //当布局为多页签时flag取当前的tabid,当布局不为多页签时flag取menu_page
	if(menu_flag== null || menu_flag == undefined){
		menu_flag = $("[menu_page]:visible").attr("menu_page");	//取当前左侧菜单的菜单编号
	}
	openInnerPageTab("userReport","用户报表","report/userReport.asp?menu_flag="+menu_flag,function(){
		
	});*/
	var curentPageTab=$("[page]:visible");
	//console.info($("[page]:visible"));
	loadPage("report/userReport.asp?menu_flag="+curentPageTab.attr("page"),function(data){
		curentPageTab.append(data);
	});
}
setTimeout(function(){
	initReportpage();
},250);