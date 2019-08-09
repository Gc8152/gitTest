function initSendProInfoConfirm(id,file_id){
	var currTab = getCurrentPageObj();
	autoInitRadio({dic_code:"G_DIC_SUCC_FAIL"},currTab.find("#produce_result"),"PRODUCE_RESULT",{disabled:"",type:"",labClass:"labelRadio",value:"00"});
	currTab.find("#apply_person_id").hide();
	initVlidate(currTab);
	initSendProInfoDetail(id);
	var is_cc;
	
	//第一个页签
	function initSendProInfoDetail(id) {
		//投产单基本信息
		var call_sendInfo = getMillisecond()+'1';
		var url = dev_construction+'sendProduceApply/queryOneSendProInfo.asp?call='+call_sendInfo+'&SID='+SID+'&audit_no='+id;
		baseAjaxJsonp(url, null, function(data){
			if (data != undefined&&data!=null&&data.result=="true") {
				if(data.send){
					is_cc = data.send["SYSTEM_IS_CC"];
					currTab.find("[name='proManId']").val(data.send["PROJECT_MAN_ID"]);
					for(var k in data.send){
						var val = data.send[k];
						k = k.toLowerCase();
						if(k=="is_instancy") {
							currTab.find("#"+k).val(val);
						} else {
							currTab.find("#"+k).text(val);
						}
					}
					if(data.send["SYSTEM_IS_CC"]=="00"){
						getCurrentPageObj().find("#test_base_name").show();
						getCurrentPageObj().find("tr[type=svn_addr]").hide();
					} else{
						getCurrentPageObj().find("#test_base_name").hide();
						getCurrentPageObj().find("tr[type=base_line]").hide();
					}
					if(data.send["relate_audit_no"]) {
						currTab.find("#relate_audit_no_span").css("display", "inline");
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
		currTab.find("#sendProConfirmContent1").bootstrapTable({
			url : dev_construction+'sendProduceApply/querySendTaskByAuditNo.asp?call='+call_sendTask+'&SID='+SID+'&audit_no='+id,
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
				width : 14,
				field : 'REQ_TASK_CODE',
				title : '任务编号',
				align : 'center',
				formatter: function (value, row, index) {
					return '<span class="hover-view" '+
					'onclick="initTaskDetailInfo('+row.REQ_TASK_ID+')">'+value+'</span>';
				}
			},{
				width : 24,
				field : 'REQ_TASK_NAME',
				title : '任务名称',
				align : "center"
			},{
				width : 9,
				field : 'REQ_TASK_TYPE_NAME',
				title : '任务类型',
				align : "center"
			},{
				width : 9,
				field : 'REQ_TASK_RELATION',
				title : '从属关系',
				align : "center",
				formatter: function(value, row, index) {
					if(value==='01') {
						return "主办";
					}
					return "配合";
				}
			}, {
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
				width : 13,
				field : "PUTIN",
				title : "完成投产个数",
				align : "center",
			} ]
		});
	}
	
	initProduceTaskInSameAuctiNo(id);
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
	
	//需求任务详情
	function initTaskDetailInfo(req_task_id){
		closePageTab("req_taskDetail");
		openInnerPageTab("req_taskDetail","任务详情页面","dev_construction/requirement/requirement_analyze/task_accept/task_detail.html",function(){
			initReqTaskDetailLayout(req_task_id);
		});
	}
	
	//第二个页签
	function initSendProInfoTab2() {
		var call_sendTask2 = getMillisecond()+'3';
		var queryParams = function(params){
			var temp = {};
			temp["limit"] = params.limit;
			temp["offset"] = params.offset;
			return temp;
		};
		var audit_no = currTab.find("#audit_no").text(); 
		//currTab.find("#sendProConfirmContent").bootstrapTable("destory");
		currTab.find("#sendProConfirmContent2").bootstrapTable({
			url : dev_construction+'sendProduceApply/querySendTaskByAuditNo.asp?call='+call_sendTask2+'&SID='+SID+'&audit_no='+audit_no,
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
			jsonpCallback: call_sendTask2,
			onLoadSuccess:function(data){
				gaveInfo();	
				currTab.find("#sendProConfirmContent2").find("span[name=viewSendProMaterial2]").click(function(){
					//onclick="viewSendProMaterial2('+index+');"
					viewSendProMaterial2($(this).attr('index'));
				});
				getCurrentPageObj().find("#sendProConfirmContent2").find("span[name=viewSendProMaterial2]").click(function(){
					//onclick="viewSendProMaterial2('+index+');"
					viewSendProMaterial2($(this).attr('index'));
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
					return '<span class="click_text_sp" name="viewSendProMaterial2" index='+index+'>'+value+'</span>';
				}
			},{
				field : 'REQ_TASK_NAME',
				title : '任务名称',
				align : "center"
			},{
				field : 'REQ_TASK_TYPE_NAME',
				title : '任务类型',
				align : "center"
			},{
				field : 'REQ_TASK_RELATION',
				title : '从属关系',
				align : "center",
				formatter: function(value, row, index) {
					if(value==='01') {
						return "主办";
					}
					return "配合";
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
		
		
		//投产材料列表
		var produce_standard = new Object();
		//双月
		produce_standard["02"] = [true, true, true, true, true, true, false, false, true, true, true, true, false, false];
		//单月
		produce_standard["03"] = [true, true, true, true, true, true, false, false, true, true, true, true, false, false];
		//双周
		produce_standard["04"] = [true, true, true, true, false, true, false, false, true, true, true, true, false, false];
		//紧急版
		produce_standard["15"] = [true, true, true, true, false, false, false, false, true, true, true, true, false, false];
		//特殊版
		produce_standard["14"] = [true, true, true, true, false, true, false, false, true, true, true, true, false, false];
		//1618
		produce_standard["other"] = [true, true, true, true, true, true, true, true, true, true, true, true, true, true];
		var detailTable = getCurrentPageObj().find("#sendProConfirmContentDetail");
		detailTable.hide();
		function viewSendProMaterial2(index) {
			var call_sendTask3 = getMillisecond()+'4';
			detailTable.show();
			var row = getCurrentPageObj().find("#sendProConfirmContent2").bootstrapTable("getData")[index];
			req_task_code = row.REQ_TASK_CODE;
			detailTable.find("#material_req_task_id2").val(req_task_code);
			
			baseAjaxJsonp(dev_construction+'sendProduceApply/queryTaskAppraiseAndDoc.asp?call='+call_sendTask3+'&SID='+SID+'&req_task_code='+req_task_code,null, function(result){
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
					}else {
						$result_td.css("color","black");
					}
					$result_td.html(result_val);
				}
			}, call_sendTask3);
		}
	}
	//点击第二个页面
	currTab.find("#sendTaskInfo").click(function(){
		initSendProInfoTab2();
		getSvnFileList(getCurrentPageObj().find("#reviewadd_filetable"), getCurrentPageObj().find("#reqviewaAdd_modalfile"),(file_id||"") , "0101");
	});
	
	//有临时变更
	/*currTab.find("#temp_change").hide();
	currTab.find("select[name=PRODUCE_TEMP_CHANGE]").change(function(){
		if($(this).val()=="00"){
			currTab.find("#temp_change").show();
		} else if($(this).val()=="01"){
			currTab.find("#temp_change").hide();
		}
	});*/
	
	//提交投产信息
	currTab.find("#commit").click(function(){
		
		if(!vlidate(currTab,"",true)){
			return result;
		}
		
		var aaa=getCurrentPageObj().find("textarea[name='PRODUCE_TEMP_CHANGE_DESC']").val();
	    if(aaa.length>150){
	    	alert("临时变更内容至多可输入150汉字！");
	    	return;
	    }
	    var bbb=getCurrentPageObj().find("textarea[name='PRODUCE_DESC']").val();
	    if(bbb.length>150){
	    	alert("备注至多可输入150汉字！");
	    	return;
	    }
	    var produce_result = currTab.find("input[name='PRODUCE_RESULT']:checked").val();//投产结论一般投产
	    var is_instancy = currTab.find("#is_instancy").val();
	    if(is_instancy=="00"&&produce_result=="01"){
	    	alert("紧急投产不能失败，请在投产成功后再确认！");
	    	return;
	    }
	    var commitData = new Object();
			commitData["PRODUCE_RESULT"] = produce_result;
			commitData.PROJECT_MAN_ID = currTab.find("[name='proManId']").val();
			commitData.PRODUCE_TIME = currTab.find("input[name=PRODUCE_TIME]").val();
			commitData.PRODUCE_TEMP_CHANGE_DESC = currTab.find("input[name=PRODUCE_TEMP_CHANGE]").val();
			commitData.IS_CC = is_cc;
			/*var isChange = currTab.find("select[name=PRODUCE_TEMP_CHANGE]").val();
			commitData.PRODUCE_TEMP_CHANGE = isChange;
			if(isChange=="00"){
				commitData.PRODUCE_TEMP_CHANGE_DESC = currTab.find("textarea[name=PRODUCE_TEMP_CHANGE_DESC]").val();
			}*/
			commitData.PRODUCE_DESC = currTab.find("textarea[name=PRODUCE_DESC]").val();
			commitData.OPERA_SEND_PRO_CODE = currTab.find("input[name=OPERA_SEND_PRO_CODE]").val();
			commitData.AUDIT_NO = id;
			/*********提醒参数*************/
			commitData.b_code = id;
			commitData.b_id = id;
			commitData.b_name = getCurrentPageObj().find("#system_name").text()+getCurrentPageObj().find("#versions_name").text()+
				"（投产单编号："+id+"）投产已确认";
			commitData.remind_type="PUB2017175";
			commitData.apply_person_id = currTab.find("#apply_person_id").text();
	    if(produce_result=="01"){//投产失败
	    	//查询当前投产单应用和版本下任务是否为单一主办
	    	var maincall = getMillisecond();
	    	 baseAjaxJsonp(dev_construction+"sendProduceConfirm/queryIsOnlyMainTask.asp?call="+maincall+"&SID="+SID,{audit_no:id}, function(result){
	    		 if(result.result=="true"){//当前投产单的任务是唯一的主办，没有协办
	 			    nconfirm("当前投产单投产失败，是否回退涉及的需求点到待入版状态，以便重新入版后再次投产？",function(){
	 			    	var call_prc = getMillisecond();
		 				baseAjaxJsonp(dev_construction+"sendProduceConfirm/backToIntoVersion.asp?call="+call_prc+"&SID="+SID, commitData, function(result){
		 					if(result.result=="true"){
		 						alert("回退成功");
		 						closeCurrPageTab();
		 					} else {
		 						alert("回退失败");
		 					}
		 				}, call_prc);
	 			    },function(){
		 				var call_prc = getMillisecond();
		 				baseAjaxJsonp(dev_construction+"sendProduceConfirm/updateConfirmState.asp?call="+call_prc+"&SID="+SID, commitData, function(result){
		 					if(result.result=="true"){
		 						alert("提交成功");
		 						closeCurrPageTab();
		 					} else {
		 						alert("提交失败");
		 					}
		 				}, call_prc);
	 			    });
	 			} else {
	 				alert("存在协办任务，只许成功不许失败！");
	 			} 	
	 		}, maincall);	
	    }else{//投产成功
				var call_prc = getMillisecond();
				baseAjaxJsonp(dev_construction+"sendProduceConfirm/updateConfirmState.asp?call="+call_prc+"&SID="+SID, commitData, function(result){
					if(result.result=="true"){
						alert("提交成功");
						closeCurrPageTab();
					} else {
						alert("提交失败");
					}
				}, call_prc);	
	    }
	   
	});
	
	//根据 ---投产编号--- 查找下面所有的任务的接口
	var SendProduce="SendProduce";
	initqueryInterface(id,SendProduce);
	/******** 相关文档上传 ************/
	//附件上传
	tablefile = currTab.find("#table_file");
	//初始化附件列表
	getSvnFileList(tablefile, currTab.find("#file_view_modal"), id, "12");
}



	