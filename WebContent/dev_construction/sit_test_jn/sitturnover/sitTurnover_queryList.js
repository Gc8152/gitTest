	
function initsitTurnoverInfo(){
	var currTab = getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题
	//初始化下拉选
	autoInitSelect(currTab.find("#table_select"));
	
	var tableCall = getMillisecond();
	
	var table = currTab.find("#sitTable");
	var form = currTab.find("#sitTurnover");
	//查询
	var query = currTab.find("#serach_turnoverQuery");
	query.click(function(){
		var param = form.serialize();
		table.bootstrapTable('refresh',{
			url:dev_construction+'SitTurnover/queryListSitTurnover.asp?call='+tableCall+'&SID='+SID+'&'+param});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#serach_turnoverQuery").click();});
	//重置
	var reset = currTab.find("#reset_turnoverQuery");
	reset.click(function(){
		form[0].reset();
		currTab.find("select").select2();
	});
	
	
	//立项信息列表显示
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	table.bootstrapTable({
		//请求后台的URL（*）
		url : dev_construction+'SitTurnover/queryListSitTurnover.asp?call='+tableCall+'&SID='+SID,
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
		uniqueId : "REQ_TASK_CODE", // 每一行的唯一标识，一般为主键列
		cardView : false, // 是否显示详细视图
		detailView : false, // 是否显示父子表
		jsonpCallback:tableCall,
		singleSelect : false,// 复选框单选
		columns : [ {
			checkbox : true,
			rowspan : 2,
			align : 'center',
			valign : 'middle'
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
			field : 'REQ_ID',
			title : '需求序列号',
			align : "center",
			visible:false,
		},{
			field : 'REQ_TASK_CODE',
			title : '任务编号',
			align : "center",
		}, {
			field : 'REQ_TASK_NAME',
			title : '任务名称',
			align : "center"
		}, {
			field : "REQ_TASK_RELATION_NAME",
			title : "从属关系",
			align : "center"
		}, {
			field : "REQ_TASK_STATE_DISPLAY",
			title : "任务状态",
			align : "center"
		}, {
			field : "SYSTEM_NAME",
			title : "实施应用",
			align : "center",
		},{
			field : "PLAN_ONLINETIME",
			title : "计划投产时间",
			align : "center",
		},{
			field : "CREATE_TIME",
			title : "创建时间",
			align : "center",
		},{
			field : "P_OWNER",
			title : "当前责任人",
			align : "center",
			visible:false,
		},{
			field : "VERSION_NAME",
			title : "纳入版本",
			align : "center",
		},{
			field : "SIT_SUB_CONUT",
			title : "SIT移交次数",
			align : "center",
		},{
			field : "REQ_TASK_STATE",
			title : "需求任务状态",
			align : "center",
			visible:false,
		}]
	});
	//加载系统应用pop
	currTab.find('#system_nameTO').click(function(){
		openTaskSystemPop("tvsystem_pop",{sysno:getCurrentPageObj().find('#system_noTO'),sysname:getCurrentPageObj().find('#system_nameTO')});
	});	

	//加载版本pop
	currTab.find('#version_nameTO').click(function(){
		openTaskVersionPop("tvVsersion_pop",{versionsid:getCurrentPageObj().find('#version_idTO'),versionsname:getCurrentPageObj().find('#version_nameTO')});
	});
	
	//添加按钮
	var add = currTab.find("#add_Sit");
	add.click(function(){
		var seles = $('#sitTable').bootstrapTable("getSelections");
		if(seles.length<1){
			alert("请选择一条数据进行移交!");
			return;
		}
		openInnerPageTab("add_Sit","新增sit测试","dev_construction/sit_test_jn/sitturnover/sitTurnover_edit.html", function(){
			var task_no = $.map(seles, function (row) {
				var REQ_TASK_NAME = row.REQ_TASK_NAME;
				var REQ_TASK_RELATION_NAME = row.REQ_TASK_RELATION_NAME;
				var SYSTEM_NAME = row.SYSTEM_NAME;
				if(REQ_TASK_NAME == undefined) REQ_TASK_NAME="--";
				if(REQ_TASK_RELATION_NAME == undefined) REQ_TASK_RELATION_NAME="--";
				if(SYSTEM_NAME == undefined) SYSTEM_NAME="--";
				var trHtml="<tr id='row' align='center'><td style='text-align: center; '> <div class='form-control2' ><input name='check_task' value='"+row.REQ_TASK_ID+"' type='checkbox'/></div>"+
			    "</td><td style='text-align: center; '>"+REQ_TASK_NAME+
			    "</td><td style='text-align: center; '>"+REQ_TASK_RELATION_NAME+ 
			    "</td><td style='text-align: center; '>"+SYSTEM_NAME+
			    "</td><td style='text-align: center; '>查看</td></tr>"; 

			    
		    	 var $tr=$("#table_SITtaskInfo tr").eq("-1"); 
				$tr.after(trHtml);  
			     
				return row.REQ_TASK_ID;                  
			});
			var req_task_code = $.map(id,function (row) {return row.REQ_TASK_CODE;});
			initsitTurnoverBtn(null, req_task_code);
		});
	 });
	//修改按鈕
	var update = currTab.find("#update_Sit");
	update.bind('click', function(e) {
		var seles = $('#sitTable').bootstrapTable("getSelections");
		if(seles.length!=1){
			alert("请选择一条数据进行修改!");
			return;
		}
		var state = seles[0].STATUS_NAME;                    
		if(state=="已提交"){
			alert("该信息已提交，不能修改");
			return ;
		}
		openInnerPageTab("update_Sit","修改sit测试","dev_construction/sit_test_jn/sitturnover/sitTurnover_edit.html", function(){
			initsitTurnoverBtn(seles[0]);
		});
	});
	//查看
	var view = currTab.find("#view_Sit");
	view.bind('click', function(e) {
		var seles = $('#sitTable').bootstrapTable("getSelections");
		if(seles.length!=1){
			alert("请选择一条数据进行查看!");
			return;
		}
		closeAndOpenInnerPageTab("view_Sit","查看sit测试","dev_construction/sit_test_jn/sitturnover/sitTurnover_queryInfo.html", function(){
			initviewsitTurnover(seles[0]);
		});
	});
	//提交按鈕
	var submit = currTab.find("#submit_Sit");
	submit.bind('click', function(e) {
		var seles = $('#sitTable').bootstrapTable("getSelections");
		if(seles.length!=1){
			alert("请选择一条数据进行提交!");
			return;
		}
		var state = seles[0].STATUS_NAME;                    
		if(state=="已提交"){
			alert("该信息已提交，不能再次提交");
			return ;
		}
		var call = getMillisecond();
		nconfirm("是否提交此申请？",function(){
			var SIT_ID = seles[0].SIT_ID;  
			baseAjaxJsonp(dev_construction+"SitTurnover/submitSitTurnover.asp?call="+call+"&SID="+SID,{"SIT_ID":SIT_ID}, function(data){
				if (data != undefined && data != null && data.result=="true") {
					alert(data.msg);
					query.click();
				}else{
					alert(data.msg);
				}
			}, call);
		});
	});
	//刪除按鈕
	var del = currTab.find("#delete_Sit");
	del.click(function(){
		var seles = $("#sitTable").bootstrapTable('getSelections');
		if(seles.length!=1){
			alert("请选择一条数据进行删除!");
			return;
		}
		var state = seles[0].STATUS_NAME;                    
		if(state=="已提交"){
			alert("该信息已提交，不能删除");
			return ;
		}
		var call = getMillisecond();
		var msg="是否删除此申请？";
		nconfirm(msg,function(){
			var SIT_ID = seles[0].SIT_ID;  
			baseAjaxJsonp(dev_construction+"SitTurnover/deleteSitTurnover.asp?call="+call+"&SID="+SID,{"SIT_ID":SIT_ID}, function(data){
				if (data != undefined && data != null && data.result=="true") {
					alert(data.msg);
					query.click();
				}else{
					alert(data.msg);
				}
			}, call);
		});
	});	
	
}
initSelect(getCurrentPageObj().find("#req_task_stateTO"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQTASK_STATE"});	
initsitTurnoverInfo();