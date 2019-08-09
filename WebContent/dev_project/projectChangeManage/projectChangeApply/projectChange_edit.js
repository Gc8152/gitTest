function initproChangeEditBtn(item){ 
	var currTab = getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题
	var form = currTab.find("#change_add_form");
	//currTab.find("#change_version").hide();
	initLayout();//初始化页面信息
	
	//选择项目
	var project_name = currTab.find("input[name=PROJECT_NAME]");
	project_name.click(function(){
		openProPop(currTab.find("#choosePro"),{User_id:currTab.find("input[name=PRESENT_USER_ID]"),Pro_id:currTab.find("input[name=PROJECT_ID]"),
		Pro_num:currTab.find("input[name=PROJECT_NUM]"),Pro_name:currTab.find("input[name=PROJECT_NAME]"),
		Pro_status:currTab.find("input[name=STATUS]"),Pro_type:currTab.find("input[name=PROJECT_TYPE]"),
		Pro_status_name:currTab.find("input[name=STATUS_NAME]"),
		Pro_type_name:currTab.find("input[name=PROJECT_TYPE_NAME]")
		});
	});
	
	//选择变更负责人
	var respon_user = currTab.find("input[name=RESPON_USER_NAME]");
	respon_user.click(function(){
		openPmPop(currTab.find("#chooseUser"),{Zpm_id:currTab.find("input[name=RESPON_USER_ID]"),Zpm_name:currTab.find("input[name=RESPON_USER_NAME]")
		});
	});
	
	//全选与全不选
	getCurrentPageObj().find('#choseAll').click(function(){
		var flag=$(this).is(":checked");
		 getCurrentPageObj().find("input[name='taskbox']:checkbox").prop("checked",flag);

	});
	//版本下拉框选择变化
	currTab.find("#C_VERSION_ID").change(function(){
		//初始化里程碑 
		var pid = currTab.find("input[name=PROJECT_ID]").val();
		if(pid!=""){
			var version_id = currTab.find("#C_VERSION_ID").val();
			if(version_id==""){
				getCurrentPageObj().find("#plan_table_milestone").find("tr").not(":eq(0)").remove();
			}else{
				queryMilestone(pid,"00",version_id);
			}
		}
	});
	//保存按钮
	var saveChange = currTab.find("#saveChange");
	saveChange.click(function(){
		if(!vlidate(form)){
			alert("还有必填项未填");
			return ;
		}
		var pra = vlidateMilestoneInfo();
		if(!pra["flag"]){
			return ;
		}
		
		save("01",pra["milestoneArr"]);
	});
	
	//提交按钮
	var submit = currTab.find("#submit");
	submit.click(function(){
		if(!vlidate(form)){
			alert("还有必填项未填");
			return ;
		}
		var pra = vlidateMilestoneInfo();
		if(!pra["flag"]){
			return ;
		}
		var checkCall = getMillisecond()+"1";
		baseAjaxJsonp(dev_project+"proChange/queryExistChange.asp?call="+checkCall+"&SID="+SID+"&project_id="+currTab.find("input[name=PROJECT_ID]").val(),null,function(data){
			if (data != undefined && data != null) {
				if(data.result=="true"){
					if(data.exist == "yes"){
						alert("改项目存在审批中的变更，不能提交！");
					}else{
						var item = {};
						item["af_id"] = '102';//流程id
						item["systemFlag"] = '01'; //systemFlag：系统标识（合同系统：00，项目系统：01，报销系统：02，工程管理：03）
						item["biz_id"] = getCurrentPageObj().find("#CHANGE_CODE").val();//业务id
						item["m_p_config"] = $("#currentLoginNoOrg_no").val();//当前登录人的部门编号
						approvalProcess(item,function(data){
							save("02",pra["milestoneArr"]);
						});
					}
				}
			}else{
				alert("未知错误！");
			}
		},checkCall);
		/*var item = {};
		item["af_id"] = '102';//流程id
		item["systemFlag"] = '01'; //systemFlag：系统标识（合同系统：00，项目系统：01，报销系统：02，工程管理：03）
		item["biz_id"] = getCurrentPageObj().find("#CHANGE_CODE").val();//业务id
		item["m_p_config"] = $("#currentLoginNoOrg_no").val();//当前登录人的部门编号
		approvalProcess(item,function(data){
			save("02",pra["milestoneArr"]);
		});*/
		
	});
	//校验里程碑信息
	function vlidateMilestoneInfo(){
		var milestoneArr = new Array();
		var pra = {};
		var flag = true;
		var change = 0;
		$(".milestoneInfoList").each(
				function() {
					var plan_id = $(this).find("[name='RT.plan_id']").val();
					var milestone_name = $.trim($(this).find("[name='RT.milestone_name']").val());
					var before_end_time = $.trim($(this).find("[name='RT.before_end_time']").val());
					var after_end_time = $.trim($(this).find("[name='RT.after_end_time']").val());
					var is_choice = $.trim($(this).find("[name='RT.is_choice']").val());
					var diff_day = $(this).find("[name='RT.diff_day']").val();
					if(milestone_name == ""){
						alert("请填写里程碑名称！");
						flag = false;
						return false;
					}else if(before_end_time == ""){
						alert("请填写调整前日期！");
						flag = false;
						return false;
					}else if(after_end_time == ""){
						alert("请填写调整后日期！");
						flag = false;
						return false;
					}else if(is_choice == ""){
						alert("请填写是否为必选项！");
						flag = false;
						return false;
					}else if(diff_day != "0" || plan_id == "a"){
						change++;
					}
					milestoneArr.push( plan_id+ "&&" + before_end_time + "&&"
							+ after_end_time + "&&" + is_choice + "&&"+ diff_day);
				});
		if(change == "0"){
			if(flag){alert("里程碑没有被改变，不需要发起变更！");}
			flag = false;
			return false;
		}
		pra["flag"] = flag;
		pra["milestoneArr"] = milestoneArr;
		return pra;
	}
	//保存&&提交方法
	function save(state,milestoneArr){
		var param = {};
		param["APP_STATUS"]=state;
		var inputs = form.find("input");
		var selects = form.find("select");
		var textareas = form.find("textarea");
		for (var i = 0; i < inputs.length; i++) {
			var obj = $(inputs[i]);
			param[obj.attr("name")] = $.trim(obj.val());
		}
		for (var i = 0; i < selects.length; i++) {
			var obj = $(selects[i]);
			param[obj.attr("name")] = $.trim(obj.val());
		}
		for (var i = 0; i < textareas.length; i++) {
			var obj = $(textareas[i]);
			param[obj.attr("name")] = $.trim(obj.val());
		}
		var call = getMillisecond();
		param["milestoneArr"] = milestoneArr;
		baseAjaxJsonp(dev_project+"proChange/insertProChange.asp?call="+call+"&SID="+SID,param,function(data){
			if (data != undefined && data != null) {
				if(data.result=="true"){
					if(state=="01"){
						alert("保存成功");
					}else{
						alert("提交成功");
					}
					closeCurrPageTab();
				}
			}else{
				alert("未知错误！");
			}
		},call);
	}
	function initLayout(){
		//修改时的赋值
		if(item){
			for (var key in item) {
				currTab.find("input[name="+key+"]").val(item[key]);
				currTab.find("select[name="+key+"]").val(item[key]);
				currTab.find("textarea[name="+key+"]").val(item[key]);
			}
			//新建应用项目，现有应用改造项目
			if(item.PROJECT_TYPE == "SYS_DIC_NEW_PROJECT" || item.PROJECT_TYPE == "SYS_DIC_NEW_VERSION_PROJECT"){
				currTab.find("#change_version").show();
				changeVersion(item.PROJECT_ID,item.VERSION_ID);
			}else{
				currTab.find("#change_version").hide();
			}
			initSelect(currTab.find("select[name='CHANGE_REASON']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_CHANGE_REASON"},item.CHANGE_REASON);
			queryMilestone(item["CHANGE_ID"],"01","");//初始化模板里程碑
		}else{
			autoInitSelect(form);//初始化下拉
			
			var call = getMillisecond();
			baseAjaxJsonp(dev_project+"proChange/findPresentUser.asp?call="+call+"&SID="+SID, null, function(result){
				for(var i in result){
					currTab.find("input[name="+i+"]").val(result[i]);
				}
			},call);
		}
	}
}

