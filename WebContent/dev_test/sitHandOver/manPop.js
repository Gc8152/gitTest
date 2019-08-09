function manPop(obj,callparams){
	$("#man_modal").remove();
	//加载pop框内容
	obj.load("dev_test/sitHandOver/manPop.html",{},function(){
		var modObj = getCurrentPageObj().find("#man_modal");
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
		
		//查询项目的 TM_PROJECT_VERSION_TEMP表
		modObj.find("[tb='manTable']").bootstrapTable("destroy").bootstrapTable({
					url : dev_test+"testTaskHandOver/queryman.asp?SID="+SID+"&call="+manCall,
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
						callparams.USER_NO.val(row.USER_NO);
						callparams.USER_NAME.val(row.USER_NAME);
						
						modObj.modal("hide");
						
					},
					columns : [ {
						field : "USER_NAME",
						title : "用户姓名",
						align : "center",
						width : "13%",
					},{
						field : "LOGIN_NAME",
						title : "登录名",
						align : "center",
						width : "15%",
					},{
						field : "STATE",
						title : "用户状态",
						align : "center",
						width : "8%",
					}, {
						field : "ORG_NO",
						title : "所在部门",
						align : "center",
						width : "12%",
					},{
						field : "USER_MAIL",
						title : "用户邮箱",
						align : "center",
						width : "9%",
					}]
				});
		
		//用户POP重置
		modObj.find("#manReset").click(function(){
			modObj.find("input").not("[type='button']").val("");
		});
		//多条件查询用户
		modObj.find("#manSearch").click(function(){
			var param = getCurrentPageObj().find("#manQuery").serialize();
			modObj.find("[tb='manTable']").bootstrapTable('refresh',{url:dev_test+"testTaskHandOver/queryman.asp?SID="+SID+"&call="+manCall+"&"+param});
		});
		//enter触发查询
		enterEventRegister("popModelQueryLevel1", function(){getCurrentPageObj().find("#manSearch").click();});

		
	});
}

	
	







