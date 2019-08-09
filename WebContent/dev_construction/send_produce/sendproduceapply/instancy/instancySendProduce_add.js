function queryTaskByTaskIdForCheck(req_task_ids,func_call){
			var checkcall = getMillisecond()+"1";
			var plan_date = getCurrentPageObj().find("#plan_date").val();
			baseAjaxJsonp(dev_construction+'sendProduceApply/querySendInstancyTaskByTaskIdForCheck.asp?call='+checkcall+'&SID='+SID+
					'&req_task_ids='+req_task_ids+'&plan_date='+plan_date,null,function(item){	
				func_call(item);
			},checkcall);
}

function initSendProduceInstancy_add(){
	var currTab = getCurrentPageObj();
	initSendProduceInstancyApply(currTab);
}

function initSendProduceInstancyApply(currTab){
	//初始化验证
	initVlidate(currTab);
	freshSendProInstancyContent(null);
	initInstancyInterfaceSendAdd(null);
	currTab.find("#business_code").val(Math.uuid());
	//选择应用
	currTab.find("#system_name").unbind("click");
	currTab.find("#system_name").click(function() {
		getCurrentPageObj()[0].sysparam="&project_man_id="+$("#currentLoginNo").val();
		openSystemPop("sendProduceInstancySystem",{name:currTab.find("#system_name"),
			id:currTab.find("#system_id"),type:"instancy",queryParam:"&isKeJi=00",func_call:function(){
				getCurrentPageObj().find("#sendProInstancyContent").bootstrapTable("removeAll");
			}});
	});
	//添加紧急任务按钮
	currTab.find("#addInstancyTask").click(function(){ 
		var system_id = currTab.find("#system_id").val();
		if(system_id==""){
			alert("应用不能为空");
			return ;
		}
		openSendTaskPop("sendProduceSendProPop",{system_id:currTab.find("#system_id"),type:"add",func_call:function(req_task_ids){
			queryTaskByTaskIdForCheck(req_task_ids,function(item){
				 if(item != undefined&&item != null&&item.result == "true"){
				 }else{
						var mess = item.mess;
						if(mess){
							alert(mess);
						}else{
							var param = {};
							param["req_task_ids"] = req_task_ids;
							param["plan_date"] = plan_date;
							openNoSendProduceTaskPop("assistInstancyTask_pop",param);
							alert("所选应用版本下的主办任务有协办任务未发起投产!请督促协办任务投产！");
							return false;
						}
					}
	});
		}});
	});
	//申请人
	currTab.find("#apply_person_name").val($("#currentLoginName").val());
	currTab.find("#apply_person").val($("#currentLoginNo").val());
	
	//保存并提交按钮
	currTab.find("#submit").unbind("click");
	currTab.find("#submit").click(function(){
		var result = getParamAndValidate();
		
		var change_remark=getCurrentPageObj().find("#change_remark").val();
	    if(change_remark.length>100){
	    	alert("变更功能说明及要点至多可输入100汉字！");
	    	return;
	    }
	    var change_affect=getCurrentPageObj().find("#change_affect").val();
	    if(change_affect.length>100){
	    	alert("变更影响至多可输入100汉字！");
	    	return;
	    }
	    var change_risk_remark=getCurrentPageObj().find("#change_risk_remark").val();
	    if(change_risk_remark.length>50){
	    	alert("变更风险说明至多可输入50汉字！");
	    	return;
	    }
	    var ser_affect_remark=getCurrentPageObj().find("#ser_affect_remark").val();
	    if(ser_affect_remark.length>50){
	    	alert("业务影响说明至多可输入50汉字！");
	    	return;
	    }
	    var ser_try_run=getCurrentPageObj().find("#ser_try_run").val();
	    if(ser_try_run.length>50){
	    	alert("业务试运行及推广计划至多可输入50汉字！");
	    	return;
	    }
		
		if(result.result == true){
			 /*var checkcall = getMillisecond()+"1";
			var plan_date = currTab.find("#plan_date").val();
			queryTaskByTaskIdForCheck(result.req_task_ids,function(item){
				 if(item != undefined&&item != null&&item.result == "true"){*/
					if(!validateFile()){//检验投产文档是否上传完毕
						return;
					}
					//生产投产编号
					var todayDate = new Date();
				    var year = todayDate.getFullYear();
				    var month = todayDate.getMonth()+1+'';
				    if(month.length==1){
				    	month="0"+month;
				    }
				    var date=todayDate.getDate()+'';
				    if(date.length==1){
				    	date="0"+date;
				    }
				    var call = getMillisecond()+'1';
				    var url = dev_construction+"sendProduceApply/getSerialNumberSeq.asp?SID="+SID+"&call="+call;
					baseAjaxJsonp(url,{seq:"G_SEQ_PRJ_SEND_PRODUCEID"}, function(data){
						if (data&&data.result=="true") {
							var code =data.seqCode;
							if(code<=9){
								code='000'+data.seqCode;
							}else if(code>=10&&code<99){
								code='00'+data.seqCode;
							}else if(code>=100&&code<=999){
								code='0'+data.seqCode;
							}
							var codeNum="TC"+year+month+'-'+code;
							//把生成的编号写到页面
							getCurrentPageObj().find("#audit_no").val(codeNum);
							result.param["audit_no"] = codeNum;
					
					var call = getMillisecond();
					var url = dev_construction+'sendProduceApply/submitInstancySendProInfo.asp?call='+call+'&SID='+SID+"&submit=1";
					result.param["approve_status"] = "05";//02:审批中，03：审批通过 05投产待确认
					result.param["req_task_ids"] = result.req_task_ids;
					result.param["b_name"] = result.param.system_name+",紧急投产（投产单编号："+codeNum+"）已提交投产申请";
					baseAjaxJsonp(url, result.param, function(data){
					if (data != undefined&&data!=null&&data.result=="true") {
						alert("提交成功!");
						closeCurrPageTab();
						
						/*var item = new Object();
						item["af_id"] = '63';//流程id
						item["systemFlag"] = '02'; //systemFlag：系统标识（合同系统：00，项目系统：01，报销系统：02，工程管理：03）
						item["biz_id"] = result.param.audit_no;//业务id
						var n_org = $("#currentLoginNoOrg_no").val();
						item["n_org_gao"] = n_org.substring(0,6);
						approvalProcess(item,function(data){*/
							/*var call = getMillisecond();
						    baseAjaxJsonp(dev_construction+'sendProduceApprove/allowApprove.asp?call='+call+'&SID='+SID+"&audit_no="+result.param.audit_no+"&approve_status=03&as=01", null , function(data) {
								if (data != undefined && data != null && data.result=="true") {
									alert("提交成功!");
									closeCurrPageTab();
								}else{
									alert("提交失败，请联系管理员修改！");
									closeCurrPageTab();
								}
							},call);  */
						/*});*/
					}else {
						alert("提交失败！");
						}
					}, call);
							} else {
								alert("流水号获取失败！");
							}
						}, call, false);
				 
				/* }else{
					var mess = item.mess;
					if(mess){
						alert(mess);
					}else{
						var param = {};
						param["req_task_ids"] = result.req_task_ids;
						param["plan_date"] = plan_date;
						openNoSendProduceTaskPop("assistInstancyTask_pop",param);
						alert("此应用下的主办任务有协办任务未发起投产！");
						return false;
					}
				}
			},checkcall);*/
		}
	});
	
	function getParamAndValidate(){
		var result = new Object();
		result.result = false;
		if(!vlidate(currTab,"",true)){
			alert("请完善必填信息");
			return result;
		}
		//取值，申请信息及投产变更说明
		var param = {};
		var values = currTab.find("#sendProInstancyDiv [name][type!='radio']");
		for(var i=0; i<values.length; i++) {
			var obj = $(values[i]);
			param[obj.attr("name")] = obj.val();
		}
		//“是否紧急投产” 00：是  01：否
		param["is_instancy"] = "00";
		//是否演练，01：否
		param["is_drill"] = "01";
		//取值，投产内容，并判断是否为空
		if(!validateProduceTaskIsAble()){
			return result;
		}
		if(!checkInstancyFileUpload("#table_file1")){
			return result;
		}
		var sendData = currTab.find("#sendProInstancyContent").bootstrapTable('getData');
		var req_task_ids = $.map(sendData,function(row){
			return row.REQ_TASK_ID;
		}).join(",");
		result.req_task_ids = req_task_ids;
		
		var sendDataForSubmit = new Array();
		for(var i=0; i<sendData.length; i++){
			var item = new Object();
			item["REQ_TASK_ID"] = sendData[i]["REQ_TASK_ID"];
			item["REQ_TASK_RELATION"] = sendData[i]["REQ_TASK_RELATION"];
			sendDataForSubmit.push(item);
		}
		param["sendData"] = JSON.stringify(sendDataForSubmit);
		result.result = true;
		result.param = param;
		return result;
	}
	 
 	//检验投产内容
	function validateProduceTaskIsAble(){
		var result = true;
		var sendData = currTab.find("#sendProInstancyContent").bootstrapTable('getData');
		if(sendData.length == 0) {
			alert("没有要投产的内容！");
			return false;
		}
		for(var i=0;i<sendData.length;i++){
			var checkResult = sendData[i].checkResult;
			if(!checkResult){
				alert("投产任务不满足投产条件");
				result = false;
				break;
			}
		}
		return result;
	}
	//检验投产文档
 	function validateFile(){
 		var file_tcsc = false;
 		var fileData  = getCurrentPageObj().find("#table_file1").bootstrapTable('getData');
		for(var row in fileData){
			if(fileData[row]["FILE_TYPE"]=='11'){
				file_tcsc = true;
			}
		}
		if(file_tcsc!=true){
			alert("请上《投产变更操作手册》！");
			file_tcsc = false;
		}
		return file_tcsc;
 	}
	/******** 相关文档上传 ************/
	//点击文件上传模态框
	var tablefile = currTab.find("#table_file1");
	//构建文件上传路径拼接所需参数
	var addfile = currTab.find("#add_file");
	var business_code = currTab.find("#business_code").val();
	addfile.click(function(){
		if(!validateProduceTaskIsAble()){
			return;
		}
		var fileData  = getCurrentPageObj().find("#table_file1").bootstrapTable('getData');
		if(fileData.length>=1){
			alert("只能上传一份资源说明手册，请删除再重新上传！");
			return;
		}
		var paramObj = new Object();
		var sys_name = getCurrentPageObj().find("#system_name").val();
		var req_task_code = getCurrentPageObj().find("#req_task_code").val();
		if(sys_name==""||sys_name=="点击选择"){
			alert("请先选择应用");
			return ;
		} else {
			paramObj.SYSTEM_NAME = sys_name;
			paramObj.VERSIONS_NAME = "紧急需求";
			paramObj.DELOY_NAME = req_task_code+"投产";
		}
		openFileSvnUpload(currTab.find("#file_modalInstancy"), tablefile, 'GZ1062',business_code, '12', 'G_DIC_SEND_IPRODUCE_FILE', false, true,paramObj);
	});
	
	 //附件删除
	 var delete_file = currTab.find("#delete_file");
	 delete_file.click(function(){
		 delSvnFile(tablefile, business_code, "12");
	 });
	 getSvnFileList(tablefile, currTab.find("#file_view_modalInstancy"),business_code, "12");
}