function queryMilestone(project_id,type,version_id){
	var call=getMillisecond();
	if(type == '00'){//发起变更请求wbs里程碑信息
		baseAjaxJsonp(dev_project + "proChange/queryMilestoneByProjectId.asp?SID=" + SID + '&call=' + call,{"project_id" : project_id,"version_id":version_id},
			function(data){
					initMilestone(data,null);
				},call); 
	}else{//编辑变更请求变更记录表里程碑信息
		baseAjaxJsonp(dev_project + "proChange/queryMilestoneByChangeId.asp?SID=" + SID + '&call=' + call,{"change_id" : project_id},
				function(data){
						initMilestone(data,"update");
					},call);
	}
}
//初始化模板里程碑
var count=1;//行数ID后缀  
var delid="";//删除的ID  
function initMilestone(data,update){
	var mTable = getCurrentPageObj().find("#plan_table_milestone");//里程碑table
	if(data!=null){
		mTable.find("tr").not(":eq(0)").remove();
			var list = data.rows;
			if(data.result=="true"){
				if (list != undefined && list != null) {
					for ( var i = 0; i < list.length; i++) {
						 var map = list[i];
						 var milestone_id = map.MILESTONE_ID;
						 var milestone_name = map.PLAN_NAME== undefined ? "":map.PLAN_NAME;
						 var end_time = map.END_TIME == undefined ? "" : map.END_TIME;
						 var is_choice = map.IS_CHOICE == undefined ? "01" : map.IS_CHOICE;//'00'是,'01'否
						 var execute_status = map.EXECUTE_STATUS == undefined ? "00" : map.EXECUTE_STATUS;//'00'未完成,'01'已完成
						 //var reality_end_time = map.REALITY_END_TIME == undefined ? "" : map.REALITY_END_TIME;
						 var after_end_time;
						 var diff_day;
						 var before_end_time;
						 if(execute_status == '00' || execute_status == ""){
							 if(update == "update"){
								 after_end_time = "<td><input type='text' id='RTafter_end_time"+count+"' name='RT.after_end_time' onClick='WdatePicker({})' onchange='calculationDay("+count+")' value='" + map.AFTER_END_TIME + "'/></td>";  
								 before_end_time = '<td> <input type="text" id="RTbefore_end_time'+count+'" name="RT.before_end_time" value="' +map.BEFORE_END_TIME+'" readonly/></td>';
								 diff_day = '<td> <input type="text" id="RTdiff_day'+count+'" name="RT.diff_day" value="' + map.DIFF_DAY +'" readonly/></td>';
							 }else{
								 after_end_time = "<td><input type='text' id='RTafter_end_time"+count+"' name='RT.after_end_time' onClick='WdatePicker({})' onchange='calculationDay("+count+")' value='" + end_time + "'/></td>";  
								 before_end_time = '<td> <input type="text" id="RTbefore_end_time'+count+'" name="RT.before_end_time" value="' +end_time+'" readonly/></td>';
								 diff_day = '<td> <input type="text" id="RTdiff_day'+count+'" name="RT.diff_day" value="' +0+'" readonly/></td>';
							 }    
						 }else{
							 after_end_time = "<td><input type='text' id='RTafter_end_time"+count+"' name='RT.after_end_time' value='" + end_time + "' readonly/></td>";
							 before_end_time = '<td> <input type="text" id="RTbefore_end_time'+count+'" name="RT.before_end_time" value="' +end_time+'" readonly/></td>';
							 diff_day = '<td> <input type="text" id="RTdiff_day'+count+'" name="RT.diff_day" value="' +0+'" readonly/></td>';
						 }
						 var tr = "<tr class='milestoneInfoList'>" 
							 		+'<td align="center"><input class="form-control" id="taskcheck'+count+'" type="checkbox" name="taskbox" value="'+count+'"/>'
							 		+'<input type="hidden" id="RTplan_id'+count+'" name="RT.plan_id" value="'+map.PLAN_ID+'"></td>'
						 			+ '<td><input type="text" id="RTmilestone_name'+count+'" name="RT.milestone_name"  value="'+milestone_name+'" readonly/>' 
						 			+ '<input type="hidden" id="RTmilestone_id'+count+'" name="RT.milestone_id" value="'+milestone_id+'"></td>'
						 			+ '<td><select id="RTis_choice'+count+'" name="RT.is_choice" disabled></select> </td>' 
									+ before_end_time
									+ after_end_time
									+ diff_day
									+ '<td><select id="RTexecute_status'+count+'" name="RT.execute_status" disabled></select> </td>' 
									+"</tr>";
						 mTable.append(tr);
						 initSelect(getCurrentPageObj().find("#RTis_choice"+count),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"T_DIC_YN"},is_choice);
						 initSelect(getCurrentPageObj().find("#RTexecute_status"+count),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_EXECUTE_STATUS"},execute_status);
						 count++;
					 }
				}
			}else{
				alert("初始化里程碑失败!");
			}
		}else{//新增里程碑
			var tr = "<tr class='milestoneInfoList'>" 
		 		+'<td align="center"><input class="form-control" id="taskcheck'+count+'" type="checkbox" name="taskbox" value="'+count+'"/>'
		 		+'<input type="hidden" id="RTplan_id'+count+'" name="RT.plan_id" value="a"></td>'
	 			+ '<td><input type="text" id="RTmilestone_name'+count+'" name="RT.milestone_name"/>' 
	 			+ '<input type="hidden" id="RTmilestone_id'+count+'" name="RT.milestone_id" value="b"></td>'
	 			+ '<td><select id="RTis_choice'+count+'" name="RT.is_choice"></select> </td>'  
				+ '<td> <input type="text" id="RTbefore_end_time'+count+'" name="RT.before_end_time" onClick="WdatePicker({})" onchange="calculationDay('+count+')"/></td>'
				+ '<td><input type="text" id="RTafter_end_time'+count+'" name="RT.after_end_time" onClick="WdatePicker({})" onchange="calculationDay('+count+')"/>'
				+ '<td> <input type="text" id="RTdiff_day'+count+'" name="RT.diff_day" value="' +0+'" readonly/></td>'
				+ '<td><select id="RTexecute_status'+count+'" name="RT.execute_status" disabled></select> </td>' 
				+"</tr>";
			mTable.append(tr);
			initSelect(getCurrentPageObj().find("#RTis_choice"+count),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"T_DIC_YN"},"01");
			initSelect(getCurrentPageObj().find("#RTexecute_status"+count),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_EXECUTE_STATUS"},"00");
			count++;
		}
}
//新增里程碑
getCurrentPageObj().find('#milepost_Add').click(function(){
	initMilestone(null,null);
});
//删除选中的里程碑
getCurrentPageObj().find('#milepost_Delete').click(function(){
	var checkeds=getCurrentPageObj().find("input:checkbox[name^='taskbox']:checked");
	if(checkeds.length==0){
		alert("请至少选择一条数据");
		return;
	}
	var chobj= getCurrentPageObj().find("input[name='taskbox']:checkbox");
	if(chobj.length!=0){
	    chobj.each(function(){  
	        if($(this).is(":checked")){
	           delid = $(this).val();
	           var plan_id = getCurrentPageObj().find('#RTplan_id'+delid).val();
	           var project_type= getCurrentPageObj().find("#PROJECT_TYPE").val();
	           var is_choice = getCurrentPageObj().find('#RTis_choice'+delid).val();
	           var execute_status = getCurrentPageObj().find('#RTexecute_status'+delid).val();
	           	   if(project_type == "SYS_DIC_VERSION_PROJECT" && plan_id != "a"){
	           		   alert("版本类项目初始化的里程碑不可删除！");
	           		 return false;
	           	   }
	        	   if(is_choice=="00"){
	        		   alert("该里程碑必选，不可删除");
	        		   return false;
	        	   }
	        	   if(execute_status=='01'){
	        	     alert("该里程碑已完成，不能删除");
	        	     return false;
	        	   }
	               $(this).parent().parent().remove();
	        } 
	     });
		}else{
			alert("并无表格数据,无法删除");
		}
  });
