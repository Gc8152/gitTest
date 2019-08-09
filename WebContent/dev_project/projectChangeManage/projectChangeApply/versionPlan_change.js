var currTab = getCurrentPageObj();

function initVersionPlanChangeBtn(param){
	initVlidate(currTab);
	var demandInfo = currTab.find("#modelTable_demandInfo");
	var taskInfo = currTab.find("#table_task");
	var columns = null;
	var B_REQ_TASK_ID  = null;
	
	//返回上一步
	var back = currTab.find("#back_versionPlan");
	back.click(function(){
		closeCurrPageTab();
		openInnerPageTab("add_proChange","修改变更","dev_project/projectChangeManage/projectChangeApply/projectChange_edit.html", function(){
			initproChangeEditBtn(param);
		});
	});
	
	var taskCall2 = getMillisecond();
	initTaskInfo(dev_project+'versionPlan/queryListTaskById.asp?call='+taskCall2+'&SID='+SID+'&CHANGE_ID='+param["CHANGE_ID"],param,taskCall2);
	
	//关闭
	currTab.find("#close_versionPlan").click(function(){
		closeCurrPageTab();
	});
	//选择子需求
	var select_Need = currTab.find("#select_Need");
	select_Need.click(function(){
		currTab.find("#demand_model").modal('show');
		demandModalInfo(demandInfo, param["PROJECT_ID"]);
	});
	/**选择子需求模态框按钮**/
	//需求查询
	var demandCall = getMillisecond();
	var query = currTab.find("#search_demand");
	query.click(function(){
		var SUB_REQ_CODE = currTab.find("input[name=SUB_REQ_CODE]").val();
		var SUB_REQ_NAME = currTab.find("input[name=SUB_REQ_NAME]").val();
		demandInfo.bootstrapTable('refresh',{
			url:dev_project+'versionPlan/queryListReqInfo.asp?call='+demandCall+'&SID='+SID+'&PROJECT_ID='+ param["PROJECT_ID"]
			+'&SUB_REQ_CODE=' + SUB_REQ_CODE
			+'&SUB_REQ_NAME=' + SUB_REQ_NAME});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#search_demand").click();});
	//需求重置
	var reset = currTab.find("#reset_demand");
	reset.click(function(){
		currTab.find("input[name=SUB_REQ_CODE]").val("");
		currTab.find("input[name=SUB_REQ_NAME]").val("");
	});

	//需求选择
	var choose = currTab.find("#choose");
	choose.click(function(e){
		//点击选择按钮，获取复选框中被选中的记录id
		if(demandInfo.find("input[type='checkbox']").is(':checked')){
			var row = demandInfo.bootstrapTable('getSelections');
			var SUB_REQ_ID = row[0].SUB_REQ_ID; 
			for(var i=1;i<row.length;i++){
				SUB_REQ_ID = SUB_REQ_ID+","+row[i].SUB_REQ_ID; 
			}
			currTab.find("#demand_model").modal('hide');
			var taskCall = getMillisecond();
			//把选择出来的需求任务追加到table
			baseAjaxJsonp(dev_project+'versionPlan/queryListTaskInfo.asp?call='+taskCall+'&SID='+SID+'&SUB_REQ_IDS='+SUB_REQ_ID, null, function(data){
				var oldData = taskInfo.bootstrapTable('getData');//获取原来table中的数据
				for(var k in data.rows){
					var flaga = true;
					var row = data.rows[k];
					for(var x in oldData){
						var REQ_TASK_ID = oldData[x].REQ_TASK_ID;
						if(REQ_TASK_ID == row.REQ_TASK_ID){//判断所选择的任务table中是否已经存在
							flaga = false;
						}
					}
					if(flaga){
						row.isChange = "否";
						taskInfo.bootstrapTable('append', row);//追加一行数据
					}
				}
			}, taskCall);
			
		}else{
			alert("请选择一条或多条数据！");
		}
	});
	
	function demandModalInfo(demandInfo,PROJECT_ID){
		
		//需求模态框列表
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset //页码
			};
			return temp;
		};
		demandInfo.bootstrapTable('destroy').bootstrapTable({
			//请求后台的URL（*）
			url:dev_project+'versionPlan/queryListReqInfo.asp?call='+demandCall+'&SID='+SID+'&PROJECT_ID='+PROJECT_ID,
			method : 'get', //请求方式（*）   
			striped : false, //是否显示行间隔色
			cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : true, //是否启用排序
			sortOrder : "asc", //排序方式
			queryParams : queryParams,//传递参数（*）
			sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
			pagination : false, //是否显示分页（*）
			pageList : [5,10,15],//每页的记录行数（*）
			pageNumber : 1, //初始化加载第一页，默认第一页
			pageSize : 10,//可供选择的每页的行数（*）
			clickToSelect : true, //是否启用点击选中行
			uniqueId : "SUB_REQ_ID", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			detailView : false, //是否显示父子表
			jsonpCallback:demandCall,
			singleSelect: false,
			columns : [ {
				field: 'middle',
				checkbox: true,
				rowspan: 2,
				align: 'center',
				valign: 'middle'
		    }, {
				field : 'Number',
				title : '序号',
				align : "center",
				width: 50,
				formatter: function (value, row, index) {
					return index+1;
				}
			}, {
				field : "SUB_REQ_CODE",
				title : "子需求编号",
				align : "center"
			}, {
				field : "SUB_REQ_NAME",
				title : "子需求名称",
				align : "center"
			},{
				field : 'REQ_CODE',
				title : '需求编号',
				align : "center"
			}, {
				field : "REQ_NAME",
				title : "需求名称",
				align : "center"
			}]
		});
	}
	
	
	function initTaskInfo(realUrl,P,taskCall){
		var taskInfo = currTab.find("#table_task");
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset //页码
			};
			return temp;
		};
		taskInfo.bootstrapTable('destroy').bootstrapTable({
			//请求后台的URL（*）
			url:realUrl,
			method : 'get', //请求方式（*）   
			striped : false, //是否显示行间隔色
			cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : true, //是否启用排序
			sortOrder : "asc", //排序方式
			queryParams : queryParams,//传递参数（*）
			sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
			pagination : false, //是否显示分页（*）
			pageList : [5,10,15],//每页的记录行数（*）
			pageNumber : 1, //初始化加载第一页，默认第一页
			pageSize : 10,//可供选择的每页的行数（*）
			clickToSelect : true, //是否启用点击选中行
			uniqueId : "REQ_TASK_ID", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			detailView : false, //是否显示父子表
			jsonpCallback:taskCall,
			singleSelect: false,
			columns : [{
				field: 'middle',
				checkbox: true,
				rowspan: 2,
				align: 'center',
				valign: 'middle',
		    },{
				field : 'Number',
				title : '序号',
				align : "center",
				width: 50,
				formatter: function (value, row, index) {
					return index+1;
				}
			},{
				field : "SUB_REQ_CODE",
				title : "子需求编号",
				align : "center"
			},{
				field : "REQ_TASK_CODE",
				title : "需求任务编号",
				align : "center"
			},{
				field : 'REQ_TASK_NAME',
				title : '需求任务名称',
				align : "center"
			},{
				field : "REQ_TASK_RELATION",
				title : "主办/协办",
				align : "center",
				formatter: function (value, row, index) {
					if(value == 01){
						return ""+'<div class="text-red">主办</div>';
					}else{
						return "协办";
					}
				}
			},{
				field : "",
				title : "协办个数",
				align : "center"
			},{
				field : "",
				title : "查看",
				align : "center",
				formatter: function (value, row, index) {
					return '<span class="hover-view" '+
					'onclick="readInfo('+index+','+P["CHANGE_ID"]+',1)">查看</span>';
				}
			},{
				field : "",
				title : "操作",
				align : "center",
				formatter: function (value, row, index) {
					return '<span class="hover-view" '+
					'onclick="readInfo('+index+','+P["CHANGE_ID"]+',2)">修改</span>'+'|'+' <span class="hover-view" '+
					'onclick="cancelUpdate('+index+','+P["CHANGE_ID"]+')">取消修改</span>';
				}
			},{
				field : "isChange",
				title : "是否有修改",
				align : "center",
				formatter: function (value, row, index) {
					if(value==undefined||value==null){
						return "是";
					} else {
						return value;
					}
				}
			}]
		});
	}
	
	/**查看,修改模态框里程碑按钮**/
	//返回
	currTab.find("#close_milestone").click(function(){
		currTab.find("#milestone_model").modal('hide');
	});
	//确定
	currTab.find("#update_milestone").click(function(){
		saveChangeInfo();
		currTab.find("#milestone_model").modal('hide');
	});
	//里程碑修改模态框保存
	function saveChangeInfo(){
			var params = {};
			var id = currTab.find("#modelTable_milestoneInfo").bootstrapTable("getData");
			var arr = '';
			var new_id = new Array();
			for ( var i in id) {			
				var first = $("input[name='TRIM_START_TIME']");
				var second = $("input[name='TRIM_END_TIME']");
				for ( var j = i; j< id.length; i++) {
					if(id[i].ID!=undefined){
						arr = arr+$.trim(id[i].ID);
					}
					if($.trim($(first[j]).val())=='' && $.trim($(second[j]).val())=='' && id[i].ID==undefined){
						break;//如果里程碑点的开始时间和结束时间都没作修改的话，不保存
					}else
						new_id.push({"ID":id[i].ID,"PR_ID":id[i].DEMAND_TASK_ID,"MILESTONE_ID":id[i].MILESTONE_ID,
							"TRIM_START_TIME":$(first[j]).val(),"TRIM_END_TIME":$(second[j]).val()});
						break;
					}
			}	
			params["new_id"]=JSON.stringify(new_id);
			params["CHANGE_ID"] = param["CHANGE_ID"];
			var addAll=getMillisecond();
			if(new_id.length!=0 || arr!=''){
				baseAjaxJsonp(dev_project+"versionPlan/insertChangeInfo.asp?call="+addAll+"&SID="+SID, params, function(data){
					if (data!=undefined&&data!=null&&data.result=="true") {
						var table = currTab.find("#table_task");
						var index = currTab.find("input[name=index]").val();
						var row = table.bootstrapTable("getData")[index];
						row.isChange = "是";
						table.bootstrapTable("updateRow",{index:index, row:row});
						alert("保存成功");
					}else {
						alert("保存失败");
					}
				},addAll);
			} else {
				alert("没有发生修改");
			}
	}
	//保存
	currTab.find("#save_versionPlan").click(function(){
		saveVersionPlan(false);
	});
	//提交
	currTab.find("#commit_versionPlan").click(function(){
		saveVersionPlan(true);
	});
	//整体页面保存
	function saveVersionPlan(isCommit){
		var saveParams={};
		var saveData = currTab.find("#table_task").bootstrapTable("getData");
		var data = new Array();
		for ( var i in saveData) {
			if(saveData[i].isChange == '是' || saveData[i].isChange==undefined||saveData[i].isChange==null){
				data.push({"PR_ID":saveData[i].REQ_TASK_ID,"REQ_TASK_CODE":saveData[i].REQ_TASK_CODE,"REQ_TASK_NMAE":saveData[i].REQ_TASK_NAME});
			}
		}
		saveParams["data"] = JSON.stringify(data);
		saveParams["CHANGE_ID"] = param["CHANGE_ID"];
		saveParams["IS_COMMIT"] = isCommit;
		var saveAll=getMillisecond();
		baseAjaxJsonp(dev_project+"versionPlan/saveVersionPlanInfo.asp?call="+saveAll+"&SID="+SID, saveParams, function(data){
			if (data!=undefined&&data!=null&&data.result=="true") {
				alert("保存成功");
			}else {
				alert("保存失败");
			}
		},saveAll);
	}
	

	//批量修改
	var batch_update = currTab.find("#batch_update");
	batch_update.click(function(){
		if(taskInfo.find("input[type='checkbox']").is(':checked')){
			var fun = function(){
				var row = taskInfo.bootstrapTable('getSelections');
				B_REQ_TASK_ID = row[0].REQ_TASK_ID; 
				for(var i=1;i<row.length;i++){
					B_REQ_TASK_ID = B_REQ_TASK_ID+","+row[i].REQ_TASK_ID; 
				}
				var bathCall = getMillisecond();
				//把选择出来的需求任务追加到table
				baseAjaxJsonp(dev_project+'versionPlan/queryListMilestone.asp?call='+bathCall+'&SID='+SID+'&REQ_TASK_IDS='+B_REQ_TASK_ID, null, function(data){
					var selerow = taskInfo.bootstrapTable('getSelections');
					for(var k in data.rows){
						var obj = data.rows[k];
						for(var x in selerow){
							if(obj.REQ_TASK_ID == selerow[x].REQ_TASK_ID){
								obj.SUB_REQ_CODE = selerow[x].SUB_REQ_CODE;
								obj.REQ_TASK_CODE = selerow[x].REQ_TASK_CODE;
								obj.REQ_TASK_NAME = selerow[x].REQ_TASK_NAME;
							}
						}
						currTab.find("#batchMilestoneInfo").bootstrapTable("append",obj);
					}
				}, bathCall);
			};
			findVersionMilestone(param["PROJECT_ID"], fun);
			currTab.find("#batch_model").modal('show');
		}else{
			alert("请选择一条或多条数据！");
		}
	});
	//批量修改返回
	currTab.find("#batch_close").click(function(){
		currTab.find("#batch_model").modal('hide');
	});
	//批量修改保存
	currTab.find("#batch_save").click(function(){
		var batchparams = {};
		var batch = new Array();
		
		var end_times = $("input[name='PATH_TIME']");
		for(var a=0; a<end_times.length;a++){
			if($.trim($(end_times[a]).val())!=''){
				batch.push({"MILESTONE_ID":columns[a+4].field,"TRIM_END_TIME":$(end_times[a]).val()});
			}
		}
		batchparams["batch"] = JSON.stringify(batch);
		batchparams["CHANGE_ID"] = param["CHANGE_ID"];
		batchparams["B_REQ_TASK_ID"] = B_REQ_TASK_ID;
		var batchCall=getMillisecond();
		baseAjaxJsonp(dev_project+"versionPlan/batchSaveVersionPlanInfo.asp?call="+batchCall+"&SID="+SID, batchparams, function(data){
			if (data!=undefined&&data!=null&&data.result=="true") {
				
				var rows = taskInfo.bootstrapTable('getSelections');
				for(var i=0;i<rows.length;i++){
					rows[i].isChange = "是";
				}
				var rol = currTab.find("#table_task").bootstrapTable('getData')[null];
				taskInfo.bootstrapTable("updateRow",{index:null, row:rol});
				alert("保存成功");
			}else {
				alert("保存失败");
			}
		},batchCall);
		currTab.find("#batch_model").modal('hide');
	});
	
	//查询项目对应版本的里程碑模版
	function findVersionMilestone(project_id, callback){
		var findCall=getMillisecond()+1;
		baseAjaxJsonp(dev_project+"versionPlan/queryVersionMilestone.asp?call="+findCall+"&SID="+SID,{PROJECT_ID:project_id},function(data){
			initbatchMilestoneInfo(data.rows);
			callback();
		},findCall);
	}
	function initbatchMilestoneInfo(data){
		columns=[{
			field : 'Number',
			title : '序号',
			align : "center",
			width: '30',
			formatter: function (value, row, index) {
				return index+1;
			}
		},{
			field : 'SUB_REQ_CODE',
			title : '子需求编号',
			align : "center",
		},{
			field : 'REQ_TASK_CODE',
			title : '需求任务编号',
			align : "center",
		},{
			field : 'REQ_TASK_NAME',
			title : '需求任务名称',
			align : "center",
		}];
		var first_row = {SUB_REQ_CODE:null, REQ_TASK_CODE:null, REQ_TASK_NAME:null};
		for(var i=0;i<data.length;i++){
			columns[columns.length]={
				field : data[i]["MILESTONE_ID"],
				title : data[i]["MILESTONE_NAME"],
				width : '100',
				align : "center",
				formatter:function(value, row, index){
					if(value==null){
						return "";
					} else if(value=="time"){
						return '<input type="text" name="PATH_TIME" onClick="WdatePicker()" readonly UNSELECTABLE ="on"/>';
					} else {
						return value;
					}
				}
			};
			first_row[data[i]["MILESTONE_ID"]] = "time";
		}
		currTab.find("#batchMilestoneInfo").bootstrapTable("destroy").bootstrapTable({
			striped : false, //是否显示行间隔色
			cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : true, //是否启用排序
			sortOrder : "asc", //排序方式
			sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
			pagination : false, //是否显示分页（*）
			pageList : [5,10,15],//每页的记录行数（*）
			pageNumber : 1, //初始化加载第一页，默认第一页
			pageSize : 10,//可供选择的每页的行数（*）
			clickToSelect : true, //是否启用点击选中行
			cardView : false, //是否显示详细视图
			detailView : false, //是否显示父子表
			singleSelect: false,
			columns:columns
		});
		currTab.find("#batchMilestoneInfo").bootstrapTable("append",first_row);
	}
}	

