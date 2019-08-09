
function initReqUpdateLayout(ids){
	var record = null;
	
	//附件上传相关变量；
	var addfile = getCurrentPageObj().find("#reqUpdate_addfile");
	var tablefile = getCurrentPageObj().find("#reqUpdate_tablefile");
	
	//初始化字典
	/*initSelect(getCurrentPageObj().find("#req_type2_reqUpdate"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQUIREMENT_TYPE2"});
	initSelect(getCurrentPageObj().find("#req_type1_reqUpdate"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQUIREMENT_TYPE1"});
	initSelect(getCurrentPageObj().find("#req_come_reqUpdate"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQUIREMENT_SOURCE"});*/
	autoInitRadio({dic_code:"G_DIC_REQUIREMENT_LEVEL"},getCurrentPageObj().find("#req_level_reqUpdate"),"RU.req_level",{labClass:"ecitic-radio-inline",value:"03"});
	
	var currTab = getCurrentPageObj();
	var reqUpdateCall=getMillisecond();//加入时间戳，防止多次请求返回数据不能识别
	baseAjaxJsonp(dev_construction+"requirement_input/queryRequirementInfoByID.asp?SID="+SID+"&req_id="+ids+"&call="+reqUpdateCall, null , function(data) {
		for ( var k in data) {
			var str=data[k];
			k = k.toLowerCase();//大写转换为小写
		   /* if(k=="req_type2"){
			    initSelect(currTab.find("#req_type2_reqUpdate"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQUIREMENT_TYPE2"},str);
		    }else if(k=="req_type1"){
		    	initSelect(currTab.find("#req_type1_reqUpdate"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQUIREMENT_TYPE1"},str);
		    }else if(k=="req_come"){
		    	initSelect(currTab.find("#req_come_reqUpdate"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQUIREMENT_SOURCE"},str);
		    }else if(k=="req_datatable_flag"||k=="req_income_flag"){
		    	currTab.find("input[name='RU."+k+"']"+"[value="+str+"]").attr("checked",true);
		    }else */if(k=="req_level"){
		    	getCurrentPageObj().find("input[name='RU."+k+"']"+"[value="+str+"]").attr("checked",true);
			}else if(k=="req_income_doc"){
				currTab.find("#req_income_doc_reqUpdate").val(str);
			}else if(k=="req_description"){	
				currTab.find("#req_description_reqUpdate").val(str);
			}else if(k=="put_dept_opinion"){
				currTab.find("#put_dept_opinion_reqUpdate").val(str);
			}else {
				currTab.find("input[name='RU." + k + "']").val(str);//file_id和assfile_id都在这里赋值进来了
			}	
		}
		//初始化附件列表
		getSvnFileList(tablefile,getCurrentPageObj().find("#reqUpdate_fileview_modal"), data.FILE_ID, "0101");
		getSvnFileList(getCurrentPageObj().find("#reqAssUpdate_filetable"),getCurrentPageObj().find("#reqAssUpdate_fileview_modal"), data.ASSFILE_ID, "0102");
		record = data;
	},reqUpdateCall);

	//更新
	getCurrentPageObj().find('#update_gRequirementInfo').click(function(){
		if(!vlidate($("#gRequirementInfo_update"),"",true)){
			 alert("您还有必填项没有填写！");
			return ;
		}	
		    //获取页面输入的值
		    var params=gerReqUpdatePageValue();
		    var req_income_doc=params.req_income_doc;
	        var rid=getCurrentPageObj().find('#req_income_doc_reqUpdate').attr("placeHolder");
		      if(req_income_doc==rid){
		    	  params["req_income_doc"]="";
		      }
		      var put_dept_opinion=params.put_dept_opinion;
		      var pdo=getCurrentPageObj().find('#put_dept_opinion_reqUpdate').attr("placeHolder");
		      if(put_dept_opinion==pdo){
		    	  params["put_dept_opinion"]=""; 
		      } 
		      
		      var req_name_reqUpdate=getCurrentPageObj().find("#req_name_reqUpdate").val();
			    if(req_name_reqUpdate.length>100){
			    	alert("需求名称至多可输入100汉字！");
			    	return;
			    }
			    /*var req_income_doc_reqUpdate=getCurrentPageObj().find("#req_income_doc_reqUpdate").val();
			    if(req_income_doc_reqUpdate.length>50){
			    	alert("需求收益评估至多可输入50汉字！");
			    	return;
			    }*/
			    var req_income_doc_reqUpdate=getCurrentPageObj().find("#req_income_doc_reqUpdate").val();
			    var rid=getCurrentPageObj().find('#req_income_doc_reqUpdate').attr("placeholder");
			      if(req_income_doc_reqUpdate!=rid){
				       if(req_income_doc_reqUpdate.length>50){
				    	alert("需求收益评估至多可输入50汉字！");
				    	return;
				       };
			    }
			    
			    
			    var req_description_reqUpdate=getCurrentPageObj().find("#req_description_reqUpdate").val();
			    if(req_description_reqUpdate.length>150){
			    	alert("需求概述至多可输入150汉字！");
			    	return;
			    }
			    var put_dept_opinion_reqUpdate=getCurrentPageObj().find("#put_dept_opinion_reqUpdate").val();
			    if(put_dept_opinion_reqUpdate.length>50){
			    	alert("主管部门意见至多可输入50汉字！");
			    	return;
			    }
		      
			baseAjaxJsonp("requirement_input/updateRequirementInfo.asp"+SID+"&req_state=01"+"&p_owner="+SID, params , function(data) {
				if (data != undefined && data != null && data.result=="true") {
					alert("更新成功");
					closePageTab("updateRequirement_input");
				}else{
					var mess=data.mess;
					alert("更新失败:"+mess);
				}
			});
				
		});
	
	//保存并提交审批
	getCurrentPageObj().find('#submit_gRequirementInfo').click(function(){
		if(!vlidate($("#gRequirementInfo_update"),"",true)){
			 alert("您还有必填项没有填写！");
			return ;
		}
		var req_name_reqUpdate=getCurrentPageObj().find("#req_name_reqUpdate").val();
	    if(req_name_reqUpdate.length>100){
	    	alert("需求名称至多可输入100汉字！");
	    	return;
	    }
	    var req_income_doc_reqUpdate=getCurrentPageObj().find("#req_income_doc_reqUpdate").val();
	    var rid=getCurrentPageObj().find('#req_income_doc_reqUpdate').attr("placeholder");
	      if(req_income_doc_reqUpdate!=rid){
		       if(req_income_doc_reqUpdate.length>50){
		    	alert("需求收益评估至多可输入50汉字！");
		    	return;
		       };
	    }
	    var req_description_reqUpdate=getCurrentPageObj().find("#req_description_reqUpdate").val();
	    if(req_description_reqUpdate.length>150){
	    	alert("需求概述至多可输入150汉字！");
	    	return;
	    }
	    var put_dept_opinion_reqUpdate=getCurrentPageObj().find("#put_dept_opinion_reqUpdate").val();
	    if(put_dept_opinion_reqUpdate.length>50){
	    	alert("主管部门意见至多可输入50汉字！");
	    	return;
	    }
		var filedata = getCurrentPageObj().find("#reqUpdate_tablefile").bootstrapTable("getData");
		if(filedata==""||filedata==undefined){
			  alert("该需求还未上传需求申请书！");
			  return;
		}
		var fileData1 = getCurrentPageObj().find("#reqAssUpdate_filetable").bootstrapTable("getData");
		if(fileData1==null||fileData1==undefined||fileData1==""){
			alert("此需求未上传业务需求说明书！");
		  return;
		}
		updateToSubmit();	
		 /* if((filedata==""||filedata==undefined)&&!fileCheck){
			  nconfirm("您还未上传《需求申请书》《业务需求说明书》确定要提交该需求吗？",function(){
				  updateToSubmit();
			  },function(){});
		  }else if(filedata==""||filedata==undefined){
			  nconfirm("您还未上传《需求申请书》确定要提交该需求吗？",function(){
				  updateToSubmit();
			  },function(){});
		  }else if(!fileCheck){
			  nconfirm("您还未上传《业务需求说明书》确定要提交该需求吗？",function(){
				  updateToSubmit();
			  },function(){});
		  }else{
			  nconfirm("确定要提交该需求吗？",function(){
				  updateToSubmit();
			  },function(){});
		  }*/
	});
	/**
	 * 修改并提交
	 */
	function updateToSubmit(){
		//获取页面输入的值
	    var params=gerReqUpdatePageValue();
	    var req_income_doc=params.req_income_doc;
        var rid=getCurrentPageObj().find('#req_income_doc_reqUpdate').attr("placeHolder");
	    if(req_income_doc==rid){
	    	params["req_income_doc"]="";
	    }
	    var put_dept_opinion=params.put_dept_opinion;
	    var pdo=getCurrentPageObj().find('#put_dept_opinion_reqUpdate').attr("placeHolder");
	    if(put_dept_opinion==pdo){
	    	params["put_dept_opinion"]=""; 
	    }
	    baseAjaxJsonp(
	    		"requirement_input/upadteRequirementInfo.asp"+SID+"&req_state=15"+"&powner=''", params , function(data) {
					if (data != undefined && data != null && data.result=="true"){
						var items = {};
						items["af_id"] = '184';//流程id
						items["systemFlag"] = '02'; //systemFlag：系统标识（合同系统：00，项目系统：01，报销系统：02，工程管理：03 外包管理：04）
						items["biz_id"] = 'ap'+params.req_id;//为防止与需求审批流程发生冲突，需求id增加前缀ap作为业务id
						approvalProcess(items,function(data){
							alert("更新并提交审批成功");
						});
						closePageTab("updateRequirement_input");
					}else{
						alert("提交失败");
					}
		});
	}
	
	//保存并提交审批
/*	getCurrentPageObj().find('#submit_gRequAppoverInfo').click(function(){
		if(!vlidate($("#gRequirementInfo_update"),"",true)){
			 alert("请按要求填写图表中的必填项！");
			return ;
		}
	  //获取页面输入的值
	  var params=gerReqUpdatePageValue();
	  var req_id=getCurrentPageObj().find("#req_id_reqUpdate").val();
	  params["input_state"] = "011";//需求审批中
	 baseAjaxJsonp(dev_construction+"requirement_input/updateRequirementInfo.asp?SID="+SID, params , function(data) {
			if (data != undefined && data != null && data.result=="true") {
				//处理流程发起？？？？
				baseAjaxJsonp(dev_construction+"requirement_input/submitToAccept.asp?SID="+SID, {"req_id":req_id,"req_state":"011"} , function(data) {
					if (data != undefined && data != null && data.result=="true"){
						var org = $('#req_countersign_dept_reqUpdate').val();
						var dept_put = $("#req_put_dept_reqUpdate").val();
						approvalProcess({af_id:"61",systemFlag:"requirement_assess",biz_id:req_id,req_state:"req_input",orgs:org,dept_put:dept_put});
						
						closePageTab("updateRequirement_input");
					}else{
						alert("更新成功，提交失败");
					}
				});
					
			}else{
				var mess=data.mess;
				alert("保存失败:"+mess);
			}
		});
	});*/

	//需求申请书上传
	addfile.click(function(){
		 if(!record.FILE_ID){
			 record.FILE_ID = Math.uuid();
			 getCurrentPageObj().find("#file_id_reqUpdate").val(record.FILE_ID);
		 }
		var paramObj = new Object();
		paramObj.FILE_DIR = record.FILE_ID;
		openFileSvnUpload(getCurrentPageObj().find("#reqUpdate_filemodal"), tablefile, 'GZ1063',record.FILE_ID, '0101', 'S_DIC_REQ_PUT_FILE', false, false, paramObj);
	});

	//附件删除
	var delete_file = getCurrentPageObj().find("#reqUpdate_deletefile");
	delete_file.click(function(){
		delSvnFile(tablefile, record.FILE_ID, "0101");
	});
	
	//业务需求说明书附件上传
	var tablefile1 = getCurrentPageObj().find("#reqAssUpdate_filetable");
	var addfile1 = getCurrentPageObj().find("#reqUpdate_assAddfile");
	addfile1.click(function(){
		if(!record.ASSFILE_ID){
			 record.ASSFILE_ID = Math.uuid();
			 getCurrentPageObj().find("#assfile_id_reqUpdate").val(record.ASSFILE_ID);
		 }
		var paramObj1 = new Object();
		 paramObj1.FILE_DIR = record.ASSFILE_ID;
		 openFileSvnUpload(getCurrentPageObj().find("#reqAssUpdate_modalfile"), tablefile1, 'GZ1063',record.ASSFILE_ID, '0102', 'S_DIC_REQ_ACC_FILE', false, false, paramObj1);
	});

	//附件删除
	var delete_file1 = getCurrentPageObj().find("#reqUpdate_assDelfile");
	delete_file1.click(function(){
		delSvnFile(tablefile1, record.ASSFILE_ID, "0102");
	});
	
	//获取页面输入的值
	function gerReqUpdatePageValue(){
		if(!vlidate($("#gRequirementInfo_update"),"",true)){
			 alert("请按要求填写图表中的必填项！");
			return ;
		}
		 var inputs = getCurrentPageObj().find("input:text[name^='RU.']");
		 var hiddens = getCurrentPageObj().find("input:hidden[name^='RU.']");
		 var selects = getCurrentPageObj().find("select[name^='RU.']");
		 var radios = getCurrentPageObj().find("input:radio[name^='RU.']:checked");
		 var textareas = getCurrentPageObj().find("textarea[name^='RU.']");
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
			var req_id=getCurrentPageObj().find("#req_id_reqUpdate").val();
			if(req_id==null&&req_id==""){
				alert("未能获取主键id，更新失败");
				return;
			}
		return params;
	}
}

