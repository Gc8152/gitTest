//接收查询页面传过来的参数
function initProcessDetail(biz_id,af_name,instance_id,instance_state){
	getCurrentPageObj().find("#biz_id").val(biz_id);
	getCurrentPageObj().find("#af_name").val(af_name);
	getCurrentPageObj().find("#instance_state").val(instance_state);
	getCurrentPageObj().find("#instance_id").val(instance_id);
	initApprDetailInfo(instance_id);
}
//加载审批记录信息
function initApprDetailInfo(instance_id) {
	var queryParams=function(params){
		var temp={
			limit: params.limit, //页面大小
			offset: params.offset //页码
		};
		return temp;
	};
	$('#approvalRecordLists').bootstrapTable({
		url : 'QApproval/queryProcessDetail.asp?instance_id='+instance_id,
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : false, //是否显示分页（*）
		pageList : [5,10],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		//clickToSelect : true, //是否启用点击选中行
		uniqueId : "n_id", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		onLoadSuccess:function (){
			setRowspan("approvalRecordLists");
		},
		columns : [{
			field: 'N_ID',
			title : '节点编号',
			align: 'center',
			visible:false
		},{
			field: 'NODE_NAME',
			title : '节点名称',
			align: 'center',
			valign: "middle"
		},{
			field: 'APP_PERSON',
			title : '审批人编号',
			align: 'center',
			visible:false
		},{
			field: 'APP_PERSON',
			title : '审批人编号',
			align: 'center'	
		},{
			field: 'APP_PERSON_NAME',
			title : '审批人',
			align: 'center'	
		},{
			field : 'APP_STATENAME',
			title : '审批结论',
			align : "center",
			formatter:function(value,row,index){
				if(row.APP_STATENAME==""||row.APP_STATENAME==undefined){
					var cfi_edit="待审批";
					return cfi_edit;
				}else{
					return row.APP_STATENAME;
				}
			}
		},{
			field : "APP_CONTENT",
			title : "审批意见",
			align : "center"
		}, {
			field : "OPT_TIME",
			title : "审批时间",
			align : "center"
		}, {
			field : "N_TYPENAME",
			title : "节点类型",
			align : "center"
		}, {
			field : "ORDER_ID",
			title : "审批排序",
			align : "center"
		}, {
			field : "OPT",
			title : "操作",
			align : "center",
			formatter:function(value,row,index){
				if(row.APP_STATENAME==""||row.APP_STATENAME==undefined){
					 var cfi_edit="<a id='app_personname' style='color:#0088cc; cursor:pointer;' onclick='updateAppPerson("+index+")'>修改审批人</a>";
					 return cfi_edit;
				}
			}
		}]
	});
};
//合并单元格
function setRowspan(id){
	var tabledata=$('#'+id).bootstrapTable('getData');
	var node_name = tabledata[0].NODE_NAME;
	var j=0;
	var k=1;
	for(var i=1;i<tabledata.length;i++){
		if(node_name!=tabledata[i].NODE_NAME){
			$('#'+id).bootstrapTable('mergeCells',{index:j,field:'NODE_NAME',colspan:1,rowspan:k});
			j=i;
			k=1;
			node_name=tabledata[i].NODE_NAME;
		}else{
			k++;
		}
	}
	$('#'+id).bootstrapTable('mergeCells',{index:j,field:'N_NAME',colspan:1,rowspan:k});
}
function updateAppPerson(index){
	$("#myModal_user").modal("show");
	initUserPop();
	initVlidate($("#myModal_user"));
	getCurrentPageObj().find("#user_pop_org_name").unbind("click");//user_pop_org_code
	getCurrentPageObj().find("#user_pop_org_name").click(function(){
		openSelectTreeDiv($(this),"updata_apppeople","SOrg/queryorgtreelist.asp",{"margin-left":"130px",width:'180px'},function(node){
			getCurrentPageObj().find("#user_pop_org_name").val(node.name);
			getCurrentPageObj().find("#user_pop_org_code").val(node.id);
		});
	});
	//用户POP重置
	getCurrentPageObj().find("#pop_userReset").click(function(){
		getCurrentPageObj().find("#selectParam input").each(function(){
			$(this).val("");
		});
		
		if(userParam.name){
			userParam.name.removeData("node");
		}
		getCurrentPageObj().find("#pop_userState").val(" ");
		getCurrentPageObj().find("#pop_userState").select2();
	});
	//多条件查询用户
	getCurrentPageObj().find("#pop_userSearch").click(function(){
		var PopUserName = getCurrentPageObj().find("#pop_username").val();
		var PopUserNo =  getCurrentPageObj().find("#pop_userCode").val();
		var PopUserLoginName = getCurrentPageObj().find("#pop_userLoginName").val();
		var PopUserState =  $.trim(getCurrentPageObj().find("#pop_userState").val());
		var sorg_code =  $.trim(getCurrentPageObj().find("#user_pop_org_code").val());
		getCurrentPageObj().find("#pop_userTable").bootstrapTable('refresh',{url:"SUser/popFindAllUser.asp?1=1"+"&PopUserName="+escape(encodeURIComponent(PopUserName))+"&PopUserNo="+PopUserNo+"&PopUserLoginName="+PopUserLoginName+"&PopUserState="+PopUserState+"&org_code="+sorg_code});
	});
	//修改
	getCurrentPageObj().find("#update").click(function(){
		var instance_id=getCurrentPageObj().find("#instance_id").val();
		var data=$("#approvalRecordLists").bootstrapTable("getData");
		var n_id=data[index].N_ID;
		var app_person_code=data[index].APP_PERSON;
		var selRow = $('#pop_userTable').bootstrapTable("getSelections");
		if(selRow.length>0){
			var flag = vlidate($("#myModal_user"));
			if(flag){
				var app_person = selRow[0].USER_NO;
				var mark=getCurrentPageObj().find("#mark").val();
				if(app_person!=""&&app_person!=undefined){
					baseAjax("QApproval/updateAppPerson.asp?app_person="+app_person+"&instance_id="+instance_id+"&n_id="+n_id+"&app_person_code="+app_person_code+"&mark="+escape(encodeURIComponent(mark)),null,
						function(msg){
						if(msg.result=="true"){				
							alert("修改成功");
							getCurrentPageObj().find("#app_person").val("");
							getCurrentPageObj().find("#mark").val("");
							getCurrentPageObj().find("#approvalRecordLists").bootstrapTable('refresh');
							$("#myModal_user").modal("hide");
						}else{
							alert("系统异常，请稍后！");
						}
					});
				}
			}else{
				return;
			}
		}else{
			alert("请选择变更人员");
		}
	});

}
function closeuserPop(){
	getCurrentPageObj().find('#myModal_user').modal('hide');
}
function initUserPop() {
	var queryParams=function(params){
		var temp={
			limit: params.limit, //页面大小
			offset: params.offset //页码
		};
		return temp;
	};
	getCurrentPageObj().find('#pop_userTable').bootstrapTable("destroy").bootstrapTable({
		url : 'SUser/popFindAllUser.asp',			
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
		uniqueId : "instance_id", //每一行的唯一标识，一般为主键列
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
			field : 'USER_NO',
			title : '用户编号',
			align : "center"
		},{
			field : "USER_NAME",
			title : "用户名称",
			align : "center"
		},{
			field : "LOGIN_NAME",
			title : "登陆名",
			align : "center"
		},{
			field : "STATE",
			title : "用户状态",
			align : "center",
			formatter:function(value,row,index){if(value=="00"){return "启用";}return "停用";}
		},{
			field : "ORG_NO_NAME",
			title : "所属部门",
			align : "center"
		}]
	});
};
//页面返回按钮
getCurrentPageObj().find("#goBackBtn").click(function(){
	closeCurrPageTab();
});
