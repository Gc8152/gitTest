var currTab = getCurrentPageObj();

function initVersionRangeChangeBtn(data){
	var version_val = "";
	var versions_status = "";
	var table = currTab.find("#table_reqTaskInfo");//需求任务信息变更表
	var taskInfo = currTab.find("#table_taskInfo");//模态框需求任务表
	//查询项目所属版本的版本id和版本状态
	var versionCall = getMillisecond();
	baseAjaxJsonp(dev_project+'versionRange/queryVersionInfo.asp?call='+versionCall+'&SID='+SID+'&PROJECT_ID='+data.PROJECT_ID, null, function(po){
		var pi=po.rows;
		version_val=pi[0].VERSIONS_NAME;
		versions_status=pi[0].VERSIONS_STATUS_NAME;
	}, versionCall);
	/**初始化按钮开始**/
	//添加需求任务
	var add_reqTask = currTab.find("#add_reqTask");
	var modal_reqTask = currTab.find("#reqTaskInfo_modal");//需求任务模态框
	add_reqTask.click(function(){
		modal_reqTask.modal('show');
		reqTaskModalInfo(data.PROJECT_ID);
	});
	//删除
	var dele = currTab.find("#delete");
	dele.click(function(){
		
	});
	//上一步
	var before = currTab.find("#before");
	before.click(function(){
		closeCurrPageTab();
		openInnerPageTab("before","上一步","dev_project/projectChangeManage/projectChangeApply/projectChange_edit.html");
		initproChangeEditBtn(param);
	});
	//保存按钮
	var save = currTab.find("#save");
	save.click(function(){
		initsaveChange(false);
	});
	//保存并提交按钮
	var submit = currTab.find("#submit");
	submit.click(function(){
		initsaveChange(true);
	});
	function initsaveChange(isCommit){
		var saveData = table.bootstrapTable("getData");
		var getData = new Array();
		for ( var i=0;i<saveData.length;i++) {
			/*debugger;*/
			if(saveData[i].CHANGE_GENRE!="调出版本"){
				if(saveData[i].IS_CHANGE=="否"){
					alert("需求任务"+saveData[i].REQ_TASK_NAME+"没有配置里程碑信息");
					return;
				}
			}
			getData.push({"PR_ID":saveData[i].REQ_TASK_ID,"CHANGE_GENRE":saveData[i].CHANGE_GENRE,"REQ_TASK_CODE":saveData[i].REQ_TASK_CODE,"REQ_TASK_NMAE":saveData[i].REQ_TASK_NAME});
		}
		initChange(isCommit,getData);
	}
	
	function initChange(isCommit,getData){
		var Params={};
		Params["data"] = JSON.stringify(getData);
		Params["CHANGE_ID"] = data.CHANGE_ID;
		Params["IS_COMMIT"] = isCommit;
		var saveAll=getMillisecond();
		baseAjaxJsonp(dev_project+"versionRange/saveVersionRangeInfo.asp?call="+saveAll+"&SID="+SID, Params, function(pa){
			if (pa!=undefined&&pa!=null&&pa.result=="true") {
				alert("保存成功");
			}else {
				alert("保存失败");
			}
		},saveAll);
	}
	//返回
	var back = currTab.find("#back");
	back.click(function(){
		openInnerPageTab("backList","返回列表","dev_project/projectChangeManage/projectChangeApply/projectChange_queryList.html");
	});
	
	//需求任务信息模态框查询
	var btableCall = getMillisecond();
	var query = currTab.find("#select");
	var form = currTab.find("#raqtask");
	query.click(function(){
		var REQ_TASK_CODE = currTab.find("input[name=REQ_TASK_CODE]").val();
		var REQ_TASK_NAME = currTab.find("input[name=REQ_TASK_NAME]").val();
		var REQ_CODE = currTab.find("input[name=REQ_CODE]").val();
		var REQ_NAME = currTab.find("input[name=REQ_NAME]").val();
		var SUB_REQ_CODE = currTab.find("input[name=SUB_REQ_CODE]").val();
		var SUB_REQ_NAME = currTab.find("input[name=SUB_REQ_NAME]").val();
		taskInfo.bootstrapTable('refresh',{
			url:dev_project+'versionRange/queryListReqTaskInfo.asp?call='+btableCall+'&SID='+SID+'&PROJECT_ID='+project_id
			+'&REQ_TASK_CODE='+REQ_TASK_CODE+'&REQ_TASK_NAME='+REQ_TASK_NAME+'&REQ_CODE='+REQ_CODE
			+'&REQ_NAME='+REQ_NAME+'&SUB_REQ_CODE='+SUB_REQ_CODE+'&SUB_REQ_NAME='+SUB_REQ_NAME});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#select").click();});
	//需求任务信息模态框重置
	var reset = currTab.find("#reset");
	reset.click(function(){
		form[0].reset();
		currTab.find("select").select2();
	});
	//需求任务信息模态框选择
	var select = currTab.find("#select_reqTask");
	select.click(function(e){
		//点击选择按钮，获取复选框中被选中的记录id
		if(taskInfo.find("input[type='checkbox']").is(':checked')){
			var rol = taskInfo.bootstrapTable('getSelections');//选择的需求任务信息
			var bat = table.bootstrapTable('getData');//变更信息表的数据
			for(var i=0;i<rol.length;i++){
				var version_id = rol[i].VERSION_ID;
				var relation = rol[i].REQ_TASK_RELATION;
				if(relation=="01"){//主办任务
					var marks = false;
					for(var j=0;j<rol.length;j++){
						if(i!=j&&rol[i].SUB_REQ_ID==rol[j].SUB_REQ_ID){//当有主办和协办是同一个子需求下，主办和协办直接带出
							marks = true;
						}
					}
					if(marks){
						for(var q=0;q<bat.length;q++){
							var REQ_TASK_ID = rol[i].REQ_TASK_ID;
							if(REQ_TASK_ID==bat[q].REQ_TASK_ID){//判断所选择的任务table中是否已经存在
								table.bootstrapTable("removeByUniqueId", REQ_TASK_ID);
							}
						}
						if(version_id!=undefined){//需求任务已入版
							rol[i]["CHANGE_GENRE"]="调出版本";
						}else{//需求任务未入版
							rol[i]["CHANGE_GENRE"]="紧急加塞";
							rol[i]["IS_CHANGE"]="否";
						}
					table.bootstrapTable('append', rol[i]);//追加一行数据
					}else{//当主办和协办不是同一个子需求下，主办任务要带出同一个子需求下的所有协办任务
						var taskCall = getMillisecond();
						//把选择出来的需求任务追加到table
						baseAjaxJsonp(dev_project+'versionRange/queryListModalTaskInfo.asp?call='+taskCall+'&SID='+SID+'&SUB_REQ_IDS='+rol[i].SUB_REQ_ID, null, function(pk){
							var row = pk.rows;
							for(var t=0;t<row.length;t++){
								for(var y=0;y<bat.length;y++){
									var REQ_TASK_ID = bat[y].REQ_TASK_ID;
									if(REQ_TASK_ID == row[t].REQ_TASK_ID){//判断所选择的任务table中是否已经存在
										table.bootstrapTable("removeByUniqueId", REQ_TASK_ID);
									}
								}
								if(version_id!=undefined){//需求任务已入版
									row[t]["CHANGE_GENRE"]="调出版本";
								}else{//需求任务未入版
									if(row[t].REQ_TASK_RELATION=="01"){
										row[t]["CHANGE_GENRE"]="紧急加塞";
										row[t]["IS_CHANGE"]="否";
									}else{
										row[t]["CHANGE_GENRE"]="补充协办";
										
										row[t]["IS_CHANGE"]="否";
									}
								}
								table.bootstrapTable('append', row[t]);//追加一行数据
							}
						},taskCall);
					}
				}else{//协办任务，直接带出
					for(var p=0;p<bat.length;p++){
						var REQ_TASK_ID = bat[p].REQ_TASK_ID;
						if(REQ_TASK_ID == rol[i].REQ_TASK_ID){//判断所选择的任务table中是否已经存在
							table.bootstrapTable("removeByUniqueId", REQ_TASK_ID);
						}
					}
					if(version_id!=undefined){//需求任务已入版
						rol[i]["CHANGE_GENRE"]="调出版本";
					}else{//需求任务未入版
						rol[i]["CHANGE_GENRE"]="补充协办";
						rol[i]["IS_CHANGE"]="否";
					}
					table.bootstrapTable('append', rol[i]);//追加一行数据
				}
			}
			modal_reqTask.modal("hide");
		}else{
			e.preventDefault();
	        $.Zebra_Dialog('请选择一条或多条要添加的记录!', {
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
	//需求任务变更信息删除按钮
	var delet = currTab.find("#delete");
	delet.click(function(){
		var sele = table.bootstrapTable('getSelections');
		for(var i=0;i<sele.length;i++){
			var req_task_id = sele[i].REQ_TASK_ID;
			table.bootstrapTable("removeByUniqueId", req_task_id);
		}
	});
	//里程碑模态框里的保存
	var save_milestone = currTab.find("#save_milestone");
	save_milestone.click(function(){
		if(!vlidate(currTab,"",true)){
			return ;
		}
		var params={};
		var index = currTab.find("input[name=index]").val();
		var row = table.bootstrapTable("getData")[index];
		var req_task_id = row.REQ_TASK_ID;
		var id=currTab.find("#table_milestoneInfo").bootstrapTable("getData");
		var new_id=new Array();
		for ( var i in id) {			
			var first=$("input[name='TRIM_START_TIME']");
			var second=$("input[name='TRIM_END_TIME']");
			for ( var j = i; j< id.length; i++) {
				new_id.push({"ID":id[i].ID,"PR_ID":req_task_id,"MILESTONE_ID":id[i].MILESTONE_ID,
					"TRIM_START_TIME":$(first[j]).val(),"TRIM_END_TIME":$(second[j]).val()});
				break;
			}
		}	
		params["new_id"]=JSON.stringify(new_id);
		params["CHANGE_ID"]=data.CHANGE_ID;
		var saveCall=getMillisecond();
		baseAjaxJsonp(dev_project+"versionRange/saveMilestoneInfo.asp?call="+saveCall+"&SID="+SID, params, function(pl){
			if (pl!=undefined&&pl!=null&&pl.result=="true") {
				
				row.IS_CHANGE = "是";
				table.bootstrapTable("updateRow",{index:index, row:row});
				alert("保存成功");
				currTab.find("#milestoneInfo_modal").modal('hide');
			}else {
				alert("保存失败");
			}
		},saveCall);
	});
	/**初始化按钮结束**/
	
	//修改时，给变更信息列表赋值
	var tCall = getMillisecond();
	initTaskInfo(dev_project+'versionRange/queryListTaskById.asp?call='+tCall+'&SID='+SID+'&CHANGE_ID='+data["CHANGE_ID"],data,tCall);
	/**需求任务信息变更列表开始**/
	//需求任务信息变更列表显示
	function initTaskInfo(tUrl,data,tCall){
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset //页码
			};
			return temp;
		};
		table.bootstrapTable('destroy').bootstrapTable({
			//请求后台的URL（*）
			url:tUrl,
			method : 'get', //请求方式（*）   
			striped : false, //是否显示行间隔色
			cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : true, //是否启用排序
			sortOrder : "asc", //排序方式
			queryParams : queryParams,//传递参数（*）
			sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
			pagination : false, //是否显示分页（*）
			pageList : [10,15],//每页的记录行数（*）
			pageNumber : 1, //初始化加载第一页，默认第一页
			pageSize : 10,//可供选择的每页的行数（*）
			clickToSelect : true, //是否启用点击选中行
			uniqueId : "REQ_TASK_ID", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			detailView : false, //是否显示父子表
			jsonpCallback:tCall,
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
				sortable: true,
				width: 50,
				formatter: function (value, row, index) {
					return index+1;
				}
			}, {
				field : 'REQ_TASK_ID',
				title : '需求任务ID',
				align : "center",
				visible : false
			}, {
				field : 'REQ_TASK_CODE',
				title : '需求任务编号',
				align : "center"
			}, {
				field : 'REQ_TASK_NAME',
				title : '需求任务名称',
				align : "center"
			}, {
				field : "REQ_TASK_RELATION_NAME",
				title : "主办/协办",
				align : "center"
			},/* {
			field : "NUM",
			title : "协办个数",
			align : "center"
		},*/ {
				field : 'CHANGE_VERSION',
				title : '变更前版本',
				align : "center",
				formatter: function (value, row, index) {
					if(row.CHANGE_GENRE=="调出版本"){
						return version_val;
					}else{
						return "";
					}
				}
			}, {
				field : 'REQ_TASK_STATE_NAME',
				title : '需求任务状态',
				align : "center"
			}, {
				field : "CHANGE_GENRE",
				title : "变更类别2",
				align : "center"
			}, {
				field : "TO_VERSION",
				title : "调至版本",
				align : "center",
				formatter: function (value, row, index) {
					if(row.CHANGE_GENRE=="调出版本"){
						return "";
					}else{
						return version_val;
					}
				}
			}, {
				field : "TO_STATUS_NAME",
				title : "调至版本状态",
				align : "center",
				formatter: function (value, row, index) {
					if(row.CHANGE_GENRE=="调出版本"){
						return "未入版";
					}else{
						return versions_status;
					}
				}
			}, {
				field : "SUB_REQ_CODE",
				title : "所属子需求编号",
				align : "center"
			}, {
				field : "DID",
				title : "操作",
				align : "center",
				formatter: function (value, row, index) {
					if(row.CHANGE_GENRE=="调出版本"){
						return "";
					}else{
						return '<span class="hover-view" '+'onclick="editInfo('+index+','+data.CHANGE_ID+','+data.PROJECT_ID+',\'view\')">查看</span>'+'|'+
						'<span class="hover-view" '+'onclick="editInfo('+index+','+data.CHANGE_ID+','+data.PROJECT_ID+',\'edit\')">里程碑配置</span>';
					}
				}
			}]
		});
	}
	/**需求任务信息变更列表结束**/
	
	/**需求任务模态框开始**/
	function reqTaskModalInfo(project_id){
		//需求模态框列表
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset //页码
			};
			return temp;
		};	
		taskInfo.bootstrapTable('destroy').bootstrapTable({
			//请求后台的URL（*）
			url:dev_project+'versionRange/queryListReqTaskInfo.asp?call='+btableCall+'&SID='+SID+'&PROJECT_ID='+project_id,
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
			jsonpCallback:btableCall,
			singleSelect: false,
			/*onLoadSuccess: function(p){
				var q = p.rows;
				for(var i=0;i<q.length;i++){
					if(q[i].VERSION_ID!=undefined){
						version_val=q[i].VERSION_ID;
					}
				}
			},*/
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
				sortable: true,
				width: 50,
				formatter: function (value, row, index) {
					return index+1;
				}
			}, {
				field : 'SYSTEM_NAME',
				title : '应用名称',
				align : "center"
			}, {
				field : 'REQ_TASK_CODE',
				title : '需求任务编号',
				align : "center"
			}, {
				field : "REQ_TASK_NAME",
				title : "需求任务名称",
				align : "center"
			}, {
				field : "REQ_TASK_STATE_NAME",
				title : "需求任务状态",
				align : "center"
			}, {
				field : 'VERSION_NAME',
				title : '纳入版本',
				align : "center"
			}, {
				field : "REQ_TASK_RELATION_NAME",
				title : "主/协办任务",
				align : "center"
			}, /*{
				field : 'REQ_NUM',
				title : '协办任务数',
				align : "center"
			},*/ {
				field : "SUB_REQ_CODE",
				title : "子需求编号",
				align : "center"
			}, {
				field : "SUB_REQ_NAME",
				title : "子需求名称",
				align : "center"
			}, {
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
	/**需求任务模态框结束**/
}
//里程碑配置或查看
function editInfo(index,change_id,project_id,num){
	currTab.find("input[name=index]").val(index);
	var row = currTab.find("#table_reqTaskInfo").bootstrapTable('getData')[index];
	var req_task_id=row.REQ_TASK_ID;
	currTab.find("#milestoneInfo_modal").modal('show');
	if(num == "view"){
		currTab.find("#save_milestone").hide();
		currTab.find("#milestoneInfo_title").html("任务里程碑计划查看");
	}if(num == "edit"){
		currTab.find("#save_milestone").show();
		currTab.find("#milestoneInfo_title").html("任务里程碑计划配置");
	}
	currTab.find("#TASK_CODE").html(row.REQ_TASK_CODE);
	currTab.find("#TASK_NAME").html(row.REQ_TASK_NAME);
	var mileInfo = currTab.find("#table_milestoneInfo");
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
		url:dev_project+'versionRange/queryMilestoneInfo.asp?call='+mileCall+'&SID='+SID+
		'&PROJECT_ID='+project_id+'&CHANGE_ID='+change_id+'&REQ_TASK_ID='+req_task_id,
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
		uniqueId : "MILESTONE_ID", //每一行的唯一标识，一般为主键列
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
			title : "阶段/里程碑名称",
			align : "center",
		},{
			field : "TRIM_START_TIME",
			title : "计划开始时间",
			align : "center",
			formatter: function (value, row, index) {
				if(value == undefined){
					value = "";
				}
				if(num == "view"){//查看
					return value;
				}
				if(num == "edit"){//操作
					return '<input type="text" name="TRIM_START_TIME" value="'+value+'" onClick="WdatePicker()" readonly UNSELECTABLE ="on" />';
				}
			}
		},{
			field : "TRIM_END_TIME",
			title : "计划结束时间",
			align : "center",
			formatter: function (value, row, index) {
				if(value == undefined){
					value = "";
				}
				if(num == "view"){//查看
					return value;
				}
				if(num == "edit"){//操作
					return '<input type="text" name="TRIM_END_TIME" value="'+value+'" onClick="WdatePicker()" readonly UNSELECTABLE ="on" />';
				}
			}
		}]
	});
}
initVlidate(getCurrentPageObj());