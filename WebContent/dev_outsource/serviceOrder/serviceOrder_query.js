function initSOrderPage(){//初始化页面
	var objc = getCurrentPageObj().find("#contract_code");//初始化合同pop框
	objc.unbind("click");
	objc.click(function(){
		openContractInfoPop("querySoContract_Pop",{code:getCurrentPageObj().find("#contract_code")});
	});
	var obj = getCurrentPageObj().find("#supplier_name_sq");//初始化供应商pop
	obj.unbind("click");
	obj.click(function(){
		openSupplierPop("serverSupplier_Pop",{singleSelect:true,parent_company:getCurrentPageObj().find("#supplier_name_sq"),
			parent_sup_num:getCurrentPageObj().find("input[name='sq.supplier_id']")});
	});
	//订单状态
	initSelect(getCurrentPageObj().find("#acc_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_SERVERORDER_STATE"});
	//初始化所属部门
	var obj=getCurrentPageObj().find("#dept_name");
	obj.unbind("click");
	obj.click(function(){										  
		openSelectTreeDivToBody($(this),"sordertreedept_id","SOrg/queryorgtreedeptlist.asp",30,function(node){
			getCurrentPageObj().find("#dept_name").val(node.name);
			getCurrentPageObj().find("input[name='sq.dept_no']").val(node.id);
		});
	});
}
/**
 * 刷新核算单
 */
function refreshAllsOrder(url){
	if(url){
		getCurrentPageObj().find("#sOrder_query").bootstrapTable('refresh',{url:dev_outsource+url+'&call=jq_1520821597035&SID='+SID});
	}else{
		getCurrentPageObj().find("#sOrder_query").bootstrapTable('refresh',{url:dev_outsource+'sOrder/queryAllsOrder.asp?call=jq_1520821597035&SID='+SID});	
	}
}
function initSOrdretable(){//初始化非项目任务书列表数据
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	getCurrentPageObj().find("#sOrder_query").bootstrapTable({
		url : dev_outsource+'sOrder/queryAllsOrder.asp?call=jq_1520821597035&SID='+SID,//请求后台的URL（*）
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
		uniqueId : "order_id", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		jsonpCallback : "jq_1520821597035",
		detailView : false, //是否显示父子表
		singleSelect: true,
		columns : [ {
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		},{
			field : 'abcdef',
			title : '序号',
			align : "center",
			visible:false,
			formatter: function (value, row, index) {
    			  return index+1;
        	  }
		},{
			field : 'ACC_CODE',
			title : '订单编号',
			align : "center"
		},{
			field : 'ACC_NAME',
			title : '订单名称',
			align : "center"
		}, {
			field : "ACC_MONEY",
			title : "订单金额(元)",
			align : "center"
		},{
			field : 'ACC_STATE_NAME',
			title : '订单状态',
			align : "center"
		},{
			field : "SUPLIER_NAME",
			title : "供应商",
			align : "center" 
		},{
			field : 'CONTRACT_CODE',
			title : '框架合同号',
			align : "center",
		},{
			field : 'ACC_YEAR',
			title : '订单年度',
			align : "center" 
		},{
			field : 'ACC_STARTTIME',
			title : '开始日期',
			align : "center"
		},{
			field : 'ACC_ENDTIME',
			title : '结束日期',
			align : "center"
		}]
	});
}

