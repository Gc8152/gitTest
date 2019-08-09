var callTable=getMillisecond();
var SID=window.parent.SID;

function initRemindinfo(remind_type){
	if(remind_type!=""&&remind_type!=undefined){
		var url='myRemind/querySubRemindByType.asp?remind_type='+remind_type;
		initremindTable(url,remind_type);
	}
}
/**
 * 打开提醒的详情页面
 */
parent.window.selProjectInfo=function(index){
	var data=$("#contentHtml", parent.document).find("#remind_info").bootstrapTable("getData");
	var REMIND_TYPE=data[index].REMIND_TYPE;
	if(REMIND_TYPE!=""&&REMIND_TYPE!=undefined){
		if(REMIND_TYPE=='PUB2017143'){//需求审批
			var reqAprDetailCall=getMillisecond();
			window.parent.closeAndOpenInnerPageTab("reqApr_detail","需求审批查看详情页面","dev_construction/requirement/requirement_accept/requirement_approve/reqApr_detail.html",function(){
				baseAjaxJsonp(dev_construction+"requirement_splitreq/querySplitSubReqById.asp?SID="+SID+"&req_id="+data[index].B_ID+"&call="+reqAprDetailCall, null , function(data) {
					for ( var f in data) {
						var map=data[f];
						   if(f=="1"||f=="2"){
						     for(var k in map){
								var str=map[k];
								k = k.toLowerCase();//大写转换为小写
						    if(k=="req_datatable_flag"||k=="req_level"||k=="req_income_flag"||k=="req_dis_result"||k=="req_acc_result"){
						    	window.parent.getCurrentPageObj().find("input[name='APR."+k+"']"+"[value="+str+"]").attr("checked",true);
						    }else if(k=="req_id"){
						    	window.parent.getCurrentPageObj().find('#req_id_reqAPR').val(str);
						    }else if(k=="file_id"){
						    	window.parent.getCurrentPageObj().find('#file_id_reqAPR').val(str);
						    }else if(k=="file_id_assess"){
						    	window.parent.getCurrentPageObj().find('#file_id_reqAssAPR').val(str);
							}else if(k=="req_assess_level"){
								var num=str.split(",");
								for(var i=0;i<num.length;i++){
									window.parent.$("input[name='APR."+k+"']"+"[value="+num[i]+"]").attr("checked",true);
								}
							}else if(k=="req_type1"){
								if(str=='02'){
									getCurrentPageObj().find('#business_org_hide').hide();
									getCurrentPageObj().find('#APRproject_id_display').hide();
								}
							}else{
									window.parent.$("span[name='APR."+k+"']").text(str);
							}
						   }
						  }
						   if(f==1){
							 //初始化流程数据
							 window.parent.initTitle(map["INSTANCE_ID"]);
							 window.parent.initReqApprovalDetailInfo(map["INSTANCE_ID"],'0');
						   }
					    }
					window.parent.initReqApproveCss();//收益估算样式初始化
					window.parent.initReqDetailFileList(data[1]["REQ_STATE"]);//初始化文件列表
					window.parent.initReqApprovePlanList();//实施计划初始化
				},reqAprDetailCall);
			});
		}else if(REMIND_TYPE=='PUB2017144'){//SIT受理提醒
			window.parent.closeAndOpenInnerPageTab("view_Sit","查看SIT测试受理","dev_construction/sit_test_jn/sit_accept/sitAccept_edit.html",function(){
				var call = getMillisecond();
				baseAjaxJsonp(dev_construction+"GSitAccept/queryOneSitAccept.asp?call="+call+"&SID="+SID+"&sit_id="+data[index].B_ID,null, function(msg){
					if (msg != undefined && msg != null && msg.result=="true" ) {
						window.parent.getCurrentPageObj().find("#submit_sit").hide();
						window.parent.getCurrentPageObj().find("#acceot_describe").attr("disabled",true);
						window.parent.getCurrentPageObj().find("input[name='STATUS'][value="+msg.data.STATUS+"]").attr("checked",true); 
						window.parent.getCurrentPageObj().find("[name='STATUS']").attr("disabled",true);
						window.parent.initsitAcceptBtn(msg.data);
					}
				}, call);
				
			});
		}else if(REMIND_TYPE=='PUB2017145'){//SIT测试报告
			window.parent.closeAndOpenInnerPageTab("queryInfo","查看SIT测试报告","dev_construction/sit_test_jn/sit_report/sitreport_queryInfo.html",function(){
				var call = getMillisecond();
				baseAjaxJsonp(dev_construction+"GSitReport/queryOneSitReport.asp?call="+call+"&SID="+SID+"&req_task_id="+data[index].B_ID,null, function(msg){
					if (msg != undefined && msg != null && msg.result=="true" ) {
						window.parent.initviewsitReport(msg.data);
					}
				}, call);
			});
		}else if(REMIND_TYPE=='PUB2017146'){//UAT移交受理
			//window.parent.openInnerPageTab("noconformitemraise","不符合项提出","dev_project/qualityManage/noConformItemRaise/noConformItemRaise_queryList.html");
		}else if(REMIND_TYPE=='PUB2017147'){//UAT测试报告
			window.parent.closeAndOpenInnerPageTab("uatReport_detail","UAT报告详情页面","dev_construction/uat_test/uatreport/uatReport_detail.html",function(){
				var call = getMillisecond();
				var param = {"sub_req_id":data[index].B_ID};
				baseAjaxJsonp(dev_construction+'UatReport/queryOneReqSubReport.asp?call='+call+'&SID='+SID+"&sub_req_id="+data[index].B_ID,null, function(msg){
					if (msg != undefined && msg != null && msg.result=="true" ){
						//把json对象转为字符串后，转为小写
						var dataStr = JSON.stringify(msg.data).toLowerCase();
						//再转为json字符转
						var datas = JSON.parse(dataStr);
						window.parent.initUatReportSubReqInfo(datas);
						window.parent.initUatReportDetail(param);
					}
				}, call);
			});
		}else if(REMIND_TYPE=='PUB2017148' || REMIND_TYPE=='PUB2017149' || REMIND_TYPE=='PUB2017175'){//提交投产审批，投产审批完成，投产确认提醒
			var call = getMillisecond();
			baseAjaxJsonp(dev_construction+'sendProduceApply/queryOneSendProInfoforRemind.asp?call='+call+'&SID='+SID+"&audit_no="+data[index].B_ID,null, function(msg){
				if (msg != undefined && msg != null && msg.result=="true" ) {
					var row = msg.data;
					var is_instancy = row.IS_INSTANCY;
					if(is_instancy != '00'){//00:紧急投产，01:一般投产
						window.parent.closeAndOpenInnerPageTab("sendProduceApply_detail","投产信息查看页面","dev_construction/send_produce/sendproduceapply/sendProduceApply_detail.html",function(){
							window.parent.initSendProInfoDetail(row);
							if(row.APPROVE_STATUS!='01'){
								window.parent.initTitle(row["INSTANCE_ID"]);
								window.parent.initReqApprovalDetailInfo(row["INSTANCE_ID"]);
							} else {
								window.parent.getCurrentPageObj().find("#approve_tab").hide();
							}
						});
					}else{
						window.parent.closeAndOpenInnerPageTab("sendProduceApply_detail","投产信息查看页面","dev_construction/send_produce/sendproduceapply/instancy/instancySendProduce_detail.html",function(){
							window.parent.initInstancySendProInfoDetail(row);
							if(row.APPROVE_STATUS !='01'){
								window.parent.initTitle(row["INSTANCE_ID"]);
								window.parent.initAFApprovalInfo(row["INSTANCE_ID"],'0');
							} else {//未提交状态的不显示审批页签
								window.parent.getCurrentPageObj().find("#apptab").hide();
							}
						});
					}
					
				}
			}, call);
			
		}
		else if(REMIND_TYPE=='PUB2017150'){//形成执行评审结论
			var params = {};
			window.parent.closeAndOpenInnerPageTab("edit_jury","查看评审","dev_construction/jury/conductPR/juryInfo/preparePR_user.html",function(){
				params["jury_id"] = data[index].B_ID;
				var typeSave = 'jury_view';
				
				window.parent.findJuryAndTaskInfo(params,typeSave);
				//autoInitRadio("dic_code=G_DIC_JURY_TYPE",getCurrentPageObj().find("#jury_type2"),"G.jury_type",{labClass:"labelRadio",type:"update",value:"01"});
				window.parent.getCurrentPageObj().find("#tr_feedback2").show();
				window.parent.getCurrentPageObj().find("#tab_jury_defect").show();  //显示缺陷tab
				window.parent.getCurrentPageObj().find("#tab_finish_jury").show();
				window.parent.getCurrentPageObj().find("#jury_save_D").hide(); //隐藏保存，返回选项
				
				window.parent.getCurrentPageObj().find("#tab_jury_conclusion").show();
				window.parent.getCurrentPageObj().find('#myJuryTab a:last').tab('show');
				window.parent.defectInfo(params["jury_id"]);
				
				window.parent.getCurrentPageObj().find("#defect_query_info").hide();
				window.parent.getCurrentPageObj().find("#defect_follow").hide();
				
				//初始化文件列表
				var tablefile = window.parent.getCurrentPageObj().find("#table_file");
				window.parent.getFtpFileList(tablefile, window.parent.getCurrentPageObj().find("#fileview_modal"), window.parent.getCurrentPageObj().find("input[name=FILE_ID]").val(), "00");
				
			});
		}else if(REMIND_TYPE=='PUB2017151'){//需求入版通知
			window.parent.closeAndOpenInnerPageTab("versionDetail_view","需求任务入版详情","dev_construction/requirement/reqTask_intoVersion/taskVersion_detail.html",function(){
				var call = getMillisecond();
				baseAjaxJsonp(dev_construction+'reqtask_intoVersion/queryOneReqTask.asp?call='+call+'&SID='+SID+"&req_task_id="+data[index].B_ID,null, function(msg){
					if (msg != undefined && msg != null && msg.result=="true" ) {
						for(var k in msg.data){
							var str=msg.data[k];
							k = k.toLowerCase();//大写转换为小写
							 if(k=="req_code"){
								 window.parent.getCurrentPageObj().find('#TVDreq_code').text(str);
							}else if(k=="sub_req_code"){
								window.parent.getCurrentPageObj().find('#TVDsub_req_code').text(str);
							}else if(k=="version_content"){
								window.parent.getCurrentPageObj().find('#TVDversion_content').val(str);
							}else {
								window.parent.getCurrentPageObj().find("input[name='TVD."+k+"']").val(str);
							}
						}
						//初始化同个子需求下关联任务列表
						window.parent.initSubReqTaskList5Version();
					}
				}, call);
			});
		}else if(REMIND_TYPE=='PUB2017155'){//SIT测试移交
			var msg = data[index].B_NAME+"已经移交";
			window.parent.$.Zebra_Dialog(msg, {
				          'type':     'close',
				          'title':    '提示',
				          'buttons':  ['确定'],
				          'onClose':  function(caption) {
				          }
				      });
		}else if(REMIND_TYPE=='PUB2017156'){//变更审批
			var call = getMillisecond();
			baseAjaxJsonp(dev_project+'PChangeReq/queryOneApprove.asp?call='+call+'&SID='+SID+"&req_change_id="+data[index].B_ID,null, function(msg){
				window.parent.closeAndOpenInnerPageTab("changeReq_add","变更审批查看","dev_project/proReqChange/approve/reqChange_appDetil.html",function(){
					var data=msg.data;
					for (var k in data) {
						if(k!="0" && k!="CHANGE_SUBTYPE" && k!="VERSION_ID" && k!="SYSTEM_ID"&& k!="REQ_CHANGE_ID"){
							var str = data[k];
							k = k.toLowerCase();
							window.parent.getCurrentPageObj().find("#"+k).html(str);
						}
					}	
					window.parent.getCurrentPageObj().find("#version_id").val(data["VERSIONS_ID"]);
					window.parent.initTitle(data["INSTANCE_ID"]);
					window.parent.initAFApprovalInfo(data["INSTANCE_ID"],'0');
					
					window.parent.initChangeButtonEvent(data["REQ_CHANGE_ID"]);
				});
			}, call);
		}else if(REMIND_TYPE=='PUB2017157'){//接口使用申请单结果提醒
			var call = getMillisecond();
			baseAjaxJsonp(dev_application+'useApplyManage/queryOneUseApp.asp?call='+call+'&SID='+SID+"&record_app_num="+data[index].B_ID,null, function(msg){
				window.parent.window.parent.closeAndOpenInnerPageTab("ApplyAddOrder_appList","查看申请单","dev_application/useInterfaceApply/useInterfaceApply_view.html",function(){
					window.parent.initUseAppView(msg.data);
				});
			}, call);
		}else if(REMIND_TYPE=='PUB2017158'){//接口申请结果提醒
		    var call = getMillisecond()+'1';
			baseAjaxJsonp(dev_application+'IAnalyse/queryOneAnalyse.asp?call='+call+'&SID='+SID+"&app_id="+data[index].B_ID,null, function(msg){
				window.parent.closeAndOpenInnerPageTab("AnalynedDesign", "分析设计查看","dev_application/interAnalyseDesignQuery/AnalysedDesign_queryInfo.html",function(){
					
					window.parent.initAnalyDesignDetail(msg.data,"view");
					var modObj = window.parent.getCurrentPageObj().find("#AnlyseInterInfo_table1");
					if(msg.data.APP_TYPE != "00"){//非新建接口通过接口id与版本查询属性信息
						window.parent.inter360initAttrTable(msg.data.INTER_ID,msg.data.INTER_VERSION,modObj,"table[tb=AnlyseInterInfo] tbody","");
					}else{//新建接口通过app_id查询属性信息
						window.parent.inter360initAttrTable("","",modObj,"table[tb=AnlyseInterInfo] tbody",msg.data.APP_ID);
					}
					window.parent.getCurrentPageObj().find("input,select,textarea").not("[name='closePageTabConfirm']").attr("disabled","disabled");
					window.parent.getCurrentPageObj().find("#submitAnalyse").hide();
			
				
					window.parent.initAnalyDesignDetail(seles[0],"view");
					var modObj = getCurrentPageObj().find("#AnlyseInterInfo_table1");
					if(seles[0].APP_TYPE != "00"){//非新建接口通过接口id与版本查询属性信息
						inter360initAttrTable(seles[0].INTER_ID,seles[0].INTER_VERSION,modObj,"table[tb=AnlyseInterInfo] tbody","");
					}else{//新建接口通过app_id查询属性信息
						inter360initAttrTable("","",modObj,"table[tb=AnlyseInterInfo] tbody",seles[0].APP_ID);
					}
					getCurrentPageObj().find("input,select,textarea").not("[name='closePageTabConfirm']").attr("disabled","disabled");
					getCurrentPageObj().find("#submitAnalyse").hide();
				});
			}, call);
		}else if(REMIND_TYPE=='PUB2017159'){//接口变更申请单结果提醒
			var call = getMillisecond()+'1';
			baseAjaxJsonp(dev_application+'InterchangeApp/queryOneChangeApp.asp?call='+call+'&SID='+SID+"&record_app_num="+data[index].B_ID,null, function(msg){
				window.parent.closeAndOpenInnerPageTab("addOrder_appList","查看申请单","dev_application/changeInterfaceApply/changeInterApply_check.html",function(){
				window.parent.initChangeAppLayOut(msg.data,"view");
				window.parent.getCurrentPageObj().find("#chaeinterApp1").hide();
				window.parent.getCurrentPageObj().find("#chaeinterApp2").hide();
				window.parent.getCurrentPageObj().find("#InputContentView").hide();
				window.parent.getCurrentPageObj().find("#OutputContentView").hide();
				window.parent.getCurrentPageObj().find("input,select,textarea").not("[name='closePageTabConfirm']").attr("disabled","disabled");
				});
			}, call);
		}else if(REMIND_TYPE=='PUB2017160' || REMIND_TYPE=='PUB2017161'){//接口已可用,投产确认后提醒;接口已成功变更,投产确认后提醒
			var call = getMillisecond()+'1';
			baseAjaxJsonp(dev_application+'InterQuery/queryOneInter.asp?call='+call+'&SID='+SID+"&inter_id="+data[index].B_ID,null, function(msg){
				window.parent.closeAndOpenInnerPageTab("interfaceinfo_360mesbasic","接口信息查询","dev_application/interfaceInfo/interfaceinfo_360mesbasic.html",function(){
					var id = msg.send.INTER_ID;
					var version = msg.send.INTER_VERSION;
					var modObj = window.parent.getCurrentPageObj().find("#inter360_basic_table");
					window.parent.Inter360InfoDetail(id);
					window.parent.inter360initAttrTable(id,version,modObj,"table[tb=360attrTable] tbody",null);
					//报文输入输出信息
					window.parent.initImportContentQuery(id,"AImportContentList",version);
					window.parent.initExportContentQuery(id,"AExportContentList",version);
					//接口调用关系查询
					window.parent.initInter_useRelationQuery(id);
					//接口版本信息
					window.parent.initVersionListTable(id);
					//变更列表信息
					window.parent.initExchangeListQuery(id);
				});
			}, call);
		}else if(REMIND_TYPE=='PUB2017261'){//SIT配置不通过
			var call = getMillisecond()+'1';
			baseAjaxJsonp(dev_construction+'GSitDeploy/queryOneDeploy.asp?call='+call+'&SID='+SID+"&sit_id="+data[index].B_ID,null, function(msg){
				window.parent.closeAndOpenInnerPageTab("view_Sit","查看SIT测试移交信息","dev_construction/sit_test_jn/sit_submit/sitsubmit_queryInfo.html",function(){
					window.parent.initsitSubMitInfoBtn(msg.data);
					window.parent.getCurrentPageObj().find("#submit_sit").hide();
					window.parent.getCurrentPageObj().find("#acceot_describe").attr("disabled",true);
					window.parent.getCurrentPageObj().find("#accept_conclusion").attr("disabled",true);
				});
			}, call);
		}else if(REMIND_TYPE=='PUB2017162'){//SIT部署验证不通过
			var call = getMillisecond()+'1';
			baseAjaxJsonp(dev_construction+'GSitDeploy/queryOneDeploy.asp?call='+call+'&SID='+SID+"&sit_id="+data[index].B_ID,null, function(msg){
				window.parent.closeAndOpenInnerPageTab("edit_Sit","SIT测试验证部署","dev_construction/sit_test_jn/sit_deploy/sitDeploy_edit.html",function(){
					window.parent.initsitDeployBtn(msg.data);
					window.parent.getCurrentPageObj().find("#submit_sit").hide();
					window.parent.getCurrentPageObj().find("#TEST_URL").attr("disabled",true);
					window.parent.getCurrentPageObj().find("#deploy_desc").attr("disabled",true);
				});
			}, call);
		}else if(REMIND_TYPE=='PUB2017163'){//设计开发文档上传
			var call = getMillisecond()+'1';
			baseAjaxJsonp(dev_construction+'GTaskPhased/queryOneRecord.asp?call='+call+'&SID='+SID+"&req_task_id="+data[index].B_ID+"&type=1",null, function(msg){
				window.parent.closeAndOpenInnerPageTab("task_analyze_info","设计开发文档上传","dev_construction/requirement/reqTask_phased/summary/task_summary_info.html",function(){
					var params = {};
					params['req_task_id'] = msg.data["REQ_TASK_ID"];
					params["phased_state"] = "05";
					params['req_task_code'] = msg.data["REQ_TASK_CODE"];
					//文档所处阶段
					params['phase']='05';
					//路径id
					params['path_id']='GZ1055';
					window.parent.queryTaskPhasedByIdTwo(params);//查询任务列表
					window.parent.initFtpFileListAndObject(params,"S_DIC_SYS_DESIGN_FILE");
					window.parent.getCurrentPageObj().find("#taskPhase_save").hide();
					window.parent.getCurrentPageObj().find("#add_file").hide();
					window.parent.getCurrentPageObj().find("#delete_file").hide();
					window.parent.getCurrentPageObj().find(".file_template_style").hide();
				});
			}, call);
		}else if(REMIND_TYPE=='PUB2017165'){//单元测试文档上传
			var call = getMillisecond()+'1';
			baseAjaxJsonp(dev_construction+'GTaskPhased/queryOneRecord.asp?call='+call+'&SID='+SID+"&req_task_id="+data[index].B_ID+"&type=2",null, function(msg){
				window.parent.closeAndOpenInnerPageTab("task_analyze_info","需求任务详情","dev_construction/requirement/reqTask_phased/reqTaskFile_info.html",function(){
					window.parent.viewPhaseTaskDetail('07',msg.data);
				});
			}, call);
		}else if(REMIND_TYPE=='PUB2017166'){//联调测试文档上传
			var call = getMillisecond()+'1';
			baseAjaxJsonp(dev_construction+'GTaskPhased/queryOneRecord.asp?call='+call+'&SID='+SID+"&req_task_id="+data[index].B_ID+"&type=3",null, function(msg){
				window.parent.closeAndOpenInnerPageTab("task_analyze_info","需求任务详情","dev_construction/requirement/reqTask_phased/reqTaskFile_info.html",function(){
					window.parent.viewPhaseTaskDetail('08',msg.data);
				});
			}, call);
		}else if(REMIND_TYPE=='PUB2017167'){//SIT测试案例文档上传
			var call = getMillisecond()+'1';
			baseAjaxJsonp(dev_construction+'GTaskPhased/queryOneRecord.asp?call='+call+'&SID='+SID+"&req_task_id="+data[index].B_ID+"&type=4",null, function(msg){
				window.parent.closeAndOpenInnerPageTab("task_analyze_info","测试案例文档上传","dev_construction/requirement/reqTask_phased/sitcase/task_sitcase_info.html",function(){
					var params = {};
					params['req_task_id'] =  msg.data["REQ_TASK_ID"];
					params["phased_state"]="09001";
					params['req_task_code'] = msg.data["REQ_TASK_CODE"];
					//文档所处阶段
					params['phase']='09001';
					//路径id
					params['path_id']='GZ1059001';
					window.parent.queryTaskPhasedByIdTwo(params);
					window.parent.initFtpFileListAndObject(params,"S_DIC_SIT_CASE_FILE");
					window.parent.getCurrentPageObj().find("#taskPhase_save").hide();
					window.parent.getCurrentPageObj().find("#add_file").hide();
					window.parent.getCurrentPageObj().find("#delete_file").hide();
					window.parent.getCurrentPageObj().find(".file_template_style").hide();
				});
			}, call);
		}else if(REMIND_TYPE=='PUB2017168' || REMIND_TYPE=='PUB2017169' ){
			window.parent.closeAndOpenInnerPageTab("annualversionplan","年度版本管理","dev_construction/versionManage/annualVersionManage/annualVersionPlan_queryList.html",function(){
			});
		}else if(REMIND_TYPE=="PUB2017190"){//文档审计
			window.parent.isRun=false;
			window.parent.closeAndOpenInnerPageTab("file_audit","产品审计","dev_project/qualityManage/productaudit/auditProductFile_queryList.html",function(){
				var b_code = data[index].B_CODE;
				window.parent.getCurrentPageObj().find("#business_code").val(b_code);
				window.parent.refreshAuditSearch();
			});
		}else if(REMIND_TYPE=="PUB2017193"){//文档审计通过提醒
			var stcall = getMillisecond()+'2';
			baseAjaxJsonp(dev_project+"qualityManager/queryProductFileList.asp?SID="+SID+"&call="+stcall+
					"&audit_id="+data[index].B_ID+"&business_code"+data[index].B_CODE,null, function(msg){
				var ids=JSON.stringify(msg.rows[0]);
				var params=JSON.parse(ids);
		  		params["view"] = "view";
				window.parent.closeAndOpenInnerPageTab("view_auditdetail","审计详情","dev_project/qualityManage/productaudit/excuteAudit_add.html",function(){
					window.parent.initAuditProductFileLayOut(params);
		  		});
			}, stcall);	
			/*var phase = data[index].REMIND_PHASE;
			if(phase=="03"){//需求分析审计通过
				window.parent.closeAndOpenInnerPageTab("task_analyze","需求任务分析","dev_construction/requirement/reqTask_phased/analyze/task_analyze_querylist.html",function(){
					var b_code = data[index].B_CODE;
					var b_code1 = b_code.substr(0,b_code.length-2);
					window.parent.getCurrentPageObj().find("#sub_req_codeTAN").val(b_code1);
				});
			}else if(phase=="05"){//设计开发
				window.parent.closeAndOpenInnerPageTab("task_total_design","设计开发报告管理","dev_construction/requirement/reqTask_phased/summary/task_summary_querylist.html",function(){
					var b_code = data[index].B_CODE;
					var b_code1 = b_code.substr(0,b_code.length-2);
					window.parent.getCurrentPageObj().find("#sub_req_codeZT").val(b_code1);
				});
			}else if(phase=="09001"){//sit案例
				window.parent.closeAndOpenInnerPageTab("sit_case","SIT案例管理","dev_construction/requirement/reqTask_phased/sitcase/task_sitcase_querylist.html",function(){
					var b_code = data[index].B_CODE;
					var b_code1 = b_code.substr(0,b_code.length-2);
					window.parent.getCurrentPageObj().find("#sub_req_codeSIT").val(b_code1);
				});
			}else if(phase=="12"){
				window.parent.closeAndOpenInnerPageTab("send_produce","投产发起","dev_construction/send_produce/sendproduceapply/sendProduceApply_queryList.html",function(){
					var b_code = data[index].B_CODE;
					window.parent.getCurrentPageObj().find("input[name='audit_no']").val(b_code);
				});
			}else{
				window.parent.closeAndOpenInnerPageTab("noConfirm_detail","质量不符项查询","dev_project/qualityManage/qualityQuery/qualityManage_queryList.html",function(){
					var b_code = data[index].B_CODE;
					window.parent.getCurrentPageObj().find("#business_code").val(b_code);
				});
			}*/
		}else if(REMIND_TYPE=="PUB2017201"){//质量不符合项关闭提醒
			window.parent.closeAndOpenInnerPageTab("noConfirm_detail","质量不符项查询","dev_project/qualityManage/qualityQuery/qualityManage_queryList.html",function(){
				var b_code = data[index].B_CODE;
				window.parent.getCurrentPageObj().find("#business_code").val(b_code);
			});
		}
		if(REMIND_TYPE=='PUB2017170'){//需求分析文档上传
			var call = getMillisecond()+'1';
			baseAjaxJsonp(dev_construction+'GTaskPhased/queryOneRecord.asp?call='+call+'&SID='+SID+"&req_task_id="+data[index].B_ID+"&type=5",null, function(msg){
					window.parent.closeAndOpenInnerPageTab("task_analyze_info","需求任务分析文档上传","dev_construction/requirement/reqTask_phased/analyze/task_analyze_info.html",function(){
						var params = {};
						params['req_task_id'] =  msg.data["REQ_TASK_ID"];
						params["phased_state"]="03";
						params['req_task_code']=msg.data["REQ_TASK_CODE"];
						//文档所处阶段
						params['phase']='03';
						//路径id
						params['path_id']='GZ1056';
						params['SYSTEM_NAME'] = msg.data["SYSTEM_NAME"];
						window.parent.getCurrentPageObj().find("#phased_state").val("03");
						window.parent.getCurrentPageObj().find("#req_task_id").val(msg.data["REQ_TASK_ID"]);//给记录req_task_id
						window.parent.queryTaskPhasedByIdTwo(params);
						window.parent.initFtpFileListAndObject(params,"S_DIC_REQ_ANL_FILE");
						window.parent.getCurrentPageObj().find("#taskPhase_save").hide();
						window.parent.getCurrentPageObj().find("#add_file").hide();
						window.parent.getCurrentPageObj().find("#delete_file").hide();
						window.parent.getCurrentPageObj().find(".file_template_style").hide();
					});
			}, call);
		}
		if(REMIND_TYPE=='PUB2017171'){//任务受理
			baseAjax("myRemind/deleteSubRemind.asp?id="+data[index].ID+"&remind_type="+REMIND_TYPE,{}, function(m){
				 if(m.result=='true'){
				 }else{
				 }
			 });
			window.parent.closePageTab("req_taskDetail");
			window.parent.closeAndOpenInnerPageTab("req_taskDetail","任务详情页面","dev_construction/requirement/requirement_analyze/task_accept/task_detail.html",function(){
				window.parent.initReqTaskDetailLayout(data[index].B_ID);
			});
		}
		if(REMIND_TYPE=='PUB2017172'){//SIT待移交提醒
			window.parent.closeAndOpenInnerPageTab("sitsubmit","SIT测试移交","dev_construction/sit_test_jn/sit_submit/sitsubmit_queryList.html",function(){
			});		
		}
		if(REMIND_TYPE=='PUB2017173' || REMIND_TYPE=='PUB2017225'){//待提交投产提醒,版本冻结成功可提交投产提醒
			window.parent.closeAndOpenInnerPageTab("sendproduceapply_querylist","投产申请","dev_construction/send_produce/sendproduceapply/sendProduceApply_queryList.html",function(){
			});
		}
		if(REMIND_TYPE=='PUB2017174'){//任务关闭提醒
			baseAjax("myRemind/deleteSubRemind.asp?id="+data[index].ID+"&remind_type="+REMIND_TYPE,{}, function(m){
				 if(m.result=='true'){
				 }else{
				 }
			 });
			window.parent.closePageTab("req_taskDetail");
			window.parent.closeAndOpenInnerPageTab("req_taskDetail","任务详情页面","dev_construction/requirement/requirement_analyze/task_accept/task_detail.html",function(){
				window.parent.initReqTaskDetailLayout(data[index].B_ID);
			  });
		}
		//项目立项
		if(REMIND_TYPE=='PUB2017176'){//项目立项审批通过提醒
			var call = getMillisecond()+'1';
			window.parent.closePageTab("approve_detail");
			baseAjaxJsonp(dev_project+'draftProApproval/queryListDraftPro.asp?call='+call+'&SID='+SID+"&draft_id="+data[index].B_ID,null, function(data){
				window.parent.openInnerPageTab("approve_detail","项目立项审批","dev_project/projectEstablishManage/projectApprove/projectApprove_detail.html",function(){
					var seles=data.seles;
					var seleData={seles:seles[0],type:"0"};
					window.parent.initprojectApproveBtn(seleData);
				});
			}, call);
			
		}
		if(REMIND_TYPE=="PUB2017187"){//项目管理岗立项提醒
			window.parent.iframeOpenTab("approve_queryList","项目创建","dev_project/projectEstablishManage/projectEstablish/projectEstablish_queryList.html");
			
		}
		
		if(REMIND_TYPE=='PUB2017178'){//计划变更提醒
			var call = getMillisecond()+'1';
			baseAjaxJsonp(dev_project+'proChange/queryOnerApprove.asp?call='+call+'&SID='+SID+"&change_id="+data[index].B_ID,null, function(msg){
				window.parent.closeAndOpenInnerPageTab("view_proChange","查看变更","dev_project/projectChangeManage/projectChangeApprove/proChangeApprove_detail.html",function(){
					window.parent.initTitle(msg.data["INSTANCE_ID"]);
					window.parent.initAFApprovalInfo(msg.data["INSTANCE_ID"],'0');
					window.parent.initviewproChange(msg.data);
				  });
			}, call);
		}
		if(REMIND_TYPE=='PUB2017179'){//需求变更审批结束提醒
			var call = getMillisecond()+'2';
			baseAjaxJsonp(dev_construction+"requirement_change/queryApproveList.asp?SID="+SID+"&call="+call+"&REQ_CHANGE_NUM="+data[index].B_CODE,null, function(msg){
				window.parent.closeAndOpenInnerPageTab("viewQuery","查看申请单","dev_construction/requirement/requirement_change/query/changeQuery_view.html",function(){
					window.parent.initTitle(msg.rows[0]["INSTANCE_ID"]);
					window.parent.initAFApprovalInfo(msg.rows[0]["INSTANCE_ID"],'0');
					window.parent.changeQueryView(msg.rows[0]);
				  });
			}, call);
		}
		if(REMIND_TYPE=='PUB2017182'){//问题受理提醒
			var calls = getMillisecond()+'1';
			baseAjaxJsonp(dev_project+'QuestionQuery/queryQuestionRecord.asp?call='+calls+'&SID='+SID+"&risk_id="+data[index].B_ID,null, function(data){
				if(data!=null&&data.rows!=null)	{
					var param =data.rows[0];
					if(param.RISK_STATUS=='03'){
						window.parent.closePageTab("questionRaise_detail");
						window.parent.closeAndOpenInnerPageTab("questionRaise_detail","问题详情","dev_project/questionManage/questionRaise/questionRaise_queryInfo.html",function(){
							
							window.parent.initQuestionRaiseOperateLogList(param.RISK_ID);
							window.parent.initqRQueryInfo(param);
						  });
					}
					else if(param.RISK_STATUS=='04'){
						window.parent.closePageTab("questionHandle_detail");
						window.parent.closeAndOpenInnerPageTab("questionHandle_detail","问题详情","dev_project/questionManage/questionHandle/questionHandle_queryInfo.html",function(){
							window.parent.initqHQueryInfo(param);
							window.parent.initqHInfoOperateLogList(param.RISK_ID);
							window.parent.initqHInfoHandelLogList(param.RISK_ID);
						  });
					}
				}
			}, calls);
		}
		if(REMIND_TYPE=='PUB2017183'){//问题处理提醒
			var calls = getMillisecond()+'1';
			baseAjaxJsonp(dev_project+'QuestionQuery/queryQuestionRecord.asp?call='+calls+'&SID='+SID+"&risk_id="+data[index].B_ID,null, function(data){
				if(data!=null&&data.rows!=null)	{
					var param =data.rows[0];
					//问题处理中
					if(param.RISK_STATUS=='05'){
						window.parent.closePageTab("questionHandle_detail");
						window.parent.closeAndOpenInnerPageTab("questionHandle_detail","问题详情","dev_project/questionManage/questionHandle/questionHandle_queryInfo.html",function(){
							window.parent.initqHQueryInfo(param);
							window.parent.initqHInfoOperateLogList(param.RISK_ID);
							window.parent.initqHInfoHandelLogList(param.RISK_ID);
						  });
					}
					else if(param.RISK_STATUS=='06'){
						window.parent.closePageTab("questionValidate_detail");
						window.parent.closeAndOpenInnerPageTab("questionValidate_detail","问题详情","dev_project/questionManage/questionValidate/questionValidate_queryInfo.html",function(){
							window.parent.initqVQueryInfo(param);
							window.parent.initqVInfoOperateLogList(param.RISK_ID);
							window.parent.initqVInfoHandelLogList(param.RISK_ID);
						  });
					}
				}
			}, calls);}
		if(REMIND_TYPE=='PUB2017184'){//问题验证提醒
			var calls = getMillisecond()+'1';
			baseAjaxJsonp(dev_project+'QuestionQuery/queryQuestionRecord.asp?call='+calls+'&SID='+SID+"&risk_id="+data[index].B_ID,null, function(data){
				if(data!=null&&data.rows!=null)	{
					var param =data.rows[0];
					//问题重新打开
					if(param.RISK_STATUS=='07'){
						window.parent.closePageTab("questionAccept_detail");
						window.parent.closeAndOpenInnerPageTab("questionAccept_detail","问题详情","dev_project/questionManage/questionAccept/questionAccept_queryInfo.html",function(){
							
							window.parent.initqAQueryInfo(param);
							window.parent.initqAInfoOperateLogList(param.RISK_ID);
						  });
						
					}
					else if(param.RISK_STATUS=='08'){
						window.parent.closePageTab("questionQuery_queryInfo");
						window.parent.closeAndOpenInnerPageTab("questionQuery_queryInfo","问题详情","dev_project/questionManage/questionQuery/questionQuery_queryInfo.html",function(){
							
							window.parent.initQueryInfo(param);
							window.parent.initQuestionQueryHandleLogList(param.RISK_ID);
							window.parent.initQuestionQueryOperateLogList(param.RISK_ID);
						  });
					}
				}
			}, calls);}
		if(REMIND_TYPE=='PUB2017185'){//需求变更发起提醒
			var cally = getMillisecond()+'2';
			baseAjaxJsonp(dev_construction+"requirement_change/queryReqChangeList.asp?SID="+SID+"&call="+cally+"&REQ_CHANGE_NUM="+data[index].B_CODE,null, function(msg){
				window.parent.closeAndOpenInnerPageTab("viewApply","查看申请单","dev_construction/requirement/requirement_change/initiate/changeInitiate_view.html",function(){
					window.parent.changeInitiateView(msg.rows[0]);
				  });
			}, cally);
		}
		if(REMIND_TYPE=='PUB2017186'){//需求变更分析不通过
			var calle = getMillisecond()+'2';
			baseAjaxJsonp(dev_construction+"requirement_change/queryReqChangeList.asp?SID="+SID+"&call="+calle+"&REQ_CHANGE_NUM="+data[index].B_CODE,null, function(msg){
				window.parent.closeAndOpenInnerPageTab("viewAnalyze","查看申请单","dev_construction/requirement/requirement_change/analyze/changeAnalyze_view.html",function(){
					window.parent.changeAnalyzeView(msg.rows[0]);
				  });
			}, calle);
		}
		if(REMIND_TYPE=='PUB2017189'){//需求终止分析
			var calle = getMillisecond()+'2';
			baseAjaxJsonp(dev_construction+"req_terminate/queryReqTerminateList.asp?SID="+SID+"&call="+calle+"&REQ_TERMINATE_NUM="+data[index].B_CODE,null, function(msg){
				window.parent.closeAndOpenInnerPageTab("viewQuery","查看申请单","dev_construction/requirement/requirement_terminate/query/query_view.html",function(){
					window.parent.terQueryEdit(msg.rows[0]);
				  });
			}, calle);
		}
		if(REMIND_TYPE=='PUB2017203'){//生产版本同步
			var calle = getMillisecond()+'2';
			baseAjaxJsonp(dev_construction+"versionSync/queryVersionSyncList.asp?SID="+SID+"&call="+calle+"&SYNC_ID="+data[index].B_ID,null, function(msg){
				window.parent.closeAndOpenInnerPageTab("remindSync","查看","dev_construction/send_produce/produceversionsync/produceVersionSync_view.html",function(){
					window.parent.viewSyncEdit(msg.rows[0]);
				  });
			}, calle);
		}
	
		if(REMIND_TYPE=="PUB2017191"){//配置库待确认-提醒申请人
			window.parent.iframeOpenTab("config_confirm","申请单待确认提醒","dev_resourceManage/Configuration_database/ConfigurationConfirm_querylist.html");
		}
		if(REMIND_TYPE=='PUB2017204'){//配置不符合项验证提醒
			var calls = getMillisecond()+'1';
			baseAjaxJsonp(dev_project+"NotconformRaise/notconformRaiseFindRecordById.asp?call="+calls+"&SID="+SID+"&CONFIG_ID="+data[index].B_ID,null, function(result){

				if(result!=null){
				if(result.STATUS=='08'){
						window.parent.closePageTab("noconfigManageQuery_queryInfo");
						window.parent.closeAndOpenInnerPageTab("noconfigManageQuery_queryInfo","不符合项详情","dev_project/configManage/noconfigManageQuery/noconfigManageQuery_queryInfo.html",function(){
						window.parent.initNoconfigQueryInfoLayout(result);
						window.parent.initNcmqinfoTable(result.CONFIG_ID);
						  });
					}
				}
			}, calls);}
	/*	
		if(REMIND_TYPE=='PUB2017191'){//提醒
			var call = getMillisecond()+'1';
			window.parent.closePageTab("config_detail");
			baseAjaxJsonp(dev_resource+'ConfigApply/queryConfigConfirm.asp?call='+call+'&SID='+SID+"&CONFIG_ID="+data[index].B_ID,null, function(data){
				window.parent.openInnerPageTab("config_detail","配置库确认","dev_resourceManage/Configuration_database/ConfigurationConfirm_querylist.html",function(){
					var seles=data.seles;
					var seleData={seles:seles[0],type:"0"};
					window.parent.initprojectApproveBtn(seleData);
				});
			}, call);
			
		}*/
		
		if(REMIND_TYPE=='PUB2017194'){//应用变动提醒
			window.parent.closeAndOpenInnerPageTab("app_management","应用管理","dev_application/applicationManager_querylist.html",function(){
			  });
		}
		if(REMIND_TYPE=='PUB2017205' || REMIND_TYPE=='PUB2017222'){//流申请结果提醒
			var stcall = getMillisecond()+'2';
			baseAjaxJsonp(dev_resource+"StreamApply/findOneStreamApply.asp?SID="+SID+"&call="+stcall+"&app_id="+data[index].B_CODE,null, function(msg){
				window.parent.closeAndOpenInnerPageTab("stream_view","查看流申请","dev_resourceManage/streamApply/streamApply_info.html",function(){
					window.parent.initStreamInfo(msg.rows);						
				});
			}, stcall);	
		}
		if(REMIND_TYPE=='PUB2017223' ){//审计不通过提醒
			var stcall = getMillisecond()+'2';
			baseAjaxJsonp(dev_project+"qualityManager/queryProductFileList.asp?SID="+SID+"&call="+stcall+
					"&audit_id="+data[index].B_ID+"&business_code"+data[index].B_CODE,null, function(msg){
				var ids=JSON.stringify(msg.rows[0]);
				var params=JSON.parse(ids);
		  		params["view"] = "view";
				window.parent.closeAndOpenInnerPageTab("view_auditdetail","审计详情","dev_project/qualityManage/productaudit/excuteAudit_add.html",function(){
					window.parent.initAuditProductFileLayOut(params);
		  		});
			}, stcall);	
			
		}
		//查看提醒消息后，删除提醒
		baseAjax("myRemind/deleteSubRemind.asp?id="+data[index].ID+"&remind_type="+REMIND_TYPE,{}, function(m){
			 if(m.result=='true'){
			 }else{
			 }
		 });
		
		
		
	}
};
parent.window.delopt=function (remind_type){
	parent.window.nconfirm('确定要清空数据吗？',function(){
		baseAjax('myRemind/deleteSubRemind.asp', {remind_type:remind_type} , function(data) {
		   if(data!=null&&data!=""&&data.result=="true"){
			   parent.window.closeCurrPageTab();
		    }else{
		    	parent.window.alert("清空失败！");
		    }
		   });
		
	});
};
/**
 * 初始提醒页面
 */
function initremindTable(url,remind_type){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$("#contentHtml", parent.document).find("#remind_info").bootstrapTable({
		//请求后台的URL（*）
		url : url,
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [10,15],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		onLoadSuccess:function(data){
			window.parent.gaveInfo();
		},
		columns : [{
			field : 'OPT_TIME',
			title : '提醒时间',
			align : "center",
			width : '20%'
		}, {
			field : "B_NAME",
			title : "提醒内容",
			align : "center",
			width : '70%',
		}, {
			field : "OPT",
			title : "<a style='color:#0088cc; cursor:pointer;' onclick=delopt('"+remind_type+"')>清空</a>",
			align : "center",
			width : '10%',
			formatter:function(value,row,index){				
				//var cfi_edit="<a class='fa fa-eye' id='notice_info' style='color:#0088cc; cursor:pointer;'  onclick='selProjectInfo("+index+");'>查看详情</a>";
				var cfi_edit="<a id='notice_info' style='color:#0088cc; cursor:pointer;'  onclick='selProjectInfo("+index+");'>查看详情</a>";
				return cfi_edit;	
			}	
		}]
	});	
}
	