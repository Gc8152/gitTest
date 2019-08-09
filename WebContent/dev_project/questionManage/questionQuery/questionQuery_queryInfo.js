

function initQuestionQueryOperateLogList(risk_id){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	 var quesstionQueryLogCall = getMillisecond()+1;
	getCurrentPageObj().find("#qQInfoOperateLogTable").bootstrapTable("destroy").bootstrapTable({
		//请求后台的URL（*）
		url : dev_project+"QuestionQuery/queryInfoOperateLog.asp?SID="+SID+"&call="+quesstionQueryLogCall+"&risk_id="+risk_id,
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
		uniqueId : "RISK_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		jsonpCallback : quesstionQueryLogCall,
		detailView : false, //是否显示父子表
		singleSelect: true,
		onLoadSuccess:function(data){
			gaveInfo();
		},
		columns : [ /*{
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		},{
			field : 'aa',
			title : '序号',
			align : "center",
			formatter : function(value, row, index){
				return index+1;
			}
		},*/
		{
			field : "OPERATE_USER_NAME",
			title : "操作人",
			align : "center"
		},
		{
			field : "OPERATE_STATUS",
			title : "操作",
			align : "center"
		},{
			field : "OPERATE_TIME",
			title : "操作时间",
			align : "center"
		},  {
			field : "DESCR",
			title : "备注",
			align : "center"
		}]
	});
}
function initQuestionQueryHandleLogList(risk_id){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	 var questionHandleLogCall = getMillisecond()+1;
	getCurrentPageObj().find("#qQInfoHandleLogTable").bootstrapTable("destroy").bootstrapTable({
		//请求后台的URL（*）
		url : dev_project+"QuestionHandle/queryHandleHandleLog.asp?SID="+SID+"&call="+questionHandleLogCall+"&risk_id="+risk_id,
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
		uniqueId : "RISK_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		jsonpCallback : questionHandleLogCall,
		detailView : false, //是否显示父子表
		singleSelect: true,
		onLoadSuccess:function(data){
			gaveInfo();
		},
		columns : [ /*{
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		},{
			field : 'aa',
			title : '序号',
			align : "center",
			formatter : function(value, row, index){
				return index+1;
			}
		},*/
		{
			field : "OPERATE_USER_NAME",
			title : "操作人",
			align : "center"
		},
		{
			field : "OPERATE_STATUS",
			title : "操作",
			align : "center"
		},{
			field : "OPERATE_TIME",
			title : "操作时间",
			align : "center"
		},  {
			field : "DESCR",
			title : "备注",
			align : "center"
		}]
	});
}
/****************************初始化页面信息**********************************/	
//初始化申请信息
function initQueryInfo(item){
	for(var k in item){
		k1 = k.toLowerCase();
		 if((k1=="risk_grade")&&(item[k]!="01")){
	    	   getCurrentPageObj().find("#qQq_info_project_tr").hide();
	       }
       getCurrentPageObj().find("[name='QQ."+ k1 +"']").text(item[k]);
	}
	
}