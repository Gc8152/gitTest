//初始化字典项
//(function(){
//	initSelect(getCurrentPageObj().find("[name='inter_app_status']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"I_DIC_INTER_APP_STATUS"});
//})();
//获取时间戳
var queryList_call = getMillisecond()+'2';
//初始化页面按钮
function interfaceESBUseAnalysedTest(){
	var backlog_status = 'backlog';
	var $page = getCurrentPageObj();
	var currTab = getCurrentPageObj();
	var table = currTab.find("#interDesignTable");
	//重置按钮
	getCurrentPageObj().find("#reset").click(function() {
		getCurrentPageObj().find("#interDesignForm input").val("");

	});
	
	//接口设计
	currTab.find('#inter_Design').click(function(){
		//此处判断是新增接口还是已有接口，转向不行的url
		var seles = table.bootstrapTable("getSelections");
		if(seles.length!=1){
			alert("请选择一条数据进行设计!");
			return;
		}
		url = "dev_application/serInterDesign/interDesign_edit.html";
		closeAndOpenInnerPageTab("interDesignEdit", "新建接口设计",url, function(){
			initDesignDetail(seles[0]);
		});

	});
	

	//查询按钮
	getCurrentPageObj().find("#queryInterDesign").click(function() {
		currTab.find('#interDesignTable').bootstrapTable('refresh',{url:getDesignUrl(backlog_status)
		
		});
	
	});

	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#queryInterDesign").click();});
	
	//消费方 pop框按钮
	$page.find("[name='consumer_name']").click(function(){
		var $name = $page.find("[name='consumer_name']");
		var $id = $page.find("[name='con_system_id']");
		var $systemPop = $page.find("[mod='systemPop']");
		query_systemPop($systemPop, {id : $id, name : $name});
	});
	
	//服务方 pop框按钮
	$page.find("[name='ESBvice_name']").click(function(){
		var $name = $page.find("[name='ESBvice_name']");
		var $id = $page.find("[name='con_system_id']");
		var $systemPop = $page.find("[mod='systemPop']");
		query_systemPop($systemPop, {id : $id, name : $name});
	});
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
			url :getDesignUrl(backlog_status),
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
				field: 'APP_INTER_NUM',
				title : '申请单编号',
				align: 'center',
				width : '150'
			},{
				field: 'APP_TYPE_NAME',
				title : '申请类型',
				align: 'center'
			},{
				field : "INTER_CODE",
				title : "接口编号",
				align : "center",
				width : '100'
			},{
				field : "INTER_NAME",
				title : "接口名称",
				align : "center"
			},{
				field : "INTER_APP_STATUS_NAME",
				title : "接口申请状态",
				align : "center"
			},{
				field : "CON_SYSTEM_NAME",
				title : "消费方应用名称",
				align : "center"
			}, {
				field : 'SER_SYSTEM_NAME',
				title : '服务方应用名称',
				align : "center"
			}, {
				field : "APP_REASON",
				title : "申请原因",
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
				field : "APP_TIME",
				title : "申请日期",
				align : "center",
				width : '200'
			}

			]
		});
}

//组装查询url 
function getDesignUrl(backlog_status){
	var url = dev_application+'IDesign/queryLessDesignList.asp?call='+queryList_call+'&SID='+SID+'&backlog_status='+backlog_status;
	var param = getCurrentPageObj().find("#interDesignForm").serialize();
	/*var queryCondition = getCurrentPageObj().find("#InterDesignForm [name]");
	for(var i=0; i<queryCondition.length; i++){
		var obj=$(queryCondition[i]);
		if($.trim(obj.val())!=""){
			url+='&'+obj.attr("name")+"="+escape(encodeURIComponent(obj.val()));
		}
	}*/
	return url+"&"+param;
}


