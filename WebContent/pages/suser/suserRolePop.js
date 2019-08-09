//删除用户指定机构的角色
function deleteRow(user_no,org_code,role_no,org_name){
	nconfirm("确定删除关联角色【"+org_name+"】吗？",function(){
		baseAjax("SRole/deleteUserOrgRole.asp?user_no="+user_no+"&org_code="+org_code+"&role_no="+role_no,{},function(data){
			if (data) {
				if(data.result){
					alert("删除关联角色【"+org_name+"】成功！");
					var sUrl = 'SUser/queryAllRoleByUser.asp?user_no=' + user_no;
					getCurrentPageObj().find("#background_suserRolePop").find("[tb='table_userRole']").bootstrapTable('refresh',{
						url:sUrl});
				}
			}
		});		
	});
}
function background_openUserRolePop(popId,callparams){
	$("#background_suserRolePop").remove();
	//加载pop框内容

	$("#"+popId).load("pages/suser/suserRolePop.html",{},function(){
		var modObjPOP = getCurrentPageObj().find("#background_suserRolePop");
		modObjPOP.modal("show");
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		modObjPOP.find("[tb='table_userRole']").bootstrapTable({
			url :'SUser/queryAllRoleByUser.asp?user_no=' + callparams.user_no,
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
			uniqueId : "user_no", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			detailView : false, //是否显示父子表
			singleSelect: true,
			onDblClickRow:function(row){
			},onLoadSuccess : function(data){
				gaveInfo();
			},
			columns : [ {
				field : 'order_id',
				title : '序号',
				align : "center",
				width : "50px",
				formatter:function(value,row,index){
					return index + 1;
				}
			}, {
				field : 'USER_NAME',
				title : '用户名称',
				align : "center",
				width : "100px"
			}, {
				field : 'USER_NO',
				title : '用户编号',
				align : "center",
				width : "80px"
			}, {
				field : 'ORG_NAME',
				title : '机构名称',
				align : "center"
			}, {
				field : 'ORG_CODE',
				title : '机构编号',
				align : "center",
				width : "80px"
			}, {
				field : 'ROLE_NAME',
				title : '角色名称',
				align : "center"
			}, {
				field : 'ROLE_NO',
				title : '角色编号',
				align : "center",
				width : "80px"
			}, {
				field : 'opt',
				title : '操作',
				align : "center",
				width : "50px",
				formatter:function operateFormatter(value,row,index){
					return "<a onclick='deleteRow("+JSON.stringify(row.USER_NO)+","+JSON.stringify(row.ORG_CODE)+","+JSON.stringify(row.ROLE_NO)+","+JSON.stringify(row.ORG_NAME)+")'>删除</a>";
				}
			}]
		});

		
		//重置按钮
		modObjPOP.find("#reset_pop").click(function(){
			modObjPOP.find("#org_name,#org_code").val("");
			modObjPOP.find("#role_no1").val("").select2();
		});
		//查询按钮
		modObjPOP.find("#query_pop").click(function(){
			var params = getCurrentPageObj().find("#background_userRolePopForm").serialize();
			var sUrl = 'SUser/queryAllRoleByUser.asp?user_no=' + callparams.user_no + "&"+params;
			modObjPOP.find("[tb='table_userRole']").bootstrapTable('refresh',{
				url:sUrl});
		});	
		enterEventRegister("popModelQueryLevel1", function(){getCurrentPageObj().find("#query_pop").click();});
		/*	getCurrentPageObj().find("#org_name").unbind('click');
		getCurrentPageObj().find("#org_name").click(function(){
			openSelectTreeDiv($(this),"userRolePop_ree_id","SOrg/queryorgtreelist.asp",{"margin-left":"130px",width:'180px'},function(node){
				getCurrentPageObj().find("#org_name").val(node.name);
			getCurrentPageObj().find("#org_code").val(node.id);
			});
		});*/
/*		modObjPOP.find("#org_name").unbind('click');
		modObjPOP.find("#org_name").bind('click',function(){
			openSelectTreeDivToBody($(this),"userRolePop_ree_id","SOrg/queryorgtreelist.asp",30,function(node){
				modObjPOP.find("#org_name").val(node.name);
				modObjPOP.find("#org_code").val(node.id);
			});
		});*/
		modObjPOP.find("#org_name").unbind('click');
		modObjPOP.find("#org_name").bind('click',function(){
			modObjPOP.find(".drop-ztree").hide();
			openSelectTreeDiv($(this),"userRolePop_ree_id","SOrg/queryorgtreelist.asp",{"margin-left":"130px",width:'180px'},function(node){
				modObjPOP.find("#org_name").val(node.name);
				modObjPOP.find("#org_code").val(node.id);
			});
		});
		initRoleSelect();
		//初始化角色下拉选
		function initRoleSelect(){
			baseAjax("SRole/querySrole.asp",{},function(data){
				if (data) {
					var obj=getCurrentPageObj().find("#role_no1");
					obj.empty();
					obj.append('<option value="">请选择</option>');
					for(var i=0;i<data.srole.length;i++){
						if(data.srole[i].FLAG=='00'){//查询启用的角色
							obj.append('<option value="'+data.srole[i].ROLE_NO+'">'+data.srole[i].ROLE_NAME+'</option>');	
						}
					}
					obj.select2();
				}
			});
		}
		//重写模态对话框的enforceFocus函数使select2搜索框在模态框中生效
		$.fn.modal.Constructor.prototype.enforceFocus = function () {};
	});
}