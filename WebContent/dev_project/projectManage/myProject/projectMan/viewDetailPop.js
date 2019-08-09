
function vdPop(obj,USER_ID,TYPE){
	$("#viewDetailPop").remove();
	//加载pop框内容
	obj.load("dev_project/projectManage/myProject/projectMan/viewDetailPop.html",{},function(){
		var modObj = getCurrentPageObj().find("#viewDetailPop");
		modObj.modal("show");
		var vdCall = getMillisecond();//表回调方法
		var aspUrl = "";
		var column = new Array();
		if(TYPE == '03'){
			modObj.find("#tabh5").html("需求任务清单");
			aspUrl = "projectman/queryReqTaskList.asp";
			column = [ {
				field : 'ORDER_ID',
				title : '序号',
				align : "center",
				width : "8%",
				formatter:function(value,row,index){
					return index + 1;
				}
			}, {
				field : 'REQ_TASK_CODE',
				title : '需求任务编号',
				align : "center",
				width : "24%"
			}, {
				field : "REQ_TASK_NAME",
				title : "需求任务名称",
				align : "center",
				width : "22%"
			}, {
				field : "SUB_REQ_NAME",
				title : "需求点名称",
				align : "center",
				width : "18%"
			}, {
				field : "REQ_TASK_STATE_NAME",
				title : "需求任务状态",
				align : "center",
				width : "16%"
			}, {
				field : "REQ_TASK_RELATION_NAME",
				title : "从属关系",
				align : "center",
				width : "12%"
			}];
		}
		if(TYPE == '04'){
			modObj.find("#tabh5").html("SIT测试任务清单");
			aspUrl = "projectman/querySITList.asp";
			column = [ {
				field : 'ORDER_ID',
				title : '序号',
				align : "center",
				width : "10%",
				formatter:function(value,row,index){
					return index + 1;
				}
			}, {
				field : 'SUB_REQ_CODE',
				title : '需求点编号',
				align : "center",
				width : "20%"
			}, {
				field : "SUB_REQ_NAME",
				title : "需求点名称",
				align : "center",
				width : "30%"
			}, {
				field : "TEST_COUNT_NAME",
				title : "测试轮次",
				align : "center",
				width : "20%"
			}, {
				field : "TEST_VERSION_ID",
				title : "测试版本号",
				align : "center",
				width : "20%"
			}];
		}
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		
	
		modObj.find("[tb='viewDetailTable']").bootstrapTable({
			url : dev_project+aspUrl+"?SID=" + SID + "&call=" + vdCall + "&USERID=" + USER_ID,
			method : 'get', // 请求方式（*）
			striped : false, // 是否显示行间隔色
			cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : true, // 是否启用排序
			sortOrder : "asc", // 排序方式
			queryParams : queryParams,// 传递参数（*）
			sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
			pagination : false, // 是否显示分页（*）
			pageList : [ 5, 10, 15 ], // 可供选择的每页的行数（*）
			pageNumber : 1, // 初始化加载第一页，默认第一页
			pageSize : 5, // 每页的记录行数（*）
			clickToSelect : true, // 是否启用点击选中行
			// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
			//uniqueId : "REQ_ID", // 每一行的唯一标识，一般为主键列
			cardView : false, // 是否显示详细视图
			detailView : false, // 是否显示父子表
			singleSelect : true,// 复选框单选
			jsonpCallback:vdCall,
			onDblClickRow:function(row){
			},onLoadSuccess : function(data){
				gaveInfo();
			},
			columns : column
		});
		
	});
}

	
	







