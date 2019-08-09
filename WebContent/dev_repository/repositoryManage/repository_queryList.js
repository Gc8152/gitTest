//初始化事件
initReposittoryListLayOut();

function initReposittoryListLayOut(){
	var $page = getCurrentPageObj();//当前页
	 
	var form = $page.find("#repository_query");//表单对象
	
	initSelect($page.find("[name='STATUS']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"K_DIC_INTELL_STATUS"});
	
	$page.find("#category_name").click(function(){
		openSelectTreeDivToBody($(this),"categorySelectTree","Repository/queryCategoryTreeList.asp",30,function(node){
			$page.find("#category_name").val(node.name);
			$page.find("#category_code").val(node.id);
			return true;
		});
	});
	
	var tableCall=getMillisecond();//table回调方法名
	//初始化列表
	initRepositoryTable();
	//重置按钮
	$page.find("[btn='reset_repositoryList']").click(function(){
		$page.find("table input").val("");
		$page.find("select").val(" ").select2();
	});
	
	//查询按钮
	 $page.find("[btn='query_repositoryList']").click(function(){
		 var param = form.serialize();
		
		  $page.find('[tb="repositoryList"]').bootstrapTable('refresh',{
				url:"Repository/queryIntell.asp?SID=" + SID + "&call=" + tableCall +'&'+param});
		
	 });
	//enter触发查询
		enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("[btn='query_repositoryList']").click();});
	
		//新增
	 $page.find("[btn='add_repList']").click(function(){
		 closeAndOpenInnerPageTab("repository_add","知识新增","dev_repository/repositoryManage/repository_add.html", function(){
			 initRepositoryAddOrUpdateLayOut(null,"add");
			});
	 });
	//知识维护(修改)
	 $page.find("[btn='update_repList']").click(function(){
		var seles = $page.find('[tb="repositoryList"]').bootstrapTable("getSelections");
		if(seles.length!=1){
				alert("请选择一条数据进行修改!");
				return;
		}
		//00草拟  01已发布 02 取消发布 03历史 04 已删除
		if(seles[0].STATUS == "03" || seles[0].STATUS =="04"  ){
			alert("该数据只能是草拟或已发布");
			return;
		}
		 closeAndOpenInnerPageTab("repository_edit","知识维护","dev_repository/repositoryManage/repository_edit.html", function(){
			 initRepositoryAddOrUpdateLayOut(seles[0],"edit");
			
			});
	 });
	 //知识审核发布
	 $page.find("[btn='release_repList']").click(function(){
		 var seles = $page.find('[tb="repositoryList"]').bootstrapTable("getSelections");
		
		 if(seles.length!=1){
			 alert("请选择一条数据!");
			 return;
		 }
		 //00草拟  01已发布 02 取消发布 03历史 04 已删除
		 if(seles[0].STATUS =="01" || seles[0].STATUS =="03"||seles[0].STATUS =="04"){
			 alert("该条数据不是草拟或者取消状态");
			 return;
		 }
		 var sCall = getMillisecond();
		 nconfirm("是否确定审核通过该条知识信息？",function(){ 
			 baseAjax("Repository/releaseRepository.asp?SID=" + SID , 
					 seles[0] , function(data) {
				 
						 if(data && data.result == 'true'){
							 alert("审核成功");
							 $page.find('[tb="repositoryList"]').bootstrapTable('refresh',{
								 url:"Repository/queryIntell.asp?SID=" + SID + "&call=" + tableCall});
						 }else{
							 alert("审核失败");
						 }
					 });
			 });
	 });
	//知识取消发布
	 $page.find("[btn='cannel_repList']").click(function(){
		 var seles = $page.find('[tb="repositoryList"]').bootstrapTable("getSelections");
			if(seles.length!=1){
					alert("请选择一条已发布数据!");
					return;
			}
			//00草拟  01已发布 02 取消发布 03历史 04已删除
			if(seles[0].STATUS !="01" ){
				alert("该条数据不是发布状态");
				return;
			}
			nconfirm("是否确定取消发布该条知识信息？",function(){ 
				submitInfo(seles[0],"cannel");
			});
	 });
	//知识过期
	 $page.find("[btn='overdue_repList']").click(function(){
		 var seles = $page.find('[tb="repositoryList"]').bootstrapTable("getSelections");
		 if(seles.length!=1){
			 alert("请选择一条已发布数据!");
			 return;
		 }
		 //00草拟  01已发布 02 取消发布 03历史 04 已删除
		 if(seles[0].STATUS =="00"){
			 alert("该条数据为草拟状态，不可设置为过期，您可对其进行发布或删除操作！");
			 return;
		 }else if(seles[0].STATUS =="03"){
			 alert("该条数据已为历史状态，无需重复设置过期！");
			 return;
		 }else if(seles[0].STATUS =="01" || seles[0].STATUS =="02"){
			 nconfirm("是否确定将该条知识信息设置为过期？",function(){
				 submitInfo(seles[0],"overdue");
			 });
		 }
	 });
	//删除知识
	 $page.find("[btn='delete_repList']").click(function(){
		 var seles = $page.find('[tb="repositoryList"]').bootstrapTable("getSelections");
			if(seles.length!=1){
					alert("请选择一条数据进行删除!");
					return;
			}
			if(seles[0].STATUS !="00"){
				alert("该申请不是草拟状态，不能删除");
				return;
			}
			nconfirm("是否确定删除该条数据？",function(){
				submitInfo(seles[0],"delete");
			});
	 });
	 //三个按钮的公共方法
	 function  submitInfo(param,type){
		 //param.TYPE = type;
		 param['TYPE'] = type;
		 var sCall = getMillisecond();
			//初始化属性table
		baseAjax("Repository/cannelOroverdueOrDelete.asp?SID=" + SID , 
				param, function(data) {
			if(data && data.result=="true"){
				alert("操作成功");
				$page.find('[tb="repositoryList"]').bootstrapTable('refresh',{
					url:"Repository/queryIntell.asp?SID=" + SID + "&call=" + tableCall});
			}else{
				alert("操作失败");
			}
		},sCall,false);
	 }
	
	 //初始化表
	function initRepositoryTable() {
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		getCurrentPageObj().find('[tb="repositoryList"]').bootstrapTable({
					url :"Repository/queryIntell.asp?SID=" + SID + "&call=" + tableCall,
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
					uniqueId : "INTELL_ID", // 每一行的唯一标识，一般为主键列
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
						field : '',
						title : '序号',
						align : "center",
						width : "80",
						formatter:function(value,row,index){
							return index + 1;
						}
					},  {
						field : 'INTELL_CODE',
						title : '知识编号',
						width : "130",
						align : "center",
					}, {
						field : "TITLE",
						title : "标题",
						width : "180",
						align : "center"
					}, {
						field : "CATEGORY_NAME",
						title : "类别",
						align : "center"
					}, {
						field : "STATUS_NAME",
						title : "状态",
						width : "100",
						align : "center",
						width : "150"
					}, {
						field : "VERSION_CODE",
						title : "最新版本",
						width : "100",
						align : "center"
					}, {
						field : "CREATE_PERSON_NAME",
						title : "上传人",
						align : "center",
						width : "100"
					}, {
						field : "RELEASE_TIME",
						title : "最新发布日期",
						align : "center"
					}, {
						field : "RELEASE_PERSON_NAME",
						title : "发布人",
						align : "center"
					
					}]
				});
	}
	
}