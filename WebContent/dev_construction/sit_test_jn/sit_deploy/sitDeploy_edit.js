function initsitDeployBtn(item){
	var currTab = getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题

	//赋值
	for (var key in item) {
		currTab.find("div[name="+key+"]").html(item[key]);
		currTab.find("select[name="+key+"]").val(item[key]).select2();;
		currTab.find("input[name="+key+"]").val(item[key]);
		currTab.find("textarea[name="+key+"]").val(item[key]);
	}
	//初始化多选下拉框
	initMultiSelect(currTab.find("div[name='TEST_TYPE_NAME']"),item.TEST_TYPE);
/*	if(item.IS_CC == '00'){
		currTab.find("#sit_flow").show();
		currTab.find("#is_svn").hide();
	}else{
		currTab.find("#sit_flow").hide();
		currTab.find("#is_svn").show();
	}*/
	/**初始化任务列表**/
	var tableSitCall = getMillisecond();
	var tablefile = currTab.find("#sitSubmitTable");
	var sit_id = item.SIT_ID;
	//附件列表显示
	tablefile.bootstrapTable('destroy').bootstrapTable({
		//请求后台的URL（*）
		url : dev_construction+'GSitAccept/queryListSitAcceptTask.asp?call='+tableSitCall+'&SID='+SID+'&sit_id='+sit_id,
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		//queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : false, //是否显示分页（*）
		pageList : [10,15],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "FILE_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:tableSitCall,
		singleSelect: true,
		onLoadSuccess:function(data){
			gaveInfo();	
		},
		columns : [ {
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
			align : "center"
		}, {
			field : "REQ_TASK_STATE_DISPLAY",
			title : "任务状态",
			align : "center"
		}, {
			field : "SYSTEM_NAME",
			title : "实施应用",
			align : "center",
		},{
			field : "P_OWNER_NAME",
			title : "任务责任人",
			align : "center",
		},{
			field : "IS_TRANSFER_NAME",
			title : "资源部署",
			align : "center",
			formatter: function (value, row, index) {
				if(value=='是'){
					return '<span style="color:red">'+value+'</span>';
				}else{
					return value;
				}
			}
		}/*,{
			field : "",
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
		}*/,{
			field : "VERSION_NAME",
			title : "纳入版本",
			align : "center",
		}, {
			field : "REQ_TASK_ID",
			title : "操作",
			align : "center",
			valign: 'middle',
			formatter: function (value, row, index) {
				return '<span class="hover-view" onclick="viewTestAddr('+row.SYSTEM_NO+')">测试地址</span>';
			}
		}]
	});
	
	// 根据需求点查找下面所有的任务的接口 
	initqueryInterface(item['SUB_REQ_ID']);
	
	/**初始化按钮开始**/	
	//保存
	
	//保存并提交
	var submit = currTab.find("#submit_sit");
	
	
	submit.click(function(){
		if(!vlidate(currTab,"",true)){
			alert("你还有必填项未填");
			return ;
		}
		initsitDeploysave(true);
	});
	//返回
	var back = currTab.find("#back_sit");
	back.click(function(){
		closeCurrPageTab();
	});
	  
	function initsitDeploysave(isCommit){
		var deploy_desc = currTab.find("textarea[name=DEPLOY_DESC]").val();
		var STATUS = currTab.find("select[name=STATUS]").val();
		if(STATUS==02&deploy_desc==""){
			alert("部署结论失败，请简要说明！");
			return;
		}
		var param = {};
		param["STATUS"]=currTab.find("select[name=STATUS]").val();
		param["TEST_URL"]=currTab.find("textarea[name=TEST_URL]").val();
		param["DEPLOY_DESC"]=currTab.find("textarea[name=DEPLOY_DESC]").val();
		param["SIT_ID"]=item.SIT_ID;
		param["IS_COMMIT"]=isCommit;
		
		var aaa=getCurrentPageObj().find("#TEST_URL").val();
	    if(aaa.length>250){
	    	alert("测试环境地址至多可输入250汉字！");
	    	return;
	    }
	    var bbb=getCurrentPageObj().find("#deploy_desc").val();
	    if(bbb.length>100){
	    	alert("简要说明至多可输入100汉字！");
	    	return;
	    }
	    
		
		/*********插入提醒参数******/
		/*var tableData = currTab.find("#sitSubmitTable").bootstrapTable('getData');
		var ids = $.map(tableData,function(row){
			return row.SUB_REQ_ID;
		}).join(",");*/
		param["sub_req_id"] = getCurrentPageObj().find("#sub_req_id").val();
		param["b_id"] = item.SIT_ID;
		param["b_code"] = item.SIT_ID;
		param["b_name"] = getCurrentPageObj().find("#SUB_REQ_NAME").text()+"（编号："+getCurrentPageObj().find("#SUB_REQ_CODE").text()+
		"）"+getCurrentPageObj().find("#TEST_COUNT_NAME").text()+"SIT部署验证不通过";
		var call = getMillisecond();
		baseAjaxJsonp(dev_construction+"GSitDeploy/saveSitDeploy.asp?call="+call+"&SID="+SID,param, function(data){
			if (data != undefined && data != null && data.result=="true" ) {
	       		alert(data.msg);
	       		closeCurrPageTab();
			}else{ 
				alert(data.msg);
			}
		}, call);
	}
	/**初始化按钮结束**/
	//点击文件上传模态框
	var tablefile2 = currTab.find("#table_file");
	var business_code = item.FILE_ID;
	getSvnFileList(tablefile2, getCurrentPageObj().find("#fileview_modal"), business_code, "09002");
}
initVlidate(getCurrentPageObj());
//查看测试地址模态框
function viewTestAddr(system_id){
	getCurrentPageObj().find("#test_addr_modal").modal("show");
	var sysCall = getMillisecond();
	getCurrentPageObj().find("tr[name='dataInfoList']").remove();
	var checked = getCurrentPageObj().find("#test_type").val();
	var checked_type = " ";
	checked_type = checked;
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