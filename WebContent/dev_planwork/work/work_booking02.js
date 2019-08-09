var call = getMillisecond();
$(document).ready(function(){
	
	//查询按钮
	$("#work_booking_serch").click(function(){
		var pro_name=$("#pro_name").val();
		var pro_code=$("#pro_code").val();
		var pro_date=$("#pro_date").val();
		$('#projectListt').bootstrapTable('refresh',
				{url:dev_planwork + 'workCon/queryDSPlist.asp?call=' + call+ '&SID=' + SID+'&pro_name='+pro_name+"&pro_code="+pro_code+"&pro_date="+pro_date});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#work_booking_serch").click();});
	//全选
	$("#allSelect").click(function(){
		  $("input[type='checkbox'][name='btSelectItem']").attr("checked","true");
		
	});
	//审批通过
	$("#passThought").click(function(){
		var id = $("#projectListt").bootstrapTable('getSelections');
		if(id.length<1){
			alert("请至少选择一条数据!");
			return ;
		}
		var ids = $.map(id, function (row) {
			return row.ORG_NO;
		});
//		alert(ids.toString());
		var call = getMillisecond();
		baseAjaxJsonp(dev_planwork + 'workCon/noProjectApproval.asp?call=' + call+ '&SID=' + SID, {ids:ids.toString(),status:'02'},//02审批通过操作
			function(msg) {
			if(msg.result){
				alert("已经审批通过！");
			 }
			}, call);
		$('#projectListt').bootstrapTable('refresh',{});
	});
	//审批打回
	$("#beatBackt").click(function(){
		var id = $("#projectListt").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请至少选择一条数据!");
			return ;
		}
		var ids = $.map(id, function (row) {
			return row.ORG_NO;
		});
		var call = getMillisecond();
		baseAjaxJsonp(dev_planwork + 'workCon/noProjectApproval.asp?call=' + call+ '&SID=' + SID, {ids:ids.toString(),status:'03'},//03打回操作
			function(msg) {
				if(msg.result){
					alert("已经审批退回！");
				}
			}, call);
		$('#projectListt').bootstrapTable('refresh',{});
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
	
	$("#projectListt").bootstrapTable({
		// 请求后台的URL（*）
		url : dev_planwork + 'workCon/queryNoProjectTasklist.asp?call=' + call+ '&SID=' + SID,
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
		onLoadSuccess:function(data){
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
		}, {
            field : "ORG_NO",
            title : "部门编码",
            align : "center",
            visible:false
        }, {
			field : "ORGNAME",
			title : "部门名称",
			align : "center" ,
            formatter : function(value, row, index) {
                return "<a onclick=openworkBookingList('" + row.ORG_NO
                    + "') >" + value + "</a>"
            }
		}
//            , {
//			field : "PLANWORKHOUR",
//			title : "总工作量（人月）",
//			align : "center"
//		}, {
//			field : "WORKLOAD",
//			title : "本月工作量",
//			align : "center"
//		}
            , {
			field : "REVIEWTOTALTIME",
			title : "待审批工作量",
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
//        	  openInnerPageTab(
//      				"workBooking02",
//      				"个人报工明细列表",
//      				"dev_planwork/work/work_booking_list02.html",
//      				function() {
//      					initworkBookingInfoPage({"org_no":rowIndex.ORG_NO});
//      				});
        	 //openWorkBookingPop("workBookingPOP",{projectid:rowIndex.PROJECTID});
          }
	}); 

	
});

function openworkBookingList(org_no){
    openInnerPageTab(
        "workBooking02",
        "个人报工明细列表",
        "dev_planwork/work/work_booking_list02.html",
        function() {
            initworkBookingInfoPage({org_no:org_no});
        });
}

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
