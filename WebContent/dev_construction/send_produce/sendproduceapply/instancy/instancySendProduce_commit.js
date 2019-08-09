/**
 * 初始化页面信息
 * @param p
 */
function initSendProInstancyCommitUpdate(p) {
	//投产单基本信息
	var call_sendInfo = getMillisecond()+'1';
	var url = dev_construction+'sendProduceApply/queryOneSendProInfoUpdate.asp?call='+call_sendInfo+'&SID='+SID+'&audit_no='+p;
	baseAjaxJsonp(url, null, function(data){
		if (data != undefined&&data!=null&&data.result=="true") {
			if(data.send){
				//判断是否显示cc测试基线
				if(data.send["system_is_cc"]=="00"){
					getCurrentPageObj().find("tr[type=base_line]").show();
					getCurrentPageObj().find("tr[type=svn_addr]").hide();
				} else if(data.send["system_is_cc"]=="01") {
					getCurrentPageObj().find("tr[type=base_line]").hide();
					getCurrentPageObj().find("tr[type=svn_addr]").show();
				}
				for(var k in data.send){
					var val = data.send[k];
					k = k.toLowerCase();
					if(k=="audit_no") {
						getCurrentPageObj().find("#"+k).text(val.toUpperCase());
					} else {
						getCurrentPageObj().find("#"+k).text(val);
					}
					getCurrentPageObj().find("input[name="+k+"]").val(val);
					getCurrentPageObj().find("textarea[name="+k+"]").text(val);
				}
			}
		}
	}, call_sendInfo);
	
	//投产任务
	var call_sendTask = getMillisecond()+'2';
	var queryParams = function(params){
		var temp = {};
		temp["limit"] = params.limit;
		temp["offset"] = params.offset;
		return temp;
	};
	getCurrentPageObj().find("#sendProCommitContent").bootstrapTable({
		url : dev_construction+'sendProduceApply/querySendTaskByAuditNo.asp?call='+call_sendTask+'&SID='+SID+'&audit_no='+p,
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		//pagination : false, //是否显示分页（*）
		pageList : [5,10],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "REQ_TASK_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		jsonpCallback: call_sendTask,
		onLoadSuccess:function(data){
			gaveInfo();
		},
		columns : [ {
			field: 'REQ_TASK_ID',
			title : '任务ID',
			align : "center",
			visible: false
		},{
			width : '15%',
			field : 'REQ_TASK_CODE',
			title : '任务编号',
			align : 'center',
			formatter: function (value, row, index) {
				return '<span class="hover-view" '+
				'onclick="initTaskDetailInfo('+row.REQ_TASK_ID+')">'+value+'</span>';
			}
		},{
			width : '20%',
			field : 'REQ_TASK_NAME',
			title : '任务名称',
			align : "center"
		},{
			width : "10%",
			field : 'REQ_TASK_TYPE_NAME',
			title : '任务来源',
			align : "center"
		},{
			width : "10%",
			field : 'REQ_TASK_RELATION',
			title : '从属关系',
			align : "center",
			formatter: function(value, row, index) {
				if(value=='01') {
					return "主办";
				}
				return "配合";
			}
		},{
			width : "10%",
			field : "STREAM_NAME",
			title : "流名称",
			align : "center",
			
		}, {
			width : "11%",
			field : "TOTAL",
			title : "涉及任务数",
			align : "center",
		}, {
			width : "12%",
			field : "PUTIN_START",
			title : "发起投产个数",
			align : "center",
		}, {
			width : "12%",
			field : "PUTIN",
			title : "完成投产个数",
			align : "center",
		}]
	});
	
	
	//根据 ---投产编号--- 查找下面所有的任务的接口
	var SendProduce="SendProduce";
	initqueryInterface(p,SendProduce);
	/******** 相关文档上传 ************/
	//点击文件上传模态框
	var currTab = getCurrentPageObj();
	var tablefile = currTab.find("#table_fileCommit");
	//构建文件上传路径拼接所需参数
	getSvnFileList(tablefile, currTab.find("#file_view_modal"), p, "12");
}

//需求任务详情
function initTaskDetailInfo(req_task_id){
	closePageTab("req_taskDetail");
	openInnerPageTab("req_taskDetail","任务详情页面","dev_construction/requirement/requirement_analyze/task_accept/task_detail.html",function(){
		initReqTaskDetailLayout(req_task_id);
	});
}

	//保存按钮
	getCurrentPageObj().find("#save").unbind("click");
	getCurrentPageObj().find("#save").click(function() {
		var result = getParamAndValidate();
		result.param["audit_no"]=getCurrentPageObj().find("#audit_no").text();
		if(result.result == true){
			var call = getMillisecond();
			var url = dev_construction+'sendProduceCommit/updateSendProInfo.asp?call='+call+'&SID='+SID;
			baseAjaxJsonp(url, result.param, function(data){
				if (data != undefined&&data!=null&&data.result=="true") {
					alert("保存成功！",function(){
						closeCurrPageTab();
					});
				} else {
					alert("保存失败！");
				}
			}, call);
		}
	});
	
	//保存并提交按钮
	getCurrentPageObj().find("#submit").unbind("click");
	getCurrentPageObj().find("#submit").click(function() {
		$(this).attr("disabled",true);
		var result = getParamAndValidate();
		if(result.result == true){
			result.param["audit_no"]=getCurrentPageObj().find("#audit_no").text();
			result.param["approve_status"]='05';//投产待确认
			var call_1 = getMillisecond();
			var url = dev_construction+'sendProduceCommit/updateSendProInfo.asp?call='+call_1+'&SID='+SID+'&submit=1';
			baseAjaxJsonp(url, result.param, function(data){
				if (data != undefined&&data!=null&&data.result=="true") {
					alert("提交成功!");
					closeCurrPageTab();
				} else {
					alert("保存失败！");
				}
			}, call_1);
		}
		$(this).attr("disabled",false);
	});
	
	function getParamAndValidate(){
		var currTab = getCurrentPageObj();
		var result = new Object();
		result.result = false;
		if(!vlidate(currTab,"",true)){
			return result;
		}
		//取值，申请信息及投产变更说明
		var param = {};
		var values = currTab.find("#sendProCommitDiv [name][type!='radio']");
		for(var i=0; i<values.length; i++) {
			var obj = $(values[i]);
			param[obj.attr("name")] = obj.val();
		}
		//取值，投产内容，并判断是否为空
		var sendData = currTab.find("#sendProCommitContent").bootstrapTable('getData');
		if(sendData.length == 0) {
			alert("无投产内容！");
			return result;
		}
		param["sendData"] = JSON.stringify(sendData);
		result.result = true;
		result.param = param;
		return result;
	}

//初始化验证
initVlidate(getCurrentPageObj());