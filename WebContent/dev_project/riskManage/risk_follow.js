risk_followcall();
initRiskUpdateDicCode();
//字典项
function initRiskUpdateDicCode(){
	initSelect(getCurrentPageObj().find("#riskAdd_level"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_RISK_LEVEL"},ida.RISK_GRADE);
	initSelect(getCurrentPageObj().find("#riskAdd_possible"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_RISK_POSSIBLE"},ida.RISK_PROBABILITY);
	initSelect(getCurrentPageObj().find("#riskAdd_effect"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_RISK_EFFECT"},ida.RISK_INFLUENCE);
	initSelect(getCurrentPageObj().find("#risk_measures"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_RISK_MEASURES"},ida.RESPOND_MEASURE);
	initSelect(getCurrentPageObj().find("#risk_intstate"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_RISK_STATUS"});
	var currentLoginName=$("#currentLoginName").val();
	getCurrentPageObj().find("#sayman").val(currentLoginName);
}

function initRiskFollowBtn(ida){
	var currTab = getCurrentPageObj();
	getCurrentPageObj().find("input[name='RIS.intname']").val(ida.RISK_NAME);
	getCurrentPageObj().find("input[name='RIS.inti']").val(ida.RISK_FROM_ID);
	getCurrentPageObj().find("input[name='RIS.callman']").val(ida.DUTY_USER_NAME);
	getCurrentPageObj().find("input[name='RIS.inttype']").val(ida.FIRST_CLASSIFY_NAME);
	getCurrentPageObj().find("input[name='RIS.findtime']").val(ida.FIND_TIME);
	getCurrentPageObj().find("textarea[name='RIS.intdesc']").val(ida.RISK_DESC);
	//getCurrentPageObj().find("input[name='RIS.intlevel']").val(ida.RISK_GRADE_NAME);
	//getCurrentPageObj().find("input[name='RIS.probability']").val(ida.RISK_PROBABILITYS);
	getCurrentPageObj().find("textarea[name='RIS.plan']").val(ida.DISPOSE_PLAN);
	getCurrentPageObj().find("input[name='RIS.username']").val(ida.OPT_USER_NAME);
	getCurrentPageObj().find("input[name='RIS.soletime']").val(ida.PRESENT_TIME);
	getCurrentPageObj().find("input[name='RIS.sayman']").val(ida.PRESENT_USER_NAME);
	getCurrentPageObj().find("textarea[name='RIS.intyingxiang']").val(ida.QUESTION_AFFECT_ANALYSE);
	getCurrentPageObj().find("textarea[name='RIS.huanjie']").val(ida.REMISSION_MEASURE);
	getCurrentPageObj().find("textarea[name='RIS.reply']").val(ida.REPLY_MEASURE);
	//getCurrentPageObj().find("input[name='RIS.measures']").val(ida.RESPOND_MEASURE_NAME);
	//getCurrentPageObj().find("input[name='RIS.influence']").val(ida.RISK_INFLUENCE_NAME);
	getCurrentPageObj().find("input[name='RIS.intstate']").val(ida.RISK_STATUS_NAME);
}

function risk_followcall(){
    getCurrentPageObj().find('#risk_add').click(function(){
	    if(!vlidate($("#risk_form"),"",true)){
		    alert("请按要求填写图表中的必填项！");
		    return ;
	    }
	    var inputs = getCurrentPageObj().find("input:text[name^='RIS.']");
	    var selects = getCurrentPageObj().find("select[name^='RIS.']");
	    var textareas = getCurrentPageObj().find("textarea[name^='RIS.']");
	    var params = {};
		for(var i=0;i<inputs.length;i++){
			params[$(inputs[i]).attr("name").substr(4)] = $(inputs[i]).val(); 
		}
		for(var i=0;i<selects.length;i++){
			params[$(selects[i]).attr("name").substr(4)] = $(selects[i]).val();
		}
		for(var i=0;i<textareas.length;i++){
			params[$(textareas[i]).attr("name").substr(4)] = $(textareas[i]).val();	 
		}
		baseAjaxJsonp(dev_project+"riskQuestionManage/queryAcceptOperateUpdate.asp?SID="+SID, params, function(data) {
			closePageTab("risk_track");
			alert("提交成功");
		});
	});	
}