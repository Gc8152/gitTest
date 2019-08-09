
//页面生成需求id，用于马上提交和文件上传
function initReqEmId(){
	var id="101017";
	var name="科技信息中心";
	getCurrentPageObj().find("input[id=req_put_dept_reqEmAdd]").val(id);
	getCurrentPageObj().find("input[id=req_Put_dept_name]").val(name);
	 baseAjaxJsonp(dev_construction+"requirement_input/getSequenceForAddEmRequirement.asp?SID="+SID, null , function(data) {
			if (data != undefined && data != null && data.result=="true") {
				getCurrentPageObj().find('#req_id_reqEmAdd').val(data.req_id);
			}else{
				var mess=data.mess;
				alert("页面初始生成需求id失败:"+mess);
			}
		});
	 /**初始化按钮结束**/
	 //附件上传
	 var tablefile = getCurrentPageObj().find("#reqemadd_filetable");
	 var business_code = "";
	 business_code = getCurrentPageObj().find("#file_id_reqEmAdd").val();
	 
	 if(business_code==undefined || business_code=="" || business_code==null){
		 business_code = Math.uuid();
		 getCurrentPageObj().find("#file_id_reqEmAdd").val(business_code);
	 }

	 //点击打开模态框
	 var addemfile = getCurrentPageObj().find("#reqemadd_file");
	 addemfile.click(function(){
		 var paramObj = new Object();
		 paramObj.FILE_DIR = business_code;
		 openFileSvnUpload(getCurrentPageObj().find("#reqemadd_modalfile"), tablefile, 'GZ1076',business_code, '0101', 'S_DIC_EMREQ_PUT_FILE', false,false, paramObj);
	 });

	 //附件删除
	 var delete_file = getCurrentPageObj().find("#reqemdelete_file");
	 delete_file.click(function(){
		 delSvnFile(tablefile, business_code, "0101");
	 });
	 
	 getSvnFileList(tablefile, getCurrentPageObj().find("#reqemadd_fileview_modal"), business_code, "0101");
}

//获取页面输入的值
function getReqAppPageValue(){
	if(!vlidate($("#gRequirementInfo_add"),"",true)){
		 alert("请按要求填写图表中的必填项！");
		return ;
	}
	 var inputs = getCurrentPageObj().find("input:text[name^='REA.']");
	 var hiddens = getCurrentPageObj().find("input:hidden[name^='REA.']");
	 var selects =getCurrentPageObj().find("select[name^='REA.']");
	 var radios = getCurrentPageObj().find("input:radio[name^='REA.']:checked");
	 var textareas = getCurrentPageObj().find("textarea[name^='REA.']");
	 var params = {};
	//取值
		for(var i=0;i<inputs.length;i++){
			params[$(inputs[i]).attr("name").substr(4)] = $(inputs[i]).val();	 
		}
		
		for(var i=0;i<hiddens.length;i++){
			params[$(hiddens[i]).attr("name").substr(4)] = $(hiddens[i]).val();	 
		}
		
		for(var i=0;i<selects.length;i++){
			params[$(selects[i]).attr("name").substr(4)] = $(selects[i]).val(); 
		}
		
		for(var i=0;i<radios.length;i++){
			params[$(radios[i]).attr("name").substr(4)] = $(radios[i]).val();
		}
		
		for(var i=0;i<textareas.length;i++){
			params[$(textareas[i]).attr("name").substr(4)] = $(textareas[i]).val();
		}
		
		var req_id=getCurrentPageObj().find('#req_id_reqEmAdd').val();
		if(req_id==null||req_id==""){
			alert("页面获取需求id失败");
			
		}
	    return params;
	
}

