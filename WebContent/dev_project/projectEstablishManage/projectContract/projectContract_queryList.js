	
function initcontractEstablishInfo(){
	var currTab = getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题
	//初始化下拉选
	autoInitSelect(currTab.find("#table_select"));
	//currTab.find("select[name='CON_STATE']").empty();
	var arr = "01,02";
	initSelect(currTab.find("select[name='CON_STATE']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_project_STATUS"},null,null,arr);
	var contract_TYPE = currTab.find("select[name='CON_TYPE']");
	contract_TYPE.empty();
	var arr = "SYS_DIC_VERSION_PROJECT,SYS_DIC_REQUIREMENT_ANALYSIS_PROJECT,SYS_DIC_URGENT_PROJECT,SYS_DIC_ANNUAL_TASK_PROJECT";
	initSelect(CON_TYPE,{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SYS_DIC_MILESTONE_PROJECT_TYPE"},null,null,arr);
	var tableCall = getMillisecond();
	var table = currTab.find("#table_contract");
	var form = currTab.find("#contractEstablish");
	//查询
	var query = currTab.find("#select_contract");
	query.click(function(){
		var param = form.serialize();
		table.bootstrapTable('refresh',{
			url:dev_project+'draftCont/queryListContPro.asp?call='+tableCall+'&SID='+SID+'&'+param});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#select_contract").click();});
	//重置
	var reset = currTab.find("#reset_contract");
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
		url : dev_project+'Contract/queryListContBasicInfo.asp?call='+tableCall+'&SID='+SID,
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
		uniqueId : "con_no", //每一行的唯一标识，一般为主键列
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
		},{
			field : 'CON_NO',
			title : '合同编号',
			align : "center"
		},{
			field : 'CON_NAME',
			title : '合同名称',
			align : "center"
		}, {
			field : "CON_TYPE",
			title : "合同类型",
			align : "center"
		}, {
			field : "CON_SCOPE",
			title : "合同规模",
			align : "center"
		},{
			field : "CON_BUDGET",
			title : "合同预期要求",
			align : "center"
		},{
			field : "CON_SAVE_TIME",
			title : "保存时间",
			align : "center"
		},{
			field : "CON_COMM_TIME",
			title : "提交时间",
			align : "center"
		}]
	});
	
	//创建合同
	var add = currTab.find("#add_contract");
	add.click(function(){
		var state={type:"0"};
		openInnerPageTab("add_contract","新增合同立项","dev_project/projectEstablishManage/projectContract/projectContract_add.html", function(){
			initcontractEditBtn(state);
		});
	 });
	//修改按鈕
	var update = currTab.find("#update_contract");
	update.bind('click', function(e) {
		var seles = $('#table_contract').bootstrapTable("getSelections");
		if(seles.length!=1){
			alert("请选择一条数据进行修改!");
			return;
		}
//		console.log(JSON.stringify(seles[0]));
		var state = {seles:seles[0],type:"1"};                    
		
		openInnerPageTab("update_contract","修改合同立项","dev_project/projectEstablishManage/projectContract/projectContract_add.html", function(){
			initcontractEditBtn(state);
		});
	});
	//查看
	var view = currTab.find("#view_contract");
	view.bind('click', function(e) {
		var seles = $('#table_contract').bootstrapTable("getSelections");
		if(seles.length!=1){
			alert("请选择一条数据进行查看!");
			return;
		}
		openInnerPageTab("view_contract","查看合同立项","dev_project/projectEstablishManage/projectContract/projectContract_queryInfo.html", function(){
			initviewcontract(seles[0]);
		});
	});
	//提交按鈕
	var submit = currTab.find("#submit_contract");
	submit.bind('click', function(e) {
		var seles = $('#table_contract').bootstrapTable("getSelections");
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
			var CON_NO = seles[0].CON_NO;  
			baseAjaxJsonp(dev_project+"draftCont/submitContPro.asp?call="+call+"&SID="+SID,{"CON_NO":CON_NO}, function(data){
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
	var del = currTab.find("#delete_contract");
	del.click(function(){
		var seles = $("#table_contract").bootstrapTable('getSelections');
		if(seles.length!=1){
			alert("请选择一条数据进行删除!");
			return;
		}
		var call = getMillisecond();
		var msg="是否删除此合同？";
		nconfirm(msg,function(){
			var CON_NO = seles[0].CON_NO;  
			baseAjaxJsonp(dev_project+"draftCont/deleteContPro.asp?call="+call+"&SID="+SID,{"CON_NO":CON_NO}, function(data){
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
		
initcontractEstablishInfo();