//取消修改
function cancelUpdate(index,par){
	var rol = currTab.find("#table_task").bootstrapTable('getData')[index];
	var content = {"CHANGE_ID":par,"PR_ID":rol.REQ_TASK_ID};
	var cancelAll=getMillisecond();
	baseAjaxJsonp(dev_project+"versionPlan/deleteChangeInfo.asp?call="+cancelAll+"&SID="+SID, content, function(data){
		if (data!=undefined&&data!=null&&data.result=="true") {
			rol.isChange = "否";
			currTab.find("#table_task").bootstrapTable("updateRow",{index:index, row:rol});
			alert("取消修改成功");
		}else {
			alert("取消修改失败");
		}
	},cancelAll);
}

//查看，修改里程碑
function readInfo(index,change_id,p){
	currTab.find("input[name=index]").val(index);
	var row = currTab.find("#table_task").bootstrapTable('getData')[index];
	currTab.find("#milestone_model").modal('show');
	if(p == 1){
		currTab.find("#update_milestone").hide();
		currTab.find("#modalHead").html("里程碑查看");
	}if(p == 2){
		currTab.find("#update_milestone").show();
		currTab.find("#modalHead").html("里程碑修改");
	}
	currTab.find("#REQ_TASK_CODE").html(row.REQ_TASK_CODE);
	currTab.find("#REQ_TASK_NAME").html(row.REQ_TASK_NAME);
	var mileInfo = currTab.find("#modelTable_milestoneInfo");
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	var mileCall = getMillisecond();
	mileInfo.bootstrapTable('destroy').bootstrapTable({
		//请求后台的URL（*）
		url:dev_project+'versionPlan/queryOneMilestone.asp?call='+mileCall+'&SID='+SID+
		'&DEMAND_TASK_ID='+row.REQ_TASK_ID+'&CHANGE_ID='+change_id,
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : false, //是否显示分页（*）
		pageList : [5,10,15],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "REQ_TASK_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:mileCall,
		singleSelect: false,
		columns : [{
			field : 'Number',
			title : '序号',
			align : "center",
			width: 50,
			formatter: function (value, row, index) {
				return index+1;
			}
		},{
			field : "MILESTONE_NAME",
			title : "里程碑名称",
			align : "center",
		},{
			field : "",
			title : "是否可裁剪",
			align : "center",
		},{
			field : "START_TIME",
			title : '计划开始时间（调整前）',
			align : "center",
		},{
			field : "TRIM_START_TIME",
			title : "计划开始时间（调整后）",
			align : "center",
			formatter: function (value, row, index) {
				if(value == undefined){
					value = "";
				}
				if(p == 1){//查看
					return value;
				}
				if(p == 2){//修改
					if(row.EXECUTE_STATUS == '00'){//未完成
						return '<input type="text" name="TRIM_START_TIME" value="'+value+'" onClick="WdatePicker()" readonly UNSELECTABLE ="on"/>';
					}else{//已完成,已完成的里程碑点不能再修改了
						return '<input type="hidden" name="TRIM_START_TIME" value="'+value+'"/>';
					}
				}
			}
		},{
			field : "END_TIME",
			title : "计划结束时间（调整前）",
			align : "center",
		},{
			field : "TRIM_END_TIME",
			title : "计划结束时间（调整后）",
			align : "center",
			formatter: function (value, row, index) {
				if(value == undefined){
					value = "";
				}
				if(p == 1){//查看
					return value;
				}
				if(p == 2){//修改
					if(row.EXECUTE_STATUS == '00'){//未完成
						return '<input type="text" name="TRIM_END_TIME" value="'+value+'" onClick="WdatePicker()" readonly UNSELECTABLE ="on"/>';
					}else{//已完成,已完成的里程碑点不能再修改了
						return '<input type="hidden" name="TRIM_END_TIME" value="'+value+'"/>';
					}
				}
			}
		},{
			field : "EXECUTE_STATUS_NAME",
			title : "执行状态",
			align : "center",
		}]
	});
}