//页面div调用pop的id，需要返回值的input框的id数组
function openTaskVersionChangePop(id,params){
	$('#myModal_taskVersion').remove();
	getCurrentPageObj().find("#"+id).load("dev_project/proReqChange/version_Pop.html",{},function(){
		$("#myModal_taskVersion").modal("show");
		initSelect(getCurrentPageObj().find("#versions_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SYS_DIC_VERSION_PROJECT"});
		initSelect(getCurrentPageObj().find("#versions_status"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_VERSIONS_STATUS"});
		initTaskVerChangeTable(id,params);
	});

}



function initTaskVerChangeTable(id,params){
	var queryParams = function(params) {
		var temp = {
			limit : params.limit, // 页面大小
			offset : params.offset
		// 页码
		};
		return temp;
	};
	
	getCurrentPageObj().find('#pAnnualReleasePlan').bootstrapTable("destroy").bootstrapTable({
				url :dev_project+"PChangeReq/queryVersionInfoList.asp?SID="+SID,
				method : 'get', // 请求方式（*）
				striped : true, // 是否显示行间隔色
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
				uniqueId : "VERSIONS_ID", // 每一行的唯一标识，一般为主键列
				cardView : false, // 是否显示详细视图
				detailView : false, // 是否显示父子表
				singleSelect : true,// 复选框单选
				onDblClickRow:function(row){
					$('#myModal_taskVersion').modal('hide');
					params.versionsname.val(row.VERSIONS_NAME);
					params.versionsid.val(row.VERSIONS_ID);
					params.versionstype.val(row.VERSIONS_TYPE);
					getnum(row.PLAN_NUM);
					
					var version_id = params.versionsid.val();
					var id = getCurrentPageObj().find("#tableChaneTaskInfo").bootstrapTable('getData');
					var ids = $.map(id, function (row) {return row.REQ_TASK_ID;});
					if(row.VERSIONS_ID!=version_id){						
						getCurrentPageObj().find("#tableChaneTaskInfo").bootstrapTable('remove', {
							field: 'REQ_TASK_ID',
							values: ids
						});	
					}
				},
				columns : [ {
					field : 'VERSIONS_ID',
					title : '版本编号',
					align : "center",
				},{
					field : 'VERSIONS_NAME',
					title : '版本名称',
					align : "center",
				}, {
					field : 'VERSIONS_DATE',
					title : '版本日期',
					align : "center"
				}, {
					field : 'VERSIONS_STATUS_DISPLAY',
					title : '版本状态',
					align : "center"
				},{
					field : 'VERSIONS_WEEK',
					title : '周次',
					align : "center",
				    visible:false
				},{
					field : 'SYSTEM_NAME',
					title : '应用名称',
					align : "center",
				    visible:false
				}]
        });
	
//查询	
getCurrentPageObj().find('#pop_tversionSearch').click(function(){
	var versions_name=getCurrentPageObj().find('#versions_name_pop').val();
    var versions_type=getCurrentPageObj().find('#versions_type').val();
    getCurrentPageObj().find('#pAnnualReleasePlan').bootstrapTable('refresh',{
		url:dev_project+"PChangeReq/queryVersionInfoList.asp?SID="+SID+'&versions_name='+escape(encodeURIComponent(versions_name))
		+'&versions_type='+versions_type
	});
    
});	

enterEventRegister("popModelQueryLevel1", function(){getCurrentPageObj().find("#pop_tversionSearch").click();});
//重置
getCurrentPageObj().find('#pop_tversionReset').click(function(){
	getCurrentPageObj().find('#versions_name_pop').val("");
	getCurrentPageObj().find('#versions_date').val("");
	getCurrentPageObj().find("#versions_status").val(" ");
	getCurrentPageObj().find("#versions_status").select2();
	getCurrentPageObj().find("#versions_type").val(" ");
	getCurrentPageObj().find("#versions_type").select2();
	
});

}




			
		
		