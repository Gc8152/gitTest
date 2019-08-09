//查看需求详情
function viewReqDetailTD(){
	var ids=getCurrentPageObj().find('#TDreq_id').val();
	 closeAndOpenInnerPageTab("emReqApprFinish_detail","紧急需求审批查看详情页面","dev_construction/requirement/requirement_accept/requirement_approve/emReqList_detail.html",function(){
		 initEmReqDetailLayout(ids); 
	  });
}
//查看需求点详情	
function viewSubReqDetailTD(){
	var ids=getCurrentPageObj().find('#TDreq_id').val();
	closeAndOpenInnerPageTab("subreq_detail","需求点详情","dev_construction/requirement/requirement_analyze/split_subreq/splitSubreq_detail.html",function(){
		initSplitReqDetailLayOut(ids);
		});
}
//查看版本详情
function viewTaskVersionMsg(){
	var versions_id = getCurrentPageObj().find("input[name='TD.version_id']").val();
	baseAjaxJsonp(dev_construction+"reqtask_intoVersion/queryVersionOneById.asp?SID="+SID+"&versions_id="+versions_id, null , function(data) {
	  if (data != undefined && data != null && data.result=="true") {
		  closeAndOpenInnerPageTab("view_project","查看版本计划","dev_construction/versionManage/annualVersionManage/annualVersionPlan_queryInfo.html", function(){
	        initAnnualVersionViewEvent(data);
		  });
	  }else{
		alert("查询单个版本信息失败");
	  }
	});
}

