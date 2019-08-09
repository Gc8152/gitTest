
function initQualityManageInfoLayout(item){
	var currTab = getCurrentPageObj();
	var infoTable = currTab.find("#qualityInfo_table");
	var table = currTab.find("#qualityManageInfo_table");
	
	//返回
	var back = currTab.find("#qualityManage_info_back");
	back.click(function(e){
		closeCurrPageTab();
	});
	
	
	//初始化页面信息
	initNoConfirmItemQueryDetailLayout();
	function initNoConfirmItemQueryDetailLayout(){
			for(var i in item){
				infoTable.find("div[name="+i+"]").html(item[i]);
			}
	  initNoConfirmItemQueryRecordTable();//初始化操作记录
	}
	
	//初始化操作记录
	function initNoConfirmItemQueryRecordTable(){
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
			url : dev_project+'qualityManager/queryListRecord.asp?call='+call+'&SID='+SID+'&QUALITY_ID='+item.QUALITY_ID,
			method : 'get', //请求方式（*）   
			striped : false, //是否显示行间隔色
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
			uniqueId : "RECORD_ID", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			detailView : false, //是否显示父子表
			jsonpCallback:call,
			singleSelect: true,
			onLoadSuccess : function(data){
				if(data.total == 0){
					gaveInfo();
					getCurrentPageObj().find(".history").hide();
				}
			
			},
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
				field : "REMARK",
				title : "备注",
				align : "center"
			}, {
				field : "INCON_STATUS_NAME",
				title : "不符合项状态",
				align : "center"
			}]
		});	
	}
	
}