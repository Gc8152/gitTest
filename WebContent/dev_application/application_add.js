initAddApplicationBtn();
initselectForDic();
initApplicationOrg();
openAppUserPop();

//加载部门下拉树
function initApplicationOrg(){
	/*//处室
	getCurrentPageObj().find("#APPorgan_id_org").click(function(){
		openSelectTreeDiv($(this),"appAdd_tree_id","SOrg/queryorgtreelist.asp",{"margin-top": "2px","width":"300px"},function(node){
			getCurrentPageObj().find("#organ_id_applicationadd").val(node.id);
			getCurrentPageObj().find("#APPorgan_id_org").val(node.name);
		});
	});
	getCurrentPageObj().find("#APPorgan_id_org").focus(function(){
		getCurrentPageObj().find("#APPorgan_id_org").click();
	});*/
	
//业务管理部门
	getCurrentPageObj().find("#business_dept_id_org").click(function(){
		getCurrentPageObj().find(".drop-ztree").hide();
		openSelectTreeDiv($(this),"appAdd_tree_id","SOrg/queryorgtreelist.asp",{"margin-top": "2px",width:"225px"},function(node){
			getCurrentPageObj().find("#business_dept_id_org").val(node.name);
			getCurrentPageObj().find("#business_dept_id_applicationadd").val(node.id);
		});
	});
//负责组
getCurrentPageObj().find("#res_group_id_org").click(function(){
	getCurrentPageObj().find(".drop-ztree").hide();
	openSelectTreeDiv($(this),"appAdd_tree_res","SOrg/queryorgtreeofficeslist.asp?suporg_code=10101706",{"margin-top": "2px",width:"225px"},function(node){
		getCurrentPageObj().find("#res_group_id_org").val(node.name);
		getCurrentPageObj().find("#res_group_id_applicationadd").val(node.id);
	});
});	
//开发组
getCurrentPageObj().find("#dev_group_id_org").click(function(){
	getCurrentPageObj().find(".drop-ztree").hide();
	openSelectTreeDiv($(this),"appAdd_tree_dev","SOrg/queryorgtreeofficeslist.asp?suporg_code=10101706",{"margin-top": "2px",width:"225px"},function(node){
		getCurrentPageObj().find("#dev_group_id_org").val(node.name);
		getCurrentPageObj().find("#dev_group_id_applicationadd").val(node.id);
	});
});		
}

