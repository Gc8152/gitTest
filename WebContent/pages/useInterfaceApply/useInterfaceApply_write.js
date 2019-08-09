//初始化列表
	function initTableInfo() {
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset //页码
			};
			return temp;
		};
		$("#infatable").bootstrapTable(
				{
					//请求后台的URL（*）
					url : 'SUser/queryalluser.asp',
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
						title : '序号',
						checkbox: true,
						rowspan: 2,
						align: 'center',
						valign: 'middle'
					},{
						field : 'user_no',
						title : '序号',
						align : "center"
					}, {
						field : "user_name",
						title : "申请类型",
						align : "center"
					}, {
						field : "login_name",
						title : "接口名称",
						align : "center"
					}, {
						field : "login_name",
						title : "接口描述",
						align : "center"
					}, {
						field : "state",
						title : "输入信息",
						align : "center"
					}, {
						field : "org_no_name",
						title : "返回信息",
						align : "center"
					}, {
						field : "user_mail",
						title : "查看详情",
						align : "center"
					}
					, {
						field : "user_mail",
						title : "操作",
						align : "center"
					}
				
					]
				});
	};
	
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
		$("#Select_interface").click(function(){
			pageDispatchUser(this,"Select_interface","");
		});
		
		$("#add_interface").click(function(){
			pageDispatchUser(this,"add_interface","");
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
	};

	//跳转方法
	function pageDispatchUser(obj,key,params){
		var p = params;
		if("Select_interface"==key){
			closePageTab("add_user");
			closeAndOpenInnerPageTab("add_user","选择已有接口","pages/apiUse/apiUse_select.html");
			return;
		}
		if("add_interface"==key){
			closePageTab("add_user");
			closeAndOpenInnerPageTab("add_user","新增接口","pages/apiUse/apiUse_add.html");
			return;
				}
			
	};
initTableInfo();
initQueryUserButtonEvent();