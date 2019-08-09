function backupMyTask(data){
	p_task_id=data.P_TASK_ID;
	var currTab = getCurrentPageObj();
	//赋值
	for (var key in data) {
		currTab.find("div[name="+key+"]").html(data[key]);
		currTab.find("pre[name="+key+"]").html(data[key]);
	}
	currTab.find("div[name=ACTUAL_STARTTIME]").val(data.ACTUAL_STARTTIME);
	currTab.find("div[name=ACTUAL_ENDTIME]").val(data.ACTUAL_ENDTIME);
	currTab.find("textarea[name=DELAY_REASON]").val(data.DELAY_REASON);
	currTab.find("textarea[name=BACKUP_REASON]").val(data.BACKUP_REASON);
	
	//返回按钮
	var back = currTab.find("#back");
	back.click(function(){
		closeCurrPageTab();
	});
	
	//打回按钮
	currTab.find("#backup_mytask").unbind("click").click(function(){
		var params = {};
		params["P_TASK_ID"]=data.P_TASK_ID;
		params["REQ_TASK_ID"]=data.REQ_TASK_ID;
		params["ACTUAL_STARTTIME"]=data.ACTUAL_STARTTIME;
		params["ACTUAL_ENDTIME"]=data.ACTUAL_ENDTIME;
		params["DELAY_REASON"]=data.DELAY_REASON;
		params["BACKUP_REASON"]=currTab.find("textarea[name=BACKUP_REASON]").val();
		
		if(!vlidate(getCurrentPageObj(),"",true)){
			alert("有必填项未填");
			return ;
		}
		params["TASK_STATE"]="05";//05为打回
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

initVlidate(getCurrentPageObj());