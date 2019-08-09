var calltable=getMillisecond();
/**
 * 获取参数
 */
function getMRecordParams(){
	var param={};
	var inputs=	$("#messreplanlist_form input[id^='SC_']");
	for(var i=0;i<inputs.length;i++){
		var obj=$(inputs[i]);
		if($.trim(obj.val())!=""){
			param[obj.attr("name")]=obj.val();
		}
	}
	var selects=$("#messreplanlist_form select");
	for(var i=0;i<selects.length;i++){
		var obj=$(selects[i]);
		if($.trim(obj.val())!=""){
			param[obj.attr("name")]=obj.val();
		}
	}
	return param;
}
//时间控件
function initDate(){
	WdatePicker({
		dateFmt : 'yyyy-MM-dd',
		minDate : '1990-01-01',
		maxDate : '2050-12-01'
	});
}
var queryParams=function(params){
	var temp=getMRecordParams();
	 temp["limit"]=params.limit;
	 temp["offset"]=params.offset;
	return temp;
};
/**
 * 初始化页面查询事件
 */
(function(){
	//初始化下拉框
	initSelect($("#task_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"M_DIC_SUCC_FAIL"}," ");
	initSelect($("#task_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"M_DIC_SENDERTYPE"}," ");
	$("#messRePlanReset").click(function(){
		$("#messreplanlist_form input").val("");
		var selects=$("#messreplanlist_form select");
		selects.val(" ");
		selects.select2();
	});
	$("#queryMessPlanRecordinfo").click(function(){
		var start_sendtime = $("#SC_SSENDTIME").val(); //发送开始时间
		var end_sendtime =  $("#SC_ESENDTIME").val();//发送结束时间
		var receiver_code = $("#SC_reveiver_code").val();//接收人
		var return_code =  $("#task_state").val();//发送结果
		var transmit_mode =  $("#task_type").val();//发送类型	
		$("#MRecordPlanTableInfo").bootstrapTable('refresh',{url:dev_workbench+"planMRecord/queryPlanMRecod.asp?call="+calltable+"&SID="+SID+"&start_sendtime="+start_sendtime+"&end_sendtime="+end_sendtime+"&receiver_code="+receiver_code+"&return_code="+return_code+"&transmit_mode="+transmit_mode});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#queryMessPlanRecordinfo").click();});
	$("#receiver_name").click(function(){
		openUserPop("userPop",{name:getCurrentPageObj().find("#receiver_name"),no:getCurrentPageObj().find("#SC_reveiver_code")});
	});
	$("#viewMRecordPlanDetail").click(function(){
		var ids=$("#MRecordPlanTableInfo").bootstrapTable('getSelections');
		if(ids.length==0){
			alert("请选择一条数据!");
			return;
		}
		closeAndOpenInnerPageTab("query_messrecordPlanDetail","发送计划详情页面","supervision/messageplan/query_planMessrecordDetail.html",function(){
			initMRecordDetailPage(ids[0].ID);
		});
	});
})();

/**
 * 初始化页面数据查询
 */
function readyQueryMRecordPage(){

	$("#MRecordPlanTableInfo").bootstrapTable(
			{
				//请求后台的URL（*）
				url : dev_workbench+'planMRecord/queryPlanMRecod.asp?call='+calltable+'&SID='+SID,
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
				uniqueId : "task_code", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				jsonpCallback:calltable,
				singleSelect: true,
				onLoadSuccess:function(data){},
				columns : [{
					field: 'middle',
					checkbox: true,
					rowspan: 2,
					align: 'center',
					valign: 'middle'
				},{
					field : 'ID',
					title : '编号',
					align : "center",
					visible:false	
				},{
					field : 'CATEGORY_NAME',
					title : '标题',
					align : "center"
				},{
					field : 'SENDER_CODE',
					title : '发送人',
					align : "center"
				},{
					field : 'RECEIVER_NAME',
					title : '接收人',
					width:5,
					align : "center"
				}, {
					field : "RETURN_CODE",
					title : "发送结果",
					align : "center",
					formatter:function(value,row,index){
						if("100"==value){
							return "失败";
						}else if("99"==value){
							return "待发送";
						}
					}
				}, {
					field : "TRANSMIT_NAME",
					title : "发送方式",
					align : "center"
				},{
					field : "ROLE_NAME",
					title : "角色",
					align : "center"
				},{
					field : "FAIL_COUNT",
					title : "失败次数",
					align : "center"
				},{
					field : 'PLAN_SENDTIME',
					title : '发送时间',
					align : "center"
				} ]
			});
}	

readyQueryMRecordPage();