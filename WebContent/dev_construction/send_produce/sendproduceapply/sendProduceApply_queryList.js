/**
 * 生成投产流水号
 * params pre 前缀
 * params seq 序列名称
 */
function returnSerialNumber(pre,seq){
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
	baseAjaxJsonp(url,{seq:seq}, function(data){
		if (data&&data.result=="true") {
			var code =data.seqCode;
			if(code<=9){
				code='000'+data.seqCode;
			}else if(code>=10&&code<99){
				code='00'+data.seqCode;
			}else if(code>=100&&code<=999){
				code='0'+data.seqCode;
			}
			var codeNum=pre+year+month+'-'+code;
			//把生成的编号写到页面
			getCurrentPageObj().find("#audit_no").val(codeNum);
		} else {
			alert("流水号获取失败！");
		}
	}, call, false);
}
/**
 * 字典初始化方法
 */
(function(){
	autoInitSelect(getCurrentPageObj().find("#queryCondition"));
	initSelect(getCurrentPageObj().find("#change_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_CHANGE_TYPE"});
})();
/**
 * 获取查询参数
 * @returns 
 */
function getSendProduceQueryParam(){
	var param={};
	var queryCondition = getCurrentPageObj().find("#queryCondition [name]");
	for(var i=0;i<queryCondition.length;i++){
		var obj=$(queryCondition[i]);
		if($.trim(obj.val())!=""){
			param[obj.attr("name")]=obj.val();
		}
	}
	return param;
}
/**
 * 获取时间戳
 */
var sendProduceApply_queryList_call = getMillisecond()+'2';
/**
 * 组装查询url 
 * @returns {String}
 */
function uatSendProduceUrl(){
	var url = dev_construction+'sendProduceApply/queryAllSendProInfo.asp?call='+sendProduceApply_queryList_call+'&SID='+SID;
	var queryCondition = getCurrentPageObj().find("#queryCondition [name]");
	for(var i=0; i<queryCondition.length; i++){
		var obj=$(queryCondition[i]);
		if($.trim(obj.val())!=""){
			url+='&'+obj.attr("name")+"="+escape(encodeURIComponent(obj.val()));
		}
	}
	return url;
}

//初始化列表
(function () {
	var queryParams=function(params){
		var temp = getSendProduceQueryParam();
		temp["limit"] = params.limit;
		temp["offset"] = params.offset;
		return temp;
	};
	getCurrentPageObj().find("#sendProduceTable").bootstrapTable({
				url : dev_construction+'sendProduceApply/queryAllSendProInfo.asp?call='+sendProduceApply_queryList_call+'&SID='+SID,
				method : 'get', //请求方式（*）   
				striped : false, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				pagination : true, //是否显示分页（*）
				pageList : [5,10],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 10,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "sub_req_id", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: true,
				jsonpCallback: sendProduceApply_queryList_call,
				onLoadSuccess:function(data){
					gaveInfo();
				},
				columns : [ {
					field: 'middle',
					checkbox: true,
					rowspan: 2,
					align: 'center',
					valign: 'middle'
				},{
					field : 'AUDIT_NO',
					title : '投产单编号',
					align : 'center',
					width :"180"
				},{
					field : 'SYSTEM_NAME',
					title : '应用名称',
					align : "center",
					width :"130"
				},{
					field : 'VERSIONS_NAME',
					title : '版本名称',
					align : "center",
					width :"180"
				}/*,{
					field : 'CHANGE_TYPE',
					title : '变更类别',
					align : "center",
					width : "100"
				}*/,{
					field : "PLAN_DATE",
					title : "计划投产日期",
					align : "center",
					width : "120"
				}, {
					field : "IS_INSTANCY_NAME",
					title : "是否紧急投产",
					align : "center",
					width : "110"
				}, {
					field : "APPLY_PERSON",
					title : "申请人",
					align : "center",
					width : "90"
				}, {
					field : "CREATE_APPLY_DATE",
					title : "提交投产时间",
					align : "center",
					width : "120"
				}, {
					field : "CURRENT_DISPOSE_MAN",
					title : "当前处理人",
					align : "center",
					width : "100"
				}, /*{
					field : "AUDIT_STATE_DISPLAY",
					title : "审计状态",
					align : "center",
					width : "100",
					formatter:function(value){if(value==undefined||value==""||value==null){return "待审计";}else{return value;}}
				}, */{
					field : "AUDIT_CONCLUSION_DISPLAY",
					title : "审计结论",
					align : "center",
					width : "100",
					formatter:function(value, row, index){
						if(row.IS_INSTANCY == '01'){
							if(value==undefined||value==""||value==null){
								return "待审计";
							}
							else{
								var audit_result = row.AUDIT_CONCLUSION;
								if(audit_result == '02' || audit_result == '03'){
									var remark = row.REMARK;
									if(remark == undefined){ 
										remark == '';
									}else{
										remark = remark.replace(/\t/g,"");
										remark = remark.replace(/[\r\n]/g,"");
									}
									return '<a style="color:blue" href="javascript:void(0)" onclick="showAuditRemark4(\''+remark+'\')";>'+value+'</a>';
								}else{
									return value;
								}
							}
						}else{return "审计通过";}
					}
				
				}, {
					field : "APPROVE_STATUS_NAME",
					title : "投产审批状态",
					align : "center",
					width : "100"
				} ]
			});
})();

