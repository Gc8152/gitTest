initTaskAnalyListBtn();
var person_id = $("#currentLoginNo").val();

//初始化按钮
function initTaskAnalyListBtn() {
	autoInitSelect(getCurrentPageObj());
	var mytaskCall = getMillisecond();
	initFollowerTaskQuery(mytaskCall);
	// 查询
	getCurrentPageObj().find("#serach_myTask_Query").click(function() {
		var curTab=getCurrentPageObj();
		var req_task_code =  curTab.find('#req_task_code').val();
		var req_task_name = curTab.find('#req_task_name').val();
		var version_name = curTab.find('#version_name').val();
		var req_task_state = curTab.find('#req_task_state').val();
		if(req_task_state==" "){
			req_task_state="";
		}
		var req_task_relation = curTab.find('#req_task_relation').val();
		if(req_task_relation==" "){
			req_task_relation="";
		}
		var system_name = curTab.find('#system_name').val();
		getCurrentPageObj().find('#g_myTaskTable').bootstrapTable('refresh',{
			url:dev_construction+"GFollowerTask/queryTaskList.asp?SID="+SID+'&call='+mytaskCall
			+'&req_task_name='+escape(encodeURIComponent(req_task_name))
			+'&req_task_code='+req_task_code
			+'&version_name='+escape(encodeURIComponent(version_name))
			+'&req_task_relation='+req_task_relation
			+'&req_task_state='+req_task_state
			+'&system_name='+escape(encodeURIComponent(system_name))
		});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#serach_myTask_Query").click();});

	//重置
	getCurrentPageObj().find('#reset_myTask_Query').click(function() {
		  getCurrentPageObj().find("#myTask_Query input").val("");
			var selects = getCurrentPageObj().find("#myTask_Query select");
			selects.val(" ");
			selects.select2();
	});
	
	//查看详情
	getCurrentPageObj().find('#tosee_taskDetail').click(function() {
		var id = getCurrentPageObj().find("#g_myTaskTable").bootstrapTable('getSelections');
		var req_task_id=$.map(id, function (row) {return row.REQ_TASK_ID;});
		if(id.length==1){
			closePageTab("req_taskDet");
			closeAndOpenInnerPageTab("req_taskDet","任务详情页面","dev_construction/requirement/reqTask_follower/myTask_info.html",function(){
			  baseAjaxJsonp(dev_construction+"req_taskaccept/queryTaskOneById.asp?SID="+SID+"&req_task_id="+req_task_id, null , function(data) {
				 if (data != undefined && data != null && data.result=="true") {
				    for(var k in data){
						var str=data[k];
						k = k.toLowerCase();//大写转换为小写
					    if(k=="req_code"){
							getCurrentPageObj().find('#TDreq_code').text(str);
						}else if(k=="sub_req_code"){
							getCurrentPageObj().find('#TDsub_req_code').text(str);
						}else if(k=="req_id"||k=="req_task_id"||k=="sub_req_id" ||k=="req_task_relation" || k=="version_id" ){
							getCurrentPageObj().find("input[name='TD."+k+"']").val(str);
						}else if(k=="system_no"){
							getCurrentPageObj().find("#TDsystem_no").val(str);
						}else if(k=="is_cc"){
							if(str=="01"){
								getCurrentPageObj().find("#streamInfo").hide();
								getCurrentPageObj().find("#streamIn").hide();
								getCurrentPageObj().find("#getLonger").prop("colspan",4);
								
							}
						}else{
							getCurrentPageObj().find("span[name='TD."+k+"']").text(str);
						}
			    	}
				    viewDetailPop(getCurrentPageObj().find("input[name='TD.req_task_id']").val());
			 	}
			  });
		  });
		}else{
			
	        alert("请选择一条任务进行查看！");
		}
	});	
}


//初始化列表
function initFollowerTaskQuery(mytaskCall) {
	var queryParams = function(params) {
		var temp = {
			limit : params.limit, // 页面大小
			offset : params.offset ,// 页码
			type :'01'
		};
		return temp;
	};
	getCurrentPageObj().find('#g_myTaskTable').bootstrapTable("destroy").bootstrapTable({
		url :dev_construction+"GFollowerTask/queryTaskList.asp?SID="+SID+'&call='+mytaskCall,
		method : 'get', // 请求方式（*）
		striped : false, // 是否显示行间隔色
		cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, // 是否启用排序
		sorrder : "asc", // 排序方式
		queryParams : queryParams,// 传递参数（*）
		sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
		pagination : true, // 是否显示分页（*）
		pageList : [ 5, 10, 15 ], // 可供选择的每页的行数（*）
		pageNumber : 1, // 初始化加载第一页，默认第一页
		pageSize : 10, // 每页的记录行数（*）
		clickSelect : true, // 是否启用点击选中行
		// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
		uniqueId : "REQ_TASK_CODE", // 每一行的唯一标识，一般为主键列
		cardView : false, // 是否显示详细视图
		clickToSelect : true, //是否启用点击选中行
		detailView : false, // 是否显示父子表
		singleSelect : true,// 复选框单选
		jsonpCallback : mytaskCall,
		onLoadSuccess:function(data){
			gaveInfo();
		},
		columns : [ {
			checkbox : true,
			rowspan : 2,
			align : 'center',
			valign : 'middle'
		},{
			field : 'REQ_TASK_ID',
			title : '任务序列号',
			align : "center",
			visible:false,
		},{
			field : 'SUB_REQ_ID',
			title : '需求点序列号',
			align : "center",
			visible:false,
		},{
			field : 'REQ_ID',
			title : '需求序列号',
			align : "center",
			visible:false,
		},{
			field : 'REQ_TASK_CODE',
			title : '任务编号',
			align : "center",
			width : 150,
		}, {
			field : 'REQ_TASK_NAME',
			title : '任务名称',
			align : "center",
			width : 210,
			/*formatter:function(value,row,index){return '<a style="color:blue" href="javascript:void(0)" onclick="openReqTaskDetail(\''+row.REQ_TASK_ID+'\')";>'+value+'</a>';}*/
		}, {
			field : "SYSTEM_NO",
			title : "应用ID",
			align : "center",
			visible:false,
		}, {
			field : 'SYSTEM_NAME',
			title : '应用名称',
			align : "center",
			width : 130,
			/*formatter:function(value,row,index){return '<a style="color:blue" href="javascript:void(0)" onclick="openSystemDetail(\''+row.SYSTEM_NO+'\')";>'+value+'</a>';}*/
		
		},{
			field : "REQ_TASK_RELATION_NAME",
			title : "从属挂系",
			align : "center",
			width : 90,
		}/*,{
			field : "SUB_REQ_NAME",
			title : "需求点名称",
			align : "center",
			width : 200,
			formatter:function(value,row,index){return '<a style="color:blue" href="javascript:void(0)" onclick="openSubReqDetail(\''+row.SUB_REQ_ID+'\')";>'+value+'</a>';}
		}*/, {
			field : "VERSION_ID",
			title : "版本ID",
			align : "center",
			visible:false,
		},{
			field : "VERSION_NAME",
			title : "申请纳入版本",
			align : "center",
			width : 170,
			/*formatter:function(value,row,index){return '<a style="color:blue" href="javascript:void(0)" onclick="openVersionDetail(\''+row.VERSION_ID+'\')";>'+value+'</a>';}*/
		
		},{
			field : 'TASK_ACCEPT_TIME',
			title : '受理时间',
			align : "center",
			width : 130,
			/*formatter:function(value,row,index){return '<a style="color:blue" href="javascript:void(0)" onclick="openReqTaskDetail(\''+row.REQ_TASK_ID+'\')";>'+value+'</a>';}*/
		},{
			field : "REQ_TASK_STATE_DISPLAY",
			title : "任务状态",
			align : "center",
			width : 105,
			formatter:function(value,row,index){if(value!=0){return '<span  style="font-weight:bold;text-align: center; width: 110px; ";>'+row.REQ_TASK_STATE_DISPLAY+'</span>';}}
		
		}]
	});
}


