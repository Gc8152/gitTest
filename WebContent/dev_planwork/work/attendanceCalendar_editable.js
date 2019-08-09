/**
 * 
 */
/*var queryParams=function(params){
	var temp={
			limit: params.limit, //页面大小
			offset: params.offset, //页码
			cuttTime:getCurrentTime(10)//查询时间
	};
	return temp;
};*/				
var curRow;	
var optInput;//获取每次点击的说明input框
$(function(){
	
	var queryParams = function(params) {
		//var temp = getSinfoParams();
		temp={};
		temp["limit"] = params.limit;
		temp["offset"] = params.offset;
		temp["cuttTime"] = getCurrentTime(10);
		return temp;
	};
	var currTab = getCurrentPageObj(); // 该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题

	// 设置当前日期
	var currTime = $("#currentTime");
	var currentTimeHidden = $("#currentTimeHidden");
	currTime.text(getCurrentTime(101));//日期格式为2017年03月01日
	currentTimeHidden.text(getCurrentTime(10));
	//显示编辑按钮，隐藏保存按钮
	currTab.find("#save").hide();
	currTab.find("#taskEdit").show();
	initPlanSelect();
	initTable();
	initTaskDetailsInfo();
	//$("#attendanceCalendarTable").TaskMytable("endEditor",5);
	
	//重置按钮
	$("#reset2").click(function() {
		$("#plan_name").val("");
		$("#task_type").val(" ");
		$("#execute_status").val(" ");
		$("#task_type").select2();
		$("#execute_status").select2();
	});
	
	//查询按钮事件
	var commit = currTab.find("#search");
	commit.click(function(e) {
		var call = getMillisecond();
		var plan_name= currTab.find("#plan_name").val();//任务名称
		var task_type= currTab.find("#task_type").val();//任务类型
		var execute_status= currTab.find("#execute_status").val();//任务状态
		var cutt_time=currTab.find("#currentTimeHidden").text();//查询时间
		var params={plan_name:plan_name,task_type:task_type,execute_status:execute_status,cuttTime:cutt_time};
		baseAjaxJsonp(dev_planwork + 'workCon/findAll.asp?call='+call+'&SID=' + SID, params,
				function(msg) {
			  $("#attendanceCalendarTable").TaskMytable("load",msg.rows);
				}, call);
	});
	
		
	//新增计划外任务按钮事件
	$("#addTaskExt").click(function(){
//		$('#myModal_planOutter').remove();
//		getCurrentPageObj().find("#planOutterAdd").load("dev_planwork/work/planExtTask_add.html",{},function(){
	    $("#myModal_planOutter").modal("show");
		//});
		//$("#myModal_planOutter").modal("show");
		
	});
	
	//编辑计划按钮事件
	$("#taskEdit").click(function(){
		var data=$("#attendanceCalendarTable").TaskMytable("getData");
		for(var i=0;i<data.rows.length;i++){
			$("#save").show();
			$("#taskEdit").hide();
			if(data.rows[i].STATUS!='审批通过'){
				$("#attendanceCalendarTable").TaskMytable("beginEditor",i);
			}
		 }
	});
	
	
	//保存报工详情
	$("#save").click(function(){
		if(!vlidate($("#attendanceCalendarTable"))){
			return;
		}
		var data=$("#attendanceCalendarTable").TaskMytable("getData");
		for(var i=0;i<data.rows.length;i++){
			$("#attendanceCalendarTable").TaskMytable("endEditor",i);
		 }
		//alert(JSON.stringify(data));

		saveData(data);
		/*var cutt_time=currTab.find("#currentTimeHidden").text();//查询时间
		var params={cuttTime:cutt_time};
		$("#attendanceCalendarTable").TaskMytable("refresh",params);*/
	});
	
	//说明模态框
	$("#attendanceCalendarTable input:first").click(function(){
		optInput=$(this);
		$("#myModal_desc").modal("show");
		$("#desc").val("");
	});
	
	//说明模态框确定按钮
	$("#saveComment").click(function(){
		$("#myModal_desc").modal("hide");
		var desc=$("#desc").val();//模态框中说明字段的值
		optInput.val(desc);
	});
});

	function getSinfoParams() {
		var param = {};
		var inputs = $("#attendanceCalendar_query input");
		for (var i = 0; i < inputs.length; i++) {
			var obj = $(inputs[i]);
			if ($.trim(obj.val()) != "") {
				param[obj.attr("name")] = obj.val();
			}
		}
		var selects = $("#attendanceCalendar_query select");
		for (var i = 0; i < selects.length; i++) {
			var obj = $(selects[i]);
			if ($.trim(obj.val()) != "") {
				param[obj.attr("name")] = obj.val();
			}
		}
		var c = getCurrentTime(10);
		param['currTime'] = c;
		return param;
	}
	var queryParams = function(params) {
		var temp = getSinfoParams();
		temp["limit"] = params.limit;
		temp["offset"] = params.offset;
		return temp;
	};

