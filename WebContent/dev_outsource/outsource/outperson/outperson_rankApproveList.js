/**
 * 组装查询url 
 * @returns {String}
 */
var call_rank = getMillisecond();
function queryOutPersonUrl(){
	var url=dev_outsource+'outperson/queryOutPersonRankInfo.asp?call='+call_rank+"&SID="+SID+'&query_type=rank_approve';;
	var fds=getCurrentPageObj().find("input[name^='RE.']");
	for(var i=0;i<fds.length;i++){
		var obj=$(fds[i]);
		if($.trim(obj.val())!=""){
			url+='&'+obj.attr("name").substr(3)+"="+escape(encodeURIComponent($.trim(obj.val())));
		}
	}
	return url;
}
/**
 * 初始化按钮各种事件
 */
(function(){
	initSelect(getCurrentPageObj().find("#purch_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_PURCH_TYPE"});	//人员采购类型
	initSelect(getCurrentPageObj().find("#op_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_STATUS"});	//人员状态
	//职级评定申请
	getCurrentPageObj().find("#rankApprove").unbind("click");
	getCurrentPageObj().find("#rankApprove").click(function(){
		var dt=getCurrentPageObj().find("#outpersonTableInfoRank").bootstrapTable('getSelections');
		if(dt.length!=1){
			alert("请选择一条数据!");
			return;
		}
		var data="";
		var flag="";
		if(dt!=undefined&&dt!=null&&dt!=""){
			data=dt[0].ID;
		}
		if(dt!=undefined&&dt!=null&&dt!=""){
			flag=dt[0].FLAG;
		}
		//审批状态
		var spstate=$.map(dt, function (row) {
			return row.SPSTATE;                    
		});
/*		if(spstate!=undefined&&spstate!=null&&spstate!=""){
			alert("您好，请选择未申请的数据进行操作!");
			return;
		}*/
		closeAndOpenInnerPageTab("outpersonRankAdd","外包人员职级评定","dev_outsource/outsource/outperson/outperson_rankApprove.html",function(){
			initOutPersonRankDetail(dt[0].ID,spstate[0],flag);
			initAFApprovalInfo(dt[0]["INSTANCE_ID"],'1');
		});
	});
	//查询按钮
	getCurrentPageObj().find("#queryOutPersonInfoRank").unbind("click");
	getCurrentPageObj().find("#queryOutPersonInfoRank").click(function(){
		getCurrentPageObj().find("#outpersonTableInfoRank").bootstrapTable("refresh",{url:queryOutPersonUrl()});
	});
	//重置按钮
	getCurrentPageObj().find("#resetOutPersonInfoRank").unbind("click");//重置按钮
	getCurrentPageObj().find("#resetOutPersonInfoRank").click(function(){
		getCurrentPageObj().find("input[name^='RE.']").val("");
	});
})();
var queryParams=function(params){
	var temp={};
	 temp["limit"]=params.limit;
	 temp["offset"]=params.offset;
	return temp;
};
//查询列表显示table
(function() {
	getCurrentPageObj().find("#outpersonTableInfoRank").bootstrapTable({
				url : dev_outsource+'outperson/queryOutPersonRankInfo.asp?call='+call_rank+"&SID="+SID+'&query_type=rank_approve',
				method : 'get', //请求方式（*）   
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				pagination : true, //是否显示分页（*）
				pageList : [5,10,20],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 10,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "ID", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: true,
				jsonpCallback:call_rank,
				onLoadSuccess:function(data){
				},
				columns : [ {
					field: 'middle',
					checkbox: true,
					rowspan: 2,
					align: 'center',
					valign: 'middle'
				},{
					field : 'ID',
					title : '员工id',
					align : 'center',
					visible:false
				},{
					field : 'APPLY_GROUP',
					title : '申请职能组',
					align : "center"
				},{
					field : 'OPT_MANAGER',
					title : '申请人',
					align : "center"
				}, {
					field : "RANK_APPLY_TIME",
					title : "申请时间",
					align : "center"
				}, {
					field : "FlAG",
					title : "申请类别",
					align : "center",
					formatter:function(value,row,index){
						if(row.FLAG=="1"){
							return "职级评定申请";
						}else{
							return "升级申请";
						}
					}
				},  {
					field : "USER_NAME",
					title : "创建人",
					align : "center"
				}, {
					field : "CREATE_TIME",
					title : "创建时间",
					align : "center"
				},{
					field : "",
					title : "是否可升级",
					align : "center",
					visible:false,
					formatter : function(value, row, index){
						
					}
				}, {
					field : "SPSTATE_NAME",
					title : "审批状态",
					align : "center"
				},{
					field : "WORKFLOWBUSSINESSID",
					title : "行内负责人",
					align : "center",
					visible:false
				},{
					field : "FLOWURL",
					title : "流程URL",
					align : "center",
					visible:false
				},{
					field : "FLOWID",
					title : "流程id",
					align : "center",
					visible:false
				}, {
					field : "SPSTATE",
					title : "审批状态",
					align : "center",
					visible:false
				}, {
					field : "CURR_ACTORNO_NAME_ENTER",
					title : "当前审批人",
					align : "center",
					visible:false
				}]
			});
})();