
var currTab=getCurrentPageObj();
function initEmReqDetailLayout(ids){
	var emreqdetailCall=getMillisecond();
	baseAjaxJsonp(dev_construction+"requirement_input/queryEmRequirementInfoByID.asp?SID="+SID+"&req_id="+ids+"&call="+emreqdetailCall, null , function(data) {
		for ( var k in data) {
			var str=data[k];
			k = k.toLowerCase();//大写转换为小写
	   
			currTab.find("div[name='" + k + "']").text(str);
		
		}
		//初始化附件列表
		
		var tablefile = getCurrentPageObj().find("#reqemdetail_filetable");
		
		getSvnFileList(tablefile, getCurrentPageObj().find("#reqemdetail_fileview_modal"), data.FILE_ID, "0101");
	},emreqdetailCall);
}
