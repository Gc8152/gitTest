//初始化字典项
(function(){
	initSelect(getCurrentPageObj().find("[name='app_type']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"I_DIC_INTER_APP_TYPE"});
})();
//获取时间戳
var queryList_call = getMillisecond()+'2';
//初始化页面按钮
function interfaceESBUseAnalysedTest(){
	var currTab = getCurrentPageObj();
	var table = currTab.find("#ESBAnalysedInfoTable");
	//重置按钮
	getCurrentPageObj().find("#reset").click(function() {
		getCurrentPageObj().find("#ESBUseAnalysedQueryForm input").val("");
		getCurrentPageObj().find("#ESBUseAnalysedQueryForm select").val(" ").select2();
	});
	
	//接口申请分析按钮 
	currTab.find('#inter_Analyse').click(function(){
		//此处判断是新增接口还是已有接口，转向不行的url
		var seles = table.bootstrapTable("getSelections");
		if(seles.length!=1){
			alert("请选择一条数据进行分析!");
			return;
		}
		url = "dev_application/ESBUseInterAnalyse/ESBUseAnalysed_queryInfo.html";
		closeAndOpenInnerPageTab("ESBAnalysed", "ESB接口申请分析",url, function(){
			initESBAnalyDetail(seles[0]);

			var modObj = getCurrentPageObj().find("#AnlyseInterInfo_table1");
			if(seles[0].APP_TYPE=='01'){
				inter360initAttrTable(seles[0].INTER_ID,seles[0].INTER_VERSION,modObj,"table[tb=AnlyseInterInfo] tbody","");
			}else{
				inter360initAttrTable("","",modObj,"table[tb=AnlyseInterInfo] tbody",seles[0].APP_ID);
			}	
		});

	});
	
	//接口打回
	currTab.find('[btn="esb_return"]').click(function(){
		var seles = table.bootstrapTable("getSelections");
		if(seles.length!=1){
			alert("请选择一个接口!");
			return;
		}
		if(seles[0].APP_TYPE == '01'){
			alert("现有接口不可以打回!");
 			return;
		}
		currTab.find("#esb_inter_return").modal('show');
		currTab.find("[name='R.APP_ID']").val(seles[0].APP_ID);
		currTab.find("[name='R.APP_TYPE']").val(seles[0].APP_TYPE);
		currTab.find("[name='R.RECORD_APP_NUM']").val(seles[0].RECORD_APP_NUM);
	});
	
	//接口打回
	currTab.find('[btn="close_modal"]').click(function(){
		currTab.find("#esb_inter_return").modal('hide');
	});
	
	//保存接口打回
	currTab.find('[btn="save_modal"]').click(function(){
		var params = getPageParam("R");
		var reCall = getMillisecond();
		var url = dev_application+'IAnalyse/esbReturn.asp?call='+reCall+'&SID='+SID;
			baseAjaxJsonp(url, params, function(data){
				if (data != undefined&&data!=null&&data.result=="true") {
					alert("保存成功！",function(){
						getCurrentPageObj().find("[name^='R.']").val("");
						currTab.find('#ESBAnalysedInfoTable').bootstrapTable('refresh',{url:getESBAnayseUrl()
						});//刷新表
					});
				} else {
					alert("操作失败");
				}
			}, reCall);
			currTab.find("#esb_inter_return").modal('hide');	
	});
		
	//接口信息导出
	currTab.find("[btn='inter_export']").click(function(){
		var param = getCurrentPageObj().find("#ESBUseAnalysedQueryForm").serialize();
		var url = 'messimport/exportEsbInter.asp?&SID='+SID+'&'+param;
		window.location.href = url;
	});
		
	
	//查询按钮
	currTab.find("#queryESBUseAnalysed").click(function() {
		currTab.find('#ESBAnalysedInfoTable').bootstrapTable('refresh',{url:getESBAnayseUrl()
		});
	});
	//enter触发查询
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#queryESBUseAnalysed").click();});
	
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

	
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	table.bootstrapTable("destroy").bootstrapTable({
			//请求后台的URL（*）
			url :getESBAnayseUrl(),
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
			jsonpCallback:queryList_call,
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
				field : "REQ_TASK_CODE",
				title : "关联任务编号",
				align : "center",
			    width : '180',
			    formatter:function(value,row,index){
			    	if(value==undefined){
			    		return '';
			    	}else{
			    		return '<a style="color:blue" href="javascript:void(0)" onclick="openReqTaskDetailEsb(\''+row.REQ_TASK_ID+'\')";>'+value+'</a>';
			    	}
			    }
			},{
				field: 'INTER_NAME',
				title : '接口名称',
				align: 'center',
				width : '120'
			},{
				field: 'TRADE_CODE',
				title : '接口交易码',
				align: 'center',
				width : '150'
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
			    		return '<a style="color:blue" href="javascript:void(0)" onclick="openReqTaskDetailEsb(\''+row.ESB_REQ_ID+'\')";>'+value+'</a>';
			    	}
			    }
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

//initESBUseAnalysedInfo();
interfaceESBUseAnalysedTest();

//组装查询url 
function getESBAnayseUrl(){
	var url = dev_application+'IAnalyse/queryAnalyseList.asp?call='+queryList_call+'&SID='+SID;
	var param = getCurrentPageObj().find("#ESBUseAnalysedQueryForm").serialize();
	return url+"&"+param;
}

//打开任务详情页面
function openReqTaskDetailEsb(req_task_id){
	closeAndOpenInnerPageTab("req_taskDetail","任务详情页面","dev_construction/requirement/requirement_analyze/task_accept/task_detail.html",function(){
		initReqTaskDetailLayout(req_task_id);
	  });
}

