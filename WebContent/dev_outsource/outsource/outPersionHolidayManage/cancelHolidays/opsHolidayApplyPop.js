
function openHolidayApplyPop(id,callparams,call_func){
	//先清除
	getCurrentPageObj().find('#myModal_opsHoliday').remove();
	getCurrentPageObj().find("#"+id).load("dev_outsource/outsource/outPersionHolidayManage/cancelHolidays/opsHolidayApplyPop.html",{},function(){
		getCurrentPageObj().find("#myModal_opsHoliday").modal("show");
		initSelect(getCurrentPageObj().find("#leave_category_pop"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_STAFFLEAVE_LEAVETYPE"});
		var url = dev_outsource+"opsHoliday/queryOpsHolidayApplyList.asp?SID="+SID;
		opsHolidayPop("#pop_opsHolidayTable",url,callparams,call_func);
	});
	
}

var queryParams=function(params){
	var temp={
			limit: params.limit, //页面大小
			offset: params.offset //页码
	};
	return temp;
};	

/**
*请假单POP框
*/
function opsHolidayPop(optTable,optUrl,optParam,call_func){
	
	var columns=[ 
        {
			field : 'IDCARD_NO',
			title : '身份证号',
			align : "center"
		},{
			field : 'OP_NAME',
			title : '外包人员姓名',
			align : "center"
		},{
			field : "LEAVE_STARTDATE",
			title : "请假开始日期",
			align : "center"
		},{
			field : "LEAVE_ENDDATE",
			title : "请假结束日期",
			align : "center"
		},{
			field : "LEAVE_DAYS",
			title : "请假天数",
			align : "center"
		}];
	//查询所有行员POP框
	getCurrentPageObj().find(optTable).bootstrapTable("destroy").bootstrapTable({
				//请求后台的URL（*）
				url : optUrl,
				method : 'get', //请求方式（*）   
				striped : false, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				pagination : true, //是否显示分页（*）
				pageList : [5],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 5,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "LEAVE_ID", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: true,
				onDblClickRow:function(row){//双击行触发事件
						getCurrentPageObj().find('#myModal_opsHoliday').modal('hide');
						optParam.LEAVE_ID.val(row.LEAVE_ID);
						optParam.HOLIDAYAPPLY_NAME.val(row.OP_NAME+"的请假单："+row.LEAVE_ID);
						optParam.OP_PHONE.val(row.OP_PHONE);
						optParam.LEAVE_CATEGORY_DISPLAY.val(row.LEAVE_CATEGORY_DISPLAY);
						optParam.OP_OFFICE_NAME.val(row.OP_OFFICE_NAME);
						optParam.OP_OFFICE.val(row.OP_OFFICE);
						optParam.LEAVE_STARTDATE.val(row.LEAVE_STARTDATE);
						optParam.LEAVE_ENDDATE.val(row.LEAVE_ENDDATE);
						optParam.LEAVE_DAYS.val(row.LEAVE_DAYS);
						if(call_func){
							call_func(row);
						}
					},
				
				columns : columns
			});
		
	
	//行员POP重置
	getCurrentPageObj().find("#pop_opsReset").click(function(){
		getCurrentPageObj().find("#opsHoliday_popForm input").val("");
		var selects = getCurrentPageObj().find("#opsHoliday_popForm select");
		selects.val(" ");
		selects.select2();
	});
	
	//多条件查询行员信息
	getCurrentPageObj().find("#pop_opsSearch").click(function(){
		var leave_startdate = getCurrentPageObj().find("#leave_startdate_pop").val();
		var leave_enddate =  getCurrentPageObj().find("#leave_enddate_pop").val();
		var leave_category =  getCurrentPageObj().find("#leave_category_pop").val();
		getCurrentPageObj().find(optTable).bootstrapTable('refresh',{url:optUrl+"&leave_startdate="+leave_startdate+
			"&leave_enddate="+leave_enddate+"&leave_category="+leave_category});
	});
}
	