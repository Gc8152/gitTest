//按钮方法
function initClickButtonEvent(){
	var quaryStreamCall=getMillisecond();
	initStreamApplyInfo(quaryStreamCall);
	//查询
	getCurrentPageObj().find("#queryStreamApply").unbind("click");
	getCurrentPageObj().find("#queryStreamApply").click(function(){	
		var params = getCurrentPageObj().find("#StreamApplyQuerytForm").serialize();
		getCurrentPageObj().find("#StreamApplySureTableInfo").bootstrapTable('refresh',
				{url:dev_resource+'StreamApply/queryStreamApplySure.asp?call='+quaryStreamCall+'&SID='+SID+'&'+params});		
	});
	//重置
	getCurrentPageObj().find('#resetStreamApply').click(function() {
		getCurrentPageObj().find("#stream_app_code").val("");
		getCurrentPageObj().find("#system_name").val("");	
		getCurrentPageObj().find("#stream_app_title").val("");
		getCurrentPageObj().find("#stream_name").val(" ");
		getCurrentPageObj().find("#stream_status").val(" ");
		getCurrentPageObj().find("#stream_status").select2();
		getCurrentPageObj().find("#stream_app_status").val(" ");
		getCurrentPageObj().find("#stream_app_status").select2();
	});
	
	//查看详情
	getCurrentPageObj().find("#streamApply_check").unbind("click");
	getCurrentPageObj().find("#streamApply_check").click(function(){
		var selections = getCurrentPageObj().find("#StreamApplySureTableInfo").bootstrapTable('getSelections');
		if(selections.length != 1) {
			alert("请选择一条数据进行操作!");
			return;
		}
		
		closeAndOpenInnerPageTab("stream_check","查看流信息","dev_resourceManage/streamApplySure/streamApply_check.html",function(){
			var item = selections[0];
			var system_id = item["SYSTEM_ID"];
			var version_id = item["VERSIONS_ID"];
			initReuirementQueryTable(system_id,version_id);
			initStreamInfoForSure(item);
			if(item.STREAM_TYPE!="00"){
				getCurrentPageObj().find('#check_task').attr('style','display : none');
				getCurrentPageObj().find('#check_table').attr('style','display : none');
			}else if(item.STREAM_TYPE=="00"){
				getCurrentPageObj().find('#check_version').attr('style','display : none');
				getCurrentPageObj().find('#VERSIONS_NAME').attr('style','display : none');
				getCurrentPageObj().find('#normal_task').attr('style','display : none');
				getCurrentPageObj().find('#normal_table').attr('style','display : none');
			}
		});
		
	});	
};
	
//查询列表显示table
function initStreamApplyInfo(quaryStreamCall) {
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	getCurrentPageObj().find("#StreamApplySureTableInfo").bootstrapTable(
			{
				//请求后台的URL（*）
				url :dev_resource+'StreamApply/queryStreamApplySure.asp?notCaoNi=00&call='+quaryStreamCall+'&SID='+SID,
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
				uniqueId : "STREAM_APP_ID", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				jsonpCallback:quaryStreamCall,
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
				}, {
					field : 'SYSTEM_ID',
					title : '应用编号',
					align : "center",
					width : 120,
					visible : false
				},{
					field : 'VERSIONS_ID',
					title : '版本编号',
					align : "center",
					width : 120,
					visible : false
				},{
					field : 'STREAM_APP_CODE',
					title : '流申请编号',
					align : "center",
					width : 120
				}, {
					field : "SYSTEM_NAME",
					title : "应用名称",
					align : "center"
				}, {
					field : "STREAM_APP_TITLE",
					title : "标题",
					align : "center",
					width : 200
				}, {
					field : "APP_MAN_NAME",
					title : "申请人",
					align : "center"
				}, {
					field : "APP_STATUS",
					title : "申请状态",
					align : "center",
					width : 80,
				}, {
					field : "STREAM_NAME",
					title : "流名称",
					align : "center"
				}, {
					field : "STREAM_STATUS",
					title : "流状态",
					align : "center"
				}, {
					field : "STREAM_TYPE",
					title : "流类型",
					align : "center",
					formatter:function(value,row,index){if(value=="00"){return "任务流";}return "版本流";}
				}]
			});
};
//加载字典项
function initStreamAppDicType(){
	//初始化数据,属性类型
	initSelect(getCurrentPageObj().find("#stream_app_status"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"R_DIC_STREAM_APP_STATUS"});
	getCurrentPageObj().find("#stream_app_status");
}	
initStreamAppDicType();
initClickButtonEvent();
