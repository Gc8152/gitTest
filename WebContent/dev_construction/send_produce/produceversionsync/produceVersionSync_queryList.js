//初始化事件
initVersionSyncList();

function initVersionSyncList(){
	var $page = getCurrentPageObj();//当前页
	//autoInitSelect($page);//初始化下拉选
	var form = $page.find("#syncForm");//表单对象
	var syncCall = getMillisecond();//table回调方法名
	var syncTable = $page.find("#versionSyncTab");
	var role = 'pm';
	//初始化列表
	initSyncTable();
	//重置按钮
	$page.find("#resetSync").click(function(){
		$page.find("table input").val("");
		//$page.find("select").val(" ").select2();
	});
	
	//查询按钮
	 $page.find("#querySync").click(function(){
		 var param = form.serialize();
		 syncTable.bootstrapTable('refresh',{
				url:dev_construction+"versionSync/queryVersionSyncList.asp?SID=" + SID + "&call=" + syncCall +'&'+param + "&ROLE=" + role});
		
	 });

	 enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#querySync").click();});
	//是否同步确认
	 $page.find("#editSync").click(function(){
		var seles = syncTable.bootstrapTable("getSelections");
		if(seles.length!=1){
				alert("请选择一条数据进行分析!");
				return;
		}
		if(seles[0].STATE !="00"){
			alert("该记录已处理完成");
			return;
		}
		 closeAndOpenInnerPageTab("editSync","生产版本同步分析","dev_construction/send_produce/produceversionsync/produceVersionSync_edit.html", function(){
			 editSyncEdit(seles[0],'pm');
			});
	 });

	//查看详情
	 $page.find("#viewSync").click(function(){
		 var seles = syncTable.bootstrapTable("getSelections");
			if(seles.length!=1){
					alert("请选择一条数据进行查看!");
					return;
			}
			 closeAndOpenInnerPageTab("viewSync","查看","dev_construction/send_produce/produceversionsync/produceVersionSync_view.html", function(){
				 viewSyncEdit(seles[0]);
				});
	 });
	 //初始化表
	function initSyncTable() {
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		syncTable.bootstrapTable({
					url :dev_construction+"versionSync/queryVersionSyncList.asp?SID=" + SID + "&call=" + syncCall + "&ROLE=" + role,
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
					uniqueId : "SYNC_ID", // 每一行的唯一标识，一般为主键列
					cardView : false, // 是否显示详细视图
					detailView : false, // 是否显示父子表
					singleSelect : true,// 复选框单选
					jsonpCallback:syncCall,
					onPreBody : function(data){
					},
					onLoadSuccess : function(data){
						gaveInfo();
					},
					columns : [ {
						checkbox : true,
						rowspan : 2,
						align : 'center',
						valign : 'middle'
					}
//					,{
//						field : 'ORDER_ID',
//						title : '序号',
//						align : "center",
//						width : "8%",
//						formatter:function(value,row,index){
//							return index + 1;
//						}
//					}
					, {
						field : "AUDIT_NO",
						title : "投产单编号",
						width : "18%",
						align : "center"
					}, {
						field : "SYSTEM_NAME",
						title : "应用名称",
						width : "13%",
						align : "center"
					}, {
						field : "VERSIONS_NAME",
						title : "版本名称",
						width : "16%",
						align : "center"
					},{
						field : "STATE",
						title : "同步状态",
						width : "13%",
						align : "center",
						formatter:function(value,row,index){
							var state = '';
							var is_sync = row.IS_SYNC;
							if(value == '00'){state = '同步待分析';}
							if(value == '01'){state = '同步待确认';}
							if(value == '02'){
								if(is_sync == '00'){state = '已完成同步';}
								if(is_sync == '01'){state = '关闭';}
							}
							return state;
						}
					},{
						field : "APPLY_PERSON_NAME",
						title : "申请人",
						width : "10%",
						align : "center"
					},{
						field : "CURRENT_DISPOSE_MAN",
						title : "当前处理人",
						width : "10%",
						align : "center"
					}, {
						field : "CREATE_APPLY_DATE",
						title : "投产申请日期",
						align : "center",
						width : "12%",
						formatter:function(value,row,index){
							return value.substr(0,10);
						}
					}, {
						field : "PRODUCE_TIME",
						title : "投产完成日期",
						align : "center",
						width : "12%"
					}]
				});
	}
	
}