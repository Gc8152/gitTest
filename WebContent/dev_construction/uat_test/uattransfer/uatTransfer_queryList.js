/**
 * 获取查询参数
 * @returns 
 */
function getUatTransferQueryParam(){
	var param={};
	var inputs=	getCurrentPageObj().find("#reqTaskTerm input");
	for(var i=0;i<inputs.length;i++){
		var obj=$(inputs[i]);
		if($.trim(obj.val())!=""){
			param[obj.attr("name")]=obj.val();
		}
	}
	var selects = getCurrentPageObj().find("#reqTaskTerm select");
	for(var i=0;i<selects.length;i++){
		var obj=$(selects[i]);
		if($.trim(obj.val())!=""){
			param[obj.attr("name")]=obj.val();
		}
	}
	return param;
}
/**
 * 获取时间戳
 */
var uatTransfer_queryList_call = getMillisecond();
/**
 * 组装查询url 
 * @returns {String}
 */
function uatTransferQueryUrl(){
	var url = dev_construction+'UatTransfer/queryallreqtask.asp?call='+uatTransfer_queryList_call+'&SID='+SID;
	var finds = getCurrentPageObj().find("#reqTaskTerm [name]");
	for(var i=0; i<finds.length; i++){
		var obj=$(finds[i]);
		if($.trim(obj.val())!=""){
			url+='&'+obj.attr("name")+"="+escape(encodeURIComponent(obj.val()));
		}
	}
	return url;
}

//初始化列表
(function () {
	var queryParams=function(params){
		var temp = getUatTransferQueryParam();
		temp["limit"] = params.limit;
		temp["offset"] = params.offset;
		return temp;
	};
	getCurrentPageObj().find("#reqTaskInfoTable").bootstrapTable(
			{
				url : dev_construction+'UatTransfer/queryallreqtask.asp?call='+uatTransfer_queryList_call+'&SID='+SID,
				method : 'get', //请求方式（*）   
				striped : false, //是否显示行间隔色
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
				uniqueId : "req_task_id", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: true,
				jsonpCallback: uatTransfer_queryList_call,
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
					field : 'REQ_TASK_ID',
					title : '任务ID',
					align : 'center',
					visible:false
				},{
					field : 'SUB_REQ_ID',
					title : '需求点ID',
					align : 'center',
					visible:false
				},{
					field : 'REQ_ID',
					title : '需求ID',
					align : 'center',
					visible:false
				},{
					field : 'REQ_TASK_CODE',
					title : '任务编号',
					align : "center",
				},{
					field : 'REQ_TASK_NAME',
					title : '任务名称',
					align : "center"
				},{
					field : "SUB_REQ_CODE",
					title : "需求点编号",
					align : "center"
				}, {
					field : "SUB_REQ_NAME",
					title : "需求点名称",
					align : "center"
				}, {
					field : "REQ_TASK_RELATION",
					title : "从属关系",
					align : "center",
					formatter: function(value, row, index) {
						if(value=='01') {
							return '主办';
						}
						return '协办';
					}
				}, {
					field : "REQ_TASK_STATE_NAME",
					title : "任务状态",
					align : "center"
				}, {
					field : "SYSTEM_NAME",
					title : "实施应用",
					width:100,
					align : "center"
				}, {
					field : "PLAN_ONLINETIME",
					title : "计划投产日期",
					width:100,
					align : "center"
				}, {
					field : "VERSIONS_NAME",
					title : "申请纳入版本",
					align : "center"
				},  {
					field : "P_OWNER_NAME",
					title : "当前责任人",
					align : "center"
				}, {
					field : "CREATE_TIME",
					title : "创建时间",
					align : "center"
				} ]
			});
})();


//初始化页面按钮事件
(function() {	
	//重置按钮
	getCurrentPageObj().find("#reset").click(function(){
		getCurrentPageObj().find("#reqTaskTerm input").val("");
		var selects = getCurrentPageObj().find("#reqTaskTerm select");
		selects.val(" ");
		selects.select2();
	});
	//查询按钮事件
	getCurrentPageObj().find("#queryReqTask").unbind("click");
	getCurrentPageObj().find("#queryReqTask").click(function(){
		getCurrentPageObj().find("#reqTaskInfoTable").bootstrapTable("refresh",{url:uatTransferQueryUrl()});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#queryReqTask").click();});
	//提交UAT
	getCurrentPageObj().find("#submitUat").unbind("click");
	getCurrentPageObj().find("#submitUat").click(function(){
		var selection = getCurrentPageObj().find("#reqTaskInfoTable").bootstrapTable('getSelections');
		if(selection.length != 1) {
			alert("请选择一条数据进行操作!");
			return;
		}
		var ids = $.map(selection, function(row) {
			return row.REQ_TASK_ID;
		});
		closeAndOpenInnerPageTab("uatTransfer_edit","UAT移交页面","dev_construction/uat_test/uattransfer/uatTransfer_edit.html",function(){
			initUatTranferInfo(ids[0]);
		});
	});
	
	//初始化字典项
	initSelect(getCurrentPageObj().find("[name='req_task_state']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQTASK_STATE"});
})();

