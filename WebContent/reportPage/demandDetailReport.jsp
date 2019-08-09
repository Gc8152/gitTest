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
<script type="text/javascript" src="../js/jquery/jquery-1.9.1/jquery.min.js"></script>
<script src="../bootstrap/js/select2.min.js"></script>
<script src="../js/artTemplate/template.js"></script>
<script src="../js/commons/commons.js"></script>
<script src="../js/commons/menu_commons-wh.js"></script>
<link rel="stylesheet" type="text/css" href="../css/public.css"/>
<script type="text/javascript" src="../js/My97DatePicker/WdatePicker.js"></script>
<script language=javascript src="../js/runqianReport_fy.js"></script>
<script src="../bootstrap/js/bootstrap.min.js"></script>
<link rel="stylesheet" type="text/css" href="../css/skin_<%=skin_type %>/skin.css" id="report-iframe"/>
 <style type="text/css">
 .popModal input{
 	width: 190px!important;
 }
 #demandDetailReportForm input{
 	height:26px;
 }
 </style>
</head>
<body id="body">
<div id="test1" style="width:100%;height:1000px;">
	<form id ="demandDetailReportForm" action=""  class="form-inline">
		<div class="ecitic-inquire" id="ecitic-inquire">
			<div class="ecitic-table" id="ecitic-table">
				<table width="100%" border="0" cellspacing="0" cellpadding="0" class="table table-bordered table-bor-pad requirement-table">
					<tr>
						<td class="ecitic-right" style="width:10%">需求编号：</td>
						<td style="width:20%">
						<input type="text" name="REQ.req_code" id="req_code" class="requirement-ele-width"/>
						</td>
						<td class="ecitic-right"  style="width:10%">需求名称：</td>
						<td style="width:20%">
						<input type="text" name="REQ.req_name" id="req_name" class="requirement-ele-width"/>
						</td >
						<td class="ecitic-right" style="width:10%">应用名称：</td>
						<td style="width:20%">
						<input type="text" name="REQ.system_name" id="system_name" class="requirement-ele-width"/>
						</td>					
					    </tr>			
					<tr>
						<td class="ecitic-right">需求分类：</td>
						<td style="width:25%">
						<select id="req_acc_classify"  name="REQ.req_acc_classify" class="requirement-ele-width" style="width:100%;">
						<option value="">请选择</option>
								<!-- <option value="00">紧急需求</option>
						 	<option value="01">改造类（任务）</option>
							<option value="02">改造类（项目）</option>
							<option value="03">新应用需求</option> -->
						</select>
						<!-- diccode="G_DIC_REQ_CLASSIFY" -->
						</td>
						<td class="ecitic-right"  style="width:15%">需求状态：</td>
						<td style="width:25%">
						<select id="req_state"  name="REQ.req_state" class="requirement-ele-width" multiple="multiple" style="width:100%;">
							<!-- <option value="">请选择</option>
							<option value="01">草拟</option>
						 	<option value="02">待分发</option>
							<option value="03">需求管理员：退回</option>
							<option value="04">产品经理：待受理</option>
							<option value="05">产品经理：退回</option>
						 	<option value="06">转交中</option>
							<option value="07">需求审批中</option>
							<option value="08">审批通过</option>
							<option value="09">审批不通过</option>
						 	<option value="10">业务需求分析</option>
							<option value="11">需求进行中</option>
							<option value="12">需求完成</option>
							<option value="13">需求关闭</option>
						 	<option value="14">需求无效</option> -->
						</select>
						<!-- diccode="G_DIC_REQUIREMENT_STATE" -->
						</td>
						<td class="ecitic-right" >需求提交时间：</td>
						<td >
						<div style="float:left; width:45%;">
						<input type="text"  name="REQ.summit_time_start" id="summit_time_start" data-format="yyyy-MM-dd" onClick="WdatePicker({});" class="requirement-ele-width" value="" placeHolder=""  readonly/>
						</div>
						<div style="float:left;width:10%;line-height:26px;">&nbsp;至&nbsp;</div>
						<div style="float:left;width:45%;">
						<input type="text" name="REQ.summit_time_end" id="summit_time_end" data-format="yyyy-MM-dd" class="requirement-ele-width" onClick="WdatePicker({});" value="" placeHolder="" readonly/>
						</div>
						</td>
					</tr>
					<tr>
						<td class="ecitic-right" >需求提出部门：</td>
						<td class="positionAb" style="width:25%">
							<input type="text" name="REQ.req_put_dept_name" id="req_put_dept_name"  class="requirement-ele-width"  placeholder="点击选择部门" readonly="readonly"/>
							<input type="hidden"   name="REQ.req_put_dept" id="req_put_dept" >
						</td>
						<td class="ecitic-right" style="width:10%">需求提出人：</td>
						<td style="width:20%">
							<input type="text" name="req_businesser" id="req_businesser" class="requirement-ele-width"/>
						</td>
						<td class="ecitic-right" >负责组：</td>
						<td style="width:25%">
							<select id="req_product_leaderid" class="requirement-ele-width" style="width:100%;"></select>
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

/**
 * 追加下拉数据
 * @param obj
 * @param show
 * @param param
 * @param default_v
 * @param arr "01,02" 过滤不需要的值
 */
