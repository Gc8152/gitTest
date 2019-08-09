
/**
 * 打开考核项列表pop
 */
function openCheckDicPop(id,callparams){
	//先清除
	getCurrentPageObj().find('#myModal_checkdic').remove();
	getCurrentPageObj().find("#"+id).load("dev_outsource/outsource/outpersonTemplate/checkDic_pop.html",{},function(){
		getCurrentPageObj().find("#myModal_checkdic").modal("show");
		var url = dev_outsource+"optDic/queryAllOptDic.asp?SID="+SID;
		checkDicPop("#pop_checkDicTable",url,callparams);
	});
	
}

var queryParams=function(params){
	var temp={
			limit: params.limit, //页面大小
			offset: params.offset //页码
	};
	return temp;
};	

/**
*考核指标POP框
*/
function checkDicPop(optTable,optUrl,optParam){
	
	var columns=[{
					field : 'ID',
					title : '主键',
					align : "center",
					visible: false
				},{
					field : 'DICCODE',
					title : '指标编码',
					align : "center"
				}, {
					field : "ITEMNAME",
					title : "指标名称",
					align : "center"
				}, {
					field : "DETAIL",
					title : "考核得分(分)",
					align : "center"
				}, {
					field : "STATE",
					title : "状态",
					align : "center",
					formatter:function(value,row,index){
						if(value!=null&&value!=undefined&&value!=""){
							if(value=="00"){
								return "启用";
							}else if(value=="01"){
								return "禁用";
							}
						}else{
							return "";
						}
					}
				}];
	//查询所有考核指标POP框
	getCurrentPageObj().find(optTable).bootstrapTable("destroy").bootstrapTable({
				//请求后台的URL（*）
				url : optUrl,
				method : 'get', //请求方式（*）   
				striped : false, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				pagination : true, //是否显示分页（*）
				pageList : [5],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 5,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "ID", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: true,
				onDblClickRow:function(row){//双击行触发事件
						getCurrentPageObj().find('#myModal_checkdic').modal('hide');
						optParam.check_item_one.val(row.ID);
						optParam.check_item_name.val(row.ITEMNAME);
						optParam.one_score.val(row.DETAIL);
					},
				
				columns : columns
			});
		
	
	//POP重置
	getCurrentPageObj().find("#pop_opsReset").click(function(){
		getCurrentPageObj().find("#opsHoliday_popForm input").val("");
		var selects = getCurrentPageObj().find("#opsHoliday_popForm select");
		selects.val(" ");
		selects.select2();
	});
	
	//多条件查询
	getCurrentPageObj().find("#pop_opsSearch").click(function(){
		var leave_startdate = getCurrentPageObj().find("#leave_startdate_pop").val();
		var leave_enddate =  getCurrentPageObj().find("#leave_enddate_pop").val();
		var leave_category =  getCurrentPageObj().find("#leave_category_pop").val();
		getCurrentPageObj().find(optTable).bootstrapTable('refresh',{url:optUrl+"&leave_startdate="+leave_startdate+
			"&leave_enddate="+leave_enddate+"&leave_category="+leave_category});
	});
}
	