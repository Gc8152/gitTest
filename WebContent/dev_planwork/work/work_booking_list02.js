   var userWorkListParam={};
	//审批通过
	$("#taskPassThough").click(function(){
		var id = $("#pop_workBookingTable").bootstrapTable('getSelections');
		if(id.length<1){
			alert("请至少选择一条数据!");
			return ;
		}
		var ids = $.map(id, function (row) {
			return row.DUTY_MAN;
		});
//		alert(ids.toString());
		var call = getMillisecond();
		baseAjaxJsonp(dev_planwork + 'workCon/userApproval.asp?call=' + call+ '&SID=' + SID, {ids:ids.toString(),status:'02'},//02审批通过操作
			function(msg) {
			if(msg.result){
				alert("已经审批通过！");
                initworkBookingInfoPage(userWorkListParam);
			 }
			}, call);
	});
	
	//审批打回
	$("#taskBeatBack").click(function(){
		var id = $("#pop_workBookingTable").bootstrapTable('getSelections');
		if(id.length<1){
			alert("请至少选择一条数据!");
			return ;
		}
		var ids = $.map(id, function (row) {
			return row.DUTY_MAN;
		});
		var call = getMillisecond();
		baseAjaxJsonp(dev_planwork + 'workCon/userApproval.asp?call=' + call+ '&SID=' + SID, {ids:ids.toString(),status:'03'},//03审批打回操作
			function(msg) {
			if(msg.result){
				alert("已经审批打回！");
                initworkBookingInfoPage(userWorkListParam);
			 }
			}, call);
	});
	
	
var pcall = getMillisecond();
function initworkBookingInfoPage(callparams){
    userWorkListParam=callparams;
	var url = dev_planwork + 'workCon/queryDSPTaskList02.asp?call=' + pcall+ '&SID=' + SID;
	workBookingPop("#pop_workBookingTable",url,callparams);
}

/**
	 * 用户POP框
	 */
	function workBookingPop(userTable,userUrl,userParam){
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset, //页码
					org_no:userParam.org_no//项目主键
			};
			return temp;
		};	
		var columns=[{
	     			field : 'middle',
	     			checkbox : true,
	     			rowspan : 2,
	     			align : 'center',
	     			valign : 'middle'
	     		  }, {
	     			  field:"PLAN_ID",
		         	  title: '计划主键',
		         	  align:"center",
		         	  visible:false
	               }, {
		           	  field: 'DUTY_MAN',
		         	  title: '工号',
		         	  align:"center",
		         	  width:"260"
			       },{
		         	  field: 'USER_NAME',
		         	  title: '姓名',
		         	  align:"center",
		         	  width:"240"
		           },{
		         	  field: 'TOTAL',
		         	  title: '工作量（工时）',
		         	  align:"center",
		         	  width:"240"
		           }];
		
		//查询所有用户POP框
		$(userTable).bootstrapTable("destroy").bootstrapTable({
					//请求后台的URL（*）
					url : userUrl,
					method : 'get', //请求方式（*）   
					striped : true, //是否显示行间隔色
					cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
					sortable : true, //是否启用排序
					sortOrder : "asc", //排序方式
					queryParams : queryParams,//传递参数（*）
					sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
					pagination : true, //是否显示分页（*）
					pageList : [5,10,15],//每页的记录行数（*）
					pageNumber : 1, //初始化加载第一页，默认第一页
					pageSize : 10,//可供选择的每页的行数（*）
					clickToSelect : true, //是否启用点击选中行
					uniqueId : "user_no", //每一行的唯一标识，一般为主键列
					cardView : false, //是否显示详细视图
					detailView : false, //是否显示父子表
					jsonpCallback : pcall,
					onDblClickRow:function(row){
					},
					onLoadSuccess:function(data){
						gaveInfo();
					},
					 columns : columns,
					 onClickRow:function(rowIndex,rowData){
						 openInnerPageTab(
				      				"taskDetails",
				      				"个人报工明细页面",
				      				"dev_planwork/work/taskDetails_list02.html",
				      				function() {
				      					inittaskDetailsInfoPage({w_id:rowIndex.PLAN_ID,staff_id:rowIndex.DUTY_MAN});
				      				});
			          }
				});
		
	}