function refreshSendProSvnOrFtp(is_cc){
	if(typeof(is_cc)!="undefined"){
		getCurrentPageObj().find("#system_is_cc").val(is_cc);
		if(is_cc=="00"){
			getCurrentPageObj().find("#base_line_name").show();
		} else if(is_cc=="01") {
			getCurrentPageObj().find("#base_line_name").hide();
			
		}
	}
}
	

/**
 * 重新选择应用，刷新投产内容中的任务
 * @param system_id
 */
function freshSendProInstancyContent(system_id) {
	var currTab = getCurrentPageObj();
	/**
	 * 初始化投产内容列表
	 */
	var queryParams = function(params){
		var temp = {};
		temp["limit"] = params.limit;
		temp["offset"] = params.offset;
		return temp;
	};
	var SendProContent_call = getMillisecond();
	currTab.find("#sendProInstancyContent").bootstrapTable("destroy").bootstrapTable({
		url : dev_construction+'sendProduceApply/queryInstancyTaskBySystemNo.asp?call='+SendProContent_call+'&SID='+SID+'&system_id='+system_id,
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
		jsonpCallback: SendProContent_call,
		onLoadSuccess:function(data){
			gaveInfo();	
		},
		columns : [ {
			field : 'REQ_TASK_ID',
			title : '任务ID',
			align : "center",
			visible: false
		},{
			width : "14%",
			field : 'REQ_TASK_CODE',
			title : '任务编号',
			align : 'center',
			formatter: function (value, row, index) {
				return '<span class="hover-view" '+
				'onclick="lookInstancyTaskInfo('+row.REQ_TASK_ID+')">'+value+'</span>';
			}
		},{
			width : "10%",
			field : 'REQ_TASK_NAME',
			title : '任务名称',
			align : "center"
		}, {
			width : "8%",
			field: 'REQ_TASK_STATE_NAME',
			title: '任务状态',
			align:"center"
        },{
			width : "8%",
			field : 'REQ_TASK_TYPE_NAME',
			title : '任务来源',
			align : "center"
		},{
			width : "8%",
			field : 'REQ_TASK_RELATION',
			title : '从属关系',
			align : "center",
			formatter: function(value, row, index) {
				if(value=='01') {
					return "主办";
				}
				return "配合";
			}
		}, {
			width : "12%",
			field : "checkResult",
			title : "是否满足投产要求",
			align : "center",
			formatter: function(value, row, index) {
				if(value) {
					/*if(row.VERSIONS_TYPE=='15'){
						return '<span style="color:blue" onclick="viewSendProduceConditions2(\''+row.REQ_TASK_CODE+'\')">是</span>';
					}else{
						return '<span style="color:blue" onclick="viewSendProduceConditions(\''+row.REQ_TASK_CODE+'\')">是</span>';
					}*/
					return '<span style="color:blue" onclick="viewSendProduceConditions(\''+row.REQ_TASK_CODE+'\')">是</span>';
				} else {
					/*if(row.VERSIONS_TYPE=='15'){
						return '<span style="color:blue" onclick="viewSendProduceConditions2(\''+row.REQ_TASK_CODE+'\')">否</span>';
					}else{
						return '<span style="color:blue" onclick="viewSendProduceConditions(\''+row.REQ_TASK_CODE+'\')">否</span>';
					}*/
					return '<span style="color:blue" onclick="viewSendProduceConditions(\''+row.REQ_TASK_CODE+'\')">否</span>';
				}
			}
		}, {
			width : "10%",
			field : "TOTAL",
			title : "涉及任务数",
			align : "center",
		}, {
			width : "10%",
			field : "PUTIN_START",
			title : "发起投产个数",
			align : "center",
		}, {
			width : "10%",
			field : "PUTIN",
			title : "完成投产个数",
			align : "center",
		}
		, {
			width : "6%",
			field : "",
			title : "操作",
			align : "center",
			formatter:function(value, row, index) {
				var edit='<a class="click_text_sp" cursor:pointer;" onclick="delSendProTask('+row.REQ_TASK_ID+');">删除</a>';
				 return edit; 
			}
		}]
	});
}
//需求任务详情
function lookInstancyTaskInfo(req_task_id){
	closePageTab("req_taskDetail");
	openInnerPageTab("req_taskDetail","任务详情页面","dev_construction/requirement/requirement_analyze/task_accept/task_detail.html",function(){
		initReqTaskDetailLayout(req_task_id);
	});
}
/**
 * 投产内容中删除一行
 * @param index
 */
