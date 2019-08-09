//初始化字典项
(function(){
	initSelect(getCurrentPageObj().find("#statu_id"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_CONFIG_APPLY"});
})();
//获取时间戳
var queryList_call = getMillisecond()+'2';

//初始化页面按钮
function initConfigAccept(){
	var currTab = getCurrentPageObj();
	var table = currTab.find("#ConfigAcceptingInfoTable");
	//重置按钮
	getCurrentPageObj().find("#reset").click(function() {
		getCurrentPageObj().find("#configAcceptForm input").val("");
		getCurrentPageObj().find("#configAcceptForm select").val(" ").select2();
	});

	
	//配置库确认按钮 
	currTab.find('#configAccept').click(function(){
		var selects = getCurrentPageObj().find("#ConfigAcceptingInfoTable").bootstrapTable("getSelections");
		if(selects.length == 0) {
			alert("请选择一条数据进行操作！");
			return;
		}
		closePageTab("config_Confirm");
		openInnerPageTab("config_Confirm","配置库确认","dev_resourceManage/Configuration_database/ConfigurationConfirm_add.html",function(){
			initTableInfo(selects[0].CONFIG_ID);
		});
		
	});
	
	
	//配置管理员pop
	$('#APPconfig_man_name').click(function(){
		openAppUserPop("app_user_add",{no:getCurrentPageObj().find("#applicate_id"),name:getCurrentPageObj().find("#APPconfig_man_name")},"0021");
	});
	
	//查询按钮
	currTab.find("#queryConfigAccepting").click(function() {
		currTab.find('#ConfigAcceptingInfoTable').bootstrapTable('refresh',{url:getConfigUrl()
		});
	});
	//enter触发查询
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#queryConfigAccepting").click();});
	
	//查看按钮
	getCurrentPageObj().find('#configInfo').click(function(){
		var selects = getCurrentPageObj().find("#ConfigAcceptingInfoTable").bootstrapTable("getSelections");
		if(selects.length == 0) {
			alert("请选择一条数据进行操作！");
			return;
		}
		closeAndOpenInnerPageTab("config_info","查看配置信息","dev_resourceManage/Configuration_database/ConfigurationConfirm_queryInfo.html",function(){
			initTableInfo(selects[0].CONFIG_ID);
		});
	});

	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	table.bootstrapTable({
			//请求后台的URL（*）
			url :getConfigUrl(),
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
			uniqueId : "CONFIG_ID", // 每一行的唯一标识，一般为主键列
			cardView : false, // 是否显示详细视图
			detailView : false, // 是否显示父子表
			jsonpCallback:queryList_call,
			singleSelect : true,// 复选框单选
			onLoadSuccess : function(data){
				gaveInfo();
			},
			columns : [ {	
				checkbox : true,
				rowspan : 2,
				align : 'center',
				valign : 'middle'
			},{
				
				field : "SYSTEM_NAME",
				title : "应用名称",
				align : "center"
			},{
				field : "SYSTEM_SHORT",
				title : "应用简称",
				align : "center"
			},{
				field: 'APPLICANT_NAME',
				title : '申请人',
				align: 'center'
			},{
				field: 'CONFIG_MAN_NAME',
				title : '配置管理员',
				align: 'center'
			},{
				field: 'PROJECT_MAN_NAME',
				title : '项目经理',
				align: 'center'
			},{
				field: 'STATU_NAME',
				title : '状态',
				align: 'center',
				width : '100'
			},{
				field: 'APP_TIME',
				title : '申请时间',
				align: 'center'
			}
			]
		});

};


//组装查询url 
function getConfigUrl(){
	var url = dev_resource+'ConfigApply/queryConfigConfirm.asp?call='+queryList_call+'&SID='+SID;
	var param = getCurrentPageObj().find("#configAcceptForm").serialize();
	return url+"&"+param;
}

initConfigAccept();


