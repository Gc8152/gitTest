/**
 * 初始化页面
 */
function initOpsHolidayCancelPage(item,type){
	var currTab = getCurrentPageObj();
	var calls = getMillisecond();
	initVlidate(currTab);
	if("update"==type){//修改
		//根据请假单id初始化页面
		 baseAjaxJsonp(dev_outsource+"opsHoliday/queryOneHolidayApplyInfo.asp?SID="+SID+"&call="+calls,{LEAVE_ID:item.LEAVE_ID},function(data){
			  if(data!=null&&data!=undefined&&data.result=="true"){
				  var outPerson = data["outPersonInfoMap"];
				  currTab.find("#HOLIDAYAPPLY_NAME").val(outPerson.OP_NAME+"的请假单（"+outPerson.LEAVE_STARTDATE+"至"+outPerson.LEAVE_ENDDATE+"）");
				  for(var p in outPerson){
					currTab.find("#"+p).val(outPerson[p]);	
				  }
				  chekStartDateEndDate(item.LEAVE_ID);//根据请假单id初始化请假日期详情列表
//				  getCurrentPageObj().find("#CLEAR_DAYS").val(data.workdaysnum)
				  initOpsHolidayCancelFile();//初始化附件
			  }
		   },calls);
		 currTab.find("#OPT_TYPE").val("update");
	}else{
		initOpsHolidayCancelFile();//初始化附件
		currTab.find("#OPT_TYPE").val("add");
	}
 /**
  * 外包人员请假信息按钮操作
  */
  initOutPersonHolidayAddBtn();
  function initOutPersonHolidayAddBtn(){
	 
	 //保存
	 var obj=currTab.find("#opsHolidayCancel_save");
	 obj.unbind().click(function(){
		 if(vlidate(currTab,"",false)){
			 var clear_days=currTab.find("#CLEAR_DAYS").val();
			 if(clear_days<=0){
				 alert("销假天数不能为0!");
				 return;
			 }
			 var params = {};
			 var param = getCelHolidayDatailTable();//获取请假日期详情列表的值
			 params["detail_leave_id"] = param.detail_leave_id;
			 params["detail_clear_day"] = param.detail_clear_day;
			 params["LEAVE_ID"] = currTab.find("#LEAVE_ID").val();
			 params["OP_PHONE"] = currTab.find("#OP_PHONE").val();
			 params["CLEAR_DAYS"] = clear_days;
			 params["LEAVE_DESC"] = currTab.find("#LEAVE_DESC").val();
			 params["CEL_FILE_ID"] = currTab.find("#HOLIDAYCANCEL_FILEID").val();
			 var calls = getMillisecond();
			 baseAjaxJsonp(dev_outsource+"opsHoliday/opsCelHolidayAdd0rSubmit.asp?SID="+SID+"&call="+calls,params,function(data){
				if(data!=null&&data!=undefined&&data.result=="true"){
					alert("保存成功！",function(){
						closeCurrPageTab();
					});
					
				}else{
					alert("保存失败！");
				}
			},calls);
		 }
	 });
	 
	 //提交
	 var obj_submit = currTab.find("#opsHolidayCancel_submit");
	 obj_submit.unbind().click(function(){
	    if(vlidate(currTab,"",false)){
	    	var clear_days=currTab.find("#CLEAR_DAYS").val();
	    	if(clear_days<=0){
	    		alert("销假天数不能为0!");
	    		return;
	    	}
		   var item = {};
		   item["af_id"] = '183';//流程id
		   item["systemFlag"] = '04'; //systemFlag：系统标识（合同系统：00，项目系统：01，报销系统：02，工程管理：03, 外包管理系统：04）
		   item["biz_id"] = currTab.find("#LEAVE_ID").val();//业务id
		   item["group_manager_project"] = currTab.find("#OP_OFFICE").val();//人员所属项目组的项目组长
		   item["r_outsourcing"] = "10101706";//开发分中心的外包管理岗
		   item["core_manager"] = "10101706";//开发分中心的负责人
		   item["user_id"] =SID//销假人
	       //调用发起流程的函数
	       approvalProcess(item,function(data){
			  var params = {};
			  var param = getCelHolidayDatailTable();//获取请假日期详情列表的值
			  params["detail_leave_id"] = param.detail_leave_id;
			  params["detail_clear_day"] = param.detail_clear_day;
			  params["LEAVE_ID"] = currTab.find("#LEAVE_ID").val();
			  params["OP_PHONE"] = currTab.find("#OP_PHONE").val();
	          params["CLEAR_DAYS"] = currTab.find("#CLEAR_DAYS").val();
			  params["LEAVE_DESC"] = currTab.find("#LEAVE_DESC").val();
			  params["CEL_FILE_ID"] = currTab.find("#HOLIDAYCANCEL_FILEID").val();
			  params["OPT_TYPE"] = currTab.find("#OPT_TYPE").val()+"AndSubmit";
			  var calls = getMillisecond();
			 baseAjaxJsonp(dev_outsource+"opsHoliday/opsCelHolidayAdd0rSubmit.asp?SID="+SID+"&call="+calls,params,function(data){
				 if(data!=null&&data!=undefined&&data.result=="true"){
						alert("提交成功！",function(){
							closeCurrPageTab();
						});
						
					}else{
						alert("提交失败！");
					}
			},calls);
	     });
	    }
	 });
	 
	 //查询当前登录人的请假单信息
	 currTab.find("#HOLIDAYAPPLY_NAME").click(function(){
		 openHolidayApplyPop("holidayApply_pop",{
			 HOLIDAYAPPLY_NAME : currTab.find("#HOLIDAYAPPLY_NAME"),
			 LEAVE_ID : currTab.find("#LEAVE_ID"),
			 OP_PHONE : currTab.find("#OP_PHONE"),
			 LEAVE_CATEGORY_DISPLAY : currTab.find("#LEAVE_CATEGORY_DISPLAY"),
			 OP_OFFICE_NAME : currTab.find("#OP_OFFICE_NAME"),
			 OP_OFFICE : currTab.find("#OP_OFFICE"),
			 LEAVE_STARTDATE : currTab.find("#LEAVE_STARTDATE"),
			 LEAVE_ENDDATE : currTab.find("#LEAVE_ENDDATE"),
			 LEAVE_DAYS : currTab.find("#LEAVE_DAYS")
		 },function(row){
			 chekStartDateEndDate(row["LEAVE_ID"]);
		 });
	 });
  } 
  function  chekStartDateEndDate(LEAVE_ID){
	  baseAjaxJsonpNoCall(dev_outsource+'opsHoliday/queryPersonLeaveDetailList.asp',{LEAVE_ID :LEAVE_ID},
		  	function(data){
			  if(data!=undefined&&data!=null&&data.result=="true"){
						  getCurrentPageObj().find("#canceldays_table").parent().show();//显示详情列表 
						  showCelWorkDaysList(data.WorkDayList,"add");//组装请假详情日期列表
//						  getCurrentPageObj().find("#CLEAR_DAYS").val(data.workdaysnum);//回显实际销假天数
			  }
		 });
  }
   /**
    * 初始化附件上传
    */
  function initOpsHolidayCancelFile(){	 
	//附件上传
	 var tablefile = currTab.find("#holidaysCancel_filetable");
	 var business_code = "";
	 business_code = currTab.find("#HOLIDAYCANCEL_FILEID").val();
	 if(business_code==""||business_code==undefined){
		 business_code = Math.uuid();
		 currTab.find("#HOLIDAYCANCEL_FILEID").val(business_code);
	 }

	 //点击打开模态框
	 var addfile = currTab.find("#cancelHolidaysAdd_file");
	 addfile.unbind().click(function(){
		 var paramObj = new Object();
		 paramObj.FILE_DIR = business_code;
	 	openFileFtpUpload(currTab.find("#holidaysCel_fileModel"), tablefile, 'GZ1063',business_code, '0101', 'P_DIC_OUTSOURCE_HOLIDAYAPPLY', false,false, paramObj);
	 });

	 //附件删除
	 var delete_file = currTab.find("#cancelHolidaysDelete_file");
	 delete_file.click(function(){
	 	delFtpFile(tablefile, business_code, "0101");
	 });
	 getFtpFileList(tablefile, currTab.find("#holidaysCel_fileModel"), business_code, "0101");
    }
}

