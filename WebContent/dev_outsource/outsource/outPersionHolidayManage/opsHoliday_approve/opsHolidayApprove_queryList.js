
initOutPersonHolidayApprovePage();
function initOutPersonHolidayApprovePage(){
	var currTab = getCurrentPageObj();
	var currTabUrl = currTab.attr("url");
	var menu_no = currTabUrl.substring(currTabUrl.indexOf("=")+1,currTabUrl.length);
	var queryForm = currTab.find("#opsHoliday_approveList");
	var table = currTab.find("#opsHoliday_approveTable");
	var calls = getMillisecond();
	//根据diccode标签初始化下拉框
	autoInitSelect(queryForm);

//查询列表显示table
initOptHolidayApproveTable();
function initOptHolidayApproveTable() {
	var queryParams=function(params){
		var temp={};
		 temp["limit"]=params.limit;
		 temp["offset"]=params.offset;
		return temp;
	};
	table.bootstrapTable({
				url : dev_outsource+"opsHoliday/queryAllPersonHoliday.asp?SID="+SID+"&call="+calls+"&menu_type="+menu_no,
				method : 'get', //请求方式（*）   
				striped : false, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				pagination : true, //是否显示分页（*）
				pageList : [5,10,20],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 10,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "CHECK_ID", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				jsonpCallback:calls,
				singleSelect: true,
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
					field : 'OP_ID',
					title : '外包人员id',
					align : 'center',
					visible:false
				},{
					field : 'LEAVE_ID',
					title : '请假id',
					align : 'center',
					visible:false
				},/*{
					field : 'IDCARD_NO',
					title : '身份证',
					align : "center",
					width : "20%"
				},*/{
					field : 'OP_NAME',
					title : '人员姓名',
					align : "center",
				    width : "13%"
				}, {
					field : 'OP_PHONE',
					title : '联系电话',
					align : "center",
					width : "15%"
				},{
					field : "SUP_NAME",
					title : "供应商名称",
					align : "center",
					width : "20%"
				}, {
					field : "LEAVE_DAYS",
					title : "请假天数",
					align : "center",
					width : "10%"
				}, {
					field : "CLEAR_DAYS",
					title : "销假天数",
					align : "center",
					width : "10%"
				}, {
					field : "START_DATE",
					title : "请假开始时间",
					align : "center",
					width : "15%"
				}, {
					field : "END_DATE",
					title : "请假结束时间",
					align : "center",
					width : "15%"
				}, {
					field : "LEAVE_CATEGORY_DISPLAY",
					title : "假别",
					align : "center",
					width : "8%"
				}, {
					field : "CURR_ACTORNO_NAME",
					title : "当前审批人",
					align : "center",
					width : "12%"
				},{
					field : "LEAVE_STATE_DISPLAY",
					title : "请假状态",
					align : "center",
					width : "10%"
				}]
			});
};
/**
 * 初始化页面查询事件
 */
