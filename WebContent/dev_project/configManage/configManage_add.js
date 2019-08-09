/**
 * 需求更改，不再显示该页面（杨斌 2017-01-23）
 */

//;function initconfigManageAddLayout(id, config_id){
//	var currTab = getCurrentPageObj();
//	var form = currTab.find("#configManage_add_form");
//	currTab.find("input[name=PROJECT_ID]").val(id);
//	currTab.find("input[name=CONFIG_ID]").val(config_id);
//	//保存
//	var submit = currTab.find("#configManage_add_submit");
//	submit.click(function(e){
//		var content = form.serialize();
//		//判断是否为空
//        if(!vlidate($("#configManage_add_form"))){
//			  return ;
//		  }
//		var call =getMillisecond();
//		baseAjaxJsonp(dev_project+"Confignotconform/confignotconformAdd.asp?call="+call+"&SID="+SID+"&"+content, null, function(data){
//			if (data != undefined && data != null) {
//				alert(data.msg);
//				if(data.result=="true"){
//					closeCurrPageTab();
//				}
//			}else{
//				alert("未知错误！");
//			}
//		},call);
//	});
//	
//	
//	var back = currTab.find("#commit_nonconformityManage_add_back");
//	back.click(function(e){
//		closeCurrPageTab();
//	});
//	
//	initLayout();
//	
//	function initLayout(){
//	    baseAjaxJsonp(dev_project+"Confignotconform/confignotconformFindProjectQueryOne.asp?SID="+SID+"&PROJECT_ID="+id, null, function(result){
//	    	//项目项目基本信息
//	    	for(var i in result){
//	    		currTab.find("input[name="+i+"]").val(result[i]);
//	    	}
//	    if(config_id){
//	    	//update
//	    	//TODO
//	    	baseAjaxJsonp(dev_project+"Confignotconform/confignotconformFindQueryOne.asp?SID="+SID+"&CONFIG_ID="+config_id, null, function(result){
//		    	//不符合项本信
//		    	for(var i in result){
//		    		currTab.find("input[name="+i+"]").val(result[i]);
//    				currTab.find("select[name="+i+"]").attr("value",result[i]);
//    				currTab.find("textarea[name="+i+"]").val(result[i]);
//		    	}
//		    	autoInitSelect(form);//初始化下拉框
//		    });
//	    }else {
//    		autoInitSelect(form);//初始化下拉框
//    	}
//	    });
//	
//	}
//}