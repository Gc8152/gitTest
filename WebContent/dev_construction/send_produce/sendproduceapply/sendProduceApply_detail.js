//第一个页签
function initSendProInfoDetail(item) {
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
//					else if(data.send["SYSTEM_IS_CC"]=="01") {
					getCurrentPageObj().find("#test_base_name").hide();
					getCurrentPageObj().find("tr[type=base_line]").hide();
				}
				for(var k in data.send){
					var val = data.send[k];
					k = k.toLowerCase();
					if(k=="audit_no"||k=="relate_audit_no") {
						getCurrentPageObj().find("#"+k).text(val.toUpperCase());
					} else {
						getCurrentPageObj().find("#"+k).text(val);
					}
				}
				if(data.send["relate_audit_no"]) {
					getCurrentPageObj().find("#relate_audit_no_span").css("display", "inline");
				}
				if(data.send['is_drill']=='01'){
					getCurrentPageObj().find("#is_drill").text("否");
				} else {
					getCurrentPageObj().find("#is_drill").text("是");
				}
			}
			getCurrentPageObj().find("#change_type").text(item["CHANGE_TYPE"]);
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
	getCurrentPageObj().find("#sendProContent1").bootstrapTable({
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
			width : 150,
			field : 'REQ_TASK_CODE',
			title : '任务编号',
			align : 'center',
			formatter: function (value, row, index) {
				return '<span class="hover-view" '+
				'onclick="initTaskInfo('+row.REQ_TASK_ID+')">'+value+'</span>';
			}
		},{
			width : 150,
			field : 'REQ_TASK_NAME',
			title : '任务名称',
			align : "center"
		},{
			width : 95,
			field : 'REQ_TASK_STATE_CN',
			title : '任务状态',
			align : "center"
		},{
			width : 95,
			field : 'REQ_TASK_TYPE_NAME',
			title : '任务来源',
			align : "center"
		},{
			width : 95,
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
			width: 95
		}, {
			width : 130,
			field : "checkResult",
			title : "是否满足投产要求",
			align : "center",
			formatter: function(value, row, index) {
				if(value) {
					return "是";
				} else {
					return "否";
				}
			}
		}, {
			width : 95,
			field : "TOTAL",
			title : "涉及任务数",
			align : "center",
		}, {
			width : 120,
			field : "PUTIN_START",
			title : "发起投产个数",
			align : "center",
		}, {
			width : 120,
			field : "PUTIN",
			title : "完成投产个数",
			align : "center",
		} ]
	});
	
	//初始化已发起及已投产内容
	var call_sendTask3 = getMillisecond()+'3';
	getCurrentPageObj().find("#produceTaskInSameAuctiNo").bootstrapTable({
		url : dev_construction+'sendProduceApply/produceTaskInSameAuctiNo.asp?call='+call_sendTask3+'&SID='+SID+'&audit_no='+item.AUDIT_NO,
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "req_task_id", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		jsonpCallback: call_sendTask3,
		onLoadSuccess:function(data){
			gaveInfo();	
		},
		columns : [ {
			field: 'req_task_id',
			title : '任务ID',
			align : "center",
			visible: false
		},{
			width : 150,
			field : 'audit_no',
			title : '投产单编号',
			align : 'center'
		},{
			width : 150,
			field : 'req_task_code',
			title : '任务编号',
			align : 'center',
			formatter: function (value, row, index) {
				return '<span class="hover-view" '+
				'onclick="initTaskInfo('+row.req_task_id+')">'+value+'</span>';
			}
		},{
			width : 150,
			field : 'req_task_name',
			title : '任务名称',
			align : "center"
		},{
			width : 95,
			field : 'req_task_state_cn',
			title : '任务状态',
			align : "center"
		},{
			width : 95,
			field : 'req_task_type_name',
			title : '任务来源',
			align : "center"
		},{
			width : 95,
			field : 'req_task_relation',
			title : '从属关系',
			align : "center",
			formatter: function(value, row, index) {
				if(value=='01') {
					return "主办";
				}
				return "配合";
			}
		} ]
	});
	
	//根据 ---投产编号--- 查找下面所有的任务的接口
	var SendProduce="SendProduce";
	initqueryInterface(item.AUDIT_NO,SendProduce);
	/******** 相关文档上传 ************/
	//附件上传
	var currTab = getCurrentPageObj();
	tablefile = currTab.find("#table_file");
	//初始化附件列表
	getSvnFileList(tablefile, currTab.find("#file_view_modal"), item.AUDIT_NO, "12");
}
//需求任务详情
function initTaskInfo(req_task_id){
	closePageTab("req_taskDetail");
	openInnerPageTab("req_taskDetail","任务详情页面","dev_construction/requirement/requirement_analyze/task_accept/task_detail.html",function(){
		initReqTaskDetailLayout(req_task_id);
	});
}
//第二个页签
function initSendProInfoTab2() {
	var call_sendTask = getMillisecond()+'3';
	var queryParams = function(params){
		var temp = {};
		temp["limit"] = params.limit;
		temp["offset"] = params.offset;
		return temp;
	};
	var audit_no = getCurrentPageObj().find("#audit_no").text(); 
	//getCurrentPageObj().find("#sendProContent").bootstrapTable("destory");
	getCurrentPageObj().find("#sendProContent2").bootstrapTable({
		url : dev_construction+'sendProduceApply/querySendTaskByAuditNo.asp?call='+call_sendTask+'&SID='+SID+'&audit_no='+audit_no.toUpperCase(),
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
			getCurrentPageObj().find("#sendProContent2").find("span[name=viewSendProMaterial]").click(function(){
				viewSendProMaterial($(this).attr('index'));
			});
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
			formatter:function(value, row, index) {
				return '<span class="click_text_sp" name="viewSendProMaterial" index='+index+'>'+value+'</span>';
			}
		},{
			field : 'REQ_TASK_NAME',
			title : '任务名称',
			align : "center"
		},{
			field : 'REQ_TASK_TYPE_NAME',
			title : '任务来源',
			align : "center"
		},{
			field : 'REQ_TASK_RELATION',
			title : '从属关系',
			align : "center",
			formatter: function(value, row, index) {
				if(value=='01') {
					return "主办";
				}
				return "协办";
			}
		}, {
			field : "checkResult",
			title : "是否满足投产要求",
			align : "center",
			formatter: function(value, row, index) {
				if(value) {
					return "是";
				} else {
					return "否";
				}
			}
		}, {
			field : "TOTAL",
			title : "涉及任务数",
			align : "center",
		}, {
			field : "PUTIN_START",
			title : "发起投产个数",
			align : "center",
		}, {
			field : "PUTIN",
			title : "完成投产个数",
			align : "center",
		} ]
	});
	
	var produce_standard = new Object();
	//双月
	produce_standard["02"] = [true, true, true, true, true, true, false, false, true, true, true, true, false, false];
	//单月
	produce_standard["03"] = [true, true, true, true, true, true, false, false, true, true, true, true, false, false];
	//双周
	produce_standard["04"] = [true, true, true, true, false, true, false, false, true, true, true, true, false, false];
	//特殊版
	produce_standard["14"] = [true, true, true, true, false, true, false, false, true, true, true, true, false, false];
	//紧急版
	produce_standard["15"] = [true, true, true, true, false, false, false, false, true, true, true, true, false, false];

	//1618
	produce_standard["other"] = [true, true, true, true, true, true, true, true, true, true, true, true, true, true];
	var detailTable = getCurrentPageObj().find("#sendProContentDetail");
	detailTable.hide();
	function viewSendProMaterial(index) {
		detailTable.show();
		var row = getCurrentPageObj().find("#sendProContent2").bootstrapTable("getData")[index];
		var req_task_code = row.REQ_TASK_CODE;
		detailTable.find("#material_req_task_id").val(req_task_code);
		
		baseAjaxJsonp(dev_construction+'sendProduceApply/queryTaskAppraiseAndDoc.asp?call='+call_sendTask+'&SID='+SID+'&req_task_code='+req_task_code,null, function(result){
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
				if(type=="appr"){
					valObj = result[trName];
				} else if(type=="doc"){
					valObj = result["doc"][trName];
				} else if(type=="test"){
					valObj = result[trName];
				}
				var phase_val = "";
				var result_val = "";
				result_val = "不满足";
				if(typeof(valObj)!="undefined"&&valObj!=null){
					if(type=="appr"){
						switch(valObj){
						/*case '01':
						  phase_val = "一级评审发起中";	  break;
						case '02':
						  phase_val = "一级评审通过";
						  result_val = "满足";		  break;
						case '03':
						  phase_val = "一级评审不通过";	  break;
						case '04':
						  phase_val = "二级评审发起中";
						  result_val = "满足";		  break;
						case '05':
						  phase_val = "二级评审通过";
						  result_val = "满足";		  break;
						case '06':
						  phase_val = "二级评审不通过";
						  result_val = "满足";		  break;
						case '10':
							  phase_val = "评审结案";
							  result_val = "满足";		  break;*/
							case '01':
							  phase_val = "评审发起中";	  break;
							case '02':
							  phase_val = "评审通过";
							  result_val = "满足";		  break;
							case '03':
							  phase_val = "评审不通过";	  break;
							case '04':
							  phase_val = "评审发起中";
							  result_val = "满足";		  break;
							case '05':
							  phase_val = "评审通过";
							  result_val = "满足";		  break;
							case '06':
							  phase_val = "评审不通过";
							  result_val = "满足";		  break;
							case '10':
								  phase_val = "评审结案";
								  result_val = "满足";		  break;
						}
						//$result_td.html("适用");
					} else if(type=="doc"){
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
					if(type=="appr"){
						phase_val = "未发起";
					} else if(type="doc"){
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
		}, call_sendTask);
	}
}
//点击第二个页面
getCurrentPageObj().find("#sendTaskInfo").click(function(){
	initSendProInfoTab2();
});

//初始化评审情况
var tableCall2 = getMillisecond();
//流程实例id
var instance_id="";
function initcontentPop(){
	getCurrentPageObj().find('#apphistoryPop').empty();
	getCurrentPageObj().find('#apphistoryPop').append(
		'<div class="ecitic-title">'+
			'<span>流程审批列表<em></em></span>'+
		'</div>'+
		'<div class="ecitic-new">'+
			'<table id="AFApprovalTableInfo" class="table table-bordered table-hover"></table>'+
		'</div>'		
	);

}
/*审批列表表格初始化列表*/
function initReqApprovalDetailInfo(instance_id) {
	this.instance_id=instance_id;
	initcontentPop();
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	
	getCurrentPageObj().find('#AFApprovalTableInfo').bootstrapTable({
		url :'AFLaunch/queryAFApprovalLists.asp?instance_id='+instance_id+"&call="+tableCall2,
		method : 'get', //请求方式（*）   
		striped : true, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : false, //是否显示分页（*）
		pageList : [5,10],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : false, //是否启用点击选中行
		uniqueId : "af_id", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:tableCall2,
		singleSelect: true,
		onLoadSuccess:function (){
			setRowspan("AFApprovalTableInfo");
		},
		columns : [{
			field : 'N_ID',
			title : '审批节点id',
			align : "center",
			visible:false
		},{
			field : 'N_NAME',
			title : '审批岗位',
			align : "center",
			valign: "middle"
		}, {
			field : "APP_PERSON",
			title : "工号",
			align : "center",
			visible:false
		}, {
			field : "APP_PERSON_NAME",
			title : "审批人",
			align : "center"
		}, {
			field : "APP_STATE",
			title : "操作",
			align : "center",
			formatter:function(value,row,index){
        	  if(row.STATE_NAME){
        		  return row.STATE_NAME;
        	  } 
        	  return '--';
          }
		}, {
			field : "APP_CONTENT",
			title : "审批意见",
			align : "center"
		}, {
			field : "OPT_TIME",
			title : "审批时间",
			align : "center"
		}]
	});
}
//合并单元格
function setRowspan(id){
	var tabledata=getCurrentPageObj().find('#'+id).bootstrapTable('getData');
	var n_name = tabledata[0].N_NAME;
	var j=0;
	var k=1;
	for(var i=1;i<tabledata.length;i++){
		if(n_name!=tabledata[i].N_NAME){
			getCurrentPageObj().find('#'+id).bootstrapTable('mergeCells',{index:j,field:'N_NAME',colspan:1,rowspan:k});
			j=i;
			k=1;
			n_name=tabledata[i].N_NAME;
		}else{
			k++;
		}
	}
	getCurrentPageObj().find('#'+id).bootstrapTable('mergeCells',{index:j,field:'N_NAME',colspan:1,rowspan:k});
}
	