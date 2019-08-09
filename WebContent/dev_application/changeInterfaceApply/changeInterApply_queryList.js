//初始化事件
initUseAppOrderListLayOut();

function initUseAppOrderListLayOut(){
	var $page = getCurrentPageObj();//当前页
	var $select = $page.find("select[name='app_status']");
	var arr = ['03','04'];//过滤下拉选数据
	initSelect($select,{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:$select.attr("diccode")},null, null,arr);
	var form = $page.find("#changeInterfaceApply_query");//表单对象
	var tableCall=getMillisecond();//table回调方法名
	
	//服务方 pop框按钮
	$page.find("[name='ser_system_name']").click(function(){
		var $name = $page.find("[name='ser_system_name']");
		var $id = $page.find("[name='con_system_id']");
		var $systemPop = $page.find("[mod='systemPop']");
		query_systemPop($systemPop, {id : $id, name : $name});
	});
	//初始化列表
	initAppTable();
	
	//重置按钮
	$page.find("[btn='reset_appList']").click(function(){
		$page.find("table input").val("");
		$page.find("select").val(" ").select2();
	});
	
	//查询按钮
	 $page.find("[btn='query_appList']").click(function(){
		 var param = form.serialize();
		 $page.find('[tb="useAppOrderlist"]').bootstrapTable('refresh',{
				url:dev_application+"InterchangeApp/changeAppQueryList.asp?SID=" + SID + "&call=" + tableCall +'&'+param});
		
	 });
	//enter触发查询
		enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("[btn='query_appList']").click();});
	//填写申请单
	 $page.find("[btn='addOrder_appList']").click(function(){
		 closeAndOpenInnerPageTab("addOrder_changeAppList","填写申请单","dev_application/changeInterfaceApply/changeInterApply_edit.html", function(){
			 initChangeAppLayOut();
			});
	 });
	//修改申请单
	 $page.find("[btn='updateOrder_appList']").click(function(){
		 var seles = $page.find('[tb="useAppOrderlist"]').bootstrapTable("getSelections");
		if(seles.length!=1){
			alert("请选择一条数据进行修改!");
			return;
		}
		if(seles[0].APP_STATUS =="01" || seles[0].APP_STATUS =="03" || seles[0].APP_STATUS =="05"){
			alert("该申请已发起");
			return;
		}
		var selesInfo=JSON.stringify(seles);
		var params=JSON.parse(selesInfo);
		 closeAndOpenInnerPageTab("addOrder_changeAppList","修改申请单","dev_application/changeInterfaceApply/changeInterApply_edit.html", function(){
			 initChangeAppLayOut(params[0]);
			});
	 });
	 
	//删除申请单
	 $page.find("[btn='deleteOrder_appList']").click(function(){
		 var seles = $page.find('[tb="useAppOrderlist"]').bootstrapTable("getSelections");
			if(seles.length!=1){
					alert("请选择一条数据进行删除!");
					return;
			}
			if(seles[0].APP_STATUS !="00"){
				alert("该申请不是草拟，不能删除");
				return;
			}
			var dCall = getMillisecond();
			//初始化属性table
			baseAjaxJsonp(dev_application+"useApplyManage/deleteApp.asp?SID=" + SID + "&call=" + dCall, 
					{record_app_num : seles[0].RECORD_APP_NUM}, function(data) {
				alert(data.msg);
				if(data && data.result=="true"){
					$page.find('[tb="useAppOrderlist"]').bootstrapTable('refresh',{
						url:dev_application+"InterchangeApp/changeAppQueryList.asp?SID=" + SID + "&call=" + tableCall});
				}
			},dCall,false);
	 });
	//提交申请单
	 $page.find("[btn='submitOrder_appList']").click(function(){
		 var seles = $page.find('[tb="useAppOrderlist"]').bootstrapTable("getSelections");
			if(seles.length!=1){
					alert("请选择一条数据进行提交!");
					return;
			}
			if(seles[0].APP_STATUS =="01" || seles[0].APP_STATUS =="03" || seles[0].APP_STATUS =="05"){
				alert("该申请已提交");
				return;
			}
			var sCall = getMillisecond();
			//初始化属性table
			baseAjaxJsonp(dev_application+"useApplyManage/submitApp.asp?SID=" + SID + "&call=" + sCall, 
					{record_app_num : seles[0].RECORD_APP_NUM}, function(data) {
				if(data && data.result=="true"){
					alert("提交成功");
					$page.find('[tb="useAppOrderlist"]').bootstrapTable('refresh',{
						url:dev_application+"useApplyManage/useAppQueryList.asp?SID=" + SID + "&call=" + tableCall});
				}else if(data && data.result=="noInterApp"){
					alert("该申请单尚未添加接口");
				}else{
					alert("提交失败");
				}
			},sCall,false);
	 });
	//查看申请单
	 $page.find("[btn='viewOrder_appList']").click(function(){
		 var seles = $page.find('[tb="useAppOrderlist"]').bootstrapTable("getSelections");
			if(seles.length!=1){
					alert("请选择一条数据进行查看!");
					return;
			}
			var selesInfo=JSON.stringify(seles);
			var params=JSON.parse(selesInfo);
			 closeAndOpenInnerPageTab("addOrder_appList","查看申请单","dev_application/changeInterfaceApply/changeInterApply_check.html", function(){
				 initChangeAppLayOut(params[0],"view");
				 getCurrentPageObj().find("#chaeinterApp1").hide();
				 getCurrentPageObj().find("#chaeinterApp2").hide();
				 getCurrentPageObj().find("#InputContentView").hide();
				 getCurrentPageObj().find("#OutputContentView").hide();
				 getCurrentPageObj().find("input,select,textarea").not("[name='closePageTabConfirm']").attr("disabled","disabled");
				 
			});
	 });
	 
	 
	 
	function initAppTable() {
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		$page.find('[tb="useAppOrderlist"]').bootstrapTable({
					url :dev_application+"InterchangeApp/changeAppQueryList.asp?SID=" + SID + "&call=" + tableCall,
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
					uniqueId : "RECORD_APP_NUM", // 每一行的唯一标识，一般为主键列
					cardView : false, // 是否显示详细视图
					detailView : false, // 是否显示父子表
					singleSelect : true,// 复选框单选
					jsonpCallback:tableCall,
					onLoadSuccess : function(data){
						gaveInfo();
					},
					columns : [ {
						checkbox : true,
						rowspan : 2,
						align : 'center',
						valign : 'middle'
					},{
						field : 'order_id',
						title : '序号',
						align : "center",
						width : "60",
						formatter:function(value,row,index){
							return index + 1;
						}
					},  {
						field : 'RECORD_APP_NUM',
						title : '申请单编号',
						align : "center",
						width : "150"
					},  {
						field : "SER_SYSTEM_NAME",
						title : "变更应用名称",
						align : "center"
					}, {
						field : "APP_NAME",
						title : "变更申请名称",
						align : "center"
					}, {
						field : "REQ_FINISH_TIME",
						title : "要求完成时间",
						align : "center"
					}, {
						field : "APP_STATUS_NAME",
						title : "申请单状态",
						align : "center",
						width : "150",
					}, {
						field : "APP_USER_NAME",
						title : "申请人",
						align : "center"
					}, {
						field : "CURRENT_MAN",
						title : "当前处理人",
						align : "center"
					}, {
						field : "APP_TIME",
						title : "申请时间",
						align : "center",
						width : '200'
					}]
				});
	}
	
}