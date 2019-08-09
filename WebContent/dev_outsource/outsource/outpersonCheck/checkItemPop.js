var calls = getMillisecond();
function openCheckItemPop(id,item_id,item_name,detail){
	//先清除
	$('#checkItem_pop').remove();
	getCurrentPageObj().find('#'+id).empty();
	getCurrentPageObj().find("#"+id).load("dev_outsource/outsource/outpersonCheck/checkItemPop.html",{},function(){
		getCurrentPageObj().find("#checkItem_pop").modal("show");
		getCurrentPageObj().find("#CIP_item_name").text(item_name);
		getCurrentPageObj().find("#CIP_mark").text(detail);
		var url = dev_outsource+"OptCheck/queryCheckItemDetail.asp?id="+item_id+"&SID="+SID+"&call="+calls;
		poplist(url);
	});
}



/**
 * 列表
 */
function poplist(url){
	getCurrentPageObj().find("#checkItemPopTable").bootstrapTable("destroy").bootstrapTable({
		//请求后台的URL（*）
		url : url,
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
	//	queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : false, //是否显示分页（*）
	//	pageList : [5,10,20],//每页的记录行数（*）
	//	pageNumber : 1, //初始化加载第一页，默认第一页
	//	pageSize : 5,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:calls,
		singleSelect: false,
		columns : [ {
			field : 'abcdef',
			title : '序号',
			align : "center",
			formatter: function (value, row, index) {
    			  return index+1;
        	},
			width:"5%"
		}, {
			field : 'ID',
			title : '考核项id',
			align : 'center',
			visible:false
		}, {
			field : "DETAIL",
			title : "考核明细",
			align : "center"
		}, {
			field : "ITEMNAME",
			title : "分值",
			align : "center"
		}]
	});
}		
