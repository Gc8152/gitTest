initSitReportQueryListLayout();

function initSitReportQueryListLayout(){
	
	var currTab = getCurrentPageObj();
	var queryForm = currTab.find("#sittestreport");
	var table = currTab.find("#sitreport_table");//列表
	var tableCall = getMillisecond();
	
	//初始化字典项
	autoInitSelect(queryForm);
	
 initSitTestReportBtn();
 function 	initSitTestReportBtn(){
	//加载版本pop
	currTab.find('#version_name').click(function(){
		openTaskVersionPop("vsersion_pop",{versionsid:getCurrentPageObj().find('#version_id'),versionsname:getCurrentPageObj().find('#version_name')});
	});
	//加载系统应用pop
	getCurrentPageObj().find('#system_name').click(function(){
		openTaskSystemPop("vsersion_pop",{sysno:getCurrentPageObj().find('#system_no'),sysname:getCurrentPageObj().find('#system_name')});
	});	
	//查询
	var query = currTab.find("#query");
	query.click(function(){
		var param = queryForm.serialize();		
		table.bootstrapTable('refresh',{url: dev_construction+"GSitReport/queryListSitUnReported.asp?SID="+SID+
		    "&call="+tableCall+"&menu=01"+"&"+param});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#query").click();});
	//重置
	var reset = currTab.find("#str_reset");
	reset.click(function(){
		queryForm[0].reset();
		currTab.find('#version_id').val("");
		currTab.find("select").select2();
	});
	
	/**		初始化按钮跳转	**/
	/*编辑报告*/
	var edit = currTab.find("#edit");
	edit.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length<1){
			alert("请选择一条数据进行报告上传!");
			return ;
		}
//		var state = rows[0].STATUS;                    
//		if(state=="01"){
//			alert("该信息已提交，不能再次上传!");
//			return ;
//		}
		var flag = false;
		var task_no1 = $.map(rows, function (row) {
			if(rows[0].SYSTEM_NO!=row.SYSTEM_NO){
				text='请选择同一应用上传报告';
				flag=true;
				return false;
			}
			return row.REQ_TASK_ID;   
		});
		if(flag) {
			alert(text);
			return;
		}
		
		var istrue = false;
		var task_no2 = $.map(rows, function (row) {
			if(rows[0].VERSION_ID!=row.VERSION_ID){
				docx='请选择同一版本上传报告';
				istrue=true;
				return false;
			}
			return row.REQ_TASK_ID;   
		});
		if(istrue) {
			alert(docx);
			return;
		}
		
		closeAndOpenInnerPageTab("sittestreport_edit","SIT测试报告编辑","dev_construction/sit_test_jn/sit_report/sitreport_edit.html",function(){
			initSitTestReportInfoLayout(rows);
			/*var task_no = $.map(rows, function (row) {
				
				var REQ_TASK_NAME = row.REQ_TASK_NAME;
				var REQ_TASK_RELATION_NAME = row.REQ_TASK_RELATION_NAME;
				var SYSTEM_NAME = row.SYSTEM_NAME;
				if(REQ_TASK_NAME == undefined) REQ_TASK_NAME="--";
				if(REQ_TASK_RELATION_NAME == undefined) REQ_TASK_RELATION_NAME="--";
				if(SYSTEM_NAME == undefined) SYSTEM_NAME="--";
				var trHtml="<tr id='row' align='center'><td style='text-align: center; '> <div class='form-control2' ><input name='check_task' value='"+row.REQ_TASK_ID+"' type='checkbox'/></div>"+
			    "</td><td style='text-align: center; '>"+REQ_TASK_NAME+
			    "</td><td style='text-align: center; '>"+row.REQ_TASK_CODE+
			    "</td><td style='text-align: center; '>"+REQ_TASK_RELATION_NAME+ 
			    "</td><td style='text-align: center; '>"+SYSTEM_NAME; 

			    
		    	 var $tr=getCurrentPageObj().find("#table_SITtaskInfo tr").eq("-1"); 
				$tr.after(trHtml);  
			     
				return row.REQ_TASK_ID;                  
			});*/
			
		});
	});
	/*查看详情*/
	var queryInfo = currTab.find("#queryInfo");
	queryInfo.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行查看!");
			return ;
		}
		closeAndOpenInnerPageTab("queryInfo","查看SIT测试报告","dev_construction/sit_test_jn/sit_report/sitreport_queryInfo.html",function(){
			initviewsitReport(rows[0]);
		});
	});
 }	
	
	/**		初始化table	**/
 initSitTestReportList();
 function initSitTestReportList(){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	table.bootstrapTable("destroy").bootstrapTable({
		//请求后台的URL（*）
		url : dev_construction+"GSitReport/queryListSitUnReported.asp?SID="+SID+"&call="+tableCall+"&menu=01",
		method : 'get', //请求方式（*）
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [5, 10, 15 ],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "REQ_TASK_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		jsonpCallback : tableCall,
		detailView : false, //是否显示父子表
		singleSelect: true,
		onLoadSuccess:function(data){
			gaveInfo();
		},
		columns : [ {
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		},{
			field : 'REQ_TASK_ID',
			title : '任务序列号',
			align : "center",
			visible:false,
		},{
			field : 'SUB_REQ_ID',
			title : '需求点序列号',
			align : "center",
			visible:false,
		},{
			field : 'SUB_REQ_CODE',
			title : '需求点编号',
			align : "center",
			width :"11%",
		},{
			field : 'REQ_ID',
			title : '需求序列号',
			align : "center",
			visible:false,
		},{
			field : 'REQ_TASK_CODE',
			title : '任务编号',
			align : "center",
			width :"13%", 
			visible:false,
		}, {
			field : 'REQ_TASK_NAME',
			title : '任务名称',
			align : "center",
			width :"15%", 
			visible:false,
		},{
			field : 'SUB_REQ_CODE',
			title : '需求点编号',
			align : "center",
			width : 155,
			visible:false,
		}, {
			field : "SUB_REQ_NAME",
			title : "需求点名称",
			align : "center",
			width :"15%", 
		}, {
			field : "REQ_TASK_RELATION_NAME",
			title : "从属关系",
			align : "center",
			width :"6%", 
			visible:false,
		}, {
			field : "REQ_TASK_STATE_DISPLAY",
			title : "任务状态",
			align : "center",
			width :"7%", 
		}, {
			field : "SYSTEM_NAME",
			title : "主办应用",
			align : "center",
			width : "8%",
		
		
		},{
			field : "ACCEPT_RESULT_NAME",
			title : "验证结论",
			align : "center",
			width :"6%", 
			formatter : function(value, row, index){
				if(value == null || value==""){
					return "无";
				}else{
					return value;
				}
			}
		},{
			field : "PUTIN_RESULT_NAME",
			title : "是否允许投产",
			align : "center",
			formatter : function(value, row, index){
				if(value == null || value==""){
					return "无";
				}else{
					return value;
				}
			},
			visible:false,
		},{
			field : "P_OWNER_NAME",
			title : "当前责任人",
			align : "center",
			width :"8%", 
		},{
			field : "CREATE_TIME",
			title : "创建时间",
			align : "center",
			width :"8%", 
		},{
			field : "REQ_TASK_STATE",
			title : "需求任务状态",
			align : "center",
			visible:false
		}, {
			field : "VERSION_NAME",
			title : "申请纳入版本",
			align : "center",
			width :"10%", 
		}, {
			field : "SYSTEMS2",
			title : "协办应用",
			align : "center",
			width : 280,
			formatter:function(value,row,index){
				if(value=="" || value == undefined || value==null){
					return "-";
				}else{
					 return value.substring(1,value.length-1);
				}
			 },
			
		}]
	});
 }
}