getCurrentPageObj().find("#order_add").click(function(){//新增页面 按钮
	closePageTab("order_add",function(){
		openInnerPageTab("order_add", "核算单新增", "dev_outsource/serviceOrder/serviceOrder_add.html",function(){
			getCurrentPageObj()[0].serviceOrder.Init("add");
		});
	});
});
getCurrentPageObj().find("#order_update").click(function(){//修改页面按钮
	var id = getCurrentPageObj().find("#sOrder_query").bootstrapTable('getSelections');
	if (id.length != 1) {
		alert("请选择一条数据!");
		return;
	}
	var order_id = $.map(id, function(row) {
		return (row.ACC_CODE);
	});
//	var order_state = $.map(id, function(row) {
//		return (row.ACC_STATE);
//	});
//	if(order_state!=""&&order_state!=undefined&&"00"!=order_state){
//		alert("只有初始状态的订单才能修改");
//	}else{
	if(id&&(id.length==0||id.length>1)){
		alert("请选择一条数据修改");
		return;
	}
	closePageTab("sOrder_update",function(){
		openInnerPageTab("sOrder_update", "核算单修改", "dev_outsource/serviceOrder/serviceOrder_add.html",function(){
			getCurrentPageObj()[0].serviceOrder.Init("update",id[0]);
		});
	});
//	}
});
getCurrentPageObj().find("#order_delete").click(function(){//删除按钮
	var id = getCurrentPageObj().find("#sOrder_query").bootstrapTable('getSelections');
	if (id.length != 1) {
		alert("请选择一条数据!");
		return;
	}
	var order_id = $.map(id, function(row) {
		return (row.ACC_ID);
	});
	var order_state = $.map(id, function(row) {
		return (row.ACC_STATE);
	});
	if(order_state!=""&&order_state!=undefined&&"00"!=order_state){
		alert("只有初始状态的订单才能删除！");
	}else{
		nconfirm("确定删除该核算单？",function(){
			baseAjaxJsonpNoCall(dev_outsource+"sOrder/deleteOrderById.asp?&acc_id="+order_id,null,function(data){
				if(data&&data.result=="true"){
					alert("删除成功");
					refreshAllsOrder();
				}else{
					alert("删除失败");
				}
			});
		});
	}
});
getCurrentPageObj().find("#order_detail").click(function(){//查看
	var id = getCurrentPageObj().find("#sOrder_query").bootstrapTable('getSelections');
	if (id.length != 1) {
		alert("请选择一条数据!");
		return;
	}
	closePageTab("sOrder_update",function(){
		openInnerPageTab("sOrder_detail", "核算单详情", "dev_outsource/serviceOrder/serviceOrder_add.html",function(){
			getCurrentPageObj()[0].serviceOrder.Init("query",id[0]);
		});
	});
});
getCurrentPageObj().find("#order_print").click(function(){//打印
	var id = getCurrentPageObj().find("#sOrder_query").bootstrapTable('getSelections');
	if (id.length != 1) {
		alert("请选择一条数据!");
		return;
	}
	var order_id = $.map(id, function(row) {
		return (row.ACC_ID);
	});
	var order_state = $.map(id, function(row) {
		return (row.ACC_STATE);
	});
//	if(order_state!=""&&order_state!=undefined&&"00"==order_state){
//		alert("未确认生成的核算单不可以打印！");
//	}else{
		openPrintWindow("dev_outsource/serviceOrder/serviceOrder_payprint.html?order_id="+order_id+"&SID="+SID);
//	}
	
});
getCurrentPageObj().find("#export1").click(function(){//导出
	var id = getCurrentPageObj().find("#sOrder_query").bootstrapTable('getSelections');
	if (id.length != 1) {
		alert("请选择一条数据!");
		return;
	}
	var acc_id=id[0].ACC_ID;
	var url =dev_outsource+'sOrder/export1.asp?call=jq_1520821597035&SID='+SID+'&acc_id='+acc_id;
	window.location.href = url;
});
getCurrentPageObj().find("#export2").click(function(){//导出
	var id = getCurrentPageObj().find("#sOrder_query").bootstrapTable('getSelections');
	if (id.length != 1) {
		alert("请选择一条数据!");
		return;
	}
	var acc_id=id[0].ACC_ID;
	var url =dev_outsource+'sOrder/export2.asp?call=jq_1520821597035&SID='+SID+'&acc_id='+acc_id;
	window.location.href = url;
});
getCurrentPageObj().find("#export3").click(function(){//导出
	var id = getCurrentPageObj().find("#sOrder_query").bootstrapTable('getSelections');
	if (id.length != 1) {
		alert("请选择一条数据!");
		return;
	}
	var acc_id=id[0].ACC_ID;
	var url =dev_outsource+'sOrder/export3.asp?call=jq_1520821597035&SID='+SID+'&acc_id='+acc_id;
	window.location.href = url;
});
getCurrentPageObj().find("#export4").click(function(){//导出
	var id = getCurrentPageObj().find("#sOrder_query").bootstrapTable('getSelections');
	if (id.length != 1) {
		alert("请选择一条数据!");
		return;
	}
	var acc_id=id[0].ACC_ID;
	var url =dev_outsource+'sOrder/export4.asp?call=jq_1520821597035&SID='+SID+'&acc_id='+acc_id;
	window.location.href = url;
});
function checkNum(obj){//校验输入的数字
	var reg = new RegExp("^[0-9]+(.[0-9]{1,4})?$");
	if(!reg.test(obj.value)){
        alert("请输入数字，保留两位小数!");
        obj.foucs();
    }
}
function soederTimeCompare(){//时间比较
	var flag = true;
	var order_date_from = getCurrentPageObj().find("#order_date_from").val();
	var order_date_to = getCurrentPageObj().find("#order_date_to").val();
	if(order_date_from!=""&&order_date_to!=""){
		if(order_date_from>order_date_to){
			alert('开始时间不能大于结束时间!');
			return false;
		}
	}
	return flag;
}
function soederMoneyCompare(){//金额比较
	var flag = true;
	var order_money_from = getCurrentPageObj().find("#order_money_from").val();
	var order_money_to = getCurrentPageObj().find("#order_money_to").val();
	if(order_money_from!=""&&order_money_to!=""){
		if(parseFloat(order_money_from)>parseFloat(order_money_to)){
			alert('开始金额不能大于结束金额!');
			return false;
		}
	}
	return flag;
}
function queryOrderMainUrl(){//组装查询url  @returns {String}
	var url="sOrder/queryAllsOrder.asp?1=1";
	var fds=getCurrentPageObj().find("input[name^='sq.']");//获取input框的值
	var acc_state=getCurrentPageObj().find("#acc_state").val();//获取input框的值
	if(acc_state!=undefined&&acc_state!=null&&acc_state!=""){
		url+='&acc_state='+acc_state;
	}
	for(var i=0;i<fds.length;i++){
		var obj=$(fds[i]);
		if($.trim(obj.val())!=""){
			url+='&'+obj.attr("name").substr(3)+"="+escape(encodeURIComponent(obj.val()));
		}
	}
	
	return url;
}
getCurrentPageObj().find("#order_query").click(function(){//查询按钮点击
	if(soederTimeCompare()&&soederMoneyCompare()){
		refreshAllsOrder(queryOrderMainUrl());
	}
});
getCurrentPageObj().find("#order_reset").click(function(){//重置按钮点击
	getCurrentPageObj().find("input").val("");
	getCurrentPageObj().find("select").val(" ");
	getCurrentPageObj().find("select").select2();
});
$(document).ready(function(){
	//初始化核算单列表数据
	initSOrdretable();
	initSOrderPage();//初始化页面下拉选择框
});