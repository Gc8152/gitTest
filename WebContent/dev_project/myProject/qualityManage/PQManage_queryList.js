;function initPQQualityManageListLayout(){
	
	var currTab = getCurrentPageObj();
	
	var qualityManage_notConform = currTab.find("#qualityManage_notConform");
	
	var form = currTab.find("#PMManage_query");
	
	var table = currTab.find("#PQManageTable");
	autoInitSelect(form);//初始化下拉框
	qualityManage_notConform.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行管理!");
			return ;
		}
		openInnerPageTab("myqualityManage_quaryList","不符合项管理","dev_project/myProject/qualityManage/qualityManage_queryList.html",function(){
			initQualityManageListLayout(rows[0].PROJECT_ID);
		});
	});
	
	var commit = currTab.find("#commit");
	commit.click(function(){
		var param = form.serialize();
		table.bootstrapTable('refresh',{url:dev_project+'quality/queryCountQuality.asp?call='+call+'&SID='+SID+"&"+param});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#commit").click();});
	//重置
	var reset = currTab.find("#reset");
	reset.click(function(){
		form[0].reset();
		currTab.find("select").select2();
	});
	
	/**		初始化table	**/
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	var param = form.serialize();
	var call = getMillisecond();
	table.bootstrapTable({
		//请求后台的URL（*）
		url : dev_project+'quality/queryCountQuality.asp?call='+call+'&SID='+SID+"&"+param,
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
		uniqueId : "PROJECT_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:call,
		singleSelect: true,
		columns : [{
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle',
		}, {
			field : "TOTAL",
			title : "标识",
			align : "center",
			formatter: function (value, row, index) {
				if(parseInt(value-row.CLOSETOTAL)>0){
					return ""+'<div class="text-red">!</div>';
				}else{
					return "";
				}
			}
		}, {
			field : "PROJECT_NUM",
			title : "项目编号",
			align : "center",
		}, {
			field : "PROJECT_NAME",
			title : "项目名称",
			align : "center",
		}, {
			field : "PROJECT_TYPE_NAME",
			title : "项目类型",
			align : "center",
		}, {
			field : "PROJECT_MAN_NAME",
			title : "项目经理",
			align : "center",
		}, {
			field : "TOTAL",
			title : "未关闭不符合项个数",
			align : "center",
			formatter: function (value, row, index) {
				return value-row.CLOSETOTAL;
			}
		}, {
			field : "CLOSETOTAL",
			title : "已关闭不符合项个数",
			align : "center",
		}, {
			field : "PROJECT_STATUS_NAME",
			title : "项目状态",
			align : "center"
		}]
	});
	
}
initPQQualityManageListLayout();