//
function initTable() {
	var queryParams = function(params) {
		temp={};
		temp["limit"] = params.limit;
		temp["offset"] = params.offset;
		temp["cuttTime"] = getCurrentTime(10);
		return temp;
	};
	var columns = [/* {
		field : 'middle',
		checkbox : true,
		rowspan : 2,
		align : 'center',
		valign : 'middle'
	}, {
		field : 'PLANID',
		title : '主键',
		align : "center",
		visible : false
	},*/ {
		field : "PLANNAME",
		title : "任务名称",
		align : "center",
		width: "150px"
	}, {
		field : "TASKTYPE",
		title : "任务类型",
		align : "center",
		width: "77px"
	}, {
		field : "STARTTIME",
		title : "计划开始时间",
		align : "center",
	    width: "103px"
	}, {
		field : "ENDTIME",
		title : "计划结束时间",
		align : "center",
	    width: "120px"
	}, {
		field : "TOTAL_TIME",
		title : "已投入工时",
		align : "center",
		width: "120px"
	}, {
		field : "INPUT_TIME",
		title : "当日投入工时",
		align : "center",
		width: "150px",
		edit:{type:"textnum"}
	}, {
		field : "INPUTPERCENT",
		title : "完成比例(%)",
		align : "center",
	    width: "150px",
		edit:{type:"textnum50"}
	}, {
		field : "W_COMMENT",
		title : "说明",
		align : "center",
		width: "260px",
		edit:{type:"textarea"}
	}, {
		field : "STATUS",
		title : "审批状态",
		align : "center",
		width: "100px",
	}, {
		field : "FILEID",
		title : "附件",
		align : "center",
		width: "65px",
	} ];
var config={
		columns:columns,
		url:dev_planwork + 'workCon/findAll.asp?SID=' + SID+"&cuttTime="+getCurrentTime(10),
		pagesize:5,
		queryParams:queryParams,
		click:function(rowIndex,row){//appenRow
			 //先把项目状态清空
			 $("#proName").text("");// 项目名称赋值
			 $("#planWork").text("");// 计划工作量
			 $("#workPercentage").text("");// 工作量完成百分比
			 $("#taskStatus").text("");// 任务状态
			curRow = row;
			var call = getMillisecond();
			initTaskDetailsInfo();
			baseAjaxJsonp(dev_planwork+ 'workCon/queryTaskDetails.asp?call=' + call+ '&SID=' + SID + "&pkId=" + row.PLANID,
					queryParams, function(data) {
				 if(data.result=="true"){
					 $("#personTaskDetailsTable").bootstrapTable("load",data.rows);
				    }
				 if(null!=data.info&&""!=data.info&&data.info!=undefined){
					 $("#proName").text(data.info.PROJECT_NAME);// 项目名称赋值
					 $("#planWork").text(data.info.PLAN_WORK_HOUR);// 计划工作量
					 $("#workPercentage").text(data.info.WORK_PERCENTAGE);// 工作量完成百分比
					 $("#taskStatus").text(data.info.EXECUTE_STATUS);// 任务状态 
				 }
					}, call);
			
		},
		loadSuccess:function(data){
			
		}
 };
$("#attendanceCalendarTable").TaskMytable(config);
};


/**
 * 提交数据
 * @param rows
 */
function saveData(data){
	var call = getMillisecond();
	//console.log(data.rows.length+"-----"+JSON.stringify(data.rows)+"----"+$("#currentTimeHidden").text());
	if(data){
		baseAjaxJsonp(dev_planwork+ 'workCon/saveTask.asp?call=' + call+ '&SID=' + SID,{total:data.rows.length,data:data.rows,w_date:$("#currentTimeHidden").text()},function(msg){
			if(msg.result=="true"){
				$("#save").hide();
				$("#taskEdit").show();
				alert("保存成功!");
				//$("#attendanceCalendarTable").TaskMytable("refresh",{});
			}else{
				alert("保存失败!");
			}
			//$("#attendanceCalendarTable").TaskMytable("refresh",{});
		},call);
	}
}


