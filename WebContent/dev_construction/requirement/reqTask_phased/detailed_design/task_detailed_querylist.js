initTaskDetailListBtn();
initTaskDetailzeQuery();
initTaskDetailDicCode();

//加载任务状态字典
function initTaskDetailDicCode(){
	initSelect(getCurrentPageObj().find("#req_task_stateTO"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQTASK_STATE"});	
}

//初始化按钮
function initTaskDetailListBtn() {

	// 查询
	getCurrentPageObj().find("#serach_TversionQuery").click(function() {
		var req_task_code =  getCurrentPageObj().find('#req_task_codeTO').val();
		var req_task_name = getCurrentPageObj().find('#req_task_nameTO').val();
		var version_id = getCurrentPageObj().find('#version_idTO').val();
		var system_no =  getCurrentPageObj().find('#system_noTO').val();
		var req_task_state = getCurrentPageObj().find('#req_task_stateTO').val();
		var plan_onlinetime = getCurrentPageObj().find('#plan_onlinetimeTO').val();
		var plan_onlinetime1 = getCurrentPageObj().find('#plan_onlinetimeTO1').val();
		getCurrentPageObj().find('#gGTaskAnalyzeTable').bootstrapTable('refresh',{
			url:dev_construction+"GTaskPhased/queryTaskDetailedDesignList.asp?SID="+SID+'&req_task_name='+escape(encodeURIComponent(req_task_name))
			+'&req_task_code='+req_task_code+'&version_id='+version_id+'&plan_onlinetime='+plan_onlinetime+'&system_no='+system_no
			+'&req_task_state='+req_task_state+'&plan_onlinetime1='+plan_onlinetime1
		});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#serach_TversionQuery").click();});


	//重置
	getCurrentPageObj().find('#reset_TversionQuery').click(function() {
		getCurrentPageObj().find("#summaryQury input").val("");
		var selects = getCurrentPageObj().find("#summaryQury select");
		selects.val(" ");
		selects.select2();
	});
	
	
	
	//详细设计文件上传
	getCurrentPageObj().find("#reqAnalyzeFileUP").click(function(){
		var id = getCurrentPageObj().find("#gGTaskAnalyzeTable").bootstrapTable('getSelections');
		var flag = false;
		var p_owner = $.map(id, function (row) {
			var jury_phase = row.JURY_PHASED;
			if(jury_phase=='10'){
				flag = true;
			}
			return row.P_OWNER;
		});
		if(flag){
			alert("存在评审结案任务，无法上传文档");
			return;
		}
		var req_task_id = $.map(id, function (row) {return row.REQ_TASK_ID;});
		var req_task_code = $.map(id,function (row) {return row.REQ_TASK_CODE;});
		
		if(req_task_id==null||req_task_id==undefined||req_task_id==""){
			alert("请选择一条数据！");						
			return;
		}else if(p_owner[0]!=SID){
			alert("您不是所选任务的当前责任人！");
			return;
		}else{
			var system_no = $.map(id,function (row) {return row.SYSTEM_NO;});
			var is_same_system = true;
			var system_first = system_no[0];
			if(system_no.length>1){
				for(var i=1; i<system_no.length; i++){
					if(system_no[i]===system_first){
					} else {
						is_same_system = false;
						break ;
					}
				}
			}
			if(!is_same_system){
				alert("您所选的多个任务不属于同一个应用！");
				return ;
			} else {
				closeAndOpenInnerPageTab("task_analyze_info","详细设计文件上传","dev_construction/requirement/reqTask_phased/detailed_design/task_detailed_info.html",function(){
					var params = {};
					params['req_task_id'] = req_task_id;
					params["phased_state"]="06";
					params['req_task_code']=req_task_code.toString();
					params['phase']='req_task_design';
					queryTaskPhasedById(params,"S_DIC_DET_DESIGN_FILE");
					
				});
			}
		}
			
	});	

//加载系统应用pop
getCurrentPageObj().find('#system_nameTO').click(function(){
	openTaskSystemPop("tvsystem_pop",{sysno:getCurrentPageObj().find('#system_noTO'),sysname:getCurrentPageObj().find('#system_nameTO')});
});	

//加载版本pop
getCurrentPageObj().find('#version_nameTO').click(function(){
	openTaskVersionPop("tvVsersion_pop",{versionsid:getCurrentPageObj().find('#version_idTO'),versionsname:getCurrentPageObj().find('#version_nameTO')});
});
}	



//初始化列表
function initTaskDetailzeQuery() {
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		getCurrentPageObj().find('#gGTaskAnalyzeTable').bootstrapTable("destroy").bootstrapTable({
					url :dev_construction+"GTaskPhased/queryTaskDetailedDesignList.asp?SID="+SID,
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
					uniqueId : "REQ_TASK_CODE", // 每一行的唯一标识，一般为主键列
					cardView : false, // 是否显示详细视图
					detailView : false, // 是否显示父子表
					singleSelect : false,// 复选框单选
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
					}, {
						field : 'REQ_TASK_NAME',
						title : '任务名称',
						align : "center"
					}, {
						field : "SUB_REQ_NAME",
						title : "需求点名称",
						align : "center"
					}, {
						field : "REQ_TASK_RELATION_NAME",
						title : "从属关系",
						align : "center"
					}, {
						field : "REQ_TASK_STATE_DISPLAY",
						title : "任务状态",
						align : "center"
					}, {
						field : "SYSTEM_NAME",
						title : "实施应用",
						align : "center",
					},{
						field :"ANALYZE_NAME",
						title :"评审状态",
						align :"center",
						formatter:function(value,row,index){
							 if(value=="" || value == undefined || value==null) 
								 return "未评审";
							 else
								 return value;
						 },
					},{
						field : "PLAN_ONLINETIME",
						title : "计划投产时间",
						align : "center",
					},{
						field : "VERSION_NAME",
						title : "申请纳入版本",
						align : "center",
					},{
						field : "P_OWNER_NAME",
						title : "当前责任人",
						align : "center",
					},{
						field : "PHASED_STATE",
						title : "文档上传状态",
						align : "center",
						formatter:function(value,row,index){if(value=="" || value==undefined || value==null){return "未上传";}return "已上传";}
					},{
						field : "CREATE_TIME",
						title : "创建时间",
						align : "center",
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

