<%@ page language="java" contentType="text/html; charset=UTF-8"   pageEncoding="UTF-8"%>
<%@ taglib uri="/reportJsp/runqianReport4.tld" prefix="report" %>
<%@ page import="com.yusys.entity.SUser"%>
<%
//StringBuffer s=new StringBuffer();
//String url="http://"+s.append(request.getServerName()).append(":").append(request.getServerPort()).append(request.getContextPath()).toString();
        SUser user=(SUser)request.getSession().getAttribute("userinfo");
		String skin_type = user.getSkin_type();
%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<link rel="stylesheet" href="../bootstrap/css/bootstrap-z.css" />
<!-- <link rel="stylesheet" href="../bootstrap/css/matrix-style.css" /> -->
<link rel="stylesheet" href="../bootstrap/css/select2.css" />
<link rel="stylesheet" type="text/css" href="../css/style.css"/>
<link rel="stylesheet" type="text/css" href="../css/form.css"/>
<link rel="stylesheet" type="text/css" href="../css/zebra_dialog.css"/>
<link href="../ztree3.5.22/css/zTreeStyle/zTreeStyle.css" rel="stylesheet"> 
<link rel="stylesheet" type="text/css" href="../css/public.css"/>
<script type="text/javascript" src="../js/jquery/jquery-1.9.1/jquery.min.js"></script>
<script src="../bootstrap/js/select2.min.js"></script>
<script src="../js/artTemplate/template.js"></script>
<script src="../js/commons/commons.js"></script>
<script src="../js/commons/menu_commons-wh.js"></script>
<script type="text/javascript" src="../js/My97DatePicker/WdatePicker.js"></script>
<script src="../js/runqianReport_fy.js"></script>
<script src="../bootstrap/js/bootstrap.min.js"></script>
<link rel="stylesheet" type="text/css" href="../css/skin_<%=skin_type %>/skin.css" id="report-iframe"/>
 <style type="text/css">
 #taskDetailReportForm input{
 	height:26px;
 }
 .main_iframe {
    overflow-y: hidden;
}
 </style>
</head>
<body id="body">
<div id="test1" style="width:100%;height:1000px;">
	<form id ="taskDetailReportForm" action=""  class="form-inline">
	<div class="ecitic-inquire" id="ecitic-inquire">
		<div class="ecitic-table" id="ecitic-table">
			<table width="100%" border="0" cellspacing="0" cellpadding="0" class="table table-bordered table-bor-pad requirement-table">
				<tr>
					<td class="ecitic-right" style="width:10%">任务名称：</td>
					<td style="width:20%">
						<input type="text" name="T.task_name" id="task_name" class="requirement-ele-width"/>
					</td>
					<td class="ecitic-right"  style="width:10%">重要程度：</td>
					<td style="width:25%">
						<select  name="T.task_importance" id="task_importance" class="requirement-ele-width" style="width:100%;">
							<option value="">请选择</option>
							<option value="00">战略任务</option>
						 	<option value="01">重点任务</option>
							<option value="02">一般性任务</option>
							<option value="03">杂项</option>
							<option value="05">年度重点工作</option>
						</select>
						<!--  diccode="T_DIC_IMPORTANCE" -->
					</td>
					<td class="ecitic-right" >任务状态：</td>
					<td style="width:25%">
						<select id="task_state"  name="T.task_state" class="requirement-ele-width" style="width:100%;">
							<option value="">请选择</option>
							<option value="00">草拟</option>
						 	<option value="01">待接收</option>
							<option value="02">执行中</option>
							<option value="03">已拒绝</option>
							<option value="04">已完成</option>
							<option value="05">已取消</option>
						 	<option value="06">已委托</option>
							<option value="07">受理中</option>
							<option value="08">已评价</option>
							<option value="09">完成被打回</option>
						</select>
						<!-- diccode="T_DIC_STATE" -->
					</td>
					
				</tr>
		
				<tr>
					<td class="ecitic-right">任务类型：</td>
					<td style="width:25%">
						<select  id="task_type"  name="T.task_type" class="requirement-ele-width" style="width:100%;">
							<option value="">请选择</option>
							<option value="00">普通任务</option>
						 	<option value="01">周期任务</option>
							<option value="02">会议任务</option>
							<option value="03">协同任务</option>
						</select>
						<!-- diccode="T_DIC_TYPE" -->
					</td>
					<td class="ecitic-right"  style="width:15%">执行部门：</td>
					<td class="positionAb">
						<input type="text" name="T.execute_dept_name" id="execute_dept_name" class="requirement-ele-width"  placeholder="点击选择部门" readonly="readonly"/>
						<input type="hidden" name="T.execute_dept" id="execute_dept" >
					</td>
					<td class="ecitic-right" >受理时间：</td>
					<td>
						<div style="float:left; width:45%;">
							<input type="text"  name="T.plan_starttime" id="plan_starttime" data-format="yyyy-MM-dd" onClick="WdatePicker({});" class="requirement-ele-width" placeHolder=""/>
						</div>
						<div style="float:left;width:10%;line-height:26px;">&nbsp至&nbsp</div>
						<div style="float:left;width:45%;">
							<input type="text" name="T.plan_endtime" id="plan_endtime" data-format="yyyy-MM-dd" class="requirement-ele-width" onClick="WdatePicker({});" placeHolder=""/>
						</div>
					</td>
				</tr>
				
			</table>
		</div>
		<ul class="ecitic-btn-all">
			<li><button type="button" id="query" class="btn btn-ecitic">查询</button></li>
			<li><button type="button" id="reset" class="btn btn-ecitic">重置</button></li>
			<!-- <li class="ecitic-more"></li> -->
		</ul>
	</div>	
	</form>
	<div id="test">
			<script  language=javascript>
	             var report = new runqianReport( "100%", "100%" );
	             report.setBorder( "border:1px solid blue" );  //设置控件为兰色细边框
	            <%--  report.setServerURL('<%=url %>'); --%>
	            report.setServerURL(dev_report);
	   		</script>
	</div>
