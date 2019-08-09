initJuryInfo();

function initJuryInfo(){	

	getCurrentPageObj().find("#req_task_choice").click(function(){ 
		var req_task_state = getCurrentPageObj().find("#req_task_state").val();
		var jury_grade = getCurrentPageObj().find("#at_jury_grade").val();
		var system_no = getCurrentPageObj().find("#system_id").val();
		openTaskPop("addDivTask",{name:getCurrentPageObj().find("#judge_name"),no:getCurrentPageObj().find("#judge_role"),req_task_state:req_task_state,jury_grade:jury_grade,system_no:system_no},false,"juryTasktable");
	});	
	
	getCurrentPageObj().find("#theme_name").click(function(){
		openThemePop("addDivTask",{name:getCurrentPageObj().find("#theme_name"),no:getCurrentPageObj().find("#theme_id"),process_name:getCurrentPageObj().find("#process_name"),jury_type:getCurrentPageObj().find("#req_task_state")},true);
	});	
	
//	getCurrentPageObj().find("#sponsor_name").click(function(){ 
//		openUserPop("addDivTask",{name:getCurrentPageObj().find("#sponsor_name"),no:getCurrentPageObj().find("#sponsor_id")});
//	});
	
	getCurrentPageObj().find("#jury_principal_name").click(function(){ 
		openUserPop("addDivTask",{name:getCurrentPageObj().find("#jury_principal_name"),no:getCurrentPageObj().find("#jury_principal_id")});
	});
	
	getCurrentPageObj().find("#addTackCheck").click(function(){
		openCheckPop("addDivTask",{},false,"juryChecktable");
	});	
	
	
	getCurrentPageObj().find("#pop_jury_user").click(function(){
		openJuryUserPop("addDivTask",{name:getCurrentPageObj().find("#sponsor_name"),no:getCurrentPageObj().find("#sponsor_id"),singleSelect:false,table_id:"juryUsertable"});
	});
	getCurrentPageObj().find("#compere_name").click(function(){
		openUserPop("addDivTask",{name:getCurrentPageObj().find("#compere_name"),no:getCurrentPageObj().find("#compere_id")});
	});
	
	//保存
	getCurrentPageObj().find("#jurySave").click(function(){
//		debugger;
		if(!vlidate(getCurrentPageObj().find("#juryPrepare"))){
			alert("存在必填项未填");
			return false;
		}
		var save_type = getCurrentPageObj().find("#jury_sava_type").val();
		if(save_type=="jury_add" || save_type == "jury_edit"){
			juryAddOrEdit("04");
		}else if(save_type=="jury_user_confirm"){
			updateStateJuryUser();
		}else if(save_type=="jury_prepare"){
			updateStateJuryCheck();
		}
	});
	
	//保存并发起
	getCurrentPageObj().find("#jurySaveSponsor").click(function(){
		if(!vlidate(getCurrentPageObj().find("#juryPrepare"))){
			return false;
		}
		juryAddOrEdit("04");
	});
	
	getCurrentPageObj().find("#juryEnd").click(function(){
		getCurrentPageObj().find("#setJuryEndModel").modal("show");
	});
	
	//提交评审结论
	getCurrentPageObj().find("#juryEndSubmit").click(function(){
		var expertsCall = getMillisecond();
		var params = getPageParam("G");	
		
		var process_id = getCurrentPageObj().find("input[name='G.process_id']").val();
		params['process_id'] = process_id;
		params['file_id'] = getCurrentPageObj().find("#file_id").val();
		var param2 = {};
		param2["user_id"] = getCurrentPageObj().find("#jury_user_no_all").val()+","+getCurrentPageObj().find("#task_user_no_all").val()+
		","+getCurrentPageObj().find("#sponsor_id").val()+","+getCurrentPageObj().find("#jury_principal_id").val();
		param2["b_code"] = getCurrentPageObj().find("#jury_id").val();
		param2["b_id"] = getCurrentPageObj().find("#jury_id").val();
		if(params["jury_result"] == '01'){//评审通过
			param2["b_name"] = getCurrentPageObj().find("#jury_name").val()+"形成执行评审结论通过";
		}else if(params["jury_result"] == '02'){//评审不通过
			param2["b_name"] = getCurrentPageObj().find("#jury_name").val()+"形成执行评审结论不通过";
		}
		var juryCall = getMillisecond()+'2';
		baseAjaxJsonp(dev_construction+'GJury/upJuryTaskResult.asp?call='+expertsCall+'&SID='+SID,params, function(data) {
			if (data != undefined&&data!=null&&data.result=="true") {
				//插入提醒
				baseAjaxJsonp(dev_workbench+"Remind/remindAdd.asp?SID="+SID+"&call="+juryCall+"&remind_type=PUB2017150",
						param2, function(mes){
	    			//形成执行评审结论插入提醒成功
	    		}, juryCall);
				closePageTab("edit_jury");
				alert("提交成功");
			}else{
				alert("提交失败");
			}
		},expertsCall);
		
	});
	
	var currTab = getCurrentPageObj();
	//点击文件上传模态框
	var tablefile = currTab.find("#table_file");

	 //点击打开模态框
	 var addfile = getCurrentPageObj().find("#add_file");
	 addfile.click(function(){
		var business_code = "";
		business_code = getCurrentPageObj().find("input[name=FILE_ID]").val();
		if(!business_code){
			business_code = Math.uuid();
			var j_id = currTab.find("#jury_id").val();
			var cl = getMillisecond();
			baseAjaxJsonp(dev_construction+'GJury/updateJuryTaskFileId.asp?call='+cl+'&SID='+SID, {jury_id:j_id, file_id:business_code}, function(result){
				getCurrentPageObj().find("input[name=FILE_ID]").val(business_code);
			}, cl);
		}
		 
		var req_task_state = currTab.find("#req_task_state").val();
		 var paramObj = new Object();
		 paramObj.SYSTEM_NAME = currTab.find("#system_name").val();
		 if("03"==req_task_state){
			 paramObj.REQ_CODE = currTab.find("#sub_req_code").html().subStr(0,11);
			 openFileSvnUpload(currTab.find("#file_modal"), tablefile, 'GZ1064',business_code, '00', 'S_DIC_JURY_RESULT_FILE', false, true, paramObj);
		 } else {
			 //var bc = $(currTab.find("td[name=req_task_code_aa]")[0]).html();
			 var bc = currTab.find("#req_task_code_aa").val();
			 baseAjax("SFilePath/getSystemNameAndVersionName.asp?req_task_code="+bc, null, function(result){
					paramObj = result;
			 }, false);
			 openFileSvnUpload(currTab.find("#file_modal"), tablefile, 'GZ1065',business_code, '00', 'S_DIC_JURY_RESULT_FILE', false, true, paramObj);
		 }
	 });

	 //附件删除
	 var delete_file = getCurrentPageObj().find("#delete_file");
	 delete_file.click(function(){
		var business_code = getCurrentPageObj().find("input[name=FILE_ID]").val();
		delSvnFile(tablefile, business_code, "00", currTab.find("#file_modal"));
	 });
	
	
}

