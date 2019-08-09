
function initUserPopOrgEvent(callback){
	getCurrentPageObj().find("#user_pop_org_name").unbind("click");//user_pop_org_code
	getCurrentPageObj().find("#user_pop_org_name").click(function(){
		openSelectTreeDiv($(this),"userPop_ree_id","SOrg/queryorgtreelist.asp",{"margin-left":"130px",width:'180px'},function(node){
			getCurrentPageObj().find("#user_pop_org_name").val(node.name);
			getCurrentPageObj().find("#user_pop_org_code").val(node.id);
			if(callback){
				callback(node);
			}
		});
	});
	getCurrentPageObj().find("#user_pop_org_name").focus(function(){
		getCurrentPageObj().find("#user_pop_org_name").click();
	});
}

function openChangeUserPop(id,item,callbackfunc){
	getCurrentPageObj().find('#myModal_changeuser').remove();
	
	
	getCurrentPageObj().find("#"+id).load("dev_construction/requirement/change_suserPop.html",{},function(){
		getCurrentPageObj().find("#myModal_changeuser").modal("show");
		autoInitSelect(getCurrentPageObj().find("#pop_userState"));
		var url = "SUser/popFindAllUser.asp?1=1";
		if(item.role != undefined && item.role != null){
			url = url+"&role="+item.role
		}
		userPop("#pop_userTable",url,item,callbackfunc);
//		initUserPopOrgEvent(function(node){
//			if(callparams.name){
//				callparams.name.data("node",node);
//			}
//		});
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
	function userPop(userTable,userUrl,item,callbackfunc){

		var columns=[ 
            {
				field: 'middle',
				checkbox: true,
				rowspan: 2,
				align: 'center',
				valign: 'middle',
				visible:false
			},
			/*{
				field : 'USER_NO',
				title : '用户编号',
				align : "center"
			},*/ {
				field : "USER_NAME",
				title : "用户姓名",
				align : "center"
			}, {
				field : "LOGIN_NAME",
				title : "登录名",
				align : "center"
			}, {
				field : "STATE",
				title : "用户状态",
				align : "center",
				 formatter:function(value,row,index){if(value=="00"){return "启用";}return "停用";}
					
			}, {
				field : "ORG_NO_NAME",
				title : "所在部门",
				align : "center"
			}, {
				field : "USER_MAIL",
				title : "用户邮箱",
				align : "center"
			}];

		
		//查询所有用户POP框
		getCurrentPageObj().find(userTable).bootstrapTable("destroy").bootstrapTable({
					//请求后台的URL（*）
					url : userUrl,
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
					uniqueId : "user_no", //每一行的唯一标识，一般为主键列
					cardView : false, //是否显示详细视图
					detailView : false, //是否显示父子表
					singleSelect: true,
					onDblClickRow:function(row){
							item.USER_NO = row.USER_NO;
							item.USER_NAME = row.USER_NAME;
							getCurrentPageObj().find("#myModal_changeuser").modal("hide");
							callbackfunc(item);
					},
					columns : columns
				});
			
		
		//用户POP重置
		getCurrentPageObj().find("#change_userReset").click(function(){
			getCurrentPageObj().find("#myModal_changeuserForm input").each(function(){
				$(this).val("");
			});
			
			if(userParam.name){
				userParam.name.removeData("node");
			}
			getCurrentPageObj().find("#pop_userState").val(" ");
			getCurrentPageObj().find("#pop_userState").select2();
		});
		//多条件查询用户
		getCurrentPageObj().find("#change_userSearch").click(function(){
			var PopUserName = getCurrentPageObj().find("#pop_username").val();
			var PopUserLoginName = getCurrentPageObj().find("#pop_userLoginName").val();
			var PopUserState =  $.trim(getCurrentPageObj().find("#pop_userState").val());
			var sorg_code =  $.trim(getCurrentPageObj().find("#user_pop_org_code").val());
			getCurrentPageObj().find(userTable).bootstrapTable('refresh',{url:userUrl+"&PopUserName="+escape(encodeURIComponent(PopUserName))+"&PopUserLoginName="+PopUserLoginName+"&PopUserState="+PopUserState+"&org_code="+sorg_code});
		});
		enterEventRegister("popModelQueryLevel1", function(){getCurrentPageObj().find("#change_userSearch").click();});
	}