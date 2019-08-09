function changeInitiateView(param){
	var $page = getCurrentPageObj();
	for(var k in param){
		$page.find("#"+k).text(param[k]);
	}	
	
	//初始化附件列表
	initFileTable(param);
	function initFileTable(param) {
		//附件列表
		 var tablefile = $page.find("#initiatev_fileTable");
			 var business_code = param.FILE_ID;
			 getSvnFileList(tablefile, $page.find("#file_initiatev_modal"), business_code, "00");
	}
	
	var viewCall = getMillisecond();//需求点表回调方法
	var queryParams = function(params) {
		var temp = {
			limit : params.limit, // 页面大小
			offset : params.offset
		// 页码
		};
		return temp;
	};
	var sUrl = dev_construction+"requirement_change/queryReqSubs.asp?SID=" + 
			SID + "&call=" + viewCall + "&REQ_ID=" + param.REQ_ID;
	$page.find("#initview_reqSubsTable").bootstrapTable({
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
		jsonpCallback:viewCall,
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
}