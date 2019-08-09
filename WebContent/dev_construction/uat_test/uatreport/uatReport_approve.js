//初始化字典项
(function (){
	initSelect(getCurrentPageObj().find("[name='verify_result']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_VERIFY_RESULT"});
})();
//初始化详情页面需求点的一些基本信息
function initUatReportSubReqInfo(data) {
	getCurrentPageObj().find("#sub_req_id").val(data["sub_req_id"]);
	for(var k in data){
		if(k=="sub_req_name"||k=="req_name"||k=="system_name") {
			getCurrentPageObj().find("#"+k).text(data[k]);
		} else if(k=="req_code") {
			getCurrentPageObj().find("#"+k).text(data[k].toUpperCase());
		}	
	}
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
				getCurrentPageObj().find("#aleave").text(data.report["adefect_num"]-data.report["adefect_passnum"]);
				getCurrentPageObj().find("#bleave").text(data.report["bdefect_num"]-data.report["bdefect_passnum"]);
				getCurrentPageObj().find("#cleave").text(data.report["cdefect_num"]-data.report["cdefect_passnum"]);
				getCurrentPageObj().find("#dleave").text(data.report["ddefect_num"]-data.report["ddefect_passnum"]);
				getCurrentPageObj().find("#allpass").text(parseInt(data.report["adefect_passnum"])
						+parseInt(data.report["bdefect_passnum"])+parseInt(data.report["cdefect_passnum"])
						+parseInt(data.report["ddefect_passnum"]));
				
			}
		}
	}, call);
}

function uatReportApprove(param) {
	//提交按钮----保存审核信息
	getCurrentPageObj().find("#submit").unbind("click");
	getCurrentPageObj().find("#submit").click(function() {
		param["verify_result"] = getCurrentPageObj().find("[name='verify_result']").val();
		param["verify_suggest"] = getCurrentPageObj().find("[name='verify_suggest']").val();
		var call = getMillisecond()+'2';
		var url = dev_construction+'UatReport/uatReportApprove.asp?call='+call+'&SID='+SID;
		baseAjaxJsonp(url, param, function(data){
			if (data != undefined&&data!=null&&data.result=="true") {
				alert("提交成功！",function(){
					//getCurrentPageObj().find("#reqSubReportTable").bootstrapTable("refresh",{url:uatReportQueryUrl()});
					closeCurrPageTab();
				});
			} else {
				alert("提交失败！");
			}
		}, call);			
	});
	
};
