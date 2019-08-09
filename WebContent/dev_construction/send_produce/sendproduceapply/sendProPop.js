/**
 * 获取组装查询url
 * @returns
 */
function getSendProPopUrl() {
	var condition = getCurrentPageObj().find("#pop_sendPro_condition [name]");
	var url = dev_construction+"sendProduceApply/queryAllSendProInfo.asp?SID="+SID+'&pakage_type=01';
	for(var i=0; i<condition.length; i++) {
		var obj = $(condition[i]);
		if($.trim(obj.val()) != ""){
			url+='&'+obj.attr("name").substring(2)+"="+escape(encodeURIComponent(obj.val()));
		}
	}
	return url;
}
/**
 * 打开投产模态框
 * @param id	增加模态框的div的id
 * @param callparams 传给bootstraptable中的参数
 */
function openSendProPop(id,params){
	
	getCurrentPageObj().find('#myModal_sendPro').remove();	
	getCurrentPageObj().find(id).load("dev_construction/send_produce/sendproduceapply/sendProPop.html",{},function(){
		getCurrentPageObj().find("#myModal_sendPro").modal("show");
		initSendProPop(getCurrentPageObj().find("#pop_sendProTable"), getSendProPopUrl(), params);
		//初始化字典项
		autoInitSelect(getCurrentPageObj().find("#pop_sendPro_condition"));
	});
	
}

/**
 * 初始化投产模态框
 */
function initSendProPop(sendProTable,sendPromUrl,sendProParam){
	//分页
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};	
	
	getCurrentPageObj().find(sendProTable).bootstrapTable("destroy").bootstrapTable({
					url : sendPromUrl,
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
					pageSize : 5,//可供选择的每页的行数（*）
					clickToSelect : true, //是否启用点击选中行
					uniqueId : "AUDIT_NO", //每一行的唯一标识，一般为主键列
					cardView : false, //是否显示详细视图
					detailView : false, //是否显示父子表
					singleSelect: true,
					onDblClickRow:function(row){	//双击行事件
						getCurrentPageObj().find('#myModal_sendPro').modal('hide');
						if(sendProParam.id){
							sendProParam.id.val(row.AUDIT_NO);
						}
				},
					onLoadSuccess:function(data){
					},
					columns : [ 
					{
						field : 'AUDIT_NO',
						title : '投产单编号',
						align : 'center'
					},{
						field : 'SYSTEM_NAME',
						title : '应用名称',
						align : "center"
					},{
						field : 'VERSIONS_NAME',
						title : '版本名称',
						align : "center"
					},{
						field : 'CHANGE_TYPE',
						title : '变更类别',
						align : "center",
						visible: false
					},{
						field : "PLAN_DATE",
						title : "计划投产日期",
						align : "center",
					},{
						field : "PAKAGE_TYPE",
						title : "投产包类型",
						align : "center"
					}, {
						field : "IS_INSTANCY",
						title : "是否紧急投产",
						align : "center",
						visible: false
					}, {
						field : "APPLY_PERSON",
						title : "申请人",
						align : "center",
						visible: false
					}, {
						field : "APPROVE_STATUS",
						title : "审批状态",
						align : "center",
						visible: false
					},{
						field : "APPROVE_STATUS_NAME",
						title : "审批状态",
						align : "center",
						visible: false
					},{
						field : "APPROVE_PERSON",
						title : "审批人",
						align : "center",
						visible: false
					}, {
						field : "ROOT_STATUS",
						title : "提交状态",
						align : "center",
						visible: false
					}, {
						field : "DATA_ROOT_STATUS",
						title : "工单状态",
						align : "center",
						visible: false	
					} ]
			});
	//投产POP重置
	getCurrentPageObj().find("#pop_sendProReset").click(function(){
		getCurrentPageObj().find("#pop_sendPro_condition input").val("");
		var selects = getCurrentPageObj().find("#pop_sendPro_condition select");
		selects.val(" ");
		selects.select2();
	});
	//多条件查询投产
	getCurrentPageObj().find("#pop_sendProSearch").click(function(){
		getCurrentPageObj().find(sendProTable).bootstrapTable('refresh',{url:getSendProPopUrl()});
	});
	enterEventRegister("popModelQueryLevel1", function(){getCurrentPageObj().find("#pop_sendProSearch").click();});
}
