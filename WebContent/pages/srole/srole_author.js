var menu_no="";

//初始化角色操作配置表
function initSRoleOprTable(menu_no){
	$('#buttonTable').bootstrapTable('destroy').bootstrapTable({
		url : 'SMenu/queryButton.asp?menu_no='+menu_no, //请求后台的URL（*）
		method : 'get', //请求方式（*）   
		striped : true, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		pagination : false, //是否显示分页（*）
		sortable : false, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : {},//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10, //每页的记录行数（*）
		pageList : [ 10, 20 ], //可供选择的每页的行数（*）
		strictSearch : true,
		clickToSelect : true, //是否启用点击选中行
		singleSelect: false,//可以选中多行
		uniqueId : "ACTION_NO", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		checkboxHeader:false,
		columns : [ {
			field : 'ACTION_NO',
			title : '操作ID',
			align : "center",
			sortable: true,
		}, {
			field : 'ACTION_DESCR',
			title : '操作描述',
			align : "center"
		}, {
			field : 'ALERT_INFO',
			title : '提示信息',
			align : "center"
		}, {
			field : "state",
			title : "隐藏",
			align : "center",
			checkbox: true,
			valign: 'middle'
		}],
		onLoadSuccess:function(data){
			var sroleInfo=$("#nowSRole").text();
			$.ajax({
				type:"post",
				url:"SRole/OperateChecked.asp",
				async:true,
				data:{"menu_no":menu_no,"role_no":sroleInfo},
				dataType:"json",
				success:function(msg){	
					if(msg==undefined){
						return;
					}					
					for(var i=0;i<data.rows.length;i++){
						for(var j=0;j<msg.length;j++){
							if(data.rows[i].ACTION_NO==msg[j].ACTION_NO){
								$("#buttonTable").bootstrapTable('check',i);
								
							}
						}
					}
				}
			});
		},onClickRow:function(){
		}
	});	
}
//初始化数据权限列表
function initAuthTables(menu_no){
	$('#dataButton').bootstrapTable('destroy').bootstrapTable({
		url : 'SDicItem/findAllSDicItem.asp?dic_code=S_DIC_PERMISSION', //请求后台的URL（*）
		method : 'get', //请求方式（*）   
		striped : true, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		pagination : false, //是否显示分页（*）
		sortable : false, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : {},//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10, //每页的记录行数（*）
		pageList : [ 10, 20 ], //可供选择的每页的行数（*）
		strictSearch : true,
		clickToSelect : true, //是否启用点击选中行
		//height : 300, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
		uniqueId : "ITEM_CODE", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		checkboxHeader:true,
		columns : [ {
			field : 'ITEM_CODE',
			title : '字典编码',
			align : "center",
		}, {
			field : 'ITEM_NAME',
			title : '文本值',
			align : "center"
		},{
			field : 'MEMO',
			title : '说明',
			align : "center"
		},{
			title : "隐藏",
			align : "center",
			//checkbox: true,
			radio:true,
			valign: 'middle'
		} ],onLoadSuccess:function(data){
			var sroleInfo=$("#nowSRole").text();
			$.ajax({
				type:"post",
				url:"SRole/DataAuthChecked.asp",
				async:true,
				data:{"menu_no":menu_no,"role_no":sroleInfo},
				dataType:"json",
				success:function(msg){	
					if(msg==undefined){
						return;
					}
					for(var i=0;i<data.rows.length;i++){
						for(var j=0;j<msg.length;j++){
							if(data.rows[i].ITEM_CODE==msg[j].DATA_NO){
								$("#dataButton").bootstrapTable('check',i);
								
							}
						}
					}	
				}
			});		
		},onClickRow:function(){				
		}
	});
}
//初始化属性表
function initPropertyTables(menu_no) {
	$('#propertyTable').bootstrapTable('destroy').bootstrapTable({
		url : 'SMenu/queryProperty.asp?menu_no='+menu_no, //请求后台的URL（*）
		method : 'get', //请求方式（*）   
		striped : true, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		pagination : false, //是否显示分页（*）
		sortable : false, //是否启用排序
		sortOrder : "asc", //排序方式
		/*queryParams : function(parmas){
			var temp={
					limit: parmas==undefined?5:parmas.limit, //页面大小
					offset:  parmas==undefined?1:parmas.offset, //页码
			};
			return temp;
		},*///传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		//pageSize : 10, //每页的记录行数（*）
		//pageList : [ 5,10 ], //可供选择的每页的行数（*）
		strictSearch : true,
		clickToSelect : true, //是否启用点击选中行
		//height : 300, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
		uniqueId : "PROPERTY_NO", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		checkboxHeader:false,
		columns : [ {
			field : 'PROPERTY_NO',
			title : '属性ID',
			align : "center"
		}, {
			field : 'PROPERTY_NAME',
			title : '属性名称',
			align : "center"
		}, {
			field : "",
			title : "隐藏",
			align : "center",
			checkbox: true,
			valign: 'middle'
		} ],onLoadSuccess:function(data){
			var sroleInfo=$("#nowSRole").text();
			$.ajax({
				type:"post",
				url:"SRole/fileAuthChecked.asp",
				async:true,
				data:{"menu_no":menu_no,"role_no":sroleInfo},
				dataType:"json",
				success:function(msg){	
					if(msg==undefined){
						return;
					}
					for(var i=0;i<data.rows.length;i++){
						for(var j=0;j<msg.length;j++){
							if(data.rows[i].PROPERTY_NO==msg[j].PROPERTY_NO){
								$("#propertyTable").bootstrapTable('check',i);
								
							}
						}
					}		
				}
			});
		},onClickRow:function(){				
		}
	});
}						
//初始化树
function initRoleMenuTree() {
	var setting = {
		async : {
			enable : true,
			url : "SMenu/queryAllmenu.asp",
			contentType : "application/json",
			type : "get"
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
			onClick : function(event, treeId, treeNode) {	
				baseAjax("SMenu/findOneMenu.asp", {
					menu_no : treeNode.id
				}, function(data) {											
					menu_no=data.menu_no;
				});
			}
		}
	};
	var setting1 = {
			async : {
				enable : true,
				url : "SMenu/queryAllmenu.asp",
				contentType : "application/json",
				type : "get"
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
				onAsyncSuccess:function(){
					var treeObj = $.fn.zTree.getZTreeObj("treeOpr");
					expandNodeLevel1(treeObj,"treeOpr");
				},
				onClick : function(event, treeId, treeNode) {
					/*$('#buttonTable').bootstrapTable('refresh',{url:'SMenu/queryButton.asp?menu_no='+ treeNode.id});
					baseAjax("SMenu/findOneMenu.asp", {
						menu_no : treeNode.id
					}, function(data) {			*/			
						initSRoleOprTable(treeNode.id);						
						menu_no=treeNode.id;
				//	});
				}
			}
		};
	var setting2 = {
			async : {
				enable : true,
				url : "SMenu/queryAllmenu.asp",
				contentType : "application/json",
				type : "get"
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
				onAsyncSuccess:function(){
					var treeObj = $.fn.zTree.getZTreeObj("treeData");
					expandNodeLevel1(treeObj,"treeData");
				},
				onClick : function(event, treeId, treeNode) {					
					$('#dataButton').bootstrapTable('refresh',{url:'SDicItem/findAllSDicItem.asp?dic_code=6'});					
					baseAjax("SMenu/findOneMenu.asp", {
						menu_no : treeNode.id
					}, function(data) {												
						initAuthTables(data.menu_no);
						menu_no=data.menu_no;
					});
				}
			}
		};
	var setting3 = {
			async : {
				enable : true,
				url : "SMenu/queryAllmenu.asp",
				contentType : "application/json",
				type : "get"
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
				onAsyncSuccess:function(){
					var treeObj = $.fn.zTree.getZTreeObj("treeFiled");
					expandNodeLevel1(treeObj,"treeFiled");
				},
				onClick : function(event, treeId, treeNode) {
					$('#propertyTable').bootstrapTable('refresh',{url:'SMenu/queryProperty.asp?menu_no='+ treeNode.id});					
					baseAjax("SMenu/findOneMenu.asp", {
						menu_no : treeNode.id
					}, function(data) {												
						initPropertyTables(data.menu_no);						
						menu_no=data.menu_no;
					});
				}
			}
		};
	setting.check= {
			enable: true,
			chkStyle: "checkbox"
			};
	setting.callback.onAsyncSuccess=function(){
		var treeObj = $.fn.zTree.getZTreeObj("treeRoleMenu");
		treeObj.checkAllNodes(false);
		expandNodeLevel1(treeObj,"treeRoleMenu");
		var sroleInfo=$("#nowSRole").text();
		$.ajax({
			type:"post",
			url:"SRole/treeMenuChecked.asp",
			async:true,
			data:{"role_no":sroleInfo},
			dataType:"json",
			success:function(msg){
				if(msg==undefined){
					return;
				}
				var treeObj = $.fn.zTree.getZTreeObj("treeRoleMenu");
				for(var i=0;i<msg.length;i++){
					var node = treeObj.getNodeByParam("id",msg[i].MENU_NO);
					if(node!=null){
						treeObj.checkNode(node, true, false);
					}
				}
			}
		});		
	};
	$.fn.zTree.init($("#treeRoleMenu"), setting);
	setTimeout(function(){
		$.fn.zTree.init($("#treeOpr"), setting1);
		$.fn.zTree.init($("#treeData"), setting2);
		$.fn.zTree.init($("#treeFiled"), setting3);
	},333);
}