//初始化按钮
function initAddApplicationBtn() {
//保存
	getCurrentPageObj().find("#save_gSystemInfo").click(function(){
		if(!vlidate(getCurrentPageObj().find("#gsysteminfo_add"),"",true)){
			return ;
		}
	var inputs = getCurrentPageObj().find("input:text[name^='APP.']");
	var hiddens = getCurrentPageObj().find("input:hidden[name^='APP.']");
	var selects = getCurrentPageObj().find("select[name^='APP.']");
	var radios = getCurrentPageObj().find("input:radio[name^='APP.']:checked");
	 var textareas = getCurrentPageObj().find("textarea[name^='APP.']");
	var params = {};	
	//取值
	for(var i=0;i<inputs.length;i++){
		params[$(inputs[i]).attr("name").substr(4)] = $(inputs[i]).val();	 
	}
	for(var i=0;i<hiddens.length;i++){
		params[$(hiddens[i]).attr("name").substr(4)] = $(hiddens[i]).val();	 
	}
	for(var i=0;i<selects.length;i++){
		params[$(selects[i]).attr("name").substr(4)] = $(selects[i]).val();
		if(i>=14&&i<20){
			params[$(selects[i]).attr("name").substr(4)] = $(selects[i]).val().join(",");
		}
	}
	for(var i=0;i<textareas.length;i++){
		if($(textareas[i]).attr("name").substr(4)=='system_profile'){
			params[$(textareas[i]).attr("name").substr(3)] = $(textareas[i]).val();	
			params[$(textareas[i]).attr("name").substr(4)] = $(textareas[i]).val();	
		}else{
			params[$(textareas[i]).attr("name").substr(3)] = $(textareas[i]).val();	 
		}
	}
	
	for(var i=0;i<radios.length;i++){
		params[$(radios[i]).attr("name").substr(4)] = $(radios[i]).val();
	}
	
	/****插入提醒参数****/
	params["remind_type"] = "PUB2017194";
	params["b_code"] = getCurrentPageObj().find("#system_id_applicationadd").val();
	params["b_id"] = getCurrentPageObj().find("#system_id_applicationadd").val();
	params["b_name"] = "新增应用："+getCurrentPageObj().find("#system_name_applicationadd").val()+"（英文简称："+getCurrentPageObj().find("#system_short").val()+"）";
//	params["system_profile"] = getCurrentPageObj().find("#system_profile_applicationadd").val();
	
	var aaa=getCurrentPageObj().find("#system_profile_applicationadd").val();
    if(aaa.length>250){
    	alert("应用简介至多可输入250汉字！");
    	return;
    }
	
	baseAjaxJsonp(dev_application+"applicationManager/addApplication.asp?SID="+SID, params, function(data) {
    	if (data != undefined && data != null && data.result=="true") {			
				if(data.msg == "01"){
					alert("此ID已存在");
				}else{
					closePageTab("addApplication");
					alert("添加成功");
				}
		}else{
			var mess=data.mess;
			alert("添加失败:"+mess);
		}
	});
	
});
//项目经理pop
getCurrentPageObj().find('#APPproject_man_name').click(function(){
	openAppUserPop("app_user_add",{no:getCurrentPageObj().find("#project_man_id_applicationadd"),name:getCurrentPageObj().find("#APPproject_man_name")},"0015,0007");

});

//技术经理pop
getCurrentPageObj().find('#APPskill_man_name').click(function(){
	openAppUserPop("app_user_add",{no:getCurrentPageObj().find("#skill_man_id_applicationadd"),name:getCurrentPageObj().find("#APPskill_man_name")},"0016,0007");
});

//产品经理pop
getCurrentPageObj().find('#APPproduct_man_name').click(function(){
	openAppUserPop("app_user_add",{no:getCurrentPageObj().find("#product_man_id_applicationadd"),name:getCurrentPageObj().find("#APPproduct_man_name")},"0017,0007");
});

//配置管理员pop
$('#APPconfig_man_name').click(function(){
	openAppUserPop("app_user_add",{no:getCurrentPageObj().find("#config_man_id_applicationadd"),name:getCurrentPageObj().find("#APPconfig_man_name")},"0021,0008");
});

//测试经理pop
getCurrentPageObj().find('#APPtest_man_name').click(function(){
	openAppUserPop("app_user_add",{no:getCurrentPageObj().find("#test_man_id_applicationadd"),name:getCurrentPageObj().find("#APPtest_man_name")},"0018");
});

//应用管理员pop
getCurrentPageObj().find('#APPsys_man_name').click(function(){
	openAppUserPop("app_user_add",{no:getCurrentPageObj().find("#sys_man_id_applicationadd"),name:getCurrentPageObj().find("#APPsys_man_name")},"0020");
});

/*//测试分析师pop
getCurrentPageObj().find('#APPtest_analyse_name').click(function(){
	openAppUserPop("app_user_add",{no:getCurrentPageObj().find("#test_analyse_id_applicationadd"),name:getCurrentPageObj().find("#APPtest_analyse_name")},"0019");
});

//元数据管理员pop
getCurrentPageObj().find('#APPunit_data_name').click(function(){
	openAppUserPop("app_user_add",{no:getCurrentPageObj().find("#unit_data_id_applicationadd"),name:getCurrentPageObj().find("#APPunit_data_name")},"0022");
});*/

}

/**
 * 根据URl设置下拉框数据
 * @param obj $("#id")
 * @param show {"value":"enname","text":"cnname"}
 * @param url
 */
function initSelect2(obj,show,param,default_v,preStr){
		globalSelectCache["count"]=globalSelectCache["count"]+1;
		if(globalSelectCache[param.dic_code]!=undefined&&globalSelectCache[param.dic_code]["data"]!=undefined){
			initSelectByData2(obj,show,globalSelectCache[param.dic_code]["data"],default_v);
			if(new Date().getTime()-globalSelectCache[param.dic_code]["startDate"]>50000){
				globalSelectCache[param.dic_code]={};
			}
			return;
		}
		if(globalSelectCache["count"]>7){
			globalSelectCache={};
			globalSelectCache["count"]=1;
		}
		if(!preStr){
			preStr="";
		}
		baseAjax(preStr+"SDic/findItemByDic.asp",param,function(data){
			if(data!=undefined){
				globalSelectCache[param.dic_code]={};
				globalSelectCache[param.dic_code]["data"]=data;
				globalSelectCache[param.dic_code]["startDate"]=new Date().getTime();
				initSelectByData2(obj,show,data,default_v);
			}
		});
}

