function changeInforMaintenace_seleDataPop(obj,tbObj,way_type,vlida){
	$("#inforMaintenace_seleDataPop").remove();
	//加载pop框内容
	obj.load("dev_application/interfaceManage/interInfoRepair/inforMaintenace_seleDataPop.html",{},function(){
		var modObj = getCurrentPageObj().find("#inforMaintenace_seleDataPop");
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
		var iUrl = dev_application+'StandardDataManage/queryStandardDataManage.asp?call='+sCall+'&SID='+SID;
		modObj.find("[tb='table_data']").bootstrapTable({
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
			uniqueId : "DATA_ID", // 每一行的唯一标识，一般为主键列
			cardView : false, // 是否显示详细视图
			detailView : false, // 是否显示父子表
			singleSelect : true,// 复选框单选
			jsonpCallback:sCall,
			onDblClickRow:function(row){
				/*var ids = tbObj.find("[name='D.data_engname']");*/
				//inforMaintenace_addData(tbObj,"00",way_type,row);//00标准数据
				row.WAY_TYPE = way_type;
				row.INFO_REMARK="";
				row.IS_STANDARD="00";
				addContent(tbObj,vlida,way_type=='00'?'':'_',row);
				modObj.modal("hide");
			},onLoadSuccess : function(data){
				gaveInfo();
			},
			columns : [ {
				field : '',
				title : '序号',	
				align : "center",
				sortable: true,
				formatter: function (value, row, index) {
					return index+1;
				}
			}, {
				field : "DATA_ID",
				title : "ID",
				align : "center"
			}, {
				field : "DATA_ENGNAME",
				title : "数据名称（英文）",
				align : "center"
			}, {
				field : "DATA_CHNNAME",
				title : "数据名称（中文）",
				align : "center"
			}, {
				field : "DATA_TYPE_NAME",
				title : "数据类型",
				align : "center"
			}, {
				field : "MSG_LENGTH",
				title : "长度",
				align : "center"				
			}, {
				field : "STANDARD_CODE",
				title : "标准代码",
				align : "center"
			}, {
				field : "DATA_INSTRUCTION",
				title : "说明",
				align : "center"
			}]
		});
		
		//重置按钮
		modObj.find("#reset_data").click(function(){
			modObj.find("input").not("input[type='button']").val("");
		});
		//查询按钮
		modObj.find("#query_data").click(function(){		
			//var data_chnname = $.trim(modObj.find("input[name='inter_chnname']").val());
			//var data_engname = $.trim(modObj.find("input[name='inter_engname']").val());
			var param = modObj.find("#inforMaintenace_seleDataPopForm").serialize();
			var iUrl = dev_application+'StandardDataManage/queryStandardDataManage.asp?call='+sCall+'&SID='+SID
				+ "&call=" + sCall + "&"+param;
			modObj.find("[tb='table_data']").bootstrapTable('refresh',{
				url:iUrl});
		});	
		//enter触发查询
		enterEventRegister("popModelQueryLevel1", function(){getCurrentPageObj().find("#query_data").click();});
	});
}