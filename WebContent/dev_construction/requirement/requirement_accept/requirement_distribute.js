initRequirementDicCode();
initReqAddOrg();
initRequirementDepenseBtn();
//加载字典项
function initRequirementDicCode(){
	/*initSelect(getCurrentPageObj().find("#req_type2_reqDP"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQUIREMENT_TYPE2"});
	initSelect(getCurrentPageObj().find("#req_type1_reqDP"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQUIREMENT_TYPE1"});
	initSelect(getCurrentPageObj().find("#req_come_reqDP"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQUIREMENT_SOURCE"});*/
	initSelect(getCurrentPageObj().find("#req_return_reasonDp"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQ_BACKREASON"});
	initSelect(getCurrentPageObj().find("#req_scoreDp1"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQUIREMENT_LEVEL"});
	//initSelect(getCurrentPageObj().find("#req_scaleDp"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQ_LEVEL"});
}

//初始化页面数据
function initReqDisLayOut(ids){
	
	//附件上传相关变量;
	
	var reqDisCall=getMillisecond();
	baseAjaxJsonp(dev_construction+"requirement_accept/queryReqDistributeById.asp?SID="+SID+"&req_id="+ids+"&call="+reqDisCall, null, function(data) {
		 for ( var f in data) {
			var map=data[f];
			if(f=="2"||f=="3"){
				 for(var k in map){
						var str=map[k];
						k = k.toLowerCase();//大写转换为小写
				    /*if(k=="req_type2"){
					    initSelect(getCurrentPageObj().find("#req_type2_reqDP"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQUIREMENT_TYPE2"},str);
				    }else if(k=="req_type1"){
				    	initSelect(getCurrentPageObj().find("#req_type1_reqDP"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQUIREMENT_TYPE1"},str);
				    }else*/ if(k=="req_return_reason"){
				    	initSelect(getCurrentPageObj().find("#req_return_reasonDp"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQ_BACKREASON"},str);
				    }else if(k=="req_scale"){
				    	initSelect(getCurrentPageObj().find("#req_scaleDp"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQ_LEVEL"},str);	
				    /*}else if(k=="req_come"){
				    	initSelect(getCurrentPageObj().find("#req_come_reqDP"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQUIREMENT_SOURCE"},str);*/
				    }else if(k=="req_level"){
				    	baseAjax("SDic/findItemByDic.asp",{dic_code:"G_DIC_REQUIREMENT_LEVEL"},function(data){
				    		if(data!=undefined){
				    			for(var i=0;i<data.length;i++){
				    				if(data[i].ITEM_CODE==str){
			    						getCurrentPageObj().find("#req_level_reqDP").append("<label class='ecitic-radio-inline'><input type='radio' name='DP.req_level' onclick='initReqScore();' value="+data[i].ITEM_CODE+" checked>&nbsp;"+data[i].ITEM_NAME+"</label>");
			    					}else{
			    						getCurrentPageObj().find("#req_level_reqDP").append("<label class='ecitic-radio-inline'><input type='radio' name='DP.req_level' onclick='initReqScore();' value="+data[i].ITEM_CODE+">&nbsp;"+data[i].ITEM_NAME+"</label>");
			    					}					
				    			}
				    		}
				    	},false);
				    }else if(k=="req_dis_result"){
				    	getCurrentPageObj().find("input[name='DP."+k+"']"+"[value="+str+"]").attr("checked",true);
					}else if(k=="req_income_doc"){
						getCurrentPageObj().find("#req_income_doc_reqDP").val(str);
					}else if(k=="req_description"){
						getCurrentPageObj().find("#req_description_reqDP").val(str);
					}else if(k=="put_dept_opinion"){
						getCurrentPageObj().find("#put_dept_opinion_reqDP").val(str);	
					}else if(k=="req_dis_view"){
						getCurrentPageObj().find("#req_dis_viewDp").val(str);	
					}else {
						 $("input[name='DP." + k + "']").val(str);
					}
				}
		    }
	    }
		initReqDisIncomeCss();//初始化需求收益评估样式
		initReqScore();//初始化需求优先级
		
		 initFileUpload(data[2]);
	},reqDisCall);
		
	function initFileUpload(record){
		//var addfileDiv = getCurrentPageObj().find("#reqDP_filemodal");
		var tablefile = getCurrentPageObj().find("#reqDP_tablefile");
		var viewFileInfo = getCurrentPageObj().find("#reqDP_fileview_modal");
		//附件上传
		/*var business_code = "";
		business_code = record.FILE_ID;
		if(!business_code){
			business_code = Math.uuid();
			getCurrentPageObj().find("#file_id_reqDP").val(business_code);
		}
		
		//点击打开模态框
		var addfile = getCurrentPageObj().find("#reqDP_addfile");
		addfile.click(function(){
			var paramObj = new Object();
			paramObj.FILE_DIR = business_code;
			openFileFtpUpload(addfileDiv, tablefile, 'GZ1063',business_code, '0101', 'S_DIC_REQ_PUT_FILE', false, false, paramObj);
		});
		//附件删除
		var delete_file = getCurrentPageObj().find("#reqDP_deletefile");
		delete_file.click(function(){
			delFtpFile(tablefile, business_code,"0101");
		});*/
		//初始化附件列表（需求申请书列表）
		getSvnFileList(tablefile, viewFileInfo, record.FILE_ID, "0101",function(){
			getAsstablefile(record.ASSFILE_ID);
		});
		//业务需求说明书列表
	//	var asstablefile = getCurrentPageObj().find("#reqAssDP_tablefile");
	//	var assviewFileInfo = getCurrentPageObj().find("#reqAssDP_fileview_modal");
		//初始化附件列表
	//	getSvnFileList(asstablefile, assviewFileInfo, record.ASSFILE_ID, "0102");
	}
}

function getAsstablefile(business_code){
	var tablefile = getCurrentPageObj().find("#reqDP_tablefile");
	baseAjax("sfile/queryFTPFileByBusinessCode.asp",{business_code:business_code, phase:'0102'},function(data){
		tablefile.bootstrapTable("append",data);
	},false);
}

//加载部门
function initReqAddOrg(){
	//主管部门
	getCurrentPageObj().find("#req_dept_reqDP_org").click(function(){
			openSelectTreeDiv($(this),"reqDP_tree_id","SOrg/queryOrgTreeWithCenterList.asp",{"margin-top": "2px",width:"180px"},function(node){
				getCurrentPageObj().find("#req_dept_reqDP_org").val(node.name);
				getCurrentPageObj().find("#req_dept_reqDP").val(node.id);
			});
		});
	getCurrentPageObj().find("#req_dept_reqDP_org").focus(function(){
		getCurrentPageObj().find("#req_dept_reqDP_org").click();
		});
		
  //提出部门		
	getCurrentPageObj().find("#req_put_dept_reqDP_org").click(function(){
			openSelectTreeDiv($(this),"reqPutDP_tree_id","SOrg/queryOrgTreeWithCenterList.asp",{"margin-top": "2px",width:"180px"},function(node){
				getCurrentPageObj().find("#req_put_dept_reqDP_org").val(node.name);
				getCurrentPageObj().find("#req_put_dept_reqDP").val(node.id);
			});
		});
	getCurrentPageObj().find("#req_put_dept_reqDP_org").focus(function(){
		getCurrentPageObj().find("#req_put_dept_reqDP_org").click();
		});
  //会签部门
	var obj= getCurrentPageObj().find('#req_countersign_org_reqDP');
	    obj.unbind("click");
	    obj.click(function(){
	    	openOrgTreePop("countersign_org_DP_pop",null,{id:getCurrentPageObj().find("#req_countersign_dept_reqDP"),name:getCurrentPageObj().find("#req_countersign_org_reqDP")});
	});	
	}

//拿到需求分发页面所有输入的信息
function getRequirementDispensePageValue(){
	
	var inputs = getCurrentPageObj().find("input:text[name^='DP.']");
	var hiddens = getCurrentPageObj().find("input:hidden[name^='DP.']");
	var selects = getCurrentPageObj().find("select[name^='DP.']");
	var radios = getCurrentPageObj().find("input:radio[name^='DP.']:checked");
	var textareas = getCurrentPageObj().find("textarea[name^='DP.']");
	var params = {};
	//取值
	for(var i=0;i<hiddens.length;i++){
		params[$(hiddens[i]).attr("name").substr(3)] = $(hiddens[i]).val();	 
	}
	for(var i=0;i<inputs.length;i++){
		params[$(inputs[i]).attr("name").substr(3)] = $(inputs[i]).val();	 
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
	var req_id=$('#req_id_reqDP').val();
	if(req_id!=null&&req_id!=""){
		 params["req_id"]=req_id;
	}else{
		alert("获取主键id失败");
		return;
	}
   
	return params;
}

//初始化按钮
function initRequirementDepenseBtn(){
	//提交并保存
	$('#submit_gRequirementDistribute').click(function(){
	    if(!vlidate($("#g_requirement_distribute"),"",true)){
	    	alert("您有必填项未填写");
		   return ;
	    }
	  /*  var fileData = getCurrentPageObj().find("#reqDP_tablefile").bootstrapTable("getData");
	    var req_dis_result = getCurrentPageObj().find("input[name='DP.req_dis_result']").val();
	    if((fileData==""||fileData==undefined)&&req_dis_result=='01'){
	    	alert("该需求还未上传需求申请书，不能提交，请补录！");
	    	return;
	    }
	    var fileData = getCurrentPageObj().find("#reqAssDP_tablefile").bootstrapTable("getData");
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
		  alert("此需求还未上传业务需求说明书！"); 
		  return;
	    }*/
	    
	    var req_name_reqDP=getCurrentPageObj().find("#req_name_reqDP").val();
	    if(req_name_reqDP.length>100){
	    	alert("需求名称至多可输入100汉字！");
	    	return;
	    }
	    var req_income_doc_reqDP=getCurrentPageObj().find("#req_income_doc_reqDP").val();
	    if(req_income_doc_reqDP.length>50){
	    	alert("需求收益评估至多可输入50汉字！");
	    	return;
	    }
	    var req_description_reqDP=getCurrentPageObj().find("#req_description_reqDP").val();
	    if(req_description_reqDP.length>250){
	    	alert("需求概述至多可输入250汉字！");
	    	return;
	    }
	    var put_dept_opinion_reqDP=getCurrentPageObj().find("#put_dept_opinion_reqDP").val();
	    if(put_dept_opinion_reqDP.length>50){
	    	alert("主管部门意见至多可输入50汉字！");
	    	return;
	    }
	    var req_dis_viewDp=getCurrentPageObj().find("#req_dis_viewDp").val();
	    if(req_dis_viewDp.length>50){
	    	alert("分发意见至多可输入50汉字！");
	    	return;
	    }
	    
	    
	    var params=getRequirementDispensePageValue();//拿到页面的值作为参数
	   /* var req_operation_date=new Date((params.req_operation_date).replace(/\-/gi,"/")).getTime();
	    var myDate=new Date();
	    var month = myDate.getMonth()+1;
	    var unionDay=myDate.getFullYear()+"-"+month+"-"+myDate.getDate();
	    var currentDay =new Date(unionDay.replace(/\-/gi,"/")).getTime();
	        
	        if(req_operation_date<currentDay){
	        	alert("要求投产日期小于当前日期，请修改");
	        	return;
	        }*/
	        var req_income_doc=params.req_income_doc;
	        var rid=getCurrentPageObj().find("#req_income_doc_reqDP").attr("placeHolder");
	        if(req_income_doc==rid){
	        	params["req_income_doc"]="";
	        }
	        var put_dept_opinion=params.put_dept_opinion;
	        var pdo=getCurrentPageObj().find("#put_dept_opinion_reqDP").attr("placeHolder");
	        if(put_dept_opinion==pdo){
	        	params["put_dept_opinion"]="";
	        }
	   baseAjaxJsonp(dev_construction+"requirement_accept/submitDistribute.asp?SID="+SID, params , function(data) {
			if (data != undefined && data != null && data.result=="true") {
				
					if (data != undefined && data != null && data.result=="true"){
						alert("保存并提交成功");
						closePageTab("req_dispense");
					}else{
						var mess=data.mess;
						alert("保存提交失败:"+mess);
					}
			  }
		});
	 }); 
	
	
	//需求收益评估为否时隐藏收益估算和评估理由
	/*getCurrentPageObj().find('#req_income_reqDP2').click(function(){
		getCurrentPageObj().find('#req_incomedp_hide').hide();
		getCurrentPageObj().find('#req_income_dp').hide();
		getCurrentPageObj().find("#req_income_reqDP").removeAttr("validate");
		getCurrentPageObj().find("#req_income_reqDP").val("");
		getCurrentPageObj().find('#req_income_doc_reqDP').parent().parent().hide();
		getCurrentPageObj().find("#req_income_doc_reqDP").removeAttr("validate");
		getCurrentPageObj().find("#req_income_doc_reqDP").val("");
		getCurrentPageObj().find('#req_remark_dp').hide();
		getCurrentPageObj().find('#req_remark_dp+strong').hide();
	});
	//需求收益评估为是时显示收益估算和评估理由
	getCurrentPageObj().find('#req_income_reqDP1').click(function(){
		getCurrentPageObj().find('#req_incomedp_hide').show();
		getCurrentPageObj().find('#req_income_dp').show();
		getCurrentPageObj().find("#req_income_reqDP").attr("validate","v.required");
		getCurrentPageObj().find('#req_income_doc_reqDP').parent().parent().show();
		getCurrentPageObj().find("#req_income_doc_reqDP").attr("validate","v.required");
		getCurrentPageObj().find('#req_remark_dp').show();
		getCurrentPageObj().find('#req_remark_dp+strong').show();
	});*/
	//接受时隐藏退回原因,显示项目经理，需求优先级
	getCurrentPageObj().find('#req_dis_resultDp1').click(function(){
		getCurrentPageObj().find('#DPreturn_reason').parent().hide();
		getCurrentPageObj().find('#req_return_reasonDp').parent().hide();
		getCurrentPageObj().find('#req_return_reasonDp').val(" ");
		getCurrentPageObj().find('#req_return_reasonDp').select2();//清空退回原因的值
		//getCurrentPageObj().find('#req_product_managerDp1').parent().parent().show();
		getCurrentPageObj().find('#req_product_manager_hide').show();
		getCurrentPageObj().find('#req_product_managerDM1').parent().show();
		getCurrentPageObj().find('#req_product_managerDM1').attr("validate","v.required");
		getCurrentPageObj().find('#req_product_managerDM1+strong').show();
		//getCurrentPageObj().find('#req_scaleDp').attr("validate");
		getCurrentPageObj().find('#req_score_dp').parent().show();
		getCurrentPageObj().find('#req_scoreDp1').parent().show();
		getCurrentPageObj().find('#req_scoreDp1').attr("validate","v.required");
	});
	//退回时显示退回原因,隐藏指定产品经理和优先级以及清空值
	getCurrentPageObj().find('#req_dis_resultDp2').click(function(){
		getCurrentPageObj().find('#DPreturn_reason').parent().show();
		getCurrentPageObj().find('#req_return_reasonDp').parent().show();
		//getCurrentPageObj().find('#req_product_managerDp1').parent().parent().hide();
		getCurrentPageObj().find('#req_product_manager_hide').hide();
		getCurrentPageObj().find('#req_product_managerDM1').parent().hide();
		getCurrentPageObj().find('#req_product_managerDM1').val("");
		getCurrentPageObj().find('#req_product_managerDM1').select2();
		/*getCurrentPageObj().find('#req_product_managerDp').val("");*/
		//getCurrentPageObj().find('#req_scaleDp').val("");
		//getCurrentPageObj().find('#req_scaleDp').select2();
		getCurrentPageObj().find('#req_product_managerDM1').removeAttr("validate");
		getCurrentPageObj().find('#req_product_managerDM1+strong').hide();
		//getCurrentPageObj().find('#req_scaleDp').removeAttr("validate");
		getCurrentPageObj().find('#req_score_dp').parent().hide();
		getCurrentPageObj().find('#req_scoreDp1').parent().hide();
		getCurrentPageObj().find('#req_scoreDp1').val(" ");
		getCurrentPageObj().find('#req_scoreDp1').select2();
		getCurrentPageObj().find('#req_scoreDp1').removeAttr("validate");
		
	});
	//加载产品经理pop框
//	getCurrentPageObj().find('#req_product_managerDp1').click(function(){
//		openRoleUserPop("choseManager_pop",{no:getCurrentPageObj().find('#req_product_managerDp'),name:getCurrentPageObj().find('#req_product_managerDp1')},"0017");
//	});
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
function initReqScore(){
	var req_score=0;
	var dates=0;
	var req_come=getCurrentPageObj().find('#req_come_reqDP').val();
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
	var summit_time = getCurrentPageObj().find('#summit_dateDP').val();
	var startTime = new Date(summit_time.replace(/\-/gi,"/")).getTime();
	var operation_date = getCurrentPageObj().find('#req_operation_date_reqDP').val();
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
		initSelect(getCurrentPageObj().find("#req_scoreDp1"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQUIREMENT_LEVEL"},"01");
	}else if(req_score>=2&&req_score<4){
		initSelect(getCurrentPageObj().find("#req_scoreDp1"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQUIREMENT_LEVEL"},"02");
	}else if(req_score<2){
		initSelect(getCurrentPageObj().find("#req_scoreDp1"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQUIREMENT_LEVEL"},"03");
	}
}

//初始化需求收益评估样式
function initReqDisIncomeCss(){
	/*var req_income_flag=getCurrentPageObj().find('input:radio[name="DP.req_income_flag"]:checked').val();
	if(req_income_flag=='01'){//当需求收益为否时隐藏需求收益估算和理由
		getCurrentPageObj().find('#req_incomedp_hide').hide();
		getCurrentPageObj().find('#req_income_dp').hide();
		getCurrentPageObj().find("#req_income_reqDP").removeAttr("validate");
		getCurrentPageObj().find('#req_income_doc_reqDP').parent().parent().hide();
		getCurrentPageObj().find("#req_income_doc_reqDP").removeAttr("validate");
		getCurrentPageObj().find('#req_remark_dp').hide();
		getCurrentPageObj().find('#req_remark_dp+strong').hide();
	}*/
	getCurrentPageObj().find('#req_dis_resultDp1').attr("checked","true");//初始化分发结论为接受
	//隐藏退回原因
	getCurrentPageObj().find('#DPreturn_reason').parent().hide();
	getCurrentPageObj().find('#req_return_reasonDp').parent().hide();
}

