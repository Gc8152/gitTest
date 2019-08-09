 var call=getMillisecond();
//初始化修改方法
function assortment_initUpdate(assortid){
	//给必填项添加*
	initVlidate($("#update_assortment"));
	//根据模型编号给模型赋值
	var url = dev_workbench+"Assortment/queryAssortmentOne.asp?assortid="+assortid+"&call="+call+"&SID="+SID;
	baseAjaxJsonp(url,null,function(data){
		for(var k in data){
			$("input[name='ASS."+k.toLowerCase()+"']").val(data[k]);
			$("textarea[name='ASS." + k.toLowerCase() + "']").val(data[k]);		  
			if(k.toLowerCase()=='flag'){
				initSelect($("select[name='ASS." + k.toLowerCase() + "']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_OC"},data[k]);
			}
		}
	},call);
}	
//保存督办类别
function assortment_update(){
	$("#closePageAssortment_update").click(function(){
		nconfirm("确定离开该页面?",function(){
			closeCurrPageTab();
		});
	});
	$("#assortment_updateButton").click(function(){
		//必填项验证
		if(!vlidate($("#update_assortment"))){
			return ;
		}	
		//取值
		var inputs = $("input[name^='ASS.']");
		var selects = $("select[name^='ASS.']");
		var textareas = $("textarea[name^='ASS.']");
		var params = {};
		inputs.each(function(){
			params[$(this).attr("name").substr(4)] = $(this).val();
		});
		selects.each(function(){
			params[$(this).attr("name").substr(4)] = $(this).val();
		});
		textareas.each(function(){
			params[$(this).attr("name").substr(4)] = $(this).val();
		});
		var url = dev_workbench+"Assortment/updateAssortment.asp?call="+call+"&SID="+SID;
		baseAjaxJsonp(url,params,function(data){
			if(data.result=="true"){
				alert("修改成功！");
				$("#messstrategyModal_Table").bootstrapTable('refresh');
				closeCurrPageTab();
				closeAndOpenInnerPageTab("assortment_list","督办类别配置","supervision/assortment/assortment_queryList.html",function(){});
			}else{
				alert("修改失败！");
			}
		},call);
	});
};
//修改督办类别
assortment_update();