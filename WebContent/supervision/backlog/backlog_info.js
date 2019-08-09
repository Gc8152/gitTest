var callTable=getMillisecond();
var SID=window.parent.SID;

function initBackloginfo(CATEGORY_CODE){
	if(CATEGORY_CODE!=""&&CATEGORY_CODE!=undefined){
		if(CATEGORY_CODE=='PUB2017125'){
			var url=dev_workbench+'Backlog/queryProjectBacklog.asp?call='+callTable+'&SID='+SID;
			initBacklogTable(url);
		}else if(CATEGORY_CODE=='PUB2017154'){
			var url=dev_workbench+'Backlog/queryRequirementBacklog.asp?call='+callTable+'&SID='+SID;
			initBacklogTable(url);
			//接口管理待办
		}else if(CATEGORY_CODE=='PUB2017121'){
			var url=dev_workbench+'Backlog/queryInterfaceBacklog.asp?call='+callTable+'&SID='+SID;
			initBacklogTable(url);
		}else if(CATEGORY_CODE=='PUB2017192'){//查询资源管理待办
			var url=dev_workbench+'Backlog/queryResourceBacklog.asp?call='+callTable+'&SID='+SID;
			initBacklogTable(url);
		}else if(CATEGORY_CODE=='PUB2017241'){//查询测试管理待办
			var url=dev_workbench+'Backlog/queryTestBacklog.asp?call='+callTable+'&SID='+SID;
			initBacklogTable(url);
		}else if(CATEGORY_CODE=='PUB2017281'){//查询外包管理代办
			var url=dev_workbench+'Backlog/queryOutSourceBacklog.asp?call='+callTable+'&SID='+SID;
			initBacklogTable(url);
		}
	}
}
/**
 * 打开项目管理待办的详情页面
 */
