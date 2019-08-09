/**
 * 提供页面切换刷新页面的函数 供父页面的main.js 193行使用。
 * @returns
 */
function refreshTable(){
	$("#query").click();
}
$(function(){
	initBootstrapTable();

	//初始化页面按钮事件
	$("#query").click(function(event){
		initBootstrapTable();
	});
	
	//重置
	$("#reset").click(function(event){
		document.getElementById("query_form").reset();
	});
	
	//新增工单
	$("#add").click(function(event){
		//document.getElementById("query_form").reset();
		var fun = function(){
			$("#query").click();
		}
		parent.openTab("workOrderAppInfo_add","monitor/workOrderInfo_add2.html","新建执行工单",parent.$("iframe:visible"), fun);
	});
	
	//停用工单
	$("#stop").click(function(event){
		var items = $("#workOrderInfo_table").bootstrapTable("getSelections");
		if(items.length==1){
			baseAjaxJsonp(contextpath + "workOrderInfo/info/" + items[0]["id"], {workOrderStatus: items[0]["workOrderStatus"]}, function(){
				if(data.success==true){
					alert("更新工单状态成功");
				} else {
					alert("更新工单状态出错");
				}
				$("#query").click();
			}, "json");
		} else {
			alert("请选择一条记录");
		}
	});
	
	//查看工单
	$("#detail").click(function(event){
		//TODO
		var items = $("#workOrderInfo_table").bootstrapTable("getSelections");
		if(items.length==1){
			parent.openTab("workOrderAppInfo_query","monitor/workOrderAppInfo_query.html?id=" +items[0]["id"],"子应用执行列表");
		} else {
			alert("请选择一条记录");
		}
	});
	
	//暂停工单
	$("#pause").click(function(event){
		//TODO
	});
	
	//初始化列表
	function initBootstrapTable() {
		var queryParams = function(params) {
			var tempParams = {
				limit : params.limit, // 页面大小
				offset : params.offset/params.limit + 1	// 页码
			};
			var $form = $("#query_form");
			var $inputs = $form.find("input");
			var $selects = $form.find("select");
			for(var i=0; i<$inputs.length; i++){
				if($inputs[i].value!=""){
                    tempParams[$($inputs[i]).attr("name")] = $.trim($inputs[i].value);
				}
			}
			for(var i=0; i<$selects.length; i++){
				if($selects[i].value!=" "){
                    tempParams[$($selects[i]).attr("name")] = $.trim($selects[i].value);
				}
			}
			return tempParams;
		};
		$("#workOrderInfo_table").bootstrapTable("destroy").bootstrapTable({
			url : contextpath + "workOrderInfo/query",
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
			uniqueId : "id", // 每一行的唯一标识，一般为主键列
			cardView : false, // 是否显示详细视图
			detailView : false, // 是否显示父子表
			singleSelect : true,// 复选框单选
			onLoadSuccess:function(data){
				autoRun();
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
				field : 'code',
				title : '工单号',
				align : "center",
				width : "13%"
			},{
				field : 'reqSubCode',
				title : '需求点编号',
				align : "center",
				width : "19%"
			}, {
				field : "reqSubName",
				title : "需求点名称",
				align : "center",
				width : "13%"
			}, {
				field : "workorderType",
				title : "流程类别",
				align : "center",
				width : "10%"
			}, {
				field : "execStartTime",
				title : "执行开始时间",
				align : "center",
				width : "10%"
			}, {
				field : "execEndTime",
				title : "执行结束时间",
				align : "center",
				width : "10%"
			},{
				field : "workOrderStatus",
				title : "流程执行状态",
				align : "center",
				width : "10%"
			/*}, {
				field : "-",
				title : "操作",
				align : "center",
				formatter : function(value, row, index){
                    return "<input type='button'  value='查看' onclick=openworkOrderAppInfo('"+row.id+"')> " +
						"<input type='button'  value='暂停'/>"
				},
				width : "10%"*/
			}]
		});
	}
	
	//是否自动执行
	function autoRun(){
		var autoRun = $.getUrlParam("autoRun");
		if(autoRun=="true"){
			var items = $("#workOrderInfo_table").bootstrapTable("getData");
			//var items = $("#workOrderInfo_table").bootstrapTable("getSelections");
			if(items.length==1){
				parent.openTab("workOrderAppInfo_query","monitor/workOrderAppInfo_query.html?id=" +items[0]["id"],"子应用执行列表");
			} else {
				alert("请选择一条记录");
			}
		}
	}
	
});
