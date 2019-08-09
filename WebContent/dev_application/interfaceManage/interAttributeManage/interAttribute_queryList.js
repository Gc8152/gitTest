//按钮方法
function initClickButtonEvent(){
	var quaryAttrCall=getMillisecond();
	initAttrManageInfo(quaryAttrCall);
	//查询
	getCurrentPageObj().find("#queryInterAttr").unbind("click");
	getCurrentPageObj().find("#queryInterAttr").click(function(){	
		var params = getCurrentPageObj().find("#InterAttrQuerytForm").serialize();
		getCurrentPageObj().find("#IInterAttrTableInfo").bootstrapTable('refresh',
				{url:dev_application+'InterAttrManage/queryInterAttrManage.asp?call='+quaryAttrCall+'&SID='+SID+'&'+params});		
	});
	//enter触发查询
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#queryInterAttr").click();});
	//重置
	getCurrentPageObj().find('#resetInterAttr').click(function() {
		getCurrentPageObj().find("#attr_id").val("");
		getCurrentPageObj().find("#attr_name").val("");		
		getCurrentPageObj().find("#attr_type").val(" ");
		getCurrentPageObj().find("#attr_type").select2();
	});
	
	//新增
	getCurrentPageObj().find("#interAttr_add").unbind("click");
	getCurrentPageObj().find("#interAttr_add").click(function(){		
		closeAndOpenInnerPageTab("interAttr_add","新增基础属性","dev_application/interfaceManage/interAttributeManage/interAttribute_add.html");
	});	
	
	//修改
	getCurrentPageObj().find("#interAttr_update").unbind("click");
	getCurrentPageObj().find("#interAttr_update").click(function(){
		var selection = getCurrentPageObj().find("#IInterAttrTableInfo").bootstrapTable('getSelections');
		if(selection.length != 1) {
			alert("请选择一条数据进行操作!");
			return;
		}
		var ids = $.map(selection, function (row) {
			return row.ATTR_ID;     
		});					
		closeAndOpenInnerPageTab("interAttr_update","修改基础属性","dev_application/interfaceManage/interAttributeManage/interAttribute_update.html",function(){
			initUpdateAttrManageInfo(ids);						
		});
	});	
	//删除
	$("#interAttr_delete").click(function(){
		var id = $("#IInterAttrTableInfo").bootstrapTable('getSelections');
		var ids = $.map(id, function (row) {
			return row.ATTR_ID;                  
		});
		var is_basic = $.map(id, function (row) {
			return row.IS_BASIC_ATTR;                  
		});
		if(id.length!=1){
			alert("请选择一条数据进行删除!");
			return ;
		}
		nconfirm("确定要删除该数据吗？",function(){
		    if(is_basic != "00"){		
				var quaryAttrDeleteCall = getMillisecond();
				var url=dev_application+"InterAttrManage/deleteInterAttrManage.asp?call="+quaryAttrDeleteCall+"&SID="+SID+"&attr_id="+ids;
				baseAjaxJsonp(url, null , function(data) {
					if (data != undefined&&data!=null&&data.result=="true") {
						alert("删除成功！");
						$("#IInterAttrTableInfo").bootstrapTable('remove', {
							field: 'ATTR_ID',
							values: ids
						});
						getCurrentPageObj().find("#IInterAttrTableInfo").bootstrapTable('refresh',
						{url:dev_application+'InterAttrManage/queryInterAttrManage.asp?call='+quaryAttrCall+'&SID='+SID});
					}else{	
						alert("删除失败！");
					}	
				},quaryAttrDeleteCall);	
		    }else{
		    	alert("基础属性不能删除！");
		    }
		});						
	});	
};
	
//查询列表显示table
function initAttrManageInfo(quaryAttrCall) {
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$("#IInterAttrTableInfo").bootstrapTable(
			{
				//请求后台的URL（*）
				url :dev_application+'InterAttrManage/queryInterAttrManage.asp?call='+quaryAttrCall+'&SID='+SID,
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
				uniqueId : "attr_id", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				jsonpCallback:quaryAttrCall,
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
					field : "ATTR_ID",
					title : "属性ID",
					align : "center"
				}, {
					field : "ATTR_NAME",
					title : "属性名称",
					align : "center"
				}, {
					field : "IS_NECESSARY",
					title : "是否必填",
					width : "80",
					align : "center"
				}, {
					field : "ATTR_TYPE",
					title : "属性类型",
					align : "center"
				}, {
					field : "MAX_LONG",
					title : "最大长度",
					width : "100",
					align : "center"
				}, {
					field : "DIC_INFO",
					title : "字典项编号",
					align : "center"
				}, {
					field : "ORDER_NUM",
					title : "排序序号",
					width : "80",
					align : "center"
				}, {
					field : "DEFAULT_VALUE",
					title : "默认值",
					align : "center"
				} ]
			});
};
//加载字典项
function initAttrManageDicType(){
	//初始化数据,属性类型
	initSelect($("#attr_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"I_DIC_INTER_ATTR_TYPE"});
	
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
initAttrManageDicType();
initClickButtonEvent();
//synchronizationUser();
