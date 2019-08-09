var forDataEngnameValidate = "ok";
//赋值
function initUpdateStandardDataInfo(ids) {
	var quaryOneStandardCall2=getMillisecond();
	baseAjaxJsonp(dev_application+"StandardDataManage/queryOneStandardData.asp?call="+quaryOneStandardCall2+"&SID="+SID+"&data_id="+ids, null , function(data) {
		var currTab = getCurrentPageObj();	
		initSelect(currTab.find("select[name='I.DATA_TYPE']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"I_DIC_INTER_DATA_TYPE"},data.DATA_TYPE);
		for (var key in data) {
			if(key != "DATA_TYPE" && key != "STANDARD_CODE" && key != "DATA_INSTRUCTION" && key != "result"){
				currTab.find("input[name='I."+key+"']").val(data[key]);
			}else{
				currTab.find("textarea[name='I."+key+"']").val(data[key]);
			}
		}
		valiDataEngnameIsUsed();
	},quaryOneStandardCall2);	

}
//保存按钮
function initUpdateStandardDataEvent(){
	$("#updataStandardData").click(function(){
		if(!vlidate($("#updateDataManage_from"))){
			return ;
		}
		
		var aaa=getCurrentPageObj().find("#STANDARD_CODE").val();
	    if(aaa.length>100){
	    	alert("标准代码至多可输入100汉字！");
	    	return;
	    }
	    var bbb=getCurrentPageObj().find("#DATA_INSTRUCTION").val();
	    if(bbb.length>130){
	    	alert("说明至多可输入130汉字！");
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
		var updataStandardCall1=getMillisecond();
		baseAjaxJsonp(dev_application+"StandardDataManage/updateStandardDataManage.asp?call="+updataStandardCall1+"&SID="+SID,params, function(data) {
			if (data != undefined&&data!=null&&data.result=="true") {
				alert("修改成功");
				closeCurrPageTab();
			}else{
				alert("修改失败");
			}
		},updataStandardCall1);
	});
}
//验证数据名称（英文）是否重复
function valiDataEngnameIsUsed(){
	var dataObj = getCurrentPageObj().find("#DATA_ENGNAME");
	var oldval = dataObj.val();
	dataObj.blur(function(){
		var data_engname = dataObj.val();
		var dCall = getMillisecond();
		if(oldval != data_engname){
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
		};	
	});
	dataObj.focus(function(){
		var div_obj = getCurrentPageObj().find("#recallMsg");
		div_obj.remove();
	});
}
initVlidate(getCurrentPageObj());
initUpdateStandardDataEvent();