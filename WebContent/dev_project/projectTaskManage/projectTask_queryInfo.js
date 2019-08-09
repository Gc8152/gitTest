function initviewproject(data){
	var currTab = getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题
	//赋值
	for (var key in data) {
		currTab.find("div[name="+key+"]").html(data[key]);
	}
	//返回按钮
	var back = currTab.find("#back");
	back.click(function(){
		closeCurrPageTab();
	});
}
//页面内容收缩
$(function(){
      EciticTitleI();
})
