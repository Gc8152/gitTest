var url = '';
//按钮方法
function initQueryInterfaceButtonEvent(){
	var $page = getCurrentPageObj();
	//服务方 pop框按钮
	$page.find("[name='ser_system_name']").click(function(){
		var $name = $page.find("[name='ser_system_name']");
		var $id = $page.find("[name='con_system_id']");
		var $systemPop = $page.find("[mod='systemPop']");
		query_systemPop($systemPop, {id : $id, name : $name});
	});
	
	getCurrentPageObj().find("#interQuery").click(
			function() {
				
				var param=getCurrentPageObj().find("#interfaceinfo_querylist_f").serialize();
				getCurrentPageObj().find('#interTableInfo').bootstrapTable('refresh',{url:dev_application+'InterQuery/queryallinterface.asp?SID='+SID+'&'+param});
				
			});
	//enter触发查询
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#interQuery").click();});
	
	getCurrentPageObj().find("#inter360").click(function(){
		var selections = getCurrentPageObj().find("#interTableInfo").bootstrapTable('getSelections');
		if(selections.length != 1) {
			alert("请选择一条数据进行操作!");
			return;
		}
		var ids=$.map(selections, function (row) {return row.INTER_ID;});
		var inter_version=$.map(selections, function (row) {return row.INTER_VERSION;});
		//显示接口详细信息
		InitInter360Info(ids,inter_version);
	});
	getCurrentPageObj().find("#interChange").click(function(){
		var seles = getCurrentPageObj().find("#interTableInfo").bootstrapTable('getSelections');
			if(seles.length!=1){
					alert("请选择一条数据进行变更!");
					return;
			}
			var selesInfo=JSON.stringify(seles);
			var params=JSON.parse(selesInfo);
			 if(params[0].INTER_STATUS_CODE!="02" && params[0].INTER_STATUS_CODE!="01"){
				alert("在建或执行中状态的接口可以发起变更!");
				return;
			}
			 var app_status = params[0].INTER_APP_STATUS;
			 if(app_status){
				 var arr = app_status.split(",");
				 if(arr.indexOf("00")!= -1){
						alert("该接口变更已在草拟中");
						return;
					}else if(arr.indexOf("01")!= -1){
						alert("该接口变更已发起-待管理岗受理");
						return;
					}else if(arr.indexOf("06")!= -1){
						alert("该接口变更已发起-待ESB受理");
						return;
					}
			 }
			
			params[0].is_new="00";
			 closeAndOpenInnerPageTab("addOrder_changeAppList","填写申请单","dev_application/changeInterfaceApply/changeInterApply_edit.html", function(){
				 initChangeAppLayOut(params[0]);
				});
	
		});
	getCurrentPageObj().find("#interReset").click(function() {
		getCurrentPageObj().find("#interfaceinfo_querylist_f input").val("");
		var selects = getCurrentPageObj().find("#interfaceinfo_querylist_f select");
		selects.val(" ");
		selects.select2();
	});
	//接口调用关系图
	getCurrentPageObj().find("#interInvoking").unbind("click");
	getCurrentPageObj().find("#interInvoking").click(function(){
		var selections = getCurrentPageObj().find("#interTableInfo").bootstrapTable('getSelections');
		if(selections.length != 1) {
			alert("请选择一条数据进行操作!");
			return;
		}
		var ids=$.map(selections, function (row) {return row.INTER_ID;});
		closeAndOpenInnerPageTab("interInvoking","接口调用关系","dev_application/interfaceInfo/interfaceinfo_invoking.html",function(){
			setTimeout(function(){
				interInvokingView(ids);
			},500);
		});
	});	
}

//点击接口详情按钮页面跳转获取详细的接口信息
function InitInter360Info(id,version){
	closeAndOpenInnerPageTab("interfaceinfo_360mesbasic","接口信息查询","dev_application/interfaceInfo/interfaceinfo_360mesbasic.html",function(){
		var modObj = getCurrentPageObj().find("#inter360_basic_table");
		Inter360InfoDetail(id);
		inter360initAttrTable(id,version,modObj,"table[tb=360attrTable] tbody",null);
		//报文输入输出信息
		initImportContentQuery(id,"AImportContentList",version);
		initExportContentQuery(id,"AExportContentList",version);
		//接口调用关系查询
		initInter_useRelationQuery(id);
		//接口版本信息
		initVersionListTable(id);
		//变更列表信息
		initExchangeListQuery(id);
	});
}

//查询列表显示table
function initInterfaceInfo1() {
	var param1=getCurrentPageObj().find("#interfaceinfo_querylist_f").serialize();
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	
	getCurrentPageObj().find("#interTableInfo").bootstrapTable(
			{
				//请求后台的URL（*）
				url:dev_application+'InterQuery/queryallinterface.asp?SID='+SID+'&'+param1,
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
				uniqueId : "inter_id", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
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
				},{
					field : 'INTER_CODE',
					title : '接口编号',
					align : "center",
					width : "100",
				},{
					field : 'TRADE_CODE',
					title : '接口交易码',
					align : "center",
					width : "100",
				}, {
					field : "INTER_NAME",
					title : "接口名称",
					align : "center"
				}, {
					field : "INTER_STATUS",
					title : "接口状态",
					align : "center"
				}, {
					field : "INTER_VERSION",
					title : "当前版本号",
					align : "center"
				}, {
					field : "SER_SYSTEM_NAME",
					title : "服务方应用名称",
					align : "center"
				}, {
					field : "INTER_DESCR",
					title : "接口描述",
					align : "center"
				}, {
					field : "USE_TIME",
					title : "被调用次数",
					align : "center"
				}]
			});
	
};
	
//下拉框方法
function initInterfaceInfoQueryType(){
	//初始化数据
	initSelect(getCurrentPageObj().find("#inter_status"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"I_DIC_INTER_STATUS"},"bb");
}
initQueryInterfaceButtonEvent();
initInterfaceInfo1();
initInterfaceInfoQueryType();

