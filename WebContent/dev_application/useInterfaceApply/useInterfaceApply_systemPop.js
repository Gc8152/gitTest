function useInterfaceApply_systemPop(obj,callparams){
	$("#useInterfaceApply_systemPoP").remove();
	//加载pop框内容
	obj.load("dev_application/useInterfaceApply/useInterfaceApply_systemPop.html",{},function(){
		var modObj = getCurrentPageObj().find("#useInterfaceApply_systemPop");
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
		if(callparams.type == "con"){//消费方应用
			sUrl = sUrl + "&app_user=" + SID;
		}
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
				if(callparams.type=="ser"){//是服务方应用点击过来的并且是想修改的
					if(callparams.id.val() && callparams.id.val() != row.SYSTEM_ID){//更改了服务方应用
						nconfirm("更改服务方应用将删除"+callparams.name.val()+"的接口，是否确定更改？",
						function(){
							var record_app_num = getCurrentPageObj().find("[name='IU.record_app_num']").val();
							var system_id = callparams.id.val();
							//删除原服务方现有接口申请信息
							deleteSystemInter(record_app_num, system_id, row.SYSTEM_ID);
							callparams.id.val(row.SYSTEM_ID);
							callparams.name.val(row.SYSTEM_NAME);
							modObj.modal("hide");
						});
					}else{//没有修改服务方应用，直接赋值
						callparams.id.val(row.SYSTEM_ID);
						callparams.name.val(row.SYSTEM_NAME);
						modObj.modal("hide");
					}
				}else{//消费方应用赋值
					if(callparams.id.val() && callparams.id.val() != row.SYSTEM_ID){//更改了消费方应用
						nconfirm("更改消费方应用将删除"+callparams.name.val()+"的接口，是否确定更改？",
						function(){
							var record_app_num = getCurrentPageObj().find("[name='IU.record_app_num']").val();
							var system_id = callparams.id.val();
							//删除原消费方现有接口申请信息
							deleteSystemInter(record_app_num, system_id, row.SYSTEM_ID);
							callparams.id.val(row.SYSTEM_ID);
							callparams.name.val(row.SYSTEM_NAME);
							callparams.cid.val(row.CON_INTER_ID);//+
							modObj.modal("hide");
						});
					}else{//没有修改消费方应用，直接赋值
						
						callparams.id.val(row.SYSTEM_ID);
						callparams.name.val(row.SYSTEM_NAME);
						callparams.cid.val(row.CON_INTER_ID);//+
						modObj.modal("hide");
					}
				}
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
		
		//重置按钮
		modObj.find("#reset_system").click(function(){
			modObj.find("input").not("[type='button']").val("");
		});
		//查询按钮
		modObj.find("#query_system").click(function(){
			var param =modObj.find("#interSystemForm").serialize();
			var sUrl = dev_application+"useApplyManage/systemQueryList.asp?active=01&SID=" + 
					SID + "&call=" + sCall + "&"+param;
			if(callparams.type == "con"){//消费方应用
				sUrl = sUrl + "&app_user=" + SID;
			}
			modObj.find("[tb='table_system']").bootstrapTable('refresh',{
				url:sUrl});
		});	
		//enter触发查询
		enterEventRegister("popModelQueryLevel1", function(){getCurrentPageObj().find("#query_system").click();});
		
		//删除原先服务方接口申请
		function deleteSystemInter(record_app_num, system_id, ser_system_id){
			var sCall = getMillisecond();
			baseAjaxJsonp(dev_application+"useApplyManage/deleteSystemInter.asp?SID=" + SID + "&call=" + sCall,
					{record_app_num : record_app_num,
					system_id : system_id,
					ser_system_id : ser_system_id}, function(data) {
						//刷新接口申请列表
						getCurrentPageObj().find('[tb="appListTable"]').bootstrapTable('refresh',{
							url:dev_application+"useApplyManage/queryInterAppListById.asp?SID=" + SID + "&call=" + use_InterfaceApply_editCall + "&record_app_num=" + getCurrentPageObj().find("[name='IU.record_app_num']").val()});
			},sCall,false);
		}
		
		
	});
}



function query_systemPop(obj,callparams){
	$("#useInterfaceApply_systemPoP").remove();
	//加载pop框内容
	obj.load("dev_application/useInterfaceApply/useInterfaceApply_systemPop.html",{},function(){
		var modObj = getCurrentPageObj().find("#useInterfaceApply_systemPop");
		modObj.modal("show");
		var qCall = getMillisecond();//表回调方法
		
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		var sUrl = dev_application+"useApplyManage/systemQueryList.asp?SID=" + 
				SID + "&call=" + qCall;
		if(callparams.type == "con"){//消费方应用
			sUrl = sUrl + "&app_user=" + SID;
		}
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
			jsonpCallback:qCall,
			onDblClickRow:function(row){
				callparams.id.val(row.SYSTEM_ID);
				callparams.name.val(row.SYSTEM_NAME);
				modObj.modal("hide");
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
			},  {
				field : 'SYSTEM_ID',
				title : '应用编号',
				align : "center"
			},{
				field : 'SYSTEM_NAME',
				title : '应用名称',
				align : "center"
			}, {
				field : "SYSTEM_SHORT",
				title : "应用简称",
				align : "center"
			}, {
				field : "PROJECT_MAN_NAME",
				title : "项目经理",
				align : "center"
			}]
		});
		
		//重置按钮
		modObj.find("#reset_system").click(function(){
			modObj.find("input").not("[type='button']").val("");
		});
		//查询按钮
		modObj.find("#query_system").click(function(){
			var param =modObj.find("#interSystemForm").serialize();
			var sUrl = dev_application+"useApplyManage/systemQueryList.asp?SID=" + 
					SID + "&call=" + qCall + "&"+param;
			if(callparams.type == "con"){//消费方应用
				sUrl = sUrl + "&app_user=" + SID;
			}
			modObj.find("[tb='table_system']").bootstrapTable('refresh',{
				url:sUrl});
		});		
		//enter触发查询
		enterEventRegister("popModelQueryLevel1", function(){getCurrentPageObj().find("#query_system").click();});
		
	});
}
	
	