//查看应用详情
function viewSystemDetail(){
	var system_id = getCurrentPageObj().find("#TDsystem_no").val();
	 closePageTab("viewApplication");
	  var appDetailCall=getMillisecond();
	  openInnerPageTab("viewApplication","查看详情","dev_application/application_queryInfo.html",function(){
		  baseAjaxJsonp(dev_application+"applicationManager/findApplicationById.asp?SID="+SID+"&system_id="+system_id+"&call="+appDetailCall, null , function(data) {
			  for ( var k in data) {
					 var str=data[k];
					  k = k.toLowerCase();
				if(k=="develop_tool"){
					initAPPSelect3(getCurrentPageObj().find("#APDdevelop_tool"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_DEVELOP_TOOL"},str);
				}else if(k=="develop_language"){
					initAPPSelect3(getCurrentPageObj().find("#APDdevelop_language"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_DEVELOP_LANGUAGE"},str);
				}else if(k=="mac_os"){	
					initAPPSelect3(getCurrentPageObj().find("#APDmac_os"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_MAC_OS"},str);
				}else if(k=="hardware_type"){
					initAPPSelect3(getCurrentPageObj().find("#APDhardware_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_HARDWARE_TYPE"},str);
				}else if(k=="among"){	
					initAPPSelect3(getCurrentPageObj().find("#APDamong"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_DEVELOP_AMONG"},str);
				}else if(k=="database"){	
					initAPPSelect3(getCurrentPageObj().find("#APDdatabase"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_DEVELOP_DATABASE"},str);
				}else if(k=="addr_type"){
					initCheckVis(getCurrentPageObj().find("#addrType"),{dic_code:"G_DIC_SYSTEM_CONFIG_TYPE"},"addrTypeName","addrType",str,"N");
				}else if(k=="system_id"){
					getCurrentPageObj().find("input[name='"+ k +"']").val(str);
					getCheckedAddr(str);
				}else if(k=="vob_info"){
					getCurrentPageObj().find("span[name='C."+ k +"']").html(str);
				}else if(k=="cc_server_url"){
					getCurrentPageObj().find("span[name='C."+ k +"']").html(str);
				}else if(k=="is_secientific_management"){
					if(str=="00"){
						str = "是";
					}else if(str=="01"){
						str = "否";
					}
					getCurrentPageObj().find("span[name='"+ k +"']").html(str);
				}/*else if(k=="system_profile"){
					getCurrentPageObj().find("textarea[name='UPP."+k+"']").val(str);
				}*/
				else {
					$("span[name="+k+" ]").text(str);
			   }
			  }
		
		  },appDetailCall);
	   });	
}

//查看任务详情
function viewTaskDetail1(){
	var req_task_id = getCurrentPageObj().find('#TDreq_task_id').val();
	closeAndOpenInnerPageTab("req_taskDetail","任务详情页面","dev_construction/requirement/requirement_analyze/task_accept/task_detail.html",function(){
		initReqTaskDetailLayout(req_task_id);
	  });
	
}
//SIT移交查询
function sitQuery(){
	var req_task_id=getCurrentPageObj().find("#TDreq_task_id").val();
	closeAndOpenInnerPageTab("sitsubmit_queryalllist","SIT移交查询","dev_construction/sit_test_jn/sit_submit/sitsubmit_queryListByTask.html",function(){
		initsitSubmitInfoByTask(req_task_id);
	});
}
//接口申请
function interUseApply(){
	 closeAndOpenInnerPageTab("ApplyAddOrder_appList","填写申请单","dev_application/useInterfaceApply/useInterfaceApply_edit.html", function(){
		 initUseAppOrderAddOrUpdateLayOut(null,"edit");
		});
 }
//投产单查询
function querySendProduce(){
	var req_task_id=getCurrentPageObj().find("#TDreq_task_id").val();
	closeAndOpenInnerPageTab("req_taskDetail","投产单查询","dev_construction/send_produce/sendproduceview/sendProduceView_queryListByTask.html",function(){
	getTaskQuery(req_task_id);
	});
}


var produce_standard = new Object();
//双月
produce_standard["02"] = [true, true, true, true, true, true, false, false, true, true, true, true, false, false];
//单月
produce_standard["03"] = [true, true, true, true, true, true, false, false, true, true, true, true, false, false];
//双周
produce_standard["04"] = [true, true, true, true, false, false, false, false, true, true, true, true, false, false];;
//1618
produce_standard["other"] = [true, true, true, true, true, true, true, true, true, true, true, true, true, true];

//查看投产条件
function viewSendProduceCondition(){
	var req_task_code = getCurrentPageObj().find("#TDreq_task_code").text();
	var detailTable = getCurrentPageObj().find("#sendProContentDetail");
	detailTable.find("#material_req_task_id").val(req_task_code);
	var mill = getMillisecond();
	baseAjaxJsonp(dev_construction+'sendProduceApply/queryTaskAppraiseAndDoc.asp?call='+mill+'&SID='+SID+'&req_task_code='+req_task_code,null, function(result){
		var trArr = detailTable.find("tbody tr");
		var len = trArr.length;
		var ps = produce_standard[result["VERSIONS_TYPE"]];
		if(typeof(ps)=="undefined"){
			ps = produce_standard["other"];
		}
		for(var i=0; i<len;i++){
			var $tr = $(trArr[i]);
			var trName = $tr.attr("name");
			var $phase_td = $tr.find("td[name=phase]");
			var $result_td = $tr.find("td[name=result]");
			var type = $tr.attr("type");
			var valObj = null; 
			if(type=="doc"){
				valObj = result["doc"][trName];
			} else if(type=="test"){
				valObj = result[trName];
			}
			var phase_val = "";
			var result_val = "";
			result_val = "不满足";
			if(typeof(valObj)!="undefined"&&valObj!=null){
				if(type=="doc"){
					phase_val = valObj.FILE_NAME;
					$phase_td.attr("file_id", valObj.FID);
					$phase_td.unbind("click").click(function(){
						verifyFileExit($(this).attr("file_id"));
					});
					result_val = "满足";
				} else if(type=="test"){
					phase_val = valObj=="00"?"通过":"不通过";
					result_val = valObj=="00"?"满足":"不满足";
				}
			} else {
				 if(type="doc"){
					phase_val = "必要";
				 }
				$phase_td.unbind("click");
			}
			$phase_td.html(phase_val);
			if(phase_val.indexOf(".")!=-1){
				$phase_td.css("color","blue");
			}
			result_val = ps[i]?result_val:"非必要";
			if(result_val=="不满足"){
				$result_td.css("color","red");
			} else {
				$result_td.css("color","black");
			}
			$result_td.html(result_val);
		}
		getCurrentPageObj().find("#modal_req_approve_and_doc").modal("show");
	}, mill);
}

/************************我的任务**************************/
//我的任务
function viewDetailPop(REQ_TASK_ID){
	var c = getCurrentPageObj().find("div[name='mt']");
	var req_task_relation = getCurrentPageObj().find("input[name='TD.req_task_relation']").val();
	c.removeClass("tag-blue");
	c.addClass("hide");
	var mileCall = getMillisecond();
	//查询里程碑阶段（任务字典）
	baseAjaxJsonp(dev_construction+"GFollowerTask/queryTaskInfomation.asp?SID="+SID+'&call='+mileCall+'&req_task_id='+REQ_TASK_ID+"&instance="+"00", null, function(data) {
    	if (data != undefined && data != null && data.result=="true") {
    		var stCall = getMillisecond();
    		var item = data.rows;
			// 流信息查询
			baseAjaxJsonp(dev_resource+'StreamApply/queryStreamApply.asp?SID='+SID+'&call='+stCall+'&system_id='+item.SYSTEM_NO+'&req_task_id='+REQ_TASK_ID+'&limit=5'+'&offset=0'+'&task_type_instance='+'00', null, function(data) {
		    	if (data != undefined && data != null && data.result=="true") {		
			    	var row = data.rows;
			    	if(row.length != 0){
			    		var stream_name = row[0]["STREAM_NAME"];
			    		if(stream_name == undefined || stream_name == '' ||stream_name== null){ //流在申请中
			    			getCurrentPageObj().find("#stream_applying").removeClass("hide");
			    		}else{
			    			getCurrentPageObj().find("span[name='stream_name']").text(stream_name);
			    		}
			    	}else{
			    		var cp = getCurrentPageObj().find("#d_stream_app");
						cp.removeClass("hide");
						cp.addClass("tag-blue");
						cp.unbind("click");
						cp.bind("click", function(){
							var InCall = getMillisecond();
							var pram = {};
							pram["system_no"] = getCurrentPageObj().find('#TDsystem_no').val();
							pram["system_name"] = getCurrentPageObj().find('#TDsystem_name').html();
							pram["req_task_id"] = getCurrentPageObj().find('#TDreq_task_id').val();
							pram["req_task_code"] = getCurrentPageObj().find('#TDreq_task_code').html();
							pram["req_task_name"] = getCurrentPageObj().find('#TDreq_task_name').html();
							baseAjaxJsonp(dev_construction+'req_taskaccept/insertStreamByMytask.asp?SID='+SID+'&call='+InCall,pram,function(data) {
								if (data != undefined && data != null && data.result=="true") {	
									alert("流申请提交成功，请等待配置管理员分配！");
									cp.addClass("hide");
									getCurrentPageObj().find("#stream_applying").removeClass("hide");
								}else{
									alert("申请失败！"+data.msg);
								}
							},InCall);
						});
			    	}
				}else{
					alert("流申请查询失败！");
				}
			},stCall);
			
    		var is_pmo = 0;
    		/*var pmoCall = getMillisecond();
			// 是否是pmo角色查询
			baseAjaxJsonp(dev_construction+"GFollowerTask/queryIsPMOOrNot.asp?SID="+SID+'&call='+pmoCall, null, function(data) {
		    	if (data != undefined && data != null && data.result=="true") {			
			    	is_pmo = data.count;
				}else{
					alert("查询失败！");
				}
			},pmoCall);*/
	    	var phase = data.rows["NEEDTODO"].split(",");
	    	//遍历阶段
	    	for(var k in phase){
	    		var p;
	    		//将里程碑中 任务阶段字典项和任务字典项匹配
	    		if(phase[k] == "01"){ //设计开发
	    			p = "05";
	    		}else if(phase[k] == "03"){ //编码开发
	    		    p = "07";
	    		}else if(phase[k] == "14"){ //联调测试
	    			p = "08";
	    		}else if(phase[k] == "04"){ //SIT测试
	    			p = "09";
	    		}else if(phase[k] == "05"){ //UAT测试
	    			p = "10";
	    		}else if(phase[k] == "15"){ //投产
	    			p = "12";
	    		}
	    		if(req_task_relation == '01'){//主办任务
	    			//p:任务状态，item:查询出的该任务的数据，is_pmo:是否是pmo角色（项目经理维度不会是PMO，stream_name:流名称
	    			needToCheck(p,item,is_pmo,stream_name);
	    		}/*else{//协办任务
	    			//协办任务只投产
    				needToCheck('12',item,is_pmo,stream_name);
	    		}*/
	    	}
	    	//协办任务只投产
	    	if(req_task_relation != '01'){
	    		needToCheck('12',item,is_pmo,stream_name);
	    	}
		}else{
			alert("任务查询失败！");
		}
	},mileCall);
}

//链接
function needToCheck(status,rows,is_pmo,stream_name){
	//SIT测试（需要先申请流）
	 if(status == '09' && (stream_name != null || stream_name != ' ' || stream_name != undefined)) {
		var sitCall = getMillisecond()+1;
		//SIT测试查询
		baseAjaxJsonp(dev_construction+"GTaskPhased/queryOneRecord.asp?SID="+SID+'&call='+sitCall+'&req_task_id='+rows.REQ_TASK_ID+'&type=4', null, function(data) {
	    	if (data != undefined && data != null && data.result=="true") {	
	    		var docUpLoad = false; //文档未上传
		    	var item = data.data;
		    	var status = item["STATUS"]; //移交状态
		    	var phased_state = item["PHASED_STATE"]; //案例文档
		    	if(phased_state == undefined || phased_state ==" " || phased_state ==null){
		    		docUpLoad = false;
		    	}else{	
		    		docUpLoad = true;
		    	}
	    		var jury_phased = item["JURY_PHASED"];	//评审
	    		var report = item["REPORT_ID"]; //报告
				//SIT移交（移交在途中被打回要重新移交），（在途不显示）
				if(status==" " || status==undefined || status==null || status == '02' || status == '05'){
					var cp = getCurrentPageObj().find("#d_sitTest_add");
					cp.removeClass("hide");
					cp.addClass("tag-blue");
					cp.unbind("click");
					cp.bind("click", function(){
						closeAndOpenInnerPageTab("add_Sit","移交SIT测试","dev_construction/sit_test_jn/sit_submit/emsitsubmit_add.html", function(){
							initemsitTurnoverBtn(null);
						});
					});
				}
				//SIT报告(SIT移交选择的测试经理)，(受理成功后上传)
				if((report==" " || report==undefined || report==null) && status == '04'){
					var cp = getCurrentPageObj().find("#d_sitTest_doc");
					var test_man = item["SIT_TEST_MAN_NAME"];
					if(test_man=="undefined"||test_man==undefined){
						test_man="暂未确定";
					}
					getCurrentPageObj().find("#s_sitTest_doc").text(":"+test_man);
					cp.removeClass("hide");
					//SIT移交选择的测试经理
			    	if(item["SIT_TEST_MAN"] == person_id){
			    		getCurrentPageObj().find("#s_sitTest_doc").remove();
			    		cp.addClass("tag-blue");
			    		cp.unbind("click");
						cp.bind("click", function(){
							closeAndOpenInnerPageTab("sittestreport_edit","SIT测试报告编辑","dev_construction/sit_test_jn/sit_report/sitreport_edit.html",function(){
								initSitTestReportInfoLayout(item[0]);
							});
						});
			    	}
				}
				//sit案例上传
				if(!docUpLoad){
					var cp = getCurrentPageObj().find("#d_sitTest_example");
					cp.removeClass("hide");
					//var test_man = item["SYS_TEST_MAN_NAME"];
					var test_man = item["SIT_TEST_MAN_NAME"];
					if(test_man=="undefined"||test_man==undefined){
						test_man="暂未确定";
					}
					getCurrentPageObj().find("#s_sitTest_example").text(":"+test_man);
					//if(rows.SYS_TEST_MAN == person_id){
					if(rows.SIT_TEST_MAN == person_id){
						getCurrentPageObj().find("#s_sitTest_example").remove();
						cp.addClass("tag-blue");
						cp.unbind("click");
						cp.bind("click", function(){
							closeAndOpenInnerPageTab("task_analyze_info","测试案例文档上传","dev_construction/requirement/reqTask_phased/sitcase/task_sitcase_info.html",function(){
								var params = {};
								params['req_task_id'] = item['REQ_TASK_ID'];
								params["phased_state"]="09001";
								params['req_task_code']=item['REQ_TASK_CODE'];
								//文档所处阶段
								params['phase']='09001';
								//路径id
								params['path_id']='GZ1059001';
								getCurrentPageObj().find("#phased_state").val("09001");
								getCurrentPageObj().find("#req_task_id").val(item['REQ_TASK_ID']);
								getCurrentPageObj().find("#sub_req_id").val(item['SUB_REQ_ID']);
								getCurrentPageObj().find("#b_code").val(item['SUB_REQ_CODE']);
								getCurrentPageObj().find("#b_name").val(item['SUB_REQ_NAME']);
								queryTaskPhasedByIdTwo(params);
								initFtpFileListAndObject(params,"S_DIC_SIT_CASE_FILE");
							});
						});
					}
				}
				//一级评审(应用中的测试经理)
				if(docUpLoad && (jury_phased==" " || jury_phased==undefined || jury_phased==null || jury_phased =='03')){
					var cp = getCurrentPageObj().find("#d_sitTest_exa_first");
					cp.removeClass("hide");
					//var test_man = item["SYS_TEST_MAN_NAME"];
					var test_man = item["SIT_TEST_MAN_NAME"];
					getCurrentPageObj().find("#s_sitTest_exa_first").text(":"+test_man);
					if(rows.SYS_TEST_MAN == person_id){
						getCurrentPageObj().find("#s_sitTest_exa_first").remove();
						cp.addClass("tag-blue");
						cp.unbind("click");
						cp.bind("click", function(){
							//页面跳转
							var records=null;
							baseAjaxJsonp(dev_construction+"GTaskPhased/queryTaskByReqId.asp?SID="+SID+"&req_task_id="+rows.REQ_TASK_ID+"&phased_state=09001", null , function(data) {
								if (data != undefined && data != null && data.result=="true") {
									records=data.rows;
									closeAndOpenInnerPageTab("edit_jury","发起测试案例一级评审","dev_construction/jury/conductPR/juryInfo/preparePR.html",function(){
										getCurrentPageObj().find('#req_task_state').val('09001');
										getCurrentPageObj().find("#jury_sava_type").val("jury_add");
										initSelect(getCurrentPageObj().find("#at_jury_grade"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_JURY_GRADE"},"01");
										var task_no = $.map(records, function (row) {
											var REQ_TASK_NAME = row.REQ_TASK_NAME;
											var REQ_TASK_RELATION_NAME = row.REQ_TASK_RELATION_NAME;
											var SYSTEM_NAME = row.SYSTEM_NAME;
											if(REQ_TASK_NAME == undefined) REQ_TASK_NAME="--";
											if(REQ_TASK_RELATION_NAME == undefined) REQ_TASK_RELATION_NAME="--";
											if(SYSTEM_NAME == undefined) SYSTEM_NAME="--";
											var trHtml="<tr id='row' align='center'><td style='text-align: center; '> <div class='form-control2' ><input name='check_task' value='"+row.REQ_TASK_ID+"' type='checkbox'/></div>"+
										    "</td><td style='text-align: center; '>"+REQ_TASK_NAME+
										    "</td><td style='text-align: center; '>"+row.REQ_TASK_CODE+
										    "</td><td style='text-align: center; '>"+row.SUB_REQ_CODE+
										    "</td><td style='text-align: center; '>"+REQ_TASK_RELATION_NAME+ 
										    "</td><td style='text-align: center; '>"+SYSTEM_NAME+
										    "</td><td style='text-align: center; '><span class='hover-view' onclick='viewJuryTaskDetail(\""+row.REQ_TASK_ID+"\",\""+row.REQ_TASK_CODE+"\",\""+req_task_state+"\");'>查看</span></td></tr>"; 
											 var flag = true;
											 var chobj= $("input[name='check_task']:checkbox"); 
										     chobj.each(function(){  
												if(row.REQ_TASK_ID==$(this).val()){
													flag=false;
												}
										     });
										     if(flag){
										    	 var $tr=$("#juryTasktable tr").eq("-1"); 
												$tr.after(trHtml);  
										     }
											return row.REQ_TASK_ID;                  
										});
										getCurrentPageObj().find("#system_id").val(item["SYSTEM_NO"]);
										getCurrentPageObj().find("#system_name").val(item["SYSTEM_NAME"]);
										getCurrentPageObj().find("#sponsor_id").val($("#currentLoginNo").val());
										getCurrentPageObj().find("#sponsor_name").val($("#currentLoginName").val());
									});
								}
							});	 
							
						});
					}
				}
				//二级评审(1618,PMO)
				if(jury_phased=="02" && rows.IS_1618 == '00'){
					var cp = getCurrentPageObj().find("#d_sitTest_exa_second");
					cp.removeClass("hide");
					if(is_pmo == "1"){
						cp.addClass("tag-blue");
						cp.unbind("click");
						cp.bind("click", function(){
							closeAndOpenInnerPageTab("d_sitTest_exa_second","SIT评审","dev_construction/requirement/reqTask_phased/sitcase/task_sitcase_querylist.html");
						});
					}
				}
	    	}else{
				alert("SIT测试查询失败！");
			}
		},sitCall);
	}
	
	//提交投产（需要先申请流）
	 if(status == '12' && (stream_name != null || stream_name != ' ' || stream_name != undefined)){
		var sendProductCall = getMillisecond();
		//提交投产查询
		baseAjaxJsonp(dev_construction+'GFollowerTask/querySendProductMsg.asp?call='+sendProductCall+'&SID='+SID+'&system_id='+rows.SYSTEM_NO+'&versions_id='+rows.VERSION_ID+'&req_task_id='+rows.REQ_TASK_ID+"&intance_send="+"00", null, function(data) {
			if (data != undefined && data != null && data.result=="true") {
				var row = data.row;
				if(row == null){//投产任务为空，显示投产待审计
					var au = getCurrentPageObj().find("#d_sendProduct_audit");
	    			au.removeClass("hide");
	    			var project_man = getCurrentPageObj().find("span[name='TD.project_man_name']").text();
	    			getCurrentPageObj().find("#s_sendProduct_audit").text(":"+project_man);
	    			//应用负责人
	    			if(rows.PROJECT_MAN_ID == person_id){
	    				getCurrentPageObj().find("#s_sendProduct_audit").remove();
	    				au.addClass("tag-blue");
	    				au.unbind("click");
	    				au.bind("click", function(){
	    					closeAndOpenInnerPageTab("sendProduceInstancy_add","发起紧急投产","dev_construction/send_produce/sendproduceapply/instancy/instancySendProduce_add.html",function(){
	    						initSendProduceInstancy_add();
	    				      });
	    				});
	    			}
				}else if(row != null){//投产任务不为空
		    		var status = row["APPROVE_STATUS"];
		    		if(status == '01' || status=='04'){//投产单状态为草拟或者打回状态，显示投产待提交
		    			var cp = getCurrentPageObj().find("#d_sendProduct_app");
		    			cp.removeClass("hide");
		    			var project_man = getCurrentPageObj().find("span[name='TD.project_man_name']").text();
		    			getCurrentPageObj().find("#s_sendProduct_app").text(":"+project_man);
		    			//应用负责人
		    			if(rows.PROJECT_MAN_ID == person_id){
		    				getCurrentPageObj().find("#s_sendProduct_app").remove();
		    				cp.addClass("tag-blue");
		    				cp.unbind("click");
		    				cp.bind("click", function(){
		    					closeAndOpenInnerPageTab("sendproduceapply_querylist","投产申请","dev_construction/send_produce/sendproduceapply/sendProduceApply_queryList.html",function(){
		    					});
		    				});
		    			}
		    		}
				}	
	    	}else{
				alert("提交投产查询失败！");
			}
		},sendProductCall);
	}
}
//是否绑定CC
