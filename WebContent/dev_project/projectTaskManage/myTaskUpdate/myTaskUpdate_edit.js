function showMyTask(data){
	p_task_id=data.P_TASK_ID;
	var currTab = getCurrentPageObj();
	//赋值
	for (var key in data) {
		currTab.find("div[name="+key+"]").html(data[key]);
		currTab.find("pre[name=TASK_DESC]").html(data["TASK_DESC"]);
		
	}
	currTab.find("input[name=ACTUAL_STARTTIME]").val(data.ACTUAL_STARTTIME);
	currTab.find("input[name=ACTUAL_ENDTIME]").val(data.ACTUAL_ENDTIME);
	currTab.find("textarea[name=DELAY_REASON]").val(data.DELAY_REASON);
	
	if(data.TASK_STATE!="05"){
		getCurrentPageObj().find("#back_reason_tr").hide();
	}
	//返回按钮
	var back = currTab.find("#back");
	back.click(function(){
		closeCurrPageTab();
	});
	
	//保存
	currTab.find("#save_mytask").unbind("click").click(function(){
		var params = {};
		params["P_TASK_ID"]=data.P_TASK_ID;
		params["REQ_TASK_ID"]=data.REQ_TASK_ID;
		params["TASK_STATE"]="03";//03为执行中
		params["ACTUAL_STARTTIME"]=currTab.find("input[name=ACTUAL_STARTTIME]").val();
		params["ACTUAL_ENDTIME"]=currTab.find("input[name=ACTUAL_ENDTIME]").val();
		params["DELAY_REASON"]=currTab.find("textarea[name=DELAY_REASON]").val();
		if(!vlidate(getCurrentPageObj(),"",true)){
			alert("有必填项未填");
			return ;
		}
		if(currTab.find("input[name=ACTUAL_ENDTIME]").val()!=""){
			params["TASK_STATE"]="04";//04为已完成
		}
		var saveCall = getMillisecond() + '1';
		baseAjaxJsonp(dev_project+"myProjectTask/saveAddTask.asp?SID=" + SID + "&call=" + saveCall+"&params="+params, params, function(data) {
			if(data && data.result=="true"){
				alert(data.msg);
				closeCurrPageTab();
			}else{
				alert(data.msg);
				closeCurrPageTab();
			}
		},saveCall,false);
	});
	
}
function initDate(){
	WdatePicker({
			dateFmt : 'yyyy-MM-dd',
			minDate : '1990-01-01',
			maxDate : new Date()
	});
}
initVlidate(getCurrentPageObj());