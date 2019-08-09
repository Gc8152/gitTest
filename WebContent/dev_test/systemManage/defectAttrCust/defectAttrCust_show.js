function showDefect(item){
	var $page = getCurrentPageObj();//当前页
	initVlidate($page);//渲染必填项
	autoInitSelect($page);//初始化下拉选择
		 for(var k in item){
			 if(k == "ATTR_TYPE"){
				if(item.ATTR_TYPE == '00'){
					$page.find("#tr1").show();
					$page.find("#tr2").hide();
					$page.find("#tr3").hide();
					}
				 else{
					 $page.find("#tr2").show(); 
					 $page.find("#tr3").show(); 
					 $page.find("#tr1").hide();
				 }
				 continue;
				 
			 }
			 if(k=="NECESSARY"){
				 if(item.NECESSARY=='00'){
					 $page.find("#NECESSARY").text("是");
				 }
				 if(item.NECESSARY=='01'){
					 $page.find("#NECESSARY").text("否");
				 }
				 continue;
			 }
			getCurrentPageObj().find("#"+k).text(item[k]);
		 
	}

	//按钮事件
	function initButtonEvent(edit){
		$page.find("#NECESSARY0").click(function(){
			$(this).attr("checked",true);
			$page.find("#NECESSARY1").attr("checked",false);
		});
		
		$page.find("#NECESSARY1").click(function(){
			$(this).attr("checked",true);
			$page.find("#NECESSARY0").attr("checked",false);
		});
			
	};



};