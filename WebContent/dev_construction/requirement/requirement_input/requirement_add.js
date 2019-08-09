initReqId();
initRequirementDicCode();
initRequirementAddBtn();
initReqAddOrg();

//页面生成需求id，用于马上提交和文件上传
function initReqId(){
	 
	 baseAjaxJsonp(dev_construction+"requirement_input/getSequenceForAddRequirement.asp?SID="+SID, null , function(data) {
			if (data != undefined && data != null && data.result=="true") {
				getCurrentPageObj().find('#req_id_reqAdd').val(data.req_id);
			}else{
				var mess=data.mess;
				alert("页面初始生成需求id失败:"+mess);
			}
		});
	 /**初始化按钮结束**/
	 //附件上传
	 var tablefile = getCurrentPageObj().find("#reqadd_filetable");
	 var business_code = "";
	 business_code = getCurrentPageObj().find("#file_id_reqAdd").val();
	 if(typeof(business_code)!="undefined"){
		 business_code = Math.uuid();
		 getCurrentPageObj().find("#file_id_reqAdd").val(business_code);
	 }

	 //点击打开模态框
	 var addfile = getCurrentPageObj().find("#reqadd_file");
	 addfile.click(function(){
		 var paramObj = new Object();
		 paramObj.FILE_DIR = business_code;
		//var req_id=getCurrentPageObj().find('#req_id_reqAdd').val();
		 openFileSvnUpload(getCurrentPageObj().find("#reqadd_modalfile"), tablefile, 'GZ1063',business_code, '0101', 'S_DIC_REQ_PUT_FILE', false,false, paramObj);
	 });

	 //附件删除
	 var delete_file = getCurrentPageObj().find("#reqdelete_file");
	 delete_file.click(function(){
		 delSvnFile(tablefile, business_code, "0101");
	 });
	 
	 getSvnFileList(tablefile, getCurrentPageObj().find("#reqadd_fileview_modal"), business_code, "0101");
	 
	 var business_codeAss = "";
	 business_codeAss = getCurrentPageObj().find("#assfile_id_reqAdd").val();
	 if(typeof(business_codeAss)!="undefined"){
		 business_codeAss = Math.uuid();
		 getCurrentPageObj().find("#assfile_id_reqAdd").val(business_codeAss);
	 }
	//业务需求说明书附件上传
	var tablefile1 = getCurrentPageObj().find("#reqAss_filetable");
	var addfile1 = getCurrentPageObj().find("#reqAssAdd_file");
	addfile1.click(function(){
		var paramObj1 = new Object();
		paramObj1.FILE_DIR = business_codeAss;
		openFileSvnUpload(getCurrentPageObj().find("#reqAss_modalfile"), tablefile1, 'GZ1063',business_codeAss, '0102', 'S_DIC_REQ_ACC_FILE', false, false, paramObj1);
	});
	//附件删除
	var delete_file1 = getCurrentPageObj().find("#reqAssdelete_file");
	delete_file1.click(function(){
		delSvnFile(tablefile1, business_codeAss, "0102");
	});
	//初始化附件列表
	getSvnFileList(tablefile1, getCurrentPageObj().find("#reqAss_fileview_modal"), business_codeAss, "0102");
}

//加载字典项
function initRequirementDicCode(){
	/*initSelect(getCurrentPageObj().find("#req_type2_reqAdd"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQUIREMENT_TYPE2"});
	initSelect(getCurrentPageObj().find("#req_type1_reqAdd"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQUIREMENT_TYPE1"});
	initSelect(getCurrentPageObj().find("#req_come_reqAdd"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQUIREMENT_SOURCE"});*/
	autoInitRadio({dic_code:"G_DIC_REQUIREMENT_LEVEL"},getCurrentPageObj().find("#req_level_add"),"RA.req_level",{labClass:"ecitic-radio-inline",value:"03"});
}

