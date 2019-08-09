
var is_add = "";//初始化是否新增标识，用于第一次审计时点击提出不符合项后回到审计页面点击保存报错的情况
//初始化执行评审页面信息
function initAuditProductFileLayOut(params){
	var currTab = getCurrentPageObj();
	var phase = params.PHASE;
	var audit_id = params.AUDIT_ID;
	var business_code = params.BUSINESS_CODE;
	var audit_state = params.AUDIT_STATE;
	var view = params.view;
	var td1 = currTab.find("#td1");
	var td2 = currTab.find("#td2");
	var td3 = currTab.find("#td3");
	var td4 = currTab.find("#td4");
	if(phase=="0102"||phase == "12"){
		td1.html("业务编号：");
		if(phase == "12"){
			td2.html('<a id="business_code1"  name="business_code" style="color:blue" href="javascript:void(0)"></a>');
		}else{
			td2.html('<span id="business_code1"  name="business_code"  ></span>');
		}
		td3.html("文件名称：");
		td4.html('<span id="file_name"  name="file_name" ></span>');
	}else{
		td1.html('需求点编号：');
		td2.html('<a id="sub_req_code" name="sub_req_code" style="color:blue" href="javascript:void(0)"  ></a>');
		td3.html('需求点名称：');
		td4.html('<span id="sub_req_name"  name="sub_req_name" ></span>');
	}
	
	
	
	for(var k in params){
		var str=params[k];
		k = k.toLowerCase();//大写转换为小写
		if(k=="business_code"||k=="phase"||k=="audit_id"||k=="opt_person"||k=="p_owner_name"||k=="req_task_type"||k=="req_id"){//给隐藏项赋值
		  currTab.find("input[name='"+k+"']").val(str);
		}else if(k=="audit_conclusion"){
		  currTab.find("#audit_conclusion"+str).attr("checked",true);	
		}else if(k=="audit_remark"){
		  currTab.find("#remark").val(str);
		}
		if(k=="audit_id"){
			currTab.find("input[name='"+k+"']").attr("has", "has");
		}
		currTab.find("span[name='"+k+"']").text(str);
		currTab.find("a[name='"+k+"']").text(str);
		if(phase!="0102"||phase != "12"){
			if(k=="req_id"){
				currTab.find("a[name='sub_req_code']").attr('onclick','').click(eval(function(){ openSubReqDetail(); })); 
			}
		}
		if(phase == "12"){
			if(k=="business_code")
				currTab.find("a[name='business_code']").attr('onclick','').click(eval(function(){ openSendProDetail(); })); 
		}
		
	}
	/*if((audit_state==null||audit_state=="")&&params.view==undefined){//当审计状态为空且非查看按钮时生成审计id
	  initAuditId();//初始化审计id
	}*/
	initAuditProductFileCheck(phase,audit_state,view);//初始化审计检查项表
	initAuditTotalInfo(audit_id,phase);//初始化统计审计情况表
	initNoconfirmItemTable(business_code,phase);//初始化关联的不符合项表
	initHistoyTable(business_code,phase);//初始化关联的不符合项表
	
	//初始化附件列表
	getSvnFileList(currTab.find("#excuteaudit_tablefile"),currTab.find("#auditFile_viewfile_model"), params.BUSINESS_CODE, params.PHASE);
	if(view=="view"){//当点击的是查看详情按钮时
		currTab.find("#saveAuditCheck").hide();//隐藏保存按钮
		currTab.find("#finishAudit").hide();//隐藏完成审计按钮
		currTab.find("input[name='audit_conclusion']").attr("disabled",true);
		currTab.find("#remark").attr("readonly",true);
	}
	if(audit_id==null||audit_id==""){
		initAuditId();
	}
	//打开需求点详情页面
	function openSubReqDetail(){
		var req_task_type=currTab.find("#req_task_type").val();
		var ids=currTab.find("#req_id").val();
		if(req_task_type=="05"){
			closeAndOpenInnerPageTab("emsubreq_detail","紧急需求点详情","dev_construction/requirement/requirement_analyze/split_subreq/splitEmSubreq_detail.html",function(){
				initEmReqSplitDetail(ids);//初始化页面信息
				});	
		}else{
			closeAndOpenInnerPageTab("subreq_detail","需求点详情","dev_construction/requirement/requirement_analyze/split_subreq/splitSubreq_detail.html",function(){
				initSplitReqDetailLayOut(ids);
		
			});
		}	
	}
	
	//打开投产单详情页面
	function openSendProDetail(){
		var audit_no=currTab.find("a[name='business_code']").text();
		var item = {};
		item["AUDIT_NO"] = audit_no;
		closeAndOpenInnerPageTab("sendProduceApply_detail","投产信息查看页面","dev_construction/send_produce/sendproduceapply/sendProduceApply_detail.html",function(){
			initSendProInfoDetail(item);
			getCurrentPageObj().find("#approve_tab").hide();
		});
	}
	
	//初始化审计id
	function initAuditId(){
		var initAuditIdCall = getMillisecond();
		baseAjaxJsonp(dev_project+"qualityManager/createAuditId.asp?SID="+SID+"&call="+initAuditIdCall, null , function(data) {
	       if(data!=null&&data!=undefined&&data!=""){
	    	   getCurrentPageObj().find("#audit_id").val(data.audit_id);
	       }else{
	    	 alert("页面获取审计id失败");  
	       }
		},initAuditIdCall);	
	}
}

