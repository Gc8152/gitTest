	
function initprojectEstablishInfo(){
	var currTab = getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题
	//初始化下拉选
	autoInitSelect(currTab.find("#table_select"));
	currTab.find("select[name='STATUS']").empty();
	var arr = "01,02";
	initSelect(currTab.find("select[name='STATUS']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_PROJECT_STATUS"},null,null,arr);
	var PROJECT_TYPE = currTab.find("select[name='PROJECT_TYPE']");
	PROJECT_TYPE.empty();
	var arr = "SYS_DIC_VERSION_PROJECT,SYS_DIC_REQUIREMENT_ANALYSIS_PROJECT,SYS_DIC_URGENT_PROJECT,SYS_DIC_ANNUAL_TASK_PROJECT";
	initSelect(PROJECT_TYPE,{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SYS_DIC_MILESTONE_PROJECT_TYPE"},null,null,arr);
	var tableCall = getMillisecond();
	var table = currTab.find("#table_project");
	var form = currTab.find("#projectEstablish");
	/**
	 * 实施部门，业务部门查询下拉
	 */
	var depObj=getCurrentPageObj().find("#IMPL_DEP_NAME");
	depObj.unbind("click");
	depObj.click(function(){
		openSelectTreeDivToBody($(this),"dep_name_fd_tree","SOrg/queryorgtreelist.asp",30,function(node){
			getCurrentPageObj().find("#IMPL_DEP_NAME").val(node.name);
			getCurrentPageObj().find("input[name='IMPL_DEP_ID']").val(node.id);
		});
	});
	var busObj=getCurrentPageObj().find("#BUSINESS_DEP_NAME");
	busObj.unbind("click");
	busObj.click(function(){
		openSelectTreeDivToBody($(this),"bus_name_fd_tree","SOrg/queryorgtreelist.asp",30,function(node){
			getCurrentPageObj().find("#BUSINESS_DEP_NAME").val(node.name);
			getCurrentPageObj().find("input[name='BUSINESS_DEP_ID']").val(node.id);
		});
	});
	/**
	 * 实施部门，业务部门查询下拉
	 */
	//项目经理弹出框
	var pm_name = currTab.find("input[name=PM_NAME]");
	pm_name.click(function(){
		openPmPop(currTab.find("#choosePm"),{Zpm_id:currTab.find("input[name=PM_ID]"),Zpm_name:currTab.find("input[name=PM_NAME]")});
	});
	//项目经理弹出框结束
	//查询
	var query = currTab.find("#select_project");
	query.click(function(){
		var param = form.serialize();
		table.bootstrapTable('refresh',{
			url:dev_project+'draftPro/queryListDraftPro.asp?call='+tableCall+'&SID='+SID+'&'+param});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#select_project").click();});
	//重置
	var reset = currTab.find("#reset_project");
	reset.click(function(){
		form[0].reset();
		currTab.find("select").val("");
		currTab.find("select").select2();
		getCurrentPageObj().find("input[name=IMPL_DEP_NAME]:visible").val(" ");
		currTab.find('#IMPL_DEP_ID').val("");
		currTab.find('#BUSINESS_DEP_ID').val("");
		currTab.find('#PM_ID').val("");
		var selects = currTab.find("select");
		for(var i=0; i<selects.length; i++){
			$(selects[i]).select2();
		}
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
		url : dev_project+'draftPro/queryListDraftPro.asp?call='+tableCall+'&SID='+SID,
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
			//width: "12%",
			formatter: function (value, row, index) {
				return index+1;
			}
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
			field : "STATUS_NAME",
			title : "状态",
			align : "center"
		}, {
			field : "PM_NAME",
			title : "项目经理",
			align : "center"
		},{
			field : "IMPL_DEP_NAME",
			title : "项目实施部门",
			align : "center"
		},{
			field : "BUSINESS_DEP_NAME",
			title : "项目业务部门",
			align : "center"
		},{
			field : "START_TIME",
			title : "项目开始时间",
			align : "center"
		},{
			field : "END_TIME",
			title : "项目结束时间",
			align : "center"
		},{
			field : "CREATE_TIME",
			title : "创建时间",
			align : "center"
		},{
			field : "CREATE_USER_NAME",
			title : "创建人",
			align : "center"
		}]
	});
	
	//创建项目
	var add = currTab.find("#add_project");
	add.click(function(){
		openInnerPageTab("add_project","新增项目立项","dev_project/projectEstablishManage/projectEstablish/projectEstablish_add.html", function(){
			initprojectEditBtn(null);
		});
	 });
	//修改按鈕
	var update = currTab.find("#update_project");
	update.bind('click', function(e) {
		var seles = $('#table_project').bootstrapTable("getSelections");
		if(seles.length!=1){
			alert("请选择一条数据进行修改!");
			return;
		}
		state = seles[0].STATUS;  
		/*if(state=='04'){
			alert("该信息已提交，不能修改");
			return ;
		}*/
		
		closePageTab("update_project");
		openInnerPageTab("update_project","修改项目立项","dev_project/projectEstablishManage/projectEstablish/projectEstablish_add.html", function(){
			initprojectEditBtn(seles[0]);
		});
	});
	//查看
	var view = currTab.find("#view_project");
	view.bind('click', function(e) {
		var seles = $('#table_project').bootstrapTable("getSelections");
		if(seles.length!=1){
			alert("请选择一条数据进行查看!");
			return;
		}
		closePageTab("view_project");
		openInnerPageTab("view_project","查看项目立项","dev_project/projectEstablishManage/projectEstablish/projectEstablish_queryInfo.html", function(){
			initviewproject(seles[0]);
		});
	});
	//提交按鈕
	var submit = currTab.find("#submit_project");
	submit.bind('click', function(e) {
		var seles = $('#table_project').bootstrapTable("getSelections");
		if(seles.length!=1){
			alert("请选择一条数据进行提交!");
			return;
		}
		var state = seles[0].STATUS;                    
		if(state=='04'){
			alert("该信息已提交，不能再次提交");
			return ;
		}
		var call = getMillisecond();
		nconfirm("是否提交此申请？",function(){
			var DRAFT_ID = seles[0].DRAFT_ID;  
			baseAjaxJsonp(dev_project+"draftPro/submitDraftPro.asp?call="+call+"&SID="+SID,{"DRAFT_ID":DRAFT_ID}, function(data){
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
	var del = currTab.find("#delete_project");
	del.click(function(){
		var seles = $("#table_project").bootstrapTable('getSelections');
		if(seles.length!=1){
			alert("请选择一条数据进行删除!");
			return;
		}
		var state = seles[0].STATUS;                    
		if(state=='04'){
			alert("该信息已提交，不能删除");
			return ;
		}
		var call = getMillisecond();
		var msg="是否删除此申请？";
		nconfirm(msg,function(){
			var DRAFT_ID = seles[0].DRAFT_ID;  
			baseAjaxJsonp(dev_project+"draftPro/deleteDraftPro.asp?call="+call+"&SID="+SID,{"DRAFT_ID":DRAFT_ID}, function(data){
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
function checkTimeSupCompare(){
	WdatePicker({onpicked:function(){
		var starttime = getCurrentPageObj().find("#START_TIME").val();
		var endtime = getCurrentPageObj().find("#END_TIME").val();
		if(starttime!=""&&endtime!=""){
			if(starttime>endtime){
				alert('开始时间不能大于结束时间!',function(){
					getCurrentPageObj().find("#START_TIME").val("");
					getCurrentPageObj().find("#END_TIME").val("");
				});
			}
		}
	}});
}		
initprojectEstablishInfo();