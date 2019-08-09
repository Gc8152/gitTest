//初始化事件
initTerAnalyzeList();

function initTerAnalyzeList(){
	var $page = getCurrentPageObj();//当前页
	//autoInitSelect($page);//初始化下拉选
	var form = $page.find("#terAnalyzeForm");//表单对象
	var analyzeCall = getMillisecond();//table回调方法名
	var analyzeTable = $page.find("#TerAnalyzeTable");
	
	//初始化列表
	initTerAnalyzeTable();
	//重置按钮
	$page.find("#resetta").click(function(){
		$page.find("table input").val("");
		//$page.find("select").val(" ").select2();
	});
	
	//查询按钮
	 $page.find("#queryta").click(function(){
		 var param = form.serialize();
		 analyzeTable.bootstrapTable('refresh',{
				url:dev_construction+"req_terminate/queryReqTerminateList.asp?SID=" + SID + "&call=" + analyzeCall + '&' + param + "&TYPE=2"});
		
	 });
	 //enter按钮绑定查询事件
	 enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#queryta").click();});
	//分析申请
	 $page.find("#editta").click(function(){
		 var seles = analyzeTable.bootstrapTable("getSelections");
			if(seles.length!=1){
					alert("请选择一条数据进行分析!");
					return;
			}
		 closeAndOpenInnerPageTab("analyzeApply","分析申请单","dev_construction/requirement/requirement_terminate/analyze/analyze_edit.html", function(){
			 terAnalyzeEdit(seles[0]);
			});
	 });

	//查看申请单
	 $page.find("#viewta").click(function(){
		 var seles = analyzeTable.bootstrapTable("getSelections");
			if(seles.length!=1){
					alert("请选择一条数据进行查看!");
					return;
			}
			closeAndOpenInnerPageTab("viewAnalyze","查看申请单","dev_construction/requirement/requirement_terminate/analyze/analyze_edit.html", function(){
				terAnalyzeEdit(seles[0],"view");
			});
				
	 });
	 
	 //初始化表
	function initTerAnalyzeTable() {
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		analyzeTable.bootstrapTable({
					url :dev_construction+"req_terminate/queryReqTerminateList.asp?SID=" + SID + "&call=" + analyzeCall + "&TYPE=2",
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
					jsonpCallback:analyzeCall,
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
						width : 70,
						align : "center",
						formatter:function(value,row,index){
							return index + 1;
						}
					},{
						field : "REQ_TERMINATE_NUM",
						title : "需求终止ID",
						align : "center",
						visible : false
					},{
						field : "REQ_TERMINATE_ID",
						title : "申请单编号",
						width : 180,
						align : "center"
					},{
						field : "REQ_CODE",
						title : "需求编号",
						width : 180,
						align : "center"
					}, {
						field : "REQ_NAME",
						title : "需求名称",
						width : 180,
						align : "center",
						formatter:function(value,row,index){
							return '<a style="color:blue" href="javascript:void(0)" onclick="openReqDetail(\''+row.REQ_ID+'\')";>'+value+'</a>';
						}
					}, {
						field : 'REQ_TERMINATE_STATE_NAME',
						title : '申请单状态',
						width : 150,
						align : "center",
					},{
						field : "CREATE_NAME",
						title : "申请人",
						align : "center",
						width : 150
					},  {
						field : "CREATE_TIME",
						title : "申请时间",
						align : "center",
						width : 150
					}]
				});
	}
	
}
//打开紧急需求点详情页面
function openEmSubReqDetail(req_id){
	closeAndOpenInnerPageTab("emsubreq_detail","紧急需求点详情","dev_construction/requirement/requirement_analyze/split_subreq/splitEmSubreq_detail.html",function(){
		initEmReqSplitDetail(req_id);//初始化页面信息
		});	
}

//打开需求点详情页面
function openSubReqDetail(req_id){
	closeAndOpenInnerPageTab("subreq_detail","需求点详情","dev_construction/requirement/requirement_analyze/split_subreq/splitSubreq_detail.html",function(){
		initSplitReqDetailLayOut(req_id);
	});
}
function openReqDetail(req_id){
	closeAndOpenInnerPageTab("requirement_360view","业务需求360页面","dev_construction/requirement/reqTask_follower/requirement_360view.html",function(){
		initReqInfoInView(req_id);
		initFollowerTaskQuery(req_id);
		reqChange_info(req_id);
		reqStop_info(req_id);
	});
}