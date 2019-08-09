
initQualityNoConfirmRaiseQuery();
function initQualityNoConfirmRaiseQuery(){
	var currTab = getCurrentPageObj();
	var queryForm = currTab.find("#noConformItemRaise_query");
	var table = currTab.find("#noConformItemRaiseTable");
	var noConfirmItemRaisecall = getMillisecond();
//初始化页面下拉框的值
initNoConfirmRaiseSelectVal();
function initNoConfirmRaiseSelectVal(){
	//initSelect(getCurrentPageObj().find("select[name='PROJECT_TYPE']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SYS_DIC_MILESTONE_PROJECT_TYPE"});
	initSelect(currTab.find("select[name='typ']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_TYP"});
	initSelect(currTab.find("select[name='grade']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_GRADE"});
}

//初始化列表
initNoConfirmRaiseTableList();
function initNoConfirmRaiseTableList(){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	
	table.bootstrapTable('destroy').bootstrapTable({
		//请求后台的URL（*）
		url : dev_project
			+'qualityManager/queryListQuality.asp?call='
			+noConfirmItemRaisecall+'&SID='+SID+"&flag=1",
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [5,10],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "QUALITY_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:noConfirmItemRaisecall,
		singleSelect: true,
		onLoadSuccess:function(data){
			gaveInfo();
		},
		columns : [{
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle',
		},{
			field : "PROJECT_NAME",
			title : "项目名称",
			align : "center",
			width : 200,
		},{
			field : "BUSINESS_CODE",
			title : "业务编号",
			align : "center",
			width : 180,
		},{
			field : "NO_CONFORM_NAME",
			title : "不符合项名称",
			align : "center",
			width : 180,
		},{
			field : "CHECK_NAME",
			title : "检查点名称",
			align : "center",
			width : 180,
		},{
			field : "GRADE_NAME",
			title : "不符合项等级",
			align : "center",
			width : 150,
		},{
			field : "QUALITY_STATUS_NAME",
			title : "不符合项状态",
			align : "center",
			width : 150,
		},{
			field : "FIND_DATE",
			title : "发现日期",
			align : "center",
			width : 130,
		},{
			field : "PRESENT_USER_NAME",
			title : "提出人",
			align : "center",
			width : 90,
		},{
			field : "DUTY_USER_NAME",
			title : "责任人",
			align : "center",
			width : 90,
		},{
			field : "REALITY_FINISH_TIME",
			title : "实际解决日期",
			align : "center",
			width : 150,
		},{
			field : "DESCR",
			title : "备注",
			align : "center",
			width : 100,
		}]
	});
}

//初始化页面按钮事件
initNoConfirmRaiseBtnEvent();
function initNoConfirmRaiseBtnEvent(){
	
	//查询按钮
	currTab.find("#raiseCommit").click(function(){
		
		var param = queryForm.serialize();
		table.bootstrapTable('refresh',{url : dev_project
			+ 'qualityManager/queryListQuality.asp?call='
			+ noConfirmItemRaisecall + '&SID=' + SID +"&"+param+"&flag=1"});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#raiseCommit").click();});
	//重置按钮点击事件
	currTab.find("#raiseReset").click(function(){
		queryForm.find("input").val("");
		queryForm.find("select").val(" ");
		queryForm.find("select").select2();
	});
	//新增按钮事件
	var addclick = currTab.find("#qualityManage_add");
	    addclick.unbind("click");
	    addclick.click(function(){
		closeAndOpenInnerPageTab("qualityManage_add","新增不符合项","dev_project/qualityManage/noConformItemRaise/noConformItemRaise_add.html",function(){
			addNotConformConfig_init();
		});
	});
	    
	//修改按钮事件
	 var updateclick = currTab.find("#qualityManage_update");
	     updateclick.unbind("click");
	     updateclick.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		if(rows[0].QUALITY_STATUS!=='01'&&rows[0].QUALITY_STATUS!=='04')
		{
			alert("只能修改草拟和拒绝状态下的数据!");
			return ;
		}
		
	
		closeAndOpenInnerPageTab("qualityManage_update","修改不符合项","dev_project/qualityManage/noConformItemRaise/noConformItemRaise_add.html",function(){
			updateNotConformConfig_init(rows[0]);
		});
		
		
	});
	//删除按钮事件
	  currTab.find("#qualityManage_delete").click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行删除!");
			return ;
		}
		
		if(rows[0].QUALITY_STATUS == "05"){
			alert("这条数据不是待验证，不能进行删除!");
			return ;
		} 
		nconfirm("确定要删除该数据吗？",function(){
			var call = getMillisecond();
			baseAjaxJsonp(dev_project+"qualityManager/deleteQuality.asp?call="+call+"&SID="+SID+"&QUALITY_ID="+rows[0].QUALITY_ID, null, function(data){
				if (data != undefined && data != null) {
					alert(data.msg);
					if(data.result=="true"){
						raiseCommit.click();
						
					}
				}else{
					alert("未知错误！");
				}
			},call);
		});
	
	
	});
	//验证按钮事件
	  currTab.find("#qualityManage_validate").click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行验证!");
			return ;
		}
		if(rows[0].QUALITY_STATUS !== "05"){
			alert("这条数据不是待验证状态，不能进行验证!");
			return ;
		}
		closeAndOpenInnerPageTab("qualityManageRaise_validate","验证不符合项","dev_project/qualityManage/noConformItemRaise/noConformItemRaise_validate.html",function(){
			initQualityManageValidateLayout(rows[0]);
		});
	});
	//详情按钮事件
	currTab.find("#qualityManageRaise_detail").click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行查看!");
			return ;
		}
		openInnerPageTab("qualityManageRaise_queryInfo","查看不符合项","dev_project/qualityManage/qualityQuery/qualityManage_queryInfo.html",function(){
			initQualityManageInfoLayout(rows[0]);
		});
	});
	
	//关闭按钮事件
	currTab.find("#qualityManage_closeStatus").click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行查看!");
			return ;
		}
		var sta =rows[0].QUALITY_STATUS;
		if(sta=="07"){
			alert("该项已关闭");
			return;
		}
		if(sta=="05")
			{
				alert("待验证状态不可关闭");
				return;
			}
		nconfirm("是否确认关闭？",function(){
			var QUALITY_ID = rows[0].QUALITY_ID;
			var QUALITY_STATUS = "07";
			var OPT_STATUS = "关闭";
			initChangeRaiseStatus(QUALITY_ID,QUALITY_STATUS,OPT_STATUS);
		});
	});
	
	//提交按钮事件
	currTab.find("#qualityManage_submit").click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行提交!");
			return ;
		}
		if(rows[0].QUALITY_STATUS !== "01"){
			alert("这条数据不是草拟状态，不能提交!");
			return ;
		}
		
		nconfirm("是否确认提交？",function(){
			var QUALITY_ID = rows[0].QUALITY_ID;
			var QUALITY_STATUS = "02";
			var OPT_STATUS = "提交";
			initChangeRaiseStatus(QUALITY_ID,QUALITY_STATUS,OPT_STATUS);
			
		});
	});
	
}

function initChangeRaiseStatus(QUALITY_ID,QUALITY_STATUS,OPT_STATUS){
	var call = getMillisecond();
	baseAjaxJsonp(
			dev_project
					+ "qualityManager/updateRaiseStatus.asp?call="
					+ call + "&SID=" + SID ,
			{
				QUALITY_STATUS:QUALITY_STATUS,
				OPT_STATUS:OPT_STATUS,
				QUALITY_ID : QUALITY_ID,
			}, function(data) {
				if (data != undefined && data != null) {
					alert(data.msg);
					if (data.result == "true") {
						$("#raiseCommit").click();
					}
				} else {
					alert("未知错误！");
				}
		}, call);
}
}
