 var tablecall=getMillisecond();
//初始化查询页面
function initAssortmentQueryList(){
	//加载bootstrapTable列表
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$("#assortment_Table").bootstrapTable(	{
		//请求后台的URL（*）
		url : dev_workbench+'Assortment/queryAssortmentList.asp?call='+tablecall+'&SID='+SID,
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
		uniqueId : "ASSORTID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:tablecall,
		singleSelect: true,
		onLoadSuccess:function(data){
		},
		columns : [ {
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
		},{
			field : 'ASSORTID',
			title : 'id',
			align : "center",
			visible:false
		},{
			field : 'ASSORTMARK',
			title : '督办类别编号',
			align : "center"
		},{
			field : 'ASSORTNAME',
			title : '督办类别名称',
			align : "center"
		}, {
			field : "FLAG",
			title : "状态",
			align : "center"
		}, {
			field : "INSTRUCTION",
			title : "说明",
			align : "center"
		}, {
			field : "OPT_PERSON",
			title : "操作人",
			align : "center"
		}, {
			field : "OPT_TIME",
			title : "操作时间",
			align : "center"
		}]
	});
	//初始化下拉框
	initSelect($("#assortment_flag"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_OC"}," ");	
	
	//重置按钮
	$("#assortmentReset").click(function(){
		
		$("input[name^='ASS.']").each(function(){
			$(this).val("");
		});
		var selects=$("#messstrategy_queryList_form select");
		selects.val(" ");
		selects.select2();
		/*$("select[name^='ASS.']").each(function(){
			$(this).val("");
			$(this).select2();
		});*/
	});
	//按条件查询
	$("#assortmentQueryList").click(function(){
		var assortmark = $("#assortmark").val(); //督办类别编号
		var assortname =  $("#assortname").val();//督办类别名称
		var assortment_flag = $("#assortment_flag").val();//状态
		$("#assortment_Table").bootstrapTable('refresh',{url:dev_workbench+"Assortment/queryAssortmentList.asp?assortmark="+assortmark+
			"&assortname="+escape(encodeURIComponent(assortname))+"&flag="+assortment_flag+"&call="+tablecall+"&SID="+SID});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#assortmentQueryList").click();});
}
//功能按钮
function assortmentPageButton(){
	//新增页面
	$("#assortment_add").click(function(){
		closeAndOpenInnerPageTab("assortment_add", "新增督办类别", "supervision/assortment/assortment_add.html",function(){
			assortment_initAdd();
		});
	});
	//修改页面
	$("#assortment_update").click(function(){
		var id = $("#assortment_Table").bootstrapTable('getSelections');
		if (id.length != 1) {
			alert("请选择一条数据进行修改!");
			return;
		}
		var assortid = $.map(id, function(row) {
			return (row.ASSORTID);
		});
		closeAndOpenInnerPageTab("assortment_update", "修改", "supervision/assortment/assortment_update.html",function(){
			assortment_initUpdate(assortid);
		});
	});
	//删除功能
	$("#assortment_delete").click(function(){
		var call=getMillisecond();
		var id = $("#assortment_Table").bootstrapTable('getSelections');
		if (id.length != 1) {
			alert("请选择一条数据进行删除!");
			return;
		}
		nconfirm("删除后,不可恢复.是否删除?",function(){
		var assortid = $.map(id, function(row) {
			return (row.ASSORTID);
		});
		var url = dev_workbench+"Assortment/deleteAssortment.asp?assortid="+assortid+"&call="+call+"&SID="+SID;
		baseAjaxJsonp(url,null,function(data){
			if(data.result=="true"){
				alert("删除成功！");
				$("#assortment_Table").bootstrapTable('refresh');
			}else{
				alert("删除失败！");
			}
		},call);
	  });
	});
	//模型配置
	$("#assortment_cfg").click(function(){
		var id = $("#assortment_Table").bootstrapTable('getSelections');
		if (id.length != 1) {
			alert("请选择一条数据进行配置!");
			return;
		}
		var assortid = $.map(id, function(row) {
			return (row.ASSORTID);
		});		
		closeAndOpenInnerPageTab("assortmentOne", "模块配置", "supervision/assortment/assortment_cfg.html",function(){
			assortment_init(assortid);
		});
	});
} 
//初始化查询页面
initAssortmentQueryList();
//功能按钮
assortmentPageButton();
