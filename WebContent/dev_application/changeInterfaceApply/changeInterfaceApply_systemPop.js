function changeInterfaceApply_systemPop(obj,callparams){
	$("#changeInterfaceApply_systemPoP").remove();
	//加载pop框内容
	obj.load("dev_application/changeInterfaceApply/changeInterfaceApply_systemPop.html",{},function(){
		var modObj = getCurrentPageObj().find("#changeInterfaceApply_systemPop");
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
		var sUrl = dev_application+"useApplyManage/systemQueryList.asp?active=01&SID=" + 
				SID + "&call=" + sCall;
		modObj.find("[tb='table_system']").bootstrapTable({
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
			uniqueId : "SYSTEM_ID", // 每一行的唯一标识，一般为主键列
			cardView : false, // 是否显示详细视图
			detailView : false, // 是否显示父子表
			singleSelect : true,// 复选框单选
			jsonpCallback:sCall,
			onDblClickRow:function(row){
				//
				if(callparams.id.val() && callparams.id.val() != row.SYSTEM_ID){//更改了服务方应用
					nconfirm("更改服务方应用将重置页面信息，是否确定更改？",
					function(){
						//清空相关接口信息
						emptyInterInfo();
						callparams.id.val(row.SYSTEM_ID);
						callparams.name.val(row.SYSTEM_NAME);
						modObj.modal("hide");
					});
				}else{//没有修改服务方应用，直接赋值
					callparams.id.val(row.SYSTEM_ID);
					callparams.name.val(row.SYSTEM_NAME);
					modObj.modal("hide");
				}
			},
			onLoadSuccess : function(data){
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
				field : 'SYSTEM_NAME',
				title : '应用名称',
				align : "center"
			}, {
				field : "SYSTEM_SHORT",
				title : "应用简称",
				align : "center"
			}, {
				field : "PROJECT_MAN_NAME",
				title : "应用负责人",
				align : "center"
			}]
		});
		//更改服务方应用，清空相关数据
		function emptyInterInfo(){
			var getCurr = getCurrentPageObj();
			getCurr.find("input[name='IU.req_task_code']").val("");
			getCurr.find("input[name='IU.req_task_name']").val("");
			getCurr.find("input[name='IU.inter_code']").val("");
			getCurr.find("input[name='IU.inter_name']").val("");
			getCurr.find("input[name='IU.trade_code']").val("");
			getCurr.find("input[name='IU.inter_status']").val("");
			getCurr.find("input[name='IU.inter_version']").val("");
			getCurr.find("input[name='IU.inter_office_type']").val("");
			getCurr.find("input[type='hidden']").not("input[name='IU.ser_system_id']").val("");
			getChangeUrl("bb","bb");
		}
		//重置按钮
		modObj.find("#reset_system").click(function(){
			modObj.find("input").not("input[type='button']").val("");
		});
		//查询按钮
		modObj.find("#query_system").click(function(){
//			var system_name = $.trim(modObj.find("input[name='system_name']").val());
//			var project_man_name = $.trim(modObj.find("input[name='project_man_name']").val());
			var param = modObj.find("#changeApplyForm").serialize();
			var sUrl = dev_application+"useApplyManage/systemQueryList.asp?active=01&SID=" + 
					SID + "&call=" + sCall + "&"+param;
			modObj.find("[tb='table_system']").bootstrapTable('refresh',{
				url:sUrl});
		});	
		//enter触发查询
		enterEventRegister("popModelQueryLevel1", function(){getCurrentPageObj().find("#query_system").click();});
	});
}