initProjectInfoTab();
//查询列表显示table
function initProjectInfoTab() {
	var themecall = getMillisecond();
	var currTab = getCurrentPageObj();
	
	//初始化下拉框的值
	initSelect(currTab.find("#status"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_PROJECT_STATUS"});
	
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	currTab.find("#projectInfoTab").bootstrapTable({
		//请求后台的URL（*）
		url : dev_planwork
				+ "Wbs/queryAllProjectInfo.asp?SID=" + SID + "&call=" + themecall,
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
		uniqueId : "PROJECT_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback : themecall,
		singleSelect: true,
		onLoadSuccess : function(data){
			gaveInfo();
		},
		columns : [ {
			field: 'PLAN_ID',
			checkbox: true,
			align: 'center',
			valign: 'middle',
		},{
			field : '',
			title : '序号',
			align : "center",
			visible : false,
			formatter : function(value,row,index){
				return (index + 1);
			}
		},{
			field : 'PROJECT_NUM',
			title : '项目编码',
			align : "center",
			visible : false
		}, {
			field : "PROJECT_NAME",
			title : "项目名称",
			align : "center",
			width : "22%"
		}, {
			field : "PROJECT_TYPE_NAME",
			title : "项目类型",
			align : "center",
			width : "11%"
		},{
			field : "PROJECT_TYPE_CHILD_NAME",
			title : "项目类型子分类",
			align : "center",
			width : "13%"
		}, {
			field : "ORG_NAME",
			title : "归属部门",
			align : "center",
			width : "11%"
		}, {
			field : "SYSTEM_NAME",
			title : "归属应用",
			align : "center",
			width : "13%"
		}, {
			field : "PROJECT_MAN_NAME",
			title : "项目经理",
			align : "center",
			width : "11%"
		}, {
			field : "STATUS_NAME",
			title : "项目状态",
			align : "center",
			width : "10%"
		}, {
			field : "PROJECT_PLAN",
			title : "项目计划",
			align : "center",
			width : "10%"
		} ]
	});
	
	//初始化页面按钮事件
	//所属部门选择
	var treeInputObj=currTab.find("input[name=ORGAN_NAME]");
	var treeInputID=currTab.find("input[name=organ_id]");
	treeInputObj.click(function(){
		openSelectTreeDiv($(this),"myProjectOrgTree","SOrg/queryorgtreelist.asp",{"margin-top": "2px",width:"140px"},function(node){
			treeInputObj.val(node.name);
			treeInputID.val(node.id);
		});
	});
	
	//查询按钮事件
	currTab.find("#queryProjectList").click(
			function() {
				var project_name = currTab.find("#project_name").val();
				//var project_num = $("#project_num").val();
				var status = currTab.find("#status").val();
				var organ_id = currTab.find("input[name=organ_id]").val();
				var system_name = currTab.find("#system_name").val();
				var project_man_name = currTab.find("#project_man_name").val();
				
				currTab.find('#projectInfoTab').bootstrapTable('refresh',{url:dev_planwork
					+ 'Wbs/queryAllProjectInfo.asp?project_name='
					+ encodeURI(project_name) + "&status=" + status + "&organ_id="
					+ organ_id + "&system_name=" + encodeURI(system_name) + "&project_man_name="
					+ encodeURI(project_man_name) + "&SID=" + SID + "&call=" + themecall});
			});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#queryProjectList").click();});
	//重置按钮事件
	currTab.find("#resetProject").click(function() {
		currTab.find("#project_name").val("");
		//$("#project_num").val("");
		currTab.find("#status").val(" ");
		currTab.find("#status").select2();
		currTab.find("input[name=ORGAN_NAME]").val(" ");
		currTab.find("#system_name").val("");
		currTab.find("#project_man_name").val("");
		currTab.find("input[name=organ_id]").val("");
	});
	//编辑计划按钮事件
	currTab.find("#wbsPMQ_newadd").click(function(){
		var selRow = currTab.find('#projectInfoTab').bootstrapTable("getSelections");
		if (selRow.length == 1) {
			var status = selRow[0].STATUS;
			if(status =="06"||status =="01"){
				openInnerPageTab("wbsPlan_edit","编辑计划","dev_planwork/wbs/wbsPlan_edit.html",function() {
					initWbs(selRow[0]);
				});	
			}else{
			alert("只有立项审批通过和执行中可以编辑计划");
			return;
			}
		}else{
			alert("请选择一条项目！");
			return;
		}
	});
	//跟踪计划按钮事件
	currTab.find("#wbsPMQ_track").click(function(){
		var selRow = currTab.find('#projectInfoTab').bootstrapTable("getSelections");
		if (selRow.length == 1) {
			var project_id = selRow[0].PROJECT_ID;
			var project_name = selRow[0].PROJECT_NAME;
			closeAndOpenInnerPageTab(
					"wbsPlan_track",
					"跟踪计划",
					"dev_planwork/wbs/wbsPlan_track.html",
					function() {
						currTab.find("#T_project_name").html("项目名称：" + project_name);
						currTab.find("#treegridTab_track").attr("project_id",project_id);
						InitTreeData_track(project_id);
					});
		}else{
			alert("请选择一条项目！");
			return;
		}
	});
	//查看计划按钮事件
	currTab.find("#wbsPMQ_show").click(function(){
		var selRow = currTab.find('#projectInfoTab').bootstrapTable("getSelections");
		if (selRow.length == 1) {
			var project_id = selRow[0].PROJECT_ID;
			var project_name = selRow[0].PROJECT_NAME;
			closeAndOpenInnerPageTab(
					"wbsPlan_show",
					"查看计划",
					"dev_planwork/wbs/wbsPlan_show.html",
					function() {
						currTab.find("#S_project_name").html("项目名称：" + project_name);
						currTab.find("#treegridTab_show").attr("project_id",project_id);
						InitTreeData_show(project_id,"treegridTab_show");
					});
		}else{
			alert("请选择一条项目！");
			return;
		}
	});
	//初始化WBS计划按钮事件
	currTab.find("#wbsPlan_init").click(function(){
		var selRow = currTab.find('#projectInfoTab').bootstrapTable("getSelections");
		if (selRow.length == 1) {
			var project_id = selRow[0].PROJECT_ID;
			var project_type = selRow[0].PROJECT_TYPE;
			var project_type_child = selRow[0].PROJECT_TYPE_CHILD;
			var project_plan = selRow[0].PROJECT_PLAN;
			var status =  selRow[0].STATUS;
			if(project_plan == "已创建"){
				alert("项目计划已创建，不能再初始化操作！");
				return;
			}else{
				if(status=="01"||status=="06"){
					 var call = getMillisecond();
					 var url = dev_planwork + 'Wbs/initWbsPlan.asp?SID=' + SID + "&call=" + call;
					 baseAjaxJsonp(url, {
						 project_id : project_id,
						 project_type : project_type,
						 project_type_child : project_type_child
						}, function(msg) {
							if(msg.result=="true"){
								$("#queryProjectList").click();
								alert("初始化WBS计划成功！");
							}else if(msg.result=="false"){
								alert("没有找到相应模板！");
							}else{
								alert("系统异常，请稍后！");
							}
						}, call);
				}else
					{
					alert("只有执行中和立项审批通过才可以初始化");
					return;
					}
			}
		}else{
			alert("请选择一条项目！");
			return;
		}
	});
	//查看里程碑按钮事件
	currTab.find("#wbsPMQ_landmark").click(function(){
		var selRow = currTab.find('#projectInfoTab').bootstrapTable("getSelections");
		if (selRow.length == 1) {
			var project_id = selRow[0].PROJECT_ID;
			var project_name = selRow[0].PROJECT_NAME;
			var project_plan = selRow[0].PROJECT_PLAN;
			if(project_plan == "未创建"){
				alert("该项目还没有创建计划！");
				return false;
			}
			
			closePageTab("wbsPlan_milestone");
			closeAndOpenInnerPageTab(
					"wbsPlan_milestone",
					"查看里程碑",
					"dev_planwork/wbs/wbsPlan_milestone.html",
					function() {
						currTab.find("#M_project_name").html("项目名称：" + project_name);
						initProjectVersSelect(project_id);
					});
		}else{
			alert("请选择一条项目！");
			return;
		}
	});
};
