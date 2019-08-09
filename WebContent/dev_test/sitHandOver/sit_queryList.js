initsitAcceptInfo();
function initsitAcceptInfo(){
	var currTab = getCurrentPageObj();//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题
	var tableCall = getMillisecond();
	var table = currTab.find("#sitTable");
	var form = currTab.find("#sitSubmit");
	autoInitSelect(currTab);//初始化下拉选
	//初始化列表
	initsitHandOver();
	//查询
	var query = currTab.find("#query");
	query.click(function(){
		var param = form.serialize();
		table.bootstrapTable('refresh',{
			url:dev_test+'testTaskHandOver/queryListSitSubmit.asp?call='+tableCall+'&SID='+SID+'&'+param});
	});
	//enter触发查询
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#query").click();});
	//重置
	var reset = currTab.find("#reset");
	reset.click(function(){
		form[0].reset();
		currTab.find("select").select2();
	});
	//添加移交
	var add = currTab.find("#add_Sit");
	add.click(function(){ 
		var seles = table.bootstrapTable("getSelections");
		if(seles.length == 0){
			closeAndOpenInnerPageTab("add_Sit","移交测试","dev_test/sitHandOver/sit_add.html", function(){
				addSit(null,'add');
			});
		}else{
			if(seles[0].ACCEPT_STATE != '05'){
		    closeAndOpenInnerPageTab("add_Sit","移交测试","dev_test/sitHandOver/sit_add.html", function(){
			    addSit(seles[0],'edit');
		    });
		    }else{
				alert('该项目已执行完成，无法移交');
				return;
	    	}
		}
	});
	//页面列表
	function initsitHandOver() {
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset, //页码
				type:'1'
		};
		return temp;
	};
	table.bootstrapTable({
		//请求后台的URL（*）
		url : dev_test+'testTaskHandOver/queryListSitSubmit.asp?call='+tableCall+'&SID='+SID,
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
		pageSize : 5,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "SIT_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:tableCall,
		singleSelect: true,
		onLoadSuccess : function(data){
			gaveInfo();
		},
		columns : [{
	 		checkbox : true,
			rowspan : 2,
			align : 'center',
			valign : 'middle'
	 	},{
			field : "PROJECT_NUM",
			title : "项目编号",
			align : "center",
			width : "180",
		},{
			field : "PROJECT_NAME",
			title : "项目名称",
			align : "center",
			width : "380",
		},{
			field : "TEST_VERSION",
			title : "测试版本号",
			align : "center",
			width : "200",
		},{
			field : "TEST_ROUND",
			title : "测试轮次",
			align : "center",
			width : "80",
		},  {
			field : "VERSION_NAME",
			title : "版本名称",
			align : "center",
			width : "300",
		}, {
			field : "EXE_STAGE_NAME",
			title : "执行阶段",
			align : "center",
			width : "120",
		}, {
			field : "HAND_OVER_STATE_NAME",
			title : "移交状态",
			align : "center",
			width : "120",
		}, {
			field : "ACCEPT_STATE_NAME",
			title : "执行状态",
			align : "center",
			width : "120",
		}, {
			field : "VERSION_DATE",
			title : "版本发布日期",
			align : "center",
			width : "120",
		}]
	});
	}
}