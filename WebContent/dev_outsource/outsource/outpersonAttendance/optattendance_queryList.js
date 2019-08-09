var callTable=getMillisecond();
var queryParams=function(params){
	var temp={};
	 temp["limit"]=params.limit;
	 temp["offset"]=params.offset;
	return temp;
};
/**
 * 组装查询url 
 * @returns {String}
 */
function queryOptAttendanceUrl(){
	var url = dev_outsource+'optattendance/queryOptAttendanceList.asp?call='+callTable+'&SID='+SID;
	var sts="";
	var selects=getCurrentPageObj().find("select[name^='FD.']");//获取下拉选的值
	for(var i=0;i<selects.length;i++){
		var obj=getCurrentPageObj().find(selects[i]);
		if($.trim(obj.val())!=""){
			sts+='&'+obj.attr("name").substr(3)+"="+obj.val();
		}
	}
	var fds=getCurrentPageObj().find("input[name^='FD.']");
	for(var i=0;i<fds.length;i++){
		var obj=getCurrentPageObj().find(fds[i]);
		if($.trim(obj.val())!=""){
			url+='&'+obj.attr("name").substr(3)+"="+escape(encodeURIComponent(obj.val()));
		}
	}
	return url+sts;
}
//查询列表显示table
(function() {
	initSelect(getCurrentPageObj().find("#acc_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_ATTENDANCE_TYPE"});	//考勤类型
	initSelect(getCurrentPageObj().find("#acc_status"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_ATTENDANCE_STATUS"});//考勤状态
	//供应商名称
	getCurrentPageObj().find("#FDsupplier_name").unbind("click");
	getCurrentPageObj().find("#FDsupplier_name").click(function(){
		openSupplierPop("outperson_supplier_Pop",
				{singleSelect:true,parent_company:getCurrentPageObj().find("#FDsupplier_name"),parent_sup_num:getCurrentPageObj().find("input[name='FD.supplier_num']")});
	});
	getCurrentPageObj().find("#optAttendance_Add").unbind("click");//新增按钮
	getCurrentPageObj().find("#optAttendance_Add").click(function(){
		closeAndOpenInnerPageTab("outpersonAdd","增加外包人员考勤信息","dev_outsource/outsource/outpersonAttendance/optattendance_add.html",function(){
			initaddOptAttendance();
		});
	});
	getCurrentPageObj().find("#optAttendance_Edit").unbind("click");//修改按钮
	getCurrentPageObj().find("#optAttendance_Edit").click(function(){
		var dt=getCurrentPageObj().find("#optAttendanceTableInfo").bootstrapTable('getSelections');
		if(dt.length!=1){
			alert("请选择一条数据!");
			return;
		}
		var acc_id = $.map(dt, function (row) {
			return row.ACC_ID;                    
		});
		closeAndOpenInnerPageTab("outpersonEdit","修改外包人员考勤信息","dev_outsource/outsource/outpersonAttendance/optattendance_update.html",function(){
			initUptOptAttendance(acc_id);
		});
	});
	getCurrentPageObj().find("#optAttendance_Detaill").unbind("click");//详情按钮
	getCurrentPageObj().find("#optAttendance_Detaill").click(function(){
		var dt=getCurrentPageObj().find("#optAttendanceTableInfo").bootstrapTable('getSelections');
		if(dt.length!=1){
			alert("请选择一条数据!");
			return;
		}
		var acc_id = $.map(dt, function (row) {
			return row.ACC_ID;                    
		});
		closeAndOpenInnerPageTab("outpersonAttendanceDetail","外包人员考勤详细信息","dev_outsource/outsource/outpersonAttendance/optattendance_detail.html",function(){
			initDeOptAttendance(dt[0]["ACC_ID"]);
		});
	});
	getCurrentPageObj().find("#optAttendance_Del").unbind("click");//删除按钮
	getCurrentPageObj().find("#optAttendance_Del").click(function(){
		var dt=getCurrentPageObj().find("#optAttendanceTableInfo").bootstrapTable('getSelections');
		if(dt.length!=1){
			alert("请选择一条数据!");
			return;
		}
/*		if(dt[0]["OP_STATE"]!='03'){
			alert("只有待入场人员信息可删除");
			return;
		}*/
		nconfirm("确定需要删除该数据？",function(){
			var call_op = getMillisecond();
			baseAjaxJsonp(dev_outsource+'optattendance/deleteOptAttendance.asp?call='+call_op+'&SID='+SID,{acc_id:dt[0]["ACC_ID"]},function(data){
				if(data&&data.result=="true"){
					getCurrentPageObj().find("#optAttendanceTableInfo").bootstrapTable("refresh");
					alert("删除成功");
				}else{
					alert("删除失败");
				}
			},call_op);
		});
	});
	obj=getCurrentPageObj().find("#outperson_export");//外包人员导出
	obj.unbind("click");
	obj.click(function(){
		var belongproject=getCurrentPageObj().find("#belongproject").val();//身份证
		var op_name=getCurrentPageObj().find("#op_name").val();//外包人员姓名
		var supplier_num=getCurrentPageObj().find("#supplier_num").val();//供应商ID
		var op_office=getCurrentPageObj().find("#op_office").val();//实施处室
		var op_state=getCurrentPageObj().find("#op_state").val();//人员状态
		var url ="outperson/exportOutPersonInfo.asp?op_name="+escape(encodeURIComponent(op_name))+"&belongproject="+belongproject
		+"&supplier_num="+supplier_num+"&op_office="+op_office+"&op_state="+op_state;
		window.location.href = url;
	});
	//查询按钮
	getCurrentPageObj().find("#queryOptAttendanceList").unbind("click");
	getCurrentPageObj().find("#queryOptAttendanceList").click(function(){
		getCurrentPageObj().find("#optAttendanceTableInfo").bootstrapTable("refresh",{url:queryOptAttendanceUrl()});
	});
	//重置按钮
	getCurrentPageObj().find("#resetOptAttendanceList").unbind("click");//重置按钮
	getCurrentPageObj().find("#resetOptAttendanceList").click(function(){
		getCurrentPageObj().find("input[name^='FD.']").val(" ");
		getCurrentPageObj().find("#FDsupplier_name").val("");
		getCurrentPageObj().find("#optattendanceInfoList select").val(" ").select2();
	});
	getCurrentPageObj().find("#optAttendanceTableInfo").bootstrapTable({
				url : dev_outsource+'optattendance/queryOptAttendanceList.asp?call='+callTable+'&SID='+SID,
				method : 'get', //请求方式（*）   
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
				uniqueId : "ACC_ID", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: true,
				jsonpCallback:callTable,
				columns : [ {
					field: 'middle',
					checkbox: true,
					rowspan: 2,
					align: 'center',
					valign: 'middle',
				},{
					field : 'USER_NO',
					title : '用户编号',
					align : "center",
				},{
					field : 'ACC_ID',
					title : '员工考勤id',
					align : 'center',
					visible:false,
				},{
					field : 'OP_CODE',
					title : '身份证号',
					align : "center",
					visible:false,
				},{
					field : 'USER_NAME',
					title : '外包人员姓名',
					align : "center",
				},{
					field : "SUP_NAME",
					title : "供应商名称",
					align : "center"
				},{
					field : 'ACC_TYPE_NAME',
					title : '考勤类型',
					align : "center",
				},{
					field : 'WORK_DATE',
					title : '考勤日期',
					align : "center",
				}, {
					field : "BERW_TIME",
					title : "上班时间",
					align : "center",
				}, {
					field : "AFTW_TIME",
					title : "下班时间",
					align : "center",
				},  {
					field : "WORK_HOURS",
					title : "标准工时",
					align : "center",
				},{
					field : 'WORK_OVERHOURS',
					title : '加班工时',
					align : "center",
				},{
					field : "ACC_STATUS_NAME",
					title : "考勤状态",
					align : "center"
				}]
			});
	//初始化导入文件
	importExcel.initImportExcel(getCurrentPageObj().find("#optAttendance_Import"),"","sfile/downloadFTPFile.asp?id=m_047","optattendance/importOptattendance.asp",function(msg){
		if(msg&&msg.result=="true"){
			getCurrentPageObj().find("#optAttendanceTableInfo").bootstrapTable("refresh");
			alert("导入成功!");
		}else if(msg&&msg.result=="false"&&msg.error_info){
			alert(msg.error_info);
		}else{
			alert("导入失败!");
		}
	});
})();
