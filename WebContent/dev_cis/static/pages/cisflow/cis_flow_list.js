/**
 * 提供页面切换刷新页面的函数 供父页面的main.js 193行使用。
 * @returns
 */
function refreshTable(){
	$("#query").click();
}
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
	
	//新增流程
	$("#add").click(function(event){
		var fun = function(){
			$("#query").click();
		};
		parent.openTab("cisFlow_add","cisFlow/cis_flow.html","新增持续集成流程", parent.$("iframe:visible"), fun);
	});
	//修改流程
	$("#update").click(function(event){
		var items = $("#cis_flow_table").bootstrapTable("getSelections");
		if(items.length==1){
			var fun = function(){
				$("#query").click();
			};
			parent.openTab("cisFlow_update","cisFlow/cis_flow.html?id="+items[0]["id"],"修改持续集成流程", parent.$("iframe:visible"), fun);
		} else {
			alert("请选择一条记录");
		}
	});
	
	//停用流程
	$("#stop").click(function(event){
		updateCisFlowStatus("01", "确定要启用该流程吗？");
	});
	//启用流程
	$("#start").click(function(event){
		updateCisFlowStatus("00", "确定要停用该流程吗？");
	});
	
	//查看详情
	$("#detail").click(function(event){
		var items = $("#cis_flow_table").bootstrapTable("getSelections");
		if(items.length==1){
			parent.openTab("cisFlow_detail","cisFlow/cis_flow.html?detail=true&id="+items[0]["id"],"查看持续集成流程");
		} else {
			alert("请选择一条记录");
		}
	});
	
	/*****************/
	function updateCisFlowStatus(flowStatus, msg){
		var items = $("#cis_flow_table").bootstrapTable("getSelections");
		if(items.length==1){
			
			baseAjaxJsonp(contextpath + "cis_flow/info/" + items[0]["id"], {flowStatus:flowStatus}, function(data){
				if(data.success==true){
					alert("更新流程状态成功");
				} else {
					alert("更新流程状态出错");
				}
				$("#query").click();
			});
			/*$.post(contextpath + "cis_flow/info/" + items[0]["id"] , {flowStatus:flowStatus}, function(data){
				if(data.success==true){
					alert("更新流程状态成功");
				} else {
					alert("更新流程状态出错");
				}
				$("#query").click();
			}, "json");*/
		} else {
			alert("请选择一条记录");
		}

	}
	
	//初始化列表
	function initBootstrapTable() {
		var queryParams = function(params) {
			var serverInfo = {
				limit : params.limit, // 页面大小
				offset : params.offset/params.limit +1	// 页码
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
		$("#cis_flow_table").bootstrapTable("destroy").bootstrapTable({
			url : contextpath + "cis_flow/list",
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
			pageSize : 5, // 每页的记录行数（*）
			clickToSelect : true, // 是否启用点击选中行
			// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
			uniqueId : "REQ_ID", // 每一行的唯一标识，一般为主键列
			cardView : false, // 是否显示详细视图
			detailView : false, // 是否显示父子表
			singleSelect : true,// 复选框单选
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
			}, {
                field: "appInfo",
                title: "所属应用",
                align: "center",
                formatter : function(value, row, index){
					if(value!=null){
						if(value["systemInfo"]!=null){
							return value.systemInfo.systemName;
						}
					}
				}
            }, {
                field: "appInfo",
                title: "应用简称",
                align: "center",
                formatter : function(value, row, index){
                	if(value!=null){
    					if(value["systemInfo"]!=null){
    						return value.systemInfo.systemShort;
    					}
    				}
				}
			},{
				field : 'appId',
				title : '子应用名称',
				align : "center",
				width : "13%",
				formatter : function(value, row, index){
					if(value!=null){
						return row.appInfo.appName;
					}
				}
			},{
				field : 'flowName',
				title : '流程名称',
				align : "center",
				width : "19%"
			}, {
				field : "flowType",
				title : "流程类型",
				align : "center",
				width : "13%",
				formatter : function(value, row, index){
					return value=="01"?"sit":"uat";
				}
			}, {
				field : "flowStatus",
				title : "流程状态",
				align : "center",
				width : "10%",
				formatter : function(value, row, index){
					return value=="00"?"启用":"停用";
				}
			}, {
				field : "updateTime",
				title : "最后修改时间",
				align : "center",
				width : "10%"
			/*}, {
				field : "appInfo",
				title : "应用名称",
				align : "center",
				width : "10%",
				formatter : function(value, row, index){
					if(value!=null){
						return value.systemId;
					}
				}*/
			}]
		});
	}
});
