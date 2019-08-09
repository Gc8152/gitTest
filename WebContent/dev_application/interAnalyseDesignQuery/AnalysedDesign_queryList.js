//初始化字典项
(function(){
	initSelect(getCurrentPageObj().find("[name='app_type']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"I_DIC_INTER_APP_TYPE"});
	var arr =['00'];
	initSelect(getCurrentPageObj().find("[name='inter_app_status']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"I_DIC_INTER_APP_STATUS"},null,null,arr);
	
	
})();
//获取时间戳
var queryList_call1 = getMillisecond()+'3';
//初始化页面按钮
function interfaceAnalysedDesignTest(){
	var currTab = getCurrentPageObj();
	var table = currTab.find("#AnalysedDesignInfoTable");
	//重置按钮
	getCurrentPageObj().find("#reset").click(function() {
		getCurrentPageObj().find("#AnalysedDesignQueryForm input").val("");
		var selects = getCurrentPageObj().find("#AnalysedDesignQueryForm select");
		selects.val(" ");
		selects.select2();

	});
	
	//接口申请分析查看按钮 
	currTab.find('#inter_Analyse_info').click(function(){
		//此处判断是新增接口还是已有接口，转向不行的url
		var seles = table.bootstrapTable("getSelections");
		if(seles.length!=1){
			alert("请选择一条数据查看!");
			return;
		}
		url = "dev_application/interAnalyseDesignQuery/AnalysedDesign_queryInfo.html";
		closeAndOpenInnerPageTab("AnalynedDesign", "申请信息查询",url, function(){
			initAnalyDesignDetail(seles[0],"view");
			var modObj = getCurrentPageObj().find("#AnlyseInterInfo_table1");
			if(seles[0].APP_TYPE != "00"){//非新建接口通过接口id与版本查询属性信息
				inter360initAttrTable(seles[0].INTER_ID,seles[0].INTER_VERSION,modObj,"table[tb=AnlyseInterInfo] tbody","");
			}else{//新建接口通过app_id查询属性信息
				inter360initAttrTable("","",modObj,"table[tb=AnlyseInterInfo] tbody",seles[0].APP_ID);
			}
			getCurrentPageObj().find("input,select,textarea").not("[name='closePageTabConfirm']").attr("disabled","disabled");
			getCurrentPageObj().find("#submitAnalyse").hide();
		});

	

	});


	//查询按钮
	currTab.find("#queryAnalysedDesign").click(function() {
		currTab.find('#AnalysedDesignInfoTable').bootstrapTable('refresh',{url:getAnayseDesignUrl1()
		});
		});
	//enter触发查询
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#queryAnalysedDesign").click();});
	
	//消费方 pop框按钮
	currTab.find("[name='consumer_name']").click(function(){
		var $name = currTab.find("[name='consumer_name']");
		var $id = currTab.find("[name='con_system_id']");
		var $systemPop = currTab.find("[mod='systemPop']");
		query_systemPop($systemPop, {id : $id, name : $name});
	});
	
	//服务方 pop框按钮
	currTab.find("[name='ESBvice_name']").click(function(){
		var $name = currTab.find("[name='ESBvice_name']");
		var $id = currTab.find("[name='con_system_id']");
		var $systemPop = currTab.find("[mod='systemPop']");
		query_systemPop($systemPop, {id : $id, name : $name});
	});
//};
//
//
////初始化页面table  
//function initESBUseAnalysedInfo() {
	
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	table.bootstrapTable("destroy").bootstrapTable({
			//请求后台的URL（*）
			url :getAnayseDesignUrl1(),
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
			uniqueId : "SYSTEM_ID", // 每一行的唯一标识，一般为主键列
			cardView : false, // 是否显示详细视图
			detailView : false, // 是否显示父子表
			jsonpCallback:queryList_call1,
			singleSelect : true,// 复选框单选
			onLoadSuccess : function(data){
				gaveInfo();
			},
			columns : [ {	
				checkbox:true,
				rowspan: 2,
				align: 'center',
				valign: 'middle'
			},{
				field: 'APP_INTER_NUM',
				title : '接口申请编号',
				align: 'center',
				width : '150'
			},{
				field : "REQ_TASK_CODE",
				title : "关联任务编号",
				align : "center",
			    width : '180',
			    formatter:function(value,row,index){
			    	if(value==undefined){
			    		return '';
			    	}else{
			    		return '<a style="color:blue" href="javascript:void(0)" onclick="openReqTaskDetaili(\''+row.REQ_TASK_ID+'\')";>'+value+'</a>';
			    	}
			    }
			},{
				field: 'APP_TYPE_NAME',
				title : '申请类型',
				align: 'center'
			},{
				field : "INTER_APP_STATUS_NAME",
				title : "接口申请状态",
				align : "center"
			},{
				field : "ESB_REQ_CODE",
				title : "ESB任务编号",
				align : "center",
			    width : '180',
			    formatter:function(value,row,index){
			    	if(value == undefined){
			    		return '';
			    	}else{
			    		return '<a style="color:blue" href="javascript:void(0)" onclick="openReqTaskDetaili(\''+row.ESB_REQ_ID+'\')";>'+value+'</a>';
			    	}
			    }
			},{
				field : "INTER_CODE",
				title : "接口编号",
				align : "center",
			    width : '100'
			},{
				field : "TRADE_CODE",
				title : "接口交易码",
				align : "center",
			    width : '100'
			},{
				field : "INTER_NAME",
				title : "接口名称",
				align : "center"
			},{
				field : "CON_SYSTEM_NAME",
				title : "消费方应用名称",
				align : "center"
			}, {
				field : 'SER_SYSTEM_NAME',
				title : '服务方应用名称',
				align : "center"
			},{
				field : "REQ_FINISH_TIME",
				title : "要求完成日期",
				align : "center"
			}, {
				field : "APP_USER_NAME",
				title : "申请人",
				align : "center"
				
			}, {
				field : "CURRENT_MAN2",
				title : "当前处理人",
				align : "center"
			}, {
				field : "APP_TIME",
				title : "申请日期",
				align : "center",
				width : '200'
			}
			]
		});

};

interfaceAnalysedDesignTest();
//组装查询url 
function getAnayseDesignUrl1(){
	var url = dev_application+'IAnalyse/queryAnalyseListAll.asp?call='+queryList_call1+'&SID='+SID;
	//var queryCondition = getCurrentPageObj().find("#AnalysedDesignQueryForm [name]");
	var param = getCurrentPageObj().find("#AnalysedDesignQueryForm").serialize();
	return url+"&"+param;
}


//打开任务详情页面
function openReqTaskDetaili(req_task_id){
	closeAndOpenInnerPageTab("req_taskDetail","任务详情页面","dev_construction/requirement/requirement_analyze/task_accept/task_detail.html",function(){
		initReqTaskDetailLayout(req_task_id);
	  });
}
