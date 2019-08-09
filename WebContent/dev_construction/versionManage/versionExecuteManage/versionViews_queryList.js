function initVersionExecuteViewEvent(params){
	var currTab=getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题
	//获取版本id
	var version_id="";
	var version_name="";
	for(var i in params){
		if (i=="VERSIONS_ID") {
			version_id=params[i];
		}
		if (i=="VERSIONS_NAME") {
			version_name=params[i];
		}
	}
	//返回
	currTab.find("#back_versionExecute").click(function(){
		closeCurrPageTab();
	});
	
	//tab3
	initVersionNeedTree();
	function initVersionNeedTree() {
		var allCall=getMillisecond();
		var setting = {  
			  data:{
				  key: {
						name: "NAME"
					},
				  simpleData:{
					enable: true,
					idKey: "ID",
					pIdKey: "PID",
					rootPId :"0",
				  }
			  },
			  callback:{
				    onClick: zTreeOnClick
				  }
			};  
		var zTreeObj;	  
		baseAjaxJsonp(dev_construction+'versionexecute/queryAllVersionNeed.asp?SID='+SID+'&call='+allCall+'&version_id='+version_id+'&version_name='+escape(encodeURIComponent(version_name)), null, function(data){
			if (data != undefined && data != null) {
				zTreeObj=$.fn.zTree.init($("#treeVersionInfo"), setting,data.vn);//初始化树
			}else{
				alert("未知错误！");
				}
			}, allCall);
		}
	
	var needCall=getMillisecond();
	var param="";
	function zTreeOnClick(e,treeId,treeNode){
		 param=treeNode.ID;
         $('#VersionInfo').bootstrapTable('refresh',{url : dev_construction+'versionexecute/queryOneVersionNeedInfo.asp?SID='+SID+'&call='+needCall+'&need_task='+param});
	}
	
	initVersionTable();
	function initVersionTable() {
		$('#VersionInfo').bootstrapTable('destroy');
		$('#VersionInfo').bootstrapTable({
			url : dev_construction+'versionexecute/queryOneVersionNeedInfo.asp?SID='+SID+'&call='+needCall+'&need_task='+param, //请求后台的URL（*）
			method : 'get', //请求方式（*）   
			striped : false, //是否显示行间隔色
			cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			pagination : false, //是否显示分页（*）
			sortable : false, //是否启用排序
			sortOrder : "asc", //排序方式
			queryParams : {},//传递参数（*）
			sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
			pageNumber : 1, //初始化加载第一页，默认第一页
			pageSize : 50, //每页的记录行数（*）
			//pageList : [ 5, 10 ], //可供选择的每页的行数（*）
			strictSearch : true,
			clickToSelect : true, //是否启用点击选中行
			//height : 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
			uniqueId : "ACTION_NO", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			detailView : false, //是否显示父子表
			jsonpCallback:needCall,
			columns : 
			[{
				field : 'Number',
				title : '序号',
				align : "center",			
				sortable: true,
				formatter: function (value, row, index) {
					return index+1;
				}
			},{
				field : 'SYSTEM_NAME',
				title : '标记',
				align : "center"
			}, {
				field : "PLAN_NAME",
				title : "名称",
				align : "center"
			}, {
				field : "TYPE",
				title : "类别",
				align : "center"
			}, {
				field : "END_TIME",
				title : "计划结束时间",
				align : "center"
			},{
				field : "REALITY_END_TIME",
				title : "实际结束时间",
				align : "center"
			}]
		});
	}
	//tab2
	//版本子需求列表统计信息显示
	var table=currTab.find("#table_versionReqChild");
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	var TaCall=getMillisecond();
	table.bootstrapTable({
		//请求后台的URL（*）
		url : dev_construction+'versionexecute/queryListVersionChildDemand.asp?SID='+SID+'&call='+TaCall+'&version_id='+version_id,
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [10,15],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "DRAFT_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		showFooter:true,//统计列的总和
		jsonpCallback:TaCall,
		columns : 
		[{
			field : 'Number',
			title : '序号',
			align : "center",			
			sortable: true,
			formatter: function (value, row, index) {
				return index+1;
			}
		},{
			field : 'SYSTEM_NAME',
			title : '应用名称',
			align : "center",
			footerFormatter : function(value, row, index) {
			    return '总计';
			}
		}, {
			field : "REQ_NUM",
			title : "定版需求总数",
			align : "center",
			footerFormatter : function(value, row, index) {
			    var count=0;
			    for( var i in value){
			    	count +=value[i].REQ_NUM;
			    }
			    return count;
			}
		}, {
			field : "GENERAL_DESIGN",
			title : "概要设计完成",
			align : "center",
			footerFormatter : function(value, row, index) {
			    var count=0;
			    for( var i in value){
			    	count +=value[i].GENERAL_DESIGN;
			    }
			    return count;
			}
		}, {
			field : "DETAIL_DESIGN",
			title : "详细设计完成",
			align : "center",
			footerFormatter : function(value, row, index) {
			    var count=0;
			    for( var i in value){
			    	count +=value[i].DETAIL_DESIGN;
			    }
			    return count;
			}
		},{
			field : "SUBMIT_SIT",
			title : "已提交SIT",
			align : "center",
			footerFormatter : function(value, row, index) {
			    var count=0;
			    for( var i in value){
			    	count +=value[i].SUBMIT_SIT;
			    }
			    return count;
			}
		}, {
			field : "PASS_SIT",
			title : "已通过SIT",
			align : "center",
			footerFormatter : function(value, row, index) {
			    var count=0;
			    for( var i in value){
			    	count +=value[i].PASS_SIT;
			    }
			    return count;
			}
		},
	    {
			field : "PASS_UAT",
			title : "已通过UAT",
			align : "center",
			footerFormatter : function(value, row, index) {
			    var count=0;
			    for( var i in value){
			    	count +=value[i].PASS_UAT;
			    }
			    return count;
			}
		}, {
			field : "SUBMIT_DROP_APPROVE",
			title : "已提交投产审批",
			align : "center",
			footerFormatter : function(value, row, index) {
			    var count=0;
			    for( var i in value){
			    	count +=value[i].SUBMIT_DROP_APPROVE;
			    }
			    return count;
			}
		}, {
			field : "COMPLETE",
			title : "已完成投产",
			align : "center",
			footerFormatter : function(value, row, index) {
			    var count=0;
			    for( var i in value){
			    	count +=value[i].COMPLETE;
			    }
			    return count;
			}
		}]
	});
	
	//子需求清单列表显示
	var table_demand=currTab.find("#childDemand_table");
	var queryParam=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	var TabCall=getMillisecond();
	table_demand.bootstrapTable({
		//请求后台的URL（*）
		url : dev_construction+'versionexecute/queryListChildDemand.asp?SID='+SID+'&call='+TabCall+'&version_id='+version_id,
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParam,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [10,15],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "DRAFT_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		jsonpCallback:TabCall,
		columns : 
		[{
			field : 'Number',
			title : '序号',
			align : "center",			
			sortable: true,
			formatter: function (value, row, index) {
				return index+1;
			}
		},{
			field : 'SYSTEM_NAME',
			title : '应用名称',
			align : "center"
		}, {
			field : "SUB_REQ_NAME",
			title : "子需求名称",
			align : "center"
		}, {
			field : "SUB_REQ_STATUS",
			title : "子需求状态",
			align : "center"
		}, {
			field : "DETAIL_DESIGN",
			title : "提出人",
			align : "center"
		},{
			field : "PROJECT_MAN_NAME",
			title : "归属项目经理",
			align : "center"
		}]
	});
	//tab4
	//项目成员信息列表显示
	var tableTab=currTab.find("#project_man_table");
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	var tableTabCall=getMillisecond();
	tableTab.bootstrapTable({
		//请求后台的URL（*）
		url : dev_construction+'versionexecute/queryListProjectMan.asp?SID='+SID+'&call='+tableTabCall+'&version_id='+version_id,
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [10,15],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "DRAFT_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		//showFooter:true,//统计列的总和
		jsonpCallback:tableTabCall,
		columns : 
		[{
			field : 'Number',
			title : '序号',
			align : "center",			
			sortable: true,
			formatter: function (value, row, index) {
				return index+1;
			}
		},{
			field : 'OP_NAME',
			title : '姓名',
			align : "center"
		}, {
			field : "OP_JOB",
			title : "角色",
			align : "center"
		}, {
			field : "PLAN_START_TIME",
			title : "投入开始日期",
			align : "center"
		}, {
			field : "PLAN_END_TIME",
			title : "投入结束日期",
			align : "center"
		},{
			field : "ENTER_METHOD",
			title : "投入方式",
			align : "center"
		}, {
			field : "OP_PHONE",
			title : "联系电话",
			align : "center"
		},
	    {
			field : "SUPPLIER_ID",
			title : "公司名称",
			align : "center"
		}, {
			field : "SUBMIT_DROP_APPROVE",
			title : "所属部门",
			align : "center"
		}]
	});
	
	//项目干系人列表显示
	var table_responsibility=currTab.find("#table_ProjectResponsibility");
	var queryParam=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	var responCall=getMillisecond();
	table_responsibility.bootstrapTable({
		//请求后台的URL（*）
		url : dev_construction+'versionexecute/queryListProjectResponsibility.asp?SID='+SID+'&call='+responCall+'&version_id='+version_id,
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParam,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [10,15],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "DRAFT_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		jsonpCallback:responCall,
		columns : 
		[{
			field : 'Number',
			title : '序号',
			align : "center",			
			sortable: true,
			formatter: function (value, row, index) {
				return index+1;
			}
		},{
			field : 'USER_NAME',
			title : '姓名',
			align : "center"
		}, {
			field : "USER_POST",
			title : "角色",
			align : "center"
		}, {
			field : "COMPANY_NAME",
			title : "公司名称",
			align : "center"
		}, {
			field : "DETAIL_DESIGN",
			title : "部门名称",
			align : "center"
		},{
			field : "USER_MOBILE",
			title : "联系电话",
			align : "center"
		}]
	});
	//tab5
	//故障清单列表显示
	var tableFault=currTab.find("#fault_list_table");
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	var fault_tableTabCall=getMillisecond();
	tableFault.bootstrapTable({
		//请求后台的URL（*）
		url : dev_construction+'versionexecute/queryListProjectFault.asp?SID='+SID+'&call='+fault_tableTabCall+'&version_id='+version_id,
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [10,15],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "DRAFT_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		//showFooter:true,//统计列的总和
		jsonpCallback:fault_tableTabCall,
		columns : 
		[{
			field : 'Number',
			title : '序号',
			align : "center",			
			sortable: true,
			formatter: function (value, row, index) {
				return index+1;
			}
		},{
			field : 'PROEJCT_MAN_NAME',
			title : '故障编号',
			align : "center"
		}, {
			field : "MAN_ROLE",
			title : "故障名称",
			align : "center"
		}, {
			field : "GENERAL_DESIGN",
			title : "故障等级",
			align : "center"
		}, {
			field : "DETAIL_DESIGN",
			title : "故障引入版本",
			align : "center"
		},{
			field : "SUBMIT_SIT",
			title : "故障引入需求",
			align : "center"
		}, {
			field : "PASS_SIT",
			title : "故障解决状态",
			align : "center"
		},
	    {
			field : "PASS_UAT",
			title : "解决时间",
			align : "center"
		}]
	});
	
	//不符合项列表显示
	var table_inconformity=currTab.find("#table_inconformity");
	var queryParam=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	var inconformityCall=getMillisecond();
	table_inconformity.bootstrapTable({
		//请求后台的URL（*）
		url : dev_construction+'versionexecute/queryListProjectInconformity.asp?SID='+SID+'&call='+inconformityCall+'&version_id='+version_id,
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParam,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [10,15],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "DRAFT_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		jsonpCallback:inconformityCall,
		columns : 
		[{
			field : 'Number',
			title : '序号',
			align : "center",			
			sortable: true,
			formatter: function (value, row, index) {
				return index+1;
			}
		},{
			field : 'QUALITY_DESC',
			title : '不符合项描述',
			align : "center"
		}, {
			field : "TYP",
			title : "不符合项分类",
			align : "center"
		}, {
			field : "PHASES",
			title : "阶段",
			align : "center"
		}, {
			field : "PROCESS",
			title : "所属过程",
			align : "center"
		},{
			field : "GRADE",
			title : "不符合项等级",
			align : "center"
		},{
			field : "STATUS",
			title : "不符合项状态",
			align : "center"
		},{
			field : "FIND_DATE",
			title : "发现日期",
			align : "center"
		},{
			field : "DUTY_USER_ID",
			title : "责任人",
			align : "center"
		},{
			field : "DISPOSE_PLAN_TIME",
			title : "计划解决日期",
			align : "center"
		},{
			field : "REALITY_FINISH_TIME",
			title : "实际解决日期",
			align : "center"
		},{
			field : "CHECKING_USER_ID",
			title : "验证人",
			align : "center"
		},{
			field : "PROJECT_MAN_NAME",
			title : "验证日期",
			align : "center"
		}]
	});
	//tab6
	//风险清单列表显示
	var tableRisk=currTab.find("#risk_table");
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	var risk_tableTabCall=getMillisecond();
	tableRisk.bootstrapTable({
		//请求后台的URL（*）
		url : dev_construction+'versionexecute/queryListVersionRisk.asp?SID='+SID+'&call='+risk_tableTabCall+'&version_id='+version_id,
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [10,15],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "DRAFT_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		//showFooter:true,//统计列的总和
		jsonpCallback:risk_tableTabCall,
		columns : 
		[{
			field : 'Number',
			title : '序号',
			align : "center",			
			sortable: true,
			formatter: function (value, row, index) {
				return index+1;
			}
		},{
			field : 'PROJECT_NAME',
			title : '项目名称',
			align : "center"
		},{
			field : 'RISK_DESC',
			title : '风险描述',
			align : "center"
		}, {
			field : "SECOND_CLASSIFY_NAME",
			title : "风险类型",
			align : "center"
		}, {
			field : "RISK_PROBABILITY_NAME",
			title : "可能性",
			align : "center"
		}, {
			field : "PRIORITY_NAME",
			title : "优先级",
			align : "center"
		},{
			field : "PRESENT_TIME",
			title : "提出时间",
			align : "center"
		}, {
			field : "PRESENT_USER_ID",
			title : "提出人",
			align : "center"
		},{
			field : "DUTY_USER_ID",
			title : "责任人",
			align : "center"
		},{
			field : "RISK_STATUS_NAME",
			title : "状态",
			align : "center"
		},{
			field : "CLOSE_DATE",
			title : "关闭时间",
			align : "center"
		}]
	});
	
	//不符合项列表显示
	var table_problem=currTab.find("#table_problem");
	var queryParam=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	var problemCall=getMillisecond();
	table_problem.bootstrapTable({
		//请求后台的URL（*）
		url : dev_construction+'versionexecute/queryListVersionProblem.asp?SID='+SID+'&call='+problemCall+'&version_id='+version_id,
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParam,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [10,15],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "DRAFT_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		jsonpCallback:problemCall,
		columns : 
		[{
			field : 'Number',
			title : '序号',
			align : "center",			
			sortable: true,
			formatter: function (value, row, index) {
				return index+1;
			}
		},{
			field : 'PROJECT_NAME',
			title : '项目名称',
			align : "center"
		},{
			field : 'RISK_DESC',
			title : '问题描述',
			align : "center"
		}, {
			field : "SECOND_CLASSIFY_NAME",
			title : "问题类型",
			align : "center"
		}, {
			field : "PONDERANCE_NAME",
			title : "严重级别",
			align : "center"
		}, {
			field : "PRIORITY_NAME",
			title : "优先级",
			align : "center"
		},{
			field : "PRESENT_TIME",
			title : "提出时间",
			align : "center"
		},{
			field : "PRESENT_USER_ID",
			title : "提出人",
			align : "center"
		},{
			field : "DUTY_USER_ID",
			title : "责任人",
			align : "center"
		},{
			field : "RISK_STATUS_NAME",
			title : "状态",
			align : "center"
		},{
			field : "CLOSE_DATE",
			title : "关闭时间",
			align : "center"
		}]
	});
	//tab7
	//tab8
	//工作量确认信息列表显示
	var workload_table=currTab.find("#workload_table");
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	var workloadCall=getMillisecond();
	workload_table.bootstrapTable({
		//请求后台的URL（*）
		url : dev_construction+'versionexecute/queryListVersionWorkload.asp?SID='+SID+'&call='+workloadCall+'&version_id='+version_id,
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [10,15],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "DRAFT_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		//showFooter:true,//统计列的总和
		jsonpCallback:workloadCall,
		columns : 
		[{
			field : 'Number',
			title : '序号',
			align : "center",			
			sortable: true,
			formatter: function (value, row, index) {
				return index+1;
			}
		},{
			field : 'PROEJCT_MAN_NAME',
			title : '工作量确认单名称',
			align : "center"
		}, {
			field : "MAN_ROLE",
			title : "开始时间",
			align : "center"
		}, {
			field : "GENERAL_DESIGN",
			title : "结束时间",
			align : "center"
		}, {
			field : "DETAIL_DESIGN",
			title : "确认工作量",
			align : "center"
		},{
			field : "SUBMIT_SIT",
			title : "确认结算金额",
			align : "center"
		}, {
			field : "PASS_SIT",
			title : "扣款金额",
			align : "center"
		},{
			field : "PASS_UAT",
			title : "实付金额",
			align : "center"
		}]
	});
	
	//派单信息列表显示
	var table_dispatch=currTab.find("#table_dispatch");
	var queryParam=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	var dispatchCall=getMillisecond();
	table_dispatch.bootstrapTable({
		//请求后台的URL（*）
		url : dev_construction+'versionexecute/queryListVersionDispatch.asp?SID='+SID+'&call='+dispatchCall+'&version_id='+version_id,
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParam,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [10,15],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "DRAFT_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		jsonpCallback:dispatchCall,
		columns : 
		[{
			field : 'Number',
			title : '序号',
			align : "center",			
			sortable: true,
			formatter: function (value, row, index) {
				return index+1;
			}
		},{
			field : 'SYSTEM_NAME',
			title : '派单名称',
			align : "center"
		}, {
			field : "SUB_REQ_NAME",
			title : "开始时间",
			align : "center"
		}, {
			field : "SUB_REQ_STATUS",
			title : "结束时间",
			align : "center"
		}, {
			field : "DETAIL_DESIGN",
			title : "确认工作量",
			align : "center"
		},{
			field : "PROJECT_MAN_NAME",
			title : "确认结算金额",
			align : "center"
		},{
			field : "PROJECT_MAN_NAME",
			title : "扣款金额",
			align : "center"
		},{
			field : "PROJECT_MAN_NAME",
			title : "实付金额",
			align : "center"
		}]
	});
	//付款信息列表显示
	var table_payment_info=currTab.find("#table_payment_info");
	var queryParam=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	var paymentCall=getMillisecond();
	table_payment_info.bootstrapTable({
		//请求后台的URL（*）
		url : dev_construction+'versionexecute/queryListVersionPayment.asp?SID='+SID+'&call='+paymentCall+'&version_id='+version_id,
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParam,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [10,15],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "DRAFT_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		jsonpCallback:paymentCall,
		columns : 
		[{
			field : 'Number',
			title : '序号',
			align : "center",			
			sortable: true,
			formatter: function (value, row, index) {
				return index+1;
			}
		},{
			field : 'SYSTEM_NAME',
			title : '付款条件',
			align : "center"
		}, {
			field : "SUB_REQ_NAME",
			title : "预计应付金额",
			align : "center"
		}, {
			field : "SUB_REQ_STATUS",
			title : "扣款金额",
			align : "center"
		}, {
			field : "DETAIL_DESIGN",
			title : "实际应付金额",
			align : "center"
		},{
			field : "PROJECT_MAN_NAME",
			title : "支付状态",
			align : "center"
		},{
			field : "PROJECT_MAN_NAME",
			title : "实际支付金额",
			align : "center"
		},{
			field : "PROJECT_MAN_NAME",
			title : "实际支付日期",
			align : "center"
		}]
	});
	//tab9
}

