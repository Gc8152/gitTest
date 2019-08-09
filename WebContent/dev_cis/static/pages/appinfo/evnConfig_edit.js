$(function(){
    //下拉菜单select2
    $("select").select2();
    var type= $.getUrlParam("pageType");
    initSelectData();
    //initSelectData2("03","01","apServerInfoName", "apServerInfoId");
    //initSelectData2("03","02","dbServerInfoName", "dbServerInfoId");
    //initSelectData3();
    // 查看详情
    initVlidate($("#evnConfigForm"));
    if(type=="detail"){
        $('#evnConfigForm input').attr("readonly", "readonly");
        $("#save").hide();
    }
    if(type=="detail" || type=="update"){
        var id= $.getUrlParam("id");
        initEvnConfig(id, type);
    }
    initApTable($.getUrlParam("id"));
    initDbTable($.getUrlParam("id"));
    $("#save").click(function () {
    	var result=vlidate($("#evnConfigForm"));
    	var data = $("#evnConfigForm").serialize();
    	var apItems = $("#evnConfigApTable").bootstrapTable("getData");
    	var dbItems = $("#evnConfigDbTable").bootstrapTable("getData");
    	var aps = getItemStrings(apItems);
    	var dbs = getItemStrings(dbItems);
    	data += "&aps=" + aps + "&dbs=" + dbs;
    	if(result){
    		if(apItems.length<=0||dbItems.length<=0){
    	  		alert("请配置完整的环境")
    	    	}else{
    		/*$.ajax({
                type : "post",
                url : contextpath +"evnConfig/save",
                async :  true,
                data : data,
                dataType : "jsonp",
                success : function(data) {
                    if(data.success){
		               	 alert("操作成功!", function(){
							 $("#close").click();
						 });
                    }else{
                        alert(data.message);
                    }
                },
                error : function(msg) {
                }
            });*/
    	    		baseAjaxJsonp(contextpath+ "evnConfig/save",data, function(data){
    	    			if(data.success){
   		               	 alert("操作成功!", function(){
   							 $("#close").click();
   						 });
                       }else{
                           alert(data.message);
                       }
    	    		});
    	   }
    	}else {
    		alert("所保存内容不全或不符合条件");
    	}
    	
    });
    
    function getItemStrings(items){
    	var ids = "";
    	if(items.length>0){
    		for(var i in items){
    			var item = items[i];
    			ids += item.id + ",";  
    		}
    		ids = ids.substring(0, ids.length-1);
    	}
    	return ids;
    }
    
    //查看端口占用情况
    $("#queryPort").click(function(){
    	if(!($("#apServerInfoName").val())==""&&!($("#apPort").val())==""){
    		 var apip=$("#apServerInfoName").val();
    		 var port=$("#apPort").val();
    		 baseAjaxJsonp(contextpath+ "evnConfig/queryPort", {apip:apip,port:port}, function(data){
    			 if(data.result){
    	        	 alert("该端口可以使用");
    	         }else{
    	             alert("端口被占用");
    	         }
    		 });
    	}else{
    		alert("请填写完整AP服务器和端口");
    	}
    });
    $("#close").click(function () {
        parent.closeCurrentTab(parent);
    });
    
    /************ ap服务器选择 ***************/
    $("#ap_server_add").click(function(){
    	$("#apServerSelect_modal").modal("show");
    	var queryParams = function(params) {
			var serverInfo = {
				limit : params.limit, // 页面大小
				offset : params.offset/params.limit +1	// 页码
			};
			serverInfo["serverSystem"]=$("#systemId").val()
			serverInfo["serverUseType"] = "03";
			serverInfo["serverType"] = "01";
			serverInfo["serverStatus"] = "00";
			return serverInfo;
		};
		$("#evnConfigApSelect").bootstrapTable("destroy").bootstrapTable({
			url : contextpath + "server_info/list/03",
			method : 'post', // 请求方式（*）
			contentType: "application/x-www-form-urlencoded",
			striped : false, // 是否显示行间隔色
			cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : true, // 是否启用排序
			sortOrder : "asc", // 排序方式
			dataType:"jsonp",
			queryParams : queryParams,// 传递参数（*）
			sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
			pagination : true, // 是否显示分页（*）
			pageList : [ 5, 10, 15 ], // 可供选择的每页的行数（*）
			pageNumber : 1, // 初始化加载第一页，默认第一页
			pageSize : 10, // 每页的记录行数（*）
			clickToSelect : true, // 是否启用点击选中行
			// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
			uniqueId : "id", // 每一行的唯一标识，一般为主键列
			cardView : false, // 是否显示详细视图
			detailView : false, // 是否显示父子表
			singleSelect : false,// 复选框单选
			onLoadSuccess:function(data){
			},
			columns : [ {
				checkbox : true,
				align : 'center',
				width : "5%",
				valign : 'middle'
			},{
				field : 'id',
				title : '序号',
				align : "center",
				width : "5%",
				formatter : function(value, row, index){
					return index+1;
				}
			},{
				field : 'serverIp',
				title : '服务器IP地址',
				align : "center",
				width : "19%"
			}, {
				field : "serverOs",
				title : "操作系统",
				align : "center",
				formatter: function(value, row, index){
					return value=="01"?"unix":(value=="02"?"linux":"windows");
				},
				width : "13%"
			}, {
				field : "serverCreateUser",
				title : "创建人",
				align : "center",
				formatter : function(value, row, index){
					if(row.createUser!=null){
						return row.createUser.userName;
					} else {
						return null;
					}
				},
				width : "10%"
			}]
		});
    });
    $("#ap_close").click(function(){
    	$("#apServerSelect_modal").modal("hide");
    })
    $("#ap_select").click(function(){
    	var items = $("#evnConfigApSelect").bootstrapTable("getSelections");
    	if(items.length>0){
    		for(var i in items){
    			var exitItem = $("#evnConfigApTable").bootstrapTable("getRowByUniqueId", items[i]["id"]);
    			if(exitItem == null){
    				$("#evnConfigApTable").bootstrapTable("append", items[i]);
    			}
    		}
    		$("#evnConfigApTable").bootstrapTable("uncheckAll");
    	}
    	$("#apServerSelect_modal").modal("hide");
    });
    $("#ap_server_delete").click(function(){
    	var items = $("#evnConfigApTable").bootstrapTable("getSelections");
    	if(items.length>0){
    		for(var i in items){
				$("#evnConfigApTable").bootstrapTable("removeByUniqueId", items[i]["id"]);
    		}
    	} else {
    		alert("请先选择数据");
    	}
    });
    /************ ap服务器选择 ***************/
    
	/************ db服务器选择 ***************/
    $("#db_server_add").click(function(){
    	$("#dbServerSelect_modal").modal("show");
    	var queryParams = function(params) {
			var serverInfo = {
				limit : params.limit, // 页面大小
				offset : params.offset/params.limit +1	// 页码
			};
			serverInfo["serverSystem"]=$("#systemId").val()
			serverInfo["serverUseType"] = "03";
			serverInfo["serverType"] = "02";
			serverInfo["serverStatus"] = "00";
			return serverInfo;
		};
		$("#evnConfigDbSelect").bootstrapTable("destroy").bootstrapTable({
			url : contextpath + "server_info/list/03",
			method : 'post', // 请求方式（*）
			contentType: "application/x-www-form-urlencoded",
			striped : false, // 是否显示行间隔色
			cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : true, // 是否启用排序
			sortOrder : "asc", // 排序方式
			dataType:"jsonp",
			queryParams : queryParams,// 传递参数（*）
			sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
			pagination : true, // 是否显示分页（*）
			pageList : [ 5, 10, 15 ], // 可供选择的每页的行数（*）
			pageNumber : 1, // 初始化加载第一页，默认第一页
			pageSize : 10, // 每页的记录行数（*）
			clickToSelect : true, // 是否启用点击选中行
			// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
			uniqueId : "REQ_ID", // 每一行的唯一标识，一般为主键列
			cardView : false, // 是否显示详细视图
			detailView : false, // 是否显示父子表
			singleSelect : false,// 复选框单选
			onLoadSuccess:function(data){
			},
			columns : [ {
				checkbox : true,
				align : 'center',
				width : "5%",
				valign : 'middle'
			},{
				field : 'id',
				title : '序号',
				align : "center",
				width : "5%",
				formatter : function(value, row, index){
					return index+1;
				}
			},{
				field : 'serverIp',
				title : '服务器IP地址',
				align : "center",
				width : "19%"
			}, {
				field : "serverOs",
				title : "操作系统",
				align : "center",
				formatter: function(value, row, index){
					return value=="01"?"unix":(value=="02"?"linux":"windows");
				},
				width : "13%"
			}, {
				field : "serverCreateUser",
				title : "创建人",
				align : "center",
				formatter : function(value, row, index){
					if(row.createUser!=null){
						return row.createUser.userName;
					} else {
						return null;
					}
				},
				width : "10%"
			}]
		});
    });
    $("#db_close").click(function(){
    	$("#dbServerSelect_modal").modal("hide");
    })
    $("#db_select").click(function(){
    	var items = $("#evnConfigDbSelect").bootstrapTable("getSelections");
    	if(items.length>0){
    		for(var i in items){
    			var exitItem = $("#evnConfigDbTable").bootstrapTable("getRowByUniqueId", items[i]["id"]);
    			if(exitItem == null){
    				$("#evnConfigDbTable").bootstrapTable("append", items[i]);
    			}
    		}
    		$("#evnConfigDbTable").bootstrapTable("uncheckAll");
    	}
    	$("#dbServerSelect_modal").modal("hide");
    });
    $("#db_server_delete").click(function(){
    	var items = $("#evnConfigDbTable").bootstrapTable("getSelections");
    	if(items.length>0){
    		for(var i in items){
				$("#evnConfigDbTable").bootstrapTable("removeByUniqueId", items[i]["id"]);
    		}
    	} else {
    		alert("请先选择数据");
    	}
    });
    /************ db服务器选择 ***************/
    //初始化ap表格
    function initApTable(id){
    	$("#evnConfigApTable").bootstrapTable("destroy").bootstrapTable({
    		url : contextpath + "evnConfig/getServerInfoByEvnConfigId?evnConfigId=" + id + "&type=01",
    		method : 'post', // 请求方式（*）
    		contentType: "application/x-www-form-urlencoded",
    		striped : false, // 是否显示行间隔色
    		cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
    		sortable : true, // 是否启用排序
    		sortOrder : "asc", // 排序方式
    		dataType:"jsonp",
    		sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
    		pagination : false, // 是否显示分页（*）
    		clickToSelect : true, // 是否启用点击选中行
    		uniqueId : "id", // 每一行的唯一标识，一般为主键列
    		cardView : false, // 是否显示详细视图
    		detailView : false, // 是否显示父子表
    		singleSelect : false,// 复选框单选
    		onLoadSuccess:function(data){
    		},
    		columns : [ {
    			checkbox : true,
    			align : 'center',
    			valign : 'middle'
    		},{
    			field : 'id',
    			title : '序号',
    			align : "center",
    			formatter : function(value, row, index){
    				return index+1;
    			}
    		},{
    			field : 'serverType',
    			title : '服务器类型',
    			align : "center",
    			formatter: function(value, row, index){
    				return value=="01"?"ap服务器":"db服务器";
    			},
    			width : "13%"
    		},{
    			field : 'serverIp',
    			title : '服务器IP地址',
    			align : "center",
    			width : "19%"
    		}, {
    			field : "serverOs",
    			title : "操作系统",
    			align : "center",
    			formatter: function(value, row, index){
    				return value=="01"?"unix":(value=="02"?"linux":"windows");
    			},
    			width : "13%"
    		}, {
    			field : "serverVersion",
    			title : "版本编号",
    			align : "center",
    			formatter: function(value, row, index){
    				return value=="01"?"verison01":"version02";
    			},
    			width : "10%"
    		}, {
    			field : "serverUsername",
    			title : "用户名",
    			align : "center",
    			width : "10%"
    		}]
    	});
    }
    
    //初始化db表格
    function initDbTable(id){
    	$("#evnConfigDbTable").bootstrapTable("destroy").bootstrapTable({
    		url : contextpath + "evnConfig/getServerInfoByEvnConfigId?evnConfigId=" + id + "&type=02",
    		method : 'post', // 请求方式（*）
    		contentType: "application/x-www-form-urlencoded",
    		striped : false, // 是否显示行间隔色
    		cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
    		sortable : true, // 是否启用排序
    		sortOrder : "asc", // 排序方式
    		dataType:"jsonp",
    		sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
    		pagination : false, // 是否显示分页（*）
    		clickToSelect : true, // 是否启用点击选中行
    		uniqueId : "id", // 每一行的唯一标识，一般为主键列
    		cardView : false, // 是否显示详细视图
    		detailView : false, // 是否显示父子表
    		singleSelect : false,// 复选框单选
    		onLoadSuccess:function(data){
    		},
    		columns : [ {
    			checkbox : true,
    			//rowspan : 2,
    			align : 'center',
    			valign : 'middle'
    		},{
    			field : 'id',
    			title : '序号',
    			align : "center",
    			formatter : function(value, row, index){
    				return index+1;
    			}
    		},{
    			field : 'serverType',
    			title : '服务器类型',
    			align : "center",
    			formatter: function(value, row, index){
    				return value=="01"?"ap服务器":"db服务器";
    			},
    			width : "13%"
    		},{
    			field : 'serverIp',
    			title : '服务器IP地址',
    			align : "center",
    			width : "19%"
    		}, {
    			field : "serverOs",
    			title : "操作系统",
    			align : "center",
    			formatter: function(value, row, index){
    				return value=="01"?"unix":(value=="02"?"linux":"windows");
    			},
    			width : "13%"
    		}, {
    			field : "serverVersion",
    			title : "版本编号",
    			align : "center",
    			formatter: function(value, row, index){
    				return value=="01"?"verison01":"version02";
    			},
    			width : "10%"
    		}, {
    			field : "serverUsername",
    			title : "用户名",
    			align : "center",
    			width : "10%"
    		}]
    	});
    }
});
var select2Config = function(rows, tempSelectFun, tempResultFun){
    var obj = {
        data:rows,
        templateSelection: tempSelectFun,
        templateResult : tempResultFun
    }
    return obj;
}
//当子应用名称改变时清空ap与db服务器配置表
$("#appInfo").bind('change',function(){
	  	 $("#evnConfigDbTable").bootstrapTable('removeAll');
	  	 $("#evnConfigApTable").bootstrapTable('removeAll');
});
function initSelectData(){
	baseAjaxJsonp(contextpath + 'cis_flow/queryAllAppInfo', null, function(data){
		var tempResultFun = function(item){
            return item.text;
        };
        var codeRows = $.map(data.result, function (obj) {
            obj.text = obj.appName;
            return obj;
        });
        var codeBaseTempSelectFun = function(item){
            if(item.id!="" ){
                for(var key in item){
                    $("input[name='appInfo." + key + "']").val(item[key]);
                }
                $("input[name=appId]").val(item.id);
                var result=item.systemInfo;
            	for(var p in result){
            		$("#systemName").val(result.systemName);
            		$("#systemId").val(result.systemId);
            	}
            }
            return item.text;
        };
        $("#appInfo").select2(select2Config(codeRows, codeBaseTempSelectFun, tempResultFun));
        $("#appInfo").trigger("change"); 
	});
}

function initEvnConfig(id, type){
	baseAjaxJsonp(contextpath+ "evnConfig/findOne", {id:id}, function(data){
		if(data.success){
            $("#evnConfigForm").setform(data.result);
            $("#appInfo").val(data.result.appId);
            $("#apServerInfoName").val(data.result.apServerInfoId);
            $("#dbServerInfoName").val(data.result.dbServerInfoId);
            $("select").trigger("change");
            if(type=="detail"){
            	$("select").select2({"disabled":true});
            }
        }else{
            alert(data.message);
        }
	});
}
