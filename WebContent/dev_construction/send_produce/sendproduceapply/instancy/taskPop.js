
function openSendTaskPop(id,callparams){

	getCurrentPageObj().find('#myModal_task').remove();
	
	var system_id = callparams.system_id.val();
	getCurrentPageObj().find("#"+id).load("dev_construction/send_produce/sendproduceapply/instancy/task_pop.html",{},function(){
		getCurrentPageObj().find("#myModal_instancyTask").modal("show");
		var taskCall = getMillisecond()+'1';
		callparams.taskCall = taskCall;
		taskChangePop("#pop_instanctTaskTable",dev_construction+'sendProduceApply/queryInstancyTaskBySystemNo.asp?SID='+
				SID+'&system_id='+system_id+'&call='+taskCall,callparams);
	});
}

	/**
	 * 用户POP框
	 */
	function taskChangePop(taskTable,taskUrl,taskParam){
		var currTab = getCurrentPageObj();
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset, //页码
			};
			return temp;
		};	
		//查询所有用户POP框
		currTab.find(taskTable).bootstrapTable({
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
			recallSelect:true,
			uniqueId : "REQ_TASK_ID", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			detailView : false, //是否显示父子表
			singleSelect: false,
			jsonpCallback: taskParam.taskCall,
			columns :[
				{	
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
					field: 'REQ_TASK_STATE_NAME',
					title: '任务状态',
					align:"center"
		        }, {
		        	field:"REQ_TASK_RELATION",
		        	title : '从属关系',
					align : "center",
					formatter: function(value, row, index) {
						if(value=='01') {
							return "主办";
						}
						return "配合";
					}
		        }, {
					field : "checkResult",
					title : "是否满足投产",
					align : "center",
					visible: false,
					formatter: function(value, row, index) {
						if(value) {
							return "是";
						} else {
							return "否";
						}
					}
				}, {
		        	field:"SYSTEM_NAME",
		        	title:"所属应用",
		            align:"center"
		        }]
		});
			
		//模态框中确认选择按钮
		currTab.find("#pop_instanctTaskSave").click(function() {
			var selections=currTab.find(taskTable).bootstrapTable("getRecallSelections");
			//var selections = currTab.find(taskTable).bootstrapTable('getSelections');
			if(selections.length <1) {
				alert("请至少选择一条数据!");
				return;
			}
			currTab.find("#myModal_instancyTask").modal("hide");
			//获取原变更任务中的数据
			//var bat = currTab.find("#sendProInstancyContent").bootstrapTable('getData');
			if(currTab.find("#pop_instanctTaskTable").find("input[type='checkbox']").is(':checked')){
				var rol = currTab.find("#pop_instanctTaskTable").bootstrapTable('getRecallSelections');
				currTab.find('#sendProInstancyContent').bootstrapTable("removeAll");
				for(var i=0;i<rol.length;i++){
					/*for(var j=0;j<bat.length;j++){
						if(rol[i].REQ_TASK_ID==bat[j].REQ_TASK_ID){
							var id=bat[j].REQ_TASK_ID;
							currTab.find('#sendProInstancyContent').bootstrapTable("removeByUniqueId", id);
						}
					}*/
					currTab.find('#sendProInstancyContent').bootstrapTable("append",rol[i]);
					if(rol[i].VERSIONS_TYPE=='15'){
						currTab.find('#versions_id').val(rol[i].VERSION_ID);
					}else{
						currTab.find('#versions_id').val("");
					}
					currTab.find('#req_task_code').val(rol[i].REQ_TASK_CODE);
				}
				//初始化接口列表
				var req_task_ids = "";
				var newData = currTab.find("#sendProInstancyContent").bootstrapTable('getData');
				req_task_ids = $.map(newData,function(row){
					return row.REQ_TASK_ID;
				}).join(",");
				if(taskParam.type=="add"){
					initInstancyInterfaceSendAdd(req_task_ids);//初始化所选任务的接口信息
				}else{
					initInstancyInterfaceSendUpdate(req_task_ids);
				}
				
				if(taskParam.func_call){
					taskParam.func_call(req_task_ids);
				}
			}else{
				e.preventDefault();
		        $.Zebra_Dialog('请选择一条或多条要添加的记录!', {
		            'type':     'close',
		            'title':    '提示',
		            'buttons':  ['是'],
		            'onClose':  function(caption) {
		            	if(caption=="是"){
		            	}
		            }
		        });
			}
		});
		
		
		//用户POP重置
		getCurrentPageObj().find("#pop_instanctTaskReset").click(function(){
			getCurrentPageObj().find("#taskBox input").each(function(){
				getCurrentPageObj().find(this).val("");
			});
		});
		//多条件查询用户
		getCurrentPageObj().find("#pop_instanctTaskSearch").click(function(){
			var req_task_name = getCurrentPageObj().find("#pop_taskName").val();
			var req_task_code =  getCurrentPageObj().find("#pop_taskNo").val();
			getCurrentPageObj().find(taskTable).bootstrapTable('refresh',	{url:taskUrl+"&req_task_name="+
				encodeURIComponent(req_task_name)+"&req_task_code="+req_task_code});
		});
		enterEventRegister("popModelQueryLevel1", function(){getCurrentPageObj().find("#pop_instanctTaskSearch").click();});
	}