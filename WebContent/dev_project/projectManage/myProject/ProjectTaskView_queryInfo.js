//初始化项目基本信息
function initViewProjectInfoPage(row){
	var currTab=getCurrentPageObj();  //获取当前页面对象
	
	$("#PROJECT_NUM").html(row.PROJECT_NUM);
	$("#PROJECT_NAME").html(row.PROJECT_NAME);
	var project_id =row.PROJECT_ID;
	
	var tableCall =getMillisecond()+"1";  	
	baseAjaxJsonp(dev_project+"myProject/queryOnemyProject.asp?SID="+SID+"&project_id="+project_id+"&call="+tableCall, null, function(result){
 	    var proInfo = result.data;
		for(var i in proInfo){
    		currTab.find("#tab2").find("[name=" + i + "]").html(proInfo[i]);
    	}
	}, tableCall);
	
	//加载饼图
	var parm={"id1":"ProjectRisk_Pie","id2":"ProjectVerChange_Pie","id3":"ProjectQuality_Pie","id4":"ProjectConfiglist_Pie"};
	loadProjectPie("somePie", project_id,"dev_project/projectManage/myProject/projectPie/ProjectViewPie.html",parm);
	
	
	var tableCall =getMillisecond();
	var data=null;
	baseAjaxJsonp(dev_project+"myProject/queryonemyproject_milestone.asp?SID="+SID+"&PROJECT_ID="+row.PROJECT_ID+"&call="+tableCall, null, function(result){
		if(result==null||result==''){
		}else{
			data=result;
		}
	}, tableCall);
	
	//点击选项卡加载时间
	$('#projectView').tabs({
		fit:false,
		border:false,
		selected:0,
		width:"99%",
	    onSelect:function(title,index){
	    	init(index);
	    }    
	});
	
	var requirementTaskView2 = 0;
	var projectRange2 = 0;
	var ProjectManInt2 = 0;
	var projectMilestone2 = 0;
	var projectQuestion2 = 0;
	var projectQuality2 = 0;
	var projectConfig2 = 0;
	var projectChange2 = 0;
	var projectDoc2 = 0;
	function init(index){
		//<<<项目工作范围
		if (index==1 && projectRange2 < 1) {
			currTab.find("#tab0").load("dev_project/projectManage/myProject/projectRange/projectRange.html", function() {
				initProjectRange(row);
				projectRange2++;
				});
		}
		//<<<全流程信息
		if(index==2 && requirementTaskView2 < 1){
			currTab.find("#tab1").load( "dev_project/projectManage/myProject/ProjectDemandTask_queryInfo.html", function() {
				initProjectDemandTaskTable(row,data);//初始化关联的任务列表
				requirementTaskView2++;
			});
		}
		//<<<项目人员信息
		if (index==3 &&ProjectManInt2 < 1) {
			currTab.find("#tab3").load("dev_project/projectManage/myProject/projectMan/projectMan_edit.html",
				function() {
				    getCurrentPageObj().find(".my").hide();
					personnelManage(row);
					ProjectManInt2++;
				});
		}
		//<<<项目里程碑
		if (index==4 && projectMilestone2 < 1) {
			openProjectMilestone("tab5", row.PROJECT_ID,"dev_project/projectManage/myProject/milestone/milestoneDiv.html","project_milestoneProgress");
			projectMilestone2++;
			/*currTab.find("#tab5").load( "dev_planwork/wbs/wbsPlan_milestone.html", function() {
					getCurrentPageObj().find("#M_project_name").hide();
					queryMilestoneList(row.PROJECT_ID);
					projectMilestone++;
				});*/
		}
		//<<<项目WBS计划
		if (index==5) {
			currTab.find("#tab4").empty();
			$("#tab4").load("dev_project/projectManage/myProject/wbsPlan/wbsPlan_milestoneShow.html", function() {
					getCurrentPageObj().find("#treegridTab_show").attr("project_id",row.PROJECT_ID);
					InitTreeData_show(project_id,"milestone_show");
				});
		}
		//<<<项目风险
		if(index==6 && projectQuestion2 < 1){
			currTab.find("#tab6").load("dev_project/projectManage/myProject/projectQuestion/questionQuery_queryList.html", function() {
				initQuestionQueryLayout(row);
				getCurrentPageObj().find(".my").hide();
				projectQuestion2++;
			});
		}
		//<<<项目质量
		if(index==7 && projectQuality2 < 1){
			currTab.find("#tab8").load("dev_project/projectManage/myProject/projectQuality/quality_query.html", function() {
				initNotConformQualityTab(row.PROJECT_ID);
				getCurrentPageObj().find(".my").hide();
				projectQuality2++;
			});
		}
		//<<<项目配置
		if(index==8 && projectConfig2 < 1){
			currTab.find("#tab7").load("dev_project/projectManage/myProject/projectConfig/projectConfig_queryList.html", function() {
				initNotConformConfigTab(row);
				getCurrentPageObj().find(".my").hide();
				projectConfig2++;
			});
		}
		//<<<项目变更
		if(index==9 && projectChange2 < 1){
			currTab.find("#tab9").load("dev_project/projectManage/myProject/projectChange/projectChange_queryList.html", function() {
				initChangeQueryLayout(row);
				getCurrentPageObj().find(".my").hide();
				projectChange2++;
			});
		}
		//<<<项目关联文档
		if(index==10 && projectDoc2 < 1){
			currTab.find("#tab10").load("dev_project/documentManage/documentManage_ProjectFileList.html", function() {
				initProjectDocumentListTable(row.PROJECT_ID);
				initfileupload();
				getCurrentPageObj().find(".my").hide();
				projectDoc2++;
			});
			
		}
}	

	
/*
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<项目工作范围<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	var projectRange= 0;
	currTab.find("#projectRange_li").click(function(){
		if (index==1 && projectRange < 1) {
			currTab.find("#tab0").load("dev_project/projectManage/myProject/projectRange/projectRange.html", function() {
				initProjectRange(row);
				projectRange++;
				});
		}
	});
	
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<全流程信息<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<	
	var requirementTaskView = 0;
	currTab.find("#projectConstruction_li").click(function(){
		if(index==2 && requirementTaskView < 1){
			currTab.find("#tab1").load( "dev_project/projectManage/myProject/ProjectDemandTask_queryInfo.html", function() {
				initProjectDemandTaskTable(row,data);//初始化关联的任务列表
				requirementTaskView++;
			});
		}
	});
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<项目人员信息<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	// 项目人员信息
	var ProjectManInt = 0;
	$("#projectMan_li").click(function() {
		if (ProjectManInt < 1) {
			currTab.find("#tab3")
					.load(
							"dev_project/projectManage/myProject/projectMan/projectMan_queryList.html",
							function() {
								initProjectManInfo(row);
								ProjectManInt++;
							});
		}
	});

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<项目里程碑<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	var projectMilestone = 0;
	currTab.find("#projectMilestone_li").click(function(){
		if (projectMilestone < 1) {
			currTab.find("#tab5").load( "dev_planwork/wbs/wbsPlan_milestone.html", function() {
				queryMilestoneList(row.PROJECT_ID);
				projectMilestone++;
				});
		}
	});

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<项目WBS计划<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
$("#projectProgress_li").click(function(){
	currTab.find("#tab4").empty();
	$("#tab4").load( "dev_planwork/wbs/wbsPlan_edit.html", function() {
		$("#treegridTab_add").attr("project_id",row.PROJECT_ID);
			InitTreeData_add(row.PROJECT_ID);
			getCurrentPageObj().find("#wbsSpan").text("项目WBS计划");
			getCurrentPageObj().find(".ecitic-operation").hide();
			getCurrentPageObj().find(".my").hide();
		});
});
	
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<项目风险问题<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	var projectQuestion = 0;
	currTab.find("#projectQuestion_li").click(function(){
		if(projectQuestion < 1){
			currTab.find("#tab6").load("dev_project/projectManage/myProject/projectQuestion/questionQuery_queryList.html", function() {
				initQuestionQueryLayout(row.PROJECT_ID);
				getCurrentPageObj().find(".my").hide();
				projectQuestion++;
			});
		}
	});

	
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<项目质量问题<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
var projectQuality = 0;
currTab.find("#projectQuality_li").click(function(){
	if(projectQuality < 1){
		currTab.find("#tab8").load("dev_project/projectManage/myProject/projectQuality/quality_query.html", function() {
			initNotConformQualityTab(row.PROJECT_ID);
			getCurrentPageObj().find(".my").hide();
			projectQuality++;
		});
	}
});

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<项目配置管理<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
var projectConfig = 0;
currTab.find("#projectconfig_li").click(function(){
	if(projectConfig < 1){
		currTab.find("#tab7").load("dev_project/projectManage/myProject/projectConfig/projectConfig_queryList.html", function() {
			initNotConformConfigTab(row.PROJECT_ID);
			getCurrentPageObj().find(".my").hide();
			projectConfig++;
		});
	}
});

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<项目变更信息<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
var projectChange = 0;
currTab.find("#projectChange_li").click(function(){
	if(projectChange < 1){
		currTab.find("#tab9").load("dev_project/projectManage/myProject/projectChange/projectChange_queryList.html", function() {
			initChangeQueryLayout(row);
			getCurrentPageObj().find(".my").hide();
			projectChange++;
		});
	}
});

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<关联文档信息<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	var projectDoc = 0;
	currTab.find("#projectDoc_li").click(function(){
		if(projectDoc < 1){
			currTab.find("#tab10").load("dev_project/documentManage/documentManage_ProjectFileList.html", function() {
				initProjectDocumentListTable(row.PROJECT_ID);
				initfileupload();
				getCurrentPageObj().find("#docmanageTopButton").hide();
				projectDoc++;
			});
			
		}
	});*/
	


}
