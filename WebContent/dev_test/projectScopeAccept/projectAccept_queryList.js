//初始化事件
initAcceptList();

function initAcceptList(){
	var $page = getCurrentPageObj();//当前页
	autoInitSelect($page);//初始化下拉选
	var formObj = $page.find("#acceptForm");//表单对象
	var initTableCall = getMillisecond();//table回调方法名
	var prjAcceptTable = $page.find("[tb='prjAcceptTable']");
	
	//初始化列表
	initPrjAcceptTable();
	//重置按钮
	$page.find("[name='resetPrj']").click(function(){
		$page.find("table input").val("");
		$page.find("select").val(" ").select2();
	});
	
	//查询按钮
	 $page.find("[name='queryPrj']").click(function(){
		 var param = formObj.serialize();
		 prjAcceptTable.bootstrapTable('refresh',{
				url:dev_test+"projectScopeAccept/queryAcceptList.asp?SID=" + SID + "&call=" + initTableCall +'&'+param});
	 });
	//enter触发查询
	 enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#queryPrj").click();});
	 
	//受理
	 $page.find("[name='prjAccept']").click(function(){
		 var seles = prjAcceptTable.bootstrapTable("getSelections");
			if(seles.length!=1){
					alert("请选择一条数据!");
					return;
			}
			if(seles[0].ACCEPT_STATE != '00'){
				alert("该项目已受理");
				return;
			}
			 closeAndOpenInnerPageTab("projectAccept","项目范围受理","dev_test/projectScopeAccept/projectAccept_edit.html", function(){
				 initTaskList(seles[0]);
				});
			
	 });
	 


	//查看	 
	 $page.find("[name='prjDetail']").click(function(){
			 var seles = prjAcceptTable.bootstrapTable("getSelections");
				if(seles.length!=1){
						alert("请选择一条数据!");
						return;
				}
				 closeAndOpenInnerPageTab("viewAccept","查看详情","dev_test/projectScopeAccept/projectAccept_view.html", function(){
					 viewTaskList(seles[0]);
					});
				
		 });
	 
	 
	 //初始化表
	function initPrjAcceptTable() {
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		prjAcceptTable.bootstrapTable({
					url : dev_test+"projectScopeAccept/queryAcceptList.asp?SID=" + SID + "&call=" + initTableCall,
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
					uniqueId : " ", // 每一行的唯一标识，一般为主键列
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
						width : "60",
						formatter:function(value,row,index){
							return index + 1;
						}
					}, {
						field : "PROJECT_NUM",
						title : "项目编号",
						width : "180",
						align : "center"
					}, {
						field : "PROJECT_NAME",
						title : "项目名称",
						width : "180",
						align : "center"
					}, {
						field : "ACCEPT_SOURCE_NAME",
						title : "受理来源",
						width : "100",
						align : "center"
					},{
						field : "ACCEPT_STATE_NAME",
						title : "受理状态",
						width : "100",
						align : "center"
					}, {
						field : "CREATE_TIME",
						title : "发起时间",
						align : "center",
						width : "120"
					}, {
						field : "VERSION_NAME",
						title : "版本名称",
						align : "center",
						width : "180"
					}, {
						field : "PRODUCE_TIME",
						title : "预计投产时间",
						align : "center",
						width : "120"
					}, {
						field : "PROJECT_MAN_NAME",
						title : "项目经理",
						align : "center"
					}]
				});
	}
	
}