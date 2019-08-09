function initQuestionRaiseDic(){
  var initDicForm=getCurrentPageObj().find("#questionRaiseAdd_form");
      autoInitSelect(initDicForm);
}

function initRiskQuestionSaveLayout(){
	
	var currTab = getCurrentPageObj();
	var qRaddForm=currTab.find("#questionRaiseAdd_form");
	var project=currTab.find("tr[name=question_project]");
	var q_grade = currTab.find("select[name=risk_grade]");
	var duty_man = qRaddForm.find("input[name=duty_user_id_name]");
	var duty_man_id = qRaddForm.find("input[name=duty_user_id]");
	var project_id = qRaddForm.find("input[name=project_id]");
	var project_num = qRaddForm.find("input[name=project_num]");
	var project_name = qRaddForm.find("input[name=project_name]");
	initVlidate(currTab);
	
	
	//保存操作
	var save = currTab.find("#save_questionRaiseAdd");
	save.click(function(e){
		saveQuestionInfo("save");
    });
	//提交操作
	var submit = currTab.find("#submit_questionRaiseAdd");
	submit.click(function(e){
		nconfirm("确定提交问题吗？",function(){
		saveQuestionInfo("submit");});

    });
	//返回操作
	var back = currTab.find("#return_questionRaiseAdd");
	back.click(function(e){
		
		nconfirm("确定返回吗？",function(){
			closeCurrPageTab();
			});
		
	});
	//选择问题级别为项目时，视图变化
	
	q_grade.bind('change',function(){
		if(q_grade.val()=='01'){
			project.show();
			duty_man_id.val("");
			duty_man.val("");
		} else {
			project.hide();
			project_id.val("");
			project_name.val("");
			project_num.val("");
			duty_man_id.val("");
			duty_man.val("");
		}
		
	});
	//项目编号与名称pop
	var projectPop=currTab.find("#project_name");
	projectPop.unbind("click").click(
			function(e){
				qropenProjectPop("qr_project_pop", {
					PROJECT_NUM : getCurrentPageObj().find("#project_num"),
					PROJECT_NAME : getCurrentPageObj().find("#project_name"),
					PROJECT_MAN_NAME : getCurrentPageObj().find("#duty_user_id_name"),
					PROJECT_ID : getCurrentPageObj().find("#project_id"),
					PROJECT_MAN_ID : getCurrentPageObj().find("#duty_user_id")
				});
			}
	);
	//责任人pop

	duty_man.click(function(){
	
		if(q_grade.val()=='01'){
			var urls=dev_project+"QuestionRaise/questionRaiseQueryAllUser.asp?SID="+SID+"&ROLE_NO=0007";
			questionRaiseopenPmPop(currTab.find("#duty_user_pop"),{Zpm_id:qRaddForm.find("input[name=duty_user_id]"),Zpm_name:qRaddForm.find("input[name=duty_user_id_name]")},urls);
		}
		if(q_grade.val()=='02'){
			var urls=dev_project+"QuestionRaise/questionRaiseQueryAllUser.asp?SID="+SID+"&ROLE_NO=004&ORG_CODE='1101'";
			questionRaiseopenPmPop(currTab.find("#duty_user_pop"),{Zpm_id:qRaddForm.find("input[name=duty_user_id]"),Zpm_name:qRaddForm.find("input[name=duty_user_id_name]")},urls);
		}
		if(q_grade.val()=='03'){
			var urls=dev_project+"QuestionRaise/questionRaiseQueryAllUser.asp?SID="+SID+"&ROLE_NO=003&ORG_CODE='110101','110102','110103','110104','110105','110106','110107','110108','110109','110110'";
			questionRaiseopenPmPop(currTab.find("#duty_user_pop"),{Zpm_id:qRaddForm.find("input[name=duty_user_id]"),Zpm_name:qRaddForm.find("input[name=duty_user_id_name]")},urls);
		}
		if(q_grade.val()=='04'){
			var urls=dev_project+"QuestionRaise/questionRaiseQueryAllUser.asp?SID="+SID+"&ROLE_NO=0080";
			questionRaiseopenPmPop(currTab.find("#duty_user_pop"),{Zpm_id:qRaddForm.find("input[name=duty_user_id]"),Zpm_name:qRaddForm.find("input[name=duty_user_id_name]")},urls);
		}
		
	});
	//真实保存基本信息(逻辑保存)
	function saveQuestionInfo(opt_type){
		if(!vlidate(getCurrentPageObj(),"",true)){
			return ;
		}
		var params=qRaddForm.serialize();
		var isComplete = vlidate(qRaddForm,"",true);
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
