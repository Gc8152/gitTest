
initBtnEvent();
initVlidate(getCurrentPageObj().find("#noConformItemRaise_add"));

//初始化下拉了值
function initNoConfirmRaiseAddSelectVal(){
	//initSelect(getCurrentPageObj().find("select[name='PHASES']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_PHASES"});
	//initSelect(getCurrentPageObj().find("select[name='PROCESS']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_PROCESS"});
	initSelect(getCurrentPageObj().find("select[name='GRADE']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_GRADE"});
	//initSelect(getCurrentPageObj().find("select[name='IS_REAPPEAR']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_IS_REAPPEAR"});
	initSelect(getCurrentPageObj().find("select[name='TYP']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_TYP"});
}
//页面按钮事件
function initBtnEvent(){
	var currTab = getCurrentPageObj();
	
	//提交按钮事件
	currTab.find("#noConformItemRaise_add_submit").click(function(){
		//判断是否为空
       if(!vlidate(currTab.find("#noConformItemRaise_add"))){
			  return ;
		  }
       var quality_desc=getCurrentPageObj().find("#quality_desc").val();
	    if(quality_desc.length>500){
	    	alert("不符合项描述至多可输入500汉字！");
	    	return;
	    }
	    var no_conform_name=getCurrentPageObj().find("#no_conform_name").val();
	    if(no_conform_name.length>500){
	    	alert("不符合项名称至多可输入50汉字！");
	    	return;
	    }
       var params = {};
       params["BUSINESS_CODE"] = currTab.find("#business_code").val();
       params["CHECK_ID"] = currTab.find("#check_id").val();
       params["NO_CONFORM_NAME"] = currTab.find("#no_conform_name").val();
       params["QUALITY_ID"] = currTab.find("#quality_id").val();
       params["SYSTEM_NAME"] = currTab.find("#system_name").val();
       params["QUALITY_DESC"] = currTab.find("#quality_desc").val();
       params["PHASES"] = currTab.find("#phases").val();
       params["TYP"] = currTab.find("#typ").val();
       params["GRADE"] = currTab.find("#grade").val();
       //params IS_REAPPEAR = getCurrentPageObj().find("#is_reappear").val();
       params["DUTY_USER_ID"] = currTab.find("#duty_user_id").val();
       params["SUGGEST_SOLVE_TIME"] = currTab.find("#suggest_solve_time").val();
       params["SUGGEST"] = currTab.find("#suggest").val();
       params["PROJECT_ID"] = currTab.find("#project_id").val();
       params["PROJECT_NAME"] = currTab.find("#project_name").val();
       params["WORK_PRODUCT"] = currTab.find("#work_product").val();
       params["PROCESS"] = currTab.find("#process").val();
       params["QUALITY_STATUS"] = '02';
       params["OPT_STATUS"] = "提交";
		var call = getMillisecond();
		baseAjaxJsonp(dev_project+ "qualityManager/insertOrUpdateQuality.asp?call="+ call + "&SID=" + SID ,params, function(data) {
					if (data != undefined && data != null) {
						alert(data.msg);
						if (data.result == "true") {
							closeCurrPageTab();
						}
					} else {
						alert("未知错误！");
					}
				}, call);
	});
	
	//返回按钮事件
	currTab.find("#noConformItemRaise_add_back").click(function(){
		closeCurrPageTab();
	});
	
	//保存按钮事件
	currTab.find("#noConformItemRaise_add_save").click(function(){
		var quality_desc=getCurrentPageObj().find("#quality_desc").val();
	    if(quality_desc.length>500){
	    	alert("不符合项描述至多可输入500汉字！");
	    	return;
	    }
	    var no_conform_name=getCurrentPageObj().find("#no_conform_name").val();
	    if(no_conform_name.length>500){
	    	alert("不符合项名称至多可输入50汉字！");
	    	return;
	    }
		//判断是否为空
        if(!vlidate(currTab.find("#noConformItemRaise_add"))){
			  return ;
		  }
        var params = {};
        params["BUSINESS_CODE"] = currTab.find("#business_code").val();
        params["CHECK_ID"] = currTab.find("#check_id").val();
        params["NO_CONFORM_NAME"] = currTab.find("#no_conform_name").val();
        params["QUALITY_ID"] = currTab.find("#quality_id").val();
        params["SYSTEM_NAME"] = currTab.find("#system_name").val();
        params["QUALITY_DESC"] = currTab.find("#quality_desc").val();
        params["PHASES"] = currTab.find("#phases").val();
        params["TYP"] = currTab.find("#typ").val();
        params["GRADE"] = currTab.find("#grade").val();
        //params IS_REAPPEAR = getCurrentPageObj().find("#is_reappear").val();
        params["DUTY_USER_ID"] = currTab.find("#duty_user_id").val();
        params["SUGGEST_SOLVE_TIME"] = currTab.find("#suggest_solve_time").val();
        params["SUGGEST"] = currTab.find("#suggest").val();
        params["PROJECT_ID"] = currTab.find("#project_id").val();
        params["PROJECT_NAME"] = currTab.find("#project_name").val();
        params["WORK_PRODUCT"] = currTab.find("#work_product").val();
        params["PROCESS"] = currTab.find("#process").val();
        params["QUALITY_STATUS"] = '01';
        params["OPT_STATUS"] = "保存";
		var call = getMillisecond();
		baseAjaxJsonp(dev_project+ "qualityManager/insertOrUpdateQuality.asp?call="+ call + "&SID=" + SID ,params, function(data) {
					if (data != undefined && data != null) {
						alert(data.msg);
						if (data.result == "true") {
							
							closeCurrPageTab();
						}
					} else {
						alert("未知错误！");
					}
				}, call);
	
	});
}

