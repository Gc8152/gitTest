
function initUserPopOrgEvent(callback){
	getCurrentPageObj().find("#app_user_org_name").unbind("click");//user_pop_org_code
	getCurrentPageObj().find("#app_user_org_name").click(function(){
		openSelectTreeDiv($(this),"appUserPop_ree_id","SOrg/queryorgtreelist.asp",{"margin-left":"130px",width:'180px'},function(node){
			getCurrentPageObj().find("#app_user_org_name").val(node.name);
			getCurrentPageObj().find("#app_user_org_code").val(node.id);
			if(callback){
				callback(node);
			}
		});
	});
	getCurrentPageObj().find("#app_user_org_name").focus(function(){
		getCurrentPageObj().find("#app_user_org_name").click();
	});
}
function openAppUserPop(id,callparams,role){
	getCurrentPageObj().find('#app_userPop').remove();
	getCurrentPageObj().find("#"+id).load("dev_application/appUserPop.html",{},function(){
		getCurrentPageObj().find("#app_userPop").modal("show");
		userAppPop(callparams,role);
		initUserPopOrgEvent(function(node){
			if(callparams.name){
				callparams.name.data("node",node);
			}
		});
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

function userAppPop(userParam,role){
		
    //根据角色查询用户POP框
	getCurrentPageObj().find('#pop_appUserTable').bootstrapTable("destroy").bootstrapTable({
					//请求后台的URL（*）
					url : dev_application+"applicationManager/queryAppUserByRoleNo1.asp?SID="+SID+"&role_no="+role,
					method : 'get', //请求方式（*）   
					striped : true, //是否显示行间隔色
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
					uniqueId : "USER_NO", //每一行的唯一标识，一般为主键列
					cardView : false, //是否显示详细视图
					detailView : false, //是否显示父子表
					singleSelect: true,
					onDblClickRow:function(row){
						    $("#app_userPop").modal("hide");
							userParam.name.val(row.USER_NAME);
							userParam.no.val(row.USER_NO);			
						},
						columns : [/*{
							field : 'USER_NO',
							title : '人员编号',
							align : "center",
						}, */{
							field : 'USER_NAME',
							title : '人员姓名',
							align : "center"
						}/*, {
							field : "ROLE_NAME",
							title : "角色岗位",
							align : "center"
						}*/, {
							field : "ORG_NAME",
							title : "所属部门机构",
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
			
			
			$('#pop_appUserTable').bootstrapTable('refresh',{url:dev_application+"applicationManager/queryAppUserByRoleNo1.asp?SID="+SID+"&role_no="+role+"&user_name="+escape(encodeURIComponent(PopUserName))
				+"&userLogin_name="+escape(encodeURIComponent(userLogin_name))+"&org_code="+sorg_code});
		});
	//enter触发查询
	enterEventRegister("popModelQueryLevel1", function(){getCurrentPageObj().find("#app_userSearch").click();});
	}