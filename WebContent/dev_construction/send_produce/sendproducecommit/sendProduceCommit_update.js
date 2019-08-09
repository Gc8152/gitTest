/**
 * 修改时原来在投产任务中的任务ID（草拟状态中）
 */
var originTaskId;
/**
 * 初始化页面信息
 * @param p
 */
function initSendProInfoCommitUpdate(p) {
	//投产单基本信息
	var call_sendInfo = getMillisecond()+'1';
	var url = dev_construction+'sendProduceApply/queryOneSendProInfoUpdate.asp?call='+call_sendInfo+'&SID='+SID+'&audit_no='+p;
	baseAjaxJsonp(url, null, function(data){
		if (data != undefined&&data!=null&&data.result=="true") {
			if(data.send){
				//查询cc基线和SVN信息
				/* baseAjaxJsonp(dev_application+"sendProduceApply/queryOneSendProInfo.asp?SID="+SID+"&audit_no="+p+"&call="+call_sendInfo, null , function(data) {
					 for ( var k in data.send) {
							 var str=data[k];
							  k = k.toLowerCase();
							
						if(k=="line_info"){
							getCurrentPageObj().find("input[name='"+ k +"']").val(str);
						}else if(k=="package_svn"){
							getCurrentPageObj().find("input[name='"+ k +"']").val(str);
						}
						else {
							$("span[name="+k+" ]").text(str);
					   }
					  }
				
				  },call_sendInfo);*/
				
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
					if(k=="audit_no"||k=="relate_audit_no") {
						getCurrentPageObj().find("#"+k).text(val.toUpperCase());
					} else {
						getCurrentPageObj().find("#"+k).text(val);
					}
					getCurrentPageObj().find("input[name="+k+"]").val(val);
					getCurrentPageObj().find("textarea[name="+k+"]").text(val);
				}
				
				/*if(data.send["relate_audit_no"]) {
					getCurrentPageObj().find("#relate_audit_no_span").css("display", "inline");
				}*/
				if(data.send['is_drill']=='01'){
					getCurrentPageObj().find("#is_drill").text("否");
				} else {
					getCurrentPageObj().find("#is_drill").text("是");
				}
			}
			getCurrentPageObj().find("#change_type").text(data.send["CHANGE_TYPE"]);
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
	getCurrentPageObj().find("#sendProContent").bootstrapTable({
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
			width : 15,
			field : 'REQ_TASK_CODE',
			title : '任务编号',
			align : 'center',
			formatter: function (value, row, index) {
				return '<span class="hover-view" '+
				'onclick="initTaskDetailInfo('+row.REQ_TASK_ID+')">'+value+'</span>';
			}
		},{
			width : 21,
			field : 'REQ_TASK_NAME',
			title : '任务名称',
			align : "center"
		},{
			width : 8,
			field : 'REQ_TASK_TYPE_NAME',
			title : '任务来源',
			align : "center"
		},{
			width : 8,
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
			width: 8
		}/*, {
			width : 13,
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
		}*/, {
			width : 10,
			field : "TOTAL",
			title : "涉及任务数",
			align : "center",
		}, {
			width : 10,
			field : "PUTIN_START",
			title : "发起投产个数",
			align : "center",
		}, {
			width : 12,
			field : "PUTIN",
			title : "完成投产个数",
			align : "center",
		}, {
			width : 6,
			field : "",
			title : "操作",
			align : "center",
			formatter:function(value, row, index) {
				var edit='<a class="click_text_sp" onclick="detailSendProTaskUpdate(\''+index+'\');">查看</a>'
						/*+'/ <a class="click_text_sp" cursor:pointer;" onclick="delSendProTask('+row.REQ_TASK_ID+');">删除</a>'*/;
				return edit;  
			}
		} ]
	});
	
	initProduceTaskInSameAuctiNo(p);
	function initProduceTaskInSameAuctiNo(audit_no){
		//初始化已发起及已投产内容
		var call_sendTask = getMillisecond()+'2';
		getCurrentPageObj().find("#produceTaskInSameAuctiNo").bootstrapTable({
			url : dev_construction+'sendProduceApply/produceTaskInSameAuctiNo.asp?call='+call_sendTask+'&SID='+SID+'&audit_no='+audit_no,
			method : 'get', //请求方式（*）   
			striped : false, //是否显示行间隔色
			cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : true, //是否启用排序
			sortOrder : "asc", //排序方式
			sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
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
	}
	
	//根据 ---投产编号--- 查找下面所有的任务的接口
	var SendProduce="SendProduce";
	initqueryInterface(p,SendProduce);
	/******** 相关文档上传 ************/
	//点击文件上传模态框
	var currTab = getCurrentPageObj();
	var tablefile = currTab.find("#table_file");
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

/**
 * 页面按钮事件
 */
(function(){
	//投产包类型默认为基线包，选中补丁包时，出现选择审批单号的输入框
	getCurrentPageObj().find("input[name='pakage_type']").change(function() {
		var value = getCurrentPageObj().find("input[name='pakage_type']:checked").val();
		if(value == '01') {
			$(".hide_show_relate_id").css("display", "none");
			getCurrentPageObj().find("#relate_audit_no").val("");
		} else if(value == '02') {
			$(".hide_show_relate_id").css("display", "inline");
		}
	});
	
	//选择投产单号(基线包)
	getCurrentPageObj().find("#relate_audit_no").unbind("click");
	getCurrentPageObj().find("#relate_audit_no").click(function() {
		openSendProPop("#sendProduceSendProPop_update",{id:getCurrentPageObj().find("#relate_audit_no")});
	});
	
	//新增问题单任务
	getCurrentPageObj().find("#addProblemAndTask").unbind("click");
	getCurrentPageObj().find("#addProblemAndTask").click(function() {
		var system_id = getCurrentPageObj().find("#system_id").val();
		var versions_id = getCurrentPageObj().find("#versions_id").val();
		if(system_id && versions_id) {
			openTaskProblemPop("#sendProduceTaskProblemPop_update",{"system_no":system_id, "version_id":versions_id});			
		}else{
			alert("请先选择应用和版本");
		}
	});
	
	
	//保存按钮
	getCurrentPageObj().find("#save").unbind("click");
	getCurrentPageObj().find("#save").click(function() {
		var result = getParamAndValidate();
		
		var aaa=getCurrentPageObj().find("textarea[name='package_svn']").val();
	    if(aaa.length>150){
	    	alert("投产包SVN地址至多可输入150汉字！");
	    	return;
	    }
	    var bbb=getCurrentPageObj().find("textarea[name='package_instruction']").val();
	    if(bbb.length>150){
	    	alert("投产包使用说明至多可输入150汉字！");
	    	return;
	    }
		
		
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
		
		var aaa=getCurrentPageObj().find("textarea[name='package_svn']").val();
	    if(aaa.length>150){
	    	alert("投产包SVN地址至多可输入150汉字！");
	    	return;
	    }
	    var bbb=getCurrentPageObj().find("textarea[name='package_instruction']").val();
	    if(bbb.length>150){
	    	alert("投产包使用说明至多可输入150汉字！");
	    	return;
	    }
		
		if(result.result == true){
			result.param["audit_no"]=getCurrentPageObj().find("#audit_no").text();
			result.param["approve_status"]='05';
			var call_1 = getMillisecond();
			var url = dev_construction+'sendProduceCommit/updateSendProInfo.asp?call='+call_1+'&SID='+SID+'&submit=1';
			baseAjaxJsonp(url, result.param, function(data){
				if (data != undefined&&data!=null&&data.result=="true") {
					alert("提交成功!");
					closeCurrPageTab();
				} else {
					alert("保存失败！");
				}
				 /* 转移到投产审批后
				if (data != undefined&&data!=null&&data.result=="true") {
					var item = new Object();
					item["af_id"] = '63';//流程id
					item["systemFlag"] = '02'; //systemFlag：系统标识（合同系统：00，项目系统：01，报销系统：02，工程管理：03）
					item["biz_id"] = result.param.audit_no;//业务id
					//item["n_org_cc"] = '110107';
					item["n_org_pm"] = '110107';
					//item["n_org_gao"] = '110110';
					approvalProcess(item,function(data){
						var call = getMillisecond();
					    baseAjaxJsonp(dev_construction+'sendProduceApprove/allowApprove.asp?call='+call+'&SID='+SID+"&audit_no="+result.param.audit_no+"&approve_status=02&as=01", null , function(data) {
							if (data != undefined && data != null && data.result=="true") {
								alert("提交成功!");
								closeCurrPageTab();
							}else{
								alert("保存成功，提交失败，请在修改中维护");
								closeCurrPageTab();
							}
						},call);  
					});
				} else {
					alert("保存失败！");
				}*/
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
		var values = currTab.find("#sendProDiv [name][type!='radio']");
		for(var i=0; i<values.length; i++) {
			var obj = $(values[i]);
			param[obj.attr("name")] = obj.val();
		}
		var radios = currTab.find("#sendProDiv [type='radio']:checked");
		for(var j=0; j<radios.length; j++) {
			var obj2 = $(radios[j]);
			param[obj2.attr("name")] = obj2.val();
		}
		//“是否紧急投产”为“否(01)”
		param["is_instancy"] = "01";
		//取值，投产内容，并判断是否为空
		var sendData = currTab.find("#sendProContent").bootstrapTable('getData');
		if(sendData.length == 0) {
			alert("没有要投产的内容！");
			return result;
		}
		//投产类型是否填写完成
		var isComplete = true;
		$.each(sendData, function(i) {
			var prj_send_type = currTab.find("#prj_send_type"+i).val();
			if(prj_send_type == ' ' || prj_send_type == '') {//为空
				isComplete = false;
				return false;//终止整个循环 
			}
			sendData[i].PRJ_SEND_TYPE = currTab.find("#prj_send_type"+i).val();
		});
		if(!isComplete) {
			alert("请选择投产类型！");
			return result;
		}
		
		param["sendData"] = JSON.stringify(sendData);
		result.result = true;
		result.param = param;
		return result;
	}
})();


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
/**
 * 查看每条任务
 */
function detailSendProTaskUpdate(index){
	var rows = getCurrentPageObj().find("#sendProContent").bootstrapTable("getData");
	var detailTable = getCurrentPageObj().find("#sendProContentDetail");
	detailTable.find("#material_req_task_id").val(rows[index].REQ_TASK_CODE);
	detailTable.find("#material_req_task_type").val(rows[index].REQ_ACC_CLASSIFY);
	var mill = getMillisecond();
	baseAjaxJsonp(dev_construction+'sendProduceApply/queryTaskAppraiseAndDoc.asp?call='+mill+'&SID='+SID+'&req_task_code='+rows[index].REQ_TASK_CODE,null, function(result){
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
		getCurrentPageObj().find("#modal_req_approve_and_doc_update").modal("show");
	}, mill);
}

//初始化验证
initVlidate(getCurrentPageObj());