function delSendProTask(id) {
	var currTab = getCurrentPageObj();
	//删除任务
	currTab.find("#sendProInstancyContent").bootstrapTable("removeByUniqueId", id);	
	var arr = [id]; 
	//删除任务关联的接口
	currTab.find("#interface_Table").bootstrapTable('remove', {field: 'REQ_TASK_ID', values: arr});
}

/**
 * 重新选择应用，刷新投产内容中的接口
 */
function initInstancyInterfaceSendAdd(req_task_ids) {
	var queryInterfacecall = getMillisecond()+1;
	var queryParams = function(params){
		var temp = {};
		temp["limit"] = params.limit;
		temp["offset"] = params.offset;
		return temp;
	};
	getCurrentPageObj().find("#interface_Table").bootstrapTable("destroy").bootstrapTable(
			{
				url : dev_construction+'sendProduceApply/queryInstancyTaskInterface.asp?call='+queryInterfacecall+'&SID='+SID+'&req_task_id='+req_task_ids,
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
				uniqueId : "INTER_ID", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: true,
				jsonpCallback: queryInterfacecall,
				onLoadSuccess:function(data){
					gaveInfo();	
				},
				columns : [{
					field : 'REQ_TASK_ID',
					title : '任务序列号',
					align : "center",
					
				},{
					field : 'SUB_REQ_ID',
					title : '需求点序列号',
					align : "center",
					visible:false
				},{
					field : "INTER_CODE",
					title : "接口编号",
					align : "center",
					width : "10%"
				},{
					field : "INTER_NAME",
					title : "接口名称",
					align : "center",
					width : "15%"
				},{
					field : "INTER_VERSION",
					title : "接口版本",
					align : "center",
				},{
					field : "SYSTEM_NAME",
					title : "服务方应用id",
					align : "center",
				},{
					field : "INTER_OFFICE_TYPE_NAME",
					title : "接口业务类型",
					align : "center",
				},{
					field : "APP_TYPE_NAME",
					title : "申请类型",
					align : "center",
				}, {
					field : "START_WORK_TIME",
					title : "开始执行时间",
					align : "center",
					valign: 'middle',
					width : "10%",
				}]

			});
}


