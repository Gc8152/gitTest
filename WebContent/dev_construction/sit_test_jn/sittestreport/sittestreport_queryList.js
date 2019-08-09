initSitReportQueryListLayout();

function initSitReportQueryListLayout(){
	
	var currTab = getCurrentPageObj();
	
	var form = currTab.find("#sittestreport");
	var table = currTab.find("#sittestreport_table");//列表
	var tableCall = getMillisecond();
	
	autoInitSelect(form);//初始化下拉框
	//查询
	var commit = currTab.find("#commit");
	commit.click(function(){
		var param = form.serialize();
		table.bootstrapTable('refresh',{url: dev_construction+"SitReport/queryListSitReport.asp?SID="+SID+"&call="+tableCall+"&"+param});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#commit").click();});
	//处置
	var reset = currTab.find("#reset");
	reset.click(function(){
		form[0].reset();
		currTab.find("select").select2();
	});
	
	/**		初始化按钮跳转	**/
	/*编辑报告*/
	var edit = currTab.find("#edit");
	edit.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行报告上传!");
			return ;
		}
		var state = rows[0].STATUS;                    
		if(state=="01"){
			alert("该信息已提交，不能再次上传!");
			return ;
		}
		openInnerPageTab("sittestreport_edit","sit测试报告编辑","dev_construction/sit_test_jn/sittestreport/sittestreport_edit.html",function(){
			initSitTestReportInfoLayout(rows[0]);
		});
	});
	/*查看详情*/
	var queryInfo = currTab.find("#queryInfo");
	queryInfo.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行查看!");
			return ;
		}
		openInnerPageTab("queryInfo","查看sit测试报告","dev_construction/sit_test_jn/sittestreport/sittestreport_queryInfo.html",function(){
			initviewSitTestReportInfo(rows[0]);
		});
	});
	/*提交*/
	var submit = currTab.find("#submit");
	submit.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行提交!");
			return ;
		}
		var status =rows[0].STATUS;
		if(status=='01'){
			alert("该信息已提交!");
			return ;
		} 
		var call = getMillisecond();
		nconfirm("是否提交？",function(){
			var SIT_ID = rows[0].SIT_ID;  
			baseAjaxJsonp(dev_construction+"SitReport/submitSitReport.asp?call="+call+"&SID="+SID,{"SIT_ID":SIT_ID}, function(data){
				if (data != undefined && data != null && data.result=="true") {
					alert(data.msg);
					commit.click();
				}else{
					alert(data.msg);
				}
			}, call);
		});
	});
	/*提交审批*/
	var approve = currTab.find("#approve");
	approve.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行提交审批!");
			return ;
		}
		var status =rows[0].STATUS;
		if(status=='00'){
			alert("该信息未提交，不能提交审批!");
			return ;
		} 
		var call = getMillisecond();
		nconfirm("是否提交审批？",function(){
			var SIT_ID = rows[0].SIT_ID;  
			baseAjaxJsonp(dev_construction+"SitReport/approveSitReport.asp?call="+call+"&SID="+SID,{"SIT_ID":SIT_ID}, function(data){
				if (data != undefined && data != null && data.result=="true") {
					alert(data.msg);
					commit.click();
				}else{
					alert(data.msg);
				}
			}, call);
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
	table.bootstrapTable("destroy").bootstrapTable({
		//请求后台的URL（*）
		url : dev_construction+"SitReport/queryListSitReport.asp?SID="+SID+"&call="+tableCall,
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
		uniqueId : "ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		jsonpCallback : tableCall,
		detailView : false, //是否显示父子表
		singleSelect: true,
		columns : [ {
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		},{
			field : 'aa',
			title : '序号',
			align : "center",
			formatter : function(value, row, index){
				return index+1;
			}
		}, {
			field : 'REQ_TASK_CODE',
			title : '需求任务编号',
			align : "center"
		},{
			field : 'REQ_TASK_NAME',
			title : '需求任务名称',
			align : "center"
		}, {
			field : "SYSTEM_NAME",
			title : "应用名称",
			align : "center"
		}, {
			field : "FILE_STATUS_NAME",
			title : "报告上传状态",
			align : "center"
		}, {
			field : "STATUS_NAME",
			title : "提交状态",
			align : "center"
		},{
			field : "ACCEPT_RESULT_NAME",
			title : "验收结论",
			align : "center"
		}, {
			field : "TOTAL_LEAVE",
			title : "遗留缺陷数",
			align : "center"
		}, {
			field : "OPT_PERSON_NAME",
			title : "提交人",
			align : "center"
		}, {
			field : "APP_STATUS_NAME",
			title : "审批状态",
			align : "center"
		}, {
			field : "APP_PERSON_NAME",
			title : "当前审批人",
			align : "center"
		}, {
			field : "APP_TIME",
			title : "审批时间",
			align : "center"
		}]
	});
}