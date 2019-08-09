

function questionRaiseopenPmPop(modal_div,callparams,urls){
	$('#qr_pm_table').remove();
	var tableCall = getMillisecond();
	modal_div.load("dev_project/questionManage/questionRaise/questionRaise_pmInfoPop.html",{},function(){
		$("#qr_pm_table").modal("show");
		//获取input里面的值
		pmInfoPop("#qr_table_pmInfo",callparams,urls);
		//POP重置
		$("#reset_emp").click(function(){
			$("input[name=EMP_ID]").val("");
			$("input[name=EMP_NAME]").val("");
		});
		//多条件查询项目经理
		$("#select_emp").click(function(){
			var USER_NO = $("input[name=EMP_ID]").val();
			var USER_NAME =  $("input[name=EMP_NAME]").val();
			$("#qr_table_pmInfo").bootstrapTable('refresh',{
				
				/*url:dev_project+"QuestionRaise/questionRaiseQueryAllUser.asp?call="+tableCall+"&SID="+SID*/
				url:urls
				+"&call="+tableCall+"&USER_NO="+USER_NO+"&USER_NAME="+escape(encodeURIComponent(USER_NAME))});
		});
		enterEventRegister("popModelQueryLevel1", function(){getCurrentPageObj().find("#select_emp").click();});
	});

	//项目经理信息列表
	function pmInfoPop(UserTable,UserParam,urls){
		//分页
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset //页码
			};
			return temp;
		};	
		//查询所有POP框
		$(UserTable).bootstrapTable("destroy").bootstrapTable({
		//请求后台的URL（*）
	/*	url : dev_project+"QuestionRaise/questionRaiseQueryAllUser.asp?call="+tableCall+"&SID="+SID,*/
		url:urls+"&call="+tableCall,
		method : 'get', //请求方式（*）   
		striped : true, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [5,10,15],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 5,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "USER_NO", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:tableCall,
		singleSelect: true,
		onDblClickRow:function(row){
			$('#qr_pm_table').modal('hide');
			callparams.Zpm_id.val(row.USER_NO);
			callparams.Zpm_name.val(row.USER_NAME);
		},
		columns :[{
	        	field : 'USER_NO',
				title : '用户编号',
				align : "center"
	        }, {
	        	field : "USER_NAME",
				title : "用户姓名",
				align : "center"
	        }, {
	        	field : "ROLE_NAME",
				title : "用户角色",
				align : "center",
	        }, {
	        	field : "ORG_NAME",
				title : "所属部门名称",
				align : "center"
	        }]
		});
	}
}