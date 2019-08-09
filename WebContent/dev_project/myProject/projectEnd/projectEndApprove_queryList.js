	
function initproEndApproveInfo(){
	var currTab = getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题
	
	autoInitSelect(currTab.find("#table_select"));
	var PROJECT_TYPE = currTab.find("select[name='PROJECT_TYPE']");
	PROJECT_TYPE.empty();
	var arr = "SYS_DIC_VERSION_PROJECT,SYS_DIC_REQUIREMENT_ANALYSIS_PROJECT,SYS_DIC_URGENT_PROJECT,SYS_DIC_ANNUAL_TASK_PROJECT";
	initSelect(PROJECT_TYPE,{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SYS_DIC_MILESTONE_PROJECT_TYPE"},null,null,arr);
	var form = currTab.find("#proEnd_query");
	var table = currTab.find("#table_projectApprove");
	//点击打开项目经理模态框
	var pm_name = currTab.find("input[name=PROJECT_MAN_NAME]");
	pm_name.click(function(){
		openPmPop(currTab.find("#proEnd_choosePm"),{Zpm_id:currTab.find("input[name=PROJECT_MAN_ID]"),Zpm_name:currTab.find("input[name=PROJECT_MAN_NAME]")});
	});
	//所属处室选择
	var treeInputObj=currTab.find("input[name=ORGAN_NAME]");
	var treeInputID=currTab.find("input[name=ORGAN_ID]");
	treeInputObj.click(function(){
		openSelectTreeDiv($(this),"projectEndOrgTree","SOrg/queryorgtreelist.asp",{"margin-top": "2px",width:"140px"},function(node){
			treeInputObj.val(node.name);
			treeInputID.val(node.id);
		});
	});
	treeInputObj.focus(function(){
		treeInputObj.click();
	});
	//查询
	var query = currTab.find("#select_proEnd");
	query.click(function(){
		var param = form.serialize();
		table.bootstrapTable('refresh',{
			url:dev_project+'proEnd/queryListProEnd.asp?call='+call+'&SID='+SID+'&'+param});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#select_proEnd").click();});
	//重置
	var reset = currTab.find("#reset_proEnd");
	reset.click(function(){
		form[0].reset();
		currTab.find("select").select2();
		$("input[name='ORGAN_ID']").val("");
		$("input[name='PROJECT_MAN_ID']").val("");
	});
	//列表显示
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	var call = getMillisecond();
	table.bootstrapTable({
		//请求后台的URL（*）
		url : dev_project+'proEnd/queryListProEnd.asp?call='+call+'&SID='+SID,
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
		uniqueId : "DRAFT_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:call,
		singleSelect: true,
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
			width: 50,
			formatter: function (value, row, index) {
				return index+1;
			}
		}, {
			field : 'PROJECT_NUM',
			title : '项目编号',
			align : "center"
		}, {
			field : 'PROJECT_NAME',
			title : '项目名称',
			align : "center"
		}, {
			field : "PROJECT_TYPE_NAME",
			title : "项目类型",
			align : "center"
		}, {
			field : "ORGAN_NAME",
			title : "所属处室",
			align : "center"
		}, {
			field : "APP_STATUS_NAME",
			title : "审批状态",
			align : "center"
		}, {
			field : "PROJECT_MAN_NAME",
			title : "项目经理",
			align : "center"
		}, {
			field : "AUDIT_USER_NAME",
			title : "当前审批人",
			align : "center"
		}]
	});
	
	//项目审批按鈕
	var approve = currTab.find("#projectApprove");
	approve.bind('click', function(e) {
		var seles = $('#table_projectApprove').bootstrapTable("getSelections");
		if(seles.length!=1){
			alert("请选择一条数据进行审批!");
			return;
		}
		var state = seles[0].APP_STATUS_NAME;                    
		if(state!="审批中"){
			alert("该信息不是审批中状态，不能审批");
			return ;
		}
		openInnerPageTab("approve_project","项目审批","dev_project/myProject/projectEnd/projectEndApprove_add.html", function(){
			initproEndApproveBtn(seles[0]);
		});
	});
	//审批通过按鈕
	var approveed = currTab.find("#Approveed");
	approveed.click(function(){
		var seles = $("#table_projectApprove").bootstrapTable('getSelections');
		if(seles.length!=1){
			alert("请选择一条数据进行通过!");
			return;
		}
		var state = seles[0].APP_STATUS;                    
		if(state!="01"){
			alert("该信息不是审批中状态，不能审批通过");
			return ;
		}
		var msg="是否通过此申请？";
		nconfirm(msg,function(){
			var END_ID = seles[0].END_ID; 
			var PROJECT_ID = seles[0].PROJECT_ID;
			var call = getMillisecond();
			baseAjaxJsonp(dev_project+"proEnd/approvedProEnd.asp?call="+call+"&SID="+SID,{"END_ID":END_ID,"PROJECT_ID":PROJECT_ID}, function(data){
				if (data != undefined && data != null && data.result=="true") {
					alert(data.msg);
					query.click();
				}else{
					alert(data.msg);
				}
			}, call);
		});
	});	
	
}
		
initproEndApproveInfo();