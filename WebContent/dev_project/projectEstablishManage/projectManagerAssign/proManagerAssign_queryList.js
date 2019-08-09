	
function initAssignPMList(){
	var currTab = getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题
	
	autoInitSelect(currTab.find("#table_select"));
	var table = currTab.find("#table_assignPMList");
	var form = currTab.find("#proManagerAssign");
	//查询
	var query = currTab.find("#select_assign");
	query.click(function(){
		var param = form.serialize();
		table.bootstrapTable('refresh',{
			url:dev_project+'AssignPM/queryListProBasicInfo.asp?SID='+SID+'&call='+tableCall+'&'+param});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#select_assign").click();});
	var reset = currTab.find("#reset_assign");
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
	var tableCall=getMillisecond();
	table.bootstrapTable({
		//请求后台的URL（*）
		url : dev_project+'AssignPM/queryListProBasicInfo.asp?SID='+SID+'&call='+tableCall,
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
			sortable: true,
			width: "7%",
			formatter: function (value, row, index) {
				return index+1;
			}
		}, {
			
			field : 'PROJECT_NUM',
			title : '项目编号',
			align : "center"
		}, {
			field : 'PROJECT_NAME',
			title : '项目名称',
			align : "center"
		}, {
			field : "PROJECT_TYPE_NAME",
			title : "项目类型",
			align : "center"
		}, {
			field : "PROJECT_SCALE_NAME",
			title : "项目规模",
			align : "center"
		}, {
			field : "PM_NAME",
			title : "(前期)项目经理",
			align : "center"
		}, {
			field : "EXPECT_GOAL",
			title : "项目预期要求",
			align : "center"
		}, {
			field : "IMPLEMENT_PM_NAME",
			title : "实施项目经理",
			align : "center"
		}, {
			field : "CREATE_TIME",
			title : "立项时间",
			align : "center"
		}, {
			field : "PROJECT_MAN_ID",
			title : "id",
			align : "center",
			visible : false
		}, {
			field : "PROJECT_MAN_NAME",
			title : "man",
			align : "center",
			visible : false
		}, {
			field : "SYSTEM_ID",
			title : "syid",
			align : "center",
			visible : false
		}, {
			field : "SYSTEM_NAME",
			title : "sysname",
			align : "center",
			visible : false
		}, {
			field : "PM_ID",
			title : "id",
			align : "center",
			visible : false
			
		}]
	});
	
	//项目经理指派
	var assign = currTab.find("#assignPM");
	assign.bind('click', function(e) {
		var seles = table.bootstrapTable("getSelections");
		if(seles.length!=1){
			alert("请选择一条数据进行指派!");
			return;
		}
		var name = seles[0].IMPLEMENT_PM_NAME;                    
		if(name){
			alert("该记录已指派项目经理");
			return ;
		}
		if(seles[0].PM_ID!=SID){
			alert("您不是该项目前期项目经理");
			return ;
		}
		closePageTab("assignPM_add");
		openInnerPageTab("assignPM_add","指派项目经理","dev_project/projectEstablishManage/projectManagerAssign/proManagerAssign_add.html", function(){
			var selesInfo=JSON.stringify(seles);
			var params=JSON.parse(selesInfo);
			initAssignPMAddEvent(params[0]);
			if(seles[0].PROJECT_TYPE_NAME=="新建应用项目"){
				getCurrentPageObj().find("[name='project_man_name']").attr("disabled",true);
				getCurrentPageObj().find("[name='project_man_name']").attr({validate:"",valititle:""});
			}
			
		});
	});
	
}
		
initAssignPMList();