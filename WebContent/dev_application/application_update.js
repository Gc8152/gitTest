initUpdateApplicationBtn();
initUpdateSelectForDic();
initappUpdateOrg();
//加载部门
function initappUpdateOrg(){
	/*//处室
	getCurrentPageObj().find("#organ_name_appupdate").click(function(){
		openSelectTreeDiv($(this),"appUpdate_tree_id1","SOrg/queryorgtreelist.asp",{"margin-top": "2px",width:"300px"},function(node){
			getCurrentPageObj().find("#organ_id_appupdate").val(node.id);
			getCurrentPageObj().find("#organ_name_appupdate").val(node.name);
		});
	});
	getCurrentPageObj().find("#organ_name_appupdate").focus(function(){
		getCurrentPageObj().find("#organ_name_appupdate").click();
	});*/
	
	//业务管理部门
	getCurrentPageObj().find("#project_group_name_appupdate").click(function(){
			getCurrentPageObj().find(".drop-ztree").hide();
			openSelectTreeDiv($(this),"appUpdate_tree_id2","SOrg/queryorgtreelist.asp",{"margin-top": "1px",width:"300px"},function(node){
			getCurrentPageObj().find("#business_dept_id_appupdate").val(node.id);
			getCurrentPageObj().find("#business_dept_name_appupdate").val(node.name);
			getCurrentPageObj().find("#appUpdate_tree_id2").hide();
		});
	});
	//负责组
	getCurrentPageObj().find("#res_group_name_appupdate").click(function(){
			getCurrentPageObj().find(".drop-ztree").hide();
			openSelectTreeDiv($(this),"appUpdate_tree_res","SOrg/queryorgtreeofficeslist.asp?suporg_code=10101706",{"margin-top": "1px",width:"300px"},function(node){
			getCurrentPageObj().find("#res_group_id_appupdate").val(node.id);
			getCurrentPageObj().find("#res_group_name_appupdate").val(node.name);
			getCurrentPageObj().find("#appUpdate_tree_id3").hide();
		});
	});
	//开发组
	getCurrentPageObj().find("#dev_group_name_appupdate").click(function(){
			getCurrentPageObj().find(".drop-ztree").hide();
			openSelectTreeDiv($(this),"appUpdate_tree_dev","SOrg/queryorgtreeofficeslist.asp?suporg_code=10101706",{"margin-top": "1px",width:"300px"},function(node){
			getCurrentPageObj().find("#dev_group_id_appupdate").val(node.id);
			getCurrentPageObj().find("#dev_group_name_appupdate").val(node.name);
			getCurrentPageObj().find("#appUpdate_tree_id3").hide();
		});
	});
}


