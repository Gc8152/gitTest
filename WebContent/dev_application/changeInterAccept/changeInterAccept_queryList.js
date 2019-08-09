////初始化字典项
//(function(){
//	initSelect(getCurrentPageObj().find("[name='app_status']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"I_DIC_INTER_APP_STATUS"});
//})();
var reqQueryListCall=getMillisecond();
initChangeInterAcceptInfo();
postUseInterAcceptTest();

//初始化页面按钮
function postUseInterAcceptTest(){
	var $page = getCurrentPageObj();
	//重置按钮
	getCurrentPageObj().find("#reset").click(function() {
		getCurrentPageObj().find("#changeInterAcceptForm input").val("");
		var selects=$("#changeInterAcceptForm select");
		selects.val(" ");
		selects.select2();

	});
	
	//接口申请受理按钮 
	getCurrentPageObj().find("#interfaceAccept").unbind("click");
	getCurrentPageObj().find("#interfaceAccept").click(function(){
		var selects = getCurrentPageObj().find("#ChangeAcceptingInfoTable").bootstrapTable("getSelections");
		if(selects.length == 0) {
			alert("请选择一条数据进行操作！");
			return;
		}
		closeAndOpenInnerPageTab("changeInterAccept_addPop","接口申请受理","dev_application/changeInterAccept/changeInterAccept_edit.html",function(){
			initTableInfo(selects[0]);
		});
	});
	
	//接口申请查看
	getCurrentPageObj().find('#interfaceCheck').click(function(){

		var selects = getCurrentPageObj().find("#ChangeAcceptingInfoTable").bootstrapTable("getSelections");
		if(selects.length == 0) {
			alert("请选择一条数据进行操作！");
			return;
		}
		closeAndOpenInnerPageTab("changeInterAccept_info","接口受理查看","dev_application/changeInterAccept/changeInterAccept_queryInfo.html",function(){
			initTableInfo(selects[0]);
		});
	});
	
	//查询按钮
	var form = getCurrentPageObj().find("#changeInterAcceptForm");//表单对象
	getCurrentPageObj().find("#queryChangeAccepting").click(function() {		
		 var param = form.serialize();
		 getCurrentPageObj().find('#ChangeAcceptingInfoTable').bootstrapTable('refresh',{
				url:dev_application+"interChangeAccept_info/queryInterChangeAccept.asp?SID=" + SID + "&call=" + reqQueryListCall +'&'+param});

	});
	//enter触发查询
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#queryChangeAccepting").click();});
	
	//服务方 pop框按钮
	$page.find("[name='ser_system_name']").click(function(){
		var $name = $page.find("[name='ser_system_name']");
		var $id = $page.find("[name='con_system_id']");
		var $systemPop = $page.find("[mod='systemPop']");
		query_systemPop($systemPop, {id : $id, name : $name});
	});

}
//初始化页面table  
function initChangeInterAcceptInfo() {
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset, //页码
				app_status:"01"
		};
		return temp;
	};
	getCurrentPageObj().find("#ChangeAcceptingInfoTable").bootstrapTable(
			{
				//请求后台的URL（*）
				url :dev_application+'interChangeAccept_info/queryInterChangeAccept.asp?SID='+SID+"&call="+reqQueryListCall,
				method : 'get', // 请求方式（*）
				striped : false, // 是否显示行间隔色
				cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, // 是否启用排序
				sortOrder : "asc", // 排序方式
				queryParams : queryParams,// 传递参数（*）
				sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
				pagination : true, // 是否显示分页（*）
				pageList : [ 5, 10, 15 ], // 可供选择的每页的行数（*）
				pageNumber : 1, // 初始化加载第一页，默认第一页
				pageSize : 10, // 每页的记录行数（*）
				clickToSelect : true, // 是否启用点击选中行
				// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
				uniqueId : "APP_ID", // 每一行的唯一标识，一般为主键列
				cardView : false, // 是否显示详细视图
				detailView : false, // 是否显示父子表
				jsonpCallback:reqQueryListCall,
				singleSelect : true,// 复选框单选
				onLoadSuccess : function(data){
					gaveInfo();
				},
				columns : [ {	
					checkbox:true,
					rowspan: 2,
					align: 'center',
					valign: 'middle'
				},{
					field: 'APP_ID',
					title : 'id1',
					align: 'center',
					visible: false
				},{
					field: 'INTER_ID',
					title : 'id',
					align: 'center',
					visible: false
				},{
					field: 'RECORD_APP_NUM',
					title : '申请编号',
					align: 'center',
					width : '150'
				},{
					field: 'APP_NAME',
					title : '申请名称',
					align : 'center',
					width : '180'
				},{
					field : "APP_STATUS_NAME",
					title : "申请状态",
					align : "center",
					width : '150'
				}, {

					field : "INTER_CODE",
					title : "接口编号",
					align : "center",
					width : '100'
				}, {

					field : "TRADE_CODE",
					title : "接口交易码",
					align : "center",
					width : '100'
				},{
					
					field : "INTER_NAME",
					title : "接口名称",
					align : "center"
				},{
					field : 'SER_SYSTEM_NAME',
					title : '服务方应用名称',
					align : "center"
				},{
					field : "REQ_FINISH_TIME",
					title : "要求完成日期",
					align : "center"
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
				},{
					field : "REQ_TASK_CODE",
					title : "关联任务编号",
					align : "center",
					width : '200',
					formatter:function(value, row, index) {
						if(value == undefined){value = '';}
						return value;
					}
				}

				]
		} );
};




