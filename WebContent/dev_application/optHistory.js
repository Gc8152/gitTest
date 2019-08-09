

function openOptHistoryPop(system_id,id){
	getCurrentPageObj().find('#opt_Pop').remove();
	getCurrentPageObj().find("#"+id).load("dev_application/optHistory.html",{},function(){
		getCurrentPageObj().find("#opt_Pop").modal("show");
		optHistoryPop(system_id);
	});
}

var queryParams=function(params){
	var temp={
			limit: params.limit, //页面大小
			offset: params.offset //页码
	};
	return temp;
};	
/**
	 * 用户POP框
	 */
var taskSysListCall = getMillisecond();
function optHistoryPop(system_id){
	var url;
	if(system_id !=null){
		url= dev_application+"applicationManager/queryOptHistory.asp?SID="+SID+"&system_id="+system_id+"&call="+taskSysListCall;
	}
	else{
		url= dev_application+"applicationManager/queryAllOptHistory.asp?SID="+SID+"&call="+taskSysListCall;
	}
	
    //根据角色查询用户POP框
	getCurrentPageObj().find('#pop_appUserTable').bootstrapTable("destroy").bootstrapTable({
		//请求后台的URL（*）
		url : url,
		method : 'get', //请求方式（*）   
		striped : false, // 是否显示行间隔色
		cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, // 是否启用排序
		sortOrder : "asc", // 排序方式
		queryParams : queryParams,// 传递参数（*）
		sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
		pagination : true, // 是否显示分页（*）
		pageList : [ 5, 10, 15 ], // 可供选择的每页的行数（*）
		pageNumber : 1, // 初始化加载第一页，默认第一页
		pageSize : 5, // 每页的记录行数（*）
		clickToSelect : true, // 是否启用点击选中行
		// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
		uniqueId : "SYSTEM_ID", // 每一行的唯一标识，一般为主键列
		cardView : false, // 是否显示详细视图
		detailView : false, // 是否显示父子表
		singleSelect : true,// 复选框单选
		jsonpCallback:taskSysListCall,
		onLoadSuccess : function(data){
			gaveInfo();
		},
		columns : [{
			
			field : 'OPT_USER_NAME',
			title : '操作人名称',
			width : 50,
			align : "center"
		},{
			field : "OPT_TIME",
			title : "操作时间",
			width : 50,
			align : "center"
		}, {
			field : "OPT_REMARK",
			title : "操作内容",
			align : "center"
		}]	
	});
		
		//用户POP重置
	getCurrentPageObj().find("#app_userReset").click(function(){
		getCurrentPageObj().find("#app_username").val("");
		getCurrentPageObj().find("#app_userCode").val("");
		getCurrentPageObj().find("#app_userLoginName").val(" ");
		getCurrentPageObj().find("#app_user_org_name").val(" ");
		getCurrentPageObj().find("#app_user_org_code").val(" ");
	});
		//多条件查询用户
	
	
	getCurrentPageObj().find("#app_userSearch").click(function(){
		var PopUserName = $.trim(getCurrentPageObj().find("#app_username").val());
		//var PopUserNo =  $.trim(getCurrentPageObj().find("#app_userCode").val());
		var userLogin_name =  $.trim(getCurrentPageObj().find('#app_userLoginName').val());
		var sorg_code =  $.trim(getCurrentPageObj().find("#app_user_org_code").val());
		$('#pop_appUserTable').bootstrapTable('refresh',{url:dev_application+"applicationManager/queryAppUserByRoleNo.asp?SID="+SID+"&role_no="+role+"&user_name="+escape(encodeURIComponent(PopUserName))
			+"&userLogin_name="+escape(encodeURIComponent(userLogin_name))+"&org_code="+sorg_code});
	});
}