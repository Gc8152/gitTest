/**
 * 初始化人员考勤信息信息 
 */
function initDeOptAttendance(acc_id){
	var call = getMillisecond();
	//考勤类型
	baseAjaxJsonp(dev_outsource+"optattendance/queryOptAttendanceDetail.asp?acc_id="+acc_id+"&SID="+SID+"&call="+call,null,function(data){
		if(data){
			for(var key in data.optatt){
				getCurrentPageObj().find("#"+key.toLowerCase()+"DE").text(data.optatt[key]);
			}
			if(data.optatt["MEMO"]==null||data.optatt["MEMO"]==""){
				getCurrentPageObj().find("#memoDE").text("");
			}
			if(data.optatt["AFTW_TIME"]==null||data.optatt["AFTW_TIME"]==""){
				getCurrentPageObj().find("#aftw_timeDE").text("");
			}
			if(data.optatt["WORK_OVERHOURS"]==null||data.optatt["WORK_OVERHOURS"]==""){
				getCurrentPageObj().find("#work_overhoursDE").text("");
			}
		}
	},call);
	getCurrentPageObj().find("#acc_idDE").val(acc_id);
}