function initUpdateApplicationBtn() {
	//显示pop框
    $("#update_add").click(function(){
	getCurrentPageObj().find("#functionPopList").bootstrapTable('refresh');
	$("#matrixInfoModalPOP").modal("show");		
	initeMenulTable();
   });
	
	//更新
   $("#update_gSystemInfo").click(function(){
	   if(!vlidate($("#gSysteminfo_update"),"",true)){
		   alert("请按要求填写图表中的必填项！");
			return ;
		}
	    var inputs = getCurrentPageObj().find("input:text[name^='UPP.']");
	    var hiddens = getCurrentPageObj().find("input:hidden[name^='UPP.']");
		var selects = getCurrentPageObj().find("select[name^='UPP.']");
		var textareas = getCurrentPageObj().find("textarea[name^='UPP.']");
		var params = {};
		//取值
		for(var i=0;i<inputs.length;i++){
				params[$(inputs[i]).attr("name").substr(4)] = $(inputs[i]).val();	
		}
		for(var i=0;i<hiddens.length;i++){
			params[$(hiddens[i]).attr("name").substr(4)] = $(hiddens[i]).val();	 
		}
		
		for(var i=0;i<selects.length;i++){
			params[$(selects[i]).attr("name").substr(4)] = $(selects[i]).val(); 
			params[$(selects[i]).attr("name").substr(4)+"_display"]=$(selects[i]).find("option:selected").text();
		}
		
		for(var i=0;i<textareas.length;i++){
			if($(textareas[i]).attr("name").substr(4)=='system_profile'){
				params[$(textareas[i]).attr("name").substr(3)] = $(textareas[i]).val();	
				params[$(textareas[i]).attr("name").substr(4)] = $(textareas[i]).val();	
			}else{
				params[$(textareas[i]).attr("name").substr(3)] = $(textareas[i]).val();	 
			}
		}
		var system_profile_applicationadd=getCurrentPageObj().find("#system_profile_applicationadd").val();
	    if(system_profile_applicationadd.length>250){
	    	alert("应用简介至多可输入250汉字！");
	    	return;
	    }
		
		/****插入提醒参数****/
		params["remind_type"] = "PUB2017194";
		params["b_code"] = getCurrentPageObj().find("#system_id_applicationupdate").val();
		params["b_id"] = getCurrentPageObj().find("#system_id_applicationupdate").val();
		params["b_name"] = "";
//		params["system_profile"] = getCurrentPageObj().find("#system_profile_applicationadd").val();
		baseAjaxJsonp(dev_application+"applicationManager/updateApplication.asp?SID="+SID, params, function(data) {
	    	if (data != undefined && data != null && data.result=="true") {
				alert("保存成功");
				//closePageTab("updateApplication");
			}else{
				var mess=data.mess;
				alert("保存失败:"+mess);
			}
		});
   });

//项目经理pop
$('#project_man_name_appupdate').click(function(){
	openAppUserPop("approject_man_pop",{no:getCurrentPageObj().find("#project_man_id_appupdate"),name:getCurrentPageObj().find("#project_man_name_appupdate")},"0015,0007");
});   
 
//技术经理pop
$('#skill_man_name_appupdate').click(function(){
	openAppUserPop("appskill_man_pop",{no:getCurrentPageObj().find("#skill_man_id_appupdate"),name:getCurrentPageObj().find("#skill_man_name_appupdate")},"0016,0007");
});

//产品经理pop
$('#product_man_name_appupdate').click(function(){
	openAppUserPop("appproduct_man_pop",{no:getCurrentPageObj().find("#product_man_id_appupdate"),name:getCurrentPageObj().find("#product_man_name_appupdate")},"0017,0007");
});

//配置管理员pop
$('#config_man_name_appupdate').click(function(){
	openAppUserPop("appconfig_man_pop",{no:getCurrentPageObj().find("#config_man_id_appupdate"),name:getCurrentPageObj().find("#config_man_name_appupdate")},"0021,0008");
});
//配置管理POP
$('#sys_man_name_appupdate').click(function(){
	openAppUserPop("appunitdata_man_pop",{no:getCurrentPageObj().find("#sys_man_id_appupdate"),name:getCurrentPageObj().find("#sys_man_name_appupdate")},"0020");
});

/*//元数据管理员pop
$('#unit_data_name_appupdate').click(function(){
	openAppUserPop("appunitdata_man_pop",{no:getCurrentPageObj().find("#unit_data_id_appupdate"),name:getCurrentPageObj().find("#unit_data_name_appupdate")},"0022");
});*/
//测试经理pop
getCurrentPageObj().find('#test_man_name_appupdate').click(function(){
	openAppUserPop("apptest_man_pop",{no:getCurrentPageObj().find("#test_man_id_appupdate"),name:getCurrentPageObj().find("#test_man_name_appupdate")},"0018");
});
}
//加载字典项
function initUpdateSelectForDic(){
		initSelect(getCurrentPageObj().find("#is_important_appupdate"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_YN"});	
		initSelect(getCurrentPageObj().find("#is_agile_appupdate"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_YN"});
		initSelect(getCurrentPageObj().find("#is_two_week_appupdate"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_YN"});
		initSelect(getCurrentPageObj().find("#test_group_applicationupdate"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_ORG_TESTGROUP"});
		initSelect(getCurrentPageObj().find("#yield_type_applicationupdate"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_YIELD_TYPE"});
		initSelect(getCurrentPageObj().find("#business_line_applicationupdate"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_ORG_BUSINESSLINE"});
		initSelect(getCurrentPageObj().find("#is_new_system_applicationupdate"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_YN"});
		initSelect(getCurrentPageObj().find("#is_CC"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_YN"});
		initSelect(getCurrentPageObj().find("#is_secientific_management"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_SECIENTIFIC_MANAGEMENT"});
		initSelect(getCurrentPageObj().find("#is_review_appupdate"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"TM_DIC_IS_APPROVE"});
		//initSelect(getCurrentPageObj().find("#system_status_appupdate"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_SYSTEM_STATUS"});
		//initSelect(getCurrentPageObj().find("#test_deploy_type_appupdate"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_TESTDEPLOY_TYPE"});
}

function refreshfunctionInfoOne(system_id){
	$("#SfunctionTableInfoOne").bootstrapTable("refresh",{url:dev_application+"applicationManager/queryPersons.asp?SID="+SID+"&system_id="+system_id});
}

function initfunctionInfoOne(war){
	var system_id = war;
	eventInit.init(system_id);
	//删除
	$("#update_delete").click(function(){
		var id=$("#SfunctionTableInfoOne").bootstrapTable('getSelections');
		var ids=$.map(id,function(row){
			return row.ROLE_NO;
		});
		ids="role_no="+ids.join("&role_no=");
		
		var idn=$.map(id,function(row){
			return row.USER_NO;
		});
		idn="user_no="+idn.join("&user_no=");
		if(id.length==0){
			alert("请选择至少一条数据进行删除!");
			return;
		}
		var url=dev_application+"applicationManager/detelePersons.asp?"+ids+"&"+idn;
			baseAjax(url,{SID:SID,system_id:system_id},function(msg){
				alert("删除成功");	
					//getCurrentPageObj().find("#SfunctionTableInfoOne").bootstrapTable('refresh');
					refreshfunctionInfoOne(system_id);
			});
		
	});
	getCurrentPageObj().find("#SfunctionTableInfoOne").bootstrapTable(
			{
				url : dev_application+"applicationManager/queryPersons.asp?SID="+SID+"&system_id="+system_id,
				method : 'get', //请求方式（*）   
				striped : false, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				pagination : true, //是否显示分页（*）
				pageList : [5,10],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 10,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "ROLE_NO", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: false,//单选多选,
				onLoadSuccess:function(data){
				},
				columns : [ {
					field: 'middle',
					checkbox: true,
					rowspan: 2,
					align: 'center',
					valign: 'middle'
				},{
					field : 'USER_NO',
					title : '用户编号',
					align : "center"
				},{
					field : 'USER_NAME',
					title : '用户姓名',
					align : "center"
				},{
					field : 'ROLE_NO',
					title : '角色编号',
					align : "center"
				},{
					field : 'ROLE_NAME',
					title : '角色名称',
					align : "center"
				},{
					field : "OPT_NAME",
					title : "操作人",
					align : "center"
				},{
					field : "OPT_TIME",
					title : "操作时间",
					align : "center"
				}]
			});
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
};

//初始化pop列表
function initeMenulTable(){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
   $("#functionPopList").bootstrapTable(
			{
				url : dev_application+"applicationManager/queryPeople.asp?SID="+SID,
				method : 'get', //请求方式（*）   
				striped : false, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				pagination : true, //是否显示分页（*）
				pageList : [5,10],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 5,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "URN", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: false,//单选多选
				recallSelect:true,
				onLoadSuccess:function(data){
				},
				columns : [{
					 checkbox: true
				},{
					field : 'ROLE_NO',
					title : '角色编号',
					align : 'center'
				},{
					field : 'ROLE_NAME',
					title : '角色名称',
					align : 'center'
				},{
					field : 'USER_NO',
					title : '用户编号',
					align : 'center'	
				},{
					field : 'USER_NAME',
					title : '用户姓名',
					align : "center"
				},{
					field : 'LOGIN_NAME',
					title : '登录名称',
					align : "center"
				},{
					field : 'ORG_NAME',
					title : '机构名称',
					align : "center"	
				} ]
			});
}

(function(eventInit){
	eventInit.init=function(system_id){
		//重置按钮
		$("#pop_menuReset").click(function(){
			getCurrentPageObj().find("#pop_menuuser").val("");
			getCurrentPageObj().find("#pop_menurole").val("");
			getCurrentPageObj().find("#pop_name").val("");
			getCurrentPageObj().find("#pop_person").val("");
		});
		//查询按钮
		$("#pop_menuSearch").click(function(){
		    var org_name=$("#pop_menuuser").val();
			var login_name=$("#pop_menurole").val();
			var user_name=$("#pop_name").val();
			var role_name=$("#pop_person").val();
			$('#functionPopList').bootstrapTable('refresh',
					{url:dev_application+"applicationManager/queryPeople.asp?SID="+SID+"&org_name="+escape(encodeURIComponent(org_name))+"&login_name="+escape(encodeURIComponent(login_name))+"&user_name="+escape(encodeURIComponent(user_name))+"&role_name="+escape(encodeURIComponent(role_name))});		
	   });
		enterEventRegister("popModelQueryLevel1", function(){getCurrentPageObj().find("#pop_menuSearch").click();});
		getCurrentPageObj().find("#addPOP").click(function(){
			var id=$("#functionPopList").bootstrapTable('getRecallSelections');
			if(id.length==0){
				alert("请选择至少一条数据!");
				return;
			}
			var ids=$.map(id,function(row){
				return row.ROLE_NO;
			});
			ids="role_no="+ids.join("&role_no=");
			
			var idn=$.map(id,function(row){
				return row.USER_NO;
			});
			idn="user_no="+idn.join("&user_no=");
			
			var ido=$.map(id,function(row){
				return row.ORG_NAME;
			});
			ido="org_name="+ido.join("&org_name=");
			
			var idt=$.map(id,function(row){
				return row.LOGIN_NAME;
			});
			idt="login_name="+idt.join("&login_name=");
			
			var idr=$.map(id,function(row){
				return row.OPT_NAME;
			});
			idr="opt_name="+idr.join("&opt_name=");
			var idx=$.map(id,function(row){
				return row.OPT_TIME;
			});
			idx="opt_time="+idx.join("&opt_time=");
			/*var myDate = new Date();
			var time = myDate.toLocaleString();*/
			var logi_name=$("#currentLoginName").val();
			var url=dev_application+"applicationManager/queryPersonsAdd.asp?"+ids+"&"+idn+"&"+ido+"&"+idt+"&"+idr+"&"+idx;
			baseAjax(url,{SID:SID,system_id:system_id,logi_name:logi_name},function(msg){
					$('#matrixInfoModalPOP').modal('hide');
					getCurrentPageObj().find("#SfunctionTableInfo").bootstrapTable('refresh');
					refreshfunctionInfoOne(system_id);
			});
		});
	};
})(eventInit={});

	
	

