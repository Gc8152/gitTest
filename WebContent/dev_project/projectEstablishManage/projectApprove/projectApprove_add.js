var type;
function initprojectApproveBtn(data){
	var currTab = getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题
	type=data.type;
	var instance_id = data.seles["INSTANCE_ID"];
	//赋值
	for (var key in data.seles) {
		currTab.find("div[name="+key+"]").html(data.seles[key]);
		if(key=="FILE_ID"){
			currTab.find("#file_id_reqRD").val(data.seles[key]);
		}
	}
	if(data.seles.IS_POC="00"){
		currTab.find("div[name=IS_POC]").html("是");
	}else{
		currTab.find("div[name=IS_POC]").html("否");
	}
	var tablefile = getCurrentPageObj().find("#reqRD_tablefile");
	getFtpFileList(tablefile, getCurrentPageObj().find("#reqRD_fileview_modal"), data.seles.FILE_ID, "01");
	
	//初始化流程数据
	initTitle(instance_id);
	initAFApprovalInfo(instance_id);
	var call = getMillisecond();
	//需求单列表
	$('#table_approveDemand').bootstrapTable('destroy').bootstrapTable({
		//请求后台的URL（*）
		url:dev_project+"draftPro/queryListDraftDemandOrder.asp?call="+call+"&SID="+SID+'&DRAFT_ID='+data.seles.DRAFT_ID,
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		//queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : false, //是否显示分页（*）
		pageList : [10,15],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "REQ_CODE", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:call,
		singleSelect: true,
		onLoadSuccess: function (data) {

		},
		columns : [{
			field : 'Number',
			title : '序号',
			align : "center",
			sortable: true,
			width: "8%",
			formatter: function (value, row, index) {
				return index+1;
			}
		}, {
			field : 'REQ_ID',
			title : '需求id',
			align : "center",
			visible : false
		}, {
			field : 'REQ_CODE',
			title : '需求编号',
			align : "center",
			formatter: function (value, row, index) {
				return '<span num='+row.REQ_CODE+' class="hover-view" '+
				'onclick="view_approveDemandInfo(this)">'+value+'</span>';
			}
		}, {
			field : "REQ_NAME",
			title : "需求名称",
			align : "center"
		}, {
			field : "REQ_STATE_NAME",
			title : "需求状态",
			align : "center"
		}, {
			field : "SYSTEM_NAME",
			title : "应用名称",
			align : "center"
		}]
	});
	//返回按钮
	var close = currTab.find("#close");
	close.click(function(){
		closeCurrPageTab();
		//openInnerPageTab("back_project","返回","dev_project/projectEstablishManage/projectEstablish/projectEstablish_queryList.html");
	});
	//查看历史记录
	var query = currTab.find("#query");
	query.click(function(){
		var biz_id = data.seles["DRAFT_ID"];
		showHistoryDetail(biz_id,"01");
	});
	//demo审批演示
	$('#agree').bind('click', function(e) {
		$("#modal_projectApprove").modal('show');
		$("#approve").html("批准");
	});
	$('#disagree').bind('click', function(e) {
		$("#modal_projectApprove").modal('show');
		$("#approve").html("打回");
	});
}

//查看需求单详情信息
function view_approveDemandInfo(obj){
	 var req_code=$(obj).attr("num");
	 opendemandPop("approveDemandInfo",req_code);
}
//审批通过
function approved(DRAFT_ID){
	var call = getMillisecond();

	baseAjaxJsonp(dev_project+"draftProApproval/approvedDraftInfo.asp?call="+call+"&SID="+SID,{"DRAFT_ID":DRAFT_ID}, function(data){
		if (data != undefined && data != null && data.result=="true") {
			closePageTab("approve_project");
			alert(data.msg);
			var pcall = getMillisecond();
			 var url = dev_planwork + 'Wbs/initWbsPlan.asp?SID=' + SID + "&call=" + pcall;
			 baseAjaxJsonp(url, {
				 project_id : data.project_id,
				 project_type : data.project_type,
				}, function(msg) {
					if(msg.result=="true"){
						//alert("初始化WBS计划成功！");
					}else if(msg.result=="false"){
						//alert("没有找到相应模板！");
					}else{
						//alert("系统异常，请稍后！");
					}
				}, pcall);
		}else{
			alert(data.msg);
		}
	}, call);
};
//审批打回业务处理
function repulsed(DRAFT_ID){
	var call = getMillisecond();
	var APP_STATUS = "03";
	baseAjaxJsonp(dev_project+"draftProApproval/repulsedDraftInfo.asp?call="+call+"&SID="+SID,{"DRAFT_ID":DRAFT_ID,"APP_STATUS":APP_STATUS}, function(data){
		if (data != undefined && data != null && data.result=="true") {
			alert(data.msg);
		}else{
			alert(data.msg);
		}
	}, call);
}