//初始化按钮
function initRequirementEmAddBtn() {
	//加载产品经理pop框
//	getCurrentPageObj().find('#req_product_managerEm').click(function(){
//		openRoleUserPop("EmchoseManager_pop",{no:getCurrentPageObj().find('#req_product_managerE'),name:getCurrentPageObj().find('#req_product_managerEm')},"0017");
//	});
	//应用pop
	getCurrentPageObj().find('#req_system_name_reqEmAdd').click(function(){
		openTaskSystemPopByKeJi("emreq_system_pop",{sysno:getCurrentPageObj().find('#req_system_id_reqEmAdd'),sysname:getCurrentPageObj().find('#req_system_name_reqEmAdd')});
	 });
//保存新增
getCurrentPageObj().find('#save_emgRequirementInfo').click(function(){
	if(!vlidate($("#gRequirementInfo_emergentAdd"),"",true)){
		alert("您还有必填项没有填写！");
		return ;
	}
	 /*var filedata = getCurrentPageObj().find("#reqemadd_filetable").bootstrapTable("getData");
	  if(filedata==""||filedata==undefined){
		  alert("该需求还未上传需求申请书！");
		  return;
	  }*/
	  
	  //获取页面输入的值
	  var params=getReqAppPageValue();
	  
	  var req_name_reqEmAdd=getCurrentPageObj().find("#req_name_reqEmAdd").val();
	    if(req_name_reqEmAdd.length>100){
	    	alert("需求名称至多可输入100汉字！");
	    	return;
	    }
	    var req_emupline_reason_reqAdd=getCurrentPageObj().find("#req_emupline_reason_reqAdd").val();
	    if(req_emupline_reason_reqAdd.length>200){
	    	alert("需求收益评估至多可输入200汉字！");
	    	return;
	    }
	  

	 baseAjaxJsonp(dev_construction+"requirement_input/insertEmRequirementInfo.asp?SID="+SID+"&req_state=01", params , function(data) {
			if (data != undefined && data != null && data.result=="true") {
				alert("保存成功");
				//closePageTab("emergentAddRequirement");
				closeCurrPageTab();
			}else{
				var mess=data.mess;
				alert("保存失败:"+mess);
			}
		});
});
	
//保存并提交
getCurrentPageObj().find('#submit_emgRequirementInfo').click(function(){
	if(!vlidate($("#gRequirementInfo_emergentAdd"),"",true)){
		alert("请按要求填写图表中的必填项！");
		return ;
	}
	/* var filedata = getCurrentPageObj().find("#reqemadd_filetable").bootstrapTable("getData");
	  if(filedata==""||filedata==undefined){
		  alert("该需求还未上传需求申请书！");
		  return;
	  }*/
	  var req_name_reqEmAdd=getCurrentPageObj().find("#req_name_reqEmAdd").val();
	  if(req_name_reqEmAdd.length>100){
		  alert("需求名称至多可输入100汉字！");
    	  return;
	  }
	  var req_emupline_reason_reqAdd=getCurrentPageObj().find("#req_emupline_reason_reqAdd").val();
	  if(req_emupline_reason_reqAdd.length>200){
		  alert("需求收益评估至多可输入200汉字！");
		  return;
	  }
	 var filedata = getCurrentPageObj().find("#reqemadd_filetable").bootstrapTable("getData");
	 var str="确定要提交该需求吗？";
	 if(filedata==""||filedata==undefined){
		 str="您还未上传《需求申请书》确定要提交该需求吗？";
	 }
	  nconfirm(str,function(){
		 //获取页面输入的值
		  var params=getReqAppPageValue();
		  baseAjaxJsonp(dev_construction+"requirement_input/insertEmRequirementInfo.asp?SID="+SID+"&req_state=04", params , function(data) {
				if (data != undefined && data != null && data.result=="true") {
						if (data != undefined && data != null && data.result=="true"){
							//alert("保存并提交成功");
							//closePageTab("emergentAddRequirement");
							closeCurrPageTab();
							closeAndOpenInnerPageTab("requirement_assess","紧急需求评估","dev_construction/requirement/requirement_accept/emRequiremnetAnalysis_analysis.html",function(){
								initEmReqAnalysisLayout(params["req_id"]);
								initRequirementEmAddBtn();
							});
						}else{
							alert("保存提交失败");
						}
				    }
				});
	  },function(){});
   });

//保存并提交审批
getCurrentPageObj().find('#submit_gRequAppover').click(function(){
	if(!vlidate($("#gRequirementInfo_add"),"",true)){
		 alert("请按要求填写图表中的必填项！");
		return ;
	}
	 //获取页面输入的值
	  var params=getReqAppPageValue();
	  var req_id=getCurrentPageObj().find('#req_id_reqAdd').val();
	  params["input_state"] = "011";//需求审批中
	  baseAjaxJsonp(dev_construction+"requirement_input/insertRequirementInfo.asp?SID="+SID, params , function(data) {
			if (data != undefined && data != null && data.result=="true") {
				//处理流程发起？？？？
				var org = $('#req_countersign_dept_reqAdd').val();
				var dept_put = $("#req_put_dept_reqAdd").val();
				approvalProcess({af_id:"61",systemFlag:"requirement_assess",biz_id:req_id,req_state:"req_input",orgs:org,dept_put:dept_put});
				closePageTab("addRequirement");	
			}else{
				var mess=data.mess;
				alert("保存失败:"+mess);
			}
		});
});}
//加载部门
function initReqEmAddOrg(){
	//提出部门		
	/*getCurrentPageObj().find("#req_Put_dept_name").click(function(){
		getCurrentPageObj().find(".drop-ztree").hide();
			openSelectTreeDiv($(this),"reqPutAdd_tree_id","SOrg/queryOrgTreeWithCenterList.asp",{"margin-top": "2px",width:"88%"},function(node){
				getCurrentPageObj().find("#req_Put_dept_name").val(node.name);
				getCurrentPageObj().find("#req_put_dept_reqEmAdd").val(node.id);
				getCurrentPageObj().find("#reqPutAdd_tree_id").hide();
			});
		});*/


	}

