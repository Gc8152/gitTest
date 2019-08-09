/*function initQuestionRaiseUpdateDic(){
  var initDicForm=getCurrentPageObj().find("#questionRaiseUpdate_form");
      autoInitSelect(initDicForm);
}
*/
function initRiskQuestionUpdateSaveLayout(){
	
	var currTab = getCurrentPageObj();
	var qRupdateForm=currTab.find("#questionRaiseUpdate_form");
	var project_update=currTab.find("tr[name=question_project]");
	var q_grade_update = currTab.find("select[name=risk_grade]");
	var duty_man_update = qRupdateForm.find("input[name=duty_user_id_name]");
	var duty_man_id_update = qRupdateForm.find("input[name=duty_user_id]");
	var project_id_update = qRupdateForm.find("input[name=project_id]");
	var project_num_update = qRupdateForm.find("input[name=project_num]");
	var project_name_update = qRupdateForm.find("input[name=project_name]");
	initVlidate(currTab);
	
	
	//保存操作
	var save_update = currTab.find("#save_questionRaiseUpdate");
	save_update.click(function(e){
		updateSaveQuestionInfo("save");
    });
	//提交操作
	var submit_update = currTab.find("#submit_questionRaiseUpdate");
	submit_update.click(function(e){
		nconfirm("确定提交问题吗？",function(){
			updateSaveQuestionInfo("submit");});

    });
	//返回操作
	var back_update = currTab.find("#return_questionRaiseUpdate");
	back_update.click(function(e){
		
		nconfirm("确定返回吗？",function(){
			closeCurrPageTab();
			});
		
	});
	//选择问题级别为项目时，视图变化
	
	q_grade_update.bind('change',function(){
		if(q_grade_update.val()=='01'){
			project_update.show();
			duty_man_id_update.val("");
			duty_man_update.val("");
		} else {
			project_update.hide();
			project_id_update.val("");
			project_name_update.val("");
			project_num_update.val("");
			duty_man_id_update.val("");
			duty_man_update.val("");
		}
		
	});
	//项目编号与名称pop
	var projectPop_update=currTab.find("#project_name");
	projectPop_update.unbind("click").click(
			function(e){
				qropenProjectPop("qru_project_pop", {
					PROJECT_NUM : getCurrentPageObj().find("#project_num"),
					PROJECT_NAME : getCurrentPageObj().find("#project_name"),
					PROJECT_MAN_NAME : getCurrentPageObj().find("#duty_user_id_name"),
					PROJECT_ID : getCurrentPageObj().find("#project_id"),
					PROJECT_MAN_ID : getCurrentPageObj().find("#duty_user_id")
				});
			}
	);
	//责任人pop

	duty_man_update.click(function(){
	
		if(q_grade_update.val()=='01'){
			var urls=dev_project+"QuestionRaise/questionRaiseQueryAllUser.asp?SID="+SID+"&ROLE_NO=0007";
			questionRaiseopenPmPop(currTab.find("#qru_duty_user_pop"),{Zpm_id:qRupdateForm.find("input[name=duty_user_id]"),Zpm_name:qRupdateForm.find("input[name=duty_user_id_name]")},urls);
		}
		if(q_grade_update.val()=='02'){
			var urls=dev_project+"QuestionRaise/questionRaiseQueryAllUser.asp?SID="+SID+"&ROLE_NO=004&ORG_CODE='1101'";
			questionRaiseopenPmPop(currTab.find("#qru_duty_user_pop"),{Zpm_id:qRupdateForm.find("input[name=duty_user_id]"),Zpm_name:qRupdateForm.find("input[name=duty_user_id_name]")},urls);
		}
		if(q_grade_update.val()=='03'){
			var urls=dev_project+"QuestionRaise/questionRaiseQueryAllUser.asp?SID="+SID+"&ROLE_NO=003&ORG_CODE='110101','110102','110103','110104','110105','110106','110107','110108','110109','110110'";
			questionRaiseopenPmPop(currTab.find("#qru_duty_user_pop"),{Zpm_id:qRupdateForm.find("input[name=duty_user_id]"),Zpm_name:qRupdateForm.find("input[name=duty_user_id_name]")},urls);
		}
		if(q_grade_update.val()=='04'){
			var urls=dev_project+"QuestionRaise/questionRaiseQueryAllUser.asp?SID="+SID+"&ROLE_NO=0080";
			questionRaiseopenPmPop(currTab.find("#qru_duty_user_pop"),{Zpm_id:qRupdateForm.find("input[name=duty_user_id]"),Zpm_name:qRupdateForm.find("input[name=duty_user_id_name]")},urls);
		}
		
	});
	//真实保存基本信息(逻辑保存)
	function updateSaveQuestionInfo(opt_type){
		if(!vlidate(getCurrentPageObj(),"",true)){
			return ;
		}
		var params=qRupdateForm.serialize();
		var isComplete = vlidate(qRupdateForm,"",true);
			if(isComplete){
				
			} else {
				return;
			}
		var type= opt_type;
		
		var call = getMillisecond()+1;
		baseAjaxJsonp(dev_project+"QuestionRaise/submitQuestionRaiseAdd.asp?SID="+SID+"&call="+call+"&"+params+"&opt_type="+type, null, function(data){
		
			if (data != undefined && data != null) {
				alert(data.msg);
				if(data.result=="true"){
					closeCurrPageTab();
				}
			}else{
				alert("未知错误！");
			}
		},call);
		
	}
	
}	
function initQuestionRaiseUpdateInfo(item){ 	
	for(var k in item){
		k1 = k.toLowerCase();
       var select= getCurrentPageObj().find("[name='"+ k1 +"']");
       if((k1=="risk_grade")&&(item[k]=="01")){
    	   getCurrentPageObj().find("tr[name=question_project]").show(); 
       }
       if(select.attr("tagName")=='div')
       {  select.text(item[k]);}
       else  if(select.attr("tagName")=='input'){
    	   select.val(item[k]);
       }
       else if(select.attr("tagName")=='select') {
    	   select.val(item[k]);
    	   var code= select.attr("diccode");
  		 if((code!=null)&&(code!='')){
        initSelect(select,{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:code},item[k]);}
  		 }
       else if(select.attr("tagName")=='textarea') {
    	   select.val(item[k]);
       }
       else{
    	   select.text(item[k]); 
       }
       }
	
	
	
}
