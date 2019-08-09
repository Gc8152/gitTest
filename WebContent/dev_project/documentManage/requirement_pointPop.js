var tableCall = getMillisecond();

initDocmSearchRemand();
//初始化页面按钮事件
function initDocmSearchRemand(){
	//查询按钮事件
	getCurrentPageObj().find("#docm_select_demand").click(function(){
		var SUB_REQ_CODE = getCurrentPageObj().find("input[name=SUB_REQ_CODE]").val();
		var SUB_REQ_NAME = getCurrentPageObj().find("input[name=SUB_REQ_NAME]").val();
		var project_id = getCurrentPageObj().find("input[name=project_id]").val();
		getCurrentPageObj().find("#docm_table_demandInfo").bootstrapTable(
				'refresh',
				{
					url : dev_project
							+ 'docmanage/queryDocmReqList.asp?call='
							+ tableCall + '&SID=' + SID
							+ "&sub_req_code=" + SUB_REQ_CODE
							+ "&sub_req_name=" + SUB_REQ_NAME+"&project_id="+project_id
				});
	});
	
	//重置按钮事件
        $("#docm_reset_demand").click(function(){
        getCurrentPageObj().find("input[name=SUB_REQ_CODE]").val("");
    	getCurrentPageObj().find("input[name=SUB_REQ_NAME]").val("");
	});
}
//加载项目pop
function openRemandPop(id, callparams,project_id) {
	getCurrentPageObj().find("#" + id).load("dev_project/documentManage/requirement_pointPop.html", {},
			function() {
				initRemandTab(callparams,project_id);
				$("#requirement_PointPop").modal("show");
				
			});
}

//初始化表格
function initRemandTab(callparams,project_id){
	
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	getCurrentPageObj().find("#docm_table_demandInfo").bootstrapTable({
		//请求后台的URL（*）
		url:dev_project + 'docmanage/queryDocmReqList.asp?call='+tableCall+'&SID='+SID+'&project_id='+project_id,
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
		pageSize : 5,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "REQ_TASK_CODE", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:tableCall,
		singleSelect: true,
		onDblClickRow:function(row){
		for ( var item in callparams) {
			var itemValue = "";
			if(item == "doc_sub_req_code"){
				itemValue = row.SUB_REQ_CODE;
			}else if(item == "doc_sub_req_name"){
				itemValue = row.SUB_REQ_NAME;
			}
			else if(item == "doc_sub_req_id"){
				itemValue = row.SUB_REQ_ID;
			}
			else if(item == "doc_req_task_id"){
				itemValue = row.REQ_TASK_ID;
			}
			else if(item == "doc_req_task_code"){
				itemValue = row.REQ_TASK_CODE;
			}
			else if(item == "doc_system_name"){
				itemValue = row.SYSTEM_NAME;
			}
		    else if(item == "doc_req_name"){
				itemValue = row.REQ_NAME;
			}
		    else if(item == "doc_req_code"){
				itemValue = row.REQ_CODE;
			}
			callparams[item].val(itemValue);
		}
		/*initSelect(getCurrentPageObj().find("select[name='doc_task_state']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQTASK_STATE"},row.REQ_TASK_STATE,null,["00","01","02","13","14","15"]);*/
		$("#requirement_PointPop").modal("hide");
		},
		columns : [ {
			field : 'REQ_TASK_ID',
			title : '任务序列号',
			align : "center",
			visible:false,
		},{
			field : 'SUB_REQ_CODE',
			title : '需求点编号',
			align : "center",
			width : 155,
		},{
			field : 'REQ_ID',
			title : '需求序列号',
			align : "center",
			visible:false,
		},{
			field : 'REQ_TASK_CODE',
			title : '任务编号',
			align : "center",
			width : 200,
			visible:false,
		}, {
			field : 'REQ_TASK_NAME',
			title : '任务名称',
			align : "center",
			width : 200,
			visible:false,
		}, {
			field : "SUB_REQ_NAME",
			title : "需求点名称",
			align : "center",
			width : 170,
		}, {
			field : "REQ_TASK_RELATION_NAME",
			title : "从属关系",
			align : "center",
			width : 80,
			visible:false,
		}, {
			field : "SYSTEM_NAME",
			title : "主办应用",
			align : "center",
			width : 120,
		}, {
			field : "SYSTEMS2",
			title : "协办应用",
			align : "center",
			width : 280,
			formatter:function(value,row,index){
				if(value=="" || value == undefined || value==null){
					return "-"
				}else{
					 return value.substring(1,value.length-1);
				}
			 },
		}, {
			field : "REQ_TASK_STATE_DISPLAY",
			title : "主办任务状态",
			align : "center",
			width : 120,
		}, {
			field : "JOIN_NOACCEPT",
			title : "协办未受理数",
			align : "center",
			width : 120,
		},{
			field : "REQ_TASK_TYPE_DISPLAY",
			title : "任务类型",
			align : "center",
			width : 75,
			visible:false,
		},{
			field : "SYSTEM_NAME",
			title : "应用名称",
			align : "center",
			width : 120,
			visible:false,
		},{
			field :"ANALYZE_NAME",
			title :"评审状态",
			align :"center",
			width : 130,
			formatter:function(value,row,index){
				 if(value=="" || value == undefined || value==null) 
					 return "未评审";
				 else
					 return value;
			 },
		},{
			field : "PHASED_STATE",
			title : "文件上传状态",
			align : "center",
			width : 102,
			formatter:function(value,row,index){if(value=="" || value==undefined || value==null){return "未上传";}return "已上传";}
		},{
			field : "P_OWNER_NAME",
			title : "当前责任人",
			align : "center",
			width : 90,
		},{
			field : "PLAN_ONLINETIME",
			title : "计划投产时间",
			align : "center",
			width : 110,
		},{
			field : "CREATE_TIME",
			title : "创建时间",
			align : "center",
			width : 110,
		},{
			field : "P_OWNER",
			title : "当前责任人",
			align : "center",
			visible:false,
		},{
			field : "REQ_TASK_STATE",
			title : "需求任务状态",
			align : "center",
			visible:false,
		}]
	});
}