//页面生成需求id，用于马上提交和文件上传
function initReqEmFile(){
	 /**初始化按钮结束**/
	 //附件上传
	 var tablefile = getCurrentPageObj().find("#reqemadd_filetable");
	 var business_code = "";
	 business_code = getCurrentPageObj().find("#file_id_reqEmAdd").val();
	 
	 if(business_code==undefined || business_code=="" || business_code==null){
		 business_code = Math.uuid();
		 getCurrentPageObj().find("#file_id_reqEmAdd").val(business_code);
	 }

	 //点击打开模态框
	 var addemfile = getCurrentPageObj().find("#reqemadd_file");
	 addemfile.click(function(){
		 var paramObj = new Object();
		 paramObj.FILE_DIR = business_code;
		 openFileSvnUpload(getCurrentPageObj().find("#reqemadd_modalfile"), tablefile, 'GZ1063',business_code, '0101', 'S_DIC_REQ_PUT_FILE', false,false, paramObj);
	 });
	 
	 //附件删除
	 var delete_file = getCurrentPageObj().find("#reqemdelete_file");
	 delete_file.click(function(){
		 delSvnFile(tablefile, business_code, "0101");
	 });
	 
	 getSvnFileList(tablefile, getCurrentPageObj().find("#reqemadd_fileview_modal"), business_code, "0101");
}
function initEmReqUpdateLayout(ids){
	var emrequpdateCall=getMillisecond();
	baseAjaxJsonp(dev_construction+"requirement_input/queryEmRequirementInfoByID.asp?SID="+SID+"&req_id="+ids+"&call="+emrequpdateCall, null , function(data) {
		for ( var k in data) {
			var str=data[k];
			k = k.toLowerCase();//大写转换为小写
		 if(k=="req_product_manager_display"){
			getCurrentPageObj().find("[name='REA." + k + "']").val(str);
		}
		 else{
			getCurrentPageObj().find("[name='REA." + k + "']").val(str);}
		   
		}
		initReqEmFile();
		  initRequirementEmAddBtn();
		  initReqEmAddOrg();
	
	},emrequpdateCall);
}

