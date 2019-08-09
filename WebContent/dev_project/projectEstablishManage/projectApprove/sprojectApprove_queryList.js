	
function initprojectApproveInfo(){
	var currTab = getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题
	
	autoInitSelect(currTab.find("#table_select"));
	
	var PROJECT_TYPE = currTab.find("select[name='PROJECT_TYPE']");
	PROJECT_TYPE.empty();
	var arr = "SYS_DIC_VERSION_PROJECT,SYS_DIC_REQUIREMENT_ANALYSIS_PROJECT,SYS_DIC_URGENT_PROJECT,SYS_DIC_ANNUAL_TASK_PROJECT";
	initSelect(PROJECT_TYPE,{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SYS_DIC_MILESTONE_PROJECT_TYPE"},null,null,arr);
	var table = currTab.find("#table_projectApprove");
	var form = currTab.find("#projectApproveForm");
	//查询
	var query = currTab.find("#select_approve");
	query.click(function(){
		var param = form.serialize();
		table.bootstrapTable('refresh',{
			url:dev_project+'draftProApproval/squeryListDraftPro.asp?call='+call+'&SID='+SID+'&'+param});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#select_approve").click();});
	//重置
	var reset = currTab.find("#reset_approve");
	reset.click(function(){
		form[0].reset();
		currTab.find("select").select2();
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
		url : dev_project+'draftProApproval/squeryListDraftPro.asp?call='+call+'&SID='+SID,
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
			width: "7%",
			formatter: function (value, row, index) {
				return index+1;
			}
		}, {
			field : 'PROJECT_NAME',
			title : '项目名称',
			align : "center"
		}, {
			field : "PROJECT_TYPE_NAME",
			title : "项目类型",
			align : "center"
		}, {
			field : "PROJECT_SCALE_NAME",
			title : "项目规模",
			align : "center"
		}, {
			field : "APP_STATUS_NAME",
			title : "审批状态",
			align : "center"
		}, {
			field : "PM_NAME",
			title : "项目经理",
			align : "center"
		}, {
			field : "EXPECT_GOAL",
			title : "项目预期要求",
			align : "center"
		}, {
			field : "APPLY_TIME",
			title : "立项申请时间",
			align : "center"
		}, {
			field : "FILE_ID",
			title : "文件ID",
			align : "center",
			visible : false
			
		}]
	});
	//项目审批按鈕
	var approve = currTab.find("#projectApprove");
	approve.bind('click', function(e) {
		var seles = table.bootstrapTable("getSelections");
		if(seles.length!=1){
			alert("请选择一条数据进行审批!");
			return;
		}
		var state = seles[0].APP_STATUS_NAME;  
		
		if(state=="审批通过"){
			alert("该信息审批通过，不能再次审批");
			return ;
		}
		var seleData={seles:seles[0],type:"1"};
		openInnerPageTab("approve_project","项目审批","dev_project/projectEstablishManage/projectApprove/projectApprove_add.html", function(){
			initprojectApproveBtn(seleData);
		});
	});
	//审批通过按鈕
	var approved = currTab.find("#Approveed");
	approved.click(function(){
		//TODO 需传入流程实例ID，单个或多个逗号个号的字符串；以及批量操作后的回调函数
		var instance_id = '';
		batchApprPassBtn(instance_id,batch_callFunc);
//		var seles = table.bootstrapTable('getSelections');
//		if(seles.length!=1){
//			alert("请选择一条数据进行通过!");
//			return;
//		}
//		var state = seles[0].APP_STATUS_NAME;                    
//		if(state=="审批通过"){
//			alert("该信息审批通过，不能再次通过");
//			return ;
//		}
//		var msg="是否通过此申请？";
//		nconfirm(msg,function(){
////			var DRAFT_ID = seles[0].DRAFT_ID; 
//			
//		});
	});
}
		
initprojectApproveInfo();

function approved(DRAFT_ID){
	var call = getMillisecond();
	baseAjaxJsonp(dev_project+"draftProApproval/approvedDraftInfo.asp?call="+call+"&SID="+SID,{"DRAFT_ID":DRAFT_ID}, function(data){
		if (data != undefined && data != null && data.result=="true") {
			alert(data.msg);
			var pcall = getMillisecond();
			 var url = dev_planwork + 'Wbs/initWbsPlan.asp?SID=' + SID + "&call=" + pcall;
			 baseAjaxJsonp(url, {
				 project_id : data.project_id,
				 project_type : data.project_type,
				}, function(msg) {
					if(msg.result=="true"){
						alert("初始化WBS计划成功！");
					}else if(msg.result=="false"){
						alert("没有找到相应模板！");
					}else{
						alert("系统异常，请稍后！");
					}
				}, pcall);
		}else{
			alert(data.msg);
		}
	}, call);
}
