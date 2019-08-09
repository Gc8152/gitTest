//初始化UAT周报详细信息
function initWeeklyDetail(param) {
	var p = param;
	var call = getMillisecond()+'1';
	var url = dev_construction+'UatTracking/queryoneweekly.asp?call='+call+'&SID='+SID+'&id='+p;
	baseAjaxJsonp(url, null, function(data){
		if (data != undefined&&data!=null&&data.result=="true") {
			for(var k in data.weekly){
				getCurrentPageObj().find("#"+k).text(data.weekly[k]);
			}
		}
	}, call);
} 