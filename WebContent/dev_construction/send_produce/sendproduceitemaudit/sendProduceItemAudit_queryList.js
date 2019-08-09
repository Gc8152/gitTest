initTaskAnalyListBtn();
initTaskAnalyzeQuery();
initTaskAnalyDicCode();

//加载任务状态字典
function initTaskAnalyDicCode(){
	initSelect(getCurrentPageObj().find("#req_task_stateTO"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQTASK_STATE"});	
}

//初始化按钮
function initTaskAnalyListBtn() {
	var queryForm = getCurrentPageObj().find("#reqTaskSummaryForm");
	// 查询
	getCurrentPageObj().find("#serach_TversionQuery").click(function() {
		var param = queryForm.serialize();//获取表单的值
		getCurrentPageObj().find('#gGTaskAnalyzeTable').bootstrapTable('refresh',{
			url:dev_construction+"GTaskPhased/queryTaskOverDesignList.asp?SID="+SID+
			"&"+param
		});
		/*var req_task_code =  getCurrentPageObj().find('#req_task_codeTO').val();
		var req_task_name = getCurrentPageObj().find('#req_task_nameTO').val();
		var version_id = getCurrentPageObj().find('#version_idTO').val();
		var system_no =  getCurrentPageObj().find('#system_noTO').val();
		var req_task_state = getCurrentPageObj().find('#req_task_stateTO').val();
		var plan_onlinetime = getCurrentPageObj().find('#plan_onlinetimeTO').val();
		var plan_onlinetime1 = getCurrentPageObj().find('#plan_onlinetimeTO1').val();
		getCurrentPageObj().find('#gGTaskAnalyzeTable').bootstrapTable('refresh',{
			url:dev_construction+"GTaskPhased/queryTaskOverDesignList.asp?SID="+SID+'&req_task_name='+escape(encodeURIComponent(req_task_name))
			+'&req_task_code='+req_task_code+'&version_id='+version_id+'&plan_onlinetime='+plan_onlinetime+'&system_no='+system_no
			+'&req_task_state='+req_task_state+'&plan_onlinetime1='+plan_onlinetime1
		});*/
	});
	
	
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#serach_TversionQuery").click();});

	//重置
	getCurrentPageObj().find('#reset_TversionQuery').click(function() {
		getCurrentPageObj().find("#summaryQury input").val("");
		var selects = getCurrentPageObj().find("#summaryQury select");
		selects.val(" ");
		selects.select2();
	});
	
	getCurrentPageObj().find("[btn='close_modal']").click(function(){
		getCurrentPageObj().find("#audit_remarkPop").modal('hide');
	})
	
	getCurrentPageObj().find("#importSummaryJury").click(function(){
		var records2 = getCurrentPageObj().find("#gGTaskAnalyzeTable").bootstrapTable('getSelections');
		if(records2.length!=1){
			alert("请选择一条数据导入");
			return;
		}
		var audit_conclusion=records2[0].AUDIT_CONCLUSION;
		if(audit_conclusion != "01" && audit_conclusion != "02"){
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
	
	
	//文档上传
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
		var version_id=$.map(id,function (row) {return row.VERSION_ID;});
		
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
			if(system_no.length!=1){
				alert("请选择一条任务！")
				return ;
			}
		
				closeAndOpenInnerPageTab("sendProduce_Audit","结项审计","dev_construction/send_produce/sendproduceitemaudit/sendProduceItemAudit_update.html",function(){
					if(version_id==""||version_id==null||version_id==undefined){
						$("#sit_file").hide();
					}	
					var params = {};
					var parames = {};
					params['req_task_id'] = req_task_id.toString();
					params["phased_state"]="05";
					params['req_task_code']=req_task_code.toString();
					//文档所处阶段
					params['phase']='05';
					//路径id
					params['path_id']='GZ1055';
					getCurrentPageObj().find("#phased_state").val("05");
					getCurrentPageObj().find("#req_task_id").val(id[0]['REQ_TASK_ID']);
					getCurrentPageObj().find("#sub_req_id").val(id[0]['SUB_REQ_ID']);
					getCurrentPageObj().find("#b_code").val(id[0]['SUB_REQ_CODE']);
					getCurrentPageObj().find("#b_name").val(id[0]['SUB_REQ_NAME']);
					queryTaskPhasedByIdTwo(params);//查询任务列表
					initFtpFileListAndObject1(params,"S_DIC_SYS_DESIGN_FILE");
					
					parames["phased_sit_state"]="09001";
					parames['req_task_code']=req_task_code.toString();
					//文档所处阶段
					parames['phase_sit']='09001';
					//路径id
					parames['path_sit_id']='GZ1059001';
					getCurrentPageObj().find("#phased_sit_state").val("09001");
					getCurrentPageObj().find("#req_task_id").val(id[0]['REQ_TASK_ID']);
					getCurrentPageObj().find("#sub_req_id").val(id[0]['SUB_REQ_ID']);
					getCurrentPageObj().find("#b_code").val(id[0]['SUB_REQ_CODE']);
					getCurrentPageObj().find("#b_name").val(id[0]['SUB_REQ_NAME']);
					//queryTaskPhasedByIdTwo(params);
					initFtpFileListAndObjectSit(parames,"S_DIC_SIT_CASE_FILE");
					
				});
			  }
		});	

	
	
//加载系统应用pop
getCurrentPageObj().find('#system_nameZT').click(function(){
	openTaskSystemPop("tvsystem_pop",{sysno:getCurrentPageObj().find('#system_noZT'),sysname:getCurrentPageObj().find('#system_nameZT')});
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
		getCurrentPageObj().find('#gGTaskAnalyzeTable').bootstrapTable("destroy").bootstrapTable({
					/*url :dev_construction+"GTaskPhased/queryTaskOverDesignList.asp?SID="+SID,*/
					url :dev_construction+"GTaskPhased/querySubReqInfo.asp?SID="+SID,
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
					},{
						field : 'REQ_ID',
						title : '需求序列号',
						align : "center",
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
					}, {
						field : "DESIGN_AUDIT_DISPLAY",
						title : "任务书审计结论",
						align : "center",
						width : 120,
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
								return '<a style="color:blue" href="javascript:void(0)" onclick="showAuditRemark(\''+remark+'\')";>'+value+'</a>';
							}else{
								return value;
							}
						}
					}, {
						field : "SIT_AUDIT_DISPLAY",
						title : "案例审计结论",
						align : "center",
						width : 120
					},{
						field : "PHASED_TATLE_STATE",
						title : "上传状态",
						align : "center",
						width : 103,
						formatter:function(value,row,index){if(value=="" || value==undefined || value==null){return '<span  style="color:red; width: 110px; ";>'+"未上传"+'</span>';}return value;}
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
						title : "当前责任人",
						align : "center",
						width : 88,
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


function showAuditRemark(audit_remark){
	if(audit_remark == undefined || audit_remark == 'undefined'){ audit_remark = '';}
	getCurrentPageObj().find("#audit_remarkPop").modal('show');
	getCurrentPageObj().find("[name='AUDIT_REMARK']").val('');
	getCurrentPageObj().find("[name='AUDIT_REMARK']").val(audit_remark);
}
