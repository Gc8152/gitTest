//初始化事件
initReviewList();

function initReviewList(){
	var $page = getCurrentPageObj();//当前页
	autoInitSelect($page);//初始化下拉选
	var formObj = $page.find("#reviewTestCaseFrom");//表单对象
	var initTableCall = getMillisecond();//table回调方法名
	var reviewtestCases = $page.find("#reviewTestCaseTable");
	
	//初始化列表
	initreviewTestCases();
	//重置按钮
	$page.find("#resetReview").click(function(){
		$page.find("table input").val("");
		$page.find("select").val(" ").select2();
	});
	
	//查询按钮
	 $page.find("[name='queryCases']").click(function(){
		 var param = formObj.serialize();
			 reviewtestCases.bootstrapTable('refresh',{
				url: dev_test+"reviewTestCases/queryReviewList.asp?SID=" + SID + "&call=" + initTableCall+'&'+param});
		 
	 });
	 
	//enter触发查询
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("[name='queryCases']").click();});
	//上传评审文档
		 
	 $page.find("#importReviewDoc").unbind("click").click(function(){
		 var seles = reviewtestCases.bootstrapTable("getSelections");
			if(seles.length!=1){
					alert("请选择一条数据进行提交!");
					return;
			}
//      var accept_state = seles[0].ACCEPT_STATE;
//		if(accept_state == '07'){
//			alert("评审未通过无法上传");
//			return;
//		}
//		if(accept_state == '09'){
//			alert('该项目已经发起评审');
//			return;
//		}
//		if(accept_state == '10'){
//			alert("评审已结案无法导入");
//			return;
//		}
		importExcel.initUploadFile({title:"评审报告",
			templateUrl:"",file_id:seles[0]["PROJECT_ID"],path_id:"RW1001",call_func:function(){
				alert("上传成功");
				refreshTable();
			}});
	 });
	 
	
	
	 //初始化表
	function initreviewTestCases() {
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		reviewtestCases.bootstrapTable({
	        url : dev_test+"reviewTestCases/queryReviewList.asp?SID=" + SID + "&call=" + initTableCall,
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
			uniqueId : "PROJECT_NUM", // 每一行的唯一标识，一般为主键列
			cardView : false, // 是否显示详细视图
			detailView : false, // 是否显示父子表
			singleSelect : true,// 复选框单选
			jsonpCallback:initTableCall,
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
				width : "80",
				formatter:function(value,row,index){
					return index + 1;
				}
			}, {
				field : "PROJECT_NUM",
				title : "项目编号",
				width : "180",
				align : "center"
			}, {
				field : "PROJECT_NAME",
				title : "项目名称",
				width : "300",
				align : "center"
			}, {
				field : "TASK_NUM_COUNT",
				title : "需求任务数",
				width : "140",
				align : "center"
			},{
				field : "FUNC_NO_COUNT",
				title : "功能点数",
				width : "140",
				align : "center"
			}, {
				field : "PENDINGCASENUM",
				title : "测试案例数",
				align : "center",
				width : "140"
			},{
				field : "CASE_FILE_ID",
				title : "报告上传状态",
				align : "center",
				formatter:function(value,row,index){
					if(value){
						return "已上传";
					}
					return "未上传";
				}
			},{
				field : "CASE_FILE_Dowload",
				title : "评审报告",
				align : "center",
				formatter:function(value,row,index){
					if(row["CASE_FILE_ID"]){
						return "<a href='sfile/fileDownLoad.asp?id="+row["CASE_FILE_ID"]+"'>下载查看</a>";
					}
					return "--";
				}
			}]
		});
	}
	function refreshTable(){
		reviewtestCases.bootstrapTable('refresh',{
			url:dev_test+"reviewTestCases/queryReviewList.asp?SID=" + SID + "&call=" + initTableCall});
	}

}



