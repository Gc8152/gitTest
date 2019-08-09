
//查看应用详情
function viewSystemDetail(){
	var system_id = getCurrentPageObj().find("#TDsystem_no").val();
	 closePageTab("viewApplication");
	  var appDetailCall=getMillisecond();
	  openInnerPageTab("viewApplication","查看详情","dev_application/application_queryInfo.html",function(){
		  baseAjaxJsonp(dev_application+"applicationManager/findApplicationById.asp?SID="+SID+"&system_id="+system_id+"&call="+appDetailCall, null , function(data) {
			  for ( var k in data) {
					 var str=data[k];
					  k = k.toLowerCase();
				if(k=="develop_tool"){
					initAPPSelect3(getCurrentPageObj().find("#APDdevelop_tool"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_DEVELOP_TOOL"},str);
				}else if(k=="develop_language"){
					initAPPSelect3(getCurrentPageObj().find("#APDdevelop_language"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_DEVELOP_LANGUAGE"},str);
				}else if(k=="mac_os"){	
					initAPPSelect3(getCurrentPageObj().find("#APDmac_os"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_MAC_OS"},str);
				}else if(k=="hardware_type"){
					initAPPSelect3(getCurrentPageObj().find("#APDhardware_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_HARDWARE_TYPE"},str);
				}else if(k=="among"){	
					initAPPSelect3(getCurrentPageObj().find("#APDamong"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_DEVELOP_AMONG"},str);
				}else if(k=="database"){	
					initAPPSelect3(getCurrentPageObj().find("#APDdatabase"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_DEVELOP_DATABASE"},str);
				}else if(k=="addr_type"){
					initCheckVis(getCurrentPageObj().find("#addrType"),{dic_code:"G_DIC_SYSTEM_CONFIG_TYPE"},"addrTypeName","addrType",str,"N");
				}else if(k=="system_id"){
					getCurrentPageObj().find("input[name='"+ k +"']").val(str);
					getCheckedAddr(str);
				}else if(k=="vob_info"){
					getCurrentPageObj().find("span[name='C."+ k +"']").html(str);
				}else if(k=="cc_server_url"){
					getCurrentPageObj().find("span[name='C."+ k +"']").html(str);
				}else if(k=="is_secientific_management"){
					if(str=="00"){
						str = "是";
					}else if(str=="01"){
						str = "否";
					}
					getCurrentPageObj().find("span[name='"+ k +"']").html(str);
				}/*else if(k=="system_profile"){
					getCurrentPageObj().find("textarea[name='UPP."+k+"']").val(str);
				}*/
				else {
					$("span[name="+k+" ]").text(str);
			   }
			  }
		
		  },appDetailCall);
	   });	
}

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

//查看投产条件
function viewSendProduceCondition(){
	var req_task_code = getCurrentPageObj().find("#TDreq_task_code").text();
	var detailTable = getCurrentPageObj().find("#sendProContentDetail");
	detailTable.find("#material_req_task_id").val(req_task_code);
	//detailTable.find("#material_req_task_type").val(rows[index].REQ_ACC_CLASSIFY);
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
//SIT移交查询
function sitQuery(){
	var req_task_id=getCurrentPageObj().find("#TDreq_task_id").val();
	closeAndOpenInnerPageTab("sitsubmit_queryalllist","SIT移交查询","dev_construction/sit_test_jn/sit_submit/sitsubmit_queryListByTask.html",function(){
		initsitSubmitInfoByTask(req_task_id);
	});
}
//投产单查询
function querySendProduce(){
	var req_task_id=getCurrentPageObj().find("#TDreq_task_id").val();
	closeAndOpenInnerPageTab("","投产单查询","dev_construction/send_produce/sendproduceview/sendProduceView_queryListByTask.html",function(){
	getTaskQuery(req_task_id);
	});
}
//查看版本详情
function viewTaskVersionMsgs(){
	var versions_id = getCurrentPageObj().find("[name='TD.version_id']").val();
	baseAjaxJsonp(dev_construction+"reqtask_intoVersion/queryVersionOneById.asp?SID="+SID+"&versions_id="+versions_id, null , function(data) {
	  if (data != undefined && data != null && data.result=="true") {
		  closeAndOpenInnerPageTab("view_project","查看版本计划","dev_construction/versionManage/annualVersionManage/annualVersionPlan_queryInfo.html", function(){
	        initAnnualVersionViewEvent(data);
		  });
	  }else{
		alert("查询单个版本信息失败");
	  }
	});
}


//初始化任务详情页面
function initReqTaskDetailLayout(req_task_id){
	var callTime=getMillisecond()+'2';
	baseAjaxJsonp(dev_construction+"req_taskaccept/queryTaskOneById.asp?SID="+SID+"&call="+callTime+"&req_task_id="+req_task_id, null , function(data) {
		if (data != undefined && data != null && data.result=="true") {
		    for(var k in data){
			var str=data[k];
			k = k.toLowerCase();//大写转换为小写
			if(k=="version_id"){
				getCurrentPageObj().find('#TDversion_id').val(str);
			}else if(k=="req_code"){
				getCurrentPageObj().find('#TDreq_code').text(str);
			}else if(k=="system_no"){
				getCurrentPageObj().find('#TDsystem_no').val(str);
			}else if(k=="sub_req_code"){
				getCurrentPageObj().find('#TDsub_req_code').text(str);
			}else if(k=="req_acc_classify"){
				getCurrentPageObj().find('#TDreq_acc_classify').val(str);				
			}else if(k=="req_id"||k=="req_task_id"||k=="sub_req_id"){
				getCurrentPageObj().find("input[name='TD."+k+"']").val(str);
			}else if(k=="accept_result"){
				getCurrentPageObj().find("input[name='TD."+k+"']"+"[value="+str+"]").attr("checked",true);
			}else if(k=="req_task_relation"&&str=="02"	){
				 getCurrentPageObj().find('#task_analyzer_hide').hide();
				 getCurrentPageObj().find('#TDreq_task_analyzer_name').hide();
				
			}else{
				getCurrentPageObj().find("span[name='TD."+k+"']").text(str);
			}
		    }
		    }
		 inittaskUnionList();//加载关联的任务列表
		//initTaskWorkLoadDetail();//加载当前任务的工作量信息列表
	  },callTime);
	
	var callTimes=getMillisecond()+'3';
	// 流信息查询
	baseAjaxJsonp(dev_resource+'StreamApply/queryStreamApply.asp?SID='+SID+'&call='+callTimes+'&req_task_id='+req_task_id+'&limit=5'+'&offset=0'+'&task_info='+'00', null, function(data) {
    	if (data != undefined && data != null && data.result=="true") {		
	    	var row = data.rows;
	    	if(row.length != 0){
	    		var stream_name = row[0]["STREAM_NAME"];
	    		if(stream_name == undefined || stream_name == '' ||stream_name== null){ //流在申请中
	    			getCurrentPageObj().find("span[name='stream_name']").text("流在申请中！");
	    		}else{
	    			getCurrentPageObj().find("span[name='stream_name']").text(stream_name);
	    		}
	    	}else{
	    		getCurrentPageObj().find("span[name='stream_name']").text("");
	    	}
		}else{
			alert("流申请查询失败！");
		}
	},callTimes);

	initedqueryInterface(req_task_id);
	
}
//查看需求详情
function viewReqDetailTD(){
	var req_accs=getCurrentPageObj().find("#TDreq_acc_classify").val();
	var ids=getCurrentPageObj().find('#TDreq_id').val();
	if(req_accs=="00"){
		closeAndOpenInnerPageTab("EmRequirement_detail1","紧急需求详情","dev_construction/requirement/requirement_analyze/task_accept/emreq_detail.html",function(){
			initEmReqDetailLayout(ids);
		});	
	}
	else{
	
	closeAndOpenInnerPageTab("requirement_detail","需求详情","dev_construction/requirement/requirement_input/req_detail.html",function(){
		initReqDetailLayout(ids);
	});}
}
//查看需求点详情	
function viewSubReqDetailTD(){
	var req_acc2=getCurrentPageObj().find("#TDreq_acc_classify").val();
	var ids=getCurrentPageObj().find('#TDreq_id').val();
	if(req_acc2=="00"){
		closeAndOpenInnerPageTab("emsubreq_detail","紧急需求点详情","dev_construction/requirement/requirement_analyze/split_subreq/splitEmSubreq_detail.html",function(){
			initEmReqSplitDetail(ids);//初始化页面信息
			});	
	}
	else{
	closeAndOpenInnerPageTab("subreq_detail","需求点详情","dev_construction/requirement/requirement_analyze/split_subreq/splitSubreq_detail.html",function(){
		initSplitReqDetailLayOut(ids);
		});
	}
}

//初始化关联任务列表
function inittaskUnionList(){
	var sub_req_id=getCurrentPageObj().find('#TDsub_req_id').val();
	var req_task_id=getCurrentPageObj().find('#TDreq_task_id').val();
	var queryParams = function(params) {
		var temp = {
			limit : params.limit, // 页面大小
			offset : params.offset
		// 页码
		};
		return temp;
	};
	var  taskunionliskCall = getMillisecond();
	getCurrentPageObj().find('#gReqTaskTableListunion').bootstrapTable("destroy").bootstrapTable({
				url :dev_construction+"req_taskaccept/queryAssociationTaskList.asp?SID="+SID+"&sub_req_id="+sub_req_id+"&req_task_id="+req_task_id+"&call="+taskunionliskCall,
				method : 'get', // 请求方式（*）
				striped : false, // 是否显示行间隔色
				cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, // 是否启用排序
				sortOrder : "asc", // 排序方式
				queryParams : queryParams,// 传递参数（*）
				sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
				pagination : true, // 是否显示分页（*）
				pageList : [ 5, 10, 15 ], // 可供选择的每页的行数（*）
				pageNumber : 1, // 初始化加载第一页，默认第一页
				pageSize : 10, // 每页的记录行数（*）
				clickToSelect : true, // 是否启用点击选中行
				// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
				uniqueId : "REQ_TASK_ID", // 每一行的唯一标识，一般为主键列
				cardView : false, // 是否显示详细视图
				detailView : false, // 是否显示父子表
				jsonpCallback:taskunionliskCall,
				singleSelect : true,// 复选框单选
				columns : [{
					checkbox : true,
					rowspan : 2,
					align : 'center',
					valign : 'middle'
				},{
					field : 'REQ_TASK_CODE',
					title : '任务编号',
					align : "center",
				},{
					field : 'REQ_TASK_NAME',
					title : '任务名称',
					align : "center",
				},{
					field : 'SUB_REQ_NAME',
					title : '子需求名称',
					align : "center",
				},{
			         field : 'P_OWNER_NAME',
			         title : '任务项目经理',
			         align : "center",
			         width : 80,
			    },{
					field : 'REQ_TASK_RELATION_DISPLAY',
					title : '从属关系',
					align : "center",
						width : 80,
				}, {
					field : "REQ_TASK_STATE_DISPLAY",
					title : "任务状态",
					align : "center",
					width : 80,
				}, {
					field : "SYSTEM_NAME",
					title : "实施应用",
					align : "center"
				}, {
					field : "PLAN_ONLINETIME",
					title : "计划投产时间",
					align : "center"
				}, {
					field : "VERSION_NAME",
					title : "申请纳入版本",
					align : "center"
				}]
			});
}

//查看任务详情
getCurrentPageObj().find("#TaskDetail_view").click(function(){
	
	  var id = getCurrentPageObj().find('#gReqTaskTableListunion').bootstrapTable('getSelections');
	  var req_task_id = $.map(id, function (row) {return row.REQ_TASK_ID;});
	  if(id.length==1){
	  	closeAndOpenInnerPageTab("req_taskDetail","任务详情页面","dev_construction/requirement/requirement_analyze/task_accept/task_detail.html",function(){
	  		initReqTaskDetailLayout(req_task_id);
	  	  });
	  }else{
	  	
	      alert("请选择一条任务进行查看！");	
	  }
});

//初始化与当前任务关联的工作量评估列表
/*function initTaskWorkLoadDetail(){
	var req_task_id=getCurrentPageObj().find('#TDreq_task_id').val();
	
	var queryParams = function(params) {
		var temp = {
			limit : params.limit, // 页面大小
			offset : params.offset
		// 页码
		};
		return temp;
	};
	
	$('#reqtask_workload_detail').bootstrapTable("destroy").bootstrapTable({
				url :dev_construction+"taskworkload_assess/queryTaskWorkLoadList.asp?SID="+SID+"&req_task_id="+req_task_id,
				method : 'get', // 请求方式（*）
				striped : true, // 是否显示行间隔色
				cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, // 是否启用排序
				sortOrder : "asc", // 排序方式
				queryParams : queryParams,// 传递参数（*）
				sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
				pagination : true, // 是否显示分页（*）
				pageList : [ 5, 10, 15 ], // 可供选择的每页的行数（*）
				pageNumber : 1, // 初始化加载第一页，默认第一页
				pageSize : 10, // 每页的记录行数（*）
				clickToSelect : true, // 是否启用点击选中行
				// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
				uniqueId : "REQ_TASK_ID", // 每一行的唯一标识，一般为主键列
				cardView : false, // 是否显示详细视图
				detailView : false, // 是否显示父子表
				singleSelect : true,// 复选框单选
				columns : [{
					field : 'REQ_TASK_ID',
					title : '任务序列号',
					align : "center",
					visible:false
				},{
					field : 'TASK_RES_TYPE_DISPLAY',
					title : '资源类型',
					align : "center",
				},{
					field : 'TASK_RES_NUM',
					title : '资源个数',
					align : "center",
				}, {
					field : 'PERSON_AMOUNT',
					title : '工作量',
					align : "center"
				}, {
					field : "PERSON_UNIT_DISPLAY",
					title : "工作量单位",
					align : "center"
				}, {
					field : "PERSON_COSTS",
					title : "预估成本(万元)",
					align : "center"
				},{
					field : "TASK_INSTRUCTION",
					title : "说明",
					align : "center"
				}]
			   });
	
	var tablefile = getCurrentPageObj().find("#TD_tablefile");
	var file_id = getCurrentPageObj().find("#file_id_reqTD").val();
	if(!file_id){
		file_id = Math.uuid();
		getCurrentPageObj().find("#file_id_reqTD").val(file_id);
	}
	//初始化附件列表
	getSvnFileList(tablefile,getCurrentPageObj().find("#TD_fileview_modal"),file_id);
}*/




/**
 * 根据需求点查找下面所有的任务的接口 
 */
function initedqueryInterface(req_task_id) {
	var queryParams = function(params){
		var temp = {};
		temp["limit"] = params.limit;
		temp["offset"] = params.offset;
		return temp;
	};
	var queryInterfacecall=getMillisecond()+'33';
	//getCurrentPageObj().find("#sendProContent").bootstrapTable("destory");
	getCurrentPageObj().find("#gReqInterTask").bootstrapTable(
			{
				url : dev_construction+'req_taskaccept/queryTaskInterList.asp?call='+queryInterfacecall+'&SID='+SID+'&req_task_id='+req_task_id,//+'&version_id=0&system_no=0&type=edit&sit_id='+sit_id
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
							field : "RECORD_APP_NUM",
							title : "申请单编码",
							align : "center"
						},{
							field : "INTER_CODE",
							title : "接口编号",
							align : "center",
							width : "10%",
							formatter:function(value,row,index){if(value!=undefined&&value!=" "){return '<a style="color:blue" href="javascript:void(0)" onclick="InitInter360Info(\''+row.INTER_ID+'\',\''+row.INTER_VERSION+'\')";>'+value+'</a>';}return '--';}
						},{
							field : "INTER_STATUS_NAME",
							title : "接口状态",
							align : "center"
							
						},{
							field : "APP_STATUS_NAME",
							title : "申请状态",
							align : "center",
							
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
							field : "SER_SYSTEM_NAME",
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
