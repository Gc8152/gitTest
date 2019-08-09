
function openChangeTaskPop(id,callparams){

	getCurrentPageObj().find('#myModal_task').remove();
	
	var system_id = callparams.system_id.val();
	var state_type = callparams.state_type;
	var versions_id = callparams.versions_id;
	getCurrentPageObj().find("#"+id).load("dev_project/proReqChange/taskPop.html",{},function(){
		getCurrentPageObj().find("#myModal_task").modal("show");
		//autoInitSelect(getCurrentPageObj().find("#pop_taskState"));
		var taskCall = getMillisecond();
		taskChangePop("#pop_taskTable",dev_project+'PChangeReq/queryTaskChangeList.asp?SID='+SID+'&system_id='+system_id+'&state_type='+state_type+'&versions_id='+versions_id,callparams);
	});
}

/**
	 * 主办任务POP框
	 */
	function taskChangePop(taskTable,taskUrl,taskParam){
		//查询主办任务POP框
		getCurrentPageObj().find(taskTable).bootstrapTable({
					//请求后台的URL（*）
					url : taskUrl,
					method : 'get', //请求方式（*）   
					striped : false, //是否显示行间隔色
					cache : true, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
					sortable : true, //是否启用排序
					sortOrder : "asc", //排序方式
					queryParams : queryParams,//传递参数（*）
					sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
					pagination : true, //是否显示分页（*）
					pageList : [5,10,15],//每页的记录行数（*）
					pageNumber : 1, //初始化加载第一页，默认第一页
					pageSize : 5,//可供选择的每页的行数（*）
					clickToSelect : true, //是否启用点击选中行
					uniqueId : "REQ_TASK_ID", //每一行的唯一标识，一般为主键列
					cardView : false, //是否显示详细视图
					detailView : false, //是否显示父子表
					singleSelect: false,
					
					columns :[
						{	
							//radio:true,
							checkbox:true,
							rowspan: 2,
							align: 'center',
							valign: 'middle'
						},{
							field: 'REQ_TASK_CODE',
				          	title: '任务编码',
				            align:"center"
				        }, {
							field: 'REQ_TASK_NAME',
							title: '任务名称',
							align:"center"
				        }, {
				        	field:"REQ_TASK_RELATION_NAME",
				        	title:"从属关系",
				            align:"center"
				        }, {
				        	field:"SYSTEM_NAME",
				        	title:"所属应用",
				            align:"center"
				        },{
				        	field:"SUB_REQ_CODE",
				        	title:"子需求编码",
				            align:"center"
				        },{
				        	field:"TEST_MAN_ID",
				        	title:"测试经理",
				            align:"center",
							visible:false
				        }]
				});
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset, //页码
			};
			return temp;
		};		
		
		//模态框中确认选择按钮
		getCurrentPageObj().find("#pop_taskSave").click(function() {
			getCurrentPageObj().find("#myModal_task").modal("hide");
			var selections = getCurrentPageObj().find(taskTable).bootstrapTable('getSelections');
			if(selections.length == 0) {
				alert("请至少选择一条数据进行操作!");
				return;
			}
			var sub_ids = $.map(selections, function (row) {return row.SUB_REQ_ID;});	
			var test_man_id= $.map(selections, function (row) {return row.TEST_MAN_ID;});	
			getCurrentPageObj().find("#test_man_id").val(test_man_id);
			var changeCall = getMillisecond();
	        var params = {};	//遍历当前页面的input,text,select
	        params['sub_req_id'] = sub_ids.toString();
	        
	        params['state_type'] = taskParam.state_type;
			
			//获取原变更任务中的数据
			var sendData_old = getCurrentPageObj().find("#tableChaneTaskInfo").bootstrapTable('getData');
			/*//取原投产表中每条记录的投产类型的值
			$.each(sendData_old, function(i) {
				sendData_old[i].PRJ_SEND_TYPE = getCurrentPageObj().find("#prj_send_type"+i).val();
			});*/
			//如果选中的没有重复，则拼到变更任务内容表中（查询的是当前选中的主办任务的需求点下的所有任务）
			baseAjaxJsonp(dev_project+'PChangeReq/querySubTaskList.asp?call='+changeCall+'&SID='+SID,params, function(data) {
				var taskList = data.taskList;
				//$.each(selections, function(i, item) {
				$.each(taskList, function(i, item) {
					var isExist = false;
					$.each(sendData_old, function(i, item2) {
						if(item.REQ_TASK_ID == item2.REQ_TASK_ID) {
							isExist = true;
						}
					});
					if(!isExist) {
						getCurrentPageObj().find("#tableChaneTaskInfo").bootstrapTable("append",item);
					}
				});
			},changeCall);
			//就的字典数据
			//var sendData_new = getCurrentPageObj().find("#tableChaneTaskInfo").bootstrapTable('getData');
			/*//
			for(var i=0; i<sendData_new.length; i++) {
				initSelect(getCurrentPageObj().find("#prj_send_type"+i),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_PRJ_SEND_TYPE"});
			}
			//重新初始化数据
			for(var i=0; i<sendData_old.length; i++) {
				initSelect(getCurrentPageObj().find("#prj_send_type"+i),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_PRJ_SEND_TYPE"},sendData_old[i].PRJ_SEND_TYPE);
			}*/
		});
		
		
		//用户POP重置
		getCurrentPageObj().find("#pop_taskReset").click(function(){
			getCurrentPageObj().find("#taskBox input").each(function(){
				getCurrentPageObj().find(this).val("");
			});
		});
		//多条件查询用户
		getCurrentPageObj().find("#pop_taskSearch").click(function(){
			var req_task_name = getCurrentPageObj().find("#pop_taskName").val();
			var req_task_code =  getCurrentPageObj().find("#pop_taskNo").val();
			var system_name =  $.trim(getCurrentPageObj().find("#pop_systemName").val());
			getCurrentPageObj().find(taskTable).bootstrapTable('refresh',	{url:taskUrl+"&req_task_name="+escape(encodeURIComponent(req_task_name))+"&req_task_code="+req_task_code+"&system_name="+escape(encodeURIComponent(system_name))});
		});

		enterEventRegister("popModelQueryLevel1", function(){getCurrentPageObj().find("#pop_taskSearch").click();});
	}