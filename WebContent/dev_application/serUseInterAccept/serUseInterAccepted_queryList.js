//初始化页面信息
function initSerUseInterAcceptedInfo() {
	
	var $page = getCurrentPageObj();
	//重置按钮
	$page.find("#reset").click(function() {
		$page.find("#serQueryAcceptedForm input").val("");
		$page.find("#serQueryAcceptedForm select").val(" ").select2();

	});
	
	//消费方 pop框按钮
	$page.find("[name='CON_SYSTEM_NAME']").click(function(){
		
		var $name = $page.find("[name='CON_SYSTEM_NAME']");
		var $id = $page.find("[name='CON_SYSTEM_ID']");
		var $systemPop = $page.find("[mod='systemPop']");
		query_systemPop($systemPop, {id : $id, name : $name});
	});
	
	//服务方 pop框按钮
	$page.find("[name='SER_SYSTEM_NAME']").click(function(){
		var $name = $page.find("[name='SER_SYSTEM_NAME']");
		var $id = $page.find("[name='CON_SYSTEM_ID']");
		var $systemPop = $page.find("[mod='systemPop']");
		query_systemPop($systemPop, {id : $id, name : $name});
	});
	
	//接口申请查看
	$page.find('#SerInterCheck').click(function(){

		//var RECORD_APP_NUM = "";
		var selRow = $page.find('#serUseInterAcceptedInfoTable').bootstrapTable("getSelections");
		if(selRow.length == 1){
			//RECORD_APP_NUM = selRow[0].RECORD_APP_NUM;
			closeAndOpenInnerPageTab("serViewElement", "查看", "dev_application/serUseInterAccept/serUseInterAccept_view.html", function(){
				initSerAcceptedDetail(selRow[0]);
			});
		}else{
			alert("请选择一条数据");
			return;
		}
	});
	var tableCallSerV = getMillisecond();
	//查询按钮 
	$page.find("#querySerUseAccepted").click(function() {
		var param = $page.find("#serQueryAcceptedForm").serialize();
		$page.find('#serUseInterAcceptedInfoTable').bootstrapTable('refresh',
				{url:dev_application+'serUseInterAccept/querySerUseInterAcceptInfo.asp?SID='+SID+'&'+param+'&call='+tableCallSerV
				});
	});
	//enter触发查询
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#querySerUseAccepted").click();});
	//页面列表
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	
	$page.find("#serUseInterAcceptedInfoTable").bootstrapTable(
			{
				//请求后台的URL（*）
				url :dev_application+'serUseInterAccept/querySerUseInterAcceptInfo.asp?SID='+SID+'&call='+tableCallSerV,
				method : 'get', //请求方式（*）   
				striped : true, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				pagination : true, //是否显示分页（*）
				pageList : [5,10],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 10,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "RECORD_APP_NUM", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				jsonpCallback:tableCallSerV,
				singleSelect: true,
				onLoadSuccess : function(data){
					gaveInfo();
				},
				columns : [ {	
					checkbox:true,
					rowspan: 2,
					align: 'center',
					valign: 'middle'
				},{
					field: 'RECORD_APP_NUM',
					title : '申请单编号',
					align: 'center',
					width : '150'
				},{
					field: 'APP_NAME',
					title : '申请名称',
					align : 'center',
					width : '180'
				},{
					field : "APP_STATUS_NAME",
					title : "申请单状态",
					align : "center",
					width : '150'
				}, {
					field : "CON_SYSTEM_NAME",
					title : "消费方应用名称",
					align : "center"
				}, {
					field : 'SER_SYSTEM_NAME',
					title : '服务方应用名称',
					align : "center"
				}, {
					field : "REQ_FINISH_TIME",
					title : "要求完成日期",
					align : "center",
					width : '130'
				}, {
					field : "APP_USER_NAME",
					title : "申请人",
					align : "center"
					
				}, {
					field : "CURRENT_MAN",
					title : "当前处理人",
					align : "center"
				}, {
					field : "APP_TIME",
					title : "申请日期",
					align : "center",
					width : '200'
				}, {
					field : "REQ_TASK_CODE",
					title : "关联需求任务编号",
					align : "center",
					width : '200'
				}

				]
		});
	
	
	initPageSelect();
	//初始化下拉菜单
	function initPageSelect(){
		//过滤项 IE8不支持该对象的indexOf属性或方法
		var sarr = ['00','01','02','03'];
		//申请单状态
		initSelect(getCurrentPageObj().find("#APP_STATUS"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"I_DIC_INTER_ORDER_APP_STATUS"},"","",sarr);//,"","",sarr
		
	}

};
initSerUseInterAcceptedInfo();





