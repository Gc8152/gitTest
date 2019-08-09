var tableCall = getMillisecond();

initqrProjectPopBtnEvent();
//加载项目pop
function qropenProjectPop(id, callparams) {
	getCurrentPageObj().find("#" + id).load("dev_project/questionManage/questionRaise/questionRaise_projectPop.html", {},
			function() {
				initqrProjectTab(callparams);
				getCurrentPageObj().find("#qr_project_Modal").modal("show");
			});
}

//初始化表格
function initqrProjectTab(callparams){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	getCurrentPageObj().find("#qr_projectTable").bootstrapTable({
		//请求后台的URL（*）
		url : dev_project+'QuestionRaise/questionRaiseQueryProject.asp?call='+tableCall+'&SID='+SID,
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
		onLoadSuccess : function(data){
			gaveInfo();
		},
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
		
		getCurrentPageObj().find("#qr_project_Modal").modal("hide");
		},
		columns : [ {
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle',
			visible:false
		}, {
			field : 'Number',
			title : '序号',
			align : "center",
			sortable: true,
			formatter: function (value, row, index) {
				return index+1;
			},
			width : "5%"
		}, {
			field : "PROJECT_NUM",
			title : "项目编号",
			align : "center",
			width : "20%",
			visible : false
		}, {
			field : "PROJECT_NAME",
			title : "项目名称",
			align : "center",
			width : "25%"
		}, {
			field : "PROJECT_TYPE",
			title : "项目类型",
			align : "center",
			visible :false		
		}, {
			field : "PROJECT_TYPE_NAME",
			title : "项目类型",
			align : "center",
			width : "10%"
		},{
			field : "PROJECT_MAN_NAME",
			title : "项目经理",
			align : "center",
			width : "10%"
		}, {
			field : "SYSTEM_NAME",
			title : "所属应用",
			align : "center",
			width : "10%"
		}, {
			field : "STATUS_NAME",
			title : "项目状态",
			align : "center",
			width : "10%"
		}]
	});
}
//初始化页面按钮事件
function initqrProjectPopBtnEvent(){
	//查询按钮事件
	$("#qr_projectSearch").click(function(){
		var qrProjectForm = getCurrentPageObj().find("#qr_project_Form");
		var param = qrProjectForm.serialize();
		getCurrentPageObj().find("#qr_projectTable").bootstrapTable(
				'refresh',
				{
					url : dev_project
							+ 'QuestionRaise/questionRaiseQueryProject.asp?call='
							+ tableCall + '&SID=' + SID
							+"&" + param
				});
	});
	
	//重置按钮事件
	$("#qr_projectReset").click(function(){
		getCurrentPageObj().find("#qr_project_Form").find("input").val("");
	});
}