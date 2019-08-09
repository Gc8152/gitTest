//页面div调用pop的id，需要返回值的input框的id数组
function openTaskVersionPop(id,params){
	getCurrentPageObj().find('#myModal_taskVersion').remove();
	getCurrentPageObj().find("#"+id).load("dev_construction/requirement/reqTask_intoVersion/taskVersion_Pop.html",{},function(){
		getCurrentPageObj().find("#myModal_taskVersion").modal("show"); 
		var arrSta=['03'];
		initSelect(getCurrentPageObj().find("#JTVversions_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SYS_DIC_VERSION_PROJECT"});
		initSelect(getCurrentPageObj().find("#JTVversions_status"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_VERSIONS_STATUS"},null,null,arrSta);
		initTaskVersionTable(id,params);
	});
}

function initTaskVersionTable(id,params){
	var queryParams = function(params) {
		var temp = {
			limit : params.limit, // 页面大小
			offset : params.offset
		// 页码
		};
		return temp;
	};
	getCurrentPageObj().find('#pAnnualReleasePlan').bootstrapTable("destroy").bootstrapTable({
				url :dev_construction+"reqtask_intoVersion/queryVersionInfoList.asp?SID="+SID+"&visit_modul="+params.vm,
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
					var reqType = getCurrentPageObj().find("#TVreq_classify").val();
					if(reqType == "02" || reqType=="03"){
						checkVersion(getCurrentPageObj().find("#TVreq_id").val(),row.VERSIONS_ID);
					}
					getCurrentPageObj().find('#myModal_taskVersion').modal('hide');
					params.versionsname.val(row.VERSIONS_NAME);
					params.versionsid.val(row.VERSIONS_ID);
					params.versionstype.val(row.VERSIONS_TYPE);
					var system_id = getCurrentPageObj().find("#system_id").val();
					var versions_id = getCurrentPageObj().find("#versions_id").val();
					//双击模态框后，检查应用和版本都存在的时候查询相关的任务
					if(system_id && versions_id) {
						//checkThisApplyIsExist(system_id, versions_id);
						freshSendProContent(system_id, versions_id);
						initqueryInterfaceSend_Add(system_id, versions_id);
					}
					if(params.func_call){
						params.func_call(row);
					}
					
					getnum(row.PLAN_NUM);
				},
				columns : [ {
					field : 'VERSIONS_ID',
					title : '版本编号',
					align : "center",
					visible:false
					
				},{
					field : 'VERSIONS_NAME',
					title : '版本名称',
					align : "center",
					width : "40%"
				}, {
					field : 'VERSIONS_DATE',
					title : '版本日期',
					align : "center"
				}, {
					field : 'VERSIONS_STATUS_DISPLAY',
					title : '版本状态',
					align : "center"
					
				},{
					field : 'START_TIME',
					title : '投产开始时间',
					align : "center"
				},{
					field : 'END_TIME',
					title : '投产结束时间',
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
	var versions_name=getCurrentPageObj().find('#JTVversions_name').val();
    var versions_type=getCurrentPageObj().find('#JTVversions_type').val();
    var versions_status=getCurrentPageObj().find('#JTVversions_status').val();
    getCurrentPageObj().find('#pAnnualReleasePlan').bootstrapTable('refresh',{
		url:dev_construction+"reqtask_intoVersion/queryVersionInfoList.asp?SID="+SID+'&versions_name='+escape(encodeURIComponent(versions_name))
		+'&versions_type='+versions_type+"&visit_modul="+params.vm+"&versions_status="+versions_status
	});
    
});	

enterEventRegister("popModelQueryLevel1", function(){getCurrentPageObj().find("#pop_tversionSearch").click();});

//重置
getCurrentPageObj().find('#pop_tversionReset').click(function(){
//	getCurrentPageObj().find('#JTVversions_name').val("");
//	getCurrentPageObj().find('#JTVversions_date').val("");
//	getCurrentPageObj().find("#JTVversions_status").val("");
//	getCurrentPageObj().find("#JTVversions_status").select2();
//	getCurrentPageObj().find("#JTVversions_type").val("");
//	getCurrentPageObj().find("#JTVversions_type").select2();
//	
	getCurrentPageObj().find("#versionQuery input").val("");
	var selects = getCurrentPageObj().find("#versionQuery select");
	selects.val(" ");
	selects.select2();
	
});

}




			
		
		