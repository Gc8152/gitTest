

function viewSyncEdit(selRow){//初始化

	var $page = getCurrentPageObj();
	var state = selRow.STATE;
	var is_sync = selRow.IS_SYNC;
	var role = '';

	/*初始化申请信息*/
	for(var k in selRow){
		$page.find("#"+k).text(selRow[k]);
	}	
	
	if(state == '00'){//PM待分析
		role = 'pm';
	}
	if(state == '01'){//CM待确认
		role = 'cm';
		$("#vdivhide1").show();
		$("#vdivhide2").show();
	}
	if(state == '02'){//关闭
		if(is_sync == '00'){//同步
			role = 'cm';
			$("#vdivhide1").show();
			$("#vdivhide2").show();
		}else{//不同步
			return;
		}
	}
	
	var queryParams = function(params) {
		var temp = {
			limit : params.limit, // 页面大小
			offset : params.offset
		// 页码
		};
		return temp;
	};
	/*初始化流信息*/
	var streamCall = getMillisecond();
	var SYSTEM_ID = selRow.SYSTEM_ID;
	var SYNC_STREAM_ID = selRow.SYNC_STREAM_ID;
	var stUrl = dev_construction+'versionSync/queryStreamList.asp?SID='+SID+'&call='+streamCall+'&SYSTEM_ID='+SYSTEM_ID+'&SYNC_STREAM_ID='+SYNC_STREAM_ID+'&ROLE='+role;
	
	
	$page.find("#streamTable").bootstrapTable('destroy').bootstrapTable({
		//请求后台的URL（*）
		url :stUrl,
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
		jsonpCallback : streamCall,
		singleSelect: false,
		onLoadSuccess : function(data){
			gaveInfo();
		},
		columns : [{
			field : 'ORDER_ID',
			title : '序号',
			align : "center",
			width : "8%",
			formatter:function(value,row,index){
				return index + 1;
			}
		}, {
			field : "STREAM_APP_ID",
			title : "流申请ID",
			width : "15%",
			align : "center"
		}, {
			field : "STREAM_APP_TITLE",
			title : "标题",
			width : "15%",
			align : "center"
		}, {
			field : "STREAM_NAME",
			title : "流名称",
			width : "15%",
			align : "center"
		}, {
			field : "STREAM_STATUS",
			title : "流状态",
			width : "15%",
			align : "center"
		}, {
			field : "VERSIONS_NAME",
			title : "版本名称",
			width : "20%",
			align : "center"
		},{
			field : "CONFIG_MAN_NAME",
			title : "配置管理员",
			width : "12%",
			align : "center"
		}
		]
	});
	
	
}