//添加或修改评审
function juryAddOrEdit(type){
	
	//查找所有管理的任务
	var chobj= getCurrentPageObj().find("input[name='check_task']:checkbox"); 
	var taskInfos="";//删除的ID  
	chobj.each(function(){  
		if(taskInfos==""){
			taskInfos = getCurrentPageObj().find(this).val();
		}else{
			taskInfos = taskInfos+","+getCurrentPageObj().find(this).val();
		}
	});    
	if(taskInfos==""){ alert("请选择相关评审任务"); return;}
	var expertsCall = getMillisecond();
    var params = getPageParam("G");		//遍历当前页面的input,text,select
    params['jury_status'] = type;		//保存并发起状态
  	params['taskInfos'] = taskInfos;
	baseAjaxJsonp(dev_construction+'GJury/insertJury.asp?call='+expertsCall+'&SID='+SID,params, function(data) {
		if (data != undefined&&data!=null&&data.result=="true") {
			closePageTab("edit_jury");
			alert("添加成功");
		}else{
			alert("添加失败");
		}
	},expertsCall);
}

//确定评审人员，关联
function updateStateJuryUser(){

	var compere_id = getCurrentPageObj().find("#compere_id").val();
	if(compere_id==null || compere_id == "" || compere_id == undefined){
		alert("请选择主持人");
		return;
	}
	
	var checkobj= getCurrentPageObj().find("input[name='jury_user']:checkbox"); 
	var juryUsers="";//删除的ID  
	var juryRoles="";//评委角色
	var juryRole="";
	/*checkobj.each(function(){  
		if(juryUsers==""){
			juryUsers = getCurrentPageObj().find(this).val();
			juryRole = getCurrentPageObj().find("#jury_role"+juryUsers+" option:selected").val();
			if(juryRole == "")
				juryRoles = "00";
			else 
				juryRoles = juryRole;
		}else{
			juryUsers = juryUsers+","+getCurrentPageObj().find(this).val();
			juryRole=getCurrentPageObj().find("#jury_role"+getCurrentPageObj().find(this).val()+" option:selected").val();
			if(juryRole == "")
				juryRoles = juryRoles+","+"00";
			else
				juryRoles = juryRoles+","+juryRole;
		}
	}); */
	var records = getCurrentPageObj().find("#juryUsertable").bootstrapTable('getData');
	$.map(records, function (row) {
		
		if(juryUsers==""){
			juryUsers = row.USER_NO;
			juryRole = getCurrentPageObj().find("#jury_role"+juryUsers).val();
			if(juryRole == "")
				juryRoles = "00";
			else 
				juryRoles = juryRole;
		}else{
			juryUsers = juryUsers+","+row.USER_NO;
			juryRole=getCurrentPageObj().find("#jury_role"+row.USER_NO).val();
			if(juryRole == "")
				juryRoles = juryRoles+","+"00";
			else
				juryRoles = juryRoles+","+juryRole;
		}
	});
	var expertsCall = getMillisecond();
    var params = getPageParam("G");		//遍历当前页面的input,text,select
  	params['jury_users'] = juryUsers;
  	params['jury_roles'] = juryRoles;
	baseAjaxJsonp(dev_construction+'GJury/updateStateJury.asp?call='+expertsCall+'&SID='+SID,params, function(data) {
		if (data != undefined&&data!=null&&data.result=="true") {
			closePageTab("edit_jury");
			alert("添加成功");
		}else{
			alert("添加失败");
		}
	},expertsCall);
	return;
}

