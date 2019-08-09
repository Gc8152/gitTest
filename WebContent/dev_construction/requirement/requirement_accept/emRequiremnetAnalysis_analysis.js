
var currTab=getCurrentPageObj();
function initEmReqAnalysisLayout(ids){
	var emreqdetailCall=getMillisecond();
	baseAjaxJsonp(dev_construction+"requirement_input/queryEmRequirementInfoByID.asp?SID="+SID+"&req_id="+ids+"&call="+emreqdetailCall, null , function(data) {
		for ( var k in data) {
			var str=data[k];
			k = k.toLowerCase();//大写转换为小写
	     if(k=="req_id"){
	    	 currTab.find("input[name='" + k + "']").val(str);
	     }
	     else if(k=="res_group_id"){
	    	 currTab.find("input[name='" + k + "']").val(str);
	     }
	     else if(k=="req_analysis_name"){
	    	 currTab.find("input[name='" + k + "']").val(str);
	     }
	     else  if(k=="req_analysis"){
	    	 currTab.find("input[name='" + k + "']").val(str);
	     }
	     else if(k=="affect_other_system"){
	    	 if(str=="0"){
	    		 currTab.find("input[name='" + k + "']:last").attr("checked","true");
	    		 currTab.find("input[name='affect_other_system_describe']").removeAttr("validate");
	    		 currTab.find("input[name='affect_other_system_describe']").next().hide();
	    		 currTab.find("input[name='affect_other_system_describe']").attr("disabled","disabled");
	    	 }
	    	 else{
	    		 currTab.find("input[name='" + k + "']:first").attr("checked","true"); 
	    		 //currTab.find("input[name='affect_other_system_describe']").attr("validate","v.required");
	    	 }
	    	
	     }
	     else  if(k=="affect_other_system_describe"){
	    	 currTab.find("input[name='" + k + "']").val(str);
	     }
	     else  if(k=="change_system_fuction"){
	    	 if(str=="0"){
	    		 currTab.find("input[name='" + k + "']:last").attr("checked","true");
	    		 currTab.find("input[name='change_system_fuction_describe']").removeAttr("validate");
	    		 currTab.find("input[name='change_system_fuction_describe']").next().hide();
	    		 currTab.find("input[name='change_system_fuction_describe']").attr("disabled","disabled");
	    	 }
	    	 else{
	    		 currTab.find("input[name='" + k + "']:first").attr("checked","true"); 
	    		 //currTab.find("input[name='change_system_fuction_describe']").attr("validate","v.required");
	    		 
	    	 }
	     }
	     else  if(k=="change_system_fuction_describe"){
	    	 currTab.find("input[name='" + k + "']").val(str);
	     }
	     else  if(k=="change_data_structure"){
	    	 if(str=="0"){
	    		 currTab.find("input[name='" + k + "']:last").attr("checked","true");
	    		 currTab.find("input[name='change_data_structure_describe']").removeAttr("validate");
	    		 currTab.find("input[name='change_data_structure_describe']").next().hide();
	    		 currTab.find("input[name='change_data_structure_describe']").attr("disabled","disabled");
	    	 }
	    	 else{
	    		 currTab.find("input[name='" + k + "']:first").attr("checked","true"); 
	    		 //currTab.find("input[name='change_data_structure_describe']").attr("validate","v.required");
	    		 
	    	 }
	     }
	     else  if(k=="change_data_structure_describe"){
	    	 currTab.find("input[name='" + k + "']").val(str);
	     }
	     else  if(k=="update_system_file"){
	    	 if(str=="0"){
	    		 currTab.find("input[name='" + k + "']:last").attr("checked","true");
	    		 currTab.find("input[name='update_system_file_describe']").removeAttr("validate");
	    		 currTab.find("input[name='update_system_file_describe']").next().hide();
	    		 currTab.find("input[name='update_system_file_describe']").attr("disabled","disabled");
	    	 }
	    	 else{
	    		 currTab.find("input[name='" + k + "']:first").attr("checked","true"); 
	    		 //currTab.find("input[name='update_system_file_describe']").attr("validate","v.required");
	    		 
	    	 }
	     }
	     else  if(k=="update_system_file_describe"){
	    	 currTab.find("input[name='" + k + "']").val(str);
	     }
	     else  if(k=="emreq_solution"){
	    	 currTab.find("textarea[name='" + k + "']").val(str);
	     }
	     else  if(k=="emreq_test_suggest"){
	    	 currTab.find("textarea[name='" + k + "']").val(str);
	     }
	     else{
			currTab.find("div[name='" + k + "']").text(str);
			}
		}
		//当需求状态不是需求审批退回时隐藏审批记录
	 	if(data['REQ_STATE']!="09"){
	 		getCurrentPageObj().find('#appli').hide();//隐藏审批记录说明tab
	 		getCurrentPageObj().find('#approve_record').hide();//隐藏审批记录内容
	 	}
	 	if(data['REQ_STATE']=="09"){
			//初始化流程数据
			initTitle(data["INSTANCE_ID"]);
			initAFApprovalInfo(data["INSTANCE_ID"],'0');
		}else{
			//关闭按钮
			$('#pop_tversionSearch').css("display","none");
		}
	 	
		//初始化附件列表
		initVlidate($("#emReq_analysisForm"));
		var tablefile = getCurrentPageObj().find("#emReqAnalysis_filetable");
		getSvnFileList(tablefile, getCurrentPageObj().find("#emreqAnalysis_fileview_modal"), data.FILE_ID, "0101");
	},emreqdetailCall);
}
//初始化按钮
function initRequirementEmAddBtn() {
	
	//需求分析岗
	getCurrentPageObj().find('#EMAreq_analysis_name').click(function(){
		openRoleUserPop("emreqAccUserPop",{no:getCurrentPageObj().find('#EMAreq_analysis'),name:getCurrentPageObj().find('#EMAreq_analysis_name')},"0027");
	});

	getCurrentPageObj().find('input[name=affect_other_system]').bind('change',function(){
		var val=getCurrentPageObj().find('input[name=affect_other_system]:checked').val();
		if(val=="0"){
			getCurrentPageObj().find('input[name=affect_other_system_describe]').val("");
			getCurrentPageObj().find('input[name=affect_other_system_describe]').removeAttr("validate");
			getCurrentPageObj().find('input[name=affect_other_system_describe]').next().hide();
			initVlidate($("#emReq_analysisForm"));
			getCurrentPageObj().find('input[name=affect_other_system_describe]').attr("disabled","disabled");
		}
		else{
			getCurrentPageObj().find('input[name=affect_other_system_describe]').removeAttr("disabled");
			getCurrentPageObj().find('input[name=affect_other_system_describe]').attr("validate","v.required");
			initVlidate($("#emReq_analysisForm"));
			
		}
		
	});
	getCurrentPageObj().find('input[name=change_system_fuction]').bind('change',function(){
		
		var val=getCurrentPageObj().find('input[name=change_system_fuction]:checked').val();
		if(val=="0"){
			getCurrentPageObj().find('input[name=change_system_fuction_describe]').val("");
			getCurrentPageObj().find('input[name=change_system_fuction_describe]').removeAttr("validate");
			getCurrentPageObj().find('input[name=change_system_fuction_describe]').next().hide();
			initVlidate($("#emReq_analysisForm"));
			getCurrentPageObj().find('input[name=change_system_fuction_describe]').attr("disabled","disabled");
		}
		else{
			getCurrentPageObj().find('input[name=change_system_fuction_describe]').removeAttr("disabled");
			getCurrentPageObj().find('input[name=change_system_fuction_describe]').attr("validate","v.required");
			initVlidate($("#emReq_analysisForm"));
		}
		
	});
	getCurrentPageObj().find('input[name=change_data_structure]').bind('change',function(){
		
		var val=getCurrentPageObj().find('input[name=change_data_structure]:checked').val();
		if(val=="0"){
			getCurrentPageObj().find('input[name=change_data_structure_describe]').val("");
			getCurrentPageObj().find('input[name=change_data_structure_describe]').removeAttr("validate");
			getCurrentPageObj().find('input[name=change_data_structure_describe]').next().hide();
			initVlidate($("#emReq_analysisForm"));
			getCurrentPageObj().find('input[name=change_data_structure_describe]').attr("disabled","disabled");
		}
		else{
			getCurrentPageObj().find('input[name=change_data_structure_describe]').removeAttr("disabled");
			getCurrentPageObj().find('input[name=change_data_structure_describe]').attr("validate","v.required");
			initVlidate($("#emReq_analysisForm"));
		}
		
	});
	getCurrentPageObj().find('input[name=update_system_file]').bind('change',function(){
		
		var val=getCurrentPageObj().find('input[name=update_system_file]:checked').val();
		if(val=="0"){
			getCurrentPageObj().find('input[name=update_system_file_describe]').val("");
			getCurrentPageObj().find('input[name=update_system_file_describe]').removeAttr("validate");
			getCurrentPageObj().find('input[name=update_system_file_describe]').next().hide();
			initVlidate($("#emReq_analysisForm"));
			getCurrentPageObj().find('input[name=update_system_file_describe]').attr("disabled","disabled");
		}
		else{
			getCurrentPageObj().find('input[name=update_system_file_describe]').removeAttr("disabled");
			getCurrentPageObj().find('input[name=update_system_file_describe]').attr("validate","v.required");
			initVlidate($("#emReq_analysisForm"));
		}
		
	});
//保存并提交
getCurrentPageObj().find('#saveSubmit_emReqAnalysis').click(function(){
	if(!vlidate($("#emReq_analysisForm"),"",true)){
		return ;
	}
	
	var affect_other_system_describe=getCurrentPageObj().find("#affect_other_system_describe").val();
    if(affect_other_system_describe.length>25){
    	alert("影响其他系统描述至多可输入25汉字！");
    	return;
    }
    var change_system_fuction_describe=getCurrentPageObj().find("#change_system_fuction_describe").val();
    if(change_system_fuction_describe.length>25){
    	alert("改变当前系统的功能描述至多可输入25汉字！");
    	return;
    }
    var change_data_structure_describe=getCurrentPageObj().find("#change_data_structure_describe").val();
    if(change_data_structure_describe.length>25){
    	alert("对原有数据结构进行调整描述至多可输入25汉字！");
    	return;
    }
    var update_system_file_describe=getCurrentPageObj().find("#update_system_file_describe").val();
    if(update_system_file_describe.length>25){
    	alert("系统文档更新描述至多可输入25汉字！");
    	return;
    }
    var emreq_solution=getCurrentPageObj().find("#emreq_solution").val();
    if(emreq_solution.length>500){
    	alert("解决方案至多可输入500汉字！");
    	return;
    }
    var emreq_test_suggest=getCurrentPageObj().find("#emreq_test_suggest").val();
    if(emreq_test_suggest.length>500){
    	alert("测试建议至多可输入500汉字！");
    	return;
    }
	
	 var req_id=getCurrentPageObj().find("#emreqanaly_req_id").val();
	   var item = {};
	  item["af_id"] = '121';//流程id
	  item["systemFlag"] = '03'; //systemFlag：系统标识（合同系统：00，项目系统：01，报销系统：02，工程管理：03）
	  item["biz_id"] = req_id;//业务id
	  item["n_orgmanager"] = $("#currentLoginNoOrg_no").val();
	  item["n_org_gao"] = "110110";//运行管理中心id
	  item["r_project_group"] =  getCurrentPageObj().find("#emreqanaly_res_group_id").val();//应用负责组id
	  //获取页面输入的值
	  //调用发起流程的函数
	  approvalProcess(item,function(data){
	  var emReqanalysisForm=currTab.find("#emReq_analysisForm");
	  var params=emReqanalysisForm.serialize()+"&p_owner="+SID+"&req_state=07&req_evaluate_state=01";
	  baseAjaxProxyConstruction("requirement_accept/summitEmReqForApprove.asp", params , function(data) {
			if (data != undefined && data != null && data.result=="true") {
				alert("提交成功");
				closeCurrPageTab();
			}else{
				var mess=data.mess;
				alert("保存失败:"+mess);
			}
		}); });
});
	
//保存
getCurrentPageObj().find('#save_emReqAnalysis').click(function(){
	if(!vlidate($("#emReq_analysisForm"),"",true)){
		return ;
	}
	
	var affect_other_system_describe=getCurrentPageObj().find("#affect_other_system_describe").val();
    if(affect_other_system_describe.length>25){
    	alert("影响其他系统描述至多可输入25汉字！");
    	return;
    }
    var change_system_fuction_describe=getCurrentPageObj().find("#change_system_fuction_describe").val();
    if(change_system_fuction_describe.length>25){
    	alert("改变当前系统的功能描述至多可输入25汉字！");
    	return;
    }
    var change_data_structure_describe=getCurrentPageObj().find("#change_data_structure_describe").val();
    if(change_data_structure_describe.length>25){
    	alert("对原有数据结构进行调整描述至多可输入25汉字！");
    	return;
    }
    var update_system_file_describe=getCurrentPageObj().find("#update_system_file_describe").val();
    if(update_system_file_describe.length>25){
    	alert("系统文档更新描述至多可输入25汉字！");
    	return;
    }
    var emreq_solution=getCurrentPageObj().find("#emreq_solution").val();
    if(emreq_solution.length>500){
    	alert("解决方案至多可输入500汉字！");
    	return;
    }
    var emreq_test_suggest=getCurrentPageObj().find("#emreq_test_suggest").val();
    if(emreq_test_suggest.length>500){
    	alert("测试建议至多可输入500汉字！");
    	return;
    }
	
	  //获取页面输入的值
	  var emReqsaveForm=currTab.find("#emReq_analysisForm");
	  var param=emReqsaveForm .serialize();
	  baseAjaxProxyConstruction("requirement_accept/summitEmReqForApprove.asp",param,function(data) {
			if (data != undefined && data != null && data.result=="true") {
				alert("保存成功");
				closeCurrPageTab();
			}else{
				var mess=data.mess;
				alert("保存失败:"+mess);
			}
		}); 
	  
	  /*baseAjaxJsonp(dev_construction+"requirement_accept/summitEmReqForApprove.asp?SID="+SID+"&p_owner="+SID+"&req_state=04", param , function(data) {
			if (data != undefined && data != null && data.result=="true") {
				alert("保存成功");
				closeCurrPageTab();
			}else{
				var mess=data.mess;
				alert("保存失败:"+mess);
			}
		});*/
	 
       });

}

//关闭



currTab.find('#pop_tversionSearch').click(function(){
	var ids=getCurrentPageObj().find("#emreqanaly_req_id").val();
	nconfirm("是否确定关闭？",function(){
			baseAjaxJsonp(dev_construction+"requirement_input/closeRequirementInfo.asp?SID="+SID+"&req_id="+ids, null , function(data) {
				   if(data!=null&&data!=""&&data.result=="true"){
					   alert("关闭成功!");
					   closeCurrPageTab();
				    }else{
					   alert("关闭失败！");
					   return;
				    }
				 });
			
	});
	
});
