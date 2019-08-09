
var currTab=getCurrentPageObj();
function initEmReqDetailLayout(ids){
	var emreqdCall=getMillisecond();
	baseAjaxJsonp(dev_construction+"requirement_input/queryEmRequirementInfoByID.asp?SID="+SID+"&req_id="+ids+"&call="+emreqdCall, null , function(data) {
		for ( var k in data) {
			var str=data[k];
			k = k.toLowerCase();//大写转换为小写
	   
			currTab.find("div[name='" + k + "']").text(str);
		
		}
		//初始化附件列表
		
		var tablefile = getCurrentPageObj().find("#emreqdetail_filetable");
		getSvnFileList(tablefile, getCurrentPageObj().find("#emreqdetail_fileview_modal"), data.REQ_CODE, "0101");
	},emreqdCall);
}