function changeVersion(project_id,id){
	var SelectVersCall=getMillisecond();
	var VersArr=new Array();
	baseAjaxJsonp(dev_project+'proChange/queryProjectVers.asp?project_id='+ project_id + "&SID=" + SID + "&call=" +SelectVersCall,null,function(data) {
  		if (data != undefined&&data!=null) {
  			//得到后台数据
  			var r= data.queryProjectVersSelect;
  			if(r != null && r.length > 0) {
      			for(var j = 0;j<r.length; j++) {
      				var value1 = r[j].VERSIONS_NAME;
      				var value2 = r[j].VERSIONS_ID;
      				var arr={"value":value2,"html":value1};
      				VersArr.push(arr);         				
      			}
      			//每次加载清楚上次统计的数据（放在循环外）
      			getCurrentPageObj().find("option[name='ProjectVers']").remove();
      			for(var i = 0;i<VersArr.length; i++) {
      				appendSelectVers("C_VERSION_ID",VersArr[i],id);
      			}
      			getCurrentPageObj().find("#C_VERSION_ID").select2();
      		}  			  			  			
  			
  		}       		
  	},SelectVersCall);
}
function appendSelectVers(Select,vers,id){
  	var Obj = getCurrentPageObj().find("#"+Select);
  	var option="";
  	if(vers.value == id && id != undefined){
  		option = "<option name='ProjectVers' value="+vers.value+" selected>"+vers.html+"</option>";
  	}else{
  	    option = "<option name='ProjectVers' value="+vers.value+">"+vers.html+"</option>";
  	}
  	Obj.append(option);
  	
 }
