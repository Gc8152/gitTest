;function initQualityManageAddLayout(id, quality_id){
	
	var currTab = getCurrentPageObj();
	initVlidate(currTab);
	var form = currTab.find("#qualityManage_add");
	currTab.find("input[name=PROJECT_ID]").val(id);
	
/*	currTab.find("#TYP").bind('change', function(e) {
		var work_product = currTab.find("#WORK_PRODUCT");
		if(currTab.find("#TYP").val() == 01){
			work_product.removeAttr("validate");
			work_product.parent().find("strong").remove();
			work_product.attr("disabled",true);
			work_product.val('');
			work_product.select2();
		}else{
			work_product.removeAttr("disabled");
			work_product.attr("validate","v.required").attr("valititle","该项为必填项");
			initVlidate(work_product.parent());
		}
	});*/
	
	var submit = currTab.find("#qualityManage_add_submit");
	submit.click(function(e){
		//判断是否为空
        if(!vlidate(currTab)){
			  return ;
		  }
		var call = getMillisecond();
		var content = form.serialize();
		baseAjaxJsonp(dev_project+"quality/insertOrUpdateQuality.asp?call="+call+"&SID="+SID+"&"+content, null, function(data){
			if (data != undefined && data != null) {
				alert(data.msg);
				if(data.result=="true"){
					closeCurrPageTab();
				}
			}else{
				alert("未知错误！");
			}
		},call);
    });
	
	var back = currTab.find("#qualityManage_add_back");
	back.click(function(e){
		closeCurrPageTab();
	});
	
	initLayout();
	
	function initLayout(){
		var call = getMillisecond();
		baseAjaxJsonp(dev_project+"quality/queryOneProjectInfo.asp?call="+call+"&SID="+SID+"&PROJECT_ID="+id, null, function(result){
			//项目项目基本信息
			for(var i in result){
				currTab.find("input[name="+i+"]").val(result[i]);
			}
		}, call);
	}
	var firstSelect = form.find("#TYP");
	firstSelect.bind('change',function(){
		var type = firstSelect.val();
		TYPSelect(type);
	});	
	function TYPSelect(type){
		var tr = firstSelect.parent().parent();
		var tds = tr.children();
		for(var i=2;i<tds.length;i++){
			$(tds[i]).remove();
		}
		
		if(type=="02"){
			tr.append(
			'<td class="table-text">所属工作产品：</td>'+
				'<td><select name="WORK_PRODUCT" diccode="P_DIC_QUALITY_WORK_PRODUCT" id="WORK_PRODUCT"></select></td>');
			initSelect(form.find("#WORK_PRODUCT"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_WORK_PRODUCT"});
			form.find("#WORK_PRODUCT").attr("validate","v.required").attr("valititle","该项为必填项");
			initVlidate(form.find("#WORK_PRODUCT").parent());
		}else{
			tr.append("<td></td><td></td>");
		}
	}
	if(quality_id){
		//update
		var call = getMillisecond();
		baseAjaxJsonp(dev_project+"quality/queryOneQuality.asp?call="+call+"&SID="+SID+"&QUALITY_ID="+quality_id, null, function(result){
			TYPSelect(result.TYP);
			//项目项目基本信息
			for(var i in result){
				currTab.find("input[name="+i+"]").val(result[i]);
				currTab.find("select[name="+i+"]").attr("value",result[i]);
				currTab.find("textarea[name="+i+"]").val(result[i]);
			}

/*			if(result.TYP=="01"){
				currTab.find("#WORK_PRODUCT").attr("disabled",true);
			}else{
				currTab.find("#WORK_PRODUCT").attr("validate","v.required").attr("valititle","该项为必填项");
				initVlidate(currTab.find("#WORK_PRODUCT").parent());
			}*/
			autoInitSelect(form);//初始化下拉框
		},call);
	} else {
		autoInitSelect(form);//初始化下拉框
	}

}