/**
 * 需求更改，不再显示该页面（杨斌 2017-01-23）
 */

//;function initPQConfigManageListLayout(){
//	var currTab = getCurrentPageObj();
//	var form = currTab.find("#configManage_query");
//	var table = currTab.find("#configManageTable");
//	autoInitSelect(form);//初始化下拉
//	currTab.find("select[name='STATUS']").empty();
//	var arr = "03,04";
//	initSelect(currTab.find("select[name='STATUS']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_PROJECT_STATUS"},null,null,arr);
//	var PROJECT_TYPE = currTab.find("select[name='PROJECT_TYPE']");
//	PROJECT_TYPE.empty();
//	var arr = "SYS_DIC_VERSION_PROJECT,SYS_DIC_REQUIREMENT_ANALYSIS_PROJECT,SYS_DIC_URGENT_PROJECT,SYS_DIC_ANNUAL_TASK_PROJECT";
//	initSelect(PROJECT_TYPE,{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SYS_DIC_MILESTONE_PROJECT_TYPE"},null,null,arr);
//	//不符合项操作
//	var configManage_notConform = currTab.find("#configManage_notConform");
//	configManage_notConform.click(function(){
//		var rows = table.bootstrapTable('getSelections');
//		if(rows.length!=1){
//			alert("请选择一条数据进行管理!");
//			return ;
//		}
//		openInnerPageTab("configManage_notConform","不符合项管理","dev_project/configManage/configManage_queryList.html",function(){
//			initPQConfigManageListLayout(rows[0].PROJECT_ID);
//		});
//	});
//	//查询
//	var commit = currTab.find("#commit");
//	commit.click(function(){
//		var param = form.serialize();
//		table.bootstrapTable('refresh',{url:dev_project+'Confignotconform/confignotconformInprojectQueryList.asp?call='+call+'&SID='+SID+"&"+param});
//	});
//	//重置
//	var reset = currTab.find("#reset");
//	reset.click(function(){
//		form[0].reset();
//		currTab.find("select").select2();
//	});
//	
//	/**		初始化table	**/
//	var queryParams=function(params){
//		var temp={
//				limit: params.limit, //页面大小
//				offset: params.offset //页码
//		};
//		return temp;
//	};
//	var param = form.serialize();
//	var call = getMillisecond();
//	table.bootstrapTable({
//		//请求后台的URL（*）
//		url : dev_project+'Confignotconform/confignotconformInprojectQueryList.asp?call='+call+'&SID='+SID+"&"+param,
//		method : 'get', //请求方式（*）   
//		striped : false, //是否显示行间隔色
//		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
//		sortable : true, //是否启用排序
//		sortOrder : "asc", //排序方式
//		queryParams : queryParams,//传递参数（*）
//		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
//		pagination : true, //是否显示分页（*）
//		pageList : [5,10,15],//每页的记录行数（*）
//		pageNumber : 1, //初始化加载第一页，默认第一页
//		pageSize : 10,//可供选择的每页的行数（*）
//		clickToSelect : true, //是否启用点击选中行
//		uniqueId : "PROJECT_ID", //每一行的唯一标识，一般为主键列
//		cardView : false, //是否显示详细视图
//		detailView : false, //是否显示父子表
//		jsonpCallback:call,
//		singleSelect: true,
//		columns : [{
//			field: 'middle',
//			checkbox: true,
//			rowspan: 2,
//			align: 'center',
//			valign: 'middle',
//		}, {
//			field : "SUMM",
//			title : "标识",
//			align : "center",
//			formatter: function (value, row, index) {
//				if(parseInt(value-row.CLOSE_SUM)>0){
//					return ""+'<div class="text-red">!</div>';
//				}else{
//					return "";
//				}
//			}
//		}, {
//			field : "PROJECT_NUM",
//			title : "项目编号",
//			align : "center",
//		}, {
//			field : "PROJECT_NAME",
//			title : "项目名称",
//			align : "center",
//		}, {
//			field : "PROJECT_TYPE",
//			title : "项目类型",
//			align : "center",
//		}, {
//			field : "PROJECT_MAN_NAME",
//			title : "项目经理",
//			align : "center",
//		}, {
//			field : "SUMM",
//			title : "不符合项个数",
//			align : "center",
//		}, {
//			field : "SUMM",
//			title : "未关闭不符合项个数",
//			align : "center",
//			formatter: function (value, row, index) {
//				return value-row.CLOSE_SUM;
//			}
//		}, {
//			field : "CLOSE_SUM",
//			title : "已关闭不符合项个数",
//			align : "center"
//		}, {
//			field : "STATUS",
//			title : "项目状态",
//			align : "center"
//		}]
//	});
//	
//}
//initPQConfigManageListLayout();