function appendSelect(obj,show,param,default_v,arr){
	baseAjax("../SDic/findItemByDic.asp",param,function(data){
		if(data!=undefined){
			selectAppendByData(obj,show,data,default_v,arr);
		}
	});
}
function getReq_state(){
	var all = "";
	$("#req_state option:selected").each(function() {
		var text= $(this).attr("value");
		text = text.replace(/(^\s*)|(\s*$)/g, "");
		if(text !== '' && typeof(text) !== undefined && text !== null){
			if(all == ""){
				all = "'"+text+"'";
			}else{
				all += ",'"+text+"'";
			};
		};
	});
	if(all.length>0){
		return "req_state in("+all+")";
	}
	return "1=1";
}
function initResGroup(){
	//项目组长加载
	parent.baseAjaxJsonpNoCall(parent.dev_construction+"requirement_accept/queryUserByRoleNo.asp?role_no=0082&limit=10&offset=0", {}, function(data){
		var elem=$("#req_product_leaderid");
		elem.append('<option value=" ">请选择</option>');	
		if(data&&data.rows&&data.rows.length>0){
			for(var i=0;i<data.rows.length;i++){
				var value=data.rows[i]["ORG_CODE"];
				var name=data.rows[i]["ORG_NAME"];//+":"+data.rows[i]["USER_NAME"];
				elem.append('<option value="'+value+'">'+name+'</option>');	
			}
		}
		elem.val(" ");
		elem.select2();
	});
}
	$(document).ready(function(){
		initPlaceholder();
		appendSelect($("#req_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQUIREMENT_STATE"});
		appendSelect($("#req_acc_classify"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQ_CLASSIFY"});
		initResGroup();
		$("#query").click(function(){
			report.init(); //初始化报表控件
			report.setFile("demand_detail.raq");//设置要显示的报表文件   
			report.setSaveAsName("需求明细表");
			report.putParam("org_no","<%=org_code%>");
			report.putParam("user_id","<%=suser.getUser_no() %>");
			report.putParam("req_name",encodeURIComponent($.trim($("#req_name").val())));
			report.putParam("req_code",encodeURIComponent($.trim($("#req_code").val())));
			report.putParam("system_name",encodeURIComponent($.trim($("#system_name").val())));
			report.putParam("res_group_id",$.trim($("#req_product_leaderid").val()));
			/* report.putParam("req_state",$.trim($("#req_state").val())); */
			report.putParam("req_state",$.trim(getReq_state())); 
			report.putParam("req_acc_classify",$.trim($("#req_acc_classify").val()));
			report.putParam("req_put_dept",$.trim($("#req_put_dept").val()));
			 report.putParam("req_businesser",encodeURIComponent($.trim($("#req_businesser").val()))); 
			
			var start_date = $.trim($("#summit_time_start").val());
			var end_date = $.trim($("#summit_time_end").val());
			//时间格式兼容
			if(start_date == null || start_date ==""){
				start_date="1970-01-01";
			}
			if(end_date == null || end_date ==""){
				end_date="2099-01-01";
			}
			report.putParam("start_date",start_date);
			report.putParam("end_date",end_date);
			report.display(); //显示报表
		});
		//enter触发查询
		enterEventRegister("demandTaskDetailReport", function(){$("#query").click();});

		$("#reset").click(function() {
			$("input[name^='REQ.']").val("");
			$("select[name^='REQ.']").val("");
			$("#req_state").val(" ");
			$("#req_acc_classify").val(" ");
/* 			$("#req_state").select2();
			$("#req_acc_classify").select2(); */
			$("#req_acc_classify").val("").trigger("change");
			$("#req_state").val("").trigger("change");
			$("#req_product_leaderid").val(" ").select2();
			initPlaceholder();
		});
	});
	var curDate=new Date();
    var curTime=curDate.getFullYear()+"-"+((curDate.getMonth()+1)<10?"0":"")+(curDate.getMonth()+1)+"-"+(curDate.getDate()<10?"0":"")+curDate.getDate();
    var t=getlastmonth(curDate);
    var startcurTime=t.getFullYear()+"-"+((t.getMonth()+1)<10?"0":"")+(t.getMonth()+1)+"-"+(t.getDate()<10?"0":"")+t.getDate();
    $("#summit_time_start").val(startcurTime);
    $("#summit_time_start").attr("placeHolder",startcurTime);
    $("#summit_time_end").val(curTime);
    $("#summit_time_end").attr("placeHolder",curTime);
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
		$("#summit_time_start").focus(function() {
			WdatePicker({
				dateFmt : 'yyyy-MM-dd',
				minDate : '1990-01-01',
				maxDate : '2050-12-01'
			});
			window.parent.calendarSkinAnalysisIframeCss();
		});
		$("#summit_time_end").focus(function() {
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
	function initPopEvent(){
		/* $("#task_executor_name").click(function(){
			window.parent.reportOpenUserPop({name:$("#task_executor_name"),no:$("#task_executor")});
		}); */
		initOrgTreeEvent("req_put_dept_name","req_put_dept");
	}
	//下拉框方法
	/* function initDetailReportType(){
		autoInitSelect($("#demandDetailReportForm"),"../");
	} */
	function reportInitCallback(params){
		$(".header-h3").css(params);
	}
	initDate();
	initPopEvent();
//	initDetailReportType();
</script>
<script src="../ztree3.5.22/js/jquery.ztree.core.min.js"></script>
<script src="../ztree3.5.22/js/jquery.ztree.excheck.min.js"></script>
<script src="../ztree3.5.22/js/jquery.ztree.exedit.min.js"></script>
</body>
</html>
