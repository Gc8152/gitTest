/**
 * 字典初始化方法
 */
(function(){
	initSelect(getCurrentPageObj().find("#upload_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_UPLOAD_STATE"});
	initSelect(getCurrentPageObj().find("#accept_result"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_ACCEPT_RESULT"});
	initSelect(getCurrentPageObj().find("#verify_result"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_VERIFY_RESULT"});
})();
/**
 * 获取查询参数
 * @returns 
 */
function getUatReportQueryParam(){
	var param={};
	var finds=	getCurrentPageObj().find("#reqSubReportTerm [name]");
	for(var i=0;i<finds.length;i++){
		var obj=$(finds[i]);
		if($.trim(obj.val())!=""){
			param[obj.attr("name")]=obj.val();
		}
	}
	return param;
}
/**
 * 获取时间戳
 */
var uatReport_queryList_call = getMillisecond()+'1';
/**
 * 组装查询url 
 * @returns {String}
 */
function uatReportQueryUrl(){
	var url = dev_construction+'UatReport/queryAllReqSubReport.asp?call=jq_1527731207504&call_='+uatReport_queryList_call+'&SID='+SID+url_type;
	var finds = getCurrentPageObj().find("#reqSubReportTerm [name]");
	for(var i=0; i<finds.length; i++){
		var obj=$(finds[i]);
		if($.trim(obj.val())!=""){
			url+='&'+obj.attr("name")+"="+escape(encodeURIComponent(obj.val()));
		}
	}
	return url;
}

//初始化列表
(function() {
	var queryParams=function(params){
		var temp = getUatReportQueryParam();
		temp["limit"] = params.limit;
		temp["offset"] = params.offset;
		return temp;
	};
	getCurrentPageObj().find("#reqSubReportTable").bootstrapTable(
			{
				url : dev_construction+'UatReport/queryAllReqSubReport.asp?call=jq_1527731207504&call_='+uatReport_queryList_call+'&SID='+SID+url_type,
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
				uniqueId : "sub_req_id", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: true,
				jsonpCallback: "jq_1527731207504",
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
					field : 'SUB_REQ_ID',
					title : '需求点ID',
					align : 'center',
					visible:false
				},{
					field : "SUB_REQ_CODE",
					title : "需求点编号",
					align : "center",
					width :"13%"
				}, {
					field : "SUB_REQ_NAME",
					title : "需求点名称",
					align : "center",
					width :"15%"
				}, {
					field : 'REQ_CODE',
					title : '需求编号',
					align : "center",
					width :"15%"
				},{
					field : 'REQ_NAME',
					title : '需求名称',
					align : "center",
					width :"12%"
				},{
					field : "SYSTEM_NAME",
					title : "应用名称",
					align : "center",
					width :"10%"
				}, {
					field : "UPLOAD_STATE",
					title : "上传状态",
					align : "center",
					width :"8%",
					formatter: function (value, row, index) {
						if(value=="00") {
							return "已上传";
						}
						return '<span  style="color:red; width: 110px; ";>'+"未上传"+'</span>';
					}
				}, {
					field : "REPORT_STATE_NAME",
					title : "报告状态",
					align : "center",
					visible: false
				}, {
					field : "ACCEPT_RESULT",
					title : "验收结论",
					align : "center",
					width :"8%",
					formatter: function (value, row, index) {
						if(value=="00") {
							return "通过";
						}
						if(value=="01"){
							return "未通过";
						}
					}
				}, {
					field : "ALLLEFTDEFECT_NUM",
					title : "遗留缺陷数",
					width:"9%",
					align : "center"
				}, {
					field : "SUBMIT_PERSON_NAME",
					title : "提交人",
					width :"8%",
					align : "center"
				}, {
					field : "CREATE_PERSON_NAME",
					title : "需求提出人",
					width:100,
					align : "center",
					visible: false,
				}, {
					field : "FLOW_STATE_NAME",
					title : "审批状态",
					align : "center",
					visible: true,
					formatter: function (value, row, index) {
						if(value) {
							return value;
						} else{
							return "未发起";
						}
					}
				}, {
					field : "VERIFY_PERSON_NAME",
					title : "审核人",
					align : "center",
					visible: false
				}, {
					field : "VERIFY_PERSON",
					title : "审核人",
					align : "center",
					visible: false
				}, {
					field : "VERIFY_TIME",
					title : "审核时间",
					align : "center",
					visible: false
				},{
					field : "VERIFY_SUGGEST",
					title : "审核意见",
					align : "center",
					visible: false
				}, {
					field : "REQ_TASK_CODE",
					title : "任务编码",
					align : "center",
					visible: false
				}, {
					field : "REQ_TASK_NAME",
					title : "任务名称",
					align : "center",
					visible: false
				}]
			});
})();


//初始化页面按钮事件
(function() {	
	//重置按钮
	getCurrentPageObj().find("#reset").click(function(){
		getCurrentPageObj().find("#reqSubReportTerm input").val("");
		var selects = getCurrentPageObj().find("#reqSubReportTerm select");
		selects.val(" ");
		selects.select2();
	});
	//查询按钮事件
	getCurrentPageObj().find("#query").unbind("click");
	getCurrentPageObj().find("#query").click(function(){
		getCurrentPageObj().find("#reqSubReportTable").bootstrapTable("refresh",{url:uatReportQueryUrl()});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#query").click();});
	//上传按钮
	getCurrentPageObj().find("#upload").unbind("click");
	getCurrentPageObj().find("#upload").click(function(){
		var selection = getCurrentPageObj().find("#reqSubReportTable").bootstrapTable('getSelections');
		if(selection.length != 1) {
			alert("请选择一条数据进行操作!");
			return;
		}
		
		/*var create_person = $.map(selection, function(item) {
			return item.CREATE_PERSON;
		});
		if(create_person!=SID){
			alert("您不是此需求点的需求提出人");
			return;
		}
		*/
		var report_states = $.map(selection, function(item) {
			return item.REPORT_STATE;
		});
		var flow_state_name=selection[0]["FLOW_STATE_NAME"];
		if(selection[0].REPORT_STATE&&(flow_state_name.indexOf("未发起")>=0||flow_state_name.indexOf("打回")>=0||flow_state_name.indexOf("拿回")>=0||flow_state_name.indexOf("委托")>=0)) {
			getCurrentPageObj().find("#update").trigger("click");
			return;
		}else if(report_states[0] == '01') {//草拟
			alert("该需求点已有过上传操作！");
			return;
		}
		var UPLOAD_STATE = selection[0].UPLOAD_STATE;//是否上传
		var ACCEPT_RESULT = selection[0].ACCEPT_RESULT;//验收结论
		if(ACCEPT_RESULT=='00' && UPLOAD_STATE=='00'){
			alert("该需求点上传测试报告已通过，不能再上传！");
			return;
		}
		/*if(report_states[0] == '02') {//审核中
			alert("该需求点已提交测试报告，不能再上传！");
			return;
		}*/
		/*if(report_states[0] == '03') {//审核通过
			alert("该需求点已提交测试报告,不能再上传");
			return;
		}*/
		if(report_states[0] == '04') {//审核回
			alert("该需求点上传报告被打回，请修改！");
			return;
		}
		//把json对象转为字符串后，转为小写
		//var dataStr = JSON.stringify(selection[0]).toLowerCase();
		//再转为json字符转
		//var data = JSON.parse(dataStr);
		closeAndOpenInnerPageTab("uatReport_edit","UAT报告上传页面","dev_construction/uat_test/uatreport/uatReport_edit.html",function(){
			initUatReportInfo(selection[0]);
		});
	});
	
	//修改按钮
	getCurrentPageObj().find("#update").unbind("click");
	getCurrentPageObj().find("#update").click(function(){
		var selection = getCurrentPageObj().find("#reqSubReportTable").bootstrapTable('getSelections');
		if(selection.length != 1) {
			alert("请选择一条数据进行操作!");
			return;
		}
		var create_person = $.map(selection, function(item) {
			return item.CREATE_PERSON;
		});
		var submit_person = $.map(selection, function(item) {
			return item.SUBMIT_PERSON;
		});
		if(submit_person!=SID){
			alert("您不是此需求点的提交人");
			return;
		}
		
		var report_states = $.map(selection, function(item) {
			return item.REPORT_STATE;
		});
		var ids = $.map(selection, function(item) {
			return item.SUB_REQ_ID;
		});
		if(report_states.length == 0) {
			alert("该需求点还未上传报告，不能修改！");
			return;
		}
		if(report_states[0] == '02') {//审核中
			alert("该需求点已提交测试报告，不能修改！");
			return;
		}
		if(report_states[0] == '03') {//审核通过
			alert("该需求点已提交测试报告，不能修改！");
			return;
		}
		closeAndOpenInnerPageTab("uatReport_update","UAT报告修改页面","dev_construction/uat_test/uatreport/uatReport_update.html",function(){
			initUatReportInfo(selection[0]);
			initUatReportUploadInfo(ids[0]);
		});
	});
	
	//发起审核按钮
	getCurrentPageObj().find("#startApprove").unbind("click");
	getCurrentPageObj().find("#startApprove").click(function(){
		var selection = getCurrentPageObj().find("#reqSubReportTable").bootstrapTable('getSelections');
		if(selection.length != 1) {
			alert("请选择一条数据进行操作!");
			return;
		}
		var report_states = $.map(selection, function(item) {
			return item.REPORT_STATE;
		});
		var ids = $.map(selection, function(item) {
			return item.SUB_REQ_ID;
		});
		if(report_states.length == 0) {
			alert("该需求点还未上传报告，不能发起！");
			return;
		}
		if(report_states[0] == '02') {//审核中
			alert("该需求点已上传报告，在审核中！");
			return;
		}
		if(report_states[0] == '03') {//审核通过
			alert("该需求点已上传报告，审核通过！");
			return;
		}
		var call = getMillisecond()+'2';
		var url = dev_construction+'UatReport/startUatReportApprove.asp?call='+call+'&SID='+SID+'&sub_req_id='+ids[0];
		nconfirm("确认要发起审核吗？", function() {
			baseAjaxJsonp(url, null, function(data){
				if (data != undefined&&data!=null&&data.result=="true") {
					alert("发起成功!");
					closeAndOpenInnerPageTab("uatReport_queryList","UAT测试报告管理","dev_construction/uat_test/uatreport/uatReport_queryList.html",function(){});
					//getCurrentPageObj().find("#query").click();
					//getCurrentPageObj().find("#reqTaskInfoTable").bootstrapTable('refresh');					
					//closeCurrPageTab();
				} else {
					alert("发起失败！");
				}
			}, call);			
		});
	});
	
	//审核
	getCurrentPageObj().find("#approve").unbind("click");
	getCurrentPageObj().find("#approve").click(function(){
		var selection = getCurrentPageObj().find("#reqSubReportTable").bootstrapTable('getSelections');
		if(selection.length != 1) {
			alert("请选择一条数据进行操作!");
			return;
		}
		var report_states = $.map(selection, function(item) {
			return item.REPORT_STATE;
		});
		var ids = $.map(selection, function(item) {
			return item.SUB_REQ_ID;
		});
		if(report_states.length == 0) {
			alert("该需求点还未上传报告！");
			return;
		}
		if(report_states[0] == '01') {//草拟中
			alert("该需求点上传报告，在草拟中！");
			return;
		}
		if(report_states[0] == '03') {//审核通过
			alert("该需求点已上传报告，审核通过！");
			return;
		}
		if(report_states[0] == '04') {//审核打回
			alert("该需求点上传报告，审核打回！");
			return;
		}
		//把json对象转为字符串后，转为小写
		var dataStr = JSON.stringify(selection[0]).toLowerCase();
		//再转为json字符转
		var data = JSON.parse(dataStr);
		var param = {"sub_req_id":ids[0]};
		closeAndOpenInnerPageTab("uatReport_approve","UAT报告审核页面","dev_construction/uat_test/uatreport/uatReport_approve.html",function(){
			initUatReportSubReqInfo(data);
			initUatReportDetail(param);
			uatReportApprove(param);
		});
	});
	//审批
	getCurrentPageObj().find("#approve").unbind("click");
	getCurrentPageObj().find("#approve").click(function(){
		var selection = getCurrentPageObj().find("#reqSubReportTable").bootstrapTable('getSelections');
		if(selection.length != 1) {
			alert("请选择一条数据进行操作!");
			return;
		}
		var param = {"sub_req_id":selection[0].SUB_REQ_ID};
		var instance_id=selection[0].INSTANCE_ID;
		var dataStr = JSON.stringify(selection[0]).toLowerCase();
		//再转为json字符转
		var data = JSON.parse(dataStr);
		closeAndOpenInnerPageTab("uatReport_App","UAT报告审批页面","dev_construction/uat_test/uatreport/uatReport_detail.html",function(){
			initUatReportSubReqInfo(data);
			initUatReportDetail(param);
			initAFApprovalInfo(instance_id,'1');
		});
	});
	//查看审批详情
	getCurrentPageObj().find("#detailApp").unbind("click");
	getCurrentPageObj().find("#detailApp").click(function(){
		var selection = getCurrentPageObj().find("#reqSubReportTable").bootstrapTable('getSelections');
		if(selection.length != 1) {
			alert("请选择一条数据进行操作!");
			return;
		}
		var param = {"sub_req_id":selection[0].SUB_REQ_ID};
		var instance_id=selection[0].INSTANCE_ID;
		var dataStr = JSON.stringify(selection[0]).toLowerCase();
		//再转为json字符转
		var data = JSON.parse(dataStr);
		closeAndOpenInnerPageTab("uatReport_AppDetail","UAT报告详情页面","dev_construction/uat_test/uatreport/uatReport_detail.html",function(){
			initUatReportSubReqInfo(data);
			initUatReportDetail(param);
			initAFApprovalInfo(instance_id,'0');
		});
	});
	//查看详情
	getCurrentPageObj().find("#detail").unbind("click");
	getCurrentPageObj().find("#detail").click(function(){
		var selection = getCurrentPageObj().find("#reqSubReportTable").bootstrapTable('getSelections');
		if(selection.length != 1) {
			alert("请选择一条数据进行操作!");
			return;
		}
		//把json对象转为字符串后，转为小写
		var dataStr = JSON.stringify(selection[0]).toLowerCase();
		//再转为json字符转
		var data = JSON.parse(dataStr);
		var ids = $.map(selection, function(row){
			return row.SUB_REQ_ID;
		});
		var param = {"sub_req_id":ids[0]};
		closeAndOpenInnerPageTab("uatReport_detail","UAT报告详情页面","dev_construction/uat_test/uatreport/uatReport_detail.html",function(){
			initUatReportSubReqInfo(data);
			initUatReportDetail(param);
		});
	});
	
	
	
	//UAT缺陷导入
	getCurrentPageObj().find("#bugImport").unbind("click");
	getCurrentPageObj().find("#bugImport").click(function(){
		getCurrentPageObj().find("#file_bug_import").val("");
		getCurrentPageObj().find("#file_bug_import_id").val("");
		getCurrentPageObj().find("#modal_bug_import").modal("show");
	});
	getCurrentPageObj().find("#import_bug_button").unbind("click");
	getCurrentPageObj().find("#import_bug_button").click(function(){
		startLoading();
	    $.ajaxFileUpload({
		    url:dev_construction+'UatReport/importBugInfo.asp?SID='+SID,
		    type:"post",
			secureuri:false,					 //是否启用安全提交，默认为false。 
			fileElementId:'file_bug_import',  //需要上传的文件域的ID，即<input type="file">的ID。
			data:'',
			dataType: 'json',
			success:function (data){
				endLoading();
				getCurrentPageObj().find("#file_bug_import").val("");
				getCurrentPageObj().find("#modal_bug_import").modal("hide");
				if(data&&data.result=="true"){
					alert("导入成功");
				}else if(data&&data.error_info){
					//alert("导入失败:"+data.error_info);
				}else{	
					//alert("导入失败！");
				}
			},
			error: function (data){
				endLoading();
				getCurrentPageObj().find("#modal_bug_import").modal("hide");
				//alert("导入失败！");
			}
	   });
	});
	
})();
	