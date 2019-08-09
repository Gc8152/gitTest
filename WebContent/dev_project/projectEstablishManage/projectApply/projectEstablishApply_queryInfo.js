function initviewApplyInfo(data){
	var currTab = getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题
	//赋值
	for (var key in data) {
		currTab.find("div[name="+key+"]").html(data[key]);
	}if(key=="file_id"){
		currTab.find("#file_id_reqRD").val(data);
	}
	else if(data.IS_POC="00"){
		currTab.find("div[name=IS_POC]").html("是");
	}else{
		currTab.find("div[name=IS_POC]").html("否");
	}
	
	var tablefile = getCurrentPageObj().find("#reqRD_tablefile");
	getFtpFileList(tablefile, getCurrentPageObj().find("#reqRD_fileview_modal"), data.FILE_ID, "01");

	//需求单列表
	var call = getMillisecond();
	$('#table_approveDemand').bootstrapTable('destroy').bootstrapTable({
		//请求后台的URL（*）
		url:dev_project+"draftPro/queryListDraftDemandOrder.asp?call="+call+"&SID="+SID+'&DRAFT_ID='+data.DRAFT_ID,
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
		columns : [{
			field : 'Number',
			title : '序号',
			align : "center",
			sortable: true,
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
				'onclick="view_applyDemandInfo(this)">'+value+'</span>';
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
/*	//初始化审批内容
	if(data["INSTANCE_ID"]!=""&&data["INSTANCE_ID"]!=undefined&&data["INSTANCE_ID"]!=null){
		initAFApprovalInfo(data["INSTANCE_ID"]);
	}*/
}
//查看需求单详情信息
function view_applyDemandInfo(obj){
	 var req_code=$(obj).attr("num");
	 opendemandPop("applyDemandInfo",req_code);
}

//页面内容收缩
$(function(){
      EciticTitleI();
});
