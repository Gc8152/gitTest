initDefectList();

function initDefectList(){
	var $page = getCurrentPageObj();//当前页
	autoInitSelect($page);//初始化下拉选
	var formObj = $page.find("#defectForm");//表单对象
	var initTableCall = getMillisecond();//table回调方法名
	var defectTable = $page.find("[tb='defectTable']");
	
	//初始化列表
	inittestDefect();
	
	$page.find("[name='chooseDefect']").click(function(){
		var defectTable=$page.find("[tb='defectTable']");
		var case_id=getCurrentPageObj().find("#CASE_ID").val();
		var test_round=getCurrentPageObj().find("#TEST_ROUND").val();
		var func_id=getCurrentPageObj().find("#FUNC_ID").val();
		var seles = defectTable.bootstrapTable("getSelections");
		var defectCall = getMillisecond();
		baseAjaxJsonp(dev_test+"testTaskExecute/updateDefectCase.asp?SID=" + SID + "&call=" + defectCall+"&CASE_ID="+case_id+"&DEFECT_ID="+seles[0].DEFECT_ID+"&TEST_ROUND="+test_round+"&FUNC_ID="+func_id, null, function(data) {
			if(data && data.result=="true"){
				closeCurrPageTab();
			}else{
				alert(data.msg);
			}
		},defectCall,false);
		
		
	});
	//重置按钮
	$page.find("[name='resetDefect']").click(function(){
		$page.find("table input").val("");
		$page.find("select").val(" ").select2();
	});
	
	//查询按钮
	 $page.find("[name='queryDefect']").click(function(){
		 var param = formObj.serialize();
		 defectTable.bootstrapTable('refresh',{	
			    url:dev_test+"testTaskExecute/queryDefectList.asp?SID=" + SID + "&call=" + initTableCall +'&'+param});
	 });
	//初始化表
	 function inittestDefect() {
	 	var queryParams = function(params) {
	 		var temp = {
	 			limit : params.limit, // 页面大小
	 			offset : params.offset
	 		// 页码
	 		};
	 		return temp;
	 	};
	 	defectTable.bootstrapTable({
	 				url : dev_test+"testTaskExecute/queryDefectList.asp?SID=" + SID + "&call=" + initTableCall,
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
	 				uniqueId : "DEFECT_ID", // 每一行的唯一标识，一般为主键列
	 				cardView : false, // 是否显示详细视图
	 				detailView : false, // 是否显示父子表
	 				singleSelect : true,// 复选框单选
	 				jsonpCallback: initTableCall,
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
	 					width : "120",
	 					formatter:function(value,row,index){
	 						return index + 1;
	 					}
	 				}, {
	 					field : "DEFECT_NUM",
	 					title : "缺陷编号",
	 					width : "120",
	 					align : "center"
	 				},{
	 					field : "SUMMARY",
	 					title : "缺陷摘要",
	 					width : "120",
	 					align : "center"
	 				}, {
	 					field : "PRIORITY_LEVEL_NAME",
	 					title : "缺陷优先级",
	 					align : "center",
	 					width : "120"
	 				}, {
	 					field : "SEVERITY_GRADE_NAME",
	 					title : "严重程度",
	 					align : "center",
	 					width : "120"
	 				},{
	 					field : "DEFECT_STATE_NAME",
	 					title : "缺陷状态",
	 					align : "center",
	 					width : "120"
	 				}]
	 			});
	 }
}
