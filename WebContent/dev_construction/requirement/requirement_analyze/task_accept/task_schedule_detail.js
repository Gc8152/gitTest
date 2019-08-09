
var milestone_data=null;
function initTaskScheduleDetailLayout(req_task_id){
	var tableCall =getMillisecond();
	baseAjaxJsonp(dev_project+"myProject/queryonemyproject_milestone.asp?SID="+SID+"&req_task_id="+req_task_id+"&call="+tableCall, null, function(result){
		if(result==null||result==''){
		}else{
			milestone_data=result;	
			initReqTaskScheduleDetailLayout(req_task_id,milestone_data);
		}
	}, tableCall);
};
//初始化任务详情页面
function initReqTaskScheduleDetailLayout(req_task_id,milestone_data){
	baseAjaxJsonp(dev_construction+"req_taskaccept/queryTaskOneById.asp?SID="+SID+"&req_task_id="+req_task_id, null , function(data) {
		 if (data != undefined && data != null && data.result=="true") {
		    for(var k in data){
			var str=data[k];
			k = k.toLowerCase();//大写转换为小写
		    if(k=="req_code"){
				getCurrentPageObj().find('#TDreq_code').text(str);
			}else if(k=="sub_req_code"){
				getCurrentPageObj().find('#TDsub_req_code').text(str);
			}else if(k=="req_id"||k=="req_task_id"||k=="sub_req_id"){
				getCurrentPageObj().find("input[name='TSD."+k+"']").val(str);
			}else if(k=="accept_result"){
				getCurrentPageObj().find("input[name='TSD."+k+"']"+"[value="+str+"]").attr("checked",true);
			}else{
				getCurrentPageObj().find("span[name='TSD."+k+"']").text(str);
			}
		    }
		    }
		 initSitTaskInfo(milestone_data);//加载关联的任务列表
		//initTaskWorkLoadDetail();//加载当前任务的工作量信息列表
	  });
	
}
//查看需求详情
function viewReqDetailTD(){
	var ids=getCurrentPageObj().find('#TDreq_id').val();
	closeAndOpenInnerPageTab("requirement_detail","需求详情","dev_construction/requirement/requirement_input/req_detail.html",function(){
		initReqDetailLayout(ids);
	});
}
//查看需求点详情	
function viewSubReqDetailTD(){
	var ids=getCurrentPageObj().find('#TDreq_id').val();
	closeAndOpenInnerPageTab("subreq_detail","需求点详情","dev_construction/requirement/requirement_analyze/split_subreq/splitSubreq_detail.html",function(){
		initSplitReqDetailLayOut(ids);
		});
}


