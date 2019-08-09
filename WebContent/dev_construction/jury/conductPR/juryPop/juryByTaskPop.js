
function openJuryTaskPop(id,callparams){
	
	$('#myModal_task').remove();
	var jury_id = callparams.jury_id;
	$("#"+id).load("dev_construction/jury/conductPR/juryPop/juryByTaskPop.html",{},function(){
		$("#myModal_task").modal("show");
		//autoInitSelect($("#pop_taskState"));
		var taskCall = getMillisecond();
		juryTaskPop("#pop_taskTable",dev_construction+'GJury/queryJuryTaskById.asp?SID='+SID+'&jury_id='+jury_id,callparams);
	});
}

/**
	 * 用户POP框
	 */
	function juryTaskPop(taskTable,taskUrl,taskParam){
		//查询所有用户POP框
		$(taskTable).bootstrapTable("destroy").bootstrapTable({
					//请求后台的URL（*）
					url : taskUrl,
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
					uniqueId : "REQ_TASK_ID", //每一行的唯一标识，一般为主键列
					cardView : false, //是否显示详细视图
					detailView : false, //是否显示父子表
					singleSelect: true,
					onDblClickRow:function(row){
						getCurrentPageObj().find('#myModal_task').modal('hide');
						taskParam.name.val(row.REQ_TASK_NAME);
						taskParam.no.val(row.REQ_TASK_ID);
					},
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
				        }]
				});
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset, //页码
			};
			return temp;
		};		
		//获取选中节点数据
		
		
		
		//用户POP重置
		$("#pop_taskReset").click(function(){
			$("#taskBox input").each(function(){
				$(this).val("");
			});
		});
		//多条件查询用户
		$("#pop_taskSearch").click(function(){
			var req_task_name = $("#pop_taskName").val();
			var req_task_code =  $("#pop_taskNo").val();
			var system_name =  $.trim($("#pop_systemName").val());
			$(taskTable).bootstrapTable('refresh',	{url:taskUrl+"&req_task_name="+escape(encodeURIComponent(req_task_name))+"&req_task_code="+req_task_code+"&system_name="+escape(encodeURIComponent(system_name))});
		});
		enterEventRegister("popModelQueryLevel1", function(){getCurrentPageObj().find("#pop_taskSearch").click();});
	}