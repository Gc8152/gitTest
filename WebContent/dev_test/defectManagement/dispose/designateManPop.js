function proManPop(obj,callparams,SYSTEM_ID,DISCOVER_SYSTEM_ID){
	$("#defect_designate_modal").remove();
	//加载pop框内容
	obj.load("dev_test/defectManagement/dispose/designateManPop.html",{},function(){
		var modObj = getCurrentPageObj().find("#defect_designate_modal");
		modObj.modal("show");
		var manCall = getMillisecond();//表回调方法
		
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		
		//查询项目人员管理的 P_PROJECT_MAN表
		modObj.find("[tb='projectManPopTable']").bootstrapTable("destroy").bootstrapTable({
					url : dev_test+"designateDefect/queryProjectMan.asp?SID="+SID+"&call="+manCall+"&dispose=dispose&SYSTEM_ID="+SYSTEM_ID+"&DISCOVER_SYSTEM_ID="+DISCOVER_SYSTEM_ID,
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
					//uniqueId : " ", // 每一行的唯一标识，一般为主键列
					cardView : false, // 是否显示详细视图
					detailView : false, // 是否显示父子表
					jsonpCallback : manCall,
					singleSelect : true,// 复选框单选
					onDblClickRow:function(row){
						callparams.DISPOSE_MAN_NAME.val(row.USER_NAME);
						callparams.DISPOSE_MAN.val(row.USER_NO);
						modObj.modal("hide");
					},
					columns : [ {
						field : 'USER_NO',
						title : '人员编号',
						align : "center"
					},{
						field : 'USER_NAME',
						title : '人员姓名',
						align : "center"
					}]
				});
		
		//用户POP重置
		modObj.find("#manReset").click(function(){
			modObj.find("input").not("[type='button']").val("");
		});
		//多条件查询用户
		modObj.find("#manSearch").click(function(){
			var param = getCurrentPageObj().find("#manQuery").serialize();
			modObj.find("[tb='projectManPopTable']").bootstrapTable('refresh',{url:dev_test+"designateDefect/queryProjectMan.asp?SID="+SID+"&call="+manCall+"&dispose=dispose&"+param+"&SYSTEM_ID="+SYSTEM_ID+"&DISCOVER_SYSTEM_ID="+DISCOVER_SYSTEM_ID,});
		});
		
	});
}

	
	







