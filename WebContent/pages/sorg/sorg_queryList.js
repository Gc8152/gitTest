//按钮方法
function initOrgButtonEvent() {
	$("#suporg_name").click(function(){
		openSelectTreeDivToBody($(this),"orgSelectTree","SOrg/queryorgtreelist.asp",30,function(node){
			if($("#org_code").val()==node.id){
				return false;
			}
			$("#suporg_name").val(node.name);
			$("#suporg_code").val(node.id);
			return true;
		});
	});
	$("#addOrg").click(function() {
		$("input[name^='O.'][name!='O.old_org_code']").val("");
		$("textarea[name^='O.']").val("");
		var treeObj = $.fn.zTree.getZTreeObj("treeOrg");
		var selectsed = treeObj.getSelectedNodes();
		if(selectsed!=undefined&&selectsed.length>0){
			var selected=selectsed[0];
			$("input[name='O.suporg_code']").val(selected.id);
			$("input[name='O.suporg_name']").val(selected.name);
		}
		$("#old_org_code").val("");
	});
	$("#updateOrg").click(function() {
		var old_org_no = $("#old_org_code").val();
		if(""==$.trim(old_org_no)){
			updateOrg("SOrg/createsorg.asp","添加");
		}else{
			updateOrg("SOrg/updatesorg.asp","修改");
		}
	});
	
	$("#delOrg").click(function() {
		var inputs = $("input[name^='O.']");
		var params = {};
		for (var i = 0; i < inputs.length; i++) {
			var obj = $(inputs[i]);
			params[obj.attr("name").substr(2)] = obj.val();
		}
		shouwModalCallBack("确定删除机构？",function(){
			baseAjax("SOrg/deletesorg.asp", params, function(data) {
				if (data != undefined&&data!=null&&data.result=="true") {
					alert("删除成功");
					initOrgTree();
					$("#resetOrg").click();
				}else{
					alert("删除失败");
				}
			});
		});
	});
	
	$("#resetOrg").click(function(){
		$("input[name^='O.'][name!='O.old_menu_no']").val("");
		$("textarea[name^='O.']").val("");
		$("select[name^='O.']").val("");
	});
	//新增岗位
	$("#addPosition").click(function(){
		addOrUpdateModal("新增","<div class='msmenu_context-input'><span>岗位编号:</span>" +
				"<div><input id='p_code' type='text'></div></div><div class='msmenu_context-input'><span>岗位名称:</span>" +
				"<div><input id='p_name' type='text'></div></div><div class='msmenu_context-input' style='padding-top:10px;width:670px;'><span>岗位描述:</span>" +
				"<div style='width:595px;'><textarea id='p_memo'></textarea></div></div>",function(){
			var org_code=$("#old_org_code").val();
			var p_code=$("#p_code").val();
			var p_name=$("#p_name").val();
			var p_memo=$("#p_memo").val();
			baseAjax("SOrg/insertOrgPosition.asp",{org_code:org_code,p_code:p_code,p_name:p_name,p_memo:p_memo},function(data){
				if(data!=undefined&&data.result=="true"){
					reloadOrgPosition(org_code);
				}else if(data!=undefined&&data.msg!=undefined){
					alert(data.msg);
				}else{
					alert("网络错误!");
				}
			});
		});
	});

	//查看详情按钮
	$("#queryUser").click(function(){
		var seles = $('#orgUserTable').bootstrapTable("getSelections");
		if(seles.length!=1){
			alert("请选择一条数据进行查看!");
			return;
		}
		openInnerPageTab("queryUser","人员详情","pages/suser/suser_queryUser.html", function(){
			initQueryUser(seles[0].USER_NO);
		});
	});

}


