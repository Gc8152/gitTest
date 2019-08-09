	
function inituatTurnoverInfo(){
	var currTab = getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题
	//初始化下拉选
	autoInitSelect(currTab.find("#table_select"));
	
	var tableCall = getMillisecond();
	
	var table = currTab.find("#uatTable");
	var form = currTab.find("#uatTurnover");
	//查询
	var query = currTab.find("#query");
	query.click(function(){
		var param = form.serialize();
		table.bootstrapTable('refresh',{
			url:dev_construction+'UatTurnover/queryListUatTurnover.asp?call='+tableCall+'&SID='+SID+'&'+param});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#query").click();});
	//重置
	var reset = currTab.find("#reset");
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
		url : dev_construction+'UatTurnover/queryListUatTurnover.asp?call='+tableCall+'&SID='+SID,
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
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
		uniqueId : "UAT_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:tableCall,
		singleSelect: true,
		columns : [ {
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		}, {
			field : 'Number',
			title : '序号',
			align : "center",
			sortable: true,
			formatter: function (value, row, index) {
				return index+1;
			}
		}, {
			field : 'REQ_TASK_CODE',
			title : '需求任务编号',
			align : "center"
		}, {
			field : "REQ_TASK_NAME",
			title : "需求任务名称",
			align : "center"
		}, {
			field : "TEST_VERSION_ID",
			title : "测试版本号",
			align : "center"
		}, {
			field : "VERSION_PUSH_DATA",
			title : "版本发布日期",
			align : "center"
		}, {
			field : "STATUS_NAME",
			title : "状态",
			align : "center"
		}, {
			field : "OPT_PERSON_NAME",
			title : "提交人",
			align : "center"
		}]
	});
	
	//添加按钮
	var add = currTab.find("#add_Uat");
	add.click(function(){
		openInnerPageTab("add_Uat","新增uat测试","dev_construction/uat_test_jn/uatturnover/uatTurnover_edit.html", function(){
			inituatTurnoverBtn(null);
		});
	 });
	//修改按鈕
	var update = currTab.find("#update_Uat");
	update.bind('click', function(e) {
		var seles = $('#uatTable').bootstrapTable("getSelections");
		if(seles.length!=1){
			alert("请选择一条数据进行修改!");
			return;
		}
		var state = seles[0].STATUS_NAME;                    
		if(state=="已提交"){
			alert("该信息已提交，不能修改");
			return ;
		}
		openInnerPageTab("update_Uat","修改uat测试","dev_construction/uat_test_jn/uatturnover/uatTurnover_edit.html", function(){
			inituatTurnoverBtn(seles[0]);
		});
	});
	//查看
	var view = currTab.find("#view_Uat");
	view.bind('click', function(e) {
		var seles = $('#uatTable').bootstrapTable("getSelections");
		if(seles.length!=1){
			alert("请选择一条数据进行查看!");
			return;
		}
		openInnerPageTab("view_Uat","查看uat测试","dev_construction/uat_test_jn/uatturnover/uatTurnover_queryInfo.html", function(){
			initviewuatTurnover(seles[0]);
		});
	});
	//提交按鈕
	var submit = currTab.find("#submit_Uat");
	submit.bind('click', function(e) {
		var seles = $('#uatTable').bootstrapTable("getSelections");
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
		nconfirm("是否提交？",function(){
			var UAT_ID = seles[0].UAT_ID;  
			baseAjaxJsonp(dev_construction+"UatTurnover/submitUatTurnover.asp?call="+call+"&SID="+SID,{"UAT_ID":UAT_ID}, function(data){
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
	var del = currTab.find("#delete_Uat");
	del.click(function(){
		var seles = $("#uatTable").bootstrapTable('getSelections');
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
		var msg="是否删除？";
		nconfirm(msg,function(){
			var UAT_ID = seles[0].UAT_ID;  
			baseAjaxJsonp(dev_construction+"UatTurnover/deleteUatTurnover.asp?call="+call+"&SID="+SID,{"UAT_ID":UAT_ID}, function(data){
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
		
inituatTurnoverInfo();