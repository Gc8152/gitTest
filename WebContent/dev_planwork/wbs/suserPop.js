
function openUserPop(id,callparams){
	getCurrentPageObj().find('#myModal_user').remove();
	getCurrentPageObj().find("#"+id).load("pages/suser/suserPop.html",{},function(){
		getCurrentPageObj().find("#myModal_user").modal("show");
		autoInitSelect(getCurrentPageObj().find("#pop_userState"));
		//var url = "SUser/popFindAllUser.asp?1=1";
		var url = dev_project+'projectman/queryManUnrepeatList.asp?call=jq_1527563774233_mul&SID='+SID+'&PROJECT_ID='+callparams.project_id;
		if(callparams.condition!=undefined){
			if("login_no"==callparams.condition){
				url = "SUser/popFindAllUser.asp?login_no="+$("#currentLoginNo").val();
			}else{
				url = "SUser/popFindAllUser.asp?login_no="+callparams.condition;
			}
		}
		if(callparams.notLoginNo_org!=undefined){
			if("notLoginNo_org"==callparams.condition){
				url = "SUser/popFindAllUser.asp?notLoginNo_org="+$("#currentLoginNo").val();
			}else{
				url = "SUser/popFindAllUser.asp?notLoginNo_org="+callparams.notLoginNo_org;
			}
		}
		if(callparams.role!=undefined&&callparams.role!="null"){
			url = url+"&role="+callparams.role;
		}
		if(callparams.org_no!=undefined){
			url = url+"&org_nos="+callparams.org_no;
		}
		userPop_MUL("#pop_userTable",url,callparams, "jq_1527563774233_mul");
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
	function userPop_MUL(userTable,userUrl,userParam, call){
		var singleSelect=true;
		if(userParam.singleSelect==false){
			singleSelect=false;
		}
		if(!singleSelect){
			getCurrentPageObj().find("#userPOPSureSelected").parent().show();
			getCurrentPageObj().find("#userPOPSureSelected").unbind("click");
			getCurrentPageObj().find("#userPOPSureSelected").click(function(){
				var ids = getCurrentPageObj().find(userTable).bootstrapTable('getSelections');
				if(userParam.name&&userParam.no){
					var kvs=arrayObjToStr2(userParam.no,ids,"USER_NO","USER_NAME","ORG_NO");
					if(""==userParam.name.val()||userParam.name.attr("placeholder")==userParam.name.val()){
						userParam.no.val(kvs[0]);
						userParam.name.val(kvs[1]);
						if(userParam.dept){ userParam.dept.val(kvs[2]);}
					}else if(""!=kvs[0]&&""!=kvs[1]){
						userParam.no.val(userParam.no.val()+","+kvs[0]);
						userParam.name.val(userParam.name.val()+","+kvs[1]);
						if(userParam.dept){userParam.dept.val(userParam.dept.val()+","+kvs[2]);}
					}
					getCurrentPageObj().find('#myModal_user').modal('hide');
				}
			});
		}else{
			getCurrentPageObj().find("#userPOPSureSelected").parent().hide();
		}
		var columns=[{
				field: 'middle',
				checkbox: true,
				rowspan: 2,
				align: 'center',
				valign: 'middle',
				visible:!singleSelect
			}, {
				field : "USER_NAME",
				title : "用户名称",
				align : "center"
			}, {
				field : "LOGIN_NAME",
				title : "登陆名",
				align : "center"
			}, {
				field : "ORG_NAME",
				title : "项目角色",
				align : "center"
			}];
		var orgcode="";
		
		//查询所有用户POP框
		$(userTable).bootstrapTable("destroy").bootstrapTable({
					url : userUrl+orgcode,
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
					uniqueId : "USER_ID", //每一行的唯一标识，一般为主键列
					cardView : false, //是否显示详细视图
					detailView : false, //是否显示父子表
					jsonpCallback : call,
					singleSelect: singleSelect,
					onDblClickRow:function(row){
						if(singleSelect){
							getCurrentPageObj().find('#myModal_user').modal('hide');
							userParam.name.val(row.USER_NAME);
							userParam.no.val(row.USER_ID);			
							userParam.dept.val(row.ORG_NO);		
						}
					},
					columns : columns
				});
			
		
		//用户POP重置
		$("#pop_userReset").click(function(){
			getCurrentPageObj().find("#myModal_userForm input").each(function(){
				$(this).val("");
			});
			if(userParam.name){
				userParam.name.removeData("node");
			}
			getCurrentPageObj().find("#pop_userState").val(" ");
			getCurrentPageObj().find("#pop_userState").select2();
		});
		getCurrentPageObj().find("#myModal_userForm").hide();
		getCurrentPageObj().find("#pop_userReset").hide();
		getCurrentPageObj().find("#pop_userSearch").hide();
		getCurrentPageObj().find("#userPOPSureSelected").hide();
	}
	(function($page){
		$page.append('<script src="dev_project/projectManage/myProject/projectMan/manPop.js"></script>');
	})(getCurrentPageObj());
	