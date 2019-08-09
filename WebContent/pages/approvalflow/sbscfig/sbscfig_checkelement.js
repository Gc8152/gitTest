//页面返回按钮
$("#CgoBackSbscfigList").click(function(){
	closeCurrPageTab();
});
//加载页面表单数据
function initAFFactDetail(b_code,system_code){
	var url ="AFFact/queryAllFactorsInfo.asp?b_code="+b_code+"&system_code="+system_code;
	baseAjaxJsonp(url, null, function(data){
		if(data){
			for(var k in data.rows[0]){
		        getCurrentPageObj().find("#"+k).text(data.rows[0][k]);
			}
		}
	});
}