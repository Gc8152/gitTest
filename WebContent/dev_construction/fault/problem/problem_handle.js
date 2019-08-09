;function initProblemHandleLayout(PROBLEM_ID,SERNO){//经办人员转交后带回来的 项目经办人+ID//流水号用于新增的拆分任务
	var currTab = getCurrentPageObj();//处理
	var form = currTab.find("#problem_basic_table");
	var form_solutionform = currTab.find("#problem_plan_solution");
	autoInitSelect(form_solutionform);//初始化下拉
	var table_task_add = currTab.find("#problem_task_addform");
	var tableLenth=0;//teble长度变量  控制序号；
	var relation22=null;//主办的任务ID
	//返回
	currTab.find("#back_problemInfo").click(function(){
		closeCurrPageTab();
	});
	//是否转交的动态隐藏
	yes_hide = currTab.find("[hid='yes_hide']");//初始化
	yes_hide.hide();
	var new_prj_handler_name = currTab.find("input[name='NEW_PRJ_HANDLER_NAME']");//另一经办人后面的  必填
	new_prj_handler_name.removeAttr("validate");
	new_prj_handler_name.parent().find("strong").remove();
	initVlidate(new_prj_handler_name);
	
	no_hide = currTab.find("[hid='no_hide']");//是否转交选择no时 
	var Transfer_yes_no = currTab.find("input[name='Transfer_yes_no']");
	Transfer_yes_no.bind('change',function(e){
		var Transfer_yes = currTab.find("#Transfer_yes");
		var Transfer_yes_no_td = currTab.find("#Transfer_yes_no_td");
		if(Transfer_yes[0].checked==true){
			Transfer_yes_no_td.html("转交另一经办人：");
			currTab.find("input[reqc=reqc]").attr("validate","v.required").attr("valititle","该项为必填项");
			
			var prj_handler_name = currTab.find("input[name='PRJ_HANDLER_NAME']");//原先的项目经理  去除  必填（应为可能为空）
			prj_handler_name.removeAttr("validate");
			prj_handler_name.parent().find("strong").remove();
			
			initVlidate(currTab);
			yes_hide.show();
			no_hide.hide();
		}else{
			new_prj_handler_name.removeAttr("validate");
			new_prj_handler_name.parent().find("strong").remove();
			
			currTab.find("input[name='PRJ_HANDLER_NAME']").attr("validate","v.required").attr("valititle","该项为必填项");
			
			initVlidate(currTab);
			yes_hide.hide();
			no_hide.show();
			Transfer_yes_no_td.html("");
		}
	});
	//转交项目经办人
	currTab.find("#problem_Transfer").click(function(){ 
		var NEW_PRJ_HANDLER_NAME = currTab.find("input[name=NEW_PRJ_HANDLER_NAME]").val();
		var NEW_PRJ_HANDLER = currTab.find("input[name=NEW_PRJ_HANDLER]").val();
		//判断必填项是否为空
		if(!vlidate($("#problem_Transfer_table"))){
			  return ;
		  }
		var call =getMillisecond()+1;
		baseAjaxJsonp(dev_construction+"Problem/problemTransfer.asp?call="+call+"&SID="+SID+"&PROBLEM_ID="+PROBLEM_ID+"&PRJ_HANDLER="+NEW_PRJ_HANDLER, null, function(data){
			if (data != undefined && data != null) {
				alert(data.msg);
				if(data.result=="true"){
					closeCurrPageTab();
				}
			}else{
				alert("转交失败！");
			}
		},call);
	});
	
	
	//退回
	currTab.find("#problem_Return").click(function(e){
		var STATUS="退回";
		var call =getMillisecond();
		var msg="是否退回该问题单申请？";
		nconfirm(msg,function(){
			 baseAjaxJsonp(dev_construction+"Problem/problemApprove.asp?call="+call+"&SID="+SID+"&PROBLEM_ID="+PROBLEM_ID+"&STATUS="+STATUS, null, function(data){
				if (data != undefined && data != null) {
					alert(data.msg);
					if(data.result=="true"){
						closeCurrPageTab();
					}
				}else{
					alert("否退失败！");
				}
			},call);
		});
	});
	
	//处理提交操作
	var save_sumit = currTab.find("#handle_save_sumit");
	save_sumit.click(function(e){
		var IS_DC_DEAL= $("input[name='IS_DC_DEAL_WHAT']:checked").val();
		var IS_SEND= $("input[name='IS_SEND_WHAT']:checked").val();
		var content = form_solutionform.serialize();
		//判断必填项是否为空
        if(!vlidate($("#problem_plan_solution"))){
			  return ;
		  }
        //判断分配的任务是否为空
        if(tableLenth<1){
        	alert("还没有分配任务!");
        	return ;
        }
		var call =getMillisecond();
		baseAjaxJsonp(dev_construction+"Problem/problemHandle.asp?call="+call+"&SID="+SID+"&"+content+"&PROBLEM_ID="+PROBLEM_ID+"&IS_DC_DEAL="+IS_DC_DEAL+"&IS_SEND="+IS_SEND, null, function(data){
			if (data != undefined && data != null) {
				alert(data.msg);
				if(data.result=="true"){
					closeCurrPageTab();
				}
			}else{
				alert("处理失败！");
			}
		},call);
	});
	
	//初始化数据信息 数据中心信息与问题单的部分信息;
	initLayout();
	function initLayout(){
		
		var call = getMillisecond();
		baseAjaxJsonp(dev_construction+"Problem/problemQueryInfo.asp?call="+call+"&SID="+SID+"&PROBLEM_ID="+PROBLEM_ID, null, function(result){
			//项目项目基本信息
			for(var i in result){
				currTab.find("span[name="+i+"]").html(result[i]);
				currTab.find("div[name="+i+"]").html(result[i]);
				currTab.find("input[name="+i+"]").val(result[i]);
				currTab.find("select[name="+i+"]").attr("value",result[i]);
				currTab.find("textarea[name="+i+"]").val(result[i]);
			}
			autoInitSelect(form_solutionform);//初始化下拉
			//返回两radio 可否数据中心处理：
			if(result.IS_DC_DEAL=="00"){
				currTab.find("#IS_DC_DEAL_OK").attr("checked","checked");
			}else{
				currTab.find("#IS_DC_DEAL_NO").attr("checked","checked");
			}
			//是否涉及投产
			if(result.IS_SEND=="00"){
				currTab.find("#IS_SEND_OK").attr("checked","checked");
			}else{
				currTab.find("#IS_SEND_NO").attr("checked","checked");
			}
			/*//如果是经办人员转交后带回来的话        需要将带回来的值覆盖进去    项目经办人+ID
			if(PRJ_HANDLER_NAME!=null&&PRJ_HANDLER!=null){
				currTab.find("#PRJ_HANDLER_NAME").val(PRJ_HANDLER_NAME);
				currTab.find("#PRJ_HANDLER").val(PRJ_HANDLER);
			}*/
			
			initMilestone(PROBLEM_ID);
		},call);
	}
	
	//分派任务____________________________________________________________分割线
	//增加一条需求任务
	
	
	
	var problem_task_add = currTab.find("#problem_task_add");
	problem_task_add.bind('click',function(e){
		//请求获所有  应用名称和ID
		var call= getMillisecond();
		baseAjaxJsonp(dev_construction+"Problem/problemApplyInfo.asp?call="+call+"&SID="+SID, { "PROBLEM_ID" : PROBLEM_ID}, function(result2){
			
		var mTable = currTab.find("#problem_handle_table");//拆分需求任务table
		var tr = "<tr name='milestoneInfoList'>" 
			+ "<td><input  name='REQ_TASK_ID' value='' req='req'  type='checkbox'></td>"
 			+ "<td><select name='REQ_TASK_RELATION_NAME' diccode='G_DIC_TASK_RELATION' reqc='" + (tableLenth + 1)+ "' validate='v.required' valititle='必填项'  ></select></td>"
 			+ "<td><select name='SYSTEM_NAME' system_no='" + (tableLenth + 1)+ "'  validate='v.required' valititle='必填项' ><option > </option> </select></td>"
 			+ "<td><input type='text' name='PLANN_PRODUCT_TIME' onClick='WdatePicker({})'  validate='v.required' valititle='必填项' readonly UNSELECTABLE ='on' /></td>"
 			+ "<td><input type='text' name='PLANN_SUBMIT_PRODUCT_TIME' onClick='WdatePicker({})'  validate='v.required' valititle='必填项' readonly UNSELECTABLE ='on' /></td>"
 			+ "<td><input type='text' name='PERSON_AMOUNT'  validate='v.float2' valititle='必填项' /></td>"
 			+ "<td><textarea name='TASK_CONTENT'  validate='v.required' valititle='必填项' ></textarea></td>"
 			+ "<td><div name='PROJECT_MAN'></div></td>"
 			+ "<td><div name='REQ_TASK_STATE_NAME'></div></td>"
			+ "<td><div name='REQ_TASK_CODE'></div></td>" +
		  "</tr>";
		mTable.append(tr);
		tableLenth++;
		
	    var reletionselsect=mTable.find("select[reqc='" + tableLenth + "']");//找到插入的从属关系td  再进行回旋赋值
	  
	    var TASK_RELATION =[{REQ_TASK_RELATION:"01",REQ_TASK_RELATION_NAME2:"主办"},{REQ_TASK_RELATION:"02",REQ_TASK_RELATION_NAME2:"协办"}];
	    initSelectByData(reletionselsect,{"value":"REQ_TASK_RELATION","text":"REQ_TASK_RELATION_NAME2"},TASK_RELATION);
	 
	    var system_noselect=mTable.find("select[system_no='" + tableLenth+ "']");
	    initSelectByData(system_noselect,{"value":"SYSTEM_ID","text":"SYSTEM_NAME"},result2.data);
	    initVlidate(mTable);//必填项事件的添加  刷新
		
		}, call);
	});
	
	
	//保存事件    获取数据进行
	var saveObj = currTab.find("#problem_task_save");
	saveObj.bind('click',function(e){
		if(!vlidate(currTab)){
			return ;
		}
		var milestoneArr = new Array();
		var sort = 1;
		currTab.find("[name='milestoneInfoList']").each(
			function() {
				//获取表单内容
				var REQ_TASK_ID = ($(this).find("[name='REQ_TASK_ID']").val()||"||");
				var REQ_TASK_RELATION_NAME = ($(this).find("[name='REQ_TASK_RELATION_NAME']").val()||"||");
				var SYSTEM_NAME = ($(this).find("[name='SYSTEM_NAME']").val()||"||");
				var PLANN_SUBMIT_PRODUCT_TIME = ($(this).find("[name='PLANN_SUBMIT_PRODUCT_TIME']").val()||"||");
				var PLANN_PRODUCT_TIME = ($(this).find("[name='PLANN_PRODUCT_TIME']").val()||"||");
				var PERSON_AMOUNT = ($(this).find("[name='PERSON_AMOUNT']").val()||"||") ;
				var TASK_CONTENT = ($(this).find("[name='TASK_CONTENT']").val()||"||") ;
				var REQ_TASK_STATE_NAME = ($(this).find("[name='REQ_TASK_STATE_NAME']").html()||"||");
				var REQ_TASK_CODE = ($(this).find("[name='REQ_TASK_CODE']").html()||"||");
				
				
				milestoneArr.push(sort + "&&" + REQ_TASK_ID+ "&&" + REQ_TASK_RELATION_NAME+ "&&" + SYSTEM_NAME + "&&" + PLANN_PRODUCT_TIME + "&&" + PLANN_SUBMIT_PRODUCT_TIME+ "&&" + PERSON_AMOUNT+ "&&" + TASK_CONTENT+ "&&" +REQ_TASK_STATE_NAME+ "&&" + REQ_TASK_CODE);
				sort++;
			});
		//保存         到数组中打包给后台
		var params = {};
		params["milestoneArr"] =milestoneArr;
		var call=getMillisecond();
		baseAjaxJsonp(dev_construction+"Problem/problemTaskAdd.asp?SID=" + SID + '&call=' + call+"&PROBLEM_ID="+PROBLEM_ID+"&SERNO="+SERNO,
				params,
				function(data){
					alert(data.msg);
					if(data != null && data.result == "true"){
						initMilestone(PROBLEM_ID);
					}
				}, call);
	});
	
	
	
	// 批量删除事件      问题单需求任务的)
	var problem_app_delete = currTab.find("#problem_app_delete");
	problem_app_delete.bind('click',function(e){
		var mTable = currTab.find("#problem_handle_table");//问题单的需求任务
	    var obj = mTable.find("input[name=REQ_TASK_ID]");
	    var check_val = [];
	    for(k in obj){
	        if(obj[k].checked==true){
	            check_val.push(obj[k].value);
	            if(obj[k].value==relation22&&tableLenth!==1){
	            	alert("删除主办前,请先删除所有协办!")
	            	return;
	            }
	        }
	    }
	    var params = {};
	    params["check_val"] =check_val;
	    var call =getMillisecond();
		var msg="是否删除此申请？";
		nconfirm(msg,function(){
			baseAjaxJsonp(dev_construction+"Problem/problemTaskDelect.asp?call="+call+"&SID="+SID, params, function(data){
				if (data != undefined && data != null) {
					alert(data.msg);
					if(data.result=="true"){
					initMilestone(PROBLEM_ID);	
					}
				}else{
					alert("删除失败！");
				}
			},call);
		});
	});
	

	
	
/*编辑页面分割线___________________________________________________________*/
	
	//初始化这个问题单的需求任务 并且状态不是 待受理的不能被编辑
	function initMilestone(PROBLEM_ID){
		var currTab = getCurrentPageObj();//当前页
		var mTable = currTab.find("#problem_handle_table");//拆分需求任务table
		mTable.find("tr").not(":eq(0)").remove();
		
		var call=getMillisecond();
		
		//第一次请求获这问题单的所有  需求任务
		baseAjaxJsonp(dev_construction + "Problem/problemTaskQueryList.asp?SID=" + SID + '&call=' + call,
				{"PROBLEM_ID" : PROBLEM_ID}, 
			function(resultMap){
				
				//第二次请求  获取应用
				baseAjaxJsonp(dev_construction+"Problem/problemApplyInfo.asp?call="+call+"&SID="+SID, { "PROBLEM_ID" : PROBLEM_ID}, function(result2){
				
					if (result2 != undefined && result2 != null) {
						
					}else{
						alert("应用获取失败！");
					}
				
					//显示第一次的数据
					var list = resultMap.task;
					if(resultMap.result=="true"){
						if (list != undefined && list != null) {
							for ( tableLenth = 0; tableLenth < list.length; tableLenth++) {//接受后台数据  字段有点多.
							 var map = list[tableLenth];
							 var REQ_TASK_ID = map.REQ_TASK_ID;//每行数据的标记  任务ID
							 var REQ_TASK_RELATION_NAME = map.REQ_TASK_RELATION_NAME;
							 var REQ_TASK_RELATION = map.REQ_TASK_RELATION;//从属关系 01 02
							 if(REQ_TASK_RELATION=="01"){
								 relation22=REQ_TASK_ID;//将主办的任务ID赋值给全局
							 }
							 var SYSTEM_NAME = map.SYSTEM_NAME;
							 var SYSTEM_NO = map.SYSTEM_NO;//公司编号，通过第二次请求获取所有
							 var PLANN_PRODUCT_TIME = map.PLANN_PRODUCT_TIME;
							 if(PLANN_PRODUCT_TIME==undefined){//如果保存的时候没有存值，数据库将不会返回值  则会出现undefined
								 PLANN_PRODUCT_TIME="";//转换为""不然会以undefined显示 达不到要求
							 }
							 var PLANN_SUBMIT_PRODUCT_TIME = map.PLANN_SUBMIT_PRODUCT_TIME;
							 if(PLANN_SUBMIT_PRODUCT_TIME==undefined){//如果保存的时候没有存值，数据库将不会返回值  则会出现undefined
								 PLANN_SUBMIT_PRODUCT_TIME="";//转换为""不然会以undefined显示 达不到要求
							 }
							 var PERSON_AMOUNT = map.PERSON_AMOUNT;
							 if(PERSON_AMOUNT==undefined){//如果保存的时候没有存值，数据库将不会返回值  则会出现undefined
								 PERSON_AMOUNT="";//转换为""不然会以undefined显示 达不到要求
							 }
							 var TASK_CONTENT = map.TASK_CONTENT;
							 if(TASK_CONTENT==undefined){//如果保存的时候没有存值，数据库将不会返回值  则会出现undefined
								 TASK_CONTENT="";//转换为""不然会以undefined显示 达不到要求
							 }
							 var PROJECT_MAN = map.PROJECT_MAN;
							 var REQ_TASK_STATE_NAME = map.REQ_TASK_STATE_NAME;//状态名称如果不是 带受理 全部readonly UNSELECTABLE ='on'
							 var REQ_TASK_CODE = map.REQ_TASK_CODE;
							 if(REQ_TASK_STATE_NAME!=="待受理"){//状态不是待受理 将不能被编辑
							 var tr = "<tr name='milestoneInfoList'>" 
								+ "<td><input  name='REQ_TASK_ID' req='req' disabled='disabled' relation='" + REQ_TASK_RELATION+ "' value='" + REQ_TASK_ID+ "' type='checkbox'></td>"
					 			+ "<td><select name='REQ_TASK_RELATION_NAME' disabled='disabled' diccode='G_DIC_TASK_RELATION' reqc='" + (tableLenth + 1)+ "' validate='v.required' valititle='必填项'  ></select></td>"
					 			+ "<td><select name='SYSTEM_NAME' disabled='disabled' system_no='" + (tableLenth + 1)+ "' validate='v.required' valititle='必填项' ><option value='" + SYSTEM_NO+ "'> " + SYSTEM_NAME+ "</option> </select></td>"
					 			+ "<td><input type='text' name='PLANN_PRODUCT_TIME'  readonly UNSELECTABLE ='on'  validate='v.required' valititle='必填项' value='" + PLANN_PRODUCT_TIME+ "'/></td>"
					 			+ "<td><input type='text' name='PLANN_SUBMIT_PRODUCT_TIME'  readonly UNSELECTABLE ='on'  validate='v.required' valititle='必填项' value='" + PLANN_SUBMIT_PRODUCT_TIME+ "'/></td>"
					 			+ "<td><input type='text' name='PERSON_AMOUNT' readonly UNSELECTABLE ='on'  validate='v.float2' valititle='必填项' value='" + PERSON_AMOUNT+ "'/></td>"
					 			+ "<td><textarea  name='TASK_CONTENT' readonly UNSELECTABLE ='on'  validate='v.required' valititle='必填项' >"+TASK_CONTENT+"</textarea></td>"
					 			+ "<td><div name='PROJECT_MAN' readonly UNSELECTABLE ='on'>" + PROJECT_MAN+ "</div></td>"
					 			+ "<td><div name='REQ_TASK_STATE_NAME' readonly UNSELECTABLE ='on'>" + REQ_TASK_STATE_NAME+ "</div></td>"
								+ "<td><div name='REQ_TASK_CODE' readonly UNSELECTABLE ='on'>" + REQ_TASK_CODE + "</div></td>" +
							  "</tr>";
							 }else{
							 var tr = "<tr name='milestoneInfoList'>" 
								+ "<td><input  name='REQ_TASK_ID' req='req' relation='" + REQ_TASK_RELATION+ "' value='" + REQ_TASK_ID+ "' type='checkbox'></td>"
					 			+ "<td><select name='REQ_TASK_RELATION_NAME' diccode='G_DIC_TASK_RELATION' reqc='" + (tableLenth + 1)+ "' validate='v.required' valititle='必填项'  ></select></td>"
					 			+ "<td><select name='SYSTEM_NAME' system_no='" + (tableLenth + 1)+ "' validate='v.required' valititle='必填项' ><option value='" + SYSTEM_NO+ "'> " + SYSTEM_NAME+ "</option> </select></td>"
					 			+ "<td><input type='text' name='PLANN_PRODUCT_TIME' onClick='WdatePicker({})' readonly UNSELECTABLE ='on'  validate='v.required' valititle='必填项' value='" + PLANN_PRODUCT_TIME+ "'/></td>"
					 			+ "<td><input type='text' name='PLANN_SUBMIT_PRODUCT_TIME' onClick='WdatePicker({})' readonly UNSELECTABLE ='on'  validate='v.required' valititle='必填项' value='" + PLANN_SUBMIT_PRODUCT_TIME+ "'/></td>"
					 			+ "<td><input type='text' name='PERSON_AMOUNT'  validate='v.float2' valititle='必填项' value='" + PERSON_AMOUNT+ "'/></td>"
					 			+ "<td><textarea  name='TASK_CONTENT'  validate='v.required' valititle='必填项' >"+TASK_CONTENT+"</textarea></td>"
					 			+ "<td><div name='PROJECT_MAN'>" + PROJECT_MAN+ "</div></td>"
					 			+ "<td><div name='REQ_TASK_STATE_NAME'>" + REQ_TASK_STATE_NAME+ "</div></td>"
								+ "<td><div name='REQ_TASK_CODE'>" + REQ_TASK_CODE + "</div></td>" +
							  "</tr>";
							 }
							 mTable.append(tr);
							 var reletionselsect=mTable.find("select[reqc='" + (tableLenth + 1)+ "']");//找到插入的从属关系td  再进行回旋赋值
							 var TASK_RELATION =[{REQ_TASK_RELATION:"01",REQ_TASK_RELATION_NAME2:"主办"},{REQ_TASK_RELATION:"02",REQ_TASK_RELATION_NAME2:"协办"}];
							 initSelectByData(reletionselsect,{"value":"REQ_TASK_RELATION","text":"REQ_TASK_RELATION_NAME2"},TASK_RELATION,REQ_TASK_RELATION);
							 
							 var system_noselect=mTable.find("select[system_no='" + (tableLenth + 1)+ "']");//找到插入的应用td  再进行回旋赋值
							 initSelectByData(system_noselect,{"value":"SYSTEM_ID","text":"SYSTEM_NAME"},result2.data,SYSTEM_NO);
							}
						}
					}else{
						alert("初始化里程碑失败!");
					}
					initVlidate(mTable);
				},call);
			}, call);
	}
	
	
	
	
	

	//重置
	var reset = currTab.find("#reset");
	reset.click(function(){
		table_task_add[0].reset();
		currTab.find("select").select2();
	});
	
	
	
	
	
	/**处理人模态框开始**/
	//点击打开模态框
	var acceptCall = getMillisecond();
	var APPROVE_OWNER = currTab.find("input[name=NEW_PRJ_HANDLER_NAME]");
	APPROVE_OWNER.click(function(){
		openRoleUserPop("problemHandle_man_pop",{no:getCurrentPageObj().find("input[name=NEW_PRJ_HANDLER]"),name:getCurrentPageObj().find('#NEW_PRJ_HANDLER_NAME')},"0015");
		//openUserPop("problemHandle_man_pop",{name:$(this),no:currTab.find("input[name=NEW_PRJ_HANDLER]")});
	});
	
}
