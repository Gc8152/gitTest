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
	
	//初始化列表
	function initBootstrapTable() {
        var id= $.getUrlParam("id");
        var queryParams = function(params) {
            var tempParams = {
                limit : params.limit, // 页面大小
                offset : params.offset/params.limit +1	// 页码
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
            tempParams.workOrderId=id;
            return tempParams;
        };
		$("#workOrderAppInfo_table").bootstrapTable("destroy").bootstrapTable({
			url : contextpath + "workOrderAppInfo/query",
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
				if(data.total>0){
					var hasExecuting = false;
					for(var i=0; i<data.total; i++){
						var item = data.rows[i];
						if("执行中"==item.flowExecStatus){
							hasExecuting = true;
							break;
						}
						hasExecuting = false;
					}
					if(hasExecuting){
						window.parent.addTimerTask("workOrderAppInfo_query",autoRefresh);
					} 
				} /*else {
					window.parent.removeTimerTask("workOrderAppInfo_query");
				}*/
			},
			columns : [ {
				checkbox : true,
				align : 'center',
				valign : 'middle'
			},{
				field : '-',
				title : '序号',
				align : "center",
				formatter : function(value, row, index){
					return index+1;
				},
				width:"5%"
			},{
				field : 'code',
				title : '工单号',
				align : "center",
				width : "5%"
			},{
				field : 'systemName',
				title : '应用名称',
				align : "center",
				width : "10%"
			}, {
				field : "appName",
				title : "子应用名称",
				align : "center",
				width : "10%"
			}, {
				field : "flowName",
				title : "流程名称",
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
				field : "currentStep",
				title : "当前环节",
				align : "center",
				width : "10%"
			},{
                field : "cerrentStepExecStatus",
                title : "当前环节执行情况",
                align : "center",
                width : "10%",
                formatter : function(value, row, index){
                	var result = "";
                	if(value=='02'){
                		result = "执行成功";
                	} else if(value=='03'){
                		result = "执行出错";
                	} else if(row.currentStep==null){
                		result = "-";
                	} else {
                		result = "执行中";
                	}
                	return result;
                }
            },{
                field : "flowExecStatus",
                title : "流程执行状态",
                align : "center",
                width : "10%"
            }, {
				field : "-",
				title : "操作",
				align : "center",
				formatter : function(value, row, index){
                    return "<input type='button'  value='查看' onclick=openFlowExecMonitor('"+row.id+"')> " +
                        "<input type='button'  value='构建' onclick=startExec('"+ row.id +"')> " +
                        //"<input type='button'  value='继续执行'> " +
                        "<input type='button'  value='中止'>"
				},
				width : "35%"
			}]
		});
	}
});

function openFlowExecMonitor(id){
    parent.openTab("flowExecMonitor_detail","monitor/flowExecMonitor_detail.html?id="+id,"流程执行监控");
}

function startExec(id){
	
	baseAjaxJsonp(contextpath + "workOrderAppInfo/doAction?id=" + id, null, function(data){
		if(data.success){
        } else {
            alert(data.message);
        }
	});
	
	
	/*var funStr = (function builCall(result){
		if(result.code==200){
			alert(result.message);
		}
	}).toString();
	window.parent.globalAjaxExecAndRemind(, null, "执行完成", funStr, "buildCall(result)");
	$("#query").click();*/
	//window.parent.addTimerTask("workOrderAppInfo_query",sayHi);
}

var autoRefresh = function(){
	$("#query").click();
};

