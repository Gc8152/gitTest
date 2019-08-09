
function openTaskPop(id,callparams,flag,table_id){
	if(flag){
		if(flag=="" || flag==null || flag==undefined)
			flag = true;
	}
	getCurrentPageObj().find('#myModal_task').remove();
	var req_task_state = callparams.req_task_state;
	var jury_grade = callparams.jury_grade;
	var system_no = callparams.system_no;
	getCurrentPageObj().find("#"+id).load("dev_construction/jury/conductPR/juryPop/taskPop.html",{},function(){
		getCurrentPageObj().find("#myModal_task").modal("show");
		//autoInitSelect($("#pop_taskState"));
		var taskCall = getMillisecond();
		taskPop("#pop_taskTable",dev_construction+'GJury/queryReqTaskList.asp?SID='+SID+'&req_task_state='+req_task_state+'&jury_grade='+jury_grade+'&system_no='+system_no,callparams,flag,table_id);
	});
}

/**
	 * 用户POP框
	 */
	function taskPop(taskTable,taskUrl,taskParam,flag,table_id){
		//查询所有用户POP框
		getCurrentPageObj().find(taskTable).bootstrapTable("destroy").bootstrapTable({
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
					singleSelect: flag,
					
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
		
		//获取选中记录的所有节点名称
		getCurrentPageObj().find("#pop_taskSave").click(function(){
			var records = getCurrentPageObj().find(taskTable).bootstrapTable('getSelections');
			var task_nos = "";
			var task_names = "";
			var task_no = $.map(records, function (row) {
				var REQ_TASK_NAME = row.REQ_TASK_NAME;
				var REQ_TASK_RELATION_NAME = row.REQ_TASK_RELATION_NAME;
				var SYSTEM_NAME = row.SYSTEM_NAME;
				if(REQ_TASK_NAME == undefined) REQ_TASK_NAME="--";
				if(REQ_TASK_RELATION_NAME == undefined) REQ_TASK_RELATION_NAME="--";
				if(SYSTEM_NAME == undefined) SYSTEM_NAME="--";
				var trHtml="<tr id='row' align='center'><td style='text-align: center; '> <div class='form-control2' ><input name='check_task' value='"+row.REQ_TASK_ID+"' type='checkbox'/></div>"+
			    "</td><td style='text-align: center; '>"+REQ_TASK_NAME+
			    "</td><td style='text-align: center; '>"+row.REQ_TASK_CODE+
			    "</td><td style='text-align: center; '>"+row.SUB_REQ_CODE+
			    "</td><td style='text-align: center; '>"+REQ_TASK_RELATION_NAME+ 
			    "</td><td style='text-align: center; '>"+SYSTEM_NAME+
			    "</td><td style='text-align: center; '><span class='hover-view' onclick='viewJuryTaskDetail(\""+row.REQ_TASK_ID+"\",\""+row.REQ_TASK_CODE+"\",\""+taskParam.req_task_state+"\");'>查看</span></td></tr>"; 

			    var flag = true;
				 var chobj= getCurrentPageObj().find("input[name='check_task']:checkbox"); 
			     var delid="";//删除的ID  
			     chobj.each(function(){  
					if(row.REQ_TASK_ID==$(this).val()){
						flag=false;
					}
			     });
			     if(flag){
			    	 var $tr=getCurrentPageObj().find("#"+table_id+" tr").eq("-1"); 
					$tr.after(trHtml);  
			     }
				return row.REQ_TASK_ID;                  
			});
			
			
			
			if(getCurrentPageObj().find("#pop_taskTable input[type='checkbox']").is(':checked')){
				taskParam.name.val(task_names);
				taskParam.no.val(task_nos);
				getCurrentPageObj().find("#myModal_task").modal("hide");
			}else{
		        $.Zebra_Dialog('请选择一条或多条记录进行添加!', {
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
		getCurrentPageObj().find("#pop_taskReset").click(function(){
			getCurrentPageObj().find("#taskBox input").each(function(){
				$(this).val("");
			});
			getCurrentPageObj().find("#pop_taskName").val("");
			getCurrentPageObj().find("#pop_taskNo").val("");
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