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
   // var code="000000000";
    var call = getMillisecond()+'1';
    var url = dev_construction+"sendProduceApply/getSerialNumberSeq.asp?SID="+SID+"&call="+call;
	baseAjaxJsonp(url,{seq:seq}, function(data){
		if (data&&data.result=="true") {
			var code =data.seqCode;
			//code=code.substring(code.length-9,code.length);
			if(code<=9){
				code='000'+data.seqCode;
			}else if(code>=10&&code<99){
				code='00'+data.seqCode;
			}else if(code>=100&&code<=999){
				code='0'+data.seqCode;
			}
				//code.substring(code.length-4, code.length);
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
var sendProduceApply_queryList_call = getMillisecond()+'2';
/**
 * 组装查询url 
 * @returns {String}
 */
function uatSendProduceUrl(){
	var url = dev_construction+'sendProduceCommit/queryAllSendProInfo.asp?call='+sendProduceApply_queryList_call+'&SID='+SID;
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
				url : dev_construction+'sendProduceCommit/queryAllSendProInfo.asp?call='+sendProduceApply_queryList_call+'&SID='+SID,
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
					width :"150"
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
					width :"110"
				}, {
					field : "APPLY_PERSON",
					title : "申请人",
					align : "center",
					width :"90"
				}, {
					field : "CREATE_APPLY_DATE",
					title : "提交投产时间",
					align : "center",
					width : "110"
				}, {
					field : "CURRENT_DISPOSE_MAN",
					title : "当前处理人",
					align : "center",
					width : "90"
				}, {
					field : "APPROVE_STATUS",
					title : "审批状态",
					align : "center",
					visible: false
				}, {
					field : "APPROVE_STATUS_NAME",
					title : "审批状态",
					align : "center",
					width :"100"
				/*}, {
					field : "APPROVE_PERSON",
					title : "审批人",
					align : "center"
				}, {
					field : "ROOT_STATUS",
					title : "提交状态",
					align : "center"
				}, {
					field : "DATA_ROOT_STATUS",
					title : "工单状态",
					align : "center"*/
				} ]
			});
})();


//初始化页面按钮事件
(function() {	
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
				/*if(row.APPROVE_STATUS =='02'|| row.APPROVE_STATUS=='03'|| row.APPROVE_STATUS=='04'){
					initTitle(row["INSTANCE_ID"]);
					initReqApprovalDetailInfo(row["INSTANCE_ID"]);
				} else {
					
				}*/
				getCurrentPageObj().find("#approve_tab").hide();
			});
		}else{
			closeAndOpenInnerPageTab("sendProduceApply_detail","投产信息查看页面","dev_construction/send_produce/sendproduceapply/instancy/instancySendProduce_detail.html",function(){
				initInstancySendProInfoDetail(row);
				//initTitle(row["INSTANCE_ID"]);
				//initAFApprovalInfo(row["INSTANCE_ID"],'0');
			});
		}
	});
	//修改按钮 
	getCurrentPageObj().find("#updateSendProduce").unbind("click");
	getCurrentPageObj().find("#updateSendProduce").click(function(){
		var selections = getCurrentPageObj().find("#sendProduceTable").bootstrapTable('getSelections');
		if(selections.length != 1) {
			alert("请选择一条数据进行操作!");
			return;
		}
		var ids = $.map(selections, function(row) {
			return row.AUDIT_NO;
		});
		
		/*var apply_person = selections[0]["APPLY_PERSON_ID"];
		if(apply_person!=SID){
			alert("您不是当前所选投产单的申请人");
			return;
		}*/
		var row = selections[0];
		var is_instancy = row.IS_INSTANCY;
		if(is_instancy != '00'){//00:紧急投产，01:一般投产
			closeAndOpenInnerPageTab("sendProduceCommit_update","补充投产信息","dev_construction/send_produce/sendproducecommit/sendProduceCommit_update.html",function(){
				initSendProInfoCommitUpdate(ids[0]);
			});
		}else{
			closeAndOpenInnerPageTab("sendProduceCommit_update","补充投产信息","dev_construction/send_produce/sendproduceapply/instancy/instancySendProduce_commit.html",function(){
				initSendProInstancyCommitUpdate(ids[0]);//紧急投产页面方法
			});
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
		if(approve_status[0] !="01" && approve_status[0] !="04" &&approve_status[0] !="05") {
			if(approve_status[0] == "02") {
				alert("该投产单在审批中，不能发起！");
				return;
			} else {
				alert("该投产单已审批通过，不能发起！");
				return;
			}
		}
		nconfirm("确定发起该投产单吗？",function(){
			var item = new Object();
			item["af_id"] = '63';//流程id
			item["systemFlag"] = '02'; //systemFlag：系统标识（合同系统：00，项目系统：01，报销系统：02，工程管理：03）
			item["biz_id"] = ids[0];//业务id
			//item["PM_ID"] = $("#currentLoginNoOrg_no").val();
			//item["n_org_cc"] = '110107';
			item["n_org_pm"] = '110107';
			//item["n_org_gao"] = '110110';
			
			approvalProcess(item,function(data){
				var call = getMillisecond();
			    baseAjaxJsonp(dev_construction+'sendProduceApprove/allowApprove.asp?call='+call+'&SID='+SID+"&audit_no="+ids+"&approve_status=02&as=01", null , function(data) {
					if (data != undefined && data != null && data.result=="true") {
						alert("提交成功!");
					}else{
						alert("提交失败");
					}
					getCurrentPageObj().find("#query").click();
				},call);  
				//closeCurrPageTab();
			});
		});
	});
	

})();
	