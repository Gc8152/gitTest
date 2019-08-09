var oplaPage = getCurrentPageObj();
function initOpLeaveApply(op_id,purchatype){
	if(purchatype=="01"){ //非项目
		getCurrentPageObj().find("#out_opInfo_table").find("tr:eq(3)").find("td:eq(6)").hide();
		getCurrentPageObj().find("#out_opInfo_table").find("tr:eq(3)").find("td:eq(7)").hide();
	}else{
		getCurrentPageObj().find("#out_opInfo_table").find("tr:eq(3)").find("td:eq(2)").hide();
		getCurrentPageObj().find("#out_opInfo_table").find("tr:eq(3)").find("td:eq(3)").hide();
		getCurrentPageObj().find("#out_opInfo_table").find("tr:eq(3)").find("td:eq(6)").show();
		getCurrentPageObj().find("#out_opInfo_table").find("tr:eq(3)").find("td:eq(7)").show();
		getCurrentPageObj().find("#out_opInfo_table").find("tr:eq(4)").hide();
		getCurrentPageObj().find("#out_opInfo_table").find("tr:eq(4)").hide();
	}
	oplaPage.find("#OPLA_op_id").val(op_id);
	oplaPage.find("#OPLA_level_memo").html("无");
	oplaPage.find("#OPLA_purch_type").val(purchatype);
	initOpInfo(op_id);
	initEpaMessage(op_id,purchatype,null,function(item){
		oplaPage.find("#OPLA_coe_id").val(item["COE_ID"]||"");
		oplaPage.find("#OPLA_idcard_no").val(item["IDCARD_NO"]||"");
		oplaPage.find("#OPLA_leave_reason").val(item["LEAVE_REASON"]||"");
		oplaPage.find("#OPLA_actully_leavetime").val(item["ACTULLY_LEAVETIME"]||"");
		oplaPage.find("#OPLA_op_supoffice_manager").val(item["OP_SUPOFFICE_MANAGER"]||"");
		oplaPage.find("#OPLA_op_office_manager").val(item["OP_OFFICE_MANAGER"]|"");
	});
//	var call=getMillisecond();
//	baseAjaxJsonp(dev_outsource+"outperson/findEpaMessage.asp",{"op_id":op_id,SID:SID,"call":call,"purch_type":purchatype},function(data){
//		if(data!=null&&data.result!=null&&data.result=="true"){
//			var item = data.rows;
//			for(var k in item){
//				var k1 = k.toLowerCase();
//				if(k1=="actully_leavetime" || k1=="coe_id"){
//					oplaPage.find("#OPLA_"+k1).val(item[k]);
//				}else if(k1=="out_resume"){
//					if(item[k]&&$.trim(item[k])!=""){
//						oplaPage.find("#OPLA_out_resume_file").val(item[k]);
//						findFileInfo(item[k],function(data){
//							if(data.rows.length>0){
//								defaultShowFileInfo(item[k],oplaPage.find("#OPLA_out_resume_file").parent(),data,false,"outResumeFileDivL");
//							}
//						});
//	   				}
//				}else if(k1 == "fingerprint_in"||k1 == "device_reveive"||k1 == "email_open"||k1 == "testeamil_open"||k1 == "innernetwork_open"||k1 == "agency_internet_open"||k1 == "rtx_open"
//					||k1 == "synergy_open"||k1 == "svn_open"||k1 == "qc_open"){
//					oplaPage.find("input[name='OPLA."+k1+"']").parent("span").removeClass("checkd");
//					oplaPage.find("input[name='OPLA."+k1+"'][value="+item[k]+"]").attr("checked",true);
//				  	oplaPage.find("input[name='OPLA."+k1+"'][value="+item[k]+"]").parent("span").addClass("checkd");
//				}else{
//					oplaPage.find("#OPLA_"+k1).html(item[k]);
//				}
//			}
//			oplaPage.find("#OPLA_op_supoffice_manager").val(item["OP_SUPOFFICE_MANAGER"]);
//			oplaPage.find("#OPLA_op_office_manager").val(item["OP_OFFICE_MANAGER"]);
//			oplaPage.find("#OPLA_op_id").val(item["OP_ID"]);
//		}
//	},call);
	initVlidate(oplaPage);
}

//保存
function saveAndSubmitLaFunction(status){
	if(!vlidate(oplaPage)){
		return;
	}
	if(status == "save"){
		saveAndSubmitToLeaveApp(status);
	}else{
		nconfirm("确定提交离场吗？",function(){
			var items = {};
			items["af_id"] = '181';//流程id
			items["systemFlag"] = '04'; //systemFlag：系统标识（合同系统：00，项目系统：01，报销系统：02，工程管理：03 外包管理：04）
			items["group_manager_project"] = oplaPage.find("#OPLA_op_office_manager").val();//项目组长
			items["core_manager"] = oplaPage.find("#OPLA_op_supoffice_manager").val();//中心负责人 
			//items["biz_id"] = oplaPage.find("#OPLA_op_id").val();//业务id
			items["biz_id"] = oplaPage.find("#OPLA_idcard_no").val();//身份证号作为业务id
			approvalProcess(items,function(data){
				saveAndSubmitToLeaveApp(status);
			});
		});
	}
}
/**
 * 保存或者提交到离场审批
 * @param status
 */
function  saveAndSubmitToLeaveApp(status){
	var call=getMillisecond();
	var params = {call:call,SID:SID};
	params["idcard_no"]=oplaPage.find("#OPLA_idcard_no").val();
	params["id"]=oplaPage.find("#OPLA_coe_id").val();
	if(status != "save"){
		params["op_id"]=oplaPage.find("#OPLA_op_id").val();
	}
	params["actully_leavetime"]=oplaPage.find("#OPLA_actully_leavetime").val();
	params["leave_reason"]=oplaPage.find("textarea[name='OPLA.leave_reason']").val();
	baseAjaxJsonp(dev_outsource+"outperson/saveLaMessage.asp",params,function(data){
		if(data!=null&&data.result!=null&&data.result=="true"){
			if(status == "save"){
				alert("保存成功");
				closeCurrPageTab();
			}else{
				alert("提交成功");
				closeCurrPageTab();
			}
		}else{
			if(status == "save"){
				alert("保存失败");
			}else{
				alert("提交失败");
			}
		}
	},call);
}

//提交申请[暂时停用该方法]
function submitLeaveApply(op_id,purch_type){
	var OP_IDs = new Array();
	OP_IDs.push(op_id);
	nconfirm("确定需要发起离场申请么？",function(){
		var call=getMillisecond();
		baseAjaxJsonp(dev_outsource+"outperson/applyOutPersonleave.asp",{call:call,SID:SID,"op_id":OP_IDs.join(","),"purch_type":purch_type,"requestWay":"batch"},function(data){
			if(data!=null&&data.result!=null&&data.result=="true"){
				alert("离场申请成功");
				closeCurrPageTab();
				getCurrentPageObj().find("#outpersonTableInfo").bootstrapTable("refresh");
			}else{
				alert("申请失败");
				closeCurrPageTab();
			}
		},call);
	});
}
