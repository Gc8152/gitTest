var url = '';
var currentPage = getCurrentPageObj();

/**
 * 初始化角色数据
 * @param orgcode
 * @param actorno
 * @param actorname
 */
function initRoleSelect(orgcode,actorno,actorname){
	currentPage.find("#selected").empty();
	currentPage.find("#unselected").empty();
	baseAjax("SRole/findUserNoRole.asp",{actorno:actorno,org_code:orgcode},function(data){
		if(data!=undefined){
			for(var i=0;i<data.length;i++){
				currentPage.find("#unselected").append('<option value="'+data[i].role_no+'">'+data[i].role_name+'</option>');
			}
		}
	},false);
	
	baseAjax("SRole/findUserRole.asp",{actorno:actorno,org_code:orgcode},function(data){
		if(data!=undefined){
			for(var i=0;i<data.length;i++){
				currentPage.find("#selected").append('<option value="'+data[i].role_no+'">'+data[i].role_name+'</option>');
			}
		}
	},false);
	
	currentPage.find("#addUserRole").unbind("click");
	currentPage.find("#addUserRole").click(function(){
		var options=currentPage.find("#selected option");
		var param={org_code:orgcode,user_no:actorno,role_nos:""};
		if(options!=undefined){
			var role_no=currentPage.find(options[0]).val();
			for(var i=1;i<options.length;i++){
				role_no=role_no+","+currentPage.find(options[i]).val();
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
	currentPage.find("#setUserRule").click(function(){
		var id = currentPage.find("#SUserTableInfo").bootstrapTable('getSelections');
		if(id&&id.length==1){
			initOrgUserTree(function(org_code){
				initRoleSelect(org_code,id[0].user_no,id[0].user_name);
			});
			
			currentPage.find("#setRoleUser").text(id[0].user_name);
			currentPage.find("#setRoleUser_no").text(id[0].user_no);
			currentPage.find("#setUserRuleModal").modal("show");
		}else{
			alert("请选择一条数据进行角色设置!");
		}
	});
	currentPage.find("#queryUserlist").click(
			function() {
				var user_no = currentPage.find("#user_no").val();
				var user_name = currentPage.find("#user_name").val();
				var login_name = currentPage.find("#login_name").val();
				var state = $.trim(currentPage.find("#user_state").val());
				var is_banker = $.trim(currentPage.find("#is_banker").val());
				var org_name = currentPage.find("#org_name").val();
				var org_code=$.trim(currentPage.find("#org_code").val());
			      var rid=getCurrentPageObj().find('#org_name').attr("placeHolder");
			      if(org_name==rid){
			    	  org_name="";
			      }
				currentPage.find('#SUserTableInfo').bootstrapTable('refresh',{url:'SUser/queryalluser.asp?user_no='+user_no+'&user_name='
					+escape(encodeURIComponent(user_name))+'&org_name='+escape(encodeURIComponent(org_name))
					+'&login_name='+login_name+'&state='+state+'&is_banker='+is_banker+'&org_code='+org_code});
			});
	//enter触发查询
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#queryUserlist").click();});
	//onclick="openInnerPageTab('add_user','创建用户','pages/suser/suser_add.html')"
	currentPage.find("#addUser").click(function(){
		pageDispatchUser(this,"addUser","");
	});
	currentPage.find("#reset").click(function() {
		currentPage.find("input[name^='S.']").val("");
		currentPage.find("select[name^='S.']").val("");
		currentPage.find("#user_state").val(" ");
		currentPage.find("#user_state").select2();
		currentPage.find("#is_banker").val(" ");
		currentPage.find("#is_banker").select2();
	});
	currentPage.find("#org_name").click(function(){
		openSelectTreeDivToBody($(this),"userListtree_id","SOrg/queryorgtreelist.asp",30,function(node){
			currentPage.find("#org_name").val(node.name);
			currentPage.find("#org_code").val(node.id);
		});
	});
	/*currentPage.find("#org_name").focus(function(){
		currentPage.find("#org_name").click();
	});	*/
/*	$("#org_name").click(function(){
		openSOrgPop("sorgDivPermiss",{name:$("#org_name"),no:$("#org_code")});
	});*/
	
	currentPage.find("#delteUser").click(function(){
		var id = currentPage.find("#SUserTableInfo").bootstrapTable('getSelections');
		var ids = $.map(id, function (row) {
			return row.user_no;                  
		});
		if(id.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		nconfirm("确定要删除该数据吗？",function(){
			currentPage.find("#SUserTableInfo").bootstrapTable('remove', {
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
	currentPage.find("#updateUser").click(function(){
		var id = currentPage.find("#SUserTableInfo").bootstrapTable('getSelections');
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
	currentPage.find("#permissionUser").click(function(){
		
		var id = currentPage.find("#SUserTableInfo").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		var ids = $.map(id, function (row) {
			return row.user_no;                    
		});
		nconfirm("确定要生成权限吗？",function(){
			baseAjax("SPerm/addUserPerm.asp",{crtype:"byuser",crobj:ids[0]},function(data){
				if(data==undefined||data.result=="false"){
					alert("权限生成失败!");
				}else{
					alert("权限生成成功!");
				}
			});
		});
	});
	
	currentPage.find("#resetUserPass").click(function(){
		var id = currentPage.find("#SUserTableInfo").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		var ids = $.map(id, function (row) {
			return row.user_no;                    
		});
		var login_name = $.map(id, function (row) {
			return row.login_name;                    
		});
		login_name = '123456';
		nconfirm("确定重置该密码？",function updatepassword(){
			baseAjax("SUser/resetPassWord.asp",{user_no:ids[0],password:login_name},function(data){
				if(data==undefined||data.result=="false"){
					alert("密码重置失败!");
				}else{
					alert("密码重置成功!");
				}
			});
		});
		
	});
	
	/*currentPage.find("#resetAllUserPass").click(function(){
		baseAjax("SUser/resetAllUserPass.asp",{},function(data){
			if(data==undefined||data.result=="false"){
				alert("用户密码初始化失败!");
			}else{
				alert("用户密码初始化成功!");
			}
		});
	});*/
	
	
	/*$("#userReport").click(function(){
		openInnerPageTab("userReport","用户报表","report/userReport.asp",function(){
			
		});
	});*/
	//用户角色查询
	$("#queryUserRole").click(function(){
		var id = getCurrentPageObj().find("#SUserTableInfo").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一个用户进行查看!");
			return ;
		}
		var ids = $.map(id, function (row) {
			return row.user_no;                    
		});
		background_openUserRolePop("background_userRolePop",{user_no:ids});
	});
	
}

//查询列表显示table
function initSUserInfo() {
	var user_no = currentPage.find("#user_no").val();
	var user_name = currentPage.find("#user_name").val();
	var login_name = currentPage.find("#login_name").val();
	var org_name = currentPage.find("#org_name").val();
	var state = $.trim(currentPage.find("#user_state").val());
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	currentPage.find("#SUserTableInfo").bootstrapTable(
			{
				//请求后台的URL（*）
				url : 'SUser/queryalluser.asp?user_no=' + user_no+'&user_name='+user_name+'&login_name='+login_name+'&state='+state+'&org_name='+org_name,
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
					checkbox: true,
					rowspan: 2,
					align: 'center',
					valign: 'middle'
				},{
					field : 'user_no',
					title : '用户编号',
					align : "center"
				}, {
					field : "user_name",
					title : "用户名称",
					align : "center"
				}, {
					field : "login_name",
					title : "登陆名",
					align : "center"
				}, {
					field : "state",
					title : "用户状态",
					align : "center"
				}, {
					field : "banker",
					title : "是否行员",
					align : "center"
				}, {
					field : "org_no_name",
					title : "所属部门",
					align : "center"
				}, {
					field : "user_mail",
					title : "用户邮箱",
					align : "center"
				} ]
			});
};
	
//下拉框方法
function initSUserType(){
	//初始化数据
	initSelect(currentPage.find("#user_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_USERSTATE"},"bb");
	//初始化数据,是否行员
	initSelect(currentPage.find("#is_banker"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_YN"}," ");
}
//跳转方法
function pageDispatchUser(obj,key,params){
	var p = params;
	if("addUser"==key){
		closePageTab("add_user");
		closeAndOpenInnerPageTab("add_user","创建用户","pages/suser/suser_add.html");
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
				initIsBanker(data.is_banker);
				initSUserType(data.state,data.user_post,data.user_level,data.is_banker);
				getCurrentPageObj().find("#op_nameAD").val(data["op_name"]);
				getCurrentPageObj().find("[name='AD.op_code']").val(data["op_code"]);
			});
		});
	}
}

function initOrgUserTree(clickCallbacks) {
	currentPage.find("#selected").empty();
	currentPage.find("#unselected").empty();
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
					filterRole();
					clickCallbacks(treeNode.id);
				}
			}
	};
	$.fn.zTree.init(currentPage.find("#treeOrgRole"), setting);
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

/**
 * 筛选角色
 * @param $page
 */
var filterRole=function(){
	var $page=getCurrentPageObj();
	var role_name=$page.find("#role_name");
	var options={};
	role_name.unbind("keyup").keyup(function(e){
		var all_options=$page.find("#unselected option");
		var filterText=$.trim($(this).val());
		var unselected=$page.find("#unselected");
		$.each(options,function(k,v){
			if(v&&k&&v.indexOf(filterText)>=0){
				options[k]="";
				unselected.append('<option value="'+k+'">'+v+'</option>');
			}
		});
		
		for(var j=0;j<all_options.length;j++){
			var option=$(all_options[j]);
			var val=$.trim(option.val());
			var text=$.trim(option.text());
			if(text.indexOf(filterText)<0){
				options[val]=text;
				option.remove();
			}
		}
	});
};