function changeTYP(){
	var currTab = getCurrentPageObj();
	var type1 = currTab.find("#typselect").val();
	var type = type1==""?currTab.find("#typ").val():type1;
	var selectTd = currTab.find("#qualityTypChildSelect");
	    selectTd.children().remove();
	if(type=="02"){
		currTab.find("#qualityTypChildTD").html("所属工作产品：");
		selectTd.append('<select id="work_product" name="WORK_PRODUCT" validate="v.required" valititle="该项必填" diccode="P_DIC_QUALITY_WORK_PRODUCT"></select></td>');
		initSelect(getCurrentPageObj().find("select[name='WORK_PRODUCT']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_WORK_PRODUCT"});
	}else if(type=="01"){
		currTab.find("#qualityTypChildTD").html("所属工作过程：");
		selectTd.append('<select id="process" name="PROCESS" validate="v.required" valititle="该项必填" diccode="P_DIC_QUALITY_WORK_PRODUCT"></select></td>');
		initSelect(getCurrentPageObj().find("select[name='PROCESS']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_PROCESS"});
	}
	
	
}
//显示项目pop
function showProjectPop(){
	openProjectPop("project_pop", {
		PROJECT_NAME : getCurrentPageObj().find("#project_name_add"),
		//PROJECT_NAME : getCurrentPageObj().find("#project_name"),
		PROJECT_MAN_NAME : getCurrentPageObj().find("#duty_user_name"),
		//SYSTEM_NAME : getCurrentPageObj().find("#system_name"),
		PROJECT_ID : getCurrentPageObj().find("#project_id"),
		PROJECT_MAN_ID : getCurrentPageObj().find("#duty_user_id")
		
	});
}

//责任人修改显示的pop框
function showProjectPop1(obj){
	
	openUserPop("duty_user_pop",{name:getCurrentPageObj().find("#duty_user_name"),no:getCurrentPageObj().find("#duty_user_id")});
	
}
//新增页面，初始化事件
function addNotConformConfig_init(){
	var currTab = getCurrentPageObj();
	currTab.find("#project_name_add").show();
	//getCurrentPageObj().find("#project_num_add").attr("validate","v.required");
	currTab.find("#project_name_update").hide();
	//getCurrentPageObj().find("#project_num_update").attr("validate","");
	currTab.find("#business_code").parent().parent().hide();
	currTab.find("#notConformConfigSpan").html("新增不符合项<em></em>");
	initNoConfirmRaiseAddSelectVal();
}

//修改页面，初始化事件
function updateNotConformConfig_init(row){
	var currTab = getCurrentPageObj();
	currTab.find("#project_name_add").hide();
	//currTab.find("#project_name_add").attr("validate","");
	currTab.find("#project_name_update").show();
	currTab.find("#typselect").val(row.TYP);
	currTab.find("#quality_id").attr(row.QUALITY_ID);
	currTab.find("#notConformConfigSpan").html("修改不符合项<em></em>");
	
	currTab.find("#noConformItemRaise_add").find("input[name]").each(function(){
		$(this).val(row[$(this).attr("name")]);
	});
	
	getCurrentPageObj().find("#noConformItemRaise_add").find("textarea[name]").each(function(){
		
		$(this).val(row[$(this).attr("name")]);
		
	});
	initSelect(currTab.find("select[name='TYP']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_TYP"},row.TYP);
	initSelect(currTab.find("select[name='GRADE']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_GRADE"},row.GRADE);
	changeTYP();
	var typ = currTab.find("#typselect").val();
	if(typ == "01"){
		initSelect(currTab.find("select[name='PROCESS']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_PROCESS"},row.PROCESS);
	}else if(typ == "02"){
		initSelect(currTab.find("select[name='WORK_PRODUCT']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_WORK_PRODUCT"},row.WORK_PRODUCT);
	};
	var check_id = row.CHECK_ID;
	if(check_id!=undefined&&check_id!=null&&check_id!=""){
		currTab.find("#typ").attr("disabled","disabled");
		currTab.find("#work_product").attr("disabled","disabled");
	}else{
		currTab.find("#business_code").parent().parent().hide();
	}
}
