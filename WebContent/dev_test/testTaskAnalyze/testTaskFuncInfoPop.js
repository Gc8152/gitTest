(function(taskFuncPop,$page){
	var global_params="";
	taskFuncPop.openFuncPop=function(data){
		if(data.params){
			global_params=data.params;
		}
		if(data.project_id){
			initHtml();
			initEventAndData(data.project_id,data);
			$page.find("#myModal_TaskFunc").modal("show");
		}
	};
	function initEventAndData(project_id,data){
		$page.find("#pop_chooseReturn").unbind("click").click(function(){
			var selects=$page.find("#pop_funcTable").bootstrapTable("getRecallSelections");
			if(selects.length==0){
				alert("请选择功能点!");
			}else if(data.callback){
				data.callback(selects);
				$page.find("#myModal_TaskFunc").modal("hide");
			}
		});
		$page.find("#pop_funcSearch").unbind("click").click(function(){
			var task_name=escape(encodeURIComponent($page.find("#task_name").val()));
			var task_num=escape(encodeURIComponent($page.find("#task_num").val()));
			var param="&task_name="+task_name+"&task_num="+task_num;
			$page.find("#pop_funcTable").bootstrapTable("refresh",{url:dev_test+"testTaskAnalyze/queryReqTaskInfoByProject.asp?SID=" + SID + "&call=jq_1524556473363_&tf_notask=00&project_id="+project_id+param+global_params});
		});
		$page.find("#pop_funcReset").unbind("click").click(function(){
			$page.find("#task_name").val("");
			$page.find("#task_num").val("");
		});
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		$page.find("#pop_funcTable").bootstrapTable({
			url : dev_test+"testTaskAnalyze/queryReqTaskInfoByProject.asp?SID=" + SID + "&call=jq_1524556473363_&tf_notask=00&project_id="+project_id+global_params,
			method : 'get', // 请求方式（*）
			striped : false, // 是否显示行间隔色
			cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : true, // 是否启用排序
			queryParams : queryParams,// 传递参数（*）
			sortOrder : "asc", // 排序方式
			sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
			pagination : true, // 是否显示分页（*）
			clickToSelect : true, // 是否启用点击选中行
			pageList : [ 5, 10, 15 ], 
			pageSize : 5, 
			// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
			uniqueId : "REQ_TASK_CODE", // 每一行的唯一标识，一般为主键列
			recallSelect:true,//分页数据选中记忆
			cardView : false, // 是否显示详细视图
			detailView : false, // 是否显示父子表
			singleSelect : false,// 复选框单选
			jsonpCallback:"jq_1524556473363_",
			columns : [{
				 field: 'middle',
				 checkbox: true,
				 rowspan: 1,
				 align: 'center',
				 valign: 'middle'
			}, {
				field : "SYSTEM_NAME",
				title : "应用名称",
				align : "center"
			}, {
				field : "REQ_TASK_CODE",
				title : "需求任务编号",
				align : "center",
				width:100
			}, {
				field : "REQ_TASK_NAME",
				title : "需求任务名称",
				align : "center"
			}, {
				field : "REQ_TASK_RELATION_DISPLAY",
				title : "从属关系",
				align : "center"
			},{
				field : "REQ_TASK_STATE_DISPLAY",
				title : "需求任务状态",
				align : "center"
			}, {
				field : "PLAN_ONLINETIME",
				title : "预计投产时间",
				align : "center"
			}]
		});
	}
	function initHtml(){
		var html='';
		html+='<div id="myModal_TaskFunc" class="modal hide fade modal-big-table" tabindex="-1">                ';
		html+='	<div class="modal-header">                                                                      ';
		html+='		<button type="button" class="close" data-dismiss="modal" title="点击关闭">×</button>        ';
		html+='		<h5 id="myModalLabel">需求任务选择</h5>                                                     ';
		html+='	</div>                                                                                          ';
		html+='	<form action="" class="form-inline" id="myModal_funcForm">                                      ';
		html+='		<table style="margin-left: 10%;width: 80%;text-align: right;">                              ';
		html+='			<tr><td>需求任务名称：</td><td><input type="text" id="func_name" name="func_name"/></td>  ';
		html+='			<td>需求任务编号：</td><td><input type="text" id="task_num" name="user"></td></tr>		';
		html+='		</table>                                                                                    ';
		html+='	</form>                                                                                         ';
		html+='	<div class="ecitic-save">                                                                       ';
		html+='		<input class="btn btn-ecitic" value="查询" id="pop_funcSearch" type="button">               ';
		html+='		<input class="btn btn-ecitic" value="重置" id="pop_funcReset" type="button">                ';
		html+='	</div>	                                                                                        ';
		html+='	<div style="width: 100%;height: 30px;padding-left: 15px;">                                 		';
		html+='		<input class="btn btn-ecitic" value="选择并返回" id="pop_chooseReturn" type="button">  		';
		html+='</div>																							';
		html+='	<div class="ecitic-title-table modal-body ecitic-new">                                          ';
		html+='<table id="pop_funcTable" class="table table-bordered table-hover"></table>				        ';
		html+='	</div>                                                                                          ';
		html+='<div class="modal-footer"></div>                                                                 ';
		html+='</div>                                                                                           ';
		html+='<script src="js/commons/bootstrap-table-recall-selected.js"></script>';
			var myModal_TaskFunc=$page.find("#myModal_TaskFunc");
			if(myModal_TaskFunc.length>0){
				myModal_TaskFunc.empty();
				myModal_TaskFunc.remove();
			}
			$page.append(html);
	}
})(taskFuncPop={},getCurrentPageObj());