//获取页面输入的值
function getReqAppPageValue(){
	if(!vlidate($("#gRequirementInfo_add"),"",true)){
		 alert("请按要求填写图表中的必填项！");
		return ;
	}
	 var inputs = getCurrentPageObj().find("input:text[name^='RA.']");
	 var hiddens = getCurrentPageObj().find("input:hidden[name^='RA.']");
	 var selects =getCurrentPageObj().find("select[name^='RA.']");
	 var radios = getCurrentPageObj().find("input:radio[name^='RA.']:checked");
	 var textareas = getCurrentPageObj().find("textarea[name^='RA.']");
	 var params = {};
	//取值
		for(var i=0;i<inputs.length;i++){
			params[$(inputs[i]).attr("name").substr(3)] = $(inputs[i]).val();	 
		}
		
		for(var i=0;i<hiddens.length;i++){
			params[$(hiddens[i]).attr("name").substr(3)] = $(hiddens[i]).val();	 
		}
		
		for(var i=0;i<selects.length;i++){
			params[$(selects[i]).attr("name").substr(3)] = $(selects[i]).val(); 
		}
		
		for(var i=0;i<radios.length;i++){
			params[$(radios[i]).attr("name").substr(3)] = $(radios[i]).val();
		}
		
		for(var i=0;i<textareas.length;i++){
			params[$(textareas[i]).attr("name").substr(3)] = $(textareas[i]).val();
		}
		
		
	    return params;
	
}