//初始化产品审计检查点表
function initAuditProductFileCheck(phase,audit_state,view){
 var auditFileCheckCall=getMillisecond();
 if(audit_state==null||audit_state==""){//当审计状态为待审计时
	baseAjaxJsonp(dev_project+"qualityManager/queryCheckByFilePhase.asp?SID="+SID+"&phase="+phase+"&call="+auditFileCheckCall, null , function(data) {
		             for(var i=0;i<data["rows"].length;i++){
		            	 var rowsData=data["rows"][i];
		            	 if(view=="view"){
		            		addAuditFileCheckTr1("productaudit_filecheck",rowsData);
		            	 }else{
		            	   addAuditFileCheckTr2("productaudit_filecheck",rowsData); 
		            	 }
	               }
			},auditFileCheckCall);
	
 }else{
	 var audit_id = getCurrentPageObj().find("#audit_id").val();
	 baseAjaxJsonp(dev_project+"qualityManager/queryCheckByAuditId.asp?SID="+SID+"&audit_id="+audit_id+"&phase="+phase+"&call="+auditFileCheckCall, null , function(data) {
         for(var i=0;i<data["rows"].length;i++){
        	 var rowsData=data["rows"][i];
        	 if(view=="view"){
        		 addAuditFileCheckTr1("productaudit_filecheck",rowsData); 
        	 }else{
        	   addAuditFileCheckTr2("productaudit_filecheck",rowsData); 
        	 }
       }
     },auditFileCheckCall); 
 }	
}

