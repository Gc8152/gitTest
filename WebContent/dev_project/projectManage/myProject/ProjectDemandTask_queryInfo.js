
var table_click_int2=0;
var whole_01="-";
var unit_03="-";
var fbi_14="-";
var submit_sit_04="-";
var sit_04="-";
var uit_05="-";
var submit_open_15="-";
var open_06="-";
function initProjectDemandTaskTable(item,data){
	//>>>>>>>>>>>>>>>>>>>>>>>>>>>>判断里程碑时间 为null 用"-"替换
	if(data==null){
		alert("初始化里程碑时间失败！");
	}else{
		if(data.whole_01==null||data.whole_01==undefined||data.whole_01==""){
		}else{
			whole_01=data.whole_01;
		}
		if(data.unit_03==null||data.unit_03==undefined||data.unit_03==""){
		}else{
			unit_03=data.unit_03;
		}
		if(data.fbi_14==null||data.fbi_14==undefined||data.fbi_14==""){
		}else{
			fbi_14=data.fbi_14;
		}
		if(data.submit_sit_04==null||data.submit_sit_04==undefined||data.submit_sit_04==""){
		}else{
			submit_sit_04=data.submit_sit_04;
		}
		if(data.sit_04==null||data.sit_04==undefined||data.sit_04==""){
		}else{
			sit_04=data.sit_04;
		}
		if(data.uit_05==null||data.uit_05==undefined||data.uit_05==""){
		}else{
			uit_05=data.uit_05;
		}
		if(data.submit_open_15==null||data.submit_open_15==undefined||data.submit_open_15==""){
		}else{
			submit_open_15=data.submit_open_15;
		}
		if(data.open_06==null||data.open_06==undefined||data.open_06==""){
		}else{
			open_06=data.open_06;
		}
		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<判断里程碑时间 为null 用"-"替换
	}
	
	var currTab = getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题
	var table = currTab.find("#table_demandtask");
	var project_id = item.PROJECT_ID;
	
	//初始化列表
	var tableCall2=getMillisecond()+1;
	var table_click_int=0;
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		table.bootstrapTable('destroy').bootstrapTable({
			//请求后台的URL（*）
				url :dev_construction+"requirement_splitTask/queryTaskInfoProjectId.asp?SID="+SID+"&project_id="+project_id+"&call="+tableCall2,
				method : 'get', //请求方式（*）   
				striped : false, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				pagination : true, //是否显示分页（*）
				pageList : [5,10,15],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 10,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "REQ_TASK_ID", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				jsonpCallback:tableCall2,
				singleSelect: true,
				onLoadSuccess:function (){
					gaveInfo();
					if(table_click_int<1){
						//$("#table_demandtask thead").prepend('<tr><th colspan="9" data-valign="middle" data-align="center">关联任务</th>'+'<th colspan="8" data-valign="middle" data-align="center">任务进度</th></tr>');
						//getCurrentPageObj().find('#gSystemInfoTable').bootstrapTable('mergeCells',{index:1,field:'SYSTEM_NAME',colspan:2,rowspan:1});
					    }
					table_click_int++;
				   },/*
				onDblClickRow:function(row){
					initSitTaskInfo(row.REQ_TASK_ID,data);
				},*/
					columns : [ {
					field : '序号',
					title : '序号',
					width : '45px',
					align : "center",
					formatter: function(value, row, index) {
						return index+1;
					}
					},{
						field : '标识',
						title : '标识',
						width : '45px',
						align : "center",
						formatter: function (value, row, index) {
							return "否";
						}
					},{
						field : 'REQ_TASK_CODE',
						title : '任务编号',
						width : '180px',
						align : "center",
						formatter: function (value, row, index) {
							return '<span class="hover-view" style="color:#F00"'+
							'onclick="initSitTaskInfo('+row.REQ_TASK_ID+')">'+value+'</span>';
						}
					},{
						field : 'DEPT_NAME',
						title : '项目组',
						align : "center",
						visible :false 
					},{
						field : "REQ_TASK_NAME",
						title : "任务名称 ",
						width : '250px',
						align : "center",
						formatter: function (value, row, index) {
							return '<span class="hover-view" '+
							'onclick="initTaskInfo('+row.REQ_TASK_ID+')">'+value+'</span>';
						}
					},  {
						field : "SUB_REQ_NAME",
						title : "需求点名称",
						width : "200px",
						align : "center",
						formatter: function (value, row, index) {
							return '<span class="hover-view" '+
							'onclick="initReqInfo('+row.REQ_ID+')">'+value+'</span>';
						}
					},{
						field : 'REQ_TASK_RELATION_DISPLAY',
						title : '从属关系',
						width :'75px',
						align : "center"
					},{
						field : 'REQ_TASK_STATE_DISPLAY',
						title : '任务状态',
						width : '90px',
						align : "center",
						formatter:function(value,row,index){if(value!=0){return '<span  style="font-weight:bold;text-align: center; width: 110px; ";>'+row.REQ_TASK_STATE_DISPLAY+'</span>';}}
					
					}, {
						field : "SYSTEM_NAME",
						title : "应用名称",
						align : "center"
					}, {
						field : "DEMAND_TASK",
						title : "关联任务数",
						width : '90px',
						align : "center",formatter: function (value, row, index) {
							return '<span >'+(value-1)+'</span>';
						}
					}, {
						field : "PROJECT_MAN_NAME",
						title : "任务责任人",
						width : '90px',
						align : "center"
					},{
						field : "ZONGTI_TIME",
						title : '设计开发 ('+whole_01+')',
						width : '165px',
						align : "center"
					}, {
						field : "DANYUAN_TIME",
						title : '单元测试 ('+unit_03+')',
						width : '165px',
						align : "center"
					}, {
						field : "LIANTIAO_TIME",
						title : '联调测试 ('+fbi_14+')',
						width : '165px',
						align : "center"
					}, {
						field : "TIJIAO_SIT_TIME",
						title : '提交SIT测试 ('+submit_sit_04+')',
						width : '185px',
						align : "center"
					}, {
						field : "SIT_TIME",
						title : 'SIT测试 ('+sit_04+')',
						width : '155px',
						align : "center"
					}, {
						field : "UIT_TIME",
						title : 'UAT测试 ('+uit_05+')',
						width : '165px',
						align : "center"
					}, {
						field : "TIJIAO_TOUCHAN_TIME",
						title : '提交投产 ('+submit_open_15+')',
						width : '165px',
						align : "center"
					}, {
						field : "TOUCHAN_TIME",
						title : '投产 ('+open_06+')',
						width : '135px',
						align : "center"
					}]
	});
	
	//返回
	var back = currTab.find("#back_sit");
	back.click(function(){
		closeCurrPageTab();
	});
	
}
//需求任务详情
function initTaskInfo(req_task_id){
	closePageTab("req_taskDetail");
	openInnerPageTab("req_taskDetail","任务详情页面","dev_construction/requirement/requirement_analyze/task_accept/task_detail.html",function(){
		initReqTaskDetailLayout(req_task_id);
	});
}

