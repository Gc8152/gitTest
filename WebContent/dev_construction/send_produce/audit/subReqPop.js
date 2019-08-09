/**
 * 获取组装查询url
 * @returns
 */
var subTableCall=getMillisecond()+"3";	
var form = getCurrentPageObj().find("#pop_supVer_condition");//表单对象
function getSubReqPopUrl(version_id) {
	var url = dev_construction+'reqSubAudit/querySubReqList.asp?SID='+SID+'&call='+subTableCall+'&version_id='+version_id;
	var condition = getCurrentPageObj().find("#pop_supVer_condition [name]");//表单对象
		for(var i=0; i<condition.length; i++) {
			var obj = $(condition[i]);
			if($.trim(obj.val()) != ""){
				url+='&'+obj.attr("name")+"="+escape(encodeURIComponent(obj.val()));
			}
		}
	return url;
}
/**
 * 打开版本需求模态框
 * @param id
 * @param callparams
 */
function openSubReqPop(id,param){ 
	getCurrentPageObj().find('#myModal_taskProblem').remove();	
	getCurrentPageObj().find('#'+id).load("dev_construction/send_produce/audit/subReqPop.html",{},function(){
		getCurrentPageObj().find("#myModal_taskProblem").modal("show");
		initTaskProblemPop(getCurrentPageObj().find("#pop_subReqTable"), getSubReqPopUrl(param.version_id),param);
	});	
}
/**
 * 初始化问题任务模态框
 */
function initTaskProblemPop(subReqTable,subReqUrl,param){
	
	//年度版本计划列表显示
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	getCurrentPageObj().find(subReqTable).bootstrapTable("destroy").bootstrapTable({
		//请求后台的URL（*）
		url : subReqUrl,
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [5,10,15],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "DRAFT_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: false,
		jsonpCallback:subTableCall,
		onLoadSuccess:function(data){
			gaveInfo();	
			
		},
		columns : [ {
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		},  {
			field : 'SUB_REQ_CODE',
			title : '需求点编号',
			align : "center",
			width : "120px"
		}, {
			field : "SUB_REQ_NAME",
			title : "需求点名称",
			align : "center",
			width : "120px"
		}, {
			field : "TASK_STATE_NAME",
			title : "主线任务状态",
			align : "center",
			width : "150px"
		}, {
			field : "SYSTEM_NAME",
			title : "应用名称",
			align : "center",
			width : "100px"
		}, {
			field : "PROJECT_MAN_NAME",
			title : "应用负责人",
			align : "center",
			width : "100px"
		}, {
			field : "TASK_COUNT",
			title : "涉及任务数",
			align : "center",
			width : "100px"
		}/*,{
			field : "SEND_COUNT",
			title : "涉及投产单数",
			align : "center",
			width : "100px"
		},{
			field : "NO_SEND_COUNT",
			title : "投产单审计不通过数",
			align : "center",
			width : "100px",
			visible : false
		}*/]
	});
	
	//模态框中确认选择按钮
	getCurrentPageObj().find("#taskProblemPOPSureSelected").click(function() {
		getCurrentPageObj().find('#myModal_taskProblem').modal('hide');
		var selections = getCurrentPageObj().find(subReqTable).bootstrapTable('getSelections');
		if(selections.length == 0) {
			alert("请至少选择一条数据进行操作!");
			return;
		}
		//获取原投产表中的数据
		var sendData_old = getCurrentPageObj().find("#table_subReq").bootstrapTable('getData');
	
		//如果选中的没有重复，则拼到投产内容表中
		$.each(selections, function(i, item) {
			var isExist = false;
			$.each(sendData_old, function(i, item2) {
				if(item.REQ_TASK_ID == item2.REQ_TASK_ID) {
					isExist = true;
				}
			});
			if(!isExist) {
				getCurrentPageObj().find("#table_subReq").bootstrapTable("append",item);
			}
		});
		//拼接后，获取投产表中的所有数据
		var sendData_new = getCurrentPageObj().find("#table_subReq").bootstrapTable('getData');
		
	});
	
	
	//应用POP重置
	getCurrentPageObj().find("#pop_supVerSendReset").click(function(){
		getCurrentPageObj().find("#pop_supVer_condition input").val("");
		var selects = getCurrentPageObj().find("#pop_supVer_condition select");
		selects.val(" ");
		selects.select2();
	});
	//多条件查询应用
	getCurrentPageObj().find("#pop_supVerSendSearch").click(function(){
		getCurrentPageObj().find(subReqTable).bootstrapTable('refresh',{url:getSubReqPopUrl(param.version_id)});
	});
	enterEventRegister("popModelQueryLevel1", function(){getCurrentPageObj().find("#pop_supVerSendSearch").click();});
}
