function reqPop(obj,callparams){
	$("#reqPop").remove();
	//加载pop框内容
	obj.load("dev_construction/requirement/requirement_terminate/initiate/reqTerminatePop.html",{},function(){
		var modObj = getCurrentPageObj().find("#reqPop");
		modObj.modal("show");
		var reqCall = getMillisecond();//表回调方法
		
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		var sUrl = dev_construction+"req_terminate/queryReqList.asp?SID=" + 
				SID + "&call=" + reqCall+"&TYPE=1";
		modObj.find("[tb='reqTable']").bootstrapTable({
			url :sUrl,
			method : 'get', // 请求方式（*）
			striped : false, // 是否显示行间隔色
			cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : true, // 是否启用排序
			sortOrder : "asc", // 排序方式
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
			jsonpCallback:reqCall,
			onDblClickRow:function(row){
				if(callparams.func_call){
					callparams.func_call(row);
				}
				if(callparams.REQ_ID&&callparams.REQ_ID.val()!=row.REQ_ID){
					callparams.SUB_REQ_ID.val("");
					callparams.SUB_REQ_CODE.val("");
					callparams.SUB_REQ_NAME.val("");
					callparams.REQ_TASK_STATE_NAME.val("");
					callparams.PROJECT_MAN_ID.val("");
				}
					callparams.REQ_ID.val(row.REQ_ID);
					callparams.REQ_CODE.val(row.REQ_CODE);
					callparams.REQ_NAME.val(row.REQ_NAME);
					callparams.REQ_PRODUCT_MANAGER.val(row.REQ_PRODUCT_MANAGER);
					modObj.modal("hide");
			},onLoadSuccess : function(data){
				var $cri = getCurrentPageObj().find("#CHANGE_REQID_STR");
				if(data.reqstr !='' && data.reqstr!= undefined){
					$cri.val(data.reqstr);
				}
				gaveInfo();
			},
			columns : [ {
				field : 'ORDER_ID',
				title : '序号',
				align : "center",
				width : "50px",
				formatter:function(value,row,index){
					return index + 1;
				}
			}, {
				field : 'REQ_CODE',
				title : '需求编号',
				align : "center"
			}, {
				field : "REQ_NAME",
				title : "需求名称",
				align : "center"
			}, {
				field : "REQ_STATE_NAME",
				title : "需求状态",
				align : "center"
			}, {
				field : "REQ_OPERATION_DATE",
				title : "要求投产日期",
				align : "center"
			}]
		});
		
		
		
		//重置按钮
		modObj.find("#reset_reqti").click(function(){
			modObj.find("input").not("[type='button']").val("");
		});
		//查询按钮
		modObj.find("#query_reqti").click(function(){
			var param = modObj.find("#reqPopForm").serialize();
			var sUrl = dev_construction+"req_terminate/queryReqList.asp?SID=" + 
					SID + "&call=" + reqCall + "&"+param+"&TYPE=1";
			modObj.find("[tb='reqTable']").bootstrapTable('refresh',{
				url:sUrl});
		});	
		enterEventRegister("popModelQueryLevel1", function(){getCurrentPageObj().find("#query_reqti").click();});
		
	});
}

	
	







