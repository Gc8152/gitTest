/**
 * 初始化页面
 */
function initOpsHolidayaddPage(item,type){
	var currTab = getCurrentPageObj();
	var callback = getMillisecond();
	initVlidate(currTab);
	if("update"==type){//修改
		currTab[0].leave_id=item.LEAVE_ID;
		initSelect(currTab.find("#LEAVE_CATEGORY"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_STAFFLEAVE_LEAVETYPE"},item.LEAVE_CATEGORY);
		//根据请假单id初始化页面
		 baseAjaxJsonp(dev_outsource+"opsHoliday/queryOneHolidayApplyInfo.asp?SID="+SID+"&call="+callback,{LEAVE_ID:item.LEAVE_ID},function(data){
			  if(data!=null&&data!=undefined&&data.result=="true"){
				  var outPerson = data["outPersonInfoMap"];
				  for(var p in outPerson){
					currTab.find("#"+p).val(outPerson[p]);	
				  }
				  initHolidayDetailList(item.LEAVE_ID);//根据请假单id初始化请假日期详情列表
				  initOpsHolidayApplyFile();//初始化附件
			  }
		   },callback);
		 getCurrentPageObj().find("#OPT_TYPE").val("update");
	}else{//新增
	  //请假分类
	  initSelect(currTab.find("#LEAVE_CATEGORY"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_STAFFLEAVE_LEAVETYPE"});
	  //根据当前登录人初始化页面
	  baseAjaxJsonp(dev_outsource+"opsHoliday/queryOneOutPersonInfo.asp?SID="+SID+"&call="+callback,null,function(data){
		  if(data!=null&&data!=undefined&&data.result=="true"){
			  var outPerson = data["outPersonInfoMap"];
			  for(var p in outPerson){
				currTab.find("#"+p).val(outPerson[p]);	
			  }
			  getCurrentPageObj().find("#OPT_TYPE").val("add");
			  var leave_id = Math.Random19();
			  currTab.find("#LEAVE_ID").val(leave_id);//初始化页面的请假id，用于新增页面发起流程
			  initOpsHolidayApplyFile();//初始化附件
		  }
	   },callback);
   }
 /**
  * 外包人员请假信息按钮操作
  */
  initOutPersonHolidayAddBtn();
  function initOutPersonHolidayAddBtn(){
	 
	 //保存
	 var obj=currTab.find("#opsHolidayAdd_save");
	 obj.unbind().click(function(){
		 if(vlidate(currTab,"",false)){
			 var params = getOpsHolidayAddPageValue();
			 var param = getHolidayDatailTable();//获取请假日期详情列表的值
			 if(param.detail_leave_date==""){
				 alert("请先选择有效的请假日期再保存！");
				 return;
			 }
			 params["detail_leave_date"] = param.detail_leave_date;
			 params["detail_leave_day"] = param.detail_leave_day;
			 var callback = getMillisecond();
			 baseAjaxJsonp(dev_outsource+"opsHoliday/opsHolidayAdd0rSubmit.asp?SID="+SID+"&call="+callback,params,function(data){
				if(data!=null&&data!=undefined&&data.result=="true"){
					alert("保存成功！",function(){
						//$("#optCheckTable").bootstrapTable('refresh');
						closeCurrPageTab();
					});
					
				}else{
					alert("保存失败！");
				}
			},callback);
		 }
	 });
	 
	 //提交
	 var obj_submit = currTab.find("#opsHolidayAdd_submit");
	 obj_submit.unbind().click(function(){
	    if(vlidate(currTab,"",false)){
	       var param = getHolidayDatailTable();//获取请假日期详情列表的值
	       var detail_leave_dates = param.detail_leave_date;//无请假日期
	       if(detail_leave_dates==""){
	    	   alert("请先选择有效的请假日期再提交！");
	    	   return;
	       }
		   var item = {};
		   item["af_id"] = '183';//流程id
		   item["systemFlag"] = '04'; //systemFlag：系统标识（合同系统：00，项目系统：01，报销系统：02，工程管理：03, 外包管理系统：04）
		   item["biz_id"] = currTab.find("#LEAVE_ID").val();//业务id
		   item["group_manager_project"] = currTab.find("#OP_OFFICE").val();//人员所属项目组的项目组长
		   item["r_outsourcing"] = "10101706";//开发分中心的外包管理岗
		   item["core_manager"] = "10101706";//开发分中心的负责人
		   item["user_id"]=SID;//请假人
	       //调用发起流程的函数
	       approvalProcess(item,function(data){
			  var params = getOpsHolidayAddPageValue();
			  params["detail_leave_date"] = detail_leave_dates;
			  params["detail_leave_day"] = param.detail_leave_day;
			  params["OPT_TYPE"] = currTab.find("#OPT_TYPE").val()+"AndSubmit";	 
			  var callback = getMillisecond();
			 baseAjaxJsonp(dev_outsource+"opsHoliday/opsHolidayAdd0rSubmit.asp?SID="+SID+"&call="+callback,params,function(data){
				 if(data!=null&&data!=undefined&&data.result=="true"){
						alert("提交成功！",function(){
							closeCurrPageTab();
						});
						
					}else{
						alert("提交失败！");
					}
			},callback);
	     });
	    }
	 });
  } 
   /**
    * 初始化附件上传
    */
  function initOpsHolidayApplyFile(){
	//附件上传
	 var tablefile = currTab.find("#holidaysAdd_filetable");
	 var business_code = "";
	 business_code = currTab.find("#FILE_ID").val();
	 if(business_code==""||business_code==undefined){
		 business_code = Math.uuid();
		 currTab.find("#FILE_ID").val(business_code);
	 }

	 //点击打开模态框
	 var addfile = currTab.find("#holidaysAdd_file");
	 addfile.unbind().click(function(){
		 var paramObj = new Object();
		 paramObj.FILE_DIR = business_code;
	 	openFileFtpUpload(currTab.find("#holidaysAdd_fileModel"), tablefile, 'GZ1063',business_code, '0101', 'P_DIC_OUTSOURCE_HOLIDAYAPPLY', false,false, paramObj);
	 });

	 //附件删除
	 var delete_file = currTab.find("#holidaysDelete_file");
	 delete_file.click(function(){
	 	delFtpFile(tablefile, business_code, "0101");
	 });
	 getFtpFileList(tablefile, currTab.find("#holidaysAdd_fileModel"), business_code, "0101");
    }
}

/**
 * 获取请假日期详情列表的值
 */
function getHolidayDatailTable(){
	var trs = getCurrentPageObj().find("table[name='addworkday'] tbody tr");
	var params = {};
	var detail_leave_date = "";
	var detail_leave_day = "";
	for(var i=0;i<trs.length;i++){
		var inputs = $(trs[i]).find("input");
		var selects = $(trs[i]).find("select");
		if(i==0){
			detail_leave_date = $(inputs[1]).val()==""?"f":$(inputs[0]).val();
			detail_leave_day = $(selects[0]).val()==""?"f":$(selects[0]).val();
		}else{
			detail_leave_date = detail_leave_date + "," + $(inputs[0]).val();
			detail_leave_day = detail_leave_day + "," + $(selects[0]).val();
		}
	}
	params["detail_leave_date"] = detail_leave_date;
	params["detail_leave_day"] = detail_leave_day;
	return params;
}

/**
 * 获取页面的值
 */
function getOpsHolidayAddPageValue(){
	var currTab = getCurrentPageObj();
	var inputs = currTab.find("#addOpsHoliday input");
	var selects = currTab.find("#addOpsHoliday select");
	var param = {};
	for(var i=0;i<inputs.length;i++){
		if($(inputs[i]).attr("name")!=""&&$(inputs[i]).attr("name")!=undefined){
		   param[$(inputs[i]).attr("name")] = currTab.find(inputs[i]).val();
		}
	}
	for(i=0;i<selects.length;i++){
		if($(selects[i]).attr("name")!=""&&$(selects[i]).attr("name")!=undefined){
		   var val=currTab.find(selects[i]).val();
		   if("string"==typeof val){
			   param[$(selects[i]).attr("name")] = val;
		   }else if(("object"==typeof val)&&val.length&&val.length>0){
			   param[$(selects[i]).attr("name")] = val[0];
		   }
		}
	}
	param["LEAVE_DESC"] = currTab.find("#LEAVE_DESC").val();
	param["FILE_ID"] = currTab.find("#FILE_ID").val();
	return param;
}

/**
 * 时间比较且获取两日期之间的日期列表
 * @param startTimeId
 * @param endTimeId
 */
function checkTimeSupCompare_holidays(startTimeId,endTimeId){
	WdatePicker({onpicked:function(){
		var check_starttime = getCurrentPageObj().find("#"+startTimeId).val();
		var check_endtime = getCurrentPageObj().find("#"+endTimeId).val();
		if(check_starttime!=""&&check_endtime!=""){
			if(check_starttime>check_endtime){
				alert('开始时间不能大于结束时间!',function(){
					getCurrentPageObj().find("#"+startTimeId).val("");
					getCurrentPageObj().find("#"+endTimeId).val("");
				});
			}else{
				var callback = getMillisecond();
				baseAjaxJsonp(dev_outsource+'opsHoliday/queryWorkDays.asp?SID='+SID+"&call="+callback,
						{
					     start_date:check_starttime,
					     end_date:check_endtime,
					     leave_id:(getCurrentPageObj()[0].leave_id||"")
					    },function(data){
					     if(data&&data.result&&data.workdaysnum==0){
					    	alert("该时间段已经有请假信息或者系统未配置工作日和节假日！");
					     }
					     if(data!=undefined&&data!=null&&data.result=="true"){
					    	getCurrentPageObj().find("#applydays_table").parent().show();//显示详情列表 
						   showWorkDaysList(data.WorkDayList,"add");//组装请假详情日期列表
						   getCurrentPageObj().find("#LEAVE_DAYS").val(data.workdaysnum);//回显实际请假天数
					     }
				},callback);
			}
		}
	}});
	endLoading();
}

/**
 * 根据请假单id获取请假日期详情列表
 */
function initHolidayDetailList(LEAVE_ID){
	var callback = getMillisecond();
	baseAjaxJsonp(dev_outsource+"opsHoliday/queryPersonLeaveDetailList.asp?SID="+SID+"&call="+callback,{LEAVE_ID:LEAVE_ID},function(data){
		  if(data!=null&&data!=undefined&&data.result=="true"){
			  getCurrentPageObj().find("#applydays_table").parent().show();//显示详情列表 
			  showWorkDaysList(data.WorkDayList,"update");//组装日期详情列表
		  }
	   },callback);
}

var count=1;//行数ID后缀 
//组装日期列表
function showWorkDaysList(rowData,type){
	 getCurrentPageObj().find("#applydays_table tbody").html("");//先清空已存在的行
	var space = "";
	for(var i=0;i<rowData.length;i++){
		if(type=="add"){
		    var trHtml = 
			'<tr>' +
			  '<td><input type="text"  id="DETAIL_LEAVE_DATE'+count+'" name="DETAIL_LEAVEDATE" value="'+(rowData?(rowData[i].DETAIL_LEAVEDATE==undefined?space:rowData[i].DETAIL_LEAVEDATE):space)+'" readonly/></td>' +	
			  '<td><select  id="DETAIL_LEAVEDAY'+count+'" name="DETAIL_LEAVEDAY" onchange="resetLeaveHoliday('+count+')"></select></td>' +
	        "</tr>"; 
            getCurrentPageObj().find("#applydays_table").append(trHtml);
            initSelect(getCurrentPageObj().find("#DETAIL_LEAVEDAY"+count),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_HOLIDAYS_UNIT"},"","","02");
            count++;
		}else if(type=="update"){
			var trHtml = 
				'<tr>' +
				  '<td><input type="text"  id="DETAIL_LEAVE_DATE'+count+'" name="DETAIL_LEAVEDATE" value="'+(rowData?(rowData[i].LEAVE_DATE==undefined?space:rowData[i].LEAVE_DATE):space)+'" readonly/></td>' +	
				  '<td><select  id="DETAIL_LEAVEDAY'+count+'" name="DETAIL_LEAVEDAY" onchange="resetLeaveHoliday('+count+')"></select></td>' +
		        "</tr>"; 
	            getCurrentPageObj().find("#applydays_table").append(trHtml);
	            initSelect(getCurrentPageObj().find("#DETAIL_LEAVEDAY"+count),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_HOLIDAYS_UNIT"},rowData[i].LEAVE_DAY,"","02");
	            count++;
		}else{
			var trHtml = 
				'<tr>' +
				  '<td><input type="text"  id="DETAIL_LEAVE_DATE'+count+'" name="DETAIL_LEAVEDATE" value="'+(rowData?(rowData[i].LEAVE_DATE==undefined?space:rowData[i].LEAVE_DATE):space)+'" readonly/></td>' +	
				  '<td><input  id="DETAIL_LEAVEDAY'+count+'" name="DETAIL_LEAVEDAY" value="'+(rowData?(rowData[i].LEAVE_DAY_DISPLAY==undefined?space:rowData[i].LEAVE_DAY_DISPLAY):space)+'" readonly/></td>' +
		        "</tr>"; 
	            getCurrentPageObj().find("#applydays_table").append(trHtml);
	            count++;
		}
	}	
}

/**
 * 根据请假单位重置请假天数
 */
function resetLeaveHoliday(num){
    var currTab = getCurrentPageObj();
    var detail_leave_day = currTab.find("#DETAIL_LEAVEDAY"+num).find("option:selected").text();
    var leave_days = parseFloat(currTab.find("#LEAVE_DAYS").val());
	if(detail_leave_day == "0.5"){
		leave_days = leave_days-0.5;
	}else{
		leave_days = leave_days+0.5;
	}
	currTab.find("#LEAVE_DAYS").val(leave_days);
}


