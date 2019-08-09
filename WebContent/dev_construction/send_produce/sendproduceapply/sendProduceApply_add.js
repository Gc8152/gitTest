function checkProduceByVerAndSys(func_call){
	var currTab = getCurrentPageObj();
//	var isComplete = true;
	var sendData = currTab.find("#sendProContent").bootstrapTable('getData');
	var sendDataForSubmit = new Array();
	for(var i=0; i<sendData.length; i++){
		var item = new Object();
		item["REQ_TASK_ID"] = sendData[i]["REQ_TASK_ID"];
		item["REQ_TASK_RELATION"] = sendData[i]["REQ_TASK_RELATION"];
		sendDataForSubmit.push(item);
		if(sendData[i]["IS_PEEL"]=="00"){
			continue;
		}
	}
	
		var param={};
		param["sendData"] = JSON.stringify(sendDataForSubmit);
		//“是否紧急投产”为“否(01)”
//		sendDataForSubmit["is_instancy"] = "01";
		var call = getMillisecond();
		baseAjaxJsonp(dev_construction+'sendProduceApply/queryProduceByVerAndSys.asp?call='+call+'&SID='+SID,{versions_id:currTab.find('#versions_id').val(),system_id:currTab.find('#system_id').val()},function(resultForAudit){
			if(resultForAudit.result=="true"){
				if(resultForAudit.auditExit=="true"){
					alert("当前所选应用与版本已发起投产申请！请返回申请列表，选择正常投产单并点击补充投产发起申请!",function(){
						closeCurrPageTab();
					});
				} else {
					var checkcall = getMillisecond();//检查主办任务有协办任务未发起投产
					baseAjaxJsonp(dev_construction+'sendProduceApply/queryNoSendProduceAssistTaskList.asp?call='+checkcall+'&SID='+SID,param,function(item){
						if(item != undefined&&item != null&&item.result == "true"){
						}else{
							var mess = item.mess;
							if(mess){
								alert(mess);
							}else{
								openNoSendProduceTaskPop("assistTasks_pop",param);
								alert("此应用版本下的主办任务有协办任务未发起投产!注意督促协办任务投产！");
							}
						}
					},checkcall);
				}
			} else {
				alert("查询投产记录失败");
			}
		},call);
		
		
}
//一般投产申请
function initsendProduceApply_add(){
	initSelect(getCurrentPageObj().find("#change_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_CHANGE_TYPE"});
	
	//returnSerialNumber("TC", "G_SEQ_PRJ_SEND_PRODUCEID");
	//是否演练选择“否”
	getCurrentPageObj().find("input[name='is_drill'][value='01']").click();
	getCurrentPageObj().find("input[name='is_drill'][value='00']").attr("disabled","true");
	var currTab = getCurrentPageObj();
	currTab.find("#svn_addr").hide();
	initSendProduceApply(currTab);
}


//投产演练申请
function initSendProduceApplyDrill_add(){
	//returnSerialNumber("TC", "G_SEQ_PRJ_SEND_PRODUCEID");
	//是否演练选择“是”
	getCurrentPageObj().find("input[name='is_drill'][value='00']").click();
	getCurrentPageObj().find("input[name='is_drill'][value='01']").attr("disabled","true");
	
	var currTab = getCurrentPageObj();
	initSendProduceApply(currTab);
}

