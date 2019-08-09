	function updateORadd(url, msg,haveId) {
		if(vlidate($("#menu_form"),"",true)){
			var inputs = $("input[name^='M.']");
			
			var params = {"menu_level":'0'};
			for (var i = 0; i < inputs.length; i++) {
				var obj = $(inputs[i]);
				params[obj.attr("name").substr(2)] = obj.val();
			}
			
			var selects = $("select[name^='M.']");
			for (var i = 0; i < selects.length; i++) {
				var obj = $(selects[i]);
				params[obj.attr("name").substr(2)] = obj.val();
			}
			
			var texts = $("textarea[name^='M.']");
			for (var i = 0; i < texts.length; i++) {
				var obj = $(texts[i]);
				params[obj.attr("name").substr(2)] = obj.val();
			}

			if(params["supmenu_no"]!=undefined&&$.trim(params["supmenu_no"])){
				var treeNode=initMenuTree["data"][params["supmenu_no"]];
				if(treeNode!=undefined&&treeNode.level!=undefined){
					params["menu_level"]=treeNode.level+1;
				}
			}

			if(undefined!=haveId){
				params["haveId"]=haveId;
			}
			var menu_url=params.menu_url;
	        var rid=getCurrentPageObj().find("[name='M.menu_url']").attr("placeholder");
	        if(menu_url==rid){
	        	params["menu_url"]="";
	        }
			
			baseAjax(url, params, function(data) {
				if (data != undefined && data != null && data.result == "true") {
					$("input[name='M.old_menu_no']").val($("input[name='M.menu_no']").val());
					shouwModal_(msg + "成功");
					initMenuTree();
				} else {
					shouwModal_(data.msg+","+msg + "失败");
				}
			});
		}
	}
	/**
	 * 只有确定按钮的模态框
	 * @param msg
	 */
	function shouwModal_(msg) {
		alert(msg);
	}
	/**
	 * 有确认按钮和回调的模态框
	 * @param msg
	 * @param callback
	 */
	function shouwModalCallBack(msg,callback) {
		nconfirm(msg,callback);
	}
	
	function addOrUpdateModal(title,msg,callback) {
		$("#cancel").show();
		$("#menu_sure").unbind();
		$("#menu_sure").click(function(){
			callback();
		});
		$("#myModalLabel").text(title);
		$("#msmenu_context").html(msg);
		$("#myModalMenu").modal("show");
	}
	/**
	 * 获取树的子节点
	 * @param node
	 * @returns {String}
	 */
	function getAllChilderNodeId(node) {
		var nid = node.id;
		if (node.children == undefined || node.children.length == undefined
				|| node.id == undefined) {
			return nid;
		}
		for (var i = 0; i < node.children.length; i++) {
			nid = nid + "," + getAllChilderNodeId(node.children[i]);
		}
		return nid;
	}
	
	/**
	 * 判断节点的子节点是否有某个id
	 * @param node
	 * @returns {String}
	 */
	function checkChilderNodeHaveId(node,id) {
		var nid = node.id;
		if(nid==id){
			return true;
		};
		if (node.children == undefined || node.children.length == undefined
				|| node.id == undefined) {
			return false;
		};
		for (var i = 0; i < node.children.length; i++) {
			if(checkChilderNodeHaveId(node.children[i],id)){
				return true;
			}
		};
		return false;
	}
	/**
	 * 初始化按钮事件
	 */
	function initMenuButtonEvent() {
		$("#supmenu_name").click(function(){
			openSelectTreeDivToBody($(this),"menuSelectTree","SMenu/queryAllmenu.asp",30,function(node){
				$("input[name='M.supmenu_name']").val(node.name);
				$("input[name='M.supmenu_no']").val(node.id);
			});
		/*	openSelectTreeDiv($(this),"menuSelectTree","SMenu/queryAllmenu.asp",{width:$("#supmenu_name").width()+"px","margin-left": "0px"},function(node){
				if($("input[name='M.old_menu_no']").val()==node.id){
					return false;
				}
				$("input[name='M.supmenu_name']").val(node.name);
				$("input[name='M.supmenu_no']").val(node.id);
				return true;
			});*/
		});
		$("#supmenu_name").focus(function(){
			$("#supmenu_name").click();
		});
		$("#addMenu").click(function(){
			$("input[name^='M.'][name!='M.old_menu_no']").val("");
			$("textarea[name^='M.']").val("");
			var treeObj = $.fn.zTree.getZTreeObj("treeMenuManager");
			var selectsed = null;
			if(treeObj!=undefined){
				selectsed = treeObj.getSelectedNodes();
			}
			if(selectsed!=undefined&&selectsed.length>0){
				var selected=selectsed[0];
				$("input[name='M.supmenu_no']").val(selected.id);
				$("input[name='M.supmenu_name']").val(selected.name);
			}
			$("#old_menu_no").val("");
			$("input[name='M.menu_no']").focus();
		});
		$("#saveMenu").click(function() {
			var old_menu_no=$("#old_menu_no").val();
			if(""==$.trim(old_menu_no)){//如果没有旧的菜单编号则为创建
				updateORadd("SMenu/createmenu.asp", "添加");
			}else{
				if($.trim($("#supmenu_no").val())!=""){
					var treeObj = $.fn.zTree.getZTreeObj("treeMenuManager");
					var selectsed = treeObj.getSelectedNodes();
					if(checkChilderNodeHaveId(selectsed[0],$("#supmenu_no").val())){
						updateORadd("SMenu/updateMenu.asp", "修改",$("#supmenu_no").val());
					}else{
						updateORadd("SMenu/updateMenu.asp", "修改");
					}
				}else{
					updateORadd("SMenu/updateMenu.asp", "修改");
				}
			}
		});
		$("#resetMenu").click(function() {
			$("input[name^='M.'][name!='M.old_menu_no']").val("");
			$("textarea[name^='M.']").val("");
		});
		$("#delMenu").click(
				function() {
					var treeObj = $.fn.zTree.getZTreeObj("treeMenuManager");
					var selected = treeObj.getSelectedNodes()[0];
					var nodeIds = getAllChilderNodeId(selected);
					shouwModalCallBack("确定删除该菜单？",function(){
						baseAjax("SMenu/deletemenu.asp", {
							menu_nos : nodeIds
						}, function(data) {
							if (data != undefined && data != null
									&& data.result == "true") {
								shouwModal_("删除成功");
								initMenuTree();
							} else {
								shouwModal_("删除失败");
							}
						});
					});
				});
		$("#addButton").click(function(){
			addOrUpdateModal("新增","<div class='msmenu_context-input'><span>操作ID:</span><div><input id='buttonId' type='text' /></div></div><div class='msmenu_context-input'><span>操作描述:</span><div><input id='buttonDes' type='text' /></div></div>",function(){
				var menu_no=$("#old_menu_no").val();
				var id=$("#buttonId").val();
				var des=$("#buttonDes").val();
				baseAjax("SMenu/createButton.asp",{menu_no:menu_no,action_no:id,action_descr:des},function(data){
					if(data!=undefined&&data.result=="true"){
						reloadButtons(menu_no);
					}else if(data!=undefined&&data.msg!=undefined){
						alert(data.msg);
					}else{
						alert("网络错误!");
					}
				});
			});
//			initModal();
		});
		$("#addProperty").click(function(){
			var addproperty="<div class='msmenu_context-input'><span>属性ID:</span><div><input id='propertyId' type='text' /></div></div><div class='msmenu_context-input'><span>属性名称:</span><div><input id='propertyName' type='text' /></div></div>";
			addOrUpdateModal("增加属性",addproperty,function(){
				var menu_no=$("#old_menu_no").val();
				var propertyId=$("#propertyId").val();
				var propertyName=$("#propertyName").val();
				baseAjax("SMenu/createProperty.asp",{property_no:propertyId,property_name:propertyName,menu_no:menu_no},function(data){
					if(data!=undefined&&data.result=="true"){
						reloadProperty(menu_no);
					}else if(data!=undefined&&data.msg!=undefined){
						alert(data.msg);
					}else{
						alert("网络错误!");
					}
					//initPropertyTables(menu_no);
				});
			});
		});
	}
	
	/**
	 * 菜单属性状态修改
	 * @param menu_no
	 * @param property_no
	 * @param flag
	 */
	function flagProerty(str){
		var strs= new Array(); //定义一数组 
		  strs=str.split(","); //字符分割
		  var menu_no=strs[0];
		  var property_no=strs[1];
		  var flag=strs[2];
		baseAjax("SMenu/updatePropertyFlag.asp",{menu_no:menu_no,property_no:property_no,flag:flag},function(data){
			reloadProperty(menu_no);
		});
	}
	/**
	 * 修改菜单属性
	 * @param menu_no
	 * @param property_no
	 * @param property_name
	 */
	function updProerty(str){
		var strs= new Array(); //定义一数组 
		  strs=str.split(","); //字符分割
		  var property_no=strs[1];
		  var property_name=strs[2];
		var addproperty="<input id='old_propertyId' type='hidden' value='"+property_no+"' style='width:185px;'>属性ID:<input id='propertyId' type='text' value='"+property_no+"' style='width:185px;'>" +
				"属性名称:<input id='propertyName'  style='width:185px;' value='"+property_name+"'type='text'>";
		addOrUpdateModal("修改属性",addproperty,function(){
			var menu_no=$("#old_menu_no").val();
			var old_propertyId=$("#old_propertyId").val();
			var propertyId=$("#propertyId").val();
			var propertyName=$("#propertyName").val();
			baseAjax("SMenu/updateProperty.asp",{property_no:propertyId,property_name:propertyName,menu_no:menu_no,old_property_no:old_propertyId},function(data){
				if(data!=undefined&&data.result=="true"){
					reloadProperty(menu_no);
				}else if(data!=undefined&&data.msg!=undefined){
					alert(data.msg);
				}else{
					alert("网络错误!");
				}
				//initPropertyTables(menu_no);
			});
		});
	}
	/**
	 * 删除菜单
	 * @param menu_no
	 * @param property_no
	 */
	function delProerty(str){
		var strs= new Array(); //定义一数组 
		  strs=str.split(","); //字符分割
		  var menu_no=strs[0];
		  var property_no=strs[1];
		shouwModalCallBack("确定删除该菜单属性？",function(){
			baseAjax("SMenu/removeProperty.asp",{menu_no:menu_no,property_no:property_no},function(data){
				reloadProperty(menu_no);
			});
		});
	}
	var calls = getMillisecond();
	function reloadProperty(menu_no){
		getCurrentPageObj().find('#propertyTableMenu').bootstrapTable('refresh',{url:dev_application+'SMenu/queryProperty.asp?menu_no='+menu_no+"&call="+calls+"&SID="+SID});
	}
	function initPropertyTables1(menu_no) {
		getCurrentPageObj().find('#propertyTableMenu').bootstrapTable('destroy');
		getCurrentPageObj().find('#propertyTableMenu').bootstrapTable({
			url : dev_application+"SMenu/queryProperty.asp?menu_no="+menu_no+"&call="+calls+"&SID="+SID, //请求后台的URL（*）
			method : "get", //请求方式（*）   
			striped : false, //是否显示行间隔色
			cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
//			pagination : true, //是否显示分页（*）
			sortable : false, //是否启用排序
			sortOrder : "asc", //排序方式
//			queryParams : function(parmas){
//				var temp={
//						limit: parmas==undefined?5:parmas.limit, //页面大小
//						offset:  parmas==undefined?1:parmas.offset, //页码
//				};
//				return temp;
//			},//传递参数（*）
			sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
			pageNumber : 1, //初始化加载第一页，默认第一页
			pageSize : 10, //每页的记录行数（*）
			//pageList : [ 5, 10 ], //可供选择的每页的行数（*）
			strictSearch : true,
			clickToSelect : true, //是否启用点击选中行
			//height : 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
			uniqueId : "ACTION_NO", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			detailView : false, //是否显示父子表
			jsonpCallback : calls,
			columns : [ {
				field : 'PROPERTY_NO',
				title : '属性ID',
				align : "center"
			}, {
				field : 'PROPERTY_NAME',
				title : '属性名称',
				align : "center"
			}, {
				field : "FLAG",
				title : "状态",
				align : "center",
				 formatter:function(value,row,index){if(value=="00"){return "启用";}return "停用";}
			} ,{
				field : "opt_property",
				title : "操作",
				align : "center",
				 formatter:function(value,row,index){
				var edit="<span class='hover-view'"+" onclick='updProerty(\""+row.MENU_NO+','+row.PROPERTY_NO+','+row.PROPERTY_NAME+"\");'>编辑</span>";
				 if(row.FLAG=="00"){
					 edit=edit+" | <span class='hover-view'"+" onclick='flagProerty(\""+row.MENU_NO+','+row.PROPERTY_NO+','+"01"+"\");'>停用</span>";
				 }else{
					 edit=edit+" | <span class='hover-view'"+" onclick='flagProerty(\""+row.MENU_NO+','+row.PROPERTY_NO+','+"00"+"\");'>启用</span>";
				 }
				 return edit+" | <span class='hover-view'"+"  onclick='delProerty(\""+row.MENU_NO+','+row.PROPERTY_NO+"\");'>删除</span>";
			 
		 }
			} ],onLoadSuccess:function(){
			},onClickRow:function(){
			}
		});
	}
  function flagButton(str){
	  var strs= new Array(); //定义一数组 
	  strs=str.split(","); //字符分割
	  var action_no=strs[0];
	  var menu_no=strs[1];
	  var flag=strs[2];
	  baseAjax("SMenu/updateButtonFlag.asp",{menu_no:menu_no,action_no:action_no,flag:flag},function(data){
		  reloadButtons(menu_no);
	  });
  }
  
  function updButton(str){
	  var strs= new Array(); //定义一数组 
	  strs=str.split(","); //字符分割
	  var action_no=strs[0];
	  var desc=strs[2];
		addOrUpdateModal("修改",
				"操作ID:<input id='old_action_no' type='hidden' value='"+action_no+"' style='width:5px;'>"
				+"<input id='buttonId' type='text' value='"+action_no+"' style='width:285px;'>"
				+"操作描述:<input id='buttonDes' value='"+desc+"'type='text' style='width:285px;'>",function(){
			var menu_no=$("#old_menu_no").val();
			var id=$("#buttonId").val();
			var des=$("#buttonDes").val();
			
			baseAjax("SMenu/updateButton.asp",{old_action_no:$("#old_action_no").val(),menu_no:menu_no,action_no:id,action_descr:des},function(data){
				if(data!=undefined&&data.result=="true"){
					reloadButtons(menu_no);
				}else if(data!=undefined&&data.msg!=undefined){
					alert(data.msg);
				}else{
					alert("网络错误!");
				}
			});
		});
  }
  
  function delButton(str){
	  var strs= new Array(); //定义一数组 
	  strs=str.split(","); //字符分割
	  var action_no=strs[0];
	  var menu_no=strs[1];
	  var callback=strs[2];
	  shouwModalCallBack("确定删除该按钮？",function(){
		  baseAjax("SMenu/removeButton.asp",{menu_no:menu_no,action_no:action_no},function(data){
			  if(callback==undefined){
				  reloadButtons(menu_no);
			  }
		  });
	  });
  }

  function totalNameFormatter(data) {
      return data.length;
  }
  var calls1 = getMillisecond()+1;
  function reloadButtons(menu_no){
	  getCurrentPageObj().find('#buttonTableMenu').bootstrapTable('refresh',{url : dev_background+'SMenu/queryButton.asp?menu_no='+menu_no+"&call="+calls1+"&SID="+SID});
  }
	function initButtonTables(menu_no) {
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset //页码
			};
			return temp;
		};
		getCurrentPageObj().find('#buttonTableMenu').bootstrapTable('destroy');
		getCurrentPageObj().find('#buttonTableMenu').bootstrapTable({
			url : dev_background+'SMenu/queryButton.asp?menu_no='+menu_no+"&call="+calls1+"&SID="+SID, //请求后台的URL（*）
			method : 'get', //请求方式（*）   
			striped : false, //是否显示行间隔色
			cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			pagination : false, //是否显示分页（*）
			sortable : false, //是否启用排序
			sortOrder : "asc", //排序方式
			queryParams : queryParams,//传递参数（*）
			sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
			pageNumber : 1, //初始化加载第一页，默认第一页
			pageSize : 50, //每页的记录行数（*）
			//pageList : [ 5, 10 ], //可供选择的每页的行数（*）
			strictSearch : true,
			clickToSelect : true, //是否启用点击选中行
			//height : 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
			uniqueId : "ACTION_NO", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			jsonpCallback : calls1,
			detailView : false, //是否显示父子表
			columns : [ {
				field : 'ACTION_NO',
				title : '操作ID',
				align : "center",
				sortable: true,
                editable: true,
				  editable: {
                      type: 'text',
                      title: '操作ID',
                      footerFormatter: totalNameFormatter
                  }
			}, {
				field : 'ACTION_DESCR',
				title : '操作描述',
				align : "center"
			}, {
				field : 'ALERT_INFO',
				title : '提示信息',
				align : "center"
			}, {
				field : "FLAG",
				title : "状态",
				align : "center",
				 formatter:function(value,row,index){if(value=="00"){return "启用";}return "停用";}
			} , {
				field : "opt_button",
				title : "操作",
				align : "center",
				 formatter:function(value,row,index){
					 var edit="<span class='hover-view'"+" onclick='updButton(\""+row.ACTION_NO+','+row.MENU_NO+','+row.ACTION_DESCR+"\");'>编辑</span>";
					 if(row.FLAG=="00"){
						 edit=edit+" | <span class='hover-view'"+" onclick='flagButton(\""+row.ACTION_NO+','+row.MENU_NO+','+"01"+"\");'>停用</span>";
					 }else{
						 edit=edit+" | <span class='hover-view'"+" onclick='flagButton(\""+row.ACTION_NO+','+row.MENU_NO+','+"00"+"\");'>启用</span>";
					 }
					 return edit+" | <span class='hover-view'"+"  onclick='delButton(\""+row.ACTION_NO+','+row.MENU_NO+"\");'>删除</span>";
					 
				 }
			}],onLoadSuccess:function(){

			}
		});
	}
	
	var calls2 = getMillisecond()+2;
	function reloadTableRoleMenu(menu_no){
		getCurrentPageObj().find('#propertyTableRoleMenu').bootstrapTable('refresh',{url:dev_background+'SMenu/TableRoleMenu.asp?menu_no='+menu_no+"&call="+calls2+"&SID="+SID});
	}
	/**
	 * 菜单关联角色
	 * */
	function initTableRoleMenu(menu_no) {
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset //页码
			};
			return temp;
		};
		getCurrentPageObj().find('#propertyTableRoleMenu').bootstrapTable('destroy');
		getCurrentPageObj().find('#propertyTableRoleMenu').bootstrapTable({
			url : dev_background+'SMenu/TableRoleMenu.asp?menu_no='+menu_no+"&call="+calls2+"&SID="+SID, //请求后台的URL（*）
			method : 'get', //请求方式（*）   
	  	    striped : false, //是否显示行间隔色
		    cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		    sortable : true, //是否启用排序
		    sortOrder : "asc", //排序方式
			queryParams : queryParams,//传递参数（*）
			sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
			pagination : true, //是否显示分页（*）
			pageList : [5,10,15],//每页的记录行数（*）
			pageNumber : 1, //初始化加载第一页，默认第一页
			pageSize : 10,//可供选择的每页的行数（*）
			clickToSelect : true, //是否启用点击选中行
			uniqueId : "ROLE_NO", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			detailView : false, //是否显示父子表
			singleSelect: true,//复选框单选
			jsonpCallback:calls2,
			onLoadSuccess:function(data){
				gaveInfo();	
			},
			columns : [  {
				field : 'Number',
				title : '序号',
				align : "center",
				width : "7%",
				formatter: function (value, row, index) {
					return index+1;
				}
			}, {
				field : 'ROLE_NO',
				title : '角色编号',
				align : "center"
			}, {
				field : 'ROLE_NAME',
				title : '角色名称',
				align : "center"
			}]
		});
	}
	
	/**
	 * 设置菜单树的tid
	 * @param node
	 */
	function setMenuNodeTId(node) {
		var nid = node.id;
		initMenuTree["data"][nid]=node;
		if (node==undefined||node.children == undefined) {
			return;
		}
		for (var i = 0; i < node.children.length; i++) {
			setMenuNodeTId(node.children[i]);
		}
	}
	
	function initMenuTree() {
		$("#addButton").hide();
		$("#addProperty").hide();
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
				onAsyncSuccess: function(){
					var treeObj = $.fn.zTree.getZTreeObj("treeMenuManager");
					expandNodeLevel1(treeObj,"treeMenuManager");
					var menus=treeObj.getNodes();
					if(menus!=undefined){
						initMenuTree["data"]={};
						for(var i=0;i<menus.length;i++){
							setMenuNodeTId(menus[i]);
						}
					}
				},
				onClick : function(event, treeId, treeNode) {
					$("#addButton").show();
					$("#addProperty").show();
					reloadButtons(treeNode.id);
					reloadProperty(treeNode.id);
					reloadTableRoleMenu(treeNode.id);
					baseAjax(
							"SMenu/findOneMenu.asp",
							{
								menu_no : treeNode.id
							},
							function(data) {
								clearVlidateTag();
								var supNode=initMenuTree["data"][data["supmenu_no"]];
								if(supNode!=undefined){
									$("input[name='M.supmenu_name']").val(supNode.name);
									$("input[name='M.supmenu_no']").val(supNode.id);
								}else{
									$("input[name='M.supmenu_name']").val("");
									$("input[name='M.supmenu_no']").val("");
								}
								for ( var k in data) {
									$("input[name='M." + k + "']").val(data[k]);
								}
								data['menu_no'] != undefined ? $("input[name='M.old_menu_no']").val(data['menu_no']) : "";
								if(data['menu_type'] != undefined ){
									setSelected($("#menu_type"),data['menu_type']);
								}
								data['memo'] != undefined ? $("textarea[name='M.memo']").val(data['memo']) : "";
								//vlidate($("#menu_form"));
							});
				}
			}
		};
		$.fn.zTree.init($("#treeMenuManager"), setting);
	}
	function initMenuType(){
		//初始化数据
		//initSelect($("#menu_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"3"});
		autoInitSelect($("#menu_form"));
	}
	initMenuTree();
	initMenuButtonEvent();
	initMenuType();
	initVlidate(getCurrentPageObj().find("#menu_form"));
//	$("a[href='#menu_info']").tab("show");
	initButtonTables("aaaaaa");
	initPropertyTables1("aaaaaa");
	initTableRoleMenu("aaaaaa");

	
	