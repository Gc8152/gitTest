//按钮方法
function initClickButtonEvent(){
	var quaryStreamCall=getMillisecond();
	initStreamApplyInfo(quaryStreamCall);
	//查询
	getCurrentPageObj().find("#queryStreamApply").unbind("click");
	getCurrentPageObj().find("#queryStreamApply").click(function(){	
		var params = getCurrentPageObj().find("#StreamApplyQuerytForm").serialize();
		getCurrentPageObj().find("#StreamApplyTableInfo").bootstrapTable('refresh',
				{url:dev_resource+'StreamApply/queryStreamApply.asp?call='+quaryStreamCall+'&SID='+SID+'&'+params});		
	});
	//enter触发查询
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#queryStreamApply").click();});
	//重置
	getCurrentPageObj().find('#resetStreamApply').click(function() {
		getCurrentPageObj().find("#stream_app_code").val("");
		getCurrentPageObj().find("#system_name").val("");	
		getCurrentPageObj().find("#stream_app_title").val("");
		getCurrentPageObj().find("#stream_name").val(" ");
		getCurrentPageObj().find("#stream_status").val(" ");
		getCurrentPageObj().find("#stream_status").select2();
		getCurrentPageObj().find("#stream_app_status").val(" ");
		getCurrentPageObj().find("#stream_app_status").select2();
	});
	
	//新增
	getCurrentPageObj().find("#stream_add").unbind("click");
	getCurrentPageObj().find("#stream_add").click(function(){
		openInnerPageTab("stream_add","新增流申请","dev_resourceManage/streamApply/streamApply_add.html");
	});	
	
	//修改
	getCurrentPageObj().find("#stream_update").unbind("click");
	getCurrentPageObj().find("#stream_update").click(function(){
		var selection = getCurrentPageObj().find("#StreamApplyTableInfo").bootstrapTable('getSelections');
		if(selection.length != 1) {
			alert("请选择一条数据进行操作!");
			return;
		}
		var ids = $.map(selection, function(row) {
			return row.STREAM_APP_STATUS;
		});
		if(ids == '00'){
			closeAndOpenInnerPageTab("stream_update","修改流申请","dev_resourceManage/streamApply/streamApply_edit.html",function(){
				initBasicInfo(selection[0]);						
			});
		}else{
			alert("该申请已提交不能修改！");
		}
	});	
	//提交
	getCurrentPageObj().find("#stream_submit").unbind("click");
	getCurrentPageObj().find("#stream_submit").click(function(){
		var selection = getCurrentPageObj().find("#StreamApplyTableInfo").bootstrapTable('getSelections');
		if(selection.length != 1) {
			alert("请选择一条数据进行操作!");
			return;
		}
		var ids = $.map(selection, function(row) {
			return row.STREAM_APP_STATUS;
		});
		var stream_app_id = $.map(selection, function(row) {
			return row.STREAM_APP_ID;
		});
		if(ids == '00'){
			var subcall = getMillisecond();
			baseAjaxJsonp(dev_resource+"StreamApply/submitStreamApply.asp?app_id="+stream_app_id+"&SID="+SID+"&call="+subcall, null, function(data) {
				if (data != undefined && data != null && data.result=="true") {
		    		getCurrentPageObj().find('#StreamApplyTableInfo').bootstrapTable('refresh',{url:dev_resource+'StreamApply/queryStreamApply.asp?call='+quaryStreamCall+'&SID='+SID});
		    		alert("提交成功！");
				}else{
					alert("提交失败！");
				}
			},subcall);	
		}else{
			alert("该申请已提交！");
		}
	});	
	//详情
	getCurrentPageObj().find("#stream_view").unbind("click");
	getCurrentPageObj().find("#stream_view").click(function(){
		var selection = getCurrentPageObj().find("#StreamApplyTableInfo").bootstrapTable('getSelections');
		if(selection.length != 1) {
			alert("请选择一条数据进行操作!");
			return;
		}
		closeAndOpenInnerPageTab("stream_view","查看流申请","dev_resourceManage/streamApply/streamApply_info.html",function(){
			initStreamInfo(selection[0]);
			/*var item = selection[0];
			var system_id = item["SYSTEM_ID"];
			var version_id = item["VERSIONS_ID"];
			initReuirementQueryTable(system_id,version_id);
			if(item.STREAM_TYPE!="00"){
				getCurrentPageObj().find('#check_task').attr('style','display : none');
				getCurrentPageObj().find('#check_table').attr('style','display : none');
			}else if(item.STREAM_TYPE=="00"){
				getCurrentPageObj().find('#check_version').attr('style','display : none');
				getCurrentPageObj().find('#VERSIONS_NAME').attr('style','display : none');
				getCurrentPageObj().find('#normal_task').attr('style','display : none');
				getCurrentPageObj().find('#normal_table').attr('style','display : none');
			}*/
		});
	});	
	//删除
	getCurrentPageObj().find("#stream_delete").unbind("click");
	getCurrentPageObj().find("#stream_delete").click(function(){
		var selection = getCurrentPageObj().find("#StreamApplyTableInfo").bootstrapTable('getSelections');
		if(selection.length != 1) {
			alert("请选择一条数据进行操作!");
			return;
		}
		var stream_app_id = $.map(selection, function(row) {
			return row.STREAM_APP_ID;
		});
		var ids = $.map(selection, function(row) {
			return row.STREAM_APP_STATUS;
		});
		if(ids == '00'){
			nconfirm("确定要删除该数据吗?",function(){
				var delcall = getMillisecond();
				baseAjaxJsonp(dev_resource+"StreamApply/deleteStreamApply.asp?app_id="+stream_app_id+"&SID="+SID+"&call="+delcall, null, function(data) {
					if (data != undefined && data != null && data.result=="true") {
			    		getCurrentPageObj().find('#StreamApplyTableInfo').bootstrapTable('refresh',{url:dev_resource+'StreamApply/queryStreamApply.asp?call='+quaryStreamCall+'&SID='+SID});
			    		alert("删除成功！");
					}else{
						alert("删除失败！");
					}
				},delcall);	
			});		
		}else{
			alert("该申请已提交！");
		}
	});	
};
	
