/**
 * 初始化页面
 */
function initOpsHolidayaddViewPage(item){
	var currTab = getCurrentPageObj();
	var calls = getMillisecond();
	//根据请假单id初始化页面
	baseAjaxJsonp(dev_outsource+"opsHoliday/queryOneHolidayApplyInfo.asp?SID="+SID+"&call="+calls,{LEAVE_ID:item.LEAVE_ID},function(data){
		if(data!=null&&data!=undefined&&data.result=="true"){
			var outPerson = data["outPersonInfoMap"];
			for(var p in outPerson){
				var elem=currTab.find("#"+p);
				if(elem.length>0&&elem[0].nodeName=="INPUT"){
					elem.val(outPerson[p]||"");	
				}else if(elem.length>0&&elem[0].nodeName!="INPUT"){
					elem.text(outPerson[p]||"");	
				}
			}
			initHolidayDetailList(item.LEAVE_ID,item.LEAVE_STATE);//根据请假单id初始化请假日期详情列表
			getFtpFileList(currTab.find("#holidaysAdd_filetable"), currTab.find("#holidaysAdd_fileModel"), outPerson.HOLIDAY_APPLYID, "0101");//初始化附件
			if(outPerson.HOLIDAYCANCEL_FILEID){
				getFtpFileList(currTab.find("#holidaysCancel_filetable"), currTab.find("#holidayCancel_fileModel"), outPerson.HOLIDAYCANCEL_FILEID, "0101");//初始化附件
			}else{
				currTab.find(".cancelFileInfo").hide();
			}
		}
	},calls);
}



/**
 * 根据请假单id获取请假日期详情列表
 */
function initHolidayDetailList(LEAVE_ID,LEAVE_STATE){
	var calls = getMillisecond();
	baseAjaxJsonp(dev_outsource+"opsHoliday/queryPersonLeaveDetailList.asp?SID="+SID+"&call="+calls,{LEAVE_ID:LEAVE_ID},function(data){
		  if(data!=null&&data!=undefined&&data.result=="true"){
			  showWorkDaysList(data.WorkDayList,"view",LEAVE_STATE);//组装日期详情列表
		  }
	   },calls);
}

var count=1;//行数ID后缀 
//组装日期列表
function showWorkDaysList(rowData,type,leave_state){
	 getCurrentPageObj().find("#applydays_table tbody").html("");//先清空已存在的行
	var space = "";
	if(leave_state=="01"){
		getCurrentPageObj().find(".clear_daytr").hide();
	}
	for(var i=0;i<rowData.length;i++){
			var trHtml = '<tr>';
				trHtml+= '<td><input type="text"  id="DETAIL_LEAVE_DATE'+count+'" name="DETAIL_LEAVEDATE" value="'+(rowData?(rowData[i].LEAVE_DATE==undefined?space:rowData[i].LEAVE_DATE):space)+'" readonly/></td>';	
				trHtml+= '<td><input type="text" id="DETAIL_LEAVEDAY'+count+'" name="DETAIL_LEAVEDAY" value="'+(rowData?(rowData[i].LEAVE_DAY_DISPLAY==undefined?space:rowData[i].LEAVE_DAY_DISPLAY):space)+'" readonly/></td>';
				if(leave_state!="01"){
					trHtml+= '<td><input type="text" id="DETAIL_CLEARDAY'+count+'" name="DETAIL_CLEARDAY" value="'+(rowData?(rowData[i].CLEAR_DAY_DISPLAY==undefined?space:rowData[i].CLEAR_DAY_DISPLAY):space)+'" readonly/></td>';
				}
				trHtml+= "</tr>"; 
	            getCurrentPageObj().find("#applydays_table").append(trHtml);
	            count++;
	}
	
}