//初始化按钮
function initRequirementAddBtn() {

//保存新增
getCurrentPageObj().find('#save_gRequirementInfo').click(function(){
	
	  if(!vlidate($("#gRequirementInfo_add"),"",true)){
		  alert("您还有必填项没有填写！");
		  return ;
	  }
	  var filedata = getCurrentPageObj().find("#reqadd_filetable").bootstrapTable("getData");
	
	  var assFileData = getCurrentPageObj().find("#reqAss_filetable").bootstrapTable("getData");
	
	  var req_name_reqAdd=getCurrentPageObj().find("#req_name_reqAdd").val();
	    if(req_name_reqAdd.length>100){
	    	alert("需求名称至多可输入100汉字！");
	    	return;
	    }
	    var req_income_doc_reqAdd=getCurrentPageObj().find("#req_income_doc_reqAdd").val();
	    var rid=getCurrentPageObj().find('#req_income_doc_reqAdd').attr("placeholder");
	      if(req_income_doc_reqAdd!=rid){
		       if(req_income_doc_reqAdd.length>50){
		    	alert("需求收益评估至多可输入50汉字！");
		    	return;
		    };
	      }
	    
	    var req_description_reqAdd=getCurrentPageObj().find("#req_description_reqAdd").val();
	    if(req_description_reqAdd.length>250){
	    	alert("需求概述至多可输入250汉字！");
	    	return;
	    }
	    var put_dept_opinion_reqAdd=getCurrentPageObj().find("#put_dept_opinion_reqAdd").val();
	    if(put_dept_opinion_reqAdd.length>50){
	    	alert("主管部门意见至多可输入50汉字！");
	    	return;
	    }
	  
	  
	  //获取页面输入的值
	  var params=getReqAppPageValue();
	      var req_income_doc=params.req_income_doc;
	      var rid=getCurrentPageObj().find('#req_income_doc_reqAdd').attr("placeHolder");
	      if(req_income_doc==rid){
	    	  params["req_income_doc"]="";
	      }
	      var put_dept_opinion=params.put_dept_opinion;
	      var pdo=getCurrentPageObj().find('#put_dept_opinion_reqAdd').attr("placeHolder");
	      if(put_dept_opinion==pdo){
	    	  params["put_dept_opinion"]=""; 
	      }
	 baseAjaxJsonp("requirement_input/insertRequirementInfo.asp", params , function(data) {
			if (data != undefined && data != null && data.result=="true") {
				alert("保存成功");
				closePageTab("addRequirement");
			}else{
				var mess=data.mess;
				alert("保存失败:"+mess);
			}
		});
});
	
//保存并提交
getCurrentPageObj().find('#submit_gRequirementInfo').click(function(){
	 var filedata = getCurrentPageObj().find("#reqadd_filetable").bootstrapTable("getData");
	
	  var assFileData = getCurrentPageObj().find("#reqAss_filetable").bootstrapTable("getData");
	
	if(!vlidate($("#gRequirementInfo_add"),"",true)){
		alert("请按要求填写图表中的必填项！");
		return ;
	}
	 var req_name_reqAdd=getCurrentPageObj().find("#req_name_reqAdd").val();
     if(req_name_reqAdd.length>100){
    	alert("需求名称至多可输入100汉字！");
    	return;
     }
     var req_income_doc_reqAdd=getCurrentPageObj().find("#req_income_doc_reqAdd").val();
     var rid=getCurrentPageObj().find('#req_income_doc_reqAdd').attr("placeholder");
     if(req_income_doc_reqAdd!=rid){
	      if(req_income_doc_reqAdd.length>50){
	    	alert("需求收益评估至多可输入50汉字！");
	    	return;
	      };
      }
     var req_description_reqAdd=getCurrentPageObj().find("#req_description_reqAdd").val();
     if(req_description_reqAdd.length>250){
    	alert("需求概述至多可输入250汉字！");
    	return;
     }
     var put_dept_opinion_reqAdd=getCurrentPageObj().find("#put_dept_opinion_reqAdd").val();
     if(put_dept_opinion_reqAdd.length>50){
    	alert("主管部门意见至多可输入50汉字！");
    	return;
     }
     nconfirm("您确定要保存并提交审批吗？",function(){
		  saveToSubmit();
	  },function(){});

  });
function saveToSubmit(){
	 var params=getReqAppPageValue();
	 var req_income_doc=params.req_income_doc;
     var rid=getCurrentPageObj().find('#req_income_doc_reqAdd').attr("placeHolder");
     if(req_income_doc==rid){
   	 params["req_income_doc"]="";
     }
     var put_dept_opinion=params.put_dept_opinion;
     var pdo=getCurrentPageObj().find('#put_dept_opinion_reqAdd').attr("placeHolder");
     if(put_dept_opinion==pdo){
   	 params["put_dept_opinion"]=""; 
     }
     baseAjaxJsonp("requirement_input/insertRequirementInfo.asp", params , function(data) {
		if (data != undefined && data != null && data.result=="true") {
				if (data != undefined && data != null && data.result=="true"){
					var items = {};
					items["af_id"] = '184';//流程id
					items["systemFlag"] = '02'; //systemFlag：系统标识（合同系统：00，项目系统：01，报销系统：02，工程管理：03 外包管理：04）
					items["biz_id"] = 'ap'+params.req_id;//为防止与需求审批流程发生冲突，需求id增加前缀ap作为业务id
					approvalProcess(items,function(data){
						alert("保存并提交审批成功");
					});
					closePageTab("addRequirement");
				}else{
					alert("保存提交失败");
				}
		    }
		});
}


}
//加载部门
function initReqAddOrg(){
	//主管部门
	getCurrentPageObj().find("#reqAdd_org_name").click(function(){
			$(".drop-ztree").hide();
			openSelectTreeDiv($(this),"reqAdd_tree_id","SOrg/queryOrgTreeWithCenterList.asp",{"margin-top": "2px",width:"88%"},function(node){
				getCurrentPageObj().find("#reqAdd_org_name").val(node.name);
				getCurrentPageObj().find("#req_dept_reqAdd").val(node.id);
				getCurrentPageObj().find("reqAdd_tree_id").hide();
			});
		});

		
  //提出部门		
	getCurrentPageObj().find("#reqPutAdd_org_name").click(function(){
		getCurrentPageObj().find(".drop-ztree").hide();
			openSelectTreeDiv($(this),"reqPutAdd_tree_id","SOrg/queryOrgTreeWithCenterList.asp",{"margin-top": "2px",width:"88%"},function(node){
				getCurrentPageObj().find("#reqPutAdd_org_name").val(node.name);
				getCurrentPageObj().find("#req_put_dept_reqAdd").val(node.id);
				getCurrentPageObj().find("#reqPutAdd_tree_id").hide();
			});
		});

//加载会签部门
		var obj1=getCurrentPageObj().find("#req_countersign_org");
		obj1.unbind("click");
		obj1.click(function(){
			openOrgTreePop("req_countersign_dept",null,{id:getCurrentPageObj().find("#req_countersign_dept_reqAdd"),name:getCurrentPageObj().find("#req_countersign_org")});
		});	
	}


