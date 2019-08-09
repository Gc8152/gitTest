//初始化事件
initQueryList();

function initQueryList(){
	var $page = getCurrentPageObj();//当前页
	autoInitSelect($page);//初始化下拉选
	var form = $page.find("#queryForm");//表单对象
	var QueryCall=getMillisecond();//table回调方法名
	var QueryTable = $page.find("#QueryTable");
	
	//初始化列表
	initQueryTable();
	//重置按钮
	$page.find("#resetQ").click(function(){
		$page.find("table input").val("");
		$page.find("select").val(" ").select2();
	});
	
	//查询按钮
	 $page.find("#queryQ").click(function(){
		 var param = form.serialize();
		 QueryTable.bootstrapTable('refresh',{
				url:dev_construction+"requirement_change/queryApproveList.asp?SID=" + SID + "&TYPE=2&call=" + QueryCall +'&'+param});
		
	 });
	 //enter按键绑定查询事件
	 enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#queryQ").click();});

	//查看详情
	 $page.find("#viewQuery").click(function(){
		 var seles = QueryTable.bootstrapTable("getSelections");
			if(seles.length!=1){
					alert("请选择一条数据进行查看!");
					return;
			}
			var state = seles[0].REQ_CHANGE_STATUS;
			if(state == '03' || state == '04' || state == '05'){
				closeAndOpenInnerPageTab("QviewQuery","查看申请单","dev_construction/requirement/requirement_change/query/changeQuery_view.html", function(){
				 initTitle(seles[0].INSTANCE_ID);
				 initAFApprovalInfo(seles[0].INSTANCE_ID,'0');
				 changeQueryView(seles[0]);
				});
			}
			if(state == '01'){
				 closeAndOpenInnerPageTab("QviewApply","查看申请单","dev_construction/requirement/requirement_change/initiate/changeInitiate_view.html", function(){
					 changeInitiateView(seles[0]);
				});
				
			}
			if(state == '02'){
				 closeAndOpenInnerPageTab("QviewAnalyze","查看申请单","dev_construction/requirement/requirement_change/analyze/changeAnalyze_view.html", function(){
					 changeAnalyzeView(seles[0]);
				});
				
			}
			
	 });
	 
	 //初始化表
	function initQueryTable() {
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		QueryTable.bootstrapTable({
					url :dev_construction+"requirement_change/queryApproveList.asp?SID=" + SID + "&TYPE=2&call=" + QueryCall,
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
					jsonpCallback:QueryCall,
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
						width : "14%",
						align : "center"
					}, {
						field : "REQ_NAME",
						title : "需求名称",
						width : "18%",
						align : "center",
						formatter:function(value,row,index){
							return '<a style="color:blue" href="javascript:void(0)" onclick="openReqDetail(\''+row.REQ_ID+'\')";>'+value+'</a>';
						}
					}, {
						field : "REQ_CHANGE_STATUS_NAME",
						title : "需求变更状态",
						width : "12%",
						align : "center"
					},{
						field : "CHANGE_BUSINESSER",
						title : "业务联系人",
						width : "10%",
						align : "center"
					}, {
						field : "CREATE_NAME",
						title : "申请人",
						align : "center",
						width : "10%"
					},  {
						field : "SUBMIT_TIME",
						title : "申请时间",
						align : "center",
						width : "13%"
					},  {
						field : "CURRENT_MAN",
						title : "当前处理人",
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
