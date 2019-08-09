 //查询角色信息
function function_detail(param){
	var role_no=param;
	baseAjax("SRole/findSRoleById.asp?role_no="+role_no, null, function(msg){
		for(var k in msg){
			if(k=='flag'){
				if(msg[k]=='01'){
					getCurrentPageObj().find("#flag").text("停用");
				}else{
					getCurrentPageObj().find("#flag").text("启用");
				}
			}else{
			getCurrentPageObj().find("#"+k).text(msg[k]);
			}
		}
	});
	initfunctionInfo(role_no);
}
//查询常用功能
function initfunctionInfo(role_no){
    $("#role_no").val(role_no);
	$("#SfunctionTableInfo").bootstrapTable(
			{
				url : 'SRole/queryallfunction.asp?role_no='+role_no,
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
					align : 'center'
				},{
					field : 'MENU_NAME',
					title : '常用功能名称',
					align : "center"
				},{
					field : 'OPT_PERSON',
					title : '操作人',
					align : "center"
				},{
					field : "OPT_TIME",
					title : "操作时间",
					align : "center"
				} ]
			});
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
};


$(function(){	
	//删除
	$("#delfunction").click(function(){
		var role_no= $("#role_no").val();
		var id=$("#SfunctionTableInfo").bootstrapTable('getSelections');
		var ids=$.map(id,function(row){
			return row.MENU_CODE;
		});
		if(id.length!=1){
			alert("请选择一条数据进行删除!");
			return;
		}
		nconfirm("确定要移除该常用功能吗？",function(){
			$("#SfunctionTableInfo").bootstrapTable('remove',{
				field: 'MENU_CODE',
				values: ids
			});
			var url="SRole/delFunctionByMenuCode.asp?menu_code="+ids+"&role_no="+role_no;
			$.ajax({
				type : "post",
				url : url,
				async :  true,
				data : "",
				dataType : "json",
				success : function(msg) {
					alert("删除成功！",function(){
						getCurrentPageObj().find("#SfunctionTableInfo").bootstrapTable('refresh');
					});
				},
				error : function() {	
					alert("删除失败！");
				}
			});
		});
	});
	//显示pop框
	$("#addfunction").click(function(){
		getCurrentPageObj().find("#functionPopList").bootstrapTable('refresh');
		$("#matrixInfoModalPOP").modal("show");		
		initeMenulTable();
	});
	
});
//初始化pop列表
function initeMenulTable(){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
   var role_no=$("#role_no").val();
	$("#functionPopList").bootstrapTable(
			{
				url : 'SRole/queryOtherFunction.asp?role_no='+role_no,
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
				uniqueId : "MENU_NO", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: false,
				onLoadSuccess:function(data){
				},
				columns : [{
					 checkbox: true
				 }, {
					field : 'MENU_CODE',
					title : '菜单编号',
					align : 'center'
				},{
					field : 'MENU_NAME',
					title : '菜单名称',
					align : 'center'
				},{
					field : 'MENU_MEMO',
					title : '备注',
					align : "center"
				} ]
			});
}
/*
 * 初始化pop框按钮
 */
$(function(){
	//重置按钮
	$("#pop_menuReset").click(function(){
		getCurrentPageObj().find("#functionPOPForm input").val("");
	});
	//查询按钮
	$("#pop_menuSearch").click(function(){
	    var role_no=$("#role_no").val();
		var menu_code=$("#pop_menucode").val();
		var menu_name=$("#pop_menuname").val();
		$('#functionPopList').bootstrapTable('refresh',
				{url:'SRole/queryOtherFunction.asp?role_no='+role_no+"&menu_code="+menu_code+"&menu_name="+escape(encodeURIComponent(menu_name))});		
   });
	enterEventRegister("popModelQueryLevel1", function(){getCurrentPageObj().find("#pop_menuSearch").click();});
	//模态框下的取消按钮
	getCurrentPageObj().find("#cancelBtn").click(function(){
		$('#matrixInfoModalPOP').modal('hide');
	});
	//模态框下的确认按钮
	getCurrentPageObj().find("#addPOP").click(function(){
		var id=$("#functionPopList").bootstrapTable('getSelections');
		var ids=$.map(id,function(row){
			return row.MENU_CODE;
		});
		if(id.length==0){
			alert("请至少选择一条数据!");
			return;
		}
		var role_no=$("#role_no").val(); 
		var url="SRole/addFunction.asp?menu_no="+ids+"&role_no="+role_no;
		$.ajax({
			type : "post",
			url : url,
			async :  true,
			data : "",
			dataType : "json",
			success : function(msg) {

				if(msg.result=="true"){				
					alert("添加成功");	
					$('#matrixInfoModalPOP').modal('hide');
					getCurrentPageObj().find("#SfunctionTableInfo").bootstrapTable('refresh');
				}else{
					alert("系统异常，请稍后！");
				}
			},
			error : function() {	
				
			}
		});    		
	});
});




