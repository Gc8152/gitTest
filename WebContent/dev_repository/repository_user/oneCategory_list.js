//初始化事件
function initOneCategoryLayout(code){
	var aaa=code;
	var tableCall=getMillisecond();//table回调方法名
	var $page = getCurrentPageObj();//当前页
	$page.find("#category_code").val(code);
	autoInitSelect($page);
	initOneCategoryTable(code);
	var form=$page.find("#oneCategory_form");
	//重置按钮
	$page.find("[btn='reset_oneCategory']").click(function(){
		$page.find("table input[name!='CATEGORY_CODE']").val(" ");
		$page.find("select").val(" ").select2();
	});
	
	//查询按钮
	 $page.find("[btn='query_oneCategory']").click(function(){
		 var param = form.serialize();
		 $page.find('[tb="oneCategoryTable"]').bootstrapTable('refresh',{
				url:"Repository/queryBelongCategoryList.asp?SID=" + SID + "&call=" + tableCall +'&'+param});
		
	 });
	//enter触发查询
		enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("[btn='query_oneCategory']").click();});
	
	/*//查看详情
	 $page.find("[btn='view_oneCategory']").click(function(){
		 var seles = $page.find('[tb="oneCategoryTable"]').bootstrapTable("getSelections");
			if(seles.length!=1){
					alert("请选择一条数据!");
					return;
			}
			closeAndOpenInnerPageTab("view_OneCategory","详情","dev_repository/repository_user/repository_detail.html", function(){
				viewOneCategory(seles[0]);
			});
				
	 });*/
		//查看详情
	 $page.find("[btn='view_oneCategory']").click(function(){
		 var seles = $page.find('[tb="oneCategoryTable"]').bootstrapTable("getSelections");
			if(seles.length!=1){
					alert("请选择一条数据!");
					return;
			}
			closeAndOpenInnerPageTab("view","知识详情","dev_repository/repository_user/repository_detail.html", function(){
				repositoryOrVersion(seles[0],"view");
			});
				
	 });
		 
	 
	initOneCategoryTree(code);
	function initOneCategoryTree(code) {
		var setting = {
			async : {
				enable : true,
				url : "Repository/queryOneCategoryTreeList.asp?CATEGORY_CODE="+code,
				contentType : "application/json",
				type : "get"
			},
			view : {
				dblClickExpand : false,
				showLine : true,
				selectedMulti : false
			},
			data : {
				simpleData : {
					enable : true,
					idKey : "id",
					pIdKey : "pid",
					rootPId : ""
				}
			},
			callback : {
				onClick : function(event, treeId, treeNode) {
			
					$page.find("#category_code").val(treeNode.id);
					//var category_code =treeNode.id;
					var param = form.serialize();
					$page.find('[tb="oneCategoryTable"]').bootstrapTable('refresh',{
							url:"Repository/queryBelongCategoryList.asp?SID=" + SID + "&call=" + tableCall +'&'+param});
						
				}
			}
		};
		$.fn.zTree.init($("#treeOneCategoryTree"), setting);
	}
	
	
	

	function initOneCategoryTable(code) {
	
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		getCurrentPageObj().find('[tb="oneCategoryTable"]').bootstrapTable({
			
					url :"Repository/queryBelongCategoryList.asp?SID=" + SID + "&call=" + tableCall+"&CATEGORY_CODE="+code,
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
					//uniqueId : "INS_ID", // 每一行的唯一标识，一般为主键列
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
					}, 
					 	{
						field : "TITLE",
						title : "标题",
						align : "center"
					}, {
						field : "CATEGORY_NAME",
						title : "类别",
						align : "center"
					}, {
						field : "STATUS_NAME",
						title : "状态",
						align : "center",
						width : "150"
					}, 
					{
						field : "RELEASE_TIME",
						title : "发布日期",
						align : "center"
					}, {
						field : "RELEASE_PERSON_NAME",
						title : "发布人",
						align : "center"
					}]
				});
	}
	
	
}


