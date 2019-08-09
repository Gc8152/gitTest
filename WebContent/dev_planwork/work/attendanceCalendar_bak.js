var queryParams = function(params) {
		var temp = {
				limit: params.limit, //页面大小
				offset: params.offset, //页码
				cutt_time:$("#currentTimeHidden2").text(),
				plan_name:$("#plan_name").val(),
				task_type:$("#task_type").val(),
				plan_name:$("#plan_name").val(),
				execute_status:$("#execute_status").val()
		};
		return temp;
	};
var call = getMillisecond();
$(document).ready(function() {

	var currTab = getCurrentPageObj(); // 该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题
    
	// 设置当前日期
	var currTime = $("#currentTime2");
	var currentTimeHidden = $("#currentTimeHidden2");
	currTime.text(getCurrentTime(101));//日期格式为2017年03月01日
	currentTimeHidden.text(getCurrentTime(10));
	initPlanSelect();
	initTaskDetailsInfoLookup();
	/*
	 * baseAjaxJsonp(dev_planwork+"workCon/findAll.asp?SID="+SID,{},function(){
	 * 
	 * },true);
	 */
	//查询按钮
	$("#search_lookup").click(function() {
		plan_name=$("#plan_name").val();
		task_type=$("#task_type").val();
		$("#attendanceCalendarTable_lookup").bootstrapTable("refresh",{url:dev_planwork + 'workCon/queryTaskDetailsLookup.asp?call=' + call+ '&SID=' + SID+ '&cutt_time=' + currentTimeHidden2.text()+'&plan_name=' + plan_name+'&task_type=' + task_type});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#search_lookup").click();});
	
	//重置按钮
	$("#reset").click(function() {
		$("#plan_name").val("");
		$("#task_type").val(" ");
		$("#execute_status").val(" ");
		$("#task_type").select2();
		$("#execute_status").select2();
	});
	
	// 获取表格和查询参数
	var table = currTab.find("#attendanceCalendarTable_lookup");
	

	$("#attendanceCalendarTable_lookup").bootstrapTable({
		// 请求后台的URL（*）
		url : dev_planwork + 'workCon/queryTaskDetailsLookup.asp?call=' + call+ '&SID=' + SID,
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
		jsonpCallback : call,
		detailView : false, // 是否显示父子表
		singleSelect : true,
		columns : [ {
			title : '序号',
			align : "center",
			formatter : function(value, rows, index) {
				return index + 1;
			}
		},{
			field : "PLAN_ID",
			title : "计划主键",
			align : "center",
			visible:false
		},{
			field : "PROJECT_ID",
			title : "项目主键",
			align : "center",
			visible:false
		},{
			field : "PK_ID",
			title : "报工主键",
			align : "center",
			visible:false
		}, {
			field : "PROJECT_NAME",
			title : "项目名称",
			align : "center"
		}, {
			field : "PLAN_NAME",
			title : "任务名称",
			align : "center"
		},{
			field : "TASK_TYPE",
			title : "任务类型",
			align : "center"
		}, {
			field : "START_TIME",
			title : "计划开始时间",
			align : "center"
		}, {
			field : "END_TIME",
			title : "计划结束时间",
			align : "center"
		}/*, {
			field : "EXECUTE_STATUS",
			title : "任务状态",
			align : "center"
		}*/,{
			field : "DUTY_MAN",
			title : "责任人",
			align : "center"
		} ],
		onClickRow:function(rowIndex,rowData){
			initTaskDetailsInfoLookup();
			
//			alert(JSON.stringify(rowData)+"---"+JSON.stringify(rowIndex));
			baseAjaxJsonp(dev_planwork+ 'workCon/queryTaskDetails.asp?call=' + call+ '&SID=' + SID + "&pkId=" + rowIndex.PLAN_ID,
				queryParams, function(data) {
			 if(data.result=="true"){
				 
				 $("#personTaskDetailsTable_lookup").bootstrapTable("load",data.rows);
			    }
			 if(null!=data.info&&""!=data.info&&data.info!=undefined){
				 $("#proName").text(data.info.PROJECT_NAME);// 项目名称赋值
				 $("#planWork").text(data.info.PLAN_WORK_HOUR);// 计划工作量
				 $("#workPercentage").text(data.info.WORK_PERCENTAGE);// 工作量完成百分比
				 $("#taskStatus").text(data.info.EXECUTE_STATUS);// 任务状态 
			 }
				}, call);
			
			
        }
	});
	
	/**
	 * 初始化任务详情列表
	 */
	function initTaskDetailsInfoLookup() {
		/*var queryParams = function(params) {
			//var temp = getSinfoParams();
			temp={};
			temp["limit"] = params.limit;
			temp["offset"] = params.offset;
			temp["cuttTime"] = getCurrentTime(10);
			return temp;
		};*/
	$("#personTaskDetailsTable_lookup").bootstrapTable({
		
		// 请求后台的URL（*）
		method : 'post', // 请求方式（*）
		
		columns : [{
			title : '序号',
			align : "center",
			formatter : function(value, rows, index) {
				return index + 1;
			}
		}, {
			field : "WDATE",
			title : "报工时间",
			align : "center"
		}, {
			field : "PLANNAME",
			title : "任务名称",
			align : "center"
		}, {
			field : "INPUTTIME",
			title : "当日投入工作量",
			align : "center"
		}, {
			field : "INPUTPERCENTAGE",
			title : "任务完成比例",
			align : "center"
		}, {
			field : "W_COMMENT",
			title : "说明",
			align : "center"
		}, {
			field : "FILEID",
			title : "附件",
			align : "center"
		}]
	  }); 
	}
	
	
});


//根据选中日期展示待办任务
$(".data_normal").bind('click',function() {
	var currY=$('#rili_se_lookup #year select').val();//当前年
	var currM=(parseInt($('#rili_se_lookup #month  select').val())+1).toString();//当前月
	if(currM.length<2){
		currM="0"+currM;//月份为两位数
	}
	var currD=$(this).prev().prev().text();
	if(currD.length<2){
		currD="0"+currD;//日期为两位数
	}
	var currDate=currY+'年'+currM+'月'+currD+"日";//显示的日期格式为2017年3月15日
	var currTime=currY+'-'+currM+'-'+currD;//查询的日期格式为yyyy-mm-dd
	$("#currentTime2").text(currDate);
	$("#currentTimeHidden2").text(currTime);
					
	$("#attendanceCalendarTable_lookup").bootstrapTable("refresh",{url:dev_planwork + 'workCon/queryTaskDetailsLookup.asp?call=' + call+ '&SID=' + SID+ '&cutt_time=' + currTime});
	
});

//下拉列表数据
function initPlanSelect(){
	//初始化任务类型数据
	initSelect($("#task_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_OUTTER_TASK_TYPE"});
}


/**
* 获取当前时间 value: 时间格式
*/

function getCurrentTime(value) {
	var num = parseInt(value);
	var date = new Date();
	var year = date.getFullYear();
	var month = (date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1))
			: (date.getMonth() + 1);
	var day = date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate();
	var hours = date.getHours() < 10 ? ("0" + date.getHours()) : date
			.getHours();
	var minutes = date.getMinutes() < 10 ? ("0" + date.getMinutes()) : date
			.getMinutes();
	var seconds = date.getSeconds() < 10 ? ("0" + date.getSeconds()) : date
			.getSeconds();
	// 年月日时分YYYY-MM-DD-HH-MM
	if (num == 16) {
		return year + "-" + month + "-" + day + " " + hours + ":" + minutes;
	}
	// 年月日时分秒YYYY-MM-DD-HH-MM-SS
	if (num == 19) {
		return year + "-" + month + "-" + day + " " + hours + ":" + minutes
				+ ":" + seconds;
	}
	// 年月日YYYY-MM-DD
	if (num == 10) {
		return year + "-" + month + "-" + day;
	}
	// 年月日YYYY年MM月DD日（页面展示日期使用）
	if (num == 101) {
		return year + "年" + month + "月" + day+"日";
	}

}
/**
*展开合上日历框
**/
$(function(){
	$("#attendanceCalendarSider-btn").click(function(){
			$(".workcheck #attend_b").toggle();
			$(".workcheck .operating-condition").toggle();
			$("#attendanceCalendarSider-btn").toggleClass("marginLeft0-calender");
			if($("#attendanceCalendarSider-btn").hasClass("marginLeft0-calender")){
				$(".workcheck .cont-right").css("width","99%");
			}else{
				$(".workcheck .cont-right").css("width","63%");
			}
	});
})
