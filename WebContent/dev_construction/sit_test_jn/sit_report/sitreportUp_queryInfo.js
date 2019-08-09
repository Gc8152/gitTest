
function initSitReortUpInfo(rows){
	initVlidate(getCurrentPageObj());
	initSelect(getCurrentPageObj().find("#ACCEPT_RESULT"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_ACCEPT_RESULT"});
	
	//initSitReortUpInfo(rows.REQ_TASK_ID,rows.REPORT_ID);
	var currTab = getCurrentPageObj();
	var call = getMillisecond();
	var param = {};
	param["req_task_id"] = rows.REQ_TASK_ID;
	param["report_id"] = rows.REPORT_ID;
	
	baseAjaxJsonp(dev_construction+"GSitReport/queryReportTaskById.asp?call="+call+"&SID="+SID,param, function(data){
		if (data != undefined && data != null && data.result=="true" ) {
			var reportMap = data.reportMap;
			for (var key in reportMap) {
				currTab.find("div[name="+key+"]").html(reportMap[key]);
			}
			var adefect_num = reportMap.ADEFECT_NUM;
			var adefect_passnum = reportMap.ADEFECT_PASSNUM;
			currTab.find("div[name='aleave']").html(adefect_num-adefect_passnum);
			var bdefect_num = reportMap.BDEFECT_NUM;
			var bdefect_passnum = reportMap.BDEFECT_PASSNUM;
			currTab.find("div[name='bleave']").html(bdefect_num-bdefect_passnum);
			var cdefect_num = reportMap.CDEFECT_NUM;
			var cdefect_passnum = reportMap.CDEFECT_PASSNUM;
			currTab.find("div[name='cleave']").html(cdefect_num-cdefect_passnum);
			var ddefect_num = reportMap.DDEFECT_NUM;
			var ddefect_passnum = reportMap.DDEFECT_PASSNUM;
			currTab.find("div[name='dleave']").html(ddefect_num-ddefect_passnum);
			var edefect_num = reportMap.EDEFECT_NUM;
			var edefect_passnum = reportMap.EDEFECT_PASSNUM;
			currTab.find("div[name='eleave']").html(edefect_num-edefect_passnum);
			
			currTab.find("div[name='allpass']").html(parseInt(adefect_passnum)
					+parseInt(bdefect_passnum)+parseInt(cdefect_passnum)+parseInt(ddefect_passnum)+parseInt(edefect_passnum));
		}else{ 
			alert(data.msg);
		}
	}, call);
	
//	table_report_taskInfo  queryTaskByReportId
	var table = currTab.find("#table_report_taskInfo");
	var tableCall = "report"+getMillisecond();
	table.bootstrapTable("destroy").bootstrapTable({
		//请求后台的URL（*）
		url : dev_construction+"GSitReport/queryTaskByReportId.asp?SID="+SID+"&call="+tableCall,
		method : 'get', //请求方式（*）
		striped : false, //是否显示行间隔色
		async:true,
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : param,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : false, //是否显示分页（*）
		pageList : [10,15],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "REQ_TASK_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		jsonpCallback : tableCall,
		detailView : false, //是否显示父子表
		singleSelect: false,
		columns : [ {
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		},{
			field : 'aa',
			title : '序号',
			align : "center",
			formatter : function(value, row, index){
				return index+1;
			}
		},{
			field : 'REQ_TASK_ID',
			title : '任务序列号',
			align : "center",
			visible:false,
		},{
			field : 'SUB_REQ_ID',
			title : '需求点序列号',
			align : "center",
			visible:false,
		},{
			field : 'REQ_ID',
			title : '需求序列号',
			align : "center",
			visible:false,
		},{
			field : 'REQ_TASK_CODE',
			title : '任务编号',
			align : "center",
		}, {
			field : 'REQ_TASK_NAME',
			title : '任务名称',
			align : "center"
		}, {
			field : "REQ_TASK_RELATION_NAME",
			title : "从属关系",
			align : "center"
		}, {
			field : "REQ_TASK_STATE_DISPLAY",
			title : "任务状态",
			align : "center"
		}, {
			field : "SYSTEM_NAME",
			title : "实施应用",
			align : "center",
		},{
			field : "CREATE_TIME",
			title : "创建时间",
			align : "center",
		},{
			field : "REQ_TASK_STATE",
			title : "需求任务状态",
			align : "center",
			visible:false,
		},{
			field : "REQ_TASK_CODE",
			title : "附件信息",
			align : "center",
			visible:false,
			formatter:function(value,row,index){if(value!=undefined&&value!=""&&value!=null){return '<a style="color:blue" href="javascript:void(0)" onclick="phasedFollower(09003,\''+row.REQ_TASK_ID+'\',\''+row.REQ_TASK_CODE+'\')";>查看</a>';}return "--";}
		}]
	});
	
	
	 //点击打开模态框
	//var ids=$.map(rows, function (row) {return row.REQ_TASK_CODE;});
		//附件上传
	var business_codes = rows.REQ_TASK_CODE;
	var tablefile = currTab.find("#table_file");
	
	//初始化附件列表
	getSvnFileList(tablefile,currTab.find("#file_view_modal"),business_codes, "09003");
	
	
	
	var update = currTab.find("#updateSitReprot");
	update.click(function(){
		if(!vlidate(currTab,"",true)){
			alert("您还有必填项未填");
			return ;
		}
		var param = getPageParam("A");		//遍历当前页面的input,text,select

		/*****插入提醒参数*****/
		param["REPORT_ID"]= rows.REPORT_ID;
		param["remind_type"] = "PUB2017145";//sit报告

		param["b_code"] = rows.REQ_TASK_CODE;
		param["b_id"] = rows.REQ_TASK_ID;
		param["sub_req_id"] = rows.SUB_REQ_ID;
		param["sub_req_name"] =rows.SUB_REQ_NAME;
		param["project_man_id"] = rows.PROJECT_MAN_ID;
		param["TEST_MAN_ID"] = rows.TEST_MAN_ID;
		if(param["ACCEPT_RESULT"] == "00"){
			param["b_name"] = rows.SUB_REQ_NAME+"（编号："+rows.SUB_REQ_CODE+"）SIT报告已上传，审核结论：通过";
		}else{
			param["b_name"] = rows.SUB_REQ_NAME+"（编号："+rows.SUB_REQ_CODE+"）SIT报告已上传，审核结论：不通过";
		}
		
		var aaa=getCurrentPageObj().find("textarea[name='A.PUTIN_RESULT_DESC']").val();
	    if(aaa.length>230){
	    	alert("备注至多可输入230汉字！");
	    	return;
	    }
		
		var call = getMillisecond();
		baseAjaxJsonp(dev_construction+"GSitReport/updateSitReport.asp?call="+call+"&SID="+SID,param, function(data){
			if (data != undefined && data != null && data.result=="true" ) {
	       		alert(data.msg);
	       		closeCurrPageTab();
			}else{ 
				alert(data.msg);
			}
		}, call);
	});
}
