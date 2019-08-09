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
 #projectDetailReportForm input{
 	height:26px;
 }
 </style>
</head>
<body id="body">
<div id="test1" style="width:100%;height:1000px;">
	<form id ="projectDetailReportForm" action=""  class="form-inline">
		<div class="ecitic-inquire" id="ecitic-inquire">
			<div class="ecitic-table" id="ecitic-table">
				<table width="100%" border="0" cellspacing="0" cellpadding="0" class="table table-bordered table-bor-pad requirement-table">
					<tr>
						<!-- <td class="ecitic-right" style="width:10%">项目编号：</td>
						<td style="width:20%">
							<input type="text" name="PRJ.project_num" id="project_num" class="requirement-ele-width"/>
						</td> -->
						<td class="ecitic-right"  style="width:10%">项目名称：</td>
						<td style="width:20%">
							<input type="text" name="PRJ.project_name" id="project_name" class="requirement-ele-width"/>
						</td>
						<td class="ecitic-right" style="width:10%">项目类型：</td>
						<td style="width:25%">
							<select id="project_type"  name="PRJ.project_type" class="requirement-ele-width" style="width:100%;">
								<option value="">请选择</option>
						 		<option value="C_ANNUAL_TASK_PROJECT">年度任务项目</option>
								<option value="C_INFO_DISCUSS_PROJECT">信息研究项目</option>
								<option value="SYS_DIC_NEW_PROJECT">新建应用项目</option>
								<option value="SYS_DIC_NEW_VERSION_PROJECT">现有应用改造项目</option>
								<option value="SYS_DIC_REQUIREMENT_ANALYSIS_PROJECT">需求分析类项目</option>
						 		<option value="SYS_DIC_URGENT_PROJECT">紧急类项目</option>
								<option value="SYS_DIC_VERSION_PROJECT">版本项目</option>
							</select>
							<!-- diccode="SYS_DIC_MILESTONE_PROJECT_TYPE"  -->
						</td>
						
						<td class="ecitic-right" style="width:10%">项目状态：</td>
						<td style="width:25%">
							<select id="status"  name="PRJ.status" class="requirement-ele-width" style="width:100%;">
								<option value="">请选择</option>
						 		<option value="01">执行中</option>
								<option value="02">已结项</option>
								<option value="03">创建中</option>
								<option value="04">已创建</option>
								<option value="05">立项中</option>
						 		<option value="06">立项审批通过</option>
								<option value="07">结项审批中</option>
								<option value="08">已关闭</option>
								<option value="09">暂停</option>
							</select>
							<!-- diccode="P_DIC_PROJECT_STATUS" -->
						</td>
						</tr>
			
						<tr>
						<td class="ecitic-right" >项目经理：</td>
						<td class="positionAb">
							<input type="text" name="PRJ.p_owner_name" id="p_owner_name" class="requirement-ele-width" />
							<!-- <input type="hidden" name="PRJ.p_owner" id="p_owner" > -->
						</td>
						<td class="ecitic-right" >创建时间：</td>
						<td>
							<div style="float:left; width:45%;">
								<input type="text"  name="PRJ.starttime" id="starttime" data-format="yyyy-MM-dd" onClick="WdatePicker({});" placeHolder="" class="requirement-ele-width" />
							</div>
							<div style="float:left;width:10%;line-height:26px;">&nbsp至&nbsp</div>
							<div style="float:left;width:45%;">
								<input type="text" name="PRJ.endtime" id="endtime" data-format="yyyy-MM-dd" class="requirement-ele-width" onClick="WdatePicker({});" placeHolder="" />
							</div>
						</td>
						<td></td><td></td>
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
			report.setFile("project_detail.raq");//设置要显示的报表文件   
			report.setSaveAsName("项目明细表");
			report.putParam("org_no","<%=org_code%>");
			report.putParam("user_id","<%=suser.getUser_no() %>");
			report.putParam("project_name",encodeURIComponent($.trim($("#project_name").val())));
			report.putParam("project_num",$.trim($("#project_num").val()));
			report.putParam("project_type",$.trim($("#project_type").val()));
			report.putParam("project_man_name",encodeURIComponent($.trim($("#p_owner_name").val())));
			report.putParam("status",$.trim($("#status").val()));
			var starttime = $.trim($("#starttime").val());
			var endtime = $.trim($("#endtime").val());
			//时间格式兼容
			if(starttime == null || starttime ==""){
				starttime="1970-01-01";
			}
			if(endtime == null || endtime ==""){
				endtime="2099-01-01";
			}
			report.putParam("start_date",starttime);
			report.putParam("end_date",endtime);
			report.display(); //显示报表
		});
		//enter触发查询
		enterEventRegister("demandTaskDetailReport", function(){$("#query").click();});
		
		$("#reset").click(function() {
			$("input[name^='PRJ.']").val("");
			$("select[name^='PRJ.']").val("");
			$("#project_type").val(" ");
			//$("#project_type").select2();
			$("#project_type").val("").trigger("change");
			$("#status").val("").trigger("change");
			initPlaceholder();
		});
	});
	var curDate=new Date();
	var curTime=curDate.getFullYear()+"-"+((curDate.getMonth()+1)<10?"0":"")+(curDate.getMonth()+1)+"-"+(curDate.getDate()<10?"0":"")+curDate.getDate();
	var t=getlastmonth(curDate);
	var startcurTime=t.getFullYear()+"-"+((t.getMonth()+1)<10?"0":"")+(t.getMonth()+1)+"-"+(t.getDate()<10?"0":"")+t.getDate();
	$("#starttime").val(startcurTime);
	$("#starttime").attr("placeHolder",startcurTime);
	$("#endtime").val(curTime);
	$("#endtime").attr("placeHolder",curTime);
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
		$("#starttime").focus(function() {
			WdatePicker({
				dateFmt : 'yyyy-MM-dd',
				minDate : '1990-01-01',
				maxDate : '2050-12-01'
			});
			window.parent.calendarSkinAnalysisIframeCss();
		});
		$("#endtime").focus(function() {
			WdatePicker({
				dateFmt : 'yyyy-MM-dd', 
				minDate : '1990-01-01',
				maxDate : '2050-12-01'
			});
			window.parent.calendarSkinAnalysisIframeCss();
		});
	}
	/* function initOrgTreeEvent(org_name,org_code){
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
	} */
	//下拉框方法
/* 	function initProjectDetailReportType(){
		autoInitSelect($("#projectDetailReportForm"),"../");
	} */
	function reportInitCallback(params){
		$(".header-h3").css(params);
	}
	initDate();
	//initTaskReportPopEvent();
	//initProjectDetailReportType();
</script>
<script src="../ztree3.5.22/js/jquery.ztree.core.min.js"></script>
<script src="../ztree3.5.22/js/jquery.ztree.excheck.min.js"></script>
<script src="../ztree3.5.22/js/jquery.ztree.exedit.min.js"></script>
</body>
</html>
