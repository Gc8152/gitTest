//初始化事件
initDefectList();

function initDefectList(){
	var $page = getCurrentPageObj();//当前页
	autoInitSelect($page);//初始化下拉选
	var formObj = $page.find("#defectForm");//表单对象
	var initTableCall = getMillisecond();//table回调方法名
	var testCase = $page.find("[tb='testCase']");
	
	//初始化列表
	inittestCase();
	//重置按钮
	$page.find("[name='resetDefect']").click(function(){
		$page.find("table input").val("");
		$page.find("select").val(" ").select2();
	});
	
	//查询按钮
	 $page.find("#queryDefect").click(function(){
		 var param = formObj.serialize();
		 testCase.bootstrapTable('refresh',{
				url:dev_test+"designTestCases/queryCaseManagerList.asp?SID=" + SID + "&ROLE=1&call=" + initTableCall +'&'+param});
	 });
	//enter触发查询
		enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#queryDefect").click();});
	
	 
	 
	 //初始化表
	function inittestCase() {
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		testCase.bootstrapTable({
			url : dev_test+"designTestCases/queryCaseManagerList.asp?SID=" + SID + "&call=" + initTableCall,
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
			pageSize : 10, // 每页的记录行数（*）
			clickToSelect : true, // 是否启用点击选中行
			// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
			uniqueId : "DEFECT_ID", // 每一行的唯一标识，一般为主键列
			cardView : false, // 是否显示详细视图
			detailView : false, // 是否显示父子表
			singleSelect : true,// 复选框单选
			jsonpCallback:initTableCall,
			onLoadSuccess : function(data){
				gaveInfo();
			},
			columns : [ {
				checkbox : true,
				rowspan : 2,
				align : 'center',
				valign : 'middle'
			},{
				field : 'ORDER_ID',
				title : '序号',
				align : "center",
				width : "50",
				formatter:function(value,row,index){
					return index + 1;
				}
			}, {
				field : "CASE_NUM",
				title : "案例编号",
				width : "150",
				align : "center"
			}, {
				field : "CASE_NAME",
				title : "案例名称",
				width : "200",
				align : "center"
			}, {
				field : "SYSTEM_NAME",
				title : "应用名称",
				width : "200",
				align : "center"
			},{
				field : "MODULE_NAME",
				title : "模块名称",
				width : "200",
				align : "center"
			}, {
				field : "FUNC_NAME",
				title : "功能点名称",
				align : "center",
				width : "200"
			}, {
				field : "TESTPOINT_NAME",
				title : "测试要点",
				align : "center",
				width : "200"
			},  {
				field : " ",
				title : "优先级",
				align : "center",
				width : "100"
			}, {
				field : "USER_NAME",
				title : "设计人",
				align : "center",
				width : "100"
			}, {
				field : "OPT_TIME",
				title : "设计日期",
				align : "center",
				width : "120"
			}, {
				field : "CASE_VERSION",
				title : "版本号",
				align : "center",
				width : "100"
			}]
		});
	}
	
}