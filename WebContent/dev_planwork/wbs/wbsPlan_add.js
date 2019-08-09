//WBSb编辑页面初版，以弹出POP框的形式增加、修改，此页面暂时没有用到


$(function(){
	//显示遮罩层
	startLoading();
	
//	/*悬浮框*/
//	$(".toggleBtn").addClass("icon-caret-left");
//	$(".toggleBtn").toggle(function(){
//		$(".suspensionFrame").css({"right":"-500px","transition":"all .8s ease-in"});
//		$(".toggleBtn").removeClass("fa-caret-left").addClass("fa-caret-right");
//	},
//	function(){
//		$(".suspensionFrame").css({"right":"27px","transition":"all .8s ease-in"});
//		$(".toggleBtn").removeClass("fa-caret-right").addClass("fa-caret-left");
//	});
});

//初始化表格数据
function InitTreeData_add(project_id){
 var call = getMillisecond();
 var url = dev_planwork + 'Wbs/queryProjectMilestonePlanList.asp?SID=' + SID + "&call=" + call;
  baseAjaxJsonp(url, {
	 project_id : project_id
	}, function(msg) {
		$('#treegridTab_add').treegrid({
			rownumbers: true,
			idField: 'plan_id',
			treeField: 'plan_name',
			checkOnSelect : true,
			onLoadSuccess: function(row){
				$(this).treegrid('enableDnd', row?row.id:null);
			},
			//target是拖拽到那个节点的节点信息，source是拖拽的节点的具体信息，
			//point则有三个值，top，bottom，append，和datagrid的拖拽一样
			onDrop:function(target,source,point){

	            //逻辑代码
	        },
			data : msg,
			frozenColumns :[[
		                {field:'plan_name',title:'名称',width:180}
			]],
			columns : [[
			            {field:'type_name',title:'类别',width:90},
			            {field:'start_time',title:'计划开始日期',width:85},
			            {field:'end_time',title:'计划结束日期',width:85},
			            {field:'plan_work_day',title:'计划工期（天）'},
			            {field:'plan_work_hour',title:'计划工作量（小时）'},
			            {field:'pre_task',title:'前置任务'},
			            {field:'is_key_task_name',title:'是否关键任务'},
			            {field:'duty_man_name',title:'责任人'},
			            {field:'task_type_name',title:'任务类型'},
			            {field:'is_finish_affirm_name',title:'是否完成确认'},
			            {field:'release_status_name',title:'状态'},
			]]
		    });
		//关闭遮罩层
		endLoading();
	}, call);
}
//初始化按钮事件
function initButtonEvent(){
	//新增按钮事件
	$("#wbsPlan_add").click(function(){
		$("#wbsPlan_add_modal_title").html("新增任务");
		initVlidate($("#edit_wbsPlan_add"));
		var row = $('#treegridTab_add').treegrid('getSelected');
		if(row != undefined){
			var plan_id = row.plan_id;
			var plan_name = row.plan_name;
			var type = row.type;
			$("#type").attr("disabled",false);
			if(type == "02"){
				alert("里程碑下不能再添加节点！");
			}else{
				$("#edit_wbsPlan_add").modal("show");
			}
			$("#edit_wbsPlan_add").attr("top_plan_id",plan_id);
			$("#edit_wbsPlan_add").attr("plan_name",plan_name);
			$("#parent_name").val(plan_name);
			if(type == "01"){//阶段下只能添加工作任务
				var flag = true;
				//检查该阶段下是否已经创建里程碑节点
				var childrenRow = $('#treegridTab_add').treegrid("getChildren",plan_id);
				for ( var i = 0; i < childrenRow.length; i++) {
					var children_type = childrenRow[i].type;
					if("02" == children_type){
						$("#type").find("[value='02']").remove();
						$("#type").val("03");
						$("#type").select2();
						flag = false;
					}
				}
				if(flag){//不存在里程碑时，默认添加里程碑
					initSelect($("#type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_PLAN_TYPE"},"02");
				}
			}else if(type == "02"){//里程碑下不能再创建节点
				
			}else{//其余都是工作类型,工作类型下不能创建里程碑
				$("#type").val("03");
				$("#type").find("[value='02']").remove();
				$("#type").select2();
			}
		}else{
			$("#edit_wbsPlan_add").attr("top_plan_id","");
			$("#parent_name").val("无");
			$("#type").attr("disabled",true);
			$("#type").val("01");
			$("#type").select2();
			$("#edit_wbsPlan_add").modal("show");
		}
		$("#edit_wbsPlan_add").attr("plan_id","");
		$("#plan_name").val("");
		$("#describe").val("");
		$("#demand_task_id").val("");
		$("#task_type").val("");
		$("#task_type").select2();
		var is_key_taskArr = $("[name='P.is_key_task']");
		for ( var i = 0; i < is_key_taskArr.length; i++) {
			var r = is_key_taskArr[i];
			if(r.value = "01"){
				r.checked=true;
			}
		}
		$("#pre_task").val("");
		$("#start_time").val("");
		$("#end_time").val("");
		$("#plan_work_day").val("");
		$("#plan_work_hour").val("");
		$("#duty_man_name").val("");
		$("#duty_man").val("");
		$("#file_id").val("");
	});
	//保存任务
	$("#save_wbsPlan").click(function(){
		if(!vlidate($("#edit_wbsPlan_add"))){
			return ;
		}
		var project_id = $("#treegridTab_add").attr("project_id");
		var top_plan_id = $("#edit_wbsPlan_add").attr("top_plan_id");
		var plan_id = $("#edit_wbsPlan_add").attr("plan_id");
		var plan_name = $("#plan_name").val();
		var type = $("#type").val();
		var describe = $("#describe").val();
		var demand_task_id = $("#demand_task_id").val();
		var task_type = $("#task_type").val();
		var is_key_task = $("input[type='radio'][name='P.is_key_task']:checked")
				.val();
		var pre_task = $("#pre_task").val();
		var start_time = $("#start_time").val();
		var end_time = $("#end_time").val();
		var plan_work_day = $("#plan_work_day").val();
		var plan_work_hour = $("#plan_work_hour").val();
		var duty_man = $("#duty_man").val();
		var file_id = $("#file_id").val();
		var call = getMillisecond();
		var url = dev_planwork
		+ 'Wbs/saveProjectMilestonePlan.asp?SID=' + SID + "&call=" + call;
		baseAjaxJsonp(url,
				 {
			project_id : project_id,
			plan_id : plan_id,
			top_plan_id : top_plan_id,
			plan_name : plan_name,
			type : type,
			describe : describe,
			demand_task_id : demand_task_id,
			task_type : task_type,
			is_key_task : is_key_task,
			pre_task : pre_task,
			start_time : start_time,
			end_time : end_time,
			plan_work_day : plan_work_day,
			plan_work_hour : plan_work_hour,
			duty_man : duty_man,
			file_id : file_id
			  },function(msg){
				  if(msg.result=="true"){				
						alert("保存成功");
						InitTreeData_add(project_id);
					}else{
						alert("系统异常，请稍后！");
					}
				  $("#edit_wbsPlan_add").modal("hide");
		},call);
	});
	//删除按钮事件
	$("#wbsPlan_del").click(function(){
		var row = $('#treegridTab_add').treegrid('getSelected');
		if(row != undefined){
			var release_status = row.release_status;
			if(release_status != "00"){
				alert("该状态下不能被删除！");
				return;
			}
			nconfirm("将删除本节点及所有子节点任务！", function() {
				var plan_id = row.plan_id;
				var call = getMillisecond();
				var url = dev_planwork
				+ 'Wbs/deleteProjectMilestonePlan.asp?SID=' + SID + "&call=" + call;
				baseAjaxJsonp(url,
						 {
					plan_id : plan_id
					  },function(msg){
						  if(msg.result=="true"){				
								alert("删除成功！");
								var project_id = $("#treegridTab_add").attr("project_id");
								InitTreeData_add(project_id);
							}else{
								alert("系统异常，请稍后！");
							}
				},call);
				
			});
		}else{
			alert("请选择一行！");			
		}
	});
	//编辑按钮事件
	$("#wbsPlan_edit").click(function(){
		var row = $('#treegridTab_add').treegrid('getSelected');
		if(row != undefined){
			$("#wbsPlan_add_modal_title").html("编辑任务");
			initVlidate($("#edit_wbsPlan_add"));
			var plan_id = row.plan_id;
			var plan_name = row.plan_name;
			var type = row.type;
			var describe = row.describe;
			var demand_task_id = row.demand_task_id;
			var task_type = row.task_type;
			var is_key_task = row.is_key_task;
			var pre_task = row.pre_task;
			var start_time = row.start_time;
			var end_time = row.end_time;
			var plan_work_day = row.plan_work_day;
			var plan_work_hour = row.plan_work_hour;
			var duty_man_name = row.duty_man_name;
			var file_id = row.file_id;
			var parentId = row._parentId;
			var release_status = row.release_status;
			if(release_status != "00"){
				alert("该状态不能进行编辑！");
				return;
			}
			if(parentId == null){
				$("#parent_name").val("无");
			}else{
				var parent_name = $('#treegridTab_add').treegrid("find",parentId).plan_name;
				$("#parent_name").val(parent_name);
			}
			$("#edit_wbsPlan_add").attr("plan_id",plan_id);
			$("#plan_name").val(plan_name);
			$("#type").val(type);
			$("#type").attr("disabled",true);
			$("#type").select2();
			$("#describe").val(describe);
			$("#demand_task_id").val(demand_task_id);
			$("#task_type").val(task_type);
			$("#task_type").select2();
			$("#is_key_task").val(is_key_task);
			var is_key_taskArr = $("[name='P.is_key_task']");
			for ( var i = 0; i < is_key_taskArr.length; i++) {
				var r = is_key_taskArr[i];
				if(is_key_task == r.value){
					r.checked=true;
                    break;
				}
			}
			$("#pre_task").val(pre_task);
			$("#start_time").val(start_time);
			$("#end_time").val(end_time);
			$("#plan_work_day").val(plan_work_day);
			$("#plan_work_hour").val(plan_work_hour);
			$("#duty_man_name").val(duty_man_name);
			$("#file_id").val(file_id);
			$("#edit_wbsPlan_add").modal("show");
			
		}else{
			alert("请选择一行！");
		}
	});
	//详情按钮事件
	$("#wbsPlan_add_details").click(function(){
		var row = $('#treegridTab_add').treegrid('getSelected');
		if(row != undefined){
			var plan_id = row.plan_id;
			openInnerPageTab(
					"wbsPlan_details",
					"任务详情",
					"dev_planwork/wbs/wbsPlan_details.html",
					function() {
						getWbsPlanDetailsByPlanId(plan_id);
					});
		}else{
			alert("请选择一行！");
		}
	});
	//发布按钮事件
	$("#wbsPlan_release").click(function(){
		$('#treegridTab_add').treegrid("selectAll");
		var row = $('#treegridTab_add').treegrid("getSelections");
		var plan_idArr = new Array();
		if(row.length > 0){
			var j=0;
			for (var i = 0; i < row.length; i++) {
				var plan_id = row[i].plan_id;
				var release_status = row[i].release_status;
				if(release_status == '00'){
					plan_idArr.push(plan_id);
					j++;
				}
			}
			if(j > 0){
				nconfirm("请确认，有 " + j + " 条任务需要发布！", function() {
					var call = getMillisecond();
					var url = dev_planwork
					+ 'Wbs/releaseProjectMilestonePlan.asp?SID=' + SID + "&call=" + call;
					baseAjaxJsonp(url,
							 {
						plan_idArr : plan_idArr
						  },function(msg){
							  if(msg.result=="true"){				
									alert("发布成功！");
									var project_id = $("#treegridTab_add").attr("project_id");
									InitTreeData_add(project_id);
								}else{
									alert("系统异常，请稍后！");
								}
					},call);
				});
			}else{
				alert("没有需要发布的任务！");
			}
		}else{
			alert("没有需要发布的任务！");
		}
	});
}
//插入工作计划，改变任务类型为“阶段”时，默认上级名称为“无”，其他类型时再恢复原样
function changeType(obj){
	 var type = $(obj).val();
	 var parent_name = $("#edit_wbsPlan_add").attr("plan_name");
	if(type == "01"){
		$("#parent_name").val("无");
	}else{
		$("#parent_name").val(parent_name);
	}
}
//初始化下拉框
function initAllSelect(){
	initSelect($("#type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_PLAN_TYPE"});
	initSelect($("#task_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_TASK_TYPE"});
}
//初始化pop
function initAllPop(){
	$("#duty_man_name").click(function(){
		openUserPop("duty_man_pop",{name:$("#duty_man_name"),no:$("#duty_man")});
	});
};
//时间控件,计划开始时间
function initStartTime(){
	var end_time = $("#end_time").val();
	var maxDate = '2050-12-01';
	if(end_time != ""){
		maxDate = end_time;
	}
	WdatePicker({
		dateFmt : 'yyyy-MM-dd',
		minDate : '1990-01-01',
		maxDate : maxDate
	});
}
//时间空间，计划结束时间
function initEndTime(){
	var start_time = $("#start_time").val();
	var minDate = '1990-01-01';
	if(start_time != ""){
		minDate = start_time;
	}
	WdatePicker({
		dateFmt : 'yyyy-MM-dd',
		minDate : minDate,
		maxDate : '2050-12-01'
	});
}

initAllSelect();
initButtonEvent();
initAllPop();