function showAuditRemark4(audit_remark){
	if(audit_remark == undefined || audit_remark == 'undefined'){ audit_remark = '';}
	getCurrentPageObj().find("#audit_remarkPop4").modal('show');
	getCurrentPageObj().find("[name='AUDIT_REMARK']").val('');
	getCurrentPageObj().find("[name='AUDIT_REMARK']").val(audit_remark);
}

//初始化页面按钮事件
(function() {	
	//关闭审计结论POP
	getCurrentPageObj().find("[btn='close_modal']").click(function(){
		getCurrentPageObj().find("#audit_remarkPop4").modal('hide');
	})
	
	//重置按钮
	getCurrentPageObj().find("#reset").click(function(){
		getCurrentPageObj().find("#queryCondition input").val("");
		var selects = getCurrentPageObj().find("#queryCondition select");
		selects.val(" ");
		selects.select2();
	});
	
	//查询按钮事件
	getCurrentPageObj().find("#query").unbind("click");
	getCurrentPageObj().find("#query").click(function(){
		getCurrentPageObj().find("#sendProduceTable").bootstrapTable("refresh",{url:uatSendProduceUrl()});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#query").click();});
	//发起投产审计
	getCurrentPageObj().find("#sendProduce").unbind("click");
	getCurrentPageObj().find("#sendProduce").click(function(){
		      closeAndOpenInnerPageTab("sendProduceApply_add","发起投产审计","dev_construction/send_produce/sendproduceapply/sendProduceApply_add.html",function(){
			     initsendProduceApply_add();
		      });
	       
	});
	//发起紧急投产
	getCurrentPageObj().find("#sendProduceInstancy").unbind("click");
	getCurrentPageObj().find("#sendProduceInstancy").click(function(){
		closeAndOpenInnerPageTab("sendProduceInstancy_add","发起紧急投产","dev_construction/send_produce/sendproduceapply/instancy/instancySendProduce_add.html",function(){
			initSendProduceInstancy_add();
		});
	});
	
	//投产演练申请
	getCurrentPageObj().find("#sendProduceDrill").unbind("click");
	getCurrentPageObj().find("#sendProduceDrill").click(function(){
		closeAndOpenInnerPageTab("sendProduceApplyDrill_add","投产演练申请","dev_construction/send_produce/sendproduceapply/sendProduceApply_add.html",function(){
			initSendProduceApplyDrill_add();
		});
	});

	//删除投产申请按钮
	getCurrentPageObj().find("#deleteSendProduce").unbind("click");
	getCurrentPageObj().find("#deleteSendProduce").click(function() {
		var selections = getCurrentPageObj().find("#sendProduceTable").bootstrapTable('getSelections');
		if(selections.length != 1) {
			alert("请选择一条数据进行操作!");
			return;
		}
		var ids = $.map(selections, function(row) {
			return row.AUDIT_NO;
		});
		var approve_status = $.map(selections, function(item) {
			return item.APPROVE_STATUS;
		});
		if(approve_status[0] !="04") {
			alert("只能删除打回的投产单！");
			return;
		}
		
		var apply_person = selections[0]["APPLY_PERSON_ID"];
		if(apply_person!=SID){
			alert("您不是当前所选投产单的申请人");
			return;
		}
		
		nconfirm("确定删除该投产单吗？",function(){
			var call = getMillisecond()+'3';
			var url = dev_construction+'sendProduceApply/deleteSendProInfo.asp?call='+call+'&SID='+SID+'&audit_no='+ids[0];
			baseAjax("sfile/delFtpFileByBid.asp?business_code="+selections[0]["AUDIT_NO"], null, function(data){}, true);
			baseAjaxJsonp(url, null, function(data){
				if (data != undefined&&data!=null&&data.result=="true") {
					alert("删除成功！",function(){
						getCurrentPageObj().find("#sendProduceTable").bootstrapTable("refresh",{url:uatSendProduceUrl()});
					});
				} else {
					alert("删除失败！");
				}
			}, call);		
		});
	});
			
	//查看详情
	getCurrentPageObj().find("#detail").unbind("click");
	getCurrentPageObj().find("#detail").click(function(){
		var selections = getCurrentPageObj().find("#sendProduceTable").bootstrapTable('getSelections');
		if(selections.length != 1) {
			alert("请选择一条数据进行操作!");
			return;
		}
		var row = selections[0];
		var is_instancy = row.IS_INSTANCY;
		if(is_instancy != '00'){//00:紧急投产，01:一般投产
			closeAndOpenInnerPageTab("sendProduceApply_detail","投产信息查看页面","dev_construction/send_produce/sendproduceapply/sendProduceApply_detail.html",function(){
				initSendProInfoDetail(row);
				/*if(row.APPROVE_STATUS !='01'){
					initTitle(row["INSTANCE_ID"]);
					initReqApprovalDetailInfo(row["INSTANCE_ID"]);
				} else {//未提交状态的不显示审批页签
					getCurrentPageObj().find("#approve_tab").hide();
				}*/
			});
		}else{
			closeAndOpenInnerPageTab("sendProduceApply_detail","投产信息查看页面","dev_construction/send_produce/sendproduceapply/instancy/instancySendProduce_detail.html",function(){
				initInstancySendProInfoDetail(row);
				/*if(row.APPROVE_STATUS !='01'){
					initTitle(row["INSTANCE_ID"]);
					initAFApprovalInfo(row["INSTANCE_ID"],'0');
				} else {//未提交状态的不显示审批页签
					getCurrentPageObj().find("#apptab").hide();
				}*/
			});
		}
	});
	//修改投产单信息
	getCurrentPageObj().find("#updateSendProduce").unbind("click");
	getCurrentPageObj().find("#updateSendProduce").click(function(){
		var selections = getCurrentPageObj().find("#sendProduceTable").bootstrapTable('getSelections');
		var selection = selections[0];
		if(selections.length != 1) {
			alert("请选择一条数据进行操作!");
			return;
		}
		var approve_status = $.map(selections, function(item) {
			return item.APPROVE_STATUS;
		});
		/*if(approve_status[0]!='01'||approve_status[0]!='04'){
			alert("该投产单状态无法修改");
			return;
			
		}*/
		var apply_person = selections[0]["APPLY_PERSON_ID"];
		if(apply_person!=SID){
			alert("您不是当前所选投产单的申请人");
			return;
		}
		if(selection["AUDIT_CONCLUSION"]!="03"&&selection["APPROVE_STATUS"]!="04"){
			alert("请选择审计不通过或审批打回数据");
			return ;
		}
		var is_instancy = selection["IS_INSTANCY"];
		var audit_no = selection["AUDIT_NO"];
		if(is_instancy=='00'){//00:紧急投产单
			closeAndOpenInnerPageTab("sendProduceApply_update","投产信息修改页面","dev_construction/send_produce/sendproduceapply/instancy/instancySendProduce_update.html",function(){
				initSendProduceInstancy_update(audit_no);
			});
		}else{//01：一般投产单
			closeAndOpenInnerPageTab("sendProduceApply_update","投产信息修改页面","dev_construction/send_produce/sendproduceapply/sendProduceApply_update.html",function(){
				initSendProInfoUpdate(audit_no);
			});
		}
	});
	
	//发起补充投产单信息
	getCurrentPageObj().find("#sendProducePatch").unbind("click");
	getCurrentPageObj().find("#sendProducePatch").click(function(){
		var selections = getCurrentPageObj().find("#sendProduceTable").bootstrapTable('getSelections');
		var selection = selections[0];
		if(selections.length != 1) {
			alert("请选择一条数据进行操作!");
			return;
		}
		var apply_person = selections[0]["APPLY_PERSON_ID"];
		if(apply_person!=SID){
			alert("您不是当前所选投产单的申请人");
			return;
		}
		var is_instancy = selection["IS_INSTANCY"];
		var audit_no = selection["AUDIT_NO"];
		if(is_instancy=='00'){//00:紧急投产单
			alert("请选择非紧急投产单");
		}else{//01：一般投产单
			if(audit_no.indexOf("BD")=="-1"){
				closeAndOpenInnerPageTab("sendProduceApply_update","补充投产单新增页面","dev_construction/send_produce/sendproduceapply/sendProducePatchApply_add.html",function(){
					initSendProInfoPatch(audit_no);
				});
			} else {
				alert("请选择非补充投产单");
			}
		}
	});
	
	//发起投产审批按钮
	getCurrentPageObj().find("#start").unbind("click");
	getCurrentPageObj().find("#start").click(function(){
		var selections = getCurrentPageObj().find("#sendProduceTable").bootstrapTable('getSelections');
		if(selections.length != 1) {
			alert("请选择一条数据进行操作!");
			return;
		}
		var ids = $.map(selections, function(row) {
			return row.AUDIT_NO;
		});
		var approve_status = $.map(selections, function(item) {
			return item.APPROVE_STATUS;
		});
		if(approve_status[0] !="01" && approve_status[0] !="04" && approve_status[0] != "05") {
			if(approve_status[0] == "02") {
				alert("该投产单在审批中，不能发起！");
				return;
			} else {
				alert("该投产单已审批通过，不能发起！");
				return;
			}
		}
		var param2 = {};
		param2["b_code"] = selections[0].AUDIT_NO;
		param2["b_id"] = selections[0].AUDIT_NO;
		param2["b_name"] = selections[0].SYSTEM_NAME+selections[0].VERSIONS_NAME+"（投产单编号："+selections[0].AUDIT_NO+"）已提交投产申请";
		var audit_no = selections[0].AUDIT_NO;
		nconfirm("确定提交该投产单吗？",function(){
			var call = getMillisecond();
		    baseAjaxJsonp(dev_construction+'sendProduceApply/commitSendProApply.asp?call='+call+'&SID='+SID+"&audit_no="+ids+"&as=01", null , function(data) {
				if (data != undefined && data != null && data.result=="true") {
					alert("提交成功!");
					var call2 = getMillisecond()+'1';
					 baseAjaxJsonp(dev_construction+'sendProduceApply/queryRemindUserByAuditNo.asp?call='+call2+'&SID='+SID+"&audit_no="+audit_no, null , function(remiddata) {
						 if (remiddata != undefined && remiddata != null && remiddata.result=="true") {
						 //插入提醒
							var applyCall = getMillisecond()+'3';
				       		baseAjaxJsonp(dev_workbench+"Remind/remindAdd.asp?SID="+SID+"&call="+applyCall+"&remind_type=PUB2017148"+
				                      "&user_id="+remiddata.ids,param2, function(mes){
				       					if (mes != undefined && mes != null && data.result=="true") {
				       						//投产审批插入提醒成功
				       					}
				    		}, applyCall);
						 }
					 },call2);
				}else{
					alert("提交失败");
				}
				getCurrentPageObj().find("#query").click();
			},call);  
		});
	});
	
	//审批
	getCurrentPageObj().find("#approve").unbind("click");
	getCurrentPageObj().find("#approve").click(function() {
		var selections = getCurrentPageObj().find("#sendProduceTable").bootstrapTable('getSelections');
		if(selections.length != 1) {
			alert("请选择一条数据进行操作!");
			return;
		}
		var ids = $.map(selections, function(row) {
			return row.AUDIT_NO;
		});
		var approve_status = $.map(selections, function(item) {
			return item.APPROVE_STATUS;
		});
		if(approve_status[0] !="02") {
			if(approve_status[0] == "01") {
				alert("该投产单在草拟状态！");
				return;
			} else if(approve_status[0] == "03")  {
				alert("该投产单已审批通过！");
				return;
			} else {
				alert("该投产单已打回！");
				return;
			}
		}
		
		closeAndOpenInnerPageTab("requirement_approve","需求审批页面","dev_construction/send_produce/sendproduceapply/sendProduceApply_Approve.html",function(){
			initSendProInfoApproveLayout(selections[0]);
		});
		/*nconfirm("确定通过审批吗？",function(){
			var call = getMillisecond()+'5';
			var url = dev_construction+'sendProduceApply/allowApprove.asp?call='+call+'&SID='+SID+'&audit_no='+ids[0];
			baseAjaxJsonp(url, null, function(data){
				if (data != undefined&&data!=null&&data.result=="true") {
					alert("审批通过！",function(){
						getCurrentPageObj().find("#sendProduceTable").bootstrapTable("refresh",{url:uatSendProduceUrl()});
					});
				} else {
					alert("审批未通过！");
				}
			}, call);			
		});*/
	});
	
	
	/*********************/
	/*var id = getCurrentPageObj().find("#gReqForApproveTable").bootstrapTable('getSelections');
	var ids=$.map(id, function (row) {return row.REQ_ID;});
	var req_state=$.map(id, function (row) {return row.REQ_STATE;});
	var approve_owner=$.map(id, function (row) {return row.CURR_ACTORNO;});
	if(req_state[0]!="07"){			
		alert("该需求审批已完成审批！");
		return;
	}
	if(approve_owner.length<1 || approve_owner[0].indexOf(SID) < 0){
		alert("你不是此需求的当前审批人");
		return;
	}
	if(id.length==1){
	}else{
        alert("请选择一条数据进行审批！");
	}		*/
	
	
})();
	