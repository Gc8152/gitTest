

//初始化事件
initChangeApproveList();

function initChangeApproveList(){
	var $page = getCurrentPageObj();//当前页
	autoInitSelect($page);//初始化下拉选
	var form = $page.find("#changeApproveForm");//表单对象
	var ApproveCall=getMillisecond();//table回调方法名
	var ApproveTable = $page.find("#ChangeApproveTable");
	
	//初始化列表
	initChangeApproveTable();
	//重置按钮
	$page.find("#resetApprove").click(function(){
		$page.find("table input").val("");
		//$page.find("select").val(" ").select2();
	});
	
	//查询按钮
	 $page.find("#queryApprove").click(function(){
		 var param = form.serialize();
		 ApproveTable.bootstrapTable('refresh',{
				url:dev_construction+"requirement_change/queryApproveList.asp?SID=" + SID + "&TYPE=1&call=" + ApproveCall +'&'+param});
		
	 });
	 //enter按钮绑定查询事件
	 enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#queryApprove").click();});
	//变更审批
	 $page.find("#changeApprove").click(function(){
		var seles = ApproveTable.bootstrapTable("getSelections");
		if(seles.length!=1){
				alert("请选择一条数据进行审批!");
				return;
		}
		if(seles[0].REQ_CHANGE_STATUS !="03"){
			alert("不在审批中状态");
			return;
		}
		 closeAndOpenInnerPageTab("changeApprove","变更审批","dev_construction/requirement/requirement_change/approve/changeApprove_edit.html", function(){
			 initTitle(seles[0].INSTANCE_ID);
			 initAFApprovalInfo(seles[0].INSTANCE_ID);
			 changeApproveEdit(seles[0]);
			});
	 });

	//查看详情
	 $page.find("#viewApprove").click(function(){
		 var seles = ApproveTable.bootstrapTable("getSelections");
			if(seles.length!=1){
					alert("请选择一条数据进行查看!");
					return;
			}
			 closeAndOpenInnerPageTab("viewApprove","查看申请单","dev_construction/requirement/requirement_change/approve/changeApprove_view.html", function(){
				 initTitle(seles[0].INSTANCE_ID);
				 initAFApprovalInfo(seles[0].INSTANCE_ID,'0');
				 changeApproveView(seles[0]);
				});
	 });
	 
	 //初始化表
	function initChangeApproveTable() {
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		ApproveTable.bootstrapTable({
					url :dev_construction+"requirement_change/queryApproveList.asp?SID=" + SID + "&TYPE=1&call=" + ApproveCall,
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
					jsonpCallback:ApproveCall,
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