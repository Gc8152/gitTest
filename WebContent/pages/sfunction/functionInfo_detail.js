//查看常用功能
function functionInfo_detail(param){
	var menu_code=param;
	baseAjax("SFunction/selFunctionByMenuCode.asp?menu_code="+menu_code, null, function(msg){
		for(var k in msg.fun){
			getCurrentPageObj().find("#"+k).text(msg.fun[k]);
		}
	});
}