function initSendProduceApply(currTab){
	/**
	 * 初始化字典项
	 */
	initSelect(currTab.find("#root_status"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_ROOT_STATUS"});
	//initSelect($("#P_is_important"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_YN"});
	//initSelect($("#P_system_status"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_SYSTEM_STATUS"});
	
	currTab.find("#base_line_name").hide();
	
	currTab.find("#business_code").val(Math.uuid());
	
	/**
	 * 初始化页面按钮事件
	 */
	//选择应用
	currTab.find("#system_name").unbind("click");
	currTab.find("#system_name").click(function() {
		//添加参数做权限控制
		getCurrentPageObj()[0].sysparam="&project_man_id="+$("#currentLoginNo").val();
		openSystemPop("sendProduceSystemPop",{name:currTab.find("#system_name"),id:currTab.find("#system_id"),queryParam:"&isKeJi=00"});
	});
	
	//选择版本
	currTab.find("#versions_name").unbind("click");
	currTab.find("#versions_name").click(function() {
		/*openVersionPop("sendProduceVersionPop",{name:currTab.find("#versions_name"),id:currTab.find("#versions_id")});*/
		openTaskVersionPop("sendProduceVersionPop",{func_call:function(row){$("#plan_date").val(row["START_TIME"])},versionsname:getCurrentPageObj().find('#versions_name'),versionsid:getCurrentPageObj().find('#versions_id'),versionstype:getCurrentPageObj().find('#versionstype'),vm:"02"});
	});
	
	//选择投产单号(基线包)
	currTab.find("#relate_audit_no").unbind("click");
	currTab.find("#relate_audit_no").click(function() {
		openSendProPop("#sendProduceSendProPop",{id:currTab.find("#relate_audit_no")});
	});
	
	//申请人
	currTab.find("#apply_person_name").val($("#currentLoginName").val());
	currTab.find("#apply_person").val($("#currentLoginNo").val());
	
	//投产包类型默认为基线包，选中补丁包时，出现选择审批单号的输入框
	currTab.find("input[name='pakage_type']").change(function() {
		var value = currTab.find("input[name='pakage_type']:checked").val();
		if(value == '01') {
			$(".hide_show_relate_id").css("display", "none");
			currTab.find("#relate_audit_no").val("");
		} else if(value == '02') {
			$(".hide_show_relate_id").css("display", "inline");
		}
	});
	
	//新增问题单任务
	currTab.find("#addProblemAndTask").unbind("click");
	currTab.find("#addProblemAndTask").click(function() {
		var system_id = currTab.find("#system_id").val();
		var versions_id = currTab.find("#versions_id").val();
		if(system_id && versions_id) {
			openTaskProblemPop("#sendProduceTaskProblemPop",{"system_no":system_id, "version_id":versions_id});			
		}else{
			alert("请先选择应用和版本");
		}
	});
	
	//保存并提交审计按钮
	currTab.find("#save").unbind("click");
	currTab.find("#save").click(function() {
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
		
		/*var checkcall = getMillisecond();//检查主办任务有协办任务未发起投产
		baseAjaxJsonp(dev_construction+'sendProduceApply/queryNoSendProduceAssistTaskList.asp?call='+checkcall+'&SID='+SID,result.param,function(item){
			 if(item != undefined&&item != null&&item.result == "true"){*/
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
						
						result.param["approve_status"] = "01";//草拟
						//*********提醒参数*********//
						var b_code = currTab.find("#audit_no").val();
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
						
					} else {
						alert("流水号获取失败！");
					}
				}, call, false);
				 
			/* }else{
				var mess = item.mess;
				if(mess){
					alert(mess);
				}else{
					openNoSendProduceTaskPop("assistTasks_pop",result.param);
					alert("此应用版本下的主办任务有协办任务未发起投产！");
				}
			}
		},checkcall);*/
	});
	
	//保存并提交按钮
	currTab.find("#submit").unbind("click");
	currTab.find("#submit").click(function() {
		var result = getParamAndValidate(true);
		if(result.result == true){
			var call = getMillisecond();
			var url = dev_construction+'sendProduceApply/saveSendProInfo.asp?call='+call+'&SID='+SID+'&submit=1';
			result.param["approve_status"] = "05";//草拟
			baseAjaxJsonp(url, result.param, function(data){
				if (data != undefined&&data!=null&&data.result=="true") {
					alert("提交成功!");
					closeCurrPageTab();
				} else {
					alert("保存失败！");
				}
			}, call);
		}
	});
	
	/******** 相关文档上传 ************/
	var currTab = getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题
	//点击文件上传模态框
	var tablefile = currTab.find("#table_file");
	var business_code = "";
	//构建文件上传路径拼接所需参数
	var addfile = currTab.find("#add_file");
	//上传文件
	function showFileUpload(){
		var currTab = getCurrentPageObj();
		//可发起投产的状况下方可上传文档
		//var business_code = currTab.find("#audit_no").val();
		//投产编号延后，先使用uuid代替业务编号
		business_code = currTab.find("#business_code").val();
		var paramObj = new Object();
		var sys_name = getCurrentPageObj().find("#system_name").val();
		var ver_name = getCurrentPageObj().find("#versions_name").val();
		if(sys_name==""||ver_name==""||sys_name=="点击选择"||ver_name=="点击选择"){
			alert("请先选择应用及版本");
			return ;
		} else {
			paramObj.SYSTEM_NAME = sys_name;
			paramObj.VERSIONS_NAME = ver_name;
			paramObj.DELOY_NAME = "部署";
		}
		openFileSvnUpload(currTab.find("#file_modal"), tablefile, 'GZ1062',business_code, '12', 'G_DIC_SEND_PRODUCE_FILE', false, true,paramObj);
	}
	addfile.click(function(){
		if(!validateProduceTaskIsAble()){
			return;
		}
		
		//校验协办是否符合条件
		/******************************/
		var result = getParamAndValidate();
		if(result.result == false){
			return;
		}
		showFileUpload();
		/*//queryProduceByVerAndSys
		//校验是否已投产
		var call = getMillisecond();
		baseAjaxJsonp(dev_construction+'sendProduceApply/queryProduceByVerAndSys.asp?call='+call+'&SID='+SID,result.param,function(resultForAudit){
			if(resultForAudit.result=="true"){
				if(resultForAudit.auditExit=="true"){
					alert("当前所选应用与版本已发起投产申请！请返回申请列表，选择正常投产单并点击补充投产发起申请!");
					nconfirm("该版本与应用已发起了投产，是否转到补丁投产", function(){
						closeAndOpenInnerPageTab("sendProduceApply_update","补丁投产单新增页面","dev_construction/send_produce/sendproduceapply/sendProducePatchApply_add.html",function(){
							initSendProInfoPatch(result.audit_no);
						});
					});
				} else {
					var checkcall = getMillisecond();//检查主办任务有协办任务未发起投产
					baseAjaxJsonp(dev_construction+'sendProduceApply/queryNoSendProduceAssistTaskList.asp?call='+checkcall+'&SID='+SID,result.param,function(item){
						if(item != undefined&&item != null&&item.result == "true"){
							showFileUpload();
						}else{
							var mess = item.mess;
							if(mess){
								alert(mess);
							}else{
								openNoSendProduceTaskPop("assistTasks_pop",result.param,function(){
									onModalCloseEvent("assistTasks_pop #myModal_assisttask",function(){
										showFileUpload();
									});
								});
								alert("此应用版本下的主办任务有协办任务未发起投产!注意督促协办任务投产！");
							}
						}
					},checkcall);
				}
			} else {
				alert("查询投产记录失败");
			}
		},call);*/
		/******************************/
	});
	 //附件删除
	 var delete_file = currTab.find("#delete_file");
	 delete_file.click(function(){
		var business_code = currTab.find("#business_code").val();
		delSvnFile(tablefile, business_code, "12");
	 });
	 getSvnFileList(tablefile, currTab.find("#file_view_modal"), currTab.find("#business_code").val(), "12");
	
	function getParamAndValidate(isCheckFile){
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
		
		var sendDataForSubmit = new Array();
		for(var i=0; i<sendData.length; i++){
			var item = new Object();
			item["REQ_TASK_ID"] = sendData[i]["REQ_TASK_ID"];
			item["REQ_TASK_RELATION"] = sendData[i]["REQ_TASK_RELATION"];
			sendDataForSubmit.push(item);
			if(sendData[i]["IS_PEEL"]=="00"){
				result.result = false;
				alert("请删除评审不通过需要剥离的任务再提交！");
				return result;
			}
		}
		if(isCheckFile&&!checkFileUpload()){
			result.result = false;
			return result;
		}
		//对提交投产的任务检查
		var remind="";
		for(var i=0; i<sendData.length; i++){
			if(sendData[i]["REQ_TASK_STATE"]!="11"){
				remind+=sendData[i]["REQ_TASK_CODE"]+",";
			}
		}
		if(remind!=""){
			remind=remind.substr(0,remind.length-1);
			alert("投产任务("+remind+")任务状态不满足投产条件")
			result.result = false;
			return result;
		}
		param["sendData"] = JSON.stringify(sendDataForSubmit);
		result.result = true;
		result.param = param;
		return result;
	}
	function validateProduceTaskIsAble(){
		var result = true;
		var sendData = currTab.find("#sendProContent").bootstrapTable('getData');
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
	
	/**
	 * 取投产申请页面的值（用途未知，暂时保留）
	 * @param param
	 * @returns
	 */
	function getSendProApplyPageParam() {

		return param;
	}
	
	/**
	 * 检查应用和版本在不在申请表中，若存在，提示；若不存在，则查询出投产任务
	 * @param system_id
	 * @param versions_id
	 */
	function checkThisApplyIsExist(system_id, versions_id) {
		//应用和版本不存在
		var isExist = false; 
		var param = {};
		param["system_id"] = system_id;
		param["versions_id"] = versions_id;
		var call = getMillisecond();
		var url = dev_construction+'sendProduceApply/checkThisApplyIsExist.asp?call='+call+'&SID='+SID;
		baseAjaxJsonp(url, param, function(data){
			if (data != undefined&&data!=null&&data.result=="true") {
				var num = data.num;
				if(num>0) {
					isExist = true;//存在
				}
				if(isExist) {
					alert("该应用和版本已申请！");
				}
				if(!isExist) {
					//不存在，则查询投产任务
					freshSendProContent(system_id, versions_id);
				}
			} 
		}, call);
	}
	
	//初始化投产内容
	//initSendProContent();
	freshSendProContent(null, null);
	initqueryInterfaceSend_Add(null, null);
	//初始化验证
	initVlidate(currTab);
	
}

