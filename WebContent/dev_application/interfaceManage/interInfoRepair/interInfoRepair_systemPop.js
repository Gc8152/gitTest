function interInfoRepair_systemPop(obj,callparams){
	$("#interInfoRepair_systemPoP").remove();
	//加载pop框内容
	obj.load("dev_application/interfaceManage/interInfoRepair/interInfoRepair_systemPop.html",{},function(){
		var modObjPOP = getCurrentPageObj().find("#interInfoRepair_systemPop");
		modObjPOP.modal("show");
		var sCall = getMillisecond();//表回调方法		
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		var sUrl = dev_application+"applicationManager/queryApplication.asp?SID="+SID + "&call=" + sCall;
		modObjPOP.find("[tb='table_system']").bootstrapTable({
			url :sUrl,
			method : 'get', // 请求方式（*）
			striped : false, // 是否显示行间隔色
			cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : true, // 是否启用排序
			sortOrder : "asc", // 排序方式
			queryParams : queryParams,// 传递参数（*）
			sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
			pagination : true, // 是否显示分页（*）
			pageList : [ 5, 10, 15 ], // 可供选择的每页的行数（*）
			pageNumber : 1, // 初始化加载第一页，默认第一页
			pageSize : 5, // 每页的记录行数（*）
			clickToSelect : true, // 是否启用点击选中行
			// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
			uniqueId : "SYSTEM_ID", // 每一行的唯一标识，一般为主键列
			cardView : false, // 是否显示详细视图
			detailView : false, // 是否显示父子表
			singleSelect : true,// 复选框单选
			jsonpCallback:sCall,
			onDblClickRow:function(row){
				callparams.id.val(row.SYSTEM_ID);
				callparams.name.val(row.SYSTEM_NAME);
				modObjPOP.modal("hide");
			},onLoadSuccess : function(data){
				gaveInfo();
			},
			columns : [ {
				field : 'order_id',
				title : '序号',
				align : "center",
				width : "50px",
				formatter:function(value,row,index){
					return index + 1;
				}
			}, {
				field : 'SYSTEM_NAME',
				title : '应用名称',
				align : "center"
			}, {
				field : "SYSTEM_SHORT",
				title : "应用简称",
				align : "center"
			}, {
				field : "PROJECT_MAN_NAME",
				title : "应用负责人",
				align : "center"
			}]
		});
		
		//重置按钮
		modObjPOP.find("#reset_system").click(function(){
			modObjPOP.find("#system_name").val("");
			modObjPOP.find("#project_man_name").val("");
		});
		//查询按钮
		modObjPOP.find("#query_system").click(function(){
			var params = getCurrentPageObj().find("#interInfoRepair_systemPopForm").serialize();
			var sUrl = dev_application+"applicationManager/queryApplication.asp?SID="+SID + "&call=" + sCall + "&"+params;
			modObjPOP.find("[tb='table_system']").bootstrapTable('refresh',{
				url:sUrl});
		});	
		//enter触发查询
		enterEventRegister("popModelQueryLevel1", function(){getCurrentPageObj().find("#query_system").click();});
				
	});
}