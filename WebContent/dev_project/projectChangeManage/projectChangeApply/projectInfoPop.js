    
function openProPop(modal_div,callparams){
	var currPage = getCurrentPageObj();
	$('#project_table').remove();
	var tableCall = getMillisecond();
	modal_div.load("dev_project/projectChangeManage/projectChangeApply/projectInfoPop.html",{},function(){
		currPage.find("#project_table").modal("show");
		//获取input里面的值
		projectInfoPop("#table_projectInfo");
		//POP重置
		currPage.find("#reset_project").click(function(){
			currPage.find("input[name=M_SYSTEM_NAME]").val("");
			currPage.find("input[name=M_PROJECT_NAME]").val("");
		});
		//多条件查询项目经理
		currPage.find("#select_project").click(function(){
			var SYSTEM_NAME = currPage.find("input[name=M_SYSTEM_NAME]").val();
			var PROJECT_NAME = currPage.find("input[name=M_PROJECT_NAME]").val();
			currPage.find("#table_projectInfo").bootstrapTable('refresh',{url:dev_project+"proChange/queryListProjectInfo.asp?call="+tableCall+"&SID="+SID
					+"&SYSTEM_NAME="+encodeURI(SYSTEM_NAME)+"&PROJECT_NAME="+encodeURI(PROJECT_NAME)+"&PROJECT_MAN_ID="+callparams.User_id.val()});
		});
		enterEventRegister("popModelQueryLevel1", function(){getCurrentPageObj().find("#select_project").click();});
	});

	//项目经理信息列表
	function projectInfoPop(projectTable){
		//分页
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset //页码
			};
			return temp;
		};
		var project_man_id = callparams.User_id.val();
		//查询所有POP框
		currPage.find(projectTable).bootstrapTable("destroy").bootstrapTable({
		//请求后台的URL（*）
		url : dev_project+"proChange/queryListProjectInfo.asp?call="+tableCall+"&SID="+SID+"&PROJECT_MAN_ID="+project_man_id,
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
		pageSize : 5,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "PROJECT_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:tableCall,
		singleSelect: true,
		onLoadSuccess:function(data){
			gaveInfo();
		},
		onDblClickRow:function(row){
			$('#project_table').modal('hide');
			callparams.Pro_id.val(row.PROJECT_ID);
			callparams.Pro_num.val(row.PROJECT_NUM);
			callparams.Pro_name.val(row.PROJECT_NAME);
			callparams.Pro_status.val(row.STATUS);
			callparams.Pro_status_name.val(row.STATUS_NAME);
			callparams.Pro_type.val(row.PROJECT_TYPE);
			callparams.Pro_type_name.val(row.PROJECT_TYPE_NAME);
			if(row.PROJECT_TYPE == "SYS_DIC_NEW_PROJECT" || row.PROJECT_TYPE == "SYS_DIC_NEW_VERSION_PROJECT"){
				currPage.find("#change_version").show();
				getCurrentPageObj().find("#plan_table_milestone").find("tr").not(":eq(0)").remove();
				getCurrentPageObj().find("option[name='ProjectVers']").remove();
				getCurrentPageObj().find("#C_VERSION_ID").val();
				getCurrentPageObj().find("#C_VERSION_ID").select2();
				changeVersion(row.PROJECT_ID);
			}else{
				currPage.find("#change_version").hide();
				queryMilestone(row.PROJECT_ID,"00","");//初始化模板里程碑
			}
			
		},
		columns :[{
				field : 'Number',
				title : '序号',
				align : "center",
				formatter: function (value, row, index) {
					return index+1;
				},
				width:45
			}, {
	        	field : 'PROJECT_NUM',
				title : '项目编号',
				align : "center",
				visible:false
	        }, {
	        	field : "PROJECT_NAME",
				title : "项目名称",
				align : "center",
				width : "23%"
	        }, {
	        	field : "SYSTEM_NAME",
				title : "应用名称",
				align : "center"
	        }, {
	        	field : "PROJECT_MAN_NAME",
				title : "项目经理",
				align : "center",
	        }, {
	        	field : "STATUS_NAME",
				title : "项目状态",
				align : "center"
	        }, {
	        	field : "PROJECT_TYPE_NAME",
				title : "项目类型",
				align : "center"
	        }]
		});
	}
}