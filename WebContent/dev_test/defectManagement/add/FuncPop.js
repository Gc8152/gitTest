function FuncPop(obj,callparams){
	$("#Func_modal").remove();
	//加载pop框内容
	obj.load("dev_test/defectManagement/add/FuncPop.html",{},function(){
		var modObj = getCurrentPageObj().find("#Func_modal");
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
		modObj.find("[tb='funcPopTable']").bootstrapTable("destroy").bootstrapTable({
					url : dev_test+"addDefect/queryFuncProjectInfo.asp?SID="+SID+"&call="+manCall,
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
					onLoadSuccess : function(data){
						gaveInfo();
					},
					onDblClickRow:function(row){
						callparams.FUNC_NAME.val(row.FUNC_NAME);
						callparams.FUNC_ID.val(row.FUNC_ID);
						callparams.DUTY_PERSON_NAME.val(row.PROJECT_MAN_NAME);
						callparams.DUTY_PERSON_NAME.attr("readOnly",true);
						callparams.DUTY_PERSON.val(row.PROJECT_MAN);
						callparams.TEST_ROUND.val(row.MAX_ROUND);
						modObj.modal("hide");
					},
					columns : [ {
						field : 'FUNC_NAME',
						title : '功能点名称',
						align : "center",
						width : "90"
					},{
						field : 'FUNC_NO',
						title : '功能点编号',
						align : "center",
						width : "90"
					},{
						field : 'PROJECT_NAME',
						title : '项目名称',
						align : "center",
						width : "150"
					},{
						field : 'PROJECT_NUM',
						title : '项目编号',
						align : "center",
						width : "150"
					},
					{
						field : 'PROJECT_MAN_NAME',
						title : '项目经理',
						align : "center",
						width : "90"
					}]
				});
		
		//用户POP重置
		modObj.find("#funcReset").click(function(){
			modObj.find("input").not("[type='button']").val("");
		});
		//多条件查询用户
		modObj.find("#funcSearch").click(function(){
			var param = getCurrentPageObj().find("#funcQuery").serialize();
			modObj.find("[tb='funcPopTable']").bootstrapTable('refresh',{url:dev_test+"addDefect/queryFuncProjectInfo.asp?SID="+SID+"&call="+manCall+"&"+param});
		});
		
	});
}

	
	







