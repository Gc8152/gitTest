function initSelects(){
	initSelect($("#loginlog_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_YN"});
	initSelect($("#optlog_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_YN"});
	initSelect($("#errorlog_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_YN"});
	initSelect($("#sendlog_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_YN"});
}
function initPageData(){
	baseAjax("SLog/queryLastLogConfig.asp",null,function(data){
		if(data!=undefined&&data!=null&&data!=""){
			getCurrentPageObj().find("#logConfigForm").setform(data.logconfig);
		}else{
			alert("日志配置信息查询失败！");
		}
	});
}
function initButton(){
	getCurrentPageObj().find("#saveConfig").click(function(){
		baseAjax("SLog/savelogConfig.asp",getPageData(),function(data){
			if(data!=undefined&&data!=null&&data!=""){
				if(data.result=="true"){
					alert("保存日志配置成功！");
				}else{
					alert("保存日志配置信息失败！");
				}
			}else{
				alert("保存日志配置信息失败！");
			}
		});		
	});
}
function getPageData(){
	var obj;
	var temp={};
	var inputs = getCurrentPageObj().find("#logConfigForm input");
	var selects = getCurrentPageObj().find("#logConfigForm select");
	for(var i=0;i<inputs.length;i++){
		obj = $(inputs[i]);
		if($.trim(obj.val())!=""){
			temp[obj.attr("name")]=obj.val();
		}
	}
	for(var i=0;i<selects.length;i++){
		obj = $(selects[i]);
		if($.trim(obj.val())!=""){
			temp[obj.attr("name")]=obj.val();
		}
	}
	return temp;
}
initButton();
initSelects();
initPageData();