//保存方法
function updateOrg(url,msg){
	if(vlidate($("#org_from"))){
		var inputs = $("input[name^='O.']");
		var texts = $("textarea[name^='O.']");
		var select = $("select[name^='O.']");
		var params = {};
		for (var i = 0; i < inputs.length; i++) {
			var obj = $(inputs[i]);
			params[obj.attr("name").substr(2)] = obj.val();
		}
		for (var i = 0; i < texts.length; i++) {
			var obj = $(texts[i]);
			params[obj.attr("name").substr(2)] = obj.val();
		}
		for(var i = 0; i < select.length; i++){
			var obj = $(select[i]);
			params[obj.attr("name").substr(2)] = obj.val();
		}
		baseAjax(url,params,function(data){
			if(data != undefined && data != null && data.result == "true"){
				//$("input[name='O.old_org_code']").val($("input[name='O.org_code']").val());
				initOrgTree();
				alert(msg+"成功");
			}else{
				alert(msg+"失败");
			}
		});
	}
}

//初始化方法
function initOrgTree() {
	$("#addPosition").hide();//隐藏岗位新增按钮
	$("#queryUser").hide();//隐藏人员详情按钮
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
					$("#addPosition").show();
					$("#queryUser").show();
					reloadOrgPosition(treeNode.id);
					baseAjax("SOrg/findonesorg.asp", {
						org_code : treeNode.id
					}, function(data) {
						for ( var k in data) {
							$("input[name='O." + k + "']").val(data[k]);
						}
						$("#old_org_code").val(data['org_code']);
						data['org_code'] != undefined ? $("input[name='O.old_org_code']").val(data['org_code']) : "";
						data['org_address'] != undefined ? $("textarea[name='O.org_address']").val(data['org_address']) : "";
					
					});
				}
			}
	};
	$.fn.zTree.init($("#treeOrg"), setting);
}

//POP控件
function initPOP(){
	//部门经理
	$("#org_manager_name").click(function(){
		openUserPop("userOrgDivPop",{"name":$("#org_manager_name"),"no":$("#org_manager_code")});
		initModal();//POP框垂直居中
	});
	//分管领导
	$("#org_vpname").click(function(){
		openUserPop("userOrgDivPop",{"name":$("#org_vpname"),"no":$("#org_vp")});
		initModal();//POP框垂直居中
	});
}

//时间控件
function initDate(){
	$("#launch_date").focus(function() {
		WdatePicker({
			dateFmt : 'yyyy-MM-dd',
			minDate : '1990-01-01',
			maxDate : '2050-12-01'
		});
	});
}
//用户POP框
$("#userDivPop").load("pages/suser/suserPop.html");

//初始化机构下的岗位表
function initOrgPositionTable(org_code) {
	var call=getMillisecond();
	$('#orgPositionTable').bootstrapTable('destroy');
	$('#orgPositionTable').bootstrapTable({
		url : 'SOrg/queryOrgPosition.asp?org_code='+org_code+"&call="+call, //请求后台的URL（*）
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		pagination : false, //是否显示分页（*）
		sortable : false, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : {},//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 50, //每页的记录行数（*）
		//pageList : [ 5, 10 ], //可供选择的每页的行数（*）
		strictSearch : true,
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "P_CODE", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:call,
		columns : [ {
			field : 'P_CODE',
			title : '岗位编号',
			align : "center",
			sortable: true,
            editable: true,
			  editable: {
                  type: 'text',
                  title: '岗位编号',
                  footerFormatter: totalNameFormatter
              }
		}, {
			field : 'P_NAME',
			title : '岗位名称',
			align : "center"
		}, {
			field : 'P_MEMO',
			title : '岗位描述',
			align : "center"
		} , {
			field : "opt_button",
			title : "操作",
			align : "center",
			 formatter:function(value,row,index){
				 var edit="<a href='#' style='color:#c00;' onclick=updatePosition('"+row.ORG_CODE+"','"+row.P_CODE+"','"+row.P_NAME+"','"+$.trim(row.P_MEMO)+"')>编辑</a>";
				 return edit+" | <a href='#' style='color:#c00;' onclick=upatePositionFlag('"+row.P_CODE+"','"+row.ORG_CODE+"','01')>删除</a>";
			 }
		}],onLoadSuccess:function(){

		}
	});
}


