/**
 * 初始化任务列表的时间戳
 */
var initSendProContent_call = getMillisecond();
var queryInterfacecall = getMillisecond()+1;

function initemsitTurnoverBtn(item){
	var currTab = getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题
	initSelect(getCurrentPageObj().find("#etest_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_SYSTEM_CONFIG_TYPE"},"",""," ");
	/*getCurrentPageObj().find("#etest_man_name").click(function(){ 
		openUserPop("esendProducePop",{name:getCurrentPageObj().find("#etest_man_name"),no:getCurrentPageObj().find("#test_man_id"),role:"0018"});
	});*/

	//版本任务
	initeSendProContent();
	//根据任务的需求点id 查询所有的接口数据
	initequeryInterfaceAdd();
	
	/**初始化按钮开始**/	
	//保存
	var save = currTab.find("#esave_sit");
	save.click(function(){
		if(!vlidate(currTab,"",true)){
			alert("你还有必填项未填");
			return ;
		}
		initesave(false);
	});
	//保存并提交
	var submit = currTab.find("#esubmit_sit");
	submit.click(function(){
		if(!vlidate(currTab,"",true)){
			alert("你还有必填项未填");
			return ;
		}
		initesave(true);
	});
	//返回
	var back = currTab.find("#eback_sit");
	back.click(function(){
		closeCurrPageTab();
	});
	  
	function initesave(isCommit){
		var param = {};
		var selectInfo = currTab.find("#table_info");
		var inputs = selectInfo.find("input");
		var textareas = selectInfo.find("textarea");
		for (var i = 0; i < inputs.length; i++) {
			var obj = $(inputs[i]);
			param[obj.attr("name")] = $.trim(obj.val());
		}
		for (var i = 0; i < textareas.length; i++) {
			var obj = $(textareas[i]);
			param[obj.attr("name")] = $.trim(obj.val());
		}
		var sendData = getCurrentPageObj().find("#table_task_info").bootstrapTable('getData');
		if(sendData.length == 0) {
			alert("没有要移交的任务！");
			return;
		}
		var fileData  = getCurrentPageObj().find("#table_file").bootstrapTable('getData');
		var fileIsRight = false;
		if(fileData!=null&& fileData.length>0){
			for(var i=0; i<fileData.length; i++){
				if(!fileIsRight){
					var fileType = fileData[i]["FILE_TYPE"];
					fileIsRight = (fileType.indexOf("02") >= 0);
				}
			}
		} 
		
		if(!fileIsRight){
			alert("请上传测试环境部署手册");
			return ;
		}
		for(var i=0;i<sendData.length;i++ ){
			var state=sendData[i].REQ_TASK_STATE;
			if(state=="00"||state=="01"||state=="02"||state=="03"){
				alert("协办未受理无法提交");
				return;
			}
		}
		var isApplyStream = currTab.find("input[name=STREAM_NAME]").val();
		var exApplyStream = currTab.find("input[name=EXAPPLYSTREAM]").val();
		var IS_CC = currTab.find("input[name=IS_CC]").val();
		if(IS_CC == '00'){
			if(isApplyStream == '' || isApplyStream == null || isApplyStream == undefined){
				alert("主线任务没有申请流！");
				return;
			}
		}
		if(exApplyStream == '00'){
			alert("协办任务未申请流！");
			return;
		}
		
		
		 var exam_version_describe=getCurrentPageObj().find("[name='EXAM_VERSION_DESCRIBE']").val();
		    if(exam_version_describe.length>50){
		    	alert("测试版本描述至多可输入50汉字！");
		    	return;
		    }
		    var addbug_describe=getCurrentPageObj().find("[name='ADDBUG_DESCRIBE']").val();
		    if(addbug_describe.length>100){
		    	alert("新增修复bug说明至多可输入100汉字！");
		    	return;
		    }
		    var version_peoblem=getCurrentPageObj().find("[name='VERSION_PEOBLEM']").val();
		    if(version_peoblem.length>50){
		    	alert("版本当前存在问题至多可输入50汉字！");
		    	return;
		    }
		    var exam_remark=getCurrentPageObj().find("[name='EXAM_REMARK']").val();
		    if(exam_remark.length>50){
		    	alert(">版本测试注意事项至多可输入50汉字！");
		    	return;
		    }
		
		var taskInfos="";
		var is_transfers="";
		taskInfo=$.map(sendData, function (row) {
			if(taskInfos==""){
				taskInfos = row.REQ_TASK_ID;
			}else{
				taskInfos = taskInfos+","+row.REQ_TASK_ID;
			}
			return row.REQ_TASK_ID;
		});
		var flag = false;
		for(var j =0;j<sendData.length;j++){
			var kkk =  currTab.find("#IS_TRANSFER"+j).val();
			if(is_transfers==""){
				is_transfers = kkk;
			}else{
				is_transfers = is_transfers+","+kkk;
			}
			if(kkk==" " || kkk=="请选择" || kkk==""){
				alert("第"+(j+1)+"条任务资源部署为空，请选择！");
				return;
			}else if(kkk=='00'){
				flag=true;
			}
		}
		/*if(!flag){
			alert("任务资源部署都为否，无需移交");
			return;
		}*/
		var test_type = "";
		getCurrentPageObj().find("#etest_type option:selected").each(function() {
        	var text= $(this).attr("value");
        	text = text.replace(/(^\s*)|(\s*$)/g, "");
        	if(text !== '' && typeof(text) !== undefined && text !== null){
        		if(test_type == ""){
        			test_type = text;
        		}else{
        			test_type += ","+text;
        		}
        	}
        });
		param["TEST_TYPE"] = test_type;
		param["REQ_TASK_IDS"] = taskInfos;
		param["IS_TRANSFERS"] = is_transfers;
		param["IS_COMMIT"]=isCommit;
		var sub_req_id = getCurrentPageObj().find("#sub_req_id").val();
		var param2 = {};
		param2["b_name"] = getCurrentPageObj().find("#SUB_REQ_NAME").val()+"（编号："+getCurrentPageObj().find("#SUB_REQ_CODE").val()+
						"）"+getCurrentPageObj().find("#TEST_COUNT_NAME").val()+"SIT测试已移交";
		var call = getMillisecond();
		param["FILE_ID"]=getCurrentPageObj().find("input[name=FILE_ID]").val();
		baseAjaxJsonp(dev_construction+"GSitSubmit/saveSitInfo.asp?call="+call+"&SID="+SID,param, function(data){
			if (data != undefined && data != null && data.result=="true" ) {
	       		alert(data.msg);
	       		/*开始插入提醒*/
	       		if(isCommit == true){
	       			var sit_id = data.sit_id;
	       			var call2 = getMillisecond()+'1';
	       			baseAjaxJsonp(dev_construction+"GSitSubmit/querySitRemindUser.asp?call="+call2+"&SID="+SID+
	       					"&sub_req_id="+sub_req_id,null, function(mes){
	       				if (mes != undefined && mes != null && mes.result=="true" ) {
	       					var sitAppCall = getMillisecond()+'2';
		       				baseAjaxJsonp(dev_workbench+"Remind/remindAdd.asp?SID="+SID+"&call="+sitAppCall+"&remind_type=PUB2017155"+
		       						"&user_id="+mes.ids+"&b_code="+sit_id+"&b_id="+sit_id,param2, function(mes){
		       					//sit测试移交插入提醒成功
		       				}, sitAppCall);
	       				}
	       			}, call2);
	       			/*插入提醒结束*/
	       		}
	       		closeCurrPageTab();
			}else{ 
				alert(data.msg);
			}
		}, call);
	}
	/**初始化按钮结束**/
	/**需求任务模态框开始**/
	var reqcode = currTab.find("input[name=REQ_TASK_NAME]");
	reqcode.unbind("click");
	reqcode.click(function(){
		getCurrentPageObj().find("#emprep_task_modal").modal("show");
		initeTaskPop();
	});
	var tableCall = getMillisecond();
	function initeTaskPop(){
		var reqInfo = currTab.find("#table_reqtaskInfo");
		
		//需求查询
		var select = currTab.find("#select_req");
		select.unbind("click");
		select.click(function(){
			var TASK_CODE = currTab.find("input[name=TASK_CODE]").val();
			var TASK_NAME = currTab.find("input[name=TASK_NAME]").val();
			reqInfo.bootstrapTable('refresh',{
				url:dev_construction+'GSitSubmit/queryListReqtaskInfo.asp?call='+tableCall+'&SID='+SID
				+'&REQ_TASK_CODE='+TASK_CODE+'&REQ_TASK_NAME=' + encodeURI(TASK_NAME)+'&task_type=00'});
		});
		enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#select_req").click();});
		//需求重置
		var reset = currTab.find("#reset_req");
		reset.click(function(){
			currTab.find("input[name=TASK_CODE]").val("");
			currTab.find("input[name=TASK_NAME]").val("");
		});
		//需求模态框列表
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset //页码
			};
			return temp;
		};	
	
		reqInfo.bootstrapTable({		
			//请求后台的URL（*）
			url:dev_construction+'GSitSubmit/queryListReqtaskInfo.asp?call='+tableCall+'&SID='+SID+'&task_type=00',
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
			jsonpCallback:tableCall,
			singleSelect: true,
			onLoadSuccess : function(data){
				gaveInfo();
			},
			onDblClickRow:function(row){
				$('#emprep_task_modal').modal('hide');
				currTab.find("input[name=REQ_TASK_ID]").val(row.REQ_TASK_ID);
				currTab.find("input[name=REQ_TASK_NAME]").val(row.REQ_TASK_NAME);
				currTab.find("input[name=REQ_TASK_CODE]").val(row.REQ_TASK_CODE);
				currTab.find("input[name=VERSIONS_ID]").val(row.VERSION_ID);
				//currTab.find("input[name=versions_name]").val(row.VERSIONS_NAME);
				currTab.find("input[name=TEST_MAN_ID]").val(row.TEST_MAN_ID);
				currTab.find("input[name=test_man_name]").val(row.TEST_MAN_NAME);
				currTab.find("input[name=SYSTEM_ID]").val(row.SYSTEM_NO);
				currTab.find("input[name=system_name]").val(row.SYSTEM_NAME);
				currTab.find("input[name=SUB_REQ_CODE]").val(row.SUB_REQ_CODE);
				currTab.find("input[name=SUB_REQ_NAME]").val(row.SUB_REQ_NAME);
				currTab.find("input[name=SUB_REQ_ID]").val(row.SUB_REQ_ID);
				currTab.find("input[name=STREAM_NAME]").val(row.STREAM_NAME);
				currTab.find("input[name=IS_CC]").val(row.IS_CC);
				currTab.find("input[name=EXAPPLYSTREAM]").val(row.EXAPPLYSTREAM);
				freshSItTaskContent('','',row.SUB_REQ_ID,row.REQ_TASK_ID);
	//			initSelectItem(row.SYSTEM_NO);
			},
			columns : [{
				field : 'REQ_TASK_ID',
				title : '任务ID',
				align : "center",
				visible : false
			},{
				field : 'REQ_TASK_CODE',
				title : '任务编号',
				width : '150',
				align : "center"
			}, {
				field : "REQ_TASK_NAME",
				title : "任务名称",
				width : '150',
				align : "center"
			}, {
				field : "REQ_TASK_TYPE",
				title : "任务来源",
				width : '100',
				align : "center"
			}, {
				field : "REQ_TASK_STATE",
				title : "任务状态",
				width : '100',
				align : "center"
			},{
				field : 'SYSTEM_NO',
				title : '应用id',
				align : "center",
				visible : false
			}, {
				field : "SYSTEM_NAME",
				title : "应用名称",
				align : "center"
			}]
		});
	}	
	/**需求任务模态框结束**/
	
	//点击文件上传模态框
	var tablefile = currTab.find("#table_file");
	var business_code = "";
	business_code = getCurrentPageObj().find("input[name=FILE_ID]").val();
	if(!business_code){
		business_code = Math.uuid();
		getCurrentPageObj().find("input[name=FILE_ID]").val(business_code);
	}
	//构建文件上传路径拼接所需参数
	var addfile = currTab.find("#eadd_file");
	addfile.click(function(){
		var paramObj = new Object();
		var sys_name = getCurrentPageObj().find("#system_name").val();
		//var ver_date = getCurrentPageObj().find("#version_push_date").val();
		var req_task_code = getCurrentPageObj().find("#REQ_TASK_CODE").val();
		if(sys_name==""||sys_name=="点击选择" || req_task_code==""){
			alert("请先选择任务");
			return ;
		} else {
			paramObj.VERSIONS_NAME = "紧急需求";
			paramObj.SYSTEM_NAME = sys_name;
			paramObj.REQ_TASK_CODE = req_task_code+"测试";
			
		}
		openFileSvnUpload(currTab.find("#file_modal"), tablefile, 'GZ1059002',business_code, '09002', 'S_DIC_SIT_DEPLOY_FILE', false, true, paramObj);
	});
	 //附件删除
	 var delete_file = getCurrentPageObj().find("#edelete_file");
	 delete_file.click(function(){
		 delSvnFile(tablefile, business_code, "09002");
	 });
	 
	 getSvnFileList(tablefile, getCurrentPageObj().find("#fileview_modal"), business_code, "09002");
	
}
initVlidate(getCurrentPageObj());