/**
 * 重新选择应用或者版本后，刷新投产内容中的任务
 * @param system_id
 * @param versions_id
 */
function freshSendProContent(system_id, versions_id) {
	var currTab = getCurrentPageObj();
	/*
	var initSendProContent_call = getMillisecond();
	var currTa = getCurrentPageObj();
	baseAjaxJsonp(url_1, null, function(result){
		currTa.find("#sendProContent").bootstrapTable("load", result);
	}, initSendProContent_call);
	*/
	/**
	 * 初始化投产内容列表
	 */
	var queryParams = function(params){
		var temp = {};
		temp["limit"] = params.limit;
		temp["offset"] = params.offset;
		return temp;
	};
	//getCurrentPageObj().find("#sendProContent").bootstrapTable("destory");
	var initSendProContent_call = getMillisecond();
	currTab.find("#sendProContent").bootstrapTable("destroy").bootstrapTable({
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
			/*currTab.find(".file_template_style").hide();*/
			var sendData = currTab.find("#sendProContent").bootstrapTable('getData');
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
				currTab.find("a[name=file_template_task]").show();
			}
			if(projectFileDoc){
				currTab.find("a[name=file_template_project]").show();
			}
			if(sendData.length==0 && system_id!=null && versions_id!=null) 
				{alert("请检查投产任务：1.必须满足投产准入条件   2.不存在审批中的版本变更或一般转紧急申请");}
			if(sendData.length>0 && system_id!=null && versions_id!=null) {
				checkProduceByVerAndSys();
			}
		},
		columns : [ {
			field : 'REQ_TASK_ID',
			title : '任务ID',
			align : "center",
			visible: false
		},{
			width : "130",
			field : 'REQ_TASK_CODE',
			title : '任务编号',
			align : 'center',
			formatter: function (value, row, index) {
				return '<span class="hover-view" '+
				'onclick="lookTaskInfo('+row.REQ_TASK_ID+')">'+value+'</span>';
			}
		},{
			width : "130",
			field : 'REQ_TASK_NAME',
			title : '任务名称',
			align : "center"
		},{
			width : "100",
			field : 'REQ_TASK_STATE_CN',
			title : '任务状态',
			align : "center"
		},{
			width : "100",
			field : 'REQ_TASK_TYPE_NAME',
			title : '任务来源',
			align : "center"
		},{
			field : 'REQ_ACC_CLASSIFY_DISPLAY',
			title : '需求分类',
			align : 'center',	
			width : "100",
			formatter:function(value,row,index){
				if(row.REQ_ACC_CLASSIFY=="00"){
					return '<span style="color:red;">'+value+'</span>';
				}else{
					return value;
				}
			}
		},{
			width : "100",
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
			width : "130",
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
			width : "100",
			field : "TOTAL",
			title : "涉及任务数",
			align : "center",
		}, {
			width : "100",
			field : "PUTIN_START",
			title : "发起投产个数",
			align : "center",
		}, {
			width : "100",
			field : "PUTIN",
			title : "完成投产个数",
			align : "center",
		}
		, {
			width : "100",
			field : "IS_PEEL",
			title : "评审结论",
			align : "center",
			formatter:function(value, row, index) {
				if(value=="00"){
					return "不通过";
				}else if(value=="01"){
					return "通过";
				}else{
					return "未评审";
				}
			}
		},{
			width : "130",
			field : "",
			title : "操作",
			align : "center",
			formatter:function(value, row, index) {
				var edit='<a class="click_text_sp" style="margin-right: 20px" onclick="detailSendProTask(\''+index+'\');">查看</a>';
				if(row.IS_PEEL=="00"){
					edit= edit+'<a class="click_text_sp" cursor:pointer;" onclick="delSendProTask('+row.REQ_TASK_ID+');">删除</a>';
				}
				return edit; 
			}
		}]
	});
}
//需求任务详情
function lookTaskInfo(req_task_id){
	closePageTab("req_taskDetail");
	openInnerPageTab("req_taskDetail","任务详情页面","dev_construction/requirement/requirement_analyze/task_accept/task_detail.html",function(){
		initReqTaskDetailLayout(req_task_id);
	});
}
/**
 * 重新选择应用或者版本后，刷新投产内容中的接口
 */
