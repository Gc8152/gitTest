var forDicValidate = "ok";
//属性类型控制input
function initInputHideAndShow(data){
	var selectobj = getCurrentPageObj().find("#attr_type");
	var maxlength = getCurrentPageObj().find("#maxlength");
	var dic = getCurrentPageObj().find("#dic");
	if(data == "00"){
		maxlength.show();		
		dic.hide();
		forDicValidate = "ok";
	}else if(data == "01" || data == "02"){
		dic.show();
		maxlength.hide();
		valiDicInfo();
	}else{
		maxlength.hide();
		dic.hide();
		forDicValidate = "ok";
	}
	selectobj.change(function(){
		var selectValue = selectobj.val();
		if(selectValue == "00" ){
			maxlength.show();		
			dic.hide();
			forDicValidate = "ok";
		}else if(selectValue == "01" || selectValue == "02"){
			dic.show();
			maxlength.hide();
			valiDicInfo();
		}else{
			maxlength.hide();
			dic.hide();
			forDicValidate = "ok";
		}
	});
	
}

//验证字典项编码
function valiDicInfo(){
	var vali_dic = getCurrentPageObj().find("#dic_info");		
	vali_dic.blur(function(){		
		var dic_code = vali_dic.val();
		var updataAttrCall1=getMillisecond();
		baseAjaxJsonp(dev_application+"InterAttrManage/quaryValiDicInfo.asp?SID="+SID+"&call="+updataAttrCall1+"&dic_code="+dic_code,null, function(data) {
			if (data != undefined&&data!=null&&data.result=="true") {
				vali_dic.parent().append('<span id="recallMsg"  class="tag-green" >'+'字典项可用'+'</span>');
				forDicValidate = "ok";
			}else{
				if(dic_code != ""){
					vali_dic.parent().append('<span id="recallMsg"  class="tag-red" >'+data.result+'</span>');
					forDicValidate = "no";
				}
				forDicValidate = "no";
			}
		},updataAttrCall1);	
	});			
	vali_dic.focus(function(){
		var div_obj = getCurrentPageObj().find("#recallMsg");
		div_obj.remove();
	});
}

//赋值
function initUpdateAttrManageInfo(ids) {
	var quaryAttrOneCall = getMillisecond();	
	baseAjaxJsonp(dev_application+"InterAttrManage/queryOneInterAttr.asp?SID="+SID+"&call="+quaryAttrOneCall+"&attr_id="+ids, null , function(data) {
		var currTab = getCurrentPageObj();	
		autoInitRadio({dic_code:"S_DIC_YN"},getCurrentPageObj().find("#is_necessary"),"I.IS_NECESSARY",{labClass:"labelRadio2",value:data.IS_NECESSARY});
		initSelect(currTab.find("select[name='I.ATTR_TYPE']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"I_DIC_INTER_ATTR_TYPE"},data.ATTR_TYPE);
		initInputHideAndShow(data.ATTR_TYPE);
		for (var key in data) {
			if(key != "ATTR_TYPE" && key != "IS_NECESSARY" && key != "result"){
				currTab.find("input[name='I."+key+"']").val(data[key]);
			}
		}
	},quaryAttrOneCall);	
	
	
}

//按钮
function initUpdateAttrManageEvent(){		
	//保存按钮
	$("#updateAttrManage").click(function(){
		if(!vlidate($("#updateAttrManage_from"))){
			return;
		}
		if(forDicValidate != "ok"){
			return;
		}
		var inputs = $("input[name^='I.']");
		var select = $("select[name^='I.']");
		var radios  =$("input:radio[name^='I.']:checked");
		var params = {};
		for (var i = 0; i < inputs.length; i++) {
			var obj = $(inputs[i]);
			params[obj.attr("name").substr(2)] = obj.val();
		}
		for (var i = 0; i < radios.length; i++) {
			var obj = $(radios[i]);
			params[obj.attr("name").substr(2)] = obj.val();
		}
		for(var i = 0; i < select.length; i++){
			var obj = $(select[i]);
			params[obj.attr("name").substr(2)] = obj.val();
		}
		var updataAttrCall2=getMillisecond();
		baseAjaxJsonp(dev_application+"InterAttrManage/updateInterAttrManage.asp?call="+updataAttrCall2+"&SID="+SID,params, function(data) {
			if (data != undefined&&data!=null&&data.result=="true") {
				alert("修改成功");
				closeCurrPageTab();
			}else{
				alert("修改失败");
			}
		},updataAttrCall2);
	});
}


initVlidate(getCurrentPageObj());
initUpdateAttrManageEvent();