/**
 * 获取请假日期详情列表的值
 */
function getCelHolidayDatailTable(){
	var trs = getCurrentPageObj().find("table[name='cancelworkday'] tbody tr");
	var params = {};
	var detail_leave_id = "";
	var detail_clear_day = "";
	for(var i=0;i<trs.length;i++){
		var inputs = $(trs[i]).find("input");
		var selects = $(trs[i]).find("select");
		if(i==0){
			detail_leave_id = $(inputs[1]).val()==""?"f":$(inputs[0]).val();
			detail_clear_day = $(selects[0]).val()==""?"f":$(selects[0]).val();
		}else{
			detail_leave_id = detail_leave_id + "," + $(inputs[0]).val();
			detail_clear_day = detail_clear_day + "," + $(selects[0]).val();
		}
	}
	params["detail_leave_id"] = detail_leave_id;
	params["detail_clear_day"] = detail_clear_day;
	return params;
}


var count=1;//行数ID后缀 
//组装日期列表
function showCelWorkDaysList(rowData,type){
	 getCurrentPageObj().find("#canceldays_table tbody").html("");//先清空已存在的行
	var space = "";
	for(var i=0;i<rowData.length;i++){
			var trHtml = 
				'<tr>' +
				  '<td><input type="hidden"  id="DETAIL_LEAVE_ID'+count+'" name="DETAIL_LEAVE_ID" value="'+(rowData?(rowData[i].DETAIL_LEAVE_ID==undefined?space:rowData[i].DETAIL_LEAVE_ID):space)+'" readonly/>'+
				      '<input type="text"  id="DETAIL_LEAVE_DATE'+count+'" name="DETAIL_LEAVEDATE" value="'+(rowData?(rowData[i].LEAVE_DATE==undefined?space:rowData[i].LEAVE_DATE):space)+'" readonly/></td>' +	
				  '<td><input type="text" id="DETAIL_LEAVEDAY'+count+'" name="DETAIL_LEAVEDAY" value="'+(rowData?(rowData[i].LEAVE_DAY_DISPLAY==undefined?space:rowData[i].LEAVE_DAY_DISPLAY):space)+'" readonly/></td>' +
				  '<td><select  id="DETAIL_CLEARDAY'+count+'" name="DETAIL_CLEARDAY" onchange="resetClearHoliday()"></select></td>' +
		        "</tr>";
			    getCurrentPageObj().find("#canceldays_table").append(trHtml);
			    if(rowData[i]["LEAVE_DAY"]=="01"){//如果请假单位为0.5天则当天最大销假天数过滤掉1天
			    	appendSelect(getCurrentPageObj().find("#DETAIL_CLEARDAY"+count),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_HOLIDAYS_UNIT"},(rowData[i].CLEAR_DAY||"02"),"00");
			    }else{
			    	appendSelect(getCurrentPageObj().find("#DETAIL_CLEARDAY"+count),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_HOLIDAYS_UNIT"},(rowData[i].CLEAR_DAY||"02"));
			    }
	            count++;
	}
	getCurrentPageObj().find("#CLEAR_DAYS").val(sumHoliDay);
}

/**
 * 重置销假天数
 */
function resetClearHoliday(){
    var currTab = getCurrentPageObj();
    var selects=currTab.find("[name='cancelworkday'] select option:selected");
    var holiday=0;
    for(var i=0;i<selects.length;i++){
    	holiday+=parseFloat($(selects[i]).text());
    }
	currTab.find("#CLEAR_DAYS").val(holiday);
//    var detail_leave_day = currTab.find("#DETAIL_CLEARDAY"+num).find("option:selected").text();
//    var leave_days = parseFloat(currTab.find("#CLEAR_DAYS").val());
//	if(detail_leave_day == "0.5"){
//		leave_days = leave_days-0.5;
//	}else{
//		leave_days = leave_days+0.5;
//	}
//	currTab.find("#CLEAR_DAYS").val(leave_days);
}


