var currTab = getCurrentPageObj();
//按钮方法
function initClickButtonEvent(){
	var quaryStreamCall=getMillisecond();
	initStreamApplyInfo(quaryStreamCall);
	//查询
	getCurrentPageObj().find("#queryStreamApply").unbind("click");
	getCurrentPageObj().find("#queryStreamApply").click(function(){
		var params = getCurrentPageObj().find("#StreamApplyQuerytForm").serialize();
		getCurrentPageObj().find("#StreamApplySureTableInfo").bootstrapTable('refresh',
				{url:dev_resource+'StreamApply/queryVersionStream.asp?call='+quaryStreamCall+'&SID='+SID+'&'+params});		
	});
	//enter触发查询
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#queryStreamApply").click();});
	//重置
	getCurrentPageObj().find('#resetStreamApply').click(function() {
		getCurrentPageObj().find("#system_name").val("");	
		getCurrentPageObj().find("#versions_name").val("");
		getCurrentPageObj().find("#stream_name").val("");
		getCurrentPageObj().find("#req_task_name").val("");
		getCurrentPageObj().find("#req_task_code").val("");
		getCurrentPageObj().find("#req_task_type").val("");
		getCurrentPageObj().find("#req_task_type").select2();
	});
	}

	
//查询列表显示table
function initStreamApplyInfo(quaryStreamCall) {
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	getCurrentPageObj().find("#StreamApplySureTableInfo").bootstrapTable(
			{
				//请求后台的URL（*）
				url :dev_resource+'StreamApply/queryVersionStream.asp?call='+quaryStreamCall+'&SID='+SID,
				method : 'get', //请求方式（*）   
				striped : false, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				pagination : true, //是否显示分页（*）
				pageList : [5,10,15],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 10,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "REQ_TASK_ID", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				jsonpCallback:quaryStreamCall,
				singleSelect: true,
				onLoadSuccess : function(data){
					gaveInfo();
				},
				columns : [ {
					field : 'SYSTEM_NAME',
					title : '应用名称',
					align : "center",
					width : 80,
					formatter:function(value,row,index){if(value!=undefined&&value!=" "){return '<a style="color:blue" href="javascript:void(0)" onclick="viewSystemDetail(\''+row.SYSTEM_ID+'\')";>'+value+'</a>';}return '--';}
				},{
					field : "VERSIONS_NAME",
					title : "版本名称",
					align : "center",
					width : 110,
					formatter:function(value,row,index){if(value!=undefined&&value!=" "){return '<a style="color:blue" href="javascript:void(0)" onclick="viewTaskVersionMsg(\''+row.VERSION_ID+'\')";>'+value+'</a>';}return '--';}
				}, {
					field : "REQ_TASK_CODE",
					title : "任务编号",
					align : "center",
					width : 120,
					formatter:function(value,row,index){if(value!=undefined&&value!=" "){return '<a style="color:blue" href="javascript:void(0)" onclick="viewTaskDetail1(\''+row.REQ_TASK_ID+'\')";>'+value+'</a>';}return '--';}
				}, {
					field : "REQ_TASK_NAME",
					title : "任务名称",
					align : "center",
				}, {
					field : "P_OWNER_NAME",
					title : "项目经理",
					align : "center",
					width : 60
				}, {
					field : "IS_CC_DISPLAY",
					title : "是否纳入cc",
					align : "center",
					width : 60
				}, {
					field : "STREAM_NAME",
					title : "流名称",
					align : "center",
					width : 100
				}, {
					field : "REQ_TASK_TYPE",
					title : "任务来源",
					align : "center",
					width : 60
				}, {
					field : "REQ_TASK_STATE_DISPLAY",
					title : "任务状态",
					align : "center",
					width : 80
				}]
			});
};
//查看任务详情
function viewTaskDetail1(req_task_id){
	closeAndOpenInnerPageTab("req_taskDetail","任务详情页面","dev_construction/requirement/requirement_analyze/task_accept/task_detail.html",function(){
		initReqTaskDetailLayout(req_task_id);
	  });
	
}

//查看应用详情
function viewSystemDetail(system_id){
	 closePageTab("viewApplication");
	  var appDetailCall=getMillisecond();
	  openInnerPageTab("viewApplication","查看详情","dev_application/application_queryInfo.html",function(){
		  baseAjaxJsonp(dev_application+"applicationManager/findApplicationById.asp?SID="+SID+"&system_id="+system_id+"&call="+appDetailCall, null , function(data) {
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
				}else if(k=="is_secientific_management"){
					if(str=="00"){
						str = "是";
					}else if(str=="01"){
						str = "否";
					}
					getCurrentPageObj().find("span[name='"+ k +"']").html(str);
				}/*else if(k=="system_profile"){
					getCurrentPageObj().find("textarea[name='UPP."+k+"']").val(str);
				}*/
				else {
					$("span[name="+k+" ]").text(str);
			   }
			  }
		
		  },appDetailCall);
	   });	
}

//查看版本详情
function viewTaskVersionMsg(versions_id){
	baseAjaxJsonp(dev_construction+"reqtask_intoVersion/queryVersionOneById.asp?SID="+SID+"&versions_id="+versions_id, null , function(data) {
	  if (data != undefined && data != null && data.result=="true") {
		  closeAndOpenInnerPageTab("view_project","查看版本计划","dev_construction/versionManage/annualVersionManage/annualVersionPlan_queryInfo.html", function(){
	        initAnnualVersionViewEvent(data);
		  });
	  }else{
		alert("查询单个版本信息失败");
	  }
	});
}

//加载字典项
function initStreamAppDicType(){
	var queryForm = currTab.find("#StreamApplyQuerytForm");
	autoInitSelect(queryForm);
}	
initStreamAppDicType();
initClickButtonEvent();
