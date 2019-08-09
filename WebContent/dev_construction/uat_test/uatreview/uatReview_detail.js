//初始化子需求信息
function initSubReqInfo(param) {
	var p = param;
	var call = getMillisecond()+'1';
	var url = dev_construction+'UatReview/queryonereqsubinfo.asp?call='+call+'&SID='+SID+'&sub_req_id='+p;
	baseAjaxJsonp(url, null, function(data){
		if (data != undefined&&data!=null&&data.result=="true") {
			for(var k in data.subreq){
				if(k=="sub_req_code" || k=="req_code") {
					getCurrentPageObj().find("#"+k).text(data.subreq[k].toUpperCase());
				}else if(k=="sub_req_id") {
					getCurrentPageObj().find("#"+k).val(data.subreq[k]);										
				}else if(k=="attachment_id"){
					getCurrentPageObj().find("input[name=FILE_ID]").val(data.subreq[k].toUpperCase());
				}else{
					getCurrentPageObj().find("#"+k).text(data.subreq[k]);
				}
			}
			uploadUatReview();
		}
	},call );
}

//附件上传
function uploadUatReview() {
	var currTab = getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题
	var tablefile = currTab.find("#table_file");
	//附件上传
	
	//初始化附件列表
	getSvnFileList(tablefile, currTab.find("#file_view_modal"), currTab.find("#sub_req_code").html(), "S_DIC_UAT_TEST_REVIEW");
	
}