//查看投产条件
function viewSendProduceConditions(req_task_code){
	var produce_standard = new Object();
	//双月
	produce_standard["02"] = [true, true, true, true, true, true, false, false, true, true, true, true, false, false];
	//单月
	produce_standard["03"] = [true, true, true, true, true, true, false, false, true, true, true, true, false, false];
	//双周
	produce_standard["04"] = [true, true, true, true, false, false, false, false, true, true, true, true, false, false];
	//1618
	produce_standard["other"] = [true, true, true, true, true, true, true, true, true, true, true, true, true, true];

	var detailTable = getCurrentPageObj().find("#sendProContentDetail");
	detailTable.find("#material_req_task_code").val(req_task_code);
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
				result_val = ps[i]?result_val:"不满足";
			} else {
				/* if(type=="doc"){
					phase_val = "必要";
				 }else if(type=="doc1"){
					 phase_val = "未上传"; 
				 }*/
				if(ps[i]){
					phase_val = "必要";
					result_val="不满足";
				}else{
					phase_val = "未上传";
					result_val="非必要";
				}
//				 result_val = ps[i]?result_val:"不满足";
				$phase_td.unbind("click");
			}
			$phase_td.html(phase_val);
			$phase_td.css("color","black");
			if(phase_val.indexOf(".")!=-1){
				$phase_td.css("color","blue");
			}
			if(result_val=="不满足"){
				$result_td.css("color","red");
			} else {
				$result_td.css("color","black");
			}
			$result_td.html(result_val);
		}
		getCurrentPageObj().find("#modal_req_approve_and_doc").modal("show");
	}, mill);
}

//查看紧急版的准入条件
function viewSendProduceConditions2(req_task_code){
	openCheckPop("AddCheck_pop",req_task_code);
}

//初始化值
function sendInstancyApply (data){
	var currTab = getCurrentPageObj();
	currTab.find("#system_id").val(data.SYSTEM_NO);
	currTab.find("#system_name").val(data.SYSTEM_NAME);
	currTab.find("#versions_id").val(data.VERSION_ID);
	currTab.find("#plan_date").val(data.START_TIME);
	initSendProduceInstancy_add();
}