//查询人员信息
function initUserPositionTable(org_code){
	var call=getMillisecond();
	$('#orgUserTable').bootstrapTable('destroy');
	$('#orgUserTable').bootstrapTable({
		url : 'SOrg/queryUserPosition.asp?org_code='+org_code+"&call="+call,////请求后台的URL（*）
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
				jsonpCallback:call,
				columns : [{	
					checkbox:true,
					rowspan: 2,
					align: 'center',
					valign: 'middle'
				},{
					field : 'USER_NO',
					title : '用户编号',
					align : 'center'
				},{
					field : 'USER_NAME',
					title : '用户名称',
					align : "center"
				},{
					field : 'STATE_NAME',
					title : '用户状态',
					align : "center"
				},{
					field : 'NICK_NAME',
					title : '用户昵称',
					align : "center"
				},{
					field : "USER_MAIL",
					title : "用户邮箱",
					align : "center"
				}],onLoadSuccess:function(){
				}
	});
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
};
//修改岗位信息
function updatePosition(org_code,p_code,p_name,p_memo){
	addOrUpdateModal("修改","<div class='msmenu_context-input'><span>岗位编号:</span><div><input id='old_p_code' type='hidden' value='"+p_code+"'>"
			+"<input id='p_code' type='text' value='"+p_code+"'></div></div>"
			+"<div class='msmenu_context-input'><span>岗位名称:</span><div><input id='p_name' type='text' value='"+p_name+"'></div></div>"
			+"<div class='msmenu_context-input' style='padding-top:10px;width:670px;'><span>岗位描述:</span><div style='width:595px;'><textarea id='p_memo'>"+p_memo+"</textarea></div></div>",function(){
		var org_code=$("#old_org_code").val();
		var p_code=$("#p_code").val();
		var p_name=$("#p_name").val();
		var p_memo=$("#p_memo").val();
		
		baseAjax("SOrg/updateOrgPosition.asp",{old_p_code:$("#old_p_code").val(),org_code:org_code,p_code:p_code,p_name:p_name,p_memo:p_memo},function(data){
			if(data!=undefined&&data.result=="true"){
				reloadOrgPosition(org_code);
			}else if(data!=undefined&&data.msg!=undefined){
				alert(data.msg);
			}else{
				alert("网络错误!");
			}
		});
	});
}

/**
 * 有确认按钮和回调的模态框
 * @param msg
 * @param callback
 */
function shouwModalCallBack(msg,callback) {
	nconfirm(msg,callback);
}
//调用新增或修改modal
function addOrUpdateModal(title,msg,callback) {
	$("#cancel").show();
	$("#org_position_sure").unbind();
	$("#org_position_sure").click(function(){
		callback();
	});
	$("#myModalLabel").text(title);
	$("#org_position_context").html(msg);
	$("#myModalOrgPosition").modal("show");
}
//刷新岗位和人员列表
function reloadOrgPosition(org_code){
	initOrgPositionTable(org_code);
	initUserPositionTable(org_code);
}
//岗位数量
function totalNameFormatter(data) {
    return data.length;
}
//删除岗位
function upatePositionFlag(p_code,org_code,p_flag){
	shouwModalCallBack("确定删除岗位？",function(){
		  baseAjax("SOrg/updateOrgPositionFlag.asp",{p_code:p_code,org_code:org_code,p_flag:p_flag},function(data){
			  reloadOrgPosition(org_code);
		  });
	 });
}

$(function(){
	initPOP();
	initOrgTree();
	initOrgButtonEvent();
	initDate();
	initVlidate($("#org_from"));
	initOrgPositionTable("");
	initUserPositionTable("");
})