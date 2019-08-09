//初始化事件
initTerInitList();

function initTerInitList(){
	var $page = getCurrentPageObj();//当前页
	//autoInitSelect($page);//初始化下拉选
	var form = $page.find("#terInitForm");//表单对象
	var initCall = getMillisecond();//table回调方法名
	var initTable = $page.find("#TerInitTable");
	
	//初始化列表
	initTerInitTable();
	//重置按钮
	$page.find("#resetti").click(function(){
		$page.find("table input").val("");
		//$page.find("select").val(" ").select2();
	});
	
	//查询按钮
	 $page.find("#queryti").click(function(){
		 var param = form.serialize();
		 initTable.bootstrapTable('refresh',{
				url:dev_construction+"req_terminate/queryReqTerminateList.asp?SID=" + SID + "&call=" + initCall + '&' + param + "&TYPE=1"});
		
	 });
	 //绑定enter按钮查询事件
	 enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#queryti").click();});
	//填写申请
	 $page.find("#editti").click(function(){
		 closeAndOpenInnerPageTab("initApply","填写申请单","dev_construction/requirement/requirement_terminate/initiate/initiate_edit.html", function(){
			 terInitEdit();
			});
	 });

	//查看申请单
	 $page.find("#viewti").click(function(){
		 var seles = initTable.bootstrapTable("getSelections");
			if(seles.length!=1){
					alert("请选择一条数据进行查看!");
					return;
			}
			closeAndOpenInnerPageTab("viewApply","查看申请单","dev_construction/requirement/requirement_terminate/query/query_view.html", function(){
					 terQueryEdit(seles[0]);
			});
				
	 });
	 
	 //初始化表
	function initTerInitTable() {
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		initTable.bootstrapTable({
					url :dev_construction+"req_terminate/queryReqTerminateList.asp?SID=" + SID + "&call=" + initCall + "&TYPE=1",
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
					jsonpCallback:initCall,
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
						width : 70,
						formatter:function(value,row,index){
							return index + 1;
						}
					},{
						field : "REQ_CODE",
						title : "需求编号",
						width : 180,
						align : "center"
					}, {
						field : "REQ_NAME",
						title : "需求名称",
						width : 180,
						align : "center"
					},{
						field : 'REQ_TERMINATE_STATE_NAME',
						title : '申请单状态',
						width : 180,
						align : "center",
					},{
						field : "CREATE_NAME",
						title : "申请人",
						align : "center",
						width : 180
					},  {
						field : "CREATE_TIME",
						title : "申请时间",
						align : "center",
						width : 180
					}]
				});
	}
	
}