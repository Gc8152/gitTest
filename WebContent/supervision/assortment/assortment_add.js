 var call=getMillisecond();
//初始化新增
function assortment_initAdd(){
	//给必填项添加*
	initVlidate($("#add_assortment"));
	//下拉框
	autoInitSelect($("#add_assortment"));
}	
//保存督办类别
function assortment_add(){
	$("#closePageAssortment_add").click(function(){
		nconfirm("确定离开该页面?",function(){
			closeCurrPageTab();
		});
	});
	$("#assortment_addButton").click(function(){
		//必填项验证
		if(!vlidate($("#add_assortment"))){
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
		var url = dev_workbench+"Assortment/insertAssortment.asp?call="+call+"&SID="+SID;
		baseAjaxJsonp(url,params,function(data){
			if(data.result=="true"){
				alert("添加成功！");
				//$("#assortment_Table").bootstrapTable('refresh');
				closeCurrPageTab();
				closeAndOpenInnerPageTab("assortment_list","督办类别配置","supervision/assortment/assortment_queryList.html",function(){
				});
			}else{
				alert("添加失败！");
			}
		},call);
	});
};
//新增督办类别
assortment_add();