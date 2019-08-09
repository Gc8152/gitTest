function requirementPop(obj,callparams){
	$("#requirementPop").remove();
	//加载pop框内容
	obj.load("dev_construction/requirement/requirement_change/initiate/requirementPop.html",{},function(){
		var modObj = getCurrentPageObj().find("#requirementPop");
		modObj.modal("show");
		var sCall = getMillisecond();//表回调方法
		
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		var sUrl = dev_construction+"requirement_change/queryReqInfoList.asp?SID=" + 
				SID + "&call=" + sCall;
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
			jsonpCallback:sCall,
			onDblClickRow:function(row){
				var $criVal = getCurrentPageObj().find("#CHANGE_REQ_ID").val();
				if($criVal !='' && $criVal!= undefined){
					 var arr = new Array();
					 arr = $criVal.split(",");
					 if($.inArray(row.REQ_ID+"",arr)!= -1){
						 alert("该需求正在发起变更或终止申请");
						 modObj.modal("hide");
						 return;
					 }
				}
						callparams.REQ_ID.val(row.REQ_ID);
						callparams.REQ_CODE.val(row.REQ_CODE);
						callparams.REQ_NAME.val(row.REQ_NAME);
						callparams.CHANGE_BUSINESSER.val(row.REQ_BUSINESSER);
						callparams.CHANGE_BUSINESS_PHONE.val(row.REQ_BUSINESS_PHONE);
						callparams.CHANGE_ANALYZE_ID.val(row.REQ_ACC_PRODUCTMAN);
						callparams.CHANGE_ANALYZE_NAME.val(row.REQ_ACC_PRODUCTMAN_NAME);
						callparams.REQ_PRODUCT_MANAGER.val(row.REQ_PRODUCT_MANAGER);
						callparams.SYSTEM_NAME.val(row.SYSTEM_NAME);
						reqSubsTable(callparams.REQ_SUBS_TABLE,callparams.CALL,row.REQ_ID);//更新需求点列表
						modObj.modal("hide");
			},onLoadSuccess : function(data){
				var $cri = getCurrentPageObj().find("#CHANGE_REQ_ID");
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
		modObj.find("#reset_req").click(function(){
			modObj.find("input").not("[type='button']").val("");
		});
		//查询按钮
		modObj.find("#query_req").click(function(){
			var param =modObj.find("#requirementPopForm").serialize();
			var sUrl = dev_construction+"requirement_change/queryReqInfoList.asp?SID=" + 
					SID + "&call=" + sCall + "&"+param;
			modObj.find("[tb='reqTable']").bootstrapTable('refresh',{
				url:sUrl});
		});	
		enterEventRegister("popModelQueryLevel1", function(){getCurrentPageObj().find("#query_req").click();});
		
		function reqSubsTable(objTable,subcall,REQ_ID){
			objTable.bootstrapTable('refresh',{
						url:dev_construction+"requirement_change/queryReqSubs.asp?SID=" + SID + "&call=" + subcall +'&REQ_ID='+REQ_ID});
			
		}
		
		
		
		
		
		
		
		
		
		
		
		
	});
}

	
	