//获取所有选中的节点
function getCheckedAllRoleMenu(){		
	var treeObj = $.fn.zTree.getZTreeObj("treeRoleMenu");		
    var nodes = treeObj.getCheckedNodes(true);
    if(nodes!=undefined&&nodes.length>0){
       var msg=nodes[0].id;
       for (var i = 1; i < nodes.length; i++) {
           if(nodes[i].id!=undefined&&nodes[i].id!=""){
    	   		msg=msg+","+nodes[i].id;
           }
       }
       return msg;
   }
   return "";
}
//保存菜单节点值
function saveSRolem(){	
	var memunos=getCheckedAllRoleMenu();
	var sroleInfo=$("#nowSRole").text();				
	$.ajax({
		type : "post",
		url : "SRole/sRoleMenuDis.asp",
		async :true,
		data :{"memunos":memunos,"sroleInfo":sroleInfo},
		dataType : "json",
		success : function(msg) {
			if(msg.result=="true"){
				alert("保存成功！");
			}
		},
		error : function() {				
		}
	});
}
//保存操作节点值
function saveSRoleOpr(){
	var id = $("#buttonTable").bootstrapTable('getSelections');
	var action_nos = $.map(id, function (row) {return row.ACTION_NO;});
	var action_no="";
	for(var i=0;i<action_nos.length;i++){
		action_no=action_no+","+action_nos[i];
	}
	//var menu_no = $.map(id, function (row) {return row.MENU_NO;});
	var sroleInfo=$("#nowSRole").text();
	$.ajax({
		type : "post",
		url : "SRole/sRoleOperDis.asp",
		async :true,
		data :{"action_no":action_no,"menu_no":menu_no,"sroleInfo":sroleInfo},
		dataType : "json",
		success : function(msg) {	
			if(msg.result=="true"){
				alert("保存成功！");
			}
		},
		error : function() {				
		}
	});
}
//保存角色数据权限
function saveSRoleText(){
	var id = $("#dataButton").bootstrapTable('getSelections');
	var data_no = $.map(id, function (row) {return row.ITEM_CODE;});
	var sroleInfo=$("#nowSRole").text();
	$.ajax({
		type : "post",
		url : "SRole/sRoleDataAuth.asp",
		async :true,
		data :{"data_no":data_no[0],"menu_no":menu_no,"sroleInfo":sroleInfo},
		dataType : "json",
		success : function(msg) {	
			if(msg.result=="true"){
				alert("保存成功！");
			}
		},
		error : function() {
		}
	});
}
//保存角色字段
function saveSRoleData(){		
	var id = $("#propertyTable").bootstrapTable('getSelections');
	var property_nos = $.map(id, function (row) {return row.PROPERTY_NO;});
	var property_no="";
	for(var i=0;i<property_nos.length;i++){
		property_no=property_no+","+property_nos[i];
	}
	//var menu_no = $.map(id, function (row) {return row.MENU_NO;});		
	var sroleInfo=$("#nowSRole").text();
	$.ajax({
		type : "post",
		url : "SRole/sRoleFieldAuth.asp",
		async :true,
		data :{"menu_no":menu_no,"sroleInfo":sroleInfo,"property_no":property_no},
		dataType : "json",
		success : function(msg) {
			if(msg.result=="true"){
				alert("保存成功！");
			}
		},
		error : function() {				
		}
	});
}
initRoleMenuTree();	