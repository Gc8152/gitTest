
//发起评审级别
function sponsorJury(req_task_state,jury_grade,id,title){
	 var records2 = getCurrentPageObj().find('#'+id).bootstrapTable('getSelections');
	 if(records2.length!=1){
			alert("请选择一条数据发起");
			return;
		}
	 var system_id = records2[0].SYSTEM_NO;
	 var system_name = records2[0].SYSTEM_NAME;
	 if(req_task_state=='03'){
		 var join_noaccept = records2[0].JOIN_NOACCEPT;
		 if(join_noaccept>0){
			 var sub_req_id=records2[0].SUB_REQ_ID;
			 openTaskNotAccept("jointask_pop",sub_req_id);
			 alert("此需求点还有协办任务未受理");
			 return;
		 }
	 }
	 var records=null;
	 baseAjaxJsonp(dev_construction+"GTaskPhased/queryTaskByReqId.asp?SID="+SID+"&req_task_id="+records2[0]["REQ_TASK_ID"]+"&phased_state="+req_task_state, null , function(data) {
		 if (data != undefined && data != null && data.result=="true") {
			 records=data.rows;
		 }
		 if(records==null||records==undefined||records==""){
				alert("请选择一条数据！");					
				return;
			}
			var flag = false;
			var text="";
			//var system_id = $.map(records, function (row) {return row.SYSTEM_NO;});
			//var version_id = $.map(records, function (row) {return row.VERSION_ID;});
			var task_no = $.map(records, function (row) {
				/*if(system_id[0]!=row.SYSTEM_NO){
					text='请选择同一应用发起评审';
					flag=true;
					return false;
				}
				if(req_task_state!='03'){
					if(version_id[0]!=row.VERSION_ID){
						text='请选择同一应用同一版本发起评审';
						flag=true;
						return false;
					}
				}*/
				var jury_phased = records2[0]["JURY_PHASED"];
				var audit_conclusion = records2[0]["AUDIT_CONCLUSION"];
				if('01'==jury_grade){
					if(!(jury_phased==undefined||jury_phased=='03')){//只能选择未评审，且为一级评审不通过的
						text='请选择未发起或一级评审不通过的任务';
						flag=true;
						return false;
					}
				}else if('02'==jury_grade){//可以选择未评审，且一级评审通过，二级评审不通过的
					if(!(jury_phased==undefined||jury_phased=='02'||jury_phased=='06')){
						text='请选择未评审或一级评审通过或二级评审不通过任务';
						flag=true;
						return false;
					}
					if(audit_conclusion=="03"||audit_conclusion==undefined){//产品审计结论为不通过
						if(req_task_state=="03"){
						  text = "需求分析说明书审计没有通过，不能发起二级评审";
						}else if(req_task_state=="05"){
						  text = "设计开发说明书审计没有通过，不能发起二级评审";
						}else{
						  text = "SIT测试案例审计没有通过，不能发起二级评审";
						}
						flag = true;
						return false;
					}
				}else if('03'==jury_grade){//可以选择未评审，一级评审通过，二级评审通过的，却三级不通过的
					if(!(jury_phased==undefined||jury_phased=='02'||jury_phased=='05'||jury_phased=='09')){
						text='请选择未评审或一，二级评审通过或三级评审不通过任务';
						flag=true;
						return false;
					}
				}
			});
			if(flag) {
				alert(text);
				return;
			}
			closeAndOpenInnerPageTab("edit_jury",title,"dev_construction/jury/conductPR/juryInfo/preparePR.html",function(){
				getCurrentPageObj().find('#req_task_state').val(req_task_state);
				getCurrentPageObj().find("#jury_sava_type").val("jury_add");
				initSelect(getCurrentPageObj().find("#at_jury_grade"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_JURY_GRADE"},jury_grade);
				var task_no = $.map(records, function (row) {
					var REQ_TASK_NAME = row.REQ_TASK_NAME;
					var REQ_TASK_RELATION_NAME = row.REQ_TASK_RELATION_NAME;
					var SYSTEM_NAME = row.SYSTEM_NAME;
					if(REQ_TASK_NAME == undefined) REQ_TASK_NAME="--";
					if(REQ_TASK_RELATION_NAME == undefined) REQ_TASK_RELATION_NAME="--";
					if(SYSTEM_NAME == undefined) SYSTEM_NAME="--";
					var trHtml="<tr id='row' align='center'><td style='text-align: center; '> <div class='form-control2' ><input name='check_task' value='"+row.REQ_TASK_ID+"' type='checkbox'/></div>"+
				    "</td><td style='text-align: center; '>"+REQ_TASK_NAME+
				    "</td><td style='text-align: center; '>"+row.REQ_TASK_CODE+
				    "</td><td style='text-align: center; '>"+row.SUB_REQ_CODE+
				    "</td><td style='text-align: center; '>"+REQ_TASK_RELATION_NAME+ 
				    "</td><td style='text-align: center; '>"+SYSTEM_NAME+
				    "</td><td style='text-align: center; '><span class='hover-view' onclick='viewJuryTaskDetail(\""+row.REQ_TASK_ID+"\",\""+row.REQ_TASK_CODE+"\",\""+req_task_state+"\");'>查看</span></td></tr>"; 
					 var flag = true;
					 var chobj= $("input[name='check_task']:checkbox"); 
				     var delid="";//删除的ID  
				     chobj.each(function(){  
						if(row.REQ_TASK_ID==$(this).val()){
							flag=false;
						}
				     });
				     if(flag){
				    	 var $tr=$("#juryTasktable tr").eq("-1"); 
						$tr.after(trHtml);  
						
				     }
					return row.REQ_TASK_ID;                  
				});
				getCurrentPageObj().find("#system_id").val(system_id);
				getCurrentPageObj().find("#system_name").val(system_name);
				getCurrentPageObj().find("#sponsor_id").val($("#currentLoginNo").val());
				getCurrentPageObj().find("#sponsor_name").val($("#currentLoginName").val());
			});
	 });
	
}

function queryTaskPhasedById(params){
	var taskCall = getMillisecond();
	 baseAjaxJsonp(dev_construction+"GTaskPhased/queryTaskPhasedById.asp?SID="+SID+"&call="+taskCall, params , function(data) {
		if (data != undefined && data != null && data.result=="true") {
			var table = getCurrentPageObj().find("#table_req_task_info");
			table.bootstrapTable({
				striped : false, // 是否显示行间隔色
				cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, // 是否启用排序
				sortOrder : "asc", // 排序方式
				uniqueId : "REQ_TASK_ID", // 每一行的唯一标识，一般为主键列
				cardView : false, // 是否显示详细视图
				detailView : false, // 是否显示父子表
				singleSelect : false,// 复选框单选
				//onAll : function("")
				/*onLoadSuccess:function(data){
					console.log("aa");
					getCurrentPageObj().find("#req_task_detail").click(function(){
						getCurrentPageObj().find("#req_task_detail_modal").modal('show');
					});
				},*/
				columns : [ {
					field : 'REQ_TASK_ID',
					title : '任务序列号',
					align : "center",
					visible:false,
				},{
					field : 'REQ_TASK_CODE',
					title : '任务编号',
					align : "center",
				}, {
					field : 'REQ_TASK_NAME',
					title : '任务名称',
					align : "center"
				}, {
					field : "REQ_TASK_RELATION_NAME",
					title : "从属关系",
					align : "center"
				}, {
					field : "REQ_TASK_STATE_DISPLAY",
					title : "任务状态",
					align : "center"
				}, /*{
					field : "FILE_VERSION",
					title : "最新文档版本号",
					align : "center",
				},*/{
					field :"aabbcc",
					title :"详情按钮",
					align :"center",
					formatter : function(value, row, index){
						return "<span id='req_task_detail' class='hover-view' index='"+index+"'>查看详情</span>";
					}
				}]
			});
			table.bootstrapTable("load",data.data);
			table.find("span[id=req_task_detail]").click(function(){
				var index = $(this).attr("index");
				var rowValue = table.bootstrapTable("getData")[index];
				var req_task_id =rowValue.REQ_TASK_ID;
				closeAndOpenInnerPageTab("req_taskDetail","任务详情页面","dev_construction/requirement/requirement_analyze/task_accept/task_detail.html",function(){
					initReqTaskDetailLayout(req_task_id);
				  });
				/*for(var k in rowValue){
					var str=rowValue[k];
					k = k.toLowerCase();//大写转换为小写
					if(k=="req_code"){
						getCurrentPageObj().find('#req_code').text(str);
					}else if(k=="sub_req_code"){
						getCurrentPageObj().find('#sub_req_code').text(str);
					}else{
						getCurrentPageObj().find("input[name='"+k+"']").val(str);
					}
				}
				getCurrentPageObj().find("#req_task_detail_modal").modal('show');*/
			});
			getCurrentPageObj().find("#req_task_id").val(params.req_task_id);
		}
	 },taskCall);
}

/**
 * @param 根据任务id查找任务的子需求点下所有的需求任务
 */
function queryTaskPhasedByIdTwo(params){
		var taskCall = getMillisecond();
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		var table = getCurrentPageObj().find("#table_req_task_info");
		table.bootstrapTable('destroy').bootstrapTable({
			//请求后台的URL（*）
		url :dev_construction+"GTaskPhased/queryTaskPhasedByIdTwo.asp?SID="+SID+"&call="+taskCall+"&req_task_id="+params["req_task_id"]+"&phase="+params["phase"]+"&phased_state="+params["phased_state"],
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [5,10,15],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "REQ_TASK_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:taskCall,
		singleSelect: true,
		
		//onAll : function("")
		/*onLoadSuccess:function(data){
			getCurrentPageObj().find("#req_task_detail").click(function(){
				getCurrentPageObj().find("#req_task_detail_modal").modal('show');
			});
		},*/
		columns : [ {
			field : 'REQ_TASK_ID',
			title : '任务序列号',
			align : "center",
			visible:false,
		},{
			field : 'REQ_TASK_CODE',
			title : '任务编号',
			align : "center",
		}, {
			field : 'REQ_TASK_NAME',
			title : '任务名称',
			align : "center"
		}, {
			field : "REQ_TASK_RELATION_NAME",
			title : "从属关系",
			align : "center"
		}, {
			field : 'SYSTEM_NAME',
			title : '应用名称',
			align : "center"
		}, {
			field : "REQ_TASK_STATE_DISPLAY",
			title : "任务状态",
			align : "center"
		},{
			field :"aabbcc",
			title :"详情按钮",
			align :"center",
			formatter : function(value, row, index){
				return '<span class="hover-view" onclick="viewTaskInfo('+row.REQ_TASK_ID+','+ index+')">查看详情</span>';
				}
		}]
	});
		/*table.bootstrapTable("load",data.data);
		table.find("span[id=req_task_detail]").click(function(){
			var index = $(this).attr("index");
			var rowValue = table.bootstrapTable("getData")[index];
			var req_task_id =rowValue.REQ_TASK_ID;
			closeAndOpenInnerPageTab("req_taskDetail","任务详情页面","dev_construction/requirement/requirement_analyze/task_accept/task_detail.html",function(){
				initReqTaskDetailLayout(req_task_id);
			  });
			for(var k in rowValue){
				var str=rowValue[k];
				k = k.toLowerCase();//大写转换为小写
				if(k=="req_code"){
					getCurrentPageObj().find('#req_code').text(str);
				}else if(k=="sub_req_code"){
					getCurrentPageObj().find('#sub_req_code').text(str);
				}else{
					getCurrentPageObj().find("input[name='"+k+"']").val(str);
				}
			}
			getCurrentPageObj().find("#req_task_detail_modal").modal('show');
		});
		getCurrentPageObj().find("#req_task_id").val(params.req_task_id);*/
	
}
/**
 * @param 任务详情查看点击事件
 * @param index
 */
function viewTaskInfo(req_task_id,index){
	var table = getCurrentPageObj().find("#table_req_task_info");
	var rowValue = table.bootstrapTable("getData")[index];
	closeAndOpenInnerPageTab("req_taskDetail","任务详情页面","dev_construction/requirement/requirement_analyze/task_accept/task_detail.html",function(){
		initReqTaskDetailLayout(req_task_id);
	  });
	for(var k in rowValue){
		var str=rowValue[k];
		k = k.toLowerCase();//大写转换为小写
		if(k=="req_code"){
			getCurrentPageObj().find('#req_code').text(str);
		}else if(k=="sub_req_code"){
			getCurrentPageObj().find('#sub_req_code').text(str);
		}else{
			getCurrentPageObj().find("input[name='"+k+"']").val(str);
		}
	}
	getCurrentPageObj().find("#req_task_detail_modal").modal('show');
}
function saveTaskPhased(params){
	 baseAjaxJsonp(dev_construction+"GTaskPhased/saveTaskPhased.asp?SID="+SID, params , function(data) {
		if (data != undefined && data != null && data.result=="true") {
			alert("保存成功");
			closeCurrPageTab();
		}else{
			alert("保存失败");
		}
     }); 
}

/**
 * 
 * @param phased_file	文件类型字典
 * @param business_code  业务编码
 */
function initFtpFileListAndObject(params, module_flag){
	var business_codes = params.req_task_code;
	var phase = params.phase;
	var path_id = params.path_id;
	//附件上传
	var currTab = getCurrentPageObj();
	tablefile = currTab.find("#table_file");
	//点击打开上传模态框
	var addfile = currTab.find("#add_file");
	addfile.click(function(){
		if(phase=='03'){
			var paramObj = new Object();
			paramObj.SYSTEM_NAME = params.SYSTEM_NAME;
			paramObj.REQ_CODE = params.req_task_code.substr(0,11);
			openFileSvnUpload(currTab.find("#file_modal"), tablefile, path_id,business_codes, phase, module_flag, false, true, paramObj);
		} else {
			openFileSvnUpload(currTab.find("#file_modal"), tablefile, path_id,business_codes, phase, module_flag, true, true);
		}
	});
	//附件删除
	var delete_file = currTab.find("#delete_file");
	delete_file.click(function(){
		delSvnFile(tablefile, business_codes, phase, currTab.find("#file_modal"));
	});
	//初始化附件列表
	getSvnFileList(tablefile,currTab.find("#file_view_modal"),business_codes, phase);
}



initPhasedBtn();

//初始化按钮
function initPhasedBtn(){
	getCurrentPageObj().find("#execute_person_name").click(function(){ 
		openUserPop("getTaskVersion",{name:getCurrentPageObj().find("#execute_person_name"),no:getCurrentPageObj().find("#execute_person")});
	});
	
	//提交并保存
	getCurrentPageObj().find('#taskPhase_save').click(function(){
		var phased_state = getCurrentPageObj().find("#phased_state").val();
		var data = getCurrentPageObj().find('#table_file').bootstrapTable("getData");
		if(data==undefined||data==""){
		  if(phased_state=="03"){
			  alert("您还没有上传需求分析文档！");
			  return;
		  }else if(phased_state=="05"){
			  alert("您还没有上传设计开发文档！");
			  return;
		  }else if(phased_state=="09001"){
			  alert("您还没有上传SIT测试案例文档！");
			  return;
		  }else{
			  alert("您还没有上传当前阶段的相关文档！");
			  return;
		  }
		}
		else if(phased_state=="03"){
			var j=0;
			for(var i=0;i<data.length;i++){
				if(data[i].MODULE_FLAG_NAME=="需求分析说明书"){
					j++;
				}
			}
			if(j==0){
				 alert("您还没有上传需求分析文档！");
				  return;
			}
		}else if(phased_state=="09001"){
			var k =0;
			for(var i=0;i<data.length;i++){
				if(data[i].MODULE_FLAG_NAME=="SIT测试案例"){
					k++;
				}
			}
			if(k==0){
				 alert("您还没有上传SIT测试案例文档！");
				  return;
			}
		}
		var params={};
	    var file_id = getCurrentPageObj().find("input[name=FILE_ID]").val();
	    var req_task_id = getCurrentPageObj().find("#req_task_id").val();
	    params["req_task_id"]=req_task_id;
	    if(phased_state=="09001"){
	    	params["phased_state"]="09";
	    }else{
	    	params["phased_state"]=phased_state;
	    }
	    params["file_id"] = file_id;
	    /******提醒参数*****/
	    params["sub_req_id"] = getCurrentPageObj().find("#sub_req_id").val();
	    params["b_id"] = req_task_id;
	    params["b_code"] = getCurrentPageObj().find("#b_code").val();
	    if(params["phased_state"] == '03'){//需求分析文档
	    	params["b_name"] = getCurrentPageObj().find("#b_name").val()+"（编号："+params["b_code"]+"）需求分析文档已上传";
	    	params["remind_type"] = "PUB2017170,PUB2017190";
	    }
	    if(params["phased_state"] == '05'){//设计开发文档
	    	params["b_name"] = getCurrentPageObj().find("#b_name").val()+"（编号："+params["b_code"]+"）设计开发文档已上传";
	    	params["remind_type"] = "PUB2017163,PUB2017190";
	    }
		if(params["phased_state"] == '09'){//测试案例文档
			params["b_name"] = getCurrentPageObj().find("#b_name").val()+"（编号："+params["b_code"]+"）测试案例文档已上传";
	    	params["remind_type"] = "PUB2017167,PUB2017190"; 	
		}
	    saveTaskPhased(params);
	});
	
	//提交并保存 联调，单元测试
	getCurrentPageObj().find('#taskPhase_save_test').click(function(){
		if(!vlidate(getCurrentPageObj().find("#testAllNum"))){
			alert("请填写相关必填项");
			return ;
		}
		var params = getPageParam("G");	
	    //var file_id = getCurrentPageObj().find("input[name=FILE_ID]").val();
	    var req_task_id = getCurrentPageObj().find("#req_task_id").val();
	    var phased_state = getCurrentPageObj().find("#phased_state").val();
	    var fileData = getCurrentPageObj().find('#table_file').bootstrapTable("getData");
	    if(fileData==null||fileData==""){
	        if(phased_state == '07'){//单元测试文档
    		  alert("请上传单元测试报告！");
    	    }
    	   if(phased_state == '08'){//联调测试文档
    		  alert("请上传联调测试报告！");
    	    }
    	   return;
	     }
	    	params["req_task_id"]=req_task_id;
	    	params["phased_state"]=phased_state;
	    	//params["file_id"] = file_id;
	    	/******提醒参数*****/
	    	params["sub_req_id"] = getCurrentPageObj().find("#sub_req_id").val();
	    	params["b_id"] = req_task_id;
	    	params["b_code"] = getCurrentPageObj().find("#b_code").val();
	    	if(phased_state == '07'){//单元测试文档
	    		params["b_name"] = getCurrentPageObj().find("#b_name").val()+"（编号："+params["b_code"]+"）单元测试文档已上传";
	    		params["remind_type"] = "PUB2017165,PUB2017190";
	    	}
	    	if(phased_state == '08'){//联调测试文档
	    		params["b_name"] = getCurrentPageObj().find("#b_name").val()+"（编号："+params["b_code"]+"）联调测试文档已上传";
	    		params["remind_type"] = "PUB2017166,PUB2017190";
	    	}
	    	saveTaskPhased(params);
	});
}	

//查看某个阶段下的文档
function phasedInfo(task_state,id){
	var records = getCurrentPageObj().find('#'+id).bootstrapTable('getSelections');
	if(records==null||records==undefined||records==""||records.length!=1){
		alert("请选择一条数据！");					
		return;
	}
    viewPhaseTaskDetail(task_state,records[0]);
}

//查看任务详情
function viewPhaseTaskDetail(task_state,records,text){
	if(text!=null && text != undefined && text){}else {text="需求任务详情";}
	closeAndOpenInnerPageTab("task_analyze_info",text,"dev_construction/requirement/reqTask_phased/reqTaskFile_info.html",function(){
		var params = {};
		params['req_task_id'] = records.REQ_TASK_ID;
		params["phased_state"]=task_state;
		var taskcode=records.REQ_MAINTASK_CODE;
		if(taskcode!=null&&taskcode!=undefined){
		  params['req_task_code']=records.REQ_MAINTASK_CODE;
		}else{
		  params['req_task_code']=records.REQ_TASK_CODE;
		}
		if(task_state=='03'){
			params['phase']='03';
			queryTaskFileById(params,"S_DIC_REQ_ANL_FILE",records);
		}else if(task_state=='05'){
			params['phase']='05';
			queryTaskFileById(params,"S_DIC_SYS_DESIGN_FILE",records);
		}else if(task_state=='06'){
			params['phase']='06';
			queryTaskFileById(params,"S_DIC_DET_DESIGN_FILE",records);
		}else if(task_state=='07'){
			params['test_type'] = '02';
			queryTestCase(params);
			params['phase']='07';
			queryTaskFileById(params,"S_DIC_UNIT_TEST_FILE",records);
		}else if(task_state=='08'){
			params['test_type'] = '01';
			queryTestCase(params);
			params['phase']='08';
			queryTaskFileById(params,"S_DIC_JOINT_TEST_FILE",records);
		}else if(task_state=='09001'){
			params['phase']='09001';
			queryTaskFileById(params,"S_DIC_SIT_CASE_FILE",records);
		}else if(task_state=='09003'){
			params['phase']='09003';
			queryTaskFileById(params,"S_DIC_SIT_TEST_FILE",records);
		}else if(task_state=='10'){
			params['phase']='10';
			queryTaskFileById(params,"S_DIC_UAT_TEST_FILE",records);
		}
		
	});
}

function queryTaskFileById(params,phased_file,rowValue){
	//closeAndOpenInnerPageTab("edit_jury","文档查看","dev_construction/requirement/reqTask_phased/reqTaskFile_info.html",function(){
	
	for(var k in rowValue){
		var str=rowValue[k];
		k = k.toLowerCase();//大写转换为小写
		getCurrentPageObj().find("#"+k).text(str);
	}
	
	initFtpFileListAndObject(params, phased_file);
}

function queryTestCase(params){
	getCurrentPageObj().find("#sitCase_fileup").show();
	var taskCall = getMillisecond();
	 baseAjaxJsonp(dev_construction+"GTaskPhased/queryTestCase.asp?SID="+SID+"&call="+taskCall, params , function(data) {
		if (data != undefined && data != null && data.result=="true") {
			var table = getCurrentPageObj().find("#tableTestCaseInfo");
			table.bootstrapTable({
				striped : false, // 是否显示行间隔色
				cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, // 是否启用排序
				sortOrder : "asc", // 排序方式
				uniqueId : "REQ_TASK_ID", // 每一行的唯一标识，一般为主键列
				cardView : false, // 是否显示详细视图
				detailView : false, // 是否显示父子表
				singleSelect : false,// 复选框单选
				columns : [ {
					field : 'TEST_NUM',
					title : '测试案例数',
					align : "center",
				},{
					field : 'TEST_PASS_NUM',
					title : '测试通过数',
					align : "center",
				}, {
					field : 'PASS_PATE',
					title : '测试通过率（%）',
					align : "center"
				}, {
					field : 'EXECUTE_PERSON_NAME',
					title : '执行人',
					align : "center"
				}, {
					field : "TEST_DESC",
					title : "测试结论",
					align : "center",
					formatter:function(value, row, index) {
						if(value == '00')
							return "通过";
						else 
							return "不通过";
					}
				}, {
					field : "CREATE_TIME",
					title : "创建时间",
					align : "center"
				}]
			});
			table.bootstrapTable("load",data.data);
		}
	 },taskCall);
}



(function(){
	initSelect(getCurrentPageObj().find("#test_desc"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_ACCEPT_RESULT"});
	
	getCurrentPageObj().find("#testNum [name^='G.']").blur(function() {
		var test_num = parseInt(getCurrentPageObj().find("[name='G.test_num']").val());
		var test_passnum = parseInt(getCurrentPageObj().find("[name='G.test_pass_num']").val());
		if(test_num>=0 && test_passnum>=0) {
			if(test_num<test_passnum){
				alert("测试通过数不能大于测试案例数");
				getCurrentPageObj().find("[name='G.test_pass_num']").val("");
				getCurrentPageObj().find("[name='G.pass_pate']").val("");
				return;
			}
			getCurrentPageObj().find("[name='G.test_unpass_num']").val(test_num-test_passnum);
			
			if(test_num==0&&test_passnum==0){
				getCurrentPageObj().find("[name='G.pass_pate']").val("100.00");
				return;
			}
			var pass_rate = test_passnum/test_num*100;
			getCurrentPageObj().find("[name='G.pass_pate']").val(pass_rate.toFixed(2));
		} else {
			getCurrentPageObj().find("[name='G.test_unpass_num']").val("");
			getCurrentPageObj().find("[name='G.pass_pate']").val("");
		}
	});
})();


function importJury(req_task_state,id,fileId){
	var records2 = getCurrentPageObj().find('#'+id).bootstrapTable('getSelections');
	
	var system_id = records2[0].SYSTEM_NO;
	var sub_req_id = records2[0].SUB_REQ_ID;
	var jury_phased = records2[0].JURY_PHASED;
	var sub_req_name = records2[0].SUB_REQ_NAME;
	var req_task_code = records2[0].REQ_TASK_CODE;
	var system_name = escape(encodeURIComponent(records2[0].SYSTEM_NAME));
	var req_code=records2[0].REQ_CODE;
	var text = getCurrentPageObj().find('#supplierfield').val();
	if(text==""){
		alert("请上传文件");
		return;
	}
//	var importCall=getMillisecond();
	startLoading();
	 $.ajaxFileUpload({
		    url:"IImport/importPhaseFile.asp?SID="+SID+"&req_task_state="+req_task_state+"&req_code="+req_code+"&req_task_code="+req_task_code+"&system_id="+system_id+"&system_name="+system_name+"&sub_req_id="+sub_req_id+"&jury_phased="+jury_phased+"&sub_req_name="+escape(encodeURIComponent(sub_req_name)),
		    type:"post",
			secureuri:false,
			fileElementId:fileId,
			data:'',
			dataType:"json",
			/*jsonp: "callback",//服务端用于接收callback调用的function名的参数  
	        jsonpCallback: importCall,//回调函数名称，需要与后台返回的json数据串前缀保持一致
	       */
			success:function (msg){
				endLoading();
				getCurrentPageObj().find("#"+fileId).val("");
				getCurrentPageObj().find("#supplierfield").val("");
				getCurrentPageObj().find("#supplier_import").modal("hide");
				if(msg&&msg.result=="true"){
					alert("导入成功",function(){
						getCurrentPageObj().find("#"+id).bootstrapTable("refresh");
					});
				}else if(msg&&msg.error_info){
					alert("导入失败:"+msg.error_info);
				}else{
					alert("导入失败！");
				}
			},
			error: function (msg){
				endLoading();
				alert("导入失败！");
				return;
			}
	   });
}
