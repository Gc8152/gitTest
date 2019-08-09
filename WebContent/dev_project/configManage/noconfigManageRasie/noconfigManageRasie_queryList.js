var noconfigManageRasiecall = getMillisecond();
initconfigManageRasieTab();
initconfigManageRasieBtnEvent();
initconfigManageRasieSelectVal();
//初始化列表
function initconfigManageRasieTab(){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	
	getCurrentPageObj().find("#noconfigManageRasieTab").bootstrapTable('destroy').bootstrapTable({
		//请求后台的URL（*）
		url : dev_project
			+ 'NotconformRaise/notconformRaiseQueryList.asp?call='
			+ noconfigManageRasiecall + '&SID=' + SID,
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
		jsonpCallback:noconfigManageRasiecall,
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
			},
			width : "6%"
			
		}, {
			field : "PROJECT_NUM",
			title : "项目编号",
			align : "center",
			visible : false
		}, {
			field : "PROJECT_NAME",
			title : "项目名称",
			align : "center",
			width : "17%"
		}, {
			field : "DESCR",
			title : "不符合项描述",
			align : "center",
			width : "17%"
		}, {
			field : "AUDIT_CONFIG",
			title : "审计配置库",
			align : "center",
			width : "10%"
		}, {
			field : "GRADE_NAME",
			title : "不符合项等级",
			align : "center",
			width : "10%"
		}, {
			field : "STATUS_NAME",
			title : "不符合项状态",
			align : "center",
			width : "10%"
		}, {
			field : "PRESENT_USER_NAME",
			title : "提出人",
			align : "center",
			width : "10%"
		}, {
			field : "DUTY_USER_NAME",
			title : "责任人",
			align : "center",
			width : "10%"
		},{
			field : "FIND_DATE",
			title : "发现日期",
			align : "center",
			width : "10%"
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
function initconfigManageRasieBtnEvent(){
	//查询按钮
	getCurrentPageObj().find("#querynoconfigManageRasie").click(function(){
		var form=getCurrentPageObj().find("#noconfigManageRasieForm");
		var param = form.serialize();
		getCurrentPageObj().find('#noconfigManageRasieTab').bootstrapTable('refresh',{url : dev_project
			+ 'NotconformRaise/notconformRaiseQueryList.asp?call='
			+ noconfigManageRasiecall + '&SID=' + SID +"&"+param});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#querynoconfigManageRasie").click();});
	//重置按钮点击事件
	getCurrentPageObj().find("#resetnoconfigManageRasie").click(function(){
		getCurrentPageObj().find("#noconfigManageRasieForm").find("input").val("");
		getCurrentPageObj().find("#noconfigManageRasieForm").find("select").val(" ");
		getCurrentPageObj().find("#noconfigManageRasieForm").find("select").select2();
	});
	//新增按钮事件
	getCurrentPageObj().find("#noconfigManageRasie_add").click(function(){
		openInnerPageTab("noconfigManageRasie_add","新增不符合项","dev_project/configManage/noconfigManageRasie/noconfigManageRasie_add.html",function(){
			addNotConformConfig_init();
		});
	});
	//修改按钮事件
	getCurrentPageObj().find("#noconfigManageRasie_update").click(function(){
		var rows = getCurrentPageObj().find("#noconfigManageRasieTab").bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		if((rows[0].STATUS != "01")&&(rows[0].STATUS!="04")){
			alert("这条数据不是草拟或拒绝状态，不能进行修改!");
			return ;
		}
		openInnerPageTab("noconfigManageRasie_update","修改不符合项","dev_project/configManage/noconfigManageRasie/noconfigManageRasie_add.html",function(){
			updateConformConfig_init(rows[0]);
			
		});
	});
	//删除按钮事件
	getCurrentPageObj().find("#noconfigManageRasie_delete").click(function(){
		var rows = getCurrentPageObj().find("#noconfigManageRasieTab").bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行删除!");
			return ;
		}
		if((rows[0].STATUS !== "01")&&(rows[0].STATUS !== "04")){
			alert("这条数据不是草拟或拒绝状态，不能进行删除!");
			return ;
		}  
		//var call =getMillisecond();
		var msg="是否删除此记录？";
		nconfirm(msg,function(){
			baseAjaxJsonp(dev_project+"NotconformRaise/notconformRaiseDelete.asp?call="+noconfigManageRasiecall+"&SID="+SID+"&CONFIG_ID="+rows[0].CONFIG_ID, null, function(data){
				if (data != undefined && data != null) {
					alert(data.msg);
					if(data.result=="true"){
						getCurrentPageObj().find("#querynoconfigManageRasie").click();
					}
				}else{
					alert("未知错误！");
				}
			},noconfigManageRasiecall);
		});
	});
	//提交按钮事件
	getCurrentPageObj().find("#noconfigManageRasie_submit").click(function(){
		var rows = getCurrentPageObj().find("#noconfigManageRasieTab").bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行受理!");
			return ;
		}
		if((rows[0].STATUS !== "01")&&(rows[0].STATUS!=="04")){
			alert("这条数据不是草拟或拒绝状态，不能进行提交!");
			return ;
		}
		var CONFIG_ID=rows[0].CONFIG_ID;
		confsubcall=getMillisecond();	
	nconfirm("确定要提交吗？",function(){
	baseAjaxJsonp(dev_project+"NotconformRaise/notconformRaiseSubmit.asp?SID="+SID+"&call="+confsubcall+"&CONFIG_ID="+CONFIG_ID, null, function(data){
		if (data != undefined && data != null) {
			alert(data.msg);
			if(data.result=="true"){
				getCurrentPageObj().find("#noconfigManageRasieTab").bootstrapTable('refresh',{
					url:dev_project+"NotconformRaise/notconformRaiseQueryList.asp?SID="+SID+"&call="+noconfigManageRasiecall});
		}
		}else{
			alert("提交失败！");
		}
	},confsubcall);
	
	});
	});
	
	//详情按钮事件
	getCurrentPageObj().find("#noconfigManageRasie_info").click(function(){
		var rows = getCurrentPageObj().find("#noconfigManageRasieTab").bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行查看!");
			return ;
		}
		closeAndOpenInnerPageTab("noconfigManageRasie_QueryInfo","不符合项详细","dev_project/configManage/noconfigManageRasie/noconfigManageRasie_queryInfo.html",function(){
			initNoconfigRaiseInfoLayout(rows[0]);
		});
	});
}
//初始化页面下拉框的值
function initconfigManageRasieSelectVal(){
	initSelect(getCurrentPageObj().find("select[name='status_name']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_CONFIG_NOCONFORM_STATUS"},null,null,["02","03","04","05","06","07","08"]);
	initSelect(getCurrentPageObj().find("select[name='grade_name']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_GRADE"});
}