
initSwfiConfigQueryListLayOut();
function initSwfiConfigQueryListLayOut(){
	var swfConfigTab = getCurrentPageObj();
	var table = swfConfigTab.find("#AFTableInfo");
	
	//初始化页面下拉菜单
	initSelect(swfConfigTab.find("#af_sys_name"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"AF_DIC_SYSTEM"});
	initSelect(swfConfigTab.find("#af_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"AF_DIC_STATE"});
	
  //初始化页面按钮
  initSwfiConfigQueryListButton();
  function initSwfiConfigQueryListButton(){
	//1.新增流程按钮
	swfConfigTab.find("#addProcess").unbind().click(function() {
		openAddprocessPop("addProcessPop",{operate:"add"});
	});
	//2.修改流程按钮
	swfConfigTab.find("#updateProcess").unbind().click(function(){
		var af_id = "";
		var selRow = table.bootstrapTable("getSelections");
		if(selRow.length == 1){
			af_id = selRow[0].AF_ID;
		}else{
			alert("请选择一条数据");
			return;
		}
		openAddprocessPop("addProcessPop",{operate:"update",id:af_id});
	});
	//3.删除流程按钮
	swfConfigTab.find('#deleteProcess').click(function(){
		var af_id = '';
		var selRow = table.bootstrapTable("getSelections");
		if(selRow.length > 0){
			nconfirm("确定要删除这"+selRow.length+"条记录吗？",function () {
				af_id = selRow[0].AF_ID;
				baseAjax("AFConfig/deleteOneProcessInfo.asp?af_id="+af_id,null,function(data){
					var result = data.result;
					if(result == "true"){
						alert("删除成功");
						table.bootstrapTable('refresh');
					}else{
						alert("删除失败");
					}
				});
			});
		}else{
			alert("请选择要删除的数据");
			return ;
		}
	});
	//4.节点配置
	swfConfigTab.find("#noteConfig").unbind().click(function() {
		var selRow = table.bootstrapTable("getSelections");
		if(selRow.length ==1){
			closeAndOpenInnerPageTab("noteconfig","节点配置","pages/approvalflow/swfi/swfi_noteconfig.html",function(){
 				initNotePage(selRow[0]);
			});
		}else{
			alert("请选择一条流程配置节点");
			return ;
		}
	});
	//5.流程矩阵配置
	swfConfigTab.find("#matrixconfig").unbind().click(function() {
		var selRow = table.bootstrapTable("getSelections");
		if(selRow.length ==1){
			closeAndOpenInnerPageTab("matrixconfig","流程矩阵配置","pages/approvalflow/swfi/swfi_matrixconfig.html",function(){
 				initmatrixPage(selRow[0]);
			});
		}else{
			alert("请选择一条流程配置矩阵");
			return ;
		}
	});
	//6.查询按钮
	swfConfigTab.find("#querySqfi").click(function() {
		var af_name = $.trim(swfConfigTab.find("#af_name").val());
		var af_sys_name = $.trim(swfConfigTab.find("#af_sys_name").val());
		var af_state = $.trim(swfConfigTab.find("#af_state").val());
		$('#AFTableInfo').bootstrapTable('refresh',{url:'AFConfig/queryAllProcessInfo.asp?af_name='+
			escape(encodeURIComponent(af_name))+'&af_sys_name='+escape(encodeURIComponent(af_sys_name))+
			'&af_state='+escape(encodeURIComponent(af_state))});
	});
	//enter按键绑定查询按钮事件
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#querySqfi").click();});
	//7.重置按钮
	swfConfigTab.find("#reset").click(function() {
		swfConfigTab.find("#processForm input").val("");
		swfConfigTab.find("#processForm select").val(" ");
		swfConfigTab.find("#processForm select").select2();
	});
}
  //数据表格函数
  initAFInfo();
  function initAFInfo() {
	var af_name = $.trim(swfConfigTab.find("#af_name").val());
	var af_sys_name = $.trim(swfConfigTab.find("#af_sys_name").val());
	var af_state = $.trim(swfConfigTab.find("#af_state").val());
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	table.bootstrapTable({
		url :'AFConfig/queryAllProcessInfo.asp?af_name='+escape(encodeURIComponent(af_name))+
			'&af_sys_name='+escape(encodeURIComponent(af_sys_name))+'&af_state='+escape(encodeURIComponent(af_state)),
		method : 'get', //请求方式（*）   
		striped : true, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [5,10],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "af_id", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		columns : [{	
			checkbox:true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		},{
			field: 'AF_ID',
			title : '流程ID',
			align: 'center',
			editable: {
                type: 'text',
                title: '流程ID',
                validate: function (v) {
                    if (!v) return '用户名不能为空';
                }
            }	
		},{
			field : 'AF_NAME',
			title : '流程名称',
			align : "center"
		},{
			field : "AF_STATE",
			title : "启用状态",
			align : "center",
			visible:!1
		}, {
			field : "A_STATE",
			title : "启用状态",
			align : "center"
		}, {
			field : "AF_SYS_NAME",
			title : "所属业务系统",
			align : "center",
			visible:!1
		}, {
			field : "A_SYS_NAME",
			title : "所属业务系统",
			align : "center"
		}, {
			field : "OPT_PERSONNAME",
			title : "操作人",
			align : "center"
		}, {
			field : "OPT_TIME",
			title : "操作时间",
			align : "center"
		}]
	});
};
}
//流程配置首页初始化
var afSysParam = {
	opttype:'AF_DIC_SYSTEM'
};
var afStateParam = {
	opttype:'AF_DIC_STATE'
};