//查询列表显示table
function initStreamApplyInfo(quaryStreamCall) {
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$("#StreamApplyTableInfo").bootstrapTable(
			{
				//请求后台的URL（*）
				url :dev_resource+'StreamApply/queryStreamApply.asp?call='+quaryStreamCall+'&SID='+SID+'&stream_app_status=00',
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
				uniqueId : "STREAM_APP_ID", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				jsonpCallback:quaryStreamCall,
				singleSelect: true,
				onLoadSuccess : function(data){
					gaveInfo();
				},
				columns : [ {
					field: 'middle',
					checkbox: true,
					rowspan: 2,
					align: 'center',
					valign: 'middle'
				}, {
					field : 'STREAM_APP_CODE',
					title : '流申请编号',
					align : "center",
					width : 120
				}, {
					field : "SYSTEM_NAME",
					title : "应用名称",
					align : "center"
				}/*, {
					field : "VERSIONS_NAME",
					title : "版本名称",
					align : "center",
					width : 200
				}*/, {
					field : "STREAM_APP_TITLE",
					title : "标题",
					align : "center",
					width : 200
				}, {
					field : "APP_MAN_NAME",
					title : "申请人",
					align : "center"
				}, {
					field : "APP_STATUS",
					title : "申请状态",
					align : "center",
					width : 80,
				}, {
					field : "STREAM_NAME",
					title : "流名称",
					align : "center"
				}, {
					field : "STREAM_STATUS",
					title : "流状态",
					align : "center"
				}, {
					field : "STREAM_TYPE",
					title : "流类型",
					align : "center",
					formatter:function(value,row,index){if(value=="00"){return "任务流";}return "版本流";}
				}]
			});
};
//加载字典项
function initStreamAppDicType(){
	//初始化数据,属性类型
	initSelect($("#stream_status"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"R_DIC_STREAM_APP_STATUS"});
	initSelect($("#stream_app_status"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"R_DIC_STREAM_APP_STATUS"},'00');
}	
//同步OA用户
/*function synchronizationUser(){
	$("#synchronizationUser").click(function(){
		startLoading();
		$.ajax({
			type : "post",
			url : "OA/SynchronizationUser.asp",
			dataType : "json",
			success : function(data){
				if(data="true"){
					alert("同步成功！");
					$('#SUserTableInfo').bootstrapTable('refresh',{url:'SUser/queryalluser.asp'});
					endLoading();
				}else{
					alert("同步失败！");
					endLoading();
				}
			},
			error:function(){
				alert("同步失败！");
				endLoading();
			}
		});

	});
}*/
initStreamAppDicType();
initClickButtonEvent();
//synchronizationUser();