parent.window.selProjectInfo=function(index){
	var data=$("#contentHtml", parent.document).find("#Backlog_info").bootstrapTable("getData");
	var P_BACKLOG=data[index].P_BACKLOG;
	if(P_BACKLOG!=""&&P_BACKLOG!=undefined){
		if(P_BACKLOG=='质量不符合项提出待受理'){
			window.parent.iframeOpenTab("noconformitemaccept","不符合项受理","dev_project/qualityManage/noConformItemAccept/noConformItemAccpet_queryList.html");
		}else if(P_BACKLOG=='质量不符合项受理待处理'){
			window.parent.iframeOpenTab("noconformitemmanage","不符合项处理","dev_project/qualityManage/noConformItemManage/noConformItemManage_queryList.html");
		}else if(P_BACKLOG=='质量不符合项被拒绝'){
			window.parent.iframeOpenTab("noconformitemraise","不符合项提出","dev_project/qualityManage/noConformItemRaise/noConformItemRaise_queryList.html");
		}else if(P_BACKLOG=='质量不符合项处理成功待验证'){
			window.parent.iframeOpenTab("noconformitemraise","不符合项提出","dev_project/qualityManage/noConformItemRaise/noConformItemRaise_queryList.html");
		}else if(P_BACKLOG=='需求提出待审批'){
			window.parent.iframeOpenTab("requirementaddapprove_querylist","需求审批","dev_construction/requirement/requirement_input/requirementAddApprove_querylist.html");
		}else if(P_BACKLOG=='需求提出退回'){
			window.parent.isRun_split="false";
			window.parent.closePageTab("requirement_input");
			window.parent.closeAndOpenInnerPageTab("requirement_input","需求提出退回","dev_construction/requirement/requirement_input/requirement_querylist.html",function(){
				window.parent.refreshRequirementList("&req_state=16");
			});
		}else if(P_BACKLOG=='需求分发退回'){
			window.parent.isRun_split="false";
			window.parent.closePageTab("requirement_input");
			window.parent.closeAndOpenInnerPageTab("requirement_input","需求分发提出","dev_construction/requirement/requirement_input/requirement_querylist.html",function(){
				window.parent.refreshRequirementList("&req_state=03");
			});
		}else if(P_BACKLOG=='需求待提交受理'){
			//window.parent.iframeOpenTab("requirement_input","需求提出","dev_construction/requirement/requirement_input/requirement_querylist.html");
			window.parent.iframeOpenTab("requirement_les_input","需求提出","dev_construction/requirement/requirement_input/requirement_lessQuerylist.html");
		}else if(P_BACKLOG=='需求待分发'){
			//window.parent.iframeOpenTab("req_distribute","需求分发","dev_construction/requirement/requirement_accept/requirementDistribute_querylist.html");
			//window.parent.iframeOpenTab("req_les_distribute","需求分发","dev_construction/requirement/requirement_accept/requirementDistribute_lessQuerylist.html");
			window.parent.closePageTab("req_les_distribute");
			window.parent.closeAndOpenInnerPageTab("req_les_distribute","需求分发","dev_construction/requirement/requirement_accept/requirementDistribute_lessQuerylist.html",function(){
				window.parent.initRequirementListLayout('02');
			});
		}else if(P_BACKLOG=='需求评估退回'){
			//window.parent.iframeOpenTab("req_distribute","需求分发","dev_construction/requirement/requirement_accept/requirementDistribute_querylist.html");
			window.parent.closePageTab("req_les_distribute");
			window.parent.closeAndOpenInnerPageTab("req_les_distribute","需求分发","dev_construction/requirement/requirement_accept/requirementDistribute_lessQuerylist.html",function(){
				window.parent.initRequirementListLayout('05');
			});
		}else if(P_BACKLOG=='需求待评估'){
			//window.parent.iframeOpenTab("req_assess","需求评估","dev_construction/requirement/requirement_accept/requirementAssess_querylist.html");
			//window.parent.iframeOpenTab("req_assess_Unsyc","需求评估","dev_construction/requirement/requirement_accept/requirementAssess_querylistUnsyc.html");
			window.parent.closePageTab("req_les_assess");
			window.parent.closeAndOpenInnerPageTab("req_les_assess","需求评估","dev_construction/requirement/requirement_accept/requirementAssess_lessQuerylist.html",function(){
				window.parent.initReqAssessListLayout('04');
			});
		}else if(P_BACKLOG=='需求评估转交'){
			//window.parent.iframeOpenTab("req_assess","需求评估","dev_construction/requirement/requirement_accept/requirementAssess_querylist.html");
			//window.parent.iframeOpenTab("req_les_trans","需求评估","dev_construction/requirement/requirement_accept/requirementTrans_lessQuerylist.html");
			window.parent.closePageTab("req_les_assess");
			window.parent.closeAndOpenInnerPageTab("req_les_assess","需求评估","dev_construction/requirement/requirement_accept/requirementAssess_lessQuerylist.html",function(){
				window.parent.initReqAssessListLayout('06');
			});
		}else if(P_BACKLOG=='需求审批退回待评估'){
			//window.parent.iframeOpenTab("req_assess","需求评估","dev_construction/requirement/requirement_accept/requirementAssess_querylist.html");
			//window.parent.iframeOpenTab("req_les_assess","需求评估","dev_construction/requirement/requirement_accept/requirementAssess_lessQuerylist.html");
			window.parent.closePageTab("req_les_assess");
			window.parent.closeAndOpenInnerPageTab("req_les_assess","需求评估","dev_construction/requirement/requirement_accept/requirementAssess_lessQuerylist.html",function(){
				window.parent.initReqAssessListLayout('09');
			});
		}else if(P_BACKLOG=='需求评估待审批'){
			//window.parent.iframeOpenTab("req_approve","需求审批","dev_construction/requirement/requirement_accept/requirement_approve/requirementApprove_querylist.html");
			window.parent.iframeOpenTab("req_self_approve","需求审批","dev_construction/requirement/requirement_accept/requirement_approve/requirementSelfApprove_querylist.html");
		}else if(P_BACKLOG=='需求点待提交'){
			//window.parent.iframeOpenTab("split_req","需求点拆分","dev_construction/requirement/requirement_analyze/split_subreq/requirementAnalyze_querylist.html");
			window.parent.iframeOpenTab("split_les_req","需求点拆分","dev_construction/requirement/requirement_analyze/split_subreq/requirementAnalyze_lessQuerylist.html");
		}else if(P_BACKLOG=='需求任务待拆分'){
			window.parent.isRun_split="false";
			
			//window.parent.iframeOpenTab("split_task","需求任务拆分","dev_construction/requirement/requirement_analyze/split_task/splitTask_querylist.html");
			window.parent.closeAndOpenInnerPageTab("split_les_task","需求任务拆分","dev_construction/requirement/requirement_analyze/split_task/splitTask_querylist.html",function(){
				//window.parent.getCurrentPageObj().find("#sub_req_state_spTaskQuery").val("02").select2();
				//window.parent.refreshSplitTaskList("&sub_req_state=02&sub_task_flag=01");
				window.parent.refreshSplitTaskList("&sub_task_flag=01");
			});
			
		}else if(P_BACKLOG=='需求任务待分析'){
			//window.parent.iframeOpenTab("task_analyze","需求任务分析","dev_construction/requirement/reqTask_phased/analyze/task_analyze_querylist.html");
			window.parent.iframeOpenTab("task_les_analyze","需求任务分析","dev_construction/requirement/reqTask_phased/analyze/task_analyze_lessQuerylist.html");
		}else if(P_BACKLOG=='需求任务拆分待确认'){
			window.parent.iframeOpenTab("split_task_sure","需求任务拆分确认","dev_construction/requirement/requirement_analyze/split_task/splitTaskSure_querylist.html");
		}else if(P_BACKLOG=='需求评审通过，可入版'){
			window.parent.iframeOpenTab("task_intoversion","需求任务入版","dev_construction/requirement/reqTask_intoVersion/taskIntoVersion_querylist.html");
		}else if(P_BACKLOG=='需求任务工作量待评估'){
			window.parent.iframeOpenTab("task_accept","任务受理及评估","dev_construction/requirement/requirement_analyze/task_accept/taskAccept_querylist.html");
		}else if(P_BACKLOG=='任务待受理'){
			//window.parent.iframeOpenTab("task_accept","任务受理及评估","dev_construction/requirement/requirement_analyze/task_accept/taskAccept_querylist.html");
			//window.parent.iframeOpenTab("task_accept_unreceived","任务受理及评估","dev_construction/requirement/requirement_analyze/task_accept/taskAcceptUnreceived_querylist.html");
			window.parent.iframeOpenTab("task_accept","需求任务受理","dev_construction/requirement/requirement_analyze/task_accept/taskAccept_querylist.html");
		}/*else if(P_BACKLOG=='确定评审人员'){
			window.parent.iframeOpenTab("jury_infoa","确定评审人员","dev_construction/jury/conductPR/juryPage/juryConfirmUserList.html");
		}else if(P_BACKLOG=='准备评审'){
			window.parent.iframeOpenTab("jury_infob","准备评审","dev_construction/jury/conductPR/juryPage/JuryPrepareList.html");
		}else if(P_BACKLOG=='执行评审待办'){
			//window.parent.iframeOpenTab("jury_infoc","执行评审","dev_construction/jury/conductPR/juryPage/juryExecuteList.html");
			window.parent.iframeOpenTab("jury_infoc","执行评审","dev_construction/jury/conductPR/juryPage/juryLessExecuteList.html");
		}else if(P_BACKLOG=='形成评审结论'){
			window.parent.iframeOpenTab("jury_infod","形成评审结论","dev_construction/jury/conductPR/juryPage/juryConclusionList.html");
		}*/else if(P_BACKLOG=='需求版本变更'){
			window.parent.iframeOpenTab("change_info","需求版本变更","dev_project/proReqChange/approve/reqChange_queryList.html");
		}else if(P_BACKLOG=='投产待审批'){
			window.parent.iframeOpenTab("sendpro_info","投产审批","dev_construction/send_produce/sendproduceapprove/sendProduceApprove_queryList.html");
		}/*else if(P_BACKLOG=='投产待配置'){
			//window.parent.iframeOpenTab("commitpro_info","投产审批","dev_construction/send_produce/sendproducecommit/sendProduceCommit_queryList.html");
			window.parent.iframeOpenTab("commitufi_info","转生产配置","dev_construction/send_produce/sendproducecommit/sendProduceUnfinished_queryList.html");
		}*/else if(P_BACKLOG=='投产版本待确认'){
			window.parent.iframeOpenTab("sendproConfirm_info","投产版本待确认","dev_construction/send_produce/audit/subVersionPlan_queryList.html");
		}else if(P_BACKLOG=='投产待确认'){
			window.parent.iframeOpenTab("sendproConfirm_info","投产确认","dev_construction/send_produce/sendproduceconfirm/sendProduceConfirm_queryList.html");
		}else if(P_BACKLOG=='投产审批打回待处理'){
			window.parent.iframeOpenTab("sendpro_info","投产申请","dev_construction/send_produce/sendproduceapply/sendProduceApply_queryList.html");
		}else if(P_BACKLOG=='待提交投产'){
			window.parent.iframeOpenTab("sendproapply","投产申请","dev_construction/send_produce/sendproduceapply/sendProduceApply.html");
		}else if(P_BACKLOG=='SIT配置退回待处理'){
			window.parent.iframeOpenTab("sitsubmit_infoa","SIT待移交","dev_construction/sit_test_jn/sit_submit/sitsubmit_queryList.html");
		}else if(P_BACKLOG=='SIT移交待配置'){
			window.parent.iframeOpenTab("sitsubmit_infob","SIT移交待配置","dev_construction/sit_test_jn/sit_config/sitconfig_queryList.html");
		}else if(P_BACKLOG=='SIT移交待部署'){
			window.parent.iframeOpenTab("sitdeploy_infoc","SIT移交待部署","dev_construction/sit_test_jn/sit_deploy/sitDeploy_queryList.html");
		}else if(P_BACKLOG=='SIT部署成功待受理'){
		    //window.parent.iframeOpenTab("sitaccept_infoe","SIT部署成功待受理","dev_construction/sit_test_jn/sit_accept/sitAccept_queryList.html");
			window.parent.closePageTab("sitaccept_success_infoe");
			window.parent.closeAndOpenInnerPageTab("sitaccept_success_infoe","SIT部署成功待受理","dev_construction/sit_test_jn/sit_accept/sitAcceptSuccess_queryList.html",function(){
				window.parent.initsitAcceptInfo('03');
			});
		}else if(P_BACKLOG=='SIT转交待受理'){
			//window.parent.iframeOpenTab("sitaccept_infof","SIT部署成功待受理","dev_construction/sit_test_jn/sit_accept/sitAccept_queryList.html");
			window.parent.closePageTab("sitaccept_success_infoe");
			window.parent.closeAndOpenInnerPageTab("sitaccept_success_infoe","SIT部署成功待受理","dev_construction/sit_test_jn/sit_accept/sitAcceptSuccess_queryList.html",function(){
				window.parent.initsitAcceptInfo('06');
			});
		}else if(P_BACKLOG=='UAT测试报告上传待办'){
			window.parent.iframeOpenTab("uatreport_querylist","UAT测试报告管理","dev_construction/uat_test/uatreport/uatReport_queryList.html");
		}
		else if(P_BACKLOG=='我的任务待办'){
			window.parent.iframeOpenTab("mytasklessview","我的任务","dev_construction/requirement/reqTask_follower/myTaskless_querylist.html");
		}else if(P_BACKLOG=='设计开发文档上传待办'){
			//window.parent.iframeOpenTab("totalreport_info","设计开发报告上传","dev_construction/requirement/reqTask_phased/summary/task_summary_querylist.html");
			window.parent.iframeOpenTab("totalreport_les_info","设计开发文档上传","dev_construction/requirement/reqTask_phased/summary/task_summary_queryLesslist.html");
		}else if(P_BACKLOG=='单元测试报告上传待办'){
			//window.parent.iframeOpenTab("unitreport_info","单元测试报告上传","dev_construction/requirement/reqTask_phased/coding/task_coding_querylist.html");
			window.parent.iframeOpenTab("unitreport_info_uoload","单元测试报告上传","dev_construction/requirement/reqTask_phased/coding/task_coding_querylistUploading.html");
		}else if(P_BACKLOG=='联调测试报告上传待办'){
			//window.parent.iframeOpenTab("joinreport_info","联调测试报告上传","dev_construction/requirement/reqTask_phased/joint/task_joint_querylist.html");
			window.parent.iframeOpenTab("joinreport_ufi_info","联调测试报告上传","dev_construction/requirement/reqTask_phased/joint/task_jointUnfinished_querylist.html");
		}else if(P_BACKLOG=='SIT测试报告上传待办'){
			window.parent.iframeOpenTab("sitreport_info","SIT测试报告上传","dev_construction/sit_test_jn/sit_report/sitreport_queryList.html");
			//window.parent.iframeOpenTab("sitreport_info","SIT测试报告上传","dev_construction/sit_test_jn/sit_report/sitUnreported_queryList.html");
		}else if(P_BACKLOG=='SIT测试报告审批待办'){
			window.parent.iframeOpenTab("sitreport_info","SIT测试报告上传","dev_construction/sit_test_jn/sit_report/approve/sitreport_queryAppList.html");
			//window.parent.iframeOpenTab("sitreport_info","SIT测试报告上传","dev_construction/sit_test_jn/sit_report/sitUnreported_queryList.html");
		}else if(P_BACKLOG=='UAT测试报告上传待办'){
			//window.parent.iframeOpenTab("uatreport_info","UAT测试报告上传","dev_construction/uat_test/uatreport/uatReport_queryList.html");
			window.parent.iframeOpenTab("uatreport_querylist","UAT测试报告上传","dev_construction/uat_test/uatreport/uatReport_queryList.html");
			//dev_construction/uat_test/uatreport/uatReport_queryList.html?menu_no=uatreport_querylist
		}else if(P_BACKLOG=='UAT测试报告审批待办'){
			window.parent.iframeOpenTab("uatreport_querylist_app","UAT测试报告审批","dev_construction/uat_test/uatreport/uatReport_queryList_app.html");
		}else if(P_BACKLOG=='SIT测试案例上传待办'){
			//window.parent.iframeOpenTab("sitcase_info","SIT测试评审","dev_construction/requirement/reqTask_phased/sitcase/task_sitcase_querylist.html");
			window.parent.iframeOpenTab("sitcase_les_info","SIT测试评审","dev_construction/requirement/reqTask_phased/sitcase/task_sitcase_lessQuerylist.html");
	    }/*else if(P_BACKLOG=='接口使用申请待发起'){
			window.parent.iframeOpenTab("useInterfaceApply_queryList","接口使用申请待发起","dev_application/useInterfaceApply/useInterfaceApply_queryList.html");
		}else if(P_BACKLOG=='接口变更申请待发起'){
			window.parent.iframeOpenTab("changeInterApply_queryList","接口变更申请待发起","dev_application/changeInterfaceApply/changeInterApply_queryList.html");
		}else if(P_BACKLOG=='接口使用申请受理'){
			window.parent.iframeOpenTab("postUseInterAccept_queryList","接口使用申请受理","dev_application/postUseInterAccept/postUseInterAccept_queryList.html");
		}else if(P_BACKLOG=='接口变更申请受理'){
			window.parent.iframeOpenTab("changeInterAccept_queryList","接口变更申请受理","dev_application/changeInterAccept/changeInterAccept_queryList.html");
		}else if(P_BACKLOG=='服务方待受理接口申请'){
			window.parent.iframeOpenTab("serUseInterAccept_queryList","服务方待受理接口申请","dev_application/serUseInterAccept/serUseInterAccept_queryList.html");
		}else if(P_BACKLOG=='服务方接口待设计'){
			//window.parent.iframeOpenTab("interDesign_queryList","服务方接口待设计","dev_application/serInterDesign/interDesign_queryList.html");
			window.parent.closePageTab("interDesign_les_queryList");
			window.parent.closeAndOpenInnerPageTab("interDesign_les_queryList","服务方接口待设计","dev_application/serInterDesign/interDesign_lessQueryList.html",function(){
				window.parent.interfaceESBUseAnalysedTest();
			});
		}else if(P_BACKLOG=='ESB方接口待分析'){
			window.parent.iframeOpenTab("ESBUseAnalysed_queryList","ESB方接口待分析","dev_application/ESBUseInterAnalyse/ESBUseAnalysed_queryList.html");
		}else if(P_BACKLOG=='项目申请待提交'){//项目立项申请 待提交  由指定项目经理操作
			window.parent.iframeOpenTab("projectApply_queryList","项目申请待提交","dev_project/projectEstablishManage/projectApply/projectEstablishApply_queryList.html");
		}else if(P_BACKLOG=='项目申请待审批'){//项目待审批   部门负责人
			window.parent.iframeOpenTab("approve_queryList","项目申请待审批","dev_project/projectEstablishManage/projectApprove/sprojectApprove_queryList.html");
		}else if(P_BACKLOG=='项目立项待指派项目经理'){//项目指派项目经理
			window.parent.iframeOpenTab("assignPM_queryList","实施项目经理指派","dev_project/projectEstablishManage/projectManagerAssign/proManagerAssign_queryList.html");
		}*/else if((P_BACKLOG=='问题待提交')||(P_BACKLOG=='问题被拒绝')){
			window.parent.iframeOpenTab("questionraise_querylist","问题提出","dev_project/questionManage/questionRaise/questionRaise_queryList.html");
		}else if((P_BACKLOG=='问题待受理')||(P_BACKLOG=='问题重新打开')){
			window.parent.iframeOpenTab("question_accept","问题受理","dev_project/questionManage/questionAccept/questionAccept_queryList.html");
		}else if((P_BACKLOG=='问题待处理')||(P_BACKLOG=='问题处理中')){
			window.parent.iframeOpenTab("question_handle","问题处理","dev_project/questionManage/questionHandle/questionHandle_queryList.html");
		}else if(P_BACKLOG=='问题待验证'){
			window.parent.iframeOpenTab("question_validate","问题验证","dev_project/questionManage/questionValidate/questionValidate_queryList.html");
		}else if(P_BACKLOG=='计划变更审批待办'){
			window.parent.iframeOpenTab("plan_change_approve","变更审批","dev_project/projectChangeManage/projectChangeApprove/proChangeApprove_queryList.html");
		}else if(P_BACKLOG=='开发任务待处理'){
			/*window.parent.closeAndOpenInnerPageTab("task_update_manager","开发任务跟踪","dev_project/projectTaskManage/myTaskUpdate/myTaskUpdateForCoder_queryList.html",function(){
				window.parent.initTaskFromWorkBeach('02');
			});	*/
			window.parent.iframeOpenTab("task_update_manager","开发任务跟踪","dev_project/projectTaskManage/myTaskUpdate/myTaskUpdateForCoder_queryList.html");
		}/*else if(P_BACKLOG=='开发任务执行中待处理'){
			window.parent.iframeOpenTab("taskmanagerquery","开发任务处理","dev_project/projectTaskManage/myTaskUpdate/myTaskUpdate_queryList.html");
		}*/else if(P_BACKLOG=='开发任务完成待处理'){
			/*window.parent.closeAndOpenInnerPageTab("taskmanagerquery","开发任务处理","dev_project/projectTaskManage/myTaskUpdate/myTaskUpdate_queryList.html",function(){
				window.parent.initTaskList('04');
			});*/
			window.parent.iframeOpenTab("taskmanagerquery","开发任务处理","dev_project/projectTaskManage/myTaskUpdate/myTaskUpdate_queryList.html");
		}/*else if(P_BACKLOG=='开发任务打回待处理'){
			//window.parent["task_update_manager"]="05";
			window.parent.closeAndOpenInnerPageTab("task_update_manager","开发任务跟踪","dev_project/projectTaskManage/myTaskUpdate/myTaskUpdateForCoder_queryList.html",function(){
				window.parent.initTaskList('05');
			});	
			//window.parent.iframeOpenTab("taskmanagerquery","开发任务处理","dev_project/projectTaskManage/myTaskUpdate/myTaskUpdate_queryList.html");
		}*/else if(P_BACKLOG=='需求变更审批待办'){
			window.parent.iframeOpenTab("changeApprove_queryList","需求变更审批","dev_construction/requirement/requirement_change/approve/changeApprove_queryList.html");
		}else if(P_BACKLOG=='需求变更分析待办'){
			window.parent.iframeOpenTab("changeAnalyze_queryList","需求变更分析","dev_construction/requirement/requirement_change/analyze/changeAnalyze_queryList.html");
		}else if(P_BACKLOG=='需求终止分析待办'){
			window.parent.iframeOpenTab("terminateAnalyze_queryList","需求终止分析","dev_construction/requirement/requirement_terminate/analyze/analyze_queryList.html");
		}else if(P_BACKLOG=='生产版本同步分析待办'){
			//window.parent.iframeOpenTab("version_sync_analyze","生产版本同步分析","dev_construction/send_produce/produceversionsync/produceVersionSync_queryList.html");
			window.parent.iframeOpenTab("version_sync_ufi_analyze","生产版本同步分析","dev_construction/send_produce/produceversionsync/produceVersionSyncUnfinished_queryList.html");
		}/*else if(P_BACKLOG=='生产版本同步确认待办'){
			window.parent.iframeOpenTab("version_sync_confirm","生产版本同步确认","dev_construction/send_produce/produceversionsync/configManVersionSync_queryList.html");
		}*/else if(P_BACKLOG=='配置不符合项待提交'){
			window.parent.iframeOpenTab("noconfigManageRasie_queryList","不符合项提出","dev_project/configManage/noconfigManageRasie/noconfigManageRasie_queryList.html");
		}else if((P_BACKLOG=='配置不符合项待受理')||(P_BACKLOG=='配置不符合项打回待受理')){
			window.parent.iframeOpenTab("noConfigManageAccept_queryList","不符合项受理","dev_project/configManage/noConfigManageAccept/noConfigManageAccept_queryList.html");
		}else if((P_BACKLOG=='配置不符合项待处理')||(P_BACKLOG=='配置不符合项处理中')||(P_BACKLOG=='配置不符合项打回待处理')){
			window.parent.iframeOpenTab("noConfigManageHandle_queryList","不符合项处理","dev_project/configManage/noConfigManageHandle/noConfigManageHandle_queryList.html");
		}else if((P_BACKLOG=='配置不符合项待验证')||(P_BACKLOG=='配置不符合项被拒绝')){
			window.parent.iframeOpenTab("noconfigManageValidate_queryList","不符合项验证","dev_project/configManage/noconfigManageValidate/noconfigManageValidate_queryList.html");
		}/*else if(P_BACKLOG=='待确认配置库'){
			window.parent.iframeOpenTab("config_confirm","待确认配置库","dev_resourceManage/Configuration_database/ConfigurationConfirm_querylist.html");
		}else if(P_BACKLOG=='待分配配置库'){
			window.parent.iframeOpenTab("config_distribute","待确认配置库","dev_resourceManage/Configuration_database/ConfigurationDistribute_querylist.html");
		}else if(P_BACKLOG=='待申请流'){
			window.parent.iframeOpenTab("stream_apply","流申请","dev_resourceManage/streamApply/streamApply_queryList.html");
		}
		else if(P_BACKLOG=='流信息待完善'){
			window.parent.iframeOpenTab("stream_apply_sure","流信息确认","dev_resourceManage/streamApplySure/streamApply_queryList.html");
		}
		else if(P_BACKLOG=='待分析测试任务'){
			window.parent.iframeOpenTab("analyze_test_task","分析测试任务","dev_test/testTaskAnalyze/testTaskAnalyze_queryList.html");
		}
		else if(P_BACKLOG=='待设计测试案例'){
			window.parent.iframeOpenTab("design_test_case","设计测试案例","dev_test/designTestCases/designTestCases_queryList.html");
		}
		else if(P_BACKLOG=='缺陷待提交'){
			window.parent.iframeOpenTab("defect_add","缺陷提出","dev_test/defectManagement/add/defectAdd_queryList.html");
		}
		else if(P_BACKLOG=='缺陷待指派'){
			window.parent.iframeOpenTab("defect_designate","缺陷指派","dev_test/defectManagement/designate/defectDesignate_queryList.html");
		}
		else if(P_BACKLOG=='缺陷待处理'){
			window.parent.iframeOpenTab("defect_dispose","缺陷处理","dev_test/defectManagement/dispose/defectDispose_queryList.html");
		}
		else if(P_BACKLOG=='缺陷待关闭'){
			window.parent.iframeOpenTab("defect_verify","缺陷验证","dev_test/defectManagement/verify/defectVerify_queryList.html");
		}
		else if(P_BACKLOG=='待执行测试任务'){
			window.parent.iframeOpenTab("testTaskExecute","执行测试任务","dev_test/testTaskExecute/testTaskExecute_queryList.html");
		}*/
		else if(P_BACKLOG=='待受理移交测试'){
			window.parent.iframeOpenTab("testTaskHandOver","受理移交测试","dev_test/testTaskHandOver/testTaskHandOver_queryList.html");
		}
		else if(P_BACKLOG=='SIT测试待移交 '){
			window.parent.iframeOpenTab("sitHandOver","SIT测试移交","dev_test/sitHandOver/sit_queryList.html");
		}else if(P_BACKLOG=='投产完成待验证'){
			window.parent.iframeOpenTab("sendProduceVerify","投产完成待验证","dev_construction/send_produce/sendproduceverify/sendProduceVerify_queryList.html");
		}else if(P_BACKLOG=='一般转紧急需求审批待办'){
			window.parent.iframeOpenTab("convertApprove","一般转紧急需求审批","dev_construction/requirement/requirement_convert/convertApprove/requirementConvertApp_queryList.html");
		}else if(P_BACKLOG=='外包人员入场待审批'){
			window.parent.iframeOpenTab("op_enter_approve","外包人员入场审批","dev_outsource/outsource/outpersonEntrance/outpersonEntrance_queryList.html");
		}else if(P_BACKLOG=='外包人员离场待审批'){
			window.parent.iframeOpenTab("op_leave_approve","外包人员离场审批","dev_outsource/outsource/outpersonDeparture/outpersonDeparture_queryList.html");
		}else if(P_BACKLOG == "请假待审批"){
			window.parent.iframeOpenTab("optHolidayApply_approve","外包人员请假审批","dev_outsource/outsource/outPersionHolidayManage/opsHoliday_approve/opsHolidayApprove_queryList.html?backlog=holidayapply_approve");
		}else if(P_BACKLOG == "销假待审批"){
			window.parent.iframeOpenTab("optHolidayCancel_approve","外包人员销假审批","dev_outsource/outsource/outPersionHolidayManage/opsHoliday_approve/opsHolidayApprove_queryList.html?backlog=celholiday_approve");
		}else if(P_BACKLOG == "外包人员定级待审批"){
			window.parent.iframeOpenTab("outpersonrRank_Approve","外包人员定级待审批","dev_outsource/outsource/outperson/outperson_rankApproveList.html");
		}else if(P_BACKLOG == "外包人员定级打回"){
			window.parent.iframeOpenTab("outpersonrRank_apply","外包人员定级申请","dev_outsource/outsource/outperson/outperson_rankRejectList.html");
		}else if(P_BACKLOG == "外包人员入场拒绝"){
			window.parent.iframeOpenTab("outperson_entranceRef","人员入场申请","dev_outsource/outsource/outperson/outperson_entrance.html");
		}else if(P_BACKLOG == "外包人员离场拒绝"){
			window.parent.iframeOpenTab("outperson_leave","人员离场申请","dev_outsource/outsource/outperson/outperson_leave.html");
		}else if(P_BACKLOG == "外包人员请假打回"){
			window.parent.iframeOpenTab("outperson_holidayapply","人员请假申请","dev_outsource/outsource/outPersionHolidayManage/outpersonHoliday_queryList.html?menu_no=outperson_holidayapply");
		}else if(P_BACKLOG == "外包人员销假打回"){
			window.parent.iframeOpenTab("cancelholiday_apply","人员销假申请","dev_outsource/outsource/outPersionHolidayManage/cancelHolidays/cancelHoliday_queryList.html?menu_no=cancelholiday_apply");
		}else if(P_BACKLOG == "待派发的缺陷"){
			window.parent.iframeOpenTab("designate_apply","指派缺陷","dev_test/defectManagement/designate/defectDesignate_queryList.html?menu_no=designate_apply");
		}else if(P_BACKLOG == "待处理的缺陷"){
			window.parent.iframeOpenTab("dispose_apply","处理缺陷","dev_test/defectManagement/dispose/defectDispose_queryList.html?menu_no=dispose_apply");
		}else if(P_BACKLOG == "待验证的缺陷"){
			window.parent.iframeOpenTab("verify_apply","验证缺陷","dev_test/defectManagement/verify/defectVerify_queryList.html?menu_no=verify_apply");
		}else if(P_BACKLOG == "被拒绝的缺陷"){
			window.parent.iframeOpenTab("refuse_apply","拒绝缺陷","dev_test/defectManagement/add/defectAdd_queryList.html?menu_no=refuse_apply");
		}else if(P_BACKLOG == "待审核的缺陷"){
			window.parent.iframeOpenTab("review_apply","审核缺陷","dev_test/defectManagement/review/review_queryList.html?menu_no=review_apply");
		}else if(P_BACKLOG=="测试任务待分析"){
			window.parent.iframeOpenTab("testtask_analyze","测试任务分析","dev_test/testTaskAnalyze/testTaskAnalyze_queryList.html?menu_no=testtask_analyze");
		}else if(P_BACKLOG=="测试案例待设计"){
			window.parent.iframeOpenTab("design_querylist","案例设计","dev_test/designTestCases/designTestCases_queryList.html?menu_no=design_querylist");
		}else if(P_BACKLOG=="测试任务待执行"){
			window.parent.iframeOpenTab("testtaskexecute","测试任务执行","dev_test/testTaskExecute/testTaskExecute_queryList.html?menu_no=testtaskexecute");
		}else if(P_BACKLOG=="一般转紧急审批通过"||P_BACKLOG=="一般转紧急审批打回"){
			window.parent.iframeOpenTab("reqconvertapply",P_BACKLOG,"dev_construction/requirement/requirement_convert/convertApply/requirementConvert_queryList.html?menu_no=reqconvertapply");
		}
	}
};

/**
 * 初始化项目管理待办页面
 */
function initBacklogTable(url){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$("#contentHtml", parent.document).find("#Backlog_info").bootstrapTable({
		//请求后台的URL（*）
		url : url,
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "client", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [10,15],//每页的记录行数（*）
		//pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		uniqueId : "P_BACKLOG", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:callTable,
		singleSelect: true,
		responseHandler: function(data){
            return data.rows;
        },
		columns : [{
			field : 'P_BACKLOG',
			title : '待办项名称',
			align : "center"
		}, {
			field : "P_NUM",
			title : "待办项条数",
			align : "center"
		}, {
			field : "OPT",
			title : "操作",
			align : "center",
			formatter:function(value,row,index){				
				var cfi_edit="<a id='notice_info' style='color:#0088cc; cursor:pointer;'  onclick='selProjectInfo("+index+");'>查看详情</a>";
				return cfi_edit;	
			}	
		}]
	});	
}


	