initMyProjectLayout();

function initMyProjectLayout(){
	
	var currTab = getCurrentPageObj();
	
	autoInitSelect(currTab.find("#table_select"));
	currTab.find("select[name='STATUS']").empty();
	initSelect(currTab.find("select[name='STATUS']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_PROJECT_STATUS"});
	var form = currTab.find("#myProject_query");
	var table = currTab.find("#myProject_table");
	//点击打开项目经理模态框
	var pm_name = currTab.find("input[name=PROJECT_MAN_NAME]");
	pm_name.click(function(){
		openPmPop(currTab.find("#myPro_choosePm"),{Zpm_id:currTab.find("input[name=PROJECT_MAN_ID]"),Zpm_name:currTab.find("input[name=PROJECT_MAN_NAME]")});
	});
	//所属处室选择
	var treeInputObj=currTab.find("input[name=ORGAN_NAME]");
	var treeInputID=currTab.find("input[name=ORGAN_ID]");
	treeInputObj.click(function(){
		openSelectTreeDiv($(this),"myProjectOrgTree","SOrg/queryorgtreelist.asp",{"margin-top": "2px",width:"140px"},function(node){
			treeInputObj.val(node.name);
			treeInputID.val(node.id);
		});
	});
	treeInputObj.focus(function(){
		treeInputObj.click();
	});
	//查询
	var commit = currTab.find("#commit");
	commit.click(function(){
		var param = encodeURI(form.serialize());
		table.bootstrapTable('refresh',{
			url:dev_project+'myProject/queryListmyProject.asp?call='+tableCall+'&SID='+SID+"&"+param});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#commit").click();});
	//重置
	var reset = currTab.find("#reset");
	reset.click(function(){
		form[0].reset();
		currTab.find("select").select2();
		currTab.find("input[name=PROJECT_MAN_ID]").val("");
		currTab.find("input[name=ORGAN_ID]").val("");
	});
	
	/**		初始化按钮跳转	**/
	/*项目管理*/
	var proEmpManage = currTab.find("#proEmpManage");
	proEmpManage.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行操作!");
			return ;
		}
		var project_man_name = rows[0].PROJECT_MAN_NAME;
		if(project_man_name==undefined||project_man_name==''||project_man_name==null){
			alert("项目未指派实施项目经理!");
			return ;
		}
		openInnerPageTab("myProject_queryInfo","我的项目360°视图","dev_project/myProject/myProject_queryInfo.html",function(){
			$("#ProjectManInt_li").attr("project_id",rows[0].PROJECT_ID);
			var draft_id = rows[0].DRAFT_ID;
			//只有要发起立项的项目才能进行结项
			if(!draft_id){
				$("#project_end_li").hide();
			}
			initProblemHandleLayout(rows[0]);
		});
//		 openInnerPageTab("projectMan","项目人员管理","dev_project/myProject/projectMan/projectMan_queryList.html",function(){
//			initProjectManInfo();
//		});
	});
	/*WBS计划*/
	var wbsPlan = currTab.find("#wbsPlan");
	wbsPlan.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		newOpenTab("wbsPlan","WBS计划","dev_project/myProject/wbsPlan/wbsPlan_qeryList.html",function(){
			initLayout(rows);
		});
	});
	/*风险问题管理*/
	/*???*/
	var aa = currTab.find("#aa");
	aa.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		newOpenTab("aa","WBS计划","dev_project/myProject/aa/wbsPlan_qeryList.html",function(){
			initLayout(rows);
		});
	});
	
	/*变更管理*/
	var changeManage = currTab.find("#changeManage");
	changeManage.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		newOpenTab("changeManage","配置管理","dev_project/myProject/changeManage/changeManage_qeryList.html",function(){
			initLayout(rows);
		});
	});
	/*项目结项*/
	 var endInfo="";
	var projectEnd = currTab.find("#projectEnd");
	projectEnd.click(function(){
	    var rows = table.bootstrapTable('getSelections');
	    if(rows.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
	    var call = getMillisecond();
	    var PROJECT_ID = rows[0].PROJECT_ID;
	    baseAjaxJsonp(dev_project+"myProject/queryOneProEnd.asp?call="+call+"&SID="+SID,{"PROJECT_ID":PROJECT_ID}, function(data){
	    	var endInfo=data.row;
	    	if (endInfo.length!=0) {
	       		if(endInfo[0].APP_STATUS=="01"||endInfo[0].APP_STATUS=="02"){
	       			alert("该项目已在审批中或审批通过!");
	       			return false;
	       		}
	       		openInnerPageTab("projectEnd","项目结项","dev_project/myProject/projectEnd/projectEndApply_edit.html",function(){
	       			initprojectEndApplyInfo(rows[0],endInfo[0]);
	       		});
			}else{
				openInnerPageTab("projectEnd","项目结项","dev_project/myProject/projectEnd/projectEndApply_edit.html",function(){
	       			initprojectEndApplyInfo(rows[0],null);
	       		});
			}
		}, call);
	});
	/*指派实施项目经理*/
	var excuteProjectManager = currTab.find("#excuteProjectManager");
	excuteProjectManager.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		newOpenTab("excuteProjectManager","指派实施项目经理","dev_project/myProject/excuteProjectManager/excuteProjectManager_qeryList.html",function(){
			initLayout(rows);
		});
	});
	/*项目360视图*/
	var projectDetail = currTab.find("#projectDetail");
	projectDetail.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		newOpenTab("projectDetail","项目360视图","dev_project/myProject/projectDetail/projectDetail_qeryList.html",function(){
			initLayout(rows);
		});
	});
	
	/**		初始化table	**/
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	var tableCall = getMillisecond();
	table.bootstrapTable({
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
		uniqueId : "aa", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:tableCall,
		singleSelect: true,
//		onDblClickRow:function(row){
//			openInnerPageTab("myProject_queryInfo","我的项目360°视图","dev_project/myProject/myProject_queryInfo.html",function(){
//				initProblemHandleLayout(row);
//			});
//			
//		},
		columns : [ {
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		}, {
			field : 'Number',
			title : '序号',
			align : "center",
			sortable: true,
			formatter: function (value, row, index) {
				return index+1;
			}
		}/*, {
			field : "flag",
			title : "标识",
			align : "center"
		}*/, {
			field : "PROJECT_NUM",
			title : "项目编号",
			align : "center"
		}, {
			field : "PROJECT_NAME",
			title : "项目名称",
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
		}/*, {
			field : "SPI_VAL",
			title : "SPI值",
			align : "center"
		}, {
			field : "CPI_VAL",
			title : "CPI值",
			align : "center"
		}, {
			field : "CHANGE_SUM",
			title : "变更总数(审批中)",
			align : "center"
		}*/, {
			field : "PROJECT_MAN_NAME",
			title : "项目经理",
			align : "center"
		}, {
			field : "DUTY_USER_NAME",
			title : "项目负责人",
			align : "center"
		}, {
			field : "ORGAN_NAME",
			title : "所属处室",
			align : "center"
		}, {
			field : "STATUS_NAME",
			title : "项目状态",
			align : "center"
		}]
	});
	
}