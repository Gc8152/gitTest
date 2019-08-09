//初始化事件
initChangeAnalyzeList();

function initChangeAnalyzeList(){
	var $page = getCurrentPageObj();//当前页
	//autoInitSelect($page);//初始化下拉选
	var form = $page.find("#changeAnalyzeForm");//表单对象
	var AnalyzeCall=getMillisecond();//table回调方法名
	var AnalyzeTable = $page.find("#ChangeAnalyzeTable");
	
	//初始化列表
	initChangeAnalyzeTable();
	//重置按钮
	$page.find("#resetAnalyze").click(function(){
		$page.find("table input").val("");
		//$page.find("select").val(" ").select2();
	});
	
	//查询按钮
	 $page.find("#queryAnalyze").click(function(){
		 var param = form.serialize();
		 AnalyzeTable.bootstrapTable('refresh',{
				url:dev_construction+"requirement_change/queryReqChangeList.asp?SID=" + SID + "&ROLE=2&call=" + AnalyzeCall +'&'+param});
		
	 });
	 enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#queryAnalyze").click();});
	
	//变更分析
	 $page.find("#changeAnalyze").unbind().click(function(){
		var seles = AnalyzeTable.bootstrapTable("getSelections");
		if(seles.length!=1){
				alert("请选择一条数据进行分析!");
				return;
		}
		if(seles[0].REQ_CHANGE_STATUS !="01"){
			alert("该申请不在待分析状态");
			return;
		}
		var selesInfo=JSON.stringify(seles);
		var params=JSON.parse(selesInfo);
		 closeAndOpenInnerPageTab("changeAnalyze","变更分析","dev_construction/requirement/requirement_change/analyze/changeAnalyze_edit.html", function(){
			 changeAnalyzeEdit(params[0]);
			});
	 });

	//查看详情
	 $page.find("#viewAnalyze").click(function(){
		 var seles = AnalyzeTable.bootstrapTable("getSelections");
			if(seles.length!=1){
					alert("请选择一条数据进行查看!");
					return;
			}
			 closeAndOpenInnerPageTab("viewAnalyze","查看申请单","dev_construction/requirement/requirement_change/analyze/changeAnalyze_view.html", function(){
				 changeAnalyzeView(seles[0]);
				});
	 });
	 //初始化表
	function initChangeAnalyzeTable() {
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		AnalyzeTable.bootstrapTable({
					url :dev_construction+"requirement_change/queryReqChangeList.asp?SID=" + SID + "&ROLE=2&call=" + AnalyzeCall,
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
					uniqueId : "REQ_CHANGE_ID", // 每一行的唯一标识，一般为主键列
					cardView : false, // 是否显示详细视图
					detailView : false, // 是否显示父子表
					singleSelect : true,// 复选框单选
					jsonpCallback:AnalyzeCall,
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
						width : "8%",
						formatter:function(value,row,index){
							return index + 1;
						}
					}, {
						field : "REQ_CODE",
						title : "需求编号",
						width : "15%",
						align : "center"
					}, {
						field : "REQ_NAME",
						title : "需求名称",
						width : "20%",
						align : "center",
						formatter:function(value,row,index){
							return '<a style="color:blue" href="javascript:void(0)" onclick="openReqDetail(\''+row.REQ_ID+'\')";>'+value+'</a>';
						}
					}, {
						field : "REQ_CHANGE_STATUS_NAME",
						title : "需求变更状态",
						width : "16%",
						align : "center"
					},{
						field : "CHANGE_BUSINESSER",
						title : "业务联系人",
						width : "13%",
						align : "center"
					}, {
						field : "CREATE_NAME",
						title : "申请人",
						align : "center",
						width : "13%"
					},  {
						field : "SUBMIT_TIME",
						title : "申请时间",
						align : "center",
						width : "15%"
					}]
				});
	}
	
}

function openReqDetail(req_id){
	closeAndOpenInnerPageTab("requirement_360view","业务需求360页面","dev_construction/requirement/reqTask_follower/requirement_360view.html",function(){
		initReqInfoInView(req_id);
		initFollowerTaskQuery(req_id);
		reqChange_info(req_id);
		reqStop_info(req_id);
	});
}