var count=1;//行数ID后缀  
var delid="";//删除的ID  
//组装审计检查点表
function addAuditFileCheckTr2(id,rowData){
 var space = "";
 var colseItemNum = rowData.COLSEITEMNUM;//不符合项关闭数
 var totalItemNum = rowData.TOTALITEMNUM;//不符合项数
 var is_feasibility = rowData.IS_FEASIBILITY;
 
 if(is_feasibility==undefined||is_feasibility==null){//首次执行审计
 var trhtml1=
	 '<tr>' +
	    '<input type="hidden" id="APis_add'+count+'" name="is_add" value="add">'+
		'<td align="center"><span class="form-control" id="auditcheck'+count+'" name="taskbox">'+count+'</span>' +
			'<input type="hidden" id="APcheck_id'+count+'" name="AP.check_id" value="'+(rowData?rowData.CHECK_ID:space)+'"></td>' +
		'<td><textarea  id="APcheck_name'+count+'" name="AP.check_name" readonly>'+(rowData?(rowData.CHECK_NAME==undefined?"该文档所处阶段没有配置相应的检查点，请到评审管理-评审库管理中进行相应的配置":rowData.CHECK_NAME):space)+'</textarea></td>' +	
		'<td><select  id="APis_feasibility'+count+'" name="AP.is_feasibility" onchange="changePass('+count+');"></select></td>' +
		'<td><select  id="APis_pass'+count+'" name="AP.is_pass"  onchange="changeNoConfirm('+count+');"></select></td>' +
 	    '<td><span  id="APtotalNoconfirm'+count+'" >'+(rowData?(colseItemNum==undefined?"0":colseItemNum):"0")+'/'+(rowData?(totalItemNum==undefined?"0":totalItemNum):"0")+'</span></td>' +
 	    '<td><span  id="APremark'+count+'" ><a style="color:blue" onclick="addNoConfirmItem('+count+');">添加不符合项</a></span></td>' +
     '</tr>'; 
    /*$("#"+id).append(trhtml1);*/
    getCurrentPageObj().find("#"+id).append(trhtml1);
    getCurrentPageObj().find("#APremark"+count).hide();
    initSelect(getCurrentPageObj().find("#APis_feasibility"+count),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_AUDIT_FEASIBILITY"});
    initSelect(getCurrentPageObj().find("#APis_pass"+count),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_ACCEPT_RESULT"});
    count++;
 }else{//保存了审计检查点表之后
	 var trhtml1=
		 '<tr>' +
		    '<input type="hidden" id="APis_add'+count+'" name="is_add" value="update">'+
			'<td align="center"><span class="form-control" id="auditcheck'+count+'" name="taskbox">'+count+'</span>' +
				'<input type="hidden" id="APcheck_id'+count+'" name="AP.check_id" value="'+(rowData?rowData.CHECK_ID:space)+'"></td>' +
			'<td><textarea  id="APcheck_name'+count+'" name="AP.check_name" readonly>'+(rowData?(rowData.CHECK_NAME=="undefined"?space:rowData.CHECK_NAME):space)+'</textarea></td>' +	
			'<td><select  id="APis_feasibility'+count+'" name="AP.is_feasibility" onchange="changePass('+count+');"></select></td>' +
			'<td><select  id="APis_pass'+count+'" name="AP.is_pass"  onchange="changeNoConfirm('+count+');"></select></td>' +
	 	    '<td><span  id="APtotalNoconfirm'+count+'" >'+(rowData?(colseItemNum==undefined?"0":colseItemNum):"0")+'/'+(rowData?(totalItemNum==undefined?"0":totalItemNum):"0")+'</span></td>' +
	 	    '<td><span  id="APremark'+count+'" ><a style="color:blue" onclick="addNoConfirmItem('+count+');">添加不符合项</a></span></td>' +
	     '</tr>'; 
	    /*$("#"+id).append(trhtml1);*/
	    getCurrentPageObj().find("#"+id).append(trhtml1);
	    initSelect(getCurrentPageObj().find("#APis_feasibility"+count),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_AUDIT_FEASIBILITY"},is_feasibility);
	    if(rowData.IS_PASS!=null&&rowData.IS_PASS!=undefined&&rowData.IS_PASS!=""){
	      initSelect(getCurrentPageObj().find("#APis_pass"+count),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_ACCEPT_RESULT"},rowData.IS_PASS);
	      if(rowData.IS_PASS=='00'){//检查点通过
	    	  getCurrentPageObj().find("#APremark"+count).hide(); 
	      }
	    }else{
	      initSelect(getCurrentPageObj().find("#APis_pass"+count),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_ACCEPT_RESULT"});	
	    }
	    if(is_feasibility=="01"){//检查点不适用
		      getCurrentPageObj().find("#APremark"+count).hide();
		      //getCurrentPageObj().find("#APtotalNoconfirm"+count).hide();
		      getCurrentPageObj().find("#APis_pass"+count).attr("disabled",true);
		 }
	    count++;
 }
}

//用于详情查看的检查点表
function addAuditFileCheckTr1(id,rowData){
	 var space = "";
	 var colseItemNum = rowData.COLSEITEMNUM;//不符合项关闭数
	 var totalItemNum = rowData.TOTALITEMNUM;//不符合项数
	 var is_feasibility = rowData.IS_FEASIBILITY;
	var trhtml1=
		 '<tr>' +
		    '<input type="hidden" id="APis_add'+count+'" name="is_add" value="update">'+
			'<td align="center"><span class="form-control" id="auditcheck'+count+'" name="taskbox">'+count+'</span>' +
				'<input type="hidden" id="APcheck_id'+count+'" name="AP.check_id" value="'+(rowData?rowData.CHECK_ID:space)+'"></td>' +
			'<td><textarea  id="APcheck_name'+count+'" name="AP.check_name" readonly>'+(rowData?(rowData.CHECK_NAME=="undefined"?space:rowData.CHECK_NAME):space)+'</textarea></td>' +	
			'<td><select  id="APis_feasibility'+count+'" name="AP.is_feasibility" disabled></select></td>' +
			'<td><select  id="APis_pass'+count+'" name="AP.is_pass"  disabled></select></td>' +
	 	    '<td><span  id="APtotalNoconfirm'+count+'" >'+(rowData?(colseItemNum==undefined?"0":colseItemNum):"0")+'/'+(rowData?(totalItemNum==undefined?"0":totalItemNum):"0")+'</span></td>' +
	 	    '<td><span  id="APremark'+count+'" ><a style="color:blue" >添加不符合项</a></span></td>' +
	     '</tr>'; 
	   /* $("#"+id).append(trhtml1);*/
		getCurrentPageObj().find("#"+id).append(trhtml1);
	    initSelect(getCurrentPageObj().find("#APis_feasibility"+count),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_AUDIT_FEASIBILITY"},is_feasibility);
	    if(rowData.IS_PASS!=null&&rowData.IS_PASS!=undefined&&rowData.IS_PASS!=""){
	      initSelect(getCurrentPageObj().find("#APis_pass"+count),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_ACCEPT_RESULT"},rowData.IS_PASS);
	      if(rowData.IS_PASS=='00'){//检查点通过
	    	  getCurrentPageObj().find("#APremark"+count).hide(); 
	      }
	    }else{
	      initSelect(getCurrentPageObj().find("#APis_pass"+count),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_ACCEPT_RESULT"});	
	    }
	    if(is_feasibility=="01"){//检查点不适用
		      getCurrentPageObj().find("#APremark"+count).hide();
		 }
	    count++;
}


//改变检查结果的可操作性
function changePass(num){
 var is_feasibility = getCurrentPageObj().find("#APis_feasibility"+num).val();	
	if(is_feasibility=="01"){//不适用则是否通过不可操作,删除不符合项统计和备注
		getCurrentPageObj().find("#APis_feasibility"+num).val(" "); 
		getCurrentPageObj().find("#APis_pass"+num).select2();
		getCurrentPageObj().find("#APis_pass"+num).val(" "); 
		getCurrentPageObj().find("#APis_pass"+num).select2();
		getCurrentPageObj().find("#APis_pass"+num).attr("disabled",true);
		getCurrentPageObj().find("#APremark"+num).hide();
		getCurrentPageObj().find("#APis_feasibility"+num).val("01");
		getCurrentPageObj().find("#APis_pass"+num).select2();
	}else if(is_feasibility=="00"){//适用则是否通过,可操作
		getCurrentPageObj().find("#APis_pass"+num).attr("disabled",false);
		getCurrentPageObj().find("#APis_pass"+num).val('00');
		getCurrentPageObj().find("#APis_pass"+num).select2();
	}
}

//是否可增加不符合项
function changeNoConfirm(num){
  	var is_pass = getCurrentPageObj().find("#APis_pass"+num).val();
  	if(is_pass=="01"){//不通过则显示添加不符合项
  	   getCurrentPageObj().find("#APremark"+num).show();
  	}else if(is_pass=="00"){
  	   getCurrentPageObj().find("#APremark"+num).hide();
  	}
}

//添加不符合项
function addNoConfirmItem(num){
	var currnTab = getCurrentPageObj();
	 var params = {};
	  params["audit_id"] = currnTab.find("#audit_id").val();
	  params["phase"] = currnTab.find("#phase").val();
	  params["business_code"] = currnTab.find("#business_code").val();
 	  var sub_req_code = currnTab.find("#sub_req_code").text();
 	  if(sub_req_code==undefined){
 		params["sub_req_code"]=" ";
 	  }else{
 	  	params["sub_req_code"]=sub_req_code;
 	  }
 	  params["audit_state"]="02";//初始化审计状态为审计中
 	  var check_id = "";
 	  var check_name = "";
 	  var is_feasibility = "";
 	  var is_pass = "";
	  var trs = currnTab.find("#productaudit_filecheck tbody tr");
	  for(var i=0,j=trs.length;i<j;i++){
		 var selects = $(trs[i]).find("select");
		 var inputs = $(trs[i]).find("input");
		 if(i==0){
			if(is_add==""){
			    is_add = $(inputs[0]).val();
			 }
			check_id = $(inputs[1]).val();
			check_name = $(trs[i]).find("textarea").val();
			is_feasibility = $(selects[0]).val();
			is_pass = $(selects[1]).val();
		 }else{
			check_id = check_id+","+$(inputs[1]).val();
			check_name = check_name+","+$(trs[i]).find("textarea").val();
			is_feasibility = is_feasibility+","+$(selects[0]).val();
			is_pass = is_pass+","+$(selects[1]).val();
		 }
	  }
	  params["check_id"] = check_id;
	  params["check_name"] = check_name;
	  params["is_feasibility"] = is_feasibility;
	  params["is_pass"] = is_pass;
	  params["is_add"] = is_add;
	  var saveAuditCheckCall = getMillisecond();
	  baseAjaxJsonp(dev_project+"qualityManager/saveOrUpdateAuditAndCheck.asp?SID="+SID+"&call="+saveAuditCheckCall, params , function(data) {
       if(data!=null&&data!=undefined&&data!=""&&data.result=="true"){
    	   is_add = "update";//保存成功后把是否新增标识改为更新，避免回到审计页面点击暂存或提交审计时报错
    	   var params = {};
    	     params["BUSINESS_CODE"] = getCurrentPageObj().find("#business_code").val();
    	     var phase = getCurrentPageObj().find("#phase").val();
    	     params["PHASES"] = phase.substring(0,2);//sit测试有5位（例如：09001），故此取阶段的前两位数
    	     params["CHECK_ID"] = getCurrentPageObj().find("#APcheck_id"+num).val();
    	     params["CHECK_NAME"] = getCurrentPageObj().find("#APcheck_name"+num).val();
    	     params["DUTY_USER_ID"] = getCurrentPageObj().find("#opt_person").val();
    	     params["DUTY_USER_NAME"] = getCurrentPageObj().find("#opt_person_name").val();
    	  closeAndOpenInnerPageTab("noConfirmItemAdd","新增不符合项","dev_project/qualityManage/noConformItemRaise/noConformItemRaise_add.html",function(){
    		for(var k in params){
    			var str = params[k];
    			getCurrentPageObj().find("input[name='"+k+"']").val(str);
    		}
    		getCurrentPageObj().find("#project_num_update").hide();
    		initSelect(getCurrentPageObj().find("select[name='TYP']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_TYP"},"02");
    		getCurrentPageObj().find("select[name='TYP']").attr("disabled","disabled");
    		getCurrentPageObj().find("#qualityTypChildTD").html("所属工作产品");
    		getCurrentPageObj().find("#qualityTypChildSelect").html('<select id="work_product" name="WORK_PRODUCT" diccode="P_DIC_QUALITY_WORK_PRODUCT" disabled></select>');
    		initSelect(getCurrentPageObj().find("select[name='WORK_PRODUCT']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_WORK_PRODUCT"},params.PHASES);
    		initSelect(getCurrentPageObj().find("select[name='GRADE']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_GRADE"});
    		document.getElementById("NoConfirmItem_").value="01";
    	  });
       }else{
    	 alert("保存审计信息失败，无法添加不符合项！");  
       }
     },saveAuditCheckCall);
  /*}else{//非首次执行审计，直接添加不符合项
	  var params1 = {};
	      params1["BUSINESS_CODE"] = getCurrentPageObj().find("#business_code").val();
	      params1["PHASES"] = getCurrentPageObj().find("#phase").val();
	      params1["CHECK_ID"] = getCurrentPageObj().find("#APcheck_id"+num).val();
	      params1["CHECK_NAME"] = getCurrentPageObj().find("#APcheck_name"+num).val();
	      params1["DUTY_USER_ID"] = getCurrentPageObj().find("#opt_person").val();
	      params1["DUTY_USER_NAME"] = getCurrentPageObj().find("#opt_person_name").val();
	  closeAndOpenInnerPageTab("noConfirmItemAdd","新增不符合项","dev_project/qualityManage/noConformItemRaise/noConformItemRaise_add.html",function(){
		for(var k in params1){
			var str = params1[k];
			getCurrentPageObj().find("input[name='"+k+"']").val(str);
		}
		getCurrentPageObj().find("#project_num_update").hide();
		initSelect(getCurrentPageObj().find("select[name='TYP']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_TYP"},"02");
		getCurrentPageObj().find("select[name='TYP']").attr("disabled",true);
		getCurrentPageObj().find("#qualityTypChildTD").html("所属工作产品");
		getCurrentPageObj().find("#qualityTypChildSelect").html('<select id="work_product" name="WORK_PRODUCT" diccode="P_DIC_QUALITY_WORK_PRODUCT" disabled></select>');
		
		if(params1.PHASES=="03"){
		     initSelect(getCurrentPageObj().find("select[name='WORK_PRODUCT']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_WORK_PRODUCT"},"03");
		}else if(params1.PHASES=="0101"){ 
			 initSelect(getCurrentPageObj().find("select[name='WORK_PRODUCT']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_WORK_PRODUCT"},"0101");
		}else if(params1.PHASES=="0102"){
			 initSelect(getCurrentPageObj().find("select[name='WORK_PRODUCT']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_WORK_PRODUCT"},"0102");
		}else if(params1.PHASES=="05"){
			 initSelect(getCurrentPageObj().find("select[name='WORK_PRODUCT']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_WORK_PRODUCT"},"05");
		}else if(params1.PHASES=="07"){
			 initSelect(getCurrentPageObj().find("select[name='WORK_PRODUCT']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_WORK_PRODUCT"},"07");
		}else if(params1.PHASES=="08"){
			 initSelect(getCurrentPageObj().find("select[name='WORK_PRODUCT']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_WORK_PRODUCT"},"08");
		}else if(params1.PHASES=="09001"){
			 initSelect(getCurrentPageObj().find("select[name='WORK_PRODUCT']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_WORK_PRODUCT"},"09001");
		}else if(params1.PHASES=="09002"){
			 initSelect(getCurrentPageObj().find("select[name='WORK_PRODUCT']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_WORK_PRODUCT"},"09002");
		}else if(params1.PHASES=="09003"){
			 initSelect(getCurrentPageObj().find("select[name='WORK_PRODUCT']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_WORK_PRODUCT"},"09003");
		}else if(params1.PHASES=="10"){
			 initSelect(getCurrentPageObj().find("select[name='WORK_PRODUCT']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_WORK_PRODUCT"},"10");
		}else if(params1.PHASES=="12"){
			 initSelect(getCurrentPageObj().find("select[name='WORK_PRODUCT']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_WORK_PRODUCT"},"12");
		}
	  });*/
		
  }

//更新任务状态
function intiTaskStatu(params){
	baseAjaxJsonp(dev_construction+"sendProduceVerify/saveItemAudit.asp?SID="+SID, params , function(data) {
		if (data != undefined && data != null && data.result=="true") {
			//alert("保存成功");
		}else{
			alert("更新任务状态失败");
			return;
		}
     });
}
//页面按钮事件
initAuditProductFileBtnEvent();
function initAuditProductFileBtnEvent(){
	
//保存产品审计(插入或更新审计表和审计检查点关联表)
getCurrentPageObj().find("#saveAuditCheck").click(function(){
	var currnTab = getCurrentPageObj();
	var params = {};
	params["audit_id"] = currnTab.find("#audit_id").val();
	params["phase"] = currnTab.find("#phase").val();
	params["business_code"] = currnTab.find("#business_code").val();
	params["remark"] = currnTab.find("#remark").val();
 	var sub_req_code = currnTab.find("#sub_req_code").text();
 	if(sub_req_code==undefined){
 		params["sub_req_code"]=" ";
 	}else{
 		params["sub_req_code"]=sub_req_code;
 	}
 	params["audit_state"]="02";//初始化审计状态为审计中
 	var check_id = "";
 	var check_name = "";
 	var is_feasibility = "";
 	var is_pass = "";
	var trs = currnTab.find("#productaudit_filecheck tbody tr");
	if(trs==undefined||trs.length==0||trs==null||trs==""){//无检查项
		alert("请先在评审管理——评审库管理需求分析评审过程中配置检查项！");
		return;
	}
	for(var i=0,j=trs.length;i<j;i++){
		var selects = $(trs[i]).find("select");
		var inputs = $(trs[i]).find("input");
		if(i==0){
			if(is_add==""){
			  is_add = $(inputs[0]).val();
			}
			check_id = $(inputs[1]).val();
			check_name = $(trs[i]).find("textarea").val();
			is_feasibility = $(selects[0]).val();
			is_pass = $(selects[1]).val();
		}else{
			check_id = check_id+","+$(inputs[1]).val();
			check_name = check_name+","+$(trs[i]).find("textarea").val();
			is_feasibility = is_feasibility+","+$(selects[0]).val();
			is_pass = is_pass+","+$(selects[1]).val();
		}
	}
	params["check_id"] = check_id;
	params["check_name"] = check_name;
	params["is_feasibility"] = is_feasibility;
	params["is_pass"] = is_pass;
	params["is_add"] = is_add;
	var saveAuditCheckCall = getMillisecond();
	
	var aaa=getCurrentPageObj().find("#remark").val();
    if(aaa.length>230){
    	alert("备注至多可输入230汉字！");
    	return;
    }
	
	baseAjaxJsonp(dev_project+"qualityManager/saveOrUpdateAuditAndCheck.asp?SID="+SID+"&call="+saveAuditCheckCall, params , function(data) {
       if(data!=null&&data!=undefined&&data!=""&&data.result=="true"){
    	   alert("保存成功！");
    	   closeCurrPageTab();
       }else{
    	 alert("保存失败！");  
       }
},saveAuditCheckCall);
});	


  //完成产品审计
  getCurrentPageObj().find("#finishAudit").click(function(){
	    var NoConfirmItem_ =getCurrentPageObj().find("#NoConfirmItem_").val();
	    var currnTab = getCurrentPageObj();
	 	var trsc = currnTab.find("#productaudit_filecheck tbody tr");
	 	if(trsc==undefined||trsc.length==0||trsc==null||trsc==""){//无检查项
			alert("请先在评审管理——评审库管理需求分析评审过程中配置检查项！");
			return;
		}
	 	for(var i=0,j=trsc.length;i<j;i++){
	 		var is_feasibility = currnTab.find("#APis_feasibility"+(i+1)).val();
	 		if(is_feasibility==" "){
	 			alert("您还有检查点是否适用未填！");
	 			return;
	 		}
	 		if(is_feasibility=='00'){//适用的情况下判断检查点是否填写
	 			var is_pass = currnTab.find("#APis_pass"+(i+1)).val();
	 			if(is_pass==" "){
		 			alert("您还有检查点是否通过未填！");
		 			return;
		 		}
	 		}
	 	}
	 	if(NoConfirmItem_=="01"){
	    	alert("不符合项已添加");
	    	closeCurrPageTab();
	    	return;
	    }
	 	var params = {};
	 	var check_id = "";
	 	var check_name = "";
	 	var is_feasibility = "";
	 	var is_pass = "";
	 	var is_add = "";
		var trs = currnTab.find("#productaudit_filecheck tbody tr");
		for(var i=0,j=trs.length;i<j;i++){
			var selects = $(trs[i]).find("select");
			var inputs = $(trs[i]).find("input");
			if(i==0){
				if(is_add==""){
				  is_add = $(inputs[0]).val();
				}
				check_id = $(inputs[1]).val();
				check_name = $(trs[i]).find("textarea").val();
				is_feasibility = $(selects[0]).val();
				is_pass = $(selects[1]).val();
			}else{
				check_id = check_id+","+$(inputs[1]).val();
				check_name = check_name+","+$(trs[i]).find("textarea").val();
				is_feasibility = is_feasibility+","+$(selects[0]).val();
				is_pass = is_pass+","+$(selects[1]).val();
			}
		}

		params["check_id"] = check_id;
		params["check_name"] = check_name;
		params["is_feasibility"] = is_feasibility;
		params["is_pass"] = is_pass;
		params["is_add"] = is_add;
		
	   var audit_conclusion = currnTab.find("input:radio[name='audit_conclusion']:checked").val();
	   if(audit_conclusion==""||audit_conclusion==undefined){
		   alert("请填写审计结论！");
		   return;
	   }
	   if(audit_conclusion=="01"){
		     var data = currnTab.find("#noConfirmItem_table").bootstrapTable("getData");
		     for(var i=0;i<data.length;i++){
			     var status = data[i].QUALITY_STATUS;
			     if(status!='07'){
				     alert("还有不符合项未关闭，审计结论不能是通过！");
				    return;
			     }
		     }
	    }
	    params["audit_id"] = currnTab.find("#audit_id").val();
	    params["phase"] = currnTab.find("#phase").val();
	    params["business_code"] = currnTab.find("#business_code").val();
 	    var sub_req_code = currnTab.find("#sub_req_code").text();
 	    if(sub_req_code==undefined){
 		   params["sub_req_code"]=" ";
 	    }else{
 		   params["sub_req_code"]=sub_req_code;
 	    }
	    params["audit_conclusion"] = audit_conclusion;
	    params["audit_state"] = "03";//审计状态为完成审计
	    
	    var remark = currnTab.find("#remark").val();
	    if(remark.length>230){
	    	alert("备注至多可输入230汉字！");
	    	return;
	    }
	    params["remark"] = remark;
	    /*.....提醒参数......*/
	    params["b_code"] = currnTab.find("#business_code").val();
	    params["b_id"] = currnTab.find("#audit_id").val();
	    params["phase"] = currnTab.find("#phase").val();
	    params["user_id"] = currnTab.find("#opt_person").val();
	    if(audit_conclusion=="01"||audit_conclusion=="02"){
	        if(params.phase=="03"||params.phase=="05"||params.phase=="09001"){
	          params["b_name"] = "编号为【"+params.b_code+"】的"+getCurrentPageObj().find("#file_type_display").text()+"已经审计通过,可发起二级评审";
	        }else if(params.phase=="12"){
	    	  params["b_name"] = "编号为【"+params.b_code+"】的投产单的投产类文件已经审计通过，提交投产成功！";
	        }else{
	    	  params["b_name"] = "编号为【"+params.b_code+"】的"+getCurrentPageObj().find("#file_type_display").text()+"已经审计通过";
	        }
	        params["remind_type"] = "PUB2017193";
	    }else if(audit_conclusion=="03"){
		    params["b_name"] = "编号为【"+params.b_code+"】的"+currnTab.find("#file_type_display").text()+"审计不通过";
		    params["remind_type"] = "PUB2017223";
	    }
	var updateAuditstateCall = getMillisecond();
	var is_has_audit_id = currnTab.find("#audit_id").attr("has");
	if(is_has_audit_id=="has"){
		params["is_add"] = "has"; 
	}
	
    baseAjaxJsonp(dev_project+"qualityManager/updateAuditStateById.asp?SID="+SID+"&call="+updateAuditstateCall, params , function(data) {
       if(data!=null&&data!=undefined&&data!=""&&data.result=="true"){
		   if(data.rows=="01"){
			   params["SUB_REQ_ID"]=data.sub_req_id;
			   intiTaskStatu(params);//更新任务状态
		   }
    	   if(params["phase"]=="12"){
    	       if(params["audit_conclusion"]=="01" || params["audit_conclusion"]=="02"){
	    		   commitForApprove(params);
	    		 
    	       } else {
    	           alert("完成审计成功！");
    	           closeCurrPageTab();
    	       }
    	   } else {
    		   alert("完成审计成功！");
    		   closeCurrPageTab();
    	   }
       }else{
    	 alert("保存失败！");  
       }
     },updateAuditstateCall);
	
	
    function commitForApprove(params){
    	var call = getMillisecond();
    	baseAjaxJsonp(dev_construction+'sendProduceApprove/excuteAuditEnd.asp?call='+call+'&SID='+SID+"&audit_no="+params["b_code"]+"&approve_status=02&as=01", null , function(data) {
			if (data != undefined && data != null && data.result=="true") {
				alert("保存并提交成功!");
				closeCurrPageTab();
			}else{
				alert("提交失败");
			}
		},call);  
    }
    
    
	/*******	提交投产	***************/
    /*function commitForApprove(params){
    	//先查询投产发起投产人机构编号
    	baseAjax("SUser/queryoneuser.asp", {"user_no":getCurrentPageObj().find("#opt_person").val()}, function(result){
			if(result!=null){
				var item = new Object();
		    	item["af_id"] = '63';//流程id
		    	item["systemFlag"] = '02'; //systemFlag：系统标识（合同系统：00，项目系统：01，报销系统：02，工程管理：03）
		    	item["biz_id"] = params["b_code"];//业务id
		    	var n_org = result["org_no"];
		    	item["n_org_gao"] = n_org.substring(0,6);//投产发起投产人机构编号
		    	//审批发起人
		    	item["actor_no"] = getCurrentPageObj().find("#opt_person").val();
		    	approvalProcess(item,function(data){
		    		var call = getMillisecond();
		    		baseAjaxJsonp(dev_construction+'sendProduceApprove/allowApprove.asp?call='+call+'&SID='+SID+"&audit_no="+item["biz_id"]+"&approve_status=02&as=01", null , function(data) {
		    			if (data != undefined && data != null && data.result=="true") {
		    				alert("保存并提交成功!");
		    				var call2 = getMillisecond()+'1';
		    				baseAjaxJsonp(dev_construction+'sendProduceApply/queryRemindUserByAuditNo.asp?call='+call2+'&SID='+SID+"&audit_no="+item["biz_id"], null , function(remiddata) {
		    					if (remiddata != undefined && remiddata != null && remiddata.result=="true") {
		    						//插入提醒
		    						var applyCall = getMillisecond()+'3';
		    						baseAjaxJsonp(dev_workbench+"Remind/remindAdd.asp?SID="+SID+"&call="+applyCall+"&remind_type=PUB2017148"+
		    								"&user_id="+remiddata.ids,params, function(mes){
		    							if (mes != undefined && mes != null && data.result=="true") {
		    								//投产审批插入提醒成功
		    							}
		    						}, applyCall);
		    					}
		    				},call2);
		    				closeCurrPageTab();
		    			}else{
		    				alert("提交失败");
		    				//alert("保存成功，提交失败，请在修改中维护");
		    				//closeCurrPageTab();
		    			}
		    		},call);  
		    	});
				
    		} else {
    			alert("查询机构编号为空，无法发起投产");
    		}
    	}, false);
    }*/
	/*******	提交投产	***************/
  });	

}

//初始化产品审计总体情况表
function initAuditTotalInfo(audit_id,phase){
	var queryParams = function(params) {
		var temp = {
			limit : params.limit, // 页面大小
			offset : params.offset
		// 页码
		};
		return temp;
	};
	var auditTotalCall = getMillisecond();
	getCurrentPageObj().find("#auditTotal_table").bootstrapTable("destroy").bootstrapTable({
				url :dev_project+"qualityManager/queryAuditTotalInfo.asp?SID="+SID+"&call="+auditTotalCall+"&audit_id="+audit_id+"&phase="+phase.substring(0,2),
				method : 'get', // 请求方式（*）
				striped : false, // 是否显示行间隔色
				cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, // 是否启用排序
				sortOrder : "asc", // 排序方式
				queryParams : queryParams,// 传递参数（*）
				sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
				pagination : true, // 是否显示分页（*）
				pageList : [ 5, 10, 15 ], // 可供选择的每页的行数（*）
				pageNumber : 1, // 初始化加载第一页，默认第一页
				pageSize : 10, // 每页的记录行数（*）
				clickToSelect : true, // 是否启用点击选中行
				// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
				uniqueId : "BUSINESS_CODE", // 每一行的唯一标识，一般为主键列
				cardView : false, // 是否显示详细视图
				detailView : false, // 是否显示父子表
				jsonpCallback:auditTotalCall,
				singleSelect : true,// 复选框单选
				onLoadSuccess:function(data){
					gaveInfo();
				},
				columns : [{
					field : 'BUSINESS_CODE',
					title : '业务编号',
					align : "center",
					visible:false,
				},{
					field : 'CHECK_NUM',
					title : '检查项总数',
					align : "center",
					width : 100,
				}, {
					field : 'APPLICABLE_NUM',
					title : '适用项数',
					align : "center",
					width : 120,
				}, {
					field : "PASS_NUM",
					title : "通过数",
					align : "center",
					width : 100,
				}, {
					field : "NOPASS_NUM",
					title : "不通过数",
					align : "center",
					width : 100,
				},{
					field : "PASSPERCENT",
					title : "通过率",
					align : "center",
					width : 100,
				},{
					field : "NOCONFIRM_NUM",
					title : "不符合项问题数",
					align : "center",
					width : 150,
				}, {
					field : "CLOSE_NUM",
					title : "关闭数",
					align : "center",
					width : 100,
				},{
					field : "CLOSEPERCENT",
					title : "关闭率",
					align : "center",
					width : 100,
				}]
			});
}

//初始化关联的不符合项表
function initNoconfirmItemTable(business_code,phase){
	var queryParams = function(params) {
		var temp = {
			limit : params.limit, // 页面大小
			offset : params.offset
		// 页码
		};
		return temp;
	};
	var auditNoconfirmItemCall = getMillisecond();
	getCurrentPageObj().find("#noConfirmItem_table").bootstrapTable("destroy").bootstrapTable({
				url :dev_project+"qualityManager/queryNoConfirmItemInfoByCodeAndPhase.asp?SID="+SID+"&call="+auditNoconfirmItemCall+"&business_code="+business_code+"&phase="+phase.substring(0,2),
				method : 'get', // 请求方式（*）
				striped : false, // 是否显示行间隔色
				cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, // 是否启用排序
				sortOrder : "asc", // 排序方式
				queryParams : queryParams,// 传递参数（*）
				sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
				pagination : true, // 是否显示分页（*）
				pageList : [ 5, 10, 15 ], // 可供选择的每页的行数（*）
				pageNumber : 1, // 初始化加载第一页，默认第一页
				pageSize : 10, // 每页的记录行数（*）
				clickToSelect : true, // 是否启用点击选中行
				// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
				uniqueId : "BUSINESS_CODE", // 每一行的唯一标识，一般为主键列
				cardView : false, // 是否显示详细视图
				detailView : false, // 是否显示父子表
				jsonpCallback:auditNoconfirmItemCall,
				singleSelect : true,// 复选框单选
				onLoadSuccess:function(data){
					gaveInfo();
				},
				columns : [{
					field: 'middle',
					checkbox: true,
					rowspan: 2,
					align: 'center',
					valign: 'middle',
				},{
					field : "BUSINESS_CODE",
					title : "业务编号",
					align : "center",
					width : 180,
				},{
					field : "NO_CONFORM_NAME",
					title : "不符合项名称",
					align : "center",
					width : 180,
				},{
					field : "CHECK_NAME",
					title : "检查点名称",
					align : "center",
					width : 180,
				},{
					field : "GRADE_NAME",
					title : "不符合项等级",
					align : "center",
					width : 150,
				},{
					field : "QUALITY_STATUS_NAME",
					title : "不符合项状态",
					align : "center",
					width : 150,
				},{
					field : "FIND_DATE",
					title : "发现日期",
					align : "center",
					width : 130,
				},{
					field : "PRESENT_USER_NAME",
					title : "提出人",
					align : "center",
					width : 90,
				},{
					field : "DUTY_USER_NAME",
					title : "责任人",
					align : "center",
					width : 90,
				},{
					field : "REALITY_FINISH_TIME",
					title : "实际解决日期",
					align : "center",
					width : 150,
				},{
					field : "DESCR",
					title : "备注",
					align : "center",
					width : 100,
				}, {
					field : "PROJECT_NAME",
					title : "项目名称",
					align : "center",
					width : 200,
				}]
			});
}

//初始化审计历史记录表
function initHistoyTable(business_code,phase){
	var queryParams = function(params) {
		var temp = {
			limit : params.limit, // 页面大小
			offset : params.offset
		// 页码
		};
		return temp;
	};
	var auditNoconfirmItemCall = getMillisecond();
	getCurrentPageObj().find("#histoy_table").bootstrapTable("destroy").bootstrapTable({
				url :dev_project+"qualityManager/queryHistoyByCodeAndPhase.asp?SID="+SID+"&call="+auditNoconfirmItemCall+"&business_code="+business_code+"&phase="+phase,
				method : 'get', // 请求方式（*）
				striped : false, // 是否显示行间隔色
				cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, // 是否启用排序
				sortOrder : "asc", // 排序方式
				queryParams : queryParams,// 传递参数（*）
				sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
				pagination : true, // 是否显示分页（*）
				pageList : [ 5, 10, 15 ], // 可供选择的每页的行数（*）
				pageNumber : 1, // 初始化加载第一页，默认第一页
				pageSize : 10, // 每页的记录行数（*）
				clickToSelect : true, // 是否启用点击选中行
				// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
				uniqueId : "BUSINESS_CODE", // 每一行的唯一标识，一般为主键列
				cardView : false, // 是否显示详细视图
				detailView : false, // 是否显示父子表
				jsonpCallback:auditNoconfirmItemCall,
				singleSelect : true,// 复选框单选
				onLoadSuccess:function(data){
					gaveInfo();
				},
				columns : [{
					field : "BUSINESS_CODE",
					title : "业务编号",
					align : "center",
					width : "15%",
				},{
					field : "PHASE_DISPLAY",
					title : "文档所处任务阶段",
					align : "center",
					width : "15%",
				},{
					field : "CONCLUSION_NAME",
					title : "审计结论",
					align : "center",
					width : "15%",
				},{
					field : "PERSION_NAME",
					title : "审计人",
					align : "center",
					width : "15%",
				},{
					field : "AUDIT_TIME",
					title : "审计时间",
					align : "center",
					width : "15%",
				},{
					field : "REMARK",
					title : "备注",
					align : "center",
					width : "25%",
				}]
			});
}



