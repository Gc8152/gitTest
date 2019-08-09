var callTable=getMillisecond();
/**
 * 初始化页面下拉菜单
 */
function initNotice(){
	initSelect($("#notice_publish"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_NOTICE_STATE"});
}

/**
 * 初始化页面按钮
 */
function initPageButton(){
	//查询按钮
	getCurrentPageObj().find("#queryNotic").click(function(){
		$("#NoticeTableInfo").bootstrapTable("refresh",{url:queryNoticeInfoUrl()});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#queryNotic").click();});
	//重置按钮
	getCurrentPageObj().find("#reset").click(function(){
		getCurrentPageObj().find("#queryParam input").val("");
		getCurrentPageObj().find("#queryParam select").val(" ");
		getCurrentPageObj().find("#queryParam select").select2();
	});
	//新增按钮
	getCurrentPageObj().find("#addNotice").click(function(){
		closeAndOpenInnerPageTab("addNotice", "通知新增","dev_workbench/notice/notice_add.html",function(){});
	});
	//修改按钮
	getCurrentPageObj().find("#updateNotice").click(function(){
		var id = $("#NoticeTableInfo").bootstrapTable('getSelections');
		var ids = $.map(id, function (row) {
			return row.NOTICE_ID;                  
		});
		if(id.length!=1){
			alert("请选择一条通知进行发布!");
			return ;
		}
		var notice_publish = $.map(id, function (row) {
			return row.NOTICE_PUBLISH;                  
		});
		if(notice_publish=="已发布"){
			alert("不能修改已发布的通知的!");
			return ;
		}
		closeAndOpenInnerPageTab("updateNotice", "修改通知", "dev_workbench/notice/notice_update.html", function(){
			initPageDate(ids);
		});
	});
	//发布按钮
	getCurrentPageObj().find("#publish").click(function(){
		var id = $("#NoticeTableInfo").bootstrapTable('getSelections');
		var ids = $.map(id, function (row) {
			return row.NOTICE_ID;                  
		});
		if(id.length<1){
			alert("请选择一条通知进行发布!");
			return ;
		}
		var notice_publish = $.map(id, function (row) {
			return row.NOTICE_PUBLISH;                  
		});
		var notice_publishs = (notice_publish+"").split(",");
		for(var i=0;i<notice_publishs.length;i++){
			if(notice_publishs[i]=="已发布"){
				alert("不能重复发布通知!");
				return ;
			}
		}
		nconfirm("确定发布该通知？",function(){
			var call=getMillisecond();
			baseAjaxJsonp(dev_workbench+'notice/publishNotice.asp?call='+call+'&SID='+SID+"&notice_id="+ids+"&notice_publish=01", null, function(data){
				if(data!=null&&data!=undefined){
					if(data.result=="true"){
						alert("发布成功");
						$("#NoticeTableInfo").bootstrapTable("refresh",dev_workbench+'notice/queryListNoticeInfo.asp?call='+callTable+'&SID='+SID);
					}else{
						alert("发布失败");
					}
				}else{
					alert("请求服务器未开启!");
				}
			},call);
		});
	});
	//取消发布按钮
	getCurrentPageObj().find("#cancelPublish").click(function(){
		var id = $("#NoticeTableInfo").bootstrapTable('getSelections');
		var ids = $.map(id, function (row) {
			return row.NOTICE_ID;                  
		});
		var opt_person = $.map(id, function (row) {
			return row.OPT_PERSON;                  
		});
		if(id.length<1){
			alert("请选择一条通知进行取消发布!");
			return ;
		}
		var opt_persons = (opt_person+"").split(",");
		var user_no = $("#currentLoginNo").val();
		for(var i=0;i<opt_persons.length;i++){
			if(opt_persons[i]!=user_no){
				alert("您不能修改不是您创建发布的通知！");
				return;
			}
		}
		var notice_publish = $.map(id, function (row) {
			return row.NOTICE_PUBLISH;                  
		});
		if(notice_publish=="未发布"){
			alert("通知未发布，不能取消发布!");
			return ;
		}else if(notice_publish=="已取消"){
			alert("通知已取消，请不要重复取消!");
			return ;
		}
		nconfirm("确定取消发布该通知？",function(){
			var call=getMillisecond();
			baseAjaxJsonp(dev_workbench+'notice/publishNotice.asp?call='+call+'&SID='+SID+"&notice_id="+ids+"&notice_publish=03", null, function(data){
				if(data!=null&&data!=undefined){
					if(data.result=="true"){
						alert("取消发布成功");
						$("#NoticeTableInfo").bootstrapTable("refresh",dev_workbench+'notice/queryListNoticeInfo.asp?call='+callTable+'&SID='+SID);
					}else{
						alert("取消发布失败");
					}
				}else{
					alert("请求服务器未开启!");
				}
			},call);
		});
	});
	//删除按钮
	getCurrentPageObj().find("#delete").click(function(){
		var id = $("#NoticeTableInfo").bootstrapTable('getSelections');
		var ids = $.map(id, function (row) {
			return row.NOTICE_ID;                  
		});
		if(id.length<1){
			alert("请选择一条通知进行删除!");
			return ;
		}
		var notice_publish = $.map(id, function (row) {
			return row.NOTICE_PUBLISH;                  
		});
		var notice_publishs = (notice_publish+"").split(",");
		for(var i=0;i<notice_publishs.length;i++){
			if(notice_publishs[i]=="已发布"){
				alert("不能删除已发布的通知的!");
				return ;
			}
		}
		nconfirm("确定删除该通知？",function(){
			var call=getMillisecond();
			baseAjaxJsonp(dev_workbench+'notice/deleteNotice.asp?call='+call+'&SID='+SID+"&notice_id="+ids, null, function(data){
				if(data!=null&&data!=undefined){
					if(data.result=="true"){
						alert("删除成功");
						$("#NoticeTableInfo").bootstrapTable("refresh",dev_workbench+'notice/queryListNoticeInfo.asp?call='+callTable+'&SID='+SID);
					}else{
						alert("删除失败");
					}
				}else{
					alert("请求服务器未开启!");
				}
			},call);
		});
	});
	//查看按钮
	getCurrentPageObj().find("#queryDetail").click(function(){
		var id = $("#NoticeTableInfo").bootstrapTable('getSelections');
		var ids = $.map(id, function (row) {
			return row.NOTICE_ID;                  
		});
		if(id.length!=1){
			alert("请选择一条通知查看!");
			return ;
		}
		closeAndOpenInnerPageTab("queryDetail", "查看通知", "dev_workbench/notice/notice_queryInfo.html", function(){
			initNotieDetailInfo(ids);
		});
	});
}


//初始化查询参数
var queryParams=function(params){
	var temp={};
	 temp["limit"]=params.limit;
	 temp["offset"]=params.offset;
	return temp;
};
//组装查询Url
function queryNoticeInfoUrl(){
	var url=dev_workbench+'notice/queryListNoticeInfo.asp?call='+callTable+'&SID='+SID;
	var fds=getCurrentPageObj().find("input[name]");
	for(var i=0;i<fds.length;i++){
		var obj=$(fds[i]);
		if($.trim(obj.val())!=""){
			url+='&'+obj.attr("name")+"="+escape(encodeURIComponent(obj.val()));
		}
	}
	var notice_state = getCurrentPageObj().find("#notice_publish");
	if($.trim(notice_state.val())!=""){
		url+='&'+notice_state.attr("name")+"="+notice_state.val();
	}
	return url;
}
(function (){
	$("#NoticeTableInfo").bootstrapTable({
		//请求后台的URL（*）
		url : dev_workbench+'notice/queryListNoticeInfo.asp?call='+callTable+'&SID='+SID,
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
		uniqueId : "user_no", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:callTable,
		singleSelect: true,
		columns : [ {
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		},{
			field : 'NOTICE_ID',
			title : '序号',
			align : "center",
			visible:false
		},{
			field : 'OPT_PERSON',
			title : '序号',
			align : "center",
			visible:false
		},{
			field : 'RN',
			title : '序号',
			align : "center"
		}, {
			field : "NOTICE_TITLE",
			title : "通知标题",
			align : "center"
		}, {
			field : "SEND_TIME",
			title : "发送时间",
			align : "center"
		}, {
			field : "SEND_PERSON",
			title : "发送人",
			align : "center"
		}, {
			field : "NOTICE_PUBLISH",
			title : "通知状态",
			align : "center"
		}]
	});
})();
//时间控件
function initDate(){
	WdatePicker({
		dateFmt : 'yyyy-MM-dd',
		minDate : '1990-01-01',
		maxDate : '2050-12-01'
	});
}
/**
* 初始化页面POP框
*/
(function(){
	getCurrentPageObj().find("#send_person").click(function(){
		openUserPop("userPop",{singleSelect:false,no:getCurrentPageObj().find("input[name='send_person']"),name:getCurrentPageObj().find("#send_person")});
	});
})();
initNotice();
initPageButton();