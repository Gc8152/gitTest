initProEstablishApplyLayout();

function initProEstablishApplyLayout(){
	var currTab = getCurrentPageObj();
	
	autoInitSelect(currTab.find("#proEstablishApply_query"));
	var PROJECT_TYPE = currTab.find("select[name='PROJECT_TYPE']");
	PROJECT_TYPE.empty();
	var arr = "SYS_DIC_VERSION_PROJECT,SYS_DIC_REQUIREMENT_ANALYSIS_PROJECT,SYS_DIC_URGENT_PROJECT,SYS_DIC_ANNUAL_TASK_PROJECT";
	initSelect(PROJECT_TYPE,{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SYS_DIC_MILESTONE_PROJECT_TYPE"},null,null,arr);
	var tableCall = getMillisecond();
	
	var form = currTab.find("#proEstablishApply_query");
	var table = currTab.find("#preEstablishApplyTable");
	//查询
	var commit = currTab.find("#commit");
	commit.click(function(){
		var param = form.serialize();
		table.bootstrapTable('refresh',{
			url:dev_project+'draftProApply/queryListDraftPro.asp?call='+tableCall+'&SID='+SID+'&'+param});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#commit").click();});
	//重置
	var reset = currTab.find("#reset");
	reset.click(function(){
		form[0].reset();
		currTab.find("select").select2();
	});
	
	/*项目立项申请*/
    var add = currTab.find("#add_projectApply");
    add.click(function(){
    	var seles = $('#preEstablishApplyTable').bootstrapTable("getSelections");
		if(seles.length!=1){
			alert("请选择一条数据进行申请!");
			return;
		}
		var state = seles[0].APP_STATUS_NAME;                    
		if(state=="审批通过"||state=="审批中"){
			alert("该信息已申请");
			return ;
		}
		if(seles[0].PM_ID!=SID){
			alert("你不是当前项目经理!");
			return ;
		}
		
    	openInnerPageTab("addProjectApply","新增项目立项申请","dev_project/projectEstablishManage/projectApply/projectEstablishApply_add.html",function(){
    		initProjectApplyAddLayout(seles[0]);
		});
	});
    
    /*提交审批*/
    var submit = currTab.find("#submit_projectApply");
    submit.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行提交!");
			return ;
		}
		if(rows[0].PM_ID!=SID){
			alert("你不是当前项目经理!");
			return ;
		}
		var projectGoal = rows[0].PROJECT_GOAL;
		if(projectGoal==null||projectGoal==''||projectGoal==undefined){
			alert("请填写项目立项!");
			return ;
		}
		var state = rows[0].APP_STATUS;
		if(state=='00'||state=='03'){
			nconfirm("是否提交此申请？",function(){
				var DRAFT_ID = rows[0].DRAFT_ID; 
				var call = getMillisecond();
				baseAjaxJsonp(dev_project+"draftProApply/submitDraftPro.asp?call="+call+"&SID="+SID,{"DRAFT_ID":DRAFT_ID}, function(data){
					if (data != undefined && data != null && data.result=="true") {
						alert(data.msg);
						commit.click();
					}else{
						alert(data.msg);
					}
				}, call);
			});
			rows[0]["af_id"] = '41';
			rows[0]["systemFlag"] = '01';
			rows[0]["biz_id"] = rows[0].DRAFT_ID;
			approvalProcess(rows[0],initProEstablishApplyLayout(true));
		} else {
			alert("该信息不是草拟或打回状态，不能提交审批");
			return ;
		}
	});
    
    /*查看详情*/
    var detail = currTab.find("#view_projectApply");
    detail.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行查看!");
			return ;
		}
		closePageTab("projectApplyDetail")
		openInnerPageTab("projectApplyDetail","项目立项申请","dev_project/projectEstablishManage/projectApply/projectEstablishApply_queryInfo.html",function(){
			initviewApplyInfo(rows[0]);
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
	table.bootstrapTable({
		//请求后台的URL（*）
		url : dev_project+'draftProApply/queryListDraftPro.asp?call='+tableCall+'&SID='+SID,
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
		jsonpCallback:tableCall,
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
			field : "SUBMIT_TIME",
			title : "创建时间",
			align : "center"
		}]
	});
};
	
		
		
