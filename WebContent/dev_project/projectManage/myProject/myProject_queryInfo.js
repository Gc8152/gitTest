//初始化项目基本信息
function initProjectInfoPage(row){
	var currTab=getCurrentPageObj();  //获取当前页面对象
	$("#PROJECT_DemandTask_NUM").html(row.PROJECT_NUM);
	$("#PROJECT_DemandTask_NAME").html(row.PROJECT_NAME);
	var project_id =row.PROJECT_ID;  	
	var tableCall =getMillisecond();
	var type = "01";
	if(row.PROJECT_TYPE == "SYS_DIC_NEW_PROJECT" || row.PROJECT_TYPE == "SYS_DIC_NEW_VERSION_PROJECT"){
		type = "02";
	}
	baseAjaxJsonp(dev_project+"myProject/queryOnemyProject.asp?SID="+SID+"&project_id="+project_id+"&type="+type+"&call="+tableCall, null, function(result){
 	    var proInfo = result.data;
		for(var i in proInfo){
    		currTab.find("#projectInfo").find("[name=" + i + "]").html(proInfo[i]);
    	}
	}, tableCall);
	
	//加载饼图
	var parm={"id1":"myProjectRisk_Pie","id2":"myProjectVerChange_Pie","id3":"myProjectQuality_Pie","id4":"myProjectConfiglist_Pie"};
	loadProjectPie("myProjectsomePie", project_id,"dev_project/projectManage/myProject/projectPie/myProjectPie.html",parm);
	
	var tableCall =getMillisecond();
	var data=null;
	baseAjaxJsonp(dev_project+"myProject/queryonemyproject_milestone.asp?SID="+SID+"&PROJECT_ID="+row.PROJECT_ID+"&call="+tableCall, null, function(result){
		if(result==null||result==''){
		}else{
			data=result;
		}
	}, tableCall);
	
	//点击选项卡加载时间
	$('#myProjectView').tabs({
		fit:false,
		border:false,
		selected:0,
		width:"99%",
	    onSelect:function(title,index){
	    	initPage(index);
	    }    
	});
	
	var requirementTaskView = 0;
	var projectRange= 0;
	var ProjectManInt = 0;
	var projectMilestone = 0;
	var projectQuestion = 0;
	var projectQuality = 0;
	var projectConfig = 0;
	var projectChange = 0;
	var projectDoc = 0;
	
	function initPage(index){
		//<<<项目工作范围
		if (index==1 && projectRange < 1) {
			currTab.find("#tab1_range").load("dev_project/projectManage/myProject/projectRange/projectRange.html", function() {
				initProjectRange(row);
				projectRange++;
				});
		}
		//<<<全流程信息
		if(index==2 && requirementTaskView < 1){
			currTab.find("#tab2_demandTask").load("dev_project/projectManage/myProject/ProjectDemandTask_queryInfo.html", function() {
				initProjectDemandTaskTable(row,data);//初始化关联的任务列表
				requirementTaskView++;
			});
		}
		//<<<人员管理
		if (index==3 && ProjectManInt < 1) {
			currTab.find("#tab3_projectMan").load("dev_project/projectManage/myProject/projectMan/projectMan_edit.html",function() {
				personnelManage(row);
				ProjectManInt++;
			});
		}
		//<<<项目里程碑
		if (index==4 && projectMilestone < 1) {
			currTab.find("#tab4_milestone").load("dev_project/projectManage/myProject/wbsPlan/wbsPlan_milestone.html", function() {
				queryMilestoneList(row);
				projectMilestone++;
				});
			}
		//<<<项目WBS计划
		if(index==5){
			currTab.find("#tab5_wbs").empty();
			$("#tab5_wbs").load("dev_planwork/wbs/wbsPlan_edit.html", function() {
					getCurrentPageObj().find("#treegridTab_add").attr("project_id",row.PROJECT_ID);
				    getCurrentPageObj().find("#treegridTab_add").attr("project_man",row.PROJECT_MAN_ID);
				    getCurrentPageObj().find("#treegridTab_add").attr("project_type",row.PROJECT_TYPE);
				    getCurrentPageObj().find("#treegridTab_add").attr("status",row.STATUS);
				    initWbs(row);
					getCurrentPageObj().find("#wbsSpan").text("项目WBS计划");
				});
		}
		//<<<项目风险问题
		if(index==6 && projectQuestion < 1){
			currTab.find("#tab6_question").load("dev_project/projectManage/myProject/projectQuestion/questionQuery_queryList.html", function() {
				initQuestionQueryLayout(row);
				projectQuestion++;
			});
		}
		//<<<项目质量问题
		if(index==7 && projectQuality < 1){
			currTab.find("#tab7_quality").load("dev_project/projectManage/myProject/projectQuality/quality_query.html", function() {
				initNotConformQualityTab(row.PROJECT_ID);
				projectQuality++;
			});
		}
		//<<<项目配置
		if(index==8 && projectConfig < 1){
			currTab.find("#tab8_config").load("dev_project/projectManage/myProject/projectConfig/projectConfig_queryList.html", function() {
				initNotConformConfigTab(row);
				projectConfig++;
			});
		}
		//<<<项目变更
		if(index==9 && projectChange < 1){
			currTab.find("#tab9_change").load("dev_project/projectManage/myProject/projectChange/projectChange_queryList.html", function() {
				initChangeQueryLayout(row);
				projectChange++;
			});
		}
		//<<<项目关联文档
		if(index==10 && projectDoc < 1){
			currTab.find("#tab10_doc").load("dev_project/documentManage/documentManage_ProjectFileList.html", function() {
				getCurrentPageObj().find("#docmanageTopButton").hide();
				initProjectDocumentListTable(row.PROJECT_ID);
				initfileupload();
				projectDoc++;
			});
		}
	}
/*
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<项目工作范围<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	var projectRange= 0;
	currTab.find("#project_li_range").click(function(){
		if (projectRange < 1) {
			currTab.find("#tab1_range").load("dev_project/projectManage/myProject/projectRange/projectRange.html", function() {
				initProjectRange(row);
				projectRange++;
				});
		}
	});

	
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<全流程信息<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	var requirementTaskView = 0;
	
	currTab.find("#project_li_demandTask").click(function(){
		if(requirementTaskView < 1){
			currTab.find("#tab2_demandTask").load( "dev_project/projectManage/myProject/ProjectDemandTask_queryInfo.html", function() {
				initProjectDemandTaskTable(row,data);//初始化关联的任务列表
				requirementTaskView++;
			});
		}
	});	
	
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<人员管理<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	var ProjectManInt = 0;
	$("#project_li_projectMan").click(function() {
		if (ProjectManInt < 1) {
			currTab.find("#tab3_projectMan").load("dev_project/projectManage/myProject/projectMan/projectMan_queryList.html",function() {
				initProjectManInfo(row);
				ProjectManInt++;
			});
		}
	});	
	
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<项目里程碑<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	var projectMilestone = 0;
	currTab.find("#project_li_Milestone").click(function(){
		if (projectMilestone < 1) {
			currTab.find("#tab4_milestone").load("dev_project/projectManage/myProject/wbsPlan/wbsPlan_milestone.html", function() {
				queryMilestoneList(row);
				projectMilestone++;
				});
			}
		});
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<项目WBS计划<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	currTab.find("#project_li_Wbs").click(function(){
		currTab.find("#tab5_wbs").empty();
		$("#tab5_wbs").load("dev_planwork/wbs/wbsPlan_edit.html", function() {
			currTab.find("#treegridTab_add").attr("project_id",row.PROJECT_ID);
				InitTreeData_add(row.PROJECT_ID);
				getCurrentPageObj().find("#wbsSpan").text("项目WBS计划");
			});
	});	
	
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<项目风险问题<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	var projectQuestion = 0;
	currTab.find("#project_li_question").click(function(){
		if(projectQuestion < 1){
			currTab.find("#tab6_question").load("dev_project/projectManage/myProject/projectQuestion/questionQuery_queryList.html", function() {
				initQuestionQueryLayout(row.PROJECT_ID);
				projectQuestion++;
			});
		}
	});	
	
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<项目质量问题<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	var projectQuality = 0;
	currTab.find("#project_li_quality").click(function(){
		if(projectQuality < 1){
			currTab.find("#tab7_quality").load("dev_project/projectManage/myProject/projectQuality/quality_query.html", function() {
				initNotConformQualityTab(row.PROJECT_ID);
				projectQuality++;
			});
		}
	});	
	
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<项目配置管理<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	var projectConfig = 0;
	currTab.find("#project_li_config").click(function(){
		if(projectConfig < 1){
			currTab.find("#tab8_config").load("dev_project/projectManage/myProject/projectConfig/projectConfig_queryList.html", function() {
				initNotConformConfigTab(row.PROJECT_ID);
				projectConfig++;
			});
		}
	});
	
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<项目变更信息<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	var projectChange = 0;
	currTab.find("#project_li_change").click(function(){
		if(projectChange < 1){
			currTab.find("#tab9_change").load("dev_project/projectManage/myProject/projectChange/projectChange_queryList.html", function() {
				initChangeQueryLayout(row);
				projectChange++;
			});
		}
	});

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<关联文档信息<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	var projectDoc = 0;
	currTab.find("#project_li_doc").click(function(){
		if(projectDoc < 1){
			currTab.find("#tab10_doc").load("dev_project/documentManage/documentManage_ProjectFileList.html", function() {
				getCurrentPageObj().find("#docmanageTopButton").hide();
				initProjectDocumentListTable(row.PROJECT_ID);
				initfileupload();
				projectDoc++;
			});
			
		}
	});*/
}
