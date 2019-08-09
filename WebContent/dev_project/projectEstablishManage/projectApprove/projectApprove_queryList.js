	
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
			url:dev_project+'draftProApproval/queryListDraftPro.asp?call='+call+'&SID='+SID+'&'+param});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#select_approve").click();});
	//拿回
    var nahui = currTab.find("#nahui");
    nahui.click(function(){
		var seles = table.bootstrapTable('getSelections');
		if(seles.length!=1){
			alert("请选择一条数据进行通过!");
			return;
		}
		var state = seles[0].APP_STATUS_NAME;                    
		if(state!="审批中"){
			alert("该信息不能拿回");
			return ;
		}
		
		approval('02',null,seles[0].INSTANCE_ID);
	});
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
		url : dev_project+'draftProApproval/queryListDraftPro.asp?call='+call+'&SID='+SID,
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
			field : "CURR_ACTORNO_NAME",
			title : "当前审批人",
			align : "center"
		}, {
			field : "APPLY_TIME",
			title : "立项申请时间",
			align : "center"
		}, {
			field : "FILE_ID",
			title : "文件ID",
			align : "center",
			visible: false
		}, {
			field : "CREATE_USER_ID",
			title : "项目创建人",
			align : "center",
			visible: false
		}]
	});
	
	//项目详情按鈕
	var approve = currTab.find("#detail_Approve");
	approve.bind('click', function(e) {
		var seles = table.bootstrapTable("getSelections");
		if(seles.length!=1){
			alert("请选择一条数据!");
			return;
		}
		/*var state = seles[0].APP_STATUS_NAME;                    
		if(state=="审批通过"){
			alert("该信息审批通过，不能再次审批");
			return ;
		}*/
		var seleData={seles:seles[0],type:"0"};
		closePageTab("approve_detail");
		openInnerPageTab("approve_detail","项目详情","dev_project/projectEstablishManage/projectApprove/projectApprove_detail.html", function(){
		initprojectApproveBtn(seleData);
		});
	});
}
//拿回业务处理
function nahui(DRAFT_ID){
	
	var seles = table.bootstrapTable("getSelections");
	
	var APP_STATUS = "04";
	
	if(seles[0].CREATE_USER_ID!=SID){
		alert("你不是当前项目创建人!");
		return ;
	}
	if(seles[0].PROJECT_TYPE_NAME!="现有应用改造项目"){
		alert("该项目不是现有应用改造项目无法拿回!");
		return ;
	}
	var call = getMillisecond();
	baseAjaxJsonp(dev_project+"draftProApproval/repulsedDraftInfo.asp?call="+call+"&SID="+SID,{"DRAFT_ID":DRAFT_ID,"APP_STATUS":APP_STATUS}, function(data){
		if (data != undefined && data != null && data.result=="true") {
			alert(data.msg);
		}else{
			alert(data.msg);
		}
	}, call);
}
		
initprojectApproveInfo();