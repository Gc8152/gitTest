var etaPage = getCurrentPageObj();
/**
 * 给元素设置value值
 * @param elem
 * @param val
 */
function elemSetVal(elemJq,val){
	try{
		elemJq.val(val);
	}catch(e){
	}
}

function initOpEntranceApply(op_id,purchatype){
	initOpInfo(op_id);
	/*if(purchatype=="01"){ //非项目
		getCurrentPageObj().find("#en_opInfo_table").find("tr:eq(3)").find("td:eq(6)").hide();
		getCurrentPageObj().find("#en_opInfo_table").find("tr:eq(3)").find("td:eq(7)").hide();
	}else{
		getCurrentPageObj().find("#en_opInfo_table").find("tr:eq(3)").find("td:eq(2)").hide();
		getCurrentPageObj().find("#en_opInfo_table").find("tr:eq(3)").find("td:eq(3)").hide();
		getCurrentPageObj().find("#en_opInfo_table").find("tr:eq(3)").find("td:eq(6)").show();
		getCurrentPageObj().find("#en_opInfo_table").find("tr:eq(3)").find("td:eq(7)").show();
		getCurrentPageObj().find("#en_opInfo_table").find("tr:eq(4)").hide();
		getCurrentPageObj().find("#en_opInfo_table").find("tr:eq(4)").hide();
	}*/
	etaPage.find("#ETA_op_id").val(op_id);
	etaPage.find("#ETA_purch_type").val(purchatype);
	etaPage.find("#ETA_level_memo").html("无");
	
	initEpaMessage(op_id,purchatype,function(data){
		if(data!=null&&data.result!=null&&data.result=="true"){
			var item = data.rows;
			for(var k in item){
				var k1 = k.toLowerCase();
				if(k1=="p_station"||k1=="entrance_time" || k1=="plan_leave_time" || k1=="coe_id"){
					elemSetVal(etaPage.find("#ETA_"+k1),item[k]);
				}else if(k1=="out_resume"){
					if(item[k]&&$.trim(item[k])!=""){
						elemSetVal(etaPage.find("#ETA_out_resume_file"),item[k]);
						findFileInfo(item[k],function(data){
							if(data.rows.length>0){
								defaultShowFileInfo(item[k],etaPage.find("#ETA_out_resume").parent(),data,true,"outResumeFileDiv");
							}
						});
	   				}
				}else if(k1=="idcard_no"||k1 == "fingerprint_in"||k1 == "device_reveive"||k1 == "email_open"||k1 == "testeamil_open"||k1 == "innernetwork_open"||k1 == "agency_internet_open"||k1 == "rtx_open"
					||k1 == "synergy_open"||k1 == "svn_open"||k1 == "qc_open"){
					etaPage.find("input[name='ETA."+k1+"']").parent("span").removeClass("checkd");
					etaPage.find("input[name='ETA."+k1+"'][value="+item[k]+"]").attr("checked",true);
				  	etaPage.find("input[name='ETA."+k1+"'][value="+item[k]+"]").parent("span").addClass("checkd");
				}else{
					var elem=etaPage.find("#ETA_"+k1);
					if(elem&&elem.length){
						if(elem[0].nodeName=="INPUT"){
							elem.val(item[k]);
						}else{
							elem.html(item[k]);
						}
					}
				}
			}
		}
	},function(data){
		elemSetVal(etaPage.find("#ETA_op_supoffice_manager"),data["OP_SUPOFFICE_MANAGER"]);
		elemSetVal(etaPage.find("#ETA_op_office_manager"),data["OP_OFFICE_MANAGER"]);
	});
	initVlidate(etaPage);
	/**
	 * 附件上传;
	 */
	var file_id = etaPage.find("#ETA_out_resume_file").val();
	if(""==$.trim(file_id)){
		etaPage.find("#ETA_out_resume_file").val(Math.uuid());
	}
	etaPage.find("#ETA_out_resume").click(function(){
		openFileUploadInfo('outResumeFile','OUT_RESUME',etaPage.find("#ETA_out_resume_file").val(),function(data){
			defaultShowFileInfo(etaPage.find("#ETA_out_resume_file").val(),etaPage.find("#ETA_out_resume").parent(),data,true,"outResumeFileDiv");
		});
	});
}
//保存
function saveAndSubmitEtaFunction(status){
	if(!vlidate(etaPage)){
		return;
	}
	var filediv = getCurrentPageObj().find("div[class='fileInfo']");
	if(status=="save"){
		saveAndSubmit(status);
	}else{
		if(filediv.length < 1){
			alert("请上传简历");
			return;
		}
		nconfirm("确定提交入场吗？",function(){
			var items = {};
			items["af_id"] = '181';//流程id
			items["systemFlag"] = '04'; //systemFlag：系统标识（合同系统：00，项目系统：01，报销系统：02，工程管理：03）
			items["group_manager_project"] = etaPage.find("#ETA_op_office_manager").val();//项目组长
			items["core_manager"] = etaPage.find("#ETA_op_supoffice_manager").val();//中心负责人 
			//items["biz_id"] = etaPage.find("#ETA_op_id").val();//业务id
			items["biz_id"] = etaPage.find("#ETA_idcard_no").val();//身份证号作为业务id
			approvalProcess(items,function(data){
				saveAndSubmit(status);
			});
		});
	}
}

function saveAndSubmit(status){
	var params = {};
	params["out_resume"]=etaPage.find("#ETA_out_resume_file").val();
	params["idcard_no"]=etaPage.find("#ETA_idcard_no").val();
	params["id"]=etaPage.find("#ETA_coe_id").val();
	params["entrance_time"]=etaPage.find("#ETA_entrance_time").val();
	params["plan_leave_time"]=etaPage.find("#ETA_plan_leave_time").val();
	params["entrance_reason"]=etaPage.find("#ETA_entrance_reason").val();
	params["p_station"]=etaPage.find("#ETA_p_station").val();
	if(status!="save"){
		params["op_id"]=getCurrentPageObj().find("#ETA_op_id").val();
	}
	var vals=etaPage.find("input[type='radio']:checked");
	for(var i=0;i<vals.length;i++){
		var val=$(vals[i]);
		if($.trim(val.val())!=""){
			params[val.attr("name").substr(4)]=val.val();
		}
	}
	var  call = getMillisecond();
	baseAjaxJsonp(dev_outsource+'outperson/saveEtaMessage.asp?call='+call+'&SID='+SID,params,function(data){
		if(data!=null&&data.result!=null&&data.result=="true"){
			if(status == "save"){
				alert("保存成功");
				closeCurrPageTab();
			}else{
				alert("提交成功");
				closeCurrPageTab();
//				submitEntranceApply(etaPage.find("#ETA_op_id").val(),etaPage.find("#ETA_purch_type").val());
			}
		}
	},call);
}
//提交申请
function submitEntranceApply(op_id,purch_type){
	var OP_IDs = new Array();
	OP_IDs.push(op_id);
	var  call = getMillisecond();
	nconfirm("确定需要发起入场申请么？",function(){//requestWay":"batch 批量
		baseAjaxJsonp(dev_outsource+'outperson/applyOutPersonEntrance.asp?call='+call+'&SID='+SID,{"op_id":OP_IDs.join(","),"purch_type":purch_type,"requestWay":"batch"},function(data){
			if(data!=null&&data.result!=null&&data.result=="true"){
				alert("提交成功请到OA系统发起审批流程");
				closeCurrPageTab();
			}else{
				alert("申请失败");
				closeCurrPageTab();
			}
		});
	});
}