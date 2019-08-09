var calls = getMillisecond();
var queryParams=function(params){
	var temp={};
	 temp["limit"]=params.limit;
	 temp["offset"]=params.offset;
	return temp;
};
$(function(){
	initSelect($("#query_category"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SUP_TECHNOLOGIC_MANAGE"});
	initSelect($("#query_importdegree"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_SUP_LEVEL"});
	initSupplierblack();
	//查询
	getCurrentPageObj().find("#queryAllSupplierConfigList").click(function(){
		var query_category = getCurrentPageObj().find("#query_category").val();
		var query_importdegree=getCurrentPageObj().find("#query_importdegree").val();
		var query_createman=getCurrentPageObj().find("#query_createman").val();
		getCurrentPageObj().find('#detailSupplierConfigTable').bootstrapTable('refresh',
				{url:dev_outsource+'supplierConfig/queryAllSupplierConfig.asp?isBlackmenu=1&query_category=' + query_category+'&query_importdegree='+query_importdegree
				+'&query_createman='+escape(encodeURIComponent(query_createman))+"&SID="+SID+"&call="+calls});
	});
	//清空
	getCurrentPageObj().find("#reset_supplierConfigList").click(function(){
		getCurrentPageObj().find("#supplierConfigList input").val("");
		var selects=getCurrentPageObj().find("#supplierConfigList select");
		selects.val("");
		selects.select2();
	});
	//新增
	getCurrentPageObj().find("#addSupplierConfig").click(function(){
		initAddConfigPop("","add");
	});
	//修改
	getCurrentPageObj().find("#updateSupplierConfig").click(function(){
		var num = $("#detailSupplierConfigTable").bootstrapTable('getSelections');
		var configId= $.map(num, function (row) {
			return row.CONFIGID;                    
		});
		if(configId.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		initAddConfigPop(configId,"update");
	});
	//删除
	getCurrentPageObj().find("#deleteSupplierConfig").click(function(){
		var num = $("#detailSupplierConfigTable").bootstrapTable('getSelections');
		var configId= $.map(num, function (row) {
			return row.CONFIGID;                    
		});
		if(configId.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		nconfirm("确定要删除该数据吗？",function(){
			baseAjaxJsonp(dev_outsource+"supplierConfig/deleteSupplierConfig.asp?configId="+configId+"&SID="+SID+"&call="+calls,null,function(data){
			/*$.ajax({
				type : "get",
				url : "supplierConfig/deleteSupplierConfig.asp?configId="+configId,
				dataType : "json",
				success : function(msg) {
					alert("删除成功！",function(){*/
						$("#detailSupplierConfigTable").bootstrapTable('remove', {
							field: 'CONFIGID',
							values: configId
						});	
						$("#queryAllSupplierConfigList").click();
					});
				/*},
				error : function() {	
					alert("删除失败！");
				}
			});*/
		});	
	});
	//查看
	getCurrentPageObj().find("#detailSupplierConfig").click(function(){
		var num = $("#detailSupplierConfigTable").bootstrapTable('getSelections');
		var configId= $.map(num, function (row) {
			return row.CONFIGID;                    
		});
		if(configId.length!=1){
			alert("请选择一条数据进行查看!");
			return ;
		}
		initAddConfigPop(configId,"detail");
	});
	//生成模板
	getCurrentPageObj().find("#createSupplierMode").click(function(){
		
	});
});
//初始化查询供应商列表显示table
function initSupplierblack() {
	$("#detailSupplierConfigTable").bootstrapTable(
			{
				//请求后台的URL（*）
				url : dev_outsource+'supplierConfig/queryAllSupplierConfig.asp？SID='+SID+"&call="+calls,
				method : 'get', //请求方式（*）   
				striped : false, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）escape(encodeURIComponent(user_name))
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				pagination : true, //是否显示分页（*）
				pageList : [5,10,20],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 10,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "CONFIGID", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				jsonpCallback:calls,
				singleSelect: true,
				onLoadSuccess:function(data){
					
				},
				columns : [ {
					field: 'middle',
					checkbox: true,
					rowspan: 2,
					align: 'center',
					valign: 'middle'
				},{
					field : 'Number',
					title : '序号',
					align : "center",
					//sortable: true,
					formatter: function (value, row, index) {
						return index+1;
					}
				},{
					field : 'CONFIGID',
					title : '主键',
					align : "center",
					visible: false
				},{
					field : 'CATEGORY',
					title : '供应商分类',
					align : "center"
				},{
					field : 'IMPORTDEGREE',
					title : '重要程度',
					align : "center"
				}, {
					field : "CREATEMAN",
					title : "创建人",
					align : "center"
				}, {
					field : "CREATETIME",
					title : "创建时间",
					align : "center"
				}]
			});
}
function initAddConfigPop(configId,opertype){
	closeAndOpenInnerPageTab("addSupConfig","供应商尽职调查模板-维护","dev_outsource/supplier/supplierConfig/supplier_addConfig.html?r="+Math.random(),function(){
	     initSupConfigDetail(configId,opertype);
	});
}