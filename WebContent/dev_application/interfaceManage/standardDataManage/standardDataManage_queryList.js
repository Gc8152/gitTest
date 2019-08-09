//按钮方法
function initStandardDataClickButtonEvent(){
	//查询
	var quaryStandardCall1=getMillisecond();
	initStandardDataManageInfo(quaryStandardCall1);
	getCurrentPageObj().find("#queryStandardData").unbind("click");
	getCurrentPageObj().find("#queryStandardData").click(function(){	
		var params = getCurrentPageObj().find("#InterAttrQueryForm").serialize();
		getCurrentPageObj().find("#IStandardDataTableInfo").bootstrapTable('refresh',
				{url:dev_application+'StandardDataManage/queryStandardDataManage.asp?call='+quaryStandardCall1+'&SID='+SID
					+"&"+params});		
	});
	//enter触发查询
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#queryStandardData").click();});
	//重置
	getCurrentPageObj().find('#resetStandardData').click(function() {
		getCurrentPageObj().find("#data_chnname").val("");
		getCurrentPageObj().find("#data_engname").val("");		
		getCurrentPageObj().find("#data_type").val(" ");
		getCurrentPageObj().find("#data_type").select2();
	});	
	//新增
	getCurrentPageObj().find("#standard_add").unbind("click");
	getCurrentPageObj().find("#standard_add").click(function(){		
		closeAndOpenInnerPageTab("standardData_add","新增标准数据","dev_application/interfaceManage/standardDataManage/standardDataManage_add.html");
	});			
	//修改
	getCurrentPageObj().find("#standard_update").unbind("click");
	getCurrentPageObj().find("#standard_update").click(function(){
		var selection = getCurrentPageObj().find("#IStandardDataTableInfo").bootstrapTable('getSelections');
		if(selection.length != 1) {
			alert("请选择一条数据进行操作!");
			return;
		}
		var ids = $.map(selection, function (row) {
			return row.DATA_ID;     
		});				
		closeAndOpenInnerPageTab("standardData_update","修改标准数据","dev_application/interfaceManage/standardDataManage/standardDataManage_update.html",function(){
			initUpdateStandardDataInfo(ids);			
		});
	});			
	//删除
	$("#standard_delete").click(function(){
		var id = $("#IStandardDataTableInfo").bootstrapTable('getSelections');
		var ids = $.map(id, function (row) {
			return row.DATA_ID;                  
		});
		if(id.length!=1){
			alert("请选择一条数据进行删除!");
			return ;
		}
		nconfirm("确定要删除该数据吗？",function(){
			$("#IstandardDataTableInfo").bootstrapTable('remove', {
				field: 'DATA_ID',
				values: ids
			});
			var quaryStandardCall3=getMillisecond();
			var url=dev_application+"StandardDataManage/deleteStandardDataManage.asp?call="+quaryStandardCall3+"&SID="+SID+"&data_id="+ids;
			baseAjaxJsonp(url, null , function(data) {
				if (data != undefined&&data!=null&&data.result=="true") {
					alert("删除成功！");
					getCurrentPageObj().find("#IStandardDataTableInfo").bootstrapTable('refresh',
						{url:dev_application+'StandardDataManage/queryStandardDataManage.asp?call='+quaryStandardCall1+'&SID='+SID});
				}else{	
					alert("删除失败！");
				}	
			},quaryStandardCall3);					
		});
	});	
};

//查询列表显示table
function initStandardDataManageInfo(quaryStandardCall1) {
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$("#IStandardDataTableInfo").bootstrapTable(
			{
				//请求后台的URL（*）
				url : dev_application+'StandardDataManage/queryStandardDataManage.asp?call='+quaryStandardCall1+'&SID='+SID,
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
				uniqueId : "user_no", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				jsonpCallback:quaryStandardCall1,
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
				},{
					field : '',
					title : '序号',	
					align : "center",
					width : "80",
					sortable: true,
					formatter: function (value, row, index) {
						return index+1;
					}
				}, {
					field : "DATA_ID",
					title : "ID",
					width : "100",
					align : "center"
				}, {
					field : "DATA_ENGNAME",
					title : "数据名称（英文）",
					align : "center"
				}, {
					field : "DATA_CHNNAME",
					title : "数据名称（中文）",
					align : "center"
				}, {
					field : "DATA_TYPE_NAME",
					title : "数据类型",
					align : "center"
				}, {
					field : "MSG_LENGTH",
					title : "长度",
					width : "100",
					align : "center"				
				}, {
					field : "STANDARD_CODE",
					title : "标准代码",
					align : "center"
				}, {
					field : "DATA_INSTRUCTION",
					title : "说明",
					align : "center"
				} ]
			});
};
	
//字典项
function initStandardDataManageDicType(){
	//初始化数据,数据类型
	initSelect($("#data_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"I_DIC_INTER_DATA_TYPE"});
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
initStandardDataManageDicType();
initStandardDataClickButtonEvent();

//synchronizationUser();
