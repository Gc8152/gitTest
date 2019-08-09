//查询列表显示table
function initStaffInfo() {
	$("#SFunctionTableInfo").bootstrapTable(
			{
				url : 'SFunction/queryallfunctions.asp',
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
				uniqueId : "MENU_CODE", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
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
					field : 'MENU_CODE',
					title : '常用功能编号',
					align : 'center',
				},{
					field : 'MENU_NAME',
					title : '常用功能名称',
					align : "center"
				},{
					field : 'MENU_URL',
					title : '常用功能地址',
					align : "center"				
				},{
					field : "MENU_IMG",
					title : "常用功能图片地址",
					align : "center"
			
				}, {
					field : "MENU_MEMO",
					title : "备注",
					align : "center"
					
				},{
					field : "OPT_PERSON",
					title : "创建人",
					align : "center"
				},{
					field : "OPT_TIME",
					title : "创建时间",
					align : "center"
				}]
			});
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
};
/*
 * 初始化页面按钮
 */
$(function(){
	//重置按钮
	$("#sFunction_reset").click(function(){
		getCurrentPageObj().find("#functionForm input[type='text']").val("");
	});
	//查询按钮
	$("#sFunction_serch").click(function(){
			var menu_code=$("#menu_code").val();
			var menu_name=$("#menu_name").val();
			$('#SFunctionTableInfo').bootstrapTable('refresh',
					{url:'SFunction/queryallfunctions.asp?menu_code='+menu_code+"&menu_name="+escape(encodeURIComponent(menu_name))});		
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#sFunction_serch").click();});
	//删除按钮
	$("#delFunction").click(function(){
		var id=$("#SFunctionTableInfo").bootstrapTable('getSelections');
		var ids=$.map(id,function(row){
			return row.MENU_CODE;
		});
		if(id.length!=1){
			alert("请选择一条数据进行删除!");
			return;
		}
		nconfirm("确定要移除该常用功能吗？",function(){
			$("#SFunctionTableInfo").bootstrapTable('remove',{
				field: 'MENU_CODE',
				values: ids
			});
			var url="SFunction/delFunctionByMenuCode.asp?menu_code="+ids;
			$.ajax({
				type : "post",
				url : url,
				async :  true,
				data : "",
				dataType : "json",
				success : function(msg) {
					alert("删除成功！",function(){
						getCurrentPageObj().find("#SFunctionTableInfo").bootstrapTable('refresh');
					});
				},
				error : function() {	
					alert("删除失败！");
				}
			});
		});
	});
	//查看详情
	getCurrentPageObj().find("#selFunction").unbind("click");
	getCurrentPageObj().find("#selFunction").click(function(){
		var id=$("#SFunctionTableInfo").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行查看！");
			return;
		}
		var ids=$.map(id,function(row){
			return row.MENU_CODE;
		});
		closeAndOpenInnerPageTab("selFunction","查看常用功能信息","pages/sfunction/functionInfo_detail.html",function(){
			functionInfo_detail(ids);
		});
	});
	//新增按钮
	$("#addFunction").click(function(){
		closeAndOpenInnerPageTab("addFunction", "创建常用功能", "pages/sfunction/functionInfo_add.html", function(){	
		});
	});
	//修改查询行员信息
	getCurrentPageObj().find("#updFunction").unbind("click");
	getCurrentPageObj().find("#updFunction").click(function(){
		var id = $("#SFunctionTableInfo").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行修改!");
			return;
		}
		var ids = $.map(id, function (row) {
			return row.MENU_CODE;                    
		});
		closeAndOpenInnerPageTab("updFunction","修改常用功能信息","pages/sfunction/functionInfo_update.html",function(){
			function_update(ids);
		});
	});
});
initStaffInfo();