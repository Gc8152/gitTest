initSelectVal();
initBtnEvent();
initVlidate($("#qualityManage_adds"));

//初始化下拉了值
function initSelectVal(){
	initSelect(getCurrentPageObj().find("select[name='PHASES']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_PHASES"});
	initSelect(getCurrentPageObj().find("select[name='PROCESS']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_PROCESS"});
	initSelect(getCurrentPageObj().find("select[name='GRADE']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_GRADE"});
	initSelect(getCurrentPageObj().find("select[name='IS_REAPPEAR']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_IS_REAPPEAR"});
	initSelect(getCurrentPageObj().find("select[name='TYP']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_TYP"});
}
//页面按钮事件
function initBtnEvent(){
	//提交按钮事件

	
	$("#qualityManage_add_submit").click(function(){
		//判断是否为空
		
		
        if(!vlidate($("#qualityManage_add"))){
			  return ;
		  }
        
        var FIND_DATE = getCurrentPageObj().find("#find_date").val();
        var PROJECT_NUM = getCurrentPageObj().find("#project_num").val();
        var PROJECT_ID = getCurrentPageObj().find("#project_id").val();
        var QUALITY_DESC = getCurrentPageObj().find("#quality_desc").val();
        var PHASES = getCurrentPageObj().find("#phases").val();
        var PROCESS = getCurrentPageObj().find("#process").val();
        var TYP = getCurrentPageObj().find("#typ").val();
        var GRADE = getCurrentPageObj().find("#grade").val();
        var DUTY_USER_ID = getCurrentPageObj().find("#duty_user_id").val();
        var IS_REAPPEAR = getCurrentPageObj().find("#is_reappear").val();
        var PRESENT_USER_ID = getCurrentPageObj().find("#present_user_id").val();
        var SUGGEST_SOLVE_TIME = getCurrentPageObj().find("#suggest_solve_time").val();
        var SUGGEST = getCurrentPageObj().find("#suggest").val();
        var PRESENT_USER_NAME= getCurrentPageObj().find("#present_user_name").val();
        var PROJECT_NAME = getCurrentPageObj().find("#project_name").val();
        var WORK_PRODUCT = getCurrentPageObj().find("#work_product").val();
        
		var call = getMillisecond();
		baseAjaxJsonp(
				dev_project
						+ "quality/insertOrUpdateQuality.asp?call="
						+ call + "&SID=" + SID ,
				{
					WORK_PRODUCT:WORK_PRODUCT,
					FIND_DATE : FIND_DATE,
					IS_REAPPEAR:IS_REAPPEAR,
					PRESENT_USER_ID:PRESENT_USER_ID,
					PRESENT_USER_NAME : PRESENT_USER_NAME,
					PROJECT_NUM : PROJECT_NUM,
					PROJECT_NAME : PROJECT_NAME,
					QUALITY_DESC : QUALITY_DESC,
					PHASES : PHASES,
					PROCESS : PROCESS,
					TYP : TYP,
					GRADE : GRADE,
					DUTY_USER_ID : DUTY_USER_ID,
					SUGGEST_SOLVE_TIME : SUGGEST_SOLVE_TIME,
					SUGGEST : SUGGEST, 
					PROJECT_ID :PROJECT_ID
				}, function(data) {
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
	$("#qualityManage_add_back").click(function(){
		closeCurrPageTab();
	});
}

function changeTYP(){
	var currTab = getCurrentPageObj();
	var form = currTab.find("#qualityManage_add");
	var firstSelect = form.find("#typ");
	var tr = firstSelect.parent().parent();
	var tds = tr.children();
	var type = firstSelect.val();
	for(var i=2;i<tds.length;i++){
		$(tds[i]).remove();
	}
	if(type=="02"){
		tr.append(
		'<td class="table-text">所属工作产品：</td>'+
			'<td><select name="WORK_PRODUCT" diccode="P_DIC_QUALITY_WORK_PRODUCT" id="work_product"></select></td>');
		form.find("#work_product").attr("validate","v.required").attr("valititle","该项为必填项");
		initSelect(getCurrentPageObj().find("select[name='WORK_PRODUCT']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_WORK_PRODUCT"});
		initVlidate(form.find("#work_product").parent());
	}else{
		tr.append("<td></td><td></td>");
	}
}
//显示项目pop
function showProjectPop(){
	openProjectPop("project_pop", {
		PROJECT_NUM : getCurrentPageObj().find("#project_num"),
		PROJECT_NAME : getCurrentPageObj().find("#project_name"),
		DUTY_USER_NAME : getCurrentPageObj().find("#duty_user_name"),
		PROJECT_ID : getCurrentPageObj().find("#project_id"),
		DUTY_USER_ID : getCurrentPageObj().find("#duty_user_id")
	});
}

//新增页面，初始化事件
function addNotConformConfig_init(){
	getCurrentPageObj().find("#project_num_add").show();
	getCurrentPageObj().find("#project_num_add").attr("validate","v.required");
	
	var find_date = getCurrentYMD();
	getCurrentPageObj().find("#find_date").val(find_date);
	getCurrentPageObj().find("#notConformConfigSpan").html("新增不符合项<em></em>");
	
}




/*;function initQualityManageAddLayout(id, quality_id){
	
	var currTab = getCurrentPageObj();
	initVlidate(currTab);
	var form = currTab.find("#qualityManage_add");
	currTab.find("input[name=PROJECT_ID]").val(id);
//	$("#TYP").bind('change', function(e) {
//		var work_product = currTab.find("#WORK_PRODUCT");
//		if($("#TYP").val() == 01){
//			work_product.removeAttr("validate");
//			work_product.parent().find("strong").remove();
//			work_product.attr("disabled",true);
//			work_product.val('');
//			work_product.select2();
//		}else{
//			work_product.removeAttr("disabled");
//			work_product.attr("validate","v.required").attr("valititle","该项为必填项");
//			initVlidate(work_product.parent());
//		}
//	});
	//保存按钮
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
	//返回
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
//			if(result.TYP=="01"){
//				currTab.find("#WORK_PRODUCT").attr("disabled",true);
//			}else{
//				currTab.find("#WORK_PRODUCT").attr("validate","v.required").attr("valititle","该项为必填项");
//				initVlidate(currTab.find("#WORK_PRODUCT").parent());
//			}
			autoInitSelect(form);//初始化下拉框
		},call);
	} else {
		autoInitSelect(form);//初始化下拉框
	}
	
}*/