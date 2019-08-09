	
function initsitAcceptInfo(){
	var currTab = getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题
	//初始化下拉选
	//autoInitSelect(currTab.find("#table_select"));
	//initSelect(obj,show,param,default_v,preStr,arr);
	initSelect(currTab.find("#STATUS_NAME"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:'G_DIC_SIT_SUBMIT_STATE'},null,null,["00","01","001","002","02","05"]);
	
	var tableCall = getMillisecond();
	
	var table = currTab.find("#sitAccept_Table");
	var form = currTab.find("#sitAccept");
	//查询
	var query = currTab.find("#query");
	query.click(function(){
		var param = form.serialize();
		if(param.STATUS_NAME == '请选择'){
			param.STATUS_NAME = '';
		}
		table.bootstrapTable('refresh',{
			url:dev_construction+'GSitAccept/queryListSitAccept.asp?call='+tableCall+'&SID='+SID+'&'+param});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){query.click();});
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
		url : dev_construction+'GSitAccept/queryListSitAccept.asp?call='+tableCall+'&SID='+SID,
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
		uniqueId : "SIT_ID", //每一行的唯一标识，一般为主键列
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
		},{
			field : "SUB_REQ_CODE",
			title : "需求点编号",
			align : "center",
			width : 135,
			formatter:function(value,row,index){if(value!=undefined&&value!=" "){return '<a style="color:blue" href="javascript:void(0)" onclick="viewSubReqDetailTD(\''+row.REQ_ID+'\')";>'+value+'</a>';}return '--';}
		},{
			field : "SUB_REQ_NAME",
			title : "需求点名称",
			align : "center",
			width : 150,
		},{
			field : "TEST_COUNT_NAME",
			title : "测试轮次",
			align : "center",
			width : 90,
		},{
			field : "TEST_VERSION_ID",
			title : "测试版本号",
			align : "center",
			width : 100,
		}, {
			field : "VERSION_PUSH_DATA",
			title : "版本发布日期",
			align : "center",
			width : 110,
		}, {
			field : "VERSIONS_NAME",
			title : "版本名称",
			align : "center",
			width : 150,
			formatter:function(value,row,index){if(value!=undefined&&value!=" "){return '<a style="color:blue" href="javascript:void(0)" onclick="openVersionDetail(\''+row.VERSIONS_ID+'\')";>'+value+'</a>';}return '--';}
		}, {
			field : "IS_CC",
			title : "是否纳入CC",
			align : "center",
			width : 120,
			formatter:function(value,row,index){if(value=="00"){return "是";}return "否";}
		},{
			field : "SYSTEM_NAME",
			title : "应用名称",
			align : "center",
			width : 120,
		}, {
			field : "STATUS_NAME",
			title : "移交状态",
			align : "center",
			width : 100,
		},{
			field : "REQ_CHANGE",
			title : "需求变更",
			align : "center",
			width : 100,
		},{
			field :"ANALYZE_NAME",
			title :"案例评审状态",
			align :"center",
			width : 140,
			formatter:function(value,row,index){
				 if(value=="" || value == undefined || value==null || value=='00') 
					 return '<span  style="color:red; width: 110px; ";>'+"未评审"+'</span>';
				 else
					 return value;
			 },
		},{
			field : "TEST_EXECUTOR_NAME",
			title : "测试责任人",
			align : "center",
			width : 120,
		},{
			field : "OPT_PERSON_NAME",
			title : "上一操作人",
			align : "center",
			width : 120,
		}]
	});
	
	//SIT测试受理
	var edit = currTab.find("#edit_Sit");
	edit.click(function(){
		var seles = table.bootstrapTable("getSelections");
		if(seles.length!=1){
			alert("请选择一条数据进行受理!");
			return;
		}
		var state = seles[0].STATUS;                    
		if(state=="04" || state=="05"){
			alert("该记录已受理!");
			return ;
		}
		closeAndOpenInnerPageTab("edit_Sit","SIT测试受理","dev_construction/sit_test_jn/sit_accept/sitAccept_edit.html", function(){
			initsitAcceptBtn(seles[0]);
			/*getCurrentPageObj().find("input[name='STATUS'][value="+seles[0].STATUS+"]").attr("checked",true); 
			if(seles[0].STATUS=="06"){
				getCurrentPageObj().find("#to_man1").show();
				getCurrentPageObj().find("#to_man2").show();
			}*/
		});
	});
	
	var approve = currTab.find("#balck_sit");
	approve.bind('click',function(e){
		var seles = table.bootstrapTable("getSelections");
		if(seles.length!=1){
			alert("请选择一条数据进行查看!");
			return;
		}
		currTab.find('#opModal_approve').modal('show');
	});
	
	
	var black_save = currTab.find("#black_save");
	black_save.bind('click', function(e) {
		var seles = table.bootstrapTable("getSelections");
		var item = seles[0];
		var param = {};
		param["STATUS"]="05";
		param["ACCEOT_DESCRIBE"]=currTab.find("textarea[name=ACCEOT_DESCRIBE]").val();
		param["TEST_MAN_ID"] = "";
		
		param["SIT_ID"]=item.SIT_ID;
		param["IS_COMMIT"]=true;
		param["req_task_id"]="";//用于受理时改变任务的状态
		
		/****插入提醒参数****/
		param["remind_type"] = "PUB2017144";
		param["b_code"] = item.SIT_ID;
		param["b_id"] = item.SIT_ID;
		var remind = item.SUB_REQ_NAME+"+（编号："+item.SUB_REQ_CODE+"）"+item.TEST_COUNT_NAME;
	
		param["b_name"] = remind+"SIT测试受理被拒绝";
		var call = getMillisecond();
		
		baseAjaxJsonp(dev_construction+"GSitAccept/saveSitAccept.asp?call="+call+"&SID="+SID,param, function(data){
			if (data != undefined && data != null && data.result=="true" ) {
	       		alert(data.msg);
	       		currTab.find('#opModal_approve').modal('hide');
	       		var param = form.serialize();
	    		table.bootstrapTable('refresh',{
	    			url:dev_construction+'GSitAccept/queryListSitAccept.asp?call='+tableCall+'&SID='+SID+'&'+param});
			}else{ 
				alert(data.msg);
			}
		}, call);
	});
	
	//查看
	var view = currTab.find("#view_Sit");
	view.bind('click', function(e) {
		var seles = table.bootstrapTable("getSelections");
		if(seles.length!=1){
			alert("请选择一条数据进行查看!");
			return;
		}
		closeAndOpenInnerPageTab("view_Sit","查看SIT测试受理","dev_construction/sit_test_jn/sit_accept/sitAccept_edit.html", function(){
			//initviewsitAccept(seles[0]);
			initsitAcceptBtn(seles[0]);
			getCurrentPageObj().find("#submit_sit").hide();
			getCurrentPageObj().find("#acceot_describe").attr("disabled",true);
			//getCurrentPageObj().find("[name='STATUS']").val();
			getCurrentPageObj().find("input[name='STATUS'][value="+seles[0].STATUS+"]").attr("checked",true); 
			getCurrentPageObj().find("[name='STATUS']").attr("disabled",true);
			if(seles[0].STATUS=="06"){
				getCurrentPageObj().find("#to_man1").show();
				getCurrentPageObj().find("#to_man2").show();
				getCurrentPageObj().find("#to_test1").hide();
				getCurrentPageObj().find("#to_test2").hide();
			}else if(seles[0].STATUS=="04"){
				getCurrentPageObj().find("#to_man1").hide();
				getCurrentPageObj().find("#to_man2").hide();
				getCurrentPageObj().find("#to_test1").show();
				getCurrentPageObj().find("#to_test2").show();
			}else{
				getCurrentPageObj().find("#to_man1").hide();
				getCurrentPageObj().find("#to_man2").hide();
				getCurrentPageObj().find("#to_test1").hide();
				getCurrentPageObj().find("#to_test2").hide();
			}
		});
	});
}
//打开版本详情页面
function openVersionDetail(version_id){
	 closePageTab("view_project");
	 var tCall=getMillisecond()+'2';
			baseAjaxJsonp(dev_construction+'annualVersion/queryListAnnualVersion.asp?SID='+SID+'&call='+tCall+"&versions_id="+version_id, null , function(data) {
				openInnerPageTab("view_project","查看计划","dev_construction/versionManage/annualVersionManage/annualVersionPlan_queryInfo.html", function(){
					initAnnualVersionViewEvent(data.rows[0]);
			});
		},tCall);

}

//查看需求点详情	
function viewSubReqDetailTD(req_id){
	closeAndOpenInnerPageTab("requirement_360view","业务需求360页面","dev_construction/requirement/reqTask_follower/requirement_360view.html",function(){
		initReqInfoInView(req_id);
		initFollowerTaskQuery(req_id);
		reqChange_info(req_id);
		reqStop_info(req_id);
	});
}

initsitAcceptInfo();