//初始化页面按钮
function initSbscifListButton(){
	//1.新增按钮
	$("#addBusConfig").click(function() {
		closeAndOpenInnerPageTab("adddelement", "新增业务要素", "pages/approvalflow/sbscfig/sbscfig_addelement.html", function(){
			initInfo("add");
		});
	});
	//2.修改按钮
	$("#updateBusConfig").click(function(){
		var b_code = '';
		var system_code = '';
		var selRow = $('#SBsCfigTableInfo').bootstrapTable("getSelections");
		if(selRow.length == 1){
			b_code = selRow[0].B_CODE;
			system_code = selRow[0].SYSTEM_CODE;
			closeAndOpenInnerPageTab("updatedelement", "修改业务要素", "pages/approvalflow/sbscfig/sbscfig_addelement.html", function(){
				initInfo("update",b_code,system_code);
			});
		}else{
			alert("请选择一条数据");
			return;
		}
	});
	//3.删除按钮
	$('#deleteBusConfig').click(function(){
		var b_code = '';
		var system_code = '';
		var selRow = $('#SBsCfigTableInfo').bootstrapTable("getSelections");
		if(selRow.length > 0){
			nconfirm("确定要删除这"+selRow.length+"条记录吗？",function (){
				b_code = selRow[0].B_CODE;
				system_code = selRow[0].SYSTEM_CODE;
				baseAjax("AFFact/deleteOneFactorsInfo.asp?b_code="+b_code+"&system_code="+system_code,null,function(data){
					var result = data.result;
					if(result == "true"){
						alert("删除成功");
						$('#SBsCfigTableInfo').bootstrapTable('refresh');
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
	//4.查看按钮
	$('#viewBusConfig').click(function(){
		var b_code = "";
		var system_code = '';
		var selRow = $('#SBsCfigTableInfo').bootstrapTable("getSelections");
		if(selRow.length == 1){
			b_code = selRow[0].B_CODE;
			system_code = selRow[0].SYSTEM_CODE;
			closeAndOpenInnerPageTab("checkelement", "查看业务要素", "pages/approvalflow/sbscfig/sbscfig_checkelement.html", function(){
				initAFFactDetail(b_code,system_code);
			});
		}else{
			alert("请选择一条数据");
			return;
		}
	});
	//5.查询按钮
	getCurrentPageObj().find("#querySqfi").click(function() {
		var system_code =$.trim(getCurrentPageObj().find("#system_code").val());
		var b_state = $.trim(getCurrentPageObj().find("#b_state").val());
		var b_category =$.trim(getCurrentPageObj().find("#b_category").val());
		var b_name =$.trim(getCurrentPageObj().find("#b_name").val());
		getCurrentPageObj().find('#SBsCfigTableInfo').bootstrapTable('refresh',
				{url:'AFFact/queryAllFactorsInfo.asp?system_code='+
					escape(encodeURIComponent(system_code))+
					'&b_state='+escape(encodeURIComponent(b_state))+
					'&b_category='+escape(encodeURIComponent(b_category))+
					'&b_name='+escape(encodeURIComponent(b_name))
				});
	});
	/*enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#querySqfi").click();});*/

	
	//6.重置按钮
	getCurrentPageObj().find("#reset").click(function() {
		getCurrentPageObj().find("#factConfigForm input").val("");
		getCurrentPageObj().find("#factConfigForm select").val("");
		getCurrentPageObj().find("#factConfigForm select").select2();
	});
}
//初始化页面table
function initSBsCfigInfo() {
	var system_code =$.trim(getCurrentPageObj().find("#system_code").val());
	var b_state = $.trim(getCurrentPageObj().find("#b_state").val());
	var b_category =$.trim(getCurrentPageObj().find("#b_category").val());
	var b_name =$.trim(getCurrentPageObj().find("#b_name").val());
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$("#SBsCfigTableInfo").bootstrapTable(
			{
				//请求后台的URL（*）
				url :'AFFact/queryAllFactorsInfo.asp?system_code='+escape(encodeURIComponent(system_code))+'&b_state='+
				escape(encodeURIComponent(b_state))+'&b_category='+escape(encodeURIComponent(b_category))+'&b_name='+
				escape(encodeURIComponent(b_name)),
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
				uniqueId : "B_CODE", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: true,
				columns : [ {	
					checkbox:true,
					rowspan: 2,
					align: 'center',
					valign: 'middle'
				},{
					field: 'B_CODE',
					title : '要素编号',
					align: 'left'
				},{
					field : "B_NAME",
					title : "要素名称",
					align : "center"
				}, {
					field : "B_CATEGORY_NAME",
					title : "要素类别",
					align : "center"
				}, {
					field : 'A_SYS_NAME',
					title : '所属业务系统',
					align : "center"
				}, {
					field : "B_STATE_NAME",
					title : "启用状态",
					align : "center"
				},{
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
function initPageSelect(){
	//业务系统下拉初始化
	//流程状态下拉初始化
	//业务要素下拉初始化
	initSelect($("#system_code"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"AF_DIC_SYSTEM"});
	initSelect($("#b_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"AF_DIC_STATE"});
	initSelect($("#b_category"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"AF_DIC_FAC_CATEGORY"});
}
initPageSelect();
initSbscifListButton();
initSBsCfigInfo();