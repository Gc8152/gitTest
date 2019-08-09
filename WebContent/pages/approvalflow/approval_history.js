/**
 * 初始化历史审批记录数据
 */
function initHistoryTable(instance_id,id){
	$('#historyPop').remove();
	getCurrentPageObj().find('#'+id).empty();
	getCurrentPageObj().find("#"+id).load("pages/approvalflow/approval_history.html",{},function(){
		getCurrentPageObj().find("#historyPop").modal("show");
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset //页码
			};
			return temp;
		};
		$('#table_history').bootstrapTable("destroy").bootstrapTable({
			url :'AFLaunch/queryApprHistoryRecord.asp?instance_id='+instance_id,
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
			uniqueId : "af_id", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			detailView : false, //是否显示父子表
			singleSelect: true,
			onLoadSuccess:function (){
				setRowspan2("table_history");
			},
			columns : [
				{field: 'N_NAME',title: '审批岗位',valign: "middle"}, 
				{field: 'APP_PERSON',title: '工号',visible:false}, 
				{field: 'APP_PERSON_NAME',title: '审批人'},
				{field: 'AF_NAME',title: '审批流程'},
				{field: 'STATE_NAME',title: '操作'}, 
				{field: 'APP_CONTENT',title: '审批意见'},
				{field: 'OPT_TIME',title: '审批时间'},
				{field: 'N_ID',title: 'N_ID',visible:false}
			]
		});
	});
}
//合并单元格
function setRowspan2(id){
	var tabledata=$('#'+id).bootstrapTable('getData');
	var n_name = tabledata[0].N_NAME;
	var j=0;
	var k=1;
	for(var i=1;i<tabledata.length;i++){
		if(n_name!=tabledata[i].N_NAME){
			$('#'+id).bootstrapTable('mergeCells',{index:j,field:'N_NAME',colspan:1,rowspan:k});
			j=i;
			k=1;
			n_name=tabledata[i].N_NAME;
		}else{
			k++;
		}
	}
	$('#'+id).bootstrapTable('mergeCells',{index:j,field:'N_NAME',colspan:1,rowspan:k});
}
/**
 * 关闭历史审批记录模态框
 */
function doCloseHistoryPop(){
	$("#historyPop").modal("hide");
}