/**
 * 初始化任务列表列表
 */
function initeSendProContent() {
	var queryParams = function(params){
		var temp = {};
		temp["limit"] = params.limit;
		temp["offset"] = params.offset;
		return temp;
	};
	getCurrentPageObj().find("#table_task_info").bootstrapTable(
			{
				//'&version_id=0&system_no=0'只为初始化表头信息
				url : dev_construction+'GSitSubmit/querySysAndVerTask.asp?call='+initSendProContent_call+'&SID='+SID+'&version_id=0&system_no=0',
				method : 'get', //请求方式（*）   
				striped : false, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				pagination : false, //是否显示分页（*）
				pageList : [5,10],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 10,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "REQ_TASK_ID", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: true,
				jsonpCallback: initSendProContent_call,
				onLoadSuccess:function(data){
					gaveInfo();	
					var sit_num = data.sit_num+1;
					getCurrentPageObj().find("#TEST_COUNT_NAME").val("第"+sit_num+"轮次");
					if(data.rows){
						for(var i=0;i<data.rows.length;i++){
							initSelect(getCurrentPageObj().find("#IS_TRANSFER"+i),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_IS_DRILL"});
						}
					}
					
				},
				columns : [{
					field : 'REQ_TASK_ID',
					title : '任务序列号',
					align : "center",
					visible:false
				},{
					field : 'SUB_REQ_ID',
					title : '需求点序列号',
					align : "center",
					visible:false
				},{
					field : 'REQ_ID',
					title : '需求序列号',
					align : "center",
					visible:false
				},{
					field : 'REQ_TASK_CODE',
					title : '任务编号',
					align : "center",
					width : 150,
					formatter: function (value, row, index) {
						return  '<span class="hover-view" style="color:blue"'+
						'onclick="viewTaskDetail('+row.REQ_TASK_ID+')">'+value+'</span>';
					}
				}, {
					field : 'REQ_TASK_NAME',
					title : '任务名称',
					align : "center",
					width : 150
				},{
					field : "REQ_TASK_RELATION_NAME",
					title : "从属关系",
					align : "center",
				}, {
					field : "REQ_TASK_STATE_DISPLAY",
					title : "任务状态",
					align : "center",
				}, {
					field : "REQ_TASK_STATE",
					title : "任务状态",
					align : "center",
					visible:false
				}, {
					field : "SYSTEM_NAME",
					title : "实施应用",
					align : "center",
				}, {
					field : "IS_CC",
					title : "是否CC",
					align : "center",
					formatter: function (value, row, index) {
						if(row.IS_CC == '00'){
							return "是";
						}else{
							return "否";
						}
					}
				},{
					field : "P_OWNER_NAME",
					title : "任务责任人",
					align : "center",
				},{
					field : "IS_TRANSFER",
					title : "资源部署",
					align : "center",
					formatter: function (value, row, index) {
						return '<select id="IS_TRANSFER'+index+'" name="IS_TRANSFER'+index+'"></select>';
					}
				},{
					field : "STREAM_NAME",
					title : "流名称",
					align : "center",
					formatter: function (value, row, index) {
						if(row.IS_CC == '00'){
							var str = row.STREAM_NAME;
							return str;
						}else{
							return "--";
						}
					}
				},{
					field : "VERSION_NAME",
					title : "纳入版本",
					align : "center",
				}, {
					field : "REQ_TASK_ID",
					title : "操作",
					align : "center",
					valign: 'middle',
					formatter: function (value, row, index) {
						var str = '<span class="hover-view" onclick="viewTestAddr('+row.SYSTEM_NO+')">测试地址</span>';
						return str;
					}	
				}]
			});
}

/**
 * 根据需求点查找下面所有的任务的接口 
 */
function initequeryInterfaceAdd() {
	//var sub_req_id =24;
	var queryParams = function(params){
		var temp = {};
		temp["limit"] = params.limit;
		temp["offset"] = params.offset;
		return temp;
	};
	//getCurrentPageObj().find("#sendProContent").bootstrapTable("destory");
	getCurrentPageObj().find("#table_interface_Info").bootstrapTable(
			{
				url : dev_construction+'GSitSubmit/queryTaskInterface.asp?call='+queryInterfacecall+'&SID='+SID+'&version_id=0&system_no=0',//&sub_req_id=+sub_req_id
				method : 'get', //请求方式（*）   
				striped : false, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				pagination : false, //是否显示分页（*）
				pageList : [5,10],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 10,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "INTER_ID", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: true,
				jsonpCallback: queryInterfacecall,
				onLoadSuccess:function(data){
					/*gaveInfo();	
					var sit_num = data.sit_num+1;
					getCurrentPageObj().find("#TEST_COUNT_NAME").val("第"+sit_num+"轮次");*/
				},
				columns : [/*{
					checkbox : true,
					rowspan : 2,
					align : 'center',
					valign : 'middle'
				},*/{
					field : 'REQ_TASK_ID',
					title : '任务序列号',
					align : "center",
					visible:false
				},{
					field : 'SUB_REQ_ID',
					title : '需求点序列号',
					align : "center",
					visible:false
				},{
					field : "INTER_CODE",
					title : "接口编号",
					align : "center",
					width : "10%"
				},{
					field : "INTER_NAME",
					title : "接口名称",
					align : "center",
					width : "15%"
				},{
					field : "INTER_VERSION",
					title : "接口版本",
					align : "center",
				},{
					field : "SYSTEM_NAME",
					title : "服务方应用id",
					align : "center",
				},{
					field : "INTER_OFFICE_TYPE_NAME",
					title : "接口业务类型",
					align : "center",
				},{
					field : "APP_TYPE_NAME",
					title : "申请类型",
					align : "center",
				}, {
					field : "START_WORK_TIME",
					title : "开始执行时间",
					align : "center",
					valign: 'middle',
					width : "10%",
				}]

			});
}
//删除一行
function delSendProTask(id) {
	//删除该行
	getCurrentPageObj().find("#table_task_info").bootstrapTable("removeByUniqueId", id);	
}
/**
 * 重新选择应用或者版本后，刷新投产内容中的任务
 * @param system_id
 * @param versions_id
 */
function freshSItTaskContent(system_id, versions_id,sub_req_id,req_task_id) {
	getCurrentPageObj().find("#table_task_info").bootstrapTable("refresh",
			{url:dev_construction+'GSitSubmit/querySysAndVerTask.asp?call='+initSendProContent_call+
				'&SID='+SID+'&system_no='+system_id+'&version_id='+versions_id+'&sub_req_id='+sub_req_id+'&req_task_id='+req_task_id+'&instance_flag='+'00'});
	
	getCurrentPageObj().find("#table_interface_Info").bootstrapTable("refresh",
			{url:dev_construction+'GSitSubmit/queryTaskInterface.asp?call='+queryInterfacecall+
		'&SID='+SID+'&sub_req_id='+sub_req_id}//+'&system_no='+system_id+'&version_id='+versions_id+'&req_task_id='+req_task_id
	);
}
//查看测试地址模态框
function viewTestAddr(system_id){
	getCurrentPageObj().find("#test_addr_modal").modal("show");
	var sysCall = getMillisecond();
	getCurrentPageObj().find("tr[name='dataInfoList']").remove();
	var checked = getCurrentPageObj().find("#etest_type").val();
	var checked_type = " ";
	if(checked  != null || checked != " "){
		checked_type = checked.join(",");
	}else{
		checked_type = checked;
	}	
	var url = dev_application+'applicationManager/querySystemAddrList.asp?call='+sysCall+'&SID='+SID+'&system_id='+system_id+'&checked_type='+checked_type;
	baseAjaxJsonp(url, null, function(data){
		if (data != undefined&&data!=null&&data.result=="true") {
			for(var n = 0; n < data.rows.length; n++){
				var dataMap = data.rows[n];
				for(var m in dataMap){
					var str = dataMap[m];
					m = m.toLowerCase();
					if(m == 'attr_type'){
						var tname = str;
					}else if(m == 'config_dic_code'){
						var tvalue = str;
					}else if(m == 'config_address'){
						var taddr = str;
					}
				}
				appendAddrHtml(tname,tvalue,taddr);
			}
		} else {
			alert("无数据！");
		}
	},sysCall);
}
//增加地址信息
function appendAddrHtml(tname,tvalue,taddr){
	var tbObj = getCurrentPageObj().find("#testAddrTable");
	var tr = "<tr name='dataInfoList'>" 
				+"<td class='table-text'>"+tname+"：</td>"
				+"<td colspan='3'><input type='hidden' name='addr_type' value='"+tvalue+"'/>" 
				+"<textarea name='addr' readonly >"+taddr+"</textarea></td>"
			+"</tr>";
	tbObj.append(tr);
	
}
function initSelectItem(system_id){
	initSelect(getCurrentPageObj().find("#etest_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_SYSTEM_CONFIG_TYPE"},"",""," ");
	/*var selCall = getMillisecond();
	var url = dev_application+'applicationManager/findNoConfigAddrType.asp?call='+selCall+'&SID='+SID+'&system_id='+system_id;
	baseAjaxJsonp(url, null, function(data){
		if (data != undefined&&data!=null&&data.result=="true") {
			var cot = data.notype;
			if(cot.indexOf(",") > 0){
				var t = cot.split(",");
				t.push(" ");
				initSelect(getCurrentPageObj().find("#test_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_SYSTEM_CONFIG_TYPE"},"","",t);
			}else{
				var m = new Array();
				m.push(cot);
				m.push(" ");
				initSelect(getCurrentPageObj().find("#test_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_SYSTEM_CONFIG_TYPE"},"","",m);
			}
		} else {
			alert("无数据！");
		}
	},selCall);*/
}