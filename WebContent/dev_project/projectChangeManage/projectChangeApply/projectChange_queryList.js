;function initproChangeInfo(){
	var currTab = getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题
	//初始化下拉选
	autoInitSelect(currTab.find("#table_select"));
	
	var tableCall = getMillisecond();
	
	var table = currTab.find("#table_proChange");
	var form = currTab.find("#proChange");
	
	//查询
	var query = currTab.find("#select");
	query.click(function(){
		var param = form.serialize();
		table.bootstrapTable('refresh',{
			url:dev_project+'proChange/queryListProChange.asp?call='+tableCall+'&SID='+SID+"&"+param});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#select").click();});
	//重置
	var reset = currTab.find("#reset");
	reset.click(function(){
		form[0].reset();
		currTab.find("select").select2();
	});
	
	//列表显示
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	table.bootstrapTable({
		//请求后台的URL（*）
		url : dev_project+'proChange/queryListProChange.asp?call='+tableCall+'&SID='+SID,
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
		uniqueId : "CHANGE_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:tableCall,
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
		}, {
			field : 'ROW_NUM',
			title : '序号',
			align : "center",
			width:50
		}, {
			field : "CHANGE_CODE",
			title : "变更编号",
			align : "center",
			visible:false
		}, {
			field : "PROJECT_NUM",
			title : "项目编号",
			align : "center",
			visible:false
		}, {
			field : "PROJECT_NAME",
			title : "项目名称",
			align : "center",
			width :"18%"
		}, {
			field : "PROJECT_TYPE_NAME",
			title : "项目类型",
			align : "center"
		}, {
			field : "SYSTEM_NAME",
			title : "应用名称",
			align : "center"
		}, {
			field : "CHANGE_REASON_NAME",
			title : "变更原因",
			align : "center"
		}, {
			field : "PRESENT_USER_NAME",
			title : "提出人",
			align : "center",
			width :"8%"
		}, {
			field : "PRESENT_DATE",
			title : "提出日期",
			align : "center",
			width :"8%"
		}, {
			field : "APP_STATUS_NAME",
			title : "变更状态",
			align : "center",
			width :"8%"
		}]
	});
	//发起变更按钮
	var add = currTab.find("#add_proChange");
	add.click(function(){
		closeAndOpenInnerPageTab("add_proChange","发起变更","dev_project/projectChangeManage/projectChangeApply/projectChange_edit.html", function(){
			initproChangeEditBtn(null);
		});
	 });
	//修改按鈕
	var update = currTab.find("#update_proChange");
	update.bind('click', function(e) {
		var seles = table.bootstrapTable("getSelections");
		if(seles.length!=1){
			alert("请选择一条数据进行编辑!");
			return;
		}
		var state = seles[0].APP_STATUS;                    
		if(state!="01" && state!="04"){
			alert("该信息不是草拟/打回状态，不能编辑");
			return ;
		}
		closeAndOpenInnerPageTab("add_proChange","编辑变更","dev_project/projectChangeManage/projectChangeApply/projectChange_edit.html", function(){
			initproChangeEditBtn(seles[0]);
		});
	});
	//查看
	var view = currTab.find("#view_proChange");
	view.bind('click', function(e) {
		var seles = table.bootstrapTable("getSelections");
		if(seles.length!=1){
			alert("请选择一条数据进行查看!");
			return;
		}
		closeAndOpenInnerPageTab("view_proChange","查看变更","dev_project/projectChangeManage/projectChangeApply/projectChange_queryInfo.html", function(){
			initviewproChange(seles[0]);
		});
	});
	
	//刪除按鈕
	var del = currTab.find("#delete_proChange");
	del.click(function(){
		var seles = table.bootstrapTable('getSelections');
		if(seles.length!=1){
			alert("请选择一条数据进行删除!");
			return;
		}
		var state = seles[0].APP_STATUS;                    
		if(state!="01"){
			alert("该信息不是草拟状态，不能删除");
			return ;
		}
		var call = getMillisecond();
		var msg="是否删除此申请？";
		nconfirm(msg,function(){
			var CHANGE_ID = seles[0].CHANGE_ID;  
			baseAjaxJsonp(dev_project+"proChange/deleteProChange.asp?call="+call+"&SID="+SID,{"CHANGE_ID":CHANGE_ID}, function(data){
				if (data != undefined && data != null && data.result=="true") {
					alert(data.msg);
					query.click();
				}else{
					alert(data.msg);
				}
			}, call);
		});
	});	
	
	
	
	//跟踪按鈕
	var follow = currTab.find("#follow_proChange");
	follow.bind('click', function(e) {
		var seles = table.bootstrapTable("getSelections");
		if(seles.length!=1){
			alert("请选择一条数据进行跟踪!");
			return;
		}
		openInnerPageTab("follow_proChange","变更跟踪","dev_project/projectChangeManage/projectChangeApply/projectChange_follow.html", function(){
			initfollow_proChange(seles[0]);
		});
	});
	//审批通过按鈕
	var approved = currTab.find("#approved");
	approved.click(function(){
		var seles = table.bootstrapTable('getSelections');
		if(seles.length!=1){
			alert("请选择一条数据审批通过!");
			return;
		}
		var state = seles[0].APP_STATUS;                    
		if(state!="01"){
			alert("该信息不是审批中状态，不能审批通过");
			return ;
		}
		var call = getMillisecond();
		var msg="是否通过此申请？";
		nconfirm(msg,function(){
			var CHANGE_ID = seles[0].CHANGE_ID;  
			var CHANGE_TYPE = seles[0].CHANGE_TYPE;  
			var PROJECT_ID = seles[0].PROJECT_ID; 
			baseAjaxJsonp(dev_project+"proChange/approveProChange.asp?call="+call+"&SID="+SID,{"CHANGE_ID":CHANGE_ID,"CHANGE_TYPE":CHANGE_TYPE,"PROJECT_ID":PROJECT_ID}, function(data){
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
		
initproChangeInfo();