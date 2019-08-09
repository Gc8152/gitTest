    
function openExePop(project_id,modal_div,callparams){
	$('#pm_table').remove();
	var tableCall = getMillisecond();
	modal_div.load("dev_project/projectTaskManage/executorPop.html",{},function(){
		$("#pm_table").modal("show");
		//获取input里面的值
		pmInfoPop("#table_pmInfo",callparams);
		//POP重置
		$("#reset_emp").click(function(){
			$("input[name=EXECUTOR_ID]").val("");
			$("input[name=EXECUTOR_NAMEs]").val("");
		});
		//多条件查询项目经理
		$("#select_emp").click(function(){
			var USER_NO = $("input[name=EXECUTOR_ID]").val();
			var USER_NAME =  $("input[name=EXECUTOR_NAMEs]").val();
			$("#table_pmInfo").bootstrapTable('refresh',{url:dev_project+"projectTaskManager/queryListUserInfo.asp?call="+tableCall+"&SID="+SID
					+"&USER_NO="+USER_NO+"&USER_NAME="+USER_NAME+"&PROJECT_ID="+project_id});
		});
		enterEventRegister("popModelQueryLevel1", function(){getCurrentPageObj().find("#select_emp").click();});
	});

	//执行人信息列表
	function pmInfoPop(UserTable,UserParam){
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
		url : dev_project+"projectTaskManager/queryListUserInfo.asp?call="+tableCall+"&SID="+SID+"&PROJECT_ID="+project_id,
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
			$('#pm_table').modal('hide');
			callparams.Zpm_id.val(row.USER_ID);
			callparams.Zpm_name.val(row.USER_NAME);
		},
		columns :[{
				field : 'Number',
				title : '序号',
				align : "center",
				formatter: function (value, row, index) {
					return index+1;
				}
			}, {
	        	field : 'USER_ID',
				title : '用户编号',
				align : "center"
	        }, {
	        	field : "USER_NAME",
				title : "用户姓名",
				align : "center"
	        }/*, {
	        	field : "USER_POST",
				title : "用户岗位",
				align : "center",
				visible:false
	        }, {
	        	field : "STATE",
				title : "用户状态",
				align : "center",
				visible:false
	        },  {
	        	field : "USER_LEVEL",
				title : "用户等级",
				align : "center",
				visible:false
	        }, {
	        	field : "ORG_NO",
				title : "所属部门编号",
				align : "center",
				visible:false
	        }, {
	        	field : "ORG_NAME",
				title : "所属部门名称",
				align : "center"
	        }*/]
		});
	}
}