function initSelectByData2(obj,show,data,default_v){
	if(obj!=undefined&&show!=undefined&&data!=undefined){
		obj.empty();
		for(var i=0;i<data.length;i++){
			if(default_v==undefined||default_v==""){
				default_v=data[i]["IS_DEFAULT"]=="00"?data[i][show.value]:"";
			}
			obj.append('<option value="'+data[i][show.value]+'">'+data[i][show.text]+'</option>');	
		}
		if(default_v!=undefined&&default_v!=""){
			var mycars=default_v.split(",");
			obj.val(mycars).trigger('change');
		}else{
			obj.val(" ");
		}
		obj.select2();
		//$("#experts_type").val(['01','02']).trigger('change');
		//$("#removeOption").remove();//神奇的将select 设置为空
		//alert(obj.val());
	}
}

//加载字典项
function initselectForDic(){
	//initSelect(getCurrentPageObj().find("#is_important_applicationadd"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_YN"});
	initSelect(getCurrentPageObj().find("#is_new_system_applicationadd"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_YN"});
	//initSelect(getCurrentPageObj().find("#is_test_peel_applicationadd"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_YN"});
	//initSelect(getCurrentPageObj().find("#is_deploy_peel_applicationadd"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_YN"});
	//initSelect(getCurrentPageObj().find("#is_centralizedmonitor_applicationadd"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_YN"});	
	//initSelect(getCurrentPageObj().find("#is_two_week_applicationadd"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_YN"});
	//initSelect(getCurrentPageObj().find("#is_agile_applicationadd"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_YN"});
	//initSelect(getCurrentPageObj().find("#system_status_applicationadd"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_SYSTEM_STATUS"});
	//initSelect(getCurrentPageObj().find("#test_deploy_type_applicationadd"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_TESTDEPLOY_TYPE"});
	initSelect(getCurrentPageObj().find("#yield_type_applicationadd"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_YIELD_TYPE"});
	//initSelect(getCurrentPageObj().find("#framework_applicationadd"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_FRAMEWORK_TYPE"});
	//initSelect(getCurrentPageObj().find("#system_type_applicationadd"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_SYSTEM_TYPE"});
	//initSelect(getCurrentPageObj().find("#test_line_applicationadd"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_ORG_TESTLINE"});
	initSelect(getCurrentPageObj().find("#test_group_applicationadd"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_ORG_TESTGROUP"});
	initSelect(getCurrentPageObj().find("#business_line_applicationadd"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_ORG_BUSINESSLINE"});
	initSelect(getCurrentPageObj().find("#is_CC"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_YN"});
	initSelect(getCurrentPageObj().find("#system_status_applicationadd"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_SYSTEM_STATUS"});
	initSelect(getCurrentPageObj().find("#is_secientific_management_applicationadd"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_SECIENTIFIC_MANAGEMENT"});
	//initSelect(getCurrentPageObj().find("#wait_protect_level"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"AF_DIC_APP_PROTECT_LEVEL"});
	//initSelect(getCurrentPageObj().find("#wait_protect_level"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"AF_DIC_APP_PROTECT_LEVEL"});
	initSelect(getCurrentPageObj().find("#is_review_applicationadd"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"TM_DIC_IS_APPROVE"});
	
	
	//initSelect2(getCurrentPageObj().find("#develop_tool_applicationadd"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_DEVELOP_TOOL"});
	//initSelect2(getCurrentPageObj().find("#develop_language_applicationadd"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_DEVELOP_LANGUAGE"});
	//initSelect2(getCurrentPageObj().find("#mac_os_applicationadd"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_MAC_OS"});
	//initSelect2(getCurrentPageObj().find("#hardware_type_applicationadd"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_HARDWARE_TYPE"});
	//initSelect2(getCurrentPageObj().find("#among_applicationadd"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_DEVELOP_AMONG"});
	//initSelect2(getCurrentPageObj().find("#database_applicationadd"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_DEVELOP_DATABASE"});
	
}