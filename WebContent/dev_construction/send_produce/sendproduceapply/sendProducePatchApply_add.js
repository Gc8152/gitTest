/**
 * 修改时原来在投产任务中的任务ID（草拟状态中）
 */
var originTaskId;
/**
 * 初始化页面信息
 * @param p
 */
function initSendProInfoPatch(p) {
	//投产单基本信息
	var call_sendInfo = getMillisecond()+'1';
	var url = dev_construction+'sendProduceApply/queryOneSendProInfoUpdate.asp?call='+call_sendInfo+'&SID='+SID+'&audit_no='+p;
	baseAjaxJsonp(url, null, function(data){
		if (data != undefined&&data!=null&&data.result=="true") {
			if(data.send){
				for(var k in data.send){
					if(k=="is_drill"||k=="pakage_type") {
						getCurrentPageObj().find("[name='"+k+"'][value='"+data.send[k]+"']").click();
						continue;
					}
					if(k=="change_type"){
						initSelect(getCurrentPageObj().find("#change_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_CHANGE_TYPE"},data.send[k]);
					}
					if(k=="audit_no") {
						//getCurrentPageObj().find("#"+k).val(data.send[k].toUpperCase());
					} else if(k=="relate_audit_no") {
						getCurrentPageObj().find("#"+k).val(data.send[k].toUpperCase());
					} else {
						getCurrentPageObj().find("#"+k).val(data.send[k]);												
					}
				}
				if(data.send["system_is_cc"]=="00"){
					getCurrentPageObj().find("#base_line_name").show();
				} else if(data.send["system_is_cc"]=="01") {
					getCurrentPageObj().find("#base_line_name").hide();
				}
				if(data.send["isdrill"]=="00") {
					getCurrentPageObj().find("input[name='is_drill'][value='01']").attr("disabled","true");
				} else {
					getCurrentPageObj().find("input[name='is_drill'][value='00']").attr("disabled","true");
				}
				
				refreshTaskTable(data.send["system_id"], data.send["versions_id"]);
				initqueryInterfaceSend_Add(data.send["system_id"], data.send["versions_id"]);
			}
		}
	}, call_sendInfo);
	
	function refreshTaskTable(system_id, versions_id){
		/**
		 * 初始化投产内容列表
		 */
		var queryParams = function(params){
			var temp = {};
			temp["limit"] = params.limit;
			temp["offset"] = params.offset;
			return temp;
		};
		var initSendProContent_call = getMillisecond();
		getCurrentPageObj().find("#sendProContent").bootstrapTable("destroy").bootstrapTable({
			url : dev_construction+'sendProduceApply/queryTaskBySysAndVer.asp?call='+initSendProContent_call+'&SID='+SID+'&system_id='+system_id+'&versions_id='+versions_id,
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
//				getCurrentPageObj().find(".file_template_style").hide();
				var sendData = getCurrentPageObj().find("#sendProContent").bootstrapTable('getData');
				var taskFileDoc = false;
				var projectFileDoc = false;
				for(var i=0; i<sendData.length; i++){
					var sendTask = sendData[i];
					if(sendTask["REQ_ACC_CLASSIFY"]=="01"){
						taskFileDoc = true;
					} else if(sendTask["REQ_ACC_CLASSIFY"]=="02"||sendTask["REQ_ACC_CLASSIFY"]=="03"){
						projectFileDoc = true;
					}
				}
				if(taskFileDoc){
					getCurrentPageObj().find("a[name=file_template_task]").show();
				}
				if(projectFileDoc){
					getCurrentPageObj().find("a[name=file_template_project]").show();
				}
				
			},
			columns : [ {
				field : 'REQ_TASK_ID',
				title : '任务ID',
				align : "center",
				visible: false
			},{
				width : 13,
				field : 'REQ_TASK_CODE',
				title : '任务编号',
				align : 'center',
				formatter: function (value, row, index) {
					return '<span class="hover-view" '+
					'onclick="lookTaskInfo('+row.REQ_TASK_ID+')">'+value+'</span>';
				}
			},{
				width : 21,
				field : 'REQ_TASK_NAME',
				title : '任务名称',
				align : "center"
			},{
				width : 8,
				field : 'REQ_TASK_STATE_CN',
				title : '任务状态',
				align : "center"
			},{
				width : 8,
				field : 'REQ_TASK_TYPE_NAME',
				title : '任务来源',
				align : "center"
			},{
				field : 'REQ_ACC_CLASSIFY_DISPLAY',
				title : '需求分类',
				align : 'center',	
				width : 10,
				formatter:function(value,row,index){
					if(row.REQ_ACC_CLASSIFY=="00"){
						return '<span style="color:red;">'+value+'</span>';
					}else{
						return value;
					}
				}
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
			}, {
				width : 12,
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
			}
			, {
				width : 6,
				field : "",
				title : "操作",
				align : "center",
				formatter:function(value, row, index) {
					var edit='<a class="click_text_sp" onclick="detailSendProTask(\''+index+'\');">查看</a>'
					 return edit; 
				}
			}]
		});
	}
	
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
	
	/**
	 * 根据投产id(编号)查询所有的接口列表
	 */
	function initqueryInterfaceSend_Add(system_id, versions_id) {
		var queryInterfacecall = getMillisecond()+1;
		var queryParams = function(params){
			var temp = {};
			temp["limit"] = params.limit;
			temp["offset"] = params.offset;
			return temp;
		};
		//getCurrentPageObj().find("#sendProContent").bootstrapTable("destory");
		getCurrentPageObj().find("#table_interface_info_updata").bootstrapTable("destroy").bootstrapTable({
			//url : dev_construction+'GSitSubmit/queryTaskInterface.asp?call='+queryInterfacecall+'&SID='+SID+'&audit_no='+p,//+'&version_id='+versions_id2+'&system_no='+system_id2,//&sub_req_id=+sub_req_id
			url : dev_construction+'GSitSubmit/queryTaskInterface.asp?call='+queryInterfacecall+'&SID='+SID+'&version_id='+versions_id+'&system_no='+system_id,
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
	
	getAuditNoAndInitFileTable(p);
	//初始化补充投产编号以及文件列表
	function getAuditNoAndInitFileTable(p){
		var call2 = getMillisecond()+'2';
		var url = dev_construction+'sendProduceApply/countPatchNum.asp?call='+call2+'&SID='+SID+'&audit_no='+p;
		baseAjaxJsonp(url, null, function(countData){
			if(countData.result == "true"){
				var currTab = getCurrentPageObj();
				var temp = "";
				if(countData.auditNum>9){
					temp = p + "-BD" + countData["auditNum"];
				} else {
					temp = p + "-BD0" + countData["auditNum"];
				}
				
				currTab.find("#audit_no").val(temp.toUpperCase());
				initProduceTaskInSameAuctiNo(temp.toUpperCase());
				
				//初始化文件列表部分
				/******** 相关文档上传 ************/
				//点击文件上传模态框
				var tablefile = currTab.find("#table_file");
				var business_code = temp;
				//构建文件上传路径拼接所需参数
				var addfile = currTab.find("#add_file");
				addfile.click(function(){
					if(!validateProduceTaskIsAble()){
						return;
					}
					//校验协办是否符合条件
					var result = getParamAndValidate();
					if(result.result == false){
						return;
					}
					var checkcall = getMillisecond();//检查主办任务有协办任务未发起投产
					baseAjaxJsonp(dev_construction+'sendProduceApply/queryNoSendProduceAssistTaskList.asp?call='+checkcall+'&SID='+SID,result.param,function(item){
						if(item != undefined&&item != null&&item.result == "true"){
							//可发起投产的状况下方可上传文档
							//var business_code = currTab.find("#audit_no").val();
							//投产编号延后，先使用uuid代替业务编号
							business_code = currTab.find("#audit_no").val();
							var paramObj = new Object();
							var sys_name = getCurrentPageObj().find("#system_name").val();
							var ver_name = getCurrentPageObj().find("#versions_name").val();
							if(sys_name==""||ver_name==""||sys_name=="点击选择"||ver_name=="点击选择"){
								alert("请先选择应用及版本");
								return ;
							} else if(!business_code){
								alert("无法获取投产编号");
								return ;
							} else {
								paramObj.SYSTEM_NAME = sys_name;
								paramObj.VERSIONS_NAME = ver_name;
								paramObj.DELOY_NAME = "部署";
							}
							openFileSvnUpload(currTab.find("#file_modal"), tablefile, 'GZ1062',business_code, '12', 'G_DIC_SEND_PRODUCE_FILE', false, true,paramObj);
						}else{
							var mess = item.mess;
							if(mess){
								alert(mess);
							}else{
								openNoSendProduceTaskPop("assistTasks_pop",result.param);
								alert("此应用版本下的主办任务有协办任务未发起投产！");
							}
						}
					},checkcall);
					
				});
				 //附件删除
				 var delete_file = currTab.find("#delete_file");
				 delete_file.click(function(){
					 delSvnFile(tablefile, business_code, "12");
				 });
				 getSvnFileList(tablefile, currTab.find("#file_view_modal"), temp, "12");
			}
		},call2);
		
	}
	
	
	 
	 function validateProduceTaskIsAble(){
			var result = true;
			var sendData = getCurrentPageObj().find("#sendProContent").bootstrapTable('getData');
			if(sendData.length == 0) {
				alert("没有要投产的内容！");
				return false;
			}
			for(var row in sendData){
				var item = sendData[row];
				if(item["REQ_TASK_RELATION"]=="01"&&item["checkResult"]==false){
					alert("投产任务不满足投产条件");
					result = false;
					break;
				}
			}
			return result;
		}
	 
	//保存按钮
		getCurrentPageObj().find("#save").unbind("click");
		getCurrentPageObj().find("#save").click(function() {
			var result = getParamAndValidate(true);
			if(result.result == true){
				var call = getMillisecond();
				result.param['delTaskIdStr'] = getDelTaskIdStr();
				var url = dev_construction+'sendProduceApply/updateSendProInfo.asp?call='+call+'&SID='+SID;
				result.param["approve_status"] = "01";//草拟
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
			var result = getParamAndValidate(true);
			if(result.result == false){
				return;
			}
			
			//校验是否上传了文件
			var fileData  = getCurrentPageObj().find("#table_file").bootstrapTable('getData');
			var fileIsRight = false;
			if(fileData!=null&& fileData.length>0){
				for(var i=0; i<fileData.length; i++){
					if(!fileIsRight){
						var fileType = fileData[i]["FILE_TYPE"];
						fileIsRight = (fileType.indexOf("sj_") >= 0);
					}
				}
			} else {
				alert("请上传投产相关附件");
				return ;
			}
			
			if(!fileIsRight){
				alert("请上传一份审计类型（部署手册、投产手册、应急手册、运维手册或资源说明手册）附件");
				return ;
			}
			
			var aaa=getCurrentPageObj().find("#change_remark").val();
		    if(aaa.length>100){
		    	alert("变更功能说明及要点至多可输入100汉字！");
		    	return;
		    }
		    var bbb=getCurrentPageObj().find("#change_affect").val();
		    if(bbb.length>100){
		    	alert("变更影响至多可输入100汉字！");
		    	return;
		    }
		    var ccc=getCurrentPageObj().find("#change_risk_remark").val();
		    if(ccc.length>50){
		    	alert("变更风险说明至多可输入50汉字！");
		    	return;
		    }
		    var ddd=getCurrentPageObj().find("#ser_affect_remark").val();
		    if(ddd.length>50){
		    	alert("业务影响说明至多可输入50汉字！");
		    	return;
		    }
		    var eee=getCurrentPageObj().find("#ser_try_run").val();
		    if(eee.length>50){
		    	alert("业务试运行及推广计划至多可输入50汉字！");
		    	return;
		    }
			
			var checkcall = getMillisecond();//检查主办任务有协办任务未发起投产
			baseAjaxJsonp(dev_construction+'sendProduceApply/queryNoSendProduceAssistTaskList.asp?call='+checkcall+'&SID='+SID,result.param,function(item){
				 if(item != undefined&&item != null&&item.result == "true"){
							result.param["approve_status"] = "01";//草拟
							//*********提醒参数*********//
							var b_code = getCurrentPageObj().find("#audit_no").val();
							result.param["b_code"] = b_code;
							result.param["b_id"] = b_code;
							result.param["b_name"] = "投产单编号为【"+b_code+"】已上传投产相关文件，请尽快进行审计";
							result.param["remind_type"] = "PUB2017190";
							var call = getMillisecond();
							var url = dev_construction+'sendProduceApply/saveSendProInfo.asp?call='+call+'&SID='+SID + '&submit=1';
							baseAjaxJsonp(url, result.param, function(data){
								if (data != undefined&&data!=null&&data.result=="true") {
									alert("保存成功！",function(){
										closeCurrPageTab();
									});
								} else {
									alert("保存失败！");
								}
							}, call);
				 }else{
					var mess = item.mess;
					if(mess){
						alert(mess);
					}else{
						openNoSendProduceTaskPop("assistTasks_pop",result.param);
						alert("此应用版本下的主办任务有协办任务未发起投产！");
					}
				}
			},checkcall);
			
		});
		
		function getParamAndValidate(isCheckFile){
			var currTab = getCurrentPageObj();
			var result = new Object();
			result.result = false;
			if(!vlidate(currTab,"",true)){
				alert("请完善必填信息");
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
			if(!validateProduceTaskIsAble()){
				return result;
			}
			//投产类型是否填写完成
			var isComplete = true;
			var sendData = currTab.find("#sendProContent").bootstrapTable('getData');
			if(!isComplete) {
				alert("请选择投产类型！");
				return result;
			}
			if(isCheckFile&&!checkFileUpload()){
				result.result = false;
				return result;
			}
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
		function validateProduceTaskIsAble(){
			var result = true;
			var sendData = getCurrentPageObj().find("#sendProContent").bootstrapTable('getData');
			if(sendData.length == 0) {
				alert("没有要投产的内容！");
				return false;
			}
			for(var row in sendData){
				var item = sendData[row];
				if(item["REQ_TASK_RELATION"]=="01"&&item["checkResult"]==false){
					alert("投产任务不满足投产条件");
					result = false;
					break;
				}
			}
			return result;
		}
}
//需求任务详情
function viewTaskInfo(req_task_id){
	closePageTab("req_taskDetail");
	openInnerPageTab("req_taskDetail","任务详情页面","dev_construction/requirement/requirement_analyze/task_accept/task_detail.html",function(){
		initReqTaskDetailLayout(req_task_id);
	});
}
/**
 * 页面按钮事件
 */
(function(){
	
})();

/**
 * 获取被删除的任务ID的字符串
 * @returns String 如：1,3
 */
function getDelTaskIdStr() {
	var sendData = getCurrentPageObj().find("#sendProContent").bootstrapTable('getData');
	//现在表中的任务ID
	var nowTaskId = $.map(sendData, function(item, index) {
		return item.REQ_TASK_ID;
	});
	var delTaskId = new Array();
	$.each(originTaskId, function(i, value) {
		//原来的id在新的中是否存在
		var isExist = false; //不存在
		$.each(nowTaskId, function(i2, value2) {
			if(originTaskId[i] == nowTaskId[i2]) {
				isExist = true; //存在
				return false;
			}
		});
		if(!isExist) { //不存在（说明删除了）
			delTaskId.push(originTaskId[i]);
		}
	});
	var delTaskIdStr = delTaskId.join();
	return delTaskIdStr;
}

/**
 * 投产内容中删除一行
 * @param index
 */
function delSendProTask(id) {
	var currTab = getCurrentPageObj();
	//删除该行
	currTab.find("#sendProContent").bootstrapTable("removeByUniqueId", id);		
}

var produce_standard = new Object();

var arrayStandard=[true, true, true, true, false, true, true, false, true, true, true, true, false, false];
//双月
produce_standard["02"] = arrayStandard;//[true, true, true, true, true, true, false, false, true, true, true, true, false, false];
//单月
produce_standard["03"] =  arrayStandard;//[true, true, true, true, false, true, true, false, true, true, true, true, false, false];
//双周
produce_standard["04"] = arrayStandard;// [true, true, true, true, false, true, false, false, true, true, true, true, false, false];
//特殊版
produce_standard["14"] = arrayStandard;// [true, true, true, true, false, true, false, false, true, true, true, true, false, false];
//紧急版
produce_standard["15"] = [true, true, true, true, false, false, false, false, true, true, true, true, false, false];

//1618
produce_standard["other"] = [true, true, true, true, true, true, true, true, true, true, true, true, true, true];
/**
 * 查看每条任务
 */
function detailSendProTask(index){
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