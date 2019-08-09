//页面div调用pop的id，需要返回值的input的id
function openAffSystemPop(id,params){
	$('#myModal_System').remove();
	getCurrentPageObj().find("#"+id).load("dev_application/System_Pop.html",{},function(){
		$("#myModal_System").modal("show");
		initAffSystemTable(params);
	});

}

function initAffSystemTable(sysparams){
	var queryParams = function(params) {
		var temp = {
			limit : params.limit, // 页面大小
			offset : params.offset
		// 页码
		};
		return temp;
	};
	
	var taskSysListCall = getMillisecond();
	
	getCurrentPageObj().find('#gSystemInfoPopTable').bootstrapTable("destroy").bootstrapTable({
				url :dev_application+"applicationManager/queryApplication.asp?SID="+SID+"&call="+taskSysListCall,
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
				jsonpCallback:taskSysListCall,
				singleSelect : true,// 复选框单选
				onDblClickRow:function(row){
					$('#myModal_System').modal('hide');
					addAffectSystem(row);
				},onLoadSuccess : function(data){
					gaveInfo();
				},
				columns : [ {
					field : 'SYSTEM_ID',
					title : '应用编号',
					align : "center",
				},{
					field : 'SYSTEM_NAME',
					title : '应用名称',
					align : "center",
				}, {
					field : 'SYSTEM_SHORT',
					title : '应用简称',
					align : "center"
				}]
			});
	
	//用户POP重置
	getCurrentPageObj().find("#pop_sysReset").click(function(){
		getCurrentPageObj().find("#systemQuery input").val("");
	});
	//多条件查询用户
	getCurrentPageObj().find("#pop_sysSearch").click(function(){
		var system_name = $("#SPTsystem_name").val();
		var system_short =  $("#SPTsystem_short").val();

		getCurrentPageObj().find('#gSystemInfoPopTable').bootstrapTable('refresh',{url:dev_application+"applicationManager/queryApplication.asp?SID="+SID+"&call="+taskSysListCall+"&system_name="+escape(encodeURIComponent(system_name))+"&system_short="+escape(encodeURIComponent(system_short))});
	});
	enterEventRegister("popModelQueryLevel1", function(){getCurrentPageObj().find("#pop_sysSearch").click();});
}




			
		
		