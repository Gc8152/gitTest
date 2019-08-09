//定义操作流程的回调函数名
 getCurrentPageObj()[0].call_func=function(result,mark,biz_id,msg){
	if(mark=='over'){//审批通过
		appPassGramOver("over");
		alert("审批通过");
	}else if(mark=='reject'){
		appPassGramOver("reject");//审批打回
	}else if(mark=='back'){
		//nahui(data.biz_id);//审批撤销
	}else{
		alert(msg);
	}
};

function appPassGramOver(state,msg){
	var call = getMillisecond()+'1';
	var param={sub_req_id:getCurrentPageObj().find("#sub_req_id").val(),state:state};
	var url = dev_construction+'UatReport/updateUATReportTaskState.asp?call='+call+'&SID='+SID;
	baseAjaxJsonp(url, param, function(data){
		//alert(msg);
	},call);
}
//初始化字典项
function initUatReportDetailDic(accept_result, verify_result, putin_result){
	initSelect(getCurrentPageObj().find("#accept_result"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_ACCEPT_RESULT"}, accept_result);
	initSelect(getCurrentPageObj().find("#verify_result"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_VERIFY_RESULT"}, verify_result);
	initSelect(getCurrentPageObj().find("#putin_result"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_PUTIN_RESULT"}, putin_result);
}
//初始化详情页面需求点的一些基本信息
function initUatReportSubReqInfo(data) {
	getCurrentPageObj().find("#sub_req_id").val(data["sub_req_id"]);
	getCurrentPageObj().find("#req_task_code").val(data["req_task_code"]);
	for(var k in data){
		if(k=="sub_req_name"||k=="req_name"||k=="system_name") {
			getCurrentPageObj().find("#"+k).text(data[k]);
		}else if(k=="req_code") {
			getCurrentPageObj().find("#"+k).text(data[k].toUpperCase());
		}else if(k=="sub_req_code"){
			getCurrentPageObj().find("#"+k).text(data[k].toUpperCase());
		}	
	}
	//初始化附件列表
	var currTab = getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题
	//点击文件上传模态框
	var tablefile = currTab.find("#table_file");
	var business_code = "";
	business_code = data['req_task_code'].toUpperCase();
	getSvnFileList(tablefile, currTab.find("#fileview_modal"), business_code, "10");
}

//初始化报告信息
function initUatReportDetail(param) {
	var call = getMillisecond()+'1';
	var url = dev_construction+'UatReport/queryOneUatReportUpdateInfo.asp?call='+call+'&SID='+SID;
	baseAjaxJsonp(url, param, function(data){
		if (data != undefined&&data!=null&&data.result=="true") {
			//详细信息
			if(data.report) {
				for(var k in data.report){
					if(k == "pass_rate") {
						getCurrentPageObj().find("#"+k).text(data.report[k]+"%");
						continue;
					}
					getCurrentPageObj().find("#"+k).text(data.report[k]);
				}
				//计算缺陷数
				getCurrentPageObj().find("#aleave").text(parseInt(data.report["adefect_num"])-parseInt(data.report["adefect_passnum"]));
				getCurrentPageObj().find("#bleave").text(parseInt(data.report["bdefect_num"])-parseInt(data.report["bdefect_passnum"]));
				getCurrentPageObj().find("#cleave").text(parseInt(data.report["cdefect_num"])-parseInt(data.report["cdefect_passnum"]));
				getCurrentPageObj().find("#dleave").text(parseInt(data.report["ddefect_num"])-parseInt(data.report["ddefect_passnum"]));
				getCurrentPageObj().find("#allpass").text(parseInt(data.report["adefect_passnum"])
						+parseInt(data.report["bdefect_passnum"])+parseInt(data.report["cdefect_passnum"])
						+parseInt(data.report["ddefect_passnum"]));
			}
		}
	}, call);
}