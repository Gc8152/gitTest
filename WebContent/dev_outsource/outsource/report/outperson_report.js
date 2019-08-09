var callTables1=getMillisecond();
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
function queryOutPersonUrl(){
	var url = dev_outsource+'attendance/report.asp?call='+callTables1+'&SID='+SID+'&query=queryList';
	var sts="";
	var selects=getCurrentPageObj().find("select[name^='FD.']");//获取下拉选的值
	for(var i=0;i<selects.length;i++){
		var obj=getCurrentPageObj().find(selects[i]);
		if($.trim(obj.val())!=""){
			sts+='&'+obj.attr("name").substr(3)+"="+obj.val();
		}
	}
	var fds=getCurrentPageObj().find("input[name^='FD.']");//name为FD.entranceLeave的输入框表示如离场发起查询
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
	initSelect(getCurrentPageObj().find("#purch_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_PURCH_TYPE"});	//人员采购类型
	initSelect(getCurrentPageObj().find("select[id='op_state']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_STATUS"});	//人员状态
	var obj=getCurrentPageObj().find("#FD_op_office");//实施处室
	obj.unbind("click");
	obj.click(function(){
		openSelectTreeDivToBody($(this),"op_office_pop_fd_tree","SOrg/queryorgtreelist.asp",30,function(node){
			getCurrentPageObj().find("#FD_op_office").val(node.name);
			getCurrentPageObj().find("input[name='FD.op_office']").val(node.id);
		});
	});
	obj=getCurrentPageObj().find("#FDsupplier_name");//供应商名称
	obj.unbind("click");
	obj.click(function(){
		openSupplierPop("outperson_contractSupplier_Pop1",
				{singleSelect:true,parent_company:getCurrentPageObj().find("#FDsupplier_name"),parent_sup_num:getCurrentPageObj().find("input[name='FD.supplier_id']")});
	});

	obj=getCurrentPageObj().find("#outperson_export");//外包人员导出
	obj.unbind("click");
	obj.click(function(){
		var op_name=getCurrentPageObj().find("#op_name").val();//外包人员姓名
		var supplier_id=getCurrentPageObj().find("#supplier_id").val();//供应商ID
		var op_office=getCurrentPageObj().find("#op_office").val();
		var op_belongsystem=getCurrentPageObj().find("#op_belongsystem").val();
		var date=getCurrentPageObj().find("#date").val();
		var purch_type=getCurrentPageObj().find("#purch_type").val();
		var op_state=getCurrentPageObj().find("#op_state").val();
		var url =dev_outsource+"attendance/exportOutPersonInfo.asp?SID="+SID+"&call="+callTables1+"&op_name="+escape(encodeURIComponent(op_name))+"&op_office="+op_office
		+"&supplier_id="+supplier_id+"&op_belongsystem="+escape(encodeURIComponent(op_belongsystem))+"&date="+date+"&purch_type="+purch_type+"&op_state="+op_state;
		window.location.href = url;
	});
	//查询按钮
	getCurrentPageObj().find("#queryOutPersonInfo").unbind("click");
	getCurrentPageObj().find("#queryOutPersonInfo").click(function(){
		getCurrentPageObj().find("#outpersonTableInfo1").bootstrapTable("refresh",{url:queryOutPersonUrl()});
	});
	//重置按钮
	getCurrentPageObj().find("#resetOutPersonInfo").unbind("click");//重置按钮
	getCurrentPageObj().find("#resetOutPersonInfo").click(function(){
		getCurrentPageObj().find("input[name^='FD.']:visible").val(" ");
		getCurrentPageObj().find("#FDsupplier_name").val("");
		getCurrentPageObj().find("#staffInfoList select:visible").val(" ").select2();
		getCurrentPageObj().find("input[name='FD.supplier_id'],input[name='FD.op_office']").val(" ");
	});
	getCurrentPageObj().find("#outpersonTableInfo1").bootstrapTable({
				url : queryOutPersonUrl(),
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
				uniqueId : "OP_CODE", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: true,
				jsonpCallback:callTables1,
				onLoadSuccess:function(data){
					gaveInfo();
				},
				columns : [{
					field : 'OP_CODE',
					title : '人员编号',
					align : "center",
					visible:false
				},  {
					field : 'OP_NAME',
					title : '人员姓名',
					align : "center",
				}, 	{
					field : 'OP_STATE_NAME',
					title : '人员状态',
					align : "center"
				},  {
					field : "PURCH_TYPE_NAME",
					title : "人员采购类型",
					align : "center"
				}, {
					field : "SUP_NAME",
					title : "供应商名称",
					align : "center",
				},  {
					field : "ORG_NAME",
					title : "行内归属部门",
					align : "center"
				},  {
					field : "SYSTEM_NAME",
					title : "所属应用",
					align : "center"
				},{
					field : "DATE",
					title : "考勤年月",
					align : "center"
				}, {
					field : "01",
					title : "1日",
					align : "center"
				}, {
					field : "02",
					title : "2日",
					align : "center"
				}, {
					field : "03",
					title : "3日",
					align : "center"
				}, {
					field : "04",
					title : "4日",
					align : "center"
				}, {
					field : "05",
					title : "5日",
					align : "center"
				}, {
					field : "06",
					title : "6日",
					align : "center"
				}, {
					field : "07",
					title : "7日",
					align : "center"
				}, {
					field : "08",
					title : "8日",
					align : "center"
				}, {
					field : "09",
					title : "9日",
					align : "center"
				}, {
					field : "10",
					title : "10日",
					align : "center"
				}, {
					field : "11",
					title : "11日",
					align : "center"
				}, {
					field : "12",
					title : "12日",
					align : "center"
				}, {
					field : "13",
					title : "13日",
					align : "center"
				}, {
					field : "14",
					title : "14日",
					align : "center"
				}, {
					field : "15",
					title : "15日",
					align : "center"
				}, {
					field : "16",
					title : "16日",
					align : "center"
				}, {
					field : "17",
					title : "17日",
					align : "center"
				}, {
					field : "18",
					title : "18日",
					align : "center"
				}, {
					field : "19",
					title : "19日",
					align : "center"
				}, {
					field : "20",
					title : "20日",
					align : "center"
				}, {
					field : "21",
					title : "21日",
					align : "center"
				}, {
					field : "22",
					title : "22日",
					align : "center"
				}, {
					field : "23",
					title : "23日",
					align : "center"
				}, {
					field : "24",
					title : "24日",
					align : "center"
				}, {
					field : "25",
					title : "25日",
					align : "center"
				}, {
					field : "26",
					title : "26日",
					align : "center"
				}, {
					field : "27",
					title : "27日",
					align : "center"
				}, {
					field : "28",
					title : "28日",
					align : "center"
				}, {
					field : "29",
					title : "29日",
					align : "center"
				}, {
					field : "30",
					title : "30日",
					align : "center"
				}, {
					field : "31",
					title : "31日",
					align : "center"
				}]
			});
})();
