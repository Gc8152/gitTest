var tableCall = getMillisecond();

initProjectPopBtnEvent();
//加载项目pop
function openProjectPop(id, callparams) {
	getCurrentPageObj().find("#" + id).load("dev_project/projectPop.html", {},
			function() {
				initProjectTab(callparams);
				getCurrentPageObj().find("#project_Modal").modal("show");
			});
}

//初始化表格
function initProjectTab(callparams){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	getCurrentPageObj().find("#pop_projectTable").bootstrapTable({
		//请求后台的URL（*）
		url : dev_project+'myProject/queryListmyProject.asp?call='+tableCall+'&SID='+SID,
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
		pageSize : 5,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "PROJECT_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:tableCall,
		singleSelect: true,
		onDblClickRow:function(row){
		for ( var item in callparams) {
			var itemValue = "";
			if(item == "PROJECT_NUM"){
				itemValue = row.PROJECT_NUM;
			}else if(item == "PROJECT_NAME"){
				itemValue = row.PROJECT_NAME;
			}else if(item == "DUTY_USER_NAME"){
				itemValue = row.DUTY_USER_NAME;
			}else if(item == "PROJECT_ID"){
				itemValue = row.PROJECT_ID;
			}else if(item == "DUTY_USER_ID"){
				itemValue = row.DUTY_USER_ID;
			}else if(item=="SYSTEM_NAME"){
				itemValue = row.SYSTEM_NAME;
			}
			else if(item=="PROJECT_MAN_NAME"){
				itemValue = row.PROJECT_MAN_NAME;
			}
			else if(item=="PROJECT_MAN_ID"){
				itemValue = row.PROJECT_MAN_ID;
			}
			
			callparams[item].val(itemValue);
		}
		
		$("#project_Modal").modal("hide");
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
			sortable: true,
			width : "8%",
			formatter: function (value, row, index) {
				return index+1;
			}
		}, /*{
			field : "PROJECT_NUM",
			title : "项目编号",
			align : "center"
		},*/ {
			field : "PROJECT_NAME",
			title : "项目名称",
			align : "center",
			width : "30%"
		},{
			field : "PROJECT_TYPE_NAME",
			title : "项目类型",
			align : "center",
			width : "12%"
		},{
			field : "PROJECT_MAN_NAME",
			title : "项目经理",
			align : "center",
			width : "15%"
		}, /*{
			field : "DUTY_USER_NAME",
			title : "项目负责人",
			align : "center"
		},*/ {
			field : "SYSTEM_NAME",
			title : "所属应用",
			align : "center",
			width : "18%"
		}, {
			field : "STATUS_NAME",
			title : "项目状态",
			align : "center",
			width : "13%"
		}]
	});
}
//初始化页面按钮事件
function initProjectPopBtnEvent(){
	var currTab=getCurrentPageObj();
	var queryForm = currTab.find("#project_ModalForm");
	//查询按钮事件
	currTab.find("#pop_projectSearch").click(function(){
		var  param = queryForm.serialize();
		currTab.find("#pop_projectTable").bootstrapTable('refresh',
				{url : dev_project + 'myProject/queryListmyProject.asp?call='
					   + tableCall + '&SID=' + SID
					   +"&"+param});
	  });
	enterEventRegister("popModelQueryLevel1", function(){getCurrentPageObj().find("#pop_projectSearch").click();});
	//重置按钮事件
	currTab.find("#pop_projectReset").click(function(){
		currTab.find("#project_ModalForm").find("input").val("");
	});
}