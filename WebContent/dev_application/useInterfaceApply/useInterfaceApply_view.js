

//页面返回按钮
$("#BackAcceptedList").click(function(){
	closeCurrPageTab();
});


//加载页面表单数据
function initUseAppView(param){
	if(param){
		qRecord_app_num = param.RECORD_APP_NUM;
		for(var k in param){
	        getCurrentPageObj().find("#"+k).text(param[k]);
		}
	}
	
	//初始化接口申请列表
	initInterAppTable(qRecord_app_num);
	
	
	//初始化接口申请列表
	function initInterAppTable(record_app_num) {
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		var use_InterfaceApply_viewCall = getMillisecond();
		getCurrentPageObj().find('#AcceptListCheckTable').bootstrapTable({
					url :dev_application+"useApplyManage/queryInterAppListById.asp?SID=" + SID + "&call=" + use_InterfaceApply_viewCall + "&record_app_num=" + record_app_num,
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
					pageSize : 10, // 每页的记录行数（*）
					clickToSelect : true, // 是否启用点击选中行
					// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
					uniqueId : "SYSTEM_ID", // 每一行的唯一标识，一般为主键列
					cardView : false, // 是否显示详细视图
					detailView : false, // 是否显示父子表
					singleSelect : true,// 复选框单选
					jsonpCallback:use_InterfaceApply_viewCall,
					onLoadSuccess : function(data){
						gaveInfo();
					},
					columns : [ {
						field : 'APP_TYPE_NAME',
						title : '申请类型',
						align : "center",
						width : "10%"
					}, {
						field : "APP_INTER_NUM",
						title : "申请编号",
						align : "center",
						width : "15%"
					}, {
						field : "INTER_NAME",
						title : "接口名称",
						align : "center",
						width : "12%"
					},  {
						field : "INTER_CODE",
						title : "接口编号",
						align : "center",
						width : "13%"
					}, {
						field : "INTER_STATUS_NAME",
						title : "接口状态",
						align : "center",
						width : "10%"
					},{
						field : "INTER_OFFICE_TYPE_NAME",
						title : "接口业务类型",
						align : "center",
						width : "10%"
					}, {
						field : "INTER_DESCR",
						title : "接口描述",
						width : "12%"
					}, {
						field : "INTER_APP_STATUS_NAME",
						title : "接口申请状态",
						align : "center",
						width : "10%"
					}, {
						field : "INTER_VERSION",
						title : "操作",
						align : "center",
						width : "8%",
						formatter: function (value, row, index) {
							
						return '<span class="hover-view" '+
						'onclick="GoCheckDetail(\''+row.INTER_ID+'\',\''+value+'\',\''+row.APP_TYPE+'\',\''+index+'\',\''+row.APP_ID+'\')">查看</span>';
					}
					}]
				});
	
			var callApp = getMillisecond();
			getCurrentPageObj().find("#ApplyViewHistoryTable").bootstrapTable('destroy').bootstrapTable({
			//请求后台的URL（*）
			url :dev_application+'serUseInterAccept/querySerOperationHistory.asp?SID='+SID+'&call='+callApp+'&RECORD_APP_NUM='+qRecord_app_num,
			method : 'get', //请求方式（*）   
			striped : true, //是否显示行间隔色
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
			//uniqueId : "", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			detailView : false, //是否显示父子表
			jsonpCallback : callApp,
			singleSelect: true,
			onLoadSuccess : function(data){
				gaveInfo();
			},
			columns : [{
				field : 'OPT_USER',
				title : '操作人',
				align : "center"
			}, {
				field : 'OPT_ACTION',
				title : '操作',
				align : "center"
			},{
				field : 'OPT_RESULT_NAME',
				title : '结论',
				align : "center"
			},{
				field : "OPT_REMARK",
				title : "相关说明",
				align : "center"
			},{
				field : "OPT_TIME",
				title : "操作时间",
				align : "center"
			}
			
			]
		});
	}
}









