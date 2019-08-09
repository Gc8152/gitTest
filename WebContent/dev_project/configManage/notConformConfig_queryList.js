var notConfigMangecall = getMillisecond();
initNotConformConfigTab();
initBtnEvent();
initSelectVal();
//初始化列表
function initNotConformConfigTab(){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	
	getCurrentPageObj().find("#notConformConfigTab").bootstrapTable('destroy').bootstrapTable({
		//请求后台的URL（*）
		url : dev_project
			+ 'Confignotconform/confignotconformQueryList.asp?call='
			+ notConfigMangecall + '&SID=' + SID,
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
		jsonpCallback:notConfigMangecall,
		singleSelect: true,
		columns : [ {
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		}, /*{
			field : 'CONFIG_ID',
			title : '编号',
			align : "center"
		},*/ {
			field : "RULE_CORRECT_DAY",
			title : "标识",
			align : "center",
			formatter: function (value, row, index) {
				if(row.STATUS == '01'){
					return "*";//待受理
				}else if(row.STATUS == '06' && daysBetween(getCurrentYMD(),row.FIND_DATE)<parseInt(row.RULE_CORRECT_DAY)){
					return "△";//待验证
				}else if(row.STATUS !='07' && row.STATUS !='02' && row.STATUS !='03'
						&& daysBetween(getCurrentYMD(),row.FIND_DATE)>parseInt(row.RULE_CORRECT_DAY)){
					return "!";//延期未关闭
				}else{
					return "";
				}
			}
		}, {
			field : "PROJECT_NUM",
			title : "项目编号",
			align : "center"
		}, {
			field : "PROJECT_NAME",
			title : "项目名称",
			align : "center"
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
		}]
	});
}

//计算两日期差
function daysBetween(sDate1,sDate2){
    var time1 = Date.parse(new Date(sDate1));
    var time2 = Date.parse(new Date(sDate2));
    var nDays = Math.abs(parseInt((time2 - time1)/1000/3600/24));
    return  nDays;
};
//初始化页面按钮事件
function initBtnEvent(){
	//查询按钮
	getCurrentPageObj().find("#queryNotConformList").click(function(){
		var project_num = getCurrentPageObj().find("#project_num").val();
		var project_name = getCurrentPageObj().find("#project_name").val();
		var status_name = getCurrentPageObj().find("#status_name").val();
		var grade_name = getCurrentPageObj().find("#grade_name").val();
		var descr = getCurrentPageObj().find("#descr").val();
		getCurrentPageObj().find('#notConformConfigTab').bootstrapTable('refresh',{url : dev_project
			+ 'Confignotconform/confignotconformQueryList.asp?call='
			+ notConfigMangecall + '&SID=' + SID + "&project_num="
			+ project_num + "&project_name=" + project_name
			+ "&status_name=" + status_name
			+ "&grade_name=" + grade_name + "&descr="
			+ descr});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#queryNotConformList").click();});
	//重置按钮点击事件
	getCurrentPageObj().find("#resetNotConformList").click(function(){
		getCurrentPageObj().find("#notConformConfigForm").find("input").val("");
		getCurrentPageObj().find("#notConformConfigForm").find("select").val(" ");//ie8下要为空才能重置
		getCurrentPageObj().find("#notConformConfigForm").find("select").select2();
	});
	//新增按钮事件
	getCurrentPageObj().find("#configManage_add").click(function(){
		openInnerPageTab("configManage_add","新增配置不符合项","dev_project/configManage/notConformConfig_add.html",function(){
			addNotConformConfig_init();
		});
	});
	//修改按钮事件
	getCurrentPageObj().find("#configManage_update").click(function(){
		var rows = getCurrentPageObj().find("#notConformConfigTab").bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		if(rows[0].STATUS_NAME !== "草拟"){
			alert("这条数据不是草拟状态，不能进行修改!");
			return ;
		}
		openInnerPageTab("configManage_update","修改不符合项","dev_project/configManage/notConformConfig_add.html",function(){
			updateConformConfig_init(rows[0]);
			
		});
	});
	//删除按钮事件
	getCurrentPageObj().find("#configManage_delete").click(function(){
		var rows = $("#notConformConfigTab").bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行删除!");
			return ;
		}
		if(rows[0].STATUS !== "01"){
			alert("这条数据不是待受理状态，不能进行删除!");
			return ;
		}  
		var call =getMillisecond();
		var msg="是否删除此申请？";
		nconfirm(msg,function(){
			baseAjaxJsonp(dev_project+"Confignotconform/confignotconformDelete.asp?call="+call+"&SID="+SID+"&CONFIG_ID="+rows[0].CONFIG_ID, null, function(data){
				if (data != undefined && data != null) {
					alert(data.msg);
					if(data.result=="true"){
						getCurrentPageObj().find("#queryNotConformList").click();
					}
				}else{
					alert("未知错误！");
				}
			},call);
		});
	});
	//受理按钮事件
	getCurrentPageObj().find("#configManage_accept").click(function(){
		var rows = getCurrentPageObj().find("#notConformConfigTab").bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行受理!");
			return ;
		}
		if(rows[0].STATUS_NAME !== "待受理"){
			alert("这条数据不是待处理状态，不能进行处理!");
			return ;
		}
		openInnerPageTab("configManage_accept","受理不符合项","dev_project/configManage/configManage_accept.html",function(){
			initconfigManageAcceptLayout(rows[0].PROJECT_ID, rows[0].CONFIG_ID);
		});
	});
	//处理按钮事件
	getCurrentPageObj().find("#configManage_handle").click(function(){
		var rows = getCurrentPageObj().find("#notConformConfigTab").bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行处理!");
			return ;
		}
		if(rows[0].STATUS_NAME !== "已受理-待处理"&& rows[0].STATUS_NAME !== "处理中"&& rows[0].STATUS_NAME !== "打回处理中"&& rows[0].STATUS_NAME !== "挂起"){
			alert("这条数据不是待处理状态，不能进行处理!");
			return ;
		}
		openInnerPageTab("configManage_handle","处理不符合项","dev_project/configManage/configManage_handle.html",function(){
			initconfigManageHandleLayout(rows[0].PROJECT_ID, rows[0].CONFIG_ID);
		});
	});
	//验证按钮事件
	$("#configManage_validate").click(function(){
		var rows = $("#notConformConfigTab").bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行验证!");
			return ;
		}
		if(rows[0].STATUS_NAME !== "待验证"&&rows[0].STATUS_NAME !== "已受理-拒绝"){
			alert("这条数据不是待验证状态，不能进行验证!");
			return ;
		}
		openInnerPageTab("configManage_validate","验证不符合项","dev_project/configManage/configManage_validate.html",function(){
			initconfigManageValidateLayout(rows[0].CONFIG_ID);
		});
	});
	//详情按钮事件
	getCurrentPageObj().find("#configManage_info").click(function(){
		var rows = $("#notConformConfigTab").bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行查看!");
			return ;
		}
		openInnerPageTab("configManage_QueryIn","不符合项详细","dev_project/configManage/configManage_queryInfo.html",function(){
			initconfigManageQueryInfoLayout(rows[0].CONFIG_ID);
		});
	});
}
//初始化页面下拉框的值
function initSelectVal(){
	initSelect(getCurrentPageObj().find("select[name='STATUS_NAME']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_STATUS"});
	initSelect(getCurrentPageObj().find("select[name='GRADE_NAME']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_GRADE"});
}