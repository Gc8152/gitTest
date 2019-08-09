var url = '';
//按钮方法

function initQueryInterInfoRepairButtonEvent(){
	var quaryInfoRepairCall=getMillisecond();
	initInterInfoRepairList(quaryInfoRepairCall);
	var $page = getCurrentPageObj();
	//查询
	getCurrentPageObj().find("#queryInfoRepair").click(
		function() {
			var params = getCurrentPageObj().find("#interInfoRepairForm").serialize();		
		$('#interRepairTableInfo').bootstrapTable('refresh',{url:dev_application+'InterInfoRepair/queryInterInfoList.asp?SID='+SID+'&call='+quaryInfoRepairCall+'&'+params});
	});
	//enter触发查询
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#queryInfoRepair").click();});
	//接口补登
	getCurrentPageObj().find("#intiInterReCheck_in").click(function(){
		closeAndOpenInnerPageTab("intiInterReCheck_in","补登接口","dev_application/interfaceManage/interInfoRepair/interSupplementary_edit.html",function(){
			interReSignMsg();
		});		
	});
	
	//接口信息修改
	getCurrentPageObj().find("#interInfoChange").click(function(){
		var selections = getCurrentPageObj().find("#interRepairTableInfo").bootstrapTable('getSelections');
		if(selections.length != 1) {
			alert("请选择一条数据进行操作!");
			return;
		}
		if(selections[0].INTER_STATUS != "02" && selections[0].INTER_STATUS != "03"){
			alert("该接口尚未生成，暂时不能修改");
			return;
		}
		var selesInfo=JSON.stringify(selections);
		var params=JSON.parse(selesInfo);
		closeAndOpenInnerPageTab("intiInterReCheck_in","修改接口信息","dev_application/interfaceManage/interInfoRepair/inforMaintenace_edit.html",function(){
			initInterInfoRepair(params[0]);
		});
	});
	
	//重置
	getCurrentPageObj().find("#resetInfoRepair").click(function() {
		getCurrentPageObj().find("#interInfoRepairForm input").val("");
		getCurrentPageObj().find("#inter_status").val(" ");
		getCurrentPageObj().find("#inter_status").select2();
	});
	
	$page.find("[name='ser_system_name']").click(function(){
		var $name = $page.find("[name='ser_system_name']");
		var $id = $page.find("[name='con_system_id']");
		var $systemPop = $page.find("[mod='systemPop']");
		query_systemPop($systemPop, {id : $id, name : $name});
	});
}

//查询列表显示table
function initInterInfoRepairList(quaryInfoRepairCall) {
	var inter_code = $.trim(getCurrentPageObj().find("#inter_code").val());
	var inter_name =  $.trim(getCurrentPageObj().find("#inter_name").val());
	var inter_status = $.trim(getCurrentPageObj().find("#inter_status").val());
	var ser_system_name =  $.trim(getCurrentPageObj().find("#ser_system_name").val());
	var inter_descr =  $.trim(getCurrentPageObj().find("#inter_descr").val());
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	
	getCurrentPageObj().find("#interRepairTableInfo").bootstrapTable(
			{
				//请求后台的URL（*）
				url : dev_application+'InterInfoRepair/queryInterInfoList.asp?inter_code='+inter_code+'&inter_name='+inter_name+'&inter_status='+inter_status+'&ser_system_name='+ser_system_name+'&inter_descr='+inter_descr+'&SID='+SID+'&call='+quaryInfoRepairCall,
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
				uniqueId : "inter_code", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				jsonpCallback:quaryInfoRepairCall,
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
					width : "100"
				},{
					field : 'TRADE_CODE',
					title : '接口交易码',
					align : "center",
					width : "100"
				}, {
					field : "INTER_NAME",
					title : "接口名称",
					align : "center"
				}, {
					field : "INTER_STATUS_NAME",
					title : "接口状态",
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
					field : "GET_COUNT",
					title : "被调用次数",
					align : "center"	
				},{
					field : "START_WORK_TIME",
					title : "开始执行日期",
					align : "center"
				} ]
			});
	
};
	
//字典项
function initInterInfoRepairDic(){
	//初始化数据
	initSelect(getCurrentPageObj().find("#inter_status"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"I_DIC_INTER_STATUS"});
}

initInterInfoRepairDic();
initQueryInterInfoRepairButtonEvent();