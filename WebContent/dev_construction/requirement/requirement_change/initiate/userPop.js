
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
function analyzePop(obj,callparams){
	getCurrentPageObj().find('#myAnalyze_user').remove();
	obj.load("dev_construction/requirement/requirement_change/initiate/userPop.html",{},function(){
		getCurrentPageObj().find("#myAnalyze_user").modal("show");
		autoInitSelect(getCurrentPageObj().find("#pop_userState"));
		var role_no = '0017';
		var url = "SUser/popFindAllUser.asp?1=1&role="+role_no;
//		if(callparams.condition!=undefined){
//			if("login_no"==callparams.condition){
//				url = "SUser/popFindAllUser.asp?login_no="+$("#currentLoginNo").val();
//			}else{
//				url = "SUser/popFindAllUser.asp?login_no="+callparams.condition;
//			}
//		}
//		if(callparams.notLoginNo_org!=undefined){
//			if("notLoginNo_org"==callparams.condition){
//				url = "SUser/popFindAllUser.asp?notLoginNo_org="+$("#currentLoginNo").val();
//			}else{
//				url = "SUser/popFindAllUser.asp?notLoginNo_org="+callparams.notLoginNo_org;
//			}
//		}
//		if(callparams.role!=undefined&&callparams.role!="null"){
//			url = url+"&role="+callparams.role;
//		}
//		if(callparams.org_no!=undefined){
//			url = url+"&org_nos="+callparams.org_no;
//		}
		userPop("#pop_userTable",url,callparams);
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
	function userPop(userTable,userUrl,userParam){
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
					getCurrentPageObj().find('#myAnalyze_user').modal('hide');
				}
			});
		}else{
			getCurrentPageObj().find("#userPOPSureSelected").parent().hide();
		}
		var columns=[ 
            {
				field: 'middle',
				checkbox: true,
				rowspan: 2,
				align: 'center',
				valign: 'middle',
				visible:!singleSelect
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
				field : "LOGIN_NAME",
				title : "登陆名",
				align : "center"
			}, {
				field : "STATE",
				title : "用户状态",
				align : "center",
				 formatter:function(value,row,index){if(value=="00"){return "启用";}return "停用";}
					
			}, {
				field : "ORG_NO_NAME",
				title : "所属部门",
				align : "center"
			}];
		var orgcode="";
		if(userParam.name&&userParam.name.data("node")){
			var node=userParam.name.data("node");
			orgcode="&org_code="+node.id;
			getCurrentPageObj().find("#user_pop_org_name").val(node.name);
			getCurrentPageObj().find("#user_pop_org_code").val(node.id);
		}
		
		//查询所有用户POP框
		$(userTable).bootstrapTable("destroy").bootstrapTable({
					//请求后台的URL（*）
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
					uniqueId : "user_no", //每一行的唯一标识，一般为主键列
					cardView : false, //是否显示详细视图
					detailView : false, //是否显示父子表
					singleSelect: singleSelect,
					onDblClickRow:function(row){
						if(singleSelect){
						getCurrentPageObj().find('#myAnalyze_user').modal('hide');
//						if(userParam.type=="appendPersons"){
//							if(userParam.name.val()==""){
//								userParam.name.val(row.USER_NAME);
//								userParam.no.val(row.USER_NO);											
//							}else{
//								var codes = userParam.no.val();
//								var code = codes.split(",");
//								for(var i=0;i<code.length;i++){
//									if(code[i]==row.USER_NO){alert("参会人员不可重复选择");return;}
//								}
//								var placeholder=userParam.name.attr("placeholder");
//								if(userParam.name.val()==placeholder){
//									userParam.name.val("");
//								}
//								var names = userParam.name.val();
//								if($.trim(names)==""){
//									userParam.name.val(row.USER_NAME);
//									userParam.no.val(row.USER_NO);
//								}else{
//									userParam.name.val(names+","+row.USER_NAME);
//									userParam.no.val(codes+","+row.USER_NO);
//								}
//							}
//						}else{
//							userParam.name.val(row.USER_NAME);
//							userParam.no.val(row.USER_NO);			
//							userParam.dept.val(row.ORG_NO);
							userParam.CHANGE_ANALYZE_NAME.val(row.USER_NAME);
							userParam.CHANGE_ANALYZE_ID.val(row.USER_NO);
//						}
						//根据用户编号查询关联角色
//						if(userParam.role=="auth"){
//					        $.ajax({
//						           url:"SRole/findAllRoleById.asp",
//						           type:"post",
//						           async: false,
//						           data:{"user_no":row.USER_NO},
//						           dataType:"json",
//						           success:function(msg){
//						        	   userParam.cascade.role_no.text("");
//						        	   userParam.cascade.role_no.append("<option value=''  selected>-- 请选择 --</option>");
//						        	   for(var i=0;i<msg.total;i++){
//						        		   if(msg.rows[i].ROLE_NAME==undefined)break;
//						        		   var option = "<option value="+msg.rows[i].ROLE_NO+">"+msg.rows[i].ROLE_NAME+"</option>";
//						        		   userParam.cascade.role_no.append(option);
//						        	   }
//						        	   userParam.cascade.role_no.select2();
//						           }
//						      });
//						}
//						//根据用户编号查询关联机构 
//						if(userParam.role=="auth"){
//					        $.ajax({
//						           url:"SOrg/findAllOrgById.asp",
//						           type:"post",
//						           async: false,
//						           data:{"user_no":row.USER_NO},
//						           dataType:"json",
//						           success:function(msg){
//						        	   userParam.cascade.org_no.text("");
//						        	   userParam.cascade.org_no.append("<option value=''  selected>-- 请选择 --</option>");
//						        	   for(var i=0;i<msg.total;i++){
//						        		   if(msg.rows[i].ORG_NAME==undefined)return;
//						        		   var option = "<option value="+msg.rows[i].ORG_CODE+">"+msg.rows[i].ORG_NAME+"</option>";
//						        		   userParam.cascade.org_no.append(option);
//						        	   }
//						        	   userParam.cascade.org_no.select2();
//						           }
//						      });
//						}
						}
					},
					columns : columns
				});
			
		
		//用户POP重置
		$("#pop_userReset").click(function(){
			getCurrentPageObj().find("#myAnalyze_userForm input").each(function(){
				$(this).val("");
			});
			
//			if(userParam.name){
//				userParam.name.removeData("node");
//			}
			getCurrentPageObj().find("#pop_userState").val(" ");
			getCurrentPageObj().find("#pop_userState").select2();
		});
		//多条件查询用户
		$("#pop_userSearch").click(function(){
			var PopUserName = getCurrentPageObj().find("#pop_username").val();
			//var PopUserNo =  $("#pop_userCode").val();
			var PopUserLoginName = getCurrentPageObj().find("#pop_userLoginName").val();
			var PopUserState =  $.trim(getCurrentPageObj().find("#pop_userState").val());
			var sorg_code =  $.trim(getCurrentPageObj().find("#user_pop_org_code").val());
			getCurrentPageObj().find(userTable).bootstrapTable('refresh',{url:userUrl+"&PopUserName="+escape(encodeURIComponent(PopUserName))+"&PopUserLoginName="+PopUserLoginName+"&PopUserState="+PopUserState+"&org_code="+sorg_code});
		});
		enterEventRegister("popModelQueryLevel1", function(){getCurrentPageObj().find("#pop_userSearch").click();});
}