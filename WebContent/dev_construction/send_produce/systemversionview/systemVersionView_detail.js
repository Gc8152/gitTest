/**
 * 查询已投产任务列表对应的时间戳
 */
var querySendProTaskList_call = getMillisecond()+'1';

function queryAbleAndDisableList(row){
	/**
	 * 满足投产任务列表
	 * @param system_id
	 * @param version_id
	 */
	getCurrentPageObj().find("#meetDemandTask").bootstrapTable({
		data : row.ableList,
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		pagination : false, //是否显示分页（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "REQ_TASK_CODE", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		columns : [{
    	   field : '序号',
    	   title : '序号',
    	   align : 'center',
    	   formatter: function(value, row, index) {
    		   return index+1;
    	   }
       },{
    	   field : '附件详情',
    	   title : '附件详情',
    	   align : 'center',
    	   formatter: function(value, row, index) {
    		   return '<a class="click_text_sp" onclick="detailSendProTask('+index+');">查看</a>';
    	   },
			visible: false
       },{
    	   field : 'REQ_TASK_CODE',
    	   title : '任务编号',
    	   align : 'center',
       },{
    	   field : 'REQ_TASK_NAME',
    	   title : '任务名称',
    	   align : "center"
       },{
    	   field : 'SUB_REQ_NAME',
    	   title : '需求点名称',
    	   align : "center"
       },{
    	   field : 'REQ_TASK_RELATION',
    	   title : '从属关系',
    	   align : "center",
    	   formatter: function(value, row, index) {
				if(value=='01') {
					return '主办';
				} else {
					return '协办';
				}
			}
       },{
    	   field : "DEPT_NO",
    	   title : "项目组名称",
    	   align : "center",
    	   visible: false
       }, {
    	   field : "P_OWNER_NAME",
    	   title : "当前负责人",
    	   align : "center"
       }, {
    	   field : "ACCEPT_RESULT",
    	   title : "受理结果",
    	   align : "center",
    	   visible: false
       }, {
    	   field : "CREATE_TIME",
    	   title : "创建时间",
    	   align : "center"
       }, {
    	   field : "PLAN_ONLINETIME",
    	   title : "计划投产时间",
    	   align : "center"
       }  ]
	});
	/**
	 * 不满足投产任务列表
	 * @param system_id
	 * @param version_id
	 */
	getCurrentPageObj().find("#noMeetDemandTask").bootstrapTable({
		data : row.disAbleList,
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		pagination : false, //是否显示分页（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "REQ_TASK_CODE", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		onLoadSuccess:function(data){
		},
		columns : [{
    	   field : '序号',
    	   title : '序号',
    	   align : 'center',
    	   formatter: function(value, row, index) {
    		   return index+1;
    	   }
       },{
    	   field : '附件详情',
    	   title : '附件详情',
    	   align : 'center',
    	   formatter: function(value, row, index) {
    		   return '<a class="click_text_sp" onclick="detailSendProTask('+index+');">查看</a>';
    	   },
    	   visible: false
       },{
    	   field : 'REQ_TASK_CODE',
    	   title : '任务编号',
    	   align : 'center',
       },{
    	   field : 'REQ_TASK_NAME',
    	   title : '任务名称',
    	   align : "center"
       },{
    	   field : 'SUB_REQ_NAME',
    	   title : '需求点名称',
    	   align : "center"
       },{
    	   field : 'REQ_TASK_RELATION',
    	   title : '从属关系',
    	   align : "center",
    	   formatter: function(value, row, index) {
				if(value=='01') {
					return '主办';
				} else {
					return '协办';
				}
			}
       },{
    	   field : "DEPT_NO",
    	   title : "项目组名称",
    	   align : "center",
    	   visible: false
       }, {
    	   field : "P_OWNER_NAME",
    	   title : "当前负责人",
    	   align : "center"
       }, {
    	   field : "ACCEPT_RESULT",
    	   title : "受理结果",
    	   align : "center",
    	   visible: false
       }, {
    	   field : "CREATE_TIME",
    	   title : "创建时间",
    	   align : "center"
       }, {
    	   field : "PLAN_ONLINETIME",
    	   title : "计划投产时间",
    	   align : "center"
       }  ]
	});
}

/**
 * 查询已投产任务列表
 * @param system_id
 * @param version_id
 */
function querySendProTaskList(system_no, version_id) {
	var queryParams=function(params){
		var temp = {system_no:system_no,version_id:version_id};
		temp["limit"] = params.limit;
		temp["offset"] = params.offset;
		return temp;
	};
	getCurrentPageObj().find("#SendProTask").bootstrapTable(
			{
				url : dev_construction+'sysVerView/querySendProTaskList.asp?call='+querySendProTaskList_call+'&SID='+SID,
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
				uniqueId : "REQ_TASK_CODE", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: true,
				jsonpCallback: querySendProTaskList_call,
				onLoadSuccess:function(data){
				},
				columns : [ 
				  {
					field : '序号',
					title : '序号',
					align : 'center',
					formatter: function(value, row, index) {
						return index+1;
					}
				},{
					field : '附件详情',
					title : '附件详情',
					align : 'center',
					formatter: function(value, row, index) {
						return '<a class="click_text_sp" onclick="detailSendProTask('+index+');">查看</a>';
					},
					visible: false
				},{
					field : 'REQ_TASK_CODE',
					title : '任务编号',
					align : 'center',
				},{
					field : 'IS_MEET_DEMAND',
					title : '是否满足投产',
					align : 'center',
					formatter: function(value, row, index) {
						if(row.RESULT_UAT == '00' && row.RESULT_SIT == '00') {
							return "是";
						} else {
							return "否";
						}
					}
				},{
					field : 'REQ_TASK_NAME',
					title : '任务名称',
					align : "center"
				},{
					field : 'SUB_REQ_NAME',
					title : '需求点名称',
					align : "center"
				},{
					field : 'REQ_TASK_RELATION',
					title : '从属关系',
					align : "center",
					formatter: function(value, row, index) {
						if(value=='01') {
							return '主办';
						} else {
							return '协办';
						}
					}
				},{
					field : "DEPT_NO",
					title : "项目组名称",
					align : "center",
					visible: false
				}, {
					field : "P_OWNER_NAME",
					title : "当前负责人",
					align : "center"
				}, {
					field : "ACCEPT_RESULT",
					title : "受理结果",
					align : "center",
					visible: false
				}, {
					field : "CREATE_TIME",
					title : "创建时间",
					align : "center"
				}, {
					field : "PLAN_ONLINETIME",
					title : "计划投产时间",
					align : "center"
				}  ]
			});
}
function detailSendProTask(index){
		
}