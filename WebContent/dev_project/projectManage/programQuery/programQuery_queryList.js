var programCall = getMillisecond();
var currTab = getCurrentPageObj();


initProgramQuaryTable();
initButtonEvent_Program();
initselect_Program();

function initProgramQuaryTable(){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	getCurrentPageObj().find("#ProgramQuarytable").bootstrapTable({
		url : dev_project+'programQuery/programQueryList.asp?call='+programCall+'&SID='+SID,
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
		uniqueId : "VERSIONS_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:programCall,
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
			field : 'Number',
			title : '序号',
			align : "center",
			width : "5%",
/*			sortable: true,*/
			formatter: function (value, row, index) {
				return index+1;
			}
		}, {
			field : "VERSIONS_NAME",
			title : "项目群名称",
			align : "center",
			width : "31%"
		}, {
			field : "VERSIONS_STATUS_NAME",
			title : "项目群状态",
			align : "center",
			width : "15%"
		}, {
			field : "PROJECT_NUM",
			title : "项目个数",
			align : "center",
			width : "15%"
		}, {
			field : "NO_RISK_NUM",
			title : "正常项目个数",
			align : "center",
			formatter: function (value, row, index) {
				return row.PROJECT_NUM - row.RISK_NUM;
			},
			width : "15%"
		}, {
			field : "RISK_NUM",
			title : "问题项目个数",
			align : "center",
			width : "15%"
		}]
	},programCall);
	
}

//初始化按钮事件
function initButtonEvent_Program(){

	//查询按钮事件
	currTab.find("#query_Program").click(function() {
		var params = getCurrentPageObj().find("#Program_form").serialize();
		getCurrentPageObj().find("#ProgramQuarytable").bootstrapTable('refresh',
				{url:dev_project+'programQuery/programQueryList.asp?call='+programCall+'&SID='+SID+'&'+params});
	});

	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#query_Program").click();});
	//重置按钮事件
	currTab.find("#reset_Program").click(function(){
		currTab.find("#Program_form").find("input").val("");
		//currTab.find("#Program_form").find("select").select2();
		
		var queryForm = currTab.find("#Program_form");
		queryForm[0].reset();
		var selects = currTab.find("#Program_form").find("select");
		for(var i=0; i<selects.length; i++){
			$(selects[i]).select2();
		}
	});
	
	//项目群全景视图
	getCurrentPageObj().find("#ProgramPanoramicView").click(function(){
		var rows = getCurrentPageObj().find('#ProgramQuarytable').bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行操作!");
			return ;
		}else{
			
			closePageTab("programQuery_queryInfo");
			closeAndOpenInnerPageTab(
					"programQuery_queryInfo",
					"项目群全景视图",
					"dev_project/projectManage/programQuery/programQuery_queryInfo.html",
					function() {
						initProjgramInfoPage(rows[0]);
					});
		}

		});
}

function initselect_Program(){
	currTab.find("select[name='VERSIONS_STATUS']").empty();
	initSelect(currTab.find("select[name='VERSIONS_STATUS']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_VERSIONS_STATUS"});
}