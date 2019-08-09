//第一个页签
function initInstancySendProInfoDetail(item) {
	//投产单基本信息
	var call_sendInfo = getMillisecond()+'1';
	var url = dev_construction+'sendProduceApply/queryOneSendProInfoUpdate.asp?call='+call_sendInfo+'&SID='+SID+'&audit_no='+item.AUDIT_NO;
	baseAjaxJsonp(url, null, function(data){
		if (data != undefined&&data!=null&&data.result=="true") {
			if(data.send){
				if(data.send["system_is_cc"]=="00"){
					getCurrentPageObj().find("#test_base_name").show();
					getCurrentPageObj().find("tr[type=svn_addr]").hide();
				} else{
					getCurrentPageObj().find("#test_base_name").hide();
					getCurrentPageObj().find("tr[type=base_line]").hide();
				}
				for(var k in data.send){
					var val = data.send[k];
					k = k.toLowerCase();
					if(k=="audit_no") {
						getCurrentPageObj().find("#"+k).text(val.toUpperCase());
					} else {
						getCurrentPageObj().find("#"+k).text(val);
					}
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
	getCurrentPageObj().find("#sendInstancyProContent1").bootstrapTable({
		url : dev_construction+'sendProduceApply/querySendTaskByAuditNo.asp?call='+call_sendTask+'&SID='+SID+'&audit_no='+item.AUDIT_NO,
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
				'onclick="initTaskInfo('+row.REQ_TASK_ID+')">'+value+'</span>';
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
			field : "STREAM_NAME",
			title : "流名称",
			align : "center",
			width :  "10%",
			visible:false
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
		} ]
	});
	
	//根据 ---投产编号--- 查找下面所有的任务的接口
	var SendProduce="SendProduce";
	initqueryInterface(item.AUDIT_NO,SendProduce);
	
	/******** 相关文档上传 ************/
	//附件上传
	var currTab = getCurrentPageObj();
	tablefile = currTab.find("#table_fileView");
	//初始化附件列表
	getSvnFileList(tablefile, currTab.find("#instancyFile_view_modal"), item.AUDIT_NO, "12");
}
//需求任务详情
function initTaskInfo(req_task_id){
	closePageTab("req_taskDetail");
	openInnerPageTab("req_taskDetail","任务详情页面","dev_construction/requirement/requirement_analyze/task_accept/task_detail.html",function(){
		initReqTaskDetailLayout(req_task_id);
	});
}

//点击第二个页面
getCurrentPageObj().find("#sendTaskInfodetail").click(function(){
	initSendProInfoTableda();
});
//第二个页签
function initSendProInfoTableda() {
	var call_sendTask = getMillisecond()+'1';
	var queryParams = function(params){
		var temp = {};
		temp["limit"] = params.limit;
		temp["offset"] = params.offset;
		return temp;
	};
	var audit_no = getCurrentPageObj().find("#audit_no").text(); 
	getCurrentPageObj().find("#sendInstancyProContent2").bootstrapTable(
			{
				url : dev_construction+'sendProduceApply/querySendTaskByAuditNo.asp?call='+call_sendTask+'&SID='+SID+'&audit_no='+audit_no,
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
					field : 'REQ_TASK_CODE',
					title : '任务编号',
					align : 'center',
					width : '15%',
					formatter:function(value, row, index) {
						if(row.VERSIONS_TYPE=='15'){
							return '<span class="click_text_sp" onclick="viewSendProMaterialDet2(\''+value+'\');">'+value+'</span>';
						}else{
							return '<span class="click_text_sp" onclick="viewSendProMaterialDet(\''+value+'\');">'+value+'</span>';
						}
					}
				},{
					field : 'REQ_TASK_NAME',
					title : '任务名称',
					align : "center",
					width : '25%',
				},{
					field : 'REQ_TASK_TYPE_NAME',
					title : '任务类型',
					width : '12%',
					align : "center"
				},{
					field : 'REQ_TASK_RELATION',
					title : '从属关系',
					align : "center",
					width : '12%',
					formatter : function(value, row, index){
						if(value=='01') {
							return "主办";
						}
						return "配合";
					}
				},{
					field : "TOTAL",
					title : "涉及任务数",
					align : "center",
					width : '12%',
				}, {
					field : "PUTIN_START",
					title : "发起投产个数",
					align : "center",
					width : '12%',
				}, {
					field : "PUTIN",
					title : "完成投产个数",
					align : "center",
					width : '12%',
				} ]
			});
}

var detailTable = getCurrentPageObj().find("#sendProInContentDetail2");
detailTable.hide();
function viewSendProMaterialDet(req_task_code) {
	getCurrentPageObj().find("#sendProDetailCheckTable").hide();//隐藏一般转紧急需求的任务检验table
	var produce_standard = new Object();
	//双月
	produce_standard["02"] = [true, true, true, true, true, true, false, false, true, true, true, true, false, false];
	//单月
	produce_standard["03"] = [true, true, true, true, true, true, false, false, true, true, true, true, false, false];
	//双周
	produce_standard["04"] = [true, true, true, true, false, false, false, false, true, true, true, true, false, false];;
	//1618
	produce_standard["other"] = [true, true, true, true, true, true, true, true, true, true, true, true, true, true];
	detailTable.show();
	detailTable.find("#detail_req_task_code").val(req_task_code);
	var mill = getMillisecond();
	baseAjaxJsonp(dev_construction+'sendProduceApply/queryTaskAppraiseAndDoc.asp?call='+mill+'&SID='+SID+'&req_task_code='+req_task_code,null, function(result){
		var trArr = detailTable.find("tbody tr");
		var len = trArr.length;
		var ps = produce_standard[result["VERSIONS_TYPE"]];
		if(typeof(ps)=="undefined"){
			ps = produce_standard["other"];
		}
		for(var i=0; i<len;i++){
			var $tr = $(trArr[i]);
			var trName = $tr.attr("name");
			var $phase_td = $tr.find("td[name=phase]");
			var $result_td = $tr.find("td[name=result]");
			var type = $tr.attr("type");
			var valObj = null; 
			if(type=="doc"){
				valObj = result["doc"][trName];
			} else if(type=="test"){
				valObj = result[trName];
			}
			var phase_val = "";
			var result_val = "";
			result_val = "不满足";
			if(typeof(valObj)!="undefined"&&valObj!=null){
				if(type=="doc"){
					phase_val = valObj.FILE_NAME;
					$phase_td.attr("file_id", valObj.FID);
					$phase_td.unbind("click").click(function(){
						verifyFileExit($(this).attr("file_id"));
					});
					result_val = "满足";
				} else if(type=="test"){
					phase_val = valObj=="00"?"通过":"不通过";
					result_val = valObj=="00"?"满足":"不满足";
				}
			} else {
				if(type="doc"){
					phase_val = "未上传";
				}
				$phase_td.unbind("click");
			}
			$phase_td.html(phase_val);
			$phase_td.css("color","black");
			if(phase_val.indexOf(".")!=-1){
				$phase_td.css("color","blue");
			}
			result_val = ps[i]?result_val:"非必要";
			if(result_val=="不满足"){
				$result_td.css("color","red");
			} else {
				$result_td.css("color","black");
			}
			$result_td.html(result_val);
		}
	}, mill);
}

//查看紧急版的准入条件
function viewSendProMaterialDet2(req_task_code){
	openCheckTable("sendProInContentDetailYB",req_task_code);
}