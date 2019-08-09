initTaskAnalyListBtn();
initFollowerTaskQuery();
initTaskAnalyDicCode();

//加载任务状态字典
function initTaskAnalyDicCode(){
	//initSelect(getCurrentPageObj().find("#req_task_stateTO"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQTASK_STATE"});	
	appendSelect(getCurrentPageObj().find("#req_task_stateTO"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQTASK_STATE"});
	initSelect(getCurrentPageObj().find("[name='req_task_relation']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_TASK_RELATION"});
	initSelect(getCurrentPageObj().find("[name='req_task_type']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQTASK_COME"});
}

//初始化按钮
function initTaskAnalyListBtn() {
	//项目组长加载
	var reqAssReturnCall=getMillisecond();
	baseAjaxJsonp(dev_construction+"requirement_accept/queryUserByRoleNo.asp?role_no=0082&limit=5&offset=0&SID="+SID+"&call="+reqAssReturnCall, {}, function(data){
		var elem=getCurrentPageObj().find("#req_task_teamid");
		elem.val(" ");
		elem.append('<option value=" ">请选择</option>');	
		if(data&&data.rows&&data.rows.length>0){
			for(var i=0;i<data.rows.length;i++){
				var value=data.rows[i]["ORG_CODE"];
				var name=data.rows[i]["ORG_NAME"];
				elem.append('<option value="'+value+'">'+name+'</option>');	
			}
		}
		elem.select2();
	},reqAssReturnCall);

	// 查询
	getCurrentPageObj().find("#serach_TversionQuery").click(function() {
		var curTab=getCurrentPageObj();
		var req_task_code =  curTab.find('#req_task_codeTO').val();
		var req_task_name = curTab.find('#req_task_nameTO').val();
		var version_name = curTab.find('#version_nameTO').val();
		var system_no =  (curTab.find('#system_noTO').val()||"");
		var all = "";
		getCurrentPageObj().find("#req_task_stateTO option:selected").each(function() {
        	var text= $(this).attr("value");
        	text = text.replace(/(^\s*)|(\s*$)/g, "");
        	if(text !== '' && typeof(text) !== undefined && text !== null){
        		if(all == ""){
        			all = text;
        		}else{
        			all += ","+text;
        		}
        	}
        });
		var req_task_state = all;
		var req_task_relation = $.trim(curTab.find('#req_task_relationid').val());
		var req_task_type = $.trim(curTab.find('#req_task_typeid').val());
		var system_name = curTab.find('#system_nameTO').val();
		var plan_onlinetime = curTab.find('#plan_onlinetimeTO').val()==curTab.find('#plan_onlinetimeTO').attr("placeholder")?"":curTab.find('#plan_onlinetimeTO').val();
		var plan_onlinetime1 = curTab.find('#plan_onlinetimeTO1').val()==curTab.find('#plan_onlinetimeTO1').attr("placeholder")?"":curTab.find('#plan_onlinetimeTO1').val();
		var old_task_id=(curTab.find('#old_task_idTO').val()||"");
		var req_task_team = $.trim(curTab.find('#req_task_teamid').val());
		getCurrentPageObj().find('#gGFollowerTaskTable').bootstrapTable('refresh',{
			url:dev_construction+"GFollowerTask/queryFollowerTaskList.asp?SID="+SID+'&req_task_name='+escape(encodeURIComponent(req_task_name))
			+'&req_task_code='+req_task_code+'&plan_onlinetime='+plan_onlinetime+'&system_no='+system_no+'&version_name='+escape(encodeURIComponent(version_name))
			+'&req_task_state='+req_task_state+'&plan_onlinetime1='+plan_onlinetime1+'&system_name='+escape(encodeURIComponent(system_name))
			+'&req_task_relation='+req_task_relation+'&old_task_id='+old_task_id+'&req_task_type='+req_task_type+'&req_task_team='+req_task_team
		});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#serach_TversionQuery").click();});

	//重置
	getCurrentPageObj().find('#reset_TversionQuery').click(function() {
		  getCurrentPageObj().find("#followerQuery input").val("");
			var selects = getCurrentPageObj().find("#followerQuery select");
			selects.val(" ");
//			getCurrentPageObj().find('#req_task_teamid').val(" ");
			selects.select2();
	});
	


	
	

//加载系统应用pop
/*getCurrentPageObj().find('#system_nameTO').click(function(){
	openTaskSystemPop("tvsystem_pop",{sysno:getCurrentPageObj().find('#system_noTO'),sysname:getCurrentPageObj().find('#system_nameTO')});
});	*/

//加载版本pop
//getCurrentPageObj().find('#version_nameTO').click(function(){
//	openTaskVersionPop("tvVsersion_pop",{versionsid:getCurrentPageObj().find('#version_idTO'),versionsname:getCurrentPageObj().find('#version_nameTO')});
//});


}	



//初始化列表
function initFollowerTaskQuery() {
	var queryParams = function(params) {
		var temp = {
			limit : params.limit, // 页面大小
		offset : params.offset
	// 页码
		};
		return temp;
	};
	getCurrentPageObj().find('#gGFollowerTaskTable').bootstrapTable("destroy").bootstrapTable({
		url :dev_construction+"GFollowerTask/queryFollowerTaskList.asp?SID="+SID,
		method : 'get', // 请求方式（*）
		striped : false, // 是否显示行间隔色
		cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, // 是否启用排序
		sortOrder : "asc", // 排序方式
		queryParams : queryParams,// 传递参数（*）
		sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
		pagination : true, // 是否显示分页（*）
		pageList : [ 10, 20, 50 ], // 可供选择的每页的行数（*）
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
		columns : [{
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
			width : 180,
		}, {
			field : 'REQ_TASK_NAME',
			title : '任务名称',
			align : "center",
			width : 400,
			formatter : function(value, row, index) {
				return req_namformatter(32,value,"color: blue;",' onclick="openReqTaskDetail(\''+row.REQ_TASK_ID+'\')";');
			}
			/*formatter:function(value,row,index){return '<a style="color:blue" href="javascript:void(0)" onclick="openReqTaskDetail(\''+row.REQ_TASK_ID+'\')";>'+value+'</a>';}*/
		}, {
			field : "SYSTEM_NO",
			title : "应用ID",
			align : "center",
			visible:false,
		}, {
			field : 'SYSTEM_NAME',
			title : '应用名称',
			align : "center",
			width : 110,
			formatter:function(value,row,index){return '<a style="color:blue" href="javascript:void(0)" onclick="openSystemDetail(\''+row.SYSTEM_NO+'\')";>'+value+'</a>';}
		
		},{
			field : "SUB_REQ_NAME",
			title : "需求点名称",
			align : "center",
			width : 200,
			formatter:function(value,row,index){
				if(row.TASK_TYPE=='05'){
					return '<a style="color:blue" href="javascript:void(0)" onclick="openEmSubReqDetail(\''+row.REQ_ID+'\')";>'+value+'</a>';
				}else{
					return '<a style="color:blue" href="javascript:void(0)" onclick="openSubReqDetail(\''+row.REQ_ID+'\')";>'+value+'</a>';
				}
			}
		}, {
			field : "VERSION_ID",
			title : "版本ID",
			align : "center",
			visible:false,
		},{
			field : "VERSION_NAME",
			title : "申请纳入版本",
			align : "center",
			width : 180,
			formatter:function(value,row,index){if(value!=undefined&&value!=" "){return '<a style="color:blue" href="javascript:void(0)" onclick="openVersionDetail(\''+row.VERSION_ID+'\')";>'+value+'</a>';}return '--';}
		
		},{
			field : "REQ_TASK_STATE_DISPLAY",
			title : "任务状态",
			align : "center",
			width : 105,
			formatter:function(value,row,index){if(value!=0){return '<span  style="font-weight:bold;text-align: center; width: 110px; ";>'+row.REQ_TASK_STATE_DISPLAY+'</span>';}}
		
		}, {
			field : "REQ_TASK_RELATION_NAME",
			title : "从属关系",
			align : "center",
			width : 80
		}, {
			field : "GROUP_NAME",
			title : "项目组",
			align : "center",
			width : 105
		}, {
			field : "P_OWNER_NAME",
			title : "当前处理人",
			align : "center",
			width : 105
		}, {
			field : "STREAM_STATE",
			title : "流状态",
			align : "center",
			width : 95,
			visible:false
		}, {
			field : 'REQ_TASK_TYPE',
			title : '任务来源',
			align : "center",
			width : 80,
			visible:false
			/*formatter:function(value,row,index){return '<a style="color:blue" href="javascript:void(0)" onclick="openReqTaskDetail(\''+row.REQ_TASK_ID+'\')";>'+value+'</a>';}*/
		
		}, {
			field : "REQ_NAME",
			title : "业务需求名称",
			align : "center",
			width : 160,
			formatter:function(value,row,index){return '<a style="color:blue" href="javascript:void(0)" onclick="openReqDetail(\''+row.REQ_ID+'\')";>'+value+'</a>';}
		}, {
			field : "RELEASE_NUM",
			title : "关联任务数",
			align : "center",
			width : 100
			/*formatter:function(value,row,index){return '<a style="color:blue" href="javascript:void(0)" onclick="openTaskList(\''+row.REQ_ID+'\')";>'+value+'</a>';}
	*/	}, {
			field : "PRODUCE_TIME",
			title : "投产时间",
			align : "center",
			width : 110
		}, {
			field : "REQ_SCORE",
			title : "需求优先级",
			align : "center",
			width : 90
		}, {
			field : "ANALYZE_STATE",
			title : "需求分析",
			align : "center",
			width : 80,
//						formatter:function(value,row,index){if(value>0){return "查看";}return "--";}
			formatter:function(value,row,index){if(value>0){return '<a style="color:blue" href="javascript:void(0)" onclick="phasedFollower(03,\''+row.REQ_TASK_ID+'\',\''+row.REQ_TASK_CODE+'\')";>查看</a>';}return "--";}
		},{
			field : "SUMMARY_STATE",
			title : "设计开发",
			align : "center",
			width : 80,
			formatter:function(value,row,index){if(value>0){return '<a style="color:blue" href="javascript:void(0)" onclick="phasedFollower(05,\''+row.REQ_TASK_ID+'\',\''+row.REQ_TASK_CODE+'\')";>查看</a>';}return "--";}
		},{
			field : "DETAILDESIGN_STATE",
			title : "详细设计",
			align : "center",
			formatter:function(value,row,index){if(value>0){return '<a style="color:blue" href="javascript:void(0)" onclick="phasedFollower(06,\''+row.REQ_TASK_ID+'\',\''+row.REQ_TASK_CODE+'\')";>查看</a>';}return "--";},
			visible:false
		},{
			field : "SIT_CASE_STATE",
			title : "SIT测试案例",
			align : "center",
			width : 100,
			formatter:function(value,row,index){if(value>0){return '<a style="color:blue" href="javascript:void(0)" onclick="phasedFollower(09001,\''+row.REQ_TASK_ID+'\',\''+row.REQ_TASK_CODE+'\')";>查看</a>';}return "--";}
		},{
			field : "UAT_STATE",
			title : "UAT测试",
			align : "center",
			formatter:function(value,row,index){if(value>0){return '<a style="color:blue" href="javascript:void(0)" onclick="phasedFollower(10,\''+row.REQ_TASK_ID+'\',\''+row.REQ_TASK_CODE+'\')";>查看</a>';}return "--";},
			visible:false
		},{
			field : "CHANGE_STATE",
			title : "变更状态",
			align : "center",
			width : 140
		},{
			field : "OLD_TASK_ID",
			title : "存量任务编号",
			align : "center",
			width : 140,
			visible:false
		}
		]
	});
}
//打开任务详情页面
function openReqTaskDetail(req_task_id){
	closeAndOpenInnerPageTab("req_taskDetail","任务详情页面","dev_construction/requirement/requirement_analyze/task_accept/task_detail.html",function(){
		initReqTaskDetailLayout(req_task_id);
	  });
}
//打开应用详情页面
function openSystemDetail(ids){
	 closePageTab("viewApplication");
	 var appDetailCall=getMillisecond()+'1';
	 openInnerPageTab("viewApplication","查看详情","dev_application/application_queryInfo.html",function(){
		  baseAjaxJsonp(dev_application+"applicationManager/findApplicationById.asp?SID="+SID+"&system_id="+ids+"&call="+appDetailCall, null , function(data) {
			  for ( var k in data) {
					 var str=data[k];
					  k = k.toLowerCase();
				if(k=="develop_tool"){
					initAPPSelect3(getCurrentPageObj().find("#APDdevelop_tool"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_DEVELOP_TOOL"},str);
				}else if(k=="develop_language"){
					initAPPSelect3(getCurrentPageObj().find("#APDdevelop_language"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_DEVELOP_LANGUAGE"},str);
				}else if(k=="mac_os"){	
					initAPPSelect3(getCurrentPageObj().find("#APDmac_os"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_MAC_OS"},str);
				}else if(k=="hardware_type"){
					initAPPSelect3(getCurrentPageObj().find("#APDhardware_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_HARDWARE_TYPE"},str);
				}else if(k=="among"){	
					initAPPSelect3(getCurrentPageObj().find("#APDamong"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_DEVELOP_AMONG"},str);
				}else if(k=="database"){	
					initAPPSelect3(getCurrentPageObj().find("#APDdatabase"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_DEVELOP_DATABASE"},str);
				}else if(k=="addr_type"){
					initCheckVis(getCurrentPageObj().find("#addrType"),{dic_code:"G_DIC_SYSTEM_CONFIG_TYPE"},"addrTypeName","addrType",str,"N");
				}else if(k=="system_id"){
					getCurrentPageObj().find("input[name='"+ k +"']").val(str);
					getCheckedAddr(str);
				}else if(k=="vob_info"){
					getCurrentPageObj().find("span[name='C."+ k +"']").html(str);
				}else if(k=="cc_server_url"){
					getCurrentPageObj().find("span[name='C."+ k +"']").html(str);
				}
				else {
					$("span[name="+k+" ]").text(str);
			   }
			  }
		
		  },appDetailCall);
	   });

}
//打开需求点详情页面
function openSubReqDetail(req_id){
	closeAndOpenInnerPageTab("subreq_detail","需求点详情","dev_construction/requirement/requirement_analyze/split_subreq/splitSubreq_detail.html",function(){
		initSplitReqDetailLayOut(req_id);
	});
}
//打开紧急需求点详情页面
function openEmSubReqDetail(req_id){
	closeAndOpenInnerPageTab("emsubreq_detail","紧急需求点详情","dev_construction/requirement/requirement_analyze/split_subreq/splitEmSubreq_detail.html",function(){
		initEmReqSplitDetail(req_id);//初始化页面信息
		});	
}
//打开版本详情页面
function openVersionDetail(version_id){
	 closePageTab("view_project");
	 var tCall=getMillisecond()+'2';
			baseAjaxJsonp(dev_construction+'annualVersion/queryListAnnualVersion.asp?SID='+SID+'&call='+tCall+"&versions_id="+version_id, null , function(data) {
				openInnerPageTab("view_project","查看计划","dev_construction/versionManage/annualVersionManage/annualVersionPlan_queryInfo.html", function(){
					initAnnualVersionViewEvent(data.rows[0]);
			});
		},tCall);

}
//打开需求360详情页面
function openReqDetail(req_id){
		//var ids=getCurrentPageObj().find('#req_id').val();
		closeAndOpenInnerPageTab("requirement_detail","需求详情","dev_construction/requirement/requirement_input/req_detail.html",function(){
			initReqDetailLayout(req_id);
		});

}
//打开关联主/协办任务列表
function openTaskList(req_id){


}

//根据不同阶段的任务信息
function phasedFollower(task_state,req_task_id,req_task_code){
	var text="";
	//closeAndOpenInnerPageTab("task_analyze_info",text+"详情","dev_construction/requirement/reqTask_phased/reqTaskFile_info.html",function(){
	var params = {};
	params['req_task_id'] = req_task_id;
	params["phased_state"]=task_state;
	params['REQ_TASK_CODE']=req_task_code.toString();
	if(task_state=='03'){
		params['phase']='req_task_analyze';
		text="任务分析文档详情";
	}else if(task_state=='05'){
		params['phase']='req_task_summary';
		text="设计开发文档详情";
	}else if(task_state=='06'){
		params['phase']='req_task_design';
		text="详细设计文档详情";
	}else if(task_state=='07'){
		params['phase']='req_task_unit_test';
		text="编码开发文档详情";
	}else if(task_state=='08'){
		params['phase']='req_task_joint';
		text="联调测试文档详情";
	}else if(task_state=='09001'){
		params['phase']='req_sit_file';
		text="SIT测试案例文档详情";
	}else if(task_state=='10'){
		params['phase']='req_uat_file';
		text="UAT测试文档详情";
	}
	
	var taskCall = getMillisecond();
	 baseAjaxJsonp(dev_construction+"GTaskPhased/queryTaskPhasedById.asp?SID="+SID+"&call="+taskCall, params , function(data) {
		if (data != undefined && data != null && data.result=="true") {
			viewPhaseTaskDetail(task_state,data.data[0],text);
		}
	},taskCall);
	//});
	
	
		 /*
	closeAndOpenInnerPageTab("task_analyze_info",text,"dev_construction/requirement/reqTask_follower/task_follower_info.html",function(){
		var params = {};
		params['req_task_id'] = task_id;
		params["phased_state"]=phased_state;
		queryTaskPhasedById(params,"S_DIC_SYS_DESIGN_FILE");
	});
	
	closeAndOpenInnerPageTab("task_analyze_info",text,"dev_construction/requirement/reqTask_follower/task_follower_info.html",function(){
		var expertsCall = getMillisecond();
		var params = {};
		params["phased_state"] = phased_state;
		params["req_task_id"] = task_id;
		baseAjaxJsonp(dev_construction+'GFollowerTask/queryFollowerTaskById.asp?call='+expertsCall+'&SID='+SID,params, function(data) {
			
			if (data != undefined&&data!=null&&data.result=="true") {
				var dataMap = data.followerMap;
				for(var k in dataMap){
					var str=dataMap[k];
					k = k.toLowerCase();//大写转换为小写
					getCurrentPageObj().find('#'+k).text(str);
				}
				
				//var fileMap = data.fileMap;
			}

		},expertsCall);
	});
	*/
}

