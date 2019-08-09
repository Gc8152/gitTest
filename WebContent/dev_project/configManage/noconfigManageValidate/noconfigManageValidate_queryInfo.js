;function initNoconfigValidateInfoLayout(param){
	var currTab = getCurrentPageObj();
	var form = currTab.find("#noconfigManageValidate_QueryInfo");
	var table = currTab.find("#noconfigManageValidateInfo_table");
	//返回操作
	var back = currTab.find("#noconfigManageValidate_queryinfo_back");
	back.click(function(e){
		closeCurrPageTab();
	});
	for(var i in param){
		currTab.find("div[name="+i+"]").html(param[i]);
	}
	
	var config_id=param["CONFIG_ID"];
	initTable();
	function initTable(){
		/**		初始化table	**/
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset //页码
			};
			return temp;
		};
		var call = getMillisecond();
		table.bootstrapTable({
			//请求后台的URL（*）
			url : dev_project+'NotconformRaise/notconformFindOperateRecord.asp?call='+call+'&SID='+SID+'&CONFIG_ID='+config_id,
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
			uniqueId : "RECORD_ID", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			detailView : false, //是否显示父子表
			jsonpCallback:call,
			singleSelect: true,
			columns : [ {
				field : 'OPT_TIME',
				title : '日期',
				align : "center"
			}, {
				field : "OPT_USER_NAME",
				title : "操作人",
				align : "center"
			}, {
				field : "OPT_STATUS",
				title : "操作",
				align : "center"
			}, {
				field : "RECORD_DESCR",
				title : "备注",
				align : "center"
			}, {
				field : "STATUS_NAME",
				title : "不符合项状态",
				align : "center"
			},{
				field : "CONFIG_ID",
				title : "附件",
				align : "center",
				visible : false
			}]
		});	
	}
}