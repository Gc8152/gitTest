/**
 * 字典初始化方法
 */
(function(){
	autoInitSelect(getCurrentPageObj().find("#queryCondition"));
	initSelect(getCurrentPageObj().find("#change_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_CHANGE_TYPE"});
	//initSelect(getCurrentPageObj().find("#data_root_status"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_DATA_ROOT_STATUS"});
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
var sendProduceApply_queryList_call_view = getMillisecond()+'2';
/**
 * 组装查询url 
 * @returns {String}
 */
function uatSendProduceUrlView(){
	var url = dev_construction+'sendProduceApply/queryAllSendProInfo.asp?call='+sendProduceApply_queryList_call_view+'&VIEW=1&SID='+SID;
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
				url : dev_construction+'sendProduceApply/queryAllSendProInfo.asp?call='+sendProduceApply_queryList_call_view+'&VIEW=1&SID='+SID,
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
				jsonpCallback: sendProduceApply_queryList_call_view,
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
					width : "180"
				},{
					field : 'SYSTEM_NAME',
					title : '应用名称',
					align : "center",
					width : "150"
				},{
					field : 'VERSIONS_NAME',
					title : '版本名称',
					align : "center",
					width :"180"
				},{
					field : 'CHANGE_TYPE',
					title : '变更类别',
					align : "center",
					width :"100",
					formatter: function (value, row, index) {
						if(row.IS_INSTANCY=='00'){
							return "紧急变更";
						}else{
							return value;
						}
					}
				},{
					field : "PLAN_DATE",
					title : "计划投产日期",
					align : "center",
					width :"120"
				}, {
					field : "IS_INSTANCY_NAME",
					title : "是否紧急投产",
					align : "center",
					width :"120"
				}, {
					field : "APPLY_PERSON",
					title : "申请人",
					align : "center",
					width :"100"
				}, {
					field : "CREATE_APPLY_DATE",
					title : "提交投产时间",
					align : "center",
					width : "110"
				}, {
					field : "CURRENT_DISPOSE_MAN",
					title : "当前处理人",
					align : "center",
					width : "100"
				}, {
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
									return '<a style="color:blue" href="javascript:void(0)" onclick="showAuditRemark5(\''+remark+'\')";>'+value+'</a>';
								}else{
									return value;
								}
							}
						}else{return "审计通过";}
					}
				}, {
					field : "APPROVE_STATUS_NAME",
					title : "审批状态",
					align : "center",
					width :"100"
				}, {
					field : "PRODUCE_RESULT",
					title : "投产结论",
					align : "center",
					width :"100",
					formatter: function(value, row, index){
						if(value=='00'){
							return "投产成功";
						}else if(value=='01'){
							return "投产失败";
						}else{
							return "-";
						}
					}
				}]
			});
})();

function showAuditRemark5(audit_remark){
	if(audit_remark == undefined || audit_remark == 'undefined'){ audit_remark = '';}
	getCurrentPageObj().find("#audit_remarkPop5").modal('show');
	getCurrentPageObj().find("[name='AUDIT_REMARK']").val('');
	getCurrentPageObj().find("[name='AUDIT_REMARK']").val(audit_remark);
}
//初始化页面按钮事件
(function() {	
	
	//关闭审计结论POP
	getCurrentPageObj().find("[btn='close_modal']").click(function(){
		getCurrentPageObj().find("#audit_remarkPop5").modal('hide');
	})
	
	//重置按钮
	getCurrentPageObj().find("#viewreset").click(function(){
		getCurrentPageObj().find("#queryCondition input").val("");
		var selects = getCurrentPageObj().find("#queryCondition select");
		selects.val(" ");
		selects.select2();
	});
	
	//查询按钮事件
	getCurrentPageObj().find("#viewquery").unbind("click");
	getCurrentPageObj().find("#viewquery").click(function(){
		getCurrentPageObj().find("#sendProduceTable").bootstrapTable("refresh",{url:uatSendProduceUrlView()});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#viewquery").click();});
			
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
			closeAndOpenInnerPageTab("sendProduceView_detail","投产信息查看页面","dev_construction/send_produce/sendproduceapply/sendProduceApply_detail.html",function(){
				initSendProInfoDetail(row);
				if(row.APPROVE_STATUS !='01'){
					initTitle(row["INSTANCE_ID"]);
					initReqApprovalDetailInfo(row["INSTANCE_ID"]);
				} else {
					getCurrentPageObj().find("#approve_tab").hide();
				}
			});
		}else{
			closeAndOpenInnerPageTab("sendProduceApply_detail","投产信息查看页面","dev_construction/send_produce/sendproduceapply/instancy/instancySendProduce_detail.html",function(){
				initInstancySendProInfoDetail(row);
				/*if(row.APPROVE_STATUS !='01'){
					initTitle(row["INSTANCE_ID"]);
					initAFApprovalInfo(row["INSTANCE_ID"],'0');
				} else {
					getCurrentPageObj().find("#apptab").hide();
				}*/
			});
		}
	});
	
	
	
})();
	