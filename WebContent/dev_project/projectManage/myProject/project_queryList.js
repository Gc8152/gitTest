var tableCall = getMillisecond();
initprojectTable();
initButtonEvent_myProject();
initQueryForm();
function initprojectTable(){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	getCurrentPageObj().find("#projectTable").bootstrapTable({
		//请求后台的URL（*）
		url : dev_project+'myProject/queryListmyProject.asp?call='+tableCall+'&SID='+SID,
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [5,10,15],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "PROJECT_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:tableCall,
		singleSelect: true,
		onLoadSuccess : function(data){
			gaveInfo();
		},
		columns : [ {
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		}/*, {
			field : "flag",
			title : "标识",
			align : "center",
			width:"5%",
			formatter: function (value, row, index) {
				var per = 0.0;
				if(Number(row.TOTAL)!=0){
					per = Number(row.FINISHED)/Number(row.TOTAL);
				}else{
					per = 1;
				}
				var differday = parseInt(row.DIFFERDAY);
				var notclose = parseInt(row.NOTCLOSE);
				var temp=0;
				
				if(notclose>0 || differday>14 || per<0.8){
					temp=1;
					return "<span onclick='viewProblem(\""+parseFloat(per).toFixed(1)+"\",\""+differday+"\",\""+notclose+"\",\""+temp+"\")' style='color:red;'>问题</span>";
				}else if(per==1 && (differday>=7 && differday<=14) && notclose==0){
					temp=2;
					return "<span onclick='viewProblem(\""+parseFloat(per).toFixed(1)+"\",\""+differday+"\",\""+notclose+"\",\""+temp+"\")' style='color:yellow;'>风险</span>";
				}else if((per>=0.8 && per<1) && (differday>=1 && differday<=14) && notclose==0){
					temp=3;
					return "<span onclick='viewProblem(\""+parseFloat(per).toFixed(1)+"\",\""+differday+"\",\""+notclose+"\",\""+temp+"\")' style='color:yellow;'>风险</span>";
				}else if(per==1 && differday<7  && notclose==0){
					temp=4;
					return "<span onclick='viewProblem(\""+parseFloat(per).toFixed(1)+"\",\""+differday+"\",\""+notclose+"\",\""+temp+"\")' style='color:green;'>正常</span>";
				}
			}
		}*/, {
			field : "PROJECT_NAME",
			title : "项目名称",
			align : "center",
			width : "20%"
		}, {
			field : "SYSTEM_NAME",
			title : "应用名称",
			align : "center"
		}, {
			field : "PROJECT_TYPE",
			title : "项目类型",
			align : "center",
			visible :false		
		}, {
			field : "PROJECT_TYPE_NAME",
			title : "项目类型",
			align : "center"
		}, {
			field : "PROJECT_MAN_NAME",
			title : "项目经理",
			align : "center"
		}, {
			field : "CREATE_TIME",
			title : "创建时间",
			align : "center"
		}, {
			field : "ORG_NAME",
			title : "所属部门",
			align : "center"
		}, {
			field : "STATUS_NAME",
			title : "项目状态",
			align : "center"
		}]
	});
	
}
//标识明细提示
function viewProblem(per,differday,notclose,temp){
	
	if(temp==1){
		if(per<0.8){
			alert("问题  >>>"+"不满足的任务完成率："+per+";");
		}else if(differday>14){
			alert("问题  >>>"+"过大的里程碑偏差："+differday+";");
		}else{
			alert("问题  >>>"+"仍有未关闭的问题条数："+notclose+";");
		}
	}else if(temp==2){							
		alert("风险  >>>"+"较大的里程碑偏差："+differday+";");
	}else if(temp==3){
		alert("风险  >>>"+"较低的任务完成率："+per+","+"较大的里程碑偏差："+differday+";");
	}
	
}
//初始化按钮事件
function initButtonEvent_myProject(){
	var currTab = getCurrentPageObj();
	//查询按钮事件
	currTab.find("#query_Project").click(function() {
		var param = currTab.find("#project_form").serialize();
		currTab.find('#projectTable').bootstrapTable('refresh',{url:dev_project
			+ "myProject/queryListmyProject.asp?SID=" + SID + "&call=" + tableCall + "&" + param});
	});

	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#query_Project").click();});
	//重置按钮事件
	currTab.find("#reset_ProjectForm").click(function(){
		currTab.find("#project_form").find("input").val("");
		currTab.find("#project_form")[0].reset();
		var selects = currTab.find("#project_form").find("select");
		for(var i=0; i<selects.length; i++){
			$(selects[i]).select2();
		}
		currTab.find("#project_form").find("input[name=ORGAN_ID]").val("");
	});
	
	//项目全景视图
	currTab.find("#projectManageBtn").click(function(){
		var rows = currTab.find('#projectTable').bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行操作!");
			return ;
		}
		closeAndOpenInnerPageTab(
				"ProjectTaskView_queryInfo",
				"项目全景视图",
				"dev_project/projectManage/myProject/ProjectTaskView_queryInfo.html",
				function() {
					initViewProjectInfoPage(rows[0]);
				});
	});
	
}
//初始化查询条件中pop、下拉框
function initQueryForm(){
	var currTab = getCurrentPageObj();
	//点击打开项目经理模态框
	/*var pm_name = currTab.find("input[name=PROJECT_MAN_NAME]");
	pm_name.click(function(){
		openPmPop(currTab.find("#myPro_choosePm"),{Zpm_id:currTab.find("input[name=PROJECT_MAN_ID]"),Zpm_name:currTab.find("input[name=PROJECT_MAN_NAME]")});
	});*/
	
	//所属处室选择
	var treeInputObj=currTab.find("input[name=ORGAN_NAME]");
	var treeInputID=currTab.find("input[name=ORGAN_ID]");
	treeInputObj.click(function(){
		openSelectTreeDiv($(this),"ProjectOrgTree","SOrg/queryorgtreelist.asp",{"margin-top": "2px",width:"180px"},function(node){
			treeInputObj.val(node.name);
			treeInputID.val(node.id);
		});
	});
	
	currTab.find("select[name='STATUS']").empty();
	initSelect(currTab.find("select[name='STATUS']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_PROJECT_STATUS"});
	initSelect(currTab.find("select[name='PROJECT_TYPE']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SYS_DIC_MILESTONE_PROJECT_TYPE"});
}