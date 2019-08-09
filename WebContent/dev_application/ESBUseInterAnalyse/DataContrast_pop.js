//页面div调用pop的id，需要返回值的input的id
function gDataContraPop(id,params){
	$('#myModal_System').remove();
	getCurrentPageObj().find("#"+id).load("dev_application/ESBUseInterAnalyse/DataContrast_pop.html",{},function(){
		$("#myModal_System").modal("show");
		gDataContraPopTable(params);
	});

}

function gDataContraPopTable(dataParams){
	var queryParams = function(params) {
		var temp = {
			limit : params.limit, // 页面大小
			offset : params.offset,
			inter_id : dataParams.inter_id,
			app_id: dataParams.app_id,
			way_type : dataParams.way_type
		// 页码
		};
		return temp;
	};
	var dataParam={};
	
	var taskSysListCall = getMillisecond();
	
	getCurrentPageObj().find('#gDataContraPopTable').bootstrapTable("destroy").bootstrapTable({
				url :dev_application+"IAnalyse/dataContrast.asp?SID="+SID+"&call="+taskSysListCall,
				method : 'get', // 请求方式（*）
				striped : false, // 是否显示行间隔色
				cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, // 是否启用排序
				sortOrder : "asc", // 排序方式
				queryParams : queryParams,// 传递参数（*）
				sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
				pagination : true, // 是否显示分页（*）
				pageList : [ 10, 20, 30 ], // 可供选择的每页的行数（*）
				pageNumber : 1, // 初始化加载第一页，默认第一页
				pageSize : 10, // 每页的记录行数（*）
				clickToSelect : true, // 是否启用点击选中行
				// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
				uniqueId : "SYSTEM_ID", // 每一行的唯一标识，一般为主键列
				cardView : false, // 是否显示详细视图
				detailView : false, // 是否显示父子表
				jsonpCallback:taskSysListCall,
				singleSelect : true,// 复选框单选
				onLoadSuccess : function(data){
					gaveInfo();
				},
				columns : [ {
					field : 'Number',
					title : '序号',
					align : "center",
					width : "8%",
					sortable: true,
					formatter: function (value, row, index) {
						return index+1;
					}
				},{
					field : "DATA_CHNNAME",
					title : "字段名(中文)",
					align : "center",
					width : "11%",
					formatter: function (value, row, index) {
						row.DATA_ENGNAME_1 == '0'?value="<span style='color:red'>"+value+"</span>": value;
						return value;
					}
				}, {
					field : "DATA_ENGNAME",
					title : "1级字段名(英文)",
					align : "center",
					width : "11%",
					formatter: function (value, row, index) {
						row.DATA_ENGNAME_1 == '0'?value="<span style='color:red'>"+value+"</span>": value;
						return value;
					}
				}, {
					field : "DATA_ENGNAMEA",
					title : "2级字段名(英文)",
					align : "center",
					width : "11%",
					formatter: function (value, row, index) {
						if(value == undefined){ value = ''; }
						row.DATA_ENGNAME_1 == '0'?value="<span style='color:red'>"+value+"</span>": value;
						return value;
					}
				}, {
					field : "DATA_ENGNAMEB",
					title : "3级字段名(英文)",
					align : "center",
					width : "11%",
					formatter: function (value, row, index) {
						if(value == undefined){ value = ''; }
						row.DATA_ENGNAME_1 == '0'?value="<span style='color:red'>"+value+"</span>": value;
						return value;
					}
				}, {
					field : 'DATA_TYPE_NAME',
					title : '类型',
					align : "center",
					width : "8%",
					formatter: function (value, row, index) {
						row.DATA_ENGNAME_1 == '0'||row.DATA_TYPE_1=='0'?value="<span style='color:red'>"+value+"</span>": value;
						return value;
					}
				}, {
					field : "MSG_LENGTH",
					title : "长度",
					align : "center",
					width : "8%",
					formatter: function (value, row, index) {
						row.DATA_ENGNAME_1 == '0'||row.MSG_LENGTH_1=='0'?value="<span style='color:red'>"+value+"</span>": value;
						return value;
					}
				},{
					field : "IS_NECESSARY_NAME",
					title : "是否必输",
					align : "center",
					width : "8%",
					formatter: function (value, row, index) {
						row.DATA_ENGNAME_1 == '0'||row.IS_NECESSARY_1=='0'?value="<span style='color:red'>"+value+"</span>": value;
						return value;
					}
					
				}, {
					field : "STANDARD_CODE",
					title : "标准代码",
					align : "center",
					width : "8%",
					formatter: function (value, row, index) {
						if(value == undefined){ value = ''; }
						row.DATA_ENGNAME_1 == '0'||row.STANDARD_CODE_1=='0'?value="<span style='color:red'>"+value+"</span>": value;
						return value;
					}
				},{
					field : "DATA_INSTRUCTION",
					title : "内容说明",
					align : "center",
					width : "8%",
					formatter: function (value, row, index) {
						if(value == undefined){ value = ''; }
						row.DATA_ENGNAME_1 == '0'?value="<span style='color:red'>"+value+"</span>": value;
						return value;
					}
				},{
					field : "INFO_REMARK",
					title : "备注",
					align : "center",
					width : "8%",
					formatter: function (value, row, index) {
						if(value == undefined){ value = ''; }
						row.DATA_ENGNAME_1 == '0'?value="<span style='color:red'>"+value+"</span>": value;
						return value;
					}
				}]
			});
	
	
	
	var newDataContrastCall = getMillisecond()+"2";
	
	getCurrentPageObj().find('#newDataContrastTable').bootstrapTable("destroy").bootstrapTable({
				url :dev_application+"IAnalyse/newDataContrast.asp?SID="+SID+"&call="+newDataContrastCall,
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
				jsonpCallback:newDataContrastCall,
				singleSelect : true,// 复选框单选
				onLoadSuccess : function(data){
					gaveInfo();
				},
				columns : [ {
					field : 'Number',
					title : '序号',
					align : "center",
					width : "8%",
					sortable: true,
					formatter: function (value, row, index) {
						return index+1;
					}
				},{
					field : "DATA_CHNNAME",
					title : "字段名(中文)",
					align : "center",
					width : "11%",
					formatter: function (value, row, index) {
						row.DATA_ENGNAME_1 == '0'?value="<span style='color:red'>"+value+"</span>": value;
						return value;
					}
				}, {
					field : "DATA_ENGNAME",
					title : "1级字段名(英文)",
					align : "center",
					width : "11%",
					formatter: function (value, row, index) {
						row.DATA_ENGNAME_1 == '0'?value="<span style='color:red'>"+value+"</span>":value;
						return value;
					}
				}, {
					field : "DATA_ENGNAMEA",
					title : "2级字段名(英文)",
					align : "center",
					width : "11%",
					formatter: function (value, row, index) {
						if(value == undefined){ value = ''; }
						row.DATA_ENGNAME_1 == '0'?value="<span style='color:red'>"+value+"</span>":value;
						return value;
					}
				}, {
					field : "DATA_ENGNAMEB",
					title : "3级段名(英文)",
					align : "center",
					width : "11%",
					formatter: function (value, row, index) {
						if(value == undefined){ value = ''; }
						row.DATA_ENGNAME_1 == '0'?value="<span style='color:red'>"+value+"</span>":value;
						return value;
					}
				}, {
					field : 'DATA_TYPE_NAME',
					title : '类型',
					align : "center",
					width : "8%",
					formatter: function (value, row, index) {
						row.DATA_ENGNAME_1 == '0'||row.DATA_TYPE_1=='0'?value="<span style='color:red'>"+value+"</span>": value;
						return value;
					}
				}, {
					field : "MSG_LENGTH",
					title : "长度",
					align : "center",
					width : "8%",
					formatter: function (value, row, index) {
						row.DATA_ENGNAME_1 == '0'||row.MSG_LENGTH_1=='0'?value="<span style='color:red'>"+value+"</span>": value;
						return value;
					}
				},{
					field : "IS_NECESSARY_NAME",
					title : "是否必输",
					align : "center",
					width : "8%",
					formatter: function (value, row, index) {
						row.DATA_ENGNAME_1 == '0'||row.IS_NECESSARY_1=='0'?value="<span style='color:red'>"+value+"</span>": value;
						return value;
					}
					
				}, {
					field : "STANDARD_CODE",
					title : "标准代码",
					align : "center",
					width : "8%",
					formatter: function (value, row, index) {
						if(value == undefined){ value = ''; }
						row.DATA_ENGNAME_1 == '0'||row.STANDARD_CODE_1=='0'?value="<span style='color:red'>"+value+"</span>": value;
						return value;
					}
				},{
					field : "DATA_INSTRUCTION",
					title : "内容说明",
					align : "center",
					width : "8%",
					formatter: function (value, row, index) {
						if(value == undefined){ value = ''; }
						row.DATA_ENGNAME_1 == '0'?value="<span style='color:red'>"+value+"</span>": value;
						return value;
					}
				},{
					field : "INFO_REMARK",
					title : "备注",
					align : "center",
					width : "8%",
					formatter: function (value, row, index) {
						if(value == undefined){ value = ''; }
						row.DATA_ENGNAME_1 == '0'?value="<span style='color:red'>"+value+"</span>": value;
						return value;
					}
				}]
			});
	
	
}




			
		
		