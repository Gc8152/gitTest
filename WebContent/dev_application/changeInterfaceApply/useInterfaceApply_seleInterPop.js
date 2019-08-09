function useInterfaceApply_seleInterPop(obj,callparams){
	$("#useInterfaceApply_seleInterPop").remove();
	//加载pop框内容
	obj.load("dev_application/useInterfaceApply/useInterfaceApply_seleInterPop.html",{},function(){
		var modObj = getCurrentPageObj().find("#useInterfaceApply_seleInterPop");
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
		var iUrl = dev_application+"useApplyManage/queryInterListBySerSystemId.asp?SID=" + 
				SID + "&call=" + sCall+ "&ser_system_id=" + callparams.ser_system_id;
		modObj.find("[tb='table_seleInter']").bootstrapTable({
			url :iUrl,
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
			uniqueId : "INTER_ID", // 每一行的唯一标识，一般为主键列
			cardView : false, // 是否显示详细视图
			detailView : false, // 是否显示父子表
			singleSelect : true,// 复选框单选
			jsonpCallback:sCall,
			onDblClickRow:function(row){
				var inter_status = row.INTER_STATUS;
				if(inter_status=="03"){
					alert("该接口已在变更中");
					return;
				}
				var app_status = row.INTER_APP_STATUS;
				if(app_status){
					var arr=app_status.split(",");
					if(arr.indexOf("00")!= -1){
						alert("该接口已在草拟中");
						return;
					}else if(arr.indexOf("01")!= -1){
						alert("该接口变更已发起-待管理岗受理");
						return;
					}else if(arr.indexOf("06")!= -1){
						alert("该接口变更已发起-待ESB受理");
						return;
					}
				}
				modObj.modal('hide');
				callparams.inter_code.val(row.INTER_CODE);
				callparams.inter_id.val(row.INTER_ID);
				callparams.inter_name.val(row.INTER_NAME);
				callparams.trade_code.val(row.TRADE_CODE);
				callparams.inter_status.val(row.INTER_STATUS_NAME);
				callparams.inter_version.val(row.INTER_VERSION);
				callparams.inter_office_type.val(row.INTER_OFFICE_TYPE_NAME);
				getChangeUrl(row.INTER_ID,row.INTER_VERSION);
			},onLoadSuccess : function(data){
				gaveInfo();
			},
			columns : [ {
				field : 'order_id',
				title : '序号',
				align : "center",
				width : "50px",
				formatter:function(value,row,index){
					return index + 1;
				}
			}, {
				field : 'SER_SYSTEM_NAME',
				title : '服务方应用名称',
				align : "center",
			}, {
				field : 'INTER_CODE',
				title : '接口编号',
				align : "center",
				 width: "100"
			}, {
				field : 'TRADE_CODE',
				title : '交易码',
				align : "center",
				 width: "100"
			}, {
				field : "INTER_NAME",
				title : "接口名称",
				align : "center"
			}, {
				field : "INTER_STATUS_NAME",
				title : "接口状态",
				align : "center"
			}, {
				field : "INTER_DESCR",
				title : "接口描述",
				align : "center"
			}, {
				field : "INTER_ID",
				title : "查看详情",
				align : "center",
				formatter:function(value,row,index){
					return "<span class='hover-view' "+
					"onclick='useInterfaceApply_viewDetail(\"" + value +"\",\""+row.INTER_VERSION +"\",\"useInterfaceApply_seleInterPop\")'>查看</span>";
				}
			}]
		});
		
		//重置按钮
		modObj.find("#reset_seleInter").click(function(){
			modObj.find("input").not("input[type='button']").val("");
		});
		//查询按钮
		modObj.find("#query_seleInter").click(function(){
			//var inter_code = $.trim(modObj.find("input[name='inter_code']").val());
			//var inter_name = $.trim(modObj.find("input[name='inter_name']").val());
			var param = modObj.find("#selePopForm").serialize();
			var iUrl = dev_application+"useApplyManage/queryInterListBySerSystemId.asp?SID=" + 
					SID + "&call=" + sCall + "&ser_system_id=" + callparams.ser_system_id +
					"&"+param;
			modObj.find("[tb='table_seleInter']").bootstrapTable('refresh',{
				url:iUrl});
		});	
		//enter触发查询
		enterEventRegister("popModelQueryLevel1", function(){getCurrentPageObj().find("#query_seleInter").click();});
	});
}