var url = '';
//通用ajax方法
function baseAjax(url, param, callback, async) {
	$.ajax({
		type : "post",
		url : url,
		async : async == undefined ? true : false,
				data : param,
				dataType : "json",
				success : function(msg) {
					callback(msg);
				},
				error : function() {
					callback();
				}
	});
}

/**
 * 初始化角色数据
 * @param orgcode
 * @param actorno
 * @param actorname
 */
function initRoleSelect(orgcode,actorno,actorname){
	$("#selected").empty();
	$("#unselected").empty();
	baseAjax("SRole/findUserNoRole.asp",{actorno:actorno,org_code:orgcode},function(data){
		if(data!=undefined){
			for(var i=0;i<data.length;i++){
				$("#unselected").append('<option value="'+data[i].role_no+'">'+data[i].role_name+'</option>');
			}
		}
	},false);
	
	baseAjax("SRole/findUserRole.asp",{actorno:actorno,org_code:orgcode},function(data){
		if(data!=undefined){
			for(var i=0;i<data.length;i++){
				$("#selected").append('<option value="'+data[i].role_no+'">'+data[i].role_name+'</option>');
			}
		}
	},false);
	
	$("#addUserRole").unbind("click");
	$("#addUserRole").click(function(){
		var options=$("#selected option");
		var param={org_code:orgcode,user_no:actorno,role_nos:""};
		if(options!=undefined){
			var role_no=$(options[0]).val();
			for(var i=1;i<options.length;i++){
				role_no=role_no+","+$(options[i]).val();
			}
			param["role_nos"]=role_no;
		}
		baseAjax("SRole/addUserRole.asp",param,function(data){
			if(data!=undefined&&data.result=="true"){
				alert("保存成功");
			}else{
				alert("保存失败");
			}
		},false);
	});
}