//准备评审，关联评审项
function updateStateJuryCheck(){

	var jury_type = getCurrentPageObj().find("input[name='G.jury_type']:checked").val();
	if(jury_type==null || jury_type == "" || jury_type == undefined){
		alert("请选择评审方式");
		return;
	}
	var feedback_time = getCurrentPageObj().find("#feedback_time").val();
	if(feedback_time==null || feedback_time == "" || feedback_time == undefined){
		alert("请选择填写反馈时间");
		return;
	}
	
	/*var checkobj= getCurrentPageObj().find("input[name='jury_check']:checkbox"); 
	var juryChecks="";//检查项id
	checkobj.each(function(){  
		if(juryChecks==""){
			juryChecks = getCurrentPageObj().find(this).val();
		}else{
			juryChecks = juryChecks+","+getCurrentPageObj().find(this).val();
		}
	}); */
	var juryChecks="";//检查项id
	var records = getCurrentPageObj().find("#juryChecktable").bootstrapTable('getData');
	$.map(records, function (row) {
		if(juryChecks==""){
			juryChecks = row.CHECK_ID;
		}else{
			juryChecks = juryChecks+","+row.CHECK_ID;
		}
	});
	
	
	
	var expertsCall = getMillisecond();
    var params = getPageParam("G");		//遍历当前页面的input,text,select
  	params['jury_checks'] = juryChecks;
  	
  	baseAjaxJsonp(dev_construction+'GJury/updateStateJury.asp?call='+expertsCall+'&SID='+SID,params, function(data) {
		if (data != undefined&&data!=null&&data.result=="true") {
			closePageTab("edit_jury");
			alert("添加成功");
		}else{
			alert("添加失败");
		}
	},expertsCall);
	return;
}


