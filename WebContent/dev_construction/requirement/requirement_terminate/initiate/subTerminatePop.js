function subPop(obj,callparams){
	$("#subPop").remove();
	//加载pop框内容
	obj.load("dev_construction/requirement/requirement_terminate/initiate/subTerminatePop.html",{},function(){
		var modObj = getCurrentPageObj().find("#subPop");
		modObj.modal("show");
		var subCall = getMillisecond();//表回调方法
		
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		var sUrl = dev_construction+"req_terminate/querySubList.asp?SID=" + 
				SID + "&call=" + subCall + "&REQ_ID=" + callparams.REQ_ID;
		modObj.find("[tb='subTable']").bootstrapTable({
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
			uniqueId : "SUB_REQ_ID", // 每一行的唯一标识，一般为主键列
			cardView : false, // 是否显示详细视图
			detailView : false, // 是否显示父子表
			singleSelect : true,// 复选框单选
			jsonpCallback:subCall,
			onDblClickRow:function(row){
				var $criVal = getCurrentPageObj().find("#TER_SUBREQID_STR").val();
				if($criVal !='' && $criVal!= undefined){
					 var arr = new Array();
					 arr = $criVal.split(",");
					 if($.inArray(row.SUB_REQ_ID+"",arr)!= -1){
						 alert("该需求点正在发起终止申请");
						 modObj.modal("hide");
						 return;
					 }
				}
				var state = row.REQ_TASK_STATE;
				if(state == '12'||state == '13'||state == '14'||state == '15'){
						alert("该需求点不能终止");
						modObj.modal("hide");
				}else{
						callparams.SUB_REQ_ID.val(row.SUB_REQ_ID);
						callparams.SUB_REQ_CODE.val(row.SUB_REQ_CODE);
						callparams.SUB_REQ_NAME.val(row.SUB_REQ_NAME);
						callparams.REQ_TASK_STATE_NAME.val(row.REQ_TASK_STATE_NAME);
						callparams.REQ_TASK_STATE.val(row.REQ_TASK_STATE);
						callparams.PROJECT_MAN_ID.val(row.PROJECT_MAN_ID);
						modObj.modal("hide");
				}
			},onLoadSuccess : function(data){
				var $cri = getCurrentPageObj().find("#TER_SUBREQID_STR");
				if(data.subreqstr !='' && data.subreqstr!= undefined){
					$cri.val(data.subreqstr);
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
				field : 'SUB_REQ_CODE',
				title : '需求点编号',
				align : "center"
			}, {
				field : "SUB_REQ_NAME",
				title : "需求点名称",
				align : "center"
			}, {
				field : "SUB_REQ_STATE_NAME",
				title : "需求点状态",
				align : "center"
			}, {
				field : "REQ_TASK_STATE_NAME",
				title : "主线任务阶段",
				align : "center"
			}]
		});
		
		//重置按钮
		modObj.find("#reset_subti").click(function(){
			modObj.find("input").not("[type='button']").val("");
		});
		//查询按钮
		modObj.find("#query_subti").click(function(){
			var param =modObj.find("#subPopForm").serialize();
			var sUrl = dev_construction+"req_terminate/querySubList.asp?SID=" + 
					SID + "&call=" + subCall + "&" + param + "&REQ_ID=" + callparams.REQ_ID;
			modObj.find("[tb='subTable']").bootstrapTable('refresh',{
				url:sUrl});
		});	
		enterEventRegister("popModelQueryLevel1", function(){getCurrentPageObj().find("#query_subti").click();});
	});
}

	
	







