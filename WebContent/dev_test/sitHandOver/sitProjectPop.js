function projectPop(obj,callparams,callback){
	$("#project_modal").remove();
	//加载pop框内容
	obj.load("dev_test/sitHandOver/projectPop.html",{},function(){
		var modObj = getCurrentPageObj().find("#project_modal");
		modObj.modal("show");
		var projectCall = getMillisecond();//表回调方法
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset// 页码
			};
			return temp;
		};
		//查询项目的 TM_PROJECT_VERSION_TEMP表
		modObj.find("[tb='projectTable']").bootstrapTable("destroy").bootstrapTable({
					url : dev_test+"testTaskHandOver/queryProject.asp?SID="+SID+"&call="+projectCall,
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
					cardView : false, // 是否显示详细视图
					detailView : false, // 是否显示父子表
					jsonpCallback : projectCall,
					singleSelect : true,// 复选框单选
					onDblClickRow:function(row){
						if(row.ACCEPT_STATE == '05'||row.ACCEPT_STATE == undefined){
						callback(row.PROJECT_ID,row.TEST_ROUND);
						callparams.PROJECT_ID.val(row.PROJECT_ID);
						callparams.PROJECT_NAME.val(row.PROJECT_NAME);
						callparams.PROJECT_NUM.val(row.PROJECT_NUM);
						if(row.TEST_ROUND){
							var round = parseInt(row.TEST_ROUND)+1;
							callparams.TEST_ROUND.val(round);
						}else{
							callparams.TEST_ROUND.val('1');
						}
						callparams.VERSION_NAME.val(row.VERSION_NAME);
						callparams.USER_NO.val(row.TEST_MAN);
						callparams.USER_NAME.val(row.USER_NAME);
						modObj.modal("hide");
						}else
						{alert("该项目未执行完成，不能进行移交");
							}
					},
					columns : [ {
						field : "PROJECT_NUM",
						title : "项目编号",
						align : "center",
						width : "250",
					},{
						field : "PROJECT_NAME",
						title : "项目名称",
						align : "center",
						width : "350",
					}, {
						field : "ACCEPT_STATE_NAME",
						title : "执行状态",
						align : "center",
						width : "80",
					}, {
						field : "VERSION_NAME",
						title : "版本名称",
						align : "center",
						width : "350",
					}, {
						field : "TEST_ROUND",
						title : "上一测试轮次",
						align : "center",
						width : "120",
					}]
				});
		//用户POP重置
		modObj.find("#projectReset").click(function(){
			modObj.find("input").not("[type='button']").val("");
		});
		//多条件查询用户
		modObj.find("#projectSearch").click(function(){
			var param = getCurrentPageObj().find("#projectQuery").serialize();
			modObj.find("[tb='projectTable']").bootstrapTable('refresh',{url:dev_test+"testTaskHandOver/queryProject.asp?SID="+SID+"&call="+projectCall+"&"+param});
		});
		//enter触发查询
		enterEventRegister("popModelQueryLevel1", function(){getCurrentPageObj().find("#projectSearch").click();});

	});
}