//加载部门
initReqUpdateOrg();
function initReqUpdateOrg(){
	//主管部门
	getCurrentPageObj().find("#req_dept_reqUpdate_org").click(function(){
			$(".drop-ztree").hide();
			openSelectTreeDiv($(this),"reqUpdate_tree_id","SOrg/queryOrgTreeWithCenterList.asp",{"margin-top": "2px",width:"88%"},function(node){
				getCurrentPageObj().find("#req_dept_reqUpdate_org").val(node.name);
				getCurrentPageObj().find("#req_dept_reqUpdate").val(node.id);
				getCurrentPageObj().find("reqUpdate_tree_id").hide();
			});
		});

		
  //提出部门		
	getCurrentPageObj().find("#req_put_dept_reqUpdate_org").click(function(){
		getCurrentPageObj().find(".drop-ztree").hide();
			openSelectTreeDiv($(this),"reqPutUdate_tree_id","SOrg/queryOrgTreeWithCenterList.asp",{"margin-top": "2px",width:"88%"},function(node){
				getCurrentPageObj().find("#req_put_dept_reqUpdate_org").val(node.name);
				getCurrentPageObj().find("#req_put_dept_reqUpdate").val(node.id);
				getCurrentPageObj().find("#reqPutUdate_tree_id").hide();
			});
		});

//加载会签部门
		var obj1=getCurrentPageObj().find("#req_countersign_dept_org");
		obj1.unbind("click");
		obj1.click(function(){
			openOrgTreePop("req_countersign_dept_update",null,{id:getCurrentPageObj().find("#req_countersign_dept_reqUpdate"),name:getCurrentPageObj().find("#req_countersign_dept_org")});
		});	
	}