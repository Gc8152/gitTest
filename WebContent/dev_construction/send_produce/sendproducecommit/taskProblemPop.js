/**
 * 获取组装查询url
 * @returns
 */
function getTaskProblemPopUrl() {
	var condition = getCurrentPageObj().find("#pop_taskProblem_condition [name]");
	var url = dev_construction+'sendProduceApply/queryTaskBySysOrVerPop.asp?SID='+SID;
	for(var i=0; i<condition.length; i++) {
		var obj = $(condition[i]);
		if($.trim(obj.val()) != ""){
			url+='&'+obj.attr("name").substring(2)+"="+escape(encodeURIComponent(obj.val()));
		}
	}
	return url;
}
/**
 * 打开问题任务模态框
 * @param id
 * @param callparams
 */
function openTaskProblemPop(id,param){
	getCurrentPageObj().find('#myModal_taskProblem').remove();	
	getCurrentPageObj().find(id).load("dev_construction/send_produce/sendproduceapply/taskProblemPop.html",{},function(){
		getCurrentPageObj().find("#myModal_taskProblem").modal("show");
		initTaskProblemPop(getCurrentPageObj().find("#pop_taskProblemTable"), getTaskProblemPopUrl(),param);
		//初始化字典项
		autoInitSelect(getCurrentPageObj().find("#pop_taskProblem_condition"));
	});	
}
/**
 * 初始化问题任务模态框
 */
function initTaskProblemPop(taskProblemTable,taskProblemUrl,sysAndVerParam){
	//分页
	var queryParams=function(params){
		var temp = sysAndVerParam;
		temp["limit"] = params.limit;
		temp["offset"] = params.offset;
		return temp;
	};	
	//
	getCurrentPageObj().find(taskProblemTable).bootstrapTable("destroy").bootstrapTable({
					url : taskProblemUrl,
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
					uniqueId : "REQ_TASK_ID", //每一行的唯一标识，一般为主键列
					cardView : false, //是否显示详细视图
					detailView : false, //是否显示父子表
					singleSelect: false,
					onDblClickRow:function(row){	//双击行事件
					},
					onLoadSuccess:function(data){
						autoInitSelect(getCurrentPageObj().find("#pop_taskProblemTable"));
						gaveInfo();
					},
					columns : [ {
						field: 'middle',
						checkbox: true,
						rowspan: 2,
						align: 'center',
						valign: 'middle'
					},{
						field: 'REQ_TASK_ID',
						title : '任务ID',
						align : "center",
						visible: false
					},{
						field : 'REQ_TASK_CODE',
						title : '任务编号',
						align : 'center'
					},{
						field : 'REQ_TASK_NAME',
						title : '任务名称',
						align : "center"
					},{
						field : 'REQ_TASK_TYPE',
						title : '任务类型',
						align : "center",
						formatter:function(value, row, index) {
							if(value == "01") {
								return "需求";
							} else if(value == "02") {
								return "问题单";
							}
							return "元数据";
						}
					},{
						field : 'REQ_TASK_RELATION',
						title : '从属关系',
						align : "center",
						formatter: function(value, row, index) {
							if(value=='01') {
								return "主办";
							}
							return "协办";
						}
					},{
						field : "PRJ_SEND_TYPE",
						title : "投产类型",
						align : "center",
						width: 100,
						visible: false,
						formatter:function(value, row, index) {
							var str = '<select style="width:160px;margin:2px;" id="prj_send_type"'+index+
									  ' diccode="G_DIC_PRJ_SEND_TYPE"></select>';
							return str;
						}
					}, {
						field : "IS_MEET_DEMAND",
						title : "是否满足投产要求",
						align : "center",
						visible: false,
						formatter: function(value, row, index) {
							if(row.RESULT_UAT == '00' && row.RESULT_SIT == '00') {
								return "是";
							} else {
								return "否";
							}
						}
					}, {
						field : "TOTAL",
						title : "涉及任务数",
						align : "center",
					}, {
						field : "PUTIN_START",
						title : "发起投产个数",
						align : "center",
					}, {
						field : "PUTIN",
						title : "完成投产审批个数",
						align : "center",
					} ]
			});
	
	//模态框中确认选择按钮
	getCurrentPageObj().find("#taskProblemPOPSureSelected").click(function() {
		getCurrentPageObj().find('#myModal_taskProblem').modal('hide');
		var selections = getCurrentPageObj().find(taskProblemTable).bootstrapTable('getSelections');
		if(selections.length == 0) {
			alert("请至少选择一条数据进行操作!");
			return;
		}
		//获取原投产表中的数据
		var sendData_old = getCurrentPageObj().find("#sendProContent").bootstrapTable('getData');
		//取原投产表中每条记录的投产类型的值
		$.each(sendData_old, function(i) {
			sendData_old[i].PRJ_SEND_TYPE = getCurrentPageObj().find("#prj_send_type"+i).val();
		});
		//如果选中的没有重复，则拼到投产内容表中
		$.each(selections, function(i, item) {
			var isExist = false;
			$.each(sendData_old, function(i, item2) {
				if(item.REQ_TASK_ID == item2.REQ_TASK_ID) {
					isExist = true;
				}
			});
			if(!isExist) {
				getCurrentPageObj().find("#sendProContent").bootstrapTable("append",item);
			}
		});
		//拼接后，获取投产表中的所有数据
		var sendData_new = getCurrentPageObj().find("#sendProContent").bootstrapTable('getData');
		//初始化
		for(var i=0; i<sendData_new.length; i++) {
			initSelect(getCurrentPageObj().find("#prj_send_type"+i),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_PRJ_SEND_TYPE"});
		}
		//旧的行，把原来的放进去
		for(var i=0; i<sendData_old.length; i++) {
			initSelect(getCurrentPageObj().find("#prj_send_type"+i),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_PRJ_SEND_TYPE"},sendData_old[i].PRJ_SEND_TYPE);
		}
	});
	
	
	//应用POP重置
	getCurrentPageObj().find("#pop_taskProblemReset").click(function(){
		getCurrentPageObj().find("#pop_taskProblem_condition input").val("");
		var selects = getCurrentPageObj().find("#pop_taskProblem_condition select");
		selects.val(" ");
		selects.select2();
	});
	//多条件查询应用
	getCurrentPageObj().find("#pop_taskProblemSearch").click(function(){
		getCurrentPageObj().find(taskProblemTable).bootstrapTable('refresh',{url:getTaskProblemPopUrl()});
	});
	enterEventRegister("popModelQueryLevel1", function(){getCurrentPageObj().find("#pop_taskProblemSearch").click();});
}
