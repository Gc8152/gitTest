initProblemApproveListLayout();
;function initProblemApproveListLayout(){
	var currTab = getCurrentPageObj();
	
	var form = currTab.find("#problemApprove_commit_form");
	var table = currTab.find("#problem_InfoTable");
	autoInitSelect(form);
	//查询按钮
	var commit = currTab.find("#problemApprove_commit");
	commit.click(function(){
		initTable();
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#problemApprove_commit").click();});
	//重置按钮
	var reset = currTab.find("#problemApprove_reset");
	reset.click(function(){
		form[0].reset();
		currTab.find("select").select2();
	});

    //查看按钮
	var problem_Info = currTab.find("#problemApprove_Info");
	problem_Info.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行查看!");
			return ;
		}
		openInnerPageTab("problemApprove_handle","问题单审批页面","dev_construction/fault/problem/problemApprove_handle.html",function(){
			$("#aprove_first").attr("class","active");
			initProblemApproveHandleLayout(rows[0].PROBLEM_ID);
		});
	});
	//审批按钮
	var problem_handle = currTab.find("#problemApprove_approve");
	problem_handle.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行处理!");
			return ;
		}
		openInnerPageTab("problemApprove_handle","问题单审批页面","dev_construction/fault/problem/problemApprove_handle.html",function(){
			$("#aprove_second").attr("class","active");
			$("#tab2_approve").removeAttr("class"); 
			$("#tab2_approve").attr("class","tab-pane fade in active");
			$("#home_approve").removeAttr("class"); 
			$("#home_approve").attr("class","tab-pane fade");
			initProblemApproveHandleLayout(rows[0].PROBLEM_ID);
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
	
	initTable();
	
	function initTable(){
		var param = form.serialize();
		var kind=2;//查询分类（用于区分列表查询还是审批查询）， 由于列表与审批查询字段不同要求
		var call = getMillisecond();
		table.bootstrapTable('destroy').bootstrapTable({
			//请求后台的URL（*）
			url : dev_construction+'Problem/problemQueryList.asp?call='+call+'&SID='+SID+"&"+param+"&kind="+kind,
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
			uniqueId : "PROBLEM_ID", //每一行的唯一标识，一般为主键列
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
				field : 'SERNO',
				title : '流水号',
				align : "center"
			},/* {
				field : "PROBLEM_ID",
				title : "问题单编号",
				align : "center"
			},*/ {
				field : "PROBLEMORIGIN",
				title : "数据来源",
				align : "center"
			}, {
				field : "DESCRIPTIONS",
				title : "问题描述",
				align : "center"
			}, {
				field : "APPROVE_NODE",
				title : "当前环节",
				align : "center"
			}, {
				field : "PRJ_HANDLER_NAME",
				title : "项目经办人",
				align : "center"
			}, {
				field : "APPROVE_OWNER_NAME",
				title : "当前责任人",
				align : "center"
			},{
				field : "CDAT_HAPPENDATE",
				title : "问题发生时间",
				align : "center"
			}]
		});
	}
	
}