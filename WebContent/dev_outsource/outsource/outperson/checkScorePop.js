function openCheckSocrePop(id,check_id,check_type_name,specialtype_name,check_score){
	//先清除
	$('#checkScore_pop').remove();
	getCurrentPageObj().find('#'+id).empty();
	getCurrentPageObj().find("#"+id).load("resources/outperson/checkScorePop.html",{},function(){
		getCurrentPageObj().find("#checkScore_pop").modal("show");
		getCurrentPageObj().find("#CSP_specialtype_name").text(specialtype_name);
		getCurrentPageObj().find("#CSP_check_type_name").text(check_type_name);
		getCurrentPageObj().find("#CSP_check_score").text(check_score);
		var url = "OptCheck/findAlloptCheckDetail.asp?id="+check_id;
		socrePoplist(url);
	});
}



/**
 * 列表
 */
function socrePoplist(url){
	getCurrentPageObj().find("#checkScorePopTable").bootstrapTable("destroy").bootstrapTable({
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
	//	pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
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
		},{
			field : "ITEMNAME",
			title : "考核项目",
			align : "center",
			width:"30%"
		}, {
			field : "DETAIL",
			title : "考核项分值",
			align : "center",
		}, {
			field : "CHECK_SCORE",
			title : "考核得分",
			align : "center",
			width:"8%"
		},{
			field : "CHECK_MEMO",
			title : "备注",
			align : "center"
		}]
	});
}		
