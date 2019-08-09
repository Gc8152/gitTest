
var $page = getCurrentPageObj();//当前页

//修改初始化
function caseAttrshow(item){
	var $page = getCurrentPageObj();
	initVlidate($page);//渲染必填项
	autoInitSelect($page);//初始化下拉选择
	//下拉框以及单选框赋值
	 for(var k in item){
		 //下拉框赋值，隐藏
		 if(k == "ATTR_TYPE"){
			if(item.ATTR_TYPE == '00'){
				$page.find("#text").show();
				$page.find("#drop_down_box").hide();
				$page.find("#tr3").hide();
				}
			 else{
				 $page.find("#drop_down_box").show(); 
				 $page.find("#tr3").show(); 
				 $page.find("#text").hide();
			 }
			 continue; 
		 }
		 
	
		 //单选框赋值
		 if(k=="NECESSARY"){
			 if(item.NECESSARY=='00'){
				 $page.find("#NECESSARY").text("是");
			 }
			 if(item.NECESSARY=='01'){
				 $page.find("#NECESSARY").text("否");
			 }
			 continue;
		 }
		 //案例属性表赋值
		getCurrentPageObj().find("#"+k).text(item[k]);
	 }
	 //updateCaseAttr();
}