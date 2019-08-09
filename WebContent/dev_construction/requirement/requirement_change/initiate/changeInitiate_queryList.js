//初始化事件
initChangeInitiateList();

function initChangeInitiateList(){
	var $page = getCurrentPageObj();//当前页
	autoInitSelect($page);//初始化下拉选
	var form = $page.find("#changeInitiateForm");//表单对象
	var initiateCall=getMillisecond();//table回调方法名
	var initiateTable = $page.find("#ChangeInitiateTable");
	
	//初始化列表
	initChangeInitiateTable();
	//重置按钮
	$page.find("#resetInitiate").click(function(){
		$page.find("table input").val("");
		$page.find("select").val(" ").select2();
	});
	
	//查询按钮
	 $page.find("#queryInitiate").click(function(){
		 var param = form.serialize();
		 initiateTable.bootstrapTable('refresh',{
				url:dev_construction+"requirement_change/queryReqChangeList.asp?SID=" + SID + "&ROLE=1&call=" + initiateCall +'&'+param});
		
	 });
	 //注册绑定enter按钮事件
	 enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#queryInitiate").click();});
	//填写申请单
	 $page.find("#changeApply").click(function(){
		 closeAndOpenInnerPageTab("changeApply","填写申请单","dev_construction/requirement/requirement_change/initiate/changeInitiate_edit.html", function(){
			 changeInitiateEdit(null);
			});
	 });
	//修改申请单
	 $page.find("#updateApply").click(function(){
		var seles = initiateTable.bootstrapTable("getSelections");
		if(seles.length!=1){
				alert("请选择一条数据进行修改!");
				return;
		}
		
		if(seles[0].REQ_CHANGE_STATUS == "02"){
			alert("分析不通过不能修改");
			return;
		}
		var selesInfo=JSON.stringify(seles);
		var params=JSON.parse(selesInfo);
		 closeAndOpenInnerPageTab("updateApply","修改申请单","dev_construction/requirement/requirement_change/initiate/changeInitiate_edit.html", function(){
			 changeInitiateEdit(params[0]);
			});
	 });
	 
	//删除申请单
	 $page.find("#deleteApply").click(function(){
		 var seles = initiateTable.bootstrapTable("getSelections");
			if(seles.length!=1){
					alert("请选择一条数据进行删除!");
					return;
			}
			if(seles[0].REQ_CHANGE_STATUS !="00"){
				alert("该申请不是草拟，不能删除");
				return;
			}
			var dCall = getMillisecond();
			baseAjaxJsonp(dev_construction+"requirement_change/editAppInfo.asp?SID=" + SID + "&call=" + dCall, 
					{REQ_CHANGE_ID : seles[0].REQ_CHANGE_ID , OPT_TYPE : "delete"}, function(data) {
				if(data && data.result=="true"){
					alert(data.msg);
					initiateTable.bootstrapTable('refresh',{
						url:dev_construction+"requirement_change/queryReqChangeList.asp?SID=" + SID + "&ROLE=1&call=" + initiateCall});
				}else{
					alert(data.msg);
				}
			},dCall,false);
	 });
	 
	//提交申请单
	 $page.find("#submitApply").click(function(){
		 var seles = initiateTable.bootstrapTable("getSelections");
			if(seles.length!=1){
					alert("请选择一条数据进行提交!");
					return;
			}
			if(seles[0].REQ_CHANGE_STATUS !="00"){
				alert("该申请不是草拟状态");
				return;
			}
			var submitCall = getMillisecond();
			var pramas = {};
			pramas["REQ_CHANGE_ID"] =  seles[0].REQ_CHANGE_ID;
	 		pramas["OPT_TYPE"] =  "onlysubmit";
	 		pramas["REQ_CHANGE_NUM"] =  seles[0].REQ_CHANGE_NUM;
	 		pramas["REQ_PRODUCT_MANAGER"] =  seles[0].REQ_PRODUCT_MANAGER;
	 		pramas["CHANGE_ANALYZE_ID"] =  seles[0].CHANGE_ANALYZE_ID;
			baseAjaxJsonp(dev_construction+"requirement_change/editAppInfo.asp?SID=" + SID + "&call=" + submitCall, pramas, function(data) {
				if(data && data.result=="true"){
					alert(data.msg);
					initiateTable.bootstrapTable('refresh',{
						url:dev_construction+"requirement_change/queryReqChangeList.asp?SID=" + SID + "&ROLE=1&call=" + initiateCall});
				}else{
					alert(data.msg);
				}
			},submitCall,false);
	 });
	 


	//查看申请单
	 $page.find("#viewApply").click(function(){
		 var seles = initiateTable.bootstrapTable("getSelections");
			if(seles.length!=1){
					alert("请选择一条数据进行查看!");
					return;
			}
			var status = seles[0].REQ_CHANGE_STATUS;
			if(status == '02'){
				
				 closeAndOpenInnerPageTab("viewAnalyze","查看申请单","dev_construction/requirement/requirement_change/analyze/changeAnalyze_view.html", function(){
					 changeAnalyzeView(seles[0]);
					});
				
			}else if(status == '00'){
			 closeAndOpenInnerPageTab("viewApply","查看申请单","dev_construction/requirement/requirement_change/initiate/changeInitiate_view.html", function(){
				 changeInitiateView(seles[0]);
				});
			}else if(status == '05'){
				var calla = getMillisecond()+'1';
				baseAjaxJsonp(dev_construction+"requirement_change/queryApproveList.asp?SID="+SID+"&call="+calla+"&REQ_CHANGE_NUM="+seles[0].REQ_CHANGE_NUM,null, function(msg){
					closeAndOpenInnerPageTab("viewQuery","查看申请单","dev_construction/requirement/requirement_change/query/changeQuery_view.html",function(){
						initTitle(msg.rows[0]["INSTANCE_ID"]);
						initAFApprovalInfo(msg.rows[0]["INSTANCE_ID"],'0');
						changeQueryView(msg.rows[0]);
					});
				}, calla);
			}
	 });
	 
	 //初始化表
	function initChangeInitiateTable() {
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		initiateTable.bootstrapTable({
					url :dev_construction+"requirement_change/queryReqChangeList.asp?SID=" + SID + "&ROLE=1&call=" + initiateCall,
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
					jsonpCallback:initiateCall,
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
						align : "center"
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