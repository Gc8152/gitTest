initButtonEvent_track();
$(function(){
	//显示遮罩层
	startLoading();
});
//初始化表格数据
function InitTreeData_track(project_id){
	getCurrentPageObj().find("#wbs_track_project_id").val(project_id);
	var call = getMillisecond();
	var url = dev_planwork + 'Wbs/queryProjectMilestonePlanList.asp?SID=' + SID + "&call=" + call;
	baseAjaxJsonp(url, {project_id : project_id}, function(msg) {
		initTreeGrid_track(msg);
	}, call);
}
//初始化表格数据
function initTreeGrid_track(data){
	$('#treegridTab_track').treegrid({
		data : data,
        idField:'plan_id',  
        treeField:'plan_name',  
        rownumbers:true,//第一列显示序号  
        fitColumns:false,  
        onLoadSuccess: function(row){  
        	//关闭遮罩层
			endLoading();
			//滚动页面 表格标题固定
            scrollHeadFixed(".wbsPlan_track");
            
            /*重新给datagrid-view高度*/
            var mainIframeH=$("#main_iframe").height()*0.7;
            var datagridWrapH=parseInt($(".wbsPlan_track .datagrid-wrap").css("minHeight"));
			var datagridViewH=mainIframeH>datagridWrapH?mainIframeH:datagridWrapH;
            $(".wbsPlan_track .datagrid-view").css("height",datagridViewH);
        }, 
		frozenColumns :[[
	                {field:'plan_name',title:'名称',resizable : false,width:180}
		]],
		columns : [[
		            {field:'type_name',resizable : false,width : 100,title:'类别',align : 'center'},
		            {field:'start_time',resizable : false,width : 105,title:'计划开始日期',align : 'center'},
		            {field:'end_time',resizable : false,width : 105,title:'计划结束日期',align : 'center'},
		            {field:'reality_start_time',resizable : false,width : 105,title:'实际开始日期',align : 'center'},
		            {field:'reality_end_time',resizable : false,width : 105,title:'实际结束日期',align : 'center'},
		            {field:'is_key_task_name',resizable : false,width : 95,title:'是否关键任务',align : 'center'},
		            {field:'duty_man_name',resizable : false,width : 80,title:'责任人',align : 'center'},
		            {field:'task_type_name',resizable : false,width : 80,title:'任务类型',align : 'center'},
		            {field:'work_percentage',resizable : false,width : 140,title:'工作量完成比例（%）',align : 'center'},
		            {field:'task_percentage',resizable : false,width : 140,title:'任务完成比例（%）',align : 'center'},
//		            {field:'pre_task',title:'前置任务'},
//		            {field:'is_finish_affirm_name',title:'是否完成确认'},
		            {field:'release_status_name',resizable : false,width : 80,title:'状态',align : 'center'}
		]]
	    });
}
//页面按钮事件
function initButtonEvent_track(){
	//里程碑完成确认
	getCurrentPageObj().find("#wbs_milestone_completion_confirmation").click(function(){
		var row = getCurrentPageObj().find('#treegridTab_track').treegrid("getSelections");
		if(row.length==0||row[0].type!="02"){
			alert("请选择一条里程碑任务进行确认");
			return ;
		} else {
			var release_status = row[0].release_status; 
			var plan_id = row[0].plan_id;
			if(release_status != "01" && release_status != "02" && release_status !='04'){
				alert("执行中、完成待确认、完成被打回的里程碑可以进行完成确认！");
				return;
			} else {
				var isAllFinish = true;
				var childRows = getCurrentPageObj().find('#treegridTab_track').treegrid('getChildren',row[0].plan_id);
				if(childRows.length!=0){
					for(var i=0; i<childRows.length; i++){
						var childRow = childRows[i];
						plan_id += "," + childRow.plan_id;
						if(childRow.release_status!="03"){
							isAllFinish = false;
						}
						var childChildRows = getCurrentPageObj().find('#treegridTab_track').treegrid('getChildren',childRow.plan_id)
						for(var j=0; j<childChildRows.length; j++){
							var childChildRow = childChildRows[j];
							plan_id += "," + childChildRow.plan_id;
						}
					}
				}
				if(!isAllFinish){
					nconfirm("里程碑下含有未完成确认， 是否继续确认完成",function(){
					//	console.log("sure");
						var updateCall = getMillisecond();
						baseAjaxJsonp(dev_planwork + 'Wbs/updateMileStoneConfirmation.asp?SID=' + SID + "&plan_id="+ plan_id + "&call=" + updateCall, null , function(data) {
							if (data != undefined && data != null && data.result=="true") {
								alert("更新成功");
								row[0].release_status = '03';
								row[0].release_status_name = '已确认完成';
								row[0].reality_end_time = '2017-09-11';
								var pid = getCurrentPageObj().find("#wbs_track_project_id").val();
								InitTreeData_track(pid)
								//getCurrentPageObj().find('#treegridTab_track').treegrid('refreshRow',row[0].plan_id);
							}else{
								alert("更新失败："+data.msg);
							}
						});
					});
				}
			}
		}
	});
	
	//完成确认按钮事件
	$("#wbs_completion_confirmation").click(function(){
		var row = $('#treegridTab_track').treegrid("getSelections");
		if(row.length == 0){
			alert("请选择一条任务！");
		}else{
			var release_status = row[0].release_status;
			if(release_status != "01" && release_status != "02" && release_status !='04'){
				alert("执行中、完成待确认、完成被打回可以进行完成确认！");
				return;
			}
			$("#wbsPlan_modal_table").find(".wbsPlan_auto").remove();
			var plan_id = row[0].plan_id;
			var plan_name = row[0].plan_name;
			var duty_man_name = row[0].duty_man_name;
			var release_status_name = row[0].release_status_name;
			var $tr = $("<tr plan_id='" + plan_id + "' class='wbsPlan_auto'><td>" + plan_name + "</td>" +
					"<td>" + duty_man_name + "</td>" +
					"<td>" + release_status_name + "</td>" +
					"<td><div class='ecitic-radio-all' id='is_key_task'>" +
					"<div class='ecitic-radio ecitic-radio-inline'>" +
					"<span><input type='radio' checked='true' value='00' name='isConfirmation'></span> " +
					"<label>是</label></div>" +
					"<div class='ecitic-radio ecitic-radio-inline'>" +
					"<span><input type='radio' value='01' name='isConfirmation'></span>" +
					"<label>否</label></div></div> </td>" +
					"<td><input type='text' name='remarks'/></td></tr>");
			$tr.appendTo($("#wbsPlan_modal_table"));
			var childrenRow = $('#treegridTab_track').treegrid("getChildren",plan_id);
			if(childrenRow.length > 0){
				for ( var i = 0; i < childrenRow.length; i++) {
					var plan_id = childrenRow[i].plan_id;
					var plan_name = childrenRow[i].plan_name;
					var duty_man_name = childrenRow[i].duty_man_name;
					var release_status = childrenRow[i].release_status;
					var release_status_name = childrenRow[i].release_status_name;
					if(release_status == "02" || release_status == "04"){
						var $tr = $("<tr plan_id='" + plan_id + "' class='wbsPlan_auto'><td>" + plan_name + "</td>" +
								"<td>" + duty_man_name + "</td>" +
								"<td>" + release_status_name + "</td>" +
								"<td><div class='ecitic-radio-all' id='is_key_task'>" +
								"<div class='ecitic-radio ecitic-radio-inline'>" +
								"<span><input type='radio' checked='true' value='00' name='isConfirmation" + i + "'></span> " +
								"<label>是</label></div>" +
								"<div class='ecitic-radio ecitic-radio-inline'>" +
								"<span><input type='radio' value='01' name='isConfirmation" + i + "'></span>" +
								"<label>否</label></div></div> </td>" +
								"<td><input type='text' name='remarks'/></td></tr>");
						$tr.appendTo($("#wbsPlan_modal_table"));
					}
				}
			}
			$("#wbsPlan_confirmation_modal").modal("show");
		}
	});
	//关闭任务按钮事件
	$("#wbs_task_off").click(function(){
		var row = $('#treegridTab_track').treegrid("getSelections");
		if(row.length == 0){
			alert("请选择一条任务！");
		}else{
			var release_status = row[0].release_status;
			if (release_status != "01" & release_status != "02" & release_status != "04") {
				alert("只有执行中 、已完成待确认、完成被打回可以被关闭！");
				return;
			}
			$("#task_off_modal_table").find(".wbsPlan_auto").remove();
			var plan_id = row[0].plan_id;
			var plan_name = row[0].plan_name;
			var duty_man_name = row[0].duty_man_name;
			var release_status_name = row[0].release_status_name;
			var task_percentage = row[0].task_percentage;
			var $tr = $("<tr plan_id='" + plan_id + "' class='wbsPlan_auto'><td>" + plan_name + "</td>" +
					"<td>" + duty_man_name + "</td>" +
					"<td>" + release_status_name + "</td>" +
					"<td>" + task_percentage + "</td>" +
					"<td><input type='text' name='remarks'/></td></tr>");
			$tr.appendTo($("#task_off_modal_table"));
			var childrenRow = $('#treegridTab_track').treegrid("getChildren",plan_id);
			if(childrenRow.length > 0){
				for ( var i = 0; i < childrenRow.length; i++) {
					var plan_id = childrenRow[i].plan_id;
					var plan_name = childrenRow[i].plan_name;
					var duty_man_name = childrenRow[i].duty_man_name;
					var release_status = childrenRow[i].release_status;
					var release_status_name = childrenRow[i].release_status_name;
					var task_percentage = childrenRow[i].task_percentage;
					if(release_status == "01" || release_status == "02" || release_status == "04"){
						var $tr = $("<tr plan_id='" + plan_id + "' class='wbsPlan_auto'><td>" + plan_name + "</td>" +
								"<td>" + duty_man_name + "</td>" +
								"<td>" + release_status_name + "</td>" +
								"<td>" + task_percentage + "</td>" +
								"<td><input type='text' name='remarks'/></td></tr>");
						$tr.appendTo($("#task_off_modal_table"));
					}
				}
			}
			$("#task_off_modal").modal("show");
		}
	});
	//保存任务完成确认
	$("#save_confirmation").click(function(){
		var flag = true;
		var confirmationInfo = new Array();
		$("#wbsPlan_modal_table").find(".wbsPlan_auto").each(function(){
			var plan_id = $(this).attr("plan_id");
			var remarks = $(this).find("[name='remarks']").val();
			var isConfirmation = $(this).find("input[type='radio'][name^='isConfirmation']:checked").val();
			if(isConfirmation == " "){
				alert("请填写完成确认！");
				flag = false;
				return false;
			}
			if(remarks == ""){
				alert("请填写备注！");
				flag = false;
				return false;
			}
			confirmationInfo.push(plan_id + "&&" + isConfirmation + "&&" + remarks);
		});
		if(flag){
			var call = getMillisecond();
			var url = dev_planwork + 'Wbs/updateConfirmation.asp?SID=' + SID + "&call=" + call;
			baseAjaxJsonp(url, {
				confirmationInfo : confirmationInfo
			}, function(msg) {
				if (msg.result == "true") {
					$("#wbsPlan_confirmation_modal").modal("hide");
					alert("提交成功！");
					var project_id = $("#treegridTab_track").attr("project_id");
					InitTreeData_track(project_id);
				} else {
					alert("系统异常，请稍后！");
				}
			}, call);
		}
	});
	//保存任务关闭
	$("#save_task_off").click(function(){
		var flag = true;
		var confirmationInfo = new Array();
		$("#task_off_modal_table").find(".wbsPlan_auto").each(function(){
			var plan_id = $(this).attr("plan_id");
			var remarks = $(this).find("[name='remarks']").val();
			var isConfirmation = "03";//此处isConfirmation无意义，只是为了共用后台的方法，作为占位使用
			if(isConfirmation == " "){
				alert("请填写完成确认！");
				flag = false;
				return false;
			}
			if(remarks == ""){
				alert("请填写备注！");
				flag = false;
				return false;
			}
			confirmationInfo.push(plan_id + "&&" + isConfirmation + "&&" + remarks);
		});
		if(flag){
			var call = getMillisecond();
			var url = dev_planwork + 'Wbs/updateConfirmation.asp?SID=' + SID + "&call=" + call;
			baseAjaxJsonp(url, {
				confirmationInfo : confirmationInfo
			}, function(msg) {
				if (msg.result == "true") {
					$("#task_off_modal").modal("hide");
					alert("提交成功！");
					var project_id = $("#treegridTab_track").attr("project_id");
					InitTreeData_track(project_id);
				} else {
					alert("系统异常，请稍后！");
				}
			}, call);
		}
	});
	//删除按钮事件
	$("#wbs_delete").click(function(){
		var row = $('#treegridTab_track').treegrid('getSelected');
		if(row != undefined){
			var type = row.type;
			if(type == "01"){
				alert("阶段类型不能被删除！");
				return;
			}
			if(type == "02"){
				alert("里程碑类型不能被删除！");
				return;
			}
			var reality_start_time = row.reality_start_time;
			if(reality_start_time != ""){
				alert("该任务正在执行，不允许删除！");
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
								var node = $('#treegridTab_track').treegrid('getSelected');
								if (node){ 
									 $('#treegridTab_track').treegrid('remove', node.plan_id);  
								}
							}else{
								alert("系统异常，请稍后！");
							}
				},call);
			});
		}else{
			alert("请选择一行！");
		}
	});
	//详情按钮事件
	$("#wbsPlan_track_details").click(function(){
		var row = $('#treegridTab_track').treegrid('getSelected');
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
}

////添加需求工作任务
//function XXXXXX() {
//	var req_data = {
//		"project_id" : "XXXX",
//		"list" : [ {
//			"demand_task_id" : "1",
//			"plan_name" : "需求任务1"
//		}, {
//			"demand_task_id" : "2",
//			"plan_name" : "需求任务2"
//		} ]
//	};
//	var call = getMillisecond();
//	var url = dev_planwork
//	+ 'Wbs/insertDemandTask.asp?SID=' + SID + "&call=" + call;
//	baseAjaxJsonp(url,
//			 {
//		req_data : JSON.stringify(req_data),
//		  },function(msg){
//			  if(msg.result=="true"){	
//					alert("添加成功！");
//				}else{
//					alert("系统异常，请稍后！");
//				}
//	},call);
//	
//}