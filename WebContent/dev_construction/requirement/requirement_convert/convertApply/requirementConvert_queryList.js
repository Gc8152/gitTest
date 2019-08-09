initreqConvertApply();
function initreqConvertApply(){
	var currTab = getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题
	var table = currTab.find("#reqConvertApplyTable");
	var form = currTab.find("#convertSubmit");
	//初始化下拉选
	autoInitSelect(form);
	var tableCall = getMillisecond();
	//查询
	var query = currTab.find("#add_query");
	query.click(function(){
		var param = form.serialize();
		if(param.OPT_TIME == '请选择'){
			param.OPT_TIME = '';
		}
		table.bootstrapTable('refresh',{
			url:dev_construction+'ReqConvert/queryReqConvertApproveList.asp?type=2&apply_Query=1&call='+tableCall+'&SID='+SID+'&'+param});
		
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#add_query").click();});
	//重置
	var reset = currTab.find("#add_reset");
	reset.click(function(){
		form[0].reset();
		currTab.find("select").select2();
	});
	
	//页面列表
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	table.bootstrapTable({
		//请求后台的URL（*）
		url : dev_construction+'ReqConvert/queryReqConvertApproveList.asp?type=2&apply_Query=1&call='+tableCall+'&SID='+SID,
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
		uniqueId : "CONVERT_NO", //每一行的唯一标识，一般为主键列
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
		},{
			field : 'CONVERT_NO',
			title : '申请编号',
			align : "center",
			width : "14%",
			visible:false,
		},{
			field : 'SUB_REQ_CODE',
			title : '需求点编号',
			align : "center",
			width : "14%"
		}, {
			field : "SUB_REQ_NAME",
			title : "需求点名称",
			align : "center",
			width : "20%"
		}, {
			field : "SYSTEM_NAME",
			title : "应用名称",
			align : "center",
			width : "20%"
		},{
			field : "STATUS_NAME",
			title : "变更状态",
			align : "center",
			width : "14%"
		},{
			field : "OPT_PERSON_NAME",
			title : "申请人",
			align : "center",
			width : "13%"
		}, {
			field : "CURR_ACTORNO_NAME",
			title : "当前审批人",
			align : "center",
			width : "12%"
		}, {
			field : "OPT_TIME",
			title : "申请时间",
			align : "center",
			width : "15%"
		}/*, {
			field : "CURR_ACTORNO_NAME",
			title : "当前审批人",
			align : "center",
			width : "12%"
		}*/]
	});
	
	//新增
	var add = currTab.find("#addConvert");
	add.click(function(){
		closeAndOpenInnerPageTab("addConvert","申请页面","dev_construction/requirement/requirement_convert/convertApply/requirementConvert_add.html", function(){
			var seles = table.bootstrapTable("getSelections");
			if(seles.length==1&&seles[0]["STATUS"]=="04"){
				initConvertAdd(false);
				reStartToConvert({sub_req_id:seles[0]["SUB_REQ_ID"],
					req_task_name:seles[0]["REQ_TASK_NAME"],
					"req_task_id":seles[0]["REQ_TASK_ID"],
					"convert_no":seles[0]["CONVERT_NO"],
					"res_group_id":seles[0]["RES_GROUP_ID"],
					"system_id":seles[0]["SYSTEM_ID"],
					"system_name":seles[0]["SYSTEM_NAME"],
					"convert_desc":seles[0]["CONVERT_DESC"]
				});
			}else{
				initConvertAdd(true);
			}
		});
	});
	
	//删除
	var edit = currTab.find("#deleteConvert");
	edit.click(function(){
		var seles = table.bootstrapTable("getSelections");
		if(seles.length!=1){
			alert("请选择一条数据进行删除!");
			return;
		}
		var state = seles[0].STATUS;                    
		if(state!="04"){
			alert("只能删除审批不通过的申请！");
			return ;
		}
		/*if(state=="02"){
			alert("审批中的申请，不能删除！");
			return ;
		}*/
		var call = getMillisecond();
		var msg="是否删除此申请？";
		nconfirm(msg,function(){
			var CONVERT_NO = seles[0].CONVERT_NO;  
			baseAjaxJsonp(dev_construction+"ReqConvert/deleteReqConvert.asp?call="+call+"&SID="+SID,{"CONVERT_NO":CONVERT_NO}, function(data){
				if (data != undefined && data != null && data.result=="true"){
					alert(data.msg);
					query.click();
				}else{
					alert(data.msg);
				}
			}, call);
		});
	});
	//查看
	var view = currTab.find("#viewConvert");
	view.bind('click', function(e) {
		var seles = table.bootstrapTable("getSelections");
		if(seles.length!=1){
			alert("请选择一条数据进行查看!");
			return;
		}
		closeAndOpenInnerPageTab("viewAppConvert","审批查看页面","dev_construction/requirement/requirement_convert/convertApprove/requirementConvert_appDetail.html", function(){
			initTitle(seles[0]["INSTANCE_ID"]);
			initAFApprovalInfo(seles[0]["INSTANCE_ID"],'0');
			initConvertApprove(seles[0]["CONVERT_NO"]);
		});
		/*closeAndOpenInnerPageTab("viewConvert","查看页面","dev_construction/requirement/requirement_convert/convertApply/requirementConvert_queryInfo.html", function(){
			initConvertQueryInfo(seles[0]);
		});*/
	});
}
	