function initSitTaskInfo(milestone_data){
	/*if(version_id==undefined||version_id==null){
		alert("该任务还未入版！");
	}*/
	var sub_req_id=getCurrentPageObj().find('#TDsub_req_id').val();
	var req_task_id=getCurrentPageObj().find('#TDreq_task_id').val();
	var currTab = getCurrentPageObj();
	var queryParams = function(params) {
		var temp = {
			limit : params.limit, // 页面大小
			offset : params.offset
		// 页码
		};
		return temp;
	};
	var table_click_int2=0;
	var param = {};
	var table = currTab.find("#gReqTaskscheduleTableListunion");
	var tableCall = "report"+getMillisecond();
	table.bootstrapTable("destroy").bootstrapTable({
		//请求后台的URL（*）
		url : dev_construction+"requirement_splitTask/queryTaskVersionInfoBySubReqId.asp?SID="+SID+"&call="+tableCall+"&req_task_id="+req_task_id,
		method : 'get', //请求方式（*）
		striped : false, //是否显示行间隔色
		async:true,
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [10,15],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "SUB_REQ_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		jsonpCallback : tableCall,
		detailView : false, //是否显示父子表
		singleSelect: true,
		onLoadSuccess:function (){
			if(table_click_int2<1){
				$("#gReqTaskscheduleTableListunion thead").prepend('<tr><th colspan="9" data-valign="middle" data-align="center">关联任务</th>'+'<th colspan="8" data-valign="middle" data-align="center">任务进度</th></tr>');
				//getCurrentPageObj().find('#gSystemInfoTable').bootstrapTable('mergeCells',{index:1,field:'SYSTEM_NAME',colspan:2,rowspan:1});
			}
			table_click_int2++;
		},
		columns : [{
			checkbox : true,
			rowspan : 2,
			align : 'center',
			valign : 'middle'
			},{
			field : '序号',
			title : '序号',
			align : "center",
			formatter: function(value, row, index) {
				return index+1;
			}
			},{
				field : 'REQ_TASK_CODE',
				title : '任务编号',
				align : "center"
			},{
				field : 'DEPT_NAME',
				title : '项目组',
				align : "center",
				visible :false 
			},{
				field : "REQ_TASK_NAME",
				title : "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;任务名称 " +
						"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;",
				align : "center"
			},  {
				field : "SUB_REQ_ID_NAME",
				title : "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;子需求名称" +
						"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;",
				align : "center"
			},{
				field : 'REQ_TASK_RELATION_DISPLAY',
				title : '从属关系',
				align : "center"
			},{
				field : 'REQ_TASK_STATE_DISPLAY',
				title : '任务状态',
				align : "center"
			}, {
				field : "SYSTEM_NAME",
				title : "应用名称",
				align : "center"
			},{
				field : "PROJECT_MAN_NAME",
				title : "当前责任人",
				align : "center"
			},{
				field : "ZONGTI_TIME",
				title : '设计开发</br>('+milestone_data.whole_01+')',
				align : "center"
			}, {
				field : "DANYUAN_TIME",
				title : '单元测试</br>('+milestone_data.unit_03+')',
				align : "center"
			}, {
				field : "LIANTIAO_TIME",
				title : '联调测试</br>('+milestone_data.fbi_14+')',
				align : "center"
			}, {
				field : "TIJIAO_SIT_TIME",
				title : '提交SIT测试</br>('+milestone_data.submit_sit_04+')',
				align : "center"
			}, {
				field : "SIT_TIME",
				title : 'SIT测试</br>('+milestone_data.sit_04+')',
				align : "center"
			}, {
				field : "UIT_TIME",
				title : 'UAT测试</br>('+milestone_data.uit_05+')',
				align : "center"
			}, {
				field : "TIJIAO_TOUCHAN_TIME",
				title : '提交投产</br>('+milestone_data.submit_open_15+')',
				align : "center"
			}, {
				field : "TOUCHAN_TIME",
				title : '投产</br>('+milestone_data.open_06+')',
				align : "center"
			}]
	});
}
//查看任务详情
getCurrentPageObj().find("#TaskDetail_schedule_view").click(function(){
	
	  var id = getCurrentPageObj().find('#gReqTaskscheduleTableListunion').bootstrapTable('getSelections');
	  var req_task_id = $.map(id, function (row) {return row.REQ_TASK_ID;});
	  if(id.length==1){
		  	closePageTab("req_schedule_taskDetail");
			closeAndOpenInnerPageTab("req_scheducle_taskDetail","任务详情页面","dev_construction/requirement/requirement_analyze/task_accept/task_schedule_detail.html",function(){
			initTaskScheduleDetailLayout(req_task_id);
		  });
	  }else{
	      alert("请选择一条任务进行查看！");	
	  }
});



/*//初始化关联任务列表
function inittaskUnionList(){
	var sub_req_id=getCurrentPageObj().find('#TDsub_req_id').val();
	var req_task_id=getCurrentPageObj().find('#TDreq_task_id').val();
	var queryParams = function(params) {
		var temp = {
			limit : params.limit, // 页面大小
			offset : params.offset
		// 页码
		};
		return temp;
	};
	var  taskunionliskCall = getMillisecond();
	getCurrentPageObj().find('#gReqTaskscheduleTableListunion').bootstrapTable("destroy").bootstrapTable({
				url :dev_construction+"req_taskaccept/queryAssociationTaskList.asp?SID="+SID+"&sub_req_id="+sub_req_id+"&req_task_id="+req_task_id+"&call="+taskunionliskCall,
				method : 'get', // 请求方式（*）
				striped : false, // 是否显示行间隔色
				cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, // 是否启用排序
				sortOrder : "asc", // 排序方式
				queryParams : queryParams,// 传递参数（*）
				sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
				pagination : true, // 是否显示分页（*）
				pageList : [ 5, 10, 15 ], // 可供选择的每页的行数（*）
				pageNumber : 1, // 初始化加载第一页，默认第一页
				pageSize : 10, // 每页的记录行数（*）
				clickToSelect : true, // 是否启用点击选中行
				// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
				uniqueId : "REQ_TASK_ID", // 每一行的唯一标识，一般为主键列
				cardView : false, // 是否显示详细视图
				detailView : false, // 是否显示父子表
				jsonpCallback:taskunionliskCall,
				singleSelect : true,// 复选框单选
				columns : [{
					checkbox : true,
					rowspan : 2,
					align : 'center',
					valign : 'middle'
				},{
					field : 'REQ_TASK_CODE',
					title : '任务编号',
					align : "center",
				},{
					field : 'REQ_TASK_NAME',
					title : '任务名称',
					align : "center",
				},{
					field : 'SUB_REQ_NAME',
					title : '子需求名称',
					align : "center",
				}, {
					field : 'REQ_TASK_RELATION_DISPLAY',
					title : '从属关系',
					align : "center"
				}, {
					field : "REQ_TASK_STATE_DISPLAY",
					title : "任务状态",
					align : "center"
				}, {
					field : "SYSTEM_NAME",
					title : "实施应用",
					align : "center"
				}, {
					field : "PLAN_ONLINETIME",
					title : "计划投产时间",
					align : "center"
				}, {
					field : "VERSION_NAME",
					title : "申请纳入版本",
					align : "center"
				}]
			});
}*/
