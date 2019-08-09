
initTaskAnalyzeQueryLayout();
function initTaskAnalyzeQueryLayout(){
	var currTab= getCurrentPageObj();
	var queryForm = currTab.find("#reqTaskAnalyzeQueryForm");
	var table = currTab.find("#gGTaskAnalyzeTable");
	var reqAnalyzeQueryListCall=getMillisecond();

 //初始化字典
 autoInitSelect(queryForm);		

//初始化按钮
initTaskAnalyListBtn();
function initTaskAnalyListBtn() {

	// 查询serach_TAersionQuery
	currTab.find("#serach_TAversionQuery").click(function() {
		var param = queryForm.serialize();//获取表单的值
		table.bootstrapTable('refresh',{
			url:dev_construction+"GTaskPhased/queryTaskAnalyzeList.asp?notComplete=01&SID="+SID+
			"&"+param+"&call="+reqAnalyzeQueryListCall
		});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#serach_TAversionQuery").click();});

	//重置
	currTab.find('#reset_TAversionQuery').click(function() {
		queryForm[0].reset();
		currTab.find('#system_noTAN').val("");//非ie8下reset()方法不能清除隐藏项的值
		var selects = currTab.find("select");
		for(var i=0; i<selects.length; i++){
			$(selects[i]).select2();
		}
	});
	
	//关闭审计结论POP
	getCurrentPageObj().find("[btn='close_modal']").click(function(){
		getCurrentPageObj().find("#audit_remarkPop2").modal('hide');
	});
	
	currTab.find("#importAnalyzeJury").click(function(){
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
		currTab.find("#supplier_import").modal("show");
	});
	


	
	//需求任务分析文档上传
	getCurrentPageObj().find("#reqAnalyzeFileUP").click(function(){
		var id = getCurrentPageObj().find("#gGTaskAnalyzeTable").bootstrapTable('getSelections');
		var p_owner = $.map(id, function (row) {return row.P_OWNER;});
		var req_task_id = $.map(id, function (row) {return row.REQ_TASK_ID;});
		var req_task_code = $.map(id,function (row) {return row.REQ_TASK_CODE;});
	    var join_noaccept = $.map(id,function (row) {return row.JOIN_NOACCEPT;});
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
				if(join_noaccept>0){
					alert("此需求点还有协办任务未受理！");
					var sub_req_id=id[0].SUB_REQ_ID;
					openTaskNotAccept("jointask_pop",sub_req_id);
					return;
				}
				closeAndOpenInnerPageTab("task_analyze_info","需求任务分析文档上传","dev_construction/requirement/reqTask_phased/analyze/task_analyze_info.html",function(){
					var params = {};
					params['req_task_id'] = req_task_id.toString();
					params["phased_state"]="03";
					params['req_task_code']=req_task_code.toString();
					//文档所处阶段
					params['phase']='03';
					//路径id
					params['path_id']='GZ1056';
					params['SYSTEM_NAME'] = id[0].SYSTEM_NAME;
					getCurrentPageObj().find("#phased_state").val("03");
					getCurrentPageObj().find("#req_task_id").val(req_task_id.toString());//给记录req_task_id
					getCurrentPageObj().find("#sub_req_id").val(id[0]['SUB_REQ_ID']);
					getCurrentPageObj().find("#b_code").val(id[0]['SUB_REQ_CODE']);
					getCurrentPageObj().find("#b_name").val(id[0]['SUB_REQ_NAME']);
					queryTaskPhasedByIdTwo(params);
					initFtpFileListAndObject(params,"S_DIC_REQ_ANL_FILE");
				});
			}
		}
	});	

//加载系统应用pop
getCurrentPageObj().find('#system_nameTAN').click(function(){
	openTaskSystemPop("tansystem_pop",{sysno:getCurrentPageObj().find('#system_noTAN'),sysname:getCurrentPageObj().find('#system_nameTAN')});
});	

}
//初始化列表
initTaskAnalyzeQuery();
function initTaskAnalyzeQuery() {
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		table.bootstrapTable("destroy").bootstrapTable({
					url :dev_construction+"GTaskPhased/queryTaskAnalyzeList.asp?notComplete=01&SID="+SID+"&call="+reqAnalyzeQueryListCall,
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
					jsonpCallback:reqAnalyzeQueryListCall,
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
					}, {
						field : "JOIN_NOACCEPT",
						title : "协办未受理数",
						align : "center",
						width : 120,
					},{
						field : "REQ_TASK_TYPE_DISPLAY",
						title : "任务来源",
						align : "center",
						width : 75,
						visible:false,
					},{
						field : "SYSTEM_NAME",
						title : "应用名称",
						align : "center",
						width : 120,
						visible:false,
					},{
						field : "AUDIT_CONCLUSION_DISPLAY",
						title : "审计结论",
						align : "center",
						width : 120,
						formatter:function(value,row,index){
							 if(value=="" || value == undefined || value==null){
								 return '待审计';
							 }else{
									var audit_result = row.AUDIT_CONCLUSION;
									if(audit_result == '02' || audit_result == '03'){
										var remark = row.REMARK;
										if(remark == undefined){ 
											remark == '';
										}else{
											remark = remark.replace(/\t/g,"");
											remark = remark.replace(/[\r\n]/g,"");
										}
										return '<a style="color:blue" href="javascript:void(0)" onclick="showAuditRemark2(\''+remark+'\')";>'+value+'</a>';
									}else{
										return value;
									}
							 }
						 }
					},{
						field :"ANALYZE_NAME",
						title :"评审状态",
						align :"center",
						width : 130,
						formatter:function(value,row,index){
							 if(value=="" || value == undefined || value==null) 
								 return '<span  style="color:red; width: 110px; ";>'+"未评审"+'</span>';
							 else
								 return value;
						 }
					},{
						field : "PHASED_STATE",
						title : "文件上传状态",
						align : "center",
						width : 102,
						formatter:function(value,row,index){if(value=="" || value==undefined || value==null){return '<span  style="color:red; width: 110px; ";>'+"未上传"+'</span>';}return "已上传";}
					},{
						field : "P_OWNER_NAME",
						title : "当前责任人",
						align : "center",
						width : 90,
					},{
						field : "PLAN_ONLINETIME",
						title : "计划投产时间",
						align : "center",
						width : 110,
					},{
						field : "CREATE_TIME",
						title : "创建时间",
						align : "center",
						width : 110,
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
						width : 280,formatter:function(value,row,index){
							if(value=="" || value == undefined || value==null){
								return "-";
							}else{
								 return value.substring(1,value.length-1);
							}
						 },
					}]
				});
	}
}



function showAuditRemark2(audit_remark){
	if(audit_remark == undefined || audit_remark == 'undefined'){ audit_remark = '';}
	getCurrentPageObj().find("#audit_remarkPop2").modal('show');
	getCurrentPageObj().find("[name='AUDIT_REMARK']").val('');
	getCurrentPageObj().find("[name='AUDIT_REMARK']").val(audit_remark);
}