/**
 * 初始化任务详情列表
 */
function initTaskDetailsInfo() {
	var queryParams = function(params) {
		//var temp = getSinfoParams();
		temp={};
		temp["limit"] = params.limit;
		temp["offset"] = params.offset;
		temp["cuttTime"] = getCurrentTime(10);
		return temp;
	};
$("#personTaskDetailsTable").bootstrapTable({
	
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
		title : "任务完成比例(%)",
		align : "center"
	}, {
		field : "W_COMMENT",
		title : "说明",
		align : "center"
	}, {
		field : "FILEID",
		title : "附件",
		align : "center"
	}],
      onClickRow:function(rowIndex,rowData){
      }
  }); 
}

//根据选中日期展示待办任务
$(".data_normal").bind('click',function() {
	var currY=$('#rili_se #year select').val();//当前年
	var currM=(parseInt($('#rili_se #month  select').val())+1).toString();//当前月
	if(currM.length<2){
		currM="0"+currM;//月份为两位数
	}
	var currD=$(this).prev().prev().text();
	if(currD.length<2){
		currD="0"+currD;//日期为两位数
	}
	var currDate=currY+'年'+currM+'月'+currD+"日";//显示的日期格式为2017年3月15日
	var currTime=currY+'-'+currM+'-'+currD;//查询的日期格式为yyyy-mm-dd
	$("#currentTime").text(currDate);
	$("#currentTimeHidden").text(currTime);
	var call = getMillisecond();
	var queryParams = function(params) {
		var temp = {};
		temp["limit"] = params.limit;
		temp["offset"] = params.offset;
		return temp;
	};
	baseAjaxJsonp(dev_planwork + 'workCon/findAll.asp?call='+call+'&SID=' + SID+'&cuttTime=' + currTime, queryParams,
			function(result) {
		   $("#attendanceCalendarTable").TaskMytable("load",result.rows);
		   //$("#attendanceCalendarTable").bootstrapTable("reload",result.rows);
	}, call);
	
});


//上传附件
function filUpLoad(){
	var file_id=Math.uuid();
	openFileUploadInfo("notice_file","NO1001",file_id,function(data){
		findFileInfo(file_id,function(data2){
			if(files==""){
				files+=data2.rows[0]["ID"];
			}else{
				files=files+","+data2.rows[0]["ID"];
			}
			$("#FileTableInfo").bootstrapTable("refresh",{url:"sfile/queryFileInID.asp?id="+files});
		});
	});
};


function zhanshi(){
	//当前日期
	//console.info($(this));
	var currDate=$(this).prev().text();
	$("#currentTime").text(currDate);
	var call = getMillisecond();
	baseAjaxJsonp(dev_planwork + 'workCon/findAll.asp?call='+call+'&SID=' + SID+'&currTime=' + currDate, queryParams,
			function(result) {
		   $("#personTaskDetailsTable").bootstrapTable("load",result.rows);
			}, call);
	
}

//下拉列表数据
function initPlanSelect(){
	//初始化任务类型数据
	initSelect($("#task_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_OUTTER_TASK_TYPE"});
	//初始化是否确认完成字典数据
	initSelect($("#execute_status"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_PLAN_RELEASE_STATUS"});
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
*bootstrap-modal同时打开多个modal页面内存益处处理
**/
$.fn.modal.Constructor.prototype.enforceFocus = function () {};

/**
*展开合上日历框
**/
$(function(){
	$("#attendanceCalendarSider-btn-editable").click(function(){
			$(".taskwork #attend_b").toggle();
			$(".taskwork .operating-condition").toggle();
			$("#attendanceCalendarSider-btn-editable").toggleClass("marginLeft0-calender-editable");
			if($("#attendanceCalendarSider-btn-editable").hasClass("marginLeft0-calender-editable")){
				$(".taskwork .cont-right").css("width","99%");
			}else{
				$(".taskwork .cont-right").css("width","63%");
			}
	});
})
