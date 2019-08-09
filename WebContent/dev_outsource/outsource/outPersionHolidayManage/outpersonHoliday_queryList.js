
initOutPersonHolidayQueryPage();
function initOutPersonHolidayQueryPage(){
	var currTab = getCurrentPageObj();
	var currTabUrl = currTab.attr("url");
	var menu_no = currTabUrl.substring(currTabUrl.indexOf("=")+1,currTabUrl.length);
	if(menu_no=="outperson_holidayapply"){//菜单是请假申请
		currTab.find("#opsHoliday_add").show();
		currTab.find("#opsHoliday_update").show();
		currTab.find("#opsHoliday_submitToApprove").show();
		currTab.find("#opsHoliday_del").show();
		menu_no = "apply";
	}else if(menu_no=="holidayapply_query"){
		menu_no = "query";
	}
	var queryForm = currTab.find("#opsHolidayList");
	var table = currTab.find("#opsHolidayTable");
	var calls = getMillisecond();
	//请假状态
	initSelect(currTab.find("#leave_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_OUTPERSON_HOLIDAYAPPROVE"},"","",["04","05","06"]);
	initSelect(currTab.find("#leave_category"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_STAFFLEAVE_LEAVETYPE"});

//查询列表显示table
initOptHolidayQueryTable();
function initOptHolidayQueryTable() {
	var columns = "";
	if(menu_no=="query"){
		columns = 
		[ {
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		},{
			field : 'OP_ID',
			title : '外包人员id',
			align : 'center',
			visible:false
		},{
			field : 'LEAVE_ID',
			title : '请假id',
			align : 'center',
			visible:false
		},/*{
			field : 'IDCARD_NO',
			title : '身份证',
			align : "center",
			width : "20%"
		},*/{
			field : 'OP_NAME',
			title : '人员姓名',
			align : "center",
		    width : "15%"
		}, {
			field : 'OP_PHONE',
			title : '联系电话',
			align : "center",
			width : "15%"
		},{
			field : "SUP_NAME",
			title : "供应商名称",
			align : "center",
			width : "20%"
		}, {
			field : "LEAVE_DAYS",
			title : "请假天数",
			align : "center",
			width : "10%"
		}, {
			field : "CLEAR_DAYS",
			title : "销假天数",
			align : "center",
			width : "10%"
		}, {
			field : "START_DATE",
			title : "请假开始时间",
			align : "center",
			width : "15%"
		}, {
			field : "END_DATE",
			title : "请假结束时间",
			align : "center",
			width : "15%"
		}, {
			field : "LEAVE_CATEGORY_DISPLAY",
			title : "假别",
			align : "center",
			width : "8%"
		}, {
			field : "LEAVE_STATE_DISPLAY",
			title : "请假状态",
			align : "center",
			width : "10%"
		}];
	}else{
		columns = 
			[ {
				field: 'middle',
				checkbox: true,
				rowspan: 2,
				align: 'center',
				valign: 'middle'
			},{
				field : 'OP_ID',
				title : '外包人员id',
				align : 'center',
				visible:false
			},{
				field : 'LEAVE_ID',
				title : '请假id',
				align : 'center',
				visible:false
			},/*{
				field : 'IDCARD_NO',
				title : '身份证',
				align : "center",
				width : "20%"
			},*/{
				field : 'OP_NAME',
				title : '人员姓名',
				align : "center",
			    width : "15%"
			}, {
				field : 'OP_PHONE',
				title : '联系电话',
				align : "center",
				width : "15%"
			},{
				field : "SUP_NAME",
				title : "供应商名称",
				align : "center",
				width : "20%"
			}, {
				field : "LEAVE_DAYS",
				title : "请假天数",
				align : "center",
				width : "10%"
			}, {
				field : "START_DATE",
				title : "请假开始时间",
				align : "center",
				width : "15%"
			}, {
				field : "END_DATE",
				title : "请假结束时间",
				align : "center",
				width : "15%"
			}, {
				field : "LEAVE_CATEGORY_DISPLAY",
				title : "假别",
				align : "center",
				width : "8%"
			}, {
				field : "LEAVE_STATE_DISPLAY",
				title : "请假状态",
				align : "center",
				width : "10%"
			}];
	}
	
	
	var queryParams=function(params){
		var temp={};
		 temp["limit"]=params.limit;
		 temp["offset"]=params.offset;
		return temp;
	};
	table.bootstrapTable({
				url : dev_outsource+"opsHoliday/queryAllPersonHoliday.asp?SID="+SID+"&call="+calls+"&menu_type="+menu_no,
				method : 'get', //请求方式（*）   
				striped : false, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				pagination : true, //是否显示分页（*）
				pageList : [5,10,20],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 10,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "CHECK_ID", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				jsonpCallback:calls,
				singleSelect: true,
				onLoadSuccess:function(data){
					gaveInfo();
				},
				columns : columns
			});
};
/**
 * 初始化页面查询事件
 */
initOptHolidayQueryPageBtn();
function initOptHolidayQueryPageBtn(){
	
	//查询按钮事件
	currTab.find("#queryOpsCheck").unbind("click");
	currTab.find("#queryOpsCheck").click(function(){
		var param = queryForm.serialize();
		table.bootstrapTable("refresh",{url:dev_outsource+"opsHoliday/queryAllPersonHoliday.asp?SID="+SID+"&call="+calls+"&menu_type="+menu_no+"&"+param});
	});
	//enter触发查询
	enterEventRegister(currTab.attr("class"), function(){currTab.find("#queryOpsCheck").click();});
	
	//重置按钮
	currTab.find("#check_reset").click(function(){
		currTab.find("#opsHolidayList input").val("");
		var selects=getCurrentPageObj().find("#opsHolidayList select");
		selects.val(" ");
		selects.select2();
	});
	
	//新增外包人员请假信息
	currTab.find("#opsHoliday_add").unbind("click");
	currTab.find("#opsHoliday_add").click(function(){
		closeAndOpenInnerPageTab("opsHolidayAdd","请假新增","dev_outsource/outsource/outPersionHolidayManage/outpersonHoliday_add.html",function(){
			initOpsHolidayaddPage("","add");
		});
	});
	
	//修改外包人员请假信息
	currTab.find("#opsHoliday_update").unbind("click");
	currTab.find("#opsHoliday_update").click(function(){
		var id = table.bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		if(id[0].LEAVE_STATE=="00"||id[0].LEAVE_STATE=="02"){
			closePageTab("optCheckUpdate",function(){
				openInnerPageTab("opsHolidayUpdate","请假修改","dev_outsource/outsource/outPersionHolidayManage/outpersonHoliday_add.html",function(){
					initOpsHolidayaddPage(id[0],"update");
				});
			});
		}else{
			alert("请选择待提交或打回状态的请假单进行修改！");
			return;
		}
		
	});
	
	//提交外包人员请假信息
	currTab.find("#opsHoliday_submitToApprove").unbind("click");
	currTab.find("#opsHoliday_submitToApprove").click(function(){
		var id = table.bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行提交!");
			return ;
		}
		if(id[0].LEAVE_STATE!="00"&&id[0].LEAVE_STATE!="02"){
			alert("请选择【请假待提交、请假打回】状态的请假单进行提交！");
			return;
		}
		 var item = {};
		   item["af_id"] = '183';//流程id
		   item["systemFlag"] = '04'; //systemFlag：系统标识（合同系统：00，项目系统：01，报销系统：02，工程管理：03, 外包管理系统：04）
		   item["biz_id"] = id[0].LEAVE_ID;//业务id
		   item["group_manager_project"] = id[0].OP_OFFICE;//人员所属项目组的项目组长
		   item["r_outsourcing"] = "10101706";//开发分中心的外包管理岗
		   item["core_manager"] = "10101706";//开发分中心的负责人
		   item["user_id"]=SID;//请假人
	       //调用发起流程的函数
	       approvalProcess(item,function(data){
	    	     var calls = getMillisecond();
	    	     var leave_state = "01";//状态更新为请假审批中
				 baseAjaxJsonp(dev_outsource+"opsHoliday/updateOutPersonHolidayState.asp?SID="+SID+"&call="+calls,{LEAVE_ID:id[0].LEAVE_ID,LEAVE_STATE:leave_state},function(data){
					 if(data!=null&&data!=undefined&&data.result=="true"){
							alert("提交成功！",function(){
								table.bootstrapTable('refresh');
							});
							
						}else{
							alert("提交失败！");
						}
				},calls); 
	       });
	});
	
	//删除外包人员请假信息
	currTab.find("#opsHoliday_del").unbind("click");
	currTab.find("#opsHoliday_del").click(function(){
		var id = table.bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行删除!");
			return ;
		}
		if(id[0].LEAVE_STATE!="00"){
			alert("请选择待提交状态的请假单进行删除！");
			return;
		}
		nconfirm("确定删除该请假信息吗？",function(){
			var url=dev_outsource+"opsHoliday/delOpsOneHoliday.asp?LEAVE_ID="+id[0].LEAVE_ID+"&SID="+SID+"&call="+calls;
			baseAjaxJsonp(url,null,function(data){
				if(data!=null&&data!=undefined&&data.result=="true"){
					alert("删除成功！",function(){
						table.bootstrapTable('refresh');
					});
				}else{
					alert("删除失败！");
				}
				
			},calls);
		});
	});
	
	//详情页面
	currTab.find("#opsHoliday_view").unbind("click");
	currTab.find("#opsHoliday_view").click(function(){
		var id = table.bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行查看!");
			return ;
		}
		closeAndOpenInnerPageTab("opsHolidayDetail","外包人员请假详细信息","dev_outsource/outsource/outPersionHolidayManage/outpersonHoliday_detail.html",function(){
			initOpsHolidayaddViewPage(id[0]);
			initAFApprovalInfo(id[0]["INSTANCE_ID"],"0");
		});
	});
  }
}

//时间比较
function ocheckTimeCompare(){
	WdatePicker({onpicked:function(){
		var check_starttime = getCurrentPageObj().find("#check_starttime").val();
		var check_endtime = getCurrentPageObj().find("#check_endtime").val();
		if(check_starttime!=""&&check_endtime!=""){
			if(check_starttime>check_endtime){
				alert('开始时间不能大于结束时间!',function(){
					getCurrentPageObj().find("#check_starttime").val("");
					getCurrentPageObj().find("#check_endtime").val("");
				});
			}
		}
	}});
}
