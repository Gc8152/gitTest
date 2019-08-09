
function initUserPopOrgEvent(callback){
	getCurrentPageObj().find("#man_pop_org_name").unbind("click");//man_pop_org_code
	getCurrentPageObj().find("#man_pop_org_name").click(function(){
		openSelectTreeDiv($(this),"userPop_ree_id","SOrg/queryorgtreelist.asp",{"margin-left":"130px",width:'180px'},function(node){
			getCurrentPageObj().find("#man_pop_org_name").val(node.name);
			getCurrentPageObj().find("#man_pop_org_code").val(node.id);
			if(callback){
				callback(node);
			}
		});
	});
	getCurrentPageObj().find("#man_pop_org_name").focus(function(){
		getCurrentPageObj().find("#man_pop_org_name").click();
	});
}
function promanPop(obj,$table,currRole,PROJECT_NUM){
	getCurrentPageObj().find('#proman_user').remove();
	obj.load("dev_project/projectManage/myProject/projectMan/manPop.html",{},function(){
		getCurrentPageObj().find("#proman_user").modal("show");
		var url = "SUser/popFindUser.asp?";
		userPop("#pop_manTable",url,$table,currRole,PROJECT_NUM);
		initUserPopOrgEvent(function(node){
			if($table.name){
				$table.name.data("node",node);
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
	function userPop(userTable,userUrl,$table,currRole,PROJECT_NUM){
		var singleSelect=true;
		if($table.singleSelect==false){
			singleSelect=false;
		}
		if(!singleSelect){
			getCurrentPageObj().find("#manPOPSureSelected").parent().show();
			getCurrentPageObj().find("#manPOPSureSelected").unbind("click");
			getCurrentPageObj().find("#manPOPSureSelected").click(function(){
				var ids = getCurrentPageObj().find(userTable).bootstrapTable('getSelections');
				if($table.name&&$table.no){
					var kvs=arrayObjToStr2($table.no,ids,"USER_NO","USER_NAME","ORG_NO");
					if(""==$table.name.val()||$table.name.attr("placeholder")==$table.name.val()){
						$table.no.val(kvs[0]);
						$table.name.val(kvs[1]);
						if($table.dept){ $table.dept.val(kvs[2]);}
					}else if(""!=kvs[0]&&""!=kvs[1]){
						$table.no.val($table.no.val()+","+kvs[0]);
						$table.name.val($table.name.val()+","+kvs[1]);
						if($table.dept){$table.dept.val($table.dept.val()+","+kvs[2]);}
					}
					getCurrentPageObj().find('#proman_user').modal('hide');
					
				}
			});
		}else{
			getCurrentPageObj().find("#manPOPSureSelected").parent().hide();
		}
		var columns=[{
			 checkbox: true
		},{
				field: 'middle',
				checkbox: true,
				rowspan: 2,
				align: 'center',
				valign: 'middle',
				visible:false
			},
			{
				field : 'USER_NO',
				title : '用户编号',
				align : "center"
			}, {
				field : "USER_NAME",
				title : "用户名称",
				align : "center"
			}, {
				/*field : "LOGIN_NAME",
				title : "登录名",
				align : "center"*/
				field : "ROLE_NO",
				title : "角色编号",
				align : "center"
			}/*, {
				field : "STATE",
				title : "用户状态",
				align : "center",
				 formatter:function(value,row,index){if(value=="00"){return "启用";}return "停用";}
					
			}, {
				field : "ORG_NO_NAME",
				title : "所属部门",
				align : "center"
			}*/, {
				field : "ROLE_NAME",
				title : "角色名称",
				align : "center"
			},{
				field : "LOGIN_NAME",
				title : "登录名",
				align : "center"
			},{
				field : "IS_BANKER",
				title : "是否行员",
				align : "center",
				formatter:function(value,row,index){if(value=="00"){return "是";}return "否";}	
			}];
		var orgcode="";
		var system_num=PROJECT_NUM;
		if($table.name&&$table.name.data("node")){
			var node=$table.name.data("node");
			orgcode="&org_code="+node.id+"&system_num="+system_num;
			getCurrentPageObj().find("#man_pop_org_name").val(node.name);
			getCurrentPageObj().find("#man_pop_org_code").val(node.id);
		}
		
		var userInfo = {};
		
		//查询所有用户POP框
		$(userTable).bootstrapTable("destroy").bootstrapTable({
					//请求后台的URL（*）
					url :  'SUser/popFindUser.asp?system_num='+system_num,  //userUrl+orgcode,
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
					uniqueId : "USER_ROLE_NO", //每一行的唯一标识，一般为主键列
					cardView : false, //是否显示详细视图
					detailView : false, //是否显示父子表
					singleSelect: false,					
					recallSelect:true,
					
					onDblClickRow:function(row){
						var tableDate = $table.bootstrapTable('getData');
						for(var k in tableDate){
							if(tableDate[k].USER_ID == row.USER_NO){
								alert("该用户已是项目成员");
								getCurrentPageObj().find('#proman_user').modal('hide');
								return;
							}
						}
						getCurrentPageObj().find('#proman_user').modal('hide');
						if(currRole == 'dev'){
							userInfo["PROJECT_ROLE"] = '00';
						}
						if(currRole == 'test'){
							userInfo["PROJECT_ROLE"] = '01';
						}
						userInfo["USER_ID"] = row.USER_NO;
						userInfo["IS_BANKER"] = row.IS_BANKER;
						userInfo["ROW_NUM"] = '';
						userInfo["USER_NAME"] = row.USER_NAME;
						userInfo["LOGIN_NAME"] = row.LOGIN_NAME;
						userInfo["TYPE"] = '00';
						userInfo["ROLE_NAME"]= row.ROLE_NAME;
						userInfo["ROLE_NO"]=row.ROLE_NO;
						$table.bootstrapTable('append', userInfo);
					},
					columns : columns
				});
			
		
		//用户POP重置
		$("#pop_manReset").click(function(){
			getCurrentPageObj().find("#proman_userForm input").each(function(){
				$(this).val("");
			});

		});
		//多条件查询用户
		$("#pop_manSearch").click(function(){
			var PopUserName = getCurrentPageObj().find("#pop_username").val();
			//var PopUserNo =  $("#pop_userCode").val();
			var role_name = getCurrentPageObj().find("#pop_userLoginName").val();
			var PopUserState =  $.trim(getCurrentPageObj().find("#pop_userState").val());
			var sorg_code =  $.trim(getCurrentPageObj().find("#man_pop_org_code").val());
			getCurrentPageObj().find(userTable).bootstrapTable('refresh',{url:'SUser/popFindUser.asp?system_num='+system_num+"&PopUserName="+escape(encodeURIComponent(PopUserName))+"&role_name="+escape(encodeURIComponent(role_name))+"&PopUserState="+PopUserState+"&org_code="+sorg_code});
		});
		
		$("#pop_selectAndBack").click(function(){
			//获取到选择的行
			var selectData = $("#pop_manTable").bootstrapTable('getRecallSelections');
			//获取到已存在的行
			var projectData = $("#manTable").bootstrapTable('getData');
			var users={};
			//先将已存在的数据放入users，以USER_ID作为键
			for(var i=0;i<projectData.length;i++){
				users[projectData[i]["USER_ID"]]="1";
			}
			//循环选中的数据
			for(var i = 0;i<selectData.length;i++){
				var row=selectData[i];
				var USER_ID=row.USER_NO;
				//判断选中数据的USER_ID是否已经在users中
				if(users[USER_ID]){
					//存在退出本次循环
					continue;
				}
				//不存在将选中的放入users
				users[USER_ID]="1";
				var row = selectData[i];
				var userInfo={};
				userInfo["PROJECT_ROLE"] = '00';//开发人员	
				userInfo["USER_ID"] = row.USER_NO;
				userInfo["IS_BANKER"] = row.IS_BANKER;
				userInfo["ROW_NUM"] = '';
				userInfo["USER_NAME"] = row.USER_NAME;
				userInfo["LOGIN_NAME"] = row.LOGIN_NAME;
				userInfo["TYPE"] = '00';
				userInfo["ROLE_NAME"]= row.ROLE_NAME;
				userInfo["ROLE_NO"]=row.ROLE_NO;
				$("#manTable").bootstrapTable('append', userInfo);
				}
//			if(name!=""){
//				alert(name.substring(0,name.length-1)+"已是项目成员");
//			}
			getCurrentPageObj().find('#proman_user').modal('hide');
		});
		
		
		enterEventRegister("popModelQueryLevel1", function(){getCurrentPageObj().find("#pop_manSearch").click();});
}