initMyProjectLayout();

function initMyProjectLayout(){
	
	var currTab = getCurrentPageObj();
	
	var form = currTab.find("#myProject_query");
	var table = currTab.find("#myProjectTable");
	
	var commit = currTab.find("#commit");
	commit.click(function(){
		var param = form.serialize();
		baseAjaxJsonp("/ssss/sss?SID="+SID+"&"+param, "", function(result){
		});
	});
	
	var reset = currTab.find("#reset");
	reset.click(function(){
		form[0].reset();
	});
	
	/**		初始化按钮跳转	**/
	/*项目人员管理*/
	var proEmpManage = currTab.find("#proEmpManage");
	proEmpManage.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		newOpenTab("proEmpManage","项目人员管理","dev_project/myProject/proEmpManage/proEmpManage_qeryList.html",function(){
			initLayout(rows);
		});
	});
	/*WBS计划*/
	var wbsPlan = currTab.find("#wbsPlan");
	wbsPlan.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		newOpenTab("wbsPlan","WBS计划","dev_project/myProject/wbsPlan/wbsPlan_qeryList.html",function(){
			initLayout(rows);
		});
	});
	/*风险问题管理*/
	/*???*/
	var aa = currTab.find("#aa");
	aa.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		newOpenTab("aa","WBS计划","dev_project/myProject/aa/wbsPlan_qeryList.html",function(){
			initLayout(rows);
		});
	});
	/*质量管理*/
	var qualityManage = currTab.find("#qualityManage");
	qualityManage.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		newOpenTab("qualityManage","质量管理","dev_project/myProject/qualityManage/qualityManage_qeryList.html",function(){
			initLayout(rows);
		});
	});
	/*配置管理*/
	var configManage = currTab.find("#configManage");
	configManage.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		newOpenTab("configManage","配置管理","dev_project/myProject/configManage/configManage_qeryList.html",function(){
			initLayout(rows);
		});
	});
	/*变更管理*/
	var changeManage = currTab.find("#changeManage");
	changeManage.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		newOpenTab("changeManage","配置管理","dev_project/myProject/changeManage/changeManage_qeryList.html",function(){
			initLayout(rows);
		});
	});
	/*项目结项*/
	var projectEnd = currTab.find("#projectEnd");
	/*指派实施项目经理*/
	var excuteProjectManager = currTab.find("#excuteProjectManager");
	/*项目360视图*/
	var projectDetail = currTab.find("#projectDetail");
	
	/**		初始化table	**/
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	table.bootstrapTable({
		//请求后台的URL（*）
		url : dev_project+'demo/demoTable.asp?SID='+SID,
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [10,15],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "aa", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		columns : [ {
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		},{
			field : 'aa',
			title : '编号',
			align : "center"
		}, {
			field : "bb",
			title : "标识",
			align : "center"
		}, {
			field : "cc",
			title : "项目编号",
			align : "center"
		}, {
			field : "dd",
			title : "项目名称",
			align : "center"
		}, {
			field : "dd",
			title : "项目类型",
			align : "center"
		}, {
			field : "dd",
			title : "SPI",
			align : "center"
		}, {
			field : "dd",
			title : "CPI",
			align : "center"
		}, {
			field : "dd",
			title : "变更总数(审批中)",
			align : "center"
		}, {
			field : "dd",
			title : "项目经理",
			align : "center"
		}, {
			field : "dd",
			title : "项目负责人",
			align : "center"
		}, {
			field : "dd",
			title : "归属部门",
			align : "center"
		}, {
			field : "dd",
			title : "项目状态",
			align : "center"
		}]
	});
	
}