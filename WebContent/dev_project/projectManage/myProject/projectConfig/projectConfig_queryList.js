initSelectVal();
//初始化列表
function initNotConformConfigTab(row){
	var project_id = row.PROJECT_ID;
	var noconfigManageQuerycall = getMillisecond();
	var configTable = getCurrentPageObj().find("#noconfigManageQueryTab1");
	var currentLoginUser = $("#currentLoginNo").val();
	var currTab = getCurrentPageObj();
	var url = dev_project
	+ 'Confignotconform/confignotconformQueryList.asp?call='
	+ noconfigManageQuerycall + '&SID=' + SID+"&project_id="+project_id;
	
	initBtnEvent();
	//初始化页面按钮事件
	function initBtnEvent(){
		var myform=currTab.find("#configManageQueryForm");
		//查询按钮
		currTab.find("#querynoconfigManageQuery").click(function(){
			var queryparam = myform.serialize();
			configTable.bootstrapTable('refresh',{url : dev_project
				+ 'Confignotconform/confignotconformQueryList.asp?call='
				+ noconfigManageQuerycall + '&SID=' + SID+"&project_id="+project_id 
				+ "&" +queryparam});
		});
		enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#querynoconfigManageQuery").click();});
		//重置按钮点击事件
		currTab.find("#resetnoconfigManageQuery").click(function(){
			myform.find("input").val("");
			myform.find("select").val(" ");//ie8下要重置为空格
			myform.find("select").select2();
		});
	
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	
	configTable.bootstrapTable('destroy').bootstrapTable({
		//请求后台的URL（*）
		url : url,
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
		uniqueId : "CONFIG_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:noconfigManageQuerycall,
		singleSelect: true,
		columns : [ {
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		}, {
			field : "DESCR",
			title : "不符合项描述",
			align : "center"
		}, {
			field : "AUDIT_CONFIG",
			title : "审计配置库",
			align : "center"
		}, {
			field : "GRADE_NAME",
			title : "不符合项等级",
			align : "center"
		}, {
			field : "STATUS_NAME",
			title : "不符合项状态",
			align : "center"
		}, {
			field : "PRESENT_USER_NAME",
			title : "提出人",
			align : "center"
		}, {
			field : "DUTY_USER_NAME",
			title : "(执行人)责任人",
			align : "center"
		},{
			field : "FIND_DATE",
			title : "发现日期",
			align : "center"
		},{
			field : "REALITY_FINISH_TIME",
			title : "实际解决日期",
			align : "center"
		}]
	});
	
	//新增按钮事件
	currTab.find("#noconfig_add").click(function(){
		openInnerPageTab("noconfigManageRasie_add","新增不符合项","dev_project/configManage/notConformConfig_add.html",function(){
			addNotConformConfig_init();
			getCurrentPageObj().find("#project_name").val(row.PROJECT_NAME);
			getCurrentPageObj().find("#project_man_name").val(row.PROJECT_MAN_NAME);
			getCurrentPageObj().find("#project_id").val(row.PROJECT_ID);
			getCurrentPageObj().find("#project_man_id").val(row.PROJECT_MAN_ID);
		});
	});
	//修改按钮事件
	currTab.find("#noconfig_update").click(function(){
		var rows = configTable.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		if(rows[0].STATUS != '01'){
			alert("这条数据不是草拟状态，不能进行修改!");
			return ;
		}
		if(rows[0].PRESENT_USER_ID != currentLoginUser){
			alert("您不是该不符合项的提出人!");
			return ;
		}
		openInnerPageTab("noconfigManageRasie_update","修改不符合项","dev_project/configManage/notConformConfig_add.html",function(){
			updateConformConfig_init(rows[0]);
			
		});
	});
	//受理按钮事件
	currTab.find("#noconfig_accept").click(function(){
		var rows = configTable.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行受理!");
			return ;
		}
		if(rows[0].STATUS !== "02"){
			alert("这条数据不是待受理状态，不能进行受理!");
			return ;
		}
		if(rows[0].DUTY_USER_ID != currentLoginUser){
			alert("您不是当前受理人!");
			return ;
		}
		openInnerPageTab("noconfigManageRasie_accept","受理不符合项","dev_project/configManage/configManage_accept.html",function(){
			initconfigManageAcceptLayout(rows[0].PROJECT_ID, rows[0].CONFIG_ID);
		});
	});
	//处理按钮事件
	currTab.find("#noconfig_handle").click(function(){
		var rows = configTable.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行处理!");
			return ;
		}
		if(rows[0].DUTY_USER_ID != currentLoginUser){
			alert("您不是当前处理人!");
			return ;
		}
		if(rows[0].STATUS !== "03"&& rows[0].STATUS_NAME !== "处理中"&& rows[0].STATUS !== "08"&& rows[0].STATUS !== "09"){
			alert("这条数据不是待处理状态，不能进行处理!");
			return ;
		}
		openInnerPageTab("noConfigManage_handle","处理不符合项","dev_project/configManage/noConfigManageHandle/noConfigManageHandle_handle.html",function(){
			initconfigManageHandleLayout(rows[0].PROJECT_ID, rows[0].CONFIG_ID);
		});
	});
	//删除按钮事件
	currTab.find("#noconfig_delete").click(function(){
		var rows =configTable.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行删除!");
			return ;
		}
		if(rows[0].STATUS !== "01"){
			alert("这条数据不是草拟状态，不能进行删除!");
			return ;
		}  
		if(rows[0].PRESENT_USER_ID != currentLoginUser){
			alert("您不是该不符合项的提出人，不能进行删除!");
			return ;
		}
		var call1 =getMillisecond();
		var msg="是否删除此申请？";
		nconfirm(msg,function(){
			baseAjaxJsonp(dev_project+"Confignotconform/confignotconformDelete.asp?call="+call1+"&SID="+SID+"&CONFIG_ID="+rows[0].CONFIG_ID, null, function(data){
				if (data != undefined && data != null) {
					alert(data.msg);
					if(data.result=="true"){
						getCurrentPageObj().find("#querynoconfigManageQuery").click();
					}
				}else{
					alert("未知错误！");
				}
			},call1);
		});
	});
	//验证按钮事件
	currTab.find("#noconfig_validate").click(function(){
		var rows = configTable.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行验证!");
			return ;
		}
		if(rows[0].STATUS !== "05"&&rows[0].STATUS !== "04"){
			alert("这条数据不是待验证状态，不能进行验证!");
			return ;
		}
		if(rows[0].PRESENT_USER_ID != currentLoginUser){
			alert("您不是该不符合项的提出人，不能进行验证!");
			return ;
		}
		openInnerPageTab("noconfigManageRasie_validate","验证不符合项","dev_project/configManage/configManage_validate.html",function(){
			initconfigManageValidateLayout(rows[0].CONFIG_ID);
		});
	});
	//详情按钮事件
	currTab.find("#noconfigManageQuery_info").click(function(){
		var rows = configTable.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行查看!");
			return ;
		}
		closeAndOpenInnerPageTab("noconfigManage_QueryIn","不符合项详细","dev_project/configManage/configManage_queryInfo.html",function(){
			initconfigManageQueryInfoLayout(rows[0].CONFIG_ID);
		});
	});
}
	
}

//计算两日期差
function daysBetween(sDate1,sDate2){
    var time1 = Date.parse(new Date(sDate1));
    var time2 = Date.parse(new Date(sDate2));
    var nDays = Math.abs(parseInt((time2 - time1)/1000/3600/24));
    return  nDays;
};

//初始化页面下拉框的值
function initSelectVal(){
	initSelect(getCurrentPageObj().find("select[name='status_name']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_STATUS"});
	initSelect(getCurrentPageObj().find("select[name='grade_name']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_GRADE"});
}