//初始化事件
initProManList();

function initProManList(){
	var $page = getCurrentPageObj();//当前页
	autoInitSelect($page);//初始化下拉选
	var form = $page.find("#manListForm");//表单对象
	var manCall = getMillisecond();//table回调方法名
	var proManTable = $page.find("#ProManTable");
	
	//初始化列表
	initProManTable();
	//重置按钮
	$page.find("#resetMan").click(function(){
		$page.find("table input").val("");
		$page.find("select").val(" ").select2();
	});
	
	//查询按钮
	 $page.find("#queryMan").click(function(){
		 var param = form.serialize();
		 proManTable.bootstrapTable('refresh',{
				url:dev_project+"projectman/queryProjectList.asp?SID=" + SID + "&call=" + manCall + '&' + param});
		
	 });

	 enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#queryMan").click();});
	//人员管理
	 $page.find("#editMan").click(function(){
		 var seles = proManTable.bootstrapTable("getSelections");
			if(seles.length!=1){
					alert("请选择一条数据!");
					return;
			}
		 closeAndOpenInnerPageTab("personnelManage","人员管理","dev_project/projectManage/myProject/projectMan/projectMan_edit.html", function(){
			 personnelManage(seles[0]);
			});
	 });

	//查看申请单
	 $page.find("#viewMan").click(function(){
		 var seles = proManTable.bootstrapTable("getSelections");
			if(seles.length!=1){
					alert("请选择一条数据进行查看!");
					return;
			}
			closeAndOpenInnerPageTab("viewAnalyze","查看申请单","dev_construction/requirement/requirement_terminate/analyze/analyze_edit.html", function(){
				terAnalyzeEdit(seles[0],"view");
			});
				
	 });
	 
	 //初始化表
	function initProManTable() {
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		proManTable.bootstrapTable({
					url :dev_project+"projectman/queryProjectList.asp?SID=" + SID + "&call=" + manCall,
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
					uniqueId : "REQ_TERMINATE_ID", // 每一行的唯一标识，一般为主键列
					cardView : false, // 是否显示详细视图
					detailView : false, // 是否显示父子表
					singleSelect : true,// 复选框单选
					jsonpCallback:manCall,
					onLoadSuccess : function(data){
						gaveInfo();
					},
					columns : [ {
						checkbox : true,
						rowspan : 2,
						align : 'center',
						valign : 'middle'
					}, {
						field : 'ORDER_ID',
						title : '序号',
						align : "center",
						width : "6%",
						formatter:function(value,row,index){
							return index + 1;
						}
					}, {
						field : 'PROJECT_NUM',
						title : '项目编号',
						width : "18%",
						align : "center",
					}, {
						field : 'PROJECT_NAME',
						title : '项目名称',
						width : "16%",
						align : "center",
					}, {
						field : "PROJECT_TYPE_NAME",
						title : "项目类型",
						width : "12%",
						align : "center"
					}, {
						field : "STATUS_NAME",
						title : "项目状态",
						width : "10%",
						align : "center"
					}, {
						field : "PROJECT_MAN_NAME",
						title : "项目经理",
						width : "10%",
						align : "center"
					}, {
						field : "TEST_MAN_NAME",
						title : "测试经理",
						width : "10%",
						align : "center"
					}, {
						field : "ORG_NAME",
						title : "归属部门",
						align : "center",
						width : "13%"
					}]
				});
	}
	
}