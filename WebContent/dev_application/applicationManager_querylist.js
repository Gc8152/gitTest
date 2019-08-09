initApplicationListLayout();
initAppTable();
initAppQueryOrg();
initAppDicCode();

//加载字典项
function initAppDicCode(){
	initSelect(getCurrentPageObj().find("#is_important_applicationquerylist"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_PUTIN_RESULT"});
	initSelect(getCurrentPageObj().find("#system_status_applicationquerylist"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_SYSTEM_STATUS"});
}

//加载部门处室
function initAppQueryOrg(){
	//处室
	getCurrentPageObj().find("#organ_id_queryOrg").click(function(){
		openSelectTreeDiv($(this),"appQuery_tree_id","SOrg/queryorgtreelist.asp",{"margin-top": "2px",width:"180px"},function(node){
			getCurrentPageObj().find("#organ_id_applicationquerylist").val(node.id);
			getCurrentPageObj().find("#organ_id_queryOrg").val(node.name);
		});
	});
	getCurrentPageObj().find("#organ_id_queryOrg").focus(function(){
		getCurrentPageObj().find("#organ_id_queryOrg").click();
	});
	
	//项目组
	getCurrentPageObj().find("#project_id_queryOrg").click(function(){
		openSelectTreeDiv($(this),"appQuery_tree_id1","SOrg/queryorgtreelist.asp",{"margin-top": "2px",width:"180px"},function(node){
			getCurrentPageObj().find("#project_id_applicationquerylist").val(node.id);
			getCurrentPageObj().find("#project_id_queryOrg").val(node.name);
		});
	});
	$("#project_id_queryOrg").focus(function(){
		getCurrentPageObj().find("#project_id_queryOrg").click();
	});
}

var systemcall="system"+getMillisecond();

function initApplicationListLayout() {
	// 查询
	$("#serach_application").click(function() {
		var organ_id = $.trim(getCurrentPageObj().find("#organ_id_applicationquerylist").val());
		var project_id = $.trim(getCurrentPageObj().find("#project_id_applicationquerylist").val());
		var system_name = $.trim(getCurrentPageObj().find("#system_name_applicationquerylist").val());
		var system_id = $.trim(getCurrentPageObj().find("#system_id_applicationquerylist").val());
		var system_short = $.trim(getCurrentPageObj().find("#system_short_applicationquerylist").val());
		var is_important = $.trim(getCurrentPageObj().find("#is_important_applicationquerylist").val());
		var system_status = $.trim(getCurrentPageObj().find("#system_status_applicationquerylist").val());
		if(system_status == '请选择'){
			system_status = '';
		}
		var project_man_name = $.trim(getCurrentPageObj().find("#project_name_applicationquerylist").val());
		getCurrentPageObj().find('#gSystemInfoTable').bootstrapTable('refresh',{
			url:dev_application+"applicationManager/queryApplication.asp?SID="+SID+'&system_name='+escape(encodeURIComponent(system_name))
			+'&organ_id='+organ_id+'&system_short='+escape(encodeURIComponent(system_short))+'&project_id='+project_id+'&is_important='+is_important
			+'&system_status='+system_status+'&project_man_name='+escape(encodeURIComponent(project_man_name))+"&system_id="+system_id+"&permission=1"
		});
	});

	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#serach_application").click();});
	
	
	//功能点维护
	getCurrentPageObj().find("#funcPointEdit").click(function() {
		var seles = getCurrentPageObj().find("#gSystemInfoTable").bootstrapTable('getSelections');
		if(seles.length!=1){
				alert("请选择一个应用!");
				return;
		}
		 closeAndOpenInnerPageTab("funcPointEdit","功能点编辑","dev_application/appFuncPoint_edit.html", function(){
			 initFunc(seles[0]);
			});
	});
	
	
	//重置
	getCurrentPageObj().find('#reset_application').click(function() {
		
		getCurrentPageObj().find("#querySystem input").val("");
		var selects = getCurrentPageObj().find("#querySystem select");
		selects.val(" ");
		selects.select2();
	});
	
	// 新增
	getCurrentPageObj().find("#add").click(function() {
		openInnerPageTab("addApplication","应用新增","dev_application/application_add.html");
	});
	
	//停用logicDelete
	getCurrentPageObj().find("#logicDelete").click(function() {
		var id = getCurrentPageObj().find("#gSystemInfoTable").bootstrapTable('getSelections');
		var ids=$.map(id, function (row) {return row.SYSTEM_ID;});
		/****插入提醒参数****/
		var params = {};
		params["remind_type"] = "PUB2017194";
		params["b_code"] = ids[0];
		params["b_id"] = ids[0];
		params["b_name"] = "停用应用："+id[0].SYSTEM_NAME+"（英文简称："+id[0].SYSTEM_SHORT+"）";
	if(id.length==1){
		nconfirm("确定要停用该数据吗?",function(){
			
			baseAjaxJsonp(dev_application+"applicationManager/logicDeleteApplication.asp?system_id="+ids+"&SID="+SID+"&call="+systemcall, params, function(data) {
				if (data != undefined && data != null && data.result=="true") {
		    		getCurrentPageObj().find('#gSystemInfoTable').bootstrapTable('refresh',{url:dev_application+'applicationManager/queryApplication.asp?SID='+SID+"&permission=1"});
		    		alert("停用成功");
				}else{
					var mess=data.mess;
					alert("停用失败:"+mess);
				}
			},systemcall);	
		});		
	}else{
		alert("请选择一条数据！");
		return;
	}
	
	});
	
	//查看应用详情
	getCurrentPageObj().find("#view_sysDetail").click(function() {
		var id = getCurrentPageObj().find("#gSystemInfoTable").bootstrapTable('getSelections');
		var ids=$.map(id, function (row) {return row.SYSTEM_ID;});
		var idn=id[0].SYSTEM_ID;
		if(id.length==1){
		  closePageTab("viewApplication");
		  var appDetailCall=getMillisecond();
		  openInnerPageTab("viewApplication","查看详情","dev_application/application_queryInfo.html",function(){
			  initfunctionInfoTwo(idn);
			  baseAjaxJsonp(dev_application+"applicationManager/findApplicationById.asp?SID="+SID+"&system_id="+ids+"&call="+appDetailCall, null , function(data) {
				  for ( var k in data) {
						 var str=data[k];
						  k = k.toLowerCase();
					if(k=="develop_tool"){
						initAPPSelect3(getCurrentPageObj().find("#APDdevelop_tool"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_DEVELOP_TOOL"},str);
					}else if(k=="develop_language"){
						initAPPSelect3(getCurrentPageObj().find("#APDdevelop_language"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_DEVELOP_LANGUAGE"},str);
					}else if(k=="mac_os"){	
						initAPPSelect3(getCurrentPageObj().find("#APDmac_os"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_MAC_OS"},str);
					}else if(k=="hardware_type"){
						initAPPSelect3(getCurrentPageObj().find("#APDhardware_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_HARDWARE_TYPE"},str);
					}else if(k=="among"){	
						initAPPSelect3(getCurrentPageObj().find("#APDamong"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_DEVELOP_AMONG"},str);
					}else if(k=="database"){	
						initAPPSelect3(getCurrentPageObj().find("#APDdatabase"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_DEVELOP_DATABASE"},str);
					}else if(k=="addr_type"){
						initCheckVis(getCurrentPageObj().find("#addrType"),{dic_code:"G_DIC_SYSTEM_CONFIG_TYPE"},"addrTypeName","addrType",str,"N");
					}else if(k=="system_id"){
						getCurrentPageObj().find("input[name='"+ k +"']").val(str);
						getCheckedAddr(str);
					}else if(k=="vob_info"){
						getCurrentPageObj().find("span[name='C."+ k +"']").html(str);
					}else if(k=="cc_server_url"){
						getCurrentPageObj().find("span[name='C."+ k +"']").html(str);
					}else if(k=="is_secientific_management"){
						if(str=="00"){
							str = "是";
						}else if(str=="01"){
							str = "否";
						}
						getCurrentPageObj().find("span[name='"+ k +"']").html(str);
					}else if(k=="is_review_display"){
						if(str=="00"){
							str = "否";
						}else if(str=="01"){
							str = "是";
						}
						getCurrentPageObj().find("span[name='"+ k +"']").html(str);
					}/*else if(k=="system_profile"){
						getCurrentPageObj().find("textarea[name='UPP."+k+"']").val(str);
					}*/
					else {
						$("span[name="+k+" ]").text(str);
				   }
				  }
			
			  },appDetailCall);
		   });
		}else{
			alert("请选择一个应用进行查看");
		}
	});
	
	
	
	
	getCurrentPageObj().find("#optHistory").click(function(e){
		var id = getCurrentPageObj().find("#gSystemInfoTable").bootstrapTable('getSelections');
		var ids=$.map(id, function (row) {return row.SYSTEM_ID;});
		if(ids.length==1){
			openOptHistoryPop(ids[0],"openPop");
		}else{
			e.preventDefault();
	        alert("请选择一条数据进行查看！");
		}
	});
	
	getCurrentPageObj().find("#allHistory").click(function(e){
			openOptHistoryPop(null,"allHisPop");
	});
	//编辑
	getCurrentPageObj().find("#update").click(function(e){
		var id = getCurrentPageObj().find("#gSystemInfoTable").bootstrapTable('getSelections');
		var ids=$.map(id, function (row) {return row.SYSTEM_ID;});
		var idn=id[0].SYSTEM_ID;
		if(id.length==1){
			closePageTab("updateApplication");
			var appUpdateCall=getMillisecond();
			openInnerPageTab("updateApplication","应用编辑","dev_application/application_update.html",function(){
				initfunctionInfoOne(idn);
				baseAjaxJsonp(dev_application+"applicationManager/findApplicationById.asp?SID="+SID+"&system_id="+ids+"&call="+appUpdateCall, null , function(data) {
					for ( var k in data) {
							var str=data[k];
							k = k.toLowerCase();
					    if(k=="is_important"){
							initSelect(getCurrentPageObj().find("#is_important_appupdate"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_YN"},str);
						}/*else if(k=="system_status"){
							initSelect(getCurrentPageObj().find("#system_status_appupdate"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_SYSTEM_STATUS"},str);
						}*/else if(k=="test_deploy_type"){
							initSelect(getCurrentPageObj().find("#test_deploy_type_appupdate"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_TESTDEPLOY_TYPE"},str);	
						}else if(k=="is_agile"){
							initSelect(getCurrentPageObj().find("#is_agile_appupdate"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_YN"},str);
						}else if(k=="is_two_week"){
							initSelect(getCurrentPageObj().find("#is_two_week_appupdate"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_YN"},str);
						}else if(k=="test_group"){
							initSelect(getCurrentPageObj().find("#test_group_applicationupdate"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_ORG_TESTGROUP"},str);
						}else if(k=="yield_type"){
							initSelect(getCurrentPageObj().find("#yield_type_applicationupdate"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_YIELD_TYPE"},str);
						}else if(k=="business_line"){
							initSelect(getCurrentPageObj().find("#business_line_applicationupdate"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_ORG_BUSINESSLINE"},str);
						}else if(k=="is_cc"){
							initSelect(getCurrentPageObj().find("#is_CC"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_YN"},str);
						}else if(k=="is_secientific_management"){
							initSelect(getCurrentPageObj().find("#is_secientific_management"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_SECIENTIFIC_MANAGEMENT"},str);
						}else if(k=="system_status"){
							initSelect(getCurrentPageObj().find("#system_status"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_SYSTEM_STATUS"},str);
						}else if(k=="is_new_system"){
							initSelect(getCurrentPageObj().find("#is_new_system_applicationupdate"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_YN"},str);
						}else if(k=="is_review"){
//							initSelect(getCurrentPageObj().find("#is_review_appupdate"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"TM_DIC_IS_APPROVE"},str);
							getCurrentPageObj().find("#is_review_appupdate").val(str);
							getCurrentPageObj().find("#is_review_appupdate").select2();
						}
						else if(k=="system_profile"){
							getCurrentPageObj().find("textarea[name='UPP."+k+"']").val(str);
						}else {
							//getCurrentPageObj().find("input[name='UPP."+k+"']"+"[value="+str+"]").attr("checked",true);
							//alert(str);
						/*if(k=="project_man_id"||k=="skill_man_id"||k=="product_man_id"||k=="config_man_id"||k=="test_man_id"||k=="project_man_name"||k=="skill_man_name"||k=="product_man_name"||k=="config_man_name"||k=="test_man_name"){
						*/		
							//$("input[name='UPP." + k + "']").val(str);
							getCurrentPageObj().find("input[name='UPP."+k+"']").val(str);
						}	
					}
				},appUpdateCall);
				});
		}else{
			e.preventDefault();
	        alert("请选择一条数据进行查看！");
		}
			
	});
	
	//文档库创建按钮
	getCurrentPageObj().find("#doc_state").click(function() {
		var id = getCurrentPageObj().find("#gSystemInfoTable").bootstrapTable('getSelections');
		var ids=$.map(id, function (row) {return row.SYSTEM_SHORT;});
		var idl=$.map(id, function (row) {return row.DOC_STATE;});
		var idu=$.map(id, function (row) {return row.IS_SECIENTIFIC_MANAGEMENT;});
		var appStateCall=getMillisecond();
		if(id.length==1){
			var idn=id[0].SYSTEM_SHORT;
			var idj=id[0].DOC_STATE;
			var idv=id[0].IS_SECIENTIFIC_MANAGEMENT;
			if(idj=='00' || idj=='02'){
				alert("请选择创建失败或未创建的应用进行创建！");
			}else{
				 if(idv=='01'){
					 alert("请选择科技管理的应用进行创建！");
				 }else{
					 baseAjaxJsonpNoCall(dev_application+"applicationManager/addState.asp?system_short="+idn, {} , function(data) {
						 if (data&&data.result=="true") {
					    		alert("文档库创建成功");
						 }else{
								alert("文档库创建失败");
					     }
						 getCurrentPageObj().find("#gSystemInfoTable").bootstrapTable('refresh');
					 });
				 }
			}
		}else{
			alert("请选择一条数据进行创建！");
		}
	});
}

function initAppTable() {
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		getCurrentPageObj().find('#gSystemInfoTable').bootstrapTable({
					url :dev_application+"applicationManager/queryApplication.asp?SID="+SID+"&permission=1",
					method : 'get', // 请求方式（*）
					striped : false, // 是否显示行间隔色
					cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
					sortable : true, // 是否启用排序
					sortOrder : "asc", // 排序方式
					queryParams : queryParams,// 传递参数（*）
					sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
					pagination : true, // 是否显示分页（*）
					pageList : [ 5, 10, 15 ], // 可供选择的每页的行数（*）
					pageNumber : 1, // 初始化加载第一页，默认第一页
					pageSize : 10, // 每页的记录行数（*）
					clickToSelect : true, // 是否启用点击选中行
					// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
					uniqueId : "SYSTEM_ID", // 每一行的唯一标识，一般为主键列
					cardView : false, // 是否显示详细视图
					detailView : false, // 是否显示父子表
					singleSelect : true,// 复选框单选
					onLoadSuccess : function(data){
						gaveInfo();
					},
					columns : [ {
						checkbox : true,
						rowspan : 2,
						align : 'center',
						valign : 'middle'
					},  {
						field : 'SYSTEM_ID',
						title : '应用编号',
						align : "center",
						/*}, {
						field : 'ORGAN_NAME',
						title : '处室',
						align : "center"
						*/
					}, {
						
						field : "SYSTEM_NAME",
						title : "应用名称",
						align : "center"
					}, {
						field : "SYSTEM_SHORT",
						title : "应用简称",
						align : "center"
					}, {
						field : "BUSINESS_DEPT_NAME",
						title : "业务管理部门",
						align : "center"
					}, {
						field : "DEV_GROUP_NAME",
						title : "开发组",
						align : "center"
					}, {
						field : "RES_GROUP_NAME",
						title : "负责组",
						align : "center"
					}, {
						field : "PROJECT_MAN_NAME",
						title : "应用负责人",
						align : "center"
					}, {
						field : "SKILL_MAN_NAME",
						title : "技术经理",
						align : "center"
					}, {
						field : "PRODUCT_MAN_NAME",
						title : "产品经理",
						align : "center"
					}, {
						/*field : "TEST_GROUP",
						title : "测试组",
						align : "center"
					}, {
						field : "YIELD_TYPE",
						title : "投产类型",
						align : "center"
					}, {
						field : "BUSINESS_LINE",
						title : "业务条线",
						align : "center"
					}, {*/
						field : "IS_NEW_SYSTEM",
						title : "是否新建应用",
						align : "center",
						visible : false,
						formatter:function(value,row,index){if(value=="00"){return "否";}return "是";}
					}/*, {
						field : "IS_TWO_WEEK",
						title : "是否双周版",
						align : "center",
						formatter:function(value,row,index){if(value=="00"){return "是";}return "否";}
					}, {
						field : "IS_AGILE",
						title : "是否敏捷",
						align : "center",
						formatter:function(value,row,index){if(value=="00"){return "是";}return "否";}	
					}, {
						field : "IS_CC",
						title : "是否纳入cc",
						align : "center",
						formatter:function(value,row,index){if(value=="00"){return "是";}return "否";}
					}*/, {
						field : "IS_SECIENTIFIC_MANAGEMENT",
						title : "是否科技管理",
						align : "center",
						formatter:function(value,row,index){if(value=="00"){return "是";}return "否";}
					},{
						field : "SYSTEM_STATUS",
						title : "应用状态",
						align : "center",
						formatter:function(value,row,index){if(value=="01"){return "未上线";}else if(value=="02"){return "运行中";}else if(value=="03"){return "待下线";}else{return "已废弃";}}
					},{
						field : "DOC_STATE",
						title : "文档库状态",
						align : "center",
						formatter:function(value,row,index){if(value=="00"){return "创建中";}else if(value=="02"){return "已创建";}else if(value=="03"){return "创建失败";}else{return "未创建";}}
					}]
				});
	}

