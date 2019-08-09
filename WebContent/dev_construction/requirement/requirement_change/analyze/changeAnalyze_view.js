

function changeAnalyzeView(selRow){//初始化
	
	var $page = getCurrentPageObj();
	var REQ_CHANGE_ID = selRow.REQ_CHANGE_ID;
	/*初始化页面信息*/
	for(var k in selRow){
		$page.find("#"+k).text(selRow[k]);
	}	
	//初始化附件列表
	initFileTable(selRow);
	function initFileTable(selRow){
		
		//附件列表
		 var tablefile = $page.find("#analyzev_fileTable");
		 var business_code = selRow.FILE_ID;
		 getSvnFileList(tablefile, $page.find("#file_analyzev_modal"), business_code, "00");
		
	}
	
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	
	/*初始化需求点列表*/
	var analyzeviewCall = getMillisecond();//需求点表回调方法
	var sUrl = dev_construction+"requirement_change/queryReqSubs.asp?SID=" + 
			SID + "&call=" + analyzeviewCall + "&REQ_ID=" + selRow.REQ_ID;
	$page.find("#analyzeview_reqSubsTable").bootstrapTable({
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
		pageSize : 10, // 每页的记录行数（*）
		clickToSelect : true, // 是否启用点击选中行
		// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
		uniqueId : "REQ_ID", // 每一行的唯一标识，一般为主键列
		cardView : false, // 是否显示详细视图
		detailView : false, // 是否显示父子表
		singleSelect : true,// 复选框单选
		jsonpCallback:analyzeviewCall,
		onDblClickRow:function(row){
		},onLoadSuccess : function(data){
			gaveInfo();
		},
		columns : [ {
			field : 'ORDER_ID',
			title : '序号',
			align : "center",
			width : "50px",
			formatter:function(value,row,index){
				return index + 1;
			}
		}, {
			field : 'SUB_REQ_CODE',
			title : '需求点编号',
			align : "center"
		}, {
			field : "SUB_REQ_NAME",
			title : "需求点名称",
			align : "center"
		}, {
			field : "SUB_REQ_STATE_NAME",
			title : "需求点状态",
			align : "center"
		}, {
			field : "SUB_REQ_CONTENT",
			title : "需求点描述",
			align : "center"
		}]
	});
	
	/*初始化历史操作记录*/
	var voptCall = getMillisecond();
	$page.find("#ViewOptHistoryTable").bootstrapTable('destroy').bootstrapTable({
		//请求后台的URL（*）
		url :dev_construction+'requirement_change/queryOptHistory.asp?SID='+SID+'&call='+voptCall+'&REQ_CHANGE_ID='+REQ_CHANGE_ID,
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
		jsonpCallback : voptCall,
		singleSelect: true,
		onLoadSuccess : function(data){
			gaveInfo();
		},
		columns : [
		 {
			field : "OPT_TIME",
			title : "日期",
			align : "center"
		},{
			field : 'OPT_USER_NAME',
			title : '操作人',
			align : "center"
		}, {
			field : 'OPT_ACTION',
			title : '操作',
			align : "center"
		},{
			field : "OPT_REMARK",
			title : "备注说明",
			align : "center"
		},{
			field : 'REQ_CHANGE_STATUS_NAME',
			title : '需求变更状态',
			align : "center"
		}
//		,{
//			field : 'FILE_NAME',
//			title : '附件',
//			align : "center"
//		}
		]
	});
	
	
}










