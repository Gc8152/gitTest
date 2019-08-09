initRequirementDicCode();
initReqAddOrg();
initRequirementDepenseBtn();
//加载字典项
function initRequirementDicCode(){
	/*initSelect(getCurrentPageObj().find("#req_type2_reqDM"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQUIREMENT_TYPE2"});
	initSelect(getCurrentPageObj().find("#req_type1_reqDM"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQUIREMENT_TYPE1"});
	initSelect(getCurrentPageObj().find("#req_come_reqDM"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQUIREMENT_SOURCE"});*/
	initSelect(getCurrentPageObj().find("#req_return_reasonDM"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQ_BACKREASON"});
	initSelect(getCurrentPageObj().find("#req_scoreDM1"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQUIREMENT_LEVEL"});
	//initSelect(getCurrentPageObj().find("#req_scaleDM"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQ_LEVEL"});
}

//初始化页面数据
function initReqDisReturnLayOut(ids){
	    var reqAssReturnCall=getMillisecond();
		baseAjaxJsonp(dev_construction+"requirement_splitreq/querySplitSubReqPageById.asp?SID="+SID+"&req_id="+ids+"&call="+reqAssReturnCall, null , function(data) {
			for ( var f in data) {
				  var map=data[f];
			   if(f=="1"||f=="2"){
			     for(var k in map){
					var str=map[k];
					k = k.toLowerCase();//大写转换为小写
			    if(k=="req_datatable_flag"||k=="req_income_flag"||k=="req_dis_result"||k=="req_acc_result"){
			    	getCurrentPageObj().find("input[name='DM."+k+"']"+"[value="+str+"]").attr("checked",true);
			    }else if(k=="req_level"){
			    	baseAjax("SDic/findItemByDic.asp",{dic_code:"G_DIC_REQUIREMENT_LEVEL"},function(data){
			    		if(data!=undefined){
			    			for(var i=0;i<data.length;i++){
			    				if(data[i].ITEM_CODE==str){
		    						getCurrentPageObj().find("#req_level_reqDM").append("<label class='ecitic-radio-inline'><input type='radio' name='DM.req_level' onclick='initReqDMScore();' value="+data[i].ITEM_CODE+" checked>&nbsp;"+data[i].ITEM_NAME+"</label>");
		    					}else{
		    						getCurrentPageObj().find("#req_level_reqDM").append("<label class='ecitic-radio-inline'><input type='radio' name='DM.req_level' onclick='initReqDMScore();' value="+data[i].ITEM_CODE+">&nbsp;"+data[i].ITEM_NAME+"</label>");
		    					}					
			    			}
			    		}
			    	},false);
			   /* }else if(k=="req_type2"){
				    initSelect(getCurrentPageObj().find("#req_type2_reqDM"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQUIREMENT_TYPE2"},str);
			    }else if(k=="req_type1"){
			    	initSelect(getCurrentPageObj().find("#req_type1_reqDM"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQUIREMENT_TYPE1"},str);
			    }else if(k=="req_come"){
			    	initSelect(getCurrentPageObj().find("#req_come_reqDM"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQUIREMENT_SOURCE"},str);*/
				}else if(k=="req_income_doc"){
					getCurrentPageObj().find("#req_income_doc_reqDM").val(str);
				}else if(k=="req_description"){
					getCurrentPageObj().find("#req_description_reqDM").val(str);
				}else if(k=="req_dis_view"){
					getCurrentPageObj().find("#req_dis_viewDM").val(str);
				}else if(k=="put_dept_opinion"){
					getCurrentPageObj().find("#put_dept_opinion_reqDM").val(str);
				}else if(k=="req_analytic_result"){
					getCurrentPageObj().find("#DMreq_analytic_result").val(str);
				}else{
					getCurrentPageObj().find("input[name='DM."+k+"']").val(str);
				  }
			     }
			   }
			}
			initReqDmIncomeCss();//初始化需求评估样式
			initReqDMScore();//初始化需求优先级
		},reqAssReturnCall);
}

//加载部门
function initReqAddOrg(){
	//主管部门
	getCurrentPageObj().find("#req_dept_reqDM_org").click(function(){
			openSelectTreeDiv($(this),"reqDM_tree_id","SOrg/queryOrgTreeWithCenterList.asp",{"margin-top": "2px",width:"200px"},function(node){
				getCurrentPageObj().find("#req_dept_reqDM_org").val(node.name);
				getCurrentPageObj().find("#req_dept_reqDM").val(node.id);
			});
		});
		getCurrentPageObj().find("#req_dept_reqDM_org").focus(function(){
			getCurrentPageObj().find("#req_dept_reqDM_org").click();
		});
		
  //提出部门		
		getCurrentPageObj().find("#req_put_dept_reqDM_org").click(function(){
			openSelectTreeDiv($(this),"reqPutDM_tree_id","SOrg/queryOrgTreeWithCenterList.asp",{"margin-top": "2px",width:"200px"},function(node){
				getCurrentPageObj().find("#req_put_dept_reqDM_org").val(node.name);
				getCurrentPageObj().find("#req_put_dept_reqDM").val(node.id);
			});
		});
		getCurrentPageObj().find("#req_put_dept_reqDM_org").focus(function(){
			getCurrentPageObj().find("#req_put_dept_reqDM_org").click();
		});
		
		//会签部门
		var obj= getCurrentPageObj().find('#req_countersign_org_reqDM');
		    obj.unbind("click");
		    obj.click(function(){
		    openOrgTreePop("countersign_org_DM_pop",null,{id:getCurrentPageObj().find("#req_countersign_dept_reqDM"),name:getCurrentPageObj().find("#req_countersign_org_reqDM")});
		});	
		
	}
//拿到需求分发页面所有输入的信息
function getRequirementDispensePageValue(){
	if(!vlidate($("#g_reqdis_return"),"",true)){
		alert("请按要求填写图表中的必填项！");
		return ;
	}
	 var inputs = getCurrentPageObj().find("input:text[name^='DM.']");
	 var hiddens = getCurrentPageObj().find("input:hidden[name^='DM.']");
	 var selects = getCurrentPageObj().find("select[name^='DM.']");
	 var radios = getCurrentPageObj().find("input:radio[name^='DM.']:checked");
	 var textareas = getCurrentPageObj().find("textarea[name^='DM.']");
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
		
		var req_id=getCurrentPageObj().find('#req_id_reqDM').val();
		if(req_id==null||req_id==""){
			alert("获取主键id失败");
		}
	return params;
}

//初始化按钮
function initRequirementDepenseBtn(){
	//提交并保存
	$('#summitDistribute').click(function(){
		if(!vlidate($("#g_reqdis_return"),"",true)){
			alert("请按要求填写图表中的必填项！");
			return ;
		}
	  /*  var fileData = getCurrentPageObj().find("#reqDM_tablefile").bootstrapTable("getData");
	    var req_dis_result = getCurrentPageObj().find("input[name='DM.req_dis_result']").val();
	    if((fileData==""||fileData==undefined)&&req_dis_result=='01'){
	    	alert("该需求还未上传需求申请书，不能提交，请补录！");
	    	return;
	    }
	    var fileData = getCurrentPageObj().find("#reqDMASS_tablefile").bootstrapTable("getData");
	    var fileCheck=false;
	    if((fileData==null||fileData==undefined||fileData=="")&&req_dis_result=='01'){
		   alert("该需求未上传业务需求说明书，不能提交，请补录！");
		   return;
	    }else{
		   for(var i=0;i<fileData.length;i++){
			  var file_type=fileData[i].FILE_TYPE;
			  if(file_type=="01"){
				  fileCheck=true; 
			  }
		   }
	    }
	    if(!fileCheck){
		  alert("此需求还未上传业务需求说明书，请补录！"); 
		  return;
	    }*/
	    var params=getRequirementDispensePageValue();//拿到页面的值作为参数
	        //var req_operation_date=new Date((params.req_operation_date).replace(/\-/gi,"/")).getTime();
            //var myDate=new Date();
	        //var month = myDate.getMonth()+1;
	        //var unionDay=myDate.getFullYear()+"-"+month+"-"+myDate.getDate();
	        //var currentDay =new Date(unionDay.replace(/\-/gi,"/")).getTime();
	        
          /*  if(req_operation_date<currentDay){
        	   alert("要求投产日期小于当前日期，请修改");
        	   return;
            }*/
	      var req_income_doc=params.req_income_doc;
          var rid=getCurrentPageObj().find('#req_income_doc_reqDM').attr("placeHolder");
	      if(req_income_doc==rid){
	    	  params["req_income_doc"]="";
	      }
	      var put_dept_opinion=params.put_dept_opinion;
	      var pdo=getCurrentPageObj().find('#put_dept_opinion_reqDM').attr("placeHolder");
	      if(put_dept_opinion==pdo){
	    	  params["put_dept_opinion"]=""; 
	      }
	     baseAjaxJsonp(dev_construction+"requirement_accept/submitDistribute.asp?SID="+SID, params , function(data) {
			if (data != undefined && data != null && data.result=="true") {
					if (data != undefined && data != null && data.result=="true"){
						alert("保存并提交成功");
						closePageTab("reqdis_manReturn");
					}else{
						var mess=data.mess;
						alert("保存提交失败:"+mess);
					}
			 }
	     });
	});

	//需求收益评估为否时隐藏收益估算和评估理由
	/*getCurrentPageObj().find('#req_income_reqDM2').click(function(){
		getCurrentPageObj().find('#req_incomedm_hide').hide();
		getCurrentPageObj().find('#req_income_dm').hide();
		getCurrentPageObj().find("#req_income_reqDM").removeAttr("validate");
		getCurrentPageObj().find("#req_income_reqDM").val("");
		getCurrentPageObj().find('#req_income_doc_reqDM').parent().parent().hide();
		getCurrentPageObj().find("#req_income_doc_reqDM").removeAttr("validate");
		getCurrentPageObj().find("#req_income_doc_reqDM").val("");
		getCurrentPageObj().find('#req_remark_dm').hide();
		getCurrentPageObj().find('#req_remark_dm+strong').hide();
	});
	
	//需求收益评估为是时显示收益估算和评估理由
	getCurrentPageObj().find('#req_income_reqDM1').click(function(){
		getCurrentPageObj().find('#req_incomedm_hide').show();
		getCurrentPageObj().find('#req_income_dm').show();
		getCurrentPageObj().find("#req_income_reqDM").attr("validate","v.isfloat");
		getCurrentPageObj().find('#req_income_doc_reqDM').parent().parent().show();
		getCurrentPageObj().find("#req_income_doc_reqDM").attr("validate","v.required");
		getCurrentPageObj().find('#req_remark_dm').show();
		getCurrentPageObj().find('#req_remark_dm+strong').show();
	});*/
	
//接受时隐藏退回原因,显示需求级别和产品经理
$('#req_dis_resultDM1').click(function(){
	getCurrentPageObj().find('#DMreturn_reason').parent().hide();
	getCurrentPageObj().find('#req_return_reasonDM').parent().hide();
	getCurrentPageObj().find('#req_return_reasonDM').val(" ");
	getCurrentPageObj().find('#req_return_reasonDM').select2();
	getCurrentPageObj().find('#req_scoreDM1').parent().show();
	getCurrentPageObj().find('#req_score_hide').parent().show();
	getCurrentPageObj().find('#req_product_manager_hide').show();
	getCurrentPageObj().find('#req_product_managerDM1').parent().show();
	//getCurrentPageObj().find('#req_product_managerDM1').parent().parent().show();
	getCurrentPageObj().find('#req_product_managerDM1').attr("validate","v.required");
	getCurrentPageObj().find('#req_product_managerDM1+strong').show();
	//getCurrentPageObj().find('#req_scaleDM').attr("validate");
});

//退回时显示退回原因,隐藏指定产品经理和需求级别以及需求评分
$('#req_dis_resultDM2').click(function(){
	getCurrentPageObj().find('#DMreturn_reason').parent().show();
	getCurrentPageObj().find('#req_return_reasonDM').parent().show();
	//getCurrentPageObj().find('#req_product_managerDM1').parent().parent().hide();
	getCurrentPageObj().find('#req_product_manager_hide').hide();
	getCurrentPageObj().find('#req_product_managerDM1').parent().hide();
	getCurrentPageObj().find('#req_product_managerDM1+strong').hide();
	getCurrentPageObj().find('#req_product_managerDM1').removeAttr("validate");
	//getCurrentPageObj().find('#req_product_managerDM').val("");
	getCurrentPageObj().find('#req_product_managerDM1').val("");
	getCurrentPageObj().find('#req_product_managerDM1').select2();
	/*getCurrentPageObj().find('#req_scaleDM').removeAttr("validate");
	getCurrentPageObj().find('#req_scaleDM').val("");
	getCurrentPageObj().find('#req_scaleDM').select2();*/
	getCurrentPageObj().find('#req_scoreDM1').parent().hide();
	getCurrentPageObj().find('#req_scoreDM1').val("");
	getCurrentPageObj().find('#req_scoreDM1').select2();
	getCurrentPageObj().find('#req_score_hide').parent().hide();
});

 //加载项目经理pop框
// $('#req_product_managerDM1').click(function(){
//	 openRoleUserPop("choseManager_pop1",{no:getCurrentPageObj().find('#req_product_managerDM'),name:getCurrentPageObj().find('#req_product_managerDM1')},"0017");
//  });
//var reqAssReturnCall=getMillisecond();
//baseAjaxJsonp(dev_construction+"requirement_splitreq/querySplitSubReqPageById.asp?SID="+SID+"&req_id="+ids+"&call="+reqAssReturnCall, null , function(data) {
	var reqAssReturnCall=getMillisecond();
	baseAjaxJsonp(dev_construction+"requirement_accept/queryUserByRoleNo.asp?role_no=0082&limit=5&offset=0&SID="+SID+"&call="+reqAssReturnCall, {}, function(data){
		var elem=getCurrentPageObj().find("#req_product_managerDM1");
		/*elem.append('<option id="removeOption" value=" "/>请选择</option>');	*/
		elem.append('<option value="">请选择</option>');	
		if(data&&data.rows&&data.rows.length>0){
			for(var i=0;i<data.rows.length;i++){
				var value=data.rows[i]["USER_NO"];
				var name=data.rows[i]["ORG_NAME"]+":"+data.rows[i]["USER_NAME"];
				elem.append('<option value="'+value+'">'+name+'</option>');	
			}
		}
		elem.val(" ");
		elem.select2();
	},reqAssReturnCall);
}

//初始化需求优先级(需求来源*0.6+要求投产日期*0.3+业务优先级*0.1)
function initReqDMScore(){
	var req_score=0;
	var dates=0;
	var req_come=getCurrentPageObj().find('#req_come_reqDM').val();
	if(req_come=='01'){
		req_score=3;//5*0.6
	}else if(req_come=='02'){
		req_score=2.4;
	}else if(req_come=="03"){
		req_score=1.8;
	}else if(req_come=='05'){
		req_score=1.2;
	}else if(req_come=='04'){
		req_score=0.6;
	}
	var summit_time = getCurrentPageObj().find('#summit_dateDM').val();
	var startTime = new Date(summit_time.replace(/\-/gi,"/")).getTime();
	var operation_date = getCurrentPageObj().find('#req_operation_date_reqDM').val();
	var endTime = new Date(operation_date.replace(/\-/gi,"/")).getTime(); 
	if(endTime-startTime<0){
		alert("投产日期小于需求提出日期，请注意");  
		dates = Math.abs((startTime - endTime))/(1000*60*60*24);
	}else{
		dates = Math.abs((startTime - endTime))/(1000*60*60*24);
	}
	if(dates<30){
		req_score=req_score+1.5;
	}else if(dates>=30&&dates<60){
		req_score=req_score+0.9;
	}else if(dates>=60){
		req_score=req_score+0.3;
	}
	var req_level = getCurrentPageObj().find("input:radio[name^='DP.req_level']:checked").val();
	if(req_level=="01"){
		req_score=req_score+0.5;
	}else if(req_level=="02"){
		req_score=req_score+0.3;
	}else if(req_level=="03"){
		req_score=req_score+0.1;
	}
	if(req_score>=4){
		initSelect(getCurrentPageObj().find("#req_scoreDM1"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQUIREMENT_LEVEL"},"01");
	}else if(req_score>=2&&req_score<4){
		initSelect(getCurrentPageObj().find("#req_scoreDM1"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQUIREMENT_LEVEL"},"02");
	}else if(req_score<2){
		initSelect(getCurrentPageObj().find("#req_scoreDM1"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQUIREMENT_LEVEL"},"03");
	}
}

//初始化需求收益评估样式和分发结论
function initReqDmIncomeCss(){
	/*var req_income_flag=getCurrentPageObj().find('input:radio[name="DM.req_income_flag"]:checked').val();
	if(req_income_flag=='01'){//当需求收益为否时隐藏需求收益估算和理由
		getCurrentPageObj().find('#req_incomedm_hide').hide();
		getCurrentPageObj().find('#req_income_dm').hide();
		getCurrentPageObj().find("#req_income_reqDM").removeAttr("validate");
		getCurrentPageObj().find('#req_income_doc_reqDM').parent().parent().hide();
		getCurrentPageObj().find("#req_income_doc_reqDM").removeAttr("validate");
		getCurrentPageObj().find('#req_remark_dm').hide();
		getCurrentPageObj().find('#req_remark_dm+strong').hide();
	}*/
	var req_dis_result=getCurrentPageObj().find('input:radio[name="DM.req_dis_result"]:checked').val();
	if(req_dis_result=="01"){//分发结论为受理时隐藏退回原因
		getCurrentPageObj().find('#DMreturn_reason').parent().hide();
		getCurrentPageObj().find('#req_return_reasonDM').parent().hide();
	}

	 //附件上传
	 var tablefile = getCurrentPageObj().find("#reqDM_tablefile");
	 var business_code = "";
	 business_code = getCurrentPageObj().find("#file_id_reqDM").val();
	 /*if(!business_code){
		 business_code = Math.uuid();
		 getCurrentPageObj().find("#file_id_reqDM").val(business_code);
	 }
	//点击打开模态框
	var addfile = getCurrentPageObj().find("#reqDM_addfile");
	 addfile.click(function(){
		 var paramObj = new Object();
		 paramObj.FILE_DIR = business_code;
	 	openFileFtpUpload(getCurrentPageObj().find("#reqDM_filemodal"), tablefile, 'GZ1063',business_code, '0101', 'S_DIC_REQ_PUT_FILE', false, false, paramObj);
	 });
	 //附件删除
	 var delete_file = getCurrentPageObj().find("#reqDM_deletefile");
	 delete_file.click(function(){
	 	delFtpFile(tablefile, business_code,"0101");
	 });*/

	 //需求申请书初始化附件列表
	 getSvnFileList(tablefile, getCurrentPageObj().find("#reqDM_fileview_modal"), business_code, "0101",function(){
		 getReturnAsstablefile(tablefile);
	 });
	 //业务需求说明书列表
	 v/*ar business_code1 = "";
	 business_code1 = getCurrentPageObj().find("#assfile_id_reqDM").val();
	 var tablefile1 = getCurrentPageObj().find("#reqDMASS_tablefile");
	 getSvnFileList(tablefile1, getCurrentPageObj().find("#reqDMASS_fileview_modal"), business_code1, "0102");*/
}

function getReturnAsstablefile(tablefile){
	business_code = getCurrentPageObj().find("#assfile_id_reqDM").val();
	baseAjax("sfile/queryFTPFileByBusinessCode.asp",{business_code:business_code, phase:'0102'},function(data){
		tablefile.bootstrapTable("append",data);
	},false);
}