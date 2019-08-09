var forDicValidate = "ok";

//属性类型控制input
function initInputHideAndShow(){
	var selectobj = getCurrentPageObj().find("#attr_type");
	var maxlength = getCurrentPageObj().find("#maxlength");
	var dic = getCurrentPageObj().find("#dic");
	maxlength.hide();
	dic.hide();
	selectobj.change(function(){
		var selectValue = selectobj.val();
		if(selectValue == "00"){
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
		var addAttrCall1=getMillisecond();
		var dic_code = vali_dic.val();	
		baseAjaxJsonp(dev_application+"InterAttrManage/quaryValiDicInfo.asp?SID="+SID+"&call="+addAttrCall1+"&dic_code="+dic_code,null, function(data) {
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
		},addAttrCall1);	
	});			
	vali_dic.focus(function(){
		var div_obj = getCurrentPageObj().find("#recallMsg");
		div_obj.remove();
	});
}

//按钮方法
function initAddAttrManageButtonEvent(){	
	//保存
	$("#addAttrManage").click(function(){	
		if(!vlidate($("#addAttrManage_from"))){
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
		var addAttrCall2=getMillisecond();		
		baseAjaxJsonp(dev_application+"InterAttrManage/addInterAttrManage.asp?call="+addAttrCall2+"&SID="+SID,params, function(data) {
			if (data != undefined&&data!=null&&data.result=="true") {
				alert("添加成功");
				closeCurrPageTab();
			}else{
				alert(data.msg);
			}
		},addAttrCall2);	
	});		
}

//加载字典项
function initAttrManageDicType(){
	//初始化数据,属性类型
	initSelect(getCurrentPageObj().find("#attr_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"I_DIC_INTER_ATTR_TYPE"});
	
}
initAttrManageDicType();
initVlidate(getCurrentPageObj());
initInputHideAndShow();
initAddAttrManageButtonEvent();

