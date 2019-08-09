//按钮方法
function initClickButtonEvent(){
	var quaryAddrCall=getMillisecond();
	initAddrConfigInfo(quaryAddrCall);
	//查询
	getCurrentPageObj().find("#querySystemAddr").unbind("click");
	getCurrentPageObj().find("#querySystemAddr").click(function(){	
		var system_name = $.trim(getCurrentPageObj().find("#system_name").val());
		var system_short = $.trim(getCurrentPageObj().find("#system_short").val());
		var project_man_name = $.trim(getCurrentPageObj().find("#project_man_name").val());
		var addr_type = $.trim(getCurrentPageObj().find("#addr_type").val());
		var is_config = $.trim(getCurrentPageObj().find("#is_config").val());
		getCurrentPageObj().find("#SystemAddrTableInfo").bootstrapTable('refresh',
				{url:dev_application+'applicationManager/queryApplication.asp?call='+quaryAddrCall+'&SID='+SID+'&system_name='+escape(encodeURIComponent(system_name))
			+'&addr_type='+addr_type+'&system_short='+escape(encodeURIComponent(system_short))+'&is_config='+is_config
			+'&project_man_name='+escape(encodeURIComponent(project_man_name))
		});		
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#querySystemAddr").click();});
	//重置
	getCurrentPageObj().find('#resetSystemAddr').click(function() {
		getCurrentPageObj().find("#system_short").val("");
		getCurrentPageObj().find("#system_name").val("");	
		getCurrentPageObj().find("#project_man_name").val("");
		getCurrentPageObj().find("#addr_type").val(" ");
		getCurrentPageObj().find("#addr_type").select2();
		getCurrentPageObj().find("#is_config").val(" ");
		getCurrentPageObj().find("#is_config").select2();
	});
	
	//配置
	getCurrentPageObj().find("#testAddr_config").unbind("click");
	getCurrentPageObj().find("#testAddr_config").click(function(){
		var selection = getCurrentPageObj().find("#SystemAddrTableInfo").bootstrapTable('getSelections');
		if(selection.length != 1) {
			alert("请选择一条数据进行操作!");
			return;
		}
		var selectsInfo=JSON.stringify(selection);
		var params=JSON.parse(selectsInfo);
		closeAndOpenInnerPageTab("testAddr_config","测试地址配置","dev_application/systemAddrConfig/testAddress_config.html",function(){
			initCheck(getCurrentPageObj().find("#addrType"),{dic_code:"G_DIC_SYSTEM_CONFIG_TYPE"},"addrTypeName","addrType");
			setTimeout(function(){
				initConfigSystemAddrInfo(params[0]);
			},100);
		});
	});	
};
	
//查询列表显示table
function initAddrConfigInfo(quaryAddrCall) {
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$("#SystemAddrTableInfo").bootstrapTable(
			{
				//请求后台的URL（*）
				url :dev_application+'applicationManager/queryApplication.asp?call='+quaryAddrCall+'&SID='+SID,
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
				uniqueId : "SYSTEM_ID", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				jsonpCallback:quaryAddrCall,
				singleSelect: true,
				onLoadSuccess : function(data){
					gaveInfo();
				},
				columns : [ {
					field: 'middle',
					checkbox: true,
					rowspan: 2,
					align: 'center',
					valign: 'middle'
				}, {
					field : 'SYSTEM_ID',
					title : '应用编号',
					align : "center",
				}, {
					field : "SYSTEM_NAME",
					title : "应用名称",
					align : "center"
				}, {
					field : "SYSTEM_SHORT",
					title : "应用简称",
					align : "center"
				},{
					field : "RES_GROUP_NAME",
					title : "负责组",
					align : "center"
				}, {
					field : "PROJECT_MAN_NAME",
					title : "应用负责人",
					align : "center"
				}, {
					field : "SKILL_MAN_NAME",
					title : "技术经理",
					align : "center"
				}, {
					field : "PRODUCT_MAN_NAME",
					title : "产品经理",
					align : "center"
				}, {
					field : "ADDR_TYPE_NAME",
					title : "环境类型",
					align : "center"
				}]
			});
};
//加载字典项
function initAddrConfigDicType(){
	//初始化数据,属性类型
	initSelect($("#addr_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_SYSTEM_CONFIG_TYPE"});
	initSelect($("#is_config"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_YN"});
}	
//同步OA用户
/*function synchronizationUser(){
	$("#synchronizationUser").click(function(){
		startLoading();
		$.ajax({
			type : "post",
			url : "OA/SynchronizationUser.asp",
			dataType : "json",
			success : function(data){
				if(data="true"){
					alert("同步成功！");
					$('#SUserTableInfo').bootstrapTable('refresh',{url:'SUser/queryalluser.asp'});
					endLoading();
				}else{
					alert("同步失败！");
					endLoading();
				}
			},
			error:function(){
				alert("同步失败！");
				endLoading();
			}
		});

	});
}*/

initAddrConfigDicType();
initClickButtonEvent();
//synchronizationUser();
