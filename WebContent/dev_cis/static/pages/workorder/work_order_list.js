
$(function(){
	
	initBootstrapTable();
	
	//getServerInfo();
	
	//初始化页面按钮事件
	$("#query").click(function(event){
		initBootstrapTable();
	});
	
	//重置
	$("#reset").click(function(event){
		document.getElementById("query_form").reset();
	});
	
	//新增服务器
	$("#add").click(function(event){
		//location.href = "";
		parent.openTab("serverInfo_add","serverInfo/app_server.html","新增服务器");
	});
	//修改服务器
	$("#update").click(function(event){
		var items = $("#app_server_table").bootstrapTable("getSelections");
		if(items.length==1){
			//location.href = "app_server.html?id=" + items[0]["id"];
			parent.openTab("serverInfo_update","serverInfo/app_server.html?id="+items[0]["id"],"修改服务器");
		} else {
			alert("请选择一条记录");
		}
	});
	
	//停止服务器
	$("#stop").click(function(event){
		updateServerStatus("01", "确定要关闭该服务器？");
	});
	//启动服务器
	$("#start").click(function(event){
		updateServerStatus("00", "确定要开启该服务器？");
	});
	
	//查看详情
	$("#detail").click(function(event){
		var items = $("#app_server_table").bootstrapTable("getSelections");
		if(items.length==1){
			//location.href = "app_server_detail.html?id=" + items[0]["id"];
			parent.openTab("serverInfo_detail","serverInfo/app_server.html?detail=true&id="+items[0]["id"],"查看服务器");
		} else {
			alert("请选择一条记录");
		}
	});
	
	/*****************/
	function updateServerStatus(serverStatus, msg){
		var items = $("#app_server_table").bootstrapTable("getSelections");
		if(items.length==1){
			$.get(contextpath + "server_info/updateServerStatus/" + serverId + "/" + serverStatus , null, function(data){
				nconfirm(msg, function(){
					if(data.result==true){
						alert("更新服务器状态成功")
						$("#query").click();
					} else {
						alert("开启服务器出错");
					}
				});
			});
		} else {
			alert("请选择一条记录");
		}
	}
	
	//初始化列表
	function initBootstrapTable() {
		var queryParams = function(params) {
			var serverInfo = {
				limit : params.limit, // 页面大小
				offset : params.offset	// 页码
			};
			
			var $form = $("#query_form");
			var $inputs = $form.find("input");
			var $selects = $form.find("select");
			var $textareas = $form.find("textarea");
			for(var i=0; i<$inputs.length; i++){
				if($inputs[i].value!=""){
					serverInfo[$($inputs[i]).attr("name")] = $.trim($inputs[i].value);
				}
			}
			for(var i=0; i<$selects.length; i++){
				if($selects[i].value!=" "){
					serverInfo[$($selects[i]).attr("name")] = $.trim($selects[i].value);
				}
			}
			serverInfo["serverUseType"] = "03";
			
			return serverInfo;
		};
		$("#app_server_table").bootstrapTable("destroy").bootstrapTable({
			url : contextpath + "work_info/list",
			method : 'post', // 请求方式（*）
			contentType: "application/x-www-form-urlencoded",
			striped : false, // 是否显示行间隔色
			cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : true, // 是否启用排序
			sortOrder : "asc", // 排序方式
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
			singleSelect : true,// 复选框单选
			dataField : "content",
			totalField : "totalElements",
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
				width : "13%"
			}, {
				field : "serverVersion",
				title : "版本编号",
				align : "center",
				width : "10%"
			}, {
				field : "serverUsername",
				title : "用户名",
				align : "center",
				width : "10%"
			}, {
				field : "serverBelong",
				title : "归属部门",
				align : "center",
				width : "10%"
			},{
				field : "serverCreateTime",
				title : "创建时间",
				align : "center",
				width : "10%"
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
			}, {
				field : "serverStatus",
				title : "状态",
				align : "center",
				width : "10%"
			}]
		});
	}
});
