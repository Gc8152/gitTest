autoInitSelect(getCurrentPageObj());
initTaskSitCaseListBtn();
initTaskAnalyzeQuery();
//initTaskAnalyDicCode();

//加载任务状态字典
//function initTaskAnalyDicCode(){
//	initSelect(getCurrentPageObj().find("#req_task_stateTO"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQTASK_STATE"});	
//}

//初始化按钮
function initTaskSitCaseListBtn() {
	var queryForm = getCurrentPageObj().find("#reqTaskSitCaseForm");
	// 查询
	getCurrentPageObj().find("#serach_TversionQuery").click(function() {
		var param = queryForm.serialize();//获取表单的值
		if(param.phased_state == '请选择'){
			param.phased_state = '';
		}
		if(param.sit_state == '请选择'){
			param.sit_state = '';
		}
		getCurrentPageObj().find('#gGTaskSitCaseTable').bootstrapTable('refresh',{
			url:dev_construction+"GTaskPhased/queryTaskSitCaseList.asp?SID="+SID+"&testPhase=01"+
			"&"+param
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
	
	//关闭审计结论POP
	getCurrentPageObj().find("[btn='close_modal']").click(function(){
		getCurrentPageObj().find("#audit_remarkPop3").modal('hide');
	})
	
	
	
	getCurrentPageObj().find("#importSitcaseJury").click(function(){
		var records2 = getCurrentPageObj().find("#gGTaskSitCaseTable").bootstrapTable('getSelections');
		if(records2.length!=1){
			alert("请选择一条数据导入");
			return;
		}
		var a=records2[0].AUDIT_CONCLUSION;
		if(a != "01" && a != "02"){
			alert("审计结论未通过无法导入");
			return;
		}
		var phased_state = records2[0].PHASED_STATE;
		if(phased_state=="" || phased_state==undefined || phased_state==null){
			alert("文件未上传无法导入");
			return;
		}
		var jury_phase = records2[0].JURY_PHASED;
		if(jury_phase=='10'){
			alert("评审已结案无法导入");
			return;
		}
		if(jury_phase=='05'){
			alert("二级评审已通过无法导入");
			return;
		}
		getCurrentPageObj().find("#supplier_import").modal("show");
	});
	
	
	//测试案例文档上传
	getCurrentPageObj().find("#reqSitCaseFileUP").click(function(){
		var id = getCurrentPageObj().find("#gGTaskSitCaseTable").bootstrapTable('getSelections');
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
		}else{
			var system_no = $.map(id,function (row) {return row.SYSTEM_NO;});
			var is_same_system = true;
			var system_first = system_no[0];
			if(system_no.length!=1){
				alert("请选择一条任务！")
				return ;
			}
			/*if(!is_same_system){
				alert("您所选的多个任务不属于同一个应用！");
				return ;
			} else {
				var version_id = $.map(id,function (row) {return row.VERSION_ID;});
				var is_same_version = true;
				var version_first = version_id[0];
				if(version_id.length>1){
					for(var i=1; i<version_id.length; i++){
						if(version_id[i]===version_first){
						} else {
							is_same_version = false;
							break ;
						}
					}
				}
				if(!is_same_version){
					alert("您所选的任务不是同一个版本!");
					return ;
				} else {*/
				closeAndOpenInnerPageTab("task_analyze_info","测试案例文档上传","dev_construction/requirement/reqTask_phased/sitcase/task_sitcase_info.html",function(){
					var params = {};
					params['req_task_id'] = req_task_id.toString();
					params["phased_state"]="09001";
					params['req_task_code']=req_task_code.toString();
					//文档所处阶段
					params['phase']='09001';
					//路径id
					params['path_id']='GZ1059001';
					getCurrentPageObj().find("#phased_state").val("09001");
					getCurrentPageObj().find("#req_task_id").val(id[0]['REQ_TASK_ID']);
					getCurrentPageObj().find("#sub_req_id").val(id[0]['SUB_REQ_ID']);
					getCurrentPageObj().find("#b_code").val(id[0]['SUB_REQ_CODE']);
					getCurrentPageObj().find("#b_name").val(id[0]['SUB_REQ_NAME']);
					queryTaskPhasedByIdTwo(params);
					initFtpFileListAndObject(params,"S_DIC_SIT_CASE_FILE");
				});
			  }
	});	

//加载系统应用pop
getCurrentPageObj().find('#system_nameSIT').click(function(){
	openTaskSystemPop("tvsystem_pop",{sysno:getCurrentPageObj().find('#system_noSIT'),sysname:getCurrentPageObj().find('#system_nameSIT')});
});	

//加载版本pop
getCurrentPageObj().find('#version_nameTO').click(function(){
	openTaskVersionPop("tvVsersion_pop",{versionsid:getCurrentPageObj().find('#version_idTO'),versionsname:getCurrentPageObj().find('#version_nameTO')});
});
}	



//初始化列表
function initTaskAnalyzeQuery() {
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		getCurrentPageObj().find('#gGTaskSitCaseTable').bootstrapTable("destroy").bootstrapTable({
					url :dev_construction+"GTaskPhased/queryTaskSitCaseList.asp?SID="+SID+"&testPhase=01",
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
					singleSelect : true,// 复选框单选
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
						field : 'SUB_REQ_CODE',
						title : '需求点编号',
						align : "center",
						width : 155,
						formatter:function(value,row,index){
							if(value!=undefined&&value!=" ")
								{
									return '<a style="color:blue" href="javascript:void(0)" onclick="viewSubReqDetailSitCase(\''+row.REQ_ID+'\')";>'+value+'</a>';
								}
							return '--';
							}
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
						field : "REQ_TASK_STATE_DISPLAY",
						title : "主办任务状态",
						align : "center",
						width : 120,
					},{
						field : "AUDIT_CONCLUSION_DISPLAY",
						title : "审计结论",
						align : "center",
						width : 103,
						formatter:function(value,row,index){
							var audit_result = row.AUDIT_CONCLUSION;
							if(audit_result == '02' || audit_result == '03'){
								var remark = row.REMARK;
								if(remark == undefined){ 
									remark == '';
								}else{
									remark = remark.replace(/\t/g,"");
									remark = remark.replace(/[\r\n]/g,"");
								}
								return '<a style="color:blue" href="javascript:void(0)" onclick="showAuditRemark3(\''+remark+'\')";>'+value+'</a>';
							}else{
								return value;
							}
						}
					},{
						field :"ANALYZE_NAME",
						title :"评审状态",
						align :"center",
						width : 90,
						formatter:function(value,row,index){
							 if(value=="" || value == undefined || value==null || value=='00') 
								 return '<span  style="color:red; width: 110px; ";>'+"未评审"+'</span>';
							 else
								 return value;
						 },
					}, {
						field : "SYSTEM_NAME",
						title : "实施应用",
						align : "center",
						width : 103,
						visible:false,
					},{
						field : "PLAN_ONLINETIME",
						title : "计划投产时间",
						align : "center",
						width : 118,
					},{
						field : "VERSION_NAME",
						title : "申请纳入版本",
						align : "center",
						width : 139,
					},{
						field : "P_OWNER_NAME",
						title : "测试经理",
						align : "center",
						width : 88,
					},{
						field : "TEST_EXECUTOR_NAME",
						title : "测试负责人",
						align : "center",
						width : 88,
						
					},{
						field : "PHASED_STATE",
						title : "文档上传状态",
						align : "center",
						width : 103,
						formatter:function(value,row,index){if(value=="" || value==undefined || value==null){return '<span  style="color:red; width: 110px; ";>'+"未上传"+'</span>';}return "已上传";}
					},{
						field : "CREATE_TIME",
						title : "创建时间",
						align : "center",
						width : 118,
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
						
					}, {
						field : "SYSTEMS2",
						title : "协办应用",
						align : "center",
						width : 280,
						formatter:function(value,row,index){
							if(value=="" || value == undefined || value==null){
								return "-";
							}else{
								 return value.substring(1,value.length-1);
							}
						 },
						
					}]
				});
	}
//查看需求点详情	
function viewSubReqDetailSitCase(req_id){
	closeAndOpenInnerPageTab("requirement_360view","业务需求360页面","dev_construction/requirement/reqTask_follower/requirement_360view.html",function(){
		initReqInfoInView(req_id);
		initFollowerTaskQuery(req_id);
		reqChange_info(req_id);
		reqStop_info(req_id);
	});
}


function showAuditRemark3(audit_remark){
	if(audit_remark == undefined || audit_remark == 'undefined'){ audit_remark = '';}
	getCurrentPageObj().find("#audit_remarkPop3").modal('show');
	getCurrentPageObj().find("[name='AUDIT_REMARK']").val('');
	getCurrentPageObj().find("[name='AUDIT_REMARK']").val(audit_remark);
}

