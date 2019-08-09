var forDataEngnameValidate = "ok";
//按钮方法
function initAddDataButtonEvent(){	
	$("#addDataManage").click(function(){
		if(!vlidate($("#addDataManage_from"),"",true)){
			return;
		}
		
		var aaa=getCurrentPageObj().find("#standard_code").val();
	    if(aaa.length>100){
	    	alert("标准代码至多可输入100汉字！");
	    	return;
	    }
	    var bbb=getCurrentPageObj().find("#data_instruction").val();
	    if(bbb.length>130){
	    	alert("说明至多可输入130汉字！");
	    	return;
	    }
		
		if(forDataEngnameValidate != "ok"){
			return;
		}
		var inputs = $("input[name^='I.']");
		var texts = $("textarea[name^='I.']");
		var select = $("select[name^='I.']");
		var params = {};
		for (var i = 0; i < inputs.length; i++) {
			var obj = $(inputs[i]);
			params[obj.attr("name").substr(2)] = obj.val();
		}
		for (var i = 0; i < texts.length; i++) {
			var obj = $(texts[i]);
			params[obj.attr("name").substr(2)] = obj.val();
		}
		for(var i = 0; i < select.length; i++){
			var obj = $(select[i]);
			params[obj.attr("name").substr(2)] = obj.val();
		}
		var addStandardCall1=getMillisecond();	
		baseAjaxJsonp(dev_application+"StandardDataManage/addStandardDataManage.asp?call="+addStandardCall1+"&SID="+SID,params, function(data) {
			if (data != undefined&&data!=null&&data.result=="true") {
				alert("添加成功");
				closeCurrPageTab();
			}else{
				alert(data.msg);
			}
		},addStandardCall1);	
	});		
}
//验证数据名称（英文）是否重复
function valiDataEngnameIsUsed(){
	var dataObj = getCurrentPageObj().find("#data_engname");
	dataObj.blur(function(){
		var data_engname = dataObj.val();
		var dCall = getMillisecond();
		baseAjaxJsonp(dev_application
				+ "StandardDataManage/quaryValiDataEngname.asp?SID=" + SID + "&call="
				+ dCall+"&data_engname="+data_engname, null,function(data) {
			if (data != undefined&&data!=null&&data.result=="true") {
				if(data_engname != "" && (/^[A-Za-z]+$/.test(data_engname))){
					dataObj.parent().append('<span id="recallMsg"  class="tag-green" >接口编号可用</span>');
					forDataEngnameValidate = "ok";
				}else{
					forDataEngnameValidate = "no";
				}	
			} else {
				if(data_engname != ""){
					dataObj.parent().append('<span id="recallMsg"  class="tag-red" >接口编号被占用</span>');
					forDataEngnameValidate = "no";
				}
				forDataEngnameValidate = "no";
			}
		
		}, dCall, false);
	});
	dataObj.focus(function(){
		var div_obj = getCurrentPageObj().find("#recallMsg");
		div_obj.remove();
	});
}
//字典项
function initStandardDataManageDicType(){
	//初始化数据,数据类型
	initSelect(getCurrentPageObj().find("#data_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"I_DIC_INTER_DATA_TYPE"});
}

initVlidate(getCurrentPageObj());
initStandardDataManageDicType();
initAddDataButtonEvent();
valiDataEngnameIsUsed();