/* tab选项卡 */
getCurrentPageObj().find(document).ready(function() {
	getCurrentPageObj().find(".tabBtn").click(function() {
		
		getCurrentPageObj().find(".tabBtn").removeClass('tabBtn_Bg')
		getCurrentPageObj().find(this).addClass("tabBtn_Bg");
	});
	getCurrentPageObj().find(".tabD li").click(function() {
		getCurrentPageObj().find(".tabContListD").hide().eq(getCurrentPageObj().find(this).index()).show();
		getCurrentPageObj().find(this).addClass("tabBtn_Bg");
		/* getCurrentPageObj().findthis.addClass('current');*/
	});
	
	/*选择评审检查项（多选）*/
	getCurrentPageObj().find("#add_review").bind('click',function(e){
		getCurrentPageObj().find("#reviews_pop").modal("show");
	});	

});
//initSelect(getCurrentPageObj().find("#jury_grade"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_JURY_GRADE"});
//initSelect(getCurrentPageObj().find("#at_jury_grade"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_JURY_GRADE"});

//页面内容收缩
$(function(){
      EciticTitleI();
})

//查看任务详情
function viewJuryTaskDetail(req_task_id,req_task_code,task_state){
	
	//closeAndOpenInnerPageTab("task_analyze_info","需求任务文档详情","dev_construction/requirement/reqTask_phased/reqTaskFile_info.html",function(){
		var params = {};
		params['req_task_id'] = req_task_id;
		params["phased_state"]=task_state;
		params['REQ_TASK_CODE']=req_task_code.toString();
		var text = "";
		if(task_state=='03'){
			params['phase']='req_task_analyze';
			text="任务分析文档详情";
		}else if(task_state=='05'){
			params['phase']='req_task_summary';
			text="设计开发文档详情";
		}else if(task_state=='06'){
			params['phase']='req_task_design';
			text="详细设计文档详情";
		}else if(task_state=='07'){
			params['phase']='req_task_unit_test';
			text="编码开发文档详情";
		}else if(task_state=='08'){
			params['phase']='req_task_joint';
			text="联调测试文档详情";
		}else if(task_state=='09001'){
			params['phase']='req_sit_file';
			text="SIT测试案例文档详情";
		}else if(task_state=='10'){
			params['phase']='req_uat_file';
			text="UAT测试文档详情";
		}
		
		
		var taskCall = getMillisecond();
		 baseAjaxJsonp(dev_construction+"GTaskPhased/queryTaskPhasedById.asp?SID="+SID+"&call="+taskCall, params , function(data) {
			 if (data != undefined && data != null && data.result=="true") {
				viewPhaseTaskDetail(task_state,data.data[0],text);
			}
		},taskCall);
		
		/*if(task_state=='03'){
			params['phase']='req_task_analyze';
			queryTaskPhasedById(params,"S_DIC_REQ_ANL_FILE");
		}else if(task_state=='05'){
			params['phase']='req_task_summary';
			queryTaskPhasedById(params,"S_DIC_SYS_DESIGN_FILE");
		}else if(task_state=='06'){
			params['phase']='req_task_design';
			queryTaskPhasedById(params,"S_DIC_DET_DESIGN_FILE");
		}else if(task_state=='07'){
			params['phase']='req_task_unit_test';
			queryTaskPhasedById(params,"S_DIC_UNIT_TEST_FILE");
		}else if(task_state=='08'){
			params['phase']='req_task_joint';
			queryTaskPhasedById(params,"S_DIC_JOINT_TEST_FILE");
		}else if(task_state=='09001'){
			params['phase']='req_sit_file';
			queryTaskPhasedById(params,"S_DIC_SIT_TEST_FILE");
		}else if(task_state=='10'){
			params['phase']='req_uat_file';
			queryTaskPhasedById(params,"S_DIC_UAT_TEST_FILE");
		}
		*/
		
	//});
}