function initqueryInterfaceSend_Add(system_id, versions_id) {
	var system_id2=0;//m没有选择的情况下传0去后台也可以null
	var versions_id2=0;
	if(system_id!=null&&versions_id!=null){
		system_id2=system_id;
		versions_id2=versions_id;
	}
	var queryInterfacecall = getMillisecond()+1;
	var queryParams = function(params){
		var temp = {};
		temp["limit"] = params.limit;
		temp["offset"] = params.offset;
		return temp;
	};
	getCurrentPageObj().find("#table_interface_info").bootstrapTable("destroy").bootstrapTable(
			{
				url : dev_construction+'GSitSubmit/queryTaskInterface.asp?call='+queryInterfacecall+'&SID='+SID+'&version_id='+versions_id2+'&system_no='+system_id2,//&sub_req_id=+sub_req_id
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
					/*gaveInfo();	
					var sit_num = data.sit_num+1;
					getCurrentPageObj().find("#TEST_COUNT_NAME").val("第"+sit_num+"轮次");*/
				},
				columns : [/*{
					checkbox : true,
					rowspan : 2,
					align : 'center',
					valign : 'middle'
				},*/{
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
					/*formatter: function (value, row, index) {
						return '<span class="hover-view" '+
						'onclick="viewTaskDetail('+value+')">查看</span>';
					}*/
				}]

			});
}
function refreshSendProSvnOrFtp(is_cc){
	//选择不同变更类型时，反馈不通
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
 * 投产内容中删除一行
 * @param index
 */
function delSendProTask(id) {
	var currTab = getCurrentPageObj();
	//删除该行
	currTab.find("#sendProContent").bootstrapTable("removeByUniqueId", id);		
	//删除后，获取投产表中的所有数据
	var sendData_new = currTab.find("#sendProContent").bootstrapTable('getData');
}

var produce_standard = new Object();
var arrayStandard=[true, true, true, true, false, true, true, false, true, true, true, true, false, false];
//双月
produce_standard["02"] = arrayStandard;// [true, true, true, true, true, true, false, false, true, true, true, true, false, false];
//单月
produce_standard["03"] =  arrayStandard;//[true, true, true, true, false, true, true, false, true, true, true, true, false, false];
//双周
produce_standard["04"] =  arrayStandard;//[true, true, true, true, false, true, false, false, true, true, true, true, false, false];
//特殊版
produce_standard["14"] =  arrayStandard;//[true, true, true, true, false, true, false, false, true, true, true, true, false, false];
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
		getCurrentPageObj().find("#modal_req_approve_and_doc").modal("show");
	}, mill);
	
}


//初始化值
function sendApply (data){
	var currTab = getCurrentPageObj();
	currTab.find("#system_id").val(data.SYSTEM_NO);
	currTab.find("#system_name").val(data.SYSTEM_NAME);
	currTab.find("#versions_id").val(data.VERSION_ID);
	currTab.find("#versions_name").val(data.VERSIONS_NAME);
	if(data.IS_NEW_SYSTEM=="00"){
		currTab.find("#is_new_system").val("是");
	}else{
		currTab.find("#is_new_system").val("否");
	}
	currTab.find("#plan_date").val(data.START_TIME);
	initsendProduceApply_add();
	freshSendProContent(data.SYSTEM_NO,data.VERSION_ID);
	
}

