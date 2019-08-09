var currTab=getCurrentPageObj();
function initEmReqApprLayout(ids){
	var emreqdetailCall=getMillisecond();
	baseAjaxJsonp(dev_construction+"requirement_input/queryEmRequirementInfoByID.asp?SID="+SID+"&req_id="+ids+"&call="+emreqdetailCall, null , function(data) {
		for ( var k in data) {
			var str=data[k];
			k = k.toLowerCase();//大写转换为小写
	     if(k=="req_id"){
	    	 currTab.find("input[name='" + k + "']").val(str);
	     }
	     else if(k=="affect_other_system"){
	    	 if(str=="0"){
	    		 currTab.find("input[name='" + k + "']:last").attr("checked","true");
	    		 currTab.find("div[name='affect_other_system_describe']").attr("disabled","disabled");
	    	 }
	    	 else{
	    		 currTab.find("input[name='" + k + "']:first").attr("checked","true"); 
	    		 currTab.find("div[name='affect_other_system_describe']").attr("validate","v.required");
	    	 }
	    	
	     }
	     else  if(k=="affect_other_system_describe"){
	    	 currTab.find("div[name='" + k + "']").text(str);
	     }
	     else  if(k=="change_system_fuction"){
	    	 if(str=="0"){
	    		 currTab.find("input[name='" + k + "']:last").attr("checked","true");
	    		 currTab.find("div[name='change_system_fuction_describe']").attr("disabled","disabled");
	    	 }
	    	 else{
	    		 currTab.find("input[name='" + k + "']:first").attr("checked","true"); 
	    		 currTab.find("div[name='change_system_fuction_describe']").attr("validate","v.required");
	    		 
	    	 }
	     }
	     else  if(k=="change_system_fuction_describe"){
	    	 currTab.find("div[name='" + k + "']").text(str);
	     }
	     else  if(k=="change_data_structure"){
	    	 if(str=="0"){
	    		 currTab.find("input[name='" + k + "']:last").attr("checked","true");
	    		 currTab.find("div[name='change_data_structure_describe']").attr("disabled","disabled");
	    	 }
	    	 else{
	    		 currTab.find("input[name='" + k + "']:first").attr("checked","true"); 
	    		 currTab.find("div[name='change_data_structure_describe']").attr("validate","v.required");
	    		 
	    	 }
	     }
	     else  if(k=="change_data_structure_describe"){
	    	 currTab.find("div[name='" + k + "']").text(str);
	     }
	     else  if(k=="update_system_file"){
	    	 if(str=="0"){
	    		 currTab.find("input[name='" + k + "']:last").attr("checked","true");
	    		 currTab.find("div[name='update_system_file_describe']").attr("disabled","disabled");
	    	 }
	    	 else{
	    		 currTab.find("input[name='" + k + "']:first").attr("checked","true"); 
	    		 currTab.find("div[name='update_system_file_describe']").attr("validate","v.required");
	    		 
	    	 }
	     }
	     else  if(k=="update_system_file_describe"){
	    	 currTab.find("div[name='" + k + "']").text(str);
	     }
	     else  if(k=="emreq_solution"){
	    	 currTab.find("div[name='" + k + "']").text(str);
	     }
	     else  if(k=="emreq_test_suggest"){
	    	 currTab.find("div[name='" + k + "']").text(str);
	     }
	     else  if(k=="req_code"){
	    	 currTab.find("input[name='" + k + "']").val(str);
	     }
	     else  if(k=="req_acc_classify"){
	    	 currTab.find("input[name='" + k + "']").val(str);
	     }
	     else  if(k=="req_analysis"){
	    	 currTab.find("input[name='" + k + "']").val(str);
	     }
	     else  if(k=="create_person"){
	    	 currTab.find("input[name='" + k + "']").val(str);
	     }
	     else  if(k=="req_product_manager"){
	    	 currTab.find("input[name='" + k + "']").val(str);
	     }
	     else  if(k=="file_id"){
	    	 currTab.find("input[name='" + k + "']").val(str);
	     }
	     else{
			currTab.find("div[name='" + k + "']").text(str);
			}
		}
		//初始化审批视图
		initTitle(data["INSTANCE_ID"]);
		initAFApprovalInfo(data["INSTANCE_ID"]);
		//初始化附件列表
		initVlidate($("#emReq_analysisForm"));
		var tablefile = getCurrentPageObj().find("#emReqAnalysis_filetable");
		
		getSvnFileList(tablefile, getCurrentPageObj().find("#emreqAnalysis_fileview_modal"), data.FILE_ID, "0101");
	},emreqdetailCall);
}
//初始化按钮
function initReqEmApprBtn() {
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

}
function reqApproveOver(req_id,result){
    var approve_result=result;
    var param = new Object();
    param.system_name=getCurrentPageObj().find("#system_id_name").html();
    param.SID = SID;
    var fromBid1 = getCurrentPageObj().find("#emReqApprove_file_id").val();
    	param.fromBid = fromBid1;
    param.is_dic = true;
    /*******提醒参数*******/
    param.user_id = getCurrentPageObj().find("#emReqApprove_req_analysis").val()+","+getCurrentPageObj().find("#emReq_product_manager").val()+","+getCurrentPageObj().find("#emReq_create_person").val();
	param.b_code = req_id;
	param.b_id = req_id;
	if(approve_result=='01'){//01审批通过,02打回
		param.b_name =  getCurrentPageObj().find("#emReqAnalysis_req_name").text()+"需求审批通过";
	}else if(approve_result=='02'){
		param.b_name =  getCurrentPageObj().find("#emReqAnalysis_req_name").text()+"需求审批被打回";
	}
	var req_acc_classify=getCurrentPageObj().find('#emReqApprove_req_acc_classify').val();//获取需求类型
    baseAjaxJsonp(dev_construction+"requirement_accept/emReqApprove.asp?SID="+SID+"&req_id="+req_id+"&approve_result="+approve_result+"&req_acc_classify="+req_acc_classify, param , function(data) {
		if (data != undefined && data != null && data.result=="true") {
			alert("提交成功!", function(){
				if(approve_result=='01'){//01审批通过,02打回
					param.toBid=data.req_code;
					param.b_code=data.req_code;
					baseAjax("sfile/mvFTPFile.asp", param, function(result){
				    }, true);
				}
				closeCurrPageTab();
			});
		}else{
			alert("提交失败");
		}
	});
}
