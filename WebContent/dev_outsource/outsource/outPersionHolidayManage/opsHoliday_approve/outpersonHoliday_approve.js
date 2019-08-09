/**
 * 初始化页面
 */
function initOpsHolidayApprovePage(item){
	var currTab = getCurrentPageObj();
	var calls = getMillisecond();
	if(item.LEAVE_STATE=="05"){//销假审批中
		currTab.find(".clear_daytr").show();//显示隐藏的销假内容
	}
	//根据请假单id初始化页面
	baseAjaxJsonp(dev_outsource+"opsHoliday/queryOneHolidayApplyInfo.asp?SID="+SID+"&call="+calls,{LEAVE_ID:item.LEAVE_ID},function(data){
		if(data!=null&&data!=undefined&&data.result=="true"){
			var outPerson = data["outPersonInfoMap"];
			for(var p in outPerson){
				var elem=currTab.find("#"+p);
				if(elem.length>0){
					if(elem[0].nodeName=="INPUT"){
						currTab.find("#"+p).val((outPerson[p]||""));
					}else{
						currTab.find("#"+p).text((outPerson[p]||""));
					}
				}
			}
			currTab.find("#LEAVE_STATE").val(item.LEAVE_STATE);	//当前状态隐藏进入页面，用于审批通过逻辑处理
			initHolidayDetailList(item);//根据请假单id初始化请假日期详情列表
			getFtpFileList(currTab.find("#holidaysAdd_filetable"), currTab.find("#holidaysAdd_fileModel"), outPerson.HOLIDAY_APPLYID, "0101");//初始化附件
			getFtpFileList(currTab.find("#holidaysCancel_filetable"), currTab.find("#holidayCancel_fileModel"), outPerson.HOLIDAYCANCEL_FILEID, "0101");//初始化附件
		}
	},calls);
}



/**
 * 根据请假单id获取请假日期详情列表
 */
function initHolidayDetailList(item){
	var leave_state = item.LEAVE_STATE;
	var clear_startdate = "";
	var clear_enddate = "";
	if(leave_state=="05"){//销假审批中
		clear_startdate = item.CLEAR_STARTDATE;
		clear_enddate = item.CLEAR_ENDDATE;
	}
	var calls = getMillisecond();
	baseAjaxJsonp(dev_outsource+"opsHoliday/queryPersonLeaveDetailList.asp?SID="+SID+"&call="+calls,
			{
		     LEAVE_ID : item.LEAVE_ID,
		     clear_startdate : clear_startdate,
		     clear_enddate : clear_enddate
		    },
	    function(data){
		  if(data!=null&&data!=undefined&&data.result=="true"){
			  getCurrentPageObj().find("#applydays_table").parent().show();//显示详情列表 
			  showWorkDaysList(data.WorkDayList,leave_state);//组装日期详情列表
		  }
	 },calls);
}

//组装日期列表
function showWorkDaysList(rowData,leave_state){
	var count=1;//行数ID后缀 
	 getCurrentPageObj().find("#applydays_table tbody").html("");//先清空已存在的行
	var space = "";
	var trHtml = "";
	for(var i=0;i<rowData.length;i++){
		if(leave_state=="05"){//销假审批中
			trHtml = 
				'<tr>' +
				  '<td><input type="text"  id="DETAIL_LEAVE_DATE'+count+'" name="DETAIL_LEAVEDATE" value="'+(rowData?(rowData[i].LEAVE_DATE==undefined?space:rowData[i].LEAVE_DATE):space)+'" readonly/></td>' +	
				  '<td><input type="text" id="DETAIL_LEAVEDAY'+count+'" name="DETAIL_LEAVEDAY" value="'+(rowData?(rowData[i].LEAVE_DAY_DISPLAY==undefined?space:rowData[i].LEAVE_DAY_DISPLAY):space)+'" readonly/></td>' +
				  '<td><input type="text" id="DETAIL_CLEARDAY'+count+'" name="DETAIL_CLEARDAY" value="'+(rowData?(rowData[i].CLEAR_DAY_DISPLAY==undefined?space:rowData[i].CLEAR_DAY_DISPLAY):space)+'" readonly/></td>' +
		        "</tr>";
		}else{
			trHtml = 
				'<tr>' +
				  '<td><input type="text" id="DETAIL_LEAVE_DATE'+count+'" name="DETAIL_LEAVEDATE" value="'+(rowData?(rowData[i].LEAVE_DATE==undefined?space:rowData[i].LEAVE_DATE):space)+'" readonly/></td>' +	
				  '<td><input type="text" id="DETAIL_LEAVEDAY'+count+'" name="DETAIL_LEAVEDAY" value="'+(rowData?(rowData[i].LEAVE_DAY_DISPLAY==undefined?space:rowData[i].LEAVE_DAY_DISPLAY):space)+'" readonly/></td>' +
		        "</tr>";	
		} 
	            getCurrentPageObj().find("#applydays_table").append(trHtml);
	            count++;
	}
}

/**
 * 请假流程的回调函数
 * @param result 审批结果：true;false
 * @param mark 审批标识：over;reject;back;
 * @param biz_id 业务ID
 * @param msg 审批提示内容
 */
getCurrentPageObj()[0].call_func = function opsHolidayApply_func(result,mark,biz_id,msg){
	
	if(mark=='over'){//审批通过
		opsHoidayApplyApproveOver(biz_id,"01"); //
	}else if(mark=='reject'){
		opsHoidayApplyApproveOver(biz_id,"02");//审批打回
	}else if(mark=='back'){
		
	}else{
		alert(msg);
	}
};

/**
 * 请假流程审批通过和打回处理逻辑
 * @param leave_id 业务ID
 * @param result 通过和打回标识（01：通过， 02：打回）
 */
function opsHoidayApplyApproveOver(leave_id,result){
	var curr_leave_state = getCurrentPageObj().find("#LEAVE_STATE").val();//当前状态
	if(result=="01"){//审批通过
		getCurrentPageObj()[0].app_call("审批通过",leave_id,"03");
	}else if(result=="02"){//审批打回
		if(curr_leave_state=="05"){//当前状态为销假审批中
		  //销假打回
		  getCurrentPageObj()[0].app_call("销假打回成功",leave_id,"06");
		}else{
		  //请假审批打回	
		  getCurrentPageObj()[0].app_call("审批打回成功",leave_id,"02");
		}
	}
}
getCurrentPageObj()[0].app_call=function(msg,leave_id,leave_state){
	var calls = getMillisecond();
	 baseAjaxJsonp(dev_outsource+"opsHoliday/updateOutPersonHolidayState.asp?SID="+SID+"&call="+calls,{LEAVE_ID:leave_id,LEAVE_STATE:leave_state},function(data){
		 if(data!=null&&data!=undefined&&data.result=="true"){
				alert(msg,function(){
					closeCurrPageTab();
				});
			}else{
				alert(msg+"，业务处理失败！");
			}
	 },calls);
};





