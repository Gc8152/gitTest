function queryMilestoneList(row){
	var currTab = getCurrentPageObj();
	var project_id = row.PROJECT_ID;
	getCurrentPageObj().find("#queryProject_id").val(project_id);//查询按钮需要从页面取id
	//新建应用项目，现有应用改造项目
	if(row.PROJECT_TYPE != "SYS_DIC_NEW_PROJECT" && row.PROJECT_TYPE != "SYS_DIC_NEW_VERSION_PROJECT"){
		//currTab.find("#initWbsMile").hide();
		currTab.find("#versionDiv").hide();
	}
	
	//里程碑计划按钮
	currTab.find("#initWbsMile").click(function(){
		var version_id = "";
		var id = $.trim(getCurrentPageObj().find("#versionSelect").val());
		if(id == ""){
			alert("请先选择版本");
			return ;
		}else{
			version_id = id;
		}
		closeAndOpenInnerPageTab("edit_milestonePlan","编辑里程碑计划","dev_project/projectManage/myProject/wbsPlan/wbsPlan_milestoneEdit.html", function(){
			initMilestoneEdit(row,version_id);
		});
	});
	//计划变更按钮
	currTab.find("#changeWbsMile").click(function(){
		closeAndOpenInnerPageTab("add_proChange","发起变更","dev_project/projectChangeManage/projectChangeApply/projectChange_edit.html", function(){
			initproChangeEditBtn(null);
			getCurrentPageObj().find("input[name=PROJECT_ID]").val(project_id);
			getCurrentPageObj().find("input[name=PROJECT_NUM]").val(row.PROJECT_NUM);
			getCurrentPageObj().find("input[name=PROJECT_NAME]").val(row.PROJECT_NAME);
			getCurrentPageObj().find("input[name=STATUS]").val(row.STATUS);
			getCurrentPageObj().find("input[name=STATUS_NAME]").val(row.STATUS_NAME);
			getCurrentPageObj().find("input[name=PROJECT_TYPE]").val(row.PROJECT_TYPE);
			getCurrentPageObj().find("input[name=PROJECT_TYPE_NAME]").val(row.PROJECT_TYPE_NAME);
			if(row.PROJECT_TYPE == "SYS_DIC_NEW_PROJECT" || row.PROJECT_TYPE == "SYS_DIC_NEW_VERSION_PROJECT"){
				getCurrentPageObj().find("#change_version").show();
				changeVersion(row.PROJECT_ID);
			}else{
				getCurrentPageObj().find("#change_version").hide();
				queryMilestone(project_id,"00","");//初始化模板里程碑
			}
		});
	});
	//新建应用项目，现有应用改造项目
	if(row.PROJECT_TYPE == "SYS_DIC_NEW_PROJECT" || row.PROJECT_TYPE == "SYS_DIC_NEW_VERSION_PROJECT"){
		//初始化版本Select
		var SelectVersCall=getMillisecond();
		var VersArr=new Array();
		baseAjaxJsonp(dev_project+'proChange/queryProjectVers.asp?project_id='+ project_id + "&SID=" + SID + "&call=" +SelectVersCall,null,function(data) {
	  		if (data != undefined&&data!=null) {
	  			//得到后台数据
	  			var r= data.queryProjectVersSelect;
	
	  			if(r != null && r.length > 0) {
	      			for(var j = 0;j<r.length; j++) {
	      				var value1 = r[j].VERSIONS_NAME;
	      				var value2 = r[j].VERSIONS_ID;
	      				var arr={"value":value2,"html":value1};
	      				VersArr.push(arr);         				
	      			}
	      			//每次加载清楚上次统计的数据（放在循环外）
	      			getCurrentPageObj().find("option[name='ProjectSelectVersionList']").remove();
	      			for(var i = 0;i<VersArr.length; i++) {
	      				appendselectVersOption("versionSelect",VersArr[i]);
	      			}
	      			//初始化里程碑      			
	      			initMilestone(project_id,VersArr[0].value);
	      		}  			  			  			
	  			
	  		}       		
	  	},SelectVersCall);
	}else{
		initMilestone(project_id,"");
	}
	
	function appendselectVersOption(Select,vers){
	  	var Obj = getCurrentPageObj().find("#"+Select);
	  	var option = "<option name='ProjectSelectVersionList' value="+vers.value+">"+vers.html+"</option>";
	  	Obj.append(option);
	 }
}

var tableCall=getMillisecond();
function queryMilestones(){
	var version_id=$.trim(getCurrentPageObj().find("#versionSelect").val());
	var queryProject_id=getCurrentPageObj().find("#queryProject_id").val();
	if(version_id != ""){
		getCurrentPageObj().find("#milestoneListTab").bootstrapTable('refresh',
				{url:dev_project + 'proChange/queryMilestoneByProjectId.asp?project_id='
				+ queryProject_id + "&version_id="+version_id+"&SID=" + SID + "&call=" + tableCall});
	}else{alert("请选择版本查询");}
}

function initMilestone(project_id,version_id){
	var currTab = getCurrentPageObj();
	//列表显示
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	currTab.find("#milestoneListTab").bootstrapTable({
		//请求后台的URL（*）
		url : dev_project +'proChange/queryMilestoneByProjectId.asp?call='+tableCall+'&SID='+SID+'&project_id='+project_id+'&version_id='+version_id,
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		//pagination : true, //是否显示分页（*）
		pageList : [5,10,15],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "PLAN_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:tableCall,
		singleSelect: true,
		columns : [{
			field : 'Number',
			title : '序号',
			width:30,
			align : "center",
			formatter: function (value, row, index) {
				return index+1;
			}
		}, {
			field : "PLAN_NAME",
			title : "里程碑名称",
			align : "center"
		}, {
			field : "EXECUTE_STATUS_NAME",
			title : "里程碑状态",
			align : "center"
		}, {
			field : "END_TIME",
			title : "计划完成日期",
			align : "center"
		}, {
			field : "REALITY_END_TIME",
			title : "实际完成日期",
			align : "center"
		}]
	});
	
}