initOptHolidayApprovePageBtn();
function initOptHolidayApprovePageBtn(){
	
	//查询按钮事件
	currTab.find("#queryOpsCheck").unbind("click");
	currTab.find("#queryOpsCheck").click(function(){
		var param = queryForm.serialize();
		table.bootstrapTable("refresh",{url:dev_outsource+"opsHoliday/queryAllPersonHoliday.asp?SID="+SID+"&call="+calls+"&menu_type="+menu_no+"&"+param});
	});
	//enter触发查询
	enterEventRegister(currTab.attr("class"), function(){currTab.find("#queryOpsCheck").click();});
	
	//重置按钮
	currTab.find("#check_reset").click(function(){
		currTab.find("#opsHoliday_approveList input").val("");
		var selects=getCurrentPageObj().find("#opsHoliday_approveList select");
		selects.val(" ");
		selects.select2();
	});
	
	//审批
	currTab.find("#opsHoliday_approve").unbind("click");
	currTab.find("#opsHoliday_approve").click(function(){
		var id = table.bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行查看!");
			return ;
		}
		var title="请假审批信息";
		var leave_state=id[0]["LEAVE_STATE"];
		if("01"!=leave_state){
			title="销假审批信息";
		}
		closeAndOpenInnerPageTab("opsHolidayApprove",title,"dev_outsource/outsource/outPersionHolidayManage/opsHoliday_approve/outpersonHoliday_approve.html",function(){
			initTitle(id[0]["INSTANCE_ID"]);
			initAFApprovalInfo(id[0]["INSTANCE_ID"]);
			initOpsHolidayApprovePage(id[0]);
			if("01"==leave_state){//请假申请
				getCurrentPageObj().find(".cancelFileInfo").hide();
			}
		});
	});
	
	//批量审批
	/*getCurrentPageObj().find("#opsHoliday_approveBatch").click(function() {
		var id = table.bootstrapTable('getSelections');
		var ids = $.map(id, function (row) {return row.INSTANCE_ID;});
		var curr_actorno = $.map(id, function (row) {return row.CURR_ACTORNO;});
		 if(id.length>=1){
			 var curr_actornos = curr_actorno.toString();
			 var approve_owner = curr_actornos.split(",");
			 for(var i=0;i<approve_owner.length;i++){
				 if(approve_owner[i]!=SID){
					 alert("您不是所选需求一致的当前审批人");
					 return;
				 }
			 }
			 nconfirm("是否确定批量审批通过？",function(){
				 var instance_id = ids.toString();
				 batchApprPassBtn(instance_id,getCurrentPageObj()[0].batch_callFunc);
			 });
		 }else {
			 alert("请至少选择一条需求");
		 }
		
	});*/
	
	//详情页面
	currTab.find("#opsHoliday_approVeview").unbind("click");
	currTab.find("#opsHoliday_approVeview").click(function(){
		var id = table.bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行查看!");
			return ;
		}
		var leave_state=id[0]["LEAVE_STATE"];
		closeAndOpenInnerPageTab("opsHolidayDetail","外包人员请假详细信息","dev_outsource/outsource/outPersionHolidayManage/outpersonHoliday_detail.html",function(){
			initTitle(id[0]["INSTANCE_ID"]);
			initOpsHolidayaddViewPage(id[0]);
			initAFApprovalInfo(id[0]["INSTANCE_ID"],"0");
			if("01"==leave_state){
				getCurrentPageObj().find(".cancelFileInfo").hide();
			}
		});
	});
  }
}

//时间比较
function ocheckTimeCompare(){
	WdatePicker({onpicked:function(){
		var check_starttime = getCurrentPageObj().find("#check_starttime").val();
		var check_endtime = getCurrentPageObj().find("#check_endtime").val();
		if(check_starttime!=""&&check_endtime!=""){
			if(check_starttime>check_endtime){
				alert('开始时间不能大于结束时间!',function(){
					getCurrentPageObj().find("#check_starttime").val("");
					getCurrentPageObj().find("#check_endtime").val("");
				});
			}
		}
	}});
}

/*//定义批量审批通过回调函数
getCurrentPageObj()[0].batch_callFunc = function opsHolidayApply_batchfunc(data){
	if(data.result=='true'){
		if(data.batchMark == 'batchLaunchSucc'){//批量发起流程
			
		}else if(data.batchMark == 'batchApprovalSucc'){//批量审批通过
			batchOpsHolidayPassAll(data);
		}else if(data.batchMark == 'batchRejectSucc'){//批量审批拒绝
			
		}else if(data.batchMark == 'batchBackupSucc'){//批量审批撤销
			
		}
	}else {
		alert(data.msg);
	}
}; */

//执行批量审批通过之后的业务逻辑处理
/*function batchOpsHolidayPassAll(data){
	var leave_ids = "";
	var param = data.lists;
	for(var i=0;i<param.length;i++){
		if(param[i]['mark']=='over' && leave_ids==""){
			leave_ids = param[i]['biz_id'];
		}else if(param[i]['mark']=='over' && req_ids!=""){
			leave_ids =req_ids +","+ param[i]['biz_id'];
		}
		
	}
	if(req_ids==''){//流程未结束时中止返回，不进行下一步的逻辑处理 
		 alert(data.msg);
		 return;
		 getCurrentPageObj().find("#opsHoliday_approveTable").bootstrapTable("refresh");
	}
	
	var calls = getMillisecond();
	var params = {};
	params["LEAVE_ID"] = leave_ids;
	params["LEAVE_STATE"] = "03";//状态为审批通过
	baseAjaxJsonp(dev_outsource+'opsHoliday/updateOutPersonHolidayState.asp?call='+calls+'&SID='+SID,params, function(data) {
		if (data != undefined&&data!=null&&data.result=="true") {
			alert("批量审批成功");
			getCurrentPageObj().find("#opsHoliday_approveTable").bootstrapTable("refresh");
		}else{
			alert("批量审批失败");
		}
	},calls);
	
}*/






















