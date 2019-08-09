
(function initAnnualVersionPlanInfo(){
	var currTab = getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题
	var tableCall=getMillisecond();			//table回调方法名
	//初始化下拉选
	autoInitSelect(currTab.find("#table_select"));
	var table = currTab.find("#table_annualVersionPlan");
	
	//查询
	var query = currTab.find("#select_version");
	query.click(function(){  
		var versions_name = $.trim(currTab.find("[name='versions_name']").val());
		var versions_date = currTab.find("[name='versions_date']").val();
		var versions_type = $.trim(currTab.find("[name='versions_type']").val());
		if(versions_date=="点击选择年度"){
			versions_date="";
		}
		table.bootstrapTable('refresh',{
			url:dev_construction+'reqSubAudit/queryVersionInfoList.asp?SID='+SID+'&call='+tableCall
			+ '&versions_date=' + versions_date +'&versions_type=' +versions_type+ '&versions_name='+escape(encodeURIComponent(versions_name))});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#select_version").click();});
	//重置
	var reset = currTab.find("#reset_version");
	reset.click(function(){
		currTab.find("input,select").val(" ");
		currTab.find("select").select2();
	});
	
	//新增
	var add = currTab.find("#add_annual");
	add.click(function(){
		var seles = table.bootstrapTable("getSelections");
		if(seles.length!=1){
			alert("请选择一条数据进行评审!");
			return;
		}
		if(seles[0].IS_AUDIT=="00"){
			alert("该版本已完成评审确认");
			return;
		}
		var selesInfo=JSON.stringify(seles);
		var params=JSON.parse(selesInfo);
		closeAndOpenInnerPageTab("add_annual","版本需求评审","dev_construction/send_produce/audit/subVersionSubmit.html", function(){
			initAnnualVersionEditEvent(params[0],"1");
		
		});
	 });
	
	//查看
	var add = currTab.find("#info_annual");
	add.click(function(){
		var seles = table.bootstrapTable("getSelections");
		if(seles.length!=1){
			alert("请选择一条数据进行查看!");
			return;
		}
		
		var selesInfo=JSON.stringify(seles);
		var params=JSON.parse(selesInfo);
		closeAndOpenInnerPageTab("add_annual","版本需求查看","dev_construction/send_produce/audit/subVersionSubmit.html", function(){
			initAnnualVersionEditEvent(params[0],"2");
			getCurrentPageObj().find("#add_peelAudit").hide();
			getCurrentPageObj().find("#submit_sub").hide();
			getCurrentPageObj().find("#version_app_file_record_").hide();
			getCurrentPageObj().find("#peel_title").html("需求点列表");
		});
	 });	
	
	//年度版本计划列表显示
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	table.bootstrapTable({
		//请求后台的URL（*）
		url : dev_construction+'reqSubAudit/queryVersionInfoList.asp?SID='+SID+'&call='+tableCall,
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
		singleSelect: true,
		jsonpCallback:tableCall,
		onLoadSuccess:function(data){
			gaveInfo();	
		},
		columns : [ {
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		},{
			field : 'VERSIONS_NAME',
			title : '版本名称',
			align : "center",
			width : "150px"
		}, {
			field : "VERSIONS_STATUS_NAME",
			title : "版本状态",
			align : "center",
			width : "100px"
		},{
			field : "TASK_COUNT",
			title : "涉及任务总数",
			align : "center",
			width : "120px"
		},{
			field : "TASK_NOSEND_COUNT",
			title : "未提交投产任务数",
			align : "center",
			width : "120px"
		},{
			field : "SUB_COUNT",
			title : "需求点数",
			align : "center",
			width : "120px"
		},{
			field : "PEEL_COUNT",
			title : "剥离需求点数",
			align : "center",
			width : "120px"
		},{
			field : "IS_AUDIT",
			title : "是否完成评审",
			align : "center",
			width : "120px",
			formatter:function(value, row, index) {
				if(value=="00"){
					return "已完成";
				}else{
					return "未完成";
				}
			}
		},{
			field : "AUDIT_TIME",
			title : "评审时间",
			align : "center",
			width : "120px"
		},{
			field : "START_TIME",
			title : "投产开始时间",
			align : "center",
			width : "120px"
		}]
	});
	
})();
		