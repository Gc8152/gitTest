function initPlanChangeBtn(data){
	var currTab = getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题
	
	initVlidate(currTab);
	var mTable = currTab.find("#plan_table_milestone");//里程碑table
	var project_id=data.PROJECT_ID;
/*	debugger;*/
	initMilestone(project_id);
	//初始化模板里程碑
	function initMilestone(project_id){
		mTable.find("tr").not(":eq(0)").remove();
		var call=getMillisecond();
		baseAjaxJsonp(dev_project + "annualVersion/initMilestone.asp?SID=" + SID + '&call=' + call,
				{"project_id" : project_id}, 
				function(data){
					var list = data.milestoneList;
					if(data.result=="true"){
						if (list != undefined && list != null) {
							for ( var i = 0; i < list.length; i++) {
								 var map = list[i];
								 var milestone_id = map.MILESTONE_ID;
								 var milestone_name = map.MILESTONE_NAME;
								 var start_time = map.START_TIME == undefined ? "" : map.START_TIME;;
								 var end_time = map.END_TIME == undefined ? "" : map.END_TIME;;
								 var is_choice=map.IS_CHOICE;//'00'必选,'01'非必选
								 var tr = "<tr name='milestoneInfoList'>" 
								 			+ "<td>" + (i + 1) + "</td>"
								 			+ "<td name='milestone_id' mid='" + milestone_id + "'>" + milestone_name+ "</td>"
											+ "<td><input type='text' name='start_time' onClick='WdatePicker({})' value='" + start_time+ "'/></td>"
											+ "<td><input type='text' name='end_time' onClick='WdatePicker({})' value='" + end_time + "'/></td>" +
										  "</tr>";
	
								 mTable.append(tr);
							 }
						}
					}else{
						alert("初始化里程碑失败!");
					}
				}, call);
	}
}
