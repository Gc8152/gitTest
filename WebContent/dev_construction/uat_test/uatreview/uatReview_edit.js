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
			//初始化附件列表
			getSvnFileList(getCurrentPageObj().find("#table_file"), getCurrentPageObj().find("#file_view_modal"), getCurrentPageObj().find("#sub_req_code").html(), "S_DIC_UAT_TEST_REVIEW");
			uploadUatReview();
		}
	},call );
}

//显示文件上传模态框
/*(function(){
	getCurrentPageObj().find("#upload").click(function(){
		getCurrentPageObj().find("#uploadModal").modal('show');
	});
})();*/

//附件上传
function uploadUatReview() {
	var currTab = getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题
	var tablefile = currTab.find("#table_file");
	//附件上传
	
	var paramObj = new Object();
	//构建文件上传路径拼接所需参数
	paramObj.member_name = "江南银行";
	paramObj.member_code = "UAT_REPORT";
	
	//点击打开上传模态框
	var addfile = currTab.find("#add_file");
	addfile.click(function(){
		var business_code = currTab.find("#sub_req_code").html();
		openFileSvnUpload(currTab.find("#file_modal"), tablefile, business_code, "S_DIC_UAT_TEST_REVIEW","S_DIC_UAT_TEST_FILE", paramObj);
	});
	
	//附件删除
	var delete_file = currTab.find("#delete_file");
	delete_file.click(function(){
		var business_code = currTab.find("#sub_req_code").html();
		delSvnFile(tablefile, business_code, "S_DIC_UAT_TEST_REVIEW", currTab.find("#file_modal"));
	});
}

//保存按钮
(function() {
	getCurrentPageObj().find("#save").click(function(){
		var file_id = getCurrentPageObj().find("input[name=FILE_ID]").val();
		var sub_req_id = getCurrentPageObj().find("#sub_req_id").val();
		var call = getMillisecond()+'2';
		var url = dev_construction+'UatReview/saveAttachment.asp?call='+call+'&SID='+SID+'&sub_req_id='+sub_req_id+'&file_id='+file_id;
		baseAjaxJsonp(url, null, function(data){
			if(data != undefined&&data!=null&&data.result=="true") {
				alert("保存成功！", function() {
					closeCurrPageTab();
				});
			} else {
				alert("保存失败！");
			}
		},call );
	});
})();