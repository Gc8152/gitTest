var callTable=getMillisecond();
//初始化查询页面
function initQueryList(){
	//加载bootstrapTable列表
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$("#messstrategyModal_Table").bootstrapTable(	{		
		//请求后台的URL（*）
		url : dev_workbench+'PucTMesscategory/queryAllMesscategory.asp?call='+callTable+"&SID="+SID,
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
		uniqueId : "CATEGORY_CODE", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:callTable,
		singleSelect: true,
		onLoadSuccess:function(data){
		},
		columns : [ {
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
		},{
			field : 'CATEGORY_CODE',
			title : '模型编号',
			align : "center"
//			visible:false
		},{
			field : 'CATEGORY_NAME',
			title : '模型名称',
			align : "center"
		}, {
			field : "ASSORTNAME",
			title : "督办类别",
			align : "center"
		}, {
			field : "CATEGORY_STATENAME",
			title : "模型状态",
			align : "center"
		}, {
			field : "SENDER",
			title : "邮件落款",
			align : "center"
		}, {
			field : "SENDER_MAIL",
			title : "发件人邮箱",
			align : "center"
		} ,{
			field : "SENDER_TITLE",
			title : "邮件标题",
			align : "center"
		}]
	});
	//初始化下拉框
	initSelect($("#queryList_category_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_OC"}," ");
	var call=getMillisecond();
	baseAjaxJsonp(dev_workbench+"Assortment/queryAssortmentList.asp?call="+call+"&SID="+SID,null,function(data){		
		$("#queryList_category_assortid").empty();
		$("#queryList_category_assortid").append('<option id="removeOption" value=" " selected>请选择</option>');
		for(var i=0;i<data.rows.length;i++){
			$("#queryList_category_assortid").append('<option value="'+data.rows[i].ASSORTID+'">'+data.rows[i].ASSORTNAME+'</option>');	
		};
		$("#queryList_category_assortid").select2();			
	},call);
	//重置按钮
	$("#MTQReset").click(function(){
		$("input[name^='MTQ.']").each(function(){
			$(this).val("");
		});
		$("select[name^='MTQ.']").each(function(){
			$(this).val(" ");
			$(this).select2();
		});
	});
	//按条件查询
	$("#MTQqueryList").click(function(){
		var category_code = $("#queryList_category_code").val(); //模型编号
		var category_name =  $("#queryList_category_name").val();//模型名称
		var category_state = $.trim($("#queryList_category_state").val());//模型状态
		var assortid =  $.trim($("#queryList_category_assortid").val());//督办类别
		//var sender =  $("#queryList_csender").val();//发件人
		var sender_mail =  $("#queryList_category_mail").val();//发件人邮箱
		$("#messstrategyModal_Table").bootstrapTable('refresh',{url:dev_workbench+"PucTMesscategory/queryAllMesscategory.asp?category_code="+category_code+
			"&category_name="+escape(encodeURIComponent(category_name))+"&category_state="+category_state+"&assortid="+assortid+
			"&sender="+""+"&sender_mail="+sender_mail+"&call="+callTable+"&SID="+SID});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#MTQqueryList").click();});
}
//功能按钮
function pageButton(){
	//新增页面
	$("#messstrategy_queryList_add").click(function(){
		closeAndOpenInnerPageTab("messcategory_add", "新增督办模型", "supervision/messcategory/messcategory_add.html",function(){
			messcaTegory_initAdd();
		});
	});
	//修改页面
	$("#messstrategy_queryList_update").click(function(){
		var id = $("#messstrategyModal_Table").bootstrapTable('getSelections');
		if (id.length != 1) {
			alert("请选择一条数据进行修改!");
			return;
		}
		var category_code = $.map(id, function(row) {
			return (row.CATEGORY_CODE);
		});
		closeAndOpenInnerPageTab("messcategory_update", "修改督办模型", "supervision/messcategory/messcategory_update.html",function(){
			messcaTegory_initUpdate(category_code);
		});
	});
	//删除功能
	$("#messstrategy_queryList_delete").click(function(){
		var id = $("#messstrategyModal_Table").bootstrapTable('getSelections');
		if (id.length != 1) {
			alert("请选择一条数据进行删除!");
			return;
		}
		var category_code = $.map(id, function(row) {
			return (row.CATEGORY_CODE);
		});
		nconfirm("删除后,不可恢复.是否删除?",function(){
			var url = dev_workbench+"PucTMesscategory/puctMessCategoryDelete.asp?category_code="+category_code+"&call="+callTable+"&SID="+SID;
			baseAjaxJsonp(url,null,function(data){
				if(data.result=="true"){
					alert("删除成功！");
					$("#messstrategyModal_Table").bootstrapTable('refresh');
				}else{
					alert("删除失败！");
				}
			},callTable);
		});
	});
	//频率配置
	$("#messstrategy_queryList_frequency").click(function(){
		var id = $("#messstrategyModal_Table").bootstrapTable('getSelections');
		if (id.length != 1) {
			alert("请选择一条数据进行配置!");
			return;
		}
		var category_code = $.map(id, function(row) {
			return (row.CATEGORY_CODE);
		});		
		closeAndOpenInnerPageTab("messcategory_cfg", "督办频率配置", "supervision/messstrategy/messstrategy_cfg.html",function(){
			initMessStrategy(category_code);
		});
	});
} 
//初始化查询页面
initQueryList();
//功能按钮
pageButton();
