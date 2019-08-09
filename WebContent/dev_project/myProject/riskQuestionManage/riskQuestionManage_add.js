;function initRiskQuestionSaveLayout(PROJECT_ID, risk_id){
	
	var currTab = getCurrentPageObj();
	
	var form = currTab.find("#riskQuestionInfo_add_common");
	var riskForm = currTab.find("#riskQuestionInfo_add_risk");
	var questionForm = currTab.find("#riskQuestionInfo_add_question");
	var risk_div = currTab.find("#riskQuestionInfo_add_risk_div");
	var question_div = currTab.find("#riskQuestionInfo_add_question_div");
	//initVlidate(form)
	initVlidate(currTab);
	//保存操作
	var submit = currTab.find("#riskQuestionInfo_add_submit");
	submit.click(function(e){
		var type = currTab.find("select[name=FIRST_CLASSIFY]").val();
		var content = "";
		if(!vlidate(currTab,"",true)){
			return ;
		}
		var isComplete = vlidate(form,"",true);
		if(type=='01'){
			content += form.serialize() + "&" + riskForm.serialize();
			var riskComplete = vlidate(riskForm,"",true);
			if(isComplete&&riskComplete){
				
			} else {
				return;
			}
		} else if(type='02'){
			content += form.serialize() + "&" + questionForm.serialize();
			var questionComplete = vlidate(riskForm,"",true);
			if(isComplete&&questionComplete){
				
			} else {
				return;
			}
		}
		var call = getMillisecond()+1;
		baseAjaxJsonp(dev_project+"riskQuestionManage/riskSave.asp?SID="+SID+"&call="+call+"&"+content, null, function(data){
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
	//返回操作
	var back = currTab.find("#riskQuestionInfo_add_back");
	back.click(function(e){
		closeCurrPageTab();
	});
	//选择风险或者问题的控制按钮
	var type = currTab.find("select[name=FIRST_CLASSIFY]");
	type.bind('change',function(){
		if(type.val()=='01'){
			risk_div.show();
			question_div.hide();
		} else if(type.val()=='02') {
			risk_div.hide();
			question_div.show();
		}
	});
	//责任人pop
	var duty_man = form.find("input[name=DUTY_USER_NAME]");
	duty_man.click(function(){
		openPmPop(currTab.find("#chooseDutyMan"),{Zpm_id:form.find("input[name=DUTY_USER_ID]"),Zpm_name:form.find("input[name=DUTY_USER_NAME]")});
	});
	//风险的处理人pop
	var opt_man = riskForm.find("input[name=OPT_USER_NAME]");
	opt_man.click(function(){
		openPmPop(currTab.find("#chooseOptUser"),{Zpm_id:riskForm.find("input[name=OPT_USER_ID]"),Zpm_name:riskForm.find("input[name=OPT_USER_NAME]")});
	});
	//问题的处理人pop
	var ques_man = questionForm.find("input[name=OPT_USER_NAME]");
	ques_man.click(function(){
		openPmPop(currTab.find("#chooseOptUser"),{Zpm_id:questionForm.find("input[name=OPT_USER_ID]"),Zpm_name:questionForm.find("input[name=OPT_USER_NAME]")});
	});
	//问题或者风险的 下拉框过滤
	var firstSelect = form.find("select[name=FIRST_CLASSIFY]");
	firstSelect.bind('change',function(){
		var obj = form.find("select[name=SECOND_CLASSIFY]");
		var type = firstSelect.val();
		if(type=='01'){
			initSelect(obj,{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_RISK_TYPE2"},"", "","09,10,11,12,13");
		} else if(type='02'){
			initSelect(obj,{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_RISK_TYPE2"},"", "","01,02,03,04,05,06,07,08");
		}
	});	
	//初始
	initLayout();
	function initLayout(){
		
		var call = getMillisecond();
		baseAjaxJsonp(dev_project+"quality/queryOneProjectInfo.asp?call="+call+"&SID="+SID+"&PROJECT_ID="+PROJECT_ID, null, function(result){
			//项目项目基本信息
			for(var i in result){
				currTab.find("input[name="+i+"]").val(result[i]);
			}
			form.find("input[name=RISK_FROM_ID]").val(result.PROJECT_NUM+"--"+result.PROJECT_NAME);
		}, call);
		
		question_div.hide();
	}
	
	if(risk_id){
		//update
		var call = getMillisecond();
		baseAjaxJsonp(dev_project+"quality/queryOneQuality.asp?call="+call+"&SID="+SID+"&RISK_ID="+risk_id, null, function(result){
			//项目项目基本信息
			for(var i in result){
				currTab.find("input[name="+i+"]").val(result[i]);
				currTab.find("select[name="+i+"]").attr("value",result[i]);
				currTab.find("textarea[name="+i+"]").val(result[i]);
			}
			autoInitSelect(form);//初始化下拉框
			autoInitSelect(riskForm);
			autoInitSelect(questionForm);
		},call);
	} else {
		autoInitSelect(form);//初始化下拉框
		autoInitSelect(riskForm);
		autoInitSelect(questionForm);
		//initSelect(form.find("select[name=SECOND_CLASSIFY]"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_RISK_TYPE2"},"", "",["09","10","11","12","13"]);
	}
	
	
	
}