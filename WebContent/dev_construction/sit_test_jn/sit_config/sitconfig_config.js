var initConfig_call = getMillisecond();

function initsitConfigInfoBtn(item){
	initVlidate(getCurrentPageObj());
	var currTab = getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题
	var initConfigPageCall = getMillisecond()+"1";
	baseAjaxJsonp(dev_construction+"GSitSubmit/queryOneSitSubmit.asp?call="+initConfigPageCall+"&SID="+SID+"&sit_id="+item.SIT_ID, null ,function(data){
		if (data != undefined && data != null && data.result=="true" ) {
			//赋值
			var items = data.data;
			for (var key in items) {
				currTab.find("div[name="+key+"]").html(items[key]);
				currTab.find("input[name="+key+"]").val(items[key]);
				currTab.find("select[name="+key+"]").val(items[key]);
				currTab.find("textarea[name="+key+"]").val(items[key]);
			}
			//初始化多选下拉框
			initMultiSelect(currTab.find("div[name='TEST_TYPE_NAME']"),item.TEST_TYPE);
			//初始化文件列表
			getSvnFileList(currTab.find("#table_file"), getCurrentPageObj().find("#fileview_modal"), items.FILE_ID, "09002");
		}
	}, initConfigPageCall);
	currTab.find("div[name='CONFIG_TIME']").html(getCurrentYMDHMS());
	currTab.find("div[name='CONFIG_MAN_NAME']").html($("#currentLoginName").val());
	currTab.find("tr[name='describe']").hide();
	
	//配置结论切换操作
	currTab.find('input:radio[name="CONFIGSTATUS"]').click(function(){
		var configstatus = $(this).val();
		if(configstatus=='01'){
			currTab.find("tr[name='conifgInfo']").hide();
			currTab.find("#submit_save").hide();
			currTab.find("tr[name='describe']").show();
			currTab.find('#sit_base_desc+strong').hide();
			currTab.find('#sit_base_desc').removeAttr("validate");
			currTab.find('#acceot_describe+strong').show();
			currTab.find('#acceot_describe').attr("validate","v.required");
			initVlidate(currTab.find("tr[name='describe']"));
		}else{
			currTab.find("tr[name='describe']").hide();
			currTab.find("tr[name='conifgInfo']").show();
			currTab.find("#submit_save").show();
			currTab.find('#sit_base_desc+strong').show();
			currTab.find('#sit_base_desc').attr("validate","v.required");
			currTab.find('#acceot_describe+strong').hide();
			currTab.find('#acceot_describe').removeAttr("validate");
		}
	});

	//保存
	var save = currTab.find("#submit_save");
	save.click(function(){
		initsaveOnly();
	});
	//保存并提交
	var submit = currTab.find("#submit_sit");
	submit.click(function(){
		if(!vlidate(currTab,"",true)){
			alert("你还有必填项未填");
			return ;
		}
		initsave();
	});
	//返回
	var back = currTab.find("#back_sit");
	back.click(function(){
		closeCurrPageTab();
	});
	 
	/**初始化任务列表**/
	var tableSitCall = getMillisecond();
	var tablefile = currTab.find("#sitSubmitTable");
	var sit_id = item.SIT_ID;
	//任务列表显示
	tablefile.bootstrapTable('destroy').bootstrapTable({
		//请求后台的URL（*）
		url : dev_construction+'GSitSubmit/queryListSitSubmitTask.asp?call='+tableSitCall+'&SID='+SID+'&sit_id='+sit_id,
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
			var system_info = "";
			for(var k=0;k<data.rows.length;k++){
				system_info = system_info+data.rows[k].SYSTEM_NAME+":"+"\r\n"; 
			}
			if(item["SIT_BASE_DESC"]==null || item["SIT_BASE_DESC"]=="" || item["SIT_BASE_DESC"]==undefined){
				currTab.find("textarea[name=SIT_BASE_DESC]").val(system_info);
			}
		},
		columns : [{
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
			width : 90
		}, {
			field : "REQ_TASK_STATE_DISPLAY",
			title : "任务状态",
			align : "center",
			width : 90
		}, {
			field : "SYSTEM_NO",
			title : "应用编号",
			align : "center",
			width : 90
		}, {
			field : "SYSTEM_NAME",
			title : "实施应用",
			align : "center",
			width : 120
		},{
			field : "P_OWNER_NAME",
			title : "任务责任人",
			align : "center",
			width : 90
		},{
			field : "IS_TRANSFER_NAME",
			title : "资源部署",
			align : "center",
			width : 90,
			formatter: function (value, row, index) {
				if(value=='是'){
					return '<span style="color:red">'+value+'</span>';
				}else{
					return value;
				}
			}
		}, {
			field : "VERSION_NAME",
			title : "纳入版本",
			align : "center",
			width : 120
		}, {
			field : "REQ_TASK_ID",
			title : "操作",
			align : "center",
			valign: 'middle',
			width : 90,
			formatter: function (value, row, index) {
				return '<span class="hover-view" onclick="viewTestAddr('+row.SYSTEM_NO+')">测试地址</span>';
			}
		}]
	});
	
	//执行提交逻辑
	function initsave(){
		var param = {};
		var status = currTab.find('input:radio[name="CONFIGSTATUS"]:checked').val();
		param["CONFIGSTATUS"] = status;
		if(status=='00'){//接受
			var sit_base_desc = currTab.find("#sit_base_desc").val();
		    if(escape(encodeURIComponent(sit_base_desc)).length>3000){
		    	alert("测试基线信息至多可输入3000字节长度！");
		    	return;
		    }
		    param["SIT_BASE_DESC"] = sit_base_desc;
			param["ACCEOT_DESCRIBE"] = "";
			param["b_name"] = "";
		}else if(status=='01'){//拒绝
			var acceot_describe = currTab.find("#acceot_describe").val();
		    if(escape(encodeURIComponent(acceot_describe)).length>3000){
		    	alert("处理原因至多可输入3000字节长度！");
		    	return;
		    }
		    param["ACCEOT_DESCRIBE"] = acceot_describe;
			param["SIT_BASE_DESC"] = "";
			param["b_name"] = currTab.find("#SUB_REQ_NAME").text()+"（编号："+currTab.find("#SUB_REQ_CODE").text()+
			"）"+currTab.find("#TEST_COUNT_NAME").text()+"SIT配置打回";
		}
		 param["SIT_ID"] = item.SIT_ID; 
		 param["b_id"] = item.SIT_ID;
		 param["b_code"] = item.SIT_ID;
		 param["remind_type"] = "PUB2017261";
		baseAjaxJsonp(dev_construction+"GSitSubmit/saveSitConfigInfo.asp?call="+initConfig_call+"&SID="+SID,param, function(data){
			if (data != undefined && data != null && data.result=="true" ) {
	       		alert(data.msg);
	       		closeCurrPageTab();
			}else{ 
				alert(data.msg);
			}
		}, initConfig_call);
	}
	
	//执行保存逻辑
	function initsaveOnly(){
		var param = {};
		var selectInfo = currTab.find("#table_info");
		
		var sit_base_desc=getCurrentPageObj().find("#sit_base_desc").val();
	    if(escape(encodeURIComponent(sit_base_desc)).length>3000){
	    	alert("测试基线信息至多可输入3000字节长度！");
	    	return;
	    }
		
		var textareas = selectInfo.find("textarea");
		for (var i = 0; i < textareas.length; i++) {
			var obj = $(textareas[i]);
			param[obj.attr("name")] = $.trim(obj.val());
		}
		param["SIT_ID"] = item.SIT_ID; 
		baseAjaxJsonp(dev_construction+"GSitSubmit/saveSitConfig.asp?call="+initConfig_call+"&SID="+SID,param, function(data){
			if (data != undefined && data != null && data.result=="true" ) {
	       		alert(data.msg);
	       		closeCurrPageTab();
			}else{ 
				alert(data.msg);
			}
		}, initConfig_call);
	}
	
}

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


