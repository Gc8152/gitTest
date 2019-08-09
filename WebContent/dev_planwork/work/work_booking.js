
$(document).ready(function(){
	var call = getMillisecond();
	//查询按钮
	$("#work_booking_serch").click(function(){
		var pro_name=$("#pro_name").val();
		var pro_code=$("#pro_code").val();
		var pro_date=$("#pro_date").val();
		$('#projectList').bootstrapTable('refresh',
				{url:dev_planwork + 'workCon/queryDSPlist.asp?call=' + call+ '&SID=' + SID+'&pro_name='+encodeURI(pro_name)+"&pro_code="+pro_code+"&pro_date="+pro_date});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#work_booking_serch").click();});
	//全选
	$("#allSelect").click(function(){
		  $("input[type='checkbox'][name='btSelectItem']").attr("checked","true");
		
	});
	//审批通过
	$("#passThough").click(function(){
		var id = $("#projectList").bootstrapTable('getSelections');
		if(id.length<1){
			alert("请至少选择一条数据!");
			return ;
		}
		var ids = $.map(id, function (row) {
			return row.PROJECTID;                    
		});
		var month = $.map(id, function (row) {
			return row.MONTH;                    
		});
		var call1 = getMillisecond();
		baseAjaxJsonp(dev_planwork + 'workCon/projectApproval.asp?call=' + call1+ '&SID=' + SID, {ids:ids.toString(),status:'02',month:month.toString()},//02审批通过操作
			function(msg) {
			if(msg.result){
				alert("审批通成功！");
			 }
			}, call1);
		$('#projectList').bootstrapTable('refresh',{});
	});
	//审批打回
	$("#beatBack").click(function(){
		var id = $("#projectList").bootstrapTable('getSelections');
		if(id.length<1){
			alert("请至少选择一条数据!");
			return ;
		}
		var ids = $.map(id, function (row) {
			return row.PROJECTID;                    
		});
		var month = $.map(id, function (row) {
			return row.MONTH;                    
		});
		var call2 = getMillisecond();
		baseAjaxJsonp(dev_planwork + 'workCon/projectApproval.asp?call=' + call2+ '&SID=' + SID, {ids:ids.toString(),status:'03',month:month.toString()},//03打回操作
			function(msg) {
				if(msg.result){
					alert("审批退回成功！");
				}
			}, call2);
		$('#projectList').bootstrapTable('refresh',{});
	});

	
/*	function getSinfoParams() {
		var param = {};
		var inputs = $("#queryTable input");
		for (var i = 0; i < inputs.length; i++) {
			var obj = $(inputs[i]);
			if ($.trim(obj.val()) != "") {
				param[obj.attr("name")] = obj.val();
			}
		}
		var selects = $("#queryTable select");
		for (var i = 0; i < selects.length; i++) {
			var obj = $(selects[i]);
			if ($.trim(obj.val()) != "") {
				param[obj.attr("name")] = obj.val();
			}
		}
		var c = getCurrentTime(10);
		param['currTime'] = c;
		return param;
	}*/
	var queryParams = function(params) {
		//var temp = getSinfoParams();
		temp={};
		temp["limit"] = params.limit;
		temp["offset"] = params.offset;
		return temp;
	};
	// 获取表格和查询参数
	
	$("#projectList").bootstrapTable({
		// 请求后台的URL（*）
		url : dev_planwork + 'workCon/queryDSPlist.asp?call=' + call+ '&SID=' + SID,
		method : 'get', // 请求方式（*）
		striped : false, // 是否显示行间隔色
		cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, // 是否启用排序
		sortOrder : "asc", // 排序方式
		queryParams : queryParams,// 传递参数（*）
		sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
		pagination : true, // 是否显示分页（*）
		pageList : [ 10, 15 ],// 每页的记录行数（*）
		pageNumber : 1, // 初始化加载第一页，默认第一页
		pageSize : 10,// 可供选择的每页的行数（*）
		clickToSelect : true, // 是否启用点击选中行
		uniqueId : "aa", // 每一行的唯一标识，一般为主键列
		cardView : false, // 是否显示详细视图
		detailView : false, // 是否显示父子表
		jsonpCallback : call,
		singleSelect : false,
		onLoadSuccess : function(data){
			gaveInfo();
		},
		columns : [ {
			field : 'middle',
			checkbox : true,
			rowspan : 2,
			align : 'center',
			valign : 'middle'
		}, {
			field : "PROJECTID",
			title : "主键",
			align : "center",
			visible:false
		},  {
			field : "PROJECTNUM",
			title : "项目编码",
			align : "center",
			width : "20%"
		}, {
			field : "PROJECTNAME",
			title : "项目名称",
			align : "center",
			width : "20%"
		}, {
			field : "PLANWORKHOUR",
			title : "计划总工作量（小时）",
			align : "center",
			width : "18%"
		}, {
			field : "WORKLOAD",
			title : "已报工作量（小时）",
			align : "center",
			width : "18%"
		}, {
			field : "TOTALTIME",
			title : "待审批工作量（小时）",
			align : "center",
			width : "18%"
		},{
			field : "MONTH",
			title : "月份",
			align : "center"
		}/*,{
      	  field: 'PRENODEMAN',
    	  title: '报工详情',
    	  align:"center",
    	  width:"120"
        },{
    	  field: 'PRENODEMAN',
    	  title: '审批状态',
    	  align:"center",
    	  width:"120"
      } */],
          onClickRow:function(rowIndex,rowData){
        	  openInnerPageTab(
      				"workBooking",
      				"任务信息查询页面",
      				"dev_planwork/work/work_booking_list.html",
      				function() {
      					initworkBookingInfoPage({projectid:rowIndex.PROJECTID,month:rowIndex.MONTH});
      				});
        	 //openWorkBookingPop("workBookingPOP",{projectid:rowIndex.PROJECTID});
          }
	}); 

	
});


//人员选择模态框
$("#staff_name").click(function(){
//加载userPop.html
	/*$(window.top.document.body).append("<div id='staffPOP'></div>"); */
	$("#staffPOP").load("pages/suser/suserPop.html");
	openUserPop("staffPOP",{name:$("#staff_name"),no:$("#staff_code")});
	
});	

//时间控件
function initDate(){
	WdatePicker({
			dateFmt : 'yyyy-MM',
			minDate : '1990-01',
			maxDate : '2050-12'
	});
}

/**
*bootstrap-modal同时打开多个modal页面内存益处处理
**/
$.fn.modal.Constructor.prototype.enforceFocus = function () {};