//需求点详情
function initReqInfo(req_id){
	closeAndOpenInnerPageTab("subreq_detail","需求点详情","dev_construction/requirement/requirement_analyze/split_subreq/splitSubreq_detail.html",function(){
		initSplitReqDetailLayOut(req_id);
	});
}

function initSitTaskInfo(req_task_id){
	var currTab = getCurrentPageObj();
	currTab.find("#task_INFO").show();
	var queryParams = function(params) {
		var temp = {
			limit : params.limit, // 页面大小
			offset : params.offset
		// 页码
		};
		return temp;
	};
	table_click_int2=0;
	var table = currTab.find("#table_demand_taskInfo");
	var tableCall = "report"+getMillisecond();
	table.bootstrapTable("destroy").bootstrapTable({
		//请求后台的URL（*）
		url : dev_construction+"requirement_splitTask/queryTaskVersionInfoBySubReqId.asp?SID="+SID+"&call="+tableCall+"&req_task_id="+req_task_id,
		method : 'get', //请求方式（*）
		striped : false, //是否显示行间隔色
		async:true,
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [10,15],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "SUB_REQ_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		jsonpCallback : tableCall,
		detailView : false, //是否显示父子表
		singleSelect: false,
		onLoadSuccess:function (){
			gaveInfo();
			if(table_click_int2<1){
				//$("#table_demand_taskInfo thead").prepend('<tr><th colspan="8" data-valign="middle" data-align="center">关联任务</th>'+'<th colspan="8" data-valign="middle" data-align="center">任务进度</th></tr>');
				//getCurrentPageObj().find('#gSystemInfoTable').bootstrapTable('mergeCells',{index:1,field:'SYSTEM_NAME',colspan:2,rowspan:1});
			}
			table_click_int2++;
		},
		columns : [{
			field : '序号',
			title : '序号',
			align : "center",
			formatter: function(value, row, index) {
				return index+1;
			}
			},{
				field : 'REQ_TASK_CODE',
				title : '任务编号',
				align : "center"
			},{
				field : 'DEPT_NAME',
				title : '项目组',
				align : "center",
				visible :false 
			},{
				field : "REQ_TASK_NAME",
				title : "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;任务名称 " +
						"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;",
				align : "center"
			},  {
				field : "SUB_REQ_ID_NAME",
				title : "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;需求点名称" +
						"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;",
				align : "center"
			},{
				field : 'REQ_TASK_RELATION_DISPLAY',
				title : '从属关系',
				align : "center"
			},{
				field : 'REQ_TASK_STATE_DISPLAY',
				title : '任务状态',
				align : "center"
			}, {
				field : "SYSTEM_NAME",
				title : "应用名称",
				align : "center"
			}, {
				field : "VERSION_NAME",
				title : "<span style='padding:0 40px;'>纳入版本</span>",
				align : "center"
			},{
				field : "PROJECT_MAN_NAME",
				title : "当前责任人",
				align : "center",
				visible :false 
			},{
				field : "ZONGTI_TIME",
				title : '设计开发 ('+whole_01+')',
				align : "center"
			}, {
				field : "DANYUAN_TIME",
				title : '单元测试 ('+unit_03+')',
				align : "center"
			}, {
				field : "LIANTIAO_TIME",
				title : '联调测试 ('+fbi_14+')',
				align : "center"
			}, {
				field : "TIJIAO_SIT_TIME",
				title : '提交SIT测试 ('+submit_sit_04+')',
				align : "center"
			}, {
				field : "SIT_TIME",
				title : 'SIT测试 ('+sit_04+')',
				align : "center"
			}, {
				field : "UIT_TIME",
				title : 'UAT测试 ('+uit_05+')',
				align : "center"
			}, {
				field : "TIJIAO_TOUCHAN_TIME",
				title : '提交投产 ('+submit_open_15+')',
				align : "center"
			}, {
				field : "TOUCHAN_TIME",
				title : '投产 ('+open_06+')',
				align : "center"
			}]
	});
}

