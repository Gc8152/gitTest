
(function initAnnualVersionPlanInfo(){
	var currTab = getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题
	var tableCall=getMillisecond();			//table回调方法名
	//初始化下拉选
	autoInitSelect(currTab.find("#table_select"));
	var table = currTab.find("#table_annualVersionPlan");
	
	//查询
	var query = currTab.find("#select_version");
	query.click(function(){  
		var versions_name = $.trim(currTab.find("[name='versions_name']").val());
		var versions_date = currTab.find("[name='versions_date']").val();
		var versions_type = $.trim(currTab.find("[name='versions_type']").val());
		if(versions_date=="点击选择年度"){
			versions_date="";
		}
		table.bootstrapTable('refresh',{
			url:dev_construction+'annualVersion/queryListAnnualVersion.asp?SID='+SID+'&call='+tableCall
			+ '&versions_date=' + versions_date +'&versions_type=' +versions_type+ '&versions_name='+escape(encodeURIComponent(versions_name))});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#select_version").click();});
	//重置
	var reset = currTab.find("#reset_version");
	reset.click(function(){
		currTab.find("input,select").val(" ");
		currTab.find("select").select2();
	});
	
	//新增
	var add = currTab.find("#add_annual");
	add.click(function(){
		openInnerPageTab("add_annual","新增计划","dev_construction/versionManage/annualVersionManage/annualVersionPlan_addOrUpdate.html", function(){
			initAnnualVersionEditEvent();
		
		});
	 });
	
	//修改按鈕
	var update = currTab.find("#update_annual");
	update.bind('click', function(e) {
        var seles = table.bootstrapTable("getSelections");
		if(seles.length!=1){
			alert("请选择一条数据进行修改!");
			return;
		}
		var versions_st=seles[0].VERSIONS_STATUS;
		if(versions_st!='00'){
			alert("请选择未开启状态的版本修改！");
			return;
			
		}
		var selesInfo=JSON.stringify(seles);
		var params=JSON.parse(selesInfo);
		closeAndOpenInnerPageTab("update_annual","修改计划","dev_construction/versionManage/annualVersionManage/annualVersionPlan_addOrUpdate.html", function(){
			initAnnualVersionEditEvent(params[0]);
		});
	});
	
	//查看
	var view = currTab.find("#view_annual");
	view.bind('click', function(e) {
		var seles = table.bootstrapTable("getSelections");
		if(seles.length!=1){
			alert("请选择一条数据进行查看!");
			return;
		}
		var selesInfo=JSON.stringify(seles);
		var params=JSON.parse(selesInfo);
		closeAndOpenInnerPageTab("view_project","查看计划","dev_construction/versionManage/annualVersionManage/annualVersionPlan_queryInfo.html", function(){
			initAnnualVersionViewEvent(params[0]);
		});
	});
	
	//刪除按鈕
	var del = currTab.find("#delete_annual");
	del.click(function(){
		var seles = table.bootstrapTable('getSelections');
		if(seles.length!=1){
			alert("请选择一条数据进行删除!");
			return;
		}
		var versions_st=seles[0].VERSIONS_STATUS;
		if(versions_st!='00'){
			alert("请删除未开启状态的版本！");
				return;
			
		}
		var msg="是否删除此计划？";
		nconfirm(msg,function(){
			var versions_id = seles[0].VERSIONS_ID;  
			var delCall=getMillisecond();
			baseAjaxJsonp(dev_construction+"annualVersion/deleteAnnualVersion.asp?SID=" + SID + '&call=' + delCall,
					{versions_id:versions_id}, 
					function(data){
						if (data != undefined && data != null && data.result=="true") {
							query.click();
						}
						alert(data.msg);
					}, delCall);
		});
	});	
	//年度版本计划列表显示
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	table.bootstrapTable({
		//请求后台的URL（*）
		url : dev_construction+'annualVersion/queryListAnnualVersion.asp?SID='+SID+'&call='+tableCall,
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
		uniqueId : "DRAFT_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		jsonpCallback:tableCall,
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
		    width: "6%",
			formatter: function (value, row, index) {
				return index+1;
			}
		}, {
			field : 'VERSIONS_NAME',
			title : '版本名称',
			align : "center",
		    width: "30%"
		}, {
			field : "VERSIONS_TYPE_NAME",
			title : "版本类型",
			align : "center",
			width: "25%"
			
		}, {
			field : "VERSIONS_WEEK_NAME",
			title : "周次",
			align : "center",
			width: "17%"
		}, {
			field : "VERSIONS_STATUS_NAME",
			title : "版本状态",
			align : "center",
			width: "17%"
		},{
			field : "START_TIME",
			title : "投产开始时间",
			align : "center",
		},/*{
			field : "SYSTEM_NAME",
			title : "应用",
			align : "center"
		},*/ {
			field : "END_TIME",
			title : "投产结束时间",
			align : "center",
		}, {
			field : "VERSIONS_STATUS",
			title : "状态",
			align : "center",
			visible:false
		}]
	});
	
})();
		