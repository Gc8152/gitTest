function initSitTestReportInfoLayout(item){
	var currTab = getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题
	
	initSelect(getCurrentPageObj().find("#ACCEPT_RESULT"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_ACCEPT_RESULT"});
	initSelect(getCurrentPageObj().find("#PUTIN_RESULT"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_PUTIN_RESULT"});
	
	var tablefile = currTab.find("#table_file");
	
	//初始化下拉选
	autoInitSelect(currTab.find("#sitReportInfo"));
	//赋值
	initSitTaskInfo(item[0]['SUB_REQ_ID']);
	// 根据需求点查找下面所有的任务的接口 
	initqueryInterface(item[0]['SUB_REQ_ID']);
	/**初始化按钮开始**/	
	//保存
	var save = currTab.find("#saveSitReprot");
	save.click(function(){
		if(!vlidate(currTab,"",true)){
			alert("您还有必填项未填");
			return ;
		}
		var rows = getCurrentPageObj().find("#table_file").bootstrapTable("getData");
		if(rows.length==0){
			alert("还未上传测试报告，不能提交");
			return;
		}
		initsave(false,"");
	});
	//保存并提交
	var submit = currTab.find("#submitSitReprot");
	submit.click(function(){
		if(!vlidate(currTab,"",true)){
			alert("您还有必填项未填");
			return ;
		}
		var rows = getCurrentPageObj().find("#table_file").bootstrapTable("getData");
		if(rows.length==0){
			alert("还未上传测试报告，不能提交");
			return;
		}else{
			var sit_report = false;
			for(var i=0;i<rows.length;i++){
				if(rows[i].FILE_TYPE == "sj_01"){//包含有sit测试报告类型的文件
					sit_report = true;
				}
			}
			if(!sit_report){//未上传sit测试报告类型的文件
				alert("未上传文档类型为“sit测试报告”的文件，不能提交");
				return;
			}
		}
		var aaa=getCurrentPageObj().find("textarea[name='A.ACCEPT_MARK']").val();
	    if(aaa.length>230){
	    	alert("备注至多可输入230汉字！");
	    	return;
	    }
		
		var items = {};
		var uuid = Math.uuid();
		var business_dpt_lead = item[0]['CREATE_PERSON'];
		if(business_dpt_lead == undefined || business_dpt_lead == "undefined"){
			business_dpt_lead = "";  //当前需求无业务提出人，将其重置为空，让其无法匹配流程审批节点
		}
		items["af_id"] = '144';//流程id
		items["systemFlag"] = '03'; //systemFlag：系统标识（合同系统：00，项目系统：01，报销系统：02，工程管理：03）
		items["biz_id"] = uuid;//业务id
		items["test_owner"] = item[0]['TEST_MAN_ID'];  //测试需求中心
		items["business_dpt_lead"] = business_dpt_lead; //单人审批需求提出人
		items["req_dept_org"] = item[0]['REQ_DEPT']; //业务部门
		if(item[0]['REQ_DEPT'] == item[0]['REQ_PUT_DEPT']){ //如业务部门和需求提出部门一直则不行要业务部门审批
			items["type"] = '02';
		}else{
			items["type"] = '01';
		}
		approvalProcess(items,function(data){
			initsave(true,uuid);
		});
		
	});
	//返回
	var back = currTab.find("#backSitReprot");
	back.click(function(){
		closeCurrPageTab();
	});
	  
	function initsave(isCommit,uuid){
		
		var param = {};
		var selectInfo = currTab.find("#sitReportInfo");
		var inputs = selectInfo.find("input[name^='A.']");
		var selects = selectInfo.find("select[name^='A.']");
		var textareas = selectInfo.find("textarea[name^='A.']");
		for (var i = 0; i < inputs.length; i++) {
			var obj = $(inputs[i]);
			param[obj.attr("name").substr(2)] = $.trim(obj.val());
		}
		for (var i = 0; i < selects.length; i++) {
			var obj = $(selects[i]);
			param[obj.attr("name").substr(2)] = $.trim(obj.val());
		}
		for (var i = 0; i < textareas.length; i++) {
			var obj = $(textareas[i]);
			param[obj.attr("name").substr(2)] = $.trim(obj.val());
		}
		
		var chobj= getCurrentPageObj().find("input[name='check_task']:checkbox"); 

		
		//chobj.each(function(){ 
		var taskInfos="";//删除的ID  
		var sendTaskData = currTab.find("#table_SITtaskInfo").bootstrapTable('getData');
		$.each(sendTaskData, function(j) {
			if(taskInfos==""){
				taskInfos = sendTaskData[j].REQ_TASK_ID;
			}else{
				taskInfos = taskInfos+","+sendTaskData[j].REQ_TASK_ID;
			}
		});  
		//param["REQ_TASK_IDS"] = taskInfos;
		
		param["REQ_TASK_IDS"] = taskInfos;
		param["TEST_SIT_ID"]=item[0].TEST_SIT_ID;
		param["IS_COMMIT"]=isCommit;
		param["UUID"] = uuid;
		/*****插入提醒参数*****/
		
		var call = getMillisecond();
		baseAjaxJsonp(dev_construction+"GSitReport/saveSitReport.asp?call="+call+"&SID="+SID,param, function(data){
			if (data != undefined && data != null && data.result=="true" ) {
	       		alert(data.msg);
	       		closeCurrPageTab();
			}else{ 
				alert(data.msg);
			}
		}, call);
	}
	/**初始化按钮结束**/
	
	 //点击打开模态框
	var ids=$.map(item, function (row) {return row.REQ_TASK_CODE;});
		//附件上传
	var business_codes = ids.toString();
	tablefile = currTab.find("#table_file");
	//点击打开上传模态框
	var addfile = currTab.find("#add_file");
	addfile.click(function(){
		openFileSvnUpload(currTab.find("#file_modal"), tablefile, "GZ1059003",business_codes, "09003", "S_DIC_SIT_TEST_FILE", true, true);
	});
	//附件删除
	var delete_file = currTab.find("#delete_file");
	delete_file.click(function(){
		delSvnFile(tablefile, business_codes, "09003", currTab.find("#file_modal"));
	});
	//初始化附件列表
	getSvnFileList(tablefile,currTab.find("#file_view_modal"),business_codes, "09003");
	
	function initSitTaskInfo(SUB_REQ_ID){
		var currTab = getCurrentPageObj();
		var call = getMillisecond();
		var param=function(params){
			var temp={
					//limit: params.limit, //页面大小
					//offset: params.offset, //页码
					sub_req_id:SUB_REQ_ID
			};
			return temp;
		};
		var table = currTab.find("#table_SITtaskInfo");
		var tableCall = "report"+getMillisecond();
		table.bootstrapTable("destroy").bootstrapTable({
			//请求后台的URL（*）
			url : dev_construction+"GSitReport/queryTaskByReportId.asp?SID="+SID+"&call="+tableCall,
			method : 'get', //请求方式（*）
			striped : false, //是否显示行间隔色
			async:true,
			cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : true, //是否启用排序
			sortOrder : "asc", //排序方式
			queryParams : param,//传递参数（*）
			sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
			pagination : false, //是否显示分页（*）
			pageList : [5,10,20],//每页的记录行数（*）
			pageNumber : 1, //初始化加载第一页，默认第一页
			pageSize : 10,//可供选择的每页的行数（*）
			clickToSelect : true, //是否启用点击选中行
			uniqueId : "REQ_TASK_ID", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			jsonpCallback : tableCall,
			detailView : false, //是否显示父子表
			singleSelect: false,
			onLoadSuccess:function(data){
				var rows = data.rows;
				var flag = false;
				for(var i=0;i<rows.length;i++){
					var type = rows[i].TASK_TYPE;
					var versions_type = rows[i].VERSIONS_TYPE;
					if(type=='05' || versions_type=='15'){
						flag = true;//紧急任务
						break;
					}
				}
				if(flag){
					currTab.find('#noInstancy').hide();
					currTab.find('#instancy').show();
				}else{
					currTab.find('#noInstancy').show();
					currTab.find('#instancy').hide();
				}
			},
			columns : [ 
			{
				field: 'middle',
				checkbox: true,
				rowspan: 2,
				align: 'center',
				valign: 'middle',
				visible:false,
			},
			{
				field : 'aa',
				title : '序号',
				align : "center",
				width : "60",
				formatter : function(value, row, index){
					return index+1;
				}
			},{
				field : 'REQ_TASK_ID',
				title : '任务序列号',
				align : "center",
				visible:false,
			},{
				field : 'SUB_REQ_ID',
				title : '需求点序列号',
				align : "center",
				visible:false,
			},{
				field : 'REQ_ID',
				title : '需求序列号',
				align : "center",
				visible:false,
			},{
				field : 'REQ_TASK_CODE',
				title : '任务编号',
				align : "center",
			}, {
				field : 'REQ_TASK_NAME',
				title : '任务名称',
				align : "center"
			}, {
				field : "REQ_TASK_RELATION_NAME",
				title : "从属关系",
				align : "center",
				width : "80",
			}, {
				field : "REQ_TASK_STATE_DISPLAY",
				title : "任务状态",
				align : "center",
				width : "80",
			}, {
				field : "SYSTEM_NAME",
				title : "实施应用",
				align : "center",
			},{
				field : "CREATE_TIME",
				title : "创建时间",
				align : "center",
			},{
				field : "REQ_TASK_STATE",
				title : "需求任务状态",
				align : "center",
				visible:false,
			},{
				field : "REQ_TASK_CODE",
				title : "附件信息",
				align : "center",
				width : "90",
				formatter:function(value,row,index){if(value!=undefined&&value!=""&&value!=null){return '<a style="color:blue" href="javascript:void(0)" onclick="phasedFollower(09003,\''+row.REQ_TASK_ID+'\',\''+row.REQ_TASK_CODE+'\')";>查看</a>';}return "--";}
			}]
		});
	}
	
	/**
	 * queryDefectFromQC
	 * 查询缺陷个数
	 */
	var qcCall = getMillisecond();
	/*var qcParam = new Object();
	qcParam.system_name = item[0].SYSTEM_SHORT;
	qcParam.sub_req_code = item[0].SUB_REQ_CODE;
	baseAjaxJsonp(dev_construction+"GSitReport/queryDefectFromQC.asp?call="+qcCall+"&SID="+SID,qcParam, function(data){
		if(data !=null && data.result=="true"){
			//缺陷赋值
			var defect = data.entity.defect;
			
			getCurrentPageObj().find("[name='A.ADEFECT_NUM']").val(defect.A);
			getCurrentPageObj().find("[name='A.ADEFECT_PASSNUM']").val(defect.A1);
			getCurrentPageObj().find("[name='aleave']").val(defect.A - defect.A1);
			
			getCurrentPageObj().find("[name='A.BDEFECT_NUM']").val(defect.B);
			getCurrentPageObj().find("[name='A.BDEFECT_PASSNUM']").val(defect.B1);
			getCurrentPageObj().find("[name='bleave']").val(defect.B - defect.B1);
			
			getCurrentPageObj().find("[name='A.CDEFECT_NUM']").val(defect.C);
			getCurrentPageObj().find("[name='A.CDEFECT_PASSNUM']").val(defect.C1);
			getCurrentPageObj().find("[name='cleave']").val(defect.C - defect.C1);
			
			getCurrentPageObj().find("[name='A.DDEFECT_NUM']").val(defect.D);
			getCurrentPageObj().find("[name='A.DDEFECT_PASSNUM']").val(defect.D1);
			getCurrentPageObj().find("[name='dleave']").val(defect.D - defect.D1);
			
			var defectSum = defect.A + defect.B + defect.C + defect.D;
			var defectPassSum = defect.A1 + defect.B1 + defect.C1 + defect.D1;
			getCurrentPageObj().find("[name='A.ALLDEFECT_NUM']").val(defectSum);
			getCurrentPageObj().find("[name='allpass']").val(defectPassSum);
			getCurrentPageObj().find("[name='A.ALLLEFTDEFECT_NUM']").val(defectSum- defectPassSum);
		}
	}, qcCall);*/
	var param = {};
	param["req_task_id"] = item[0].REQ_TASK_ID;
	param["report_id"] = item[0].REPORT_ID;
	
	baseAjaxJsonp(dev_construction+"GSitReport/queryReportTaskById.asp?call="+qcCall+"&SID="+SID,param, function(data){
		if (data != undefined && data != null && data.result=="true" ) {
			var reportMap = data.reportMap;
			for (var key in reportMap) {
				var str = reportMap[key];
				if(key=="ACCEPT_RESULT"){
					initSelect(getCurrentPageObj().find("#ACCEPT_RESULT"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_ACCEPT_RESULT"},str);
				}else if(key=="PUTIN_RESULT"){
					initSelect(getCurrentPageObj().find("#PUTIN_RESULT"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_PUTIN_RESULT"},str);
				}else if(key=="ACCEPT_MARK"){
					currTab.find("textarea[name='A."+key+"']").text(str);
				}else{
					currTab.find("input[name='A."+key+"']").val(str);

				}
			}
			var adefect_num = reportMap.ADEFECT_NUM;
			var adefect_passnum = reportMap.ADEFECT_PASSNUM;
			currTab.find("input[name='aleave']").val(adefect_num-adefect_passnum);
			var bdefect_num = reportMap.BDEFECT_NUM;
			var bdefect_passnum = reportMap.BDEFECT_PASSNUM;
			currTab.find("input[name='bleave']").val(bdefect_num-bdefect_passnum);
			var cdefect_num = reportMap.CDEFECT_NUM;
			var cdefect_passnum = reportMap.CDEFECT_PASSNUM;
			currTab.find("input[name='cleave']").val(cdefect_num-cdefect_passnum);
			var ddefect_num = reportMap.DDEFECT_NUM;
			var ddefect_passnum = reportMap.DDEFECT_PASSNUM;
			currTab.find("input[name='dleave']").val(ddefect_num-ddefect_passnum);
			var edefect_num = reportMap.EDEFECT_NUM;
			var edefect_passnum = reportMap.EDEFECT_PASSNUM;
			currTab.find("input[name='eleave']").val(edefect_num-edefect_passnum);
			
			currTab.find("input[name='allpass']").val(parseInt(adefect_passnum)
					+parseInt(bdefect_passnum)+parseInt(cdefect_passnum)+parseInt(ddefect_passnum));
		}else{ 
			alert(data.msg);
		}
	}, qcCall);
	
}
initVlidate(getCurrentPageObj());


//案例条数
(function(){
	getCurrentPageObj().find("#text_sum [name^='A.']").blur(function() {
		var test_num = parseInt(getCurrentPageObj().find("[name='A.TEST_UNPASS_NUM']").val());
		var test_passnum = parseInt(getCurrentPageObj().find("[name='A.TEST_PASS_NUM']").val());
		var unsuit_num = parseInt(getCurrentPageObj().find("[name='A.UNSUIT_NUM']").val());
		var untest_num = parseInt(getCurrentPageObj().find("[name='A.UNTEST_NUM']").val());
		if(test_num>=0 && test_passnum>=0) {
			sum=test_passnum+unsuit_num+untest_num;
			/*if(test_num<sum){
				alert("测试通过个数+不适用个数+未测试个数不能大于案例个数");
				getCurrentPageObj().find("[name='A.TEST_UNPASS_NUM']").val("");
				getCurrentPageObj().find("[name='A.TEST_PASS_NUM']").val("");
				getCurrentPageObj().find("[name='A.TEST_NUM']").val("");
				getCurrentPageObj().find("[name='A.PASS_RATE']").val("");
				getCurrentPageObj().find("[name='A.UNSUIT_NUM']").val("");
				getCurrentPageObj().find("[name='A.UNTEST_NUM']").val("");
				return;
			}*/
			var sum1=sum+test_num;
			getCurrentPageObj().find("[name='A.TEST_NUM']").val(test_num+sum);
			if(test_num==0&&test_passnum==0){
				getCurrentPageObj().find("[name='A.PASS_RATE']").val("100.00");
				return;
			}
			var pass_rate = test_passnum/sum1*100;
			getCurrentPageObj().find("[name='A.PASS_RATE']").val(pass_rate.toFixed(2));
		} else {
			getCurrentPageObj().find("[name='A.TEST_NUM']").val("");
			getCurrentPageObj().find("[name='A.PASS_RATE']").val("");
		}
	});
})();

/*//测试通过率
(function(){
	getCurrentPageObj().find("#unsuitNum [name^='A.']").blur(function() {
		var unsuit_num = getCurrentPageObj().find("[name='A.UNSUIT_NUM']").val();
		var untest_num = getCurrentPageObj().find("[name='A.UNTEST_NUM']").val();
		if(unsuit_num && untest_num) {
			getCurrentPageObj().find("[name='A.PASS_RATE']").val(unsuit_num/untest_num);
		} else {
			getCurrentPageObj().find("[name='A.PASS_RATE']").val("");
		}
	});
})();*/


//测试缺陷中输入框的失去焦点事件
(function(){
	getCurrentPageObj().find("#bug_table [name^='A.']").blur(function() {
		autoCalculateBug();
	});
})();
function aCalculateBug(){
	var adefect_num = parseInt(getCurrentPageObj().find("[name='A.ADEFECT_NUM']").val());
	var adefect_passnum = parseInt(getCurrentPageObj().find("[name='A.ADEFECT_PASSNUM']").val());
	if(adefect_num>=0 && adefect_passnum>=0) {
		if(adefect_num<adefect_passnum){ 
			alert("A级修复验证通过数大于缺陷");
			getCurrentPageObj().find("[name='A.ADEFECT_PASSNUM']").val("");
			return;
		};
		getCurrentPageObj().find("[name='aleave']").val(adefect_num-adefect_passnum);
	}else {
		getCurrentPageObj().find("[name='aleave']").val("");
	}
}
function bCalculateBug(){
	var bdefect_num = parseInt(getCurrentPageObj().find("[name='A.BDEFECT_NUM']").val());
	var bdefect_passnum = parseInt(getCurrentPageObj().find("[name='A.BDEFECT_PASSNUM']").val());
	if(bdefect_num>=0 && bdefect_passnum>=0) {
		if(bdefect_num<bdefect_passnum){ 
			alert("B级修复验证通过数大于缺陷");
			getCurrentPageObj().find("[name='A.BDEFECT_PASSNUM']").val("");
			return;
		};
		getCurrentPageObj().find("[name='bleave']").val(bdefect_num-bdefect_passnum);
	} else {
		getCurrentPageObj().find("[name='bleave']").val("");
	}
}
function cCalculateBug(){
	var cdefect_num = parseInt(getCurrentPageObj().find("[name='A.CDEFECT_NUM']").val());
	var cdefect_passnum = parseInt(getCurrentPageObj().find("[name='A.CDEFECT_PASSNUM']").val());
	if(cdefect_num>=0 && cdefect_passnum>=0) {
		if(cdefect_num<cdefect_passnum){ 
			alert("C级修复验证通过数大于缺陷");
			getCurrentPageObj().find("[name='A.CDEFECT_PASSNUM']").val("");
			return;
		};
		getCurrentPageObj().find("[name='cleave']").val(cdefect_num-cdefect_passnum);
	} else {
		getCurrentPageObj().find("[name='cleave']").val("");
	}
}
function dCalculateBug(){
	var ddefect_num = parseInt(getCurrentPageObj().find("[name='A.DDEFECT_NUM']").val());
	var ddefect_passnum = parseInt(getCurrentPageObj().find("[name='A.DDEFECT_PASSNUM']").val());
	if(ddefect_num>=0 && ddefect_passnum>=0) {
		if(ddefect_num<ddefect_passnum){ 
			alert("D级修复验证通过数大于缺陷");
			getCurrentPageObj().find("[name='A.DDEFECT_PASSNUM']").val("");
			return;
		};
		getCurrentPageObj().find("[name='dleave']").val(ddefect_num-ddefect_passnum);
	} else {
		getCurrentPageObj().find("[name='dleave']").val("");
	}
}
/*function eCalculateBug(){
	//e级缺陷 
	var edefect_num = parseInt(getCurrentPageObj().find("[name='A.EDEFECT_NUM']").val());
	var edefect_passnum = parseInt(getCurrentPageObj().find("[name='A.EDEFECT_PASSNUM']").val());
	if(edefect_num>=0 && edefect_passnum>=0) {
		if(edefect_num<edefect_passnum){ 
			alert("E级修复验证通过数大于缺陷");
			getCurrentPageObj().find("[name='A.EDEFECT_PASSNUM']").val("");
			return;
		};
		getCurrentPageObj().find("[name='eleave']").val(edefect_num-edefect_passnum);
	} else {
		getCurrentPageObj().find("[name='eleave']").val("");
	}
}*/

//根据不同阶段的任务信息
function phasedFollower(task_state,req_task_id,req_task_code){
	var text="";
	var params = {};
	params['req_task_id'] = req_task_id;
	params["phased_state"]=task_state;
	params['REQ_TASK_CODE']=req_task_code.toString();
	if(task_state=='03'){
		params['phase']='req_task_analyze';
		text="任务分析文档详情";
	}else if(task_state=='05'){
		params['phase']='req_task_summary';
		text="设计开发文档详情";
	}else if(task_state=='06'){
		params['phase']='req_task_design';
		text="详细设计文档详情";
	}else if(task_state=='07'){
		params['phase']='req_task_unit_test';
		text="编码开发文档详情";
	}else if(task_state=='08'){
		params['phase']='req_task_joint';
		text="联调测试文档详情";
	}else if(task_state=='09003'){
		params['phase']='S_DIC_SIT_TEST_FILE';
		text="SIT测试报告文档详情";
	}else if(task_state=='10'){
		params['phase']='req_uat_file';
		text="UAT测试文档详情";
	}
	
	var taskCall = getMillisecond();
	 baseAjaxJsonp(dev_construction+"GTaskPhased/queryTaskPhasedById.asp?SID="+SID+"&call="+taskCall, params , function(data) {
		if (data != undefined && data != null && data.result=="true") {
			viewPhaseTaskDetail(task_state,data.data[0],text);
		}
	},taskCall);
}

//测试缺陷中的数字自动计算
function autoCalculateBug() {
	var adefect_num = parseInt(getCurrentPageObj().find("[name='A.ADEFECT_NUM']").val());
	var adefect_passnum = parseInt(getCurrentPageObj().find("[name='A.ADEFECT_PASSNUM']").val());
	var bdefect_num = parseInt(getCurrentPageObj().find("[name='A.BDEFECT_NUM']").val());
	var bdefect_passnum = parseInt(getCurrentPageObj().find("[name='A.BDEFECT_PASSNUM']").val());
	var cdefect_num = parseInt(getCurrentPageObj().find("[name='A.CDEFECT_NUM']").val());
	var cdefect_passnum = parseInt(getCurrentPageObj().find("[name='A.CDEFECT_PASSNUM']").val());
	var ddefect_num = parseInt(getCurrentPageObj().find("[name='A.DDEFECT_NUM']").val());
	var ddefect_passnum = parseInt(getCurrentPageObj().find("[name='A.DDEFECT_PASSNUM']").val());
	/*var edefect_num = parseInt(getCurrentPageObj().find("[name='A.EDEFECT_NUM']").val());
	var edefect_passnum = parseInt(getCurrentPageObj().find("[name='A.EDEFECT_PASSNUM']").val());*/
	/*if(adefect_num>=0 && bdefect_num>=0 && cdefect_num>=0 && ddefect_num>=0 && edefect_num>=0) {
		getCurrentPageObj().find("[name='A.ALLDEFECT_NUM']").val(parseInt(adefect_num)
				+parseInt(bdefect_num)+parseInt(cdefect_num)+parseInt(ddefect_num)+parseInt(edefect_num));
	} else {
		getCurrentPageObj().find("[name='A.ALLDEFECT_NUM']").val("");
	}
	if(adefect_passnum>=0 && bdefect_passnum>=0 && cdefect_passnum>=0 && ddefect_passnum>=0 && edefect_passnum>=0) {
		getCurrentPageObj().find("[name='allpass']").val(parseInt(adefect_passnum)
				+parseInt(bdefect_passnum)+parseInt(cdefect_passnum)+parseInt(ddefect_passnum)+parseInt(edefect_passnum));
	} else {
		getCurrentPageObj().find("[name='allpass']").val("");
	}
	if(adefect_num>=0 && bdefect_num>=0 && cdefect_num>=0 && ddefect_num>=0 && edefect_num>=0 && adefect_passnum>=0 && bdefect_passnum>=0 && cdefect_passnum>=0 && ddefect_passnum>=0 && edefect_passnum>=0) {
		getCurrentPageObj().find("[name='A.ALLLEFTDEFECT_NUM']").val(parseInt(adefect_num-adefect_passnum)+parseInt(bdefect_num-bdefect_passnum)
				+parseInt(cdefect_num-cdefect_passnum)+parseInt(ddefect_num-ddefect_passnum)+parseInt(edefect_num-edefect_passnum));
	} else {
		getCurrentPageObj().find("[name='A.ALLLEFTDEFECT_NUM']").val("");
	}*/
	if(adefect_num>=0 && bdefect_num>=0 && cdefect_num>=0 && ddefect_num>=0) {
		getCurrentPageObj().find("[name='A.ALLDEFECT_NUM']").val(parseInt(adefect_num)
				+parseInt(bdefect_num)+parseInt(cdefect_num)+parseInt(ddefect_num));
	} else {
		getCurrentPageObj().find("[name='A.ALLDEFECT_NUM']").val("");
	}
	if(adefect_passnum>=0 && bdefect_passnum>=0 && cdefect_passnum>=0 && ddefect_passnum>=0) {
		getCurrentPageObj().find("[name='allpass']").val(parseInt(adefect_passnum)
				+parseInt(bdefect_passnum)+parseInt(cdefect_passnum)+parseInt(ddefect_passnum));
	} else {
		getCurrentPageObj().find("[name='allpass']").val("");
	}
	if(adefect_num>=0 && bdefect_num>=0 && cdefect_num>=0 && ddefect_num>=0 &&  adefect_passnum>=0 && bdefect_passnum>=0 && cdefect_passnum>=0 && ddefect_passnum>=0) {
		getCurrentPageObj().find("[name='A.ALLLEFTDEFECT_NUM']").val(parseInt(adefect_num-adefect_passnum)+parseInt(bdefect_num-bdefect_passnum)
				+parseInt(cdefect_num-cdefect_passnum)+parseInt(ddefect_num-ddefect_passnum));
	} else {
		getCurrentPageObj().find("[name='A.ALLLEFTDEFECT_NUM']").val("");
	}
}