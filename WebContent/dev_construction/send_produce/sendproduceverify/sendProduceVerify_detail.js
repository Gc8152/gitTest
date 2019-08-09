function initSendProduceVerifyDetailLayout(item){
	var currTab = getCurrentPageObj();
	
	//初始化需求点基本信息
	initSubReqInfo(item);
	function initSubReqInfo(item){
		var $spans = currTab.find("span");
		for(var i=0; i<$spans.length; i++){
			$span = $($spans[i]);
			$span.text(item[$span.attr("id")]);
		}
		
		var verify_result = currTab.find("#VERIFY_RESULT").text();
		if("00"==verify_result){
			currTab.find("#VERIFY_RESULT").text("是");
		} else if("01"==verify_result) {
			currTab.find("#VERIFY_RESULT").text("否");
		} else {
			currTab.find("#VERIFY_RESULT").text("未提交");
		}
		
		//紧急隐藏版本
		if(item["IS_EMERGENCY_REQ"]=="00"){
			currTab.find("#VERSIONS_NAME").hide();
		}
		
		if(item["ID"]!=null&&item["ID"]!=""&&item["ID"]!=undefined){
			var call = getMillisecond();
			baseAjaxJsonp(dev_construction+'sendProduceVerify/queryOneVerifyItem.asp?call='+call+'&SID='+SID+'&ID='+item["ID"], null, function(result){
				if(result.result=="true"){
					//回显信息
					var verifyInfo = result["info"];
					/*getCurrentPageObj().find("#VERIFY_RESULT").val();
					//初始化下拉框
					initSelectByData(getCurrentPageObj().find("#VERIFY_RESULT"),{value:"ITEM_CODE",text:"ITEM_NAME"},
							[{"ITEM_CODE":"00", "ITEM_NAME":"通过"},{"ITEM_CODE":"01", "ITEM_NAME":"不通过"}], verifyInfo["VERIFY_RESULT"]);
					getCurrentPageObj().find("#VERIFY_DESC").val(verifyInfo["VERIFY_DESC"]);*/
				} else {
					alert("获取验证信息失败");
				}
			}, call);
		}
	}
	
	//初始化必填校验
	initVlidate(currTab);
	
	//初始化关联任务列表
	initReqTaskTable(item["SUB_REQ_ID"]);
	function initReqTaskTable(sub_req_id){
		var queryParams = function(params){
			var temp = {};
			temp["limit"] = params.limit;
			temp["offset"] = params.offset;
			return temp;
		};
		var initSendProContent_call = getMillisecond();
		currTab.find("#reqTaskTable").bootstrapTable({
			url : dev_construction+'sendProduceVerify/queryReqTaskBySubreqid.asp?call='+initSendProContent_call+'&SID='+SID+'&SUB_REQ_ID='+sub_req_id,
			method : 'get', //请求方式（*）   
			striped : false, //是否显示行间隔色
			cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : true, //是否启用排序
			sortOrder : "asc", //排序方式
			queryParams : queryParams,//传递参数（*）
			sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
			pagination : false, //是否显示分页（*）
			pageList : [5,10],//每页的记录行数（*）
			pageNumber : 1, //初始化加载第一页，默认第一页
			pageSize : 10,//可供选择的每页的行数（*）
			clickToSelect : true, //是否启用点击选中行
			uniqueId : "REQ_TASK_ID", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			detailView : false, //是否显示父子表
			singleSelect: true,
			jsonpCallback: initSendProContent_call,
			onLoadSuccess:function(data){
				gaveInfo();	
			},
			columns : [{
				field : 'REQ_TASK_ID',
				title : '任务序列号',
				align : "center",
				visible:false
			},{
				field : 'SUB_REQ_ID',
				title : '需求点序列号',
				align : "center",
				visible:false
			},{
				field : 'REQ_ID',
				title : '需求序列号',
				align : "center",
				visible:false
			},{
				field : 'REQ_TASK_CODE',
				title : '任务编号',
				align : "center",
				width : 150,
				formatter: function (value, row, index) {
					return  '<span class="hover-view" style="color:blue"'+
					'onclick="viewTaskDetail('+row.REQ_TASK_ID+')">'+value+'</span>';
				}
			}, {
				field : 'REQ_TASK_NAME',
				title : '任务名称',
				align : "center",
				width : 150
			},{
				field : "REQ_TASK_RELATION_NAME",
				title : "从属关系",
				align : "center",
			}, {
				field : "REQ_TASK_STATE_DISPLAY",
				title : "任务状态",
				align : "center",
			}, {
				field : "SYSTEM_NAME",
				title : "实施应用",
				align : "center",
			},{
				field : "P_OWNER_NAME",
				title : "任务责任人",
				align : "center",
			},{
				field : "VERSION_NAME",
				title : "纳入版本",
				align : "center",
			},{
				field : "REQ_TASK_STATE",
				title : "需求任务状态",
				align : "center",
				visible:false
			}]
		});
	}
	
	//初始化关联接口列表
	//interfaceInfoTable
	initqueryInterface(item["SUB_REQ_ID"]);
}