</div>
<%
	SUser suser = (SUser) request.getSession().getAttribute("userinfo");
	String org_code=suser.getOrg_no();
	/* if(suser.getUser_no().equals(suser.getOrg_manager())){
		org_code=suser.getOrg_no();
	} */
%>
<script type="text/javascript">

/**
 * enter事件记录集合
 */
var enterEvents= new Object();

/**
 * enter事件注册方法
 */
function enterEventRegister(eventId, event){
	enterEvents[eventId] = event;
}
/**
 * enter事件销毁方法
 */
function enterEventDestroy(eventId){
	delete enterEvents[eventId];
}
/**
 * enter事件执行方法
 */
$(document).keypress(function(e) {  
	// 回车键事件  
	if(e.which == 13) {  
		//先判断是否pop框
		var popDiv = $(".modal.hide.fade.in");
		var event;
		if(popDiv.length>0){
			//当前显示pop框数量为一个时
			if(popDiv.length==1){
				event = enterEvents["popModelQueryLevel1"];
			}
		} else {
			event =  enterEvents["demandTaskDetailReport"];
		}
		if(typeof(event)!=="undefined"){
			event();
		}
	} 
}); 


	$(document).ready(function(){
		initPlaceholder();
		$("#query").click(function(){
			report.init(); //初始化报表控件
			report.setFile("detail_report.raq");//设置要显示的报表文件   
			report.setSaveAsName("任务明细表");
			report.putParam("org_no","<%=org_code%>");
			report.putParam("user_id","<%=suser.getUser_no() %>");
			report.putParam("task_name",encodeURIComponent($.trim($("#task_name").val())));
			report.putParam("task_executor",$.trim($("#task_executor").val()));
			report.putParam("execute_dept",$.trim($("#execute_dept").val()));
			report.putParam("task_type",$.trim($("#task_type").val()));
			report.putParam("task_state",$.trim($("#task_state").val()));
			report.putParam("task_importance",$.trim($("#task_importance").val()));
			var plan_starttime = $.trim($("#plan_starttime").val());
			var plan_endtime = $.trim($("#plan_endtime").val());
			//时间格式兼容
			if(plan_starttime == null || plan_starttime ==""){
				plan_starttime="1970-01-01";
			}
			if(plan_endtime == null || plan_endtime ==""){
				plan_endtime="2099-01-01";
			}
			report.putParam("plan_starttime",plan_starttime);
			report.putParam("plan_endtime",plan_endtime);
			report.display(); //显示报表
		});
		//enter触发查询
		enterEventRegister("demandTaskDetailReport", function(){$("#query").click();});

		$("#reset").click(function() {
			$("input[name^='T.']").val("");
			$("select[name^='T.']").val("");
			$("#task_state").val(" ");
			$("#task_type").val(" ");
			$("#task_importance").val(" ");
/* 			$("#task_state").select2();
			$("#task_type").select2();
			$("#task_importance").select2(); */
			$("#task_state").val("").trigger("change");
			$("#task_type").val("").trigger("change");
			$("#task_importance").val("").trigger("change");
			initPlaceholder();
		});
	});
	var curDate=new Date();
	var curTime=curDate.getFullYear()+"-"+((curDate.getMonth()+1)<10?"0":"")+(curDate.getMonth()+1)+"-"+(curDate.getDate()<10?"0":"")+curDate.getDate();
	var t=getlastmonth(curDate);
	var startcurTime=t.getFullYear()+"-"+((t.getMonth()+1)<10?"0":"")+(t.getMonth()+1)+"-"+(t.getDate()<10?"0":"")+t.getDate();
	$("#plan_starttime").val(startcurTime);
	$("#plan_starttime").attr("placeHolder",startcurTime);
	$("#plan_endtime").val(curTime);
	$("#plan_endtime").attr("placeHolder",curTime);
	function getlastmonth(date){
		var lastmonth = new Date(date.getFullYear(),date.getMonth()+1,date.getDate(),date.getHours(),date.getMinutes(),date.getSeconds());
		var curdate = date.getDate();
		lastmonth.setDate(-1);//上一月，当前月为一月时这种写法会退到上一年十二月
		lastmonth.setDate(0);//上月最后一天
		var lastmax = lastmonth.getDate();
		if(curdate <= lastmax){//天值不大于上月最大一天，天值同步
		lastmonth.setDate(curdate);
		}
		return lastmonth;
		}
	//时间控件
	function initDate(){
		$("#plan_starttime").focus(function() {
			WdatePicker({
				dateFmt : 'yyyy-MM-dd',
				minDate : '1990-01-01',
				maxDate : '2050-12-01'
			});
			window.parent.calendarSkinAnalysisIframeCss();
		});
		$("#plan_endtime").focus(function() {
			WdatePicker({
				dateFmt : 'yyyy-MM-dd', 
				minDate : '1990-01-01',
				maxDate : '2050-12-01'
			});
			window.parent.calendarSkinAnalysisIframeCss();
		});
	}
	function initOrgTreeEvent(org_name,org_code){
		$("#"+org_name).click(function(){
			openSelectTreeDiv($(this),org_name+"ree_id","../SOrg/queryorgtreelist.asp",{width:'208px'},function(node){
				$("#"+org_name).val(node.name);
				$("#"+org_code).val(node.id);
			});
		});
		$("#"+org_name).focus(function(){
			$("#"+org_name).click();
		});
	}
	function initTaskReportPopEvent(){
		$("#task_executor_name").click(function(){
			window.parent.reportOpenUserPop({name:$("#task_executor_name"),no:$("#task_executor")});
		});
		initOrgTreeEvent("execute_dept_name","execute_dept");
		/* $("#execute_dept_name").click(function(){
			window.parent.reportOpenSOrgPop({name:$("#execute_dept_name"),no:$("#execute_dept")});
		}); */
	}
	function reportInitCallback(params){
		$(".header-h3").css(params);
	}
	initDate();
	initTaskReportPopEvent();
	//initDetailReportType();
</script>
<script src="../ztree3.5.22/js/jquery.ztree.core.min.js"></script>
<script src="../ztree3.5.22/js/jquery.ztree.excheck.min.js"></script>
<script src="../ztree3.5.22/js/jquery.ztree.exedit.min.js"></script>
</body>
</html>