//计算两日期差
function daysBetween(sDate1,sDate2){
    var time1 = Date.parse(new Date(sDate1));
    var time2 = Date.parse(new Date(sDate2));
    var nDays = Math.abs(parseInt((time2 - time1)/1000/3600/24));
    return  nDays;
};

/**有开始时间，结束时间计算工期（天）*/
function calculationDay(count) {
	var start =  getCurrentPageObj().find('#RTbefore_end_time'+count).val();
	var end = getCurrentPageObj().find('#RTafter_end_time'+count).val();
	var time1 = (new Date(start.replace(/-/g,"/"))).getTime();
    var time2 = (new Date(end.replace(/-/g,"/"))).getTime();
    var nDays = parseInt((time2 - time1)/1000/3600/24);
    getCurrentPageObj().find('#RTdiff_day'+count).val(nDays);
	/*var start_time_date = new Date(start.replace(/-/g,"/"));
	var end_time_date = new Date(end.replace(/-/g,"/"));
	var call = getMillisecond();
	var url = dev_planwork + 'Wbs/calculationDay.asp?SID=' + SID
			+ "&call=" + call;
	baseAjaxJsonp(url, {
		start_time : start_time_date<end_time_date?start:end,
		end_time : end_time_date>start_time_date?end:start
	}, function(msg) {
		if (msg.result == "true") {
			var plan_work_day = msg.plan_work_day;
			if(end_time_date<start_time_date){
				getCurrentPageObj().find('#RTdiff_day'+count).val("-"+(plan_work_day-1));
			}else{
				getCurrentPageObj().find('#RTdiff_day'+count).val(plan_work_day-1);
			}
			
		} else {
			alert("系统异常，请稍后！");
		}
	}, call,false);*/
}
initVlidate(getCurrentPageObj());