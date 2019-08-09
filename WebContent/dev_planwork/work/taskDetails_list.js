	//审批通过
	$("#details_pass").click(function(){
		var id = $("#pop_taskDetailsTable").bootstrapTable('getSelections');
		if(id.length<1){
			alert("请至少选择一条数据!");
			return ;
		}
		var ids = $.map(id, function (row) {
			return row.PK_ID;                    
		});
		var call = getMillisecond();
		baseAjaxJsonp(dev_planwork + 'workCon/approval.asp?call=' + call+ '&SID=' + SID, {ids:ids.toString(),status:'02'},//02审批通过操作
			function(msg) {
			if(msg.result){
				alert("审批通过成功！");
			 }
			}, call);
	});
	
	//审批打回
	$("#details_back").click(function(){
		var id = $("#pop_taskDetailsTable").bootstrapTable('getSelections');
		if(id.length<1){
			alert("请至少选择一条数据!");
			return ;
		}
		var ids = $.map(id, function (row) {
			return row.PK_ID;                    
		});
		var call = getMillisecond();
		baseAjaxJsonp(dev_planwork + 'workCon/approval.asp?call=' + call+ '&SID=' + SID, {ids:ids.toString(),status:'03'},//03审批打回操作
			function(msg) {
			if(msg.result){
				alert("审批打回成功！");
			 }
			}, call);
	});
var mcall = getMillisecond();
function inittaskDetailsInfoPage(callparams){
	var url = dev_planwork + 'workCon/queryPersonalTaskDetails.asp?call=' + mcall+ '&SID=' + SID;
	
	taskDetailsPop("#pop_taskDetailsTable",url,callparams);
}


/**
	 * 用户POP框
	 */
	function taskDetailsPop(userTable,userUrl,userParam){
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset, //页码
					w_id:userParam.w_id,
					staff_id:userParam.staff_id,
					month:userParam.month
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
	      	  field: 'PK_ID',
	    	  title: '主键',
	    	  align:"center",
	    	  visible:false
	      },{
	    	  field: 'PROJECTNAME',
	    	  title: '项目名称',
	    	  align:"center",
	    	  width:"20%"
	      },{
	    	  field: 'PLANNAME',
	    	  title: '任务名称 ',
	    	  align:"center",
	    	  width:"20%"
	      },{
	      	  field: 'WDATA',
	    	  title: '报工日期',
	    	  align:"center",
	    	  width:"12%"
	      },{
	    	  field: 'INPUTTIME',
	    	  title: '报工工时（小时） ',
	    	  align:"center",
	    	  width:"12%"
	      },{
	    	  field: 'INPUTPER',
	    	  title: '完成百分比',
	    	  align:"center",
	    	  width:"12%"
	      },{
	    	  field: 'REMARK',
	    	  title: '备注说明',
	    	  width:"20%"
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
					jsonpCallback : mcall,
					//singleSelect: singleSelect,
					onDblClickRow:function(row){
						
					},
					columns : columns
				});
		
	}
	
	