function move(type){
	if("rmselected"==type){//移除
		var val=getCurrentPageObj().find("#selected").val();
		if(val&&val!=""){
			if(val instanceof Array){
				for(var i=0;i<val.length;i++){
					var html=getCurrentPageObj().find("#selected option[value='"+val[i]+"']");
					getCurrentPageObj().find("#unselected").append('<option value="'+val[i]+'">'+html.text()+'</option>');
					html.remove();
				}
			}else{
				var html=getCurrentPageObj().find("#selected option[value='"+val+"']");
				getCurrentPageObj().find("#unselected").append('<option value="'+val+'">'+html.text()+'</option>');
				html.remove();
			}
		}
	}else if("addselected"==type){//新增
		var val=getCurrentPageObj().find("#unselected").val();
		if(val&&val!=""){
			if(val instanceof Array){
				for(var i=0;i<val.length;i++){
					var html=getCurrentPageObj().find("#unselected option[value='"+val[i]+"']");
					getCurrentPageObj().find("#selected").append('<option value="'+val[i]+'">'+html.text()+'</option>');
					html.remove();
				}
			}else{
				var html=getCurrentPageObj().find("#unselected option[value='"+val+"']");
				getCurrentPageObj().find("#selected").append('<option value="'+val+'">'+html.text()+'</option>');
				html.remove();
			}
		}
	}
}
//按钮方法
function initQueryUserButtonEvent(){
	$("#setUserRule").click(function(){
		var id = $("#SUserTableInfo").bootstrapTable('getSelections');
		if(id&&id.length==1){
			initOrgUserTree(function(org_code){
				initRoleSelect(org_code,id[0].user_no,id[0].user_name);
			});
			
			$("#setRoleUser").text(id[0].user_name);
			$("#setRoleUser_no").text(id[0].user_no);
			$("#setUserRuleModal").modal("show");
		}else{
			alert("请选择一条数据进行角色设置!");
		}
	});
	$("#queryUser").click(
			function() {
				var user_no = $("#user_no").val();
				var user_name = $("#user_name").val();
				var login_name = $("#login_name").val();
				var state = $.trim($("#user_state").val());
				var org_code=$.trim($("#org_code").val());
				$('#SUserTableInfo').bootstrapTable('refresh',{url:'SUser/queryalluser.asp?user_no='+user_no+'&user_name='
					+escape(encodeURIComponent(user_name))+'&login_name='+login_name+'&state='+state+'&org_code='+org_code});
			});
	//onclick="openInnerPageTab('add_user','创建用户','pages/suser/suser_add.html')"
	$("#addApply").click(function(){
		pageDispatchUser(this,"addApply","");
	});
	$("#reset").click(function() {
		$("input[name^='S.']").val("");
		$("select[name^='S.']").val("");
		$("#user_state").val(" ");
		$("#user_state").select2();
	});
	$("#org_name").click(function(){
		openSelectTreeDiv($(this),"userListtree_id","SOrg/queryorgtreelist.asp",{"margin-left":"170px",width:'208px'},function(node){
			$("#org_name").val(node.name);
			$("#org_code").val(node.id);
		});
	});
	$("#org_name").focus(function(){
		$("#org_name").click();
	});	
/*	$("#org_name").click(function(){
		openSOrgPop("sorgDivPermiss",{name:$("#org_name"),no:$("#org_code")});
	});*/
	
	$("#delteUser").click(function(){
		var id = $("#SUserTableInfo").bootstrapTable('getSelections');
		var ids = $.map(id, function (row) {
			return row.user_no;                  
		});
		if(id.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		nconfirm("确定要删除该数据吗？",function(){
			$("#SUserTableInfo").bootstrapTable('remove', {
				field: 'user_no',
				values: ids
			});
			var url="SUser/delteuser.asp?user_no="+ids;
			$.ajax({
				type : "post",
				url : url,
				async :  true,
				data : "",
				dataType : "json",
				success : function(msg) {
					alert("删除成功！");
				},
				error : function() {	
					alert("删除失败！");
				}
			});
		});
	});

	//修改查询功能
	$("#updateUser").click(function(){
		var id = $("#SUserTableInfo").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		var ids = $.map(id, function (row) {
			return row.user_no;                    
		});
		pageDispatchUser(this,"updateUser",ids);
	});
	
	//生成用户权限
	$("#permissionUser").click(function(){
		var id = $("#SUserTableInfo").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		var ids = $.map(id, function (row) {
			return row.user_no;                    
		});
		baseAjax("SPerm/addUserPerm.asp",{crtype:"byuser",crobj:ids[0]},function(data){
			if(data==undefined||data.result=="false"){
				alert("权限生成失败!");
			}else{
				alert("权限生成成功!");
			}
		});
	});
	
	/*$("#userReport").click(function(){
		openInnerPageTab("userReport","用户报表","report/userReport.asp",function(){
			
		});
	});*/
}

//查询列表显示table
function initSUserInfo() {
	var user_no = $("#user_no").val();
	var user_name = $("#user_name").val();
	var login_name = $("#login_name").val();
	var state = $.trim($("#user_state").val());
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$("#SUserTableInfo").bootstrapTable(
			{
				//请求后台的URL（*）
				url : 'SUser/queryalluser.asp?user_no=' + user_no+'&user_name='+user_name+'&login_name='+login_name+'&state='+state,
				method : 'get', //请求方式（*）   
				striped : false, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				pagination : true, //是否显示分页（*）
				pageList : [10,15],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 10,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "user_no", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: true,
				columns : [ {
					field: 'middle',
					title : '选择',
					checkbox: true,
					rowspan: 2,
					align: 'center',
					valign: 'middle'
				},{
					field : 'user_no',
					title : '申请单编号',
					align : "center"
				}, {
					field : "user_name",
					title : "申请单状态",
					align : "center"
				}, {
					field : "login_name",
					title : "消费方应用名称",
					align : "center"
				}, {
					field : "login_name",
					title : "服务方应用名称",
					align : "center"
				}, {
					field : "state",
					title : "申请原因",
					align : "center"
				}, {
					field : "org_no_name",
					title : "申请接口名称",
					align : "center"
				}, {
					field : "user_mail",
					title : "要求完成日期",
					align : "center"
				}
				, {
					field : "user_mail",
					title : "申请人",
					align : "center"
				}
				, {
					field : "user_mail",
					title : "申请日期",
					align : "center"
				}
				, {
					field : "user_mail",
					title : "当前处理人",
					align : "center"
				}
				, {
					field : "user_mail",
					title : "关联需求任务编号",
					align : "center"
				}
			
				]
			});
};
	
//下拉框方法
function initSUserType(){
	//初始化数据
	initSelect($("#user_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_USERSTATE"},"bb");
}
//跳转方法
function pageDispatchUser(obj,key,params){
	var p = params;
	if("addApply"==key){
		closePageTab("add_user");
		closeAndOpenInnerPageTab("add_user","填写申请","pages/apiUse/apiUse_write.html");
		return;
	}else if("updateUser"==key){
		closePageTab("updage_user");
		closeAndOpenInnerPageTab("updage_user","修改用户","pages/suser/suser_update.html",function(){
			baseAjax("SUser/queryoneuser.asp?user_no="+p, null , function(data) {
				for ( var k in data) {
					if(k=='memo'){
						$("textarea[name='Up." + k + "']").val(data[k]);
					}else if(k=='state'||k=='user_post'|| k=='is_banker'){
						$("select[name^='Up.']").val(data[k]);
					}else{
						$("input[name='Up." + k + "']").val(data[k]);
					}
				}
				initUpdateUserInfoEvent();
		
				initSUserType(data.state,data.user_post,data.user_level,data.is_banker);
			});
		});
	}
}

function initOrgUserTree(clickCallback) {
	$("#selected").empty();
	$("#unselected").empty();
	var setting = {
			async : {
				enable : true,
				url : "SOrg/queryorgtreelist.asp",
				contentType : "application/json",
				type : "get",
				autoParam: ["id"]
			},
			view : {
				dblClickExpand : false,
				showLine : true,
				selectedMulti : false
			},
			data : {
				simpleData : {
					enable : true,
					idKey : "id",
					pIdKey : "pid",
					rootPId : ""
				}
			},
			callback : {
				onClick : function(event, treeId, treeNode) {//点击后查询数据方法
					clickCallback(treeNode.id);
				}
			}
	};
	$.fn.zTree.init($("#treeOrgRole"), setting);
}
//同步OA用户
/*function synchronizationUser(){
	$("#synchronizationUser").click(function(){
		startLoading();
		$.ajax({
			type : "post",
			url : "OA/SynchronizationUser.asp",
			dataType : "json",
			success : function(data){
				if(data="true"){
					alert("同步成功！");
					$('#SUserTableInfo').bootstrapTable('refresh',{url:'SUser/queryalluser.asp'});
					endLoading();
				}else{
					alert("同步失败！");
					endLoading();
				}
			},
			error:function(){
				alert("同步失败！");
				endLoading();
			}
		});

	});
}*/
initQueryUserButtonEvent();
initSUserInfo();
initSUserType();
//synchronizationUser();
