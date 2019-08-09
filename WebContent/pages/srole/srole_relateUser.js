//删除指定机构的角色关联的用户信息
function deleteRow(user_no,org_code,role_no,user_name){
	nconfirm("确定删除关联人员【"+user_name+"】吗？",function(){
		baseAjax("SRole/deleteUserOrgRole.asp?user_no="+user_no+"&org_code="+org_code+"&role_no="+role_no,{},function(data){
			if (data) {
				if(data.result){
					alert("删除关联人员【"+user_name+"】成功！");
					$('#SrelateUserTableInfo').bootstrapTable('refresh',{url:'SRole/queryallrelateUser.asp?role_no='+role_no});
				}
			}
		});		
	});
}
//查询关联人员信息
function initrelateUserInfo(data){
	var role_no=data["ROLE_NO"];
	baseAjax("SRole/findSRoleById.asp?role_no="+role_no, null, function(msg){
		for(var k in msg){
			if(k=='flag'){
				if(msg[k]=='01'){
					getCurrentPageObj().find("#flag").text("停用");
				}else{
					getCurrentPageObj().find("#flag").text("启用");
				}
			}else{
			getCurrentPageObj().find("#"+k).text(msg[k]);
			}
		}
	});
	$("#SrelateUserTableInfo").bootstrapTable(
			{
				url : 'SRole/queryallrelateUser.asp?role_no='+role_no,
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
				uniqueId : "USER_NO", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: true,
				onLoadSuccess:function(data){
				},
				columns : [{
					field : 'USER_NO',
					title : '用户编号',
					align : 'center'
				},{
					field : 'USER_NAME',
					title : '用户名称',
					align : "center"
				},{
					field : 'NICK_NAME',
					title : '用户昵称',
					align : "center"
				},{
					field : 'USER_MOBILE',
					title : '联系方式',
					align : "center"
				},{
					field : "USER_MAIL",
					title : "用户邮箱",
					align : "center"
				},{
					field : 'USER_DEPARTMENT',
					title : '所属部门',
					align : "center"
				},{
					field : 'USER_ORG',
					title : '任职机构',
					align : "center"
				}, {
					field : 'opt',
					title : '操作',
					align : "center",
					width : "50px",
					formatter:function operateFormatter(value,row,index){
						return "<a onclick='deleteRow("+JSON.stringify(row.USER_NO)+","+JSON.stringify(row.ORG_CODE)+","+JSON.stringify(role_no)+","+JSON.stringify(row.USER_NAME)+")'>删除</a>";
					}
				} ]
			});
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
};
